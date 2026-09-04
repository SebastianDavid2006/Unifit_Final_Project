import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/app'
import { prisma } from '../src/utils/prisma'

function token(key: string): string {
  return (globalThis as any)[key]
}

let cargoCreadoId: string

describe.sequential('Catálogo - Cargos (CRUD)', () => {
  it('GET /api/cargos - público (200)', async () => {
    const res = await request(app).get('/api/cargos')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('POST /api/cargos - admin crea (201)', async () => {
    const res = await request(app)
      .post('/api/cargos')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({ nombre: 'Cargo Test ' + Date.now() })

    expect(res.status).toBe(201)
    expect(res.body.id_cargo).toBeDefined()
    cargoCreadoId = res.body.id_cargo
  })

  it('POST /api/cargos - entrenador NO puede crear (403)', async () => {
    const res = await request(app)
      .post('/api/cargos')
      .set('Authorization', `Bearer ${token('entrenadorToken')}`)
      .send({ nombre: 'Cargo prohibido' })

    expect(res.status).toBe(403)
  })

  it('POST /api/cargos - sin auth (401)', async () => {
    const res = await request(app).post('/api/cargos').send({ nombre: 'Cargo anon' })
    expect(res.status).toBe(401)
  })

  it('PUT /api/cargos/:id - admin edita (200)', async () => {
    const res = await request(app)
      .put(`/api/cargos/${cargoCreadoId}`)
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({ nombre: 'Cargo Editado ' + Date.now() })

    expect(res.status).toBe(200)
    expect(res.body.nombre).toBeDefined()
  })

  it('DELETE /api/cargos/:id - admin elimina (200)', async () => {
    const res = await request(app)
      .delete(`/api/cargos/${cargoCreadoId}`)
      .set('Authorization', `Bearer ${token('adminToken')}`)

    expect(res.status).toBe(200)
  })

  it('DELETE /api/cargos/:id - entrenador NO puede eliminar (403)', async () => {
    const res = await request(app)
      .delete(`/api/cargos/${cargoCreadoId}`)
      .set('Authorization', `Bearer ${token('entrenadorToken')}`)

    expect(res.status).toBe(403)
  })
})

describe.sequential('Catálogo - Áreas (CRUD)', () => {
  it('POST /api/areas - admin crea (201)', async () => {
    const res = await request(app)
      .post('/api/areas')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({ nombre: 'Área Test ' + Date.now() })

    expect(res.status).toBe(201)
    expect(res.body.id_area).toBeDefined()
  })

  it('POST /api/areas - usuario NO puede crear (403)', async () => {
    const res = await request(app)
      .post('/api/areas')
      .set('Authorization', `Bearer ${token('usuarioToken')}`)
      .send({ nombre: 'Área prohibida' })

    expect(res.status).toBe(403)
  })

  it('POST /api/areas - datos inválidos (400)', async () => {
    const res = await request(app)
      .post('/api/areas')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({ nombre: '' })

    expect(res.status).toBe(400)
  })

  it('GET /api/areas - público (200)', async () => {
    const res = await request(app).get('/api/areas')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})