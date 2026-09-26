import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import app from '../src/app'
import { prisma } from '../src/utils/prisma'

let adminId: string
let entrenadorId: string
let directoId: string
let inactivoId: string
let pendienteId: string
let valoracionId: string
let directoValoracionId: string
let originalParqDirecto: boolean

// Limpieza acotada: solo se eliminan los registros creados durante ESTA corrida,
// nunca los que ya existían (datos de trabajo reales del usuario).
const TABLAS_LIMPIEZA: Array<{ model: any; id: string }> = [
  { model: prisma.datosMedicos, id: 'id_datos' },
  { model: prisma.medidasCorporales, id: 'id_medidas' },
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

  await tomarIdsExistentes()
})

afterAll(async () => {
  if (directoId) await prisma.usuario.update({ where: { id_usuario: directoId }, data: { parq_realizado: originalParqDirecto } }).catch(() => {})
  await borrarSoloCreadosEnCorrida()
})

function token(key: string): string {
  return (globalThis as any)[key]
}

describe('Valoración - CRUD', () => {
  it('POST /valoraciones - admin crea valoración completa con medidas y datos médicos', async () => {
    const res = await request(app)
      .post('/api/valoraciones')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        id_usuario: directoId,
        nivel_actividad: 'activo',
        objetivos: ['ganancia_muscular'],
        objetivo_detalle: 'Ganar masa muscular',
        tipo_antecedentes: [],
        dias_disponibles: ['lunes', 'miercoles', 'viernes'],
        medidas: {
          peso: 75,
          estatura: 1.75,
          imc: 24.5,
          grasa_corporal: 18,
          masa_muscular: 32,
          masa_magra: 31,
          grasa_visceral: 8,
        },
        datos_medicos: {
          presion_arterial: '120/80',
          edad_metabolica: 25,
          agua_corporal: 58,
          resistencia_muscular: 30,
        },
      })

    expect(res.status).toBe(201)
    expect(res.body.id_valoracion).toBeDefined()
    valoracionId = res.body.id_valoracion
  })

  it('POST /valoraciones - entrenador no puede crear valoración (403)', async () => {
    const res = await request(app)
      .post('/api/valoraciones')
      .set('Authorization', `Bearer ${token('entrenadorToken')}`)
      .send({
        id_usuario: directoId,
        nivel_actividad: 'ligero',
        objetivos: ['salud'],
        tipo_antecedentes: ['cardiovascular'],
        observaciones_antecedentes: 'Controlar presión',
        dias_disponibles: ['martes', 'jueves'],
      })

    expect(res.status).toBe(403)
  })

  it('POST /valoraciones - admin crea segunda valoración (seguimiento)', async () => {
    const res = await request(app)
      .post('/api/valoraciones')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        id_usuario: directoId,
        nivel_actividad: 'ligero',
        objetivos: ['salud'],
        tipo_antecedentes: ['cardiovascular'],
        observaciones_antecedentes: 'Controlar presión',
        dias_disponibles: ['martes', 'jueves'],
      })

    expect(res.status).toBe(201)
    directoValoracionId = res.body.id_valoracion
  })

  it('POST /valoraciones - usuario no puede crear valoración (403)', async () => {
    const res = await request(app)
      .post('/api/valoraciones')
      .set('Authorization', `Bearer ${token('usuarioToken')}`)
      .send({
        id_usuario: directoId,
        nivel_actividad: 'activo',
        objetivos: ['salud'],
        tipo_antecedentes: [],
        dias_disponibles: ['lunes'],
      })

    expect(res.status).toBe(403)
  })

  it('GET /valoraciones - admin puede listar todas', async () => {
    const res = await request(app)
      .get('/api/valoraciones')
      .set('Authorization', `Bearer ${token('adminToken')}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThanOrEqual(2)
  })

  it('GET /valoraciones - entrenador puede listar todas', async () => {
    const res = await request(app)
      .get('/api/valoraciones')
      .set('Authorization', `Bearer ${token('entrenadorToken')}`)

    expect(res.status).toBe(200)
  })

  it('GET /valoraciones - usuario no puede listar todas (403)', async () => {
    const res = await request(app)
      .get('/api/valoraciones')
      .set('Authorization', `Bearer ${token('usuarioToken')}`)

    expect(res.status).toBe(403)
  })

  it('GET /valoraciones/:id - propietario ve su valoración con campo tipo', async () => {
    const res = await request(app)
      .get(`/api/valoraciones/${valoracionId}`)
      .set('Authorization', `Bearer ${token('usuarioToken')}`)

    expect(res.status).toBe(200)
    expect(res.body.id_valoracion).toBe(valoracionId)
    expect(res.body.tipo).toBeDefined()
    expect(['inicial', 'seguimiento', 'actual']).toContain(res.body.tipo)
  })

  it('GET /valoraciones/:id - admin ve cualquier valoración', async () => {
    const res = await request(app)
      .get(`/api/valoraciones/${valoracionId}`)
      .set('Authorization', `Bearer ${token('adminToken')}`)

    expect(res.status).toBe(200)
  })

  it('GET /valoraciones/usuario/:id - propietario ve sus valoraciones', async () => {
    const res = await request(app)
      .get(`/api/valoraciones/usuario/${directoId}`)
      .set('Authorization', `Bearer ${token('usuarioToken')}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThanOrEqual(2)
  })

  it('PUT /valoraciones/:id - entrenador no puede editar (403)', async () => {
    const res = await request(app)
      .put(`/api/valoraciones/${valoracionId}`)
      .set('Authorization', `Bearer ${token('entrenadorToken')}`)
      .send({
        nivel_actividad: 'muy_activo',
        observaciones_finales: 'Actualización de rutina',
      })

    expect(res.status).toBe(403)
  })

  it('PUT /valoraciones/:id/desactivar - solo admin puede desactivar', async () => {
    const res = await request(app)
      .put(`/api/valoraciones/${directoValoracionId}/desactivar`)
      .set('Authorization', `Bearer ${token('adminToken')}`)

    expect(res.status).toBe(200)
  })

  it('PUT /valoraciones/:id/desactivar - entrenador no puede desactivar (403)', async () => {
    const res = await request(app)
      .put(`/api/valoraciones/${valoracionId}/desactivar`)
      .set('Authorization', `Bearer ${token('entrenadorToken')}`)

    expect(res.status).toBe(403)
  })
})

