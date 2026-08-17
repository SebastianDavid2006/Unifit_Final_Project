import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertTriangle, Activity,
  Calendar, FileText, Dumbbell, Plus,
  BarChart2, Maximize2, X,
  Check, CheckCircle, XCircle, Clock, Eye,
  Download, Trash2, Upload,
  Sparkles, Loader2, ChevronDown, ChevronLeft, ChevronRight, List,
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
import { meshInputBg, meshInputHover, muscleIcons } from '@/data/constants'
import { buildAiRoutine, AI_GENERATION_STEPS, AiRoutine, RoutineRow } from './aiRoutine'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import routineGenLottie from '@/assets/icons/animated/ai/routine_generation.lottie?url'
import musculoIcon from '@/assets/icons/anatomy/musculoskeletal.webp'
import lungsIcon from '@/assets/icons/anatomy/lungs.webp'
import brainIcon from '@/assets/icons/anatomy/brain.webp'
import cardioHealthIcon from '@/assets/icons/anatomy/cardio.webp'
import liverIcon from '@/assets/icons/anatomy/liver.webp'
import mindIcon from '@/assets/icons/health/mind.webp'
import { assessmentItems, cardStyle, emptyValuationForm, monthNames, numOnly } from './StudentProfileData'
import type { Student, ValuationForm } from './StudentProfileData'
import { OverviewTab } from '@/modules/students/tabs/OverviewTab'
import { ProgressTab } from '@/modules/students/tabs/ProgressTab'
import { AssessmentTab } from '@/modules/students/tabs/AssessmentTab'
import { DocumentsTab } from '@/modules/students/tabs/DocumentsTab'
import { IdentityAccessCard } from '@/modules/students/components/IdentityAccessCard'
import { useCalendarNavigation } from './hooks/useCalendarNavigation'
import { useMeshInput } from './hooks/useMeshInput'
import { useValuationManager } from './hooks/useValuationManager'
import { useRoutineManager } from './hooks/useRoutineManager'

