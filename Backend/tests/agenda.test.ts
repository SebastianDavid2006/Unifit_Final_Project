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

// Limpieza acotada: solo se eliminan los registros creados durante ESTA corrida,
// nunca los que ya existían (citas/cupos reales del usuario).
// Orden respeta FK: Agenda referencia Cupo (id_cupo), así que se borra agenda primero.
const TABLAS_LIMPIEZA: Array<{ model: any; id: string }> = [
  { model: prisma.agenda, id: 'id_agenda' },
  { model: prisma.cupo, id: 'id_cupo' },
]
const idsPrevios = new Map<string, Set<string>>()

async function tomarIdsExistentes(): Promise<void> {
  for (const tabla of TABLAS_LIMPIEZA) {
    const filas = await tabla.model.findMany({ select: { [tabla.id]: true } })
    idsPrevios.set(tabla.id, new Set(filas.map((f: any) => f[tabla.id])))
  }
}

async function borrarSoloCreadosEnCorrida(): Promise<void> {
  for (const tabla of TABLAS_LIMPIEZA) {
    const previos = idsPrevios.get(tabla.id)
    if (!previos) continue
    const filas = await tabla.model.findMany({ select: { [tabla.id]: true } })
    const nuevos = filas.filter((f: any) => !previos.has(f[tabla.id])).map((f: any) => f[tabla.id])
    if (nuevos.length) await tabla.model.deleteMany({ where: { [tabla.id]: { in: nuevos } } })
  }
}

// Cupos creados durante ESTA corrida (para que los tests solo operen sobre ellos,
// nunca sobre cupos reales ya existentes).
async function cuposCreadosEnCorrida(): Promise<string[]> {
  const previos = idsPrevios.get('id_cupo')
  if (!previos) return []
  const filas = await prisma.cupo.findMany({ select: { id_cupo: true } })
  return filas.filter((f) => !previos.has(f.id_cupo)).map((f) => f.id_cupo)
}

beforeAll(async () => {
  const admin = await prisma.usuario.findUnique({ where: { email_contacto: 'admin@unifit.edu.co' } })
  const entrenador = await prisma.usuario.findUnique({ where: { email_contacto: 'entrenador@unifit.edu.co' } })
  const directo = await prisma.usuario.findUnique({ where: { email_contacto: 'directo@unifit.edu.co' } })
  const pendiente = await prisma.usuario.findUnique({ where: { email_contacto: 'pendiente@unifit.edu.co' } })

  adminId = admin!.id_usuario
  entrenadorId = entrenador!.id_usuario
  directoId = directo!.id_usuario
  pendienteId = pendiente!.id_usuario

  await tomarIdsExistentes()
})

