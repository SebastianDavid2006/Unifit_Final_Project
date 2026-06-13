import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as ReTooltip, ResponsiveContainer, Cell,
} from 'recharts'
import {
  LayoutDashboard, Users, ClipboardList, BarChart2, Dumbbell, Calendar,
  TrendingUp, AlertTriangle, Clock, Activity, Target, Award,
  ChevronRight, Search, Plus, ArrowUp, ArrowDown, Sparkles,
  Play, MoreHorizontal, CheckCircle, Flame, MapPin, RefreshCw, Bell, ChevronDown, BarChart3, Settings, Menu,
} from 'lucide-react'
import { StudentProfile } from './StudentProfile'
import coachImg from '../../assets/illustrations/dashboard/coach.png'

// ── Colors ──

const RED = '#F43843'
const BLUE = '#1270B7'
const YELLOW = '#F1C827'
const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #1A8CDB, #0D5F9E)'
const YELLOW_GRAD = 'linear-gradient(135deg, #F1C827, #FFD60A, #D4A800)'
const RED_GRAD = 'linear-gradient(135deg, #F43843, #FF6B8A, #CC0033)'

// ── Data ──

const weeklyData = [
  { day: 'Lun', asistentes: 45, objetivo: 60 },
  { day: 'Mar', asistentes: 67, objetivo: 60 },
  { day: 'Mié', asistentes: 52, objetivo: 60 },
  { day: 'Jue', asistentes: 78, objetivo: 60 },
  { day: 'Vie', asistentes: 89, objetivo: 60 },
  { day: 'Sáb', asistentes: 34, objetivo: 60 },
  { day: 'Dom', asistentes: 12, objetivo: 60 },
]

const adherenceByFaculty = [
  { faculty: 'Ingeniería', value: 87, students: 42 },
  { faculty: 'Medicina', value: 73, students: 38 },
  { faculty: 'Derecho', value: 61, students: 29 },
  { faculty: 'Administración', value: 78, students: 35 },
  { faculty: 'Arte', value: 54, students: 18 },
  { faculty: 'Ciencias', value: 69, students: 22 },
]

const students = [
  { id: 1, name: 'Ana García Martínez', faculty: 'Ingeniería', adherence: 92, risk: 'low' as const, lastVisit: 'Hoy, 7:30 AM', avatar: 'AG', goal: 'Pérdida de peso', sessions: 24, weight: 62, height: 165 },
  { id: 2, name: 'Carlos Rodríguez', faculty: 'Medicina', adherence: 34, risk: 'high' as const, lastVisit: 'Hace 12 días', avatar: 'CR', goal: 'Fuerza', sessions: 8, weight: 78, height: 178 },
  { id: 3, name: 'María Fernández', faculty: 'Derecho', adherence: 78, risk: 'low' as const, lastVisit: 'Ayer', avatar: 'MF', goal: 'Resistencia', sessions: 19, weight: 58, height: 162 },
  { id: 4, name: 'Diego López', faculty: 'Administración', adherence: 51, risk: 'medium' as const, lastVisit: 'Hace 5 días', avatar: 'DL', goal: 'Masa muscular', sessions: 14, weight: 82, height: 181 },
  { id: 5, name: 'Valentina Torres', faculty: 'Ciencias', adherence: 88, risk: 'low' as const, lastVisit: 'Hoy, 9:15 AM', avatar: 'VT', goal: 'Flexibilidad', sessions: 31, weight: 55, height: 160 },
  { id: 6, name: 'Sebastián Herrera', faculty: 'Ingeniería', adherence: 22, risk: 'high' as const, lastVisit: 'Hace 18 días', avatar: 'SH', goal: 'Cardio', sessions: 4, weight: 91, height: 183 },
  { id: 7, name: 'Luisa Mendoza', faculty: 'Arte', adherence: 95, risk: 'low' as const, lastVisit: 'Hoy, 6:00 AM', avatar: 'LM', goal: 'Bienestar', sessions: 42, weight: 60, height: 168 },
]

const kpis = [
  { label: 'Asistencia Hoy', value: '78', unit: '%', change: +5.2, icon: Users, color: BLUE },
  { label: 'Activos', value: '156', unit: '', change: +12, icon: Activity, color: BLUE },
  { label: 'Entrenamientos', value: '43', unit: '/día', change: -2, icon: Dumbbell, color: YELLOW },
  { label: 'Progreso Prom.', value: '68', unit: '%', change: +3.1, icon: TrendingUp, color: BLUE },
  { label: 'En Riesgo', value: '12', unit: '', change: -3, icon: AlertTriangle, color: RED },
  { label: 'Hora Pico', value: '5PM', unit: '', change: 0, icon: Clock, color: YELLOW },
  { label: 'Adherencia', value: '73', unit: '%', change: +1.8, icon: Target, color: BLUE },
  { label: 'Rendimiento', value: '82', unit: '/100', change: +4, icon: Award, color: YELLOW },
]

const routines = [
  { id: 1, name: 'Hipertrofia Superior', category: 'Fuerza', exercises: 8, duration: '60 min', level: 'Avanzado', assigned: 24 },
  { id: 2, name: 'Cardio HIIT', category: 'Cardiovascular', exercises: 6, duration: '45 min', level: 'Intermedio', assigned: 31 },
  { id: 3, name: 'Movilidad y Flexibilidad', category: 'Funcional', exercises: 10, duration: '40 min', level: 'Básico', assigned: 18 },
  { id: 4, name: 'Full Body Fuerza', category: 'Fuerza', exercises: 9, duration: '75 min', level: 'Intermedio', assigned: 29 },
  { id: 5, name: 'Core & Estabilidad', category: 'Funcional', exercises: 7, duration: '30 min', level: 'Básico', assigned: 22 },
]

const equipment = [
  { id: 1, name: 'Cinta de Correr A1', zone: 'Cardio', status: 'active', usage: 87, maintenance: '15 Jun' },
  { id: 2, name: 'Rack Multipower', zone: 'Pesas Libres', status: 'active', usage: 93, maintenance: '20 Jun' },
  { id: 3, name: 'Bicicleta Spinning B3', zone: 'Cardio', status: 'maintenance', usage: 0, maintenance: 'En mantenimiento' },
  { id: 4, name: 'Press de Banca', zone: 'Pesas Libres', status: 'active', usage: 72, maintenance: '25 Jun' },
  { id: 5, name: 'Elíptica C2', zone: 'Cardio', status: 'active', usage: 65, maintenance: '18 Jun' },
  { id: 6, name: 'Cable Crossover', zone: 'Máquinas', status: 'alert', usage: 45, maintenance: 'Revisión pendiente' },
]

const TIME_SLOTS = ['6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM']
const WEEK_DAYS = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB']

const weekSchedule: Record<string, { day: string; slots: { time: string; student: string; avatar: string }[] }> = {
  'LUN': {
    day: 'LUN', slots: [
      { time: '8:00 AM', student: 'Ana García', avatar: 'AG' },
      { time: '10:00 AM', student: 'Carlos Ruiz', avatar: 'CR' },
      { time: '10:00 AM', student: 'María López', avatar: 'ML' },
    ]
  },
  'MAR': {
    day: 'MAR', slots: [
      { time: '7:00 AM', student: 'Pedro Sánchez', avatar: 'PS' },
      { time: '9:00 AM', student: 'Laura Vega', avatar: 'LV' },
    ]
  },
  'MIÉ': {
    day: 'MIÉ', slots: [
      { time: '8:00 AM', student: 'Sofía Torres', avatar: 'ST' },
      { time: '11:00 AM', student: 'Diego Ramírez', avatar: 'DR' },
      { time: '4:00 PM', student: 'Valentina Paz', avatar: 'VP' },
    ]
  },
  'JUE': {
    day: 'JUE', slots: [
      { time: '6:00 AM', student: 'Andrés Nava', avatar: 'AN' },
      { time: '8:00 AM', student: 'Camila Rojas', avatar: 'CR' },
    ]
  },
  'VIE': {
    day: 'VIE', slots: [
      { time: '10:00 AM', student: 'Fernando Gil', avatar: 'FG' },
      { time: '2:00 PM', student: 'Gabriela Paz', avatar: 'GP' },
    ]
  },
  'SÁB': {
    day: 'SÁB', slots: [
      { time: '9:00 AM', student: 'Ricardo Méndez', avatar: 'RM' },
    ]
  },
}

// ── Shared Components ──

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(0,0,0,0.06)',
      borderRadius: 14,
      padding: '12px 18px',
      boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
    }}>
      <p style={{ color: 'rgba(0,0,0,0.35)', fontSize: 11, marginBottom: 4, fontWeight: 500 }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || '#1A1A1E', fontSize: 14, fontWeight: 700 }}>
          {p.value} <span style={{ color: 'rgba(0,0,0,0.3)', fontWeight: 400, fontSize: 12 }}>{p.name}</span>
        </p>
      ))}
    </div>
  )
}

function RiskBadge({ risk }: { risk: 'high' | 'medium' | 'low' }) {
  const cfg = {
    high: { bg: 'rgba(255,59,48,0.08)', color: '#FF3B30', label: 'Alto Riesgo', border: 'rgba(255,59,48,0.15)' },
    medium: { bg: 'rgba(255,149,0,0.08)', color: '#FF9500', label: 'Alerta', border: 'rgba(255,149,0,0.15)' },
    low: { bg: 'rgba(48,209,88,0.08)', color: '#30D158', label: 'Activo', border: 'rgba(48,209,88,0.15)' },
  }[risk]
  return (
    <span
      className="px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide"
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
    >
      {cfg.label}
    </span>
  )
}

type Section = 'dashboard' | 'students' | 'routines' | 'assessments' | 'equipment' | 'schedule' | 'stats' | 'configuration'

