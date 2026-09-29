import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import app from '../src/app'
import { prisma } from '../src/utils/prisma'

let entrenadorId: string
let activoId: string
let tokenEntrenador: string
let tokenActivo: string

const SUFIXO = Date.now()

function firmarToken(usuario: {
  id_usuario: string
  rol: string
  tipo_usuario: string
  estado: string
  debe_cambiar_password: boolean
}): string {
  return jwt.sign(usuario, process.env.JWT_SECRET!, { expiresIn: '1h' as jwt.SignOptions['expiresIn'] })
}

beforeAll(async () => {
  const entrenador = await prisma.usuario.create({
    data: {
      primer_nombre: 'Claims',
      primer_apellido: 'Entrenador',
      email_contacto: `claims.entrenador${SUFIXO}@unifit.edu.co`,
      documento: `CLAIMS-ENT-${SUFIXO}`,
      genero: 'otro',
      rol: 'entrenador',
      tipo_usuario: 'estudiante',
      estado: 'activo',
      debe_cambiar_password: false,
    },
  })
  entrenadorId = entrenador.id_usuario
  tokenEntrenador = firmarToken({
    id_usuario: entrenadorId,
    rol: 'entrenador',
    tipo_usuario: 'estudiante',
    estado: 'activo',
    debe_cambiar_password: false,
  })

  const activo = await prisma.usuario.create({
    data: {
      primer_nombre: 'Claims',
      primer_apellido: 'Activo',
      email_contacto: `claims.activo${SUFIXO}@unifit.edu.co`,
      documento: `CLAIMS-ACT-${SUFIXO}`,
      genero: 'otro',
      rol: 'entrenador',
      tipo_usuario: 'estudiante',
      estado: 'activo',
      debe_cambiar_password: false,
    },
  })
  activoId = activo.id_usuario
  tokenActivo = firmarToken({
    id_usuario: activoId,
    rol: 'entrenador',
    tipo_usuario: 'estudiante',
    estado: 'activo',
    debe_cambiar_password: false,
  })
})

afterAll(async () => {
  await prisma.usuario.deleteMany({ where: { id_usuario: { in: [entrenadorId, activoId] } } })
})

describe.sequential('verificarToken - claims frescos desde BD', () => {
  it('desactivar usuario se refleja al instante con el MISMO token', async () => {
    const ant = await request(app)
      .get('/api/ejercicios')
      .set('Authorization', `Bearer ${tokenActivo}`)
    expect(ant.status).toBe(200)

    await prisma.usuario.update({ where: { id_usuario: activoId }, data: { estado: 'inactivo' } })

    const despues = await request(app)
      .get('/api/ejercicios')
      .set('Authorization', `Bearer ${tokenActivo}`)
    expect(despues.status).toBe(403)

    await prisma.usuario.update({ where: { id_usuario: activoId }, data: { estado: 'activo' } })
  })

  it('cambio de rol se refleja al instante con el MISMO token', async () => {
    const ant = await request(app)
      .get('/api/asistencia')
      .set('Authorization', `Bearer ${tokenEntrenador}`)
    expect(ant.status).toBe(200)

    await prisma.usuario.update({ where: { id_usuario: entrenadorId }, data: { rol: 'usuario' } })

    const despues = await request(app)
      .get('/api/asistencia')
      .set('Authorization', `Bearer ${tokenEntrenador}`)
    expect(despues.status).toBe(403)
  })
})