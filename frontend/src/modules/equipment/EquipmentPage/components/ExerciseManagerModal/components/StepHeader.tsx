import { motion } from 'motion/react'
import { Pencil, X } from 'lucide-react'
import { BLUE_GRAD, ORANGE_GRAD, RED } from '@/data/constants'

interface StepHeaderProps {
  editing: boolean
  step: number
  onConfirmClose: () => void
  title: string
}

export function StepHeader({ editing, step, onConfirmClose, title }: StepHeaderProps) {
  return (
    <div className="sticky top-0 z-10 flex-shrink-0" style={{
      background: 'rgba(255,255,255,0.9)',
      borderBottom: '1px solid rgba(0,0,0,0.04)',
    }}>
      <div className="flex items-center justify-between px-4 pt-4 pb-0">
        <div className="flex-1" />
        {editing ? (
          <div className="flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2">
            <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
              <Pencil size={12} style={{ color: 'rgba(0,0,0,0.25)' }} />
            </div>
            <span className="text-[10px] font-bold" style={{ color: 'rgba(0,0,0,0.25)' }}>Editando...</span>
          </div>
        ) : null}
        <motion.button
          whileHover={{ scale: 1.15, background: 'rgba(244,56,67,0.1)', color: RED }}
          whileTap={{ scale: 0.9 }}
          onClick={onConfirmClose}
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors"
          style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.3)' }}
        >
          <X size={15} />
        </motion.button>
      </div>
      <div className="flex items-center justify-center gap-1.5" style={{ marginTop: 12, marginBottom: 16 }}>
        {[1, 2, 3].map(s => (
          <motion.div
            key={s}
            animate={{
              width: s === step + 1 ? 16 : 6,
              background: s === step + 1 ? (editing ? ORANGE_GRAD : BLUE_GRAD) : 'rgba(0,0,0,0.12)',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="rounded-full"
            style={{ height: 6 }}
          />
        ))}
      </div>
      <span className="text-lg font-bold tracking-wide text-center block pb-4" style={{ color: '#1A1A1E' }}>
        {title}
      </span>
    </div>
  )
}
