import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as ReTooltip, ResponsiveContainer, Cell, PieChart, Pie, LabelList,
} from 'recharts'
import {
  Users, Activity, Clock,
  TrendingUp, BarChart3, Building2, Search, X,
} from 'lucide-react'
import trophyImg from '../../assets/images/trophy.png'
import { StudentCardView } from '../../assets/models/ui/objects/student_card/StudentCardModel'
import { ListView } from '../../assets/models/ui/objects/list/ListModel'
import { StudentsView } from '../../assets/models/ui/users/students/StudentsModel'
import { CalendarView } from '../../assets/models/ui/objects/calendar/CalendarModel'

const BLUE = '#1270B7'
const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #1A8CDB, #0D5F9E)'

const CAT_COLORS: Record<string, string> = {
  técnico: '#1270B7',
  profesional: '#30D158',
  especialización: '#BF5AF2',
}

const weeklyData = [
  { day: 'Lun', asistentes: 45, objetivo: 60 },
  { day: 'Mar', asistentes: 67, objetivo: 60 },
  { day: 'Mié', asistentes: 52, objetivo: 60 },
  { day: 'Jue', asistentes: 78, objetivo: 60 },
  { day: 'Vie', asistentes: 89, objetivo: 60 },
  { day: 'Sáb', asistentes: 34, objetivo: 60 },
  { day: 'Dom', asistentes: 12, objetivo: 60 },
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
  { hora: '6am', asistencia: 34 },
  { hora: '8am', asistencia: 82 },
  { hora: '10am', asistencia: 96 },
  { hora: '12pm', asistencia: 68 },
  { hora: '2pm', asistencia: 54 },
  { hora: '4pm', asistencia: 76 },
  { hora: '6pm', asistencia: 112 },
  { hora: '8pm', asistencia: 88 },
]

