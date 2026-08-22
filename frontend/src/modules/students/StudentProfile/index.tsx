import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Activity, X,
} from 'lucide-react'
import { StudentCardView } from '@/assets/models/ui/objects/student_card/StudentCardModel'
import { TelephoneView } from '@/assets/models/ui/objects/telephone/TelephoneModel'
import { CapView } from '@/assets/models/ui/objects/cap/CapModel'
import { TrophyView } from '@/assets/models/ui/objects/trophy/TrophyModel'
import { ListView } from '@/assets/models/ui/objects/list/ListModel'
import { CalendarView } from '@/assets/models/ui/objects/calendar/CalendarModel'
import { ClockView } from '@/assets/models/ui/objects/clock/ClockModel'
import { ScalesOfJusticeView } from '@/assets/models/ui/objects/scales_of_justice/ScalesOfJusticeModel'
import { StethoscopeView } from '@/assets/models/ui/objects/stethoscope/StethoscopeModel'
import { KitView } from '@/assets/models/ui/objects/kit/KitModel'
import { TrashView } from '@/assets/models/ui/actions/trash/TrashModel'
import coachCongratsImg from '@/assets/illustrations/characters/coach/coach_congratulations.webp'
import coachMagicImg from '@/assets/illustrations/characters/coach/coach_magic.png'
import assessmentSceneImg from '@/assets/scenes/physical_assessment.webp'
import routineSceneImg from '@/assets/scenes/physical_routine.webp'
import { AiRoutine, RoutineRow } from '../aiRoutine'
import { assessmentItems, cardStyle, emptyValuationForm, monthNames, numOnly } from '../StudentProfileData'
import type { Student, ValuationForm } from '../StudentProfileData'
import { OverviewTab } from '@/modules/students/StudentProfile/tabs/OverviewTab'
import { ProgressTab } from '@/modules/students/StudentProfile/tabs/ProgressTab'
import { AssessmentTab } from '@/modules/students/StudentProfile/tabs/AssessmentTab'
import { IdentityAccessCard } from '@/modules/students/components/IdentityAccessCard'
import { useCalendarNavigation } from '@/shared/hooks/useCalendarNavigation'
import { useMeshInput } from '@/shared/hooks/useMeshInput'
import { useValuationManager } from '@/modules/students/shared/hooks/useValuationManager'
import { useRoutineManager } from '@/modules/students/shared/hooks/useRoutineManager'
import { SignatureModal } from '@/modules/students/StudentProfile/shared/components/SignatureModal'
import { CancelConfirmModal } from '@/modules/students/StudentProfile/shared/components/CancelConfirmModal'
import { StudentInfoModal } from '@/modules/students/StudentProfile/tabs/OverviewTab/components/StudentInfoModal'
import { ValuationDetailModal } from '@/modules/students/StudentProfile/tabs/AssessmentTab/components/ValuationDetailModal'
import { AIGenerationModal } from '@/modules/students/StudentProfile/tabs/AssessmentTab/components/AIGenerationModal'
import { RoutineDetailModal } from '@/modules/students/StudentProfile/tabs/AssessmentTab/components/RoutineDetailModal'
import { NewValuationModal } from '@/modules/students/StudentProfile/tabs/AssessmentTab/components/NewValuationModal'
import { NewRoutineModal } from '@/modules/students/StudentProfile/tabs/AssessmentTab/components/NewRoutineModal'

