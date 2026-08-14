import { motion, AnimatePresence } from 'motion/react'
import { Dumbbell } from 'lucide-react'
import type { Status } from '@/data/types'
import { GREEN_GRAD } from '@/data/constants'

interface CreateAnotherDialogProps {
  show: boolean
  onAskCreateAnother: (v: boolean) => void
  onStepChange: (step: number) => void
  onFormChange: (form: any) => void
  onCreateAnotherNo: () => void
}

export function CreateAnotherDialog({ show, onAskCreateAnother, onStepChange, onFormChange, onCreateAnotherNo }: CreateAnotherDialogProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer"
          style={{ background: 'rgba(0,0,0,0.15)' }}
          onClick={() => onAskCreateAnother(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-5 p-8 rounded-2xl max-w-xs text-center cursor-default"
            style={{
              background: '#FFFFFF',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              border: '1px solid rgba(0,0,0,0.04)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(10,132,255,0.1)' }}>
              <Dumbbell size={18} color="#0A84FF" />
            </div>
            <div>
              <p className="text-sm font-bold mb-1" style={{ color: '#1A1A1E' }}>¿Desea crear otro ejercicio?</p>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(0,0,0,0.4)' }}>
                Puede seguir registrando ejercicios o finalizar.
              </p>
            </div>
            <div className="flex items-center gap-2.5 w-full">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onFormChange({ name: '', zone: '', description: '', status: 'active' as Status, muscleGroups: [], recommendedLevel: 'principiante', imageUrl: '', videoUrl: '' })
                  onStepChange(0)
                  onAskCreateAnother(false)
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-medium cursor-pointer"
                style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.5)' }}
              >
                Sí, crear otro
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onAskCreateAnother(false)
                  onCreateAnotherNo()
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
                style={{ background: GREEN_GRAD }}
              >
                No, finalizar
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
