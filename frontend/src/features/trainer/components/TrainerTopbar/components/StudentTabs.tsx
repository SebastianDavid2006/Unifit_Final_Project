import { motion } from 'motion/react'
import { TABS } from '@/modules/students/StudentProfile'
import iconRunning from '@/assets/icons/animated/icon_running.gif'
import PillButton from './PillButton'
import MobileStudentTabs from '@/features/shared/components/MobileStudentTabs'
import { useIsMobile } from '@/shared/components/ui/use-mobile'

const TAB_GRAD = 'radial-gradient(ellipse at 20% 30%, rgba(230,57,70,0.35) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(18,112,183,0.3) 0%, transparent 50%), radial-gradient(ellipse at 50% 90%, rgba(241,200,39,0.3) 0%, transparent 50%), rgba(230,57,70,0.85)'
const TAB_SHADOW = '0 2px 8px rgba(230,57,70,0.2), 0 0 20px rgba(230,57,70,0.1)'

export default function StudentTabs({ studentTab, onStudentTabChange, onBack }: {
  studentTab: string
  onStudentTabChange: (t: string) => void
  onBack: () => void
}) {
  const isMobile = useIsMobile()

  return (
    <>
      <MobileStudentTabs studentTab={studentTab} onStudentTabChange={onStudentTabChange} onBack={onBack} />
      
      {!isMobile && (
        <>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onBack}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(16px) saturate(1.5)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
            }}
          >
            <img src={iconRunning} alt="Volver" className="w-5 h-5 object-contain" style={{ transform: 'scaleX(-1)' }} />
          </motion.button>

          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-2xl px-2 py-1.5" style={{
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(24px) saturate(1.6)',
            border: '1px solid rgba(255,255,255,0.25)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
          }}>
            {TABS.map(t => (
              <PillButton
                key={t.id}
                active={studentTab === t.id}
                activeBackground={TAB_GRAD}
                boxShadow={TAB_SHADOW}
                inactiveColor="rgba(0,0,0,0.3)"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                onClick={() => onStudentTabChange(t.id)}
              >
                <t.icon size={14} />
                {t.label}
              </PillButton>
            ))}
          </div>
        </>
      )}
    </>
  )
}
