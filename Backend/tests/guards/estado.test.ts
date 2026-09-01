import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../../src/app'

function get(path: string, token?: string) {
  const req = request(app).get(path)
  if (token) req.set('Authorization', `Bearer ${token}`)
  return req
}

function post(path: string, body: Record<string, unknown>, token?: string) {
  const req = request(app).post(path).send(body)
  if (token) req.set('Authorization', `Bearer ${token}`)
  return req
}

// ─── Estado: inactivo → 403 ──────────────────────────────────
describe('Estado inactivo → 403 en ruta protegida', () => {
  it('GET /api/usuarios con token de inactivo', async () => {
    const res = await get('/api/usuarios', (globalThis as any).inactivoToken)
    expect(res.status).toBe(403)
  })

  it('GET /api/ejercicios con token de inactivo', async () => {
    const res = await get('/api/ejercicios', (globalThis as any).inactivoToken)
    expect(res.status).toBe(403)
  })
})

// ─── Estado: pendiente → 403 ─────────────────────────────────
describe('Estado pendiente → 403 en ruta protegida', () => {
  it('GET /api/usuarios con token de pendiente', async () => {
    const res = await get('/api/usuarios', (globalThis as any).pendienteToken)
    expect(res.status).toBe(403)
  })

  it('GET /api/maquinas con token de pendiente', async () => {
    const res = await get('/api/maquinas', (globalThis as any).pendienteToken)
    expect(res.status).toBe(403)
  })
})

// ─── Sin token / token inválido → 401 ────────────────────────
describe('Sin token / token inválido → 401', () => {
  it('GET /api/usuarios sin header Authorization', async () => {
    const res = await get('/api/usuarios')
    expect(res.status).toBe(401)
  })

  it('GET /api/usuarios con token basura', async () => {
    const res = await get('/api/usuarios', 'eyJhbGciOiJIUzI1NiJ9.bad.token')
    expect(res.status).toBe(401)
  })
})

// ─── Rutas públicas → accesibles sin auth ────────────────────
describe('Rutas públicas → accesibles sin auth', () => {
  it('GET /health → 200', async () => {
    const res = await get('/health')
    expect(res.status).toBe(200)
    expect(res.body.estado).toBe('ok')
  })

  it('POST /api/auth/login → 200 o 400 (body check)', async () => {
    const res = await post('/api/auth/login', { email_contacto: 'x@x.com', password: 'x' })
    expect([200, 400, 401]).toContain(res.status)
  })

  it('GET /api/programas → 200', async () => {
    const res = await get('/api/programas')
    expect(res.status).toBe(200)
  })

  it('GET /api/cargos → 200', async () => {
    const res = await get('/api/cargos')
    expect(res.status).toBe(200)
  })

  it('GET /api/areas → 200', async () => {
    const res = await get('/api/areas')
    expect(res.status).toBe(200)
  })
})