export { TABS } from '../StudentProfileData'
export function StudentProfile({ student, tab = 'overview', onTabChange, canCreateValuation = true }: { student: Student; tab?: string; onTabChange?: (t: string) => void; canCreateValuation?: boolean }) {
  const [editable, setEditable] = useState<Student>(student)
  useEffect(() => setEditable(student), [student])
  const [localTab, setLocalTab] = useState('overview')
  const [modalOpen, setModalOpen] = useState(false)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [vistaCalendario, setVistaCalendario] = useState<'semana' | 'mes' | 'año'>('mes')
  const [hoveredCol, setHoveredCol] = useState<number | null>(null)
  const [hoveredCell, setHoveredCell] = useState<{w: number; d: number} | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 4))
  const [signatureModalOpen, setSignatureModalOpen] = useState(false)
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null)
  const [showAssessmentOptions, setShowAssessmentOptions] = useState(false)
  const [showValuationModal, setShowValuationModal] = useState(false)
  const [showRoutineViewModal, setShowRoutineViewModal] = useState(false)
  const [showNewRoutineModal, setShowNewRoutineModal] = useState(false)
  const [routineSuccess, setRoutineSuccess] = useState(false)
  const [routineStep, setRoutineStep] = useState(1)
  const [routineForm, setRoutineForm] = useState({
    name: '', description: '', duration: '', frequency: '', level: 'Intermedio',
  })
  const [currentRoutine, setCurrentRoutine] = useState<AiRoutine | null>(null)
  const [routineRows, setRoutineRows] = useState<RoutineRow[]>([])
  const [selectedRoutineDay, setSelectedRoutineDay] = useState<string | null>(null)
  const [viewRoutineDay, setViewRoutineDay] = useState<string | null>(null)
  const [routineDropdown, setRoutineDropdown] = useState<{ id: string; field: 'muscle' | 'exercise' } | null>(null)
  const [routineDayPage, setRoutineDayPage] = useState(1)
  const [assessmentPage, setAssessmentPage] = useState(1)
  const [aiGenerating, setAiGenerating] = useState(false)
  const [aiGenStep, setAiGenStep] = useState(0)
  const [confirmCancel, setConfirmCancel] = useState<'valuation' | 'routine' | 'ai' | null>(null)
  const aiIntervalRef = useRef<number | null>(null)
  const [aiGeneratedRoutine, setAiGeneratedRoutine] = useState<AiRoutine | null>(null)
  const [showNewValuationModal, setShowNewValuationModal] = useState(false)
  const [valuationViewMode, setValuationViewMode] = useState(false)
  const [routineViewMode, setRoutineViewMode] = useState(false)
  const [routineFromAssessment, setRoutineFromAssessment] = useState(false)
  const [routineSnapshot, setRoutineSnapshot] = useState('')
  const [routineFromAI, setRoutineFromAI] = useState(false)
  const [routineDays, setRoutineDays] = useState<string[]>([])
  const [showAddDayMenu, setShowAddDayMenu] = useState(false)
  const [valuationSuccess, setValuationSuccess] = useState(false)
  const [valuationStep, setValuationStep] = useState(1)
  const [lastValuationObjectives, setLastValuationObjectives] = useState(0)
  const [valuationForm, setValuationForm] = useState({
    nivelActividad: '', objetivoTarjetas: [] as string[], objetivoDetalle: '',
    peso: '', estatura: '', imc: '', grasaCorporal: '',
    masaMuscular: '', masaMagra: '', grasaVisceral: '',
    presionArterial: '', edadMetabolica: '', aguaCorporal: '', resistenciaMuscular: '',
    antecedentesSalud: [] as string[], observacionesEntrenador: '',
    diasDisponibles: [] as string[], observacionesFinales: '',
  })

  // Hooks
  const calendarNav = useCalendarNavigation({ monthNames })
  const meshInput = useMeshInput()

