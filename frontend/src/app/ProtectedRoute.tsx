import { Navigate } from 'react-router'
import { toast } from 'sonner'
import { getUsuario, getToken, mapRolToPlatform, type Rol } from '@/lib/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  rolesPermitidos?: Rol[]
}

export function ProtectedRoute({ children, rolesPermitidos }: ProtectedRouteProps) {
  const token = getToken()
  const usuario = getUsuario()

  if (!token || !usuario) {
    return <Navigate to="/login" replace />
  }

  if (usuario.estado === 'inactivo') {
    localStorage.removeItem('unifit_token')
    localStorage.removeItem('unifit_usuario')
    toast.error('Tu cuenta ha sido suspendida')
    return <Navigate to="/login" replace />
  }

  if (usuario.estado === 'pendiente') {
    return <Navigate to="/usuario/activacion" replace />
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
