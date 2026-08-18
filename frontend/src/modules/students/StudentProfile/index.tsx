import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  AlertTriangle, Activity,
  Calendar, FileText, Plus,
  BarChart2, Maximize2, X,
  CheckCircle, XCircle, Clock, Eye,
  Download, Trash2, Upload,
  Sparkles, Loader2, ChevronLeft, ChevronRight,
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
import editGif from '@/assets/icons/animated/actions/edit.gif'
import viewGif from '@/assets/icons/animated/actions/view.gif'
import weightLossIcon from '@/assets/icons/objects/metric_belt.webp'
import armIcon2 from '@/assets/icons/objects/dumbbel.webp'
import shoesIcon from '@/assets/icons/objects/shoes.webp'
import healthIcon from '@/assets/icons/health/health.webp'
import trophyIcon from '@/assets/icons/objects/trophy.webp'
import otroIcon from '@/assets/icons/ui/star.webp'
import coachCongratsImg from '@/assets/illustrations/characters/coach/coach_congratulations.webp'
import coachMagicImg from '@/assets/illustrations/characters/coach/coach_magic.png'
import calendarImg from '@/assets/icons/objects/calendar.webp'
import assessmentSceneImg from '@/assets/scenes/physical_assessment.webp'
import routineSceneImg from '@/assets/scenes/physical_routine.webp'
import { meshInputBg } from '@/data/constants'
import { buildAiRoutine, AI_GENERATION_STEPS, AiRoutine, RoutineRow } from '../aiRoutine'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import routineGenLottie from '@/assets/icons/animated/ai/routine_generation.lottie?url'
import musculoIcon from '@/assets/icons/anatomy/musculoskeletal.webp'
import lungsIcon from '@/assets/icons/anatomy/lungs.webp'
import brainIcon from '@/assets/icons/anatomy/brain.webp'
import cardioHealthIcon from '@/assets/icons/anatomy/cardio.webp'
import liverIcon from '@/assets/icons/anatomy/liver.webp'
import mindIcon from '@/assets/icons/health/mind.webp'
import { assessmentItems, cardStyle, emptyValuationForm, monthNames, numOnly } from '../StudentProfileData'
import type { Student, ValuationForm } from '../StudentProfileData'
import { OverviewTab } from '@/modules/students/tabs/OverviewTab'
import { ProgressTab } from '@/modules/students/tabs/ProgressTab'
import { AssessmentTab } from '@/modules/students/tabs/AssessmentTab'
import { DocumentsTab } from '@/modules/students/tabs/DocumentsTab'
import { IdentityAccessCard } from '@/modules/students/components/IdentityAccessCard'
import { useCalendarNavigation } from './hooks/useCalendarNavigation'
import { useMeshInput } from './hooks/useMeshInput'
import { useValuationManager } from './hooks/useValuationManager'
import { useRoutineManager } from './hooks/useRoutineManager'
import { SignatureModal } from './components/SignatureModal'
import { DeleteDocumentModal } from './components/DeleteDocumentModal'
import { DocumentViewerModal } from './components/DocumentViewerModal'
import { CancelConfirmModal } from './components/CancelConfirmModal'
import { StudentInfoModal } from './components/StudentInfoModal'
import { ValuationDetailModal } from './components/ValuationDetailModal'
import { AssessmentChoiceModal } from './components/AssessmentChoiceModal'
import { AIGenerationModal } from './components/AIGenerationModal'
import { RoutineSuccessModal } from './components/RoutineSuccessModal'
import { RoutineDetailModal } from './components/RoutineDetailModal'
import { RoutineDayCard } from './components/RoutineDayCard'
import { RoutineCategorySelect } from './components/RoutineCategorySelect'
import { RoutineExerciseSelect } from './components/RoutineExerciseSelect'
import { ValuationSuccess } from './components/ValuationSuccess'

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
  const [fileModalOpen, setFileModalOpen] = useState(false)
  const [fileModalData, setFileModalData] = useState<{name: string, date: string} | null>(null)
  const [openMenuDoc, setOpenMenuDoc] = useState<string | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteDocName, setDeleteDocName] = useState('')
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
  const calendarNav = useCalendarNavigation()
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
    <div className="flex flex-col h-full overflow-hidden">
      {/* Background orbs */}
      <div className="floating-sphere" style={{
        width: 280, height: 280,
        background: 'radial-gradient(circle, rgba(230,57,70,0.04), transparent)',
        top: '-60px', right: '-40px',
      }} />

      <div className="relative z-10 flex-1 min-h-0 p-8 overflow-hidden">

          <AnimatePresence mode="wait">
            <motion.div key={currentTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="h-full">
              <div className="text-left h-full">

              {currentTab === 'overview' && (
                <OverviewTab student={editable} imc={imc} onShowInfo={() => setShowInfoModal(true)} />
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
              {currentTab === 'documents' && (
                <DocumentsTab
                  openMenuDoc={openMenuDoc}
                  setOpenMenuDoc={setOpenMenuDoc}
                  setFileModalData={setFileModalData}
                  setFileModalOpen={setFileModalOpen}
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

        {/* Modal visor de documento */}
        <DocumentViewerModal
          isOpen={fileModalOpen && !!fileModalData}
          fileData={fileModalData}
          onClose={() => setFileModalOpen(false)}
          onDelete={(name) => { setFileModalOpen(false); setDeleteDocName(name); setDeleteModalOpen(true) }}
        />

        {/* Modal eliminar documento */}
        <DeleteDocumentModal
          isOpen={deleteModalOpen}
          docName={deleteDocName}
          onConfirm={() => setDeleteModalOpen(false)}
          onCancel={() => setDeleteModalOpen(false)}
        />

        {/* Modal nueva valoración */}
        <AnimatePresence>
          {showNewValuationModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(6px)' }}
              onClick={() => {
                if (valuationViewMode) {
                  setShowNewValuationModal(false)
                  setValuationSuccess(false)
                  setValuationStep(1)
                  setValuationViewMode(false)
                } else if (valuationSuccess) {
                  setShowNewValuationModal(false)
                  setValuationSuccess(false)
                  setValuationStep(1)
                } else {
                  setConfirmCancel('valuation')
                }
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 8 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                onClick={e => e.stopPropagation()}
                className={`rounded-3xl w-full max-w-2xl flex flex-col mx-4 relative ${valuationSuccess ? 'overflow-visible' : 'overflow-hidden'}`}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(0,0,0,0.04)',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.12)',
                  maxHeight: '90vh',
                }}
              >
                {/* Header */}
                <div className="flex-shrink-0 px-6 pt-4 pb-0">
                  <div className="relative flex justify-end">
                    <img src={viewGif} alt="" className="absolute left-1/2 -translate-x-1/2 w-6 h-6 pointer-events-none" />
                    <motion.button
                      initial="rest"
                      whileHover="hover"
                      whileTap="tap"
                      variants={{
                        rest: { scale: 1, background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.3)' },
                        hover: { scale: 1.15, background: 'rgba(244,56,67,0.1)', color: '#F43843' },
                        tap: { scale: 0.9 },
                      }}
                      onClick={() => {
                        if (valuationViewMode) {
                          setShowNewValuationModal(false)
                          setValuationSuccess(false)
                          setValuationStep(1)
                          setValuationViewMode(false)
                        } else if (valuationSuccess) {
                          setShowNewValuationModal(false)
                          setValuationSuccess(false)
                          setValuationStep(1)
                        } else {
                          setConfirmCancel('valuation')
                        }
                      }}
                      className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <X size={15} />
                    </motion.button>
                  </div>
                  {!valuationSuccess && (
                  <>
                  {/* Step dots */}
                  <div className="flex items-center justify-center gap-1.5" style={{ marginTop: 12, marginBottom: 16 }}>
                    {[1, 2, 3, 4, 5, 6].map(s => (
                      <motion.div
                        key={s}
                        animate={{
                          width: s === valuationStep ? 16 : 6,
                          background: s === valuationStep ? 'linear-gradient(135deg, #1270B7, #7ec8e3)' : 'rgba(0,0,0,0.12)',
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                        className="rounded-full"
                        style={{ height: 6 }}
                      />
                    ))}
                  </div>
                  {/* Step title */}
                  <span className="text-lg font-bold tracking-wide text-center block" style={{
                    color: '#1A1A1E',
                    marginBottom: 10,
                  }}>
                    {['Contexto del estudiante', 'Medidas corporales', 'Evaluación Clínica', 'Antecedentes de salud', 'Plan de entrenamiento', 'Observaciones finales'][valuationStep - 1]}
                  </span>
                  </>
                  )}
                </div>

                {/* Scrollable body */}
                <div className={`flex-1 px-6 ${valuationSuccess ? 'overflow-visible pb-0' : 'overflow-y-auto pb-6'}`}>
                  {valuationSuccess ? (
                    <ValuationSuccess
                      aiGenerating={aiGenerating}
                      onStartAiRoutine={startAiRoutine}
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
                    />
                  ) : (
                  <motion.div
                    key={valuationStep}
                    initial={{ opacity: 0, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, filter: 'blur(6px)' }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* ═══════ Paso 1: Contexto del estudiante ═══════ */}
                    {valuationStep === 1 && (
                      <div className="space-y-5">
                        <div className="flex flex-col gap-1 relative group">
                          <label className="text-xs font-bold" style={{ color: 'rgba(0,0,0,0.6)' }}>Nivel de actividad física</label>
                          <div className="relative">
                            <select
                              value={valuationForm.nivelActividad}
                              disabled={valuationViewMode}
                              onChange={e => setValuationForm(p => ({ ...p, nivelActividad: e.target.value }))}
                              className="px-3 py-2 rounded-xl text-sm font-medium outline-none w-full appearance-none transition-all duration-200 cursor-pointer"
                              style={{
                                background: 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)',
                                color: '#1A1A1E',
                                border: '1px solid transparent',
                                paddingRight: 32,
                              }}
                              onMouseEnter={e => { if (e.target !== document.activeElement) { e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(0,0,0,0.04)'; e.target.style.borderColor = 'rgba(0,0,0,0.06)' } }}
                              onMouseLeave={e => { if (e.target !== document.activeElement) { e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)'; e.target.style.borderColor = 'transparent' } }}
                              onFocus={e => { e.target.style.borderColor = '#1270B7'; e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(18,112,183,0.04)'; e.target.style.boxShadow = '0 0 0 3px rgba(18,112,183,0.08)' }}
                              onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)'; e.target.style.boxShadow = 'none' }}
                            >
                              <option value="">Seleccionar nivel</option>
                              <option value="Sedentario">Sedentario</option>
                              <option value="Ligeramente activo">Ligeramente activo</option>
                              <option value="Activo">Activo</option>
                              <option value="Muy activo">Muy activo</option>
                              <option value="Extremadamente activo">Extremadamente activo</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 group-hover:opacity-60" style={{ color: 'rgba(0,0,0,0.2)' }}>
                              <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.6)' }}>Objetivo del usuario</label>
                          <p className="text-[11px] mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>Selecciona uno o más objetivos. Si seleccionas "Otro", los demás se deseleccionan.</p>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { value: 'Perdida de peso', icon: weightLossIcon },
                              { value: 'Ganancia muscular', icon: armIcon2 },
                              { value: 'Acondicionamiento fisico', icon: shoesIcon },
                              { value: 'Salud', icon: healthIcon },
                              { value: 'Rendimiento deportivo', icon: trophyIcon },
                              { value: 'Otro', icon: otroIcon },
                            ].map(item => {
                              const isOtro = item.value === 'Otro'
                              const selected = valuationForm.objetivoTarjetas.includes(item.value)
                              const otroSelected = valuationForm.objetivoTarjetas.includes('Otro')
                              const disabled = otroSelected && !isOtro
                              const hoverBg = isOtro ? 'rgba(241,200,39,0.12)' : 'rgba(18,112,183,0.12)'
                              const selectedBg = isOtro ? 'linear-gradient(135deg, #F1C827, #FFE066)' : 'linear-gradient(135deg, #1270B7, #7ec8e3)'
                              const textColor = selected ? '#FFFFFF' : disabled ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.35)'
                              const shadow = isOtro ? '0 4px 20px rgba(241,200,39,0.25)' : '0 4px 20px rgba(18,112,183,0.25)'
                              return (
                                <motion.button
                                  key={item.value}
                                  type="button"
                                  disabled={valuationViewMode}
                                  whileHover={!disabled && !valuationViewMode ? { scale: 1.06 } : {}}
                                  whileTap={!disabled && !valuationViewMode ? { scale: 0.95 } : {}}
                                  onClick={() => {
                                    if (disabled || valuationViewMode) return
                                    if (isOtro) {
                                      setValuationForm(p => ({
                                        ...p,
                                        objetivoTarjetas: selected ? [] : ['Otro'],
                                      }))
                                    } else if (otroSelected) {
                                      setValuationForm(p => ({
                                        ...p,
                                        objetivoTarjetas: p.objetivoTarjetas.includes(item.value)
                                          ? p.objetivoTarjetas.filter((t: string) => t !== item.value)
                                          : [...p.objetivoTarjetas.filter((t: string) => t !== 'Otro'), item.value],
                                      }))
                                    } else {
                                      setValuationForm(p => ({
                                        ...p,
                                        objetivoTarjetas: p.objetivoTarjetas.includes(item.value)
                                          ? p.objetivoTarjetas.filter((t: string) => t !== item.value)
                                          : [...p.objetivoTarjetas, item.value],
                                      }))
                                    }
                                  }}
                                  onMouseEnter={e => { if (!selected && !disabled) { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = isOtro ? '#B8860B' : '#1270B7' } }}
                                  onMouseLeave={e => { if (!selected && !disabled) { e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; e.currentTarget.style.color = 'rgba(0,0,0,0.35)' } }}
                                  className="flex flex-col items-center gap-1.5 px-3 py-3.5 rounded-xl text-sm font-bold transition-all duration-200"
                                  style={{
                                    background: selected ? selectedBg : 'rgba(0,0,0,0.03)',
                                    color: textColor,
                                    border: '1px solid transparent',
                                    boxShadow: selected ? shadow : 'none',
                                    opacity: disabled ? 0.4 : 1,
                                    filter: disabled ? 'blur(0.6px)' : 'none',
                                    pointerEvents: disabled ? 'none' : 'auto',
                                    cursor: disabled ? 'not-allowed' : 'pointer',
                                  }}
                                >
                                  <motion.img
                                    src={item.icon}
                                    alt=""
                                    className="mb-0.5"
                                    animate={{
                                      width: selected ? 52 : 28,
                                      height: selected ? 52 : 28,
                                      marginTop: selected ? -28 : 0,
                                      filter: selected ? 'blur(0px) drop-shadow(0 8px 20px rgba(0,0,0,0.15))' : disabled ? 'grayscale(0.6) blur(0px)' : 'blur(0px)',
                                      opacity: disabled ? 0.3 : 1,
                                    }}
                                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                  />
                                  <span>{item.value}</span>
                                </motion.button>
                              )
                            })}
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-bold" style={{ color: 'rgba(0,0,0,0.6)' }}>¿Cuál es el objetivo?</label>
                          <div className="relative rounded-xl overflow-hidden" style={{
                            background: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,185,0,0.08), rgba(255,215,0,0.15))',
                            border: '1px solid rgba(212,175,55,0.35)',
                            boxShadow: '0 0 25px rgba(255,215,0,0.1), inset 0 1px 0 rgba(255,215,0,0.2)',
                          }}>
                            <div className="absolute inset-0 pointer-events-none" style={{
                              background: 'linear-gradient(110deg, transparent 20%, rgba(255,215,0,0.25) 35%, rgba(255,255,255,0.4) 50%, rgba(255,215,0,0.25) 65%, transparent 80%)',
                              backgroundSize: '200% 100%',
                              animation: 'shimmer 2.5s ease-in-out infinite',
                            }} />
                            <textarea
                              value={valuationForm.objetivoDetalle}
                              readOnly={valuationViewMode}
                              onChange={e => setValuationForm(p => ({ ...p, objetivoDetalle: e.target.value }))}
                              placeholder="Describe a detalle el objetivo del estudiante..."
                              rows={3}
                              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all duration-200 resize-none relative"
                              style={{
                                background: 'transparent',
                                color: '#B8860B',
                                border: 'none',
                                boxShadow: 'none',
                                fontWeight: 700,
                                textShadow: '0 0 8px rgba(255,215,0,0.2)',
                              }}
                              onFocus={e => { e.currentTarget.parentElement!.style.boxShadow = '0 0 40px rgba(255,215,0,0.2)' }}
                              onBlur={e => { e.currentTarget.parentElement!.style.boxShadow = '0 0 25px rgba(255,215,0,0.08)' }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ═══════ Paso 2: Medidas corporales ═══════ */}
                    {valuationStep === 2 && (
                      <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { key: 'peso', label: 'Peso (kg)', type: 'number' },
                            { key: 'estatura', label: 'Estatura (cm)', type: 'number' },
                            { key: 'imc', label: 'IMC', type: 'number' },
                            { key: 'grasaCorporal', label: 'Grasa corporal (%)', type: 'number' },
                            { key: 'masaMuscular', label: 'Masa muscular (kg)', type: 'number' },
                            { key: 'masaMagra', label: 'Masa magra (kg)', type: 'number' },
                            { key: 'grasaVisceral', label: 'Grasa visceral (nivel)', type: 'number' },
                          ].map(field => (
                            <div key={field.key} className="flex flex-col gap-1 group">
                              <label className="text-xs font-bold" style={{ color: 'rgba(0,0,0,0.6)' }}>{field.label}</label>
                              <input
                                type={field.type}
                                readOnly={valuationViewMode}
                                value={(valuationForm as any)[field.key]}
                                onChange={e => setValuationForm(p => ({ ...p, [field.key]: e.target.value }))}
                                className="px-3 py-2 rounded-xl text-sm font-medium outline-none w-full transition-all duration-200"
                                style={{
                                  background: 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)',
                                  color: '#1A1A1E',
                                  border: '1px solid transparent',
                                }}
                                onMouseEnter={e => { if (e.target !== document.activeElement) { e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(0,0,0,0.04)'; e.target.style.borderColor = 'rgba(0,0,0,0.06)' } }}
                                onMouseLeave={e => { if (e.target !== document.activeElement) { e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)'; e.target.style.borderColor = 'transparent' } }}
                                onFocus={e => { e.target.style.borderColor = '#1270B7'; e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(18,112,183,0.04)'; e.target.style.boxShadow = '0 0 0 3px rgba(18,112,183,0.08)' }}
                                onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)'; e.target.style.boxShadow = 'none' }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ═══════ Paso 3: Evaluación Clínica ═══════ */}
                    {valuationStep === 3 && (
                      <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { key: 'presionArterial', label: 'Presión arterial', type: 'text' },
                            { key: 'edadMetabolica', label: 'Edad metabólica', type: 'number' },
                            { key: 'aguaCorporal', label: 'Agua corporal (%)', type: 'number' },
                            { key: 'resistenciaMuscular', label: 'Resistencia muscular', type: 'text' },
                          ].map(field => (
                            <div key={field.key} className="flex flex-col gap-1 group">
                              <label className="text-xs font-bold" style={{ color: 'rgba(0,0,0,0.6)' }}>{field.label}</label>
                              <input
                                type={field.type}
                                readOnly={valuationViewMode}
                                value={(valuationForm as any)[field.key]}
                                onChange={e => setValuationForm(p => ({ ...p, [field.key]: e.target.value }))}
                                className="px-3 py-2 rounded-xl text-sm font-medium outline-none w-full transition-all duration-200"
                                style={{
                                  background: 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)',
                                  color: '#1A1A1E',
                                  border: '1px solid transparent',
                                }}
                                onMouseEnter={e => { if (e.target !== document.activeElement) { e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(0,0,0,0.04)'; e.target.style.borderColor = 'rgba(0,0,0,0.06)' } }}
                                onMouseLeave={e => { if (e.target !== document.activeElement) { e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)'; e.target.style.borderColor = 'transparent' } }}
                                onFocus={e => { e.target.style.borderColor = '#1270B7'; e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(18,112,183,0.04)'; e.target.style.boxShadow = '0 0 0 3px rgba(18,112,183,0.08)' }}
                                onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)'; e.target.style.boxShadow = 'none' }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ═══════ Paso 4: Antecedentes de salud ═══════ */}
                    {valuationStep === 4 && (
                      <div className="space-y-5">
                        <div>
                          <label className="text-xs font-bold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.6)' }}>Antecedentes de salud</label>
                          <p className="text-[11px] mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>Selecciona uno o más antecedentes.</p>
                          <div className="grid grid-cols-3 gap-2">
                             {[
                              { value: 'Osteomuscular', icon: musculoIcon },
                              { value: 'Respiratorio', icon: lungsIcon },
                              { value: 'Psiquiátrico', icon: brainIcon },
                              { value: 'Cardiovascular', icon: cardioHealthIcon },
                              { value: 'Metabólico', icon: liverIcon },
                              { value: 'Psicológico', icon: mindIcon },
                            ].map(item => {
                              const selected = valuationForm.antecedentesSalud.includes(item.value)
                              return (
                                <motion.button
                                  key={item.value}
                                  type="button"
                                  disabled={valuationViewMode}
                                  whileHover={!selected && !valuationViewMode ? { scale: 1.06 } : {}}
                                  whileTap={valuationViewMode ? {} : { scale: 0.95 }}
                                  onClick={() => {
                                    if (valuationViewMode) return
                                    setValuationForm(p => ({
                                      ...p,
                                      antecedentesSalud: selected
                                        ? p.antecedentesSalud.filter((s: string) => s !== item.value)
                                        : [...p.antecedentesSalud, item.value],
                                    }))
                                  }}
                                  className="flex flex-col items-center gap-1.5 px-3 py-3.5 rounded-xl text-sm font-bold transition-all duration-200"
                                  style={{
                                    background: selected ? 'linear-gradient(135deg, #1270B7, #7ec8e3)' : 'rgba(0,0,0,0.03)',
                                    color: selected ? '#FFFFFF' : 'rgba(0,0,0,0.35)',
                                    border: '1px solid transparent',
                                    boxShadow: selected ? '0 4px 20px rgba(18,112,183,0.25)' : 'none',
                                  }}
                                  onMouseEnter={e => { if (!selected) { e.currentTarget.style.background = 'rgba(18,112,183,0.12)'; e.currentTarget.style.color = '#1270B7' } }}
                                  onMouseLeave={e => { if (!selected) { e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; e.currentTarget.style.color = 'rgba(0,0,0,0.35)' } }}
                                >
                                  <motion.img
                                    src={item.icon}
                                    alt=""
                                    className="mb-0.5"
                                    animate={{
                                      width: selected ? 48 : 24,
                                      height: selected ? 48 : 24,
                                      marginTop: selected ? -24 : 0,
                                      filter: selected ? 'blur(0px) drop-shadow(0 8px 20px rgba(0,0,0,0.15))' : 'blur(0px)',
                                    }}
                                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                  />
                                  <span>{item.value}</span>
                                </motion.button>
                              )
                            })}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-bold" style={{ color: 'rgba(0,0,0,0.6)' }}>Observaciones del entrenador</label>
                          <textarea
                            value={valuationForm.observacionesEntrenador}
                            readOnly={valuationViewMode}
                            onChange={e => setValuationForm(p => ({ ...p, observacionesEntrenador: e.target.value }))}
                            placeholder="Notas del entrenador sobre los antecedentes..."
                            rows={3}
                            className="w-full px-3 py-2.5 rounded-xl text-sm font-medium outline-none transition-all duration-200 resize-none"
                            style={{
                              background: 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)',
                              color: '#1A1A1E',
                              border: '1px solid transparent',
                            }}
                            onMouseEnter={e => { if (e.target !== document.activeElement) { e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(0,0,0,0.04)'; e.target.style.borderColor = 'rgba(0,0,0,0.06)' } }}
                            onMouseLeave={e => { if (e.target !== document.activeElement) { e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)'; e.target.style.borderColor = 'transparent' } }}
                            onFocus={e => { e.target.style.borderColor = '#1270B7'; e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(18,112,183,0.04)'; e.target.style.boxShadow = '0 0 0 3px rgba(18,112,183,0.08)' }}
                            onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)'; e.target.style.boxShadow = 'none' }}
                          />
                        </div>
                      </div>
                    )}

                    {/* ═══════ Paso 5: Plan de entrenamiento ═══════ */}
                    {valuationStep === 5 && (
                      <div className="space-y-5">
                        <div>
                          <label className="text-xs font-bold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.6)' }}>Días de la semana</label>
                          <p className="text-[11px] mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>Selecciona los días disponibles.</p>
                          <div className="grid grid-cols-6 gap-2">
                            {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map(dia => {
                              const selected = valuationForm.diasDisponibles.includes(dia)
                              return (
                                <motion.button
                                  key={dia}
                                  type="button"
                                  disabled={valuationViewMode}
                                  whileHover={!selected && !valuationViewMode ? { scale: 1.06 } : {}}
                                  whileTap={valuationViewMode ? {} : { scale: 0.95 }}
                                  onClick={() => {
                                    if (valuationViewMode) return
                                    setValuationForm(p => ({
                                      ...p,
                                      diasDisponibles: selected
                                        ? p.diasDisponibles.filter((d: string) => d !== dia)
                                        : [...p.diasDisponibles, dia],
                                    }))
                                  }}
                                  className="flex flex-col items-center gap-1.5 px-3 py-3.5 rounded-xl text-sm font-bold transition-all duration-200"
                                  style={{
                                    background: selected ? 'linear-gradient(135deg, #1270B7, #7ec8e3)' : 'rgba(0,0,0,0.03)',
                                    color: selected ? '#FFFFFF' : 'rgba(0,0,0,0.35)',
                                    border: '1px solid transparent',
                                    boxShadow: selected ? '0 4px 20px rgba(18,112,183,0.25)' : 'none',
                                  }}
                                  onMouseEnter={e => { if (!selected) { e.currentTarget.style.background = 'rgba(18,112,183,0.12)'; e.currentTarget.style.color = '#1270B7' } }}
                                  onMouseLeave={e => { if (!selected) { e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; e.currentTarget.style.color = 'rgba(0,0,0,0.35)' } }}
                                >
                                  <motion.img
                                    src={calendarImg}
                                    alt=""
                                    className="mb-0.5"
                                    animate={{
                                      width: selected ? 48 : 24,
                                      height: selected ? 48 : 24,
                                      marginTop: selected ? -24 : 0,
                                      filter: selected ? 'blur(0px) drop-shadow(0 8px 20px rgba(0,0,0,0.15))' : 'blur(0px)',
                                    }}
                                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                  />
                                  <span className="text-sm">{dia}</span>
                                </motion.button>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ═══════ Paso 6: Observaciones finales ═══════ */}
                    {valuationStep === 6 && (
                      <div className="space-y-5">
                        <div className="flex flex-col gap-1">
                          <textarea
                            value={valuationForm.observacionesFinales}
                            readOnly={valuationViewMode}
                            onChange={e => setValuationForm(p => ({ ...p, observacionesFinales: e.target.value }))}
                            placeholder="Escribe aquí las observaciones finales..."
                            rows={6}
                            className="w-full px-3 py-2.5 rounded-xl text-sm font-medium outline-none transition-all duration-200 resize-none"
                            style={{
                              background: 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)',
                              color: '#1A1A1E',
                              border: '1px solid transparent',
                            }}
                            onMouseEnter={e => { if (e.target !== document.activeElement) { e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(0,0,0,0.04)'; e.target.style.borderColor = 'rgba(0,0,0,0.06)' } }}
                            onMouseLeave={e => { if (e.target !== document.activeElement) { e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)'; e.target.style.borderColor = 'transparent' } }}
                            onFocus={e => { e.target.style.borderColor = '#1270B7'; e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(18,112,183,0.04)'; e.target.style.boxShadow = '0 0 0 3px rgba(18,112,183,0.08)' }}
                            onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)'; e.target.style.boxShadow = 'none' }}
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                  )}
                </div>

                {/* Footer */}
                {!valuationSuccess && (
                <div className="flex-shrink-0 px-6 py-4" style={{ borderTop: '1px solid rgba(0,0,0,0.04)', background: 'rgba(255,255,255,0.8)' }}>
                  <div className="relative flex items-center justify-between">
                    {valuationViewMode && (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.04, boxShadow: '0 10px 28px rgba(124,58,237,0.45)', transition: { duration: 0.15 } }}
                        whileTap={{ scale: 0.94, boxShadow: '0 2px 8px rgba(124,58,237,0.2)', transition: { duration: 0.1 } }}
                        onClick={startAiRoutine}
                        className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
                        style={{
                          background: 'linear-gradient(135deg, #BF5AF2, #7C3AED)',
                          boxShadow: '0 8px 22px rgba(124,58,237,0.3)',
                        }}
                      >
                        <Sparkles size={14} />
                        Generar rutina con IA
                      </motion.button>
                    )}
                    <div className="flex-1 flex justify-start">
                      {valuationStep > 1 ? (
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setValuationStep(s => s - 1)}
                          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer"
                          style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.5)' }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                          Atrás
                        </motion.button>
                      ) : <div />}
                    </div>

                    <div className="flex-1 flex justify-end">
                      <motion.button
                        type="button"
                        whileHover={valuationStep < 6 ? { scale: 1.04, boxShadow: '0 8px 25px rgba(18,112,183,0.35)', transition: { duration: 0.15 } } : {}}
                        whileTap={valuationStep < 6 ? { scale: 0.92, boxShadow: '0 2px 8px rgba(18,112,183,0.2)', transition: { duration: 0.1 } } : {}}
                        onClick={() => {
                          if (valuationStep < 6) {
                            setValuationStep(s => s + 1)
                          } else if (valuationViewMode) {
                            setShowNewValuationModal(false)
                            setValuationSuccess(false)
                            setValuationStep(1)
                            setValuationViewMode(false)
                          } else {
                            setLastValuationObjectives(valuationForm.objetivoTarjetas.length)
                            setValuationSuccess(true)
                          }
                        }}
                        className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
                        style={{
                          background: !valuationViewMode && valuationStep === 6 ? 'linear-gradient(135deg, #22C55E, #16A34A)' : 'linear-gradient(135deg, #1270B7, #7ec8e3)',
                        }}
                      >
                        {valuationStep === 6 && valuationViewMode ? (
                          <>Cerrar</>
                        ) : valuationStep === 6 ? (
                          <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            Guardar Valoración
                          </>
                        ) : (
                          <>
                            Siguiente
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
        <AnimatePresence>
          {showNewRoutineModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6"
              style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}
              onClick={() => {
                if (routineViewMode) {
                  setShowNewRoutineModal(false)
                  setRoutineStep(1)
                  setRoutineViewMode(false)
                } else {
                  setConfirmCancel('routine')
                }
              }}
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
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => {
                    if (routineViewMode) {
                      setShowNewRoutineModal(false)
                      setRoutineStep(1)
                      setRoutineViewMode(false)
                    } else {
                      setConfirmCancel('routine')
                    }
                  }}
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
                        ? 'Información general de la rutina generada según la valoración.'
                        : aiGeneratedRoutine
                          ? 'Ajusta los parámetros generales de la rutina (prellenados según la valoración).'
                          : 'Configura los parámetros generales de la rutina.'}
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
                        <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.5)' }}>Duración</label>
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
                                    <label className="text-[10px] font-bold mb-1 block" style={{ color: 'rgba(0,0,0,0.45)' }}>Categoría</label>
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
                                      placeholder="Mín"
                                      onMouseEnter={e => meshInput.enterMesh(e.currentTarget)}
                                      onMouseLeave={e => meshInput.leaveMesh(e.currentTarget)}
                                      onFocus={e => meshInput.focusMesh(e.currentTarget)}
                                      onBlur={e => meshInput.blurMesh(e.currentTarget)}
                                      className="w-full px-2 py-1.5 rounded-lg text-[11px] font-medium text-center outline-none"
                                      style={{ background: meshInputBg, border: '1px solid transparent', color: '#0D1B2A' }}
                                    />
                                    <span className="text-[11px] font-bold flex-shrink-0" style={{ color: 'rgba(0,0,0,0.35)' }}>–</span>
                                    <input
                                      value={(row.reps.split('-')[1] ?? '').trim()}
                                      readOnly={routineViewMode}
                                      onChange={e => updateRoutineRow(row.id, { reps: `${(row.reps.split('-')[0] ?? '').trim()}-${e.target.value}` })}
                                      placeholder="Máx"
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
                      Atrás
                    </button>
                  ) : <div />}
                  {routineFromAssessment && !routineEdited && routineStep === 2 ? (
                    <button
                      onClick={() => { setShowNewRoutineModal(false); setRoutineFromAssessment(false); setRoutineSnapshot(''); setRoutineDays([]); setShowAddDayMenu(false) }}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
                      style={{ background: 'rgba(0,0,0,0.04)', color: '#0D1B2A', border: '1px solid rgba(0,0,0,0.06)' }}
                    >
                      Cerrar
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (routineStep < 2) {
                          setRoutineStep(s => s + 1)
                        } else {
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
                        }
                      }}
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
        />

        {/* Confirmación cancelar proceso */}
        <CancelConfirmModal
          isOpen={!!confirmCancel}
          type={confirmCancel ?? 'valuation'}
          onConfirm={handleConfirmCancel}
          onCancel={() => setConfirmCancel(null)}
        />

        {/* ── Info completa (modal por categorías) ─────────── */}
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

