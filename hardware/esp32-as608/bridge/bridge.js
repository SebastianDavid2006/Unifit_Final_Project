const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')
const axios = require('axios')

const PUERTO_SERIAL_FORZADO = process.env.PUERTO_SERIAL || ''
const BAUD_RATE = parseInt(process.env.BAUD_RATE || '115200', 10)
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000/api'
const API_KEY = process.env.BIOMETRIA_API_KEY || ''
const INTERVALO_POLL_MS = parseInt(process.env.INTERVALO_POLL_MS || '5000', 10)
const TIMEOUT_DETECCION_MS = parseInt(process.env.TIMEOUT_DETECCION_MS || '4000', 10)

let backoffMs = INTERVALO_POLL_MS

// Vendor IDs de chips USB-serial usados por placas ESP32
const VENDOR_IDS_ESP32 = new Set(['1a86', '10c4', '303a', '1a6e', '0403'])
const PALABRAS_CLAVE_ESP32 = ['ch340', 'cp210', 'espres', 'silicon labs', 'wch']

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
  },
  timeout: 10000,
})

let puerto = null
let parser = null
let esp32Listo = false
let enrolamientoActivo = null
let detectando = false

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`)
}

function esCandidatoEsp32(puertoInfo) {
  const vendorId = (puertoInfo.vendorId || '').toLowerCase()
  if (VENDOR_IDS_ESP32.has(vendorId)) return true

  const descripcion = `${puertoInfo.friendlyName || ''} ${puertoInfo.manufacturer || ''}`.toLowerCase()
  return PALABRAS_CLAVE_ESP32.some((kw) => descripcion.includes(kw))
}

function probarPuerto(pathPort, timeoutMs) {
  return new Promise((resolve) => {
    let resolved = false
    let temporizador = null
    let puertoPrueba = null

    const terminar = (resultado) => {
      if (resolved) return
      resolved = true
      if (temporizador) clearTimeout(temporizador)
      try { puertoPrueba && puertoPrueba.close() } catch {}
      log(`  [${pathPort}] ${resultado.ok ? '✓ ESP32 CONFIRMADO' : `✗ no responde como ESP32 (${resultado.razon})`}`)
      resolve(resultado)
    }

    try {
      puertoPrueba = new SerialPort({ path: pathPort, baudRate: BAUD_RATE })
      const parserPrueba = puertoPrueba.pipe(new ReadlineParser({ delimiter: '\n' }))

      temporizador = setTimeout(() => terminar({ ok: false, razon: 'timeout' }), timeoutMs)

      parserPrueba.on('data', (linea) => {
        const lineaLimpia = linea.trim()
        try {
          const datos = JSON.parse(lineaLimpia)
          if (datos.tipo === 'ready') {
            terminar({ ok: true, razón: 'mensaje ready recibido' })
          }
        } catch {}
      })

      puertoPrueba.on('error', (err) => terminar({ ok: false, razon: err.message }))
      puertoPrueba.on('open', () => {
        // Reset por DTR para que el ESP32 reinicie y emita el mensaje "ready"
        try {
          puertoPrueba.set({ dtr: false }, () => {
            setTimeout(() => {
              try { puertoPrueba.set({ dtr: true }) } catch {}
            }, 200)
          })
        } catch {}
      })
    } catch (err) {
      terminar({ ok: false, razon: err.message })
    }
  })
}

async function detectarPuertoEsp32() {
  if (PUERTO_SERIAL_FORZADO) {
    log(`Puerto forzado por variable PUERTO_SERIAL: ${PUERTO_SERIAL_FORZADO}`)
    return PUERTO_SERIAL_FORZADO
  }

  log('Detectando puerto del ESP32 automáticamente...')
  let puertos
  try {
    puertos = await SerialPort.list()
  } catch (err) {
    log(`No se pudo listar puertos seriales: ${err.message}`)
    return null
  }

  if (puertos.length === 0) {
    log('No se encontraron puertos seriales. ¿Está conectado el ESP32 por USB?')
    return null
  }

  log(`Puertos encontrados: ${puertos.map((p) => p.path).join(', ')}`)

  const candidatos = puertos.filter(esCandidatoEsp32)

  if (candidatos.length === 0) {
    log('No se detectó ningún puerto que parezca un ESP32 (CH340/CP210x/Espressif).')
    return null
  }

  const rutas = candidatos.map((p) => p.path)
  log(`Candidatos ESP32: ${rutas.join(', ')}`)

  if (candidatos.length === 1) {
    const unico = candidatos[0]
    log(`Un solo candidato (${unico.path} - ${unico.friendlyName || unico.manufacturer || ''}). Verificando...`)
    const resultado = await probarPuerto(unico.path, TIMEOUT_DETECCION_MS)
    if (resultado.ok) return unico.path
    log('El único candidato no confirmó. ¿El sketch está cargado en el ESP32?')
    return null
  }

  // Múltiples candidatos: verificar activamente cada uno
  detectando = true
  for (const candidato of candidatos) {
    const ruta = candidato.path
    log(`Verificando ${ruta}...`)
    const resultado = await probarPuerto(ruta, TIMEOUT_DETECCION_MS)
    if (resultado.ok) {
      detectando = false
      return ruta
    }
  }
  detectando = false
  log('Ningún candidato confirmó ser el ESP32.')
  return null
}

function conectarSerial(pathPort) {
  puerto = new SerialPort({ path: pathPort, baudRate: BAUD_RATE })
  parser = puerto.pipe(new ReadlineParser({ delimiter: '\n' }))

  puerto.on('open', () => {
    log(`Puerto serial ${pathPort} abierto`)
    // Reset agresivo: DTR false -> wait -> DTR true -> wait para boot limpio
    try {
      puerto.set({ dtr: false }, () => {
        setTimeout(() => {
          try { puerto.set({ dtr: true }) } catch {}
          // Esperar a que el ESP32 bootee y envíe 'ready'
          setTimeout(() => {
            // Limpiar buffer por si llegó basura al abrir
            parser.emit('data', '') // Forzar flush
          }, 1000)
        }, 300)
      })
    } catch {}
  })

  puerto.on('error', (err) => {
    log(`Error serial: ${err.message}`)
    reintentarConexion()
  })

  puerto.on('close', () => {
    log('Puerto serial cerrado. Reintentando...')
    esp32Listo = false
    reintentarConexion()
  })

  parser.on('data', (linea) => {
    linea = linea.trim()
    if (!linea) return
    // Solo procesar líneas que parezcan JSON (empiecen con {)
    if (!linea.startsWith('{')) {
      return // Ignorar basura silenciosamente
    }

    try {
      const datos = JSON.parse(linea)
      // Validar que tenga la estructura esperada
      if (datos.tipo) {
        procesarMensajeESP32(datos)
      }
    } catch {
      // Silencioso: ignorar JSON malformado
    }
  })
}

let reintentos = 0
function reintentarConexion() {
  setTimeout(async () => {
    const ruta = await detectarPuertoEsp32()
    if (ruta) {
      reintentos = 0
      conectarSerial(ruta)
    } else {
      reintentos++
      log(`Esperando ESP32... (intento ${reintentos})`)
      setTimeout(reintentarConexion, 5000)
    }
  }, 5000)
}

function procesarMensajeESP32(datos) {
  switch (datos.tipo) {
    case 'ready':
      esp32Listo = true
      log(`ESP32 listo: ${datos.mensaje}`)
      break

    case 'info':
      log(`Templates en sensor: ${datos.templates}`)
      break

    case 'enroll_result':
      if (datos.ok) {
        log(`Huella guardada en slot ${datos.slot}`)
        completarEnrolamiento(datos.slot)
      } else {
        log(`Error enrolamiento: ${datos.error}`)
        registrarFalloEnrolamiento(datos.error)
      }
      break

    case 'verify_result':
      if (datos.ok) {
        log(`Huella verificada - slot ${datos.slot}`)
      } else {
        log(`Verificación: ${datos.error}`)
      }
      break

    case 'enroll_step':
      log(`Enrolamiento paso ${datos.paso}: ${datos.mensaje}`)
      if (enrolamientoActivo) {
        api.patch('/biometria/paso', {
          id_usuario: enrolamientoActivo.id_usuario,
          paso: datos.paso,
        }).catch(err => log(`Error actualizando paso: ${err.message}`))
      }
      break

    default:
      log(`Mensaje desconocido: ${JSON.stringify(datos)}`)
  }
}

async function verificarPendientes() {
  if (!esp32Listo || enrolamientoActivo || detectando) return

  try {
    const res = await api.get('/biometria/pendientes')
    const pendientes = res.data

    if (pendientes.length > 0) {
      const siguiente = pendientes[0]
      enrolamientoActivo = {
        id_usuario: siguiente.id_usuario,
        indice_sensor: siguiente.indice_sensor,
      }
      log(`Iniciando enrolamiento para ${siguiente.id_usuario} en slot ${siguiente.indice_sensor}`)

      puerto.write(`ENROLL:${siguiente.indice_sensor}\n`)
    }
    // Reset backoff si éxito
    backoffMs = INTERVALO_POLL_MS
  } catch (err) {
    if (err.response && err.response.status === 429) {
      // Backoff exponencial: 5s -> 10s -> 20s -> max 60s
      backoffMs = Math.min(backoffMs * 2, 60000)
      log(`Rate limit 429. Backoff a ${backoffMs}ms`)
    } else if (err.response) {
      log(`Error backend GET pendientes: ${err.response.status} - ${err.response.data?.mensaje || ''}`)
    } else {
      log(`Error backend GET pendientes: ${err.message}`)
    }
  }
}

function registrarFalloEnrolamiento(error) {
  if (!enrolamientoActivo) return
  log(`Enrolamiento falló para ${enrolamientoActivo.id_usuario}: ${error}`)
  enrolamientoActivo = null
}

async function completarEnrolamiento(slot) {
  if (!enrolamientoActivo) return

  const { id_usuario, indice_sensor } = enrolamientoActivo

  if (slot !== indice_sensor) {
    log(`Slot recibido ${slot} no coincide con esperado ${indice_sensor}. Descartando.`)
    enrolamientoActivo = null
    return
  }

  try {
    await api.post('/biometria/registrar', {
      id_usuario,
      indice_sensor,
    })
    log(`Huella registrada en backend para usuario ${id_usuario}`)
  } catch (err) {
    if (err.response) {
      log(`Error backend POST registrar: ${err.response.status} - ${err.response.data?.mensaje || ''}`)
    } else {
      log(`Error backend POST registrar: ${err.message}`)
    }
  }

  enrolamientoActivo = null
}

log('=== Bridge Biométrico UNIFIT ===')
log(`Backend: ${BACKEND_URL}`)
log(`Baud Rate: ${BAUD_RATE}`)
log(`API Key: ${API_KEY ? '***configurada***' : 'NO CONFIGURADA'} (usa la misma del backend)`)

;(async () => {
  const ruta = await detectarPuertoEsp32()
  if (ruta) {
    conectarSerial(ruta)

    // Esperar a que el ESP32 esté listo antes de arrancar el polling
    while (!esp32Listo) {
      await new Promise(r => setTimeout(r, 500))
    }

    log('ESP32 listo. Iniciando polling de enrolamientos pendientes...')
    function pollLoop() {
      if (!detectando && esp32Listo && !enrolamientoActivo) {
        verificarPendientes()
      }
      setTimeout(pollLoop, backoffMs)
    }
    pollLoop()
  } else {
    log('No se pudo detectar el ESP32. Reintentando en 5s...')
    setTimeout(reintentarConexion, 5000)
  }
})()
