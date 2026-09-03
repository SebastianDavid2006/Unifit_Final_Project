import type { RefObject } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, List, ChevronDown, Check } from 'lucide-react'
import type { Exercise } from '@/data/shared/types'
import { BLUE, BLUE_GRAD, meshInputBg, meshInputHover, muscleIcons } from '@/data/shared/constants'
import { ALL_GROUPS } from '@/modules/equipment/data'

interface ExerciseSelectorProps {
  form: {
    muscleGroups: string[]
    selectedIds: string[]
  }
  exercises: Exercise[]
  muscleExercises: Exercise[]
  showMuscleDropdown: boolean
  activeMuscleFilter: string
  muscleDropdownRef: RefObject<HTMLButtonElement | null>
  onToggleMuscleDropdown: () => void
  onMuscleFilterChange: (filter: string) => void
  onToggleExerciseSelection: (id: string) => void
}

export function ExerciseSelector(props: ExerciseSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-[11px] font-bold block mb-3" style={{ color: 'rgba(0,0,0,0.6)' }}>Ejercicios</label>
        {/* Muscle group dropdown */}
        <div className="relative mb-3">
          <motion.button
            ref={props.muscleDropdownRef}
            whileTap={{ scale: 0.98 }}
            onClick={props.onToggleMuscleDropdown}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium outline-none cursor-pointer transition-all duration-200"
            style={{
              background: meshInputBg,
              color: props.activeMuscleFilter === 'Todos' ? 'rgba(0,0,0,0.3)' : '#1A1A1E',
              border: '1px solid transparent',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = meshInputHover; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)' }}
            onMouseLeave={e => { e.currentTarget.style.background = meshInputBg; e.currentTarget.style.borderColor = 'transparent' }}
          >
            {props.activeMuscleFilter !== 'Todos' ? (
              <img src={muscleIcons[props.activeMuscleFilter]} alt="" className="w-5 h-5" />
            ) : (
              <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: `${BLUE}15` }}>
                <List size={12} style={{ color: BLUE }} />
              </div>
            )}
            {props.activeMuscleFilter === 'Todos' ? 'Mostrar todos' : props.activeMuscleFilter}
            <div className="flex-1" />
            <motion.div
              animate={{ rotate: props.showMuscleDropdown ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              style={{ color: 'rgba(0,0,0,0.2)' }}
            >
              <ChevronDown size={14} />
            </motion.div>
          </motion.button>
          <AnimatePresence initial={false}>
            {props.showMuscleDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-full left-0 right-0 z-50 mt-1 rounded-xl max-h-48 overflow-y-auto"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)',
                }}
              >
                {[
                  'Todos',
                  ...(ALL_GROUPS as readonly string[]).filter(g => props.form.muscleGroups.includes(g)),
                ].map(label => {
                  const isActive = props.activeMuscleFilter === label
                  return (
                    <motion.button
                      key={label}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => { props.onMuscleFilterChange(label); props.onToggleMuscleDropdown() }}
                      className="w-full flex items-center gap-2.5 px-3 py-3 text-xs font-medium transition-colors relative"
                      style={{
                        color: isActive ? '#FFFFFF' : 'rgba(0,0,0,0.6)',
                        background: isActive ? BLUE_GRAD : 'transparent',
                        borderBottom: '1px solid rgba(0,0,0,0.03)',
                      }}
                      onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = BLUE } }}
                      onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(0,0,0,0.6)' } }}
                    >
                      {label === 'Todos' ? (
                        <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: isActive ? 'rgba(255,255,255,0.2)' : `${BLUE}15` }}>
                          <List size={12} style={{ color: isActive ? '#FFFFFF' : BLUE }} />
                        </div>
                      ) : (
                        <img src={muscleIcons[label]} alt="" className="w-5 h-5" style={{ filter: isActive ? 'brightness(10)' : 'none' }} />
                      )}
                      <span className={isActive ? 'font-bold' : ''}>
                        {label === 'Todos' ? 'Mostrar todos' : label}
                      </span>
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto"
                        >
                          <Check size={12} className="text-white" />
                        </motion.div>
                      )}
                    </motion.button>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Exercises for selected muscle group */}
        {props.activeMuscleFilter ? (
          <div className="max-h-32 overflow-y-auto rounded-xl p-2" style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.06)' }}>
            {props.muscleExercises.length === 0 ? (
              <p className="text-xs py-3 text-center" style={{ color: 'rgba(0,0,0,0.2)' }}>
                No hay ejercicios disponibles para este grupo muscular
              </p>
            ) : (
              <div className="space-y-1">
                {props.muscleExercises.map(ex => {
                  const selected = props.form.selectedIds.includes(ex.id)
                  return (
                    <motion.button
                      key={ex.id}
                      layout
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => props.onToggleExerciseSelection(ex.id)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200"
                      style={{
                        background: selected ? `${BLUE}08` : 'transparent',
                        color: selected ? BLUE : 'rgba(0,0,0,0.5)',
                        border: `1px solid ${selected ? `${BLUE}25` : 'transparent'}`,
                      }}
                      onMouseEnter={e => { if (!selected) { e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; e.currentTarget.style.color = BLUE } }}
                      onMouseLeave={e => { if (!selected) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(0,0,0,0.5)' } }}
                    >
                      <div
                        className="w-5 h-5 rounded-lg flex items-center justify-center transition-all duration-200"
                        style={{
                          background: selected ? BLUE_GRAD : 'rgba(0,0,0,0.05)',
                          boxShadow: selected ? `0 2px 8px ${BLUE}50` : 'none',
                        }}
                      >
                        {selected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          >
                            <Check size={11} className="text-white" />
                          </motion.div>
                        )}
                      </div>
                      {ex.name}
                    </motion.button>
                  )
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.06)' }}>
            <p className="text-xs" style={{ color: 'rgba(0,0,0,0.2)' }}>
              Selecciona un grupo muscular en el menú de arriba
            </p>
          </div>
        )}
      </div>
      <div>
        <label className="text-[11px] font-bold mb-2 block" style={{ color: 'rgba(0,0,0,0.6)' }}>
          Ejercicios Seleccionados ({props.form.selectedIds.length})
        </label>
        <div
          className="min-h-[70px] rounded-xl p-3 transition-all duration-200"
          style={{
            background: props.form.selectedIds.length > 0 ? `${BLUE}06` : 'rgba(0,0,0,0.02)',
            border: `1px solid ${props.form.selectedIds.length > 0 ? `${BLUE}20` : 'rgba(0,0,0,0.06)'}`,
          }}
        >
          {props.form.selectedIds.length === 0 ? (
            <p className="text-xs py-1 text-center" style={{ color: 'rgba(0,0,0,0.2)' }}>
              Aún no has seleccionado ejercicios
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {props.form.selectedIds.map(id => {
                const ex = props.exercises.find(e => e.id === id)
                return ex ? (
                  <motion.div
                    key={id}
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold"
                    style={{
                      background: BLUE_GRAD,
                      color: '#FFFFFF',
                      boxShadow: `0 2px 8px ${BLUE}40`,
                    }}
                  >
                    <Check size={10} className="text-white" />
                    <span>{ex.name}</span>
                    <motion.button
                      whileHover={{ scale: 1.3, background: 'rgba(255,255,255,0.2)' }}
                      whileTap={{ scale: 0.8 }}
                      onClick={() => props.onToggleExerciseSelection(id)}
                      className="w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(255,255,255,0.15)' }}
                    >
                      <X size={9} className="text-white" />
                    </motion.button>
                  </motion.div>
                ) : null
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
