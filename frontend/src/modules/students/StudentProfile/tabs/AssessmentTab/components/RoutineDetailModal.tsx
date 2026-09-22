import { motion } from 'motion/react'
import { X, Dumbbell } from 'lucide-react'
import { ModalShell } from '@/modules/students/StudentProfile/shared/components/ModalShell'
import { RoutineDayCard } from './RoutineDayCard'
import { mapDuracionBackToFront } from '@/services/mapper'
import type { AiRoutine } from '@/modules/students/aiRoutineTypes'
import { useIsMobile } from '@/shared/components/ui/use-mobile'

interface RoutineDetailModalProps {
  isOpen: boolean
  assessment: any
  routine: AiRoutine | null
  viewRoutineDay: string | null
  setViewRoutineDay: (day: string | null) => void
  onClose: () => void
}

const LEVEL_COLORS: Record<string, { color: string; bg: string }> = {
  Principiante: { color: '#1A8A3F', bg: 'rgba(48,209,88,0.12)' },
  Intermedio: { color: '#1270B7', bg: 'rgba(18,112,183,0.12)' },
  Avanzado: { color: '#7C3AED', bg: 'rgba(124,58,237,0.12)' },
}

const VIEW_GRID = '32px minmax(0, 1fr) 72px 92px 96px'

function capitalize(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : ''
}

export function RoutineDetailModal({ isOpen, assessment, routine, viewRoutineDay, setViewRoutineDay, onClose }: RoutineDetailModalProps) {
  const isMobile = useIsMobile()
  const level = routine ? capitalize(routine.level) : ''
  const levelStyle = LEVEL_COLORS[level] ?? LEVEL_COLORS.Intermedio
  const viewDays = routine && routine.rows.length ? [...new Set(routine.rows.map(r => r.dia))] : []
  const activeDay = viewRoutineDay && viewDays.includes(viewRoutineDay) ? viewRoutineDay : (viewDays[0] ?? null)
  const selDayRows = routine && activeDay ? routine.rows.filter(r => r.dia === activeDay) : []

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
      <div className="flex items-center justify-between mb-5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(48,209,88,0.12)' }}>
            <Dumbbell size={20} style={{ color: '#30D158' }} />
          </div>
          <div>
            <h3 className="text-base font-bold" style={{ color: '#0D1B2A' }}>{routine?.name ?? assessment?.routine?.nombre ?? 'Sin rutina'}</h3>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.4)' }}>{assessment?.date ?? ''} · Asociada a la valoración</p>
          </div>
        </div>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onClose}
          className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.04)' }}>
          <X size={16} style={{ color: 'rgba(0,0,0,0.4)' }} />
        </motion.button>
      </div>

      {routine && routine.rows.length > 0 ? (
        <>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="rounded-xl px-3 py-2.5" style={{ background: levelStyle.bg }}>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'rgba(0,0,0,0.35)' }}>Nivel</p>
              <p className="text-sm font-bold" style={{ color: levelStyle.color }}>{level || '—'}</p>
            </div>
            <div className="rounded-xl px-3 py-2.5" style={{ background: 'rgba(0,0,0,0.02)' }}>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'rgba(0,0,0,0.35)' }}>Duración</p>
              <p className="text-sm font-bold truncate" style={{ color: '#0D1B2A' }}>{routine.duration ? mapDuracionBackToFront(routine.duration) : '—'}</p>
            </div>
            <div className="rounded-xl px-3 py-2.5" style={{ background: 'rgba(0,0,0,0.02)' }}>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'rgba(0,0,0,0.35)' }}>Frecuencia</p>
              <p className="text-sm font-bold truncate" style={{ color: '#0D1B2A' }}>{routine.frequency || '—'}</p>
            </div>
          </div>

          {routine.description?.trim() ? (
            <div className="rounded-xl px-3 py-2.5 mb-4" style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(212,175,55,0.25)' }}>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: '#B8860B' }}>Descripción</p>
              <p className="text-xs font-medium leading-relaxed" style={{ color: '#8A6D1F' }}>{routine.description}</p>
            </div>
          ) : null}

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
            <div className="flex items-center justify-between px-1 pb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(0,0,0,0.35)' }}>
                {activeDay} · {selDayRows.length} ejercicio{selDayRows.length !== 1 ? 's' : ''}
              </span>
            </div>

            {!isMobile && (
              <div className="items-center gap-3 px-3 pb-1" style={{ display: 'grid', gridTemplateColumns: VIEW_GRID }}>
                <div />
                <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: 'rgba(0,0,0,0.3)' }}>Ejercicio</p>
                <p className="text-[9px] font-bold uppercase tracking-wider text-center" style={{ color: 'rgba(0,0,0,0.3)' }}>Series</p>
                <p className="text-[9px] font-bold uppercase tracking-wider text-center" style={{ color: 'rgba(0,0,0,0.3)' }}>Reps</p>
                <p className="text-[9px] font-bold uppercase tracking-wider text-center" style={{ color: 'rgba(0,0,0,0.3)' }}>Descanso</p>
              </div>
            )}

            {selDayRows.length === 0 ? (
              <p className="text-xs text-center py-4" style={{ color: 'rgba(0,0,0,0.4)' }}>Sin ejercicios para este día.</p>
            ) : selDayRows.map((ex, i) => (
              <motion.div
                key={ex.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`rounded-xl px-3 py-2.5 ${isMobile ? 'flex flex-col gap-1.5' : ''}`}
                style={{
                  background: i % 2 === 0 ? 'rgba(255,255,255,0.85)' : 'transparent',
                  ...(!isMobile ? { display: 'grid', gridTemplateColumns: VIEW_GRID, alignItems: 'center', gap: 12 } : {}),
                }}
              >
                {isMobile ? (
                  <>
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ background: 'rgba(48,209,88,0.15)', color: '#1A8A3F' }}>{i + 1}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: '#0D1B2A' }}>{ex.name || 'Ejercicio'}</p>
                        <p className="text-[10px] truncate" style={{ color: 'rgba(0,0,0,0.4)' }}>{ex.muscle}</p>
                      </div>
                    </div>
                    <p className="text-[11px] pl-9" style={{ color: 'rgba(0,0,0,0.45)' }}>
                      <span className="font-bold" style={{ color: '#0D1B2A' }}>{ex.sets}</span> series · <span className="font-bold" style={{ color: '#0D1B2A' }}>{ex.reps}</span> reps · <span className="font-bold" style={{ color: '#0D1B2A' }}>{ex.rest}</span>
                    </p>
                  </>
                ) : (
                  <>
                    <span className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold" style={{ background: 'rgba(48,209,88,0.15)', color: '#1A8A3F' }}>{i + 1}</span>
                    <div className="min-w-0 pr-3">
                      <p className="text-sm font-semibold truncate" style={{ color: '#0D1B2A' }}>{ex.name || 'Ejercicio'}</p>
                      <p className="text-[10px] truncate" style={{ color: 'rgba(0,0,0,0.4)' }}>{ex.muscle}</p>
                    </div>
                    <p className="text-sm font-bold text-center" style={{ color: '#0D1B2A' }}>{ex.sets}</p>
                    <p className="text-sm font-bold text-center" style={{ color: '#0D1B2A' }}>{ex.reps}</p>
                    <p className="text-sm font-bold text-center" style={{ color: '#0D1B2A' }}>{ex.rest}</p>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-8" style={{ color: 'rgba(0,0,0,0.4)' }}>
          <p className="text-sm">Sin rutina asociada a esta valoración.</p>
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