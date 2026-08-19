import { motion, AnimatePresence } from 'motion/react'
import { X, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import editGif from '@/assets/icons/animated/actions/edit.gif'
import calendarImg from '@/assets/icons/objects/calendar.webp'
import { meshInputBg } from '@/data/shared/constants'
import type { AiRoutine, RoutineRow } from '../../aiRoutine'
import { RoutineDayCard } from './RoutineDayCard'
import { RoutineCategorySelect } from './RoutineCategorySelect'
import { RoutineExerciseSelect } from './RoutineExerciseSelect'

export interface MeshInput {
  enterMesh: (el: HTMLElement) => void
  leaveMesh: (el: HTMLElement) => void
  focusMesh: (el: HTMLElement) => void
  blurMesh: (el: HTMLElement) => void
}

interface NewRoutineModalProps {
  isOpen: boolean
  routineForm: { name: string; description: string; duration: string; frequency: string; level: string }
  setRoutineForm: (f: any) => void
  routineStep: number
  setRoutineStep: (s: number) => void
  routineViewMode: boolean
  setRoutineViewMode: (v: boolean) => void
  routineFromAssessment: boolean
  setRoutineFromAssessment: (v: boolean) => void
  routineEdited: boolean
  aiGeneratedRoutine: AiRoutine | null
  setAiGeneratedRoutine: (r: AiRoutine | null) => void
  routineRows: RoutineRow[]
  setRoutineRows: (rows: RoutineRow[]) => void
  setRoutineDays: (d: string[] | ((prev: string[]) => string[])) => void
  selectedRoutineDay: string | null
  setSelectedRoutineDay: (d: string | null) => void
  routineDayPage: number
  setRoutineDayPage: (p: number) => void
  setRoutineSnapshot: (s: string) => void
  showAddDayMenu: boolean
  setShowAddDayMenu: (v: boolean) => void
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
  exerciseCatalog: { muscle: string; name: string }[]
  ROUTINE_MUSCLE_TO_CAT: Record<string, string>
  meshInput: MeshInput
  onClose: () => void
  onRequestClose: () => void
  onCreated: () => void
  onCloseFromAssessment: () => void
}

export function NewRoutineModal(props: NewRoutineModalProps) {
  const {
    isOpen,
    routineForm,
    setRoutineForm,
    routineStep,
    setRoutineStep,
    routineViewMode,
    setRoutineViewMode,
    routineFromAssessment,
    setRoutineFromAssessment,
    routineEdited,
    aiGeneratedRoutine,
    setAiGeneratedRoutine,
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
    onClose,
    onRequestClose,
    onCreated,
    onCloseFromAssessment,
  } = props
  if (!isOpen) return null
  const handleClose = () => {
    if (routineViewMode) {
      setRoutineStep(1)
      setRoutineViewMode(false)
      onClose()
    } else {
      onRequestClose()
    }
  }
  return (
          <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6"
              style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}
              onClick={handleClose}
            >
              <motion.div
                initial={{ opacity: 0, filter: 'blur(6px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(6px)' }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-4xl rounded-3xl p-6 flex flex-col max-h-[86vh]"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 24px 80px rgba(0,0,0,0.12)',
                }}
              >
                <div className="relative flex items-center justify-end mb-4">
                  <img src={editGif} alt="" className="absolute left-1/2 -translate-x-1/2 w-6 h-6 pointer-events-none" />
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleClose}
                    className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.04)' }}>
                    <X size={16} style={{ color: 'rgba(0,0,0,0.4)' }} />
                  </motion.button>
                </div>

                <div className="flex items-center justify-center gap-1.5 mb-4">
                  {[1, 2].map(s => (
                    <motion.div
                      key={s}
                      animate={{
                        width: s === routineStep ? 16 : 6,
                        background: s === routineStep ? 'linear-gradient(135deg, #1270B7, #7ec8e3)' : 'rgba(0,0,0,0.12)',
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                      className="rounded-full"
                      style={{ height: 6 }}
                    />
                  ))}
                </div>
                <span className="text-lg font-bold tracking-wide text-center block mb-4" style={{ color: '#1A1A1E' }}>
                  {routineEdited ? 'Editar Rutina' : routineFromAssessment ? 'Visualizar Rutina' : 'Nueva Rutina'}
                </span>

                {routineStep === 1 && (
                  <div className="space-y-5 px-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                    <p className="text-sm font-semibold" style={{ color: 'rgba(0,0,0,0.55)' }}>
                      {routineViewMode
                        ? 'InformaciÃƒÂ³n general de la rutina generada segÃƒÂºn la valoraciÃƒÂ³n.'
                        : aiGeneratedRoutine
                          ? 'Ajusta los parÃƒÂ¡metros generales de la rutina (prellenados segÃƒÂºn la valoraciÃƒÂ³n).'
                          : 'Configura los parÃƒÂ¡metros generales de la rutina.'}
                    </p>
                    <div>
                      <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.5)' }}>Nombre de la rutina</label>
                      <input
                        type="text"
                        readOnly={routineViewMode}
                        value={routineForm.name}
                        onChange={e => setRoutineForm(p => ({ ...p, name: e.target.value }))}
                        placeholder="Ej. Rutina de fuerza"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                        style={{
                          background: 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)',
                          color: '#1A1A1E',
                          border: '1px solid transparent',
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.5)' }}>DuraciÃƒÂ³n</label>
                        <select
                          value={routineForm.duration}
                          disabled={routineViewMode}
                          onChange={e => setRoutineForm(p => ({ ...p, duration: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all appearance-none"
                          style={{
                            background: 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)',
                            color: '#1A1A1E',
                            border: '1px solid transparent',
                          }}
                        >
                          <option value="">Seleccionar</option>
                          <option value="4 semanas">4 semanas</option>
                          <option value="8 semanas">8 semanas</option>
                          <option value="12 semanas">12 semanas</option>
                          <option value="16 semanas">16 semanas</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.5)' }}>Nivel</label>
                        <select
                          value={routineForm.level}
                          disabled={routineViewMode}
                          onChange={e => setRoutineForm(p => ({ ...p, level: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all appearance-none"
                          style={{
                            background: 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)',
                            color: '#1A1A1E',
                            border: '1px solid transparent',
                          }}
                        >
                          <option value="Principiante">Principiante</option>
                          <option value="Intermedio">Intermedio</option>
                          <option value="Avanzado">Avanzado</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {routineStep === 2 && (
                  <div className="flex flex-col min-h-0 flex-1">
                    <div className="flex items-center justify-between mb-3 px-1">
                      <p className="text-xs font-semibold" style={{ color: 'rgba(0,0,0,0.5)' }}>
                        {routineViewMode ? 'Ejercicios de cada dÃƒÂ­a de la semana' : 'Configura los ejercicios de cada dÃƒÂ­a de la semana'}
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
                                  <Plus size={13} strokeWidth={3} /> Agregar dÃƒÂ­a
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
                            La IA aÃƒÂºn no ha generado ejercicios. Vuelve al paso 1 o agrega uno manualmente.
                          </p>
                        )
                      }
                      const dayRows = routineRows.filter(r => r.dia === activeDay)
                      return (
                        <div className="rounded-2xl p-4 space-y-2.5 overflow-y-auto flex-1 min-h-0"
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
                                    <label className="text-[10px] font-bold mb-1 block" style={{ color: 'rgba(0,0,0,0.45)' }}>CategorÃƒÂ­a</label>
                                    <RoutineCategorySelect
                                      row={row}
                                      routineViewMode={routineViewMode}
                                      open={routineDropdown?.id === row.id && routineDropdown.field === 'muscle'}
                                      onToggle={() => { if (!routineViewMode) setRoutineDropdown(routineDropdown?.id === row.id && routineDropdown.field === 'muscle' ? null : { id: row.id, field: 'muscle' }) }}
                                      onSelect={(m) => {
                                        const nameInNewCat = exerciseCatalog.some(x => (ROUTINE_MUSCLE_TO_CAT[x.muscle] || x.muscle) === m && x.name === row.name)
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
                              <div className="grid grid-cols-3 gap-2 mt-2" style={{ paddingLeft: 34 }}>
                                <div>
                                  <label className="text-[10px] font-bold mb-1 block" style={{ color: 'rgba(0,0,0,0.45)' }}>Series</label>
                                  <input
                                    value={row.sets}
                                    readOnly={routineViewMode}
                                    onChange={e => updateRoutineRow(row.id, { sets: e.target.value })}
                                    placeholder="Series"
                                    onMouseEnter={e => meshInput.enterMesh(e.currentTarget)}
                                    onMouseLeave={e => meshInput.leaveMesh(e.currentTarget)}
                                    onFocus={e => meshInput.focusMesh(e.currentTarget)}
                                    onBlur={e => meshInput.blurMesh(e.currentTarget)}
                                    className="w-full px-2 py-1.5 rounded-lg text-[11px] font-medium text-center outline-none"
                                    style={{ background: meshInputBg, border: '1px solid transparent', color: '#0D1B2A' }}
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold mb-1 block" style={{ color: 'rgba(0,0,0,0.45)' }}>Reps</label>
                                  <div className="flex items-center gap-1">
                                    <input
                                      value={(row.reps.split('-')[0] ?? '').trim()}
                                      readOnly={routineViewMode}
                                      onChange={e => updateRoutineRow(row.id, { reps: `${e.target.value}-${(row.reps.split('-')[1] ?? '').trim()}` })}
                                      placeholder="MÃƒÂ­n"
                                      onMouseEnter={e => meshInput.enterMesh(e.currentTarget)}
                                      onMouseLeave={e => meshInput.leaveMesh(e.currentTarget)}
                                      onFocus={e => meshInput.focusMesh(e.currentTarget)}
                                      onBlur={e => meshInput.blurMesh(e.currentTarget)}
                                      className="w-full px-2 py-1.5 rounded-lg text-[11px] font-medium text-center outline-none"
                                      style={{ background: meshInputBg, border: '1px solid transparent', color: '#0D1B2A' }}
                                    />
                                    <span className="text-[11px] font-bold flex-shrink-0" style={{ color: 'rgba(0,0,0,0.35)' }}>Ã¢â‚¬â€œ</span>
                                    <input
                                      value={(row.reps.split('-')[1] ?? '').trim()}
                                      readOnly={routineViewMode}
                                      onChange={e => updateRoutineRow(row.id, { reps: `${(row.reps.split('-')[0] ?? '').trim()}-${e.target.value}` })}
                                      placeholder="MÃƒÂ¡x"
                                      onMouseEnter={e => meshInput.enterMesh(e.currentTarget)}
                                      onMouseLeave={e => meshInput.leaveMesh(e.currentTarget)}
                                      onFocus={e => meshInput.focusMesh(e.currentTarget)}
                                      onBlur={e => meshInput.blurMesh(e.currentTarget)}
                                      className="w-full px-2 py-1.5 rounded-lg text-[11px] font-medium text-center outline-none"
                                      style={{ background: meshInputBg, border: '1px solid transparent', color: '#0D1B2A' }}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold mb-1 block" style={{ color: 'rgba(0,0,0,0.45)' }}>Descanso</label>
                                  <div className="flex items-center gap-1">
                                    <input
                                      value={row.rest.replace(/[^\d]/g, '')}
                                      readOnly={routineViewMode}
                                      onChange={e => updateRoutineRow(row.id, { rest: e.target.value ? `${e.target.value} s` : '' })}
                                      placeholder="Segundos"
                                      onMouseEnter={e => meshInput.enterMesh(e.currentTarget)}
                                      onMouseLeave={e => meshInput.leaveMesh(e.currentTarget)}
                                      onFocus={e => meshInput.focusMesh(e.currentTarget)}
                                      onBlur={e => meshInput.blurMesh(e.currentTarget)}
                                      className="w-full px-2 py-1.5 rounded-lg text-[11px] font-medium text-center outline-none"
                                      style={{ background: meshInputBg, border: '1px solid transparent', color: '#0D1B2A' }}
                                    />
                                    <span className="text-[11px] font-bold flex-shrink-0" style={{ color: 'rgba(0,0,0,0.35)' }}>s</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )
                    })()}
                  </div>
                )}

                <div className="flex items-center justify-between mt-6 pt-4" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                  {routineStep > 1 ? (
                    <button
                      onClick={() => setRoutineStep(s => s - 1)}
                      className="px-5 py-2.5 rounded-xl text-xs font-semibold transition-all"
                      style={{ background: 'rgba(0,0,0,0.04)', color: '#0D1B2A', border: '1px solid rgba(0,0,0,0.06)' }}
                    >
                      AtrÃƒÂ¡s
                    </button>
                  ) : <div />}
                  {routineFromAssessment && !routineEdited && routineStep === 2 ? (
                    <button
                      onClick={onCloseFromAssessment}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
                      style={{ background: 'rgba(0,0,0,0.04)', color: '#0D1B2A', border: '1px solid rgba(0,0,0,0.06)' }}
                    >
                      Cerrar
                    </button>
                  ) : (
                    <button
                      onClick={onCreated}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
                      style={{
                        background: routineStep === 2 && routineRows.length === 0 ? 'rgba(48,209,88,0.3)' : 'linear-gradient(135deg, #30D158, #1A8A3F)',
                        color: '#FFFFFF',
                      }}
                      disabled={(routineStep === 2 && routineRows.length === 0)}
                    >
                      {routineStep === 2 ? 'Crear Rutina' : 'Siguiente'}
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
  )
}