import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import app from '../src/app'
import { prisma } from '../src/utils/prisma'

const API_KEY = 'biometria_unifit_2026_clave_secreta'

let adminId: string
let entrenadorId: string
let directoId: string

beforeAll(async () => {
  const admin = await prisma.usuario.findUnique({ where: { email_contacto: 'admin@unifit.edu.co' } })
  const entrenador = await prisma.usuario.findUnique({ where: { email_contacto: 'entrenador@unifit.edu.co' } })
  const directo = await prisma.usuario.findUnique({ where: { email_contacto: 'directo@unifit.edu.co' } })

  adminId = admin!.id_usuario
  entrenadorId = entrenador!.id_usuario
  directoId = directo!.id_usuario
})

afterAll(async () => {
  await prisma.huella.deleteMany().catch(() => {})
})

function token(key: string): string {
  return (globalThis as any)[key]
}

describe.sequential('Biometría - Enrolamiento', () => {
  it('POST /biometria/enrolar - admin inicia enrolamiento', async () => {
    const res = await request(app)
      .post('/api/biometria/enrolar')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({ id_usuario: directoId })

    expect(res.status).toBe(201)
    expect(res.body.mensaje).toBe('Enrolamiento iniciado')
    expect(res.body.indice_sensor).toBeDefined()
  })

  it('POST /biometria/enrolar - entrenador inicia enrolamiento', async () => {
    const res = await request(app)
      .post('/api/biometria/enrolar')
      .set('Authorization', `Bearer ${token('entrenadorToken')}`)
      .send({ id_usuario: directoId })

    expect(res.status).toBe(201)
    expect(res.body.indice_sensor).toBeDefined()
  })

  it('POST /biometria/enrolar - usuario NO puede enrollar (403)', async () => {
    const res = await request(app)
      .post('/api/biometria/enrolar')
      .set('Authorization', `Bearer ${token('usuarioToken')}`)
      .send({ id_usuario: directoId })

    expect(res.status).toBe(403)
  })

  it('POST /biometria/enrolar - usuario inexistente (404)', async () => {
    const res = await request(app)
      .post('/api/biometria/enrolar')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({ id_usuario: '00000000-0000-0000-0000-000000000000' })

    expect(res.status).toBe(404)
  })

  it('POST /biometria/enrolar - datos inválidos (400)', async () => {
    const res = await request(app)
      .post('/api/biometria/enrolar')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({ id_usuario: 'no-es-uuid' })

    expect(res.status).toBe(400)
  })
})

describe.sequential('Biometría - Estado', () => {
  it('GET /biometria/estado/:id - admin consulta estado', async () => {
    const res = await request(app)
      .get(`/api/biometria/estado/${directoId}`)
      .set('Authorization', `Bearer ${token('adminToken')}`)

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('tiene_huella')
    expect(typeof res.body.tiene_huella).toBe('boolean')
  })

  it('GET /biometria/estado/:id - entrenador consulta estado', async () => {
    const res = await request(app)
      .get(`/api/biometria/estado/${directoId}`)
      .set('Authorization', `Bearer ${token('entrenadorToken')}`)

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('tiene_huella')
  })
})

describe.sequential('Biometría - Huellas (admin)', () => {
  it('GET /biometria/huellas - admin lista huellas', async () => {
    const res = await request(app)
      .get('/api/biometria/huellas')
      .set('Authorization', `Bearer ${token('adminToken')}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('GET /biometria/huellas - entrenador NO puede listar (403)', async () => {
    const res = await request(app)
      .get('/api/biometria/huellas')
      .set('Authorization', `Bearer ${token('entrenadorToken')}`)

    expect(res.status).toBe(403)
  })
})

describe.sequential('Biometría - Sensor (ESP32)', () => {
  it('POST /biometria/registrar - con API key válida (flujo real: enrolar -> registrar con mismo slot)', async () => {
    // 1. Iniciar enrolamiento para obtener slot asignado
    const enrolRes = await request(app)
      .post('/api/biometria/enrolar')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({ id_usuario: directoId })

    expect(enrolRes.status).toBe(201)
    const slotAsignado = enrolRes.body.indice_sensor

    // 2. Sensor registra huella usando EL MISMO slot asignado
    const res = await request(app)
      .post('/api/biometria/registrar')
      .set('x-api-key', API_KEY)
      .send({ id_usuario: directoId, indice_sensor: slotAsignado })

    expect(res.status).toBe(201)
    expect(res.body.huella).toBeDefined()
    expect(res.body.huella.activo).toBe(true)
    expect(res.body.huella.indice_sensor).toBe(slotAsignado)
  })

  it('POST /biometria/registrar - sin API key (401)', async () => {
    const res = await request(app)
      .post('/api/biometria/registrar')
      .send({ id_usuario: directoId, indice_sensor: 1 })

    expect(res.status).toBe(401)
  })

  it('Re-enrollment: reemplaza huella activa reutilizando el mismo slot', async () => {
    // 1. Iniciar enrolamiento de nuevo (el usuario ya tiene huella activa)
    const enrolRes = await request(app)
      .post('/api/biometria/enrolar')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({ id_usuario: directoId })

    expect(enrolRes.status).toBe(201)
    const slotReutilizado = enrolRes.body.indice_sensor

    // 2. El slot debe ser el mismo que ya tenía (no genera colisión)
    const huellaAntes = await prisma.huella.findUnique({ where: { id_usuario: directoId } })
    expect(slotReutilizado).toBe(huellaAntes?.indice_sensor)

    // 3. Tras re-enrolar, queda inactiva esperando registrar la nueva
    expect(huellaAntes?.activo).toBe(false)
    expect(huellaAntes?.paso_enrolamiento).toBe(1)

    // 4. Sensor registra la nueva huella en el mismo slot
    const res = await request(app)
      .post('/api/biometria/registrar')
      .set('x-api-key', API_KEY)
      .send({ id_usuario: directoId, indice_sensor: slotReutilizado })

    expect(res.status).toBe(201)
    expect(res.body.huella.activo).toBe(true)
    expect(res.body.huella.indice_sensor).toBe(slotReutilizado)
  })

  it('GET /biometria/pendientes - con API key', async () => {
    const res = await request(app)
      .get('/api/biometria/pendientes')
      .set('x-api-key', API_KEY)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('GET /biometria/pendientes - sin API key (401)', async () => {
    const res = await request(app)
      .get('/api/biometria/pendientes')

    expect(res.status).toBe(401)
  })

  it('PATCH /biometria/paso - con API key actualiza paso', async () => {
    // Primero crear enrolamiento pendiente para un usuario
    await request(app)
      .post('/api/biometria/enrolar')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({ id_usuario: directoId })

    const res = await request(app)
      .patch('/api/biometria/paso')
      .set('x-api-key', API_KEY)
      .send({ id_usuario: directoId, paso: 1 })

    expect(res.status).toBe(200)
    expect(res.body.mensaje).toBe('Paso actualizado')
  })

  it('PATCH /biometria/paso - sin API key (401)', async () => {
    const res = await request(app)
      .patch('/api/biometria/paso')
      .send({ id_usuario: directoId, paso: 1 })

    expect(res.status).toBe(401)
  })
})
