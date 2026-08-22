import { motion } from 'motion/react'
import { TABS } from '@/modules/students/StudentProfile'
import { useIsMobile } from '@/shared/components/ui/use-mobile'

interface MobileStudentTabsProps {
  studentTab: string
  onStudentTabChange: (t: string) => void
  onBack?: () => void
}

const RED_GRAD = 'linear-gradient(135deg, #F43843, #FF6B8A, #CC0033)'
const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #7ec8e3)'

export default function MobileStudentTabs({ studentTab, onStudentTabChange, onBack }: MobileStudentTabsProps) {
  const isMobile = useIsMobile()

  if (!isMobile) return null

  return (
    <>
      {onBack && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: BLUE_GRAD,
            boxShadow: '0 4px 16px rgba(18,112,183,0.35)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </motion.button>
      )}

      <div className="absolute left-1/2 -translate-x-1/2 bottom-4 flex items-center gap-3 px-3 py-2 rounded-2xl"
        style={{
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(24px) saturate(1.6)',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }}>
{TABS.map(t => (
            <motion.button
              key={t.id}
              onClick={() => onStudentTabChange(t.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-bold transition-all"
              style={{
                background: studentTab === t.id ? RED_GRAD : 'rgba(255,255,255,0.1)',
                color: studentTab === t.id ? '#FFFFFF' : 'rgba(255,255,255,0.7)',
                boxShadow: studentTab === t.id ? '0 4px 16px rgba(244,56,67,0.3)' : 'none',
              }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: studentTab === t.id ? 'rgba(255,255,255,0.2)' : 'transparent' }}>
                <t.icon size={16} style={{ color: 'currentColor' }} />
              </div>
              <span className="text-xs">{t.label}</span>
            </motion.button>
          ))}
      </div>
    </>
  )
}