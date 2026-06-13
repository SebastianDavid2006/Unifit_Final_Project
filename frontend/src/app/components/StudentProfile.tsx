import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts'
import {
  ArrowLeft, Brain, TrendingUp, AlertTriangle, Activity, Award, Heart,
  Calendar, FileText, Dumbbell, Utensils, Clock, Star, Zap,
  ChevronRight, Target, Flame, Shield, BarChart2, Sparkles,
} from 'lucide-react'

interface Student {
  id: number
  name: string
  faculty: string
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

const aiInsightsProfile = [
  { priority: 'medium', text: 'Baja adherencia detectada en las últimas 2 semanas. Se recomienda sesión motivacional.' },
  { priority: 'low', text: 'Progreso en fuerza superior al promedio de su facultad (+14%).' },
  { priority: 'medium', text: 'Disminución en rendimiento cardiovascular. Considerar incremento gradual de LISS.' },
  { priority: 'high', text: 'Probabilidad de abandono calculada en 34% si persiste la tendencia actual.' },
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
        <p key={i} style={{ color: p.color || '#1D1D1F', fontSize: 13, fontWeight: 600 }}>
          {p.value} <span style={{ color: 'rgba(0,0,0,0.35)', fontWeight: 400 }}>{p.name}</span>
        </p>
      ))}
    </div>
  )
}

const TABS = [
  { id: 'overview', label: 'General', icon: Activity },
  { id: 'progress', label: 'Progreso', icon: TrendingUp },
  { id: 'assessment', label: 'Valoraciones', icon: BarChart2 },
  { id: 'routines', label: 'Rutinas', icon: Dumbbell },
  { id: 'attendance', label: 'Asistencia', icon: Calendar },
  { id: 'risks', label: 'Riesgos', icon: AlertTriangle },
  { id: 'ai', label: 'IA Insights', icon: Brain },
  { id: 'nutrition', label: 'Nutrición', icon: Utensils },
  { id: 'history', label: 'Historial', icon: Clock },
  { id: 'documents', label: 'Documentos', icon: FileText },
] as const

type Tab = typeof TABS[number]['id']