export default function AdminStats({ tab, onTabChange, showCareerFilter, onToggleCareerFilter }: {
  tab: string
  onTabChange: (t: string) => void
  showCareerFilter: boolean
  onToggleCareerFilter: () => void
}) {
  const [statsPeriod, setStatsPeriod] = useState<'week' | 'month' | 'year'>('month')
  const [careersModal, setCareersModal] = useState<'registered' | 'attendance' | null>(null)
  const [careerQuery, setCareerQuery] = useState('')

  const careerData = [
    { faculty: 'Administración de Empresas', registered: 48, attendance: 42, color: '#1270B7', cat: 'profesional' },
    { faculty: 'Ingeniería de Software', registered: 45, attendance: 40, color: '#30D158', cat: 'profesional' },
    { faculty: 'Auxiliar en Enfermería', registered: 44, attendance: 38, color: '#FF9F0A', cat: 'técnico' },
    { faculty: 'Contaduría Pública', registered: 42, attendance: 36, color: '#BF5AF2', cat: 'profesional' },
    { faculty: 'Auxiliar Administrativo', registered: 41, attendance: 35, color: '#F43843', cat: 'técnico' },
    { faculty: 'Ingeniería de Sistemas', registered: 40, attendance: 34, color: '#5E5CE6', cat: 'profesional' },
    { faculty: 'Diseño Gráfico', registered: 39, attendance: 33, color: '#FF6482', cat: 'técnico' },
    { faculty: 'Ingeniería Industrial', registered: 38, attendance: 31, color: '#00C7BE', cat: 'profesional' },
    { faculty: 'Derecho', registered: 37, attendance: 30, color: '#64D2FF', cat: 'profesional' },
    { faculty: 'Operaciones de Software y Redes de Cómputo', registered: 36, attendance: 30, color: '#1270B7', cat: 'técnico' },
    { faculty: 'Cocina Nacional e Internacional', registered: 35, attendance: 29, color: '#30D158', cat: 'técnico' },
    { faculty: 'Medicina Veterinaria y Zootecnia', registered: 34, attendance: 27, color: '#FF9F0A', cat: 'profesional' },
    { faculty: 'Conocimientos Académicos en Inglés y Francés', registered: 33, attendance: 26, color: '#BF5AF2', cat: 'técnico' },
    { faculty: 'Psicología', registered: 32, attendance: 26, color: '#F43843', cat: 'profesional' },
    { faculty: 'Auxiliar Contable y Financiero', registered: 31, attendance: 25, color: '#5E5CE6', cat: 'técnico' },
    { faculty: 'Seguridad Ocupacional', registered: 30, attendance: 24, color: '#FF6482', cat: 'técnico' },
    { faculty: 'Arquitectura', registered: 29, attendance: 23, color: '#00C7BE', cat: 'profesional' },
    { faculty: 'Auxiliar en Clínica Veterinaria', registered: 28, attendance: 22, color: '#64D2FF', cat: 'técnico' },
    { faculty: 'Auxiliar de Talento Humano', registered: 27, attendance: 21, color: '#1270B7', cat: 'técnico' },
    { faculty: 'Investigadores Criminalísticos y Judiciales', registered: 26, attendance: 19, color: '#30D158', cat: 'técnico' },
    { faculty: 'Diseño, Confección y Mercadeo de Modas', registered: 25, attendance: 18, color: '#FF9F0A', cat: 'técnico' },
    { faculty: 'Animación 2D y 3D', registered: 24, attendance: 18, color: '#BF5AF2', cat: 'técnico' },
    { faculty: 'Gerencia de Empresas', registered: 22, attendance: 17, color: '#F43843', cat: 'especialización' },
    { faculty: 'Auxiliar en Productos Interactivos y Digitales', registered: 21, attendance: 15, color: '#5E5CE6', cat: 'técnico' },
    { faculty: 'Derecho Penal y Criminalística', registered: 20, attendance: 15, color: '#FF6482', cat: 'especialización' },
    { faculty: 'Derecho Administrativo y Contractual', registered: 18, attendance: 14, color: '#00C7BE', cat: 'especialización' },
    { faculty: 'Gerencia del Talento Humano', registered: 16, attendance: 12, color: '#64D2FF', cat: 'especialización' },
  ]
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
  const emptyStates: Record<string, { icon: typeof Users; title: string; desc: string }> = {
    schedule: { icon: Clock, title: 'Horarios', desc: 'Análisis de horarios próximamente' },
  }

  return (
    <div className="p-8 space-y-6 w-full relative">
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          {tab === 'overview' && (
            <>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative rounded-3xl mb-8"
                style={{
                  background: 'linear-gradient(90deg, #FFFFFF 0%, #F8FBFF 40%, rgba(248,251,255,0) 100%)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
                }}
              >
                <div className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden" style={{
                  maskImage: 'linear-gradient(to right, black 60%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to right, black 60%, transparent 100%)'
                }}>
                  <div className="absolute inset-0 opacity-30" style={{
                    background: 'radial-gradient(ellipse at 80% 10%, rgba(0,122,255,0.03) 0%, transparent 40%), radial-gradient(ellipse at 10% 80%, rgba(245,166,35,0.02) 0%, transparent 40%), radial-gradient(ellipse at 50% 50%, rgba(230,57,70,0.02) 0%, transparent 50%)',
                  }} />
                </div>
                <div style={{ position: 'absolute', right: 40, bottom: 0, height: 170, width: 200, zIndex: 20, pointerEvents: 'none' }}>
                  <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', width: '80%', height: '50%', background: 'rgba(191,90,242,0.1)', filter: 'blur(30px)', borderRadius: '50%' }} />
                  <img src={trophyImg} alt="Trofeo" className="w-full h-full object-contain drop-shadow-xl relative" style={{ objectPosition: 'center bottom' }} />
                </div>
                <div className="relative z-10 p-8 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-1 h-12 rounded-full" style={{ background: BLUE_GRAD }} />
                    <div>
                      <h1 style={{ color: '#1A1A1E', fontSize: '2rem', fontWeight: 800 }}>Estadísticas</h1>
                      <p className="text-xs mt-1" style={{ color: 'rgba(0,0,0,0.4)' }}>Métricas de rendimiento y crecimiento</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 p-0.5 rounded-xl" style={{ background: 'rgba(0,0,0,0.04)' }}>
                    {(['week', 'month', 'year'] as const).map(p => (
                      <button key={p} onClick={() => setStatsPeriod(p)}
                        className="px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all"
                        style={{ background: statsPeriod === p ? BLUE_GRAD : 'transparent', color: statsPeriod === p ? '#fff' : 'rgba(0,0,0,0.3)' }}
                      >{p === 'week' ? 'Semana' : p === 'month' ? 'Mes' : 'Año'}</button>
                    ))}
                  </div>
                </div>
              </motion.div>

              <div className="grid grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Usuarios', value: '847', sub: 'Registrados en el sistema', color: '#1270B7', view: StudentsView },
                  { label: 'Promedio Asistencia', value: '94%', sub: '+3% respecto al mes anterior', color: '#30D158', view: StudentCardView },
                  { label: 'Retención Mensual', value: '91%', sub: 'Alta adherencia general', color: '#BF5AF2', view: CalendarView },
                  { label: 'Nuevos Este Mes', value: '67', sub: 'Registros acumulados', color: '#FF9F0A', view: ListView },
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
                          <span className="stat-value block transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1.2, color: card.color }}>{card.value}</span>
                          <p className="text-[10px] mt-1 font-bold truncate" style={{ color: '#1A1A1E' }}>{card.label}</p>
                          <p className="text-[10px] mt-0.5 font-medium truncate" style={{ color: 'rgba(0,0,0,0.45)' }}>{card.sub}</p>
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
                      <BarChart3 size={14} style={{ color: BLUE }} />
                    </div>
                    <span className="text-xs font-bold tracking-wide" style={{ color: '#1A1A1E' }}>ASISTENCIA SEMANAL</span>
                  </div>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={weeklyData} margin={{ left: 0, right: 16, top: 0, bottom: 0 }} barCategoryGap="26%">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                      <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'rgba(0,0,0,0.35)', fontWeight: 500 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: 'rgba(0,0,0,0.35)', fontWeight: 500 }} axisLine={false} tickLine={false} width={30} />
                      <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }} />
                      <defs>
                        <linearGradient id="overviewWeekGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#1270B7" />
                          <stop offset="100%" stopColor="#FFFFFF" />
                        </linearGradient>
                      </defs>
                      <Bar dataKey="asistentes" fill="url(#overviewWeekGrad)" radius={[8, 8, 0, 0]}>
                        <LabelList dataKey="asistentes" position="top" style={{ fontSize: 10, fontWeight: 700, fill: '#1270B7' }} />
                      </Bar>
                    </BarChart>
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
                      <TrendingUp size={14} style={{ color: BLUE }} />
                    </div>
                    <span className="text-xs font-bold tracking-wide" style={{ color: '#1A1A1E' }}>EVOLUCIÓN DE USUARIOS</span>
                  </div>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={[
                      { mes: 'Ene', usuarios: 520 }, { mes: 'Feb', usuarios: 580 },
                      { mes: 'Mar', usuarios: 610 }, { mes: 'Abr', usuarios: 680 },
                      { mes: 'May', usuarios: 740 }, { mes: 'Jun', usuarios: 847 },
                    ]} margin={{ left: 0, right: 16, top: 0, bottom: 0 }} barCategoryGap="26%">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                      <XAxis dataKey="mes" tick={{ fontSize: 10, fill: 'rgba(0,0,0,0.35)', fontWeight: 500 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: 'rgba(0,0,0,0.35)', fontWeight: 500 }} axisLine={false} tickLine={false} width={30} />
                      <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }} />
                      <defs>
                        <linearGradient id="overviewEvoGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#1270B7" />
                          <stop offset="100%" stopColor="#FFFFFF" />
                        </linearGradient>
                      </defs>
                      <Bar dataKey="usuarios" fill="url(#overviewEvoGrad)" radius={[8, 8, 0, 0]}>
                        <LabelList dataKey="usuarios" position="top" style={{ fontSize: 10, fontWeight: 700, fill: '#1270B7' }} />
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
                          <span className="stat-value block transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1.2, color: card.color }}>{card.value}</span>
                          <p className="text-[10px] mt-1 font-bold truncate" style={{ color: '#1A1A1E' }}>{card.label}</p>
                          <p className="text-[10px] mt-0.5 font-medium truncate" style={{ color: 'rgba(0,0,0,0.45)' }}>{card.sub}</p>
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
                      <XAxis type="number" tick={{ fontSize: 10, fill: 'rgba(0,0,0,0.35)', fontWeight: 500 }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="faculty" tick={{ fontSize: 10, fill: '#1A1A1E', fontWeight: 500 }} axisLine={false} tickLine={false} width={150} />
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
                      <XAxis type="number" tick={{ fontSize: 10, fill: 'rgba(0,0,0,0.35)', fontWeight: 500 }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="faculty" tick={{ fontSize: 10, fill: '#1A1A1E', fontWeight: 500 }} axisLine={false} tickLine={false} width={150} />
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
                        <XAxis type="number" tick={{ fontSize: 10, fill: 'rgba(0,0,0,0.35)', fontWeight: 500 }} axisLine={false} tickLine={false} />
                        <YAxis type="category" dataKey="faculty" tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 500 }} axisLine={false} tickLine={false} width={250} interval={0} />
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
                          <span className="stat-value block transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1.2, color: card.color }}>{card.value}</span>
                          <p className="text-xs mt-1 font-bold truncate" style={{ color: '#1A1A1E' }}>{card.label}</p>
                          <p className="text-[10px] mt-0.5 font-medium truncate" style={{ color: 'rgba(0,0,0,0.45)' }}>{card.sub}</p>
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
                      <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 500 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 500 }} axisLine={false} tickLine={false} />
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
                      <XAxis dataKey="cargo" tick={{ fontSize: 10, fill: '#1A1A1E', fontWeight: 500 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 500 }} axisLine={false} tickLine={false} />
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
                      <XAxis dataKey="area" tick={{ fontSize: 10, fill: '#1A1A1E', fontWeight: 500 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 500 }} axisLine={false} tickLine={false} />
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

          {tab !== 'overview' && tab !== 'careers' && tab !== 'students' && (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              {(() => {
                const es = emptyStates[tab]
                const Icon = es.icon
                return (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4"
                  >
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: `${BLUE}10` }}>
                      <Icon size={30} style={{ color: BLUE, opacity: 0.5 }} />
                    </div>
                    <p className="text-lg font-bold" style={{ color: 'rgba(0,0,0,0.2)' }}>{es.title}</p>
                    <p className="text-xs font-medium" style={{ color: 'rgba(0,0,0,0.15)' }}>{es.desc}</p>
                  </motion.div>
                )
              })()}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
