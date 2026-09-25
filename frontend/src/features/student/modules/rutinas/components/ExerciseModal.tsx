import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Flame, ChevronRight, Clock, Target, Dumbbell, X, CheckCircle2, Maximize2 } from 'lucide-react'
import type { ExerciseRow, StudentRoutine } from '@/features/student/types/student'
import { AMBER, FIRE, GREEN } from '@/features/student/components/ui/fitness'
import { MUSCLE_IMG, FULL_BODY_IMG } from '../routineAssets'
import { CategoryPills } from './CategoryPills'
import { esVideoUrl } from '@/services/ejercicio.service'

const TEAL = '#2DD4BF'

interface ExerciseModalProps {
  data: { ex: ExerciseRow; index: number } | null
  routine: StudentRoutine
  checkedIndexes: number[]
  sessionActive: boolean
  onToggle: (index: number) => void
  onClose: () => void
}

export function ExerciseModal({ data, routine, checkedIndexes, sessionActive, onToggle, onClose }: ExerciseModalProps) {
  const [lightbox, setLightbox] = useState<{ src: string; isVideo: boolean } | null>(null)
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
            className="w-full md:max-w-xl max-h-[88vh] overflow-y-auto rounded-t-3xl md:rounded-3xl"
            style={{
              background: 'linear-gradient(165deg, #12121C, #0A0A14)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 -10px 80px rgba(0,0,0,0.6), 0 40px 100px rgba(230,57,70,0.12)',
            }}
          >
            {/* Imagen guía grande del ejercicio */}
            <div className="relative" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#0A0A14' }}>
              {data.ex.image ? (
                esVideoUrl(data.ex.image) ? (
                  <video src={data.ex.image} autoPlay muted loop playsInline className="w-full h-52 object-contain" />
                ) : (
                  <img src={data.ex.image} alt={data.ex.muscle} className="w-full h-52 object-contain" />
                )
              ) : (
                <img src={MUSCLE_IMG[data.ex.muscle] || FULL_BODY_IMG} alt={data.ex.muscle} className="w-full h-52 object-contain" />
              )}
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(10,10,20,0.28) 0%, transparent 30%, rgba(7,7,14,0.82) 100%)' }} />
              {data.ex.image && (
                <button
                  onClick={() => setLightbox({ src: data.ex.image, isVideo: esVideoUrl(data.ex.image) })}
                  className="absolute bottom-3 right-3 w-9 h-9 rounded-xl flex items-center justify-center z-10"
                  style={{ background: 'rgba(10,10,18,0.6)', backdropFilter: 'blur(8px)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}
                  aria-label="Ver en pantalla completa"
                >
                  <Maximize2 size={16} />
                </button>
              )}
              <button onClick={onClose} className="absolute top-3.5 right-3.5 w-9 h-9 rounded-xl flex items-center justify-center z-10" style={{ background: 'rgba(10,10,18,0.6)', backdropFilter: 'blur(8px)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}>
                <X size={17} />
              </button>
              <span className="absolute top-4 left-5 px-2.5 py-1 rounded-full uppercase tracking-[0.22em] font-black z-10" style={{ fontSize: 8.5, background: 'rgba(10,10,18,0.55)', backdropFilter: 'blur(8px)', border: '1px solid rgba(245,166,35,0.4)', color: AMBER }}>
                Ejercicio {data.index + 1} de {routine.rows.length}
              </span>
              <div className="absolute bottom-3 left-5 right-5">
                <h3 className="uppercase italic font-black text-white leading-tight" style={{ fontSize: 22, textShadow: '0 2px 12px rgba(0,0,0,0.7)' }}>{data.ex.name}</h3>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-2.5">
                <div className="rounded-2xl p-3.5 text-center col-span-1" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}>
                  <Target size={17} style={{ color: '#9CA3AF', margin: '0 auto 6px' }} />
                  <p className="text-white font-black" style={{ fontSize: 15 }}>{data.ex.level || routine.level}</p>
                  <p className="uppercase" style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)' }}>Nivel</p>
                </div>
                <div className="rounded-2xl p-3.5 text-center col-span-2 flex flex-col items-center justify-center gap-2" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}>
                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    <CategoryPills groups={data.ex.groups?.length ? data.ex.groups : [data.ex.muscle]} />
                  </div>
                  <p className="uppercase" style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)' }}>Categoría</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { icon: Flame, label: 'Series', value: data.ex.sets, c: FIRE },
                  { icon: ChevronRight, label: 'Reps', value: data.ex.reps, c: AMBER },
                  { icon: Clock, label: 'Descanso', value: data.ex.rest, c: GREEN },
                ].map((s, i) => (
                  <div key={i} className="rounded-2xl p-3.5 text-center" style={{ background: s.c + '0d', border: `1px solid ${s.c}22` }}>
                    <s.icon size={17} style={{ color: s.c === GREEN ? '#7CE495' : s.c, margin: '0 auto 6px' }} />
                    <p className="font-black" style={{ fontSize: 15, color: s.c === GREEN ? '#7CE495' : s.c }}>{s.value}</p>
                    <p className="uppercase" style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)' }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {(data.ex.machines ?? []).length > 0 && (
                <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}>
                  <div className="flex items-center gap-2 mb-2.5">
                    <Dumbbell size={14} style={{ color: TEAL }} />
                    <p className="uppercase tracking-widest" style={{ fontSize: 9.5, fontWeight: 800, color: TEAL }}>Equipo que se puede usar</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {(data.ex.machines ?? []).map((m, i) => (
                      <div key={i} className="rounded-2xl p-3 flex items-center gap-2.5 text-left min-w-0" style={{ background: 'transparent', border: '1px dashed rgba(255,255,255,0.18)', minHeight: 56 }}>
                        {m.imageUrl ? (
                          <button
                            onClick={() => setLightbox({ src: m.imageUrl, isVideo: esVideoUrl(m.imageUrl) })}
                            className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                            style={{ border: `1px solid ${TEAL}40` }}
                            aria-label={`Ver ${m.nombre} en pantalla completa`}
                          >
                            <img src={m.imageUrl} alt={m.nombre} className="w-full h-full object-cover" />
                          </button>
                        ) : (
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: TEAL + '18', color: TEAL }}>
                            <Dumbbell size={16} />
                          </div>
                        )}
                        <p className="text-white font-bold min-w-0" style={{ fontSize: 11.5, lineHeight: 1.35, overflowWrap: 'break-word', wordBreak: 'break-word' }}>{m.nombre}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {data.ex.instructions && (
                <div className="rounded-2xl p-4" style={{ background: 'rgba(245,166,35,0.05)', border: '1px solid rgba(245,166,35,0.15)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Dumbbell size={14} style={{ color: AMBER }} />
                    <p className="uppercase tracking-widest" style={{ fontSize: 9.5, fontWeight: 800, color: AMBER }}>Descripción</p>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 13, lineHeight: 1.7 }}>{data.ex.instructions}</p>
                </div>
              )}

              {sessionActive && (
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
              )}
            </div>
          </motion.div>

          {lightbox && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightbox(null)}
              className="fixed inset-0 z-[70] flex items-center justify-center p-4"
              style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(10px)' }}
            >
              <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                onClick={e => e.stopPropagation()}
                className="relative max-w-[94vw] max-h-[90vh] flex items-center justify-center"
              >
                {lightbox.isVideo ? (
                  <video src={lightbox.src} autoPlay muted loop playsInline className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-xl" />
                ) : (
                  <img src={lightbox.src} alt="Vista ampliada" className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-xl" />
                )}
                <button
                  onClick={() => setLightbox(null)}
                  className="absolute -top-3 -right-3 md:-right-4 w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(10,10,18,0.95)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
                  aria-label="Cerrar vista ampliada"
                >
                  <X size={18} />
                </button>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
