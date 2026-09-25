import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Dumbbell } from 'lucide-react'
import { useStudentApp } from '@/features/student/hooks/useStudentApp'
import type { StudentRoutine, ExerciseRow } from '@/features/student/types/student'
import { cardStyle, FIRE } from '@/features/student/components/ui/fitness'
import { AssessmentDetail } from '@/features/student/components/ui/AssessmentDetail'
import { RoutineList } from './components/RoutineList'
import { DetailHeader } from './components/DetailHeader'
import { SessionPanel } from './components/SessionPanel'
import { ExerciseModal } from './components/ExerciseModal'
import { CelebrationModal } from './components/CelebrationModal'

type View = 'list' | 'detail'

export function RoutinesPage() {
  const { studentRoutines, assessments, loadingRoutines } = useStudentApp()
  const [view, setView] = useState<View>('list')
  const [routine, setRoutine] = useState<StudentRoutine | null>(null)
  const [detailTab, setDetailTab] = useState<'exercises' | 'assessment'>('exercises')
  const [checked, setChecked] = useState<Record<string, number[]>>({})
  const [completedDays, setCompletedDays] = useState<Record<string, string[]>>({})
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [selectedExercise, setSelectedExercise] = useState<{ ex: ExerciseRow; index: number } | null>(null)
  const [celebrateOpen, setCelebrateOpen] = useState(false)
  const [sessionStart, setSessionStart] = useState<number | null>(null)

  const assessment = routine ? assessments.find(a => a.routine?.id === routine.id) : null
  const sessionActive = sessionStart !== null
  const doneDays = routine ? (completedDays[routine.id] || []) : []

  const openRoutine = (r: StudentRoutine) => {
    const today = new Date().toLocaleDateString('es-CO', { weekday: 'long' }).toLowerCase()
    const defaultDay = r.days?.find(d => d.toLowerCase() === today) ?? r.days?.[0] ?? null
    setSelectedDay(defaultDay)
    setRoutine(r)
    setDetailTab('exercises')
    setView('detail')
  }

  const toggleExercise = (index: number) => {
    if (!routine || !sessionActive) return
    setChecked(prev => {
      const list = prev[routine.id] || []
      return { ...prev, [routine.id]: list.includes(index) ? list.filter(i => i !== index) : [...list, index] }
    })
  }

  const dayRows = routine && selectedDay
    ? routine.rows.map((ex, i) => ({ ex, i })).filter(({ ex }) => ex.dia === selectedDay)
    : []
  const effectiveRows = routine && selectedDay && dayRows.length ? dayRows : (routine?.rows.map((ex, i) => ({ ex, i })) ?? [])
  const allDayChecked = effectiveRows.length > 0 && effectiveRows.every(({ i }) => (checked[routine!.id] || []).includes(i))
  const canComplete = !!(routine && selectedDay && sessionActive && !doneDays.includes(selectedDay) && allDayChecked)

  const completeRoutine = () => {
    if (!routine || !selectedDay || !canComplete) return
    setCompletedDays(prev => ({
      ...prev,
      [routine.id]: [...(prev[routine.id] || []), selectedDay],
    }))
    setSessionStart(null)
    setCelebrateOpen(true)
  }

  const cancelSession = () => {
    if (!routine) return
    setSessionStart(null)
    setChecked(prev => ({ ...prev, [routine.id]: [] }))
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
    const fullyCompletedIds = studentRoutines
      .filter(r => (r.days?.length ?? 0) > 0 && r.days!.every(d => (completedDays[r.id] || []).includes(d)))
      .map(r => r.id)
    return (
      <RoutineList
        routines={studentRoutines}
        openRoutine={openRoutine}
        completedIds={fullyCompletedIds}
      />
    )
  }

  /* ---------------- DETALLE ---------------- */
  return (
    <div className="space-y-4">
      <DetailHeader
        routine={routine}
        evaluator={assessment?.evaluador}
        detailTab={detailTab}
        onTabChange={setDetailTab}
        onBack={() => setView('list')}
        selectedDay={selectedDay}
        onDaySelect={setSelectedDay}
        completedDays={doneDays}
      />

      <AnimatePresence>
        {detailTab === 'exercises' ? (
          /* --------- SESIÓN DE ENTRENAMIENTO --------- */
          <motion.div key="exercises" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
            <SessionPanel
              routine={routine}
              selectedDay={selectedDay ?? ''}
              checked={checked[routine.id] || []}
              completedDays={doneDays}
              sessionActive={sessionActive}
              sessionStart={sessionStart}
              onToggle={toggleExercise}
              onStart={() => setSessionStart(Date.now())}
              onCancelConfirmed={cancelSession}
              onComplete={completeRoutine}
              onOpenExercise={(ex, index) => setSelectedExercise({ ex, index })}
            />
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
        sessionActive={sessionActive}
        onToggle={toggleExercise}
        onClose={() => setSelectedExercise(null)}
      />

      <CelebrationModal open={celebrateOpen} routine={routine} dayLabel={selectedDay ?? undefined} onClose={() => setCelebrateOpen(false)} />
    </div>
  )
}