export function StudentProfile({ student, onBack }: { student: Student; onBack: () => void }) {
  const [tab, setTab] = useState<Tab>('overview')

  const imc = (student.weight / ((student.height / 100) ** 2)).toFixed(1)
  const imcNum = parseFloat(imc)
  const imcLabel = imcNum < 18.5 ? 'Bajo peso' : imcNum < 25 ? 'Saludable' : imcNum < 30 ? 'Sobrepeso' : 'Obesidad'

  return (
    <div className="flex flex-col size-full overflow-hidden mesh-bg">
      {/* Background orbs */}
      <div className="floating-sphere" style={{
        width: 280, height: 280,
        background: 'radial-gradient(circle, rgba(230,57,70,0.04), transparent)',
        top: '-60px', right: '-40px',
      }} />

      {/* Header */}
      <div className="relative z-10 flex-shrink-0 px-8 py-4 flex items-center gap-4" style={{
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        background: 'rgba(250,250,250,0.75)',
        backdropFilter: 'blur(30px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(30px) saturate(1.4)',
      }}>
        <motion.button
          whileHover={{ x: -2 }}
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all"
          style={{ color: 'rgba(0,0,0,0.4)', border: '1px solid rgba(0,0,0,0.06)', background: 'rgba(255,255,255,0.3)' }}
        >
          <ArrowLeft size={15} /> Volver
        </motion.button>

        <div className="flex items-center gap-4 ml-2">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold"
            style={{
              background: student.risk === 'high'
                ? 'linear-gradient(135deg, #FF3B30, #D32F2F)'
                : student.risk === 'medium'
                ? 'linear-gradient(135deg, #FF9500, #E68600)'
                : 'linear-gradient(135deg, #30D158, #20A040)',
              fontSize: 16,
            }}
          >
            {student.avatar}
          </div>
          <div>
            <h2 className="text-[#1D1D1F]">{student.name}</h2>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.35)' }}>
              {student.faculty} · Objetivo: {student.goal} · ID #{student.id.toString().padStart(4, '0')}
            </p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          {[
            { label: 'Adherencia', value: `${student.adherence}%`, color: student.adherence >= 80 ? '#30D158' : student.adherence >= 60 ? '#FF9500' : '#FF3B30' },
            { label: 'Sesiones', value: `${student.sessions}`, color: '#FF6B8A' },
            { label: 'Última visita', value: student.lastVisit, color: 'rgba(0,0,0,0.5)' },
          ].map(m => (
            <div key={m.label} className="text-right px-4 py-2 rounded-xl" style={cardStyle}>
              <p style={{ color: m.color, fontWeight: 700, fontSize: 15, lineHeight: 1 }}>{m.value}</p>
              <p className="text-[10px] mt-1" style={{ color: 'rgba(0,0,0,0.3)' }}>{m.label}</p>
            </div>
          ))}
          <div
            className="px-3 py-2 rounded-xl text-xs font-semibold"
            style={{
              background: student.risk === 'high' ? 'rgba(255,59,48,0.06)' : student.risk === 'medium' ? 'rgba(255,149,0,0.06)' : 'rgba(48,209,88,0.06)',
              color: student.risk === 'high' ? '#FF3B30' : student.risk === 'medium' ? '#FF9500' : '#30D158',
              border: `1px solid ${student.risk === 'high' ? 'rgba(255,59,48,0.15)' : student.risk === 'medium' ? 'rgba(255,149,0,0.15)' : 'rgba(48,209,88,0.15)'}`,
            }}
          >
            {student.risk === 'high' ? '⚠ Alto Riesgo' : student.risk === 'medium' ? '● Alerta' : '✓ Activo'}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="relative z-10 flex-shrink-0 flex items-center gap-0.5 px-8 py-3" style={{
        borderBottom: '1px solid rgba(0,0,0,0.04)',
        overflowX: 'auto',
      }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex-shrink-0"
            style={{ color: tab === t.id ? RED : 'rgba(0,0,0,0.3)' }}
          >
            {tab === t.id && (
              <motion.div
                layoutId="stab-bg"
                className="absolute inset-0 rounded-lg"
                style={{ background: 'rgba(230,57,70,0.06)', border: '1px solid rgba(230,57,70,0.1)' }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
            <t.icon size={12} className="relative z-10" />
            <span className="relative z-10">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <AnimatePresence mode="wait">
          {tab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-8 grid grid-cols-3 gap-4 max-w-[1440px]">
              <div className="rounded-2xl p-6" style={cardStyle}>
                <h3 className="text-[#1D1D1F] text-sm font-semibold mb-5">Información General</h3>
                <div className="space-y-1">
                  {[
                    { label: 'Peso actual', value: `${student.weight} kg` },
                    { label: 'Altura', value: `${student.height} cm` },
                    { label: 'IMC', value: `${imc} — ${imcLabel}` },
                    { label: 'Objetivo', value: student.goal },
                    { label: 'Facultad', value: student.faculty },
                    { label: 'Sesiones totales', value: `${student.sessions} sesiones` },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                      <span className="text-xs" style={{ color: 'rgba(0,0,0,0.4)' }}>{item.label}</span>
                      <span className="text-xs font-semibold" style={{ color: '#1D1D1F' }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl p-6" style={cardStyle}>
                <h3 className="text-[#1D1D1F] text-sm font-semibold mb-2">Perfil Físico</h3>
                <p className="text-xs mb-3" style={{ color: 'rgba(0,0,0,0.35)' }}>Capacidades funcionales</p>
                <ResponsiveContainer width="100%" height={240}>
                  <RadarChart data={bodyRadar}>
                    <PolarGrid stroke="rgba(0,0,0,0.06)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(0,0,0,0.35)', fontSize: 11 }} />
                    <Radar name="Capacidad" dataKey="value" stroke={RED} fill={RED} fillOpacity={0.08} strokeWidth={2.5} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-2xl p-6" style={{
                background: 'linear-gradient(160deg, rgba(230,57,70,0.03), rgba(255,255,255,0.3))',
                border: '1px solid rgba(230,57,70,0.08)',
              }}>
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(230,57,70,0.08)' }}>
                    <Brain size={13} style={{ color: RED }} />
                  </div>
                  <span className="text-[#1D1D1F] text-sm font-semibold">Resumen IA</span>
                  <span className="w-1.5 h-1.5 rounded-full ml-auto" style={{ background: RED }} />
                </div>
                <div className="space-y-3">
                  {aiInsightsProfile.map((msg, i) => (
                    <div key={i} className="p-3.5 rounded-xl" style={{
                      background: msg.priority === 'high' ? 'rgba(255,59,48,0.04)' : msg.priority === 'medium' ? 'rgba(255,149,0,0.04)' : 'rgba(48,209,88,0.04)',
                      border: `1px solid ${msg.priority === 'high' ? 'rgba(255,59,48,0.12)' : msg.priority === 'medium' ? 'rgba(255,149,0,0.12)' : 'rgba(48,209,88,0.12)'}`,
                    }}>
                      <p className="text-xs leading-relaxed" style={{ color: 'rgba(0,0,0,0.6)' }}>{msg.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {tab === 'progress' && (
            <motion.div key="progress" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-8 space-y-6 max-w-[1440px]">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Reducción de peso', value: '-6 kg', sub: 'En 5 meses', color: '#30D158', icon: TrendingUp },
                  { label: 'Grasa corporal', value: '-5%', sub: '22% → 17%', color: '#FF9500', icon: Flame },
                  { label: 'Masa muscular', value: '+4 kg', sub: '48 → 52 kg', color: '#FF6B8A', icon: Zap },
                ].map(m => (
                  <div key={m.label} className="rounded-2xl p-6" style={cardStyle}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${m.color}08` }}>
                        <m.icon size={18} style={{ color: m.color }} />
                      </div>
                    </div>
                    <p className="stat-value" style={{ color: m.color, fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}>{m.value}</p>
                    <p className="text-[#1D1D1F] text-sm font-semibold mt-1">{m.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.35)' }}>{m.sub}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl p-6" style={cardStyle}>
                <h3 className="text-[#1D1D1F] text-sm font-semibold mb-1">Evolución Corporal</h3>
                <p className="text-xs mb-5" style={{ color: 'rgba(0,0,0,0.35)' }}>Últimos 5 meses — peso, grasa y masa muscular</p>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={progressHistory}>
                    <defs>
                      <linearGradient id="pesoGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#E63946" stopOpacity={0.12} />
                        <stop offset="100%" stopColor="#E63946" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="muscGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF6B8A" stopOpacity={0.12} />
                        <stop offset="100%" stopColor="#FF6B8A" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
                    <XAxis dataKey="month" tick={{ fill: 'rgba(0,0,0,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'rgba(0,0,0,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
                    <ReTooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="peso" stroke="#E63946" strokeWidth={2.5} fill="url(#pesoGrad)" name="Peso" />
                    <Area type="monotone" dataKey="musculo" stroke="#FF6B8A" strokeWidth={2.5} fill="url(#muscGrad)" name="Músculo" />
                    <Area type="monotone" dataKey="grasa" stroke="#FF9500" strokeWidth={1.5} fill="none" strokeDasharray="4 3" name="Grasa %" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {tab === 'routines' && (
            <motion.div key="routines" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-8 max-w-[1440px]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-[#1D1D1F] font-semibold">Rutina Actual: <span style={{ color: RED }}>Hipertrofia Superior</span></h3>
                  <p className="text-sm mt-0.5" style={{ color: 'rgba(0,0,0,0.35)' }}>5 ejercicios · 60 minutos · Nivel Avanzado</p>
                </div>
              </div>
              <div className="space-y-3">
                {routineExercises.map((ex, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ y: -2 }}
                    className="flex items-center gap-6 p-5 rounded-2xl"
                    style={cardStyle}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, rgba(230,57,70,0.12), rgba(204,0,51,0.08))', color: RED, fontSize: 15 }}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-[#1D1D1F] font-semibold">{ex.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.35)' }}>{ex.muscle}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-[#1D1D1F] text-sm font-bold">{ex.sets}</p>
                        <p className="text-[10px]" style={{ color: 'rgba(0,0,0,0.3)' }}>series</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[#1D1D1F] text-sm font-bold">{ex.reps}</p>
                        <p className="text-[10px]" style={{ color: 'rgba(0,0,0,0.3)' }}>reps</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[#1D1D1F] text-sm font-bold">{ex.weight}</p>
                        <p className="text-[10px]" style={{ color: 'rgba(0,0,0,0.3)' }}>carga</p>
                      </div>
                      <div className="text-center">
                        <p style={{ color: '#FF9500', fontSize: 14, fontWeight: 700 }}>{ex.calories}</p>
                        <p className="text-[10px]" style={{ color: 'rgba(0,0,0,0.3)' }}>kcal est.</p>
                      </div>
                    </div>
                    <span
                      className="px-2.5 py-1 rounded-lg text-[10px] font-semibold"
                      style={{
                        background: ex.difficulty === 'Avanzado' ? 'rgba(230,57,70,0.08)' : 'rgba(255,149,0,0.08)',
                        color: ex.difficulty === 'Avanzado' ? RED : '#FF9500',
                        border: `1px solid ${ex.difficulty === 'Avanzado' ? 'rgba(230,57,70,0.15)' : 'rgba(255,149,0,0.15)'}`,
                      }}
                    >
                      {ex.difficulty}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {tab === 'attendance' && (
            <motion.div key="attendance" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-8 max-w-[1440px]">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl p-6" style={cardStyle}>
                  <h3 className="text-[#1D1D1F] text-sm font-semibold mb-5">Calendario de Asistencia — Mayo 2026</h3>
                  <div className="grid grid-cols-7 gap-1.5 mb-2">
                    {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => (
                      <div key={d} className="text-center text-[10px] font-bold py-1" style={{ color: 'rgba(0,0,0,0.25)' }}>{d}</div>
                    ))}
                  </div>
                  {attendanceCalendar.map((week, wi) => (
                    <div key={wi} className="grid grid-cols-7 gap-1.5 mb-1.5">
                      {week.map((attended, di) => (
                        <motion.div
                          key={di}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: (wi * 7 + di) * 0.02 }}
                          className="aspect-square rounded-xl flex items-center justify-center text-xs"
                          style={{
                            background: attended ? 'rgba(230,57,70,0.08)' : 'rgba(0,0,0,0.02)',
                            border: attended ? '1px solid rgba(230,57,70,0.2)' : '1px solid rgba(0,0,0,0.04)',
                            color: attended ? RED : 'rgba(0,0,0,0.2)',
                          }}
                        >
                          {attended ? '✓' : wi * 7 + di + 1}
                        </motion.div>
                      ))}
                    </div>
                  ))}
                  <div className="mt-5 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded" style={{ background: 'rgba(230,57,70,0.08)', border: '1px solid rgba(230,57,70,0.2)' }} />
                      <span className="text-xs" style={{ color: 'rgba(0,0,0,0.35)' }}>Asistió</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded" style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.08)' }} />
                      <span className="text-xs" style={{ color: 'rgba(0,0,0,0.35)' }}>No asistió</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl p-6" style={cardStyle}>
                  <h3 className="text-[#1D1D1F] text-sm font-semibold mb-5">Estadísticas de Asistencia</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Este mes', value: '14/20', sub: '70% de asistencia', color: '#FF9500' },
                      { label: 'Racha actual', value: '3 días', sub: 'Mejor racha: 12 días', color: '#30D158' },
                      { label: 'Promedio semanal', value: '3.2', sub: 'sesiones por semana', color: '#FF6B8A' },
                      { label: 'Total histórico', value: `${student.sessions}`, sub: 'sesiones totales', color: '#BF5AF2' },
                    ].map(m => (
                      <div key={m.label} className="p-4 rounded-xl nested-card">
                        <p className="stat-value" style={{ color: m.color, fontSize: '1.6rem', fontWeight: 700, lineHeight: 1 }}>{m.value}</p>
                        <p className="text-[#1D1D1F] text-xs font-semibold mt-1">{m.label}</p>
                        <p className="text-[10px] mt-0.5" style={{ color: 'rgba(0,0,0,0.3)' }}>{m.sub}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {tab === 'risks' && (
            <motion.div key="risks" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-8 space-y-6 max-w-[1440px]">
              <div className="rounded-2xl p-8" style={{
                background: 'linear-gradient(145deg, rgba(255,59,48,0.04), rgba(255,255,255,0.3))',
                border: '1px solid rgba(255,59,48,0.08)',
              }}>
                <div className="flex items-center gap-3 mb-6">
                  <AlertTriangle size={22} style={{ color: '#FF3B30' }} />
                  <h3 className="text-[#1D1D1F] font-semibold">Análisis de Riesgo</h3>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  {[
                    { label: 'Riesgo de abandono', value: student.risk === 'high' ? '76%' : student.risk === 'medium' ? '42%' : '8%', color: student.risk === 'high' ? '#FF3B30' : student.risk === 'medium' ? '#FF9500' : '#30D158' },
                    { label: 'Riesgo de lesión', value: '18%', color: '#FF9500' },
                    { label: 'Nivel de fatiga', value: '34%', color: '#BF5AF2' },
                  ].map(m => (
                    <div key={m.label} className="text-center">
                      <p style={{ color: m.color, fontSize: '3rem', fontWeight: 800, lineHeight: 1 }}>{m.value}</p>
                      <p className="text-sm mt-2 font-medium" style={{ color: 'rgba(0,0,0,0.45)' }}>{m.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: 'Factores de riesgo', items: ['Baja adherencia sostenida', 'Ausencias sin justificar', 'Reducción en intensidad de sesiones', 'Sin respuesta a comunicaciones'], icon: AlertTriangle, color: '#FF3B30' },
                  { title: 'Factores protectores', items: ['Progreso en masa muscular', 'Historial previo de adherencia alta', 'Rutina adaptada correctamente', 'Sin lesiones registradas'], icon: Shield, color: '#30D158' },
                ].map(section => (
                  <div key={section.title} className="rounded-2xl p-6" style={cardStyle}>
                    <div className="flex items-center gap-2 mb-4">
                      <section.icon size={16} style={{ color: section.color }} />
                      <h3 className="text-[#1D1D1F] text-sm font-semibold">{section.title}</h3>
                    </div>
                    <div className="space-y-3">
                      {section.items.map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: section.color }} />
                          <p className="text-sm" style={{ color: 'rgba(0,0,0,0.55)' }}>{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {tab === 'ai' && (
            <motion.div key="ai" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-8 space-y-6 max-w-[1440px]">
              <div className="rounded-2xl p-8" style={{
                background: 'linear-gradient(160deg, rgba(230,57,70,0.03), rgba(255,255,255,0.3))',
                border: '1px solid rgba(230,57,70,0.08)',
              }}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(230,57,70,0.08)' }}>
                    <Brain size={18} style={{ color: RED }} />
                  </div>
                  <div>
                    <p className="text-[#1D1D1F] font-semibold">Análisis IA — {student.name}</p>
                    <p className="text-xs" style={{ color: 'rgba(0,0,0,0.35)' }}>Generado hoy · Confianza: 89%</p>
                  </div>
                  <div className="ml-auto w-2 h-2 rounded-full" style={{ background: '#30D158' }} />
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Resumen ejecutivo', content: `${student.name} muestra ${student.adherence >= 80 ? 'excelente' : student.adherence >= 60 ? 'buena' : 'baja'} adherencia (${student.adherence}%). Su progreso en composición corporal es positivo. ${student.risk === 'high' ? 'Se requiere intervención inmediata para prevenir abandono.' : 'Continuar con plan actual.'}` },
                    { label: 'Recomendación de rutina', content: 'Mantener volumen actual en tren superior. Incrementar 5-10% en carga de ejercicios compuestos. Agregar 2 sesiones de cardio suave (LISS) para mejorar recuperación.' },
                    { label: 'Predicción a 30 días', content: `Si mantiene la tendencia actual, ${student.name} alcanzará su objetivo de ${student.goal.toLowerCase()} en aproximadamente 45 días. La probabilidad de éxito es del ${student.adherence >= 80 ? '87' : student.adherence >= 60 ? '64' : '38'}%.` },
                  ].map(item => (
                    <div key={item.label} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(0,0,0,0.04)' }}>
                      <p className="text-xs font-bold mb-2" style={{ color: RED }}>{item.label}</p>
                      <p className="text-sm leading-relaxed" style={{ color: 'rgba(0,0,0,0.6)' }}>{item.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {tab === 'nutrition' && (
            <motion.div key="nutrition" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-8 space-y-6 max-w-[1440px]">
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Calorías objetivo', value: '2.200', unit: 'kcal', color: RED },
                  { label: 'Proteína', value: '180', unit: 'g/día', color: '#FF6B8A' },
                  { label: 'Carbohidratos', value: '220', unit: 'g/día', color: '#FF9500' },
                  { label: 'Grasas', value: '65', unit: 'g/día', color: '#30D158' },
                ].map(m => (
                  <div key={m.label} className="rounded-2xl p-5" style={cardStyle}>
                    <p className="stat-value" style={{ color: m.color, fontSize: '1.8rem', fontWeight: 700, lineHeight: 1 }}>{m.value}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.3)' }}>{m.unit}</p>
                    <p className="text-xs mt-2 font-semibold" style={{ color: '#1D1D1F' }}>{m.label}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl p-6" style={cardStyle}>
                <h3 className="text-[#1D1D1F] text-sm font-semibold mb-5">Calorías esta semana</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={nutritionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
                    <XAxis dataKey="day" tick={{ fill: 'rgba(0,0,0,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'rgba(0,0,0,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} width={45} domain={[1500, 2500]} />
                    <ReTooltip content={<ChartTooltip />} />
                    <Bar dataKey="calorias" name="kcal" fill={RED} fillOpacity={0.7} radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {(tab === 'assessment' || tab === 'history' || tab === 'documents') && (
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-8 max-w-[1440px]">
              {tab === 'assessment' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { section: 'Antropometría', items: [{ label: 'Peso', value: `${student.weight} kg` }, { label: 'Altura', value: `${student.height} cm` }, { label: 'IMC', value: imc }, { label: 'Grasa corporal', value: '17%' }, { label: 'Masa muscular', value: '52 kg' }, { label: 'Circunf. cintura', value: '82 cm' }] },
                      { section: 'Capacidades Físicas', items: [{ label: 'Fuerza máx. (1RM)', value: '100 kg' }, { label: 'VO2 Max', value: '42 ml/kg/min' }, { label: 'Flexibilidad', value: '28 cm (sit & reach)' }, { label: 'Potencia', value: '85/100' }, { label: 'Movilidad', value: '72/100' }, { label: 'Equilibrio', value: '78/100' }] },
                      { section: 'Salud y Bienestar', items: [{ label: 'Nivel de estrés', value: '4/10' }, { label: 'Calidad de sueño', value: '7.2 h/noche' }, { label: 'Energía percibida', value: '7/10' }, { label: 'Dolor muscular', value: 'Leve' }, { label: 'Lesiones activas', value: 'Ninguna' }, { label: 'Frecuencia card.', value: '68 bpm' }] },
                    ].map(s => (
                      <div key={s.section} className="rounded-2xl p-6" style={cardStyle}>
                        <h3 className="text-sm font-semibold mb-5" style={{ color: RED }}>{s.section}</h3>
                        <div className="space-y-1">
                          {s.items.map(item => (
                            <div key={item.label} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                              <span className="text-xs" style={{ color: 'rgba(0,0,0,0.4)' }}>{item.label}</span>
                              <span className="text-xs font-semibold" style={{ color: '#1D1D1F' }}>{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {tab === 'history' && (
                <div className="space-y-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-5 p-5 rounded-2xl" style={cardStyle}>
                      <div className="text-center w-14 flex-shrink-0">
                        <p className="text-[#1D1D1F] font-bold text-xs">{28 - i * 3} May</p>
                        <p className="text-[10px]" style={{ color: 'rgba(0,0,0,0.3)' }}>2026</p>
                      </div>
                      <div className="w-px h-8" style={{ background: 'rgba(0,0,0,0.06)' }} />
                      <div className="flex-1">
                        <p className="text-[#1D1D1F] text-sm font-semibold">Sesión #{student.sessions - i}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.35)' }}>
                          {['Hipertrofia Superior', 'Cardio HIIT', 'Full Body', 'Core & Estabilidad', 'Hipertrofia Inferior', 'Cardio LISS', 'Movilidad', 'Full Body'][i]} · {45 + (i % 3) * 15} min
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-[#1D1D1F] font-bold text-xs">{300 + i * 45} kcal</p>
                          <p className="text-[10px]" style={{ color: 'rgba(0,0,0,0.3)' }}>quemadas</p>
                        </div>
                        <span
                          className="px-2.5 py-1 rounded-lg text-[10px] font-semibold"
                          style={{ background: 'rgba(48,209,88,0.08)', color: '#30D158', border: '1px solid rgba(48,209,88,0.15)' }}
                        >
                          Completada
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {tab === 'documents' && (
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { name: 'Contrato de Matrícula', date: '15 Ene 2026', type: 'PDF', signed: true },
                    { name: 'Consentimiento Informado', date: '15 Ene 2026', type: 'PDF', signed: true },
                    { name: 'Informe Médico Inicial', date: '20 Ene 2026', type: 'PDF', signed: true },
                    { name: 'Valoración Inicial', date: '22 Ene 2026', type: 'PDF', signed: true },
                    { name: 'Rutina Enero-Marzo', date: '25 Ene 2026', type: 'PDF', signed: false },
                    { name: 'Informe de Progreso Q1', date: '31 Mar 2026', type: 'PDF', signed: false },
                  ].map((doc, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      whileHover={{ y: -4 }}
                      className="rounded-2xl p-6"
                      style={cardStyle}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(230,57,70,0.08)' }}>
                          <FileText size={17} style={{ color: RED }} />
                        </div>
                        {doc.signed && (
                          <span
                            className="ml-auto px-2.5 py-1 rounded-lg text-[10px] font-semibold"
                            style={{ background: 'rgba(48,209,88,0.08)', color: '#30D158', border: '1px solid rgba(48,209,88,0.15)' }}
                          >
                            Firmado
                          </span>
                        )}
                      </div>
                      <p className="text-[#1D1D1F] text-sm font-semibold">{doc.name}</p>
                      <p className="text-xs mt-1" style={{ color: 'rgba(0,0,0,0.35)' }}>{doc.date} · {doc.type}</p>
                      <button
                        className="mt-4 w-full py-2 rounded-xl text-xs font-semibold transition-all"
                        style={{ background: 'rgba(0,0,0,0.03)', color: 'rgba(0,0,0,0.45)', border: '1px solid rgba(0,0,0,0.06)' }}
                      >
                        Ver documento
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
