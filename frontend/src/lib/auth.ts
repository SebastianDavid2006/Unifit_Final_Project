export type Rol = 'admin' | 'entrenador' | 'usuario'
export type Platform = 'admin' | 'trainer' | 'student'

export interface UsuarioSesion {
  id_usuario: string
  primer_nombre: string
  primer_apellido: string
  email_contacto: string
  documento: string
  rol: Rol
  tipo_usuario: string
  estado: string
  debe_cambiar_password: boolean
}

const TOKEN_KEY = 'unifit_token'
const USUARIO_KEY = 'unifit_usuario'

export function guardarSesion(token: string, usuario: UsuarioSesion): void {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario))
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getUsuario(): UsuarioSesion | null {
  const raw = localStorage.getItem(USUARIO_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as UsuarioSesion
  } catch {
    return null
  }
}

export function cerrarSesion(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USUARIO_KEY)
}

export function mapRolToPlatform(rol: Rol): Platform {
  switch (rol) {
    case 'admin':
      return 'admin'
    case 'entrenador':
      return 'trainer'
    case 'usuario':
      return 'student'
    default:
      throw new Error(`Rol desconocido: ${rol}`)
  }
}