afterAll(async () => {
  await borrarSoloCreadosEnCorrida()
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

  it('PUT /agenda/:id - admin reprograma fecha y bloque de cita (sin cupo)', async () => {
    const createRes = await request(app)
      .post('/api/agenda')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        id_usuario: directoId,
        fecha: '2026-12-07',
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
        hora_inicio: '17:00',
      })

    expect(res.status).toBe(200)
    expect(res.body.id_agenda).toBe(citaEditableId)
    expect(res.body.fecha.slice(0, 10)).toBe('2026-12-08')
    // hora_inicio viaja tal cual el bloque elegido (sin corrimiento de zona horaria)
    expect(res.body.hora_inicio).toBe('17:00:00')
  })

  it('PUT /agenda/:id - reprograma a un bloque ocupado → 409', async () => {
    const res = await request(app)
      .put(`/api/agenda/${citaEditableId}`)
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        fecha: '2026-12-01',
        hora_inicio: '09:00',
      })

    expect(res.status).toBe(409)
  })

  it('POST /agenda - hora que no es inicio de bloque → 400', async () => {
    const res = await request(app)
      .post('/api/agenda')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        id_usuario: directoId,
        fecha: '2026-12-08',
        hora_inicio: '15:30:00',
        tipo: 'seguimiento',
      })

    expect(res.status).toBe(400)
    expect(res.body.mensaje).toContain('bloque')
  })

  it('POST /agenda - fecha pasada → 400', async () => {
    const res = await request(app)
      .post('/api/agenda')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        id_usuario: directoId,
        fecha: '2019-01-05',
        hora_inicio: '10:00',
        tipo: 'registro',
      })

    expect(res.status).toBe(400)
    expect(res.body.mensaje).toContain('pasados')
  })

  it('PUT /agenda/:id - reprogramar a fecha pasada → 400', async () => {
    const res = await request(app)
      .put(`/api/agenda/${citaEditableId}`)
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({ fecha: '2019-01-06' })

    expect(res.status).toBe(400)
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
        fecha_inicio: '2026-12-09',
        fecha_fin: '2026-12-09',
        horarios_por_dia: [
          { dia: 'mié', rangos: [{ inicio: '06:00', fin: '08:00' }, { inicio: '14:00', fin: '16:00' }] },
        ],
      })

    expect(res.status).toBe(201)
    expect(res.body.count).toBe(2)

    const cupos = await cuposCreadosEnCorrida()
    const cupo = await prisma.cupo.findFirst({ where: { agenda: { is: null }, id_cupo: { in: cupos } } })
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

  it('POST /cupos/publicar - fecha pasada → 400', async () => {
    const res = await request(app)
      .post('/api/cupos/publicar')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        fecha_inicio: '2019-01-05',
        fecha_fin: '2019-01-05',
        horarios_por_dia: [{ dia: 'sáb', rangos: [{ inicio: '08:00', fin: '09:00' }] }],
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

  it('POST /cupos/:id/reservar - segundo cupo el mismo día del mismo usuario → 400', async () => {
    const cupos = await cuposCreadosEnCorrida()
    const cupoDiaLibre = await prisma.cupo.findFirst({ where: { agenda: { is: null }, id_cupo: { in: cupos } } })
    expect(cupoDiaLibre).toBeTruthy()
    const res = await request(app)
      .post(`/api/cupos/${cupoDiaLibre!.id_cupo}/reservar`)
      .set('Authorization', `Bearer ${token('usuarioToken')}`)

    expect(res.status).toBe(400)
  })

  it('POST /cupos/:id/reservar - usuario pendiente puede reservar (excepción)', async () => {
    const cuposLibres = await cuposCreadosEnCorrida()
    const cupo = await prisma.cupo.findFirst({ where: { agenda: { is: null }, id_cupo: { in: cuposLibres } } })
    const res = await request(app)
      .post(`/api/cupos/${cupo!.id_cupo}/reservar`)
      .set('Authorization', `Bearer ${token('pendienteToken')}`)

    expect(res.status).toBe(201)
  })

  it('PUT /agenda/:id - reprogramar cita de cupo libera el cupo original', async () => {
    const res = await request(app)
      .put(`/api/agenda/${citaConCupoId}`)
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({ fecha: '2026-12-10' })

    expect(res.status).toBe(200)
    expect(res.body.id_cupo).toBeNull()

    const cupos = await request(app)
      .get('/api/cupos')
      .set('Authorization', `Bearer ${token('adminToken')}`)
    const cupoLiberado = cupos.body.find((c: any) => c.id_cupo === cupoId)
    expect(cupoLiberado.reserva).toBeNull()
  })
})

