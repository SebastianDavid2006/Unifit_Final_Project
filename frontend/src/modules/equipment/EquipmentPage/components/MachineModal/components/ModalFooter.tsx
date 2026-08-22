import { motion } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { BLUE_GRAD, GREEN_GRAD, ORANGE_GRAD } from '@/data/shared/constants'

interface ModalFooterProps {
  editingMachine: boolean
  step: number
  nameTrimmed: boolean
  onStepChange: (step: number) => void
  onSave: () => void
}

export function ModalFooter({ editingMachine, step, nameTrimmed, onStepChange, onSave }: ModalFooterProps) {
  return (
    <div className="flex-shrink-0 p-6 pt-4" style={{
      borderTop: '1px solid rgba(0,0,0,0.04)',
      background: 'rgba(255,255,255,0.8)',
    }}>
      <div className="flex items-center justify-between">
        <div className="flex-1 flex justify-start">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onStepChange(step - 1)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium cursor-pointer"
            style={{ background: 'rgba(0,0,0,0.04)', color: step > 0 ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.15)' }}
          >
            <ChevronLeft size={14} />
            Atrás
          </motion.button>
        </div>
        <div className="flex-1 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => { if (step < 2) onStepChange(step + 1); else onSave() }}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
            style={{
              background: step === 0 && !nameTrimmed ? 'rgba(0,0,0,0.15)' : (editingMachine ? ORANGE_GRAD : (step === 2 ? GREEN_GRAD : BLUE_GRAD)),
              cursor: step === 0 && !nameTrimmed ? 'not-allowed' : 'pointer',
            }}
          >
            {step < 2 ? (
              <>
                Siguiente <ChevronRight size={14} />
              </>
            ) : (
              editingMachine ? 'Guardar Cambios' : 'Registrar Máquina'
            )}
          </motion.button>
        </div>
      </div>
    </div>
  )
}
