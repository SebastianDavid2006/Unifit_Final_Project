import { motion, AnimatePresence } from 'motion/react'
import { X, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import editGif from '@/assets/icons/animated/actions/edit.gif'
import calendarImg from '@/assets/icons/objects/calendar.webp'
import { meshInputBg } from '@/data/shared/constants'
import type { AiRoutine, RoutineRow } from '@/modules/students/aiRoutine'
import { RoutineDayCard } from './RoutineDayCard'
import { RoutineCategorySelect } from './RoutineCategorySelect'
import { RoutineExerciseSelect } from './RoutineExerciseSelect'
import { RoutineStep1Info } from './steps/RoutineStep1Info'
import { RoutineStep2Ejercicios } from './steps/RoutineStep2Ejercicios'

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

const STEPS = [
  { num: 1, title: 'Información general' },
  { num: 2, title: 'Ejercicios por día' },
] as const

function StepContent({
  routineStep,
  routineForm,
  setRoutineForm,
  routineViewMode,
  aiGeneratedRoutine,
  routineEdited,
  routineFromAssessment,
  ...rest
}: {
  routineStep: number
  routineForm: { name: string; description: string; duration: string; frequency: string; level: string }
  setRoutineForm: (f: any) => void
  routineViewMode: boolean
  aiGeneratedRoutine: AiRoutine | null
  routineEdited: boolean
  routineFromAssessment: boolean
  [key: string]: any
}) {
  switch (routineStep) {
    case 1:
      return (
        <RoutineStep1Info
          routineForm={routineForm}
          setRoutineForm={setRoutineForm}
          routineViewMode={routineViewMode}
          aiGeneratedRoutine={aiGeneratedRoutine}
          routineEdited={routineEdited}
          routineFromAssessment={routineFromAssessment}
        />
      )
    case 2:
      return (
        <RoutineStep2Ejercicios
          routineViewMode={routineViewMode}
          {...rest}
        />
      )
    default:
      return null
  }
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
              {STEPS.map(s => (
                <motion.div
                  key={s.num}
                  animate={{
                    width: s.num === routineStep ? 16 : 6,
                    background: s.num === routineStep ? 'linear-gradient(135deg, #1270B7, #7ec8e3)' : 'rgba(0,0,0,0.12)',
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

            <motion.div
              key={routineStep}
              initial={{ opacity: 0, filter: 'blur(6px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(6px)' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <StepContent
                routineStep={routineStep}
                routineForm={routineForm}
                setRoutineForm={setRoutineForm}
                routineViewMode={routineViewMode}
                aiGeneratedRoutine={aiGeneratedRoutine}
                routineEdited={routineEdited}
                routineFromAssessment={routineFromAssessment}
                routineRows={routineRows}
                setRoutineRows={setRoutineRows}
                setRoutineDays={setRoutineDays}
                selectedRoutineDay={selectedRoutineDay}
                setSelectedRoutineDay={setSelectedRoutineDay}
                routineDayPage={routineDayPage}
                setRoutineDayPage={setRoutineDayPage}
                setRoutineSnapshot={setRoutineSnapshot}
                showAddDayMenu={showAddDayMenu}
                setShowAddDayMenu={setShowAddDayMenu}
                routineDropdown={routineDropdown}
                setRoutineDropdown={setRoutineDropdown}
                WEEK_DAYS={WEEK_DAYS}
                routineDayList={routineDayList}
                routineDayTotalPages={routineDayTotalPages}
                routineDayCurrentPage={routineDayCurrentPage}
                pagedRoutineDays={pagedRoutineDays}
                routineDayPageNumbers={routineDayPageNumbers}
                defaultRoutineDay={defaultRoutineDay}
                updateRoutineRow={updateRoutineRow}
                removeRoutineRow={removeRoutineRow}
                addRoutineRow={addRoutineRow}
                addRoutineDay={addRoutineDay}
                removeRoutineDay={removeRoutineDay}
                exerciseCatalog={exerciseCatalog}
                ROUTINE_MUSCLE_TO_CAT={ROUTINE_MUSCLE_TO_CAT}
                meshInput={meshInput}
                onCreated={onCreated}
              />
            </motion.div>

            <div className="flex items-center justify-between mt-6 pt-4" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
              {routineStep > 1 ? (
                <button
                  onClick={() => setRoutineStep(s => s - 1)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold transition-all"
                  style={{ background: 'rgba(0,0,0,0.04)', color: '#0D1B2A', border: '1px solid rgba(0,0,0,0.06)' }}
                >
                  Atrás
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
                  onClick={routineStep === 1 ? () => setRoutineStep(2) : onCreated}
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