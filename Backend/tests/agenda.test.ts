import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import app from '../src/app'
import { prisma } from '../src/utils/prisma'

let adminId: string
let entrenadorId: string
let directoId: string
let pendienteId: string
let citaId: string
let cupoId: string

beforeAll(async () => {
  const admin = await prisma.usuario.findUnique({ where: { email_contacto: 'admin@unifit.edu.co' } })
  const entrenador = await prisma.usuario.findUnique({ where: { email_contacto: 'entrenador@unifit.edu.co' } })
  const directo = await prisma.usuario.findUnique({ where: { email_contacto: 'directo@unifit.edu.co' } })
  const pendiente = await prisma.usuario.findUnique({ where: { email_contacto: 'pendiente@unifit.edu.co' } })

  adminId = admin!.id_usuario
  entrenadorId = entrenador!.id_usuario
  directoId = directo!.id_usuario
  pendienteId = pendiente!.id_usuario
})

afterAll(async () => {
  await prisma.agenda.deleteMany().catch(() => {})
  await prisma.cupo.deleteMany().catch(() => {})
})

function token(key: string): string {
  return (globalThis as any)[key]
}

describe.sequential('Agenda - CRUD', () => {
  it('POST /agenda - admin crea cita para usuario', async () => {
    const res = await request(app)
      .post('/api/agenda')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        id_usuario: directoId,
        fecha: '2026-12-01',
        hora_inicio: '09:00:00',
        tipo: 'seguimiento',
      })

    expect(res.status).toBe(201)
    expect(res.body.id_agenda).toBeDefined()
    expect(res.body.tipo).toBe('seguimiento')
    expect(res.body.estado).toBe('pendiente')
    citaId = res.body.id_agenda
  })

  it('POST /agenda - entrenador crea cita', async () => {
    const res = await request(app)
      .post('/api/agenda')
      .set('Authorization', `Bearer ${token('entrenadorToken')}`)
      .send({
        id_usuario: directoId,
        fecha: '2026-12-02',
        hora_inicio: '10:00:00',
        tipo: 'valoracion',
      })

    expect(res.status).toBe(201)
  })

  it('POST /agenda - usuario no puede crear cita (403)', async () => {
    const res = await request(app)
      .post('/api/agenda')
      .set('Authorization', `Bearer ${token('usuarioToken')}`)
      .send({
        id_usuario: directoId,
        fecha: '2026-12-03',
        hora_inicio: '11:00:00',
        tipo: 'valoracion',
      })

    expect(res.status).toBe(403)
  })

  it('GET /agenda - admin puede listar todas', async () => {
    const res = await request(app)
      .get('/api/agenda')
      .set('Authorization', `Bearer ${token('adminToken')}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('GET /agenda - usuario no puede listar todas (403)', async () => {
    const res = await request(app)
      .get('/api/agenda')
      .set('Authorization', `Bearer ${token('usuarioToken')}`)

    expect(res.status).toBe(403)
  })

  it('GET /agenda/mis-citas - usuario consulta su propia agenda', async () => {
    const res = await request(app)
      .get('/api/agenda/mis-citas')
      .set('Authorization', `Bearer ${token('usuarioToken')}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('GET /agenda/:id - propietario ve su cita', async () => {
    const res = await request(app)
      .get(`/api/agenda/${citaId}`)
      .set('Authorization', `Bearer ${token('usuarioToken')}`)

    expect(res.status).toBe(200)
    expect(res.body.id_agenda).toBe(citaId)
  })

  it('PUT /agenda/:id/estado - admin cambia estado a completado', async () => {
    const res = await request(app)
      .put(`/api/agenda/${citaId}/estado`)
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({ estado: 'completado' })

    expect(res.status).toBe(200)
    expect(res.body.estado).toBe('completado')
  })

  it('DELETE /agenda/:id - admin elimina cita', async () => {
    const res = await request(app)
      .delete(`/api/agenda/${citaId}`)
      .set('Authorization', `Bearer ${token('adminToken')}`)

    expect(res.status).toBe(200)
  })

  it('DELETE /agenda/:id - entrenador no puede eliminar (403)', async () => {
    const temp = await request(app)
      .post('/api/agenda')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        id_usuario: directoId,
        fecha: '2026-12-04',
        hora_inicio: '08:00:00',
        tipo: 'registro',
      })

    const res = await request(app)
      .delete(`/api/agenda/${temp.body.id_agenda}`)
      .set('Authorization', `Bearer ${token('entrenadorToken')}`)

    expect(res.status).toBe(403)
  })
})

describe.sequential('Cupos - Publicación y reserva', () => {
  it('POST /cupos/publicar - admin publica cupos por día', async () => {
    const res = await request(app)
      .post('/api/cupos/publicar')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        fecha_inicio: '2026-12-02',
        fecha_fin: '2026-12-02',
        duracion_min: 120,
        horarios_por_dia: [
          { dia: 'mié', rangos: [{ inicio: '06:00', fin: '08:00' }, { inicio: '14:00', fin: '16:00' }] },
        ],
      })

    expect(res.status).toBe(201)
    expect(res.body.count).toBe(2)

    const cupo = await prisma.cupo.findFirst({ where: { agenda: { is: null } } })
    cupoId = cupo!.id_cupo
  })

  it('POST /cupos/publicar - valida solapamiento de horarios (400)', async () => {
    const res = await request(app)
      .post('/api/cupos/publicar')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        fecha_inicio: '2026-12-04',
        fecha_fin: '2026-12-04',
        duracion_min: 120,
        horarios_por_dia: [
          { dia: 'vie', rangos: [{ inicio: '06:00', fin: '09:00' }, { inicio: '07:00', fin: '10:00' }] },
        ],
      })

    expect(res.status).toBe(400)
  })

  it('POST /cupos/publicar - entrenador NO puede publicar (403)', async () => {
    const res = await request(app)
      .post('/api/cupos/publicar')
      .set('Authorization', `Bearer ${token('entrenadorToken')}`)
      .send({
        fecha_inicio: '2026-12-03',
        fecha_fin: '2026-12-03',
        duracion_min: 120,
        horarios_por_dia: [
          { dia: 'mié', rangos: [{ inicio: '08:00', fin: '10:00' }] },
        ],
      })

    expect(res.status).toBe(403)
  })

  it('GET /cupos/disponibles - usuario ve cupos sin reservar', async () => {
    const res = await request(app)
      .get('/api/cupos/disponibles')
      .set('Authorization', `Bearer ${token('usuarioToken')}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('POST /cupos/:id/reservar - usuario reserva cupo', async () => {
    const res = await request(app)
      .post(`/api/cupos/${cupoId}/reservar`)
      .set('Authorization', `Bearer ${token('usuarioToken')}`)

    expect(res.status).toBe(201)
    expect(res.body.id_agenda).toBeDefined()
    expect(res.body.id_cupo).toBe(cupoId)
  })

  it('POST /cupos/:id/reservar - cupo ya reservado → 400', async () => {
    const res = await request(app)
      .post(`/api/cupos/${cupoId}/reservar`)
      .set('Authorization', `Bearer ${token('usuarioToken')}`)

    expect(res.status).toBe(400)
  })

  it('POST /cupos/:id/reservar - usuario pendiente puede reservar (excepción)', async () => {
    const cupo = await prisma.cupo.findFirst({ where: { agenda: { is: null } } })
    const res = await request(app)
      .post(`/api/cupos/${cupo!.id_cupo}/reservar`)
      .set('Authorization', `Bearer ${token('pendienteToken')}`)

    expect(res.status).toBe(201)
  })
})
