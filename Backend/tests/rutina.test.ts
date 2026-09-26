import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import app from '../src/app'
import { prisma } from '../src/utils/prisma'
import { normalizarDia } from '../src/services/ai.service'

// El "día de hoy" normalizado (sin acentos) — los fixtures de sesión usan HOY
// para que la suite pase cualquier día de la semana.
const HOY = normalizarDia(new Date().toLocaleDateString('es-CO', { weekday: 'long' }))
const esDomingo = HOY === 'domingo'
// Los domingos no hay entrenamiento por diseño (el enum Prisma no admite domingo),
// así que los casos "éxito" de sesión no aplican; se saltan con it.skipIf.
const DIA_MUESTRA = esDomingo ? 'lunes' : HOY
const OTRO_DIA = HOY === 'lunes' ? 'martes' : 'lunes'

let adminId: string
let entrenadorId: string
let directoId: string
let inactivoId: string
let pendienteId: string
let ejercicioId1: string
let ejercicioId2: string
let rutinaId: string
let directoRutinaId: string
let sesionRutinaId: string
let rutinaSegundaId: string
let originalParqDirecto: boolean
let valoracionId: string
let valoracionIds: string[] = []
let otraValoracionId: string
const EMAIL_SEGUNDO = 'segundo_test@unifit.edu.co'

// Limpieza acotada: solo se eliminan los registros creados durante ESTA corrida,
// nunca los que ya existían (datos de trabajo reales del usuario).
const TABLAS_LIMPIEZA: Array<{ model: any; id: string }> = [
  { model: prisma.sesionRutina, id: 'id_sesion' },
  { model: prisma.rutinaEjercicio, id: 'id_rutina_ejercicio' },
  { model: prisma.rutina, id: 'id_rutina' },
  { model: prisma.valoracion, id: 'id_valoracion' },
]
const idsPrevios = new Map<string, Set<string>>()

async function tomarIdsExistentes(): Promise<void> {
  for (const tabla of TABLAS_LIMPIEZA) {
    const filas = await tabla.model.findMany({ select: { [tabla.id]: true } })
    idsPrevios.set(tabla.id, new Set(filas.map((f: any) => f[tabla.id])))
  }
}

// El orden respeta las claves foráneas (hijos antes que padres).
async function borrarSoloCreadosEnCorrida(): Promise<void> {
  for (const tabla of TABLAS_LIMPIEZA) {
    const previos = idsPrevios.get(tabla.id)
    if (!previos) continue
    const filas = await tabla.model.findMany({ select: { [tabla.id]: true } })
    const nuevos = filas.filter((f: any) => !previos.has(f[tabla.id])).map((f: any) => f[tabla.id])
    if (nuevos.length) await tabla.model.deleteMany({ where: { [tabla.id]: { in: nuevos } } })
  }
}

