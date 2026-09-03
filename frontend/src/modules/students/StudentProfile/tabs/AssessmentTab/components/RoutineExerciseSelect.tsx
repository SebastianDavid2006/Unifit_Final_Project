import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown, Check, Dumbbell, Sparkles } from 'lucide-react'
import type { RoutineRow } from '@/modules/students/aiRoutineTypes'
import { ROUTINE_MUSCLE_TO_CAT } from '@/modules/students/StudentProfileData'
import type { FrontendExercise } from '@/services/ejercicio.service'

const ROUTINE_GRAD = 'linear-gradient(135deg, #1270B7, #7ec8e3)'
const meshInputBg = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)'
const meshInputHover = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(0,0,0,0.04)'

interface RoutineExerciseSelectProps {
  row: RoutineRow
  routineViewMode: boolean
  open: boolean
  exerciseCatalog: FrontendExercise[]
  onToggle: () => void
  onSelect: (name: string, muscle: string, sets: string, reps: string) => void
  onClose: () => void
}

export function RoutineExerciseSelect({ row, routineViewMode, open, exerciseCatalog, onToggle, onSelect, onClose }: RoutineExerciseSelectProps) {
  const category = ROUTINE_MUSCLE_TO_CAT[row.muscle] || row.muscle
  const catExercises = exerciseCatalog.filter(e => {
    const primaryMuscle = e.muscleGroups[0] ?? ''
    return (ROUTINE_MUSCLE_TO_CAT[primaryMuscle] || primaryMuscle) === category
  })
  const hasCustom = row.name && !catExercises.some(e => e.name === row.name)
  return (
    <div className="relative">
      <button
        type="button"
        disabled={!row.muscle || routineViewMode}
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold outline-none cursor-pointer transition-all duration-200"
        style={{
          background: row.muscle ? meshInputBg : 'rgba(0,0,0,0.03)',
          border: '1px solid transparent',
          color: row.name ? '#0D1B2A' : 'rgba(0,0,0,0.35)',
          opacity: row.muscle ? 1 : 0.6,
        }}
        onMouseEnter={e => { if (e.currentTarget !== document.activeElement) { e.currentTarget.style.background = meshInputHover; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)' } }}
        onMouseLeave={e => { if (e.currentTarget !== document.activeElement) { e.currentTarget.style.background = meshInputBg; e.currentTarget.style.borderColor = 'transparent' } }}
        onFocus={e => { e.currentTarget.style.borderColor = '#1270B7'; e.currentTarget.style.background = meshInputHover; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(18,112,183,0.08)' }}
        onBlur={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = meshInputBg; e.currentTarget.style.boxShadow = 'none' }}
      >
        <Dumbbell size={13} style={{ color: row.name ? '#1270B7' : 'rgba(0,0,0,0.3)' }} className="flex-shrink-0" />
        <span className="flex-1 truncate text-left">{row.name || 'Ejercicio'}</span>
        {!routineViewMode && (
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ color: 'rgba(0,0,0,0.25)' }} className="flex-shrink-0">
            <ChevronDown size={13} />
          </motion.div>
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-0 right-0 z-50 mt-1 rounded-xl max-h-44 overflow-y-auto"
            style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 12px 40px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)' }}
          >
            {catExercises.length === 0 && !hasCustom ? (
              <p className="text-[11px] py-3 text-center" style={{ color: 'rgba(0,0,0,0.3)' }}>
                No hay ejercicios en esta categoría
              </p>
            ) : (
              catExercises.map(ex => {
                const isActive = row.name === ex.name
                return (
                  <button
                    key={ex.id}
                    type="button"
                    onClick={() => onSelect(ex.name, ex.muscleGroups[0] ?? '', '3', '10-12')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-[11px] font-medium transition-colors relative"
                    style={{
                      color: isActive ? '#FFFFFF' : 'rgba(0,0,0,0.6)',
                      background: isActive ? ROUTINE_GRAD : 'transparent',
                      borderBottom: '1px solid rgba(0,0,0,0.03)',
                    }}
                    onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = '#1270B7' } }}
                    onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(0,0,0,0.6)' } }}
                  >
                    <Dumbbell size={12} style={{ color: isActive ? '#fff' : 'rgba(0,0,0,0.4)' }} className="flex-shrink-0" />
                    <span>{ex.name}</span>
                    {isActive && <Check size={12} className="ml-auto text-white" />}
                  </button>
                )
              })
            )}
            {hasCustom && (
              <button
                type="button"
                onClick={onClose}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[11px] font-medium transition-colors"
                style={{ color: '#1270B7', background: 'rgba(18,112,183,0.06)', borderBottom: '1px solid rgba(0,0,0,0.03)' }}
              >
                <Sparkles size={12} className="flex-shrink-0" />
                <span className="truncate">{row.name} (personalizado)</span>
                <Check size={12} className="ml-auto" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
