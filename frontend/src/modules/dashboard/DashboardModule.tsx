import { motion } from 'motion/react'
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { Users, Clock, BarChart3, Sparkles, AlertTriangle, Target } from 'lucide-react'
import { StudentsView } from '../../assets/models/ui/users/students/StudentsModel'
import { StudentCardView } from '../../assets/models/ui/objects/student_card/StudentCardModel'
import { CalendarView } from '../../assets/models/ui/objects/calendar/CalendarModel'
import { ListView } from '../../assets/models/ui/objects/list/ListModel'
import { PriorityBellView } from '../../assets/models/ui/objects/priority_bell/PriorityBellModel'
import { BLUE, BLUE_GRAD, RED } from '../../data/constants'
import coachImg from '../../assets/illustrations/characters/coach/coach_default.webp'

const CARD_COLORS = [
  { bg: 'rgba(18,112,183,0.08)', icon: 'rgba(18,112,183,0.15)', text: '#1270B7' },
  { bg: 'rgba(48,209,88,0.08)', icon: 'rgba(48,209,88,0.15)', text: '#30D158' },
  { bg: 'rgba(241,200,39,0.08)', icon: 'rgba(241,200,39,0.15)', text: '#F1C827' },
  { bg: 'rgba(191,90,242,0.08)', icon: 'rgba(191,90,242,0.15)', text: '#BF5AF2' },
]

const DONUT_COLORS = ['#1270B7', '#30D158', '#F1C827', '#BF5AF2', '#FF9500', '#F43843']

const cards = [
  { label: 'Estudiantes Registrados', value: '847', view: StudentCardView },
  { label: 'Asistencias de Hoy', value: '12', view: ListView },
  { label: 'Personas Activas', value: '43', view: StudentsView },
  { label: 'Citas Programadas', value: '24', view: CalendarView },
]

const weeklyAttendance = [
  { day: 'Lun 25', asistentes: 45 },
  { day: 'Mar 26', asistentes: 67 },
  { day: 'Mié 27', asistentes: 52 },
  { day: 'Jue 28', asistentes: 78 },
  { day: 'Vie 29', asistentes: 89 },
  { day: 'Sáb 30', asistentes: 34 },
  { day: 'Dom 31', asistentes: 12 },
]

const peakByDay = [
  { day: 'Lun 25', hour: 19 },
  { day: 'Mar 26', hour: 18 },
  { day: 'Mié 27', hour: 12 },
  { day: 'Jue 28', hour: 19 },
  { day: 'Vie 29', hour: 17 },
  { day: 'Sáb 30', hour: 10 },
  { day: 'Dom 31', hour: 8 },
]

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

