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
