import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../../src/app'

const g = globalThis as any

const BODY_BASE = {
  primer_nombre: 'Prueba',
  primer_apellido: 'Guarda',
  email_contacto: 'guarda.personal@unifit.edu.co',
  documento: '99999999',
  fecha_nacimiento: '1990-01-01',
  genero: 'otro',
  tipo_usuario: 'administrativo',
}

// ─── Solo el admin registra personal ─────────────────────────
describe('POST /api/usuarios → solo admin crea personal', () => {
  it('entrenador intentando crear un admin → 403', async () => {
    const res = await request(app)
      .post('/api/usuarios')
      .set('Authorization', `Bearer ${g.entrenadorToken}`)
      .send({ ...BODY_BASE, rol: 'admin' })
    expect(res.status).toBe(403)
  })

  it('entrenador intentando crear un entrenador → 403', async () => {
    const res = await request(app)
      .post('/api/usuarios')
      .set('Authorization', `Bearer ${g.entrenadorToken}`)
      .send({ ...BODY_BASE, rol: 'entrenador' })
    expect(res.status).toBe(403)
  })
})

// ─── Solo el admin completa el registro del personal ─────────
describe('PUT /api/usuarios/:id/aceptar-documento → personal solo por admin', () => {
  it('entrenador aceptando documento de un admin → 403', async () => {
    const me = await request(app).get('/api/usuarios/me').set('Authorization', `Bearer ${g.adminToken}`)
    const res = await request(app)
      .put(`/api/usuarios/${me.body.id_usuario}/aceptar-documento`)
      .set('Authorization', `Bearer ${g.entrenadorToken}`)
      .send({ tipo_documento_legal: 'tratamiento_datos' })
    expect(res.status).toBe(403)
  })
})

// ─── Inactivo: sin sesión nueva y con código claro ───────────
describe('Cuenta inactiva → CUENTA_INACTIVA', () => {
  it('login de un inactivo → 403 con código', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email_contacto: 'inactivo@unifit.edu.co', password: 'inactivo123' })
    expect(res.status).toBe(403)
    expect(res.body.codigo).toBe('CUENTA_INACTIVA')
    expect(res.body).not.toHaveProperty('token')
  })

  it('login de un inactivo con contraseña errónea → 401 (no revela el estado)', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email_contacto: 'inactivo@unifit.edu.co', password: 'incorrecta' })
    expect(res.status).toBe(401)
    expect(res.body.codigo).toBeUndefined()
  })

  it('token de inactivo en ruta protegida → 403 con código', async () => {
    const res = await request(app).get('/api/usuarios').set('Authorization', `Bearer ${g.inactivoToken}`)
    expect(res.status).toBe(403)
    expect(res.body.codigo).toBe('CUENTA_INACTIVA')
  })

  it('token de pendiente en ruta protegida → 403 con REGISTRO_PENDIENTE', async () => {
    const res = await request(app).get('/api/usuarios').set('Authorization', `Bearer ${g.pendienteToken}`)
    expect(res.status).toBe(403)
    expect(res.body.codigo).toBe('REGISTRO_PENDIENTE')
  })
})
