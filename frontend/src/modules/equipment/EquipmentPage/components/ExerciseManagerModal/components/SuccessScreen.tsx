import { motion } from 'motion/react'
import { GREEN_GRAD } from '@/data/shared/constants'
import { EQUIPMENT_IMAGES } from '@/modules/equipment/data'

interface SuccessScreenProps {
  editing: boolean
  createdCount: number
  name: string
  onClose: () => void
  onCreatedCountChange: (v: number) => void
}

export function SuccessScreen({ editing, createdCount, name, onClose, onCreatedCountChange }: SuccessScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center px-6 pb-12 relative"
      style={{ overflow: 'visible', minHeight: 420 }}
    >
      {/* Background layer: image + sparkles */}
      <div className="absolute left-0 right-0 z-0 flex flex-col items-center" style={{ top: '-80px', overflow: 'visible' }}>
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
        <div className="relative flex flex-col items-center justify-center">
          <motion.img
            src={EQUIPMENT_IMAGES.coachExerciseSuccessImg}
            alt="felicitaciones"
            className="w-80 h-auto object-contain"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-48 pointer-events-none" style={{
            background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 15%, rgba(255,255,255,0) 55%)',
          }} />
        </div>
      </div>
      {/* Foreground layer: text + button */}
      <div className="relative z-10 flex flex-col items-center mt-auto pt-48">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-3xl font-bold text-center"
          style={{ color: '#1A1A1E' }}
        >
          ¡{editing ? 'Ejercicio actualizado' : 'Registro Exitoso'}!
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-sm text-center mt-1.5 mb-8"
          style={{ color: 'rgba(0,0,0,0.7)' }}
        >
          {editing || createdCount <= 1 ? (
            <><span style={{ background: 'linear-gradient(135deg, #30D158, #0A84FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700 }}>{name}</span> ahora está disponible<br /></>
          ) : (
            <><span style={{ background: 'linear-gradient(135deg, #30D158, #0A84FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700 }}>Los ejercicios</span> ya están disponibles<br /></>
          )}
          <span className="text-xs" style={{ color: 'rgba(0,0,0,0.4)' }}>para asignar a las rutinas y máquinas del gimnasio.</span>
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.4 } }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.15 }}
          onClick={() => { onClose(); onCreatedCountChange(0) }}
          className="px-8 py-2.5 rounded-2xl text-xs font-bold text-white cursor-pointer"
          style={{ background: GREEN_GRAD }}
        >
          Cerrar
        </motion.button>
      </div>
    </motion.div>
  )
}
