import { motion } from 'motion/react'
import {
  BarChart, Bar, Cell, XAxis, YAxis, PieChart, Pie,
  CartesianGrid, Tooltip, ResponsiveContainer, LabelList,
} from 'recharts'
import { StudentsView } from '@/assets/models/ui/users/students/StudentsModel'
import { StudentCardView } from '@/assets/models/ui/objects/student_card/StudentCardModel'
import { CalendarView } from '@/assets/models/ui/objects/calendar/CalendarModel'
import { ListView } from '@/assets/models/ui/objects/list/ListModel'
import { BLUE_GRAD } from '@/data/constants'
import coachImg from '@/assets/illustrations/characters/coach/coach_default.webp'

const CARD_COLORS = [
  { bg: 'rgba(18,112,183,0.08)', icon: 'rgba(18,112,183,0.15)', text: '#1270B7' },
  { bg: 'rgba(191,90,242,0.08)', icon: 'rgba(191,90,242,0.15)', text: '#BF5AF2' },
  { bg: 'rgba(48,209,88,0.08)', icon: 'rgba(48,209,88,0.15)', text: '#30D158' },
  { bg: 'rgba(241,200,39,0.08)', icon: 'rgba(241,200,39,0.15)', text: '#F1C827' },
]

const today = new Date()
const monday = new Date(today)
monday.setDate(today.getDate() - ((today.getDay() + 6) % 7))

const cards = [
  { label: 'Estudiantes Registrados', value: '847', view: StudentCardView },
  { label: 'Asistencias de Hoy', value: '12', view: ListView },
  { label: 'Personas Activas', value: '43', view: StudentsView },
  { label: 'Citas Programadas', value: '24', view: CalendarView },
]

const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const weekDays = dayNames.map((name, i) => {
  const d = new Date(monday)
  d.setDate(monday.getDate() + i)
  return { name, date: d.getDate(), isToday: d.toDateString() === today.toDateString() }
})

const weeklyAttendance = weekDays.map(wd => ({
  day: wd.isToday ? 'Hoy' : `${wd.name} ${wd.date}`,
  asistentes: Math.round(20 + Math.random() * 70),
  isToday: wd.isToday,
}))

