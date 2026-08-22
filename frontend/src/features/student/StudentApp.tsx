import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { LogOut } from 'lucide-react'
import { StudentLayout } from '@/features/student/components/layout/StudentLayout'
import { HomePage } from '@/features/student/modules/inicio/HomePage'
import { ProfilePage } from '@/features/student/modules/perfil/ProfilePage'
import { AgendaPage } from '@/features/student/modules/agenda/AgendaPage'
import { RoutinesPage } from '@/features/student/modules/rutinas/RoutinesPage'
import { StudentAppProvider } from '@/features/student/hooks/useStudentApp'
import { FIRE } from '@/features/student/components/ui/fitness'

type Tab = 'home' | 'routines' | 'agenda' | 'profile'

interface StudentAppProps {
  onLogout: () => void
}

export function StudentApp({ onLogout }: StudentAppProps) {
  const [tab, setTab] = useState<Tab>('home')
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  return (
    <StudentAppProvider>
      <StudentLayout tab={tab} onTabChange={setTab} onLogoutClick={() => setShowLogoutModal(true)}>
        <AnimatePresence mode="wait">
          {tab === 'home' && <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><HomePage /></motion.div>}
          {tab === 'routines' && <motion.div key="routines" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><RoutinesPage /></motion.div>}
          {tab === 'agenda' && <motion.div key="agenda" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><AgendaPage /></motion.div>}
          {tab === 'profile' && <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><ProfilePage /></motion.div>}
        </AnimatePresence>
      </StudentLayout>

      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            key="logout-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'rgba(4,4,10,0.75)', backdropFilter: 'blur(6px)' }}
            onClick={() => setShowLogoutModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="w-full max-w-sm rounded-3xl p-7 text-center"
              style={{ background: '#12121C', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="mx-auto mb-4 w-14 h-14 rounded-2xl flex items-center justify-center rotate-[-8deg]" style={{ background: FIRE + '15', border: `1.5px solid ${FIRE}40` }}>
                <LogOut size={24} color={FIRE} />
              </div>
              <h3 className="uppercase italic font-black text-white tracking-wide" style={{ fontSize: 18 }}>
                ¿Cerrar sesión?
              </h3>
              <p className="mt-2 mb-6" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12.5, lineHeight: 1.55 }}>
                Tu progreso queda guardado. Podrás volver cuando quieras.
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="rounded-xl py-2.5 font-bold text-white transition-all hover:bg-white/10"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', fontSize: 13 }}
                >
                  Cancelar
                </button>
                <button
                  onClick={onLogout}
                  className="rounded-xl py-2.5 font-black uppercase italic tracking-wide text-white transition-transform hover:-translate-y-0.5"
                  style={{ background: `linear-gradient(135deg, ${FIRE}, #C1121F)`, fontSize: 13, boxShadow: `0 8px 24px ${FIRE}44` }}
                >
                  Cerrar sesión
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </StudentAppProvider>
  )
}
