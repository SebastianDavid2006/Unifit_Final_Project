import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as ReTooltip, ResponsiveContainer, Cell,
} from 'recharts'
import {
  LayoutDashboard, Users, ClipboardList, Dumbbell, Calendar,
  TrendingUp, Clock,
  Search, ArrowUp, Sparkles,
  Bell, ChevronLeft, PanelLeftClose, PanelLeftOpen, Filter, Menu,
} from 'lucide-react'
import { StudentProfile, TABS } from '../modules/students/StudentProfile'
import StudentsModule from '../modules/students/StudentsModule'
import iconRunning from '../assets/icons/animated/icon_running.gif'
import AgendaModule from '../modules/agenda/AgendaModule'
import EquipmentPage from './EquipmentPage'
import DashboardModule from '../modules/dashboard/DashboardModule'
import trophyImg from '../assets/images/trophy.png'

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
  { id: 1, name: 'Ana García Martínez', firstName: 'Ana', secondName: 'María', lastName: 'García', secondLastName: 'Martínez', documentType: 'CC', documentNumber: '1234567890', birthDate: '15/03/1998', gender: 'Femenino', eps: 'Sanitas', bloodType: 'O+', email: 'ana.garcia@email.com', phone: '3001234567', contactName: 'Carlos García', contactPhone: '3107654321', carnetId: 'UNI-001', program: 'Sistemas', institution: 'Universitaria de Colombia', faculty: 'Ingeniería de Sistemas', semestre: 6, semester: '6', modality: 'Presencial', jornada: 'Diurna', graduationStatus: 'No egresado', adherence: 92, risk: 'low' as const, status: 'active' as const, lastVisit: 'Hoy, 7:30 AM', nextAssessment: '12/08/2026', avatar: 'AG', goal: 'Quiero reducir mi porcentaje de grasa corporal de 22% a 17% y mejorar mi composición corporal a través de entrenamiento de fuerza y cardio moderado, acompañado de un plan nutricional personalizado', sessions: 24, weight: 62, height: 165 },
  { id: 2, name: 'Carlos Rodríguez', firstName: 'Carlos', secondName: 'Andrés', lastName: 'Rodríguez', secondLastName: 'López', documentType: 'CC', documentNumber: '2345678901', birthDate: '22/07/1995', gender: 'Masculino', eps: 'Compensar', bloodType: 'A+', email: 'carlos.rodriguez@email.com', phone: '3012345678', contactName: 'María Rodríguez', contactPhone: '3118765432', carnetId: 'UNI-002', program: 'Medicina', institution: 'Universitaria de Bogotá', faculty: 'Auxiliar en Enfermería', semestre: 4, semester: '4', modality: 'Presencial', jornada: 'Nocturna', graduationStatus: 'No egresado', adherence: 34, risk: 'high' as const, status: 'inactive' as const, lastVisit: 'Hace 12 días', nextAssessment: '20/08/2026', avatar: 'CR', goal: 'Fuerza', sessions: 8, weight: 78, height: 178 },
  { id: 3, name: 'María Fernández', firstName: 'María', secondName: 'José', lastName: 'Fernández', secondLastName: 'Díaz', documentType: 'CC', documentNumber: '3456789012', birthDate: '10/11/1997', gender: 'Femenino', eps: 'Sura', bloodType: 'B+', email: 'maria.fernandez@email.com', phone: '3023456789', contactName: 'Pedro Fernández', contactPhone: '3129876543', carnetId: 'UNI-003', program: 'Derecho', institution: 'Universitaria de Colombia', faculty: 'Derecho', semestre: 8, semester: '8', modality: 'Virtual', jornada: 'Diurna', graduationStatus: 'Egresado', adherence: 78, risk: 'low' as const, status: 'process' as const, lastVisit: 'Ayer', nextAssessment: 'Por agendar', avatar: 'MF', goal: 'Resistencia', sessions: 19, weight: 58, height: 162 },
  { id: 4, name: 'Diego López', firstName: 'Diego', secondName: 'Alejandro', lastName: 'López', secondLastName: 'Mora', documentType: 'CE', documentNumber: '4567890123', birthDate: '05/06/1994', gender: 'Masculino', eps: 'Sanitas', bloodType: 'AB+', email: 'diego.lopez@email.com', phone: '3034567890', contactName: 'Ana López', contactPhone: '3130987654', carnetId: 'UNI-004', program: 'Administración', institution: 'Universitaria de Bogotá', faculty: 'Administración de Empresas', semestre: 2, semester: '2', modality: 'Presencial', jornada: 'Diurna', graduationStatus: 'No egresado', adherence: 51, risk: 'medium' as const, status: 'active' as const, lastVisit: 'Hace 5 días', nextAssessment: '25/08/2026', avatar: 'DL', goal: 'Masa muscular', sessions: 14, weight: 82, height: 181 },
  { id: 5, name: 'Valentina Torres', firstName: 'Valentina', secondName: '', lastName: 'Torres', secondLastName: 'Paz', documentType: 'CC', documentNumber: '5678901234', birthDate: '28/02/2000', gender: 'Femenino', eps: 'Salud Total', bloodType: 'O-', email: 'valentina.torres@email.com', phone: '3045678901', contactName: 'Luis Torres', contactPhone: '3141098765', carnetId: 'UNI-005', program: 'Biología', institution: 'Universitaria de Colombia', faculty: 'Medicina Veterinaria y Zootecnia', semestre: 5, semester: '5', modality: 'Presencial', jornada: 'Nocturna', graduationStatus: 'No egresado', adherence: 88, risk: 'low' as const, status: 'active' as const, lastVisit: 'Hoy, 9:15 AM', nextAssessment: '10/08/2026', avatar: 'VT', goal: 'Flexibilidad', sessions: 31, weight: 55, height: 160 },
  { id: 6, name: 'Sebastián Herrera', firstName: 'Sebastián', secondName: '', lastName: 'Herrera', secondLastName: 'Castro', documentType: 'CC', documentNumber: '6789012345', birthDate: '14/09/1996', gender: 'Masculino', eps: 'Famisanar', bloodType: 'A-', email: 'sebastian.herrera@email.com', phone: '3056789012', contactName: 'Laura Herrera', contactPhone: '3152109876', carnetId: 'UNI-006', program: 'Industrial', institution: 'Universitaria de Bogotá', faculty: 'Ingeniería Industrial', semestre: 9, semester: '9', modality: 'Presencial', jornada: 'Diurna', graduationStatus: 'Egresado', adherence: 22, risk: 'high' as const, status: 'inactive' as const, lastVisit: 'Hace 18 días', nextAssessment: '22/08/2026', avatar: 'SH', goal: 'Cardio', sessions: 4, weight: 91, height: 183 },
  { id: 7, name: 'Luisa Mendoza', firstName: 'Luisa', secondName: 'Fernanda', lastName: 'Mendoza', secondLastName: 'Ríos', documentType: 'CC', documentNumber: '7890123456', birthDate: '03/12/1999', gender: 'Femenino', eps: 'Sanitas', bloodType: 'O+', email: 'luisa.mendoza@email.com', phone: '3067890123', contactName: 'Raúl Mendoza', contactPhone: '3163210987', carnetId: 'UNI-007', program: 'Artes Plásticas', institution: 'Universitaria de Colombia', faculty: 'Diseño Gráfico', semestre: 3, semester: '3', modality: 'Presencial', jornada: 'Diurna', graduationStatus: 'No egresado', adherence: 95, risk: 'low' as const, status: 'process' as const, lastVisit: 'Hoy, 6:00 AM', nextAssessment: 'Por agendar', avatar: 'LM', goal: 'Bienestar', sessions: 42, weight: 60, height: 168 },
  { id: 8, name: 'Andrés Camilo Vega Ortiz', firstName: 'Andrés', secondName: 'Camilo', lastName: 'Vega', secondLastName: 'Ortiz', documentType: 'CC', documentNumber: '8901234567', birthDate: '19/05/1997', gender: 'Masculino', eps: 'Savia Salud', bloodType: 'O+', email: 'andres.vega@email.com', phone: '3078901234', contactName: 'Rosa Vega', contactPhone: '3174321098', carnetId: 'UNI-008', program: 'Enfermería', institution: 'Universitaria de Bogotá', faculty: 'Auxiliar en Enfermería', semestre: 7, semester: '7', modality: 'Presencial', jornada: 'Diurna', graduationStatus: 'No egresado', adherence: 63, risk: 'medium' as const, status: 'active' as const, lastVisit: 'Hace 2 días', nextAssessment: '30/08/2026', avatar: 'AV', goal: 'Fuerza', sessions: 17, weight: 74, height: 176 },
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

