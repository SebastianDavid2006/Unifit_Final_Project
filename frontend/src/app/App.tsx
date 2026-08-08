import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Brain } from 'lucide-react'
import { TrainerDashboard } from '../pages/TrainerPage'
import { StudentMobileApp } from '../pages/StudentPage'
import { AdminDashboard } from '../pages/AdminPage'
import { LoginPage } from '../pages/LoginPage'

type Platform = 'trainer' | 'student' | 'admin'

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
  const [screen, setScreen] = useState<'login' | Platform>('login')

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

      {screen === 'login' && (
        <div className="absolute top-4 right-8 flex items-center gap-1.5 px-3 py-1.5 rounded-full z-50" style={{
          background: 'rgba(255,255,255,0.55)',
          backdropFilter: 'blur(25px) saturate(1.4)',
          border: '1px solid rgba(0,0,0,0.04)',
        }}>
          <Brain size={11} style={{ color: '#E63946' }} />
          <span className="text-[10px] font-semibold" style={{ color: '#E63946' }}>IA EN VIVO</span>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#E63946', animation: 'pulse-glow 2s ease-in-out infinite' }} />
        </div>
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
              <LoginPage onSelect={(platform) => setScreen(platform)} />
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
              <TrainerDashboard onLogout={() => setScreen('login')} />
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
              <StudentMobileApp />
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
              <AdminDashboard onLogout={() => setScreen('login')} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