beforeAll(async () => {
  const admin = await prisma.usuario.findUnique({ where: { email_contacto: 'admin@unifit.edu.co' } })
  const entrenador = await prisma.usuario.findUnique({ where: { email_contacto: 'entrenador@unifit.edu.co' } })
  const directo = await prisma.usuario.findUnique({ where: { email_contacto: 'directo@unifit.edu.co' } })
  const inactivo = await prisma.usuario.findUnique({ where: { email_contacto: 'inactivo@unifit.edu.co' } })
  const pendiente = await prisma.usuario.findUnique({ where: { email_contacto: 'pendiente@unifit.edu.co' } })

  adminId = admin!.id_usuario
  entrenadorId = entrenador!.id_usuario
  directoId = directo!.id_usuario
  inactivoId = inactivo!.id_usuario
  pendienteId = pendiente!.id_usuario
  originalParqDirecto = directo!.parq_realizado

  await prisma.usuario.update({ where: { id_usuario: directoId }, data: { parq_realizado: true } })

  // Idempotencia: si una corrida previa dejó al usuario transitorio a medio
  // camino, se borra en orden (hijos antes que padres) antes de recrearlo.
  const segundoPrevio = await prisma.usuario.findUnique({ where: { email_contacto: EMAIL_SEGUNDO } })
  if (segundoPrevio) {
    const rutinasPrevias = await prisma.rutina.findMany({
      where: { id_usuario: segundoPrevio.id_usuario },
      select: { id_rutina: true },
    })
    const idsRutinas = rutinasPrevias.map(r => r.id_rutina)
    await prisma.sesionRutina.deleteMany({ where: { id_rutina: { in: idsRutinas } } }).catch(() => {})
    await prisma.rutina.deleteMany({ where: { id_usuario: segundoPrevio.id_usuario } }).catch(() => {})
    await prisma.valoracion.deleteMany({ where: { id_usuario: segundoPrevio.id_usuario } }).catch(() => {})
    await prisma.usuario.deleteMany({ where: { id_usuario: segundoPrevio.id_usuario } }).catch(() => {})
  }

  await tomarIdsExistentes()

  const ex1 = await prisma.ejercicio.create({
    data: {
      id_creador: adminId,
      nombre: 'Sentadilla con barra',
      nivel: 'intermedio',
    },
  })
  const ex2 = await prisma.ejercicio.create({
    data: {
      id_creador: adminId,
      nombre: 'Press de banca',
      nivel: 'intermedio',
    },
  })
  ejercicioId1 = ex1.id_ejercicio
  ejercicioId2 = ex2.id_ejercicio

  const valoracion = await prisma.valoracion.create({
    data: {
      id_usuario: directoId,
      id_creador: adminId,
      nivel_actividad: 'moderado',
      tipo_antecedentes: ['osteomuscular'],
      dias_disponibles: ['lunes', 'miercoles', 'viernes'],
    },
  })
  valoracionId = valoracion.id_valoracion
  valoracionIds = [valoracionId]

  for (let i = 0; i < 5; i++) {
    const v = await prisma.valoracion.create({
      data: {
        id_usuario: directoId,
        id_creador: adminId,
        nivel_actividad: 'moderado',
        tipo_antecedentes: ['osteomuscular'],
        dias_disponibles: ['lunes', 'miercoles', 'viernes'],
      },
    })
    valoracionIds.push(v.id_valoracion)
  }

  const otraValoracion = await prisma.valoracion.create({
    data: {
      id_usuario: inactivoId,
      id_creador: adminId,
      nivel_actividad: 'moderado',
      tipo_antecedentes: ['osteomuscular'],
      dias_disponibles: ['lunes', 'martes'],
    },
  })
  otraValoracionId = otraValoracion.id_valoracion

  const segundo = await prisma.usuario.create({
    data: {
      primer_nombre: 'Segundo',
      primer_apellido: 'Prueba',
      email_contacto: EMAIL_SEGUNDO,
      documento: 'SEGUNDO_TEST_001',
      genero: 'otro',
      rol: 'usuario',
      tipo_usuario: 'estudiante',
      estado: 'activo',
    },
  })
  const valoracionSegundo = await prisma.valoracion.create({
    data: {
      id_usuario: segundo.id_usuario,
      id_creador: adminId,
      nivel_actividad: 'moderado',
      tipo_antecedentes: ['osteomuscular'],
      dias_disponibles: ['lunes', 'miercoles', 'viernes'],
    },
  })
  const rutinaSegunda = await prisma.rutina.create({
    data: {
      id_usuario: segundo.id_usuario,
      id_creador: adminId,
      id_valoracion: valoracionSegundo.id_valoracion,
      nombre: 'Rutina Segundo',
      nivel: 'intermedio',
    },
  })
  rutinaSegundaId = rutinaSegunda.id_rutina
  const tokenSegundo = jwt.sign(
    {
      id_usuario: segundo.id_usuario,
      rol: 'usuario',
      tipo_usuario: 'estudiante',
      estado: 'activo',
      debe_cambiar_password: false,
    },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' as jwt.SignOptions['expiresIn'] },
  )
  ;(globalThis as any)['segundoToken'] = tokenSegundo
})

afterAll(async () => {
  if (directoId) await prisma.usuario.update({ where: { id_usuario: directoId }, data: { parq_realizado: originalParqDirecto } }).catch(() => {})
  await borrarSoloCreadosEnCorrida()
  // El usuario transitorio se borra explícito (la rutina/valoración ya las limpió borrarSoloCreadosEnCorrida).
  await prisma.usuario.deleteMany({ where: { email_contacto: EMAIL_SEGUNDO } }).catch(() => {})
  await prisma.ejercicio.deleteMany({ where: { id_ejercicio: { in: [ejercicioId1, ejercicioId2] } } }).catch(() => {})
})

function token(key: string): string {
  return (globalThis as any)[key]
}

