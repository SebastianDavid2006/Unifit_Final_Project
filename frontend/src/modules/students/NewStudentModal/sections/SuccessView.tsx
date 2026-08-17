import { motion } from 'motion/react'
import { Mail } from 'lucide-react'
import { BLUE_GRAD } from '@/modules/students/NewStudentData'
import coachCongratsImg from '@/assets/illustrations/characters/coach/coach_congratulations.webp'

interface SuccessViewProps {
  createdEmail: string
  onShowInbox: () => void
  onClose: () => void
}

export function SuccessView({ createdEmail, onShowInbox, onClose }: SuccessViewProps) {
  return (
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
              style={{ color: '#4ADE80' }}
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
            src={coachCongratsImg}
            alt="felicitaciones"
            className="w-72 h-auto object-contain relative z-10"
            style={{ filter: 'drop-shadow(0 0 30px rgba(34,197,94,0.15))' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-24 pointer-events-none z-20" style={{
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
        ¡Estudiante registrado exitosamente!
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.4 }}
        className="text-xs font-medium mt-2 text-center max-w-xs leading-relaxed"
        style={{ color: 'rgba(0,0,0,0.35)' }}
      >
        Las credenciales fueron enviadas al correo del estudiante.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="mt-3 rounded-2xl px-4 py-3 w-full max-w-xs"
        style={{ background: 'rgba(18,112,183,0.06)', border: '1px solid rgba(18,112,183,0.2)' }}
      >
        <p className="text-[10px] font-bold" style={{ color: 'rgba(0,0,0,0.45)' }}>Cuéntale al estudiante</p>
        <p className="text-xs mt-1 leading-relaxed" style={{ color: 'rgba(0,0,0,0.65)' }}>
          Su usuario es su correo electrónico y una contraseña temporal le llegará por email. Al ingresar por primera vez deberá cambiarla.
        </p>
        {createdEmail && (
          <p className="text-[10px] font-bold mt-2" style={{ color: '#1270B7' }}>{createdEmail}</p>
        )}
      </motion.div>
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.3 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.92 }}
        onClick={onShowInbox}
        className="mt-4 flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-white cursor-pointer"
        style={{ background: BLUE_GRAD }}
      >
        <Mail size={14} />
        Ver correo demo
      </motion.button>
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.3 }}
        whileHover={{ scale: 1.04, boxShadow: '0 8px 25px rgba(0,155,149,0.35)', transition: { duration: 0.15 } }}
        whileTap={{ scale: 0.92, boxShadow: '0 2px 8px rgba(0,155,149,0.2)', transition: { duration: 0.1 } }}
        onClick={onClose}
        className="mt-4 mb-10 px-8 py-3 rounded-2xl text-xs font-bold cursor-pointer"
        style={{ background: 'rgba(0,0,0,0.05)', color: 'rgba(0,0,0,0.55)' }}
      >
        Cerrar
      </motion.button>
    </motion.div>
  )
}
