import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import app from '../src/app'
import { prisma } from '../src/utils/prisma'

const API_KEY = 'biometria_unifit_2026_clave_secreta'

let adminId: string
let entrenadorId: string
let directoId: string
let huellaAdminId: string
let huellaEntrenadorId: string
let huellaDirectoId: string

beforeAll(async () => {
  const admin = await prisma.usuario.findUnique({ where: { email_contacto: 'admin@unifit.edu.co' } })
  const entrenador = await prisma.usuario.findUnique({ where: { email_contacto: 'entrenador@unifit.edu.co' } })
  const directo = await prisma.usuario.findUnique({ where: { email_contacto: 'directo@unifit.edu.co' } })

  adminId = admin!.id_usuario
  entrenadorId = entrenador!.id_usuario
  directoId = directo!.id_usuario

  await prisma.huella.deleteMany()

  const hAdmin = await prisma.huella.create({
    data: { id_usuario: adminId, indice_sensor: 1, activo: true },
  })
  const hEntrenador = await prisma.huella.create({
    data: { id_usuario: entrenadorId, indice_sensor: 2, activo: true },
  })
  const hDirecto = await prisma.huella.create({
    data: { id_usuario: directoId, indice_sensor: 3, activo: true },
  })

  huellaAdminId = hAdmin.id_huella
  huellaEntrenadorId = hEntrenador.id_huella
  huellaDirectoId = hDirecto.id_huella
})

afterAll(async () => {
  await prisma.asistencia.deleteMany()
  await prisma.huella.deleteMany()
})

function token(key: string): string {
  return (globalThis as any)[key]
}

describe.sequential('Asistencia - Sensor', () => {
  it('POST /asistencia/sensor - registra entrada (primera huella)', async () => {
    const res = await request(app)
      .post('/api/asistencia/sensor')
      .set('x-api-key', API_KEY)
      .send({ indice_sensor: 1 })

    expect(res.status).toBe(201)
    expect(res.body.tipo).toBe('entrada')
    expect(res.body.asistencia).toBeDefined()
    expect(res.body.asistencia.hora_salida).toBeNull()
  })

  it('POST /asistencia/sensor - registra salida (segunda huella mismo usuario)', async () => {
    const res = await request(app)
      .post('/api/asistencia/sensor')
      .set('x-api-key', API_KEY)
      .send({ indice_sensor: 1 })

    expect(res.status).toBe(201)
    expect(res.body.tipo).toBe('salida')
    expect(res.body.asistencia.hora_salida).toBeDefined()
    expect(res.body.asistencia.duracion_minutos).toBeDefined()
  })

  it('POST /asistencia/sensor - sin API key (401)', async () => {
    const res = await request(app)
      .post('/api/asistencia/sensor')
      .send({ indice_sensor: 1 })

    expect(res.status).toBe(401)
  })

  it('POST /asistencia/sensor - huella no registrada (404)', async () => {
    const res = await request(app)
      .post('/api/asistencia/sensor')
      .set('x-api-key', API_KEY)
      .send({ indice_sensor: 999 })

    expect(res.status).toBe(404)
  })

  it('POST /asistencia/sensor - datos inválidos (400)', async () => {
    const res = await request(app)
      .post('/api/asistencia/sensor')
      .set('x-api-key', API_KEY)
      .send({ indice_sensor: -1 })

    expect(res.status).toBe(400)
  })

  it('POST /asistencia/sensor - cap 6h (360 min)', async () => {
    await prisma.asistencia.create({
      data: {
        id_usuario: adminId,
        hora_ingreso: new Date(Date.now() - 7 * 60 * 60 * 1000),
      },
    })

    const res = await request(app)
      .post('/api/asistencia/sensor')
      .set('x-api-key', API_KEY)
      .send({ indice_sensor: 1 })

    expect(res.status).toBe(201)
    expect(res.body.tipo).toBe('salida')
    expect(res.body.asistencia.duracion_minutos).toBeLessThanOrEqual(360)
    expect(res.body.asistencia.observaciones).toContain('límite 6h')
  })
})

describe.sequential('Asistencia - Historial Usuario', () => {
  it('GET /asistencia/usuario/:id - admin ve historial', async () => {
    const res = await request(app)
      .get(`/api/asistencia/usuario/${directoId}`)
      .set('Authorization', `Bearer ${token('adminToken')}`)

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('asistencias')
    expect(Array.isArray(res.body.asistencias)).toBe(true)
  })

  it('GET /asistencia/usuario/:id - entrenador ve historial', async () => {
    const res = await request(app)
      .get(`/api/asistencia/usuario/${directoId}`)
      .set('Authorization', `Bearer ${token('entrenadorToken')}`)

    expect(res.status).toBe(200)
  })

  it('GET /asistencia/usuario/:id - usuario NO ve historial de otro (403)', async () => {
    const res = await request(app)
      .get(`/api/asistencia/usuario/${adminId}`)
      .set('Authorization', `Bearer ${token('usuarioToken')}`)

    expect(res.status).toBe(403)
  })

  it('GET /asistencia/usuario/:id - paginación funciona', async () => {
    const res = await request(app)
      .get(`/api/asistencia/usuario/${directoId}`)
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .query({ page: 1, pageSize: 5 })

    expect(res.status).toBe(200)
    expect(res.body.page).toBe(1)
    expect(res.body.pageSize).toBe(5)
  })
})

