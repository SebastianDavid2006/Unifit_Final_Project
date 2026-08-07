import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as ReTooltip, ResponsiveContainer, Cell, PieChart, Pie, LabelList,
} from 'recharts'
import {
  Users, Activity,
  TrendingUp, Building2, Search, X,
} from 'lucide-react'
import { StudentCardView } from '../../assets/models/ui/objects/student_card/StudentCardModel'
import { ListView } from '../../assets/models/ui/objects/list/ListModel'
import { StudentsView } from '../../assets/models/ui/users/students/StudentsModel'
import { CalendarView } from '../../assets/models/ui/objects/calendar/CalendarModel'
import { ClockView } from '../../assets/models/ui/objects/clock/ClockModel'
import { CAREER_STATS } from '../../data/careerStats'

const BLUE = '#1270B7'
const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #1A8CDB, #0D5F9E)'

const CAT_COLORS: Record<string, string> = {
  técnico: '#1270B7',
  profesional: '#30D158',
  especialización: '#BF5AF2',
}

const evolutionData = [
  { mes: 'Ene', date: '2026-01-15', usuarios: 380, asistencia: 2350 },
  { mes: 'Feb', date: '2026-02-15', usuarios: 415, asistencia: 2540 },
  { mes: 'Mar', date: '2026-03-15', usuarios: 450, asistencia: 2780 },
  { mes: 'Abr', date: '2026-04-15', usuarios: 495, asistencia: 3010 },
  { mes: 'May', date: '2026-05-15', usuarios: 545, asistencia: 3290 },
  { mes: 'Jun', date: '2026-06-15', usuarios: 595, asistencia: 3550 },
  { mes: 'Jul', date: '2026-07-15', usuarios: 660, asistencia: 3860 },
  { mes: 'Ago', date: '2026-08-15', usuarios: 720, asistencia: 4150 },
  { mes: 'Sep', date: '2026-09-15', usuarios: 775, asistencia: 4430 },
  { mes: 'Oct', date: '2026-10-15', usuarios: 805, asistencia: 4680 },
  { mes: 'Nov', date: '2026-11-15', usuarios: 830, asistencia: 4980 },
  { mes: 'Dic', date: '2026-12-15', usuarios: 847, asistencia: 5200 },
]

const scheduleWeekly = [
  { day: 'Lun', clases: 8, asistencia: 112 },
  { day: 'Mar', clases: 7, asistencia: 96 },
  { day: 'Mié', clases: 9, asistencia: 124 },
  { day: 'Jue', clases: 6, asistencia: 88 },
  { day: 'Vie', clases: 8, asistencia: 118 },
  { day: 'Sáb', clases: 5, asistencia: 74 },
  { day: 'Dom', clases: 2, asistencia: 26 },
]

const scheduleHours = [
  { hora: '12pm', asistencia: 68 },
  { hora: '2pm', asistencia: 54 },
  { hora: '4pm', asistencia: 76 },
  { hora: '6pm', asistencia: 112 },
  { hora: '8pm', asistencia: 88 },
  { hora: '10pm', asistencia: 52 },
]

const heatDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const heatBlocks = [
  { label: '12pm-2pm' },
  { label: '2pm-4pm' },
  { label: '4pm-6pm' },
  { label: '6pm-8pm' },
  { label: '8pm-10pm' },
]
const heatBase = [20, 30, 45, 60, 42]
const heatDayFactor = [0.9, 1.0, 0.85, 1.1, 1.3, 0.7, 0.3]
const heatmapData: { day: string; block: number; value: number }[] = []
heatDays.forEach((day, di) => {
  heatBlocks.forEach((_, bi) => {
    heatmapData.push({ day, block: bi, value: Math.round(heatBase[bi] * heatDayFactor[di]) })
  })
})
const maxHeatValue = Math.max(...heatmapData.map(d => d.value))

