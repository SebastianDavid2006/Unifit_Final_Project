import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as ReTooltip, ResponsiveContainer, Cell, PieChart, Pie,
} from 'recharts'
import {
  Users, Activity, Target, Clock, Award, Sparkles,
  TrendingUp, BarChart3, GraduationCap, ClipboardList, ArrowUp, Building2,
} from 'lucide-react'
import trophyImg from '../../assets/images/trophy.png'
import { StudentCardView } from '../../assets/models/ui/objects/student_card/StudentCardModel'
import { ListView } from '../../assets/models/ui/objects/list/ListModel'
import { StudentsView } from '../../assets/models/ui/users/students/StudentsModel'
import { CalendarView } from '../../assets/models/ui/objects/calendar/CalendarModel'

const BLUE = '#1270B7'
const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #1A8CDB, #0D5F9E)'

const weeklyData = [
  { day: 'Lun', asistentes: 45, objetivo: 60 },
  { day: 'Mar', asistentes: 67, objetivo: 60 },
  { day: 'Mié', asistentes: 52, objetivo: 60 },
  { day: 'Jue', asistentes: 78, objetivo: 60 },
  { day: 'Vie', asistentes: 89, objetivo: 60 },
  { day: 'Sáb', asistentes: 34, objetivo: 60 },
  { day: 'Dom', asistentes: 12, objetivo: 60 },
]

