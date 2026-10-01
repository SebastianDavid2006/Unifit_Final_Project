import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router'
import { guardarSesion, getToken, cerrarSesion, mapRolToPlatform, rutaInicial, hayMarcaCuentaInactiva, limpiarMarcaCuentaInactiva, RUTA_CUENTA_INACTIVA, RUTA_CUENTA_PENDIENTE } from '@/lib/auth'
import { SesionProvider, useSesion } from '@/lib/sesion'
import { toast, Toaster } from 'sonner'
import { LoginPage } from '@/auth/pages/LoginPage'
import { RegisterPage } from '@/auth/pages/RegisterPage'
import { ChangePasswordPage } from '@/auth/pages/ChangePasswordPage'
import { OnboardingPage } from '@/auth/pages/OnboardingPage'
import { EstadoCuentaPage, type VarianteEstadoCuenta } from '@/auth/pages/EstadoCuentaPage'
import { TrainerPage } from '@/features/trainer/pages/TrainerPage'
import TrainerEquipamientoMaquinas from '@/features/trainer/pages/TrainerEquipamientoMaquinas'
import TrainerEquipamientoEjercicios from '@/features/trainer/pages/TrainerEquipamientoEjercicios'
import { StudentApp } from '@/features/student/StudentApp'
import { AdminPage } from '@/features/admin/pages/AdminPage'
import GestionLayout from '@/features/admin/pages/AdminPage/GestionLayout'
import UsuariosPage from '@/features/admin/pages/AdminPage/UsuariosPage'
import UsuarioDetalle from '@/shared/components/UsuarioDetalle'
import AdminEquipamientoMaquinas from '@/features/admin/pages/AdminPage/EquipamientoMaquinas'
import AdminEquipamientoEjercicios from '@/features/admin/pages/AdminPage/EquipamientoEjercicios'
import AgendaPage from '@/features/admin/pages/AdminPage/AgendaPage'
import { ProtectedRoute } from './ProtectedRoute'
import BackgroundDecor from '@/shared/components/BackgroundDecor'

