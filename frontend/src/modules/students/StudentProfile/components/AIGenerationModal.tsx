import { motion, AnimatePresence } from 'motion/react'
import { X, Loader2 } from 'lucide-react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import routineGenLottie from '@/assets/icons/animated/ai/routine_generation.lottie?url'
import { AI_GENERATION_STEPS } from '../../aiRoutine'

interface AIGenerationModalProps {
  isOpen: boolean
  studentName: string
  onCancel: () => void
}

export function AIGenerationModal({ isOpen, studentName, onCancel }: AIGenerationModalProps) {
  const aiGenStep = 0 // Will be passed as prop later if needed

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}
        >
          <motion.div
            initial={{ opacity: 0, filter: 'blur(6px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(6px)' }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl p-8 pt-6 flex flex-col items-center relative"
            style={{
              background: 'linear-gradient(180deg, #F3E8FF 0%, #FFFFFF 100%)',
              border: '1px solid rgba(191,90,242,0.12)',
              boxShadow: '0 24px 80px rgba(124,58,237,0.18)',
            }}
          >
            <div className="absolute top-4 right-4">
              <motion.button
                whileHover={{ scale: 1.15, background: 'rgba(244,56,67,0.1)', color: '#F43843' }}
                whileTap={{ scale: 0.9 }}
                onClick={onCancel}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.3)' }}
              >
                <X size={16} />
              </motion.button>
            </div>
            <div className="relative flex-shrink-0 w-56 h-56 flex items-center justify-center pointer-events-none">
              {[...Array(24)].map((_, i) => {
                const angle = (i / 24) * 360
                const rad = (angle * Math.PI) / 180
                return (
                  <motion.span
                    key={i}
                    className="absolute pointer-events-none text-lg select-none"
                    style={{ color: '#BF5AF2' }}
                    animate={{
                      x: [0, Math.cos(rad) * (120 + (i % 6) * 20)],
                      y: [0, Math.sin(rad) * (120 + (i % 6) * 20)],
                      opacity: [0, 1, 0],
                      scale: [0, 1.4, 0],
                    }}
                    transition={{
                      duration: 2.5 + (i % 4) * 0.3,
                      repeat: Infinity,
                      delay: i * 0.07,
                      ease: 'easeOut',
                    }}
                  >
                    ✦
                  </motion.span>
                )
              })}
              <div className="relative z-10 w-56 h-56 flex items-center justify-center">
                <DotLottieReact
                  src={routineGenLottie}
                  loop
                  autoplay
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </div>
            <h3
              className="text-[2rem] leading-[1.1] font-extrabold tracking-tight text-center mt-2"
              style={{
                background: 'linear-gradient(135deg, #BF5AF2, #F472B6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Cargando rutina con IA
            </h3>
            <p className="text-xs font-medium text-center mt-1.5" style={{ color: '#8B5CF6' }}>
              Analizando la valoración de {studentName}
            </p>
            <div className="flex items-center justify-center gap-2 mt-3 min-h-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={0}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="flex items-center gap-2"
                >
                  <Loader2 size={13} color="#7C3AED" className="animate-spin flex-shrink-0" />
                  <p className="text-xs font-bold" style={{ color: '#6D28D9' }}>{AI_GENERATION_STEPS[0]}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="w-full mt-6 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(191,90,242,0.12)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #C084FC, #F472B6)' }}
                animate={{ width: `${(1 / AI_GENERATION_STEPS.length) * 100}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