export default function AdminStats({ tab, onTabChange }: { tab: string; onTabChange: (t: string) => void }) {
  const [statsPeriod, setStatsPeriod] = useState<'week' | 'month' | 'year'>('month')
  const [careersModal, setCareersModal] = useState<'registered' | 'attendance' | null>(null)

  const kpiData = [
    { label: 'Estudiantes Activos', value: '847', change: '+12%', color: BLUE, icon: Users },
    { label: 'Asistencia Promedio', value: '94%', change: '+3%', color: '#30D158', icon: Activity },
    { label: 'Retención Mensual', value: '91%', change: '+5%', color: '#BF5AF2', icon: Target },
  ]
  const miniStats = [
    { label: 'H/M', value: '58% / 42%', color: BLUE, icon: Users },
    { label: 'Edad Promedio', value: '22 años', color: '#30D158', icon: Clock },
    { label: 'Top Facultad', value: 'Ingeniería', color: '#FF9F0A', icon: Award },
    { label: 'Nuevos Este Mes', value: '67', color: '#BF5AF2', icon: Sparkles },
  ]
  const careerData = [
    { faculty: 'Ingeniería', registered: 42, attendance: 38, color: '#1270B7' },
    { faculty: 'Medicina', registered: 38, attendance: 28, color: '#30D158' },
    { faculty: 'Derecho', registered: 29, attendance: 18, color: '#FF9F0A' },
    { faculty: 'Administración', registered: 35, attendance: 27, color: '#BF5AF2' },
    { faculty: 'Arte', registered: 18, attendance: 10, color: '#F43843' },
    { faculty: 'Ciencias', registered: 22, attendance: 15, color: '#5E5CE6' },
    { faculty: 'Arquitectura', registered: 31, attendance: 24, color: '#FF6482' },
    { faculty: 'Economía', registered: 27, attendance: 19, color: '#00C7BE' },
    { faculty: 'Psicología', registered: 33, attendance: 26, color: '#FF9F0A' },
    { faculty: 'Comunicación', registered: 20, attendance: 12, color: '#64D2FF' },
  ]
  const allCareers = [
    ...careerData,
    { faculty: 'Biología Marina', registered: 16, attendance: 11, color: '#30D158' },
    { faculty: 'Física', registered: 14, attendance: 9, color: '#1270B7' },
    { faculty: 'Química', registered: 19, attendance: 13, color: '#BF5AF2' },
    { faculty: 'Matemáticas', registered: 12, attendance: 8, color: '#FF9F0A' },
    { faculty: 'Filosofía', registered: 8, attendance: 5, color: '#F43843' },
    { faculty: 'Historia', registered: 11, attendance: 7, color: '#5E5CE6' },
    { faculty: 'Literatura', registered: 15, attendance: 10, color: '#FF6482' },
    { faculty: 'Sociología', registered: 10, attendance: 6, color: '#00C7BE' },
    { faculty: 'Trabajo Social', registered: 17, attendance: 12, color: '#64D2FF' },
    { faculty: 'Enfermería', registered: 25, attendance: 20, color: '#30D158' },
    { faculty: 'Odontología', registered: 21, attendance: 16, color: '#1270B7' },
    { faculty: 'Veterinaria', registered: 23, attendance: 17, color: '#FF9F0A' },
    { faculty: 'Nutrición', registered: 28, attendance: 22, color: '#BF5AF2' },
    { faculty: 'Terapia Física', registered: 19, attendance: 14, color: '#F43843' },
    { faculty: 'Ing. Civil', registered: 30, attendance: 23, color: '#5E5CE6' },
    { faculty: 'Ing. Eléctrica', registered: 24, attendance: 18, color: '#00C7BE' },
    { faculty: 'Ing. Mecánica', registered: 26, attendance: 20, color: '#FF6482' },
    { faculty: 'Ing. Química', registered: 18, attendance: 13, color: '#64D2FF' },
    { faculty: 'Ing. Sistemas', registered: 34, attendance: 27, color: '#1270B7' },
    { faculty: 'Ing. Ambiental', registered: 20, attendance: 15, color: '#30D158' },
    { faculty: 'Ing. Industrial', registered: 29, attendance: 22, color: '#BF5AF2' },
    { faculty: 'Música', registered: 13, attendance: 8, color: '#FF9F0A' },
    { faculty: 'Danza', registered: 9, attendance: 6, color: '#F43843' },
    { faculty: 'Teatro', registered: 7, attendance: 4, color: '#5E5CE6' },
    { faculty: 'Cinematografía', registered: 11, attendance: 7, color: '#00C7BE' },
    { faculty: 'Diseño Gráfico', registered: 22, attendance: 16, color: '#FF6482' },
    { faculty: 'Diseño Industrial', registered: 18, attendance: 12, color: '#64D2FF' },
    { faculty: 'Publicidad', registered: 16, attendance: 11, color: '#1270B7' },
    { faculty: 'Mercadeo', registered: 20, attendance: 15, color: '#30D158' },
    { faculty: 'Contaduría', registered: 24, attendance: 18, color: '#BF5AF2' },
  ]
  const totalCareers = careerData.length
  const topRegistered = [...careerData].sort((a, b) => b.registered - a.registered)[0]
  const topAttendance = [...careerData].sort((a, b) => b.attendance - a.attendance)[0]
  const lowestAttendance = [...careerData].sort((a, b) => a.attendance - b.attendance)[0]
  const lowestRegistered = [...careerData].sort((a, b) => a.registered - b.registered)[0]
  const emptyStates: Record<string, { icon: typeof Users; title: string; desc: string }> = {
    schedule: { icon: Clock, title: 'Horarios', desc: 'Análisis de horarios próximamente' },
    assessments: { icon: ClipboardList, title: 'Valoraciones', desc: 'Reporte de valoraciones próximamente' },
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

              <div className="grid grid-cols-3 gap-4">
                {kpiData.map((kpi, i) => {
                  const Icon = kpi.icon
                  return (
                    <motion.div
                      key={kpi.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.06 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="rounded-2xl p-6 premium-card relative overflow-hidden cursor-default"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 rounded-full translate-x-8 -translate-y-8 opacity-[0.06]" style={{ background: kpi.color }} />
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${kpi.color}12` }}>
                          <Icon size={17} style={{ color: kpi.color }} />
                        </div>
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg" style={{ background: `${kpi.color}10` }}>
                          <ArrowUp size={10} style={{ color: kpi.color }} />
                          <span className="text-[10px] font-bold" style={{ color: kpi.color }}>{kpi.change}</span>
                        </div>
                      </div>
                      <p className="text-[11px] font-semibold" style={{ color: 'rgba(0,0,0,0.4)' }}>{kpi.label}</p>
                      <p className="text-3xl font-extrabold mt-1" style={{ color: '#1A1A1E' }}>{kpi.value}</p>
                      <p className="text-[10px] mt-1.5" style={{ color: 'rgba(0,0,0,0.2)' }}>vs. período anterior</p>
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
                    <span className="text-[11px] font-bold tracking-wide" style={{ color: 'rgba(0,0,0,0.3)' }}>ASISTENCIA SEMANAL</span>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
                      <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'rgba(0,0,0,0.3)' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: 'rgba(0,0,0,0.3)' }} axisLine={false} tickLine={false} />
                      <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }} />
                      <Bar dataKey="asistentes" radius={[8, 8, 0, 0]}>
                        {weeklyData.map((_, i) => (
                          <Cell key={i} fill={i === 2 || i === 4 ? BLUE : 'rgba(18,112,183,0.15)'} />
                        ))}
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
                    <span className="text-[11px] font-bold tracking-wide" style={{ color: 'rgba(0,0,0,0.3)' }}>TENDENCIA DE CRECIMIENTO</span>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={[
                      { mes: 'Ene', estudiantes: 520 }, { mes: 'Feb', estudiantes: 580 },
                      { mes: 'Mar', estudiantes: 610 }, { mes: 'Abr', estudiantes: 680 },
                      { mes: 'May', estudiantes: 740 }, { mes: 'Jun', estudiantes: 847 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
                      <XAxis dataKey="mes" tick={{ fontSize: 11, fill: 'rgba(0,0,0,0.3)' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: 'rgba(0,0,0,0.3)' }} axisLine={false} tickLine={false} />
                      <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }} />
                      <Area type="monotone" dataKey="estudiantes" stroke={BLUE} fill="url(#areaGrad)" strokeWidth={2.5} />
                      <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={BLUE} stopOpacity={0.25} />
                          <stop offset="100%" stopColor={BLUE} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {miniStats.map((s, i) => {
                  const Icon = s.icon
                  return (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 + i * 0.04 }}
                      whileHover={{ scale: 1.03, y: -2 }}
                      className="rounded-xl p-4 premium-card text-center cursor-default"
                    >
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center mx-auto mb-2" style={{ background: `${s.color}10` }}>
                        <Icon size={13} style={{ color: s.color }} />
                      </div>
                      <p className="text-[10px] font-bold tracking-wide" style={{ color: 'rgba(0,0,0,0.3)' }}>{s.label}</p>
                      <p className="text-base font-extrabold mt-1" style={{ color: s.color }}>{s.value}</p>
                    </motion.div>
                  )
                })}
              </div>
            </>
          )}

          {tab === 'careers' && (
            <>
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
                          <p className="text-xs mt-1 font-bold truncate" style={{ color: '#1A1A1E' }}>{card.label}</p>
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
                    <BarChart data={careerData} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 500 }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="faculty" tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 500 }} axisLine={false} tickLine={false} width={110} />
                      <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }} />
                      <Bar dataKey="registered" radius={[0, 8, 8, 0]}>
                        {careerData.map((entry, i) => (
                          <Cell key={i} fill={entry.faculty === topRegistered.faculty ? '#30D158' : entry.faculty === lowestRegistered.faculty ? '#9B59B6' : '#1270B7'} />
                        ))}
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
                    <BarChart data={careerData} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 500 }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="faculty" tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 500 }} axisLine={false} tickLine={false} width={110} />
                      <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }} />
                      <Bar dataKey="attendance" radius={[0, 8, 8, 0]}>
                        {careerData.map((entry, i) => (
                          <Cell key={i} fill={entry.faculty === topAttendance.faculty ? '#30D158' : entry.faculty === lowestAttendance.faculty ? '#9B59B6' : '#1270B7'} />
                        ))}
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
                    className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl p-8"
                    style={{ background: '#FFFFFF', boxShadow: '0 24px 80px rgba(0,0,0,0.15)' }}
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${BLUE}10` }}>
                          {careersModal === 'registered' ? <Users size={16} style={{ color: BLUE }} /> : <Activity size={16} style={{ color: BLUE }} />}
                        </div>
                        <h2 className="text-lg font-extrabold" style={{ color: '#1A1A1E' }}>
                          {careersModal === 'registered' ? 'Estudiantes Registrados' : 'Asistencia de Estudiantes'} — 40 Carreras
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
                    <ResponsiveContainer width="100%" height={700}>
                      <BarChart data={allCareers} layout="vertical" margin={{ left: 0, right: 16, top: 8, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" horizontal={false} />
                        <XAxis type="number" tick={{ fontSize: 10, fill: '#1A1A1E', fontWeight: 500 }} axisLine={false} tickLine={false} />
                        <YAxis type="category" dataKey="faculty" tick={{ fontSize: 10, fill: '#1A1A1E', fontWeight: 500 }} axisLine={false} tickLine={false} width={120} />
                        <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }} />
                        <Bar dataKey={careersModal === 'registered' ? 'registered' : 'attendance'} radius={[0, 6, 6, 0]}>
                          {allCareers.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
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

              <div className="grid grid-cols-3 gap-4">
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
                    ]} margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                      <XAxis dataKey="cargo" tick={{ fontSize: 10, fill: '#1A1A1E', fontWeight: 500 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 500 }} axisLine={false} tickLine={false} />
                      <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }} />
                      <Bar dataKey="cantidad" radius={[8, 8, 0, 0]}>
                        <Cell fill="#1270B7" />
                        <Cell fill="#30D158" />
                        <Cell fill="#FF9F0A" />
                        <Cell fill="#BF5AF2" />
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
                    ]} margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                      <XAxis dataKey="area" tick={{ fontSize: 10, fill: '#1A1A1E', fontWeight: 500 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 500 }} axisLine={false} tickLine={false} />
                      <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }} />
                      <Bar dataKey="cantidad" radius={[8, 8, 0, 0]}>
                        <Cell fill="#1270B7" />
                        <Cell fill="#30D158" />
                        <Cell fill="#FF9F0A" />
                        <Cell fill="#BF5AF2" />
                        <Cell fill="#F43843" />
                        <Cell fill="#00C7BE" />
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
