import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import * as fs from 'fs'
import * as path from 'path'
import app from '../src/app'
import { prisma } from '../src/utils/prisma'

function token(key: string): string {
  return (globalThis as any)[key]
}

const adminAuth = () => `Bearer ${token('adminToken')}`
const entrenadorAuth = () => `Bearer ${token('entrenadorToken')}`
const usuarioAuth = () => `Bearer ${token('usuarioToken')}`

const PNG_1X1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
)
const VIDEO_FAKE = Buffer.from('fake-mp4-bytes-para-tests')
const LIMITE_10MB = 10 * 1024 * 1024

const MULTIMEDIA_DIR = path.join(process.cwd(), 'uploads', 'multimedia')
const TEMP_DIR = path.join(process.cwd(), 'uploads', 'temp')

function listarMultimedia(): Set<string> {
  try { return new Set(fs.readdirSync(MULTIMEDIA_DIR)) } catch { return new Set() }
}

function listarTemp(): Set<string> {
  try { return new Set(fs.readdirSync(TEMP_DIR)) } catch { return new Set() }
}

async function archivoEnUso(filename: string): Promise<boolean> {
  const [ej, mq] = await Promise.all([
    prisma.ejercicio.count({ where: { url_multimedia: { contains: filename } } }),
    prisma.maquina.count({ where: { url_multimedia: { contains: filename } } }),
  ])
  return ej + mq > 0
}

let idsPreviosEjercicios = new Set<string>()
let idsPreviosMaquinas = new Set<string>()
let archivosPreviosMultimedia: Set<string>
let adminId: string
let maquinaId: string
let maquinaUrlOriginal: string
let maquinaParaDesactivarId: string
let ejercicioAuxiliarId: string

async function tomarIdsPrevios(): Promise<void> {
  const [ej, mq] = await Promise.all([
    prisma.ejercicio.findMany({ select: { id_ejercicio: true } }),
    prisma.maquina.findMany({ select: { id_maquina: true } }),
  ])
  idsPreviosEjercicios = new Set(ej.map((f) => f.id_ejercicio))
  idsPreviosMaquinas = new Set(mq.map((f) => f.id_maquina))
}

async function borrarSoloCreadosEnCorrida(): Promise<void> {
  const maquinas = await prisma.maquina.findMany({ select: { id_maquina: true } })
  const maquinasNuevas = maquinas.filter((m) => !idsPreviosMaquinas.has(m.id_maquina)).map((m) => m.id_maquina)

  if (maquinasNuevas.length) {
    await prisma.maquinaEjercicio.deleteMany({ where: { id_maquina: { in: maquinasNuevas } } })
    await prisma.maquina.deleteMany({ where: { id_maquina: { in: maquinasNuevas } } })
  }

  const ejercicios = await prisma.ejercicio.findMany({ select: { id_ejercicio: true } })
  const nuevos = ejercicios.filter((e) => !idsPreviosEjercicios.has(e.id_ejercicio)).map((e) => e.id_ejercicio)
  if (nuevos.length) {
    // Los ejercicios referenciados por máquinas de otro archivo se limpian allá.
    const refs = await prisma.maquinaEjercicio.findMany({
      where: { id_ejercicio: { in: nuevos } },
      select: { id_ejercicio: true },
    })
    const referenciados = new Set(refs.map((r) => r.id_ejercicio))
    const aBorrar = nuevos.filter((id) => !referenciados.has(id))
    if (aBorrar.length) await prisma.ejercicio.deleteMany({ where: { id_ejercicio: { in: aBorrar } } })
  }
}

async function borrarMultimediaNueva(): Promise<void> {
  const actuales = listarMultimedia()
  for (const archivo of actuales) {
    if (archivosPreviosMultimedia.has(archivo)) continue
    if (await archivoEnUso(archivo)) continue
    try { fs.unlinkSync(path.join(MULTIMEDIA_DIR, archivo)) } catch { /* noop */ }
  }
}

beforeAll(async () => {
  await tomarIdsPrevios()
  archivosPreviosMultimedia = listarMultimedia()

  const admin = await prisma.usuario.findUnique({ where: { email_contacto: 'admin@unifit.edu.co' } })
  adminId = admin!.id_usuario

  // Ejercicio auxiliar para poder probar la relación máquina-ejercicio.
  const auxiliar = await prisma.ejercicio.create({
    data: {
      id_creador: adminId,
      nombre: 'Ejercicio Auxiliar para Maquinas',
      grupos_musculares: ['piernas'],
      nivel: 'principiante',
      url_multimedia: '/uploads/multimedia/auxiliar-test.png',
    },
  })
  ejercicioAuxiliarId = auxiliar.id_ejercicio
})

afterAll(async () => {
  await borrarSoloCreadosEnCorrida()
  await borrarMultimediaNueva()
  await prisma.$disconnect()
})

