import { motion } from 'motion/react'
import { Dumbbell, Search } from 'lucide-react'
import type { Student } from '@/modules/students/StudentProfileData'

interface Exercise {
  id: string
  name: string
  muscle: string
  category: string
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado'
  calories: number
}

interface ExerciseLibraryProps {
  student: Student
  onSelect: (exercise: Exercise) => void
}

const EXERCISE_CATALOG: Exercise[] = [
  { id: '1', name: 'Press de banca plano', muscle: 'Pectoral', category: 'Pecho', difficulty: 'Intermedio', calories: 80 },
  { id: '2', name: 'Press de banca inclinado', muscle: 'Pectoral', category: 'Pecho', difficulty: 'Intermedio', calories: 90 },
  { id: '3', name: 'Aperturas con mancuernas', muscle: 'Pectoral', category: 'Pecho', difficulty: 'Principiante', calories: 65 },
  { id: '4', name: 'Flexión de pecho', muscle: 'Pectoral', category: 'Pecho', difficulty: 'Principiante', calories: 50 },
  { id: '5', name: 'Remo con barra', muscle: 'Espalda baja', category: 'Espalda', difficulty: 'Intermedio', calories: 85 },
  { id: '6', name: 'Dominadas', muscle: 'Dorsal', category: 'Espalda', difficulty: 'Intermedio', calories: 70 },
  { id: '7', name: 'Remo con mancuerna', muscle: 'Espalda baja', category: 'Espalda', difficulty: 'Intermedio', calories: 75 },
  { id: '8', name: 'Remo con cuerda', muscle: 'Espalda baja', category: 'Espalda', difficulty: 'Intermedio', calories: 60 },
  { id: '9', name: 'Press militar', muscle: 'Hombros', category: 'Hombros', difficulty: 'Intermedio', calories: 65 },
  { id: '10', name: 'Elevaciones laterales', muscle: 'Hombros', category: 'Hombros', difficulty: 'Principiante', calories: 45 },
  { id: '11', name: 'Curl de bíceps', muscle: 'Bíceps', category: 'Brazos', difficulty: 'Principiante', calories: 55 },
  { id: '12', name: 'Curl de bíceps con barra', muscle: 'Bíceps', category: 'Brazos', difficulty: 'Intermedio', calories: 70 },
  { id: '13', name: 'Press francés', muscle: 'Tríceps', category: 'Brazos', difficulty: 'Intermedio', calories: 60 },
  { id: '14', name: 'Pullover', muscle: 'Pectoral', category: 'Pecho', difficulty: 'Intermedio', calories: 75 },
  { id: '15', name: 'Sentadilla con barra', muscle: 'Cuádriceps', category: 'Piernas', difficulty: 'Intermedio', calories: 95 },
  { id: '16', name: 'Peso muerto', muscle: 'Espalda baja', category: 'Piernas', difficulty: 'Avanzado', calories: 110 },
  { id: '17', name: 'Peso muerto sumo', muscle: 'Isquiotibiales', category: 'Piernas', difficulty: 'Intermedio', calories: 90 },
  { id: '18', name: 'Zancadas', muscle: 'Cuádriceps', category: 'Piernas', difficulty: 'Principiante', calories: 65 },
  { id: '19', name: 'Prensa de pierna', muscle: 'Cuádriceps', category: 'Piernas', difficulty: 'Intermedio', calories: 85 },
  { id: '20', name: 'Curl de pierna', muscle: 'Isquiotibiales', category: 'Piernas', difficulty: 'Principiante', calories: 55 },
  { id: '21', name: 'Plancha', muscle: 'Core', category: 'Abdomen/Core', difficulty: 'Principiante', calories: 40 },
  { id: '22', name: 'Crunch', muscle: 'Core', category: 'Abdomen/Core', difficulty: 'Principiante', calories: 35 },
  { id: '23', name: 'Elevaciones de piernas', muscle: 'Core', category: 'Abdomen/Core', difficulty: 'Intermedio', calories: 50 },
  { id: '24', name: 'Mountain climbers', muscle: 'Core', category: 'Cardio', difficulty: 'Principiante', calories: 60 },
  { id: '25', name: 'Burpees', muscle: 'General', category: 'Cardio', difficulty: 'Intermedio', calories: 100 },
  { id: '26', name: 'Saltar la cuerda', muscle: 'General', category: 'Cardio', difficulty: 'Principiante', calories: 55 },
  { id: '27', name: 'Flexión de pecho en piso', muscle: 'Pectoral', category: 'General', difficulty: 'Principiante', calories: 50 },
]

const DIFFICULTY_COLOR: Record<Exercise['difficulty'], { bg: string; color: string }> = {
  Principiante: { bg: 'rgba(34,197,94,0.12)', color: '#22C55E' },
  Intermedio: { bg: 'rgba(18,112,183,0.12)', color: '#1270B7' },
  Avanzado: { bg: 'rgba(244,56,67,0.1)', color: '#F43843' },
}

export function ExerciseLibrary({ student, onSelect }: ExerciseLibraryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl p-5"
      style={{
        background: 'rgba(255,255,255,0.5)',
        border: '1px solid rgba(0,0,0,0.06)',
      }}
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: 'rgba(230,57,70,0.3)' }} />
        <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center text-[#0D1B2A]">
          <Dumbbell size={18} />
        </div>
        <p className="text-lg font-extrabold capitalize" style={{ color: '#0D1B2A' }}>Biblioteca de ejercicios</p>
      </div>

      <div className="mb-3 relative">
        <input
          type="text"
          placeholder="Buscar ejercicio..."
          className="w-full pl-9 pr-3 py-2 rounded-xl text-sm outline-none"
          style={{ background: 'rgba(0,0,0,0.03)', color: '#0D1B2A', border: '1px solid rgba(0,0,0,0.06)' }}
        />
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', marginTop: -7, color: 'rgba(0,0,0,0.35)' }} />
      </div>

      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
        {EXERCISE_CATALOG.map((ex) => {
          const diff = DIFFICULTY_COLOR[ex.difficulty]
          return (
            <motion.button
              key={ex.id}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(ex)}
              className="flex items-center gap-2 p-2.5 rounded-xl text-left cursor-pointer transition-colors"
              style={{
                background: 'rgba(0,0,0,0.02)',
                border: '1px solid rgba(0,0,0,0.04)',
              }}
            >
              <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center" style={{ color: '#1270B7' }}>
                <Dumbbell size={12} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold" style={{ color: '#0D1B2A' }}>{ex.name}</p>
                <p className="text-[10px] mt-0.5" style={{ color: 'rgba(0,0,0,0.4)' }}>{ex.muscle}</p>
              </div>
              <span className="text-[8px] px-1.5 py-0.5 rounded-md" style={{ background: diff.bg, color: diff.color }}>
                {ex.difficulty}
              </span>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
