import { Navigate } from 'react-router'
import { toast } from 'sonner'
import { getToken, cerrarSesion, mapRolToPlatform, type Rol } from '@/lib/auth'
import { useSesion } from '@/lib/sesion'

interface ProtectedRouteProps {
  children: React.ReactNode
  rolesPermitidos?: Rol[]
}

export function ProtectedRoute({ children, rolesPermitidos }: ProtectedRouteProps) {
  const { usuario } = useSesion()

  if (!getToken() || !usuario) {
    return <Navigate to="/login" replace />
  }

  if (usuario.estado === 'inactivo') {
    cerrarSesion()
    toast.error('Tu cuenta ha sido suspendida')
    return <Navigate to="/login" replace />
  }

  // 'pendiente' va a /incorporacion, que sí está registrada en App.tsx.
  // Antes apuntaba a /usuario/activacion, ruta inexistente que caía en
  // /usuario/* y volvía a pasar por este guard: bucle infinito de redirección.
  if (usuario.estado === 'pendiente') {
    return <Navigate to="/incorporacion" replace />
  }

  if (usuario.debe_cambiar_password) {
    return <Navigate to="/cambiar-clave" replace />
  }

  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
    const platform = mapRolToPlatform(usuario.rol)
    if (platform === 'student') return <Navigate to="/usuario/inicio" replace />
    if (platform === 'trainer') return <Navigate to="/entrenador/dashboard" replace />
    return <Navigate to="/admin/dashboard" replace />
  }

  return <>{children}</>
}