describe.sequential('Cupos - Quitar cupo (DELETE)', () => {
  it('DELETE /cupos/:id - admin elimina cupo libre → 200 y ya no aparece', async () => {
    await request(app)
      .post('/api/cupos/publicar')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        fecha_inicio: '2026-12-05',
        fecha_fin: '2026-12-05',
        horarios_por_dia: [{ dia: 'sáb', rangos: [{ inicio: '08:00', fin: '09:00' }] }],
      })
      .expect(201)

    const cupo = await prisma.cupo.findFirst({
      where: { fecha: new Date('2026-12-05T00:00:00'), agenda: { is: null } },
    })
    expect(cupo).not.toBeNull()

    const del = await request(app)
      .delete(`/api/cupos/${cupo!.id_cupo}`)
      .set('Authorization', `Bearer ${token('adminToken')}`)
    expect(del.status).toBe(200)

    const cupos = await request(app)
      .get('/api/cupos')
      .set('Authorization', `Bearer ${token('adminToken')}`)
    expect(cupos.status).toBe(200)
    expect(cupos.body.find((c: any) => c.id_cupo === cupo!.id_cupo)).toBeUndefined()
  })

  it('DELETE /cupos/:id - cupo con cita ligada → 400', async () => {
    await request(app)
      .post('/api/cupos/publicar')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        fecha_inicio: '2026-12-06',
        fecha_fin: '2026-12-06',
        horarios_por_dia: [{ dia: 'dom', rangos: [{ inicio: '09:00', fin: '10:00' }] }],
      })
      .expect(201)

    const cupo = await prisma.cupo.findFirst({
      where: { fecha: new Date('2026-12-06T00:00:00'), agenda: { is: null } },
    })
    const reserva = await request(app)
      .post(`/api/cupos/${cupo!.id_cupo}/reservar`)
      .set('Authorization', `Bearer ${token('usuarioToken')}`)
    expect(reserva.status).toBe(201)

    const del = await request(app)
      .delete(`/api/cupos/${cupo!.id_cupo}`)
      .set('Authorization', `Bearer ${token('adminToken')}`)
    expect(del.status).toBe(400)
  })

  it('DELETE /cupos/:id - cupo inexistente → 404', async () => {
    const del = await request(app)
      .delete('/api/cupos/00000000-0000-4000-8000-000000000000')
      .set('Authorization', `Bearer ${token('adminToken')}`)
    expect(del.status).toBe(404)
  })

  it('DELETE /cupos/:id - entrenador NO puede quitar cupos → 403', async () => {
    const del = await request(app)
      .delete('/api/cupos/00000000-0000-4000-8000-000000000000')
      .set('Authorization', `Bearer ${token('entrenadorToken')}`)
    expect(del.status).toBe(403)
  })

  it('DELETE /cupos/:id - sin token → 401', async () => {
    const del = await request(app).delete('/api/cupos/00000000-0000-4000-8000-000000000000')
    expect(del.status).toBe(401)
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

describe.sequential('Agenda - Bloques, opción A y cancelación', () => {
  let cupoOpA: string
  let citaResA: string
  let cupoB: string
  let citaDePendiente: string

  const cupoDeBloque = async (fecha: string, hora: string) => {
    const cuposCorrida = await cuposCreadosEnCorrida()
    const c = await prisma.cupo.findFirst({
      where: { id_cupo: { in: cuposCorrida }, fecha: new Date(fecha), hora_inicio: new Date(`1970-01-01T${hora}Z`) },
    })
    return c!.id_cupo
  }

  it('POST /agenda - cita directa en bloque con cupo público libre lo consume (opción A)', async () => {
    const pub = await request(app)
      .post('/api/cupos/publicar')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        fecha_inicio: '2026-12-15',
        fecha_fin: '2026-12-15',
        horarios_por_dia: [{ dia: 'mar', rangos: [{ inicio: '09:00', fin: '10:00' }] }],
      })
    expect(pub.status).toBe(201)

    const res = await request(app)
      .post('/api/agenda')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({ id_usuario: directoId, fecha: '2026-12-15', hora_inicio: '09:00', tipo: 'valoracion' })

    expect(res.status).toBe(201)
    expect(res.body.id_cupo).toBeDefined()
    cupoOpA = res.body.id_cupo

    const disponibles = await request(app)
      .get('/api/cupos/disponibles')
      .set('Authorization', `Bearer ${token('usuarioToken')}`)
    expect(disponibles.body.some((c: any) => c.id_cupo === cupoOpA)).toBe(false)
  })

  it('POST /agenda - cita directa SIN cupo en bloque libre', async () => {
    const res = await request(app)
      .post('/api/agenda')
      .set('Authorization', `Bearer ${token('entrenadorToken')}`)
      .send({ id_usuario: directoId, fecha: '2026-12-18', hora_inicio: '10:00', tipo: 'valoracion' })

    expect(res.status).toBe(201)
    expect(res.body.id_cupo).toBeNull()
  })

  it('POST /agenda - segundo intento en bloque ocupado → 409', async () => {
    const res = await request(app)
      .post('/api/agenda')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({ id_usuario: directoId, fecha: '2026-12-18', hora_inicio: '10:00', tipo: 'seguimiento' })

    expect(res.status).toBe(409)
  })

  it('PUT /agenda/:id - reprogramar libera el cupo anterior y toma el del destino', async () => {
    const pub = await request(app)
      .post('/api/cupos/publicar')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        fecha_inicio: '2026-12-16',
        fecha_fin: '2026-12-16',
        horarios_por_dia: [{ dia: 'mié', rangos: [{ inicio: '09:00', fin: '10:00' }, { inicio: '10:00', fin: '11:00' }] }],
      })
    expect(pub.status).toBe(201)

    const crear = await request(app)
      .post('/api/agenda')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({ id_usuario: directoId, fecha: '2026-12-16', hora_inicio: '09:00', tipo: 'valoracion' })
    expect(crear.status).toBe(201)
    citaResA = crear.body.id_agenda
    const cupoA = await cupoDeBloque('2026-12-16', '09:00')

    const res = await request(app)
      .put(`/api/agenda/${citaResA}`)
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({ hora_inicio: '10:00' })

    expect(res.status).toBe(200)
    expect(res.body.hora_inicio).toBe('10:00:00')
    cupoB = res.body.id_cupo

    const cupos = await request(app).get('/api/cupos').set('Authorization', `Bearer ${token('adminToken')}`)
    expect(cupos.body.find((c: any) => c.id_cupo === cupoA).reserva).toBeNull()
    expect(cupos.body.find((c: any) => c.id_cupo === cupoB).reserva.id_agenda).toBe(citaResA)
  })

  it('POST /agenda/:id/cancelar - dueño cancela cita futura y libera el cupo', async () => {
    const res = await request(app)
      .post(`/api/agenda/${citaResA}/cancelar`)
      .set('Authorization', `Bearer ${token('usuarioToken')}`)

    expect(res.status).toBe(200)
    expect(res.body.estado).toBe('cancelado')
    expect(res.body.id_cupo).toBeNull()

    const cupos = await request(app).get('/api/cupos').set('Authorization', `Bearer ${token('adminToken')}`)
    expect(cupos.body.find((c: any) => c.id_cupo === cupoB).reserva).toBeNull()
  })

  it('POST /agenda/:id/cancelar - cita ya cancelada → 400', async () => {
    const res = await request(app)
      .post(`/api/agenda/${citaResA}/cancelar`)
      .set('Authorization', `Bearer ${token('adminToken')}`)

    expect(res.status).toBe(400)
  })

  it('POST /agenda/:id/cancelar - dueño con menos de 24h de antelación → 400; staff no tiene límite', async () => {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const admin = await prisma.usuario.findUnique({ where: { email_contacto: 'admin@unifit.edu.co' } })
    const citaHoy = await prisma.agenda.create({
      data: {
        id_usuario: directoId,
        id_creador: admin!.id_usuario,
        fecha: hoy,
        hora_inicio: new Date('1970-01-01T10:00:00Z'),
        hora_fin: new Date('1970-01-01T11:00:00Z'),
        tipo: 'registro',
      },
    })
    const hoyId = citaHoy.id_agenda

    const dueño = await request(app)
      .post(`/api/agenda/${hoyId}/cancelar`)
      .set('Authorization', `Bearer ${token('usuarioToken')}`)
    expect(dueño.status).toBe(400)
    expect(dueño.body.mensaje).toContain('24 horas')

    const staff = await request(app)
      .post(`/api/agenda/${hoyId}/cancelar`)
      .set('Authorization', `Bearer ${token('adminToken')}`)
    expect(staff.status).toBe(200)
  })

  it('POST /agenda/:id/cancelar - usuario ajeno sin privilegio → 403; staff sí puede', async () => {
    const crear = await request(app)
      .post('/api/agenda')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({ id_usuario: pendienteId, fecha: '2026-12-20', hora_inicio: '09:00', tipo: 'registro' })
    expect(crear.status).toBe(201)
    citaDePendiente = crear.body.id_agenda

    const ajeno = await request(app)
      .post(`/api/agenda/${citaDePendiente}/cancelar`)
      .set('Authorization', `Bearer ${token('usuarioToken')}`)
    expect(ajeno.status).toBe(403)

    const staff = await request(app)
      .post(`/api/agenda/${citaDePendiente}/cancelar`)
      .set('Authorization', `Bearer ${token('entrenadorToken')}`)
    expect(staff.status).toBe(200)
  })
})

