import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../../src/app'

const FAKE_ID = '00000000-0000-0000-0000-000000000000'

// ─── Helper ───────────────────────────────────────────────────
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

function put(path: string, body: Record<string, unknown> = {}, token?: string) {
  const req = request(app).put(path).send(body)
  if (token) req.set('Authorization', `Bearer ${token}`)
  return req
}

// ─────────────────────────────────────────────────────────────
// ADMIN-ONLY ROUTES
// 5 rutas × (entrenador→403, usuario→403, sin token→401) = 15
// ─────────────────────────────────────────────────────────────

const adminOnlyRoutes = [
  { method: 'PUT',  path: `/api/usuarios/${FAKE_ID}/desactivar`,           body: {} },
  { method: 'PUT',  path: `/api/ejercicios/${FAKE_ID}`,                   body: { nombre: 'x' } },
  { method: 'PUT',  path: `/api/ejercicios/${FAKE_ID}/desactivar`,        body: {} },
  { method: 'PUT',  path: `/api/maquinas/${FAKE_ID}`,                     body: { nombre: 'x' } },
  { method: 'PUT',  path: `/api/maquinas/${FAKE_ID}/desactivar`,          body: {} },
]

describe('Admin-only → entrenador recibe 403', () => {
  for (const route of adminOnlyRoutes) {
    it(`${route.method} ${route.path}`, async () => {
      const res = await put(route.path, route.body, (globalThis as any).entrenadorToken)
      expect(res.status).toBe(403)
    })
  }
})

describe('Admin-only → usuario recibe 403', () => {
  for (const route of adminOnlyRoutes) {
    it(`${route.method} ${route.path}`, async () => {
      const res = await put(route.path, route.body, (globalThis as any).usuarioToken)
      expect(res.status).toBe(403)
    })
  }
})

describe('Admin-only → sin token recibe 401', () => {
  for (const route of adminOnlyRoutes) {
    it(`${route.method} ${route.path}`, async () => {
      const res = await put(route.path, route.body)
      expect(res.status).toBe(401)
    })
  }
})

// ─────────────────────────────────────────────────────────────
// ADMIN+ENTRENADOR ROUTES
// 12 rutas × (usuario→403) = 12
// + 4 rutas representativas × (sin token→401) = 4
// ─────────────────────────────────────────────────────────────

const adminEntrenadorRoutes = [
  { method: 'GET',  path: '/api/usuarios',                          handler: 'get' },
  { method: 'POST', path: '/api/usuarios',                          handler: 'post', body: { email_contacto: 'x@x.com' } },
  { method: 'GET',  path: `/api/usuarios/${FAKE_ID}`,               handler: 'get' },
  { method: 'PUT',  path: `/api/usuarios/${FAKE_ID}/aceptar-documento`, handler: 'put', body: { tipo_documento_legal: 'contrato_gym' } },
  { method: 'PUT',  path: `/api/usuarios/${FAKE_ID}/parq`,          handler: 'put', body: { respuestas: [false,false,false,false,false,false,false] } },
  { method: 'POST', path: `/api/usuarios/${FAKE_ID}/huella`,        handler: 'post', body: { indice_sensor: 99 } },
  { method: 'GET',  path: '/api/ejercicios',                        handler: 'get' },
  { method: 'POST', path: '/api/ejercicios',                        handler: 'post', body: { nombre: 'x' } },
  { method: 'GET',  path: `/api/ejercicios/${FAKE_ID}`,             handler: 'get' },
  { method: 'GET',  path: '/api/maquinas',                          handler: 'get' },
  { method: 'POST', path: '/api/maquinas',                          handler: 'post', body: { nombre: 'x' } },
  { method: 'GET',  path: `/api/maquinas/${FAKE_ID}`,               handler: 'get' },
]

describe('Admin+entrenador → usuario recibe 403', () => {
  for (const route of adminEntrenadorRoutes) {
    it(`${route.method} ${route.path}`, async () => {
      let res
      if (route.handler === 'get') {
        res = await get(route.path, (globalThis as any).usuarioToken)
      } else if (route.handler === 'post') {
        res = await post(route.path, route.body || {}, (globalThis as any).usuarioToken)
      } else {
        res = await put(route.path, route.body || {}, (globalThis as any).usuarioToken)
      }
      expect(res.status).toBe(403)
    })
  }
})

// ─── Sin token → 401 (representativo, 1 por grupo de rutas) ──
describe('Admin+entrenador → sin token recibe 401', () => {
  it('GET /api/usuarios', async () => {
    const res = await get('/api/usuarios')
    expect(res.status).toBe(401)
  })

  it('GET /api/ejercicios', async () => {
    const res = await get('/api/ejercicios')
    expect(res.status).toBe(401)
  })

  it('GET /api/maquinas', async () => {
    const res = await get('/api/maquinas')
    expect(res.status).toBe(401)
  })
})

// ─────────────────────────────────────────────────────────────
// CAMBIAR-PASSWORD (token required, no requiereRol)
// Requiere password_actual + password_nueva + confirmar_password
// ─────────────────────────────────────────────────────────────

describe('cambiar-password → sin token recibe 401', () => {
  it('PUT /api/auth/cambiar-password', async () => {
    const res = await put('/api/auth/cambiar-password', { password_actual: 'x', password_nueva: 'nueva1234', confirmar_password: 'nueva1234' })
    expect(res.status).toBe(401)
  })

  it('PUT /api/auth/cambiar-password → token inválido recibe 401', async () => {
    const res = await put('/api/auth/cambiar-password', { password_actual: 'x', password_nueva: 'nueva1234', confirmar_password: 'nueva1234' }, 'token-falso-123')
    expect(res.status).toBe(401)
  })
})

// ─────────────────────────────────────────────────────────────
// PERFIL — admin+dueño. Entrenador/usuario sin token = 403
// ─────────────────────────────────────────────────────────────

describe('PUT /usuarios/:id/perfil → entrenador no dueño recibe 403', () => {
  it('entrenador intentando editar perfil ajeno', async () => {
    const res = await put(`/api/usuarios/${FAKE_ID}/perfil`, { email_contacto: 'x@x.com' }, (globalThis as any).entrenadorToken)
    expect(res.status).toBe(403)
  })
})

describe('PUT /usuarios/:id/perfil → usuario no dueño recibe 403', () => {
  it('usuario intentando editar perfil ajeno', async () => {
    const res = await put(`/api/usuarios/${FAKE_ID}/perfil`, { email_contacto: 'x@x.com' }, (globalThis as any).usuarioToken)
    expect(res.status).toBe(403)
  })
})

describe('PUT /usuarios/:id/perfil → sin token recibe 401', () => {
  it('sin token', async () => {
    const res = await put(`/api/usuarios/${FAKE_ID}/perfil`, { email_contacto: 'x@x.com' })
    expect(res.status).toBe(401)
  })
})
