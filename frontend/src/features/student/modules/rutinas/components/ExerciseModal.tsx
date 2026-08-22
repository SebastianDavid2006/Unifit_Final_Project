import { motion, AnimatePresence } from 'motion/react'
import { Flame, ChevronRight, Clock, Target, Dumbbell, X, CheckCircle2 } from 'lucide-react'
import type { ExerciseRow, StudentRoutine } from '@/features/student/types/student'
import { FIRE, AMBER, BLUE, GREEN } from '@/features/student/components/ui/fitness'
import { MUSCLE_IMG, FULL_BODY_IMG } from '../../routineAssets'

interface ExerciseModalProps {
  data: { ex: ExerciseRow; index: number } | null
  routine: StudentRoutine
  checkedIndexes: number[]
  onToggle: (index: number) => void
  onClose: () => void
}

export function ExerciseModal({ data, routine, checkedIndexes, onToggle, onClose }: ExerciseModalProps) {
  return (
    <AnimatePresence>
      {data && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-6"
          style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
            className="w-full md:max-w-lg max-h-[85vh] overflow-y-auto rounded-t-3xl md:rounded-3xl"
            style={{
              background: 'linear-gradient(165deg, #12121C, #0A0A14)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 -10px 80px rgba(0,0,0,0.6), 0 40px 100px rgba(230,57,70,0.12)',
            }}
          >
            {/* Imagen guía grande del ejercicio */}
            <div className="relative" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <img
                src={MUSCLE_IMG[data.ex.muscle] || FULL_BODY_IMG}
                alt={data.ex.muscle}
                className="w-full h-52 object-cover"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,10,20,0.35) 0%, transparent 35%, rgba(7,7,14,0.94) 100%)' }} />
              <button onClick={onClose} className="absolute top-3.5 right-3.5 w-9 h-9 rounded-xl flex items-center justify-center z-10" style={{ background: 'rgba(10,10,18,0.6)', backdropFilter: 'blur(8px)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}>
                <X size={17} />
              </button>
              <span className="absolute top-4 left-5 px-2.5 py-1 rounded-full uppercase tracking-[0.22em] font-black z-10" style={{ fontSize: 8.5, background: 'rgba(10,10,18,0.55)', backdropFilter: 'blur(8px)', border: '1px solid rgba(245,166,35,0.4)', color: AMBER }}>
                Ejercicio {data.index + 1} de {routine.rows.length}
              </span>
              <div className="absolute bottom-3 left-5 right-5">
                <span className="inline-block px-2.5 py-0.5 rounded-full uppercase tracking-wider font-black mb-1.5" style={{ background: FIRE + '30', backdropFilter: 'blur(6px)', color: '#FF8FA3', fontSize: 8.5, border: `1px solid ${FIRE}55` }}>
                  {data.ex.muscle}{data.ex.secondaryMuscle ? ` + ${data.ex.secondaryMuscle}` : ''}
                </span>
                <h3 className="uppercase italic font-black text-white leading-tight" style={{ fontSize: 22, textShadow: '0 2px 12px rgba(0,0,0,0.7)' }}>{data.ex.name}</h3>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { icon: Flame, label: 'Series', value: data.ex.sets, color: FIRE },
                  { icon: ChevronRight, label: 'Reps', value: data.ex.reps, color: AMBER },
                  { icon: Clock, label: 'Descanso', value: data.ex.rest, color: GREEN },
                  { icon: Target, label: 'Nivel recomendado', value: data.ex.level || routine.level, color: BLUE },
                ].map((s, i) => (
                  <div key={i} className="rounded-2xl p-3.5 text-center" style={{ background: s.color + '10', border: `1px solid ${s.color}25` }}>
                    <s.icon size={17} style={{ color: s.color === GREEN ? '#7CE495' : s.color, margin: '0 auto 6px' }} />
                    <p className="text-white font-black" style={{ fontSize: 15 }}>{s.value}</p>
                    <p className="uppercase" style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)' }}>{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl p-4" style={{ background: 'rgba(245,166,35,0.05)', border: '1px solid rgba(245,166,35,0.15)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Dumbbell size={14} style={{ color: AMBER }} />
                  <p className="uppercase tracking-widest" style={{ fontSize: 9.5, fontWeight: 800, color: AMBER }}>Descripción</p>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 13, lineHeight: 1.7 }}>{data.ex.instructions}</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { onToggle(data.index); onClose() }}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black uppercase tracking-wider"
                style={{
                  background: checkedIndexes.includes(data.index) ? 'rgba(255,255,255,0.06)' : `linear-gradient(135deg, ${GREEN}, #7CE495)`,
                  color: checkedIndexes.includes(data.index) ? 'rgba(255,255,255,0.55)' : '#052e12',
                  fontSize: 12,
                }}
              >
                {checkedIndexes.includes(data.index)
                  ? <><CheckCircle2 size={17} /> Marcado — desmarcar</>
                  : <><CheckCircle2 size={17} /> Marcar como hecho</>}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
