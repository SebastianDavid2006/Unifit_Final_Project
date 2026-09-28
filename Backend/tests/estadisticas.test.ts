import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import app from '../src/app'
import { prisma } from '../src/utils/prisma'

const IDS_USUARIOS: string[] = []
let ID_PROGRAMA = ''
const IDS_ASISTENCIAS: string[] = []
const IDS_AGENDA: string[] = []

const base = {
  total: 0,
  activos: 0,
  inactivos: 0,
  pendientes: 0,
  sexos: { masculino: 0, femenino: 0, otro: 0 },
  tipos: { estudiante: 0, egresado: 0, docente: 0, administrativo: 0 },
  porMes: {} as Record<string, { total: number; acumulado: number }>,
  asistenciasPeriodo: 0,
  asistenciasPorMes: {} as Record<string, number>,
  citas: 0,
}

const RANGO_DESDE = new Date('2026-01-01T00:00:00.000Z')
const RANGO_HASTA = new Date('2026-12-31T23:59:59.000Z')

function claveMes(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

async function baseCitasProgramadas(): Promise<number> {
  const hoy = new Date(`${new Date().toISOString().split('T')[0]}T00:00:00Z`)
  return prisma.agenda.count({ where: { fecha: { gte: hoy }, estado: { not: 'cancelado' } } })
}

beforeAll(async () => {
  const hoy = new Date(`${new Date().toISOString().split('T')[0]}T00:00:00Z`)

  // Línea base sobre los datos reales existentes (independiente de la BD)
  const previos = await prisma.usuario.findMany({
    where: { rol: 'usuario' },
    select: {
      estado: true,
      genero: true,
      tipo_usuario: true,
      fecha_creacion: true,
      estudiante: { select: { es_egresado: true } },
    },
  })

  base.total = previos.length
  base.activos = previos.filter(u => u.estado === 'activo').length
  base.inactivos = previos.filter(u => u.estado === 'inactivo').length
  base.pendientes = base.total - base.activos - base.inactivos
  for (const u of previos) base.sexos[u.genero] += 1
  for (const u of previos) {
    if (u.tipo_usuario === 'profesor') base.tipos.docente += 1
    else if (u.tipo_usuario === 'administrativo') base.tipos.administrativo += 1
    else if (u.estudiante?.es_egresado) base.tipos.egresado += 1
    else base.tipos.estudiante += 1
  }
  let accBase = 0
  const mesesFechas = new Map<string, number>()
  for (const u of previos) {
    const key = claveMes(u.fecha_creacion)
    mesesFechas.set(key, (mesesFechas.get(key) ?? 0) + 1)
  }
  for (const [fecha, total] of [...mesesFechas.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    accBase += total
    base.porMes[fecha] = { total, acumulado: accBase }
  }
  base.asistenciasPeriodo = await prisma.asistencia.count({
    where: { fecha: { gte: RANGO_DESDE, lte: RANGO_HASTA } },
  })
  const asistenciaMes = await prisma.asistencia.findMany({
    where: { fecha: { gte: RANGO_DESDE, lte: RANGO_HASTA } },
    select: { fecha: true },
  })
  for (const a of asistenciaMes) {
    const key = claveMes(a.fecha)
    base.asistenciasPorMes[key] = (base.asistenciasPorMes[key] ?? 0) + 1
  }
  base.citas = await baseCitasProgramadas()

  // ---- Registros transitorios de esta corrida ----
  const programa = await prisma.programa.create({
    data: {
      nombre: 'Estadísticas Test',
      universidad: 'uni_colombia',
      tipo_programa: 'profesional',
    },
  })
  ID_PROGRAMA = programa.id_programa

  const crearUsuario = async (datos: {
    genero: string
    tipo_usuario: string
    estado: string
    esEgresado?: boolean
    mes: string
  }) => {
    const usuario = await prisma.usuario.create({
      data: {
        primer_nombre: 'Fixture',
        primer_apellido: `Est${datos.mes}`,
        email_contacto: `estadisticas-${IDS_USUARIOS.length}-${Date.now()}@test.com`,
        documento: `EST${IDS_USUARIOS.length}-${Date.now()}`,
        genero: datos.genero as any,
        tipo_usuario: datos.tipo_usuario as any,
        estado: datos.estado as any,
        fecha_creacion: new Date(`${datos.mes}-15T12:00:00.000Z`),
      },
    })
    IDS_USUARIOS.push(usuario.id_usuario)

    if (datos.tipo_usuario === 'estudiante') {
      await prisma.estudiante.create({
        data: {
          id_usuario: usuario.id_usuario,
          id_programa: ID_PROGRAMA,
          semestre: 3,
          es_egresado: datos.esEgresado ?? false,
        },
      })
    }
    return usuario
  }

  // u1: activo, masculino, estudiante (no egresado), altas en 2026-03
  await crearUsuario({ genero: 'masculino', tipo_usuario: 'estudiante', estado: 'activo', esEgresado: false, mes: '2026-03' })
  // u2: activo, femenino, egresado, altas en 2026-03
  await crearUsuario({ genero: 'femenino', tipo_usuario: 'estudiante', estado: 'activo', esEgresado: true, mes: '2026-03' })
  // u3: inactivo, otro, docente, altas en 2026-04
  await crearUsuario({ genero: 'otro', tipo_usuario: 'profesor', estado: 'inactivo', mes: '2026-04' })
  // u4: activo, femenino, administrativo, altas en 2026-05
  await crearUsuario({ genero: 'femenino', tipo_usuario: 'administrativo', estado: 'activo', mes: '2026-05' })

  // Asistencias en rango: u1 -> 2, u2 -> 1 (total 3 en 2026-06)
  const fechasAsistencia = ['2026-06-01', '2026-06-08', '2026-06-15']
  for (let i = 0; i < 3; i++) {
    const asistencia = await prisma.asistencia.create({
      data: {
        id_usuario: i < 2 ? IDS_USUARIOS[0] : IDS_USUARIOS[1],
        fecha: new Date(`${fechasAsistencia[i]}T08:00:00.000Z`),
        hora_ingreso: new Date(`${fechasAsistencia[i]}T08:00:00.000Z`),
        duracion_minutos: 60,
      },
    })
    IDS_ASISTENCIAS.push(asistencia.id_asistencia)
  }

  // Citas: 1 futura pendiente (cuenta), 1 pasada pendiente (no), 1 futura cancelada (no)
  const crearCita = async (fecha: Date, estado: string) => {
    const agenda = await prisma.agenda.create({
      data: {
        id_usuario: IDS_USUARIOS[3],
        id_creador: IDS_USUARIOS[3],
        fecha,
        hora_inicio: new Date('1970-01-01T08:00:00Z'),
        tipo: 'registro',
        estado: estado as any,
      },
    })
    IDS_AGENDA.push(agenda.id_agenda)
  }
  await crearCita(hoy, 'pendiente')
  await crearCita(new Date('2025-01-02T00:00:00.000Z'), 'pendiente')
  await crearCita(hoy, 'cancelado')
})

afterAll(async () => {
  await prisma.asistencia.deleteMany({ where: { id_asistencia: { in: IDS_ASISTENCIAS } } })
  await prisma.agenda.deleteMany({ where: { id_agenda: { in: IDS_AGENDA } } })
  await prisma.estudiante.deleteMany({ where: { id_usuario: { in: IDS_USUARIOS } } })
  await prisma.usuario.deleteMany({ where: { id_usuario: { in: IDS_USUARIOS } } })
  await prisma.programa.deleteMany({ where: { id_programa: ID_PROGRAMA } })
})

function token(key: string): string {
  return (globalThis as any)[key]
}

describe.sequential('Estadísticas', () => {
  it('GET /estadisticas - 401 sin token', async () => {
    const res = await request(app).get('/api/estadisticas')
    expect(res.status).toBe(401)
  })

  it('GET /estadisticas - 403 para rol usuario', async () => {
    const res = await request(app)
      .get('/api/estadisticas')
      .set('Authorization', `Bearer ${token('usuarioToken')}`)
    expect(res.status).toBe(403)
  })

  it('GET /estadisticas - 400 rango invertido', async () => {
    const res = await request(app)
      .get('/api/estadisticas')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .query({ fecha_inicio: '2026-12-01T00:00:00.000Z', fecha_fin: '2026-01-01T00:00:00.000Z' })
    expect(res.status).toBe(400)
  })

  it('GET /estadisticas - admin: cifras con rango explícito', async () => {
    const res = await request(app)
      .get('/api/estadisticas')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .query({ fecha_inicio: RANGO_DESDE.toISOString(), fecha_fin: RANGO_HASTA.toISOString() })

    expect(res.status).toBe(200)
    const dato = res.body

    expect(dato.usuarios.total).toBe(base.total + 4)
    expect(dato.usuarios.activos).toBe(base.activos + 3)
    expect(dato.usuarios.inactivos).toBe(base.inactivos + 1)
    expect(dato.usuarios.pendientes).toBe(base.pendientes)

    expect(dato.usuarios_por_sexo).toHaveLength(3)
    const sexos = Object.fromEntries(dato.usuarios_por_sexo.map((s: any) => [s.genero, s.total]))
    expect(sexos.masculino).toBe(base.sexos.masculino + 1)
    expect(sexos.femenino).toBe(base.sexos.femenino + 2)
    expect(sexos.otro).toBe(base.sexos.otro + 1)

    const tipos = Object.fromEntries(dato.usuarios_por_tipo.map((t: any) => [t.tipo, t.total]))
    expect(tipos.estudiante).toBe(base.tipos.estudiante + 1)
    expect(tipos.egresado).toBe(base.tipos.egresado + 1)
    expect(tipos.docente).toBe(base.tipos.docente + 1)
    expect(tipos.administrativo).toBe(base.tipos.administrativo + 1)

    // Evolución: los fixtures suman +2 (2026-03), +1 (2026-04), +1 (2026-05)
    const expecteado = new Map(Object.entries(base.porMes))
    for (const [fecha, inc] of [['2026-03', 2], ['2026-04', 1], ['2026-05', 1]]) {
      expecteado.set(fecha, { total: (expecteado.get(fecha)?.total ?? 0) + inc, acumulado: 0 })
    }
    let accEsp = 0
    const serieEsperada = [...expecteado.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([fecha, m]) => {
        accEsp += m.total
        return { fecha, total: m.total, acumulado: accEsp }
      })
    expect([...dato.usuarios_por_mes].sort((a: any, b: any) => a.fecha.localeCompare(b.fecha))).toEqual(serieEsperada)

    // Carrera única creada: 2 registrados y 3 asistencias del rango
    const carrera = dato.carreras.find((c: any) => c.programa === 'Estadísticas Test')
    expect(carrera).toBeDefined()
    expect(carrera.universidad).toBe('uni_colombia')
    expect(carrera.tipo_programa).toBe('profesional')
    expect(carrera.registrados).toBe(2)
    expect(carrera.asistencias).toBe(3)

    expect(dato.asistencias.periodo).toBe(base.asistenciasPeriodo + 3)
    const jun = dato.asistencias.por_mes.find((m: any) => m.fecha === '2026-06')
    expect(jun.total).toBe((base.asistenciasPorMes['2026-06'] ?? 0) + 3)

    expect(dato.citas.programadas).toBe(base.citas + 1)
  })

  it('GET /estadisticas - entrenador también autorizado', async () => {
    const res = await request(app)
      .get('/api/estadisticas')
      .set('Authorization', `Bearer ${token('entrenadorToken')}`)
    expect(res.status).toBe(200)
    expect(res.body.usuarios).toBeDefined()
  })
})