describe('Protección y listado de máquinas', () => {
  it('GET /api/maquinas sin token → 401', async () => {
    const res = await request(app).get('/api/maquinas')
    expect(res.status).toBe(401)
  })

  it('GET /api/maquinas con rol usuario → 403', async () => {
    const res = await request(app).get('/api/maquinas').set('Authorization', usuarioAuth())
    expect(res.status).toBe(403)
  })

  it('GET /api/maquinas con entrenador → 200 y array', async () => {
    const res = await request(app).get('/api/maquinas').set('Authorization', entrenadorAuth())
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('GET /api/maquinas/:id inexistente → 404', async () => {
    const res = await request(app)
      .get('/api/maquinas/00000000-0000-0000-0000-000000000000')
      .set('Authorization', adminAuth())
    expect(res.status).toBe(404)
  })
})

describe('Creación de máquinas', () => {
  it('POST con imagen admin → 201 y archivo en disco', async () => {
    const res = await request(app)
      .post('/api/maquinas')
      .set('Authorization', adminAuth())
      .field('nombre', 'Prensa de Piernas Test')
      .field('grupos_musculares', JSON.stringify(['piernas']))
      .attach('media', PNG_1X1, { filename: 'maquina.png', contentType: 'image/png' })

    expect(res.status).toBe(201)
    expect(res.body.id_maquina).toBeTruthy()

    maquinaId = res.body.id_maquina
    maquinaUrlOriginal = res.body.url_multimedia
    expect(fs.existsSync(path.join(MULTIMEDIA_DIR, path.basename(maquinaUrlOriginal)))).toBe(true)
  })

  it('POST con imagen y ejercicioIds válidos → 201 y crea la relación', async () => {
    const res = await request(app)
      .post('/api/maquinas')
      .set('Authorization', adminAuth())
      .field('nombre', 'Maquina con Ejercicios')
      .field('grupos_musculares', JSON.stringify(['piernas']))
      .field('ejercicioIds', JSON.stringify([ejercicioAuxiliarId]))
      .attach('media', PNG_1X1, { filename: 'maquina.png', contentType: 'image/png' })

    expect(res.status).toBe(201)

    const relacion = await prisma.maquinaEjercicio.count({ where: { id_maquina: res.body.id_maquina } })
    expect(relacion).toBe(1)

    const detalle = await request(app)
      .get(`/api/maquinas/${res.body.id_maquina}`)
      .set('Authorization', adminAuth())
    expect(detalle.body.ejercicios).toHaveLength(1)
  })

  it('POST con video → 400 (solo imágenes para máquinas)', async () => {
    const res = await request(app)
      .post('/api/maquinas')
      .set('Authorization', adminAuth())
      .field('nombre', 'Maquina con Video')
      .field('grupos_musculares', JSON.stringify(['piernas']))
      .attach('media', VIDEO_FAKE, { filename: 'clip.mp4', contentType: 'video/mp4' })

    expect(res.status).toBe(400)
    expect(res.body.mensaje).toBe('Solo se permiten imágenes para máquinas')
  })

  it('POST sin archivo → 400', async () => {
    const res = await request(app)
      .post('/api/maquinas')
      .set('Authorization', adminAuth())
      .field('nombre', 'Maquina Sin Imagen')
      .field('grupos_musculares', JSON.stringify(['piernas']))

    expect(res.status).toBe(400)
    expect(res.body.mensaje).toBe('La imagen es obligatoria')
  })

  it('POST con nombre de solo espacios → 400 y no deja archivos', async () => {
    const previos = listarMultimedia()
    const previosTemp = listarTemp()
    const res = await request(app)
      .post('/api/maquinas')
      .set('Authorization', adminAuth())
      .field('nombre', '   ')
      .field('grupos_musculares', JSON.stringify(['piernas']))
      .attach('media', PNG_1X1, { filename: 'maquina.png', contentType: 'image/png' })

    expect(res.status).toBe(400)
    expect(res.body.mensaje).toBe('El nombre es obligatorio')
    expect(listarMultimedia()).toEqual(previos)
    expect(listarTemp()).toEqual(previosTemp)
  })

  it('POST con grupos musculares vacíos → 400', async () => {
    const res = await request(app)
      .post('/api/maquinas')
      .set('Authorization', adminAuth())
      .field('nombre', 'Maquina Sin Grupos')
      .field('grupos_musculares', JSON.stringify([]))
      .attach('media', PNG_1X1, { filename: 'maquina.png', contentType: 'image/png' })

    expect(res.status).toBe(400)
  })

it('POST con ejercicioIds inexistente → 400 (referencia inválida) y no deja archivos', async () => {
    const previos = listarMultimedia()
    const previosTemp = listarTemp()
    const res = await request(app)
      .post('/api/maquinas')
      .set('Authorization', adminAuth())
      .field('nombre', 'Maquina Ejercicio Inexistente')
      .field('grupos_musculares', JSON.stringify(['piernas']))
      .field('ejercicioIds', JSON.stringify(['00000000-0000-0000-0000-000000000000']))
      .attach('media', PNG_1X1, { filename: 'maquina.png', contentType: 'image/png' })

    expect(res.status).toBe(400)
    expect(res.body.mensaje).toBe('Referencia inexistente: verifica los datos enviados')
    expect(listarMultimedia()).toEqual(previos)
    expect(listarTemp()).toEqual(previosTemp)
  })

  it('POST con archivo >10MB → 413 con mensaje', async () => {
    const res = await request(app)
      .post('/api/maquinas')
      .set('Authorization', adminAuth())
      .field('nombre', 'Maquina Imagen Gigante')
      .field('grupos_musculares', JSON.stringify(['piernas']))
      .attach('media', Buffer.alloc(LIMITE_10MB + 1, 1), { filename: 'grande.png', contentType: 'image/png' })

    expect(res.status).toBe(413)
    expect(res.body.mensaje).toBe('El archivo supera el tamaño máximo de 10 MB')
  })

  it('POST con rol usuario → 403', async () => {
    const res = await request(app)
      .post('/api/maquinas')
      .set('Authorization', usuarioAuth())
      .attach('media', PNG_1X1, { filename: 'maquina.png', contentType: 'image/png' })

    expect(res.status).toBe(403)
  })
})

describe('Edición de máquinas', () => {
  it('PUT solo texto (sin archivo) → 200 y refleja cambios', async () => {
    const res = await request(app)
      .put(`/api/maquinas/${maquinaId}`)
      .set('Authorization', adminAuth())
      .send({ nombre: 'Prensa de Piernas Editada', observaciones: 'Revisar prensa' })

    expect(res.status).toBe(200)
    expect(res.body.nombre).toBe('Prensa de Piernas Editada')
    expect(res.body.url_multimedia).toBe(maquinaUrlOriginal)
  })

  it('PUT reemplazo de imagen → 200, borra el archivo anterior y guarda el nuevo', async () => {
    const res = await request(app)
      .put(`/api/maquinas/${maquinaId}`)
      .set('Authorization', adminAuth())
      .field('nombre', 'Prensa de Piernas Editada')
      .field('grupos_musculares', JSON.stringify(['piernas']))
      .attach('media', PNG_1X1, { filename: 'nueva-maquina.png', contentType: 'image/png' })

    expect(res.status).toBe(200)

    const archivoViejo = path.basename(maquinaUrlOriginal)
    expect(fs.existsSync(path.join(MULTIMEDIA_DIR, archivoViejo))).toBe(false)

    const archivoNuevo = path.basename(res.body.url_multimedia)
    expect(fs.existsSync(path.join(MULTIMEDIA_DIR, archivoNuevo))).toBe(true)
    maquinaUrlOriginal = res.body.url_multimedia
  })

  it('PUT con rol entrenador → 403', async () => {
    const res = await request(app)
      .put(`/api/maquinas/${maquinaId}`)
      .set('Authorization', entrenadorAuth())
      .send({ descripcion: 'x' })

    expect(res.status).toBe(403)
  })

  it('PUT a máquina inexistente → 404', async () => {
    const res = await request(app)
      .put('/api/maquinas/00000000-0000-0000-0000-000000000000')
      .set('Authorization', adminAuth())
      .send({ descripcion: 'x' })

    expect(res.status).toBe(404)
  })
})

describe('Desactivación de máquinas', () => {
  it('Desactivar → deja de aparecer en el listado activo', async () => {
    const creada = await request(app)
      .post('/api/maquinas')
      .set('Authorization', adminAuth())
      .field('nombre', 'Maquina Para Desactivar')
      .field('grupos_musculares', JSON.stringify(['piernas']))
      .attach('media', PNG_1X1, { filename: 'maquina.png', contentType: 'image/png' })
    maquinaParaDesactivarId = creada.body.id_maquina

    const res = await request(app)
      .put(`/api/maquinas/${maquinaParaDesactivarId}/desactivar`)
      .set('Authorization', adminAuth())

    expect(res.status).toBe(200)
    expect(res.body.mensaje).toBe('Máquina desactivada correctamente')

    const detalle = await request(app)
      .get(`/api/maquinas/${maquinaParaDesactivarId}`)
      .set('Authorization', adminAuth())
    expect(detalle.body.estado).toBe('sin_servicio')

    const listado = await request(app).get('/api/maquinas').set('Authorization', adminAuth())
    const ids = (listado.body as any[]).map((m) => m.id_maquina)
    expect(ids).not.toContain(maquinaParaDesactivarId)
  })

  it('Desactivar una máquina inexistente → 404', async () => {
    const res = await request(app)
      .put('/api/maquinas/00000000-0000-0000-0000-000000000000/desactivar')
      .set('Authorization', adminAuth())

    expect(res.status).toBe(404)
  })
})