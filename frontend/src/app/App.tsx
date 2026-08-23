import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { LoginPage } from '@/auth/pages/LoginPage'
import { RegisterPage } from '@/auth/pages/RegisterPage'
import { ForgotPasswordPage } from '@/auth/pages/ForgotPasswordPage'
import { TrainerPage } from '@/features/trainer/pages/TrainerPage'
import { StudentApp } from '@/features/student/StudentApp'
import { AdminPage } from '@/features/admin/pages/AdminPage'
import BackgroundDecor from '@/shared/components/BackgroundDecor'
import type { MockSession } from '@/auth/types'

type Platform = 'trainer' | 'student' | 'admin'
type Screen = 'login' | 'register' | 'forgot' | Platform

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
  const [screen, setScreen] = useState<Screen>('login')
  const [studentSession, setStudentSession] = useState<MockSession | null>(null)
  const [trainerSession, setTrainerSession] = useState<MockSession | null>(null)
  const [adminSession, setAdminSession] = useState<MockSession | null>(null)

  return (
    <div
      className="size-full flex flex-col overflow-y-auto mesh-bg"
      style={{ fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif" }}
    >
      <ParticleField />

      {screen !== 'login' && (
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
              <LoginPage onSelect={(platform, session) => {
                if (session) {
                  if (platform === 'student') setStudentSession(session)
                  else if (platform === 'trainer') setTrainerSession(session)
                  else if (platform === 'admin') setAdminSession(session)
                  setScreen(platform)
                }
              }} onRegister={() => setScreen('register')} />
            </motion.div>
          )}
          {screen === 'forgot' && (
            <motion.div
              key="forgot"
              className="size-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
                <ForgotPasswordPage onBack={() => setScreen('login')} onDone={() => setScreen('login')} />
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
                <RegisterPage onBack={() => setScreen('login')} />
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
              <TrainerPage onLogout={() => setScreen('login')} />
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
              <StudentApp onLogout={() => { setStudentSession(null); setScreen('login') }} />
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
              <AdminPage onLogout={() => setScreen('login')} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
