import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import app from '../src/app'
import { prisma } from '../src/utils/prisma'

let adminId: string
let entrenadorId: string
let usuarioId: string
let inactivoId: string
let pendienteId: string
let ejercicioId1: string
let ejercicioId2: string

function token(key: string): string {
  return (globalThis as any)[key]
}

beforeAll(async () => {
  const admin = await prisma.usuario.findUnique({ where: { email_contacto: 'admin@unifit.edu.co' } })
  const entrenador = await prisma.usuario.findUnique({ where: { email_contacto: 'entrenador@unifit.edu.co' } })
  const directo = await prisma.usuario.findUnique({ where: { email_contacto: 'directo@unifit.edu.co' } })
  const inactivo = await prisma.usuario.findUnique({ where: { email_contacto: 'inactivo@unifit.edu.co' } })
  const pendiente = await prisma.usuario.findUnique({ where: { email_contacto: 'pendiente@unifit.edu.co' } })

  adminId = admin!.id_usuario
  entrenadorId = entrenador!.id_usuario
  usuarioId = directo!.id_usuario
  inactivoId = inactivo!.id_usuario
  pendienteId = pendiente!.id_usuario

  const ex1 = await prisma.ejercicio.create({
    data: {
      id_creador: adminId,
      nombre: 'Sentadilla con barra',
      nivel: 'intermedio',
      activo: true,
    },
  })
  const ex2 = await prisma.ejercicio.create({
    data: {
      id_creador: adminId,
      nombre: 'Press de banca',
      nivel: 'intermedio',
      activo: true,
    },
  })
  ejercicioId1 = ex1.id_ejercicio
  ejercicioId2 = ex2.id_ejercicio
})

afterAll(async () => {
  await prisma.ejercicio.deleteMany({ where: { id_creador: adminId } })
})