export default function DashboardModule() {
  return (
    <div className="p-8 pt-12 space-y-6 max-w-[1440px] mx-auto relative">
      {/* ── Greeting Banner ── */}
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
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-1 h-10 rounded-full" style={{ background: BLUE_GRAD }} />
              <div>
                <p className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: 'rgba(0,0,0,0.25)' }}>Jueves, 28 de Mayo · 2026</p>
                <h1 className="mt-0.5" style={{ color: '#1A1A1E', fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.04em' }}>
                  Buenos días, <span className="text-gradient-warm">Sebastián.</span>
                </h1>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
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
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          style={{
            position: 'absolute',
            right: 24,
            top: -50,
            width: 400,
            height: 'auto',
            zIndex: 20,
          }}
        >
          <img src={coachImg} alt="Coach Dashboard" className="w-full h-auto" />
          <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10" style={{
            background: 'linear-gradient(to top, rgba(240,247,255,1) 0%, transparent 60%)',
          }} />
        </motion.div>
      </motion.div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-5 gap-4">
        {cards.map((card, i) => {
          const colors = CARD_COLORS[i]
          const ModelView = card.view
          const isActive = i === 2
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-2xl px-5 pb-5 pt-14 group cursor-pointer premium-card transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:pt-[68px] group-hover:pb-7"
              style={isActive ? {
                boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06), 0 12px 40px rgba(48,209,88,0.12)',
              } : {}}
            >
              {isActive && (
                <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
                  background: 'linear-gradient(145deg, rgba(48,209,88,0.08), transparent 60%)',
                  borderRadius: 20,
                }} />
              )}
              <div className="absolute top-0 left-4 right-4 h-[3px] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500" style={{ background: `linear-gradient(90deg, ${colors.text}, transparent)` }} />
              <div
                className="absolute left-1/2 -translate-x-1/2 top-1 w-14 h-14 z-20 pointer-events-none transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.6]"
                style={{ transformOrigin: 'bottom center' }}
              >
                <ModelView />
              </div>
              <div className="relative z-10 text-center mt-6">
                <span className="stat-value text-gradient-static block transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.15]" style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>{card.value}</span>
                <p className="text-xs mt-1.5 font-semibold transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]" style={{ color: 'rgba(0,0,0,0.45)' }}>{card.label}</p>
              </div>
            </motion.div>
          )
        })}

        {/* ── Pendientes del día ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + cards.length * 0.06, ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
          className="relative rounded-2xl px-5 pb-5 pt-14 group cursor-pointer transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04]"
          style={{
            background: `
              radial-gradient(ellipse at 20% 10%, #C63C00 0%, #C63C00 35%, #901322 55%, transparent 70%),
              radial-gradient(ellipse at 75% 25%, #901322 0%, #901322 35%, #8A0000 55%, transparent 70%),
              radial-gradient(ellipse at 50% 95%, #8A0000 0%, #8A0000 35%, #C63C00 55%, transparent 70%),
              #1A0000
            `,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.15), 0 12px 40px rgba(0,0,0,0.12)',
            borderRadius: 20,
          }}
        >
          <div
            className="absolute left-1/2 -translate-x-1/2 top-1 w-14 h-14 z-20 pointer-events-none transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.6]"
            style={{ transformOrigin: 'bottom center' }}
          >
            <PriorityBellView />
          </div>
          <div
            className="absolute -inset-2 rounded-[24px] pointer-events-none glow-ring z-0"
            style={{ background: 'linear-gradient(135deg, rgba(198,60,0,0.25), rgba(144,19,34,0.15), rgba(138,0,0,0.1))', filter: 'blur(16px)' }}
          />
          <div className="relative z-10 text-center mt-6">
            <span className="block" style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1, color: '#FFFFFF' }}>8</span>
            <p className="text-xs mt-1.5 font-semibold" style={{ color: 'rgba(255,255,255,0.6)' }}>Pendientes del día</p>
          </div>
        </motion.div>
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl p-6 premium-card"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${BLUE}10` }}>
              <BarChart3 size={14} style={{ color: BLUE }} />
            </div>
            <span className="text-[11px] font-bold tracking-wide" style={{ color: 'rgba(0,0,0,0.3)' }}>ASISTENCIA SEMANAL</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weeklyAttendance}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'rgba(0,0,0,0.65)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'rgba(0,0,0,0.65)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={BLUE} stopOpacity={1} />
                  <stop offset="100%" stopColor={BLUE} stopOpacity={0.15} />
                </linearGradient>
              </defs>
              <Bar dataKey="asistentes" radius={[8, 8, 0, 0]} fill="url(#barGradient)" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl p-6 premium-card"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${BLUE}10` }}>
              <Clock size={14} style={{ color: BLUE }} />
            </div>
            <span className="text-[11px] font-bold tracking-wide" style={{ color: 'rgba(0,0,0,0.3)' }}>HORA PICO DE LA SEMANA</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={peakByDay} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'rgba(0,0,0,0.65)' }} axisLine={false} tickLine={false} />
              <YAxis
                domain={[12, 22]}
                ticks={[12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]}
                interval={0}
                padding={{ top: 0, bottom: 0 }}
                tick={{ fontSize: 10, fill: 'rgba(0,0,0,0.65)' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => v === 12 ? '12pm' : `${v-12}pm`}
              />
              <Tooltip
                content={({ active, payload }: any) => {
                  if (!active || !payload?.length) return null
                  const v = payload[0].value
                  const label = v === 12 ? '12pm' : `${v-12}pm`
                  return (
                    <div style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 14, padding: '8px 14px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                      <p style={{ color: '#1A1A1E', fontSize: 13, fontWeight: 700 }}>{payload[0].payload.day} · {label}</p>
                    </div>
                  )
                }}
              />
              <defs>
                <linearGradient id="peakGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={BLUE} stopOpacity={1} />
                  <stop offset="100%" stopColor={BLUE} stopOpacity={0.15} />
                </linearGradient>
              </defs>
              <Bar dataKey="hour" radius={[8, 8, 0, 0]} fill="url(#peakGradient)" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  )
}