describe.sequential('Rutina - CRUD', () => {
  it('POST /rutinas - admin crea rutina con ejercicios', async () => {
    const res = await request(app)
      .post('/api/rutinas')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        id_usuario: directoId,
        id_valoracion: valoracionIds[0],
        nombre: 'Rutina Fuerza',
        duracion: '8 semanas',
        nivel: 'intermedio',
        ejercicios: [
          {
            id_ejercicio: ejercicioId1,
            dia_semana: 'lunes',
            series: 4,
            repeticiones_min: 8,
            repeticiones_max: 10,
            descanso: 90,
          },
          {
            id_ejercicio: ejercicioId2,
            dia_semana: 'miercoles',
            series: 3,
            repeticiones_min: 12,
            descanso: 60,
            observaciones: 'Controlar la bajada',
          },
        ],
      })

    expect(res.status).toBe(201)
    expect(res.body.id_rutina).toBeDefined()
    expect(res.body.nombre).toBe('Rutina Fuerza')
    expect(res.body.estado).toBe('activa')
    rutinaId = res.body.id_rutina
  })

  it('POST /rutinas - entrenador crea segunda rutina (seguimiento)', async () => {
    const res = await request(app)
      .post('/api/rutinas')
      .set('Authorization', `Bearer ${token('entrenadorToken')}`)
      .send({
        id_usuario: directoId,
        id_valoracion: valoracionIds[1],
        nombre: 'Rutina Cardio',
        nivel: 'principiante',
        ejercicios: [
          {
            id_ejercicio: ejercicioId1,
            dia_semana: 'viernes',
            series: 3,
            repeticiones_min: 15,
            descanso: 45,
          },
        ],
      })

    expect(res.status).toBe(201)
    directoRutinaId = res.body.id_rutina
  })

  it('POST /rutinas - usuario no puede crear rutina (403)', async () => {
    const res = await request(app)
      .post('/api/rutinas')
      .set('Authorization', `Bearer ${token('usuarioToken')}`)
      .send({
        id_usuario: directoId,
        nombre: 'Rutina test',
        ejercicios: [
          {
            id_ejercicio: ejercicioId1,
            dia_semana: 'lunes',
            series: 3,
            repeticiones_min: 10,
          },
        ],
      })

    expect(res.status).toBe(403)
  })

  it('GET /rutinas - admin puede listar todas', async () => {
    const res = await request(app)
      .get('/api/rutinas')
      .set('Authorization', `Bearer ${token('adminToken')}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThanOrEqual(2)
  })

  it('GET /rutinas - entrenador puede listar todas', async () => {
    const res = await request(app)
      .get('/api/rutinas')
      .set('Authorization', `Bearer ${token('entrenadorToken')}`)

    expect(res.status).toBe(200)
  })

  it('GET /rutinas - usuario no puede listar todas (403)', async () => {
    const res = await request(app)
      .get('/api/rutinas')
      .set('Authorization', `Bearer ${token('usuarioToken')}`)

    expect(res.status).toBe(403)
  })

  it('GET /rutinas/:id - propietario ve su rutina con ejercicios', async () => {
    const res = await request(app)
      .get(`/api/rutinas/${rutinaId}`)
      .set('Authorization', `Bearer ${token('usuarioToken')}`)

    expect(res.status).toBe(200)
    expect(res.body.id_rutina).toBe(rutinaId)
    expect(res.body.ejercicios).toBeDefined()
    expect(res.body.ejercicios.length).toBe(2)
  })

  it('GET /rutinas/:id - admin ve cualquier rutina', async () => {
    const res = await request(app)
      .get(`/api/rutinas/${rutinaId}`)
      .set('Authorization', `Bearer ${token('adminToken')}`)

    expect(res.status).toBe(200)
  })

  it('GET /rutinas/usuario/:id - propietario ve sus rutinas', async () => {
    const res = await request(app)
      .get(`/api/rutinas/usuario/${directoId}`)
      .set('Authorization', `Bearer ${token('usuarioToken')}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThanOrEqual(2)
  })

  it('PUT /rutinas/:id - admin puede editar', async () => {
    const res = await request(app)
      .put(`/api/rutinas/${directoRutinaId}`)
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        nombre: 'Rutina Cardio V2',
        nivel: 'avanzado',
      })

    expect(res.status).toBe(200)
    expect(res.body.nombre).toBe('Rutina Cardio V2')
    expect(res.body.nivel).toBe('avanzado')
  })

  it('PUT /rutinas/:id - entrenador puede editar', async () => {
    const res = await request(app)
      .put(`/api/rutinas/${directoRutinaId}`)
      .set('Authorization', `Bearer ${token('entrenadorToken')}`)
      .send({
        observaciones: 'Observación del entrenador',
      })

    expect(res.status).toBe(200)
    expect(res.body.observaciones).toBe('Observación del entrenador')
  })

  it('PUT /rutinas/:id/desactivar - admin puede desactivar', async () => {
    const res = await request(app)
      .put(`/api/rutinas/${directoRutinaId}/desactivar`)
      .set('Authorization', `Bearer ${token('adminToken')}`)

    expect(res.status).toBe(200)
  })

  it('PUT /rutinas/:id/desactivar - entrenador puede desactivar', async () => {
    const tempRes = await request(app)
      .post('/api/rutinas')
      .set('Authorization', `Bearer ${token('entrenadorToken')}`)
      .send({
        id_usuario: directoId,
        id_valoracion: valoracionIds[2],
        nombre: 'Para desactivar',
        ejercicios: [
          {
            id_ejercicio: ejercicioId1,
            dia_semana: 'sabado',
            series: 2,
            repeticiones_min: 10,
          },
        ],
      })
    const tempId = tempRes.body.id_rutina

    const res = await request(app)
      .put(`/api/rutinas/${tempId}/desactivar`)
      .set('Authorization', `Bearer ${token('entrenadorToken')}`)

    expect(res.status).toBe(200)
  })

  it('GET /rutinas desactivada - no aparece en listado', async () => {
    const res = await request(app)
      .get('/api/rutinas')
      .set('Authorization', `Bearer ${token('adminToken')}`)

    expect(res.status).toBe(200)
    const ids = res.body.map((r: any) => r.id_rutina)
    expect(ids).not.toContain(directoRutinaId)
  })
})

