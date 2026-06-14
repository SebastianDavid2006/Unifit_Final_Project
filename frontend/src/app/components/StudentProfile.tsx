import { motion, AnimatePresence } from 'framer-motion'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts'
import {
  TrendingUp, AlertTriangle, Activity,
  Calendar, FileText, Dumbbell,
  Zap, Flame, Shield, BarChart2,
} from 'lucide-react'
import { TrophyView } from './TrophyModel'
import coachImg from '../../assets/illustrations/dashboard/coach.png'

interface Student {
  id: number
  name: string
  document: string
  carnetId: string
  age: number
  email: string
  phone: string
  eps: string
  bloodType: string
  gender: string
  institution: string
  faculty: string
  program: string
  modality: string
  jornada: string
  semestre: number
  graduated: boolean
  enrollmentDate: string
  allergies: string
  emergencyContact: string
  city: string
  address: string
  nationality: string
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

export const TABS = [
  { id: 'overview', label: 'General', icon: Activity },
  { id: 'progress', label: 'Progreso', icon: TrendingUp },
  { id: 'routines', label: 'Rutinas', icon: Dumbbell },
  { id: 'attendance', label: 'Asistencia', icon: Calendar },
  { id: 'assessment', label: 'Valoraciones', icon: BarChart2 },
  { id: 'documents', label: 'Documentos', icon: FileText },
] as const

export function StudentProfile({ student, tab = 'overview', onTabChange }: { student: Student; tab?: string; onTabChange?: (t: string) => void }) {
  const imc = (student.weight / ((student.height / 100) ** 2)).toFixed(1)
  const imcNum = parseFloat(imc)
  return (
    <div className="flex flex-col size-full">
      {/* Background orbs */}
      <div className="floating-sphere" style={{
        width: 280, height: 280,
        background: 'radial-gradient(circle, rgba(230,57,70,0.04), transparent)',
        top: '-60px', right: '-40px',
      }} />

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <AnimatePresence mode="wait">
          {tab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {/* Header - centered avatar half-in-half-out glass card */}
              <div className="relative z-10 flex-shrink-0 px-8 pt-8">
                <div className="relative rounded-2xl p-6 pt-14 text-center" style={{
                  background: 'rgba(255,255,255,0.65)',
                  backdropFilter: 'blur(30px) saturate(1.4)',
                  WebkitBackdropFilter: 'blur(30px) saturate(1.4)',
                  border: '1px solid rgba(255,255,255,0.5)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.03), 0 12px 32px rgba(0,0,0,0.02)',
                  borderRadius: 20,
                }}>
                  <div className="absolute left-1/2 -translate-x-1/2 -top-8">
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg"
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
                  </div>
                  <h2 className="text-[#1D1D1F] text-2xl font-bold">{student.name}</h2>

                  {/* Inner sub-cards - 3 columnas iguales */}
                  <div className="grid grid-cols-3 gap-4 mt-6 text-left">
                    {/* Info General */}
                    <div className="rounded-2xl p-5" style={{
                      background: 'rgba(255,255,255,0.5)',
                      border: '1px solid rgba(255,255,255,0.4)',
                      borderRadius: 16,
                    }}>
                      <h3 className="text-[#1D1D1F] text-sm font-semibold mb-3">Información General</h3>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        {[
                          { label: 'Documento', value: student.document },
                          { label: 'N. Carnet', value: student.carnetId },
                          { label: 'Edad', value: `${student.age} años` },
                          { label: 'Email', value: student.email },
                          { label: 'Teléfono', value: student.phone },
                          { label: 'EPS', value: student.eps },
                          { label: 'G. sanguíneo', value: student.bloodType },
                          { label: 'Género', value: student.gender },
                          { label: 'Institución', value: student.institution },
                          { label: 'Programa', value: student.program },
                          { label: 'Modalidad', value: student.modality },
                          { label: 'Jornada', value: student.jornada },
                          { label: 'Semestre', value: `${student.semestre}°` },
                          { label: 'Egresado', value: student.graduated ? 'Sí' : 'No' },
                          { label: 'Fecha inscripción', value: student.enrollmentDate },
                          { label: 'Alergias', value: student.allergies },
                          { label: 'Contacto emergencia', value: student.emergencyContact },
                          { label: 'Ciudad', value: student.city },
                          { label: 'Dirección', value: student.address },
                          { label: 'Nacionalidad', value: student.nationality },
                        ].map(item => (
                          <div key={item.label} className="py-1" style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                            <p className="text-[10px]" style={{ color: 'rgba(0,0,0,0.35)' }}>{item.label}</p>
                            <p className="text-xs font-semibold" style={{ color: '#1D1D1F' }}>{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Meta del usuario */}
                    <div className="rounded-2xl p-5 flex flex-col items-center justify-center text-center relative overflow-hidden" style={{
                      background: 'linear-gradient(145deg, rgba(255,215,0,0.07), rgba(255,180,0,0.02), rgba(255,215,0,0.05))',
                      border: '1px solid rgba(255,200,0,0.15)',
                      borderRadius: 16,
                    }}>
                      <div className="absolute inset-0 rounded-[inherit] pointer-events-none" style={{
                        background: 'radial-gradient(ellipse at 50% 30%, rgba(255,215,0,0.08), transparent 70%)',
                      }} />
                      <div className="absolute inset-0 rounded-[inherit] pointer-events-none holo-overlay" />
                      <div className="w-full aspect-square max-w-[150px] mb-1 mx-auto relative z-10">
                        <TrophyView />
                      </div>
                      <span className="relative z-10 inline-block px-3 py-0.5 rounded-full text-[10px] font-semibold tracking-wide mb-1" style={{
                        background: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,180,0,0.08))',
                        color: 'rgba(180,130,0,0.8)',
                        letterSpacing: '0.06em',
                      }}>
                        META DEL USUARIO
                      </span>
                      <p className="relative z-10 text-base font-extrabold" style={{
                        background: 'linear-gradient(135deg, #1D1D1F, rgba(0,0,0,0.6))',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}>
                        {student.goal}
                      </p>
                    </div>

                    {/* Perfil Físico */}
                    <div className="rounded-2xl p-5 flex flex-col" style={{
                      background: 'rgba(255,255,255,0.5)',
                      border: '1px solid rgba(255,255,255,0.4)',
                      borderRadius: 16,
                    }}>
                      <h3 className="text-[#1D1D1F] text-sm font-semibold mb-1">Perfil Físico</h3>
                      <p className="text-xs mb-2" style={{ color: 'rgba(0,0,0,0.35)' }}>Capacidades funcionales</p>
                      <div className="flex-1" style={{ minHeight: 240 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={bodyRadar} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                            <PolarGrid stroke="rgba(0,0,0,0.06)" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(0,0,0,0.35)', fontSize: 11 }} />
                            <Radar name="Capacidad" dataKey="value" stroke="#E63946" fill="#E63946" fillOpacity={0.08} strokeWidth={2.5} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
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

          {(tab === 'assessment' || tab === 'documents') && (
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-8 space-y-6 max-w-[1440px]">
              {tab === 'assessment' && (
                <>
                  {/* Valoraciones Físicas */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { section: 'Antropometría', items: [{ label: 'Peso', value: `${student.weight} kg` }, { label: 'Altura', value: `${student.height} cm` }, { label: 'IMC', value: imc }, { label: 'Grasa corporal', value: '17%' }, { label: 'Masa muscular', value: '52 kg' }, { label: 'Circunf. cintura', value: '82 cm' }] },
                      { section: 'Capacidades Físicas', items: [{ label: 'Fuerza máx. (1RM)', value: '100 kg' }, { label: 'VO2 Max', value: '42 ml/kg/min' }, { label: 'Flexibilidad', value: '28 cm (sit & reach)' }, { label: 'Potencia', value: '85/100' }, { label: 'Movilidad', value: '72/100' }, { label: 'Equilibrio', value: '78/100' }] },
                      { section: 'Salud y Bienestar', items: [{ label: 'Nivel de estrés', value: '4/10' }, { label: 'Calidad de sueño', value: '7.2 h/noche' }, { label: 'Energía percibida', value: '7/10' }, { label: 'Dolor muscular', value: 'Leve' }, { label: 'Lesiones activas', value: 'Ninguna' }, { label: 'Frecuencia card.', value: '68 bpm' }] },
                    ].map(s => (
                      <div key={s.section} className="rounded-2xl p-6 premium-card">
                        <h3 className="text-sm font-semibold mb-5" style={{ color: '#E63946' }}>{s.section}</h3>
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

                  {/* Análisis de Riesgo */}
                  <div className="rounded-2xl p-8" style={{
                    background: 'linear-gradient(145deg, rgba(255,59,48,0.04), rgba(255,255,255,0.3))',
                    border: '1px solid rgba(255,59,48,0.08)',
                  }}>
                    <div className="flex items-center gap-3 mb-6">
                      <AlertTriangle size={22} style={{ color: '#FF3B30' }} />
                      <h3 className="text-[#1D1D1F] font-semibold">Análisis de Riesgo</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-6 mb-6">
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
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { title: 'Factores de riesgo', items: ['Baja adherencia sostenida', 'Ausencias sin justificar', 'Reducción en intensidad de sesiones', 'Sin respuesta a comunicaciones'], icon: AlertTriangle, color: '#FF3B30' },
                        { title: 'Factores protectores', items: ['Progreso en masa muscular', 'Historial previo de adherencia alta', 'Rutina adaptada correctamente', 'Sin lesiones registradas'], icon: Shield, color: '#30D158' },
                      ].map(section => (
                        <div key={section.title} className="rounded-2xl p-6 premium-card">
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
                  </div>
                </>
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
                      className="rounded-2xl p-6 premium-card"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(230,57,70,0.08)' }}>
                          <FileText size={17} style={{ color: '#E63946' }} />
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
