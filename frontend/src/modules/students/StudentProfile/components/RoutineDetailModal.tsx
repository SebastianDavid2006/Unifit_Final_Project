import { motion } from 'motion/react'
import { X, Dumbbell } from 'lucide-react'
import { ModalShell } from './ModalShell'
import { routineExercises } from '../../StudentProfileData'
import { RoutineDayCard } from './RoutineDayCard'
import type { AiRoutine } from '../../aiRoutine'

interface RoutineDetailModalProps {
  isOpen: boolean
  assessment: any
  routine: AiRoutine | null
  viewRoutineDay: string | null
  setViewRoutineDay: (day: string | null) => void
  onClose: () => void
}

export function RoutineDetailModal({ isOpen, assessment, routine, viewRoutineDay, setViewRoutineDay, onClose }: RoutineDetailModalProps) {
  return (
    <ModalShell isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(48,209,88,0.12)' }}>
            <Dumbbell size={20} style={{ color: '#30D158' }} />
          </div>
          <div>
            <h3 className="text-base font-bold" style={{ color: '#0D1B2A' }}>{routine?.name ?? assessment?.routine ?? 'Sin rutina'}</h3>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.4)' }}>{assessment.date} · Asociada a la valoración</p>
          </div>
        </div>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onClose}
          className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.04)' }}>
          <X size={16} style={{ color: 'rgba(0,0,0,0.4)' }} />
        </motion.button>
      </div>

      {routine && routine.rows.length > 0 ? (
        (() => {
          const viewDays = [...new Set(routine.rows.map(r => r.dia))]
          const activeDay = viewRoutineDay && viewDays.includes(viewRoutineDay) ? viewRoutineDay : viewDays[0]
          const selDayRows = routine.rows.filter(r => r.dia === activeDay)
          return (
            <div className="flex flex-col min-h-0 flex-1">
              <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: `repeat(${viewDays.length}, minmax(0, 1fr))` }}>
                {viewDays.map(day => (
                  <RoutineDayCard
                    key={day}
                    day={day}
                    selected={day === activeDay}
                    done={routine.rows.some(r => r.dia === day)}
                    onClick={() => setViewRoutineDay(day)}
                  />
                ))}
              </div>
              <div className="rounded-2xl p-4 space-y-2 overflow-y-auto min-h-[180px]" style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)', maxHeight: 340, scrollbarWidth: 'thin' }}>
                {selDayRows.length === 0 ? (
                  <p className="text-xs text-center py-4" style={{ color: 'rgba(0,0,0,0.4)' }}>Sin ejercicios para este día.</p>
                ) : selDayRows.map((ex, i) => (
                  <motion.div
                    key={ex.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                    style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.85)' : 'transparent' }}
                  >
                    <span className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ background: 'rgba(48,209,88,0.15)', color: '#1A8A3F' }}>{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: '#0D1B2A' }}>{ex.name}</p>
                      <p className="text-[10px]" style={{ color: 'rgba(0,0,0,0.4)' }}>{ex.muscle}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold" style={{ color: '#0D1B2A' }}>{ex.sets} × {ex.reps}</p>
                      <p className="text-[10px]" style={{ color: 'rgba(0,0,0,0.4)' }}>Descanso {ex.rest}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )
        })()
      ) : (
        <div className="space-y-2">
          <div className="grid gap-3 px-1 mb-2" style={{ gridTemplateColumns: '2fr 0.7fr 0.7fr 0.9fr 0.7fr' }}>
            {['Ejercicio', 'Series', 'Repeticiones', 'Peso', 'Calorías'].map(h => (
              <div key={h} className="text-[10px] font-bold" style={{ color: 'rgba(0,0,0,0.35)' }}>{h}</div>
            ))}
          </div>
          {routineExercises.map((ex, i) => (
            <motion.div
              key={ex.name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="grid gap-3 items-center px-3 py-2.5 rounded-xl"
              style={{
                gridTemplateColumns: '2fr 0.7fr 0.7fr 0.9fr 0.7fr',
                background: i % 2 === 0 ? 'rgba(0,0,0,0.02)' : 'transparent',
              }}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-semibold" style={{ color: '#0D1B2A' }}>{ex.name}</span>
              </div>
              <span className="text-sm font-bold" style={{ color: '#0D1B2A' }}>{ex.sets}</span>
              <span className="text-sm" style={{ color: 'rgba(0,0,0,0.6)' }}>{ex.reps}</span>
              <span className="text-sm font-semibold" style={{ color: '#0D1B2A' }}>{ex.weight}</span>
              <span className="text-sm" style={{ color: 'rgba(0,0,0,0.6)' }}>{ex.calories}</span>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-5 pt-4 flex justify-end" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
          style={{ background: 'rgba(0,0,0,0.04)', color: '#0D1B2A', border: '1px solid rgba(0,0,0,0.06)' }}
        >
          Cerrar
        </button>
      </div>
    </ModalShell>
  )
}
