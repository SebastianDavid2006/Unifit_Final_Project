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

// Única señal de que la sesión cambió. Las dos funciones de abajo son el único
// punto de escritura, así que con este aviso <SesionProvider> se mantiene al día
// sin que cada uno de los 10 call sites tenga que sincronizarse a mano.
export const SESION_CAMBIADA = 'unifit:sesion'

export function guardarSesion(token: string, usuario: UsuarioSesion): void {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario))
  window.dispatchEvent(new Event(SESION_CAMBIADA))
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
  window.dispatchEvent(new Event(SESION_CAMBIADA))
}

export const RUTA_CUENTA_INACTIVA = '/cuenta-inactiva'
export const RUTA_CUENTA_PENDIENTE = '/cuenta-pendiente'

// Única fuente de verdad de "a dónde va esta persona". Login, guards y wrappers la
// usan: cuando cada uno decidía por su cuenta, el personal pendiente rebotaba
// entre /incorporacion y su dashboard sin fin.
export function rutaInicial(usuario: Pick<UsuarioSesion, 'rol' | 'estado' | 'debe_cambiar_password'>): string {
  if (usuario.estado === 'inactivo') return RUTA_CUENTA_INACTIVA
  if (usuario.estado === 'pendiente') {
    // El miembro agenda su cita; el personal no tiene nada que hacer hasta que un admin lo complete
    return usuario.rol === 'usuario' ? '/incorporacion' : RUTA_CUENTA_PENDIENTE
  }
  if (usuario.debe_cambiar_password) return '/cambiar-clave'
  const platform = mapRolToPlatform(usuario.rol)
  if (platform === 'student') return '/usuario/inicio'
  if (platform === 'trainer') return '/entrenador/dashboard'
  return '/admin/dashboard'
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