function ParticleField() {
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 18}s`,
    animationDuration: `${18 + Math.random() * 15}s`,
    size: 2 + Math.random() * 4,
    opacity: 0.04 + Math.random() * 0.08,
  }))
  return (
    <div className="particles-container">
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animationDelay: p.animationDelay,
            animationDuration: p.animationDuration,
          }}
        />
      ))}
    </div>
  )
}

function LoginPageWrapper() {
  const navigate = useNavigate()
  const { usuario } = useSesion()

  // El estado de sesión viene del provider. Si hay usuario, se redirige
  // directo a su pantalla correspondiente (única fuente de verdad).
  if (usuario) return <Navigate to={rutaInicial(usuario)} replace />

  return (
    <LoginPage
      onSelect={() => {
        // LoginPage ya guardó la sesión; aquí no se navega porque el
        // provider actualiza el estado y el guard de arriba redirige solo.
      }}
      onRegister={() => navigate('/registro')}
    />
  )
}

function RegisterWrapper() {
  const navigate = useNavigate()
  return <RegisterPage onBack={() => navigate('/login')} />
}

function ChangePasswordWrapper() {
  const navigate = useNavigate()
  const { usuario } = useSesion()
  if (!usuario) return <Navigate to="/login" replace />

  // SOLO permitir si estado === 'activo' Y debe_cambiar_password
  if (usuario.estado !== 'activo' || !usuario.debe_cambiar_password) {
    return <Navigate to={rutaInicial(usuario)} replace />
  }

  return (
    <ChangePasswordPage
      email={usuario.email_contacto}
      onSuccess={() => {
        guardarSesion(getToken()!, { ...usuario, debe_cambiar_password: false })
        const platform = mapRolToPlatform(usuario.rol)
        if (platform === 'student') navigate('/usuario/inicio')
        else if (platform === 'trainer') navigate('/entrenador/dashboard')
        else navigate('/admin/dashboard')
      }}
      onBack={() => { cerrarSesion(); navigate('/login') }}
    />
  )
}

function OnboardingWrapper() {
  const navigate = useNavigate()
  const { usuario } = useSesion()
  if (!usuario) return <Navigate to="/login" replace />

  // Onboarding solo es para miembros (rol 'usuario') pendientes: el resto va a su pantalla
  if (usuario.estado !== 'pendiente' || usuario.rol !== 'usuario') {
    return <Navigate to={rutaInicial(usuario)} replace />
  }

  return (
    <OnboardingPage
      session={{
        user: {
          id_usuario: usuario.id_usuario,
          email: usuario.email_contacto,
          nombre: `${usuario.primer_nombre} ${usuario.primer_apellido}`.trim(),
          rol: usuario.rol,
          tipo_usuario: usuario.tipo_usuario as 'estudiante' | 'profesor' | 'administrativo',
          estado: usuario.estado as 'pendiente' | 'activo' | 'inactivo',
          debeCambiarContrasena: usuario.debe_cambiar_password,
        },
        token: getToken()!,
      }}
      onComplete={() => { /* NO logout, OnboardingPage navega internamente */ }}
      onBack={() => { cerrarSesion(); navigate('/login') }}
    />
  )
}

function EstadoCuentaWrapper({ variante }: { variante: VarianteEstadoCuenta }) {
  const navigate = useNavigate()
  const { usuario } = useSesion()
  const ruta = variante === 'inactiva' ? RUTA_CUENTA_INACTIVA : RUTA_CUENTA_PENDIENTE

  // Quien ya no está en este estado (p. ej. un admin acaba de activarlo) sigue a su pantalla
  if (usuario) {
    const destino = rutaInicial(usuario)
    if (destino !== ruta) return <Navigate to={destino} replace />
  }

  // Entrar tecleando la URL no tiene sentido: sin sesión pendiente (o sin aviso de desactivación) se va al login
  const llegoPorUnMotivo = usuario !== null || (variante === 'inactiva' && hayMarcaCuentaInactiva())
  if (!llegoPorUnMotivo) return <Navigate to="/login" replace />

  return (
    <EstadoCuentaPage
      variante={variante}
      onVolver={() => { limpiarMarcaCuentaInactiva(); cerrarSesion(); navigate('/login') }}
    />
  )
}

function LogoutWrapper() {
  cerrarSesion()
  return <Navigate to="/login" replace />
}

const AUTH_ROUTES = ['/login', '/registro', '/cambiar-clave', '/incorporacion', '/incorporacion/asistencia-presencial', RUTA_CUENTA_INACTIVA, RUTA_CUENTA_PENDIENTE]

function AppShell() {
  const location = useLocation()
  const isAuthPage = AUTH_ROUTES.includes(location.pathname)

  return (
    <div
      className="size-full flex flex-col overflow-y-auto mesh-bg"
      style={{ fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif" }}
    >
      <ParticleField />
      <Toaster position="top-center" richColors />

      {!isAuthPage && (
        <BackgroundDecor
          goo={false}
          spheres={[
            { width: 380, height: 380, background: 'radial-gradient(circle at 30% 30%, rgba(230,57,70,0.05), transparent)', top: '-120px', right: '-80px', animationDelay: '0s' },
            { width: 250, height: 250, background: 'radial-gradient(circle at 70% 30%, rgba(255,107,138,0.04), transparent)', bottom: '10%', left: '-60px', animationDelay: '-4s' },
            { width: 180, height: 180, background: 'radial-gradient(circle at 50% 50%, rgba(204,0,51,0.03), transparent)', top: '30%', right: '15%', animationDelay: '-8s' },
          ]}
        />
      )}

      <div className="flex-1 overflow-y-auto relative">
        <Routes>
          <Route path="/login" element={<LoginPageWrapper />} />
          <Route path="/registro" element={<RegisterWrapper />} />
          <Route path="/cambiar-clave" element={<ChangePasswordWrapper />} />
          {/* /incorporacion = agenda para agendar la cita de valoración */}
          <Route path="/incorporacion" element={<OnboardingWrapper />} />
          {/* /incorporacion/asistencia-presencial = cita ya agendada (espera) */}
      <Route path="/incorporacion/asistencia-presencial" element={<OnboardingWrapper />} />
          {/* Pantallas de aviso, públicas y estáticas: el backend es quien impide el acceso */}
          <Route path={RUTA_CUENTA_INACTIVA} element={<EstadoCuentaWrapper variante="inactiva" />} />
          <Route path={RUTA_CUENTA_PENDIENTE} element={<EstadoCuentaWrapper variante="pendiente" />} />
          <Route path="/usuario/*"element={<ProtectedRoute rolesPermitidos={['usuario']}><StudentApp /></ProtectedRoute>} />
          <Route path="/admin/*" element={<ProtectedRoute rolesPermitidos={['admin']}><AdminPage /></ProtectedRoute>}>
            <Route path="gestion" element={<GestionLayout />}>
              <Route index element={<Navigate to="usuarios" replace />} />
              <Route path="usuarios" element={<UsuariosPage />} />
              <Route path="usuarios/:id" element={<UsuarioDetalle />}>
                <Route index element={<Navigate to="general" replace />} />
                <Route path=":tab" element={null} />
              </Route>
              <Route path="equipamiento/maquinas" element={<AdminEquipamientoMaquinas />} />
              <Route path="equipamiento/ejercicios" element={<AdminEquipamientoEjercicios />} />
              <Route path="agenda" element={<AgendaPage />} />
            </Route>
          </Route>
          <Route path="/entrenador/*" element={<ProtectedRoute rolesPermitidos={['entrenador']}><TrainerPage /></ProtectedRoute>}>
            <Route path="usuarios/:id" element={<UsuarioDetalle />}>
              <Route index element={<Navigate to="general" replace />} />
              <Route path=":tab" element={null} />
            </Route>
            <Route path="equipamiento/maquinas" element={<TrainerEquipamientoMaquinas />} />
            <Route path="equipamiento/ejercicios" element={<TrainerEquipamientoEjercicios />} />
          </Route>
          <Route path="/logout" element={<LogoutWrapper />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <SesionProvider>
        <AppShell />
      </SesionProvider>
    </BrowserRouter>
  )
}