describe('Valoración - PAR-Q validation', () => {
  it('POST /valoraciones - usuario con parq=false rechaza creación (400)', async () => {
    const res = await request(app)
      .post('/api/valoraciones')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        id_usuario: inactivoId,
        nivel_actividad: 'activo',
        objetivos: ['salud'],
        tipo_antecedentes: [],
        dias_disponibles: ['lunes'],
      })

    expect(res.status).toBe(400)
    expect(res.body.mensaje).toContain('PAR-Q')
  })
})

describe('Valoración - Tipo calculado (inicial/seguimiento/actual)', () => {
  it('POST /valoraciones - admin crea tercera valoración para tener historial', async () => {
    const res = await request(app)
      .post('/api/valoraciones')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        id_usuario: directoId,
        nivel_actividad: 'moderado',
        objetivos: ['acondicionamiento_fisico'],
        tipo_antecedentes: [],
        dias_disponibles: ['sabado'],
      })

    expect(res.status).toBe(201)
  })

  it('GET /valoraciones/usuario/:id - retorna tipo=inicial y tipo=actual para 2+ valoraciones', async () => {
    const res = await request(app)
      .get(`/api/valoraciones/usuario/${directoId}`)
      .set('Authorization', `Bearer ${token('usuarioToken')}`)

    expect(res.status).toBe(200)
    const tipos = res.body.map((v: any) => v.tipo)
    expect(tipos).toContain('inicial')
    expect(tipos).toContain('actual')
    expect(tipos.filter((t: string) => t === 'actual').length).toBe(1)
    expect(tipos.filter((t: string) => t === 'inicial').length).toBe(1)
  })

  it('GET /valoraciones/usuario/:id - la más reciente tiene tipo=actual', async () => {
    const res = await request(app)
      .get(`/api/valoraciones/usuario/${directoId}`)
      .set('Authorization', `Bearer ${token('usuarioToken')}`)

    expect(res.status).toBe(200)
    expect(res.body[0].tipo).toBe('actual')
    expect(res.body[res.body.length - 1].tipo).toBe('inicial')
  })
})

