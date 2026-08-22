import { motion } from 'motion/react'
import { X } from 'lucide-react'
import { BLUE_GRAD, RED, STEPS } from '../data'

export default function ModalHeader({ step, onClose }: {
  step: number
  onClose: () => void
}) {
  return (
    <div className="sticky top-0 z-10 flex-shrink-0" style={{
      background: 'rgba(255,255,255,0.9)',
      borderBottom: '1px solid rgba(0,0,0,0.04)',
    }}>
      <div className="flex items-center justify-end p-4 pb-0">
        <motion.button
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          variants={{
            rest: { scale: 1, background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.3)' },
            hover: { scale: 1.15, background: 'rgba(244,56,67,0.1)', color: RED },
            tap: { scale: 0.9 },
          }}
          onClick={onClose}
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors"
        >
          <X size={15} />
        </motion.button>
      </div>
      <div className="flex items-center justify-center gap-1.5" style={{ marginTop: 12, marginBottom: 16 }}>
        {STEPS.map((s) => (
          <motion.div
            key={s.num}
            animate={{
              width: s.num === step ? 16 : 6,
              background: s.num === step ? BLUE_GRAD : 'rgba(0,0,0,0.12)',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="rounded-full"
            style={{ height: 6 }}
          />
        ))}
      </div>
      <span className="text-lg font-bold tracking-wide text-center block" style={{
        color: '#1A1A1E',
        marginBottom: 10,
      }}>
        {STEPS.find(s => s.num === step)!.label}
      </span>
    </div>
  )
}
