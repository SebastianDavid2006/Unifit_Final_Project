import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Dumbbell, Clock, Flame, CheckCircle2, Circle, ChevronRight, Trophy } from 'lucide-react'
import { useStudentApp } from '@/features/student/hooks/useStudentApp'
import type { StudentRoutine, ExerciseRow } from '@/features/student/types/student'
import { cardStyle, FIRE, AMBER, GREEN } from '@/features/student/components/ui/fitness'
import { AssessmentDetail } from '@/features/student/components/ui/AssessmentDetail'
import { MUSCLE_IMG, FULL_BODY_IMG } from './routineAssets'
import { RoutineList } from './components/RoutineList'
import { DetailHeader } from './components/DetailHeader'
import { ExerciseModal } from './components/ExerciseModal'
import { CollapsibleCategoryPills } from './components/CollapsibleCategoryPills'
import { CelebrationModal } from './components/CelebrationModal'

type View = 'list' | 'detail'

export function RoutinesPage() {
  const { studentRoutines, assessments, loadingRoutines } = useStudentApp()
  const [view, setView] = useState<View>('list')
  const [routine, setRoutine] = useState<StudentRoutine | null>(null)
  const [detailTab, setDetailTab] = useState<'exercises' | 'assessment'>('exercises')
  const [checked, setChecked] = useState<Record<string, number[]>>({})
  const [completedRoutines, setCompletedRoutines] = useState<string[]>([])
  const [selectedExercise, setSelectedExercise] = useState<{ ex: ExerciseRow; index: number } | null>(null)
  const [celebrateOpen, setCelebrateOpen] = useState(false)

  const assessment = routine ? assessments.find(a => a.routine?.id === routine.id) : null

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
  const allExercisesChecked = routine ? routine.rows.length > 0 && checkedCount === routine.rows.length : false
  const canComplete = !isCompleted && allExercisesChecked

  const completeRoutine = () => {
    if (!routine || !canComplete) return
    setChecked(prev => ({ ...prev, [routine.id]: routine.rows.map((_, i) => i) }))
    setCompletedRoutines(prev => [...prev, routine.id])
    setCelebrateOpen(true)
  }

  /* ---------------- LISTA ---------------- */
  if (loadingRoutines) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-10 h-10 rounded-full"
          style={{ border: '2px solid rgba(255,255,255,0.1)', borderTopColor: FIRE }}
        />
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12.5 }}>Cargando rutinas…</p>
      </div>
    )
  }

  if (view === 'list' || !routine) {
    if (studentRoutines.length === 0) {
      return (
        <div className="rounded-3xl p-8 text-center" style={cardStyle}>
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: FIRE + '14', border: `1px solid ${FIRE}30` }}>
            <Dumbbell size={24} style={{ color: FIRE }} />
          </div>
          <p className="text-white font-black" style={{ fontSize: 16 }}>Aún no tienes rutinas</p>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12.5, marginTop: 6, lineHeight: 1.6 }}>
            Tu entrenador te creará una rutina después de tu valoración física.
          </p>
        </div>
      )
    }
    return (
      <RoutineList
        routines={studentRoutines}
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
        evaluator={assessment?.evaluador}
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
                      <div className="flex items-center gap-2.5 flex-wrap mb-1">
                        <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12.5 }}>Categoría/s:</span>
                        <CollapsibleCategoryPills groups={ex.groups?.length ? ex.groups : [ex.muscle]} />
                      </div>
                      <p className="font-bold text-white truncate" style={{ fontSize: 17, textDecoration: isChecked ? 'line-through' : 'none', opacity: isChecked ? 0.65 : 1 }}>
                        {ex.name}
                      </p>
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {[
                          { l: 'Series', v: ex.sets, c: FIRE },
                          { l: 'Reps', v: ex.reps, c: AMBER },
                          { l: 'Descanso', v: ex.rest, c: GREEN },
                        ].map((s, k) => (
                          <div key={k} className="rounded-lg px-3 py-1.5 text-center" style={{ background: s.c + '0d', border: `1px solid ${s.c}22` }}>
                            <p style={{ color: s.c === GREEN ? '#7CE495' : s.c, fontSize: 13, fontWeight: 800 }}>{s.v}</p>
                            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.l}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Preview del ejercicio */}
                    <div
                      className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden flex-shrink-0"
                      style={{ border: '1px solid rgba(255,255,255,0.12)', background: '#0A0A14', boxShadow: '0 6px 18px rgba(0,0,0,0.4)' }}
                    >
                      <img src={ex.image || MUSCLE_IMG[ex.muscle] || FULL_BODY_IMG} alt={ex.muscle} className="w-full h-full object-cover" />
                    </div>

                    <ChevronRight size={20} style={{ color: 'rgba(255,255,255,0.2)' }} className="flex-shrink-0 hidden sm:block" />
                  </div>
                </motion.div>
              )
            })}

            {/* Completar rutina */}
            <motion.button
              whileHover={canComplete ? { scale: 1.01 } : {}}
              whileTap={canComplete ? { scale: 0.98 } : {}}
              onClick={completeRoutine}
              disabled={!canComplete}
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-black uppercase tracking-widest mt-2"
              style={{
                background: isCompleted
                  ? 'rgba(48,209,88,0.14)'
                  : canComplete
                    ? `linear-gradient(135deg, ${GREEN}, #7CE495)`
                    : 'rgba(255,255,255,0.05)',
                border: isCompleted
                  ? '1px solid rgba(48,209,88,0.4)'
                  : canComplete
                    ? 'none'
                    : '1px solid rgba(255,255,255,0.09)',
                color: isCompleted ? GREEN : canComplete ? '#052e12' : 'rgba(255,255,255,0.3)',
                fontSize: 13,
                boxShadow: canComplete ? '0 14px 40px rgba(48,209,88,0.3)' : 'none',
                cursor: canComplete ? 'pointer' : 'default',
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
