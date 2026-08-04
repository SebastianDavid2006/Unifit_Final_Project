import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts'
import {
  AlertTriangle, Activity,
  Calendar, FileText, Dumbbell, Plus,
  Flame, Shield, BarChart2, Maximize2, X,
  Check, CheckCircle, XCircle, Clock, Eye,
  MoreVertical, Download, Trash2, Upload,
  Sparkles, Loader2,
} from 'lucide-react'
import { StudentCardView } from '../../assets/models/ui/objects/student_card/StudentCardModel'
import { TelephoneView } from '../../assets/models/ui/objects/telephone/TelephoneModel'
import { CapView } from '../../assets/models/ui/objects/cap/CapModel'
import { TrophyView } from '../../assets/models/ui/objects/trophy/TrophyModel'
import { ListView } from '../../assets/models/ui/objects/list/ListModel'
import { CalendarView } from '../../assets/models/ui/objects/calendar/CalendarModel'
import { ClockView } from '../../assets/models/ui/objects/clock/ClockModel'
import { ScalesOfJusticeView } from '../../assets/models/ui/objects/scales_of_justice/ScalesOfJusticeModel'
import { StethoscopeView } from '../../assets/models/ui/objects/stethoscope/StethoscopeModel'
import { KitView } from '../../assets/models/ui/objects/kit/KitModel'
import { TrashView } from '../../assets/models/ui/actions/trash/TrashModel'
import fireGif from '../../assets/icons/animated/fire.gif'
import weightLossIcon from '../../assets/icons/objects/metric_belt.webp'
import armIcon2 from '../../assets/icons/objects/dumbbel.webp'
import shoesIcon from '../../assets/icons/objects/shoes.webp'
import healthIcon from '../../assets/icons/health/health.webp'
import trophyIcon from '../../assets/icons/objects/trophy.webp'
import otroIcon from '../../assets/icons/ui/star.webp'
import coachCongratsImg from '../../assets/illustrations/characters/coach/coach_congratulations.webp'
import calendarImg from '../../assets/icons/objects/calendar.webp'
import physicalAssessmentImg from '../../assets/illustrations/modules/physical_assessment.webp'
import { GREEN_GRAD } from '../../data/constants'
import { buildAiRoutine, AI_GENERATION_STEPS, AiRoutine, RoutineRow } from './aiRoutine'
import musculoIcon from '../../assets/icons/anatomy/musculoskeletal.webp'
import lungsIcon from '../../assets/icons/anatomy/lungs.webp'
import brainIcon from '../../assets/icons/anatomy/brain.webp'
import cardioHealthIcon from '../../assets/icons/anatomy/cardio.webp'
import liverIcon from '../../assets/icons/anatomy/liver.webp'
import mindIcon from '../../assets/icons/health/mind.webp'

interface Student {
  id: number
  name: string
  firstName: string
  secondName: string
  lastName: string
  secondLastName: string
  documentType: string
  documentNumber: string
  birthDate: string
  gender: string
  eps: string
  bloodType: string
  epsCertificate?: string
  email: string
  phone: string
  contactName: string
  contactPhone: string
  carnetId: string
  program: string
  institution: string
  semestre: number
  modality: string
  jornada: string
  graduationStatus: string
  adherence: number
  risk: 'low' | 'medium' | 'high'
  lastVisit: string
  avatar: string
  goal: string
  sessions: number
  weight: number
  height: number
}

const RED = '#E63946'

const cardStyle = {
  background: '#FFFFFF',
  border: '1px solid rgba(0,0,0,0.04)',
  borderRadius: 20,
  boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.03), 0 12px 32px rgba(0,0,0,0.02)',
}

const bodyRadar = [
  { subject: 'Fuerza', value: 72 },
  { subject: 'Resistencia', value: 65 },
  { subject: 'Flexibilidad', value: 58 },
  { subject: 'Velocidad', value: 80 },
  { subject: 'Potencia', value: 68 },
  { subject: 'Movilidad', value: 61 },
]

const progressHistory = [
  { month: 'Ene', peso: 78, grasa: 22, musculo: 48 },
  { month: 'Feb', peso: 76, grasa: 20, musculo: 49 },
  { month: 'Mar', peso: 75, grasa: 19, musculo: 50 },
  { month: 'Abr', peso: 73, grasa: 18, musculo: 51 },
  { month: 'May', peso: 72, grasa: 17, musculo: 52 },
]

const routineExercises = [
  { name: 'Sentadilla con barra', sets: 4, reps: '8-10', weight: '80 kg', muscle: 'Cuádriceps', difficulty: 'Avanzado', calories: 95 },
  { name: 'Press de banca plano', sets: 4, reps: '8-10', weight: '70 kg', muscle: 'Pectoral', difficulty: 'Intermedio', calories: 80 },
  { name: 'Peso muerto', sets: 3, reps: '6-8', weight: '100 kg', muscle: 'Espalda baja', difficulty: 'Avanzado', calories: 110 },
  { name: 'Dominadas', sets: 3, reps: '8-12', weight: 'Peso corporal', muscle: 'Dorsal', difficulty: 'Intermedio', calories: 70 },
  { name: 'Press militar', sets: 3, reps: '10-12', weight: '50 kg', muscle: 'Hombros', difficulty: 'Intermedio', calories: 65 },
]

const attendanceCalendar = [
  [true, true, false, true, true, false, false],
  [true, false, true, true, false, true, false],
  [false, true, true, true, true, false, false],
  [true, true, false, false, true, true, false],
]

const nutritionData = [
  { day: 'L', calorias: 2100 },
  { day: 'M', calorias: 1950 },
  { day: 'X', calorias: 2300 },
  { day: 'J', calorias: 2050 },
  { day: 'V', calorias: 2200 },
  { day: 'S', calorias: 1800 },
  { day: 'D', calorias: 1700 },
]

interface AttendanceRecord {
  dia: string
  fecha: string
  entrada: string
  salida: string
  duracion: string
}

const historialAsistencia: AttendanceRecord[] = [
  { dia: 'Lunes',    fecha: '04 Mayo',  entrada: '06:30 AM', salida: '08:15 AM', duracion: '1h 45min' },
  { dia: 'Martes',   fecha: '05 Mayo',  entrada: '07:00 AM', salida: '08:30 AM', duracion: '1h 30min' },
  { dia: 'Miércoles',fecha: '06 Mayo',  entrada: '06:45 AM', salida: '08:00 AM', duracion: '1h 15min' },
  { dia: 'Viernes',  fecha: '08 Mayo',  entrada: '07:15 AM', salida: '09:00 AM', duracion: '1h 45min' },
  { dia: 'Lunes',    fecha: '11 Mayo',  entrada: '06:30 AM', salida: '08:15 AM', duracion: '1h 45min' },
  { dia: 'Martes',   fecha: '12 Mayo',  entrada: '07:00 AM', salida: '08:45 AM', duracion: '1h 45min' },
  { dia: 'Miércoles',fecha: '13 Mayo',  entrada: '06:45 AM', salida: '08:00 AM', duracion: '1h 15min' },
  { dia: 'Jueves',   fecha: '14 Mayo',  entrada: '07:00 AM', salida: '08:30 AM', duracion: '1h 30min' },
  { dia: 'Viernes',  fecha: '15 Mayo',  entrada: '06:30 AM', salida: '08:15 AM', duracion: '1h 45min' },
  { dia: 'Lunes',    fecha: '18 Mayo',  entrada: '07:00 AM', salida: '08:00 AM', duracion: '1h 00min' },
]

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(0,0,0,0.06)',
      borderRadius: 12,
      padding: '10px 16px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
    }}>
      <p style={{ color: 'rgba(0,0,0,0.4)', fontSize: 11, marginBottom: 4 }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || '#0D1B2A', fontSize: 13, fontWeight: 600 }}>
          {p.value} <span style={{ color: 'rgba(0,0,0,0.35)', fontWeight: 400 }}>{p.name}</span>
        </p>
      ))}
    </div>
  )
}

export const TABS = [
  { id: 'overview', label: 'General', icon: Activity },
  { id: 'progress', label: 'Actividad', icon: Calendar },
  { id: 'assessment', label: 'Evaluación Física', icon: BarChart2 },
  { id: 'documents', label: 'Documentos', icon: FileText },
] as const

