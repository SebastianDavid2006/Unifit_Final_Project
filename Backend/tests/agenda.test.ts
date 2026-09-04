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
let citaEditableId: string
let citaConCupoId: string

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

  it('PUT /agenda/:id - admin edita fecha y hora de cita (sin cupo)', async () => {
    const createRes = await request(app)
      .post('/api/agenda')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        id_usuario: directoId,
        fecha: '2026-12-01',
        hora_inicio: '09:00:00',
        tipo: 'seguimiento',
      })

    expect(createRes.status).toBe(201)
    citaEditableId = createRes.body.id_agenda

    const res = await request(app)
      .put(`/api/agenda/${citaEditableId}`)
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        fecha: '2026-12-08',
        hora_inicio: '15:30:00',
      })

    expect(res.status).toBe(200)
    expect(res.body.id_agenda).toBe(citaEditableId)
    expect(res.body.fecha.slice(0, 10)).toBe('2026-12-08')
    // hora_inicio ahora viene como "HH:mm:ss" limpio en UTC (15:30 local = 20:30 UTC)
    expect(res.body.hora_inicio).toBe('20:30:00')
  })

  it('DELETE /agenda/:id - admin elimina cita', async () => {
    const res = await request(app)
      .delete(`/api/agenda/${citaId}`)
      .set('Authorization', `Bearer ${token('adminToken')}`)

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ id_agenda: citaId })

    const getRes = await request(app)
      .get(`/api/agenda/${citaId}`)
      .set('Authorization', `Bearer ${token('adminToken')}`)

    expect(getRes.status).toBe(404)
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
    citaConCupoId = res.body.id_agenda
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

  it('PUT /agenda/:id - cita reservada por cupo NO se puede editar (400)', async () => {
    const res = await request(app)
      .put(`/api/agenda/${citaConCupoId}`)
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({ fecha: '2026-12-10' })

    expect(res.status).toBe(400)
    expect(res.body.mensaje).toContain('cupo')
  })
})

describe.sequential('Agenda - Seguridad y escalada', () => {
  let citaDirectoA: string
  let citaDirectoB: string
  let cupoParaVencimiento: string

  it('POST /agenda - admin crea cita para pendiente (usuario diferente al dueño)', async () => {
    const res = await request(app)
      .post('/api/agenda')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        id_usuario: pendienteId,
        fecha: '2026-12-10',
        hora_inicio: '09:00:00',
        tipo: 'registro',
      })
    expect(res.status).toBe(201)
    citaDirectoA = res.body.id_agenda
  })

  it('POST /cupos/publicar - admin publica cupo para test vencimiento', async () => {
    const admin = await prisma.usuario.findUnique({ where: { email_contacto: 'admin@unifit.edu.co' } })
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const fechaPasada = new Date(hoy)
    fechaPasada.setDate(fechaPasada.getDate() - 1)
    const horaInicio = new Date('1970-01-01T06:00:00')
    const horaFin = new Date('1970-01-01T08:00:00')
    const cupo = await prisma.cupo.create({
      data: {
        id_creador: admin!.id_usuario,
        fecha: fechaPasada,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
      },
    })
    cupoParaVencimiento = cupo.id_cupo
  })

  it('Sin token → GET /agenda → 401', async () => {
    const res = await request(app).get('/api/agenda')
    expect(res.status).toBe(401)
  })

  it('Sin token → POST /cupos/publicar → 401', async () => {
    const res = await request(app)
      .post('/api/cupos/publicar')
      .send({ fecha_inicio: '2026-12-01', fecha_fin: '2026-12-01', horarios_por_dia: [] })
    expect(res.status).toBe(401)
  })

  it('Sin token → GET /cupos/disponibles → 401', async () => {
    const res = await request(app).get('/api/cupos/disponibles')
    expect(res.status).toBe(401)
  })

  it('Sin token → POST /cupos/:id/reservar → 401', async () => {
    const res = await request(app).post(`/api/cupos/${cupoParaVencimiento}/reservar`)
    expect(res.status).toBe(401)
  })

  it('Horizontal: usuario no puede ver cita de otro usuario → 403', async () => {
    const res = await request(app)
      .get(`/api/agenda/${citaDirectoA}`)
      .set('Authorization', `Bearer ${token('usuarioToken')}`)
    expect(res.status).toBe(403)
  })

  it('Horizontal: entrenador SÍ puede ver cita de usuario (privilegiado)', async () => {
    const res = await request(app)
      .get(`/api/agenda/${citaDirectoA}`)
      .set('Authorization', `Bearer ${token('entrenadorToken')}`)
    expect(res.status).toBe(200)
  })

  it('Vertical: usuario no puede publicar cupos → 403', async () => {
    const res = await request(app)
      .post('/api/cupos/publicar')
      .set('Authorization', `Bearer ${token('usuarioToken')}`)
      .send({
        fecha_inicio: '2026-12-15',
        fecha_fin: '2026-12-15',
        horarios_por_dia: [{ dia: 'lun', rangos: [{ inicio: '08:00', fin: '10:00' }] }],
      })
    expect(res.status).toBe(403)
  })

  it('Vertical: pendiente no puede publicar cupos → 403', async () => {
    const res = await request(app)
      .post('/api/cupos/publicar')
      .set('Authorization', `Bearer ${token('pendienteToken')}`)
      .send({
        fecha_inicio: '2026-12-15',
        fecha_fin: '2026-12-15',
        horarios_por_dia: [{ dia: 'lun', rangos: [{ inicio: '08:00', fin: '10:00' }] }],
      })
    expect(res.status).toBe(403)
  })

  it('Vertical: pendiente no puede crear cita → 403', async () => {
    const res = await request(app)
      .post('/api/agenda')
      .set('Authorization', `Bearer ${token('pendienteToken')}`)
      .send({
        id_usuario: directoId,
        fecha: '2026-12-15',
        hora_inicio: '08:00:00',
        tipo: 'registro',
      })
    expect(res.status).toBe(403)
  })

  it('Seguridad: no se puede reservar cupo ya vencido → 400', async () => {
    const res = await request(app)
      .post(`/api/cupos/${cupoParaVencimiento}/reservar`)
      .set('Authorization', `Bearer ${token('usuarioToken')}`)
    expect(res.status).toBe(400)
  })
})