const RED_GRAD = 'linear-gradient(135deg, #FF6B6B, #E63946)'
  const currentTab = tab ?? localTab
  const setTab = onTabChange ?? setLocalTab
  const imc = (student.weight / ((student.height / 100) ** 2)).toFixed(1)
  const imcNum = parseFloat(imc)

  const {
    numOnly: _numOnly,
    loadAssessmentIntoForm,
    cancelAiRoutine,
    handleConfirmCancel,
    startAiRoutine,
    openRoutineFromAssessment,
  } = useValuationManager({
    student,
    valuationForm,
    setValuationForm,
    confirmCancel,
    setShowNewValuationModal,
    setValuationSuccess,
    setValuationStep,
    setValuationViewMode,
    setRoutineViewMode,
    setRoutineFromAssessment,
    setRoutineSnapshot,
    setRoutineFromAI,
    setAiGenerating,
    setAiGenStep,
    setAiGeneratedRoutine,
    setRoutineForm,
    setRoutineRows,
    setSelectedRoutineDay,
    setRoutineDayPage,
    setRoutineDays,
    setRoutineStep,
    setRoutineSuccess,
    setShowNewRoutineModal,
    setConfirmCancel,
    aiIntervalRef,
  })

  const {
    WEEK_DAYS,
    ROUTINE_CATEGORIES,
    ROUTINE_MUSCLE_TO_CAT,
    exerciseCatalog,
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
  } = useRoutineManager({
    routineForm,
    setRoutineForm,
    routineRows,
    setRoutineRows,
    routineDays,
    setRoutineDays,
    selectedRoutineDay,
    setSelectedRoutineDay,
    viewRoutineDay,
    setViewRoutineDay,
    routineDropdown,
    setRoutineDropdown,
    routineDayPage,
    setRoutineDayPage,
    showRoutineViewModal,
    setShowRoutineViewModal,
    showNewRoutineModal,
    setShowNewRoutineModal,
    routineSuccess,
    setRoutineSuccess,
    routineStep,
    setRoutineStep,
    routineViewMode,
    setRoutineViewMode,
    routineFromAssessment,
    routineSnapshot,
    setRoutineSnapshot,
    routineFromAI,
    showAddDayMenu,
    setShowAddDayMenu,
    valuationDiasDisponibles: valuationForm.diasDisponibles,
  })

  const ASSESSMENT_PAGE_SIZE = 6
  const assessmentTotalPages = Math.max(1, Math.ceil(assessmentItems.length / ASSESSMENT_PAGE_SIZE))
  const assessmentCurrentPage = Math.min(assessmentPage, assessmentTotalPages)
  const pagedAssessments = assessmentItems.slice((assessmentCurrentPage - 1) * ASSESSMENT_PAGE_SIZE, assessmentCurrentPage * ASSESSMENT_PAGE_SIZE)
  const assessmentPageNumbers = Array.from({ length: assessmentTotalPages }, (_, i) => i + 1)
  const routineEdited = routineSnapshot !== '' && JSON.stringify({ form: routineForm, rows: routineRows }) !== routineSnapshot

  return (
    <>
      <style>{`@keyframes shimmer { 0% { background-position: 200% center } 100% { background-position: -200% center } }`}</style>
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Background orbs */}
      <div className="floating-sphere" style={{
        width: 280, height: 280,
        background: 'radial-gradient(circle, rgba(230,57,70,0.04), transparent)',
        top: '-60px', right: '-40px',
      }} />

      <div className="relative z-10 flex-1 min-h-0 p-8 overflow-y-auto">

          <AnimatePresence mode="wait">
            <motion.div key={currentTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="h-full">
              <div className="text-left h-full">

              {currentTab === 'overview' && (
                <OverviewTab student={editable} imc={imc} onShowInfo={() => setShowInfoModal(true)} onUpdate={patch => setEditable(prev => ({ ...prev, ...patch }))} />
              )}
              {currentTab === 'progress' && (
                <ProgressTab
                  vistaCalendario={vistaCalendario}
                  setVistaCalendario={setVistaCalendario}
                  hoveredCol={hoveredCol}
                  setHoveredCol={setHoveredCol}
                  hoveredCell={hoveredCell}
                  setHoveredCell={setHoveredCell}
                  currentDate={currentDate}
                  setCurrentDate={setCurrentDate}
                  prevPeriod={calendarNav.prevPeriod}
                  nextPeriod={calendarNav.nextPeriod}
                  formatWeekRange={calendarNav.formatWeekRange}
                  monthNames={monthNames}
                  getWeekStart={calendarNav.getWeekStart}
                />
              )}
              {currentTab === 'assessment' && (
                <AssessmentTab
                  canCreateValuation={canCreateValuation}
                  pagedAssessments={pagedAssessments}
                  assessmentPage={assessmentPage}
                  setAssessmentPage={setAssessmentPage}
                  assessmentTotalPages={assessmentTotalPages}
                  assessmentCurrentPage={assessmentCurrentPage}
                  assessmentPageNumbers={assessmentPageNumbers}
                  setValuationStep={setValuationStep}
                  setValuationSuccess={setValuationSuccess}
                  setValuationViewMode={setValuationViewMode}
                  setValuationForm={setValuationForm}
                  setShowNewValuationModal={setShowNewValuationModal}
                  setSelectedAssessment={setSelectedAssessment}
                  setShowAssessmentOptions={setShowAssessmentOptions}
                />
              )}

              </div>
            </motion.div>
        </AnimatePresence>

        {/* Modal firma */}
        <SignatureModal isOpen={signatureModalOpen} onClose={() => setSignatureModalOpen(false)} />
        </div>

        {/* Modal información completa */}
        <AnimatePresence>
          {modalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6"
              style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}
              onClick={() => setModalOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl p-6"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 24px 80px rgba(0,0,0,0.12)',
                  scrollbarWidth: 'thin',
                }}
              >
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setModalOpen(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center z-10" style={{ background: 'rgba(0,0,0,0.04)' }}>
                  <X size={16} style={{ color: 'rgba(0,0,0,0.4)' }} />
                </motion.button>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      title: 'Datos personales',
                      icon: <StudentCardView />,
                      fields: [
                        { label: 'Tipo de documento', value: student.documentType },
                        { label: 'Número de documento', value: student.documentNumber },
                        { label: 'Fecha de nacimiento', value: student.birthDate },
                        { label: 'Género', value: student.gender },
                        { label: 'Número carnet', value: student.carnetId },
                      ],
                    },
                    {
                      title: 'Contacto',
                      icon: <ListView />,
                      fields: [
                        { label: 'Email', value: editable.email },
                        { label: 'Teléfono', value: student.phone },
                        { label: 'Contacto de emergencia', value: student.contactName },
                        { label: 'Tel. contacto', value: student.contactPhone },
                      ],
                    },
                    {
                      title: 'Información académica',
                      icon: <CalendarView />,
                      fields: [
                        { label: 'Programa', value: student.program },
                        { label: 'Institución', value: student.institution },
                        { label: 'Semestre', value: `${student.semestre}°` },
                        { label: 'Modalidad', value: student.modality },
                        { label: 'Jornada', value: student.jornada },
                        { label: 'Estado', value: student.graduationStatus },
                      ],
                    },
                    {
                      title: 'Salud',
                      icon: <Activity size={18} style={{ color: '#E63946' }} />,
                      fields: [
                        { label: 'EPS', value: student.eps },
                        { label: 'Grupo sanguíneo', value: student.bloodType },
                        { label: 'Peso', value: `${student.weight} kg` },
                        { label: 'Altura', value: `${student.height} cm` },
                        { label: 'IMC', value: imc },
                      ],
                    },
                  ].map(section => (
                    <div key={section.title} className="rounded-2xl p-4" style={{
                      background: 'rgba(0,0,0,0.02)',
                      border: '1px solid rgba(0,0,0,0.04)',
                    }}>
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: 'rgba(230,57,70,0.3)' }} />
                        <div className="w-7 h-7 flex-shrink-0">{section.icon}</div>
                        <p className="text-xs font-extrabold capitalize" style={{ color: '#0D1B2A' }}>{section.title}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        {section.fields.map(field => (
                          <div key={field.label} className="flex flex-col">
                            <p className="text-[10px] mb-0.5" style={{ color: 'rgba(0,0,0,0.4)' }}>{field.label}</p>
                            <p className="text-xs font-semibold" style={{ color: '#0D1B2A' }}>{field.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal nueva valoración */}
        <NewValuationModal
          isOpen={showNewValuationModal}
          valuationForm={valuationForm}
          setValuationForm={setValuationForm}
          valuationStep={valuationStep}
          setValuationStep={setValuationStep}
          valuationViewMode={valuationViewMode}
          setValuationViewMode={setValuationViewMode}
          valuationSuccess={valuationSuccess}
          setValuationSuccess={setValuationSuccess}
          aiGenerating={aiGenerating}
          startAiRoutine={startAiRoutine}
          onClose={() => {
            setShowNewValuationModal(false)
            setValuationSuccess(false)
            setValuationStep(1)
            setValuationViewMode(false)
          }}
          onRequestClose={() => setConfirmCancel('valuation')}
          onCreateManual={() => {
            setShowNewValuationModal(false)
            setValuationSuccess(false)
            setValuationStep(1)
            setValuationViewMode(false)
            setRoutineViewMode(false)
            setRoutineFromAssessment(false)
            setRoutineSnapshot('')
            setRoutineFromAI(false)
            setRoutineDays([])
            setShowAddDayMenu(false)
            setRoutineStep(1)
            setRoutineForm({ name: '', description: '', duration: '', frequency: '', level: 'Intermedio' })
            setRoutineRows([])
            setSelectedRoutineDay(null)
            setRoutineDayPage(1)
            setAiGeneratedRoutine(null)
            setShowNewRoutineModal(true)
          }}
          onSave={() => {
            setLastValuationObjectives(valuationForm.objetivoTarjetas.length)
            setValuationSuccess(true)
          }}
        />

        {/* Choice modal: Ver Valoración / Ver Rutina */}
        <AnimatePresence>
          {showAssessmentOptions && selectedAssessment && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)' }}
              onClick={() => setShowAssessmentOptions(false)}
            >
              <motion.div
                initial={{ opacity: 0, filter: 'blur(6px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(6px)' }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                onClick={e => e.stopPropagation()}
              >
                <div className="flex gap-6">
                  <motion.button
                    whileHover={{ scale: 1.04, y: -6 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setShowAssessmentOptions(false)
                      loadAssessmentIntoForm(selectedAssessment)
                      setValuationStep(1)
                      setValuationSuccess(false)
                      setValuationViewMode(true)
                      setShowNewValuationModal(true)
                    }}
                    className="relative w-80 h-96 rounded-3xl flex flex-col items-center justify-end p-8 overflow-hidden cursor-pointer"
                    style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
                  >
                    <img src={assessmentSceneImg} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none scale-110 translate-y-4" />
                    <div className="absolute inset-0 pointer-events-none" style={{
                      background: `linear-gradient(to top, ${selectedAssessment.color} 0%, ${selectedAssessment.color}cc 35%, transparent 72%)`,
                    }} />
                    <div className="relative z-10 flex flex-col items-center">
                      <span className="text-xl font-extrabold text-white tracking-tight">Ver Valoración</span>
                      <span className="text-[11px] text-white/60 mt-1">Detalles de la evaluación</span>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.04, y: -6 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { setShowAssessmentOptions(false); openRoutineFromAssessment(selectedAssessment) }}
                    className="relative w-80 h-96 rounded-3xl flex flex-col items-center justify-end p-8 overflow-hidden cursor-pointer"
                    style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
                  >
                    <img src={routineSceneImg} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none scale-110 translate-y-4" />
                    <div className="absolute inset-0 pointer-events-none" style={{
                      background: 'linear-gradient(to top, rgba(26,138,63,0.95) 0%, rgba(48,209,88,0.55) 35%, transparent 72%)',
                    }} />
                    <div className="relative z-10 flex flex-col items-center">
                      <span className="text-xl font-extrabold text-white tracking-tight">Ver Rutina</span>
                      <span className="text-[11px] text-white/60 mt-1">Ejercicios y series asignados</span>
                    </div>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal detalle de valoración */}
        <ValuationDetailModal
          isOpen={!!(showValuationModal && selectedAssessment)}
          assessment={selectedAssessment}
          onClose={() => setShowValuationModal(false)}
        />

        {/* Modal detalle de rutina */}
        <RoutineDetailModal
          isOpen={!!(showRoutineViewModal && selectedAssessment)}
          assessment={selectedAssessment}
          routine={currentRoutine}
          viewRoutineDay={viewRoutineDay}
          setViewRoutineDay={setViewRoutineDay}
          onClose={() => setShowRoutineViewModal(false)}
        />

        {/* Modal nueva rutina */}
        <NewRoutineModal
          isOpen={showNewRoutineModal}
          routineForm={routineForm}
          setRoutineForm={setRoutineForm}
          routineStep={routineStep}
          setRoutineStep={setRoutineStep}
          routineViewMode={routineViewMode}
          setRoutineViewMode={setRoutineViewMode}
          routineFromAssessment={routineFromAssessment}
          setRoutineFromAssessment={setRoutineFromAssessment}
          routineEdited={routineEdited}
          aiGeneratedRoutine={aiGeneratedRoutine}
          setAiGeneratedRoutine={setAiGeneratedRoutine}
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
          onClose={() => setShowNewRoutineModal(false)}
          onRequestClose={() => setConfirmCancel('routine')}
          onCreated={() => {
            setShowNewRoutineModal(false)
            setRoutineFromAssessment(false)
            setRoutineSnapshot('')
            setRoutineDays([])
            setShowAddDayMenu(false)
            setRoutineStep(1)
            setRoutineForm({ name: '', description: '', duration: '', frequency: '', level: 'Intermedio' })
            setRoutineRows([])
            setSelectedRoutineDay(null)
            setRoutineDayPage(1)
            setAiGeneratedRoutine(null)
            setRoutineSuccess(true)
          }}
          onCloseFromAssessment={() => { setShowNewRoutineModal(false); setRoutineFromAssessment(false); setRoutineSnapshot(''); setRoutineDays([]); setShowAddDayMenu(false) }}
        />

        {/* Modal éxito rutina generada */}
        <AnimatePresence>
          {routineSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[90] flex items-center justify-center p-6"
              style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}
              onClick={() => setRoutineSuccess(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 8 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-2xl rounded-3xl flex flex-col relative"
                style={{
                  background: '#FFFFFF',
                  border: `1px solid ${routineFromAI ? 'rgba(191,90,242,0.15)' : 'rgba(34,197,94,0.15)'}`,
                  boxShadow: `0 25px 60px ${routineFromAI ? 'rgba(124,58,237,0.18)' : 'rgba(34,197,94,0.18)'}`,
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center pt-8 px-6"
                >
                  <div className="relative flex items-center justify-center -mt-28 mb-6">
                    {[...Array(24)].map((_, i) => {
                      const angle = (i / 24) * 360
                      const rad = (angle * Math.PI) / 180
                      return (
                        <motion.span
                          key={i}
                          className="absolute pointer-events-none text-lg select-none"
                          style={{ color: routineFromAI ? '#C084FC' : '#4ADE80' }}
                          animate={{
                            x: [0, Math.cos(rad) * (110 + (i % 6) * 20)],
                            y: [0, Math.sin(rad) * (110 + (i % 6) * 20)],
                            opacity: [0, 1, 0],
                            scale: [0, 1.4, 0],
                          }}
                          transition={{
                            duration: 2.5 + (i % 4) * 0.3,
                            repeat: Infinity,
                            delay: i * 0.07,
                            ease: 'easeOut',
                          }}
                        >
                          ✦
                        </motion.span>
                      )
                    })}
                    <div className="relative flex items-center justify-center">
                      <motion.img
                        src={routineFromAI ? coachMagicImg : coachCongratsImg}
                        alt="rutina generada"
                        className="w-96 h-auto object-contain relative z-10"
                        style={{ filter: `drop-shadow(0 0 30px ${routineFromAI ? 'rgba(124,58,237,0.2)' : 'rgba(34,197,94,0.15)'})` }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                      />
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-24 pointer-events-none z-20" style={{
                        background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, transparent 60%)',
                      }} />
                    </div>
                  </div>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="text-lg font-bold text-center"
                    style={{ color: '#1A1A1E' }}
                  >
                    ¡Se generó la rutina!
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.4 }}
                    className="text-sm font-medium mt-1 text-center"
                    style={{ color: 'rgba(0,0,0,0.35)' }}
                  >
                    La rutina fue creada y asignada correctamente al plan de {student.firstName}.
                  </motion.p>
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                    whileHover={{ scale: 1.05, boxShadow: `0 10px 28px ${routineFromAI ? 'rgba(124,58,237,0.4)' : 'rgba(48,209,88,0.4)'}`, transition: { duration: 0.15 } }}
                    whileTap={{ scale: 0.93, boxShadow: `0 2px 8px ${routineFromAI ? 'rgba(124,58,237,0.2)' : 'rgba(48,209,88,0.2)'}`, transition: { duration: 0.1 } }}
                    onClick={() => setRoutineSuccess(false)}
                    className="mt-7 mb-10 px-10 py-3 rounded-2xl text-xs font-bold text-white cursor-pointer shadow-lg"
                    style={{
                      background: routineFromAI ? 'linear-gradient(135deg, #BF5AF2, #F472B6)' : 'linear-gradient(135deg, #30D158, #00C7BE)',
                      boxShadow: `0 10px 26px ${routineFromAI ? 'rgba(191,90,242,0.35)' : 'rgba(48,209,88,0.35)'}`,
                    }}
                  >
                    Cerrar
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal generando rutina con IA */}
        <AIGenerationModal
          isOpen={aiGenerating}
          studentName={student.firstName}
          onCancel={() => setConfirmCancel('ai')}
          aiGenStep={aiGenStep}
        />

        {/* Confirmación cancelar proceso */}
        <CancelConfirmModal
          isOpen={!!confirmCancel}
          type={confirmCancel ?? 'valuation'}
          onConfirm={handleConfirmCancel}
          onCancel={() => setConfirmCancel(null)}
        />

        {/* Info completa (modal por categorías) */}
        <StudentInfoModal
          isOpen={showInfoModal}
          student={student}
          editable={editable}
          onClose={() => setShowInfoModal(false)}
          onUpdate={patch => setEditable(prev => ({ ...prev, ...patch }))}
        />
    </div>
    </>
  )
}