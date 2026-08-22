import { motion, AnimatePresence } from 'motion/react'
import { AlertTriangle } from 'lucide-react'
import { MESH_GRAD } from '../data'

interface PublishConfirmProps {
  show: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function PublishConfirm({ show, onCancel, onConfirm }: PublishConfirmProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 z-20 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.2)' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-4 p-6 rounded-2xl w-[340px] text-center"
            style={{
              background: '#FFFFFF',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              border: '1px solid rgba(0,0,0,0.04)',
            }}
          >
            <div className="w-10 h-10 mx-auto rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,149,0,0.12)' }}>
              <AlertTriangle size={18} color="#FF9500" />
            </div>
            <div>
              <p className="text-sm font-bold mb-1" style={{ color: '#1A1A1E' }}>¿Publicar cupos?</p>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(0,0,0,0.45)' }}>
                Antes de continuar, revisa bien los tiempos de cada día y asegúrate de que todo quedó configurado.
              </p>
            </div>
            <div className="flex flex-col items-start gap-1.5 text-left">
              {[
                'Verifica las horas de apertura y cierre de cada día.',
                'Asegúrate de que los horarios no se crucen entre sí.',
                'Se publicarán los días activos dentro del rango seleccionado.',
              ].map((w, i) => (
                <div key={i} className="flex items-start gap-1.5 text-[11px] leading-relaxed" style={{ color: 'rgba(0,0,0,0.55)' }}>
                  <span className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#FF9500' }} />
                  {w}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2.5 w-full">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onCancel}
                className="flex-1 py-2.5 rounded-xl text-xs font-medium cursor-pointer"
                style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.5)' }}
              >
                Cancelar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirm}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
                style={{ background: MESH_GRAD }}
              >
                Sí, publicar
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