export { TABS } from './StudentProfileData'
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
  const valuationStat = (label: string, value: string, color?: string) => (
    <div className="rounded-xl p-3 flex items-center justify-between gap-2" style={{ background: 'rgba(0,0,0,0.02)' }}>
      <span className="text-[11px] font-medium" style={{ color: 'rgba(0,0,0,0.4)' }}>{label}</span>
      <span className="text-sm font-bold text-right" style={{ color: color ?? '#0D1B2A' }}>{value}</span>
    </div>
  )
  const routineEdited = routineSnapshot !== '' && JSON.stringify({ form: routineForm, rows: routineRows }) !== routineSnapshot

  const ROUTINE_DAY_GRAD = 'linear-gradient(135deg, #1270B7, #7ec8e3)'

  const renderRoutineDayCard = (day: string, selected: boolean, done: boolean, onClick: () => void, onRemove?: () => void) => (
    <motion.button
      type="button"
      whileHover={!selected ? { scale: 1.05 } : {}}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative flex flex-col items-center gap-1.5 px-2 py-3.5 rounded-xl text-sm font-bold transition-all duration-200"
      style={{
        background: selected ? ROUTINE_DAY_GRAD : 'rgba(0,0,0,0.03)',
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
          width: selected ? 52 : 28,
          height: selected ? 52 : 28,
          marginTop: selected ? -28 : 0,
          filter: selected ? 'blur(0px) drop-shadow(0 8px 20px rgba(0,0,0,0.15))' : 'blur(0px)',
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      />
      <span className="text-sm leading-none text-center">{day}</span>
      {onRemove && (
        <motion.button
          type="button"
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={e => { e.stopPropagation(); onRemove() }}
          className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer z-10"
          style={{ background: selected ? 'rgba(255,255,255,0.95)' : 'rgba(244,56,67,0.12)', color: '#E63946', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
        >
          <X size={11} strokeWidth={3.5} />
        </motion.button>
      )}
    </motion.button>
  )

  const ROUTINE_GRAD = 'linear-gradient(135deg, #1270B7, #7ec8e3)'

  const renderRoutineCategorySelect = (row: RoutineRow) => {
    const open = routineDropdown?.id === row.id && routineDropdown.field === 'muscle'
    const category = ROUTINE_MUSCLE_TO_CAT[row.muscle] || row.muscle
    const icon = category && muscleIcons[category]
    return (
      <div className="relative">
        <button
          type="button"
          disabled={routineViewMode}
          onClick={() => { if (!routineViewMode) setRoutineDropdown(open ? null : { id: row.id, field: 'muscle' }) }}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold outline-none cursor-pointer transition-all duration-200"
          style={{ background: meshInputBg, border: '1px solid transparent', color: row.muscle ? '#0D1B2A' : 'rgba(0,0,0,0.35)' }}
          onMouseEnter={e => meshInput.enterMesh(e.currentTarget)}
          onMouseLeave={e => meshInput.leaveMesh(e.currentTarget)}
          onFocus={e => meshInput.focusMesh(e.currentTarget)}
          onBlur={e => meshInput.blurMesh(e.currentTarget)}
        >
          {icon ? (
            <img src={icon} alt="" className="w-4 h-4 flex-shrink-0" />
          ) : (
            <div className="w-4 h-4 rounded flex-shrink-0 flex items-center justify-center" style={{ background: 'rgba(18,112,183,0.12)' }}>
              <List size={11} style={{ color: '#1270B7' }} />
            </div>
          )}
          <span className="flex-1 truncate text-left">{category || 'Categoría'}</span>
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
              {ROUTINE_CATEGORIES.map(m => {
                const isActive = category === m
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      const nameInNewCat = exerciseCatalog.some(x => (ROUTINE_MUSCLE_TO_CAT[x.muscle] || x.muscle) === m && x.name === row.name)
                      updateRoutineRow(row.id, {
                        muscle: m,
                        name: nameInNewCat ? row.name : '',
                        sets: nameInNewCat ? row.sets : '3',
                        reps: nameInNewCat ? row.reps : '10-12',
                      })
                      setRoutineDropdown(null)
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-[11px] font-medium transition-colors relative"
                    style={{
                      color: isActive ? '#FFFFFF' : 'rgba(0,0,0,0.6)',
                      background: isActive ? ROUTINE_GRAD : 'transparent',
                      borderBottom: '1px solid rgba(0,0,0,0.03)',
                    }}
                    onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = '#1270B7' } }}
                    onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(0,0,0,0.6)' } }}
                  >
                    {muscleIcons[m] && (
                      <img src={muscleIcons[m]} alt="" className="w-4 h-4 flex-shrink-0" style={{ filter: isActive ? 'brightness(10)' : 'none' }} />
                    )}
                    <span>{m}</span>
                    {isActive && <Check size={12} className="ml-auto text-white" />}
                  </button>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  const renderRoutineExerciseSelect = (row: RoutineRow) => {
    const open = routineDropdown?.id === row.id && routineDropdown.field === 'exercise'
    const category = ROUTINE_MUSCLE_TO_CAT[row.muscle] || row.muscle
    const catExercises = exerciseCatalog.filter(e => (ROUTINE_MUSCLE_TO_CAT[e.muscle] || e.muscle) === category)
    const hasCustom = row.name && !catExercises.some(e => e.name === row.name)
    return (
      <div className="relative">
        <button
          type="button"
          disabled={!row.muscle || routineViewMode}
          onClick={() => { if (!routineViewMode) setRoutineDropdown(open ? null : { id: row.id, field: 'exercise' }) }}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold outline-none cursor-pointer transition-all duration-200"
          style={{
            background: row.muscle ? meshInputBg : 'rgba(0,0,0,0.03)',
            border: '1px solid transparent',
            color: row.name ? '#0D1B2A' : 'rgba(0,0,0,0.35)',
            opacity: row.muscle ? 1 : 0.6,
          }}
          onMouseEnter={e => meshInput.enterMesh(e.currentTarget)}
          onMouseLeave={e => meshInput.leaveMesh(e.currentTarget)}
          onFocus={e => meshInput.focusMesh(e.currentTarget)}
          onBlur={e => meshInput.blurMesh(e.currentTarget)}
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
                      onClick={() => {
                        updateRoutineRow(row.id, {
                          name: ex.name,
                          muscle: ex.muscle,
                          sets: String(ex.sets),
                          reps: ex.reps,
                        })
                        setRoutineDropdown(null)
                      }}
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
                  onClick={() => setRoutineDropdown(null)}
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


  const renderValuationSuccess = () => (
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
              style={{ color: '#4ADE80' }}
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
            src={coachCongratsImg}
            alt="felicitaciones"
            className="w-72 h-auto object-contain relative z-10"
            style={{ filter: 'drop-shadow(0 0 30px rgba(34,197,94,0.15))' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-24 pointer-events-none z-20" style={{
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
        ¡Valoración guardada exitosamente!
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.4 }}
        className="text-sm font-medium mt-1 text-center"
        style={{ color: 'rgba(0,0,0,0.35)' }}
      >
        Los datos de la valoración han sido guardados en el sistema.
      </motion.p>
      {aiGenerating ? null : (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          whileHover={{ scale: 1.05, boxShadow: '0 12px 32px rgba(124,58,237,0.45)', transition: { duration: 0.15 } }}
          whileTap={{ scale: 0.94, boxShadow: '0 2px 8px rgba(124,58,237,0.2)', transition: { duration: 0.1 } }}
          onClick={startAiRoutine}
          className="mt-8 mb-3 px-10 py-4 rounded-2xl text-sm font-extrabold text-white cursor-pointer flex items-center gap-2.5 shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #BF5AF2, #7C3AED)',
            boxShadow: '0 10px 28px rgba(124,58,237,0.35)',
          }}
        >
          <Sparkles size={16} />
          Generar rutina con IA
        </motion.button>
      )}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.3 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
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
        className="mb-10 px-6 py-2 text-xs font-semibold cursor-pointer bg-transparent"
        style={{ color: 'rgba(0,0,0,0.45)' }}
      >
        Crear rutina manualmente
      </motion.button>
    </motion.div>
  )

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
        <AnimatePresence>
          {signatureModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6"
              style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}
              onClick={() => setSignatureModalOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-lg rounded-3xl p-6"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 24px 80px rgba(0,0,0,0.12)',
                }}
              >
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-base font-bold" style={{ color: '#0D1B2A' }}>Firma del Estudiante</h3>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.4)' }}>Contrato Firmado</p>
                  </div>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setSignatureModalOpen(false)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.04)' }}>
                    <X size={16} style={{ color: 'rgba(0,0,0,0.4)' }} />
                  </motion.button>
                </div>
                <div className="rounded-2xl p-6 flex flex-col items-center justify-center" style={{ background: 'rgba(0,0,0,0.02)', border: '1px dashed rgba(0,0,0,0.08)' }}>
                  <svg viewBox="0 0 400 120" className="w-full h-auto" style={{ maxHeight: 120 }}>
                    <path d="M30,90 C40,50 60,30 80,40 C100,50 95,75 110,65 C125,55 130,35 150,30 C170,25 180,50 195,55 C210,60 220,40 240,35 C260,30 270,55 280,60 C290,65 300,45 320,50 C340,55 345,70 355,65 C365,60 370,50 380,55"
                      fill="none" stroke="#0D1B2A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="30" y1="100" x2="380" y2="100" stroke="rgba(0,0,0,0.1)" strokeWidth="1" strokeDasharray="4 3" />
                  </svg>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md" style={{ background: 'rgba(48,209,88,0.12)', color: '#30D158' }}>Firmado</span>
                    <span className="text-[10px]" style={{ color: 'rgba(0,0,0,0.35)' }}>15 Ene 2026 - 10:32 AM</span>
                  </div>
                  <button
                    className="px-4 py-2 rounded-xl text-[11px] font-semibold transition-all"
                    style={{ background: 'rgba(0,0,0,0.04)', color: '#0D1B2A', border: '1px solid rgba(0,0,0,0.06)' }}
                    onClick={() => setSignatureModalOpen(false)}
                  >
                    Cerrar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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
        <AnimatePresence>
          {fileModalOpen && fileModalData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-center justify-center p-6"
              style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}
              onClick={() => setFileModalOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-2xl rounded-3xl overflow-hidden"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 24px 80px rgba(0,0,0,0.12)',
                }}
              >
                <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(230,57,70,0.08)' }}>
                      <FileText size={16} style={{ color: '#E63946' }} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold" style={{ color: '#0D1B2A' }}>{fileModalData.name}</h3>
                      <p className="text-[10px]" style={{ color: 'rgba(0,0,0,0.35)' }}>{fileModalData.date} · PDF</p>
                    </div>
                  </div>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setFileModalOpen(false)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.04)' }}>
                    <X size={16} style={{ color: 'rgba(0,0,0,0.4)' }} />
                  </motion.button>
                </div>
                  <div className="p-6 flex flex-col items-center justify-center min-h-[300px]" style={{ background: 'rgba(0,0,0,0.02)' }}>
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(230,57,70,0.06)' }}>
                      <FileText size={36} style={{ color: '#E63946' }} />
                    </div>
                    <p className="text-sm font-semibold mb-1" style={{ color: '#0D1B2A' }}>Vista previa del documento</p>
                    <p className="text-xs text-center max-w-xs" style={{ color: 'rgba(0,0,0,0.4)' }}>Este es un documento firmado electrónicamente.</p>
                    <div className="flex gap-2 mt-6">
                      <button className="px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2" style={{ background: '#E63946', color: '#FFFFFF' }}>
                        <Download size={14} /> Descargar
                      </button>
                      <button className="px-5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2" style={{ background: 'rgba(0,0,0,0.04)', color: '#0D1B2A', border: '1px solid rgba(0,0,0,0.06)' }}>
                        <Upload size={14} /> Reemplazar
                      </button>
                      <button onClick={() => { setFileModalOpen(false); setDeleteDocName(fileModalData?.name || ''); setDeleteModalOpen(true) }} className="px-5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2" style={{ background: 'rgba(230,57,70,0.08)', color: '#E63946', border: '1px solid rgba(230,57,70,0.15)' }}>
                        <Trash2 size={14} /> Eliminar
                      </button>
                    </div>
                  </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal eliminar documento */}
        <AnimatePresence>
          {deleteModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[70] flex items-center justify-center p-6"
              style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}
              onClick={() => setDeleteModalOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-md rounded-3xl p-6 flex flex-col items-center text-center"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 24px 80px rgba(0,0,0,0.12)',
                }}
              >
                <div className="w-14 h-14 mb-4">
                  <TrashView />
                </div>
                <h3 className="text-base font-bold mb-1" style={{ color: '#0D1B2A' }}>¿Eliminar documento?</h3>
                <p className="text-sm mb-6" style={{ color: 'rgba(0,0,0,0.4)' }}>
                  Esta acción no se puede deshacer.
                </p>
                <div className="flex gap-2.5 w-full">
                  <button
                    onClick={() => setDeleteModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all"
                    style={{ background: 'rgba(0,0,0,0.04)', color: '#0D1B2A', border: '1px solid rgba(0,0,0,0.06)' }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => setDeleteModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all"
                    style={{ background: '#E63946', color: '#FFFFFF' }}
                  >
                    Eliminar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
                    renderValuationSuccess()
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
        <AnimatePresence>
          {showValuationModal && selectedAssessment && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6"
              style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}
              onClick={() => setShowValuationModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, filter: 'blur(6px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(6px)' }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-xl rounded-3xl p-6 flex flex-col"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 24px 80px rgba(0,0,0,0.12)',
                  maxHeight: '86vh',
                }}
              >
                <div className="flex items-center justify-between mb-5 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${selectedAssessment.color}15` }}>
                      <BarChart2 size={20} style={{ color: selectedAssessment.color }} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold" style={{ color: '#0D1B2A' }}>Valoración {selectedAssessment.type}</h3>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.4)' }}>{selectedAssessment.date} · {selectedAssessment.evaluator}</p>
                    </div>
                  </div>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowValuationModal(false)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.04)' }}>
                    <X size={16} style={{ color: 'rgba(0,0,0,0.4)' }} />
                  </motion.button>
                </div>

                <div className="overflow-y-auto space-y-4 flex-1 pr-1" style={{ scrollbarWidth: 'thin', maxHeight: '60vh' }}>
                  <div className="flex items-center gap-4">
                    <div className="relative flex-shrink-0" style={{ width: 88, height: 88 }}>
                      <svg viewBox="0 0 36 36" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="2.8" />
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke={selectedAssessment.color} strokeWidth="2.8" strokeLinecap="round"
                          strokeDasharray={`${selectedAssessment.score * 0.999} ${100 - selectedAssessment.score * 0.999}`} />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-lg font-extrabold" style={{ color: selectedAssessment.color }}>{selectedAssessment.score}%</p>
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="rounded-xl px-3 py-2" style={{ background: 'rgba(0,0,0,0.02)' }}>
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'rgba(0,0,0,0.35)' }}>Nivel de actividad física</p>
                        <p className="text-sm font-bold" style={{ color: '#0D1B2A' }}>{selectedAssessment.nivelActividad}</p>
                      </div>
                      <div className="rounded-xl px-3 py-2" style={{ background: 'rgba(0,0,0,0.02)' }}>
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'rgba(0,0,0,0.35)' }}>Evaluador</p>
                        <p className="text-sm font-bold" style={{ color: '#0D1B2A' }}>{selectedAssessment.evaluator}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(0,0,0,0.35)' }}>Objetivos</p>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {selectedAssessment.objetivoTarjetas.map((o: string) => (
                        <span key={o} className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #1270B7, #7ec8e3)' }}>{o}</span>
                      ))}
                    </div>
                    <div className="rounded-xl px-3 py-2.5" style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(212,175,55,0.25)' }}>
                      <p className="text-[11px] font-semibold italic leading-relaxed" style={{ color: '#B8860B' }}>"{selectedAssessment.objetivoDetalle}"</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(0,0,0,0.35)' }}>Medidas corporales</p>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedAssessment.metrics.map((m: any) => (
                        <div key={m.label} className="rounded-xl p-3 flex items-center justify-between" style={{ background: 'rgba(0,0,0,0.02)' }}>
                          <span className="text-[11px] font-medium" style={{ color: 'rgba(0,0,0,0.4)' }}>{m.label}</span>
                          <span className="text-sm font-bold" style={{ color: '#0D1B2A' }}>{m.value}</span>
                        </div>
                      ))}
                      {valuationStat('Estatura', selectedAssessment.estatura)}
                      {valuationStat('Masa magra', selectedAssessment.masaMagra)}
                      {valuationStat('Grasa visceral', selectedAssessment.grasaVisceral, '#E63946')}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(0,0,0,0.35)' }}>Evaluación clínica</p>
                    <div className="grid grid-cols-2 gap-3">
                      {valuationStat('Presión arterial', selectedAssessment.presionArterial)}
                      {valuationStat('Edad metabólica', `${selectedAssessment.edadMetabolica} años`)}
                      {valuationStat('Agua corporal', selectedAssessment.aguaCorporal)}
                      {valuationStat('Resistencia muscular', selectedAssessment.resistenciaMuscular)}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(0,0,0,0.35)' }}>Antecedentes de salud</p>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {selectedAssessment.antecedentesSalud.length === 0 ? (
                        <span className="text-[11px] font-medium" style={{ color: 'rgba(0,0,0,0.35)' }}>Sin antecedentes registrados</span>
                      ) : selectedAssessment.antecedentesSalud.map((a: string) => (
                        <span key={a} className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #E63946, #FF8FA3)' }}>{a}</span>
                      ))}
                    </div>
                    <div className="rounded-xl px-3 py-2.5" style={{ background: 'rgba(0,0,0,0.02)' }}>
                      <p className="text-[11px] font-medium leading-relaxed" style={{ color: 'rgba(0,0,0,0.6)' }}>{selectedAssessment.observacionesEntrenador}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(0,0,0,0.35)' }}>Plan de entrenamiento</p>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {selectedAssessment.diasDisponibles.map((d: string) => (
                        <span key={d} className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #1A8A3F, #30D158)' }}>{d}</span>
                      ))}
                    </div>
                    <div className="rounded-xl px-3 py-2.5 flex items-center gap-2" style={{ background: 'rgba(0,0,0,0.02)' }}>
                      <Dumbbell size={14} style={{ color: 'rgba(0,0,0,0.4)' }} />
                      <span className="text-sm font-semibold" style={{ color: '#0D1B2A' }}>{selectedAssessment.routine}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(0,0,0,0.35)' }}>Observaciones finales</p>
                    <div className="rounded-xl px-3 py-2.5" style={{ background: 'rgba(0,0,0,0.02)' }}>
                      <p className="text-[11px] font-medium leading-relaxed" style={{ color: 'rgba(0,0,0,0.6)' }}>{selectedAssessment.observacionesFinales}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 flex justify-end flex-shrink-0" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                  <button
                    onClick={() => setShowValuationModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                    style={{ background: 'rgba(0,0,0,0.04)', color: '#0D1B2A', border: '1px solid rgba(0,0,0,0.06)' }}
                  >
                    Cerrar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal detalle de rutina */}
        <AnimatePresence>
          {showRoutineViewModal && selectedAssessment && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6"
              style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}
              onClick={() => setShowRoutineViewModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, filter: 'blur(6px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(6px)' }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-3xl rounded-3xl p-6 flex flex-col"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 24px 80px rgba(0,0,0,0.12)',
                }}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(48,209,88,0.12)' }}>
                      <Dumbbell size={20} style={{ color: '#30D158' }} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold" style={{ color: '#0D1B2A' }}>{currentRoutine?.name ?? selectedAssessment.routine}</h3>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.4)' }}>{selectedAssessment.date} · Asociada a la valoración</p>
                    </div>
                  </div>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowRoutineViewModal(false)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.04)' }}>
                    <X size={16} style={{ color: 'rgba(0,0,0,0.4)' }} />
                  </motion.button>
                </div>

                {currentRoutine && currentRoutine.rows.length > 0 ? (
                  (() => {
                    const viewDays = [...new Set(currentRoutine.rows.map(r => r.dia))]
                    const activeDay = viewRoutineDay && viewDays.includes(viewRoutineDay) ? viewRoutineDay : viewDays[0]
                    const selDayRows = currentRoutine.rows.filter(r => r.dia === activeDay)
                    return (
                      <div className="flex flex-col min-h-0 flex-1">
                        <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: `repeat(${viewDays.length}, minmax(0, 1fr))` }}>
                          {viewDays.map(day => renderRoutineDayCard(
                            day,
                            day === activeDay,
                            currentRoutine.rows.some(r => r.dia === day),
                            () => setViewRoutineDay(day),
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
                    onClick={() => setShowRoutineViewModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                    style={{ background: 'rgba(0,0,0,0.04)', color: '#0D1B2A', border: '1px solid rgba(0,0,0,0.06)' }}
                  >
                    Cerrar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
                          {pagedRoutineDays.map(day => renderRoutineDayCard(
                            day,
                            day === (selectedRoutineDay ?? defaultRoutineDay()),
                            routineRows.some(r => r.dia === day),
                            () => setSelectedRoutineDay(day),
                            routineDayList.length > 1 ? () => removeRoutineDay(day) : undefined,
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
                                    {renderRoutineCategorySelect(row)}
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-bold mb-1 block" style={{ color: 'rgba(0,0,0,0.45)' }}>Ejercicio</label>
                                    {renderRoutineExerciseSelect(row)}
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
        <AnimatePresence>
          {aiGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-6"
              style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}
            >
              <motion.div
                initial={{ opacity: 0, filter: 'blur(6px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(6px)' }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-lg rounded-3xl p-8 pt-6 flex flex-col items-center relative"
                style={{
                  background: 'linear-gradient(180deg, #F3E8FF 0%, #FFFFFF 100%)',
                  border: '1px solid rgba(191,90,242,0.12)',
                  boxShadow: '0 24px 80px rgba(124,58,237,0.18)',
                }}
              >
                <div className="absolute top-4 right-4">
                  <motion.button
                    whileHover={{ scale: 1.15, background: 'rgba(244,56,67,0.1)', color: '#F43843' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setConfirmCancel('ai')}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                    style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.3)' }}
                  >
                    <X size={16} />
                  </motion.button>
                </div>
                <div className="relative flex-shrink-0 w-56 h-56 flex items-center justify-center pointer-events-none">
                  {[...Array(24)].map((_, i) => {
                    const angle = (i / 24) * 360
                    const rad = (angle * Math.PI) / 180
                    return (
                      <motion.span
                        key={i}
                        className="absolute pointer-events-none text-lg select-none"
                        style={{ color: '#BF5AF2' }}
                        animate={{
                          x: [0, Math.cos(rad) * (120 + (i % 6) * 20)],
                          y: [0, Math.sin(rad) * (120 + (i % 6) * 20)],
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
                  <div className="relative z-10 w-56 h-56 flex items-center justify-center">
                    <DotLottieReact
                      src={routineGenLottie}
                      loop
                      autoplay
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                </div>
                <h3
                  className="text-[2rem] leading-[1.1] font-extrabold tracking-tight text-center mt-2"
                  style={{
                    background: 'linear-gradient(135deg, #BF5AF2, #F472B6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Cargando rutina con IA
                </h3>
                <p className="text-xs font-medium text-center mt-1.5" style={{ color: '#8B5CF6' }}>
                  Analizando la valoración de {student.firstName}
                </p>
                <div className="flex items-center justify-center gap-2 mt-3 min-h-5">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={aiGenStep}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="flex items-center gap-2"
                    >
                      <Loader2 size={13} color="#7C3AED" className="animate-spin flex-shrink-0" />
                      <p className="text-xs font-bold" style={{ color: '#6D28D9' }}>{AI_GENERATION_STEPS[aiGenStep]}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="w-full mt-6 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(191,90,242,0.12)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #C084FC, #F472B6)' }}
                    animate={{ width: `${((aiGenStep + 1) / AI_GENERATION_STEPS.length) * 100}%` }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirmación cancelar proceso */}
        <AnimatePresence>
          {confirmCancel && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] flex items-center justify-center p-6"
              style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)' }}
              onClick={() => setConfirmCancel(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 10 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-sm rounded-3xl p-7 flex flex-col items-center text-center relative"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(124,58,237,0.12)',
                  boxShadow: '0 24px 80px rgba(0,0,0,0.18)',
                }}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(244,56,67,0.1)' }}>
                  <AlertTriangle size={22} color="#F43843" />
                </div>
                <p className="text-base font-bold" style={{ color: '#1A1A1E' }}>
                  ¿Seguro que deseas cancelar el proceso?
                </p>
                <p className="text-xs font-medium mt-1.5" style={{ color: 'rgba(0,0,0,0.4)' }}>
                  {confirmCancel === 'ai'
                    ? 'La rutina generada hasta ahora no se guardará.'
                    : 'Los datos ingresados no se guardarán.'}
                </p>
                <div className="flex items-center gap-2.5 mt-6 w-full">
                  <button
                    onClick={() => setConfirmCancel(null)}
                    className="flex-1 px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
                    style={{ background: 'rgba(0,0,0,0.05)', color: 'rgba(0,0,0,0.6)' }}
                  >
                    Seguir
                  </button>
                  <button
                    onClick={handleConfirmCancel}
                    className="flex-1 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all"
                    style={{ background: 'linear-gradient(135deg, #FF6B6B, #E63946)' }}
                  >
                    Sí, cancelar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Info completa (modal por categorías) ─────────── */}
        <AnimatePresence>
          {showInfoModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[115] flex items-center justify-center p-6"
              style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)' }}
              onClick={() => setShowInfoModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-5xl max-h-[85vh] flex flex-col rounded-[28px] relative overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.96)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.6)',
                  boxShadow: '0 24px 80px rgba(0,0,0,0.18)',
                }}
              >
                {/* Header */}
                <div className="flex-shrink-0 flex items-center justify-between px-7 pt-6 pb-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0" style={{
                      background: student.risk === 'high'
                        ? 'linear-gradient(135deg, #FF3B30, #D32F2F)'
                        : student.risk === 'medium'
                        ? 'linear-gradient(135deg, #FF9500, #E68600)'
                        : 'linear-gradient(135deg, #30D158, #20A040)',
                      fontSize: 14,
                    }}>
                      {student.avatar}
                    </div>
                    <div>
                      <h2 className="text-lg font-extrabold" style={{ color: '#0D1B2A' }}>
                        {[student.firstName, student.secondName, student.lastName, student.secondLastName].filter(Boolean).join(' ')}
                      </h2>
                      <p className="text-xs font-medium" style={{ color: 'rgba(0,0,0,0.4)' }}>
                        {student.faculty || student.program} · {student.institution}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, background: 'rgba(244,56,67,0.1)', color: '#F43843' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowInfoModal(false)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer"
                    style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.45)' }}
                  >
                    <X size={16} />
                  </motion.button>
                </div>

                {/* Categorías */}
                <div className="flex-1 min-h-0 overflow-y-auto px-7 py-6" style={{ scrollbarWidth: 'thin' }}>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {
                        title: 'Información personal',
                        model: <StudentCardView />,
                        fields: [
                          { label: 'Primer nombre', value: student.firstName },
                          { label: 'Segundo nombre', value: student.secondName || '—' },
                          { label: 'Primer apellido', value: student.lastName },
                          { label: 'Segundo apellido', value: student.secondLastName || '—' },
                          { label: 'Documento', value: `${student.documentType}. ${student.documentNumber}` },
                          { label: 'Fecha de nacimiento', value: student.birthDate },
                          { label: 'Género', value: student.gender },
                          { label: 'Edad', value: `${Math.abs(new Date(student.birthDate.split('/').reverse().join('-')).getFullYear() - new Date().getFullYear())} años` },
                        ],
                      },
                      {
                        title: student.role === 'profesor' || student.role === 'administrador' ? 'Información laboral' : 'Información académica',
                        model: <CapView />,
                        fields:
                          student.role === 'profesor' || student.role === 'administrador'
                            ? [
                                { label: 'Área', value: student.area || '—' },
                                { label: 'Cargo', value: student.cargo || '—' },
                              ]
                            : [
                                { label: 'Número carnet', value: student.carnetId },
                                { label: 'Estado', value: student.graduationStatus },
                                { label: 'Institución', value: student.institution },
                                { label: 'Modalidad', value: student.modality },
                                { label: 'Nivel de formación', value: student.nivelFormacion || 'Técnicos' },
                                { label: 'Carrera', value: student.faculty || student.program },
                                { label: 'Semestre', value: student.semester || `${student.semestre}` },
                                { label: 'Jornada', value: student.jornada },
                              ],
                      },
                      {
                        title: 'Información médica',
                        model: <StethoscopeView />,
                        fields: [
                          { label: 'EPS', value: student.eps },
                          { label: 'Grupo sanguíneo', value: student.bloodType },
                        ],
                      },
                      {
                        title: 'Información de contacto',
                        model: <TelephoneView />,
                        fields: [
                          { label: 'Email', value: editable.email },
                          { label: 'Teléfono', value: student.phone },
                          { label: 'Contacto de emergencia', value: student.contactName },
                          { label: 'Parentesco', value: student.contactRelation || '—' },
                          { label: 'Teléfono de emergencia', value: student.contactPhone },
                        ],
                      },
                    ].map((cat, ci) => (
                      <motion.div
                        key={cat.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.05 + ci * 0.06 }}
                        className="rounded-2xl p-5 flex flex-col"
                        style={{
                          background: 'linear-gradient(145deg, rgba(18,112,183,0.09) 0%, rgba(18,112,183,0.03) 55%, rgba(255,255,255,0.6) 100%)',
                          boxShadow: '0 1px 0 rgba(255,255,255,0.7) inset, 0 4px 16px rgba(18,112,183,0.06)',
                        }}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-xl flex-shrink-0 overflow-hidden" style={{ background: 'rgba(18,112,183,0.10)' }}>
                            {cat.model}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-6 rounded-full flex-shrink-0" style={{ background: 'rgba(18,112,183,0.35)' }} />
                            <p className="text-sm font-extrabold capitalize" style={{ color: '#0D1B2A' }}>{cat.title}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-x-5 gap-y-3 flex-1">
                          {cat.fields.map(f => (
                            <div key={f.label} className="flex flex-col">
                              <p className="text-[10px] font-bold uppercase tracking-wide mb-0.5" style={{ color: 'rgba(0,0,0,0.4)' }}>{f.label}</p>
                              <p className="text-sm font-semibold" style={{ color: '#0D1B2A' }}>{f.value}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <IdentityAccessCard student={editable} onUpdate={patch => setEditable(prev => ({ ...prev, ...patch }))} />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
    </>
  )
}