describe('IA - Generación de rutinas', () => {
  const payloadValido = {
    nivelActividad: 'activo',
    objetivoTarjetas: ['ganancia_muscular'],
    objetivoDetalle: 'Ganar masa muscular',
    peso: '75',
    estatura: '175',
    imc: '24.5',
    grasaCorporal: '18',
    masaMuscular: '32',
    presionArterial: '120/80',
    resistenciaMuscular: '30',
    antecedentesSalud: [],
    observacionesEntrenador: 'Sin limitaciones',
    diasDisponibles: ['Lunes', 'Miércoles', 'Viernes'],
    observacionesFinales: '',
  }

  describe('Autenticación y autorización', () => {
    it('POST /api/rutinas/generar-ia - sin token retorna 401', async () => {
      const res = await request(app)
        .post('/api/rutinas/generar-ia')
        .send(payloadValido)

      expect(res.status).toBe(401)
    })

    it('POST /api/rutinas/generar-ia - usuario regular retorna 403', async () => {
      const res = await request(app)
        .post('/api/rutinas/generar-ia')
        .set('Authorization', `Bearer ${token('usuarioToken')}`)
        .send(payloadValido)

      expect(res.status).toBe(403)
    })

    it('POST /api/rutinas/generar-ia - usuario inactivo retorna 403', async () => {
      const res = await request(app)
        .post('/api/rutinas/generar-ia')
        .set('Authorization', `Bearer ${token('inactivoToken')}`)
        .send(payloadValido)

      expect(res.status).toBe(403)
    })

    it('POST /api/rutinas/generar-ia - usuario pendiente retorna 403', async () => {
      const res = await request(app)
        .post('/api/rutinas/generar-ia')
        .set('Authorization', `Bearer ${token('pendienteToken')}`)
        .send(payloadValido)

      expect(res.status).toBe(403)
    })
  })

  describe('Validación de datos', () => {
    it('POST /api/rutinas/generar-ia - sin diasDisponibles retorna 400', async () => {
      const payload = { ...payloadValido }
      delete (payload as Record<string, unknown>).diasDisponibles

      const res = await request(app)
        .post('/api/rutinas/generar-ia')
        .set('Authorization', `Bearer ${token('adminToken')}`)
        .send(payload)

      expect(res.status).toBe(400)
      expect(res.body.mensaje).toBe('Datos inválidos')
    })

    it('POST /api/rutinas/generar-ia - diasDisponibles vacío retorna 400', async () => {
      const res = await request(app)
        .post('/api/rutinas/generar-ia')
        .set('Authorization', `Bearer ${token('adminToken')}`)
        .send({ ...payloadValido, diasDisponibles: [] })

      expect(res.status).toBe(400)
    })

    it('POST /api/rutinas/generar-ia - body vacío retorna 400', async () => {
      const res = await request(app)
        .post('/api/rutinas/generar-ia')
        .set('Authorization', `Bearer ${token('adminToken')}`)
        .send({})

      expect(res.status).toBe(400)
    })
  })

  describe('Generación exitosa', () => {
    it('POST /api/rutinas/generar-ia - admin genera rutina con IA', async () => {
      const res = await request(app)
        .post('/api/rutinas/generar-ia')
        .set('Authorization', `Bearer ${token('adminToken')}`)
        .send(payloadValido)

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('name')
      expect(res.body).toHaveProperty('description')
      expect(res.body).toHaveProperty('duration')
      expect(res.body).toHaveProperty('frequency')
      expect(res.body).toHaveProperty('level')
      expect(res.body).toHaveProperty('rows')
      expect(Array.isArray(res.body.rows)).toBe(true)
      expect(res.body.rows.length).toBeGreaterThan(0)

      const row = res.body.rows[0]
      expect(row).toHaveProperty('id')
      expect(row).toHaveProperty('dia')
      expect(row).toHaveProperty('muscle')
      expect(row).toHaveProperty('name')
      expect(row).toHaveProperty('sets')
      expect(row).toHaveProperty('reps')
      expect(row).toHaveProperty('rest')
    }, 30000)

    it('POST /api/rutinas/generar-ia - entrenador genera rutina con IA', async () => {
      const res = await request(app)
        .post('/api/rutinas/generar-ia')
        .set('Authorization', `Bearer ${token('entrenadorToken')}`)
        .send(payloadValido)

      expect(res.status).toBe(200)
      expect(res.body.rows.length).toBeGreaterThan(0)
    }, 30000)

    it('POST /api/rutinas/generar-ia - los id_ejercicio retornados existen en el catálogo', async () => {
      const res = await request(app)
        .post('/api/rutinas/generar-ia')
        .set('Authorization', `Bearer ${token('adminToken')}`)
        .send(payloadValido)

      expect(res.status).toBe(200)

      const idsEnCatalogo = new Set([ejercicioId1, ejercicioId2])
      for (const row of res.body.rows) {
        expect(idsEnCatalogo.has(row.id)).toBe(true)
      }
    }, 30000)
  })

  describe('Catálogo vacío', () => {
    it('POST /api/rutinas/generar-ia - sin ejercicios activos retorna 400', async () => {
      await prisma.ejercicio.updateMany({
        where: { id_creador: adminId },
        data: { activo: false },
      })

      const res = await request(app)
        .post('/api/rutinas/generar-ia')
        .set('Authorization', `Bearer ${token('adminToken')}`)
        .send(payloadValido)

      expect(res.status).toBe(400)
      expect(res.body.mensaje).toContain('ejercicios')

      await prisma.ejercicio.updateMany({
        where: { id_creador: adminId },
        data: { activo: true },
      })
    })
  })

  describe('Estructura de respuesta', () => {
    it('POST /api/rutinas/generar-ia - nivel es un valor válido del enum', async () => {
      const res = await request(app)
        .post('/api/rutinas/generar-ia')
        .set('Authorization', `Bearer ${token('adminToken')}`)
        .send(payloadValido)

      expect(res.status).toBe(200)
      expect(['Principiante', 'Intermedio', 'Avanzado']).toContain(res.body.level)
    }, 30000)

    it('POST /api/rutinas/generar-ia - cada fila tiene formato válido', async () => {
      const res = await request(app)
        .post('/api/rutinas/generar-ia')
        .set('Authorization', `Bearer ${token('adminToken')}`)
        .send(payloadValido)

      expect(res.status).toBe(200)

      for (const row of res.body.rows) {
        expect(typeof row.id).toBe('string')
        expect(row.id).toMatch(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
        )
        expect(typeof row.dia).toBe('string')
        expect(row.dia.length).toBeGreaterThan(0)
        expect(typeof row.muscle).toBe('string')
        expect(typeof row.name).toBe('string')
        expect(typeof row.sets).toBe('string')
        expect(typeof row.reps).toBe('string')
        expect(typeof row.rest).toBe('string')
      }
    }, 30000)
  })
})
