import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  ChevronLeft, ChevronRight, Dumbbell, ClipboardCheck, Clock, Flame,
  CheckCircle2, Circle, X, Trophy
} from 'lucide-react'
import { studentRoutines } from '@/features/student/utils/mockData'
import { assessmentItems } from '@/modules/students/StudentProfileData'
import type { StudentRoutine, ExerciseRow } from '@/features/student/types/student'
import { SectionTitle, GradientBorder, cardStyle, FIRE, AMBER, BLUE, GREEN } from '@/features/student/components/ui/fitness'
import { AssessmentDetail } from '@/features/student/components/ui/AssessmentDetail'
import routineScene from '@/assets/scenes/physical_routine.webp'
import legImg from '@/assets/icons/anatomy/leg.webp'
import chestImg from '@/assets/icons/anatomy/chest.webp'
import backImg from '@/assets/icons/anatomy/back.webp'
import shouldersImg from '@/assets/icons/anatomy/shoulders.webp'
import absImg from '@/assets/icons/anatomy/abs.webp'
import armImg from '@/assets/icons/anatomy/arm.webp'
import cardioImg from '@/assets/icons/anatomy/cardio.webp'
import fullBodyImg from '@/assets/icons/anatomy/full-body.webp'

type View = 'list' | 'detail'

const PAGE_SIZE = 6

const MUSCLE_IMG: Record<string, string> = {
  Piernas: legImg, Glúteos: legImg, Cuádriceps: legImg, Isquiotibiales: legImg, Pantorrilla: legImg,
  Pecho: chestImg,
  Espalda: backImg, Dorsal: backImg,
  Hombros: shouldersImg,
  Core: absImg, Abdomen: absImg,
  Brazos: armImg, Bíceps: armImg, Tríceps: armImg,
  Cardio: cardioImg,
  'Full body': fullBodyImg,
}

const levelColor: Record<string, string> = {
  Principiante: GREEN,
  Intermedio: BLUE,
  Avanzado: FIRE,
}

