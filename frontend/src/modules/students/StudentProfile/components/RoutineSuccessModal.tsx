import { motion } from 'framer-motion'
import coachCongratsImg from '@/assets/illustrations/characters/coach/coach_congratulations.webp'
import coachMagicImg from '@/assets/illustrations/characters/coach/coach_magic.png'

interface RoutineSuccessModalProps {
  isOpen: boolean
  fromAI: boolean
  studentName: string
  onClose: () => void
}

export function RoutineSuccessModal({ isOpen, fromAI, studentName, onClose }: RoutineSuccessModalProps) {
  if (!isOpen) return null
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-2xl rounded-3xl flex flex-col relative"
        style={{
          background: '#FFFFFF',
          border: `1px solid ${fromAI ? 'rgba(191,90,242,0.15)' : 'rgba(34,197,94,0.15)'}`,
          boxShadow: `0 25px 60px ${fromAI ? 'rgba(124,58,237,0.18)' : 'rgba(34,197,94,0.18)'}`,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center pt-8 px-6"
        >
          <div className="relative flex items-center justify-center -mt-28 mb-6">
            {[...Array(24)].map((_, i) => {
              const angle = (i / 24) * 360
              const rad = (angle * Math.PI) / 180
              return (
                <motion.span
                  key={i}
                  className="absolute pointer-events-none text-lg select-none"
                  style={{ color: fromAI ? '#C084FC' : '#4ADE80' }}
                  animate={{
                    x: [0, Math.cos(rad) * (110 + (i % 6) * 20)],
                    y: [0, Math.sin(rad) * (110 + (i % 6) * 20)],
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
            <div className="relative flex items-center justify-center">
              <motion.img
                src={fromAI ? coachMagicImg : coachCongratsImg}
                alt="rutina generada"
                className="w-96 h-auto object-contain relative z-10"
                style={{ filter: `drop-shadow(0 0 30px ${fromAI ? 'rgba(124,58,237,0.2)' : 'rgba(34,197,94,0.15)'})` }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-24 pointer-events-none z-20" style={{
                background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, transparent 60%)',
              }} />
            </div>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-lg font-bold text-center"
            style={{ color: '#1A1A1E' }}
          >
            ¡Se generó la rutina!
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.4 }}
            className="text-sm font-medium mt-1 text-center"
            style={{ color: 'rgba(0,0,0,0.35)' }}
          >
            La rutina fue creada y asignada correctamente al plan de {studentName}.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            whileHover={{ scale: 1.05, boxShadow: `0 10px 28px ${fromAI ? 'rgba(124,58,237,0.4)' : 'rgba(48,209,88,0.4)'}`, transition: { duration: 0.15 } }}
            whileTap={{ scale: 0.93 }}
            onClick={onClose}
            className="mt-7 mb-10 px-10 py-3 rounded-2xl text-xs font-bold text-white cursor-pointer shadow-lg"
            style={{
              background: fromAI ? 'linear-gradient(135deg, #BF5AF2, #F472B6)' : 'linear-gradient(135deg, #30D158, #00C7BE)',
              boxShadow: `0 10px 26px ${fromAI ? 'rgba(191,90,242,0.35)' : 'rgba(48,209,88,0.35)'}`,
            }}
          >
            Cerrar
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