describe('Rutina - Validación de datos', () => {
  it('POST /rutinas - sin ejercicios → 400', async () => {
    const res = await request(app)
      .post('/api/rutinas')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        id_usuario: directoId,
        id_valoracion: valoracionIds[5],
        nombre: 'Sin ejercicios',
        ejercicios: [],
      })

    expect(res.status).toBe(400)
  })

  it('POST /rutinas - nombre vacío → 400', async () => {
    const res = await request(app)
      .post('/api/rutinas')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        id_usuario: directoId,
        id_valoracion: valoracionIds[5],
        nombre: '',
        ejercicios: [
          {
            id_ejercicio: ejercicioId1,
            dia_semana: 'lunes',
            series: 3,
            repeticiones_min: 10,
          },
        ],
      })

    expect(res.status).toBe(400)
  })

  it('POST /rutinas - usuario_id inexistente → 404', async () => {
    const res = await request(app)
      .post('/api/rutinas')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        id_usuario: '00000000-0000-0000-0000-000000000000',
        id_valoracion: valoracionIds[5],
        nombre: 'Test',
        ejercicios: [
          {
            id_ejercicio: ejercicioId1,
            dia_semana: 'lunes',
            series: 3,
            repeticiones_min: 10,
          },
        ],
      })

    expect(res.status).toBe(404)
  })

  it('POST /rutinas - ejercicio_id inexistente → P2003 (FK constraint)', async () => {
    const res = await request(app)
      .post('/api/rutinas')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        id_usuario: directoId,
        id_valoracion: valoracionIds[5],
        nombre: 'FK test',
        ejercicios: [
          {
            id_ejercicio: '00000000-0000-0000-0000-000000000000',
            dia_semana: 'lunes',
            series: 3,
            repeticiones_min: 10,
          },
        ],
      })

    expect(res.status).toBe(400)
  })
})

describe('Rutina - Normalización de campos', () => {
  it('POST /rutinas - normaliza duracion, nivel, dia_semana', async () => {
    const res = await request(app)
      .post('/api/rutinas')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        id_usuario: directoId,
        id_valoracion: valoracionIds[3],
        nombre: 'Rutina Normalizada',
        duracion: '8 semanas',
        nivel: 'Intermedio',
        ejercicios: [
          {
            id_ejercicio: ejercicioId1,
            dia_semana: 'Lunes',
            series: 4,
            repeticiones_min: 8,
            repeticiones_max: 10,
            descanso: 90,
          },
        ],
      })

    expect(res.status).toBe(201)
    expect(res.body.duracion).toBe('ocho_semanas')
    expect(res.body.nivel).toBe('intermedio')

    const detalle = await request(app)
      .get(`/api/rutinas/${res.body.id_rutina}`)
      .set('Authorization', `Bearer ${token('adminToken')}`)

    expect(detalle.status).toBe(200)
    const ej = detalle.body.ejercicios[0]
    expect(ej.dia_semana).toBe('lunes')
    expect(ej.orden).toBe(1)
    expect(ej.repeticiones_min).toBe(8)
    expect(ej.repeticiones_max).toBe(10)
    expect(ej.descanso).toBe(90)

    await request(app)
      .put(`/api/rutinas/${res.body.id_rutina}/desactivar`)
      .set('Authorization', `Bearer ${token('adminToken')}`)
  })

  it('POST /rutinas - solo repeticiones_min → max null', async () => {
    const res = await request(app)
      .post('/api/rutinas')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        id_usuario: directoId,
        id_valoracion: valoracionIds[4],
        nombre: 'Rutina Sin Rango',
        ejercicios: [
          {
            id_ejercicio: ejercicioId1,
            dia_semana: 'jueves',
            series: 3,
            repeticiones_min: 15,
          },
        ],
      })

    expect(res.status).toBe(201)

    const detalle = await request(app)
      .get(`/api/rutinas/${res.body.id_rutina}`)
      .set('Authorization', `Bearer ${token('adminToken')}`)

    const ej = detalle.body.ejercicios[0]
    expect(ej.repeticiones_min).toBe(15)
    expect(ej.repeticiones_max).toBeNull()

    await request(app)
      .put(`/api/rutinas/${res.body.id_rutina}/desactivar`)
      .set('Authorization', `Bearer ${token('adminToken')}`)
  })
})