describe.sequential('Asistencia - Historial Propio', () => {
  it('GET /asistencia/usuario/me - usuario ve su propio historial', async () => {
    const res = await request(app)
      .get('/api/asistencia/usuario/me')
      .set('Authorization', `Bearer ${token('usuarioToken')}`)

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('asistencias')
    expect(Array.isArray(res.body.asistencias)).toBe(true)
  })

  it('GET /asistencia/usuario/me - sin token (401)', async () => {
    const res = await request(app)
      .get('/api/asistencia/usuario/me')

    expect(res.status).toBe(401)
  })

  it('GET /asistencia/usuario/me - paginación funciona', async () => {
    const res = await request(app)
      .get('/api/asistencia/usuario/me')
      .set('Authorization', `Bearer ${token('usuarioToken')}`)
      .query({ page: 1, pageSize: 5 })

    expect(res.status).toBe(200)
    expect(res.body.page).toBe(1)
    expect(res.body.pageSize).toBe(5)
  })
})

describe.sequential('Asistencia - Listado (admin/entrenador)', () => {
  it('GET /asistencia - admin lista con filtros', async () => {
    const res = await request(app)
      .get('/api/asistencia')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .query({ page: 1, pageSize: 10 })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('asistencias')
    expect(res.body).toHaveProperty('total')
  })

  it('GET /asistencia - entrenador lista', async () => {
    const res = await request(app)
      .get('/api/asistencia')
      .set('Authorization', `Bearer ${token('entrenadorToken')}`)

    expect(res.status).toBe(200)
  })

  it('GET /asistencia - usuario NO puede listar (403)', async () => {
    const res = await request(app)
      .get('/api/asistencia')
      .set('Authorization', `Bearer ${token('usuarioToken')}`)

    expect(res.status).toBe(403)
  })

  it('GET /asistencia - filtro por usuario', async () => {
    const res = await request(app)
      .get('/api/asistencia')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .query({ id_usuario: directoId })

    expect(res.status).toBe(200)
    for (const a of res.body.asistencias) {
      expect(a.usuario.id_usuario).toBe(directoId)
    }
  })
})

describe.sequential('Asistencia - Resumen y Evolución', () => {
  it('GET /asistencia/resumen/semana - admin obtiene resumen', async () => {
    const hoy = new Date()
    const inicio = new Date(hoy)
    inicio.setDate(hoy.getDate() - 6)

    const res = await request(app)
      .get('/api/asistencia/resumen/semana')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .query({
        fecha_inicio: inicio.toISOString(),
        fecha_fin: hoy.toISOString(),
      })

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBe(7)
  })

  it('GET /asistencia/evolucion - admin obtiene evolución', async () => {
    const hoy = new Date()
    const inicio = new Date(hoy)
    inicio.setDate(hoy.getDate() - 30)

    const res = await request(app)
      .get('/api/asistencia/evolucion')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .query({
        fecha_inicio: inicio.toISOString(),
        fecha_fin: hoy.toISOString(),
        agrupacion: 'dia',
      })

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})

describe.sequential('Asistencia - Actualización (admin)', () => {
  let asistenciaId: string

  beforeAll(async () => {
    const a = await prisma.asistencia.create({
      data: {
        id_usuario: directoId,
        hora_ingreso: new Date('2026-01-15T06:30:00'),
        hora_salida: new Date('2026-01-15T08:15:00'),
        duracion_minutos: 105,
      },
    })
    asistenciaId = a.id_asistencia
  })

  it('PATCH /asistencia/:id - admin actualiza observaciones', async () => {
    const res = await request(app)
      .patch(`/api/asistencia/${asistenciaId}`)
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({ observaciones: 'Corrección manual' })

    expect(res.status).toBe(200)
    expect(res.body.asistencia.observaciones).toBe('Corrección manual')
  })

  it('PATCH /asistencia/:id - entrenador NO puede actualizar (403)', async () => {
    const res = await request(app)
      .patch(`/api/asistencia/${asistenciaId}`)
      .set('Authorization', `Bearer ${token('entrenadorToken')}`)
      .send({ observaciones: 'Intento' })

    expect(res.status).toBe(403)
  })

  it('PATCH /asistencia/:id - inexistente (404)', async () => {
    const res = await request(app)
      .patch('/api/asistencia/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({ observaciones: 'Test' })

    expect(res.status).toBe(404)
  })
})