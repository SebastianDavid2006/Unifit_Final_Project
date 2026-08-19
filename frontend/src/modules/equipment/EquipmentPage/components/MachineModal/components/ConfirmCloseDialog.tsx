import { motion, AnimatePresence } from 'motion/react'
import { X } from 'lucide-react'
import { RED, ORANGE } from '@/data/shared/constants'

interface ConfirmCloseDialogProps {
  show: boolean
  editingMachine: boolean
  onConfirm: (v: boolean) => void
  onClose: () => void
}

export function ConfirmCloseDialog({ show, editingMachine, onConfirm, onClose }: ConfirmCloseDialogProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 z-20 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.15)' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-5 p-8 rounded-2xl max-w-xs text-center"
            style={{
              background: '#FFFFFF',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              border: '1px solid rgba(0,0,0,0.04)',
            }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: editingMachine ? 'rgba(255,149,0,0.1)' : `${RED}15` }}>
              <X size={18} color={editingMachine ? ORANGE : RED} />
            </div>
            <div>
              <p className="text-sm font-bold mb-1" style={{ color: '#1A1A1E' }}>{editingMachine ? '¿Deseas salirte de la edición?' : '¿Abandonar el registro?'}</p>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(0,0,0,0.4)' }}>
                {editingMachine ? 'Si sales ahora, los cambios no guardados se perderán.' : 'Si cierras ahora, los datos ingresados se perderán.'}
              </p>
            </div>
            <div className="flex items-center gap-2.5 w-full">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onConfirm(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-medium cursor-pointer"
                style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.5)' }}
              >
                Seguir aquí
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { onConfirm(false); onClose() }}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
                style={{ background: editingMachine ? ORANGE : RED }}
              >
                Salir
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
