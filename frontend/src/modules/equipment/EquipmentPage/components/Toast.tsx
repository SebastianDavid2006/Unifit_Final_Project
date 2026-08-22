import type { CSSProperties, ReactNode } from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface ToastProps {
  show: boolean
  name: string
  progress: number
  title: string
  icon: ReactNode
  iconStyle?: CSSProperties
  boxShadow: string
  progressGradient: string
  iconClassName?: string
}

export function Toast({ show, name, progress, title, icon, iconStyle, boxShadow, progressGradient, iconClassName = 'w-[60px] h-[60px] flex-shrink-0' }: ToastProps) {
  return (
    <AnimatePresence>
      {show && name && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 z-[70] flex items-center gap-4 rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            boxShadow,
            border: '1px solid rgba(255,255,255,0.5)',
          }}
        >
          <div className={iconClassName} style={iconStyle}>
            {icon}
          </div>
          <div className="flex-1 min-w-0 py-3 pr-5">
            <p className="text-sm font-extrabold" style={{ color: '#1A1A1E' }}>{title}</p>
            <p className="text-xs font-medium mt-0.5 truncate" style={{ color: 'rgba(0,0,0,0.45)' }}>{name}</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: 'rgba(0,0,0,0.06)' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: progressGradient, transition: 'width 0.1s linear' }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
