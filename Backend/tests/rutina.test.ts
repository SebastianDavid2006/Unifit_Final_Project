import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import app from '../src/app'
import { prisma } from '../src/utils/prisma'

let adminId: string
let entrenadorId: string
let directoId: string
let inactivoId: string
let pendienteId: string
let ejercicioId1: string
let ejercicioId2: string
let rutinaId: string
let directoRutinaId: string
let originalParqDirecto: boolean
let valoracionId: string

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

  for (let i = 0; i < 5; i++) {
    await prisma.valoracion.create({
      data: {
        id_usuario: directoId,
        id_creador: adminId,
        nivel_actividad: 'moderado',
        tipo_antecedentes: ['osteomuscular'],
        dias_disponibles: ['lunes', 'miercoles', 'viernes'],
      },
    })
  }

  await prisma.sesionRutina.deleteMany()
  await prisma.rutinaEjercicio.deleteMany()
  await prisma.rutina.deleteMany()
})

afterAll(async () => {
  if (directoId) await prisma.usuario.update({ where: { id_usuario: directoId }, data: { parq_realizado: originalParqDirecto } }).catch(() => {})
  await prisma.sesionRutina.deleteMany()
  await prisma.rutinaEjercicio.deleteMany()
  await prisma.rutina.deleteMany()
  await prisma.valoracion.deleteMany({ where: { id_usuario: directoId } }).catch(() => {})
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
      .put(`/api/rutinas/${rutinaId}`)
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        nombre: 'Rutina Fuerza V2',
        nivel: 'avanzado',
      })

    expect(res.status).toBe(200)
    expect(res.body.nombre).toBe('Rutina Fuerza V2')
    expect(res.body.nivel).toBe('avanzado')
  })

  it('PUT /rutinas/:id - entrenador puede editar', async () => {
    const res = await request(app)
      .put(`/api/rutinas/${rutinaId}`)
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

describe('Rutina - Auto-asignación de valoración', () => {
  it('POST /rutinas - auto-asigna id_valoracion si hay valoración reciente sin rutina', async () => {
    const valoracion = await prisma.valoracion.findFirst({
      where: { id_usuario: directoId, activo: true, rutina: null },
      orderBy: { fecha_creacion: 'desc' },
    })

    if (!valoracion) return

    const res = await request(app)
      .post('/api/rutinas')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        id_usuario: directoId,
        nombre: 'Rutina con Valoración',
        ejercicios: [
          {
            id_ejercicio: ejercicioId1,
            dia_semana: 'lunes',
            series: 3,
            repeticiones_min: 10,
          },
        ],
      })

    expect(res.status).toBe(201)

    const rutina = await prisma.rutina.findUnique({
      where: { id_rutina: res.body.id_rutina },
    })
    expect(rutina?.id_valoracion).toBe(valoracion.id_valoracion)

    await request(app)
      .put(`/api/rutinas/${res.body.id_rutina}/desactivar`)
      .set('Authorization', `Bearer ${token('adminToken')}`)
  })

  it('POST /rutinas - sin valoración disponible → 400', async () => {
    const res = await request(app)
      .post('/api/rutinas')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        id_usuario: inactivoId,
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
