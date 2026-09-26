import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Play, X, Clock, CheckCircle2, Circle, Lock, Trophy, ChevronRight, AlertTriangle } from 'lucide-react'
import type { StudentRoutine, ExerciseRow } from '@/features/student/types/student'
import { cardStyle, FIRE, AMBER, GREEN } from '@/features/student/components/ui/fitness'
import { MUSCLE_IMG, FULL_BODY_IMG } from '../routineAssets'
import { CollapsibleCategoryPills } from './CollapsibleCategoryPills'

interface SessionPanelProps {
  routine: StudentRoutine
  selectedDay: string
  checked: number[]
  completedDays: string[]
  sessionActive: boolean
  sessionStart: number | null
  allowStart: boolean
  todayLabel: string
  onToggle: (index: number) => void
  onStart: () => void
  onCancelConfirmed: () => void
  onComplete: () => void
  onOpenExercise: (ex: ExerciseRow, index: number) => void
}

function formatElapsed(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(h)}h:${pad(m)}m:${pad(s)}s`
}

export function SessionPanel({
  routine,
  selectedDay,
  checked,
  completedDays,
  sessionActive,
  sessionStart,
  allowStart,
  todayLabel,
  onToggle,
  onStart,
  onCancelConfirmed,
  onComplete,
  onOpenExercise,
}: SessionPanelProps) {
  const [confirmingCancel, setConfirmingCancel] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!sessionActive || !sessionStart) return
    const update = () => setElapsed(Date.now() - sessionStart)
    update()
    const id = window.setInterval(update, 1000)
    return () => window.clearInterval(id)
  }, [sessionActive, sessionStart])

  const dayCompleted = completedDays.includes(selectedDay)
  const readOnly = routine.estado !== 'activa'

  const visible = useMemo(() => {
    const matches = routine.rows.map((ex, index) => ({ ex, index })).filter(({ ex }) => ex.dia === selectedDay)
    return matches.length ? matches : routine.rows.map((ex, index) => ({ ex, index }))
  }, [routine, selectedDay])

  const checkedCount = visible.filter(({ index }) => checked.includes(index)).length
  const total = visible.length
  const progressPct = total ? Math.round((checkedCount / total) * 100) : 0
  const allChecked = total > 0 && checkedCount === total
  const canComplete = sessionActive && !dayCompleted && allChecked

  const dimmed = !sessionActive && !dayCompleted

  return (
    <div className="rounded-3xl p-4 md:p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
      {/* Estado y controles de la sesión */}
      <div className="flex items-stretch gap-3">
        <div className="flex-1 min-w-0 rounded-2xl px-4 py-3 flex flex-col justify-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="uppercase italic font-black text-white" style={{ fontSize: 13 }}>Sesión de entrenamiento</p>
          {sessionActive ? (
            <div className="flex items-center gap-2 mt-1.5">
              <Clock size={16} style={{ color: GREEN }} />
              <span className="font-black" style={{ color: '#7CE495', fontSize: 18, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.06em' }}>{formatElapsed(elapsed)}</span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10.5 }}>en curso</span>
            </div>
          ) : dayCompleted ? (
            <div className="flex items-center gap-1.5 mt-1.5">
              <Trophy size={15} style={{ color: GREEN }} />
              <span style={{ color: GREEN, fontSize: 12, fontWeight: 800, whiteSpace: 'nowrap' }}>¡Sesión de {selectedDay} completada!</span>
            </div>
          ) : readOnly ? (
            <div className="flex items-center gap-1.5 mt-1.5">
              <Lock size={14} style={{ color: 'rgba(255,255,255,0.45)' }} />
              <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>Rutina finalizada · solo lectura</span>
            </div>
          ) : (
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11.5, marginTop: 3, lineHeight: 1.5 }}>
              {allowStart
                ? `Presiona «Iniciar» para comenzar y poder marcar tus ejercicios de ${selectedDay}.`
                : `Hoy toca ${todayLabel} — la sesión de ${selectedDay} se habilita solo ese día.`}
            </p>
          )}
        </div>

        {sessionActive ? (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setConfirmingCancel(true)}
            className="flex flex-col items-center justify-center gap-1.5 px-5 rounded-2xl font-black uppercase tracking-widest flex-shrink-0"
            style={{ background: FIRE + '0d', border: `1px solid ${FIRE}45`, color: '#FF6B81', fontSize: 12 }}
          >
            <X size={18} />
            Cancelar
          </motion.button>
        ) : dayCompleted ? (
          <div
            className="flex flex-col items-center justify-center gap-1.5 px-5 rounded-2xl font-black uppercase tracking-widest flex-shrink-0"
            style={{ background: 'rgba(48,209,88,0.12)', border: '1px solid rgba(48,209,88,0.35)', color: GREEN, fontSize: 11 }}
          >
            <Trophy size={18} />
            Completada
          </div>
        ) : readOnly ? (
          <div
            className="flex flex-col items-center justify-center gap-1.5 px-5 rounded-2xl font-black uppercase tracking-widest flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.5)', fontSize: 10.5 }}
          >
            <Lock size={18} />
            Finalizada
          </div>
        ) : allowStart ? (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={onStart}
            className="flex flex-col items-center justify-center gap-1.5 px-5 rounded-2xl font-black uppercase tracking-widest flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${GREEN}, #7CE495)`, color: '#052e12', fontSize: 12, boxShadow: '0 12px 34px rgba(48,209,88,0.35)' }}
          >
            <Play size={18} />
            Iniciar
          </motion.button>
        ) : (
          <button
            type="button"
            disabled
            title={`La sesión de ${selectedDay} se habilita solo ese día. Hoy toca ${todayLabel}.`}
            className="flex flex-col items-center justify-center gap-1.5 px-5 rounded-2xl font-black uppercase tracking-widest flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.45)', fontSize: 12, cursor: 'not-allowed' }}
          >
            <Lock size={18} />
            Iniciar
          </button>
        )}
      </div>

      {/* Progreso de ejercicios marcados */}
      <div className="rounded-2xl p-4 flex items-center gap-4" style={cardStyle}>
        <div className="flex-1">
          <div className="flex justify-between mb-2" style={{ fontSize: 11 }}>
            <span style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>Ejercicios marcados · {selectedDay}</span>
            <span style={{ color: GREEN, fontWeight: 800 }}>{checkedCount}/{total}</span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <motion.div animate={{ width: `${progressPct}%` }} className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${GREEN}, #7CE495)` }} />
          </div>
        </div>
        {dayCompleted && (
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl" style={{ background: 'rgba(48,209,88,0.12)', border: '1px solid rgba(48,209,88,0.3)' }}>
            <Trophy size={15} style={{ color: GREEN }} />
            <span style={{ color: GREEN, fontSize: 11, fontWeight: 800, whiteSpace: 'nowrap' }}>¡Completada!</span>
          </div>
        )}
      </div>

      {/* Ejercicios del día seleccionado */}
      {visible.map(({ ex, index }) => {
        const isChecked = checked.includes(index)
        const exerciseKey = `${selectedDay}-${ex.name}-${index}`
        return (
          <motion.div
            key={exerciseKey}
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div
              className="rounded-2xl p-4 flex items-center gap-3.5 cursor-pointer transition-all"
              style={{
                ...cardStyle,
                opacity: dimmed ? 0.55 : 1,
                borderColor: isChecked ? 'rgba(48,209,88,0.35)' : dimmed ? 'rgba(255,255,255,0.05)' : undefined,
                background: isChecked ? 'linear-gradient(160deg, rgba(48,209,88,0.07), rgba(255,255,255,0.015))' : cardStyle.background,
              }}
              onClick={() => onOpenExercise(ex, index)}
            >
              {sessionActive ? (
                <button
                  onClick={e => { e.stopPropagation(); onToggle(index) }}
                  className="flex-shrink-0"
                  aria-label={isChecked ? 'Desmarcar ejercicio' : 'Marcar ejercicio'}
                >
                  <motion.div whileTap={{ scale: 0.82 }} animate={{ scale: isChecked ? [1, 1.25, 1] : 1 }}>
                    {isChecked
                      ? <CheckCircle2 size={30} style={{ color: GREEN }} strokeWidth={2.2} />
                      : <Circle size={30} style={{ color: 'rgba(255,255,255,0.22)' }} strokeWidth={2.2} />}
                  </motion.div>
                </button>
              ) : dayCompleted ? (
                <div className="flex-shrink-0">
                  <CheckCircle2 size={30} style={{ color: GREEN }} strokeWidth={2.2} />
                </div>
              ) : (
                <div className="flex-shrink-0" aria-label="Bloqueado hasta iniciar sesión">
                  <Lock size={26} style={{ color: 'rgba(255,255,255,0.35)' }} className="mx-2 my-0.5" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="font-bold text-white truncate" style={{ fontSize: 17, textDecoration: isChecked ? 'line-through' : 'none', opacity: isChecked ? 0.65 : 1 }}>
                  {ex.name}
                </p>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {[
                    { l: 'Series', v: ex.sets, c: FIRE },
                    { l: 'Reps', v: ex.reps, c: AMBER },
                    { l: 'Descanso', v: ex.rest, c: GREEN },
                  ].map((s, k) => (
                    <div key={k} className="rounded-lg px-3 py-1.5 text-center" style={{ background: s.c + '1a', border: `1px solid ${s.c}40` }}>
                      <p style={{ color: s.c === GREEN ? '#7CE495' : s.c, fontSize: 13, fontWeight: 800 }}>{s.v}</p>
                      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.l}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2.5 flex-wrap mt-2">
                  <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12.5 }}>Categoría/s:</span>
                  <CollapsibleCategoryPills groups={ex.groups?.length ? ex.groups : [ex.muscle]} />
                </div>
              </div>

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

      {/* Completar sesión */}
      <motion.button
        whileHover={canComplete ? { scale: 1.01 } : {}}
        whileTap={canComplete ? { scale: 0.98 } : {}}
        onClick={onComplete}
        disabled={!canComplete}
        className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-black uppercase tracking-widest"
        style={{
          background: dayCompleted
            ? 'rgba(48,209,88,0.14)'
            : canComplete
              ? `linear-gradient(135deg, ${GREEN}, #7CE495)`
              : 'rgba(255,255,255,0.05)',
          border: dayCompleted
            ? '1px solid rgba(48,209,88,0.4)'
            : canComplete
              ? 'none'
              : '1px solid rgba(255,255,255,0.09)',
          color: dayCompleted ? GREEN : canComplete ? '#052e12' : 'rgba(255,255,255,0.3)',
          fontSize: 13,
          boxShadow: canComplete ? '0 14px 40px rgba(48,209,88,0.3)' : 'none',
          cursor: canComplete ? 'pointer' : 'default',
        }}
      >
        <Trophy size={18} />
        {dayCompleted ? `Sesión de ${selectedDay} completada` : readOnly ? 'Rutina finalizada · solo lectura' : 'Completar sesión'}
      </motion.button>

      {/* Modal de confirmación de cancelación */}
      <AnimatePresence>
        {confirmingCancel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end md:items-center justify-center md:p-6"
            style={{ background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(10px)' }}
            onClick={() => setConfirmingCancel(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              onClick={e => e.stopPropagation()}
              className="w-full md:max-w-sm rounded-t-3xl md:rounded-3xl overflow-hidden relative"
              style={{
                background: 'linear-gradient(170deg, #1A1420, #0A0A14)',
                border: `1px solid ${FIRE}40`,
                boxShadow: '0 40px 120px rgba(230,57,70,0.25), 0 20px 60px rgba(0,0,0,0.5)',
              }}
            >
              <div className="p-7 text-center">
                <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center" style={{ background: FIRE + '14', border: `1px solid ${FIRE}45`, boxShadow: `0 0 40px ${FIRE}30` }}>
                  <AlertTriangle size={30} style={{ color: FIRE }} />
                </div>
                <h2 className="uppercase italic font-black text-white mt-5" style={{ fontSize: 22 }}>Cancelar sesión</h2>
                <p style={{ color: 'rgba(255,255,255,0.62)', fontSize: 12.5, marginTop: 10, lineHeight: 1.65 }}>
                  ¿Seguro que deseas cancelar esta sesión? Se descartará el progreso registrado y deberás iniciar el entrenamiento desde cero.
                </p>
                <div className="grid grid-cols-2 gap-2.5 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setConfirmingCancel(false)}
                    className="py-3.5 rounded-2xl font-black uppercase tracking-widest"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.75)', fontSize: 11 }}
                  >
                    Seguir entrenando
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setConfirmingCancel(false)
                      onCancelConfirmed()
                    }}
                    className="py-3.5 rounded-2xl font-black uppercase tracking-widest"
                    style={{ background: `linear-gradient(135deg, ${FIRE}, #B0122B)`, color: '#fff', fontSize: 11, boxShadow: '0 12px 34px rgba(230,57,70,0.35)' }}
                  >
                    Cancelar sesión
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}