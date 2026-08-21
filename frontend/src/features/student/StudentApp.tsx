import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { StudentLayout } from '@/features/student/components/layout/StudentLayout'
import { HomePage } from '@/features/student/pages/HomePage'
import { ProfilePage } from '@/features/student/pages/ProfilePage'
import { AgendaPage } from '@/features/student/pages/AgendaPage'
import { RoutinesPage } from '@/features/student/pages/RoutinesPage'
import { StudentAppProvider } from '@/features/student/hooks/useStudentApp'

type Tab = 'home' | 'routines' | 'agenda' | 'profile'

interface StudentAppProps {
  onLogout: () => void
}

export function StudentApp({ onLogout }: StudentAppProps) {
  const [tab, setTab] = useState<Tab>('home')

  const handleBack = useCallback(() => {
    if (tab !== 'home') {
      setTab('home')
    } else {
      onLogout()
    }
  }, [tab, onLogout])

  const currentTitle = {
    home: 'Inicio',
    routines: 'Mis Rutinas',
    agenda: 'Agenda',
    profile: 'Perfil',
  }[tab]

  const showBackButton = tab !== 'home'

  return (
    <StudentAppProvider>
      <StudentLayout
        tab={tab}
        onTabChange={setTab}
        showBackButton={showBackButton}
        onBack={handleBack}
        title={currentTitle}
      >
        <AnimatePresence mode="wait">
          {tab === 'home' && <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><HomePage /></motion.div>}
          {tab === 'routines' && <motion.div key="routines" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><RoutinesPage /></motion.div>}
          {tab === 'agenda' && <motion.div key="agenda" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><AgendaPage /></motion.div>}
          {tab === 'profile' && <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><ProfilePage /></motion.div>}
        </AnimatePresence>
      </StudentLayout>
    </StudentAppProvider>
  )
}