export function RoutinesPage() {
  const [view, setView] = useState<View>('list')
  const [routine, setRoutine] = useState<StudentRoutine | null>(null)
  const [detailTab, setDetailTab] = useState<'exercises' | 'assessment'>('exercises')
  const [checked, setChecked] = useState<Record<string, number[]>>({})
  const [completedRoutines, setCompletedRoutines] = useState<string[]>([])
  const [selectedExercise, setSelectedExercise] = useState<{ ex: ExerciseRow; index: number } | null>(null)
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(studentRoutines.length / PAGE_SIZE))
  const visibleRoutines = studentRoutines.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const assessment = routine ? assessmentItems.find(a => a.num === routine.assessmentNum) : null

  const openRoutine = (r: StudentRoutine) => {
    setRoutine(r)
    setDetailTab('exercises')
    setView('detail')
  }

  const toggleExercise = (index: number) => {
    if (!routine) return
    setChecked(prev => {
      const list = prev[routine.id] || []
      return { ...prev, [routine.id]: list.includes(index) ? list.filter(i => i !== index) : [...list, index] }
    })
  }

  const checkedCount = routine ? (checked[routine.id] || []).length : 0
  const isCompleted = routine ? completedRoutines.includes(routine.id) : false

  const completeRoutine = () => {
    if (!routine || isCompleted) return
    setChecked(prev => ({ ...prev, [routine.id]: routine.rows.map((_, i) => i) }))
    setCompletedRoutines(prev => [...prev, routine.id])
  }

  /* ---------------- LISTA ---------------- */
  if (view === 'list' || !routine) {
    return (
      <div className="space-y-4">
        <SectionTitle>Rutinas asignadas por tu entrenador</SectionTitle>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-5">
          {visibleRoutines.map((r, i) => {
            const done = completedRoutines.includes(r.id)
            if (r.current) {
              /* --- RUTINA ACTUAL: resaltada con borde gradiente --- */
              return (
                <motion.div key={r.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="xl:col-span-2">
                  <motion.button whileHover={{ y: -3 }} whileTap={{ scale: 0.985 }} onClick={() => openRoutine(r)} className="w-full text-left relative">
                    <span
                      className="absolute -top-3 left-5 z-10 px-3 py-1 rounded-full uppercase italic font-black tracking-widest"
                      style={{ background: `linear-gradient(135deg, ${FIRE}, ${AMBER})`, color: '#fff', fontSize: 9.5, boxShadow: '0 8px 20px rgba(230,57,70,0.4)' }}
                    >
                      ★ Rutina actual
                    </span>
                    <GradientBorder radius={22}>
                      <div className="p-5 pt-6">
                        <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
                          <div className="min-w-0">
                            <h3 className="uppercase italic font-black text-white truncate" style={{ fontSize: 19 }}>{r.name}</h3>
                            <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 11.5, marginTop: 3 }}>
                              {r.focus} · Entrenador {assessmentItems.find(a => a.num === r.assessmentNum)?.evaluator}
                            </p>
                          </div>
                          <span className="px-2.5 py-1 rounded-full uppercase tracking-wider font-black" style={{ background: levelColor[r.level] + '18', color: levelColor[r.level], fontSize: 9 }}>
                            {r.level}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                          {[
                            { v: r.duration, l: 'Duración', c: AMBER },
                            { v: r.frequency, l: 'Frecuencia', c: BLUE },
                            { v: `${r.progress.adherence}%`, l: 'Adherencia', c: GREEN },
                            { v: `${r.progress.completedSessions}/${r.progress.totalSessions}`, l: 'Sesiones', c: FIRE },
                          ].map((s, k) => (
                            <div key={k} className="rounded-xl p-2.5 text-center" style={{ background: s.c + '10', border: `1px solid ${s.c}22` }}>
                              <p style={{ color: s.c, fontSize: 13, fontWeight: 800 }}>{s.v}</p>
                              <p style={{ color: 'rgba(255,255,255,0.32)', fontSize: 9 }}>{s.l}</p>
                            </div>
                          ))}
                        </div>

                        <div className="h-2 rounded-full overflow-hidden mb-4" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <div className="h-full rounded-full" style={{ width: `${(r.progress.completedSessions / r.progress.totalSessions) * 100}%`, background: `linear-gradient(90deg, ${FIRE}, ${AMBER})` }} />
                        </div>

                        <p className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11.5, fontWeight: 700 }}>
                          <Dumbbell size={14} style={{ color: AMBER }} />
                          {r.rows.length} ejercicios · Toca la tarjeta para entrar
                          {done && <Trophy size={13} style={{ color: GREEN }} />}
                        </p>
                      </div>
                    </GradientBorder>
                  </motion.button>
                </motion.div>
              )
            }
            /* --- OTRAS RUTINAS --- */
            return (
              <motion.div key={r.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                <motion.button whileHover={{ y: -3 }} whileTap={{ scale: 0.985 }} onClick={() => openRoutine(r)} className="w-full text-left">
                  <div className="rounded-[22px] p-5 h-full" style={cardStyle}>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="min-w-0">
                        <h3 className="uppercase italic font-black text-white truncate" style={{ fontSize: 16 }}>{r.name}</h3>
                        <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 11.5, marginTop: 3 }}>{r.focus} · {assessmentItems.find(a => a.num === r.assessmentNum)?.date}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full uppercase tracking-wider font-black flex-shrink-0" style={{ background: levelColor[r.level] + '18', color: levelColor[r.level], fontSize: 9 }}>
                        {r.level}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {[
                        { v: r.duration, l: 'Duración', c: AMBER },
                        { v: `${r.progress.adherence}%`, l: 'Adherencia', c: GREEN },
                        { v: `${r.rows.length}`, l: 'Ejercicios', c: BLUE },
                      ].map((s, k) => (
                        <div key={k} className="rounded-xl p-2.5 text-center" style={{ background: s.c + '10', border: `1px solid ${s.c}22` }}>
                          <p style={{ color: s.c, fontSize: 13, fontWeight: 800 }}>{s.v}</p>
                          <p style={{ color: 'rgba(255,255,255,0.32)', fontSize: 9 }}>{s.l}</p>
                        </div>
                      ))}
                    </div>

                    <div className="h-1.5 rounded-full overflow-hidden mb-3" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div className="h-full rounded-full" style={{ width: `${(r.progress.completedSessions / r.progress.totalSessions) * 100}%`, background: `linear-gradient(90deg, rgba(255,255,255,0.35), rgba(245,166,35,0.7))` }} />
                    </div>

                    <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: 11, fontWeight: 600 }}>
                      Toca para ver detalles
                    </p>
                  </div>
                </motion.button>
              </motion.div>
            )
          })}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-8">
            <motion.button
              whileHover={page > 1 ? { scale: 1.08 } : undefined}
              whileTap={page > 1 ? { scale: 0.92 } : undefined}
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: page === 1 ? 'rgba(255,255,255,0.2)' : '#fff',
                cursor: page === 1 ? 'not-allowed' : 'pointer',
              }}
            >
              <ChevronLeft size={17} />
            </motion.button>
            {Array.from({ length: totalPages }).map((_, i) => {
              const active = page === i + 1
              return (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setPage(i + 1)}
                  className="w-9 h-9 rounded-xl font-black transition-all"
                  style={{
                    background: active ? `linear-gradient(135deg, ${FIRE}, ${AMBER})` : 'rgba(255,255,255,0.05)',
                    border: active ? 'none' : '1px solid rgba(255,255,255,0.1)',
                    color: active ? '#fff' : 'rgba(255,255,255,0.45)',
                    fontSize: 13,
                    boxShadow: active ? '0 6px 18px rgba(230,57,70,0.35)' : 'none',
                  }}
                >
                  {i + 1}
                </motion.button>
              )
            })}
            <motion.button
              whileHover={page < totalPages ? { scale: 1.08 } : undefined}
              whileTap={page < totalPages ? { scale: 0.92 } : undefined}
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: page === totalPages ? 'rgba(255,255,255,0.2)' : '#fff',
                cursor: page === totalPages ? 'not-allowed' : 'pointer',
              }}
            >
              <ChevronRight size={17} />
            </motion.button>
          </div>
        )}
      </div>
    )
  }

  /* ---------------- DETALLE ---------------- */
  const progressPct = Math.round((checkedCount / routine.rows.length) * 100)

  return (
    <div className="space-y-4">
      {/* Header con volver */}
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setView('list')}
          className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', color: '#fff' }}
        >
          <ChevronLeft size={20} />
        </motion.button>
        <div className="min-w-0">
          <h2 className="uppercase italic font-black text-white truncate leading-tight" style={{ fontSize: 19 }}>{routine.name}</h2>
          <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 11.5 }}>
            {routine.duration} · {routine.focus} · Entrenador {assessment?.evaluator}
          </p>
        </div>
      </div>

      {/* Imagen default de la rutina */}
      <div className="relative overflow-hidden rounded-3xl" style={{ height: 150, border: '1px solid rgba(255,255,255,0.09)' }}>
        <img src={routineScene} alt="Rutina física" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: '50% 22%' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 20%, rgba(7,7,14,0.85))' }} />
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3">
          <div>
            <p className="uppercase italic font-black text-white" style={{ fontSize: 17, lineHeight: 1.1 }}>{routine.name}</p>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11 }}>{routine.frequency} · Nivel {routine.level.toLowerCase()}</p>
          </div>
          {routine.current && (
            <span className="px-2.5 py-1 rounded-full uppercase italic font-black tracking-widest flex-shrink-0" style={{ background: `linear-gradient(135deg, ${FIRE}, ${AMBER})`, color: '#fff', fontSize: 8.5 }}>
              Actual
            </span>
          )}
        </div>
      </div>

      {/* Selector: Ver rutina / Valoración física */}
      <div className="grid grid-cols-2 gap-3">
        {([
          { id: 'exercises', label: 'Ver rutina', icon: Dumbbell },
          { id: 'assessment', label: 'Valoración física', icon: ClipboardCheck },
        ] as const).map(opt => {
          const active = detailTab === opt.id
          return (
            <motion.button
              key={opt.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setDetailTab(opt.id)}
              className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl font-black uppercase tracking-wider transition-all"
              style={{
                background: active ? `linear-gradient(135deg, ${FIRE}, ${AMBER})` : 'rgba(255,255,255,0.04)',
                border: active ? 'none' : '1px solid rgba(255,255,255,0.09)',
                color: active ? '#fff' : 'rgba(255,255,255,0.45)',
                fontSize: 11.5,
                boxShadow: active ? '0 12px 30px rgba(230,57,70,0.3)' : 'none',
              }}
            >
              <opt.icon size={16} />
              {opt.label}
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        {detailTab === 'exercises' ? (
          /* --------- LISTA DE EJERCICIOS --------- */
          <motion.div key="exercises" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
            <div className="rounded-2xl p-4 flex items-center gap-4" style={cardStyle}>
              <div className="flex-1">
                <div className="flex justify-between mb-2" style={{ fontSize: 11 }}>
                  <span style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>Ejercicios marcados</span>
                  <span style={{ color: GREEN, fontWeight: 800 }}>{checkedCount}/{routine.rows.length}</span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <motion.div animate={{ width: `${progressPct}%` }} className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${GREEN}, #7CE495)` }} />
                </div>
              </div>
              {isCompleted && (
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl" style={{ background: 'rgba(48,209,88,0.12)', border: '1px solid rgba(48,209,88,0.3)' }}>
                  <Trophy size={15} style={{ color: GREEN }} />
                  <span style={{ color: GREEN, fontSize: 11, fontWeight: 800, whiteSpace: 'nowrap' }}>¡Completada!</span>
                </div>
              )}
            </div>

            {routine.rows.map((ex, i) => {
              const isChecked = (checked[routine.id] || []).includes(i)
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div
                    className="rounded-2xl p-4 flex items-center gap-3.5 cursor-pointer transition-all"
                    style={{
                      ...cardStyle,
                      borderColor: isChecked ? 'rgba(48,209,88,0.35)' : undefined,
                      background: isChecked ? 'linear-gradient(160deg, rgba(48,209,88,0.07), rgba(255,255,255,0.015))' : cardStyle.background,
                    }}
                    onClick={() => setSelectedExercise({ ex, index: i })}
                  >
                    <button
                      onClick={e => { e.stopPropagation(); toggleExercise(i) }}
                      className="flex-shrink-0"
                      aria-label={isChecked ? 'Desmarcar ejercicio' : 'Marcar ejercicio'}
                    >
                      <motion.div whileTap={{ scale: 0.82 }} animate={{ scale: isChecked ? [1, 1.25, 1] : 1 }}>
                        {isChecked
                          ? <CheckCircle2 size={30} style={{ color: GREEN }} strokeWidth={2.2} />
                          : <Circle size={30} style={{ color: 'rgba(255,255,255,0.22)' }} strokeWidth={2.2} />}
                      </motion.div>
                    </button>

                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white truncate" style={{ fontSize: 14.5, textDecoration: isChecked ? 'line-through' : 'none', opacity: isChecked ? 0.65 : 1 }}>
                        {i + 1}. {ex.name}
                      </p>
                      <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 11.5, marginTop: 2 }}>
                        {ex.muscle} · {ex.sets}×{ex.reps} · {ex.weight}
                      </p>
                    </div>

                    <div className="hidden sm:block text-right flex-shrink-0">
                      <p style={{ color: AMBER, fontSize: 13, fontWeight: 800 }}>{ex.sets} × {ex.reps}</p>
                      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10.5 }}>{ex.weight}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}

            {/* Completar rutina */}
            <motion.button
              whileHover={isCompleted ? {} : { scale: 1.01 }}
              whileTap={isCompleted ? {} : { scale: 0.98 }}
              onClick={completeRoutine}
              disabled={isCompleted}
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-black uppercase tracking-widest mt-2"
              style={{
                background: isCompleted ? 'rgba(48,209,88,0.14)' : `linear-gradient(135deg, ${GREEN}, #7CE495)`,
                border: isCompleted ? '1px solid rgba(48,209,88,0.4)' : 'none',
                color: isCompleted ? GREEN : '#052e12',
                fontSize: 13,
                boxShadow: isCompleted ? 'none' : '0 14px 40px rgba(48,209,88,0.3)',
                cursor: isCompleted ? 'default' : 'pointer',
              }}
            >
              <Trophy size={18} />
              {isCompleted ? 'Rutina completada' : 'Completar rutina'}
            </motion.button>
          </motion.div>
        ) : assessment ? (
          /* --------- VALORACIÓN FÍSICA (datos reales del entrenador) --------- */
          <motion.div key="assessment" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="rounded-3xl p-5 md:p-6" style={cardStyle}>
              <AssessmentDetail item={assessment} />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Modal detalle de ejercicio */}
      <AnimatePresence>
        {selectedExercise && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-6"
            style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)' }}
            onClick={() => setSelectedExercise(null)}
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
                  src={MUSCLE_IMG[selectedExercise.ex.muscle] || fullBodyImg}
                  alt={selectedExercise.ex.muscle}
                  className="w-full h-52 object-cover"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,10,20,0.35) 0%, transparent 35%, rgba(7,7,14,0.94) 100%)' }} />
                <button onClick={() => setSelectedExercise(null)} className="absolute top-3.5 right-3.5 w-9 h-9 rounded-xl flex items-center justify-center z-10" style={{ background: 'rgba(10,10,18,0.6)', backdropFilter: 'blur(8px)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <X size={17} />
                </button>
                <span className="absolute top-4 left-5 px-2.5 py-1 rounded-full uppercase tracking-[0.22em] font-black z-10" style={{ fontSize: 8.5, background: 'rgba(10,10,18,0.55)', backdropFilter: 'blur(8px)', border: '1px solid rgba(245,166,35,0.4)', color: AMBER }}>
                  Ejercicio {selectedExercise.index + 1} de {routine.rows.length}
                </span>
                <div className="absolute bottom-3 left-5 right-5">
                  <span className="inline-block px-2.5 py-0.5 rounded-full uppercase tracking-wider font-black mb-1.5" style={{ background: FIRE + '30', backdropFilter: 'blur(6px)', color: '#FF8FA3', fontSize: 8.5, border: `1px solid ${FIRE}55` }}>
                    {selectedExercise.ex.muscle}
                  </span>
                  <h3 className="uppercase italic font-black text-white leading-tight" style={{ fontSize: 22, textShadow: '0 2px 12px rgba(0,0,0,0.7)' }}>{selectedExercise.ex.name}</h3>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { icon: Flame, label: 'Series', value: selectedExercise.ex.sets, color: FIRE },
                    { icon: ChevronRight, label: 'Reps', value: selectedExercise.ex.reps, color: AMBER },
                    { icon: Clock, label: 'Descanso', value: selectedExercise.ex.rest, color: BLUE },
                  ].map((s, i) => (
                    <div key={i} className="rounded-2xl p-3.5 text-center" style={{ background: s.color + '10', border: `1px solid ${s.color}25` }}>
                      <s.icon size={17} style={{ color: s.color, margin: '0 auto 6px' }} />
                      <p className="text-white font-black" style={{ fontSize: 16 }}>{s.value}</p>
                      <p className="uppercase" style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.35)' }}>{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between rounded-2xl p-4" style={cardStyle}>
                  <span className="uppercase tracking-widest" style={{ fontSize: 9.5, fontWeight: 700, color: 'rgba(255,255,255,0.4)' }}>Carga / peso</span>
                  <span className="text-white font-black" style={{ fontSize: 17 }}>{selectedExercise.ex.weight}</span>
                </div>

                <div className="rounded-2xl p-4" style={{ background: 'rgba(245,166,35,0.05)', border: '1px solid rgba(245,166,35,0.15)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Dumbbell size={14} style={{ color: AMBER }} />
                    <p className="uppercase tracking-widest" style={{ fontSize: 9.5, fontWeight: 800, color: AMBER }}>Técnica</p>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 13, lineHeight: 1.7 }}>{selectedExercise.ex.instructions}</p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { toggleExercise(selectedExercise.index); setSelectedExercise(null) }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black uppercase tracking-wider"
                  style={{
                    background: (checked[routine.id] || []).includes(selectedExercise.index) ? 'rgba(255,255,255,0.06)' : `linear-gradient(135deg, ${GREEN}, #7CE495)`,
                    color: (checked[routine.id] || []).includes(selectedExercise.index) ? 'rgba(255,255,255,0.55)' : '#052e12',
                    fontSize: 12,
                  }}
                >
                  {(checked[routine.id] || []).includes(selectedExercise.index)
                    ? <><CheckCircle2 size={17} /> Marcado — desmarcar</>
                    : <><CheckCircle2 size={17} /> Marcar como hecho</>}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
