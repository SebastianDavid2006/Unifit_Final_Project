import { motion, AnimatePresence } from 'motion/react'
import { Dumbbell, Target, Calendar, Edit, Trash2, BarChart2, Zap } from 'lucide-react'
import type { SavedRoutine } from './RoutineCreator'

interface RoutineListProps {
  routines: SavedRoutine[]
  onEdit: (routine: SavedRoutine) => void
  onDelete: (routine: SavedRoutine) => void
}

const LEVEL_COLOR: Record<string, string> = {
  Principiante: 'rgba(34,197,94,0.12)',
  Intermedio: 'rgba(18,112,183,0.12)',
  Avanzado: 'rgba(244,56,67,0.1)',
}
const LEVEL_TEXT: Record<string, string> = {
  Principiante: '#22C55E',
  Intermedio: '#1270B7',
  Avanzado: '#F43843',
}

export function RoutineList({ routines, onSelect, onEdit, onDelete }: RoutineListProps) {
  if (routines.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl p-8 text-center"
        style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)' }}
      >
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: 'rgba(0,0,0,0.03)' }}>
          <Target size={28} style={{ color: 'rgba(0,0,0,0.2)' }} />
        </div>
        <p className="text-sm font-bold mb-1" style={{ color: '#0D1B2A' }}>No tienes rutinas creadas</p>
        <p className="text-xs" style={{ color: 'rgba(0,0,0,0.4)' }}>Crea tu primera rutina para empezar a entrenar con objetivo.</p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-3">
      {routines.map((r, idx) => (
        <motion.div
          key={r.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, delay: idx * 0.04 }}
        >
          <RoutineCard routine={r} onSelect={onSelect} onEdit={onEdit} onDelete={onDelete} levelColor={LEVEL_COLOR[r.level]} levelText={LEVEL_TEXT[r.level]} />
        </motion.div>
      ))}
    </div>
  )
}

interface RoutineCardProps {
  routine: SavedRoutine
  onSelect: (routine: SavedRoutine) => void
  onEdit: (routine: SavedRoutine) => void
  onDelete: (routine: SavedRoutine) => void
  levelColor: string
  levelText: string
}

function RoutineCard({ routine, onSelect, onEdit, onDelete, levelColor, levelText }: RoutineCardProps) {
  const totalExercises = routine.weeks.reduce((acc, d) => acc + d.exercises.length, 0)
  const totalDays = routine.weeks.length
  const firstDay = routine.weeks[0]
  const mainMuscle = firstDay?.exercises?.[0]?.muscle || 'General'

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.015, y: -1 }}
      whileTap={{ scale: 0.985 }}
      onClick={() => onSelect(routine)}
      className="w-full rounded-xl p-4 text-left cursor-pointer transition-colors"
      style={{
        background: 'rgba(255,255,255,0.7)',
        border: '1px solid rgba(0,0,0,0.05)',
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(18,112,183,0.1)', color: '#1270B7' }}
          >
            <Dumbbell size={16} />
          </div>
          <div>
            <p className="text-sm font-extrabold line-clamp-1" style={{ color: '#0D1B2A' }}>{routine.name}</p>
            <p className="text-[10px] font-medium line-clamp-1" style={{ color: 'rgba(0,0,0,0.4)' }}>
              {routine.description || 'Sin descripciÃ³n'}
            </p>
          </div>
        </div>
        <span className="text-[9px] px-1.5 py-0.5 rounded-md whitespace-nowrap font-bold" style={{ background: levelColor, color: levelText }}>{routine.level}</span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-2 text-center">
        <div>
          <div className="flex items-center justify-center gap-0.5 mx-auto mb-0.5">
            <Calendar size={12} style={{ color: 'rgba(0,0,0,0.4)' }} />
            <span className="text-xs font-bold" style={{ color: '#0D1B2A' }}>{totalDays}</span>
          </div>
          <p className="text-[9px]" style={{ color: 'rgba(0,0,0,0.4)' }}>dÃ­as</p>
        </div>
        <div>
          <div className="flex items-center justify-center gap-0.5 mx-auto mb-0.5">
            <Dumbbell size={12} style={{ color: 'rgba(0,0,0,0.4)' }} />
            <span className="text-xs font-bold" style={{ color: '#0D1B2A' }}>{totalExercises}</span>
          </div>
          <p className="text-[9px]" style={{ color: 'rgba(0,0,0,0.4)' }}>ejercicios</p>
        </div>
        <div>
          <div className="flex items-center justify-center gap-0.5 mx-auto mb-0.5">
            <Zap size={12} style={{ color: 'rgba(0,0,0,0.4)' }} />
            <span className="text-xs font-bold line-clamp-1" style={{ color: '#0D1B2A' }}>{mainMuscle}</span>
          </div>
          <p className="text-[9px]" style={{ color: 'rgba(0,0,0,0.4)' }}>foco</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <BarChart2 size={11} style={{ color: 'rgba(0,0,0,0.3)' }} />
          <span className="text-[9px] font-medium" style={{ color: 'rgba(0,0,0,0.4)' }}>12 sesiones completadas</span>
        </div>
        <div className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={e => { e.stopPropagation(); onEdit(routine) }}
            className="w-6 h-6 rounded-md flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.03)', color: 'rgba(0,0,0,0.4)' }}
            title="Editar rutina"
          >
            <Edit size={11} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={e => { e.stopPropagation(); onDelete(routine) }}
            className="w-6 h-6 rounded-md flex items-center justify-center"
            style={{ background: 'rgba(244,56,67,0.08)', color: '#E63946' }}
            title="Eliminar rutina"
          >
            <Trash2 size={11} />
          </motion.button>
        </div>
      </div>
    </motion.button>
  )
}

