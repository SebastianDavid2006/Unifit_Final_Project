import { motion, AnimatePresence } from 'motion/react'
import { TrashView } from '@/assets/models/ui/actions/trash/TrashModel'
import { RED } from '@/data/shared/constants'

interface DeleteAppointmentModalProps {
  show: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteAppointmentModal({ show, onClose, onConfirm }: DeleteAppointmentModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-5 p-8 rounded-3xl max-w-xs text-center mx-4"
            style={{
              background: '#FFFFFF',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              border: '1px solid rgba(0,0,0,0.04)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0" style={{ background: `${RED}10` }}>
              <TrashView />
            </div>
            <div>
              <p className="text-sm font-bold mb-1" style={{ color: '#1A1A1E' }}>¿Seguro que deseas cancelar esta cita?</p>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(0,0,0,0.4)' }}>
                Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex items-center gap-2.5 w-full">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-xs font-medium cursor-pointer"
                style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.5)' }}
              >
                No, volver
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirm}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
                style={{ background: RED }}
              >
                Sí, cancelar
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
