import { motion, AnimatePresence } from 'motion/react'
import { EQUIPMENT_IMAGES } from '@/modules/equipment/data'

interface CreateOptionsOverlayProps {
  show: boolean
  onClose: () => void
  onCreateMachine: () => void
  onCreateExercise: () => void
}

export function CreateOptionsOverlay({ show, onClose, onCreateMachine, onCreateExercise }: CreateOptionsOverlayProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex gap-6">
              <motion.button
                whileHover={{ scale: 1.04, y: -6 }}
                whileTap={{ scale: 0.97 }}
                onClick={onCreateMachine}
                className="relative w-80 h-96 rounded-3xl flex flex-col items-center justify-end p-8 overflow-hidden cursor-pointer"
                style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
              >
                <img src={EQUIPMENT_IMAGES.machineExercisesImg} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none scale-125 translate-y-6" />
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: 'linear-gradient(to top, rgba(18,112,183,0.95) 0%, rgba(18,112,183,0.6) 50%, rgba(0,0,0,0.5) 100%)',
                }} />
                <div className="relative z-10 flex flex-col items-center">
                  <span className="text-xl font-extrabold text-white tracking-tight">¡Registrar Máquina!</span>
                  <span className="text-[11px] text-white/60 mt-1">Agrega una nueva máquina</span>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04, y: -6 }}
                whileTap={{ scale: 0.97 }}
                onClick={onCreateExercise}
                className="relative w-80 h-96 rounded-3xl flex flex-col items-center justify-end p-8 overflow-hidden cursor-pointer"
                style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
              >
                <img src={EQUIPMENT_IMAGES.modalExercisesImg} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none scale-150 -translate-y-2 translate-x-20" />
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: 'linear-gradient(to top, rgba(48,209,88,0.95) 0%, rgba(48,209,88,0.6) 50%, rgba(0,0,0,0.5) 100%)',
                }} />
                <div className="relative z-10 flex flex-col items-center">
                  <span className="text-lg font-extrabold text-white tracking-tight">¡Registrar Ejercicio!</span>
                  <span className="text-[11px] text-white/60 mt-1">Añade un nuevo ejercicio</span>
                </div>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
