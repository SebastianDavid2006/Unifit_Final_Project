import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts'
import {
  TrendingUp, AlertTriangle, Activity,
  Calendar, FileText, Dumbbell, Plus,
  Flame, Shield, BarChart2, Maximize2, X,
} from 'lucide-react'
import { StudentCardView } from '../../assets/models/ui/objects/student_card/StudentCardModel'
import { TelephoneView } from '../../assets/models/ui/objects/telephone/TelephoneModel'
import { CapView } from '../../assets/models/ui/objects/cap/CapModel'
import { TrophyView } from '../../assets/models/ui/objects/trophy/TrophyModel'
import { ListView } from '../../assets/models/ui/objects/list/ListModel'
import { CalendarView } from '../../assets/models/ui/objects/calendar/CalendarModel'
import { ClockView } from '../../assets/models/ui/objects/clock/ClockModel'
import fireGif from '../../assets/icons/animated/fire.gif'

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
  return (
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
                      animation: 'shimmerGold 3s ease-in-out infinite',
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
                    <div className="flex items-center justify-between px-5 py-3 relative" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                      <div className="flex items-center gap-1">
                        <button onClick={prevPeriod} onMouseEnter={(e) => { e.currentTarget.style.background = RED_GRAD; e.currentTarget.style.color = '#FFFFFF' }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = 'rgba(0,0,0,0.3)' }} className="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold transition-all" style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.3)' }}>‹</button>
                        <span className="text-sm font-bold px-1" style={{ color: '#0D1B2A' }}>
                          {vistaCalendario === 'semana' ? formatWeekRange(currentDate) : vistaCalendario === 'mes' ? `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}` : `${currentDate.getFullYear()}`}
                        </span>
                        <button onClick={nextPeriod} onMouseEnter={(e) => { e.currentTarget.style.background = RED_GRAD; e.currentTarget.style.color = '#FFFFFF' }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = 'rgba(0,0,0,0.3)' }} className="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold transition-all" style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.3)' }}>›</button>
                      </div>
                      <h3 className="text-[#0D1B2A] text-sm font-bold absolute left-1/2 -translate-x-1/2">Historial de Entradas y Salidas</h3>
                      <div className="flex items-center gap-0.5 rounded-lg p-0.5" style={{ background: 'rgba(0,0,0,0.04)' }}>
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
                    </div>

                    {(vistaCalendario === 'semana') && (
                      <div className="px-5 pt-4 pb-4">
                        <div className="w-full">
                          <div className="grid gap-4 px-2 mb-3" style={{ gridTemplateColumns: '1.3fr 1fr 1fr 0.8fr' }}>
                            {['Día', 'Entrada', 'Salida', 'Duración'].map(h => (
                              <div key={h} className="text-sm font-bold" style={{ color: 'rgba(0,0,0,0.4)' }}>{h}</div>
                            ))}
                          </div>
                          <div className="space-y-1">
                            {(() => {
                              const weekStart = getWeekStart(currentDate)
                              const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
                              const monthShort = monthNames[weekStart.getMonth()].slice(0,3)
                              return Array.from({ length: 7 }, (_, i) => {
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
                                    className="grid gap-4 items-center px-4 py-4 rounded-xl transition-all"
                                    style={{
                                      gridTemplateColumns: '1.3fr 1fr 1fr 0.8fr',
                                      background: hasData ? (i % 2 === 0 ? 'rgba(230,57,70,0.04)' : 'transparent') : 'rgba(0,0,0,0.015)',
                                      borderLeft: hasData ? (i % 2 === 0 ? '3px solid rgba(230,57,70,0.15)' : '3px solid transparent') : '3px solid transparent',
                                      opacity: hasData ? 1 : 0.5,
                                    }}
                                  >
                                    <div className="flex flex-col">
                                      <span className="text-base font-semibold" style={{ color: hasData ? '#0D1B2A' : 'rgba(0,0,0,0.25)' }}>{dayNames[i]}</span>
                                      <span className="text-sm" style={{ color: hasData ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.15)' }}>{dayNum} {monthShort}</span>
                                    </div>
                                    {hasData ? (
                                      <>
                                        <div className="flex items-center gap-2.5">
                                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: '#30D158' }} />
                                          <span className="text-base font-semibold" style={{ color: '#0D1B2A' }}>{record.entrada}</span>
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: '#C62828' }} />
                                          <span className="text-base font-semibold" style={{ color: '#C62828' }}>{record.salida}</span>
                                        </div>
                                        <span className="text-base font-bold" style={{ color: '#E63946' }}>{record.duracion}</span>
                                      </>
                                    ) : (
                                      <>
                                        <span className="text-sm" style={{ color: 'rgba(0,0,0,0.15)' }}>—</span>
                                        <span className="text-sm" style={{ color: 'rgba(0,0,0,0.15)' }}>—</span>
                                        <span className="text-sm" style={{ color: 'rgba(0,0,0,0.15)' }}>—</span>
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
                                      className="text-center py-2.5 text-[11px] font-bold tracking-wide transition-all rounded-t-md"
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
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-[#0D1B2A] text-lg font-bold">Valoraciones Físicas</h3>
                          <p className="text-sm mt-0.5" style={{ color: 'rgba(0,0,0,0.35)' }}>Historial completo de evaluaciones del estudiante</p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
                          style={{
                            background: 'linear-gradient(135deg, #E63946, #D32F2F)',
                            color: '#FFFFFF',
                            boxShadow: '0 4px 16px rgba(230,57,70,0.25)',
                          }}
                        >
                          <Plus size={16} />
                          Nueva Valoración
                        </motion.button>
                      </div>

                      <div className="grid grid-cols-2 gap-5">
                        {[
                          {
                            date: '15 May 2026',
                            evaluator: 'Dr. Carlos Mendoza',
                            type: 'Completa',
                            metrics: [
                              { label: 'Peso', value: '72 kg' },
                              { label: 'IMC', value: '22.4' },
                              { label: 'Grasa corporal', value: '17%' },
                              { label: 'Masa muscular', value: '52 kg' },
                              { label: 'VO2 Max', value: '42 ml/kg/min' },
                              { label: 'Fuerza 1RM', value: '100 kg' },
                            ],
                            score: 87,
                            routine: 'Rutina Enero-Marzo',
                            color: '#30D158',
                          },
                          {
                            date: '20 Feb 2026',
                            evaluator: 'Dr. Carlos Mendoza',
                            type: 'Parcial',
                            metrics: [
                              { label: 'Peso', value: '74 kg' },
                              { label: 'IMC', value: '23.1' },
                              { label: 'Grasa corporal', value: '19%' },
                              { label: 'Masa muscular', value: '50 kg' },
                              { label: 'VO2 Max', value: '39 ml/kg/min' },
                              { label: 'Fuerza 1RM', value: '95 kg' },
                            ],
                            score: 79,
                            routine: 'Rutina Octubre-Diciembre',
                            color: '#FF9500',
                          },
                          {
                            date: '10 Nov 2025',
                            evaluator: 'Dr. Carlos Mendoza',
                            type: 'Inicial',
                            metrics: [
                              { label: 'Peso', value: '78 kg' },
                              { label: 'IMC', value: '24.3' },
                              { label: 'Grasa corporal', value: '22%' },
                              { label: 'Masa muscular', value: '48 kg' },
                              { label: 'VO2 Max', value: '35 ml/kg/min' },
                              { label: 'Fuerza 1RM', value: '85 kg' },
                            ],
                            score: 65,
                            routine: 'Rutina Julio-Septiembre',
                            color: '#E63946',
                          },
                          {
                            date: '05 Jun 2025',
                            evaluator: 'Dr. Carlos Mendoza',
                            type: 'Completa',
                            metrics: [
                              { label: 'Peso', value: '80 kg' },
                              { label: 'IMC', value: '25.0' },
                              { label: 'Grasa corporal', value: '24%' },
                              { label: 'Masa muscular', value: '46 kg' },
                              { label: 'VO2 Max', value: '33 ml/kg/min' },
                              { label: 'Fuerza 1RM', value: '80 kg' },
                            ],
                            score: 58,
                            routine: 'Rutina Abril-Junio',
                            color: '#E63946',
                          },
                        ].map((v, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="rounded-2xl overflow-hidden"
                            style={{
                              background: '#FFFFFF',
                              border: '1px solid rgba(0,0,0,0.04)',
                              borderRadius: 20,
                              boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
                            }}
                          >
                            <div className="flex items-center justify-between px-5 py-4" style={{
                              background: `linear-gradient(135deg, ${v.color}08, ${v.color}03)`,
                              borderBottom: '1px solid rgba(0,0,0,0.04)',
                            }}>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${v.color}15` }}>
                                  <BarChart2 size={18} style={{ color: v.color }} />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-bold" style={{ color: '#0D1B2A' }}>{v.date}</p>
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md" style={{ background: `${v.color}15`, color: v.color }}>
                                      {v.type}
                                    </span>
                                  </div>
                                  <p className="text-[11px]" style={{ color: 'rgba(0,0,0,0.35)' }}>{v.evaluator}</p>
                                </div>
                              </div>
                              <div className="flex flex-col items-center">
                                <div className="relative" style={{ width: 44, height: 44 }}>
                                  <svg viewBox="0 0 36 36" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
                                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="2.8" />
                                    <circle cx="18" cy="18" r="15.9" fill="none" stroke={v.color} strokeWidth="2.8" strokeLinecap="round"
                                      strokeDasharray={`${v.score * 0.999} ${100 - v.score * 0.999}`} />
                                  </svg>
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="text-[10px] font-extrabold" style={{ color: v.color }}>{v.score}%</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="p-5">
                              <div className="grid grid-cols-3 gap-3 mb-4">
                                {v.metrics.slice(0, 6).map(m => (
                                  <div key={m.label} className="text-center">
                                    <p className="text-sm font-bold" style={{ color: '#0D1B2A' }}>{m.value}</p>
                                    <p className="text-[10px] font-medium mt-0.5" style={{ color: 'rgba(0,0,0,0.35)' }}>{m.label}</p>
                                  </div>
                                ))}
                              </div>
                              <div className="flex items-center justify-between gap-2 pt-3" style={{ borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                                <div className="flex items-center gap-2 text-[11px]" style={{ color: 'rgba(0,0,0,0.35)' }}>
                                  <Dumbbell size={13} />
                                  {v.routine}
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    className="px-3.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
                                    style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.5)' }}
                                  >
                                    Ver valoración
                                  </button>
                                  <button
                                    className="px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition-all"
                                    style={{ background: `${v.color}15`, color: v.color }}
                                  >
                                    Ver rutina
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                  {currentTab === 'documents' && (
                    <div className="grid grid-cols-3 gap-6 h-full">
                      {[
                        {
                          title: 'Documentos Legales',
                          icon: Shield,
                          color: '#BF5AF2',
                          docs: [
                            { name: 'Contrato de Matrícula', date: '15 Ene 2026', signed: true },
                            { name: 'Consentimiento Informado', date: '15 Ene 2026', signed: true },
                          ],
                        },
                        {
                          title: 'Informes Médicos',
                          icon: Activity,
                          color: '#FF9500',
                          docs: [
                            { name: 'Informe Médico Inicial', date: '20 Ene 2026', signed: true },
                            { name: 'Valoración Inicial', date: '22 Ene 2026', signed: true },
                          ],
                        },
                        {
                          title: 'Rutinas y Progreso',
                          icon: TrendingUp,
                          color: '#E63946',
                          docs: [
                            { name: 'Rutina Enero-Marzo', date: '25 Ene 2026', signed: false },
                            { name: 'Informe de Progreso Q1', date: '31 Mar 2026', signed: false },
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
                          <div className="flex items-center gap-3 mb-5 pb-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${section.color}12` }}>
                              <section.icon size={17} style={{ color: section.color }} />
                            </div>
                            <h3 className="text-[#0D1B2A] text-sm font-bold">{section.title}</h3>
                          </div>
                          <div className="flex-1 space-y-3">
                            {section.docs.map((doc, di) => (
                              <motion.div
                                key={di}
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: si * 0.1 + di * 0.06 }}
                                className="rounded-xl p-4 transition-all hover:scale-[1.02]"
                                style={{
                                  background: 'rgba(255,255,255,0.7)',
                                  border: '1px solid rgba(0,0,0,0.05)',
                                }}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(230,57,70,0.06)' }}>
                                    <FileText size={14} style={{ color: '#E63946' }} />
                                  </div>
                                  {doc.signed ? (
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md" style={{ background: 'rgba(48,209,88,0.1)', color: '#30D158' }}>
                                      Firmado
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md" style={{ background: 'rgba(255,149,0,0.1)', color: '#FF9500' }}>
                                      Pendiente
                                    </span>
                                  )}
                                </div>
                                <p className="text-[#0D1B2A] text-sm font-semibold">{doc.name}</p>
                                <p className="text-[11px] mt-0.5" style={{ color: 'rgba(0,0,0,0.35)' }}>{doc.date}</p>
                                <button
                                  className="mt-3 w-full py-2 rounded-xl text-[11px] font-semibold transition-all"
                                  style={{ background: 'rgba(0,0,0,0.03)', color: 'rgba(0,0,0,0.45)', border: '1px solid rgba(0,0,0,0.06)' }}
                                >
                                  Ver documento
                                </button>
                              </motion.div>
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
    </div>
  )
}
