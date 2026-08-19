import { motion } from 'motion/react'
import assessmentSceneImg from '@/assets/scenes/physical_assessment.webp'
import routineSceneImg from '@/assets/scenes/physical_routine.webp'

interface AssessmentChoiceModalProps {
  isOpen: boolean
  assessment: any
  onViewValuation: () => void
  onViewRoutine: () => void
  onClose: () => void
}

export function AssessmentChoiceModal({ isOpen, assessment, onViewValuation, onViewRoutine, onClose }: AssessmentChoiceModalProps) {
  if (!isOpen || !assessment) return null
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-2xl rounded-3xl p-6 flex flex-col"
        style={{
          background: '#FFFFFF',
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.12)',
        }}
      >
        <div className="text-center mb-6">
          <p className="text-sm font-semibold" style={{ color: 'rgba(0,0,0,0.4)' }}>¿Qué deseas visualizar?</p>
          <h3 className="text-lg font-bold mt-1" style={{ color: '#0D1B2A' }}>Valoración del {assessment.date}</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(18,112,183,0.2)' }}
            whileTap={{ scale: 0.97 }}
            onClick={onViewValuation}
            className="relative rounded-2xl overflow-hidden h-48 flex flex-col items-center justify-center cursor-pointer"
            style={{ background: 'linear-gradient(135deg, rgba(18,112,183,0.08), rgba(18,112,183,0.02))', border: '1px solid rgba(18,112,183,0.15)' }}
          >
            <img src={assessmentSceneImg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(to top, rgba(18,112,183,0.95) 0%, rgba(18,112,183,0.55) 35%, transparent 72%)',
            }} />
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-xl font-extrabold text-white tracking-tight">Ver Valoración</span>
              <span className="text-[11px] text-white/60 mt-1">Evaluación física completa</span>
            </div>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(26,138,63,0.2)' }}
            whileTap={{ scale: 0.97 }}
            onClick={onViewRoutine}
            className="relative rounded-2xl overflow-hidden h-48 flex flex-col items-center justify-center cursor-pointer"
            style={{ background: 'linear-gradient(135deg, rgba(26,138,63,0.08), rgba(26,138,63,0.02))', border: '1px solid rgba(26,138,63,0.15)' }}
          >
            <img src={routineSceneImg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(to top, rgba(26,138,63,0.95) 0%, rgba(48,209,88,0.55) 35%, transparent 72%)',
            }} />
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-xl font-extrabold text-white tracking-tight">Ver Rutina</span>
              <span className="text-[11px] text-white/60 mt-1">Ejercicios y series asignados</span>
            </div>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