describe.sequential('Cupos - Reserva con tipo (valoración/registro)', () => {
  const publicarDia = async (fecha: string, dia: string) => {
    const res = await request(app)
      .post('/api/cupos/publicar')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        fecha_inicio: fecha,
        fecha_fin: fecha,
        horarios_por_dia: [{ dia, rangos: [{ inicio: '08:00', fin: '09:00' }] }],
      })
    expect(res.status).toBe(201)
  }

  const cupoLibreDe = async (fecha: string) =>
    prisma.cupo.findFirst({ where: { fecha: new Date(`${fecha}T00:00:00`), agenda: { is: null } } })

  it('POST /cupos/:id/reservar - tipo valoracion crea cita de valoracion y alimenta GET /usuarios/me/cita', async () => {
    await publicarDia('2026-12-11', 'vie')
    const cupo = await cupoLibreDe('2026-12-11')
    expect(cupo).not.toBeNull()

    const res = await request(app)
      .post(`/api/cupos/${cupo!.id_cupo}/reservar`)
      .set('Authorization', `Bearer ${token('pendienteToken')}`)
      .send({ tipo: 'valoracion' })

    expect(res.status).toBe(201)
    expect(res.body.tipo).toBe('valoracion')
    expect(res.body.observaciones).toContain('Valoración')

    const miCita = await request(app)
      .get('/api/usuarios/me/cita')
      .set('Authorization', `Bearer ${token('pendienteToken')}`)
    expect(miCita.status).toBe(200)
    expect(miCita.body.tipo).toBe('valoracion')
  })

  it('POST /cupos/:id/reservar - segunda valoracion del mismo usuario → 400 y no consume el cupo', async () => {
    await publicarDia('2026-12-15', 'mar')
    const cupo = await cupoLibreDe('2026-12-15')
    expect(cupo).not.toBeNull()

    const res = await request(app)
      .post(`/api/cupos/${cupo!.id_cupo}/reservar`)
      .set('Authorization', `Bearer ${token('pendienteToken')}`)
      .send({ tipo: 'valoracion' })

    expect(res.status).toBe(400)
    expect(res.body.mensaje).toBe('Ya tienes una cita de valoración pendiente')

    const sigueLibre = await cupoLibreDe('2026-12-15')
    expect(sigueLibre).not.toBeNull()
  })

  it('POST /cupos/:id/reservar - sin tipo usa registro por defecto', async () => {
    await publicarDia('2026-12-12', 'sáb')
    const cupo = await cupoLibreDe('2026-12-12')
    expect(cupo).not.toBeNull()

    const res = await request(app)
      .post(`/api/cupos/${cupo!.id_cupo}/reservar`)
      .set('Authorization', `Bearer ${token('usuarioToken')}`)

    expect(res.status).toBe(201)
    expect(res.body.tipo).toBe('registro')
    expect(res.body.observaciones).toBe('Reservado a través de cupo')
  })

  it('POST /cupos/:id/reservar - tipo inválido → 400 y no consume el cupo', async () => {
    await publicarDia('2026-12-14', 'lun')
    const cupo = await cupoLibreDe('2026-12-14')
    expect(cupo).not.toBeNull()

    const res = await request(app)
      .post(`/api/cupos/${cupo!.id_cupo}/reservar`)
      .set('Authorization', `Bearer ${token('usuarioToken')}`)
      .send({ tipo: 'otro' })

    expect(res.status).toBe(400)

    const sigueLibre = await cupoLibreDe('2026-12-14')
    expect(sigueLibre).not.toBeNull()
  })
})