export default function AdminStats({ tab, onTabChange, showCareerFilter, onToggleCareerFilter, statsRange }: {
  tab: string
  onTabChange: (t: string) => void
  showCareerFilter: boolean
  onToggleCareerFilter: () => void
  statsRange: { start: string; end: string }
}) {
  const [careersModal, setCareersModal] = useState<'registered' | 'attendance' | null>(null)
  const [careerQuery, setCareerQuery] = useState('')

  const filteredEvolution = (statsRange.start && statsRange.end)
    ? evolutionData.filter(m => m.date >= statsRange.start && m.date <= statsRange.end)
    : evolutionData
  const lastUsuarios = filteredEvolution[filteredEvolution.length - 1]?.usuarios ?? 847
  const asistenciasPeriodo = filteredEvolution.reduce((s, m) => s + m.asistencia, 0)
  const totalClasesSemana = scheduleWeekly.reduce((s, d) => s + d.clases, 0)
  const promedioAsistentesClase = Math.round(scheduleWeekly.reduce((s, d) => s + d.asistencia, 0) / totalClasesSemana)

  const careerData = CAREER_STATS
  const allCareers = careerData
  const careerCategories: { id: string; label: string }[] = [
    { id: 'técnico', label: 'Técnicos' },
    { id: 'profesional', label: 'Profesionales' },
    { id: 'especialización', label: 'Especializaciones' },
  ]
  const careerQueryNorm = careerQuery.trim().toLowerCase()
  const baseCareers = careerQueryNorm ? careerData.filter(c => c.faculty.toLowerCase().includes(careerQueryNorm)) : careerData
  const visibleCareers = baseCareers
  const modalCareers = careerQueryNorm ? allCareers.filter(c => c.faculty.toLowerCase().includes(careerQueryNorm)) : allCareers
  const careerChart = [...baseCareers].sort((a, b) => b.registered - a.registered).slice(0, 10)
  const attendanceChart = [...baseCareers].sort((a, b) => b.attendance - a.attendance).slice(0, 10)
  const empty = { faculty: '—', registered: 0, attendance: 0, color: BLUE }
  const totalCareers = visibleCareers.length
  const topRegistered = [...visibleCareers].sort((a, b) => b.registered - a.registered)[0] ?? empty
  const topAttendance = [...visibleCareers].sort((a, b) => b.attendance - a.attendance)[0] ?? empty
  const lowestAttendance = [...visibleCareers].sort((a, b) => a.attendance - b.attendance)[0] ?? empty
  const lowestRegistered = [...visibleCareers].sort((a, b) => a.registered - b.registered)[0] ?? empty

  return (
    <div className="p-8 space-y-6 w-full relative">
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          {tab === 'overview' && (
            <>
              <div className="grid grid-cols-5 gap-4 mb-8">
                {[
                  { label: 'Total Usuarios', value: String(lastUsuarios), sub: 'Registrados en el sistema', color: '#1270B7', view: StudentsView },
                  { label: 'Asistencias del Período', value: asistenciasPeriodo.toLocaleString('en-US'), sub: 'Asistencias acumuladas', color: '#30D158', view: StudentCardView },
                  { label: 'Carrera con Más Estudiantes', value: topRegistered.faculty, sub: `${topRegistered.registered} registrados`, color: '#BF5AF2', view: CalendarView },
                  { label: 'Carreras Activas', value: '27', sub: 'Facultades en el programa', color: '#FF9F0A', view: ListView },
                  { label: 'Hora Pico', value: '6pm', sub: '112 asistencias', color: '#FF6B8A', view: ClockView },
                ].map((card, i) => {
                  const ModelView = card.view
                  return (
                    <motion.div key={card.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                      className="relative rounded-2xl p-4 group cursor-pointer transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{
                        background: '#FFFFFF',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-14 h-14 flex-shrink-0 z-20 pointer-events-none transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                        >
                          <ModelView />
                        </div>
                        <div className="relative z-10 min-w-0">
                          <span className="stat-value block transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ fontSize: '1.15rem', fontWeight: 800, lineHeight: 1.2, color: card.color }}>{card.value}</span>
                          <p className="text-[11px] mt-1 font-bold truncate" style={{ color: '#1A1A1E' }}>{card.label}</p>
                          <p className="text-[11px] mt-1 font-semibold truncate" style={{ color: 'rgba(0,0,0,0.65)' }}>{card.sub}</p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  whileHover={{ scale: 1.01 }}
                  className="rounded-2xl p-6 premium-card"
                >
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${BLUE}10` }}>
                      <TrendingUp size={14} style={{ color: BLUE }} />
                    </div>
                    <span className="text-xs font-bold tracking-wide" style={{ color: '#1A1A1E' }}>EVOLUCIÓN DE USUARIOS A TRAVÉS DEL TIEMPO</span>
                  </div>
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={filteredEvolution} margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                      <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 600 }} axisLine={false} tickLine={false} width={30} />
                      <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }} />
                      <defs>
                        <linearGradient id="evoUsersGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={BLUE} stopOpacity={0.25} />
                          <stop offset="100%" stopColor={BLUE} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="usuarios" stroke={BLUE} strokeWidth={2.5} fill="url(#evoUsersGrad)" dot={{ r: 3, fill: BLUE, strokeWidth: 0 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.01 }}
                  className="rounded-2xl p-6 premium-card"
                >
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${BLUE}10` }}>
                      <Activity size={14} style={{ color: BLUE }} />
                    </div>
                    <span className="text-xs font-bold tracking-wide" style={{ color: '#1A1A1E' }}>EVOLUCIÓN DE ASISTENCIA A TRAVÉS DEL TIEMPO</span>
                  </div>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={filteredEvolution} margin={{ left: 0, right: 16, top: 0, bottom: 0 }} barCategoryGap="26%">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                      <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 600 }} axisLine={false} tickLine={false} width={30} />
                      <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }} />
                      <defs>
                        <linearGradient id="evoAsistGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={BLUE} />
                          <stop offset="100%" stopColor="#FFFFFF" />
                        </linearGradient>
                      </defs>
                      <Bar dataKey="asistencia" fill="url(#evoAsistGrad)" radius={[8, 8, 0, 0]}>
                        <LabelList dataKey="asistencia" position="top" style={{ fontSize: 9, fontWeight: 700, fill: '#1270B7' }} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>
            </>
          )}

          {tab === 'careers' && (
            <>
              {showCareerFilter && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative mb-6"
                >
                  <div className="flex items-center gap-3 rounded-2xl px-4 py-3" style={{ background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)' }}>
                    <Search size={16} style={{ color: 'rgba(0,0,0,0.3)' }} />
                    <input
                      value={careerQuery}
                      onChange={e => setCareerQuery(e.target.value)}
                      placeholder="Buscar carrera por nombre..."
                      className="flex-1 bg-transparent text-sm font-semibold outline-none"
                      style={{ color: '#1A1A1E' }}
                    />
                    {careerQuery && (
                      <button onClick={() => setCareerQuery('')} className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.05)' }}>
                        <X size={12} style={{ color: 'rgba(0,0,0,0.4)' }} />
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
              <div className="grid grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Carreras Activas', value: String(totalCareers), sub: 'Facultades en el programa', color: '#BF5AF2', view: ListView },
                  { label: 'Más Estudiantes', value: topRegistered.faculty, sub: `${topRegistered.registered} registrados`, color: BLUE, view: StudentsView },
                  { label: 'Más Asistencia', value: topAttendance.faculty, sub: `${topAttendance.attendance} asistiendo`, color: '#30D158', view: StudentCardView },
                  { label: 'Menos Asistencia', value: lowestAttendance.faculty, sub: `${lowestAttendance.attendance} asistiendo`, color: '#F43843', view: ListView },
                ].map((card, i) => {
                  const ModelView = card.view
                  return (
                    <motion.div key={card.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                      className="relative rounded-2xl p-4 group cursor-pointer transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{
                        background: '#FFFFFF',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-14 h-14 flex-shrink-0 z-20 pointer-events-none transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                        >
                          <ModelView />
                        </div>
                        <div className="relative z-10 min-w-0">
                          <span className="stat-value block transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ fontSize: '1.15rem', fontWeight: 800, lineHeight: 1.2, color: card.color }}>{card.value}</span>
                          <p className="text-[11px] mt-1 font-bold truncate" style={{ color: '#1A1A1E' }}>{card.label}</p>
                          <p className="text-[11px] mt-1 font-semibold truncate" style={{ color: 'rgba(0,0,0,0.65)' }}>{card.sub}</p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  whileHover={{ scale: 1.01 }}
                  className="rounded-2xl p-6 premium-card"
                >
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${BLUE}10` }}>
                      <Users size={14} style={{ color: BLUE }} />
                    </div>
                    <span className="text-xs font-bold tracking-wide" style={{ color: '#1A1A1E' }}>ESTUDIANTES REGISTRADOS POR CARRERA</span>
                  </div>
                  <ResponsiveContainer width="100%" height={360}>
                    <BarChart data={careerChart} layout="vertical" margin={{ left: 0, right: 40, top: 0, bottom: 0 }} barCategoryGap="22%">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="faculty" tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 600 }} axisLine={false} tickLine={false} width={150} />
                      <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }} />
                      <defs>
                        <linearGradient id="careerRegGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#FFFFFF" />
                          <stop offset="100%" stopColor="#1270B7" />
                        </linearGradient>
                      </defs>
                      <Bar dataKey="registered" fill="url(#careerRegGrad)" radius={[0, 8, 8, 0]}>
                        <LabelList dataKey="registered" position="right" style={{ fontSize: 11, fontWeight: 700, fill: '#1270B7' }} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCareersModal('registered')}
                    className="mt-4 w-full py-2.5 rounded-xl text-xs font-bold transition-all"
                    style={{ background: `${BLUE}08`, color: BLUE, border: `1px solid ${BLUE}20` }}
                  >
                    Ver todas las carreras
                  </motion.button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.01 }}
                  className="rounded-2xl p-6 premium-card"
                >
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${BLUE}10` }}>
                      <Activity size={14} style={{ color: BLUE }} />
                    </div>
                    <span className="text-xs font-bold tracking-wide" style={{ color: '#1A1A1E' }}>ASISTENCIA DE ESTUDIANTES POR CARRERA</span>
                  </div>
                  <ResponsiveContainer width="100%" height={360}>
                    <BarChart data={attendanceChart} layout="vertical" margin={{ left: 0, right: 40, top: 0, bottom: 0 }} barCategoryGap="22%">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="faculty" tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 600 }} axisLine={false} tickLine={false} width={150} />
                      <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }} />
                      <defs>
                        <linearGradient id="careerAttGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#FFFFFF" />
                          <stop offset="100%" stopColor="#1270B7" />
                        </linearGradient>
                      </defs>
                      <Bar dataKey="attendance" fill="url(#careerAttGrad)" radius={[0, 8, 8, 0]}>
                        <LabelList dataKey="attendance" position="right" style={{ fontSize: 11, fontWeight: 700, fill: '#1270B7' }} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCareersModal('attendance')}
                    className="mt-4 w-full py-2.5 rounded-xl text-xs font-bold transition-all"
                    style={{ background: `${BLUE}08`, color: BLUE, border: `1px solid ${BLUE}20` }}
                  >
                    Ver todas las carreras
                  </motion.button>
                </motion.div>
              </div>

              {careersModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-6"
                  style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}
                  onClick={() => setCareersModal(null)}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                    className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl p-6"
                    style={{ background: '#FFFFFF', boxShadow: '0 24px 80px rgba(0,0,0,0.15)' }}
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${BLUE}10` }}>
                          {careersModal === 'registered' ? <Users size={16} style={{ color: BLUE }} /> : <Activity size={16} style={{ color: BLUE }} />}
                        </div>
                        <h2 className="text-lg font-extrabold" style={{ color: '#1A1A1E' }}>
                          {careersModal === 'registered' ? 'Estudiantes Registrados' : 'Asistencia de Estudiantes'} — {allCareers.length} Carreras
                        </h2>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCareersModal(null)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center"
                        style={{ background: 'rgba(0,0,0,0.05)' }}
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="rgba(0,0,0,0.3)" strokeWidth="2" strokeLinecap="round"/></svg>
                      </motion.button>
                    </div>
                    <div className="flex items-center gap-4 mb-4 flex-wrap">
                      <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <Search size={14} style={{ color: 'rgba(0,0,0,0.3)' }} />
                        <input
                          value={careerQuery}
                          onChange={e => setCareerQuery(e.target.value)}
                          placeholder="Buscar carrera..."
                          className="bg-transparent text-xs font-semibold outline-none"
                          style={{ color: '#1A1A1E' }}
                        />
                        {careerQuery && (
                          <button onClick={() => setCareerQuery('')} className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.05)' }}>
                            <X size={12} style={{ color: 'rgba(0,0,0,0.4)' }} />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-4 ml-auto">
                        {careerCategories.map(cat => (
                          <span key={cat.id} className="flex items-center gap-1.5 text-[10px] font-bold" style={{ color: 'rgba(0,0,0,0.5)' }}>
                            <span className="w-2.5 h-2.5 rounded-full" style={{ background: CAT_COLORS[cat.id] }} />
                            {cat.label}
                          </span>
                        ))}
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={Math.max(420, modalCareers.length * 34)}>
                      <BarChart data={modalCareers} layout="vertical" margin={{ left: 0, right: 40, top: 0, bottom: 0 }} barCategoryGap="28%">
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" horizontal={false} />
                        <XAxis type="number" tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 600 }} axisLine={false} tickLine={false} />
                        <YAxis type="category" dataKey="faculty" tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 600 }} axisLine={false} tickLine={false} width={250} interval={0} />
                        <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }} />
                        <Bar dataKey={careersModal === 'registered' ? 'registered' : 'attendance'} radius={[0, 6, 6, 0]}>
                          {modalCareers.map((c, i) => (
                            <Cell key={i} fill={CAT_COLORS[c.cat] ?? BLUE} />
                          ))}
                          <LabelList dataKey={careersModal === 'registered' ? 'registered' : 'attendance'} position="right" style={{ fontSize: 11, fontWeight: 700, fill: 'rgba(0,0,0,0.5)' }} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                </motion.div>
              )}
            </>
          )}

          {tab === 'students' && (
            <>
              <div className="grid grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Estudiantes', value: '847', sub: 'Registrados en el sistema', color: '#1270B7', view: StudentsView },
                  { label: 'Estudiantes Activos', value: '623', sub: 'Con asistencia este mes', color: '#30D158', view: StudentCardView },
                  { label: 'Estudiantes Inactivos', value: '224', sub: 'Sin actividad reciente', color: '#F43843', view: ListView },
                  { label: 'Asistencias Totales', value: '2,847', sub: 'Acumuladas del período', color: '#BF5AF2', view: CalendarView },
                ].map((card, i) => {
                  const ModelView = card.view
                  return (
                    <motion.div key={card.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                      className="relative rounded-2xl p-4 group cursor-pointer transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{
                        background: '#FFFFFF',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-14 h-14 flex-shrink-0 z-20 pointer-events-none transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                        >
                          <ModelView />
                        </div>
                        <div className="relative z-10 min-w-0">
                          <span className="stat-value block transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ fontSize: '1.15rem', fontWeight: 800, lineHeight: 1.2, color: card.color }}>{card.value}</span>
                          <p className="text-xs mt-1 font-bold truncate" style={{ color: '#1A1A1E' }}>{card.label}</p>
                          <p className="text-[11px] mt-1 font-semibold truncate" style={{ color: 'rgba(0,0,0,0.65)' }}>{card.sub}</p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  whileHover={{ scale: 1.01 }}
                  className="rounded-2xl p-6 premium-card"
                >
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${BLUE}10` }}>
                      <TrendingUp size={14} style={{ color: BLUE }} />
                    </div>
                    <span className="text-xs font-bold tracking-wide" style={{ color: '#1A1A1E' }}>EVOLUCIÓN DE ESTUDIANTES</span>
                  </div>
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={[
                      { mes: 'Ene', estudiantes: 520 }, { mes: 'Feb', estudiantes: 580 },
                      { mes: 'Mar', estudiantes: 610 }, { mes: 'Abr', estudiantes: 680 },
                      { mes: 'May', estudiantes: 740 }, { mes: 'Jun', estudiantes: 847 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                      <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }} />
                      <Area type="monotone" dataKey="estudiantes" stroke={BLUE} fill="url(#evoGrad)" strokeWidth={2.5} />
                      <defs>
                        <linearGradient id="evoGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={BLUE} stopOpacity={0.25} />
                          <stop offset="100%" stopColor={BLUE} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.01 }}
                  className="rounded-2xl p-6 premium-card"
                >
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${BLUE}10` }}>
                      <Users size={14} style={{ color: BLUE }} />
                    </div>
                    <span className="text-xs font-bold tracking-wide" style={{ color: '#1A1A1E' }}>DISTRIBUCIÓN POR SEXO</span>
                  </div>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={[
                        { name: 'Masculino', value: 491, color: '#1270B7' },
                        { name: 'Femenino', value: 356, color: '#FF6B8A' },
                      ]} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={4}>
                        <Cell fill="#1270B7" />
                        <Cell fill="#FF6B8A" />
                      </Pie>
                      <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-6 mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: '#1270B7' }} />
                      <span className="text-[10px] font-medium" style={{ color: 'rgba(0,0,0,0.5)' }}>Masculino 58%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: '#FF6B8A' }} />
                      <span className="text-[10px] font-medium" style={{ color: 'rgba(0,0,0,0.5)' }}>Femenino 42%</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  whileHover={{ scale: 1.01 }}
                  className="rounded-2xl p-6 premium-card"
                >
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${BLUE}10` }}>
                      <Activity size={14} style={{ color: BLUE }} />
                    </div>
                    <span className="text-xs font-bold tracking-wide" style={{ color: '#1A1A1E' }}>ACTIVOS VS INACTIVOS</span>
                  </div>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={[
                        { name: 'Activos', value: 623, color: '#30D158' },
                        { name: 'Inactivos', value: 224, color: '#F43843' },
                      ]} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={4}>
                        <Cell fill="#30D158" />
                        <Cell fill="#F43843" />
                      </Pie>
                      <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-6 mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: '#30D158' }} />
                      <span className="text-[10px] font-medium" style={{ color: 'rgba(0,0,0,0.5)' }}>Activos 74%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: '#F43843' }} />
                      <span className="text-[10px] font-medium" style={{ color: 'rgba(0,0,0,0.5)' }}>Inactivos 26%</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.01 }}
                  className="rounded-2xl p-6 premium-card"
                >
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${BLUE}10` }}>
                      <Users size={14} style={{ color: BLUE }} />
                    </div>
                    <span className="text-xs font-bold tracking-wide" style={{ color: '#1A1A1E' }}>DISTRIBUCIÓN POR CARGO</span>
                  </div>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={[
                      { cargo: 'Estudiante', cantidad: 720 },
                      { cargo: 'Egresado', cantidad: 85 },
                      { cargo: 'Docente', cantidad: 25 },
                      { cargo: 'Administrativo', cantidad: 17 },
                    ]} margin={{ left: 0, right: 16, top: 0, bottom: 0 }} barCategoryGap="18%">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                      <XAxis dataKey="cargo" tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }} />
                      <defs>
                        <linearGradient id="barCargoGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563EB" />
                          <stop offset="100%" stopColor="#93C5FD" />
                        </linearGradient>
                      </defs>
                      <Bar dataKey="cantidad" fill="url(#barCargoGrad)" radius={[12, 12, 0, 0]}>
                        <LabelList dataKey="cantidad" position="top" style={{ fontSize: 11, fontWeight: 700, fill: '#2563EB' }} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  whileHover={{ scale: 1.01 }}
                  className="rounded-2xl p-6 premium-card"
                >
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${BLUE}10` }}>
                      <Building2 size={14} style={{ color: BLUE }} />
                    </div>
                    <span className="text-xs font-bold tracking-wide" style={{ color: '#1A1A1E' }}>DISTRIBUCIÓN POR ÁREA</span>
                  </div>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={[
                      { area: 'Ingeniería', cantidad: 212 },
                      { area: 'Cs. Salud', cantidad: 169 },
                      { area: 'Cs. Sociales', cantidad: 152 },
                      { area: 'Arte', cantidad: 127 },
                      { area: 'Administración', cantidad: 102 },
                      { area: 'Otras', cantidad: 85 },
                    ]} margin={{ left: 0, right: 16, top: 0, bottom: 0 }} barCategoryGap="18%">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                      <XAxis dataKey="area" tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }} />
                      <defs>
                        <linearGradient id="barAreaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563EB" />
                          <stop offset="100%" stopColor="#93C5FD" />
                        </linearGradient>
                      </defs>
                      <Bar dataKey="cantidad" fill="url(#barAreaGrad)" radius={[12, 12, 0, 0]}>
                        <LabelList dataKey="cantidad" position="top" style={{ fontSize: 11, fontWeight: 700, fill: '#2563EB' }} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>
            </>
          )}

          {tab === 'schedule' && (
            <>
              <div className="grid grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Clases por Semana', value: '45', sub: 'Sesiones programadas', color: '#1270B7', view: CalendarView },
                  { label: 'Entrenadores Activos', value: '12', sub: 'Instructores en planta', color: '#30D158', view: StudentsView },
                  { label: 'Asistentes por Clase', value: String(promedioAsistentesClase), sub: 'Promedio de la semana', color: '#BF5AF2', view: StudentCardView },
                  { label: 'Horas Programadas', value: '68h', sub: 'Actividad semanal', color: '#FF9F0A', view: ListView },
                ].map((card, i) => {
                  const ModelView = card.view
                  return (
                    <motion.div key={card.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                      className="relative rounded-2xl p-4 group cursor-pointer transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{
                        background: '#FFFFFF',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-14 h-14 flex-shrink-0 z-20 pointer-events-none transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                        >
                          <ModelView />
                        </div>
                        <div className="relative z-10 min-w-0">
                          <span className="stat-value block transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ fontSize: '1.15rem', fontWeight: 800, lineHeight: 1.2, color: card.color }}>{card.value}</span>
                          <p className="text-[11px] mt-1 font-bold truncate" style={{ color: '#1A1A1E' }}>{card.label}</p>
                          <p className="text-[11px] mt-1 font-semibold truncate" style={{ color: 'rgba(0,0,0,0.65)' }}>{card.sub}</p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  whileHover={{ scale: 1.01 }}
                  className="rounded-2xl p-6 premium-card"
                >
                  <div className="flex items-center justify-center mb-5">
                    <span className="text-xs font-bold tracking-wide" style={{ color: '#1A1A1E' }}>HORA PICO DE LA SEMANA</span>
                  </div>
                  <div className="flex">
                    <div className="flex flex-col gap-[3px] pt-6 pr-2">
                      {heatDays.map(day => (
                        <div key={day} className="flex items-center justify-end h-[30px]">
                          <span className="text-[11px] font-semibold" style={{ color: 'rgba(0,0,0,0.6)' }}>{day}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex-1">
                      <div className="flex gap-[3px] mb-[3px]">
                        {heatBlocks.map(block => (
                          <div key={block.label} className="flex-1 text-center">
                            <span className="text-[9px] font-medium" style={{ color: 'rgba(0,0,0,0.5)' }}>{block.label}</span>
                          </div>
                        ))}
                      </div>
                      {heatDays.map(day => (
                        <div key={day} className="flex gap-[3px] mb-[3px]">
                          {heatBlocks.map((block, bi) => {
                            const entry = heatmapData.find(d => d.day === day && d.block === bi)
                            const value = entry?.value ?? 0
                            const intensity = value / maxHeatValue
                            const meshBg = `radial-gradient(ellipse at 20% 20%, rgba(99,148,237,${0.08 + intensity * 0.72}) 0%, transparent 60%),
                              radial-gradient(ellipse at 80% 80%, rgba(59,130,246,${0.05 + intensity * 0.75}) 0%, transparent 60%),
                              radial-gradient(ellipse at 50% 50%, rgba(37,99,235,${0.04 + intensity * 0.6}) 0%, transparent 70%),
                              linear-gradient(135deg, rgb(${Math.round(235 - 210 * intensity)},${Math.round(240 - 110 * intensity)},${Math.round(252 - 40 * intensity)}), rgb(${Math.round(180 - 160 * intensity)},${Math.round(210 - 80 * intensity)},${Math.round(250 - 20 * intensity)}))`
                            return (
                              <div
                                key={`${day}-${bi}`}
                                className="flex-1 rounded-lg cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-md flex items-center justify-center"
                                style={{ height: 30, background: meshBg }}
                                title={`${day} · ${block.label}: ${value} asistencias`}
                              >
                                <span style={{ fontSize: 11, fontWeight: 800, color: '#1B3A6B' }}>{value}</span>
                              </div>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 px-1">
                    {[0, 0.25, 0.5, 0.75, 1].map((t, i, arr) => {
                      const from = i === 0 ? 0 : Math.round(maxHeatValue * arr[i - 1]) + 1
                      const to = Math.round(maxHeatValue * t)
                      const r = Math.round(210 - 180 * t)
                      const g = Math.round(225 - 80 * t)
                      const b = Math.round(250 - 20 * t)
                      return (
                        <div key={i} className="flex items-center gap-1.5">
                          <div style={{ width: 22, height: 14, borderRadius: 4, background: `linear-gradient(180deg, rgb(${r},${g},${b}), rgb(${Math.round(r * 0.7)},${Math.round(g * 0.8)},${Math.round(b * 1.02)}))` }} />
                          <span className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.6)' }}>{from}-{to}</span>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.01 }}
                  className="rounded-2xl p-6 premium-card"
                >
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${BLUE}10` }}>
                      <Activity size={14} style={{ color: BLUE }} />
                    </div>
                    <span className="text-xs font-bold tracking-wide" style={{ color: '#1A1A1E' }}>ASISTENCIA POR HORA</span>
                  </div>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={scheduleHours} margin={{ left: 0, right: 16, top: 0, bottom: 0 }} barCategoryGap="26%">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                      <XAxis dataKey="hora" tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 600 }} axisLine={false} tickLine={false} width={30} />
                      <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }} />
                      <defs>
                        <linearGradient id="scheduleHourGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#30D158" />
                          <stop offset="100%" stopColor="#FFFFFF" />
                        </linearGradient>
                      </defs>
                      <Bar dataKey="asistencia" fill="url(#scheduleHourGrad)" radius={[8, 8, 0, 0]}>
                        <LabelList dataKey="asistencia" position="top" style={{ fontSize: 10, fontWeight: 700, fill: '#30D158' }} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