const topCareers = [
  { name: 'Administración de Empresas', label: 'Adm. Empresas', students: 42, color: '#1270B7' },
  { name: 'Ingeniería de Software', label: 'Ing. Software', students: 40, color: '#30D158' },
  { name: 'Auxiliar en Enfermería', label: 'Enfermería', students: 38, color: '#FF9F0A' },
  { name: 'Contaduría Pública', label: 'Contaduría', students: 36, color: '#BF5AF2' },
  { name: 'Auxiliar Administrativo', label: 'Adm. Auxiliar', students: 35, color: '#F43843' },
  { name: 'Ingeniería de Sistemas', label: 'Sistemas', students: 34, color: '#5E5CE6' },
  { name: 'Diseño Gráfico', label: 'Diseño', students: 33, color: '#FF6482' },
  { name: 'Ingeniería Industrial', label: 'Ing. Industrial', students: 31, color: '#00C7BE' },
  { name: 'Derecho', label: 'Derecho', students: 30, color: '#64D2FF' },
  { name: 'Operaciones Software y Redes', label: 'Software y Redes', students: 30, color: '#FF9F0A' },
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

export default function TrainerDashboard() {
  return (
    <div className="p-8 pt-12 space-y-6 max-w-[1440px] mx-auto relative">
      <style>{`.no-clip-chart .recharts-wrapper svg { overflow: visible !important; } .no-clip-chart .recharts-wrapper svg clipPath { clip-path: none !important; } .bar-hover rect { transition: opacity 0.2s, filter 0.2s; } .bar-hover:hover rect { opacity: 0.75; filter: brightness(1.15); } @keyframes card-shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } } .shimmer-card { position: relative; overflow: hidden; } .shimmer-card::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%); animation: card-shimmer 4s ease-in-out infinite; pointer-events: none; }`}</style>
      {/* ── Greeting Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-3xl gradient-border mt-12"
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
        <div className="relative z-10 p-8 flex items-center min-h-[280px]">
          <div className="flex items-center gap-5">
            <div className="w-1 h-24 rounded-full" style={{ background: BLUE_GRAD }} />
            <div>
              <p className="text-[11px] font-bold tracking-[0.18em] uppercase" style={{ color: 'rgba(0,0,0,0.25)' }}>{today.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <h1 className="mt-1.5" style={{ color: '#1A1A1E', fontSize: '2.8rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
                Buenos días,
              </h1>
              <h2 className="text-gradient-warm" style={{ fontSize: '2.8rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
                Sebastián.
              </h2>
            </div>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          style={{
            position: 'absolute',
            right: 24,
            bottom: 0,
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
      <div className="grid grid-cols-4 gap-4">
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
              className="relative rounded-2xl px-5 pb-5 pt-14 group cursor-pointer transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:pt-[68px] group-hover:pb-7"
              style={{
                background: '#FFFFFF',
                backdropFilter: 'none',
                WebkitBackdropFilter: 'none',
                boxShadow: isActive
                  ? '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06), 0 12px 40px rgba(48,209,88,0.12)'
                  : '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
              }}
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
                <span className="stat-value text-gradient-warm block transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.15]" style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>{card.value}</span>
                <p className="text-xs mt-1.5 font-semibold transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]" style={{ color: 'rgba(0,0,0,0.45)' }}>{card.label}</p>
              </div>
            </motion.div>
          )
        })}

      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl p-6 premium-card shimmer-card"
          style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(24px) saturate(1.6)', border: '1px solid rgba(255,255,255,0.6)' }}
        >
          <div className="flex items-center justify-center mb-5">
            <span className="text-[13px] font-bold tracking-wide" style={{ color: 'rgba(0,0,0,0.55)' }}>ASISTENCIA SEMANAL</span>
          </div>
          <div style={{ overflow: 'visible' }} className="no-clip-chart">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyAttendance} margin={{ top: 40, bottom: 0, left: 0, right: 0 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(0,0,0,0.12)" />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={({ x, y, payload }: any) => (
                  <g transform={`translate(${x},${y})`}>
                    <text x={0} y={0} dy={16} textAnchor="middle" fontSize={13} fontWeight={700} fill={payload.value === 'Hoy' ? '#30D158' : 'rgba(0,0,0,0.8)'}>
                      {payload.value}
                    </text>
                  </g>
                )}
              />
              <YAxis hide />
              <Tooltip content={<ChartTooltip />} />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={1} />
                  <stop offset="100%" stopColor="#93C5FD" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient id="barGreenGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#30D158" stopOpacity={1} />
                  <stop offset="100%" stopColor="#30D158" stopOpacity={0.2} />
                </linearGradient>
                <filter id="glowToday" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feFlood floodColor="#30D158" floodOpacity="0.35" result="color" />
                  <feComposite in="color" in2="blur" operator="in" result="shadow" />
                  <feMerge>
                    <feMergeNode in="shadow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <Bar dataKey="asistentes" radius={[12, 12, 0, 0]} className="bar-hover">
                {weeklyAttendance.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.isToday ? 'url(#barGreenGlow)' : 'url(#barGradient)'}
                    filter={entry.isToday ? 'url(#glowToday)' : undefined}
                    style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                  />
                ))}
                <LabelList
                  dataKey="asistentes"
                  position="top"
                  content={({ x, y, width, value, index }: any) => {
                    const entry = weeklyAttendance[index]
                    const isToday = entry?.isToday
                    const label = isToday ? 'Hoy' : value
                    const pillW = isToday ? 50 : 30
                    return (
                      <g>
                        <rect
                          x={x + width / 2 - pillW / 2}
                          y={y - 22}
                          width={pillW}
                          height={18}
                          rx={9}
                          fill={isToday ? '#30D158' : 'rgba(18,112,183,0.1)'}
                        />
                        <text
                          x={x + width / 2}
                          y={y - 10}
                          textAnchor="middle"
                          fontSize={isToday ? 12 : 12}
                          fontWeight={800}
                          fill={isToday ? '#FFFFFF' : '#1270B7'}
                        >
                          {label}
                        </text>
                      </g>
                    )
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl p-6 premium-card shimmer-card"
          style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(24px) saturate(1.6)', border: '1px solid rgba(255,255,255,0.6)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-center mb-5">
            <span className="text-[13px] font-bold tracking-wide" style={{ color: 'rgba(0,0,0,0.55)' }}>CARRERAS CON MÁS ASISTENCIA</span>
          </div>
          <div style={{ overflow: 'visible' }} className="no-clip-chart">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topCareers.slice(0, 5)} margin={{ top: 40, bottom: 0, left: 0, right: 0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="rgba(0,0,0,0.12)" vertical={false} />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  tick={{ fontSize: 13, fontWeight: 700, fill: 'rgba(0,0,0,0.8)' }}
                  tickMargin={8}
                />
                <YAxis hide domain={[0, 50]} />
                <Tooltip
                  content={({ active, payload }: any) => {
                    if (!active || !payload?.length) return null
                    const entry = payload[0]
                    return (
                      <div style={{
                        background: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(0,0,0,0.06)',
                        borderRadius: 14,
                        padding: '12px 18px',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
                      }}>
                        <p style={{ color: 'rgba(0,0,0,0.35)', fontSize: 11, marginBottom: 4, fontWeight: 500 }}>{entry.payload.name}</p>
                        <p style={{ color: entry.payload.color, fontSize: 14, fontWeight: 700 }}>{entry.value} <span style={{ color: 'rgba(0,0,0,0.3)', fontWeight: 400, fontSize: 12 }}>estudiantes</span></p>
                      </div>
                    )
                  }}
                />
                <defs>
                  {topCareers.slice(0, 5).map((c, i) => (
                    <linearGradient key={i} id={`gradTop${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={c.color} stopOpacity={1} />
                      <stop offset="100%" stopColor={c.color} stopOpacity={0.35} />
                    </linearGradient>
                  ))}
                </defs>
                <Bar dataKey="students" radius={[8, 8, 0, 0]} className="bar-hover">
                  {topCareers.slice(0, 5).map((c, i) => (
                    <Cell
                      key={i}
                      fill={`url(#gradTop${i})`}
                      style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                    />
                  ))}
                  <LabelList
                    dataKey="students"
                    position="top"
                    content={({ x, y, width, value }: any) => {
                      const pillW = 26
                      return (
                        <g>
                          <rect x={x + width / 2 - pillW / 2} y={y - 20} width={pillW} height={17} rx={8.5} fill="rgba(0,0,0,0.08)" />
                          <text x={x + width / 2} y={y - 8} textAnchor="middle" fontSize={10} fontWeight={800} fill="rgba(0,0,0,0.7)">{value}</text>
                        </g>
                      )
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
