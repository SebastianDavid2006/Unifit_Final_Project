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

// Aviso de "te desactivaron / tu cuenta está inactiva". Como el inactivo ya no tiene sesión,
// /cuenta-inactiva necesita esta marca para saber que llegó por un motivo real y no tecleando la URL.
// Es solo comodidad de interfaz: la seguridad la aplica el backend.
const MARCA_INACTIVA_KEY = 'unifit_cuenta_inactiva'

export function marcarCuentaInactiva(): void {
  try { sessionStorage.setItem(MARCA_INACTIVA_KEY, '1') } catch { /* sin sessionStorage: se mostrará el login */ }
}

export function hayMarcaCuentaInactiva(): boolean {
  try { return sessionStorage.getItem(MARCA_INACTIVA_KEY) === '1' } catch { return false }
}

export function limpiarMarcaCuentaInactiva(): void {
  try { sessionStorage.removeItem(MARCA_INACTIVA_KEY) } catch { /* nada que limpiar */ }
}

export function guardarSesion(token: string, usuario: UsuarioSesion): void {
  limpiarMarcaCuentaInactiva()
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

// Iniciales de avatar: primera letra del primer nombre y del primer apellido.
// Fuente única: la usan las listas, el layout del usuario y los menús de perfil.
export function iniciales(primerNombre?: string | null, primerApellido?: string | null): string {
  return `${(primerNombre ?? '')[0] ?? ''}${(primerApellido ?? '')[0] ?? ''}`.toUpperCase()
}

// Nombre visible ("Nombre Apellido") e iniciales para avatares y menús de perfil
export function identidadVisible(usuario: Pick<UsuarioSesion, 'primer_nombre' | 'primer_apellido'> | null): { nombre: string; iniciales: string } {
  if (!usuario) return { nombre: '', iniciales: '' }
  return {
    nombre: `${usuario.primer_nombre} ${usuario.primer_apellido}`.trim(),
    iniciales: iniciales(usuario.primer_nombre, usuario.primer_apellido),
  }
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