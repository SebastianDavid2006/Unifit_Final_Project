import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Dumbbell, Clock, Flame, CheckCircle2, Circle, ChevronRight, Trophy } from 'lucide-react'
import { studentRoutines } from '@/features/student/utils/mockData'
import { assessmentItems } from '@/modules/students/StudentProfileData'
import type { StudentRoutine, ExerciseRow } from '@/features/student/types/student'
import { cardStyle, FIRE, AMBER, BLUE, GREEN } from '@/features/student/components/ui/fitness'
import { AssessmentDetail } from '@/features/student/components/ui/AssessmentDetail'
import { MUSCLE_IMG, FULL_BODY_IMG } from './routineAssets'
import { RoutineList } from './components/RoutineList'
import { DetailHeader } from './components/DetailHeader'
import { ExerciseModal } from './components/ExerciseModal'
import { CelebrationModal } from './components/CelebrationModal'

type View = 'list' | 'detail'

export function RoutinesPage() {
  const [view, setView] = useState<View>('list')
  const [routine, setRoutine] = useState<StudentRoutine | null>(null)
  const [detailTab, setDetailTab] = useState<'exercises' | 'assessment'>('exercises')
  const [checked, setChecked] = useState<Record<string, number[]>>({})
  const [completedRoutines, setCompletedRoutines] = useState<string[]>([])
  const [selectedExercise, setSelectedExercise] = useState<{ ex: ExerciseRow; index: number } | null>(null)
  const [celebrateOpen, setCelebrateOpen] = useState(false)

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
    setCelebrateOpen(true)
  }

  /* ---------------- LISTA ---------------- */
  if (view === 'list' || !routine) {
    return (
      <RoutineList
        openRoutine={openRoutine}
        completedIds={completedRoutines}
      />
    )
  }

  /* ---------------- DETALLE ---------------- */
  const progressPct = Math.round((checkedCount / routine.rows.length) * 100)

  return (
    <div className="space-y-4">
      <DetailHeader
        routine={routine}
        evaluator={assessment?.evaluator}
        detailTab={detailTab}
        onTabChange={setDetailTab}
        onBack={() => setView('list')}
      />

      <AnimatePresence>
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
              const exerciseKey = `${ex.name}-${i}`
              return (
                <motion.div
                  key={exerciseKey}
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
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className="w-7 h-7 rounded-lg flex items-center justify-center font-black flex-shrink-0"
                          style={{ background: FIRE + '14', color: FIRE, fontSize: 12, border: `1px solid ${FIRE}30` }}
                        >
                          {i + 1}
                        </span>
                        <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10.5 }}>Categoría:</span>
                        <span className="px-2 py-0.5 rounded-full font-bold" style={{ background: BLUE + '12', color: '#7CC7FF', fontSize: 10 }}>
                          {ex.muscle}{ex.secondaryMuscle ? ` + ${ex.secondaryMuscle}` : ''}
                        </span>
                      </div>
                      <p className="font-bold text-white truncate" style={{ fontSize: 15, textDecoration: isChecked ? 'line-through' : 'none', opacity: isChecked ? 0.65 : 1 }}>
                        {ex.name}
                      </p>
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {[
                          { l: 'Series', v: ex.sets, c: FIRE },
                          { l: 'Reps', v: ex.reps, c: AMBER },
                          { l: 'Descanso', v: ex.rest, c: GREEN },
                        ].map((s, k) => (
                          <div key={k} className="rounded-lg px-2.5 py-1 text-center" style={{ background: s.c + '0d', border: `1px solid ${s.c}22` }}>
                            <p style={{ color: s.c === GREEN ? '#7CE495' : s.c, fontSize: 11, fontWeight: 800 }}>{s.v}</p>
                            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 7.5, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.l}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Preview del ejercicio */}
                    <div
                      className="w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden flex-shrink-0"
                      style={{ border: '1px solid rgba(255,255,255,0.12)', background: '#0A0A14', boxShadow: '0 6px 18px rgba(0,0,0,0.4)' }}
                    >
                      <img src={MUSCLE_IMG[ex.muscle] || FULL_BODY_IMG} alt={ex.muscle} className="w-full h-full object-cover" />
                    </div>

                    <ChevronRight size={17} style={{ color: 'rgba(255,255,255,0.2)' }} className="flex-shrink-0 hidden sm:block" />
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

      <ExerciseModal
        data={selectedExercise}
        routine={routine}
        checkedIndexes={checked[routine.id] || []}
        onToggle={toggleExercise}
        onClose={() => setSelectedExercise(null)}
      />

      <CelebrationModal open={celebrateOpen} routine={routine} onClose={() => setCelebrateOpen(false)} />
    </div>
  )
}
