import { motion } from 'motion/react'
import { Dumbbell, Trash2 } from 'lucide-react'
import type { Student, RoutineExercise, WeekDay } from './RoutineCreator'

interface RoutineDayEditorProps {
  day: WeekDay
  student: Student
  onUpdateExercise: (dayId: string, exId: string, field: keyof RoutineExercise, value: string) => void
  onRemoveExercise: (dayId: string, exId: string) => void
  onRemoveDay: (dayId: string) => void
  onAddExercise: () => void
}

const MUSCLE_LABEL: Record<string, string> = {
  Pectoral: 'Pecho', Espalda: 'Espalda', 'Espalda baja': 'E. baja', Dorsal: 'Dorsal',
  Hombros: 'Hombros', Bíceps: 'Bíceps', Tríceps: 'Tríceps', Cuádriceps: 'Cuádriceps',
  Isquiotibiales: 'Isquios', Glúteos: 'Glúteos', Core: 'Core', General: 'General',
}

export function RoutineDayEditor({ day, student, onUpdateExercise, onRemoveExercise, onRemoveDay, onAddExercise }: RoutineDayEditorProps) {
  return (
    <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.05)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Dumbbell size={16} style={{ color: '#1270B7' }} />
          <p className="text-sm font-extrabold capitalize" style={{ color: '#0D1B2A' }}>{day.label}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onRemoveDay(day.id)}
          className="w-6 h-6 rounded-md flex items-center justify-center cursor-pointer"
          style={{ background: 'rgba(0,0,0,0.04)', color: '#E63946' }}
        >
          <Trash2 size={12} />
        </motion.button>
      </div>

      {day.exercises.length === 0 ? (
        <div className="text-center py-6">
          <Dumbbell size={24} style={{ color: 'rgba(0,0,0,0.15)', margin: '0 auto 8px' }} />
          <p className="text-xs font-medium mb-3" style={{ color: 'rgba(0,0,0,0.45)' }}>Añade ejercicios a este día</p>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onAddExercise}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #1270B7, #7ec8e3)' }}
          >
            + Añadir ejercicio
          </motion.button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {day.exercises.map((ex) => (
            <div key={ex.id} className="border border-dashed rounded-xl p-3" style={{ borderColor: 'rgba(0,0,0,0.06)', background: 'rgba(0,0,0,0.01)' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: 'rgba(18,112,183,0.1)' }}><Dumbbell size={10} style={{ color: '#1270B7' }} /></div>
                  <span className="text-xs font-bold" style={{ color: '#0D1B2A' }}>{ex.name}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onRemoveExercise(day.id, ex.id)}
                  className="w-5 h-5 rounded flex items-center justify-center cursor-pointer"
                  style={{ background: 'rgba(0,0,0,0.04)', color: '#E63946' }}
                >
                  <Trash2 size={9} />
                </motion.button>
              </div>
              <p className="text-[9px] uppercase font-bold mb-2" style={{ color: 'rgba(0,0,0,0.4)' }}>{MUSCLE_LABEL[ex.muscle] || ex.muscle}</p>
              <div className="grid grid-cols-4 gap-2">
                <InputField label="Series" value={ex.sets} onChange={v => onUpdateExercise(day.id, ex.id, 'sets', v)} student={student} />
                <InputField label="Reps" value={ex.reps} onChange={v => onUpdateExercise(day.id, ex.id, 'reps', v)} student={student} />
                <InputField label="Peso" value={ex.weight} onChange={v => onUpdateExercise(day.id, ex.id, 'weight', v)} student={student} />
                <InputField label="Descanso" value={ex.rest} onChange={v => onUpdateExercise(day.id, ex.id, 'rest', v)} student={student} />
              </div>
            </div>
          ))}
        </div>
      )}

      {day.exercises.length > 0 && (
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onAddExercise}
          className="mt-3 w-full px-3 py-2 rounded-xl text-[10px] font-bold text-white flex items-center justify-center gap-1 cursor-pointer"
          style={{ background: 'rgba(18,112,183,0.12)', color: '#1270B7' }}
        >
          <span>+</span> Agregar ejercicio
        </motion.button>
      )}
    </div>
  )
}

function InputField({ label, value, onChange, student }: { label: string; value: string; onChange: (v: string) => void; student: Student }) {
  return (
    <div className="flex flex-col">
      <span className="text-[8px] font-bold mb-0.5" style={{ color: 'rgba(0,0,0,0.4)' }}>{label}</span>
      <input
        type={label === 'Series' || label === 'Reps' ? 'number' : 'text'}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="h-7 px-1.5 rounded text-[10px] font-semibold outline-none"
        style={{ background: 'rgba(255,255,255,0.9)', color: '#0D1B2A', border: '1px solid rgba(0,0,0,0.06)' }}
      />
    </div>
  )
}