describe('Valoración - Escalabilidad horizontal (cross-user)', () => {
  it('GET /valoraciones/usuario/:id - entrenador puede ver valoraciones de usuario', async () => {
    const res = await request(app)
      .get(`/api/valoraciones/usuario/${directoId}`)
      .set('Authorization', `Bearer ${token('entrenadorToken')}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('GET /valoraciones/:id - entrenador puede ver valoración de usuario', async () => {
    const res = await request(app)
      .get(`/api/valoraciones/${valoracionId}`)
      .set('Authorization', `Bearer ${token('entrenadorToken')}`)

    expect(res.status).toBe(200)
  })
})

describe('Valoración - Auth guards', () => {
  it('GET /valoraciones - sin token → 401', async () => {
    const res = await request(app).get('/api/valoraciones')
    expect(res.status).toBe(401)
  })

  it('POST /valoraciones - token inválido → 401', async () => {
    const res = await request(app)
      .post('/api/valoraciones')
      .set('Authorization', 'Bearer invalid-token')
      .send({
        id_usuario: directoId,
        nivel_actividad: 'activo',
        objetivos: ['salud'],
        tipo_antecedentes: [],
        dias_disponibles: ['lunes'],
      })

    expect(res.status).toBe(401)
  })

  it('GET /valoraciones - usuario inactivo → 403', async () => {
    const res = await request(app)
      .get('/api/valoraciones')
      .set('Authorization', `Bearer ${token('inactivoToken')}`)

    expect(res.status).toBe(403)
  })

  it('GET /valoraciones - usuario pendiente → 403', async () => {
    const res = await request(app)
      .get('/api/valoraciones')
      .set('Authorization', `Bearer ${token('pendienteToken')}`)

    expect(res.status).toBe(403)
  })
})

describe('Valoración - Validación de datos', () => {
  it('POST /valoraciones - nivel_actividad inválido → 400', async () => {
    const res = await request(app)
      .post('/api/valoraciones')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        id_usuario: directoId,
        nivel_actividad: 'nivel_invalido',
        objetivos: ['salud'],
        tipo_antecedentes: [],
        dias_disponibles: ['lunes'],
      })

    expect(res.status).toBe(400)
  })

  it('POST /valoraciones - objetivos vacíos → 400', async () => {
    const res = await request(app)
      .post('/api/valoraciones')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        id_usuario: directoId,
        nivel_actividad: 'activo',
        objetivos: [],
        tipo_antecedentes: [],
        dias_disponibles: ['lunes'],
      })

    expect(res.status).toBe(400)
  })

  it('POST /valoraciones - dias_disponibles vacíos → 400', async () => {
    const res = await request(app)
      .post('/api/valoraciones')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        id_usuario: directoId,
        nivel_actividad: 'activo',
        objetivos: ['salud'],
        tipo_antecedentes: [],
        dias_disponibles: [],
      })

    expect(res.status).toBe(400)
  })

  it('POST /valoraciones - usuario_id inexistente → 404', async () => {
    const res = await request(app)
      .post('/api/valoraciones')
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({
        id_usuario: '00000000-0000-0000-0000-000000000000',
        nivel_actividad: 'activo',
        objetivos: ['salud'],
        tipo_antecedentes: [],
        dias_disponibles: ['lunes'],
      })

    expect(res.status).toBe(404)
  })
})

// Solo lectura por relación: una valoración vinculada a una rutina que ya no
// está activa (finalizada/cancelada) no se puede editar ni desactivar.
describe.sequential('Valoración - Validación por relación con la rutina', () => {
  let validacionFinalizadaV = ''
  let validacionActivaV = ''
  let rutinaActivaId = ''
  let ejercicioId = ''

  beforeAll(async () => {
    const ejercicio = await prisma.ejercicio.findFirst({ select: { id_ejercicio: true } })
    ejercicioId = ejercicio!.id_ejercicio

    const crearValoracion = async (dias: string) => {
      const res = await request(app)
        .post('/api/valoraciones')
        .set('Authorization', `Bearer ${token('adminToken')}`)
        .send({
          id_usuario: directoId,
          nivel_actividad: 'activo',
          objetivos: ['salud'],
          tipo_antecedentes: [],
          dias_disponibles: [dias],
        })
      expect(res.status).toBe(201)
      return res.body.id_valoracion
    }

    const crearRutina = async (idValoracion: string, nombre: string, dia: string) => {
      const res = await request(app)
        .post('/api/rutinas')
        .set('Authorization', `Bearer ${token('adminToken')}`)
        .send({
          id_usuario: directoId,
          id_valoracion: idValoracion,
          nombre,
          nivel: 'intermedio',
          ejercicios: [
            { id_ejercicio: ejercicioId, dia_semana: dia, series: 3, repeticiones_min: 10, repeticiones_max: 12 },
          ],
        })
      expect(res.status).toBe(201)
      return res.body.id_rutina
    }

    // Primera rutina (queda finalizada al crear la segunda) y su valoración.
    validacionFinalizadaV = await crearValoracion('lunes')
    await crearRutina(validacionFinalizadaV, 'Rutina Finalizada', 'lunes')
    // Segunda rutina (activa) y su valoración.
    validacionActivaV = await crearValoracion('martes')
    rutinaActivaId = await crearRutina(validacionActivaV, 'Rutina Activa', 'martes')
  })

  it('PUT /valoraciones/:id - editar valoración de rutina finalizada → 400', async () => {
    const res = await request(app)
      .put(`/api/valoraciones/${validacionFinalizadaV}`)
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({ observaciones_finales: 'Edición bloqueada' })

    expect(res.status).toBe(400)
    expect(res.body.mensaje).toBe('La valoración pertenece a una rutina que ya no está activa — no se puede modificar')
  })

  it('PUT /valoraciones/:id/desactivar - desactivar valoración de rutina finalizada → 400', async () => {
    const res = await request(app)
      .put(`/api/valoraciones/${validacionFinalizadaV}/desactivar`)
      .set('Authorization', `Bearer ${token('adminToken')}`)

    expect(res.status).toBe(400)
    expect(res.body.mensaje).toBe(
      'La valoración pertenece a una rutina que ya no está activa — no se puede desactivar',
    )
  })

  it('PUT /valoraciones/:id - valoración de rutina activa sigue siendo editable → 200', async () => {
    const res = await request(app)
      .put(`/api/valoraciones/${validacionActivaV}`)
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({ observaciones_finales: 'Sigue activa' })

    expect(res.status).toBe(200)
    expect(res.body.observaciones_finales).toBe('Sigue activa')
  })

  it('PUT /valoraciones/:id - valoración de rutina cancelada → 400', async () => {
    const rutinaCancelada = await request(app)
      .put(`/api/rutinas/${rutinaActivaId}/desactivar`)
      .set('Authorization', `Bearer ${token('adminToken')}`)
    expect(rutinaCancelada.status).toBe(200)

    const res = await request(app)
      .put(`/api/valoraciones/${validacionActivaV}`)
      .set('Authorization', `Bearer ${token('adminToken')}`)
      .send({ observaciones_finales: 'Intento' })

    expect(res.status).toBe(400)
    expect(res.body.mensaje).toBe('La valoración pertenece a una rutina que ya no está activa — no se puede modificar')
  })
})