export function StudentProfile({ student, tab = 'overview', onTabChange }: { student: Student; tab?: string; onTabChange?: (t: string) => void }) {
  const [localTab, setLocalTab] = useState('overview')
  const [modalOpen, setModalOpen] = useState(false)
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
  const [routineStep, setRoutineStep] = useState(1)
  const [routineForm, setRoutineForm] = useState({
    name: '', description: '', duration: '', frequency: '', level: 'Intermedio',
  })
  const [currentRoutine, setCurrentRoutine] = useState<AiRoutine | null>(null)
  const [routineRows, setRoutineRows] = useState<RoutineRow[]>([])
  const [selectedRoutineDay, setSelectedRoutineDay] = useState<string | null>(null)
  const [viewRoutineDay, setViewRoutineDay] = useState<string | null>(null)
  const [aiGenerating, setAiGenerating] = useState(false)
  const [aiGenStep, setAiGenStep] = useState(0)
  const [aiGeneratedRoutine, setAiGeneratedRoutine] = useState<AiRoutine | null>(null)
  const [showNewValuationModal, setShowNewValuationModal] = useState(false)
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
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  const RED_GRAD = 'linear-gradient(135deg, #FF6B6B, #E63946)'
  const getWeekStart = (d: Date) => { const r = new Date(d); const day = r.getDay(); r.setDate(r.getDate() - (day === 0 ? 6 : day - 1)); return r }
  const getWeekEnd = (d: Date) => { const r = new Date(getWeekStart(d)); r.setDate(r.getDate() + 6); return r }
  const formatWeekRange = (d: Date) => {
    const start = getWeekStart(d), end = getWeekEnd(d)
    return `${start.getDate()} ${monthNames[start.getMonth()].slice(0,3)} — ${end.getDate()} ${monthNames[end.getMonth()].slice(0,3)} ${start.getFullYear()}`
  }
  const prevPeriod = () => setCurrentDate(d => {
    const r = new Date(d)
    if (vistaCalendario === 'semana') r.setDate(r.getDate() - 7)
    else if (vistaCalendario === 'año') r.setFullYear(r.getFullYear() - 1)
    else r.setMonth(r.getMonth() - 1)
    return r
  })
  const nextPeriod = () => setCurrentDate(d => {
    const r = new Date(d)
    if (vistaCalendario === 'semana') r.setDate(r.getDate() + 7)
    else if (vistaCalendario === 'año') r.setFullYear(r.getFullYear() + 1)
    else r.setMonth(r.getMonth() + 1)
    return r
  })
  const currentTab = tab ?? localTab
  const setTab = onTabChange ?? setLocalTab
  const imc = (student.weight / ((student.height / 100) ** 2)).toFixed(1)
  const imcNum = parseFloat(imc)

  const startAiRoutine = () => {
    setAiGenerating(true)
    setAiGenStep(0)
    let step = 0
    const interval = window.setInterval(() => {
      step += 1
      if (step >= AI_GENERATION_STEPS.length) {
        window.clearInterval(interval)
        const routine = buildAiRoutine({
          nivelActividad: valuationForm.nivelActividad,
          objetivoTarjetas: valuationForm.objetivoTarjetas,
          objetivoDetalle: valuationForm.objetivoDetalle,
          peso: valuationForm.peso,
          estatura: valuationForm.estatura,
          imc: valuationForm.imc,
          grasaCorporal: valuationForm.grasaCorporal,
          masaMuscular: valuationForm.masaMuscular,
          presionArterial: valuationForm.presionArterial,
          resistenciaMuscular: valuationForm.resistenciaMuscular,
          antecedentesSalud: valuationForm.antecedentesSalud,
          observacionesEntrenador: valuationForm.observacionesEntrenador,
          diasDisponibles: valuationForm.diasDisponibles,
          observacionesFinales: valuationForm.observacionesFinales,
          studentName: student.firstName,
        })
        setAiGeneratedRoutine(routine)
        setRoutineForm({
          name: routine.name,
          description: routine.description,
          duration: routine.duration,
          frequency: routine.frequency,
          level: routine.level,
        })
        setRoutineRows(routine.rows)
        setSelectedRoutineDay(routine.rows.length ? routine.rows[0].dia : null)
        setRoutineStep(1)
        setTimeout(() => {
          setAiGenerating(false)
          setShowNewRoutineModal(true)
        }, 600)
        return
      }
      setAiGenStep(step)
    }, 450)
  }

  const updateRoutineRow = (id: string, patch: Partial<RoutineRow>) =>
    setRoutineRows(prev => prev.map(r => (r.id === id ? { ...r, ...patch } : r)))

  const removeRoutineRow = (id: string) =>
    setRoutineRows(prev => prev.filter(r => r.id !== id))

  const routineDays = [...new Set(routineRows.map(r => r.dia))]

  const renderRoutineDayCard = (day: string, selected: boolean, done: boolean, onClick: () => void) => (
    <motion.button
      type="button"
      whileHover={!selected ? { scale: 1.04 } : {}}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative flex flex-col items-center gap-1 px-2 py-3 rounded-xl font-bold transition-all duration-200"
      style={{
        background: selected ? 'linear-gradient(135deg, #30D158, #1A8A3F)' : 'rgba(0,0,0,0.03)',
        color: selected ? '#FFFFFF' : 'rgba(0,0,0,0.4)',
        border: '1px solid transparent',
        boxShadow: selected ? '0 6px 20px rgba(48,209,88,0.35)' : 'none',
      }}
      onMouseEnter={e => { if (!selected) { e.currentTarget.style.background = 'rgba(48,209,88,0.12)'; e.currentTarget.style.color = '#1A8A3F' } }}
      onMouseLeave={e => { if (!selected) { e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; e.currentTarget.style.color = 'rgba(0,0,0,0.4)' } }}
    >
      <span className="text-sm leading-none">{day}</span>
      <span className="text-[10px] font-semibold opacity-70 leading-none">{done ? 'Listo' : 'Editar'}</span>
      {done && (
        <span className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.9)' }}>
          <Check size={9} color="#1A8A3F" strokeWidth={3.5} />
        </span>
      )}
    </motion.button>
  )


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
      {aiGenerating ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mt-8 mb-4 rounded-2xl p-5"
          style={{ background: 'rgba(48,209,88,0.06)', border: '1px solid rgba(48,209,88,0.2)' }}
        >
          <div className="flex items-center gap-2.5 mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #30D158, #00C7BE)' }}
            >
              <Sparkles size={14} color="#FFFFFF" />
            </motion.div>
            <div>
              <p className="text-xs font-bold" style={{ color: '#0D1B2A' }}>Generando rutina con IA...</p>
              <p className="text-[10px]" style={{ color: 'rgba(0,0,0,0.4)' }}>Analizando la valoración de {student.firstName}</p>
            </div>
          </div>
          <div className="space-y-1.5">
            {AI_GENERATION_STEPS.map((s, i) => (
              <motion.div key={s} className="flex items-center gap-2.5"
                animate={{ opacity: i <= aiGenStep ? 1 : 0.4 }}
              >
                <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{
                  background: i < aiGenStep ? '#30D158' : i === aiGenStep ? 'rgba(48,209,88,0.15)' : 'rgba(0,0,0,0.06)',
                }}>
                  {i < aiGenStep
                    ? <Check size={9} color="#fff" strokeWidth={3.5} />
                    : i === aiGenStep
                      ? <Loader2 size={9} color="#1A8A3F" className="animate-spin" />
                      : <span style={{ width: 9, height: 9, borderRadius: 99, background: 'rgba(0,0,0,0.15)' }} />}
                </div>
                <p className="text-[11px]" style={{
                  color: i <= aiGenStep ? '#0D1B2A' : 'rgba(0,0,0,0.3)',
                  fontWeight: i === aiGenStep ? 700 : 500,
                }}>{s}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          whileHover={{ scale: 1.04, boxShadow: '0 8px 25px rgba(0,155,149,0.35)', transition: { duration: 0.15 } }}
          whileTap={{ scale: 0.92, boxShadow: '0 2px 8px rgba(0,155,149,0.2)', transition: { duration: 0.1 } }}
          onClick={startAiRoutine}
          className="mt-8 mb-2 px-8 py-3.5 rounded-2xl text-xs font-bold text-white cursor-pointer flex items-center gap-2"
          style={{ background: 'linear-gradient(135deg, #30D158, #00C7BE)' }}
        >
          <Sparkles size={14} />
          Generar rutina con IA
        </motion.button>
      )}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.3 }}
        onClick={() => { setShowNewValuationModal(false); setValuationSuccess(false); setValuationStep(1) }}
        className="mb-10 px-6 py-2.5 rounded-2xl text-xs font-bold transition-all"
        style={{ background: 'rgba(0,0,0,0.05)', color: 'rgba(0,0,0,0.5)' }}
      >
        Cerrar
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
                <div className="grid gap-2 items-start" style={{ gridTemplateColumns: '1fr 2fr 1fr', gridTemplateRows: 'auto auto auto' }}>
                  {/* Fila 1 - Izquierda: Info General */}
                  <div className="rounded-[28px] p-4 transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg cursor-default" style={{ gridColumn: '1', gridRow: '1', background: 'rgba(255,255,255,0.5)' }}>
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: 'rgba(230,57,70,0.3)' }} />
                      <div className="w-8 h-8 flex-shrink-0"><StudentCardView /></div>
                      <p className="text-lg font-extrabold capitalize" style={{ color: '#0D1B2A' }}>Información General</p>
                    </div>
                    <div className="flex flex-col">
                      {[
                        { label: 'Documento', value: `${student.documentType}. ${student.documentNumber}` },
                        { label: 'Fecha de nacimiento', value: student.birthDate },
                        { label: 'Género', value: student.gender },
                      ].map((field, fi, arr) => (
                        <div key={field.label} className="flex flex-col" style={{ borderBottom: fi < arr.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none', paddingBottom: fi < arr.length - 1 ? 6 : 0 }}>
                          <p className="text-xs mb-0.5" style={{ color: 'rgba(0,0,0,0.5)' }}>{field.label}</p>
                          <p className="text-base font-semibold" style={{ color: '#0D1B2A' }}>{field.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Centro - spans todas las filas */}
                  <div className="flex flex-col items-center relative" style={{ gridColumn: '2', gridRow: '1 / 4', paddingTop: 16, alignSelf: 'stretch', overflow: 'visible' }}>
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold shadow-lg mb-3 relative z-10"
                      style={{
                        background: student.risk === 'high'
                          ? 'linear-gradient(135deg, #FF3B30, #D32F2F)'
                          : student.risk === 'medium'
                          ? 'linear-gradient(135deg, #FF9500, #E68600)'
                          : 'linear-gradient(135deg, #30D158, #20A040)',
                        fontSize: 26,
                      }}
                    >
                      {student.avatar}
                    </div>
                    <h2 className="text-[#0D1B2A] text-2xl font-bold text-center mb-2 relative z-10">
                      {[student.firstName, student.secondName, student.lastName, student.secondLastName].filter(Boolean).join(' ')}
                    </h2>
                    <div className="absolute left-0 right-0" style={{ top: 110, bottom: -60 }}>
                      <video
                        src="/student-body.webm"
                        autoPlay loop muted playsInline preload="auto"
                        className="absolute inset-0 w-full h-full"
                        style={{
                          objectFit: 'contain',
                          filter: 'saturate(1.1)',
                          maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
                          WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Fila 1 - Derecha: Estado del proceso */}
                  <div className="rounded-[28px] p-5 transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg cursor-default" style={{ gridColumn: '3', gridRow: '1', background: 'rgba(255,255,255,0.5)' }}>
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: 'rgba(230,57,70,0.3)' }} />
                      <p className="text-lg font-extrabold capitalize" style={{ color: '#0D1B2A' }}>Estado del proceso</p>
                    </div>
                    <div className="flex items-center gap-5">
                      <div className="relative flex-shrink-0" style={{ width: 96, height: 96 }}>
                        <svg viewBox="0 0 36 36" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
                          <defs>
                            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#30D158" />
                              <stop offset="100%" stopColor="#00C7BE" />
                            </linearGradient>
                          </defs>
                          <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="2.8" />
                          <circle cx="18" cy="18" r="15.9" fill="none" stroke="url(#scoreGrad)" strokeWidth="2.8" strokeLinecap="round"
                            strokeDasharray={`${87 * 0.999} ${100 - 87 * 0.999}`} />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-2xl font-extrabold" style={{ background: 'linear-gradient(90deg, #30D158, #00C7BE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>87%</p>
                        </div>
                      </div>
                      <div className="flex flex-col flex-1 gap-4">
                        {[
                          { label: 'Adherencia', value: 92, gradient: 'linear-gradient(90deg, #30D158, #00C7BE)' },
                          { label: 'Constancia', value: 85, gradient: 'linear-gradient(90deg, #FF9500, #FFCC02)' },
                          { label: 'Evolución física', value: 76, gradient: 'linear-gradient(90deg, #FF6B8A, #FF375F)' },
                        ].map(m => (
                          <div key={m.label}>
                            <div className="flex items-center justify-between mb-1.5">
                              <p className="text-xs font-semibold" style={{ color: 'rgba(0,0,0,0.5)' }}>{m.label}</p>
                              <p className="text-xs font-bold" style={{ color: 'rgba(0,0,0,0.6)' }}>{m.value}%</p>
                            </div>
                            <div className="w-full h-2.5 rounded-full" style={{ background: 'rgba(0,0,0,0.05)' }}>
                              <div className="h-full rounded-full" style={{ width: `${m.value}%`, background: m.gradient }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Fila 2 - Izquierda: Contacto */}
                  <div className="rounded-[28px] p-5 transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg cursor-default" style={{ gridColumn: '1', gridRow: '2', background: 'rgba(255,255,255,0.5)' }}>
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: 'rgba(230,57,70,0.3)' }} />
                      <div className="w-8 h-8 flex-shrink-0"><TelephoneView /></div>
                      <p className="text-lg font-extrabold capitalize" style={{ color: '#0D1B2A' }}>Contacto</p>
                    </div>
                    <div className="flex flex-col">
                      {[
                        { label: 'Email', value: student.email },
                        { label: 'Teléfono', value: student.phone },
                        { label: 'Contacto de emergencia', value: student.contactName },
                        { label: 'Tel. contacto', value: student.contactPhone },
                      ].map((field, fi, arr) => (
                        <div key={field.label} className="flex flex-col" style={{ borderBottom: fi < arr.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none', paddingBottom: fi < arr.length - 1 ? 8 : 0 }}>
                          <p className="text-xs mb-1" style={{ color: 'rgba(0,0,0,0.5)' }}>{field.label}</p>
                          <p className="text-base font-semibold" style={{ color: '#0D1B2A' }}>{field.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fila 2 - Derecha: Métricas actuales */}
                  <div className="rounded-[28px] p-4 transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg cursor-default" style={{ gridColumn: '3', gridRow: '2', background: 'rgba(255,255,255,0.5)' }}>
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: 'rgba(230,57,70,0.3)' }} />
                      <p className="text-lg font-extrabold capitalize" style={{ color: '#0D1B2A' }}>Métricas actuales</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Peso', value: `${student.weight} kg` },
                        { label: 'Estatura', value: `${student.height} cm` },
                        { label: 'IMC', value: imc },
                        { label: 'Grasa corporal', value: '17%' },
                        { label: 'Masa muscular', value: '52 kg' },
                        { label: 'Agua corporal', value: '58%' },
                      ].map(m => (
                        <div key={m.label} className="rounded-xl p-3 text-center" style={{ background: 'rgba(0,0,0,0.02)' }}>
                          <p className="text-base font-extrabold" style={{ color: '#0D1B2A' }}>{m.value}</p>
                          <p className="text-[10px] font-semibold mt-0.5" style={{ color: 'rgba(0,0,0,0.35)' }}>{m.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fila 3 - Izquierda: Info académica */}
                  <div className="rounded-[28px] p-4 transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg cursor-default" style={{ gridColumn: '1', gridRow: '3', background: 'rgba(255,255,255,0.5)' }}>
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: 'rgba(230,57,70,0.3)' }} />
                      <div className="w-8 h-8 flex-shrink-0"><CapView /></div>
                      <p className="text-lg font-extrabold capitalize" style={{ color: '#0D1B2A' }}>Información académica</p>
                    </div>
                    <div className="flex flex-col">
                      {[
                        { label: 'Programa', value: student.program },
                        { label: 'Semestre', value: `${student.semestre}°` },
                        { label: 'Jornada', value: student.jornada },
                      ].map((field, fi, arr) => (
                        <div key={field.label} className="flex flex-col" style={{ borderBottom: fi < arr.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none', paddingBottom: fi < arr.length - 1 ? 6 : 0 }}>
                          <p className="text-xs mb-0.5" style={{ color: 'rgba(0,0,0,0.5)' }}>{field.label}</p>
                          <p className="text-base font-semibold" style={{ color: '#0D1B2A' }}>{field.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fila 3 - Derecha: Objetivo físico */}
                  <div className="rounded-[28px] p-5 relative overflow-hidden transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg cursor-default" style={{ gridColumn: '3', gridRow: '3', background: 'linear-gradient(135deg, rgba(255,215,0,0.08), rgba(255,185,0,0.05), rgba(255,215,0,0.08))' }}>
                    <div className="absolute inset-0 pointer-events-none" style={{
                      background: 'linear-gradient(110deg, transparent 25%, rgba(255,215,0,0.15) 37%, rgba(255,255,255,0.4) 50%, rgba(255,215,0,0.15) 63%, transparent 75%)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 3s ease-in-out infinite',
                    }} />
                    <div className="relative z-10">
                      <div className="flex items-center gap-2.5 mb-4">
                        <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: 'rgba(212,175,55,0.5)' }} />
                        <div className="w-8 h-8 flex-shrink-0"><TrophyView /></div>
                        <p className="text-lg font-extrabold capitalize" style={{ color: '#B8860B' }}>Objetivo físico</p>
                      </div>
                      <div className="rounded-2xl p-4" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)' }}>
                        <p className="text-sm font-bold leading-relaxed" style={{ color: '#B8860B' }}>{student.goal}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentTab === 'progress' && (
                <div className="max-w-[1200px] mx-auto space-y-6">
                  {/* KPI Cards */}
                  <div className="grid grid-cols-4 gap-4">
                    {(() => {
                      const asistenciasEsteMes = historialAsistencia.length
                      const asistenciasTotales = 42
                      const totalMinutos = historialAsistencia.reduce((acc, r) => {
                        const [h, m] = r.duracion.replace('h', '').replace('min', '').split(/\s+/).map(s => parseInt(s) || 0)
                        return acc + h * 60 + m
                      }, 0)
                      const horas = Math.floor(totalMinutos / 60)
                      const mins = totalMinutos % 60
                      const tiempoTotal = `${horas}h ${mins.toString().padStart(2, '0')}min`
                      const ordenDias: Record<string, number> = { Lunes: 1, Martes: 2, Miércoles: 3, Jueves: 4, Viernes: 5, Sábado: 6, Domingo: 7 }
                      let racha = 0
                      const copia = [...historialAsistencia].reverse()
                      for (let i = 0; i < copia.length; i++) {
                        racha++
                        if (i < copia.length - 1) {
                          const diaActual = ordenDias[copia[i].dia] || 0
                          const diaAnterior = ordenDias[copia[i + 1].dia] || 0
                          if (diaActual === 1 && diaAnterior === 5) continue
                          if (diaActual - diaAnterior !== 1) break
                        }
                      }

                      const items = [
                        { label: 'Racha actual', value: `${racha} días`, model: 'fire' },
                        { label: 'Tiempo total entrenado', value: tiempoTotal, model: 'clock' },
                        { label: 'Asistencias totales', value: `${asistenciasTotales}`, model: 'list' },
                        { label: 'Asistencias este mes', value: `${asistenciasEsteMes}/20`, model: 'calendar' },
                      ]
                      return items.map((m, idx) => {
                        const iconEl = m.model === 'fire' ? (
                          <img src={fireGif} alt="fire" style={{ width: 52, height: 52, objectFit: 'contain' }} />
                        ) : m.model === 'clock' ? (
                          <div style={{ width: 52, height: 52 }}><ClockView /></div>
                        ) : m.model === 'list' ? (
                          <div style={{ width: 52, height: 52 }}><ListView /></div>
                        ) : (
                          <div style={{ width: 52, height: 52 }}><CalendarView /></div>
                        )
                        const esFuego = m.model === 'fire'
                        return (
                          <motion.div
                            key={m.label}
                            whileHover={{ scale: 1.03 }}
                            transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
                            className="relative rounded-2xl p-4 flex flex-col items-center text-center group cursor-pointer"
                            style={cardStyle}
                          >
                            <div
                              className="transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.5] mb-5 flex items-center justify-center"
                              style={{ transformOrigin: 'bottom center' }}
                            >
                              {iconEl}
                            </div>
                            <p className={esFuego ? '' : 'text-gradient-warm'} style={{
                              fontSize: '1.8rem', fontWeight: 700, lineHeight: 1,
                              ...(esFuego ? {
                                background: 'linear-gradient(135deg, #FF6B00, #FF2D00, #FF9500)',
                                backgroundSize: '200% auto',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                animation: 'shimmer 5s linear infinite',
                              } : {}),
                            }}>{m.value}</p>
                            <p className="text-sm font-semibold mt-2" style={{
                              color: esFuego ? '#FF6B00' : 'rgba(0,0,0,0.5)',
                            }}>{m.label}</p>
                          </motion.div>
                        )
                      })
                    })()}
                  </div>

                  {/* Historial de Entradas y Salidas */}
                  <div className="rounded-2xl" style={{
                    background: '#FFFFFF',
                    border: '1px solid rgba(0,0,0,0.04)',
                    borderRadius: 20,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
                    overflow: 'hidden',
                  }}>
                    <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                      <div className="flex items-center gap-2 flex-1">
                        <Calendar size={16} style={{ color: '#E63946' }} />
                        <h3 className="text-[#0D1B2A] text-sm font-bold whitespace-nowrap">Historial de Entradas y Salidas</h3>
                      </div>
                      <div className="flex items-center gap-0.5 rounded-lg p-0.5 flex-shrink-0" style={{ background: 'rgba(0,0,0,0.04)' }}>
                        {(['semana', 'mes', 'año'] as const).map(v => (
                          <button
                            key={v}
                            onClick={() => setVistaCalendario(v)}
                            className="px-3 py-1.5 rounded-md text-xs font-bold transition-all"
                            style={{
                              background: vistaCalendario === v ? RED_GRAD : 'transparent',
                              color: vistaCalendario === v ? '#FFFFFF' : 'rgba(0,0,0,0.35)',
                              boxShadow: vistaCalendario === v ? '0 2px 8px rgba(230,57,70,0.25)' : 'none',
                            }}
                          >
                            {v === 'semana' ? 'Semana' : v === 'mes' ? 'Mes' : 'Año'}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 flex-1 justify-end">
                        <button onClick={prevPeriod} onMouseEnter={(e) => { e.currentTarget.style.background = RED_GRAD; e.currentTarget.style.color = '#FFFFFF' }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = 'rgba(0,0,0,0.3)' }} className="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold transition-all flex-shrink-0" style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.3)' }}>‹</button>
                        <span className="text-sm font-bold px-1 text-center min-w-[160px]" style={{ color: '#0D1B2A' }}>
                          {vistaCalendario === 'semana' ? formatWeekRange(currentDate) : vistaCalendario === 'mes' ? `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}` : `${currentDate.getFullYear()}`}
                        </span>
                        <button onClick={nextPeriod} onMouseEnter={(e) => { e.currentTarget.style.background = RED_GRAD; e.currentTarget.style.color = '#FFFFFF' }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = 'rgba(0,0,0,0.3)' }} className="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold transition-all flex-shrink-0" style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.3)' }}>›</button>
                      </div>
                    </div>

                    {(vistaCalendario === 'semana') && (
                      <div className="px-5 pt-4 pb-4">
                        <div className="w-full">
                          <div className="grid gap-4 px-2 mb-3" style={{ gridTemplateColumns: '1.3fr 0.8fr 1fr 1fr 0.8fr' }}>
                            {['Día', 'Asistencia', 'Entrada', 'Salida', 'Duración'].map(h => (
                              <div key={h} className="text-sm font-bold" style={{ color: 'rgba(0,0,0,0.4)' }}>{h}</div>
                            ))}
                          </div>
                          <div className="space-y-1">
                            {(() => {
                              const weekStart = getWeekStart(currentDate)
                              const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
                              const monthShort = monthNames[weekStart.getMonth()].slice(0,3)
                              return Array.from({ length: 5 }, (_, i) => {
                                const dayDate = new Date(weekStart)
                                dayDate.setDate(weekStart.getDate() + i)
                                const dayNum = dayDate.getDate()
                                const record = historialAsistencia.find(r => {
                                  const rd = parseInt(r.fecha.split(' ')[0])
                                  const rm = monthNames.findIndex(mn => mn.startsWith(r.fecha.split(' ')[1]?.slice(0,3)))
                                  return rd === dayNum && rm === dayDate.getMonth()
                                })
                                const hasData = !!record
                                return (
                                  <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                    className="grid gap-4 items-center px-4 py-3 rounded-xl transition-all cursor-pointer"
                                    style={{
                                      gridTemplateColumns: '1.3fr 0.8fr 1fr 1fr 0.8fr',
                                      background: hasData ? 'rgba(48,209,88,0.06)' : 'rgba(230,57,70,0.04)',
                                      borderLeft: hasData ? '3px solid #30D158' : '3px solid #E63946',
                                      opacity: 1,
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)' }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(0px)'; e.currentTarget.style.boxShadow = 'none' }}
                                  >
                                    <div className="flex flex-col">
                                      <span className="text-sm font-semibold" style={{ color: '#0D1B2A' }}>{dayNames[i]}</span>
                                      <span className="text-xs" style={{ color: 'rgba(0,0,0,0.35)' }}>{dayNum} {monthShort}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      {hasData ? <CheckCircle size={14} style={{ color: '#30D158' }} /> : <XCircle size={14} style={{ color: '#E63946' }} />}
                                      <span className="text-xs font-bold" style={{ color: hasData ? '#30D158' : '#E63946' }}>
                                        {hasData ? 'Asistió' : 'No asistió'}
                                      </span>
                                    </div>
                                    {hasData ? (
                                      <>
                                        <div className="flex items-center gap-2">
                                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#30D158' }} />
                                          <span className="text-sm font-semibold" style={{ color: '#0D1B2A' }}>{record.entrada}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#C62828' }} />
                                          <span className="text-sm font-semibold" style={{ color: '#C62828' }}>{record.salida}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                          <Clock size={14} style={{ color: '#0D1B2A' }} />
                                          <span className="text-sm font-bold" style={{ color: '#0D1B2A' }}>{record.duracion}</span>
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <span className="text-xs" style={{ color: 'rgba(0,0,0,0.15)' }}>—</span>
                                        <span className="text-xs" style={{ color: 'rgba(0,0,0,0.15)' }}>—</span>
                                        <span className="text-xs" style={{ color: 'rgba(0,0,0,0.15)' }}>—</span>
                                      </>
                                    )}
                                  </motion.div>
                                )
                              })
                            })()}
                          </div>
                        </div>
                      </div>
                    )}

                    {(vistaCalendario === 'mes') && (
                      <div className="px-5 pt-4 pb-4">
                        {(() => {
                          const daysInMonth = 31
                          const firstDay = 5
                          const dayLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
                          const attendanceByDay: Record<number, AttendanceRecord> = {}
                          historialAsistencia.forEach(r => {
                            const d = parseInt(r.fecha.split(' ')[0])
                            attendanceByDay[d] = r
                          })
                          const weeks: (number | null)[][] = []
                          let currentWeek: (number | null)[] = []
                          for (let i = 0; i < firstDay; i++) currentWeek.push(null)
                          for (let d = 1; d <= daysInMonth; d++) {
                            currentWeek.push(d)
                            if (currentWeek.length === 7) {
                              weeks.push(currentWeek)
                              currentWeek = []
                            }
                          }
                          if (currentWeek.length > 0) {
                            while (currentWeek.length < 7) currentWeek.push(null)
                            weeks.push(currentWeek)
                          }
                          return (
                            <div>
                              <div className="grid grid-cols-7" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                                {dayLabels.map((dn, di) => {
                                  const RED_GRAD = 'linear-gradient(135deg, #FF6B6B, #E63946)'
                                  return (
                                    <div key={dn}
                                      onMouseEnter={() => setHoveredCol(di)}
                                      onMouseLeave={() => setHoveredCol(null)}
                                      className="text-center py-2.5 text-xs font-bold tracking-wide transition-all rounded-t-md"
                                      style={{
                                        color: hoveredCol === di ? '#FFFFFF' : 'rgba(0,0,0,0.35)',
                                        background: hoveredCol === di ? RED_GRAD : 'transparent',
                                      }}
                                    >{dn}</div>
                                  )
                                })}
                              </div>
                              {weeks.map((week, wi) => (
                                <div key={wi} className="grid grid-cols-7">
                                  {week.map((day, di) => {
                                    if (day === null) return <div key={`e-${wi}-${di}`} className="min-h-[72px]" style={{ borderRight: di < 6 ? '1px solid rgba(0,0,0,0.03)' : 'none', borderBottom: wi < weeks.length - 1 ? '1px solid rgba(0,0,0,0.03)' : 'none' }} />
                                    const record = attendanceByDay[day]
                                    const isToday = day === 13
                                    const isHovered = hoveredCol === di
                                    return (
                                      <motion.div
                                        key={day}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: (wi * 7 + di) * 0.005 }}
                                        className="relative min-h-[80px] p-2 cursor-pointer transition-all"
                                        style={{
                                          background: (hoveredCell?.w === wi && hoveredCell?.d === di) ? 'rgba(230,57,70,0.12)' : (record ? 'rgba(230,57,70,0.06)' : '#FFFFFF'),
                                          borderRight: di < 6 ? '1px solid rgba(0,0,0,0.03)' : 'none',
                                          borderBottom: wi < weeks.length - 1 ? '1px solid rgba(0,0,0,0.03)' : 'none',
                                          transform: (hoveredCell?.w === wi && hoveredCell?.d === di) ? 'scale(1.03)' : 'scale(1)',
                                          transition: 'transform 0.18s ease, background 0.18s ease',
                                          zIndex: (hoveredCell?.w === wi && hoveredCell?.d === di) ? 5 : 1,
                                        }}
                                        onMouseEnter={() => { setHoveredCol(di); setHoveredCell({w: wi, d: di}) }}
                                        onMouseLeave={() => { setHoveredCell(null); setHoveredCol(null) }}
                                      >
                                        <span className={`inline-flex items-center justify-center text-sm font-bold rounded-md transition-all ${isToday || (hoveredCell?.w === wi && hoveredCell?.d === di) ? 'bg-[#E63946] text-white' : record ? 'text-[#0D1B2A]' : 'text-black/10'}`}
                                          style={{ width: 24, height: 24 }}
                                        >{day}</span>
                                        {record && (
                                          <div className="mt-1.5 space-y-0.5">
                                            <div className="text-xs font-bold leading-tight" style={{ color: '#0D1B2A' }}>{record.duracion}</div>
                                            <div className="flex items-center gap-1">
                                              <span className="text-[9px] font-semibold" style={{ color: '#0D1B2A' }}>{record.entrada}</span>
                                              <span className="text-[9px] font-medium" style={{ color: 'rgba(0,0,0,0.15)' }}>→</span>
                                              <span className="text-[9px] font-semibold" style={{ color: '#C62828' }}>{record.salida}</span>
                                            </div>
                                          </div>
                                        )}
                                      </motion.div>
                                    )
                                  })}
                                </div>
                              ))}
                            </div>
                          )
                        })()}
                      </div>
                    )}

                    {(vistaCalendario === 'año') && (
                      <div className="px-5 pt-4 pb-4">
                        <div className="grid grid-cols-3 gap-3">
                          {Array.from({ length: 12 }, (_, mi) => {
                            const mDays = new Date(currentDate.getFullYear(), mi + 1, 0).getDate()
                            const firstDow = new Date(currentDate.getFullYear(), mi, 1).getDay()
                            const pad = firstDow === 0 ? 6 : firstDow - 1
                            const dayLabelsMini = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
                            const hasAttendance = mi === 4
                            const asistencias = mi === 4 ? historialAsistencia.length : 0
                            return (
                              <motion.div
                                key={mi}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: mi * 0.04 }}
                                className="rounded-xl p-3 transition-all hover:shadow-md cursor-pointer"
                                style={{
                                  background: mi === 4 ? 'rgba(230,57,70,0.04)' : 'rgba(0,0,0,0.015)',
                                  border: mi === 4 ? '1px solid rgba(230,57,70,0.15)' : '1px solid rgba(0,0,0,0.04)',
                                }}
                                onClick={() => { setVistaCalendario('mes'); setCurrentDate(new Date(currentDate.getFullYear(), mi, 1)) }}
                              >
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-[10px] font-extrabold" style={{ color: mi === 4 ? '#0D1B2A' : 'rgba(0,0,0,0.4)' }}>{['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][mi]}</span>
                                  {hasAttendance && <span className="text-[8px] font-bold" style={{ color: '#E63946' }}>{asistencias}</span>}
                                </div>
                                <div className="grid grid-cols-7 gap-0">
                                  {dayLabelsMini.map((ld, ldi) => (
                                    <div key={ldi} className="text-[6px] font-bold text-center" style={{ color: 'rgba(0,0,0,0.25)' }}>{ld}</div>
                                  ))}
                                  {Array.from({ length: pad }, (_, pi) => <div key={`p-${pi}`} />)}
                                  {Array.from({ length: mDays }, (_, di) => {
                                    const d = di + 1
                                    const isT = d === 13 && mi === 4
                                    const attDay = historialAsistencia.find(r => {
                                      const dayNum = parseInt(r.fecha.split(' ')[0])
                                      const monthName = r.fecha.split(' ')[1]?.slice(0,3)
                                      const monthIdx = monthNames.findIndex(mn => mn.startsWith(monthName))
                                      return dayNum === d && monthIdx === mi
                                    })
                                    return (
                                      <div key={di}
                                        className="relative text-center text-[8px] font-bold py-[1px] rounded-sm transition-colors"
                                        style={{
                                          color: isT ? '#FFFFFF' : attDay ? '#0D1B2A' : 'rgba(0,0,0,0.15)',
                                          background: isT ? '#E63946' : attDay ? 'rgba(230,57,70,0.06)' : 'transparent',
                                        }}
                                      >
                                        {d}
                                      </div>
                                    )
                                  })}
                                </div>
                              </motion.div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {(currentTab === 'assessment' || currentTab === 'documents') && (
                <div className="max-w-[1200px] mx-auto space-y-6">
                  {currentTab === 'assessment' && (
                      <div className="space-y-4">
                      {/* Mini Dashboard + Nueva Valoración */}
                      <div className="grid grid-cols-4 gap-4">
                        {(() => {
                          const totalRutinas = 4
                          const ultimaRutina = '15 May 2026'

                          const items = [
                            { label: 'Total de rutinas', value: `${totalRutinas}`, model: 'list' },
                            { label: 'Última rutina realizada', value: ultimaRutina, model: 'calendar' },
                            { label: 'Fecha de la próxima valoración', value: '01 Ago 2026', model: 'calendar', highlight: true },
                          ]
                          return items.map((m) => {
                            const iconEl = m.model === 'fire' ? (
                              <img src={fireGif} alt="fire" style={{ width: 52, height: 52, objectFit: 'contain' }} />
                            ) : m.model === 'clock' ? (
                              <div style={{ width: 52, height: 52 }}><ClockView /></div>
                            ) : m.model === 'list' ? (
                              <div style={{ width: 52, height: 52 }}><ListView /></div>
                            ) : (
                              <div style={{ width: 52, height: 52 }}><CalendarView /></div>
                            )
                            return (
                                <motion.div
                                  key={m.label}
                                  whileHover={{ scale: 1.03 }}
                                  transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
                                  className="relative rounded-2xl p-4 flex flex-col items-center text-center group"
                                  style={{
                                    ...cardStyle,
                                    ...(m.highlight ? { border: '1px solid rgba(48,209,88,0.15)', boxShadow: '0 8px 32px rgba(48,209,88,0.12), 0 0 40px rgba(48,209,88,0.06)' } : {}),
                                  }}
                                >
                                <div
                                  className="transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.5] mb-5 flex items-center justify-center"
                                  style={{ transformOrigin: 'bottom center' }}
                                >
                                  {iconEl}
                                </div>
                                <p style={{
                                  fontSize: '1.8rem', fontWeight: 700, lineHeight: 1,
                                  ...(m.highlight
                                    ? { background: 'linear-gradient(135deg, #30D158, #00C7BE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }
                                    : {}),
                                }} className={m.highlight ? '' : 'text-gradient-warm'}>{m.value}</p>
                                <p className="text-sm font-semibold mt-2" style={{
                                  color: m.highlight ? '#30D158' : 'rgba(0,0,0,0.5)',
                                }}>{m.label}</p>
                              </motion.div>
                            )
                          })
                        })()}
                        {/* Tarjeta Nueva Valoración */}
                        <motion.div
                          whileHover={{ boxShadow: '0 12px 40px rgba(230,57,70,0.3), 0 0 60px rgba(230,57,70,0.1)' }}
                          transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
                          className="relative rounded-2xl flex flex-col items-center text-center group cursor-pointer"
                          style={{
                            borderRadius: 20,
                            background: 'radial-gradient(ellipse at 20% 30%, rgba(230,57,70,0.9) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(18,112,183,0.4) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(241,200,39,0.25) 0%, transparent 50%), #CC0033',
                            backgroundSize: '200% 200%',
                            animation: 'mesh-shift 15s ease-in-out infinite',
                            boxShadow: '0 8px 32px rgba(230,57,70,0.12), 0 2px 8px rgba(230,57,70,0.06)',
                          }}
                          onClick={() => setShowNewValuationModal(true)}
                        >
                          <div className="w-full flex flex-col items-center relative z-10">
                            <div
                              className="transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.2]"
                              style={{ width: '100%', height: 110, position: 'relative', transformOrigin: 'bottom center' }}
                            >
                              <img
                                src={physicalAssessmentImg}
                                alt=""
                                className="w-full h-full object-contain drop-shadow-xl"
                                style={{ objectPosition: 'bottom center' }}
                              />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-14 pointer-events-none z-10" style={{
                              background: 'linear-gradient(to top, #CC0033 0%, rgba(204,0,51,0) 100%)',
                            }} />
                          </div>
                          <div className="flex items-center gap-1.5 mb-3 z-10">
                            <span className="text-sm font-bold text-white/90">Nueva Valoración</span>
                            <Plus size={16} className="text-white/90" />
                          </div>
                        </motion.div>
                      </div>

                      {([
                        { date: '15 May 2026' },
                        { date: '20 Feb 2026' },
                        { date: '10 Nov 2025' },
                        { date: '05 Jun 2025' },
                      ] as const).map((v, i, arr) => {
                        const isFirst = i === 0
                        const isLast = i === arr.length - 1
                        const status = isFirst ? 'Actual' : isLast ? 'Inicial' : 'Seguimiento'
                        const statusColor = isFirst ? '#1270B7' : isLast ? '#E63946' : '#FF9500'
                        const statusBg = isFirst ? 'rgba(18,112,183,0.12)' : isLast ? 'rgba(230,57,70,0.12)' : 'rgba(255,149,0,0.12)'
                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08, ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
                            className="rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer"
                            style={{
                              background: isFirst ? 'linear-gradient(135deg, rgba(18,112,183,0.04), #FFFFFF)' : '#FFFFFF',
                              border: isFirst ? '2px solid rgba(18,112,183,0.2)' : '1px solid rgba(0,0,0,0.04)',
                              borderRadius: 20,
                              boxShadow: isFirst ? '0 8px 32px rgba(18,112,183,0.12), 0 2px 8px rgba(18,112,183,0.06)' : '0 2px 12px rgba(0,0,0,0.03)',
                            }}
                            onClick={() => { setSelectedAssessment(v); setShowAssessmentOptions(true) }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = isFirst ? '0 12px 40px rgba(18,112,183,0.2)' : '0 12px 40px rgba(0,0,0,0.08)' }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0px)'; e.currentTarget.style.boxShadow = isFirst ? '0 8px 32px rgba(18,112,183,0.12), 0 2px 8px rgba(18,112,183,0.06)' : '0 2px 12px rgba(0,0,0,0.03)' }}
                          >
                            <div className="flex gap-0">
                              <div className="w-1.5 flex-shrink-0" style={{ background: statusColor, borderRadius: '20px 0 0 20px' }} />
                              <div className="flex-1">
                                <div className="flex items-center justify-between px-6 py-4" style={{
                                  background: isFirst ? 'linear-gradient(135deg, rgba(18,112,183,0.06), rgba(18,112,183,0.02))' : 'transparent',
                                  borderBottom: '1px solid rgba(0,0,0,0.04)',
                                }}>
                                  <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: statusBg }}>
                                      <BarChart2 size={20} style={{ color: statusColor }} />
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2.5">
                                        <p className="text-base font-bold" style={{ color: '#0D1B2A' }}>{v.date}</p>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ background: statusBg, color: statusColor }}>
                                          {status}
                                        </span>
                                      </div>
                                      {isFirst && (
                                        <p className="text-[10px] mt-0.5 font-semibold" style={{ color: '#1270B7' }}>Última valoración</p>
                                      )}
                                    </div>
                                  </div>
                                  {isFirst && (
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'linear-gradient(135deg, #1270B7, #7ec8e3)', boxShadow: '0 4px 12px rgba(18,112,183,0.3)' }}>
                                      <span className="text-[10px] font-bold text-white">Más reciente</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  )}
                  {currentTab === 'documents' && (
                    <div className="grid grid-cols-3 gap-6 h-full">
                      {[
                        {
                          title: 'Documentos Legales',
                          desc: 'Contratos y consentimientos firmados',
                          docs: [
                            { name: 'Contrato Firmado', date: '15 Ene 2026', signed: true, originalName: 'contrato_firmado_v2.pdf' },
                            { name: 'Aceptación de Tratamiento de Datos', date: '15 Ene 2026', signed: true, originalName: 'aceptacion_datos_2026.pdf' },
                          ],
                        },
                        {
                          title: 'Informes Médicos',
                          desc: 'Certificados y expedientes médicos',
                          docs: [
                            { name: 'Certificado EPS', date: '20 Ene 2026', signed: true, originalName: 'certificado_eps_2026.pdf' },
                            { name: 'Historia Clínica', date: '22 Ene 2026', signed: true, originalName: 'historia_clinica.pdf' },
                          ],
                        },
                        {
                          title: 'Lesiones y Seguimiento',
                          desc: 'Reportes de lesiones y recuperación',
                          docs: [
                            { name: 'Reporte de Lesión - Tobillo', date: '12 Feb 2026', signed: true, originalName: 'reporte_tobillo.pdf' },
                            { name: 'Seguimiento de Recuperación', date: '28 Feb 2026', signed: true, originalName: 'seguimiento_recuperacion.pdf' },
                          ],
                        },
                      ].map((section, si) => (
                          <motion.div
                            key={section.title}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: si * 0.1 }}
                            className="rounded-2xl p-5 flex flex-col"
                            style={{
                              background: 'rgba(255,255,255,0.6)',
                              backdropFilter: 'blur(16px)',
                              WebkitBackdropFilter: 'blur(16px)',
                              border: '1px solid rgba(255,255,255,0.7)',
                              borderRadius: 20,
                              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                            }}
                          >
                            <div className="flex items-start gap-3 mb-5">
                              <div className="w-14 h-14 flex-shrink-0">
                                {si === 0 ? <ScalesOfJusticeView /> : si === 1 ? <StethoscopeView /> : <KitView />}
                              </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-[#0D1B2A] text-lg font-bold">{section.title}</h3>
                              <p className="text-sm mt-0.5" style={{ color: '#0D1B2A' }}>{section.desc}</p>
                            </div>
                          </div>
                          <div className="flex-1 space-y-4">
                            {section.docs.map((doc, di) => (
                              doc.signed ? (
                                <motion.div
                                  key={di}
                                  initial={{ opacity: 0, x: -6 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: si * 0.1 + di * 0.06 }}
                                  className="rounded-xl p-5 transition-all duration-300 cursor-pointer relative overflow-hidden"
                                  style={{
                                    background: '#FFFFFF',
                                    border: '1px solid rgba(0,0,0,0.06)',
                                  }}
                                  onMouseEnter={(e) => {
                                    setOpenMenuDoc(`${si}-${di}`)
                                    e.currentTarget.style.transform = 'scale(1.02)'
                                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'
                                  }}
                                  onMouseLeave={(e) => {
                                    setOpenMenuDoc(null)
                                    e.currentTarget.style.transform = 'scale(1)'
                                    e.currentTarget.style.boxShadow = 'none'
                                  }}
                                >
                                  <div className={`transition-all duration-300 ${openMenuDoc === `${si}-${di}` ? 'opacity-0' : 'opacity-100'}`}>
                                    <div className="flex items-center gap-3 mb-2">
                                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(230,57,70,0.06)' }}>
                                        <FileText size={16} style={{ color: '#E63946' }} />
                                      </div>
                                      <div>
                                        <p className="text-[#0D1B2A] text-sm font-semibold leading-tight">{doc.name}</p>
                                        <p className="text-[10px] mt-0.5" style={{ color: 'rgba(0,0,0,0.5)' }}>{doc.date}</p>
                                        <p className="text-[10px] mt-0.5 font-mono" style={{ color: 'rgba(0,0,0,0.35)' }}>{doc.originalName}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl transition-all duration-300 ${openMenuDoc === `${si}-${di}` ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} style={{ background: 'radial-gradient(circle at 20% 30%, rgba(230,57,70,0.08), rgba(230,57,70,0.02) 50%, rgba(255,255,255,0.95) 70%)', backdropFilter: 'blur(4px)' }}
                                    onClick={() => {
                                      setFileModalData({ name: doc.name, date: doc.date })
                                      setFileModalOpen(true)
                                    }}
                                  >
                                    <Eye size={28} style={{ color: '#E63946' }} />
                                    <span className="text-xs font-semibold" style={{ color: '#E63946' }}>Ver contenido</span>
                                  </div>
                                </motion.div>
                              ) : (
                                <motion.div
                                  key={di}
                                  initial={{ opacity: 0, x: -6 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: si * 0.1 + di * 0.06 }}
                                  className="rounded-xl p-4 transition-all cursor-pointer"
                                  style={{
                                    background: 'rgba(230,57,70,0.04)',
                                    border: '1px dashed rgba(230,57,70,0.25)',
                                  }}
                                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(230,57,70,0.12)' }}
                                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(230,57,70,0.1)' }}>
                                      <FileText size={14} style={{ color: '#E63946' }} />
                                    </div>
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md" style={{ background: 'rgba(230,57,70,0.1)', color: '#C62828' }}>
                                      Pendiente
                                    </span>
                                  </div>
                                  <p className="text-[#0D1B2A] text-sm font-semibold">{doc.name}</p>
                                  <p className="text-[11px] mt-1" style={{ color: '#C62828' }}>Este documento aún no ha sido entregado</p>
                                  <button
                                    className="mt-3 w-full py-2 rounded-xl text-xs font-bold transition-all"
                                    style={{ background: '#E63946', color: '#FFFFFF' }}
                                  >
                                    Solicitar
                                  </button>
                                </motion.div>
                              )
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
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
                        { label: 'Email', value: student.email },
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
              onClick={() => { setShowNewValuationModal(false); setValuationSuccess(false); setValuationStep(1) }}
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
                  <div className="flex justify-end">
                    <motion.button
                      initial="rest"
                      whileHover="hover"
                      whileTap="tap"
                      variants={{
                        rest: { scale: 1, background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.3)' },
                        hover: { scale: 1.15, background: 'rgba(244,56,67,0.1)', color: '#F43843' },
                        tap: { scale: 0.9 },
                      }}
                      onClick={() => { setShowNewValuationModal(false); setValuationSuccess(false); setValuationStep(1) }}
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
                                  whileHover={!disabled ? { scale: 1.06 } : {}}
                                  whileTap={!disabled ? { scale: 0.95 } : {}}
                                  onClick={() => {
                                    if (disabled) return
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
                                  whileHover={!selected ? { scale: 1.06 } : {}}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => {
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
                                  whileHover={!selected ? { scale: 1.06 } : {}}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => {
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
                  <div className="flex items-center justify-between">
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
                          } else {
                            setLastValuationObjectives(valuationForm.objetivoTarjetas.length)
                            setValuationSuccess(true)
                          }
                        }}
                        className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
                        style={{
                          background: valuationStep === 6 ? 'linear-gradient(135deg, #22C55E, #16A34A)' : 'linear-gradient(135deg, #1270B7, #7ec8e3)',
                        }}
                      >
                        {valuationStep === 6 ? (
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
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                onClick={e => e.stopPropagation()}
              >
                <div className="flex gap-6">
                  <motion.button
                    whileHover={{ scale: 1.04, y: -6 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { setShowAssessmentOptions(false); setShowValuationModal(true) }}
                    className="relative w-72 h-80 rounded-3xl flex flex-col items-center justify-end p-8 overflow-hidden cursor-pointer"
                    style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
                  >
                    <div className="absolute inset-0" style={{
                      background: `linear-gradient(135deg, ${selectedAssessment.color}22, ${selectedAssessment.color}11)`,
                    }} />
                    <div className="absolute inset-0 pointer-events-none" style={{
                      background: `linear-gradient(to top, ${selectedAssessment.color} 0%, ${selectedAssessment.color}dd 50%, rgba(0,0,0,0.5) 100%)`,
                    }} />
                    <div className="relative z-10 flex flex-col items-center">
                      <BarChart2 size={40} className="text-white mb-3" />
                      <span className="text-xl font-extrabold text-white tracking-tight">Ver Valoración</span>
                      <span className="text-[11px] text-white/60 mt-1">Detalles de la evaluación</span>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.04, y: -6 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { setShowAssessmentOptions(false); setShowRoutineViewModal(true) }}
                    className="relative w-72 h-80 rounded-3xl flex flex-col items-center justify-end p-8 overflow-hidden cursor-pointer"
                    style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
                  >
                    <div className="absolute inset-0" style={{
                      background: 'linear-gradient(135deg, rgba(48,209,88,0.13), rgba(48,209,88,0.06))',
                    }} />
                    <div className="absolute inset-0 pointer-events-none" style={{
                      background: 'linear-gradient(to top, rgba(26,138,63,0.95) 0%, rgba(48,209,88,0.6) 50%, rgba(0,0,0,0.5) 100%)',
                    }} />
                    <div className="relative z-10 flex flex-col items-center">
                      <Dumbbell size={40} className="text-white mb-3" />
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

                <div className="flex items-center justify-center mb-6">
                  <div className="relative flex-shrink-0" style={{ width: 80, height: 80 }}>
                    <svg viewBox="0 0 36 36" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="2.8" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke={selectedAssessment.color} strokeWidth="2.8" strokeLinecap="round"
                        strokeDasharray={`${selectedAssessment.score * 0.999} ${100 - selectedAssessment.score * 0.999}`} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-lg font-extrabold" style={{ color: selectedAssessment.color }}>{selectedAssessment.score}%</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {selectedAssessment.metrics.map((m: any) => (
                    <div key={m.label} className="rounded-xl p-3 flex items-center justify-between" style={{ background: 'rgba(0,0,0,0.02)' }}>
                      <span className="text-[11px] font-medium" style={{ color: 'rgba(0,0,0,0.4)' }}>{m.label}</span>
                      <span className="text-sm font-bold" style={{ color: '#0D1B2A' }}>{m.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(0,0,0,0.5)' }}>
                      <Dumbbell size={14} />
                      {selectedAssessment.routine}
                    </div>
                    <button
                      onClick={() => setShowValuationModal(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                      style={{ background: 'rgba(0,0,0,0.04)', color: '#0D1B2A', border: '1px solid rgba(0,0,0,0.06)' }}
                    >
                      Cerrar
                    </button>
                  </div>
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
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
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
              onClick={() => setShowNewRoutineModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-4xl rounded-3xl p-6 flex flex-col max-h-[86vh]"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 24px 80px rgba(0,0,0,0.12)',
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(48,209,88,0.12)' }}>
                      <Dumbbell size={22} style={{ color: '#30D158' }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold" style={{ color: '#0D1B2A' }}>Nueva Rutina</h3>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.4)' }}>Paso {routineStep} de 2</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {aiGeneratedRoutine && (
                      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: 'rgba(48,209,88,0.08)', border: '1px solid rgba(48,209,88,0.15)' }}>
                        <Sparkles size={12} style={{ color: '#1A8A3F' }} />
                        <span className="text-[11px] font-bold" style={{ color: '#1A8A3F' }}>Generada por IA</span>
                      </div>
                    )}
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowNewRoutineModal(false)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.04)' }}>
                      <X size={16} style={{ color: 'rgba(0,0,0,0.4)' }} />
                    </motion.button>
                  </div>
                </div>

                <div className="flex gap-1.5 mb-6">
                  {[1, 2].map(s => (
                    <div key={s} className="flex-1 h-1.5 rounded-full transition-all" style={{
                      background: s <= routineStep ? 'linear-gradient(90deg, #30D158, #00C7BE)' : 'rgba(0,0,0,0.06)',
                    }} />
                  ))}
                </div>

                {routineStep === 1 && (
                  <div className="space-y-5 px-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                    <p className="text-sm font-semibold" style={{ color: 'rgba(0,0,0,0.55)' }}>
                      {aiGeneratedRoutine
                        ? 'Ajusta los parámetros generales de la rutina (prellenados según la valoración).'
                        : 'Configura los parámetros generales de la rutina.'}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.5)' }}>Duración</label>
                        <select
                          value={routineForm.duration}
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
                        <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.5)' }}>Frecuencia</label>
                        <select
                          value={routineForm.frequency}
                          onChange={e => setRoutineForm(p => ({ ...p, frequency: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all appearance-none"
                          style={{
                            background: 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)',
                            color: '#1A1A1E',
                            border: '1px solid transparent',
                          }}
                        >
                          <option value="">Seleccionar</option>
                          <option value="3 días/semana">3 días/semana</option>
                          <option value="4 días/semana">4 días/semana</option>
                          <option value="5 días/semana">5 días/semana</option>
                          <option value="6 días/semana">6 días/semana</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.5)' }}>Nivel</label>
                        <select
                          value={routineForm.level}
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
                    {aiGeneratedRoutine && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl p-4"
                        style={{ background: 'rgba(48,209,88,0.05)', border: '1px solid rgba(48,209,88,0.15)' }}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <Sparkles size={13} style={{ color: '#1A8A3F' }} />
                          <p className="text-xs font-bold" style={{ color: '#0D1B2A' }}>{aiGeneratedRoutine.name}</p>
                        </div>
                        <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(0,0,0,0.5)' }}>{aiGeneratedRoutine.description}</p>
                      </motion.div>
                    )}
                  </div>
                )}

                {routineStep === 2 && (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold" style={{ color: 'rgba(0,0,0,0.5)' }}>Selecciona los ejercicios para esta rutina</p>
                    {routineExercises.map((ex, i) => (
                      <motion.div
                        key={ex.name}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer"
                        style={{
                          background: i % 2 === 0 ? 'rgba(0,0,0,0.02)' : 'transparent',
                          border: '1px solid rgba(0,0,0,0.04)',
                        }}
                      >
                        <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{
                          background: 'rgba(48,209,88,0.15)',
                          color: '#30D158',
                        }}>
                          <Check size={12} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold" style={{ color: '#0D1B2A' }}>{ex.name}</p>
                          <p className="text-[10px]" style={{ color: 'rgba(0,0,0,0.4)' }}>{ex.muscle} · {ex.difficulty}</p>
                        </div>
                        <span className="text-sm font-medium" style={{ color: 'rgba(0,0,0,0.4)' }}>{ex.sets}×{ex.reps}</span>
                      </motion.div>
                    ))}
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
                  <button
                    onClick={() => {
                      if (routineStep < 2) {
                        setRoutineStep(s => s + 1)
                      } else {
                        setShowNewRoutineModal(false)
                        setRoutineStep(1)
                        setRoutineForm({ name: '', description: '', duration: '', frequency: '', level: 'Intermedio' })
                      }
                    }}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
                    style={{
                      background: routineStep === 2 && !routineForm.name ? 'rgba(48,209,88,0.3)' : 'linear-gradient(135deg, #30D158, #1A8A3F)',
                      color: '#FFFFFF',
                    }}
                    disabled={routineStep === 1 && !routineForm.name}
                  >
                    {routineStep === 2 ? 'Crear Rutina' : 'Siguiente'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
    </>
  )
}
