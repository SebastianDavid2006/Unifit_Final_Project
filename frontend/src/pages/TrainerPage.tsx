import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as ReTooltip, ResponsiveContainer, Cell,
} from 'recharts'
import {
  LayoutDashboard, Users, ClipboardList, Dumbbell, Calendar,
  TrendingUp, Clock, Activity, Target, Award,
  Search, Plus, ArrowUp, Sparkles,
  CheckCircle, Bell, ChevronLeft, PanelLeftClose, PanelLeftOpen, BarChart3, Settings, Filter, Shield, Menu, GraduationCap,
} from 'lucide-react'
import { StudentProfile, TABS } from '../modules/students/StudentProfile'
import StudentsModule from '../modules/students/StudentsModule'
import iconRunning from '../assets/icons/animated/icon_running.gif'
import AgendaModule from '../modules/agenda/AgendaModule'
import EquipmentPage from './EquipmentPage'
import AdminModule from '../modules/admin/AdminModule'
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
  { id: 1, name: 'Ana García Martínez', firstName: 'Ana', secondName: 'María', lastName: 'García', secondLastName: 'Martínez', documentType: 'CC', documentNumber: '1234567890', birthDate: '15/03/1998', gender: 'Femenino', eps: 'Sanitas', bloodType: 'O+', email: 'ana.garcia@email.com', phone: '3001234567', contactName: 'Carlos García', contactPhone: '3107654321', carnetId: 'UNI-001', program: 'Sistemas', institution: 'Universitaria de Colombia', faculty: 'Ingeniería', semestre: 6, semester: '6', modality: 'Presencial', jornada: 'Diurna', graduationStatus: 'No egresado', adherence: 92, risk: 'low' as const, status: 'active' as const, lastVisit: 'Hoy, 7:30 AM', avatar: 'AG', goal: 'Quiero reducir mi porcentaje de grasa corporal de 22% a 17% y mejorar mi composición corporal a través de entrenamiento de fuerza y cardio moderado, acompañado de un plan nutricional personalizado', sessions: 24, weight: 62, height: 165 },
  { id: 2, name: 'Carlos Rodríguez', firstName: 'Carlos', secondName: 'Andrés', lastName: 'Rodríguez', secondLastName: 'López', documentType: 'CC', documentNumber: '2345678901', birthDate: '22/07/1995', gender: 'Masculino', eps: 'Compensar', bloodType: 'A+', email: 'carlos.rodriguez@email.com', phone: '3012345678', contactName: 'María Rodríguez', contactPhone: '3118765432', carnetId: 'UNI-002', program: 'Medicina', institution: 'Universitaria de Bogotá', faculty: 'Medicina', semestre: 4, semester: '4', modality: 'Presencial', jornada: 'Nocturna', graduationStatus: 'No egresado', adherence: 34, risk: 'high' as const, status: 'inactive' as const, lastVisit: 'Hace 12 días', avatar: 'CR', goal: 'Fuerza', sessions: 8, weight: 78, height: 178 },
  { id: 3, name: 'María Fernández', firstName: 'María', secondName: 'José', lastName: 'Fernández', secondLastName: 'Díaz', documentType: 'CC', documentNumber: '3456789012', birthDate: '10/11/1997', gender: 'Femenino', eps: 'Sura', bloodType: 'B+', email: 'maria.fernandez@email.com', phone: '3023456789', contactName: 'Pedro Fernández', contactPhone: '3129876543', carnetId: 'UNI-003', program: 'Derecho', institution: 'Universitaria de Colombia', faculty: 'Derecho', semestre: 8, semester: '8', modality: 'Virtual', jornada: 'Diurna', graduationStatus: 'Egresado', adherence: 78, risk: 'low' as const, status: 'process' as const, lastVisit: 'Ayer', avatar: 'MF', goal: 'Resistencia', sessions: 19, weight: 58, height: 162 },
  { id: 4, name: 'Diego López', firstName: 'Diego', secondName: 'Alejandro', lastName: 'López', secondLastName: 'Mora', documentType: 'CE', documentNumber: '4567890123', birthDate: '05/06/1994', gender: 'Masculino', eps: 'Sanitas', bloodType: 'AB+', email: 'diego.lopez@email.com', phone: '3034567890', contactName: 'Ana López', contactPhone: '3130987654', carnetId: 'UNI-004', program: 'Administración', institution: 'Universitaria de Bogotá', faculty: 'Administración', semestre: 2, semester: '2', modality: 'Presencial', jornada: 'Diurna', graduationStatus: 'No egresado', adherence: 51, risk: 'medium' as const, status: 'active' as const, lastVisit: 'Hace 5 días', avatar: 'DL', goal: 'Masa muscular', sessions: 14, weight: 82, height: 181 },
  { id: 5, name: 'Valentina Torres', firstName: 'Valentina', secondName: '', lastName: 'Torres', secondLastName: 'Paz', documentType: 'CC', documentNumber: '5678901234', birthDate: '28/02/2000', gender: 'Femenino', eps: 'Salud Total', bloodType: 'O-', email: 'valentina.torres@email.com', phone: '3045678901', contactName: 'Luis Torres', contactPhone: '3141098765', carnetId: 'UNI-005', program: 'Biología', institution: 'Universitaria de Colombia', faculty: 'Ciencias', semestre: 5, semester: '5', modality: 'Presencial', jornada: 'Nocturna', graduationStatus: 'No egresado', adherence: 88, risk: 'low' as const, status: 'active' as const, lastVisit: 'Hoy, 9:15 AM', avatar: 'VT', goal: 'Flexibilidad', sessions: 31, weight: 55, height: 160 },
  { id: 6, name: 'Sebastián Herrera', firstName: 'Sebastián', secondName: '', lastName: 'Herrera', secondLastName: 'Castro', documentType: 'CC', documentNumber: '6789012345', birthDate: '14/09/1996', gender: 'Masculino', eps: 'Famisanar', bloodType: 'A-', email: 'sebastian.herrera@email.com', phone: '3056789012', contactName: 'Laura Herrera', contactPhone: '3152109876', carnetId: 'UNI-006', program: 'Industrial', institution: 'Universitaria de Bogotá', faculty: 'Ingeniería', semestre: 9, semester: '9', modality: 'Presencial', jornada: 'Diurna', graduationStatus: 'Egresado', adherence: 22, risk: 'high' as const, status: 'inactive' as const, lastVisit: 'Hace 18 días', avatar: 'SH', goal: 'Cardio', sessions: 4, weight: 91, height: 183 },
  { id: 7, name: 'Luisa Mendoza', firstName: 'Luisa', secondName: 'Fernanda', lastName: 'Mendoza', secondLastName: 'Ríos', documentType: 'CC', documentNumber: '7890123456', birthDate: '03/12/1999', gender: 'Femenino', eps: 'Sanitas', bloodType: 'O+', email: 'luisa.mendoza@email.com', phone: '3067890123', contactName: 'Raúl Mendoza', contactPhone: '3163210987', carnetId: 'UNI-007', program: 'Artes Plásticas', institution: 'Universitaria de Colombia', faculty: 'Arte', semestre: 3, semester: '3', modality: 'Presencial', jornada: 'Diurna', graduationStatus: 'No egresado', adherence: 95, risk: 'low' as const, status: 'process' as const, lastVisit: 'Hoy, 6:00 AM', avatar: 'LM', goal: 'Bienestar', sessions: 42, weight: 60, height: 168 },
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

