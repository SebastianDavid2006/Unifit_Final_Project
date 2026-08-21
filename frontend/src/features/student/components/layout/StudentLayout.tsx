import { useAuthLayout } from '@/auth/hooks/useAuthLayout'
import { motion, AnimatePresence } from 'motion/react'
import { Home, Dumbbell, Calendar, User, ChevronLeft, Trophy, Flame, Zap, Heart, Star, Target, Calendar as CalendarIcon } from 'lucide-react'

export interface StudentLayoutProps {
  children: React.ReactNode
  tab: 'home' | 'routines' | 'agenda' | 'profile'
  onTabChange: (tab: 'home' | 'routines' | 'agenda' | 'profile') => void
  showBackButton?: boolean
  onBack?: () => void
  title?: string
  titleColor?: string
}

export function StudentLayout({
  children,
  tab,
  onTabChange,
  showBackButton = false,
  onBack,
  title,
  titleColor = '#fff',
}: StudentLayoutProps) {
  const { isPhonePreview, isMobile } = useAuthLayout()

  const tabs = [
    { id: 'home' as const, icon: Home, label: 'Inicio' },
    { id: 'routines' as const, icon: Dumbbell, label: 'Rutinas' },
    { id: 'agenda' as const, icon: Calendar, label: 'Agenda' },
    { id: 'profile' as const, icon: User, label: 'Perfil' },
  ]

  return (
    <div className="size-full flex items-center justify-center" style={{
      background: 'radial-gradient(ellipse at 50% 30%, rgba(245,166,35,0.06) 0%, rgba(10,10,20,1) 60%)',
    }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-[0.03]" style={{
          background: 'radial-gradient(circle, #F5A623, transparent 70%)',
          animation: 'breathe 6s ease-in-out infinite',
        }} />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full opacity-[0.02]" style={{
          background: 'radial-gradient(circle, #007AFF, transparent 70%)',
          animation: 'breathe 8s ease-in-out infinite',
          animationDelay: '-3s',
        }} />
      </div>

      <div
        className="relative flex flex-col overflow-hidden"
        style={{
          width: isPhonePreview ? '100%' : 390,
          height: isPhonePreview ? '100%' : 720,
          borderRadius: isPhonePreview ? 0 : 48,
          background: '#0A0A14',
          border: isPhonePreview ? 'none' : '10px solid rgba(255,255,255,0.06)',
          boxShadow: isPhonePreview ? 'none' : '0 60px 140px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        {!isMobile && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 rounded-b-2xl z-50" style={{ background: 'rgba(0,0,0,0.85)' }}>
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-2.5 rounded-full" style={{ background: '#151520' }} />
          </div>
        )}

        <div className="flex-1 overflow-hidden pt-7">
          {/* Header */}
          <div className="px-5 pb-4 flex items-center justify-between">
            {showBackButton && onBack && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </motion.button>
            )}
            <div className="flex-1 text-center">
              {title && (
                <h1 style={{ color: titleColor, fontSize: 20, fontWeight: 700 }}>{title}</h1>
              )}
            </div>
            <div className="w-8" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="h-full overflow-y-auto px-5 pt-3 pb-20"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Tab Bar */}
        <div
          className="flex-shrink-0 flex items-center justify-around px-4 py-2"
          style={{
            background: 'rgba(10,10,20,0.97)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {[
            { id: 'home' as const, icon: '🏠', label: 'Inicio' },
            { id: 'routines' as const, icon: '🏋️', label: 'Rutinas' },
            { id: 'agenda' as const, icon: '📅', label: 'Agenda' },
            { id: 'profile' as const, icon: '👤', label: 'Perfil' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all"
              style={{ color: tab === t.id ? '#F5A623' : 'rgba(255,255,255,0.25)' }}
            >
              <span style={{ fontSize: 22 }}>{t.icon}</span>
              <span style={{ fontSize: 9, fontWeight: 600 }}>{t.label}</span>
              {tab === t.id && <div className="w-1 h-1 rounded-full mt-1" style={{ background: '#F5A623' }} />}
            </button>
          ))}
        </div>

        {/* Home indicator */}
        <div className="flex justify-center pb-2">
          <div className="w-28 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }} />
        </div>
      </div>
    </div>
  )
}