type Section = 'dashboard' | 'students' | 'equipment' | 'schedule'

const sidebarItems: { id: Section; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'students', label: 'Usuarios', icon: Users },
  { id: 'equipment', label: 'Máquinas', icon: Dumbbell },
  { id: 'schedule', label: 'Agenda', icon: Calendar },
]

export function TrainerDashboard() {
  const [section, setSection] = useState<Section>('dashboard')
  const [expanded, setExpanded] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<typeof students[0] | null>(null)
  const [studentTab, setStudentTab] = useState('overview')
  const [search, setSearch] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [agendaSearch, setAgendaSearch] = useState('')
  const [agendaSearchFocused, setAgendaSearchFocused] = useState(false)
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [equipSearch, setEquipSearch] = useState('')
  const [equipSearchFocused, setEquipSearchFocused] = useState(false)
  const [equipStatusFilter, setEquipStatusFilter] = useState<'active' | 'maintenance' | 'inactive' | 'all'>('all')
  const [showEquipFilters, setShowEquipFilters] = useState(false)
  const [equipViewMode, setEquipViewMode] = useState<'machines' | 'exercises'>('machines')
  const [equipSearchHovered, setEquipSearchHovered] = useState(false)
  const [showStudentsFilters, setShowStudentsFilters] = useState(false)

  // ── RENDERERS ──

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
        <div className="flex-shrink-0" style={{ width: '100%', height: 44, marginBottom: 24, marginTop: 8 }}>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-11 h-11 rounded-xl flex items-center justify-center
              border border-transparent
              hover:bg-white/[0.06] hover:backdrop-blur-md hover:border-white/10 hover:shadow-lg"
            style={{
              position: 'absolute',
              top: 8,
              left: expanded ? 'calc(100% - 56px)' : 'calc(50% - 22px)',
              color: 'rgba(255,255,255,0.5)',
              zIndex: 60,
              transition: 'left 0.4s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
            }}
            title={expanded ? 'Colapsar' : 'Expandir'}
          >
            {expanded ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
          </button>
        </div>

        <div className="flex flex-col w-full relative">
          {/* Gooey layer */}
          <div className="absolute inset-0 flex flex-col pointer-events-none" style={{ filter: 'url(#goo)' }}>
            {sidebarItems.flatMap((item, i, arr) => {
              const groups = [[arr[0]], [arr[1], arr[2]], [arr[3]]]
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
                  width: expanded ? '100%' : 68,
                  borderRadius: expanded ? 10 : 0,
                  transition: 'width 0.45s cubic-bezier(0.4, 0, 0.2, 1), border-radius 0.35s ease',
                }}>
                  {entry.isActive && false && (
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
          {sidebarItems.flatMap((item, i, arr) => {
            const groups = [[arr[0]], [arr[1], arr[2]], [arr[3]]]
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
                marginLeft: expanded ? 24 : 24,
                background: 'linear-gradient(90deg, rgba(18,112,183,0.12), rgba(244,56,67,0.08), rgba(241,200,39,0.06), transparent)',
                transition: 'width 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
              }} />
            ) : (
              <button
                key={entry.item.id}
                onClick={() => setSection(entry.item.id)}
                title={entry.item.label}
                className="relative flex items-center flex-shrink-0 overflow-hidden"
                style={{
                  height: 44,
                  width: expanded ? '100%' : 68,
                  paddingLeft: 0,
                  borderRadius: expanded ? 10 : 0,
                  background: 'transparent',
                  color: section === entry.item.id ? '#fff' : 'rgba(255,255,255,0.2)',
                  transition: 'width 0.45s cubic-bezier(0.4, 0, 0.2, 1), border-radius 0.35s ease, color 0.3s ease',
                }}
              >
                {/* Resplandor izquierdo vibrante */}
                {section === entry.item.id && (
                  <div className="absolute top-0 bottom-0 pointer-events-none" style={{
                    left: -16,
                    width: expanded ? 'calc(100% + 200px)' : 'calc(100% + 140px)',
                    background: 'linear-gradient(90deg, rgba(228,35,50,0.35) 0%, rgba(43,44,138,0.18) 22%, rgba(239,187,41,0.06) 42%, transparent 58%)',
                    filter: 'blur(8px)',
                  }} />
                )}
                <div className="flex items-center justify-center flex-shrink-0" style={{ width: 68, height: 44 }}>
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
      </aside>

        <div className="flex-1 overflow-y-auto relative z-10" style={{ scrollbarGutter: 'stable' }}>
        <div className="sticky top-0 z-30">
          <div className="relative px-7 pt-5 pb-3 flex items-center gap-3">
          {!selectedStudent && section === 'students' && (
            <div className="flex-1 flex justify-center">
              <div className="flex items-center gap-2 max-w-md w-full">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0, scaleX: searchFocused ? 1.04 : 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="flex items-center gap-3 px-4 py-2 rounded-2xl flex-1 min-w-0"
                  style={{
                    background: searchFocused ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(24px) saturate(1.6)',
                    border: searchFocused ? '1px solid rgba(255,255,255,0.5)' : '1px solid rgba(255,255,255,0.25)',
                    boxShadow: searchFocused ? '0 4px 24px rgba(0,0,0,0.06)' : '0 4px 16px rgba(0,0,0,0.03)',
                    transformOrigin: 'center',
                  }}
                >
                  <Search size={16} style={{ color: searchFocused ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.3)' }} />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    placeholder="Buscar por nombre o documento..."
                    className="bg-transparent border-none outline-none text-sm w-full placeholder:text-black/20 text-[#1A1A1E] font-medium"
                  />
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowStudentsFilters(!showStudentsFilters)}
                  className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                  style={{
                    marginLeft: searchFocused ? 6 : 0,
                    background: showStudentsFilters ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(24px) saturate(1.6)',
                    border: showStudentsFilters ? '1px solid rgba(255,255,255,0.6)' : '1px solid rgba(255,255,255,0.25)',
                    boxShadow: showStudentsFilters ? '0 4px 24px rgba(0,0,0,0.08)' : '0 4px 16px rgba(0,0,0,0.03)',
                    color: showStudentsFilters ? '#1A1A1E' : 'rgba(0,0,0,0.3)',
                  }}
                >
                  <Menu size={18} />
                </motion.button>
              </div>
            </div>
          )}
          {!selectedStudent && section === 'schedule' && (
            <div className="flex-1 flex justify-center">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0, scaleX: agendaSearchFocused ? 1.04 : 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="flex items-center gap-3 px-4 py-2 rounded-2xl max-w-md w-full"
                style={{
                  background: agendaSearchFocused ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(24px) saturate(1.6)',
                  border: agendaSearchFocused ? '1px solid rgba(255,255,255,0.5)' : '1px solid rgba(255,255,255,0.25)',
                  boxShadow: agendaSearchFocused ? '0 4px 24px rgba(0,0,0,0.06)' : '0 4px 16px rgba(0,0,0,0.03)',
                  transformOrigin: 'center',
                }}
              >
                <Search size={16} style={{ color: agendaSearchFocused ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.3)' }} />
                <input
                  value={agendaSearch}
                  onChange={e => setAgendaSearch(e.target.value)}
                  onFocus={() => setAgendaSearchFocused(true)}
                  onBlur={() => setAgendaSearchFocused(false)}
                  placeholder="Buscar en agenda..."
                  className="bg-transparent border-none outline-none text-sm w-full placeholder:text-black/20 text-[#1A1A1E] font-medium"
                />
              </motion.div>
            </div>
          )}
          {!selectedStudent && section === 'equipment' && (
            <div className="flex-1 flex items-center justify-center gap-3 relative">
              {/* ── Collapsible Search (icon fixed, input fades left) ── */}
              <div className="relative flex-shrink-0" style={{ width: 36, height: 36 }}>
                {/* Background pill — right-anchored, grows left */}
                <div
                  className="absolute top-0 h-full overflow-hidden"
                  style={{
                    right: 0,
                    width: equipSearchFocused || equipSearch || equipSearchHovered ? 356 : 36,
                    borderRadius: '9999px',
                    background: equipSearchFocused || equipSearch ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(24px) saturate(1.6)',
                    border: equipSearchFocused || equipSearch ? '1px solid rgba(255,255,255,0.5)' : '1px solid rgba(255,255,255,0.25)',
                    boxShadow: equipSearchFocused || equipSearch ? '0 4px 24px rgba(0,0,0,0.06)' : '0 4px 16px rgba(0,0,0,0.03)',
                    transition: 'width 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onMouseEnter={() => setEquipSearchHovered(true)}
                  onMouseLeave={() => setEquipSearchHovered(false)}
                >
                  <div className="flex items-center h-full">
                    <input
                      value={equipSearch}
                      onChange={e => setEquipSearch(e.target.value)}
                      onFocus={() => setEquipSearchFocused(true)}
                      onBlur={() => setEquipSearchFocused(false)}
                      placeholder="Buscar máquina o ejercicio..."
                      className="bg-transparent border-none outline-none text-sm placeholder:text-black/20 text-[#1A1A1E] font-medium"
                      style={{
                        flex: equipSearchFocused || equipSearch || equipSearchHovered ? '1' : '0',
                        opacity: equipSearchFocused || equipSearch || equipSearchHovered ? 1 : 0,
                        minWidth: 0,
                        paddingRight: equipSearchFocused || equipSearch || equipSearchHovered ? '8px' : '0',
                        paddingLeft: equipSearchFocused || equipSearch || equipSearchHovered ? '12px' : '0',
                        transition: 'opacity 0.25s ease 0.1s, flex 0s 0.35s, padding 0s 0.35s',
                      }}
                    />
                    <div className="flex-shrink-0" style={{ width: 36, height: 36 }} />
                  </div>
                </div>
                {/* Icon — always fixed, no background */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 2 }}>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: equipSearchFocused || equipSearch ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.3)', display: 'block' }}>
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                  </motion.div>
                </div>
              </div>

              {/* ── Máquinas / Ejercicios Toggle Pill ── */}
              <div
                className="flex items-center rounded-xl gap-0.5 px-1"
                style={{
                  height: 36,
                  background: 'rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(24px) saturate(1.6)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                }}
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setEquipViewMode('machines')}
                  className="px-4 py-1.5 text-[11px] font-bold cursor-pointer rounded-lg transition-all duration-200"
                  style={{
                    background: equipViewMode === 'machines'
                      ? 'radial-gradient(ellipse at 30% 25%, #3A9BDC 0%, transparent 60%), radial-gradient(ellipse at 75% 70%, #1270B7 0%, transparent 55%), radial-gradient(ellipse at 90% 25%, rgba(244,56,67,0.5) 0%, transparent 45%), radial-gradient(ellipse at 10% 85%, rgba(241,200,39,0.45) 0%, transparent 45%), #1270B7'
                      : 'transparent',
                    color: equipViewMode === 'machines' ? '#FFFFFF' : 'rgba(0,0,0,0.35)',
                    boxShadow: equipViewMode === 'machines' ? '0 2px 8px rgba(18,112,183,0.25)' : 'none',
                  }}
                >
                  Máquinas
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setEquipViewMode('exercises')}
                  className="px-4 py-1.5 text-[11px] font-bold cursor-pointer rounded-lg transition-all duration-200"
                  style={{
                    background: equipViewMode === 'exercises'
                      ? 'radial-gradient(ellipse at 30% 25%, #3A9BDC 0%, transparent 60%), radial-gradient(ellipse at 75% 70%, #1270B7 0%, transparent 55%), radial-gradient(ellipse at 90% 25%, rgba(244,56,67,0.5) 0%, transparent 45%), radial-gradient(ellipse at 10% 85%, rgba(241,200,39,0.45) 0%, transparent 45%), #1270B7'
                      : 'transparent',
                    color: equipViewMode === 'exercises' ? '#FFFFFF' : 'rgba(0,0,0,0.35)',
                    boxShadow: equipViewMode === 'exercises' ? '0 2px 8px rgba(18,112,183,0.25)' : 'none',
                  }}
                >
                  Ejercicios
                </motion.button>
              </div>

              <div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowEquipFilters(!showEquipFilters)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background: showEquipFilters ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(24px) saturate(1.6)',
                    border: showEquipFilters ? '1px solid rgba(255,255,255,0.5)' : '1px solid rgba(255,255,255,0.25)',
                    color: showEquipFilters ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.35)',
                  }}
                >
                  <Filter size={16} />
                </motion.button>
              </div>
              <AnimatePresence>
                {showEquipFilters && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.93, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -6, scale: 0.93, filter: 'blur(6px)' }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 flex gap-1.5 p-2 rounded-xl"
                    style={{
                      background: 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(24px) saturate(1.6)',
                      border: '1px solid rgba(255,255,255,0.5)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                    }}
                  >
                    {(['all', 'active', 'maintenance', 'inactive'] as const).map(s => {
                      const label = s === 'all' ? 'Todas' : s === 'active' ? 'Activo' : s === 'maintenance' ? 'Mantenimiento' : 'Inactiva'
                      const color = s === 'all' ? '#1270B7' : s === 'active' ? '#30D158' : s === 'maintenance' ? '#F1C827' : '#F43843'
                      return (
                          <motion.button
                            key={s}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setEquipStatusFilter(s)}
                            className="px-3 py-1.5 rounded-xl text-[11px] font-bold tracking-wide whitespace-nowrap transition-all"
                            style={{
                              background: equipStatusFilter === s ? `${color}15` : 'transparent',
                              color: equipStatusFilter === s ? color : 'rgba(0,0,0,0.3)',
                              border: `1px solid ${equipStatusFilter === s ? `${color}30` : 'transparent'}`,
                            }}
                          >
                            {label}
                          </motion.button>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
            </div>
          )}

          {selectedStudent && (
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setSelectedStudent(null)}
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(16px) saturate(1.5)',
                border: '1px solid rgba(255,255,255,0.3)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
              }}
            >
              <img src={iconRunning} alt="Volver" className="w-5 h-5 object-contain" style={{ transform: 'scaleX(-1)' }} />
            </motion.button>
          )}

          {selectedStudent && (
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-2xl px-2 py-1.5" style={{
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(24px) saturate(1.6)',
              border: '1px solid rgba(255,255,255,0.25)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
            }}>
              {TABS.map(t => (
                <motion.button key={t.id} onClick={() => setStudentTab(t.id)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                  style={{
                    background: studentTab === t.id
                      ? 'radial-gradient(ellipse at 20% 30%, rgba(230,57,70,0.35) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(18,112,183,0.3) 0%, transparent 50%), radial-gradient(ellipse at 50% 90%, rgba(241,200,39,0.3) 0%, transparent 50%), rgba(230,57,70,0.85)'
                      : 'transparent',
                    color: studentTab === t.id ? '#FFFFFF' : 'rgba(0,0,0,0.3)',
                    boxShadow: studentTab === t.id ? '0 2px 8px rgba(230,57,70,0.2), 0 0 20px rgba(230,57,70,0.1)' : 'none',
                  }}
                >
                  <t.icon size={14} />
                  {t.label}
                </motion.button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 ml-auto">
            <motion.button
              whileHover={{ background: 'rgba(255,255,255,0.28)' }}
              whileTap={{ scale: 0.95 }}
              className="relative w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(24px) saturate(1.6)',
                border: '1px solid rgba(255,255,255,0.25)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              }}
            >
              <Bell size={16} style={{ color: 'rgba(0,0,0,0.35)' }} />
              <div className="dot-alert absolute -top-1 -right-1" style={{ width: 8, height: 8 }} />
            </motion.button>

            <motion.div
              initial="initial"
              whileHover="hover"
              className="flex items-center rounded-xl cursor-pointer overflow-hidden"
              style={{
                height: 38,
                background: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(24px) saturate(1.6)',
                border: '1px solid rgba(255,255,255,0.25)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              }}
            >
              <motion.div
                variants={{
                  initial: { width: 0, opacity: 0, paddingRight: 0, paddingLeft: 0 },
                  hover: { width: 175, opacity: 1, paddingRight: 10, paddingLeft: 12 },
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                className="overflow-hidden whitespace-nowrap flex items-center"
              >
                <div className="flex items-center gap-2">
                  <div>
                    <p className="text-[#1A1A1E] text-xs font-bold leading-none">Sebastián Morales</p>
                    <p style={{ color: 'rgba(0,0,0,0.3)', fontSize: 9 }} className="mt-0.5">Plataforma de Entrenadores</p>
                  </div>
                </div>
              </motion.div>
              <div
                className="w-[38px] h-[38px] rounded-xl flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                style={{ background: RED_GRAD }}
              >
                SM
              </div>
            </motion.div>
          </div>
          </div>
        </div>

        {selectedStudent ? (
          <StudentProfile student={selectedStudent} tab={studentTab} onTabChange={setStudentTab} />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {section === 'dashboard' && <DashboardModule />}
              {section === 'students' && (
                <StudentsModule
                  students={students}
                  search={search}
                  riskFilter={riskFilter}
                  onSelectStudent={setSelectedStudent}
                  showFilters={showStudentsFilters}
                  onToggleFilters={() => setShowStudentsFilters(!showStudentsFilters)}
                />
              )}
              {section === 'equipment' && renderEquipment()}
              {section === 'schedule' && <AgendaModule students={students} />}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )

  // ── RENDERERS ──

  function renderEquipment() { return (
    <EquipmentPage
      search={equipSearch}
      searchFocused={equipSearchFocused}
      statusFilter={equipStatusFilter}
      showBlur={showEquipFilters}
      viewMode={equipViewMode}
      onViewModeChange={setEquipViewMode}
      onSearchChange={setEquipSearch}
      onSearchFocus={setEquipSearchFocused}
      onStatusFilterChange={setEquipStatusFilter}
    />
  ) }

}