type Section = 'dashboard' | 'students' | 'equipment' | 'schedule' | 'stats' | 'configuration'

const sidebarItems: { id: Section; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'students', label: 'Estudiantes', icon: Users },
  { id: 'equipment', label: 'Máquinas', icon: Dumbbell },
  { id: 'schedule', label: 'Agenda', icon: Calendar },
  { id: 'stats', label: 'Estadísticas', icon: BarChart3 },
  { id: 'configuration', label: 'Configuración', icon: Settings },
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
  const [configTab, setConfigTab] = useState<'gym' | 'admin'>('gym')
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
            {sidebarItems.filter(i => i.id !== 'configuration').flatMap((item, i, arr) => {
              const groups = [[arr[0]], [arr[1], arr[2]], [arr[3], arr[4]], [arr[5]], [arr[6]]]
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
          {sidebarItems.filter(i => i.id !== 'configuration').flatMap((item, i, arr) => {
            const groups = [[arr[0]], [arr[1], arr[2]], [arr[3], arr[4]], [arr[5]], [arr[6]]]
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

        <div className="w-full mt-auto pt-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}>
          <div className="flex flex-col relative">
            {sidebarItems.filter(i => i.id === 'configuration').map(item => (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                title={item.label}
                className="relative flex items-center flex-shrink-0 overflow-hidden"
                style={{
                  height: 44,
                  width: expanded ? '100%' : 68,
                  paddingLeft: 0,
                  borderRadius: expanded ? 10 : 0,
                  background: 'transparent',
                  color: section === item.id ? '#fff' : 'rgba(255,255,255,0.2)',
                  transition: 'width 0.45s cubic-bezier(0.4, 0, 0.2, 1), border-radius 0.35s ease, color 0.3s ease',
                }}
              >
                {/* Resplandor izquierdo vibrante */}
                {section === item.id && (
                  <div className="absolute top-0 bottom-0 pointer-events-none" style={{
                    left: -16,
                    width: expanded ? 'calc(100% + 200px)' : 'calc(100% + 140px)',
                    background: 'linear-gradient(90deg, rgba(228,35,50,0.35) 0%, rgba(43,44,138,0.18) 22%, rgba(239,187,41,0.06) 42%, transparent 58%)',
                    filter: 'blur(8px)',
                  }} />
                )}
                <div className="flex items-center justify-center flex-shrink-0" style={{ width: 68, height: 44 }}>
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
                    background: equipViewMode === 'machines' ? BLUE_GRAD : 'transparent',
                    color: equipViewMode === 'machines' ? '#FFFFFF' : 'rgba(0,0,0,0.35)',
                    boxShadow: equipViewMode === 'machines' ? '0 2px 8px rgba(18,112,183,0.2)' : 'none',
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
                    background: equipViewMode === 'exercises' ? BLUE_GRAD : 'transparent',
                    color: equipViewMode === 'exercises' ? '#FFFFFF' : 'rgba(0,0,0,0.35)',
                    boxShadow: equipViewMode === 'exercises' ? '0 2px 8px rgba(18,112,183,0.2)' : 'none',
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
              {section === 'schedule' && <AgendaModule />}
              {section === 'configuration' && renderConfiguration()}
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

  function renderConfiguration() {
    return (
      <div className="p-8 space-y-6 max-w-[1440px] mx-auto relative">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-1 h-10 rounded-full" style={{ background: BLUE_GRAD }} />
            <div>
              <h1 className="text-[1.8rem] font-extrabold" style={{ color: '#1A1A1E', letterSpacing: '-0.03em' }}>Configuración</h1>
              <p className="text-sm font-medium mt-0.5" style={{ color: 'rgba(0,0,0,0.35)' }}>Administra la información del gimnasio</p>
            </div>
            {configTab === 'gym' && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setShowSavedToast(true)
                  setTimeout(() => setShowSavedToast(false), 2500)
                }}
                className="ml-auto flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
                style={{ background: BLUE_GRAD }}
              >
                <CheckCircle size={15} /> Guardar Cambios
              </motion.button>
            )}
          </div>
        </motion.div>

        {showSavedToast && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-4 right-8 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold"
            style={{ background: '#30D158', color: '#fff', boxShadow: '0 4px 16px rgba(48,209,88,0.25)' }}
          >
            <CheckCircle size={14} /> Cambios guardados exitosamente
          </motion.div>
        )}

        {/* Sub-tabs */}
        <div className="flex items-center gap-2 mb-6">
          {([
            { id: 'gym' as const, label: 'Gimnasio', icon: Settings },
            { id: 'admin' as const, label: 'Administrador', icon: Shield },
          ]).map(t => (
            <motion.button
              key={t.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setConfigTab(t.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
              style={{
                background: configTab === t.id ? `${BLUE}10` : 'rgba(0,0,0,0.02)',
                color: configTab === t.id ? BLUE : 'rgba(0,0,0,0.4)',
                border: `1px solid ${configTab === t.id ? `${BLUE}25` : 'rgba(0,0,0,0.04)'}`,
              }}
            >
              <t.icon size={15} />
              {t.label}
            </motion.button>
          ))}
        </div>

        {configTab === 'admin' ? (
          <AdminModule />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="rounded-2xl p-6 premium-card space-y-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Settings size={15} style={{ color: BLUE }} />
                  <span className="text-xs font-bold tracking-wide" style={{ color: 'rgba(0,0,0,0.3)' }}>INFORMACIÓN GENERAL</span>
                </div>
                <div>
                  <label className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.5)' }}>Nombre del Gimnasio</label>
                  <input value={gymName} onChange={e => setGymName(e.target.value)} className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium" style={{ background: '#F0F7FF', border: '1px solid rgba(0,0,0,0.04)', color: '#1A1A1E' }} />
                </div>
                <div>
                  <label className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.5)' }}>Dirección</label>
                  <input value={gymAddress} onChange={e => setGymAddress(e.target.value)} className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium" style={{ background: '#F0F7FF', border: '1px solid rgba(0,0,0,0.04)', color: '#1A1A1E' }} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.5)' }}>Teléfono</label>
                    <input value={gymPhone} onChange={e => setGymPhone(e.target.value)} className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium" style={{ background: '#F0F7FF', border: '1px solid rgba(0,0,0,0.04)', color: '#1A1A1E' }} />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.5)' }}>Email</label>
                    <input value={gymEmail} onChange={e => setGymEmail(e.target.value)} className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium" style={{ background: '#F0F7FF', border: '1px solid rgba(0,0,0,0.04)', color: '#1A1A1E' }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.5)' }}>Hora Apertura</label>
                    <input value={openTime} onChange={e => setOpenTime(e.target.value)} className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium" style={{ background: '#F0F7FF', border: '1px solid rgba(0,0,0,0.04)', color: '#1A1A1E' }} />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.5)' }}>Hora Cierre</label>
                    <input value={closeTime} onChange={e => setCloseTime(e.target.value)} className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium" style={{ background: '#F0F7FF', border: '1px solid rgba(0,0,0,0.04)', color: '#1A1A1E' }} />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                className="rounded-2xl p-6 premium-card space-y-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Award size={15} style={{ color: BLUE }} />
                  <span className="text-xs font-bold tracking-wide" style={{ color: 'rgba(0,0,0,0.3)' }}>CAPACIDAD Y PERSONAL</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.5)' }}>Capacidad Máxima</label>
                    <input value={maxCapacity} onChange={e => setMaxCapacity(e.target.value)} className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium" style={{ background: '#F0F7FF', border: '1px solid rgba(0,0,0,0.04)', color: '#1A1A1E' }} />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.5)' }}>Máquinas</label>
                    <input value={machinesCount} onChange={e => setMachinesCount(e.target.value)} className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium" style={{ background: '#F0F7FF', border: '1px solid rgba(0,0,0,0.04)', color: '#1A1A1E' }} />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.5)' }}>Entrenadores</label>
                  <input value={trainersCount} onChange={e => setTrainersCount(e.target.value)} className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium" style={{ background: '#F0F7FF', border: '1px solid rgba(0,0,0,0.04)', color: '#1A1A1E' }} />
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div
                      onClick={() => setOpenWeekends(!openWeekends)}
                      className="w-4 h-4 rounded flex items-center justify-center transition-all"
                      style={{
                        background: openWeekends ? BLUE_GRAD : 'transparent',
                        border: `1.5px solid ${openWeekends ? BLUE : 'rgba(0,0,0,0.1)'}`,
                      }}
                    >
                      {openWeekends && <CheckCircle size={10} color="white" />}
                    </div>
                    <span className="text-xs font-medium" style={{ color: 'rgba(0,0,0,0.5)' }}>Abrir fines de semana</span>
                  </label>
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16 }}
                className="rounded-2xl p-6 premium-card space-y-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Award size={15} style={{ color: BLUE }} />
                  <span className="text-xs font-bold tracking-wide" style={{ color: 'rgba(0,0,0,0.3)' }}>REDES SOCIALES</span>
                </div>
                <div>
                  <label className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.5)' }}>Instagram</label>
                  <input value={instagram} onChange={e => setInstagram(e.target.value)} className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium" style={{ background: '#F0F7FF', border: '1px solid rgba(0,0,0,0.04)', color: '#1A1A1E' }} />
                </div>
                <div>
                  <label className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.5)' }}>Facebook</label>
                  <input value={facebook} onChange={e => setFacebook(e.target.value)} className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium" style={{ background: '#F0F7FF', border: '1px solid rgba(0,0,0,0.04)', color: '#1A1A1E' }} />
                </div>
                <div>
                  <label className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.5)' }}>Sitio Web</label>
                  <input value={website} onChange={e => setWebsite(e.target.value)} className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium" style={{ background: '#F0F7FF', border: '1px solid rgba(0,0,0,0.04)', color: '#1A1A1E' }} />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl p-6 premium-card space-y-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Target size={15} style={{ color: BLUE }} />
                  <span className="text-xs font-bold tracking-wide" style={{ color: 'rgba(0,0,0,0.3)' }}>PLANES DE MEMBRESÍA</span>
                </div>
                <div>
                  <label className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.5)' }}>Plan Básico</label>
                  <input value={planBasic} onChange={e => setPlanBasic(e.target.value)} className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium" style={{ background: '#F0F7FF', border: '1px solid rgba(0,0,0,0.04)', color: '#1A1A1E' }} />
                </div>
                <div>
                  <label className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.5)' }}>Plan Premium</label>
                  <input value={planPremium} onChange={e => setPlanPremium(e.target.value)} className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium" style={{ background: '#F0F7FF', border: '1px solid rgba(0,0,0,0.04)', color: '#1A1A1E' }} />
                </div>
                <div>
                  <label className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.5)' }}>Plan VIP</label>
                  <input value={planVip} onChange={e => setPlanVip(e.target.value)} className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium" style={{ background: '#F0F7FF', border: '1px solid rgba(0,0,0,0.04)', color: '#1A1A1E' }} />
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="rounded-2xl p-6 premium-card space-y-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <Activity size={15} style={{ color: BLUE }} />
                <span className="text-xs font-bold tracking-wide" style={{ color: 'rgba(0,0,0,0.3)' }}>SERVICIOS Y POLÍTICAS</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Servicio de Toallas', checked: towelService, setter: setTowelService },
                  { label: 'Casilleros', checked: lockerService, setter: setLockerService },
                  { label: 'Check-in Obligatorio', checked: checkInRequired, setter: setCheckInRequired },
                  { label: 'Acceso Invitados', checked: allowGuestAccess, setter: setAllowGuestAccess },
                ].map(s => (
                  <label key={s.label} className="flex items-center gap-2 cursor-pointer">
                    <div
                      onClick={() => s.setter(!s.checked)}
                      className="w-4 h-4 rounded flex items-center justify-center transition-all"
                      style={{
                        background: s.checked ? BLUE_GRAD : 'transparent',
                        border: `1.5px solid ${s.checked ? BLUE : 'rgba(0,0,0,0.1)'}`,
                      }}
                    >
                      {s.checked && <CheckCircle size={10} color="white" />}
                    </div>
                    <span className="text-xs font-medium" style={{ color: 'rgba(0,0,0,0.5)' }}>{s.label}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    )
  }
}