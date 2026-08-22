import { motion, AnimatePresence } from 'motion/react'

interface ModalShellProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  zIndex?: number
  className?: string
  maxWidth?: string
  backdropBlur?: string
  backdropOpacity?: string
  contentClassName?: string
}

export function ModalShell({
  isOpen,
  onClose,
  children,
  zIndex = 50,
  className = '',
  maxWidth = 'max-w-lg',
  backdropBlur = 'blur(8px)',
  backdropOpacity = 'rgba(0,0,0,0.3)',
  contentClassName = '',
}: ModalShellProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 flex items-center justify-center p-6 ${className}`}
          style={{ zIndex, background: backdropOpacity, backdropFilter: backdropBlur }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
            className={`w-full ${maxWidth} rounded-3xl p-6 relative ${contentClassName}`}
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.12)',
            }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}