import { Navigate } from 'react-router'
import { getToken, mapRolToPlatform, rutaInicial, type Rol } from '@/lib/auth'
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

  // Inactivo, pendiente (miembro o personal) y cambio de contraseña pendiente: cada uno tiene su
  // pantalla y la decide rutaInicial. Las rutas destino deben existir en App.tsx y no volver a
  // pasar por este guard, o el redireccionamiento entra en bucle.
  if (usuario.estado !== 'activo' || usuario.debe_cambiar_password) {
    return <Navigate to={rutaInicial(usuario)} replace />
  }

  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
    const platform = mapRolToPlatform(usuario.rol)
    if (platform === 'student') return <Navigate to="/usuario/inicio" replace />
    if (platform === 'trainer') return <Navigate to="/entrenador/dashboard" replace />
    return <Navigate to="/admin/dashboard" replace />
  }

  return <>{children}</>
}
