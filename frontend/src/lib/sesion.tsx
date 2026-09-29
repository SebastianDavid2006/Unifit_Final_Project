import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { getMiPerfil, type BackendUsuario } from '@/services/usuario.service'
import { getToken, getUsuario, guardarSesion, SESION_CAMBIADA, type UsuarioSesion } from '@/lib/auth'

interface SesionContextValue {
  usuario: UsuarioSesion | null
  cargando: boolean
  refrescar: () => Promise<void>
}

const SesionContext = createContext<SesionContextValue | undefined>(undefined)

function aUsuarioSesion(u: BackendUsuario): UsuarioSesion {
  return {
    id_usuario: u.id_usuario,
    primer_nombre: u.primer_nombre,
    primer_apellido: u.primer_apellido,
    email_contacto: u.email_contacto,
    documento: u.documento,
    rol: u.rol,
    tipo_usuario: u.tipo_usuario,
    estado: u.estado,
    debe_cambiar_password: u.debe_cambiar_password,
  }
}

export function SesionProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(() => getUsuario())
  const [cargando, setCargando] = useState<boolean>(() => getToken() !== null)

  const refrescar = useCallback(async () => {
    const token = getToken()
    if (token === null) {
      setUsuario(null)
      setCargando(false)
      return
    }

    try {
      const sesion = aUsuarioSesion(await getMiPerfil())
      guardarSesion(token, sesion)
      setUsuario(sesion)
    } catch {
      // 401: el interceptor de '@/lib/api' ya cerró la sesión y redirigió.
      // Cualquier otro fallo (red caída, backend caído) conserva el estado local
      // para no expulsar al usuario por un problema pasajero.
      setUsuario(getUsuario())
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    void refrescar()
  }, [refrescar])

  // Login y logout escriben la sesión desde 10 sitios distintos (LoginPage,
  // RegisterPage, los 3 paneles, api.ts...). El estado de arriba se inicializa
  // UNA vez al montar, así que sin esta suscripción quedaba congelado: el guard
  // veía un usuario null que el localStorage sí tenía, y ProtectedRoute botaba
  // a /login mientras LoginPageWrapper reenviaba a /admin/dashboard. Bucle.
  useEffect(() => {
    const alCambiarLaSesion = () => {
      setUsuario(getUsuario())
      setCargando(false)
    }
    window.addEventListener(SESION_CAMBIADA, alCambiarLaSesion)
    return () => window.removeEventListener(SESION_CAMBIADA, alCambiarLaSesion)
  }, [])

  const value = useMemo(
    () => ({ usuario, cargando, refrescar }),
    [usuario, cargando, refrescar],
  )

  // Mientras sincroniza con la BD no se renderizan los hijos: cualquier
  // consumidor de getUsuario() leería el estado obsoleto de localStorage.
  if (cargando) {
    return (
      <div className="size-full flex items-center justify-center mesh-bg">
        <Loader2 size={32} className="animate-spin text-gray-400" />
      </div>
    )
  }

  return <SesionContext.Provider value={value}>{children}</SesionContext.Provider>
}

export function useSesion(): SesionContextValue {
  const ctx = useContext(SesionContext)
  if (ctx === undefined) {
    throw new Error('useSesion debe usarse dentro de <SesionProvider>')
  }
  return ctx
}
