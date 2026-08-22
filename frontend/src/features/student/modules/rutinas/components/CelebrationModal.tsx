import { motion, AnimatePresence } from 'motion/react'
import { Trophy, CheckCircle2, Flame, Zap } from 'lucide-react'
import type { StudentRoutine } from '@/features/student/types/student'
import { FIRE, AMBER, GREEN } from '@/features/student/components/ui/fitness'

interface CelebrationModalProps {
  open: boolean
  routine: StudentRoutine
  onClose: () => void
}

export function CelebrationModal({ open, routine, onClose }: CelebrationModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-end md:items-center justify-center md:p-6"
          style={{ background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(10px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={e => e.stopPropagation()}
            className="w-full md:max-w-sm rounded-t-3xl md:rounded-3xl overflow-hidden relative"
            style={{
              background: 'linear-gradient(170deg, #1A1420, #0A0A14)',
              border: '1px solid rgba(245,166,35,0.35)',
              boxShadow: '0 40px 120px rgba(230,57,70,0.25), 0 20px 60px rgba(245,166,35,0.12)',
            }}
          >
            {/* Confetti */}
            {[...Array(18)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute w-2 h-2 rounded-sm pointer-events-none"
                style={{
                  left: `${6 + (i * 53) % 88}%`,
                  top: '42%',
                  background: i % 3 === 0 ? FIRE : i % 3 === 1 ? AMBER : GREEN,
                }}
                animate={{
                  y: [0, -(90 + (i * 37) % 130), 160 + (i * 23) % 60],
                  x: [0, ((i % 5) - 2) * 26],
                  rotate: [0, (i % 2 ? 1 : -1) * (200 + i * 25)],
                  opacity: [0, 1, 1, 0],
                  scale: [0.6, 1, 0.9],
                }}
                transition={{ duration: 1.6 + (i % 4) * 0.22, delay: (i % 6) * 0.09, repeat: Infinity, repeatDelay: 1.1, ease: 'easeOut' }}
              />
            ))}

            <div className="p-7 pt-9 text-center relative">
              {/* Trofeo */}
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 220, damping: 13, delay: 0.15 }}
                className="w-24 h-24 mx-auto rounded-full flex items-center justify-center relative"
                style={{ background: `radial-gradient(circle at 32% 28%, rgba(245,166,35,0.34), ${FIRE}26)`, border: `2px solid ${AMBER}66`, boxShadow: `0 0 60px ${AMBER}45, inset 0 0 30px rgba(230,57,70,0.16)` }}
              >
                <motion.div animate={{ y: [0, -5, 0], rotate: [0, -4, 4, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}>
                  <Trophy size={44} style={{ color: AMBER, filter: `drop-shadow(0 6px 16px ${FIRE}80)` }} />
                </motion.div>
                <motion.span
                  className="absolute inset-0 rounded-full"
                  style={{ border: `2px solid ${AMBER}` }}
                  animate={{ scale: [1, 1.45], opacity: [0.55, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="uppercase italic font-black mt-6"
                style={{
                  fontSize: 30,
                  lineHeight: 1.08,
                  background: `linear-gradient(135deg, #FFE9A8, ${AMBER} 45%, ${FIRE})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                ¡Increíble!<br />Lo lograste
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.42 }}
                style={{ color: 'rgba(255,255,255,0.62)', fontSize: 13, marginTop: 10, lineHeight: 1.65 }}
              >
                Completaste <span className="font-black text-white">{routine.name}</span> de principio a fin.
                Ese esfuerzo suma — <span style={{ color: '#FFD98A', fontWeight: 800 }}>sigue así, vas por un gran camino.</span>
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.52 }}
                className="grid grid-cols-2 gap-2.5 mt-5"
              >
                <div className="rounded-2xl py-3" style={{ background: GREEN + '0d', border: `1px solid ${GREEN}30` }}>
                  <CheckCircle2 size={17} style={{ color: GREEN, margin: '0 auto 4px' }} />
                  <p className="font-black" style={{ color: '#7CE495', fontSize: 16 }}>{routine.rows.length}</p>
                  <p className="uppercase tracking-widest" style={{ fontSize: 7.5, fontWeight: 800, color: 'rgba(255,255,255,0.38)' }}>Ejercicios</p>
                </div>
                <div className="rounded-2xl py-3" style={{ background: FIRE + '0d', border: `1px solid ${FIRE}30` }}>
                  <Flame size={17} style={{ color: FIRE, margin: '0 auto 4px' }} />
                  <p className="font-black" style={{ color: '#FF8FA3', fontSize: 16 }}>100%</p>
                  <p className="uppercase tracking-widest" style={{ fontSize: 7.5, fontWeight: 800, color: 'rgba(255,255,255,0.38)' }}>Completada</p>
                </div>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.62 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black uppercase tracking-widest mt-6"
                style={{ background: `linear-gradient(135deg, ${FIRE}, ${AMBER})`, color: '#fff', fontSize: 12.5, boxShadow: '0 14px 40px rgba(230,57,70,0.35)' }}
              >
                <Zap size={16} />
                ¡Vamos por más!
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
