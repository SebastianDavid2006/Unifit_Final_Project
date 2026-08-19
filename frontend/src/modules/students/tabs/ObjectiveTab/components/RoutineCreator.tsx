import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Dumbbell, Sparkles } from 'lucide-react'
import { RoutineDayEditor } from './RoutineDayEditor'
import { ExerciseLibrary } from './ExerciseLibrary'
import type { Student } from '@/modules/students/StudentProfileData'

interface RoutineCreatorProps {
  student: Student
  routine?: SavedRoutine
  onSave: (routine: SavedRoutine) => void
  onCancel: () => void
}

export interface SavedRoutine {
  id: string
  name: string
  description: string
  level: string
  weeks: WeekDay[]
}

export interface WeekDay {
  id: string
  label: string
  exercises: RoutineExercise[]
}

export interface RoutineExercise {
  id: string
  name: string
  muscle: string
  category: string
  sets: string
  reps: string
  weight: string
  rest: string
}

const WEEK_DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

export function RoutineCreator({ student, routine, onSave, onCancel }: RoutineCreatorProps) {
  const [routineName, setRoutineName] = useState(routine?.name ?? `${student.firstName}'s Rutina`)
  const [routineDesc, setRoutineDesc] = useState(routine?.description ?? '')
  const [level, setLevel] = useState<'Principiante' | 'Intermedio' | 'Avanzado'>(routine?.level ?? 'Intermedio')
  const [weeks, setWeeks] = useState<WeekDay[]>(routine?.weeks ?? [])
  const [activeDayId, setActiveDayId] = useState<string | null>(null)
  const [showExerciseSelect, setShowExerciseSelect] = useState(false)
  const [successStep, setSuccessStep] = useState(false)

  const addDay = (dayLabel: string) => {
    const id = `day-${Date.now()}`
    const newDay: WeekDay = { id, label: dayLabel, exercises: [] }
    setWeeks([...weeks, newDay])
    setActiveDayId(id)
  }

  const removeDay = (id: string) => {
    setWeeks(weeks.filter(w => w.id !== id))
    if (activeDayId === id) setActiveDayId(weeks.length ? weeks[0].id : null)
  }

  const activeDay = weeks.find(w => w.id === activeDayId)

  const addExerciseToDay = (ex: { name: string; muscle: string; category: string }) => {
    if (!activeDay) return
    const newEx: RoutineExercise = {
      id: `ex-${Date.now()}`,
      name: ex.name,
      muscle: ex.muscle,
      category: ex.category,
      sets: '3',
      reps: '8-10',
      weight: '',
      rest: '60',
    }
    setWeeks(weeks.map(w => w.id === activeDayId ? { ...w, exercises: [...w.exercises, newEx] } : w))
    setShowExerciseSelect(false)
  }

  const updateExercise = (dayId: string, exId: string, field: keyof RoutineExercise, value: string) => {
    setWeeks(weeks.map(w =>
      w.id === dayId
        ? { ...w, exercises: w.exercises.map(e => (e.id === exId ? { ...e, [field]: value } : e)) }
        : w
    ))
  }

  const removeExercise = (dayId: string, exId: string) => {
    setWeeks(weeks.map(w =>
      w.id === dayId ? { ...w, exercises: w.exercises.filter(e => e.id !== exId) } : w
    ))
  }

  const handleSave = () => {
    setSuccessStep(true)
  }

  const handleConfirmSave = () => {
    const routine: SavedRoutine = {
      id: `routine-${Date.now()}`,
      name: routineName,
      description: routineDesc,
      level,
      weeks,
    }
    onSave(routine)
    onCancel()
  }

  return (
    <AnimatePresence mode="wait">
      {successStep ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center py-10 gap-4"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles size={48} style={{ color: '#1270B7' }} />
          </motion.div>
          <p className="text-xl font-bold" style={{ color: '#0D1B2A' }}>¡Rutina creada!</p>
          <p className="text-sm font-medium max-w-xs" style={{ color: 'rgba(0,0,0,0.5)' }}>
            La rutina "{routineName}" se ha guardado y está lista para entrenar.
          </p>
          <div className="flex gap-3 mt-2">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setSuccessStep(false)}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #1270B7, #7ec8e3)' }}
            >
              Crear otra
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleConfirmSave}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #22C55E, #1270B7)' }}
            >
              Ver rutina
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: 'rgba(230,57,70,0.3)' }} />
            <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center text-[#0D1B2A]"><Dumbbell size={18} /></div>
            <p className="text-lg font-extrabold" style={{ color: '#0D1B2A' }}>Crear rutina</p>
          </div>

          <div className="flex gap-2.5">
            <input
              type="text"
              value={routineName}
              onChange={e => setRoutineName(e.target.value)}
              placeholder="Nombre de la rutina"
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold outline-none"
              style={{ background: 'rgba(255,255,255,0.7)', color: '#0D1B2A', border: '1px solid rgba(0,0,0,0.06)' }}
            />
            <select
              value={level}
              onChange={e => setLevel(e.target.value as 'Principiante' | 'Intermedio' | 'Avanzado')}
              className="px-3 py-2 rounded-xl text-xs font-bold outline-none cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.7)', color: '#0D1B2A', border: '1px solid rgba(0,0,0,0.06)' }}
            >
              <option value="Principiante">Principiante</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </select>
          </div>

          <textarea
            value={routineDesc}
            onChange={e => setRoutineDesc(e.target.value)}
            placeholder="Descripción (opcional)"
            rows={2}
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
            style={{ background: 'rgba(255,255,255,0.7)', color: '#0D1B2A', border: '1px solid rgba(0,0,0,0.06)' }}
          />

          <div>
            <p className="text-xs font-bold mb-2" style={{ color: 'rgba(0,0,0,0.5)' }}>Días de entrenamiento</p>
            <div className="flex flex-wrap gap-2">
              {WEEK_DAYS.filter(d => !weeks.find(w => w.label === d)).map(day => (
                <motion.button
                  key={day}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addDay(day)}
                  className="px-3 py-1.5 rounded-xl text-[10px] font-bold cursor-pointer"
                  style={{ background: 'rgba(18,112,183,0.08)', color: '#1270B7' }}
                >
                  + {day}
                </motion.button>
              ))}
            </div>
          </div>

          {weeks.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {weeks.map(w => (
                <button
                  key={w.id}
                  onClick={() => setActiveDayId(w.id)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer"
                  style={{
                    background: activeDayId === w.id ? 'linear-gradient(135deg, #1270B7, #7ec8e3)' : 'rgba(0,0,0,0.04)',
                    color: activeDayId === w.id ? '#FFFFFF' : 'rgba(0,0,0,0.5)',
                  }}
                >
                  {w.label}
                </button>
              ))}
            </div>
          )}

          {activeDay && (
            <RoutineDayEditor
              day={activeDay}
              student={student}
              onUpdateExercise={(dayId, exId, field, value) => updateExercise(dayId, exId, field, value)}
              onRemoveExercise={(dayId, exId) => removeExercise(dayId, exId)}
              onRemoveDay={removeDay}
              onAddExercise={() => setShowExerciseSelect(true)}
            />
          )}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={weeks.length === 0}
            className="w-full px-5 py-3 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
            style={{
              background: weeks.length === 0 ? 'rgba(0,0,0,0.15)' : 'linear-gradient(135deg, #22C55E, #1270B7)',
              boxShadow: weeks.length === 0 ? 'none' : '0 4px 16px rgba(18,112,183,0.35)',
            }}
          >
            <Sparkles size={16} /> Guardar rutina
          </motion.button>

          <AnimatePresence>
            {showExerciseSelect && (
              <motion.div
                key="exerciseSelect"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                style={{ background: 'rgba(0,0,0,0.5)' }}
                onClick={() => setShowExerciseSelect(false)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="max-w-lg w-full max-h-[70vh] overflow-y-auto"
                  onClick={e => e.stopPropagation()}
                >
                  <ExerciseLibrary
                    student={student}
                    onSelect={(ex) => addExerciseToDay(ex)}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