describe('Rutina - Validaciones de ejercicios', () => {
  it('POST /rutinas - series > 20 → 400', async () => {
    const res = await request(app)
      .post('/api/rutinas')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        id_usuario: directoId,
        id_valoracion: valoracionIds[5],
        nombre: 'Muchas series',
        ejercicios: [
          {
            id_ejercicio: ejercicioId1,
            dia_semana: 'lunes',
            series: 25,
            repeticiones_min: 10,
          },
        ],
      })

    expect(res.status).toBe(400)
  })

  it('POST /rutinas - repeticiones_max > 100 → 400', async () => {
    const res = await request(app)
      .post('/api/rutinas')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        id_usuario: directoId,
        id_valoracion: valoracionIds[5],
        nombre: 'Muchas reps',
        ejercicios: [
          {
            id_ejercicio: ejercicioId1,
            dia_semana: 'lunes',
            series: 3,
            repeticiones_max: 150,
          },
        ],
      })

    expect(res.status).toBe(400)
  })

  it('POST /rutinas - descanso > 600 → 400', async () => {
    const res = await request(app)
      .post('/api/rutinas')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        id_usuario: directoId,
        id_valoracion: valoracionIds[5],
        nombre: 'Mucho descanso',
        ejercicios: [
          {
            id_ejercicio: ejercicioId1,
            dia_semana: 'lunes',
            series: 3,
            repeticiones_min: 10,
            descanso: 700,
          },
        ],
      })

    expect(res.status).toBe(400)
  })
})

describe('Rutina - Validación de valoración', () => {
  it('POST /rutinas - sin id_valoracion → 400 (obligatorio)', async () => {
    const res = await request(app)
      .post('/api/rutinas')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        id_usuario: directoId,
        nombre: 'Sin valoración',
        ejercicios: [
          {
            id_ejercicio: ejercicioId1,
            dia_semana: 'lunes',
            series: 3,
            repeticiones_min: 10,
          },
        ],
      })

    expect(res.status).toBe(400)
  })

  it('POST /rutinas - id_valoracion inexistente → 404', async () => {
    const res = await request(app)
      .post('/api/rutinas')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        id_usuario: directoId,
        id_valoracion: '00000000-0000-0000-0000-000000000000',
        nombre: 'Valoración inexistente',
        ejercicios: [
          {
            id_ejercicio: ejercicioId1,
            dia_semana: 'lunes',
            series: 3,
            repeticiones_min: 10,
          },
        ],
      })

    expect(res.status).toBe(404)
  })

  it('POST /rutinas - id_valoracion de otro usuario → 400', async () => {
    const res = await request(app)
      .post('/api/rutinas')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        id_usuario: directoId,
        id_valoracion: otraValoracionId,
        nombre: 'Valoración ajena',
        ejercicios: [
          {
            id_ejercicio: ejercicioId1,
            dia_semana: 'lunes',
            series: 3,
            repeticiones_min: 10,
          },
        ],
      })

    expect(res.status).toBe(400)
    expect(res.body.mensaje).toBe('La valoración no pertenece a este usuario')
  })

  it('POST /rutinas - valoración ya vinculada a otra rutina → 400', async () => {
    const res = await request(app)
      .post('/api/rutinas')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        id_usuario: directoId,
        id_valoracion: valoracionId,
        nombre: 'Segunda rutina misma valoración',
        ejercicios: [
          {
            id_ejercicio: ejercicioId1,
            dia_semana: 'lunes',
            series: 3,
            repeticiones_min: 10,
          },
        ],
      })

    expect(res.status).toBe(400)
    expect(res.body.mensaje).toBe('Esta valoración ya tiene una rutina')
  })
})

describe('Rutina - Escalada horizontal (cross-user)', () => {
  it('GET /rutinas/usuario/:id - entrenador puede ver rutinas de usuario', async () => {
    const res = await request(app)
      .get(`/api/rutinas/usuario/${directoId}`)
      .set('Authorization', `Bearer ${token('entrenadorToken')}`)

    expect(res.status).toBe(200)
  })

  it('GET /rutinas/:id - entrenador puede ver rutina de usuario', async () => {
    const res = await request(app)
      .get(`/api/rutinas/${rutinaId}`)
      .set('Authorization', `Bearer ${token('entrenadorToken')}`)

    expect(res.status).toBe(200)
  })
})

describe('Rutina - Auth guards', () => {
  it('GET /rutinas - sin token → 401', async () => {
    const res = await request(app).get('/api/rutinas')
    expect(res.status).toBe(401)
  })

  it('POST /rutinas - token inválido → 401', async () => {
    const res = await request(app)
      .post('/api/rutinas')
      .set('Authorization', 'Bearer invalid-token')
      .send({
        id_usuario: directoId,
        nombre: 'Test',
        ejercicios: [
          {
            id_ejercicio: ejercicioId1,
            dia_semana: 'lunes',
            series: 3,
            repeticiones_min: 10,
          },
        ],
      })

    expect(res.status).toBe(401)
  })

  it('GET /rutinas - usuario inactivo → 403', async () => {
    const res = await request(app)
      .get('/api/rutinas')
      .set('Authorization', `Bearer ${token('inactivoToken')}`)

    expect(res.status).toBe(403)
  })

  it('GET /rutinas - usuario pendiente → 403', async () => {
    const res = await request(app)
      .get('/api/rutinas')
      .set('Authorization', `Bearer ${token('pendienteToken')}`)

    expect(res.status).toBe(403)
  })
})

