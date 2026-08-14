import { motion } from 'motion/react'
import { ChevronLeft } from 'lucide-react'
import { BLUE_GRAD, ORANGE_GRAD } from '@/data/constants'

interface ModalFooterProps {
  editing: boolean
  step: number
  nameTrimmed: boolean
  onStepChange: (step: number) => void
  onConfirmClose: () => void
  onSave: () => void
}

export function ModalFooter({ editing, step, nameTrimmed, onStepChange, onConfirmClose, onSave }: ModalFooterProps) {
  return (
    <div className="flex items-center justify-between px-6 pb-6 pt-2">
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => {
          if (step > 0) onStepChange(step - 1)
          else onConfirmClose()
        }}
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold"
        style={{ color: 'rgba(0,0,0,0.3)' }}
      >
        <ChevronLeft size={14} />
        {step === 0 ? 'Cancelar' : 'Anterior'}
      </motion.button>
      <motion.button
        whileHover={step < 2 || !nameTrimmed ? { scale: 1 } : { scale: 1.06, boxShadow: editing ? '0 8px 30px rgba(255,149,0,0.35), 0 0 60px rgba(255,149,0,0.1)' : '0 8px 30px rgba(18,112,183,0.35), 0 0 60px rgba(18,112,183,0.1)' }}
        whileTap={{ scale: 0.97 }}
        onClick={() => {
          if (step < 2) onStepChange(step + 1)
          else onSave()
        }}
        className="px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all duration-200"
        style={{
          background: editing ? ORANGE_GRAD : BLUE_GRAD,
          boxShadow: editing ? '0 4px 20px rgba(255,149,0,0.3)' : '0 4px 20px rgba(18,112,183,0.3)',
          opacity: step === 0 && !nameTrimmed ? 0.5 : 1,
        }}
        disabled={step === 0 && !nameTrimmed}
      >
        {step < 2 ? 'Siguiente' : 'Guardar Ejercicio'}
      </motion.button>
    </div>
  )
}
