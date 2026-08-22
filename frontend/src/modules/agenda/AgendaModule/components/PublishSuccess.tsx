import { motion } from 'motion/react'
import coachCalendarSuccessImg from '@/assets/illustrations/characters/coach/coach_calendar_success.webp'
import { GREEN_GRAD } from '@/data/shared/constants'
import { WEEK_DAYS_6 } from '../../AgendaData'
import { fmtShortDate } from '../data'

interface PublishSuccessProps {
  publishDays: string[]
  publishStart: string
  publishEnd: string
  onClose: () => void
}

export function PublishSuccess({ publishDays, publishStart, publishEnd, onClose }: PublishSuccessProps) {
  const activeLabels = publishDays.map(dk => WEEK_DAYS_6.find(w => w.key === dk)?.label).filter(Boolean) as string[]
  const activeStr = activeLabels.length > 1
    ? activeLabels.slice(0, -1).join(', ') + ' y ' + activeLabels[activeLabels.length - 1]
    : activeLabels[0] || ''
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center px-6 pb-8 relative"
      style={{ overflow: 'visible' }}
    >
      <div className="relative flex items-center justify-center z-10" style={{ marginTop: '-120px', marginBottom: '1.5rem' }}>
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
            src={coachCalendarSuccessImg}
            alt="felicitaciones"
            className="w-72 h-auto object-contain relative z-10"
            style={{ filter: 'drop-shadow(0 0 30px rgba(34,197,94,0.15))' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-48 pointer-events-none z-20" style={{
            background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 15%, rgba(255,255,255,0) 55%)',
          }} />
        </div>
      </div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="text-3xl font-bold text-center z-10"
        style={{ color: '#1A1A1E' }}
      >
        ¡Cupos publicados!
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="text-sm text-center mt-1.5 mb-8 z-10"
        style={{ color: 'rgba(0,0,0,0.7)' }}
      >
        <span style={{ background: 'linear-gradient(135deg, #30D158, #0A84FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700 }}>Tu agenda</span> quedó lista en el calendario.<br />
        <span className="text-xs" style={{ color: 'rgba(0,0,0,0.4)' }}>
          {fmtShortDate(publishStart)} – {fmtShortDate(publishEnd)} · {activeStr}
        </span>
      </motion.p>
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClose}
        className="px-8 py-2.5 rounded-2xl text-xs font-bold text-white cursor-pointer"
        style={{ background: GREEN_GRAD }}
      >
        Cerrar
      </motion.button>
    </motion.div>
  )
}
