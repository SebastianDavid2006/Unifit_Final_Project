export type MockRol = 'entrenador' | 'admin' | 'estudiante'
export type MockEstado = 'en_proceso' | 'activo'

export interface MockOnboarding {
  cita: boolean
  firma: boolean
  huella: boolean
}

export interface MockUser {
  id: string
  email: string
  password: string
  rol: MockRol
  estado: MockEstado
  debeCambiarContrasena: boolean
  onboarding: MockOnboarding
  nombre?: string
  cita?: { fecha: string; hora: string }
}

export interface MockEmail {
  id: string
  to: string
  subject: string
  body: string
  tempPassword: string
  createdAt: string
}

export interface MockSession {
  user: MockUser
  token: string
}

const USERS_KEY = 'unifit_demo_users'
const INBOX_KEY = 'unifit_demo_inbox'

function seedUsers(): Record<string, MockUser> {
  return {
    'entrenador': {
      id: 'u-trainer', email: 'entrenador', password: 'entrenador123', rol: 'entrenador',
      estado: 'activo', debeCambiarContrasena: false,
      onboarding: { cita: true, firma: true, huella: true }, nombre: 'Entrenador',
    },
    'admin': {
      id: 'u-admin', email: 'admin', password: 'admin123', rol: 'admin',
      estado: 'activo', debeCambiarContrasena: false,
      onboarding: { cita: true, firma: true, huella: true }, nombre: 'Administrador',
    },
    'test': {
      id: 'u-test', email: 'test', password: 'test', rol: 'entrenador',
      estado: 'activo', debeCambiarContrasena: true,
      onboarding: { cita: true, firma: true, huella: true }, nombre: 'Test',
    },
    'estudiante': {
      id: 'u-st1', email: 'estudiante', password: 'estudiante123', rol: 'estudiante',
      estado: 'en_proceso', debeCambiarContrasena: true,
      onboarding: { cita: false, firma: false, huella: false }, nombre: 'Estudiante Demo',
    },
    'estudiante2': {
      id: 'u-st2', email: 'estudiante2', password: 'estudiante123', rol: 'estudiante',
      estado: 'activo', debeCambiarContrasena: false,
      onboarding: { cita: true, firma: true, huella: true }, nombre: 'Estudiante Completado',
    },
  }
}

function readUsers(): Record<string, MockUser> {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return {}
}

function writeUsers(users: Record<string, MockUser>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function readInbox(): MockEmail[] {
  try {
    const raw = localStorage.getItem(INBOX_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return []
}

function writeInbox(emails: MockEmail[]) {
  localStorage.setItem(INBOX_KEY, JSON.stringify(emails))
}

function initIfNeeded() {
  const users = readUsers()
  if (Object.keys(users).length === 0) {
    writeUsers(seedUsers())
  } else {
    const seeds = seedUsers()
    let changed = false
    for (const [key, seed] of Object.entries(seeds)) {
      if (!users[key]) {
        users[key] = seed
        changed = true
      }
    }
    if (changed) writeUsers(users)
  }
}

export function resetMock() {
  localStorage.removeItem(USERS_KEY)
  localStorage.removeItem(INBOX_KEY)
  initIfNeeded()
}

export function getAllUsers(): MockUser[] {
  initIfNeeded()
  return Object.values(readUsers())
}

export function getInbox(): MockEmail[] {
  initIfNeeded()
  return readInbox()
}

export function findUserByEmail(email: string): MockUser | undefined {
  initIfNeeded()
  const users = readUsers()
  return users[email.toLowerCase()] ?? Object.values(users).find(u => u.email.toLowerCase() === email.toLowerCase())
}

export function getState(email: string): MockUser | undefined {
  return findUserByEmail(email)
}

export function mockLogin(identifier: string, password: string): MockSession | null {
  initIfNeeded()
  const user = findUserByEmail(identifier)
  if (!user) return null
  if (user.password !== password) return null
  if (user.id === 'u-st1') {
    const fresh = seedUsers()['estudiante']
    updateUser(fresh.email, fresh)
    return { user: { ...fresh }, token: `mock-token-${fresh.id}-${Date.now()}` }
  }
  return { user: { ...user }, token: `mock-token-${user.id}-${Date.now()}` }
}

export function createAccount(opts: {
  email: string
  password: string
  nombre?: string
  estado: MockEstado
  debeCambiarContrasena: boolean
  onboarding: MockOnboarding
}): MockUser {
  initIfNeeded()
  const users = readUsers()
  const id = `u-${Date.now()}`
  const user: MockUser = {
    id,
    email: opts.email.toLowerCase(),
    password: opts.password,
    rol: 'estudiante',
    estado: opts.estado,
    debeCambiarContrasena: opts.debeCambiarContrasena,
    onboarding: opts.onboarding,
    nombre: opts.nombre,
  }
  users[user.email] = user
  writeUsers(users)
  return user
}

export function updateUser(email: string, patch: Partial<MockUser>): MockUser | undefined {
  initIfNeeded()
  const users = readUsers()
  const user = users[email.toLowerCase()] ?? Object.values(users).find(u => u.email.toLowerCase() === email.toLowerCase())
  if (!user) return undefined
  const updated = { ...user, ...patch }
  users[updated.email] = updated
  writeUsers(users)
  return updated
}

export function sendEmail(email: string, subject: string, body: string, tempPassword: string): MockEmail {
  initIfNeeded()
  const emails = readInbox()
  const mail: MockEmail = {
    id: `e-${Date.now()}`,
    to: email.toLowerCase(),
    subject,
    body,
    tempPassword,
    createdAt: new Date().toISOString(),
  }
  emails.unshift(mail)
  writeInbox(emails)
  return mail
}

export function generateTempPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  let out = ''
  for (let i = 0; i < 10; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return out
}