const sidebarItems: { id: Section; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'students', label: 'Estudiantes', icon: Users },
  { id: 'routines', label: 'Rutinas', icon: ClipboardList },
  { id: 'assessments', label: 'Valoraciones', icon: BarChart2 },
  { id: 'equipment', label: 'Máquinas', icon: Dumbbell },
  { id: 'schedule', label: 'Agenda', icon: Calendar },
  { id: 'stats', label: 'Estadísticas', icon: BarChart3 },
  { id: 'configuration', label: 'Configuración', icon: Settings },
]

interface Assessment {
  id: number
  studentId: number
  studentName: string
  studentAvatar: string
  date: string
  weight: number
  height: number
  imc: number
  notes: string
  status: 'pending' | 'completed'
}

export function TrainerDashboard() {
  const [section, setSection] = useState<Section>('dashboard')
  const [expanded, setExpanded] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<typeof students[0] | null>(null)
  const [search, setSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [scheduleStart, setScheduleStart] = useState('')
  const [scheduleEnd, setScheduleEnd] = useState('')
  const [selectedSlots, setSelectedSlots] = useState<string[]>([])
  const [showAssessmentModal, setShowAssessmentModal] = useState(false)
  const [assessmentStudent, setAssessmentStudent] = useState('')
  const [assessmentDate, setAssessmentDate] = useState(new Date().toISOString().split('T')[0])
  const [assessmentWeight, setAssessmentWeight] = useState('')
  const [assessmentHeight, setAssessmentHeight] = useState('')
  const [assessmentNotes, setAssessmentNotes] = useState('')
  const [assessments, setAssessments] = useState<Assessment[]>([])

  // ── Gym Configuration ──
  const [gymName, setGymName] = useState('Gimnasio Universitario UNIFIT')
  const [gymAddress, setGymAddress] = useState('Av. Universidad 123, Campus Central')
  const [gymPhone, setGymPhone] = useState('+1 (555) 123-4567')
  const [gymEmail, setGymEmail] = useState('contacto@gimnasio.universidad.edu')
  const [openTime, setOpenTime] = useState('06:00')
  const [closeTime, setCloseTime] = useState('22:00')
  const [maxCapacity, setMaxCapacity] = useState('150')
  const [machinesCount, setMachinesCount] = useState('24')
  const [trainersCount, setTrainersCount] = useState('8')
  const [showSavedToast, setShowSavedToast] = useState(false)
  const [instagram, setInstagram] = useState('@unifit_gym')
  const [facebook, setFacebook] = useState('UNIFIT Gym')
  const [website, setWebsite] = useState('www.unifit.edu/gimnasio')
  const [planBasic, setPlanBasic] = useState('$200/mes')
  const [planPremium, setPlanPremium] = useState('$350/mes')
  const [planVip, setPlanVip] = useState('$500/mes')
  const [openWeekends, setOpenWeekends] = useState(true)
  const [towelService, setTowelService] = useState(true)
  const [lockerService, setLockerService] = useState(true)
  const [checkInRequired, setCheckInRequired] = useState(true)
  const [emergencyContact, setEmergencyContact] = useState('+1 (555) 999-8888')
  const [emergencyName, setEmergencyName] = useState('Dr. Roberto Méndez')
  const [taxId, setTaxId] = useState('GIM-UNI-2024-001')
  const [businessName, setBusinessName] = useState('Universidad Nacional - Depto. Deportes')
  const [wifiSsid, setWifiSsid] = useState('UNIFIT-GYM')
  const [wifiPass, setWifiPass] = useState('unifit2024')
  const [allowGuestAccess, setAllowGuestAccess] = useState(false)
  const [maxBookingDays, setMaxBookingDays] = useState('7')
  const [minAge, setMinAge] = useState('15')

  if (selectedStudent) {
    return <StudentProfile student={selectedStudent} onBack={() => setSelectedStudent(null)} />
  }

  const filtered = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.faculty.toLowerCase().includes(search.toLowerCase())
    const matchRisk = riskFilter === 'all' || s.risk === riskFilter
    return matchSearch && matchRisk
  })



  const sectionColor: Record<Section, string> = {
    dashboard: BLUE, students: RED, routines: BLUE, assessments: RED,
    equipment: BLUE, schedule: YELLOW, stats: BLUE, configuration: '#8E8E93',
  }
  const sectionGrad: Record<Section, string> = {
    dashboard: BLUE_GRAD,
    students: RED_GRAD,
    routines: BLUE_GRAD,
    assessments: RED_GRAD,
    equipment: BLUE_GRAD,
    schedule: YELLOW_GRAD,
    stats: BLUE_GRAD,
    configuration: `linear-gradient(90deg, #8E8E93, #AEAEB2, #636366)`,
  }

  return (
    <div className="flex size-full overflow-hidden mesh-bg relative">
      <div className="floating-sphere" style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(18,112,183,0.25), transparent 60%)', top: '-180px', right: '-120px' }} />
      <div className="floating-sphere" style={{ width: 450, height: 450, background: 'radial-gradient(circle, rgba(244,56,67,0.2), transparent 60%)', bottom: '5%', left: '-120px' }} />
      <div className="floating-sphere" style={{ width: 350, height: 350, background: 'radial-gradient(circle, rgba(241,200,39,0.18), transparent 60%)', top: '25%', right: '15%' }} />

      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -8" result="goo" />
          </filter>
        </defs>
      </svg>

      <aside
        className={`${expanded ? 'w-52' : 'w-[68px]'} flex flex-col items-center pt-8 pb-4 gap-1 flex-shrink-0 z-50 relative`}
        style={{
          background: 'linear-gradient(180deg, #0A1A3A 0%, #2A0A10 40%, #101014 65%, #2A1E08 100%)',
          borderRight: '1px solid rgba(255,255,255,0.04)',
          overflow: 'hidden',
          transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 mb-6 hover:bg-white/5 transition-colors"
          style={{ color: 'rgba(255,255,255,0.4)' }}
          title={expanded ? 'Colapsar' : 'Expandir'}
        >
          <Menu size={20} />
        </button>

        <div
          className="flex flex-col w-full relative"
          style={{
            alignItems: 'center',
            paddingLeft: expanded ? 12 : 0,
            paddingRight: expanded ? 12 : 0,
            transition: 'padding 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Gooey layer */}
          <div className="absolute inset-0 flex flex-col items-center pointer-events-none" style={{ filter: 'url(#goo)' }}>
            {sidebarItems.filter(i => i.id !== 'configuration').flatMap((item, i, arr) => {
              const groups = [[arr[0]], [arr[1], arr[3]], [arr[2], arr[4]], [arr[5], arr[6]]]
              const groupIdx = groups.findIndex(g => g.includes(item))
              const isFirstInGroup = groups[groupIdx]?.[0] === item
              return [
                ...(groupIdx > 0 && isFirstInGroup ? [{ type: 'divider' as const, h: 20 }] : []),
                { type: 'indicator' as const, id: item.id, isActive: section === item.id },
              ]
            }).map((entry, idx) =>
              entry.type === 'divider' ? (
                <div key={`div-${idx}`} />
              ) : (
                <div key={entry.id} className="overflow-hidden flex-shrink-0" style={{
                  height: 44,
                  width: expanded ? 184 : 68,
                  borderRadius: expanded ? 10 : 0,
                  transition: 'width 0.45s cubic-bezier(0.4, 0, 0.2, 1), border-radius 0.35s ease',
                }}>
                  {entry.isActive && (
                    <motion.div
                      layoutId="goo-indicator"
                      className="size-full"
                      style={{
                      background: 'linear-gradient(135deg, #e42332, #2b2c8a, #efbb29)',
                      boxShadow: 'inset 0 0 60px rgba(228,35,50,0.35), inset 0 0 120px rgba(43,44,138,0.3), 0 0 30px rgba(228,35,50,0.12), 0 0 60px rgba(43,44,138,0.06)',
                      }}
                      transition={{ type: 'spring', stiffness: 260, damping: 22, mass: 0.6 }}
                    />
                  )}
                </div>
              )
            )}
          </div>
          {/* Buttons layer */}
          {sidebarItems.filter(i => i.id !== 'configuration').flatMap((item, i, arr) => {
            const groups = [[arr[0]], [arr[1], arr[3]], [arr[2], arr[4]], [arr[5], arr[6]]]
            const groupIdx = groups.findIndex(g => g.includes(item))
            const isFirstInGroup = groups[groupIdx]?.[0] === item
            return [
              ...(groupIdx > 0 && isFirstInGroup ? [{ type: 'divider' as const }] : []),
              { type: 'item' as const, item },
            ]
          }).map((entry, idx) =>
            entry.type === 'divider' ? (
              <div key={`div-${idx}`} className="h-px rounded-full my-0.5 flex-shrink-0" style={{
                width: expanded ? 160 : 20,
                background: 'linear-gradient(90deg, rgba(18,112,183,0.12), rgba(244,56,67,0.08), rgba(241,200,39,0.06), transparent)',
                transition: 'width 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
              }} />
            ) : (
              <button
                key={entry.item.id}
                onClick={() => setSection(entry.item.id)}
                title={entry.item.label}
                className="relative flex items-center overflow-hidden flex-shrink-0"
                style={{
                  height: 44,
                  width: expanded ? 184 : 68,
                  paddingLeft: expanded ? 0 : 12,
                  borderRadius: expanded ? 10 : 0,
                  background: 'transparent',
                  color: section === entry.item.id ? '#fff' : 'rgba(255,255,255,0.2)',
                  transition: 'width 0.45s cubic-bezier(0.4, 0, 0.2, 1), padding-left 0.45s cubic-bezier(0.4, 0, 0.2, 1), border-radius 0.35s ease, color 0.3s ease',
                }}
              >
                <div className="flex items-center justify-center w-11 h-11 flex-shrink-0">
                  <entry.item.icon size={19} />
                </div>
                <span style={{
                  opacity: expanded ? 1 : 0,
                  transition: 'opacity 0.3s ease 0.05s',
                  fontSize: 12,
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                }}>
                  {entry.item.label}
                </span>
              </button>
            )
          )}
        </div>

        <div className="w-full mt-auto pt-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}>
          <div
            className="flex flex-col relative"
            style={{
              alignItems: 'center',
              paddingLeft: expanded ? 12 : 0,
              paddingRight: expanded ? 12 : 0,
              transition: 'padding 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {/* Gooey layer */}
            <div className="absolute inset-0 flex flex-col items-center pointer-events-none" style={{ filter: 'url(#goo)' }}>
              {sidebarItems.filter(i => i.id === 'configuration').map(item => (
                <div key={item.id} className="overflow-hidden flex-shrink-0" style={{
                  height: 44,
                  width: expanded ? 184 : 68,
                  borderRadius: expanded ? 10 : 0,
                  transition: 'width 0.45s cubic-bezier(0.4, 0, 0.2, 1), border-radius 0.35s ease',
                }}>
                  {section === item.id && (
                    <motion.div
                      layoutId="goo-indicator"
                      className="size-full"
                      style={{
                      background: 'linear-gradient(135deg, #e42332, #2b2c8a, #efbb29)',
                      boxShadow: 'inset 0 0 60px rgba(228,35,50,0.35), inset 0 0 120px rgba(43,44,138,0.3), 0 0 30px rgba(228,35,50,0.12), 0 0 60px rgba(43,44,138,0.06)',
                      }}
                      transition={{ type: 'spring', stiffness: 260, damping: 22, mass: 0.6 }}
                    />
                  )}
                </div>
              ))}
            </div>
            {/* Buttons layer */}
            {sidebarItems.filter(i => i.id === 'configuration').map(item => (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                title={item.label}
                className="relative flex items-center overflow-hidden flex-shrink-0"
                style={{
                  height: 44,
                  width: expanded ? 184 : 68,
                  paddingLeft: expanded ? 0 : 12,
                  borderRadius: expanded ? 10 : 0,
                  background: 'transparent',
                  color: section === item.id ? '#fff' : 'rgba(255,255,255,0.2)',
                  transition: 'width 0.45s cubic-bezier(0.4, 0, 0.2, 1), padding-left 0.45s cubic-bezier(0.4, 0, 0.2, 1), border-radius 0.35s ease, color 0.3s ease',
                }}
              >
                <div className="flex items-center justify-center w-11 h-11 flex-shrink-0">
                  <item.icon size={19} />
                </div>
                <span style={{
                  opacity: expanded ? 1 : 0,
                  transition: 'opacity 0.3s ease 0.05s',
                  fontSize: 12,
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                }}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div className="flex-1 overflow-y-auto relative z-10">

        <div className="sticky top-0 flex items-center justify-end gap-3 px-7 pt-5 pb-3 z-30">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{
              border: '1px solid rgba(255,255,255,0.35)',
              background: 'rgba(255,255,255,0.25)',
              backdropFilter: 'blur(45px) saturate(1.8)',
              WebkitBackdropFilter: 'blur(45px) saturate(1.8)',
              boxShadow: '0 0 0 0.5px rgba(255,255,255,0.4)',
            }}
          >
            <Bell size={16} style={{ color: 'rgba(0,0,0,0.35)' }} />
            <div className="dot-alert absolute -top-1 -right-1" style={{ width: 8, height: 8 }} />
          </motion.button>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer transition-all"
            style={{
              border: '1px solid rgba(255,255,255,0.35)',
              background: 'rgba(255,255,255,0.25)',
              backdropFilter: 'blur(45px) saturate(1.8)',
              WebkitBackdropFilter: 'blur(45px) saturate(1.8)',
              boxShadow: '0 0 0 0.5px rgba(255,255,255,0.4)',
            }}
          >
            <div
              className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-[10px] font-bold"
              style={{ background: 'linear-gradient(135deg, #F43843, #8B001A)' }}
            >
              SM
            </div>
            <div>
              <p className="text-[#1A1A1E] text-xs font-semibold">Sebastián Morales</p>
              <p style={{ color: 'rgba(0,0,0,0.3)', fontSize: 9 }}>Plataforma de Entrenadores</p>
            </div>
            <ChevronDown size={12} style={{ color: 'rgba(0,0,0,0.2)' }} />
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={section}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {section === 'dashboard' && renderDashboard()}
            {section === 'students' && renderStudents()}
            {section === 'routines' && renderRoutines()}
            {section === 'assessments' && renderAssessments()}
            {section === 'equipment' && renderEquipment()}
            {section === 'schedule' && renderSchedule()}
            {section === 'stats' && renderStats()}
            {section === 'configuration' && renderConfiguration()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )

  // ── DASHBOARD ──

  function renderDashboard() {
    return (
      <div className="p-8 space-y-6 max-w-[1440px] mx-auto relative">
        {/* Hero — Cinematic Banner */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl gradient-border"
          style={{
            background: 'linear-gradient(145deg, #FFFFFF 0%, #F0F7FF 25%, #EBF5FF 50%, #FFF8E8 100%)',
            boxShadow: '0 20px 60px rgba(0,122,255,0.06), 0 8px 20px rgba(0,0,0,0.02)',
          }}
        >
          {/* Clipped container for mesh (keeps rounded corners clean) */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background: `
                radial-gradient(ellipse at 80% 10%, rgba(0,122,255,0.04) 0%, transparent 40%),
                radial-gradient(ellipse at 10% 80%, rgba(245,166,35,0.03) 0%, transparent 40%),
                radial-gradient(ellipse at 50% 50%, rgba(230,57,70,0.02) 0%, transparent 50%)
              `,
              backgroundSize: '200% 200%',
              animation: 'mesh-shift 15s ease-in-out infinite',
            }}
          />
          </div>

          <div className="relative z-10 p-8">
            {/* Top bar */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-1 h-10 rounded-full" style={{ background: BLUE_GRAD }} />
                <div>
                  <p className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: 'rgba(0,0,0,0.25)' }}>
                    Jueves, 28 de Mayo · 2026
                  </p>
                  <h1 className="mt-0.5" style={{ color: '#1A1A1E', fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.04em' }}>
                    Buenos días, <span className="text-gradient-warm">Sebastián.</span>
                  </h1>
                </div>
              </div>
            </div>
 
            {/* AI Insights Grid */}
            <div className="grid grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="col-span-2 rounded-2xl p-6"
                style={{
                  background: 'rgba(255,255,255,0.6)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.4)',
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={15} style={{ color: BLUE }} />
                  <span className="text-[10px] font-bold tracking-[0.12em] uppercase" style={{ color: 'rgba(0,0,0,0.3)' }}>Resumen Inteligente</span>
                  <div className="ml-auto flex items-center gap-1.5">
                    <div className="dot-live" style={{ width: 5, height: 5 }} />
                    <span className="text-[10px]" style={{ color: 'rgba(0,0,0,0.25)' }}>Actualizado ahora</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Users, value: '14', text: 'estudiantes pendientes de revisión', color: RED },
                    { icon: AlertTriangle, value: '3', text: 'en riesgo de abandono requieren atención inmediata', color: '#FF3B30' },
                    { icon: Clock, value: '4PM-6PM', text: 'ocupación máxima proyectada para hoy', color: '#BF5AF2' },
                    { icon: Target, value: '5', text: 'estudiantes de Ingeniería superan 90% adherencia', color: '#30D158' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl nested-card">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}0A` }}>
                        <item.icon size={14} style={{ color: item.color }} />
                      </div>
                      <div>
                        <p className="text-lg font-extrabold" style={{ color: '#1A1A1E', lineHeight: 1.2 }}>{item.value}</p>
                        <p className="text-xs leading-snug mt-0.5" style={{ color: 'rgba(0,0,0,0.45)' }}>{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

          </div>

          {/* Coach image — pops out above the card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            style={{
              position: 'absolute',
              right: 24,
              top: 10,
              width: 440,
              height: 'auto',
              zIndex: 20,
            }}
          >
            <img
              src={coachImg}
              alt="Coach Dashboard"
              className="w-full h-auto"
            />
            <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-10" style={{
              background: 'linear-gradient(to top, transparent 0%, transparent 100%)',
            }} />
          </motion.div>
        </motion.div>

        {/* KPI Cards — with accent tops */}
        <div className="grid grid-cols-4 gap-4">
          {kpis.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="relative rounded-2xl p-5 overflow-hidden group cursor-pointer premium-card"
              style={{ animationDelay: `${0.1 + i * 0.05}s` }}
            >
              {/* Top accent bar */}
              <div className="absolute top-0 left-4 right-4 h-[3px] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500" style={{ background: `linear-gradient(90deg, ${kpi.color}, transparent)` }} />

              {/* Hover radial glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" style={{
                background: `radial-gradient(ellipse at 50% 100%, ${kpi.color}06, transparent 70%)`,
              }} />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${kpi.color}08` }}>
                    <kpi.icon size={17} style={{ color: kpi.color }} />
                  </div>
                  {kpi.change !== 0 && (
                    <div className="flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-lg" style={{
                      background: kpi.change > 0 ? 'rgba(48,209,88,0.08)' : 'rgba(255,59,48,0.08)',
                      color: kpi.change > 0 ? '#30D158' : '#FF3B30',
                      border: `1px solid ${kpi.change > 0 ? 'rgba(48,209,88,0.12)' : 'rgba(255,59,48,0.12)'}`,
                    }}>
                      {kpi.change > 0 ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                      {Math.abs(kpi.change)}<span style={{ fontSize: 9 }}>%</span>
                    </div>
                  )}
                </div>
                <div className="flex items-end gap-1.5">
                  <span className="stat-value text-gradient-static" style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>{kpi.value}</span>
                  <span className="mb-0.5 text-xs font-medium" style={{ color: 'rgba(0,0,0,0.3)' }}>{kpi.unit}</span>
                </div>
                <p className="text-xs mt-1.5 font-semibold" style={{ color: 'rgba(0,0,0,0.45)' }}>{kpi.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="col-span-2 rounded-2xl p-6 premium-card"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-[#1A1A1E] font-bold" style={{ fontSize: '0.95rem' }}>Asistencia Semanal</h3>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.3)' }}>Estudiantes por día</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5 font-medium" style={{ color: 'rgba(0,0,0,0.4)' }}>
                    <span className="w-3 h-0.5 rounded inline-block" style={{ background: BLUE }} />Asistentes
                </span>
                <span className="flex items-center gap-1.5" style={{ color: 'rgba(0,0,0,0.25)' }}>
                  <span className="w-3 h-px rounded inline-block" style={{ background: 'rgba(0,0,0,0.15)' }} />Objetivo
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#007AFF" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="#007AFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
                <XAxis dataKey="day" tick={{ fill: 'rgba(0,0,0,0.25)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(0,0,0,0.25)', fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
                <ReTooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="objetivo" stroke="rgba(0,0,0,0.08)" strokeDasharray="5 4" fill="none" name="Objetivo" />
                <Area type="monotone" dataKey="asistentes" stroke={BLUE} strokeWidth={3} fill="url(#attGrad)" name="Asistentes" dot={false} activeDot={{ r: 7, fill: BLUE, stroke: 'white', strokeWidth: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-2xl p-6 premium-card"
          >
            <h3 className="text-[#1A1A1E] font-bold" style={{ fontSize: '0.95rem' }}>Adherencia por Facultad</h3>
            <p className="text-xs mb-5" style={{ color: 'rgba(0,0,0,0.3)' }}>Promedio semanal</p>
            <div className="space-y-4">
              {adherenceByFaculty.map((item, i) => (
                <motion.div
                  key={item.faculty}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.06 }}
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-semibold" style={{ color: 'rgba(0,0,0,0.45)' }}>{item.faculty}</span>
                    <span className="text-xs font-extrabold" style={{ color: '#1A1A1E' }}>{item.value}%</span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.04)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 0.8, delay: 0.5 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        background: item.value >= 80
                          ? 'linear-gradient(90deg, #30D158, #20A040)'
                          : item.value >= 65
                          ? 'linear-gradient(90deg, #FF9500, #E68600)'
                          : 'linear-gradient(90deg, #FF3B30, #D32F2F)',
                        boxShadow: item.value >= 80 ? '0 0 12px rgba(48,209,88,0.3)' : 'none',
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // ── STUDENTS ──

  function renderStudents() {
    return (
      <div className="p-8 space-y-6 max-w-[1440px] mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[#1A1A1E]">Estudiantes</h2>
            <p className="text-sm mt-1 font-medium" style={{ color: 'rgba(0,0,0,0.35)' }}>{students.length} registrados · <span style={{ color: RED }}>{students.filter(s => s.risk === 'high').length} en riesgo alto</span></p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl" style={{
              background: 'rgba(255,255,255,0.5)',
              border: '1px solid rgba(0,0,0,0.05)',
              backdropFilter: 'blur(12px)',
            }}>
              <Search size={14} style={{ color: 'rgba(0,0,0,0.2)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar estudiante..." className="bg-transparent text-[#1A1A1E] text-sm outline-none w-48 placeholder:text-[rgba(0,0,0,0.2)]" />
            </div>
            <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.04)' }}>
              {(['all', 'high', 'medium', 'low'] as const).map(f => (
                <motion.button key={f} onClick={() => setRiskFilter(f)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                  style={{ background: riskFilter === f ? 'rgba(0,122,255,0.08)' : 'transparent', color: riskFilter === f ? BLUE : 'rgba(0,0,0,0.3)' }}
                >
                  {f === 'all' ? 'Todos' : f === 'high' ? 'Alto Riesgo' : f === 'medium' ? 'Alerta' : 'Activos'}
                </motion.button>
              ))}
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold premium-btn">
              <Plus size={15} /><span>Nuevo Estudiante</span>
            </motion.button>
          </div>
        </div>
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 px-5 mb-2">
          {['Estudiante', '', 'Sesiones', 'Adherencia', 'Última visita', 'Estado'].map((h, i) => (
            <p key={i} className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: 'rgba(0,0,0,0.2)' }}>{h}</p>
          ))}
        </div>
        <div className="space-y-2">
          {filtered.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} onClick={() => setSelectedStudent(s)} whileHover={{ y: -3 }} className="flex items-center gap-4 p-4 rounded-2xl premium-card cursor-pointer">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0" style={{ background: s.risk === 'high' ? 'linear-gradient(135deg, #FF3B30, #D32F2F)' : s.risk === 'medium' ? 'linear-gradient(135deg, #FF9500, #E68600)' : 'linear-gradient(135deg, #30D158, #20A040)', fontSize: 14 }}>{s.avatar}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[#1A1A1E] text-sm font-bold truncate">{s.name}</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.3)' }}>{s.faculty} · {s.goal}</p>
              </div>
              <div className="text-center w-16"><p className="text-[#1A1A1E] text-sm font-extrabold">{s.sessions}</p><p className="text-[10px]" style={{ color: 'rgba(0,0,0,0.25)' }}>sesiones</p></div>
              <div className="w-28">
                <div className="flex justify-between mb-1"><span className="text-[11px]" style={{ color: 'rgba(0,0,0,0.3)' }}>adherencia</span><span className="text-[11px] font-extrabold" style={{ color: '#1A1A1E' }}>{s.adherence}%</span></div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.04)' }}><div className="h-full rounded-full" style={{ width: `${s.adherence}%`, background: s.adherence >= 80 ? '#30D158' : s.adherence >= 60 ? '#FF9500' : '#FF3B30' }} /></div>
              </div>
              <p className="text-xs w-28 text-right" style={{ color: 'rgba(0,0,0,0.3)' }}>{s.lastVisit}</p>
              <div className="flex items-center gap-2"><RiskBadge risk={s.risk} /><ChevronRight size={15} style={{ color: 'rgba(0,0,0,0.12)' }} /></div>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  // ── ROUTINES ──

  function renderRoutines() {
    return (
      <div className="p-8 space-y-6 max-w-[1440px] mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[#1A1A1E]">Rutinas</h2>
            <p className="text-sm mt-1 font-medium" style={{ color: 'rgba(0,0,0,0.35)' }}>{routines.length} rutinas activas en el sistema</p>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold premium-btn"><Plus size={15} /><span>Nueva Rutina</span></motion.button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {routines.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} whileHover={{ y: -4 }} className="rounded-2xl p-6 premium-card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[#1A1A1E] font-bold">{r.name}</p>
                  <p className="text-xs mt-1" style={{ color: 'rgba(0,0,0,0.35)' }}>{r.category} · {r.level}</p>
                </div>
                <motion.button whileHover={{ rotate: 90 }} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.03)' }}><MoreHorizontal size={15} style={{ color: 'rgba(0,0,0,0.25)' }} /></motion.button>
              </div>
              <div className="flex items-center gap-5 mb-5">
                {[{ icon: Dumbbell, value: `${r.exercises} ejercicios`, color: BLUE }, { icon: Clock, value: r.duration, color: YELLOW }, { icon: Users, value: `${r.assigned} asignados`, color: RED }].map((m, j) => (
                  <div key={j} className="flex items-center gap-1.5"><m.icon size={14} style={{ color: m.color }} /><span className="text-xs font-medium" style={{ color: 'rgba(0,0,0,0.5)' }}>{m.value}</span></div>
                ))}
              </div>
              <div className="flex gap-3">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold premium-btn"><Play size={12} /><span>Ver Rutina</span></motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold" style={{ background: 'rgba(0,0,0,0.03)', color: 'rgba(0,0,0,0.5)', border: '1px solid rgba(0,0,0,0.06)' }}><Users size={12} /> Asignar</motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  // ── ASSESSMENTS ──

  function renderAssessments() {
    const assessedThisMonth = assessments.filter(a => {
      const d = new Date(a.date)
      const now = new Date()
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length
    const pendingReview = assessments.filter(a => a.status === 'pending').length
    const completedToday = assessments.filter(a => {
      const d = new Date(a.date)
      const now = new Date()
      return d.toDateString() === now.toDateString() && a.status === 'completed'
    }).length

    // Prevent scroll lock
    if (showAssessmentModal) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''

    return (
      <div className="p-8 space-y-6 max-w-[1440px] mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[#1A1A1E]">Valoraciones Físicas</h2>
            <p className="text-sm mt-1 font-medium" style={{ color: 'rgba(0,0,0,0.35)' }}>Evaluaciones antropométricas y funcionales</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAssessmentModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold premium-btn"
          >
            <Plus size={15} /><span>Nueva Valoración</span>
          </motion.button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Valoraciones este mes', value: `${assessedThisMonth + 34}`, icon: BarChart2, color: BLUE },
            { label: 'Pendientes de revisión', value: `${pendingReview + 8}`, icon: Clock, color: YELLOW },
            { label: 'Completadas hoy', value: `${completedToday + 5}`, icon: CheckCircle, color: RED },
          ].map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-2xl p-6 premium-card">
              <div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${m.color}08` }}><m.icon size={18} style={{ color: m.color }} /></div></div>
              <p className="stat-value text-gradient" style={{ fontSize: '2.2rem', fontWeight: 800, lineHeight: 1 }}>{m.value}</p>
              <p className="text-sm mt-1 font-semibold" style={{ color: 'rgba(0,0,0,0.45)' }}>{m.label}</p>
            </motion.div>
          ))}
        </div>
        <div className="rounded-2xl p-6 premium-card">
          <h3 className="text-[#1A1A1E] font-bold mb-5" style={{ fontSize: '0.95rem' }}>
            Valoraciones Recientes
            {assessments.length > 0 && (
              <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(0,0,0,0.3)', marginLeft: 8 }}>
                ({assessments.length} creadas)
              </span>
            )}
          </h3>
          <div className="space-y-3">
            {[...assessments].reverse().slice(0, 5).map(a => {
              const student = students.find(s => s.id === a.studentId)
              return (
                <div key={a.id} className="flex items-center gap-4 p-4 rounded-xl nested-card">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs" style={{ background: a.status === 'completed' ? 'rgba(48,209,88,0.08)' : 'rgba(255,149,0,0.08)', color: a.status === 'completed' ? '#30D158' : '#FF9500' }}>
                    {a.studentAvatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#1A1A1E] text-sm font-bold">{a.studentName}</p>
                    <p className="text-xs" style={{ color: 'rgba(0,0,0,0.3)' }}>{a.date} · {a.notes ? a.notes.slice(0, 40) + (a.notes.length > 40 ? '...' : '') : 'Sin observaciones'}</p>
                  </div>
                  <p className="text-xs font-medium" style={{ color: 'rgba(0,0,0,0.3)' }}>IMC: {a.imc.toFixed(1)}</p>
                  <p className="text-xs" style={{ color: 'rgba(0,0,0,0.3)' }}>{a.weight} kg · {a.height} cm</p>
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold" style={{
                    background: a.status === 'completed' ? 'rgba(48,209,88,0.08)' : 'rgba(255,149,0,0.08)',
                    color: a.status === 'completed' ? '#30D158' : '#FF9500',
                    border: `1px solid ${a.status === 'completed' ? 'rgba(48,209,88,0.15)' : 'rgba(255,149,0,0.15)'}`,
                  }}>
                    {a.status === 'completed' ? 'Completada' : 'Pendiente'}
                  </span>
                </div>
              )
            })}
            {students.filter(s => !assessments.some(a => a.studentId === s.id)).slice(0, 3).map(s => (
              <div key={s.id} className="flex items-center gap-4 p-4 rounded-xl nested-card">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs" style={{ background: 'linear-gradient(135deg, rgba(230,57,70,0.12), rgba(204,0,51,0.08))', color: RED }}>{s.avatar}</div>
                <p className="flex-1 text-[#1A1A1E] text-sm font-bold">{s.name}</p>
                <p className="text-xs font-medium" style={{ color: 'rgba(0,0,0,0.3)' }}>IMC: {(s.weight / ((s.height / 100) ** 2)).toFixed(1)}</p>
                <p className="text-xs" style={{ color: 'rgba(0,0,0,0.3)' }}>{s.weight} kg · {s.height} cm</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    setAssessmentStudent(s.name)
                    setAssessmentWeight(String(s.weight))
                    setAssessmentHeight(String(s.height))
                    setAssessmentDate(new Date().toISOString().split('T')[0])
                    setShowAssessmentModal(true)
                  }}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold" style={{ background: 'rgba(230,57,70,0.06)', color: RED, border: '1px solid rgba(230,57,70,0.1)' }}
                >Valorar</motion.button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Assessment Modal ── */}
        {showAssessmentModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={() => setShowAssessmentModal(false)}>
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(8px)' }} />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-3xl p-8"
              style={{
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(40px) saturate(1.4)',
                border: '1px solid rgba(255,255,255,0.5)',
                boxShadow: '0 40px 100px rgba(0,0,0,0.12)',
              }}
            >
              <h3 className="text-xl font-extrabold mb-2" style={{ color: '#1A1A1E' }}>Nueva Valoración Física</h3>
              <p className="text-sm mb-6" style={{ color: 'rgba(0,0,0,0.35)' }}>Completa los datos antropométricos del estudiante.</p>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>ESTUDIANTE</label>
                  <select
                    value={assessmentStudent}
                    onChange={e => {
                      setAssessmentStudent(e.target.value)
                      const student = students.find(s => s.name === e.target.value)
                      if (student) {
                        setAssessmentWeight(String(student.weight))
                        setAssessmentHeight(String(student.height))
                      }
                    }}
                    className="w-full p-3.5 rounded-xl text-sm font-medium outline-none"
                    style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: '#1A1A1E' }}
                  >
                    <option value="">Seleccionar estudiante...</option>
                    {students.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>FECHA</label>
                  <input
                    type="date"
                    value={assessmentDate}
                    onChange={e => setAssessmentDate(e.target.value)}
                    className="w-full p-3.5 rounded-xl text-sm font-medium outline-none"
                    style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: '#1A1A1E' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>PESO (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={assessmentWeight}
                      onChange={e => setAssessmentWeight(e.target.value)}
                      placeholder="Ej: 72.5"
                      className="w-full p-3.5 rounded-xl text-sm font-medium outline-none"
                      style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: '#1A1A1E' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>ALTURA (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={assessmentHeight}
                      onChange={e => setAssessmentHeight(e.target.value)}
                      placeholder="Ej: 170"
                      className="w-full p-3.5 rounded-xl text-sm font-medium outline-none"
                      style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: '#1A1A1E' }}
                    />
                  </div>
                </div>

                {assessmentWeight && assessmentHeight && Number(assessmentWeight) > 0 && Number(assessmentHeight) > 0 && (
                  <div className="p-4 rounded-xl" style={{ background: 'rgba(0,122,255,0.04)', border: '1px solid rgba(0,122,255,0.08)' }}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold" style={{ color: 'rgba(0,0,0,0.3)' }}>IMC CALCULADO</span>
                      <span className="text-2xl font-extrabold" style={{ color: BLUE }}>
                        {(Number(assessmentWeight) / ((Number(assessmentHeight) / 100) ** 2)).toFixed(1)}
                      </span>
                    </div>
                    <p className="text-xs mt-1" style={{ color: 'rgba(0,0,0,0.35)' }}>
                      {(Number(assessmentWeight) / ((Number(assessmentHeight) / 100) ** 2)) < 18.5 ? 'Bajo peso' :
                       (Number(assessmentWeight) / ((Number(assessmentHeight) / 100) ** 2)) < 25 ? 'Peso normal' :
                       (Number(assessmentWeight) / ((Number(assessmentHeight) / 100) ** 2)) < 30 ? 'Sobrepeso' :
                       'Obesidad'}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>OBSERVACIONES</label>
                  <textarea
                    value={assessmentNotes}
                    onChange={e => setAssessmentNotes(e.target.value)}
                    placeholder="Notas adicionales sobre la valoración..."
                    rows={3}
                    className="w-full p-3.5 rounded-xl text-sm font-medium outline-none resize-none"
                    style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: '#1A1A1E' }}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowAssessmentModal(false)
                    document.body.style.overflow = ''
                  }}
                  className="flex-1 py-3 rounded-xl text-sm font-bold"
                  style={{ background: 'rgba(0,0,0,0.03)', color: 'rgba(0,0,0,0.4)', border: '1px solid rgba(0,0,0,0.06)' }}
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const student = students.find(s => s.name === assessmentStudent)
                    if (!student || !assessmentWeight || !assessmentHeight) return

                    const weight = Number(assessmentWeight)
                    const height = Number(assessmentHeight)
                    const imc = weight / ((height / 100) ** 2)

                    const newAssess: Assessment = {
                      id: Date.now(),
                      studentId: student.id,
                      studentName: student.name,
                      studentAvatar: student.avatar,
                      date: assessmentDate,
                      weight,
                      height,
                      imc,
                      notes: assessmentNotes,
                      status: 'pending',
                    }
                    setAssessments(prev => [...prev, newAssess])
                    setShowAssessmentModal(false)
                    setAssessmentStudent('')
                    setAssessmentWeight('')
                    setAssessmentHeight('')
                    setAssessmentNotes('')
                    setAssessmentDate(new Date().toISOString().split('T')[0])
                    document.body.style.overflow = ''
                  }}
                  className="flex-1 py-3 rounded-xl text-sm font-bold premium-btn"
                >
                  <span>Guardar Valoración</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    )
  }

  // ── EQUIPMENT ──

  function renderEquipment() {
    return (
      <div className="p-8 space-y-6 max-w-[1440px] mx-auto" style={{
        background: 'linear-gradient(180deg, #E8F4FF 0%, #F5FAFF 50%, #FFFFFF 100%)',
        minHeight: '100%',
      }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-1 h-8 rounded-full" style={{ background: BLUE_GRAD }} />
              <div>
                <h2 className="text-[#1A1A1E]">Gestión de Máquinas</h2>
                <p className="text-sm mt-0.5 font-medium" style={{ color: 'rgba(0,0,0,0.35)' }}>Estado en tiempo real del equipamiento</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {equipment.map((eq, i) => (
            <motion.div key={eq.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -4 }}
              className="relative rounded-2xl p-6 overflow-hidden group"
              style={{
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(28px) saturate(1.4)',
                WebkitBackdropFilter: 'blur(28px) saturate(1.4)',
                border: '1px solid rgba(0,122,255,0.08)',
                boxShadow: '0 2px 8px rgba(0,122,255,0.04), 0 8px 24px rgba(0,0,0,0.02)',
              }}
            >
              <div className="absolute top-0 left-4 right-4 h-[3px] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500" style={{ background: BLUE_GRAD }} />
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: eq.status === 'active' ? 'rgba(48,209,88,0.08)' : eq.status === 'maintenance' ? 'rgba(255,149,0,0.08)' : 'rgba(255,59,48,0.08)' }}>
                  <Dumbbell size={19} style={{ color: eq.status === 'active' ? '#30D158' : eq.status === 'maintenance' ? '#FF9500' : '#FF3B30' }} />
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold" style={{ background: eq.status === 'active' ? 'rgba(48,209,88,0.08)' : eq.status === 'maintenance' ? 'rgba(255,149,0,0.08)' : 'rgba(255,59,48,0.08)', color: eq.status === 'active' ? '#30D158' : eq.status === 'maintenance' ? '#FF9500' : '#FF3B30', border: `1px solid ${eq.status === 'active' ? 'rgba(48,209,88,0.15)' : eq.status === 'maintenance' ? 'rgba(255,149,0,0.15)' : 'rgba(255,59,48,0.15)'}` }}>
                  {eq.status === 'active' ? 'Activo' : eq.status === 'maintenance' ? 'Mantenimiento' : 'Alerta'}
                </span>
              </div>
              <p className="text-[#1A1A1E] font-bold mb-0.5">{eq.name}</p>
              <p className="text-xs mb-4 flex items-center gap-1 font-medium" style={{ color: 'rgba(0,0,0,0.3)' }}><MapPin size={11} style={{ color: BLUE }} /> {eq.zone}</p>
              {eq.status === 'active' && (
                <><div className="flex justify-between mb-1.5"><span className="text-xs" style={{ color: 'rgba(0,0,0,0.3)' }}>Uso diario</span><span className="text-xs font-extrabold" style={{ color: '#1A1A1E' }}>{eq.usage}%</span></div><div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,122,255,0.06)' }}><div className="h-full rounded-full" style={{ width: `${eq.usage}%`, background: eq.usage > 85 ? '#FF3B30' : BLUE_GRAD }} /></div></>
              )}
              <p className="text-xs mt-4 font-medium" style={{ color: 'rgba(0,0,0,0.3)' }}>Mant.: {eq.maintenance}</p>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  // ── SCHEDULE ──

  function renderSchedule() {
    const today = new Date()
    const monday = new Date(today)
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7))
    const weekDates = WEEK_DAYS.map((day, i) => {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      return { label: day, date: d.getDate(), month: d.getMonth() + 1 }
    })

    const activeTimes = TIME_SLOTS.filter(time => {
      const scheduleKeys = Object.keys(weekSchedule)
      return scheduleKeys.some(day => weekSchedule[day].slots.some(slot => slot.time === time))
    })

    // Prevent scroll lock when modal is open
    if (showScheduleModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return (
      <div className="p-8 space-y-6 max-w-[1440px] mx-auto relative">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-1 h-8 rounded-full" style={{ background: YELLOW_GRAD }} />
              <div>
                <h2 className="text-[#1A1A1E]">Agenda Semanal</h2>
                <p className="text-sm mt-0.5 font-medium" style={{ color: 'rgba(0,0,0,0.35)' }}>Gestión de citas y horarios</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowScheduleModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold"
              style={{ background: 'rgba(230,57,70,0.06)', color: RED, border: '1px solid rgba(230,57,70,0.1)' }}
            >
              <Plus size={15} /> Nueva Cita
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-3">
          {weekDates.map((day, i) => {
            const schedule = weekSchedule[day.label]
            const isToday = day.date === today.getDate() && day.month === today.getMonth() + 1
            return (
              <motion.div
                key={day.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl overflow-hidden"
                style={{
                  background: isToday ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.5)',
                  border: isToday ? '2px solid #F5A623' : '1px solid rgba(0,0,0,0.04)',
                  boxShadow: isToday ? '0 4px 20px rgba(245,166,35,0.12)' : 'none',
                }}
              >
                <div className="p-3 text-center" style={{ background: isToday ? 'rgba(245,166,35,0.08)' : 'transparent' }}>
                  <p className="text-[10px] font-bold tracking-wider" style={{ color: isToday ? '#F5A623' : 'rgba(0,0,0,0.25)' }}>{day.label}</p>
                  <p className="text-xl font-extrabold mt-0.5" style={{ color: isToday ? '#F5A623' : 'rgba(0,0,0,0.4)' }}>{day.date}</p>
                </div>
                <div className="p-2 space-y-1.5 min-h-[100px]">
                  {schedule?.slots.map((slot, j) => (
                    <motion.div
                      key={j}
                      whileHover={{ scale: 1.03, x: 2 }}
                      className="p-2 rounded-xl cursor-pointer transition-all"
                      style={{
                        background: 'rgba(245,166,35,0.06)',
                        border: '1px solid rgba(245,166,35,0.12)',
                      }}
                    >
                      <p className="text-[10px] font-bold" style={{ color: '#F5A623' }}>{slot.time}</p>
                      <p className="text-[11px] font-semibold mt-0.5" style={{ color: 'rgba(0,0,0,0.6)' }}>{slot.student}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Upcoming appointments */}
        <div className="rounded-2xl p-6" style={{
          background: 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.4)',
        }}>
          <h3 className="text-[#1A1A1E] font-bold mb-5" style={{ fontSize: '0.95rem' }}>Próximas Citas</h3>
          <div className="space-y-1">
            {[...Object.values(weekSchedule)].flatMap(d => d.slots).slice(0, 5).map((slot, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl" style={{ borderBottom: i < 4 ? '1px solid rgba(0,0,0,0.03)' : 'none' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(245,166,35,0.08)', color: '#F5A623' }}>{slot.avatar}</div>
                <p className="flex-1 text-sm font-bold" style={{ color: '#1A1A1E' }}>{slot.student}</p>
                <p className="text-xs font-medium" style={{ color: 'rgba(0,0,0,0.3)' }}>{slot.time}</p>
                <motion.button whileHover={{ scale: 1.02 }} className="px-3 py-1.5 rounded-lg text-[10px] font-bold" style={{ background: 'rgba(245,166,35,0.06)', color: '#F5A623', border: '1px solid rgba(245,166,35,0.12)' }}>Reprogramar</motion.button>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule Modal */}
        {showScheduleModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={() => setShowScheduleModal(false)}>
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(8px)' }} />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-3xl p-8"
              style={{
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(40px) saturate(1.4)',
                border: '1px solid rgba(255,255,255,0.5)',
                boxShadow: '0 40px 100px rgba(0,0,0,0.12)',
              }}
            >
              <h3 className="text-xl font-extrabold mb-6" style={{ color: '#1A1A1E' }}>Nueva Cita</h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>ESTUDIANTE</label>
                  <select className="w-full p-3.5 rounded-xl text-sm font-medium outline-none" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: '#1A1A1E' }}>
                    <option>Seleccionar estudiante...</option>
                    {students.map(s => <option key={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>FECHA</label>
                    <input type="date" value={scheduleStart} onChange={e => setScheduleStart(e.target.value)}
                      className="w-full p-3.5 rounded-xl text-sm font-medium outline-none" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: '#1A1A1E' }} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>HORA</label>
                    <select className="w-full p-3.5 rounded-xl text-sm font-medium outline-none" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: '#1A1A1E' }}>
                      {TIME_SLOTS.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>DURACIÓN</label>
                  <div className="flex gap-2">
                    {['30 min', '45 min', '60 min', '90 min'].map(d => (
                      <button key={d} className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all" style={{
                        background: scheduleEnd === d ? 'rgba(245,166,35,0.08)' : 'rgba(0,0,0,0.03)',
                        color: scheduleEnd === d ? '#F5A623' : 'rgba(0,0,0,0.3)',
                        border: `1px solid ${scheduleEnd === d ? 'rgba(245,166,35,0.15)' : 'rgba(0,0,0,0.06)'}`,
                      }} onClick={() => setScheduleEnd(d)}>{d}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-bold"
                  style={{ background: 'rgba(0,0,0,0.03)', color: 'rgba(0,0,0,0.4)', border: '1px solid rgba(0,0,0,0.06)' }}>
                  Cancelar
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 rounded-xl text-sm font-bold premium-btn">
                  <span>Programar Cita</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    )
  }

  // ── STATS ──

  function renderStats() {
    return (
      <div className="p-8 space-y-6 max-w-[1440px] mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[#1A1A1E]">Estadísticas</h2>
            <p className="text-sm mt-1 font-medium" style={{ color: 'rgba(0,0,0,0.35)' }}>Métricas avanzadas del gimnasio</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-6 premium-card"
          >
            <h3 className="text-[#1A1A1E] font-bold mb-5" style={{ fontSize: '0.95rem' }}>Distribución por Facultad</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={adherenceByFaculty} layout="vertical" barSize={20} margin={{ left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" horizontal={false} />
                <XAxis type="number" tick={{ fill: 'rgba(0,0,0,0.25)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="faculty" tick={{ fill: 'rgba(0,0,0,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
                <ReTooltip content={<ChartTooltip />} />
                <Bar dataKey="students" radius={[0, 8, 8, 0]}>
                  {adherenceByFaculty.map((entry, i) => (
                    <Cell key={i} fill={entry.value >= 80 ? '#30D158' : entry.value >= 65 ? '#FF9500' : '#FF3B30'} fillOpacity={0.7} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl p-6 premium-card"
          >
            <h3 className="text-[#1A1A1E] font-bold mb-5" style={{ fontSize: '0.95rem' }}>Rendimiento General</h3>
            <div className="space-y-6">
              {[
                { label: 'Asistencia', value: 78, color: BLUE },
                { label: 'Adherencia', value: 73, color: RED },
                { label: 'Ocupación', value: 65, color: YELLOW },
                { label: 'Satisfacción', value: 88, color: BLUE },
              ].map((metric, i) => (
                <div key={metric.label}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-semibold" style={{ color: 'rgba(0,0,0,0.45)' }}>{metric.label}</span>
                    <span className="text-xs font-extrabold" style={{ color: '#1A1A1E' }}>{metric.value}%</span>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.04)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.value}%` }}
                      transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        background: `linear-gradient(90deg, ${metric.color}, ${metric.color}88)`,
                        boxShadow: `0 0 12px ${metric.color}40`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // ── CONFIGURATION ──

  function renderConfiguration() {
    return (
      <div className="p-8 space-y-6 max-w-[1440px] mx-auto">
        {/* Toast */}
        {showSavedToast && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-2xl flex items-center gap-3"
            style={{
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(48,209,88,0.2)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            }}
          >
            <CheckCircle size={18} style={{ color: '#30D158' }} />
            <span className="text-sm font-semibold" style={{ color: '#1A1A1E' }}>Configuración guardada exitosamente</span>
          </motion.div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-1 h-8 rounded-full" style={{ background: 'linear-gradient(180deg, #8E8E93, #AEAEB2)' }} />
              <div>
                <h2 className="text-[#1A1A1E]">Configuración del Gimnasio</h2>
                <p className="text-sm mt-0.5 font-medium" style={{ color: 'rgba(0,0,0,0.35)' }}>Administra la información y parámetros del centro</p>
              </div>
            </div>
          </div>
        </div>

        {/* Información General */}
        <div className="rounded-2xl p-6 premium-card">
          <h3 className="text-[#1A1A1E] font-bold mb-5" style={{ fontSize: '0.95rem' }}>Información General</h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            <div>
              <label className="block text-xs font-bold mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>NOMBRE DEL GIMNASIO</label>
              <input value={gymName} onChange={e => setGymName(e.target.value)} className="w-full p-3.5 rounded-xl text-sm font-medium outline-none transition-all duration-200" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: '#1A1A1E' }} onFocus={e => { e.target.style.borderColor = 'rgba(230,57,70,0.2)'; e.target.style.background = 'rgba(230,57,70,0.02)' }} onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.06)'; e.target.style.background = 'rgba(0,0,0,0.03)' }} />
            </div>
            <div>
              <label className="block text-xs font-bold mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>DIRECCIÓN</label>
              <input value={gymAddress} onChange={e => setGymAddress(e.target.value)} className="w-full p-3.5 rounded-xl text-sm font-medium outline-none transition-all duration-200" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: '#1A1A1E' }} onFocus={e => { e.target.style.borderColor = 'rgba(230,57,70,0.2)'; e.target.style.background = 'rgba(230,57,70,0.02)' }} onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.06)'; e.target.style.background = 'rgba(0,0,0,0.03)' }} />
            </div>
            <div>
              <label className="block text-xs font-bold mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>TELÉFONO</label>
              <input value={gymPhone} onChange={e => setGymPhone(e.target.value)} className="w-full p-3.5 rounded-xl text-sm font-medium outline-none transition-all duration-200" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: '#1A1A1E' }} onFocus={e => { e.target.style.borderColor = 'rgba(230,57,70,0.2)'; e.target.style.background = 'rgba(230,57,70,0.02)' }} onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.06)'; e.target.style.background = 'rgba(0,0,0,0.03)' }} />
            </div>
            <div>
              <label className="block text-xs font-bold mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>CORREO ELECTRÓNICO</label>
              <input value={gymEmail} onChange={e => setGymEmail(e.target.value)} className="w-full p-3.5 rounded-xl text-sm font-medium outline-none transition-all duration-200" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: '#1A1A1E' }} onFocus={e => { e.target.style.borderColor = 'rgba(230,57,70,0.2)'; e.target.style.background = 'rgba(230,57,70,0.02)' }} onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.06)'; e.target.style.background = 'rgba(0,0,0,0.03)' }} />
            </div>
          </div>
        </div>

        {/* Redes Sociales */}
        <div className="rounded-2xl p-6 premium-card">
          <h3 className="text-[#1A1A1E] font-bold mb-5" style={{ fontSize: '0.95rem' }}>Redes Sociales</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>INSTAGRAM</label>
              <input value={instagram} onChange={e => setInstagram(e.target.value)} className="w-full p-3.5 rounded-xl text-sm font-medium outline-none transition-all duration-200" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: '#1A1A1E' }} onFocus={e => { e.target.style.borderColor = 'rgba(230,57,70,0.2)'; e.target.style.background = 'rgba(230,57,70,0.02)' }} onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.06)'; e.target.style.background = 'rgba(0,0,0,0.03)' }} />
            </div>
            <div>
              <label className="block text-xs font-bold mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>FACEBOOK</label>
              <input value={facebook} onChange={e => setFacebook(e.target.value)} className="w-full p-3.5 rounded-xl text-sm font-medium outline-none transition-all duration-200" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: '#1A1A1E' }} onFocus={e => { e.target.style.borderColor = 'rgba(230,57,70,0.2)'; e.target.style.background = 'rgba(230,57,70,0.02)' }} onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.06)'; e.target.style.background = 'rgba(0,0,0,0.03)' }} />
            </div>
            <div>
              <label className="block text-xs font-bold mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>SITIO WEB</label>
              <input value={website} onChange={e => setWebsite(e.target.value)} className="w-full p-3.5 rounded-xl text-sm font-medium outline-none transition-all duration-200" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: '#1A1A1E' }} onFocus={e => { e.target.style.borderColor = 'rgba(230,57,70,0.2)'; e.target.style.background = 'rgba(230,57,70,0.02)' }} onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.06)'; e.target.style.background = 'rgba(0,0,0,0.03)' }} />
            </div>
          </div>
        </div>

        {/* Planes de Membresía */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-2xl p-6 premium-card">
            <h3 className="text-[#1A1A1E] font-bold mb-4" style={{ fontSize: '0.95rem' }}>Membresía Básica</h3>
            <input value={planBasic} onChange={e => setPlanBasic(e.target.value)} className="w-full p-3.5 rounded-xl text-sm font-medium outline-none transition-all duration-200" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: '#1A1A1E' }} onFocus={e => { e.target.style.borderColor = 'rgba(230,57,70,0.2)'; e.target.style.background = 'rgba(230,57,70,0.02)' }} onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.06)'; e.target.style.background = 'rgba(0,0,0,0.03)' }} />
            <p className="text-xs mt-1" style={{ color: 'rgba(0,0,0,0.3)' }}>Precio mensual</p>
          </div>
          <div className="rounded-2xl p-6 premium-card">
            <h3 className="text-[#1A1A1E] font-bold mb-4" style={{ fontSize: '0.95rem' }}>Membresía Premium</h3>
            <input value={planPremium} onChange={e => setPlanPremium(e.target.value)} className="w-full p-3.5 rounded-xl text-sm font-medium outline-none transition-all duration-200" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: '#1A1A1E' }} onFocus={e => { e.target.style.borderColor = 'rgba(230,57,70,0.2)'; e.target.style.background = 'rgba(230,57,70,0.02)' }} onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.06)'; e.target.style.background = 'rgba(0,0,0,0.03)' }} />
            <p className="text-xs mt-1" style={{ color: 'rgba(0,0,0,0.3)' }}>Precio mensual</p>
          </div>
          <div className="rounded-2xl p-6 premium-card">
            <h3 className="text-[#1A1A1E] font-bold mb-4" style={{ fontSize: '0.95rem' }}>Membresía VIP</h3>
            <input value={planVip} onChange={e => setPlanVip(e.target.value)} className="w-full p-3.5 rounded-xl text-sm font-medium outline-none transition-all duration-200" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: '#1A1A1E' }} onFocus={e => { e.target.style.borderColor = 'rgba(230,57,70,0.2)'; e.target.style.background = 'rgba(230,57,70,0.02)' }} onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.06)'; e.target.style.background = 'rgba(0,0,0,0.03)' }} />
            <p className="text-xs mt-1" style={{ color: 'rgba(0,0,0,0.3)' }}>Precio mensual</p>
          </div>
        </div>

        {/* Horarios y Capacidad + Servicios */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl p-6 premium-card">
            <h3 className="text-[#1A1A1E] font-bold mb-5" style={{ fontSize: '0.95rem' }}>Horario de Operación</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>APERTURA</label>
                <input type="time" value={openTime} onChange={e => setOpenTime(e.target.value)} className="w-full p-3.5 rounded-xl text-sm font-medium outline-none transition-all duration-200" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: '#1A1A1E' }} onFocus={e => { e.target.style.borderColor = 'rgba(230,57,70,0.2)'; e.target.style.background = 'rgba(230,57,70,0.02)' }} onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.06)'; e.target.style.background = 'rgba(0,0,0,0.03)' }} />
              </div>
              <div>
                <label className="block text-xs font-bold mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>CIERRE</label>
                <input type="time" value={closeTime} onChange={e => setCloseTime(e.target.value)} className="w-full p-3.5 rounded-xl text-sm font-medium outline-none transition-all duration-200" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: '#1A1A1E' }} onFocus={e => { e.target.style.borderColor = 'rgba(230,57,70,0.2)'; e.target.style.background = 'rgba(230,57,70,0.02)' }} onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.06)'; e.target.style.background = 'rgba(0,0,0,0.03)' }} />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <label className="text-xs font-bold" style={{ color: 'rgba(0,0,0,0.3)' }}>ABRIR FINES DE SEMANA</label>
              <button
                onClick={() => setOpenWeekends(!openWeekends)}
                className="relative w-12 h-7 rounded-full transition-all duration-300"
                style={{ background: openWeekends ? '#30D158' : 'rgba(0,0,0,0.1)' }}
              >
                <div className="absolute w-5 h-5 rounded-full bg-white top-1 transition-all duration-300 shadow-sm" style={{ left: openWeekends ? 26 : 2 }} />
              </button>
            </div>
            <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(48,209,88,0.04)', border: '1px solid rgba(48,209,88,0.1)' }}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold" style={{ color: 'rgba(0,0,0,0.35)' }}>Horas operativas hoy</span>
                <span className="text-sm font-extrabold" style={{ color: '#30D158' }}>
                  {(() => {
                    const open = openTime.split(':').map(Number)
                    const close = closeTime.split(':').map(Number)
                    const hours = (close[0] * 60 + close[1] - open[0] * 60 - open[1]) / 60
                    return `${hours} horas`
                  })()}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-6 premium-card">
            <h3 className="text-[#1A1A1E] font-bold mb-5" style={{ fontSize: '0.95rem' }}>Servicios del Gimnasio</h3>
            <div className="space-y-4">
              {[
                { label: 'Servicio de toallas', value: towelService, set: setTowelService },
                { label: 'Casilleros disponibles', value: lockerService, set: setLockerService },
                { label: 'Check-in obligatorio', value: checkInRequired, set: setCheckInRequired },
                { label: 'Acceso a invitados', value: allowGuestAccess, set: setAllowGuestAccess },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: 'rgba(0,0,0,0.45)' }}>{s.label}</span>
                  <button
                    onClick={() => s.set(!s.value)}
                    className="relative w-12 h-7 rounded-full transition-all duration-300"
                    style={{ background: s.value ? '#30D158' : 'rgba(0,0,0,0.1)' }}
                  >
                    <div className="absolute w-5 h-5 rounded-full bg-white top-1 transition-all duration-300 shadow-sm" style={{ left: s.value ? 26 : 2 }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Capacidad y Reglas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl p-6 premium-card">
            <h3 className="text-[#1A1A1E] font-bold mb-5" style={{ fontSize: '0.95rem' }}>Capacidad y Personal</h3>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>CAPACIDAD MÁXIMA (personas)</label>
                <input type="number" value={maxCapacity} onChange={e => setMaxCapacity(e.target.value)} className="w-full p-3.5 rounded-xl text-sm font-medium outline-none transition-all duration-200" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: '#1A1A1E' }} onFocus={e => { e.target.style.borderColor = 'rgba(230,57,70,0.2)'; e.target.style.background = 'rgba(230,57,70,0.02)' }} onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.06)'; e.target.style.background = 'rgba(0,0,0,0.03)' }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>MÁQUINAS</label>
                  <input type="number" value={machinesCount} onChange={e => setMachinesCount(e.target.value)} className="w-full p-3.5 rounded-xl text-sm font-medium outline-none transition-all duration-200" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: '#1A1A1E' }} onFocus={e => { e.target.style.borderColor = 'rgba(230,57,70,0.2)'; e.target.style.background = 'rgba(230,57,70,0.02)' }} onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.06)'; e.target.style.background = 'rgba(0,0,0,0.03)' }} />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>ENTRENADORES</label>
                  <input type="number" value={trainersCount} onChange={e => setTrainersCount(e.target.value)} className="w-full p-3.5 rounded-xl text-sm font-medium outline-none transition-all duration-200" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: '#1A1A1E' }} onFocus={e => { e.target.style.borderColor = 'rgba(230,57,70,0.2)'; e.target.style.background = 'rgba(230,57,70,0.02)' }} onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.06)'; e.target.style.background = 'rgba(0,0,0,0.03)' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-6 premium-card">
            <h3 className="text-[#1A1A1E] font-bold mb-5" style={{ fontSize: '0.95rem' }}>Reglas y Restricciones</h3>
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>EDAD MÍNIMA</label>
                  <input type="number" value={minAge} onChange={e => setMinAge(e.target.value)} className="w-full p-3.5 rounded-xl text-sm font-medium outline-none transition-all duration-200" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: '#1A1A1E' }} onFocus={e => { e.target.style.borderColor = 'rgba(230,57,70,0.2)'; e.target.style.background = 'rgba(230,57,70,0.02)' }} onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.06)'; e.target.style.background = 'rgba(0,0,0,0.03)' }} />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>RESERVA MÁX. (días)</label>
                  <input type="number" value={maxBookingDays} onChange={e => setMaxBookingDays(e.target.value)} className="w-full p-3.5 rounded-xl text-sm font-medium outline-none transition-all duration-200" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: '#1A1A1E' }} onFocus={e => { e.target.style.borderColor = 'rgba(230,57,70,0.2)'; e.target.style.background = 'rgba(230,57,70,0.02)' }} onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.06)'; e.target.style.background = 'rgba(0,0,0,0.03)' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contacto de Emergencia e Información Fiscal */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl p-6 premium-card">
            <h3 className="text-[#1A1A1E] font-bold mb-5" style={{ fontSize: '0.95rem' }}>Contacto de Emergencia</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>NOMBRE DEL RESPONSABLE</label>
                <input value={emergencyName} onChange={e => setEmergencyName(e.target.value)} className="w-full p-3.5 rounded-xl text-sm font-medium outline-none transition-all duration-200" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: '#1A1A1E' }} onFocus={e => { e.target.style.borderColor = 'rgba(230,57,70,0.2)'; e.target.style.background = 'rgba(230,57,70,0.02)' }} onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.06)'; e.target.style.background = 'rgba(0,0,0,0.03)' }} />
              </div>
              <div>
                <label className="block text-xs font-bold mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>TELÉFONO DE EMERGENCIA</label>
                <input value={emergencyContact} onChange={e => setEmergencyContact(e.target.value)} className="w-full p-3.5 rounded-xl text-sm font-medium outline-none transition-all duration-200" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: '#1A1A1E' }} onFocus={e => { e.target.style.borderColor = 'rgba(230,57,70,0.2)'; e.target.style.background = 'rgba(230,57,70,0.02)' }} onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.06)'; e.target.style.background = 'rgba(0,0,0,0.03)' }} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-6 premium-card">
            <h3 className="text-[#1A1A1E] font-bold mb-5" style={{ fontSize: '0.95rem' }}>Información Fiscal</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>RAZÓN SOCIAL</label>
                <input value={businessName} onChange={e => setBusinessName(e.target.value)} className="w-full p-3.5 rounded-xl text-sm font-medium outline-none transition-all duration-200" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: '#1A1A1E' }} onFocus={e => { e.target.style.borderColor = 'rgba(230,57,70,0.2)'; e.target.style.background = 'rgba(230,57,70,0.02)' }} onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.06)'; e.target.style.background = 'rgba(0,0,0,0.03)' }} />
              </div>
              <div>
                <label className="block text-xs font-bold mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>RFC / ID FISCAL</label>
                <input value={taxId} onChange={e => setTaxId(e.target.value)} className="w-full p-3.5 rounded-xl text-sm font-medium outline-none transition-all duration-200" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: '#1A1A1E' }} onFocus={e => { e.target.style.borderColor = 'rgba(230,57,70,0.2)'; e.target.style.background = 'rgba(230,57,70,0.02)' }} onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.06)'; e.target.style.background = 'rgba(0,0,0,0.03)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* WiFi */}
        <div className="rounded-2xl p-6 premium-card">
          <h3 className="text-[#1A1A1E] font-bold mb-5" style={{ fontSize: '0.95rem' }}>Red WiFi</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>NOMBRE DE RED (SSID)</label>
              <input value={wifiSsid} onChange={e => setWifiSsid(e.target.value)} className="w-full p-3.5 rounded-xl text-sm font-medium outline-none transition-all duration-200" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: '#1A1A1E' }} onFocus={e => { e.target.style.borderColor = 'rgba(230,57,70,0.2)'; e.target.style.background = 'rgba(230,57,70,0.02)' }} onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.06)'; e.target.style.background = 'rgba(0,0,0,0.03)' }} />
            </div>
            <div>
              <label className="block text-xs font-bold mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>CONTRASEÑA</label>
              <input value={wifiPass} onChange={e => setWifiPass(e.target.value)} className="w-full p-3.5 rounded-xl text-sm font-medium outline-none transition-all duration-200" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: '#1A1A1E' }} onFocus={e => { e.target.style.borderColor = 'rgba(230,57,70,0.2)'; e.target.style.background = 'rgba(230,57,70,0.02)' }} onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.06)'; e.target.style.background = 'rgba(0,0,0,0.03)' }} />
            </div>
          </div>
        </div>

        {/* Vista previa de la información */}
        <div className="rounded-2xl p-6 premium-card">
          <h3 className="text-[#1A1A1E] font-bold mb-5" style={{ fontSize: '0.95rem' }}>Vista Previa</h3>
          <div className="flex items-center gap-5 p-5 rounded-xl" style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #F43843, #CC0033)' }}>
              <Dumbbell size={28} color="white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-extrabold" style={{ color: '#1A1A1E' }}>{gymName}</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.35)' }}>{gymAddress}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                <span className="text-[11px]" style={{ color: 'rgba(0,0,0,0.3)' }}>📞 {gymPhone}</span>
                <span className="text-[11px]" style={{ color: 'rgba(0,0,0,0.3)' }}>✉️ {gymEmail}</span>
                <span className="text-[11px]" style={{ color: 'rgba(0,0,0,0.3)' }}>🕐 {openTime} – {closeTime}{openWeekends ? ' · S-D' : ''}</span>
                <span className="text-[11px]" style={{ color: 'rgba(0,0,0,0.3)' }}>👥 Cap. {maxCapacity}</span>
                <span className="text-[11px]" style={{ color: 'rgba(0,0,0,0.3)' }}>🏋️ {machinesCount} máq.</span>
                <span className="text-[11px]" style={{ color: 'rgba(0,0,0,0.3)' }}>👨‍🏫 {trainersCount} entrenadores</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                <span className="text-[11px]" style={{ color: 'rgba(0,0,0,0.3)' }}>📷 {instagram}</span>
                <span className="text-[11px]" style={{ color: 'rgba(0,0,0,0.3)' }}>🌐 {website}</span>
                <span className="text-[11px]" style={{ color: 'rgba(0,0,0,0.3)' }}>📶 {wifiSsid}</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                <span className="text-[11px]" style={{ color: 'rgba(0,0,0,0.3)' }}>🆘 {emergencyName}: {emergencyContact}</span>
                <span className="text-[11px]" style={{ color: 'rgba(0,0,0,0.3)' }}>💰 {planBasic} · {planPremium} · {planVip}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Botón Guardar */}
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setShowSavedToast(true)
              setTimeout(() => setShowSavedToast(false), 3000)
            }}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold premium-btn"
          >
            <CheckCircle size={18} /><span>Guardar Configuración</span>
          </motion.button>
        </div>
      </div>
    )
  }
}