describe.sequential('Rutina - Sesiones (SesionRutina)', () => {
  let sesionFinalizadaId = ''
  let sesionCanceladaId = ''

  // Regla "1 rutina activa": las sesiones solo se prueban sobre la rutina más
  // reciente del dueño. Se crea aquí una valoración + rutina nuevas para
  // directo (quedan como su única rutina activa en este punto de la corrida).
  beforeAll(async () => {
    const valoracion = await request(app)
      .post('/api/valoraciones')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        id_usuario: directoId,
        nivel_actividad: 'activo',
        objetivos: ['salud'],
        tipo_antecedentes: [],
        dias_disponibles: ['lunes', 'miercoles'],
      })
    expect(valoracion.status).toBe(201)

    const rutina = await request(app)
      .post('/api/rutinas')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        id_usuario: directoId,
        id_valoracion: valoracion.body.id_valoracion,
        nombre: 'Rutina Sesión',
        nivel: 'intermedio',
        ejercicios: [
          {
            id_ejercicio: ejercicioId1,
            dia_semana: DIA_MUESTRA,
            series: 4,
            repeticiones_min: 8,
            repeticiones_max: 10,
            descanso: 90,
          },
        ],
      })
    expect(rutina.status).toBe(201)
    expect(rutina.body.estado).toBe('activa')
    sesionRutinaId = rutina.body.id_rutina
  })

  it.skipIf(esDomingo)('POST /rutinas/:id/sesiones - dueño inicia sesión → 201 en_progreso', async () => {
    const res = await request(app)
      .post(`/api/rutinas/${sesionRutinaId}/sesiones`)
      .set('Authorization', `Bearer ${token('usuarioToken')}`)

    expect(res.status).toBe(201)
    expect(res.body.estado).toBe('en_progreso')
    expect(res.body.hora_fin).toBeNull()
    sesionFinalizadaId = res.body.id_sesion
  })

  it.skipIf(esDomingo)('POST /rutinas/:id/sesiones - segunda sesión del mismo día → 400', async () => {
    const res = await request(app)
      .post(`/api/rutinas/${sesionRutinaId}/sesiones`)
      .set('Authorization', `Bearer ${token('usuarioToken')}`)

    expect(res.status).toBe(400)
    expect(res.body.mensaje).toBe('Ya hay una sesión en curso para hoy')
  })

  it.skipIf(esDomingo)('PUT /sesiones/:id/finalizar - dueño completa → 200 finalizada con hora_fin', async () => {
    const res = await request(app)
      .put(`/api/sesiones/${sesionFinalizadaId}/finalizar`)
      .set('Authorization', `Bearer ${token('usuarioToken')}`)

    expect(res.status).toBe(200)
    expect(res.body.estado).toBe('finalizada')
    expect(res.body.hora_fin).not.toBeNull()
  })

  it.skipIf(esDomingo)('PUT /sesiones/:id/finalizar - repetida sobre finalizada → 400', async () => {
    const res = await request(app)
      .put(`/api/sesiones/${sesionFinalizadaId}/finalizar`)
      .set('Authorization', `Bearer ${token('usuarioToken')}`)

    expect(res.status).toBe(400)
    expect(res.body.mensaje).toBe('La sesión no está en curso')
  })

  it.skipIf(esDomingo)('POST + PUT /sesiones/:id/cancelar - dueño cancela → 201/200 cancelada', async () => {
    const creada = await request(app)
      .post(`/api/rutinas/${sesionRutinaId}/sesiones`)
      .set('Authorization', `Bearer ${token('usuarioToken')}`)

    expect(creada.status).toBe(201)
    sesionCanceladaId = creada.body.id_sesion

    const res = await request(app)
      .put(`/api/sesiones/${sesionCanceladaId}/cancelar`)
      .set('Authorization', `Bearer ${token('usuarioToken')}`)

    expect(res.status).toBe(200)
    expect(res.body.estado).toBe('cancelada')
    expect(res.body.hora_fin).not.toBeNull()
  })

  it.skipIf(esDomingo)('GET /rutinas/:id/sesiones - dueño lista → 200 ordenado por fecha desc', async () => {
    const res = await request(app)
      .get(`/api/rutinas/${sesionRutinaId}/sesiones`)
      .set('Authorization', `Bearer ${token('usuarioToken')}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThanOrEqual(2)

    const fechas = res.body.map((s: any) => s.fecha)
    const descendente = [...fechas].sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    expect(fechas).toEqual(descendente)
  })

  it('GET /rutinas/:id/sesiones - admin consulta sesiones (seguimiento) → 200', async () => {
    const res = await request(app)
      .get(`/api/rutinas/${sesionRutinaId}/sesiones`)
      .set('Authorization', `Bearer ${token('adminToken')}`)

    expect(res.status).toBe(200)
  })

  it('POST /rutinas/:id/sesiones - admin NO puede iniciar sesión ajena → 403', async () => {
    const res = await request(app)
      .post(`/api/rutinas/${sesionRutinaId}/sesiones`)
      .set('Authorization', `Bearer ${token('adminToken')}`)

    expect(res.status).toBe(403)
  })

  it('PUT /sesiones/:id/finalizar y cancelar - admin NO puede accionar sesión ajena → 403', async () => {
    const finalizar = await request(app)
      .put(`/api/sesiones/${sesionCanceladaId}/finalizar`)
      .set('Authorization', `Bearer ${token('adminToken')}`)

    expect(finalizar.status).toBe(403)

    const cancelar = await request(app)
      .put(`/api/sesiones/${sesionCanceladaId}/cancelar`)
      .set('Authorization', `Bearer ${token('adminToken')}`)

    expect(cancelar.status).toBe(403)
  })

  it('POST /rutinas/:id/sesiones - otro usuario no puede iniciar → 403', async () => {
    const res = await request(app)
      .post(`/api/rutinas/${sesionRutinaId}/sesiones`)
      .set('Authorization', `Bearer ${token('segundoToken')}`)

    expect(res.status).toBe(403)
  })

  it('Cruzado inverso - sesión de otro usuario: ni dueño ajeno ni admin la accionan → 403', async () => {
    const sesionSegunda = await prisma.sesionRutina.create({
      data: { id_rutina: rutinaSegundaId, fecha: new Date(), hora_inicio: new Date() },
    })

    const comoAjeno = await request(app)
      .put(`/api/sesiones/${sesionSegunda.id_sesion}/finalizar`)
      .set('Authorization', `Bearer ${token('usuarioToken')}`)

    expect(comoAjeno.status).toBe(403)

    const comoAdmin = await request(app)
      .put(`/api/sesiones/${sesionSegunda.id_sesion}/cancelar`)
      .set('Authorization', `Bearer ${token('adminToken')}`)

    expect(comoAdmin.status).toBe(403)

    const comoDueño = await request(app)
      .put(`/api/sesiones/${sesionSegunda.id_sesion}/finalizar`)
      .set('Authorization', `Bearer ${token('segundoToken')}`)

    expect(comoDueño.status).toBe(200)
    expect(comoDueño.body.estado).toBe('finalizada')
  })

  it('Recursos inexistentes → 404 (rutina y sesión)', async () => {
    const u = '00000000-0000-0000-0000-000000000000'

    const post = await request(app)
      .post(`/api/rutinas/${u}/sesiones`)
      .set('Authorization', `Bearer ${token('usuarioToken')}`)
    expect(post.status).toBe(404)

    const get = await request(app)
      .get(`/api/rutinas/${u}/sesiones`)
      .set('Authorization', `Bearer ${token('usuarioToken')}`)
    expect(get.status).toBe(404)

    const fin = await request(app)
      .put(`/api/sesiones/${u}/finalizar`)
      .set('Authorization', `Bearer ${token('usuarioToken')}`)
    expect(fin.status).toBe(404)
  })

  it('PUT /sesiones/:id/finalizar - sin token → 401', async () => {
    const res = await request(app).put(`/api/sesiones/${sesionFinalizadaId}/finalizar`)
    expect(res.status).toBe(401)
  })

  it.skipIf(esDomingo)('COLGADA - sesión en_progreso de ayer se auto-cancela al iniciar hoy', async () => {
    const ayer = new Date(Date.now() - 24 * 60 * 60 * 1000)
    ayer.setHours(10, 0, 0, 0)

    const colgada = await prisma.sesionRutina.create({
      data: { id_rutina: sesionRutinaId, fecha: ayer, hora_inicio: ayer },
    })

    const res = await request(app)
      .post(`/api/rutinas/${sesionRutinaId}/sesiones`)
      .set('Authorization', `Bearer ${token('usuarioToken')}`)

    expect(res.status).toBe(201)

    const colgadaTras = await prisma.sesionRutina.findUnique({ where: { id_sesion: colgada.id_sesion } })
    const nueva = await prisma.sesionRutina.findUnique({ where: { id_sesion: res.body.id_sesion } })

    expect(colgadaTras!.estado).toBe('cancelada')
    expect(colgadaTras!.hora_fin).not.toBeNull()
    expect(nueva!.estado).toBe('en_progreso')
    expect(nueva!.hora_fin).toBeNull()
  })

  it('DÍA - hoy no es un día de entrenamiento de la rutina → 400', async () => {
    // Rutina activa con ejercicios SOLO en OTRO_DIA (≠ hoy): no se puede entrenar el día de hoy.
    const valoracion = await request(app)
      .post('/api/valoraciones')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        id_usuario: directoId,
        nivel_actividad: 'activo',
        objetivos: ['salud'],
        tipo_antecedentes: [],
        dias_disponibles: [OTRO_DIA],
      })
    expect(valoracion.status).toBe(201)

    const rutina = await request(app)
      .post('/api/rutinas')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        id_usuario: directoId,
        id_valoracion: valoracion.body.id_valoracion,
        nombre: 'Rutina Día Ajeno',
        nivel: 'intermedio',
        ejercicios: [
          {
            id_ejercicio: ejercicioId1,
            dia_semana: OTRO_DIA,
            series: 3,
            repeticiones_min: 10,
          },
        ],
      })
    expect(rutina.status).toBe(201)
    expect(rutina.body.estado).toBe('activa')

    const res = await request(app)
      .post(`/api/rutinas/${rutina.body.id_rutina}/sesiones`)
      .set('Authorization', `Bearer ${token('usuarioToken')}`)

    expect(res.status).toBe(400)
    expect(res.body.mensaje).toBe('Hoy no es un día de entrenamiento de esta rutina')

    await request(app)
      .put(`/api/rutinas/${rutina.body.id_rutina}/desactivar`)
      .set('Authorization', `Bearer ${token('adminToken')}`)
  })
})

describe.sequential('Rutina - Única activa (estado finalizada)', () => {
  let rutinaPreviaId = ''
  let rutinaNuevaId = ''
  let valoracionNuevaId = ''

  it('POST /rutinas - crear una nueva finaliza la anterior del mismo usuario', async () => {
    const valoracionPrevia = await request(app)
      .post('/api/valoraciones')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        id_usuario: directoId,
        nivel_actividad: 'activo',
        objetivos: ['salud'],
        tipo_antecedentes: [],
        dias_disponibles: ['lunes'],
      })
    expect(valoracionPrevia.status).toBe(201)

    const previa = await request(app)
      .post('/api/rutinas')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        id_usuario: directoId,
        id_valoracion: valoracionPrevia.body.id_valoracion,
        nombre: 'Rutina Previa',
        nivel: 'intermedio',
        ejercicios: [
          { id_ejercicio: ejercicioId1, dia_semana: 'lunes', series: 3, repeticiones_min: 10, repeticiones_max: 12 },
        ],
      })
    expect(previa.status).toBe(201)
    expect(previa.body.estado).toBe('activa')
    rutinaPreviaId = previa.body.id_rutina

    const valoracionNueva = await request(app)
      .post('/api/valoraciones')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        id_usuario: directoId,
        nivel_actividad: 'activo',
        objetivos: ['salud'],
        tipo_antecedentes: [],
        dias_disponibles: ['martes'],
      })
    expect(valoracionNueva.status).toBe(201)
    valoracionNuevaId = valoracionNueva.body.id_valoracion

    const nueva = await request(app)
      .post('/api/rutinas')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        id_usuario: directoId,
        id_valoracion: valoracionNuevaId,
        nombre: 'Rutina Nueva',
        nivel: 'principiante',
        ejercicios: [
          { id_ejercicio: ejercicioId2, dia_semana: 'martes', series: 3, repeticiones_min: 12, repeticiones_max: 15 },
        ],
      })
    expect(nueva.status).toBe(201)
    expect(nueva.body.estado).toBe('activa')
    rutinaNuevaId = nueva.body.id_rutina

    const previaTras = await prisma.rutina.findUnique({ where: { id_rutina: rutinaPreviaId } })
    expect(previaTras!.estado).toBe('finalizada')
  })

  it('POST /rutinas/:id/sesiones - rutina finalizada NO permite iniciar sesión → 400', async () => {
    const res = await request(app)
      .post(`/api/rutinas/${rutinaPreviaId}/sesiones`)
      .set('Authorization', `Bearer ${token('usuarioToken')}`)

    expect(res.status).toBe(400)
    expect(res.body.mensaje).toBe('La rutina no está activa — no se pueden iniciar sesiones en ella')
  })

  it('PUT /rutinas/:id - editar rutina finalizada → 400', async () => {
    const res = await request(app)
      .put(`/api/rutinas/${rutinaPreviaId}`)
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({ nombre: 'Intento de edición' })

    expect(res.status).toBe(400)
    expect(res.body.mensaje).toBe('No se puede editar una rutina finalizada')
  })

  it('GET /rutinas/usuario/:id - incluye finalizada y excluye cancelada', async () => {
    const desactivar = await request(app)
      .put(`/api/rutinas/${rutinaNuevaId}/desactivar`)
      .set('Authorization', `Bearer ${token('adminToken')}`)
    expect(desactivar.status).toBe(200)
    const rutinaNuevaEnBD = await prisma.rutina.findUnique({ where: { id_rutina: rutinaNuevaId } })
    expect(rutinaNuevaEnBD!.estado).toBe('cancelada')

    const res = await request(app)
      .get(`/api/rutinas/usuario/${directoId}`)
      .set('Authorization', `Bearer ${token('usuarioToken')}`)

    expect(res.status).toBe(200)
    const ids = res.body.map((r: any) => r.id_rutina)
    expect(ids).toContain(rutinaPreviaId)
    expect(ids).not.toContain(rutinaNuevaId)
  })
})
