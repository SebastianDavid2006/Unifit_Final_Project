import { motion } from 'motion/react'
import { Home, Dumbbell, Calendar, User, LogOut } from 'lucide-react'
import { FitnessBackdrop } from '@/features/student/components/ui/fitness'
import logo from '@/assets/logo/logo.webp'

export interface StudentLayoutProps {
  children: React.ReactNode
  tab: 'home' | 'routines' | 'agenda' | 'profile'
  onTabChange: (tab: 'home' | 'routines' | 'agenda' | 'profile') => void
  onLogoutClick?: () => void
}

const NAV = [
  { id: 'home' as const, icon: Home, label: 'Inicio' },
  { id: 'routines' as const, icon: Dumbbell, label: 'Rutinas' },
  { id: 'agenda' as const, icon: Calendar, label: 'Agenda' },
  { id: 'profile' as const, icon: User, label: 'Perfil' },
]

export function StudentLayout({ children, tab, onTabChange, onLogoutClick }: StudentLayoutProps) {
  return (
    <div className="relative flex h-screen w-full max-w-full overflow-hidden" style={{ background: '#06060C', height: '100dvh' }}>
      <FitnessBackdrop />

      {/* Sidebar desktop */}
      <aside
        className="relative z-20 hidden md:flex flex-col w-[220px] flex-shrink-0 py-6 px-4 sticky top-0 self-start h-screen max-h-screen"
        style={{ background: 'rgba(8,8,15,0.75)', backdropFilter: 'blur(24px)', borderRight: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center gap-2.5 px-2 mb-10">
          <img src={logo} alt="UNIFIT" style={{ height: 34, objectFit: 'contain' }} />
          <p className="font-black italic uppercase leading-none text-white" style={{ fontSize: 19, letterSpacing: '0.04em' }}>
            UNI<span style={{ color: '#E63946' }}>FIT</span>
          </p>
        </div>

        <p className="uppercase px-3 mb-2" style={{ fontSize: 9, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.28)', fontWeight: 700 }}>
          Menú
        </p>
        <nav className="flex flex-col gap-1.5">
          {NAV.map(item => {
            const active = tab === item.id
            return (
              <motion.button
                key={item.id}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onTabChange(item.id)}
                className="relative flex items-center gap-3 px-3 py-3 rounded-2xl transition-colors"
                style={{
                  background: active ? 'linear-gradient(135deg, rgba(230,57,70,0.16), rgba(245,166,35,0.08))' : 'transparent',
                  border: active ? '1px solid rgba(230,57,70,0.3)' : '1px solid transparent',
                  color: active ? '#fff' : 'rgba(255,255,255,0.42)',
                }}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full" style={{ background: 'linear-gradient(180deg,#E63946,#F5A623)' }} />
                )}
                <item.icon size={19} strokeWidth={active ? 2.4 : 2} style={active ? { color: '#F5A623' } : undefined} />
                <span style={{ fontSize: 13.5, fontWeight: active ? 700 : 500 }}>{item.label}</span>
              </motion.button>
            )
          })}
        </nav>

        <div className="mt-auto rounded-2xl p-3.5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg,#E63946,#F5A623)', fontSize: 12 }}>
              AG
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white font-semibold truncate" style={{ fontSize: 12 }}>Ana García</p>
              <p className="truncate" style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>Estudiante activa</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.9 }}
              onClick={onLogoutClick}
              title="Cerrar sesión"
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
              style={{ background: 'rgba(230,57,70,0.12)', border: '1px solid rgba(230,57,70,0.28)', color: '#E63946' }}
            >
              <LogOut size={14} />
            </motion.button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="relative z-10 flex-1 flex flex-col min-w-0">
        {/* Top bar mobile */}
        <header
          className="md:hidden relative z-20 flex items-center justify-between px-5 pt-5 pb-3"
          style={{ background: 'rgba(8,8,15,0.72)', backdropFilter: 'blur(18px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-2">
            <img src={logo} alt="UNIFIT" style={{ height: 26, objectFit: 'contain' }} />
          </div>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white" style={{ background: 'linear-gradient(135deg,#E63946,#F5A623)', fontSize: 11 }}>
            AG
          </div>
        </header>

        {/* Page title desktop */}
        <header className="hidden md:flex items-center justify-between px-10 pt-8 pb-2">
          <h1 className="uppercase italic font-black tracking-wide text-white" style={{ fontSize: 26, letterSpacing: '0.04em' }}>
            {tab === 'home' ? 'Inicio' : tab === 'routines' ? 'Mis Rutinas' : tab === 'agenda' ? 'Agenda' : 'Perfil'}
          </h1>
        </header>

        <div key={tab} className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-5 md:px-10 pt-4 pb-28 md:pb-10 w-full max-w-full" style={{ scrollBehavior: 'smooth', overscrollBehaviorX: 'none' }}>
          <div className="max-w-6xl mx-auto">{children}</div>
        </div>

        {/* Bottom nav mobile */}
        <nav
          className="md:hidden absolute bottom-0 left-0 right-0 z-30 flex items-center justify-around px-2 pt-2"
          style={{
            background: 'rgba(8,8,15,0.92)',
            backdropFilter: 'blur(24px)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingBottom: 'max(env(safe-area-inset-bottom), 10px)',
          }}
        >
          {NAV.map(item => {
            const active = tab === item.id
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className="flex flex-col items-center gap-1 px-5 py-1.5 rounded-2xl transition-all"
                style={{
                  background: active ? 'linear-gradient(135deg, rgba(230,57,70,0.2), rgba(245,166,35,0.1))' : 'transparent',
                }}
              >
                <item.icon size={21} strokeWidth={active ? 2.5 : 2} style={{ color: active ? '#F5A623' : 'rgba(255,255,255,0.35)' }} />
                <span style={{ fontSize: 9.5, fontWeight: active ? 800 : 600, color: active ? '#fff' : 'rgba(255,255,255,0.4)', letterSpacing: '0.04em' }}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </nav>
      </main>
    </div>
  )
}
