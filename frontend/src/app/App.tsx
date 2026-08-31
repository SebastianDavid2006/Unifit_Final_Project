import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router'
import { guardarSesion, getUsuario, getToken, cerrarSesion, mapRolToPlatform } from '@/lib/auth'
import { toast, Toaster } from 'sonner'
import { LoginPage, type LoginSession } from '@/auth/pages/LoginPage'
import { RegisterPage } from '@/auth/pages/RegisterPage'
import { ChangePasswordPage } from '@/auth/pages/ChangePasswordPage'
import { OnboardingPage } from '@/auth/pages/OnboardingPage'
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

  const token = getToken()
  const usuario = getUsuario()
  if (token && usuario) {
    if (usuario.estado === 'pendiente') return <Navigate to="/usuario/activacion" replace />
    if (usuario.debe_cambiar_password) return <Navigate to="/cambiar-clave" replace />
    const platform = mapRolToPlatform(usuario.rol)
    if (platform === 'student') return <Navigate to="/usuario/inicio" replace />
    if (platform === 'trainer') return <Navigate to="/entrenador/dashboard" replace />
    return <Navigate to="/admin/dashboard" replace />
  }

  return (
    <LoginPage
      onSelect={(platform, session) => {
        if (session) {
          if (session.user.debeCambiarContrasena) {
            navigate('/cambiar-clave')
          } else if (session.user.estado === 'pendiente') {
            navigate('/usuario/activacion')
          } else if (platform === 'student') {
            navigate('/usuario/inicio')
          } else if (platform === 'trainer') {
            navigate('/entrenador/dashboard')
          } else {
            navigate('/admin/dashboard')
          }
        }
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
  const usuario = getUsuario()
  if (!usuario) return <Navigate to="/login" replace />

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
  const usuario = getUsuario()
  if (!usuario) return <Navigate to="/login" replace />

  return (
    <OnboardingPage
      session={{
        user: {
          id_usuario: usuario.id_usuario,
          email: usuario.email_contacto,
          nombre: `${usuario.primer_nombre} ${usuario.primer_apellido}`.trim(),
          rol: usuario.rol,
          tipo_usuario: usuario.tipo_usuario,
          estado: usuario.estado,
          debeCambiarContrasena: usuario.debe_cambiar_password,
        },
        token: getToken()!,
      }}
      onComplete={() => { cerrarSesion(); navigate('/login') }}
      onBack={() => { cerrarSesion(); navigate('/login') }}
    />
  )
}

function LogoutWrapper() {
  cerrarSesion()
  return <Navigate to="/login" replace />
}

const AUTH_ROUTES = ['/login', '/registro', '/cambiar-clave', '/usuario/activacion']

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
          <Route path="/usuario/activacion" element={<OnboardingWrapper />} />
          <Route path="/usuario/*" element={<ProtectedRoute rolesPermitidos={['usuario']}><StudentApp /></ProtectedRoute>} />
          <Route path="/admin/*" element={<ProtectedRoute rolesPermitidos={['admin']}><AdminPage /></ProtectedRoute>}>
            <Route path="gestion" element={<GestionLayout />}>
              <Route index element={<Navigate to="usuarios" replace />} />
              <Route path="usuarios" element={<UsuariosPage />} />
              <Route path="usuarios/:id" element={<UsuarioDetalle />} />
              <Route path="equipamiento/maquinas" element={<AdminEquipamientoMaquinas />} />
              <Route path="equipamiento/ejercicios" element={<AdminEquipamientoEjercicios />} />
              <Route path="agenda" element={<AgendaPage />} />
            </Route>
          </Route>
          <Route path="/entrenador/*" element={<ProtectedRoute rolesPermitidos={['entrenador']}><TrainerPage /></ProtectedRoute>}>
            <Route path="usuarios/:id" element={<UsuarioDetalle />} />
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
      <AppShell />
    </BrowserRouter>
  )
}
