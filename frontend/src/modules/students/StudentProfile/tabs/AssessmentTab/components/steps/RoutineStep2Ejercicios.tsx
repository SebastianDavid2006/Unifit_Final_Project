import { motion } from 'motion/react'
import { Plus, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import calendarImg from '@/assets/icons/objects/calendar.webp'
import { meshInputBg } from '@/data/shared/constants'
import type { RoutineRow, AiRoutine } from '@/modules/students/aiRoutine'
import type { FrontendExercise } from '@/services/ejercicio.service'
import { RoutineDayCard } from '../RoutineDayCard'
import { RoutineCategorySelect } from '../RoutineCategorySelect'
import { RoutineExerciseSelect } from '../RoutineExerciseSelect'

interface RoutineStep2EjerciciosProps {
  routineViewMode: boolean
  routineRows: RoutineRow[]
  setRoutineRows: (rows: RoutineRow[]) => void
  setRoutineDays: (d: string[] | ((prev: string[]) => string[])) => void
  selectedRoutineDay: string | null
  setSelectedRoutineDay: (d: string | null) => void
  routineDayPage: number
  setRoutineDayPage: (p: number | ((prev: number) => number)) => void
  setRoutineSnapshot: (s: string) => void
  showAddDayMenu: boolean
  setShowAddDayMenu: (v: boolean | ((prev: boolean) => boolean)) => void
  routineDropdown: { id: string; field: 'muscle' | 'exercise' } | null
  setRoutineDropdown: (d: { id: string; field: 'muscle' | 'exercise' } | null) => void
  WEEK_DAYS: string[]
  routineDayList: string[]
  routineDayTotalPages: number
  routineDayCurrentPage: number
  pagedRoutineDays: string[]
  routineDayPageNumbers: number[]
  defaultRoutineDay: () => string | undefined
  updateRoutineRow: (id: string, patch: Partial<RoutineRow>) => void
  removeRoutineRow: (id: string) => void
  addRoutineRow: (day?: string) => void
  addRoutineDay: (day: string) => void
  removeRoutineDay: (day: string) => void
  exerciseCatalog: FrontendExercise[]
  ROUTINE_MUSCLE_TO_CAT: Record<string, string>
  meshInput: {
    enterMesh: (el: HTMLElement) => void
    leaveMesh: (el: HTMLElement) => void
    focusMesh: (el: HTMLElement) => void
    blurMesh: (el: HTMLElement) => void
  }
  onCreated: () => void
}

const INPUT_STYLE = {
  base: { background: meshInputBg, border: '1px solid transparent', color: '#0D1B2A' },
  hover: { background: meshInputBg, border: '1px solid rgba(18,112,183,0.3)' },
  focus: { background: meshInputBg, border: '1px solid #1270B7', boxShadow: '0 0 0 2px rgba(18,112,183,0.1)' },
} as const

function ExerciseRow({
  row,
  i,
  routineViewMode,
  updateRoutineRow,
  removeRoutineRow,
  routineDropdown,
  setRoutineDropdown,
  exerciseCatalog,
  ROUTINE_MUSCLE_TO_CAT,
  meshInput,
}: {
  row: RoutineRow
  i: number
  routineViewMode: boolean
  updateRoutineRow: (id: string, patch: Partial<RoutineRow>) => void
  removeRoutineRow: (id: string) => void
  routineDropdown: { id: string; field: 'muscle' | 'exercise' } | null
  setRoutineDropdown: (d: { id: string; field: 'muscle' | 'exercise' } | null) => void
  exerciseCatalog: FrontendExercise[]
  ROUTINE_MUSCLE_TO_CAT: Record<string, string>
  meshInput: {
    enterMesh: (el: HTMLElement) => void
    leaveMesh: (el: HTMLElement) => void
    focusMesh: (el: HTMLElement) => void
    blurMesh: (el: HTMLElement) => void
  }
}) {
  return (
    <motion.div
      key={row.id}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(i * 0.04, 0.3) }}
      className="rounded-xl px-3 py-2.5"
      style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.9)' : 'transparent', border: '1px solid rgba(0,0,0,0.04)' }}
    >
      <div className="flex items-center gap-2.5">
        <span className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ background: 'rgba(18,112,183,0.12)', color: '#1270B7' }}>{i + 1}</span>
        <div className="flex-1 min-w-0 grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-bold mb-1 block" style={{ color: 'rgba(0,0,0,0.45)' }}>Categoría</label>
            <RoutineCategorySelect
              row={row}
              routineViewMode={routineViewMode}
              open={routineDropdown?.id === row.id && routineDropdown.field === 'muscle'}
              onToggle={() => { if (!routineViewMode) setRoutineDropdown(routineDropdown?.id === row.id && routineDropdown.field === 'muscle' ? null : { id: row.id, field: 'muscle' }) }}
              onSelect={(m) => {
                const nameInNewCat = exerciseCatalog.some(x => {
                  const muscle = x.muscleGroups[0] ?? ''
                  return (ROUTINE_MUSCLE_TO_CAT[muscle] || muscle) === m && x.name === row.name
                })
                updateRoutineRow(row.id, {
                  muscle: m,
                  name: nameInNewCat ? row.name : '',
                  sets: nameInNewCat ? row.sets : '3',
                  reps: nameInNewCat ? row.reps : '10-12',
                })
                setRoutineDropdown(null)
              }}
              onClose={() => setRoutineDropdown(null)}
            />
          </div>
          <div>
            <label className="text-[10px] font-bold mb-1 block" style={{ color: 'rgba(0,0,0,0.45)' }}>Ejercicio</label>
            <RoutineExerciseSelect
              row={row}
              routineViewMode={routineViewMode}
              open={routineDropdown?.id === row.id && routineDropdown.field === 'exercise'}
              exerciseCatalog={exerciseCatalog}
              onToggle={() => { if (!routineViewMode) setRoutineDropdown(routineDropdown?.id === row.id && routineDropdown.field === 'exercise' ? null : { id: row.id, field: 'exercise' }) }}
              onSelect={(name, muscle, sets, reps) => {
                updateRoutineRow(row.id, { name, muscle, sets, reps })
                setRoutineDropdown(null)
              }}
              onClose={() => setRoutineDropdown(null)}
            />
          </div>
        </div>
        {!routineViewMode && (
          <motion.button
            whileHover={{ scale: 1.15, background: 'rgba(244,56,67,0.1)' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => removeRoutineRow(row.id)}
            className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer flex-shrink-0 mt-4"
            style={{ background: 'rgba(0,0,0,0.04)' }}
          >
            <Trash2 size={13} style={{ color: 'rgba(244,56,67,0.8)' }} />
          </motion.button>
        )}
      </div>
      <div className="flex items-center justify-center gap-10 mt-2" style={{ paddingLeft: 34 }}>
        <div className="flex flex-col items-start" style={{ minWidth: 48 }}>
          <span className="text-[9px] font-bold mb-0.5" style={{ color: 'rgba(0,0,0,0.35)' }}>Series</span>
          <input
            value={row.sets}
            readOnly={routineViewMode}
            onChange={e => updateRoutineRow(row.id, { sets: e.target.value })}
            placeholder="3"
            onMouseEnter={e => meshInput.enterMesh(e.currentTarget)}
            onMouseLeave={e => meshInput.leaveMesh(e.currentTarget)}
            onFocus={e => meshInput.focusMesh(e.currentTarget)}
            onBlur={e => meshInput.blurMesh(e.currentTarget)}
            className="w-30 px-1.5 py-1.5 rounded-lg text-[11px] font-medium text-center outline-none"
            style={INPUT_STYLE.base}
          />
        </div>
        <div className="flex-none">
          <span className="text-[9px] font-bold mb-0.5 block" style={{ color: 'rgba(0,0,0,0.35)' }}>Reps</span>
          <div className="flex items-center gap-1">
            <span className="text-[9px] font-bold flex-shrink-0" style={{ color: 'rgba(0,0,0,0.35)' }}>min:</span>
            <input
              value={(row.reps.split('-')[0] ?? '').trim()}
              readOnly={routineViewMode}
              onChange={e => updateRoutineRow(row.id, { reps: `${e.target.value}-${(row.reps.split('-')[1] ?? '').trim()}` })}
              onMouseEnter={e => meshInput.enterMesh(e.currentTarget)}
              onMouseLeave={e => meshInput.leaveMesh(e.currentTarget)}
              onFocus={e => meshInput.focusMesh(e.currentTarget)}
              onBlur={e => meshInput.blurMesh(e.currentTarget)}
              className="w-18 px-1.5 py-1.5 rounded-lg text-[11px] font-medium text-center outline-none"
              style={INPUT_STYLE.base}
            />
            <span className="text-[9px] font-bold flex-shrink-0" style={{ color: 'rgba(0,0,0,0.35)' }}>max:</span>
            <input
              value={(row.reps.split('-')[1] ?? '').trim()}
              readOnly={routineViewMode}
              onChange={e => updateRoutineRow(row.id, { reps: `${(row.reps.split('-')[0] ?? '').trim()}-${e.target.value}` })}
              onMouseEnter={e => meshInput.enterMesh(e.currentTarget)}
              onMouseLeave={e => meshInput.leaveMesh(e.currentTarget)}
              onFocus={e => meshInput.focusMesh(e.currentTarget)}
              onBlur={e => meshInput.blurMesh(e.currentTarget)}
              className="w-18 px-1.5 py-1.5 rounded-lg text-[11px] font-medium text-center outline-none"
              style={INPUT_STYLE.base}
            />
          </div>
        </div>
        <div className="flex flex-col items-start" style={{ minWidth: 104 }}>
          <span className="text-[9px] font-bold mb-0.5" style={{ color: 'rgba(0,0,0,0.35)' }}>Descanso</span>
          <div className="flex items-center gap-1">
            <input
              value={row.rest.replace(/[^\d]/g, '')}
              readOnly={routineViewMode}
              onChange={e => updateRoutineRow(row.id, { rest: e.target.value ? `${e.target.value} seg` : '' })}
              placeholder="0"
              onMouseEnter={e => meshInput.enterMesh(e.currentTarget)}
              onMouseLeave={e => meshInput.leaveMesh(e.currentTarget)}
              onFocus={e => meshInput.focusMesh(e.currentTarget)}
              onBlur={e => meshInput.blurMesh(e.currentTarget)}
              className="w-30 px-1.5 py-1.5 rounded-lg text-[11px] font-medium text-center outline-none"
              style={INPUT_STYLE.base}
            />
            <span className="text-[10px] font-bold flex-shrink-0" style={{ color: 'rgba(0,0,0,0.35)' }}>seg</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function RoutineStep2Ejercicios({
  routineViewMode,
  routineRows,
  setRoutineRows,
  setRoutineDays,
  selectedRoutineDay,
  setSelectedRoutineDay,
  routineDayPage,
  setRoutineDayPage,
  setRoutineSnapshot,
  showAddDayMenu,
  setShowAddDayMenu,
  routineDropdown,
  setRoutineDropdown,
  WEEK_DAYS,
  routineDayList,
  routineDayTotalPages,
  routineDayCurrentPage,
  pagedRoutineDays,
  routineDayPageNumbers,
  defaultRoutineDay,
  updateRoutineRow,
  removeRoutineRow,
  addRoutineRow,
  addRoutineDay,
  removeRoutineDay,
  exerciseCatalog,
  ROUTINE_MUSCLE_TO_CAT,
  meshInput,
  onCreated,
}: RoutineStep2EjerciciosProps) {
  return (
    <div className="flex flex-col min-h-0 flex-1">
      <div className="flex items-center justify-between mb-3 px-1">
        <p className="text-xs font-semibold" style={{ color: 'rgba(0,0,0,0.5)' }}>
          {routineViewMode ? 'Ejercicios de cada día de la semana' : 'Configura los ejercicios de cada día de la semana'}
        </p>
      </div>

      {pagedRoutineDays.length > 0 && (
        <div className="flex flex-col mb-3">
          <div className="grid gap-2 mb-3" style={{ gridTemplateColumns: `repeat(${pagedRoutineDays.length}, minmax(0, 1fr))` }}>
            {pagedRoutineDays.map(day => (
              <RoutineDayCard
                key={day}
                day={day}
                selected={day === (selectedRoutineDay ?? defaultRoutineDay())}
                done={routineRows.some(r => r.dia === day)}
                onClick={() => setSelectedRoutineDay(day)}
                onRemove={routineDayList.length > 1 ? () => removeRoutineDay(day) : undefined}
              />
            ))}
          </div>

          <div className="relative mb-3">
            {(() => {
              const addable = WEEK_DAYS.filter(d => !routineDayList.includes(d))
              return addable.length ? (
                <>
                  <button
                    onClick={() => setShowAddDayMenu(v => !v)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer transition-all"
                    style={{ border: '1px dashed rgba(18,112,183,0.45)', color: '#1270B7', background: 'rgba(18,112,183,0.05)' }}
                  >
                    <Plus size={13} strokeWidth={3} /> Agregar día
                  </button>
                  {showAddDayMenu && (
                    <div
                      className="absolute top-full left-0 z-50 mt-1 rounded-xl min-w-40 overflow-hidden"
                      style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}
                    >
                      {addable.map(d => (
                        <button
                          key={d}
                          onClick={() => addRoutineDay(d)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-medium text-left transition-colors"
                          style={{ color: '#0D1B2A', borderBottom: '1px solid rgba(0,0,0,0.03)' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                        >
                          <img src={calendarImg} alt="" className="w-4 h-4" />
                          <span className="flex-1">{d}</span>
                          <Plus size={11} style={{ color: '#1270B7' }} />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : null
            })()}
          </div>

          {routineDayTotalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 mb-3">
              <motion.button
                whileHover={routineDayCurrentPage > 1 ? { scale: 1.1 } : {}}
                whileTap={routineDayCurrentPage > 1 ? { scale: 0.92 } : {}}
                onClick={() => setRoutineDayPage(p => Math.max(1, p - 1))}
                disabled={routineDayCurrentPage === 1}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
                style={{
                  background: routineDayCurrentPage === 1 ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.06)',
                  color: routineDayCurrentPage === 1 ? 'rgba(0,0,0,0.2)' : '#111111',
                  cursor: routineDayCurrentPage === 1 ? 'default' : 'pointer',
                }}
              >
                <ChevronLeft size={13} />
              </motion.button>

              {routineDayPageNumbers.map(p => (
                <motion.button
                  key={p}
                  whileHover={p !== routineDayCurrentPage ? { scale: 1.1 } : {}}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setRoutineDayPage(p)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold transition-all"
                  style={{
                    background: p === routineDayCurrentPage ? '#111111' : 'rgba(0,0,0,0.05)',
                    color: p === routineDayCurrentPage ? '#FFFFFF' : '#111111',
                    boxShadow: p === routineDayCurrentPage ? '0 4px 12px rgba(0,0,0,0.25)' : 'none',
                    cursor: 'pointer',
                  }}
                >
                  {p}
                </motion.button>
              ))}

              <motion.button
                whileHover={routineDayCurrentPage < routineDayTotalPages ? { scale: 1.1 } : {}}
                whileTap={routineDayCurrentPage < routineDayTotalPages ? { scale: 0.92 } : {}}
                onClick={() => setRoutineDayPage(p => Math.min(routineDayTotalPages, p + 1))}
                disabled={routineDayCurrentPage === routineDayTotalPages}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
                style={{
                  background: routineDayCurrentPage === routineDayTotalPages ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.06)',
                  color: routineDayCurrentPage === routineDayTotalPages ? 'rgba(0,0,0,0.2)' : '#111111',
                  cursor: routineDayCurrentPage === routineDayTotalPages ? 'default' : 'pointer',
                }}
              >
                <ChevronRight size={13} />
              </motion.button>
            </div>
          )}
        </div>
      )}

      {(() => {
        const activeDay = selectedRoutineDay && routineDayList.includes(selectedRoutineDay) ? selectedRoutineDay : defaultRoutineDay()
        if (!activeDay) {
          return (
            <p className="text-xs text-center py-8 px-4 rounded-2xl" style={{ color: 'rgba(0,0,0,0.4)', background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}>
              La IA aún no ha generado ejercicios. Vuelve al paso 1 o agrega uno manualmente.
            </p>
          )
        }
        const dayRows = routineRows.filter(r => r.dia === activeDay)
        return (
          <div className="rounded-2xl p-4 space-y-2.5 overflow-y-auto flex-1 min-h-0 w-full"
            style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)', maxHeight: 'calc(86vh - 320px)', minHeight: 200, scrollbarWidth: 'thin' }}>
            <div className="flex items-center justify-between sticky top-0 pt-0.5 pb-1" style={{ background: 'rgba(0,0,0,0.02)' }}>
              <span className="text-[10px] font-bold" style={{ color: 'rgba(0,0,0,0.35)' }}>{dayRows.length} ejercicio{dayRows.length !== 1 ? 's' : ''}</span>
              {!routineViewMode && (
                <button onClick={() => addRoutineRow(activeDay)}
                  className="flex items-center gap-1 text-[11px] font-bold transition-all hover:opacity-70 cursor-pointer"
                  style={{ color: '#1270B7' }}
                ><Plus size={13} strokeWidth={3} /> Agregar ejercicio</button>
              )}
            </div>

            {dayRows.length === 0 ? (
              <p className="text-xs text-center py-6" style={{ color: 'rgba(0,0,0,0.4)' }}>
                {routineViewMode ? 'Sin ejercicios.' : 'Sin ejercicios. Agrega uno.'}
              </p>
            ) : dayRows.map((row, i) => (
              <ExerciseRow
                row={row}
                i={i}
                routineViewMode={routineViewMode}
                updateRoutineRow={updateRoutineRow}
                removeRoutineRow={removeRoutineRow}
                routineDropdown={routineDropdown}
                setRoutineDropdown={setRoutineDropdown}
                exerciseCatalog={exerciseCatalog}
                ROUTINE_MUSCLE_TO_CAT={ROUTINE_MUSCLE_TO_CAT}
                meshInput={meshInput}
              />
            ))}
          </div>
        )
      })()}
    </div>
  )
}