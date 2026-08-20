import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { TrainerView } from '../views/trainer/TrainerView'
import { StudentView } from '../views/student/StudentView'
import { AdminView } from '../views/admin/AdminView'
import { LoginView } from '../views/login/LoginView'
import { RegisterView } from '../views/login/RegisterView'
import { cerrarSesion, getUsuario, mapRolToPlatform, type Platform } from '../lib/auth'

type Screen = 'login' | 'register' | 'agenda' | Platform

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

export default function App() {
  const [screen, setScreen] = useState<Screen>(() => {
    const usuario = getUsuario()
    if (!usuario) return 'login'
    return usuario.estado === 'pendiente' ? 'agenda' : mapRolToPlatform(usuario.rol)
  })

  const handleLogout = () => {
    cerrarSesion()
    setScreen('login')
  }

  return (
    <div
      className="size-full flex flex-col overflow-hidden mesh-bg"
      style={{ fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif" }}
    >
      <ParticleField />

      {screen !== 'login' && (
        <>
          <div className="floating-sphere" style={{
            width: 380, height: 380,
            background: 'radial-gradient(circle at 30% 30%, rgba(230,57,70,0.05), transparent)',
            top: '-120px', right: '-80px', animationDelay: '0s',
          }} />
          <div className="floating-sphere" style={{
            width: 250, height: 250,
            background: 'radial-gradient(circle at 70% 30%, rgba(255,107,138,0.04), transparent)',
            bottom: '10%', left: '-60px', animationDelay: '-4s',
          }} />
          <div className="floating-sphere" style={{
            width: 180, height: 180,
            background: 'radial-gradient(circle at 50% 50%, rgba(204,0,51,0.03), transparent)',
            top: '30%', right: '15%', animationDelay: '-8s',
          }} />
        </>
      )}

      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {screen === 'login' && (
            <motion.div
              key="login"
              className="size-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <LoginView onSelect={(platform) => setScreen(platform)} onRegister={() => setScreen('register')} onPendiente={() => setScreen('agenda')} />
            </motion.div>
          )}
          {screen === 'register' && (
            <motion.div
              key="register"
              className="size-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <RegisterView onBack={() => setScreen('login')} />
            </motion.div>
          )}
          {screen === 'agenda' && (
            <motion.div
              key="agenda"
              className="size-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <RegisterView onBack={() => setScreen('login')} initialPhase="schedule" />
            </motion.div>
          )}
          {screen === 'trainer' && (
            <motion.div
              key="trainer"
              className="size-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <TrainerView onLogout={handleLogout} />
            </motion.div>
          )}
          {screen === 'student' && (
            <motion.div
              key="student"
              className="size-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <StudentView onLogout={handleLogout} />
            </motion.div>
          )}
          {screen === 'admin' && (
            <motion.div
              key="admin"
              className="size-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <AdminView onLogout={handleLogout} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
