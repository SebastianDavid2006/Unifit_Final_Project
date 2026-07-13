import { motion } from 'motion/react'
import {
  BarChart, Bar, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, LabelList,
} from 'recharts'
import { Users, Clock, Sparkles, AlertTriangle, Target } from 'lucide-react'
import { StudentsView } from '../../assets/models/ui/users/students/StudentsModel'
import { StudentCardView } from '../../assets/models/ui/objects/student_card/StudentCardModel'
import { CalendarView } from '../../assets/models/ui/objects/calendar/CalendarModel'
import { ListView } from '../../assets/models/ui/objects/list/ListModel'
import { PriorityBellView } from '../../assets/models/ui/objects/priority_bell/PriorityBellModel'
import { BLUE, BLUE_GRAD, RED } from '../../data/constants'
import coachImg from '../../assets/illustrations/characters/coach/coach_default.webp'

const CARD_COLORS = [
  { bg: 'rgba(18,112,183,0.08)', icon: 'rgba(18,112,183,0.15)', text: '#1270B7' },
  { bg: 'rgba(191,90,242,0.08)', icon: 'rgba(191,90,242,0.15)', text: '#BF5AF2' },
  { bg: 'rgba(48,209,88,0.08)', icon: 'rgba(48,209,88,0.15)', text: '#30D158' },
  { bg: 'rgba(241,200,39,0.08)', icon: 'rgba(241,200,39,0.15)', text: '#F1C827' },
]

const DONUT_COLORS = ['#1270B7', '#30D158', '#F1C827', '#BF5AF2', '#FF9500', '#F43843']

const cards = [
  { label: 'Estudiantes Registrados', value: '847', view: StudentCardView },
  { label: 'Asistencias de Hoy', value: '12', view: ListView },
  { label: 'Personas Activas', value: '43', view: StudentsView },
  { label: 'Citas Programadas', value: '24', view: CalendarView },
]

const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const today = new Date()
const monday = new Date(today)
monday.setDate(today.getDate() - ((today.getDay() + 6) % 7))

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

const heatmapDays = weekDays.map(wd => ({
  label: wd.isToday ? 'Hoy' : `${wd.name} ${wd.date}`,
  isToday: wd.isToday,
}))

const hourBlocks = [
  { label: '12pm-2pm', hours: [0, 1] },
  { label: '2pm-4pm', hours: [2, 3] },
  { label: '4pm-6pm', hours: [4, 5] },
  { label: '6pm-8pm', hours: [6, 7] },
  { label: '8pm-10pm', hours: [8, 9] },
]

const heatmapData: { day: string; block: number; value: number }[] = []
const basePattern = [15, 10, 8, 12, 18, 25, 35, 45, 55, 50, 40]
heatmapDays.forEach((wd, di) => {
  const dayFactor = [0.9, 1.0, 0.85, 1.1, 1.3, 0.7, 0.3][di]
  hourBlocks.forEach((block, bi) => {
    const blockValue = block.hours.reduce((sum, h) => {
      const noise = 0.7 + Math.random() * 0.6
      return sum + Math.round(basePattern[h] * dayFactor * noise)
    }, 0)
    heatmapData.push({ day: wd.label, block: bi, value: blockValue })
  })
})

const maxHeatValue = Math.max(...heatmapData.map(d => d.value))

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
      <style>{`.no-clip-chart .recharts-wrapper svg { overflow: visible !important; } .no-clip-chart .recharts-wrapper svg clipPath { clip-path: none !important; } .bar-hover rect { transition: opacity 0.2s, filter 0.2s; } .bar-hover:hover rect { opacity: 0.75; filter: brightness(1.15); } @keyframes card-shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } } .shimmer-card { position: relative; overflow: hidden; } .shimmer-card::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%); animation: card-shimmer 4s ease-in-out infinite; pointer-events: none; }`}</style>
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
                <p className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: 'rgba(0,0,0,0.25)' }}>Martes, 7 de Julio · 2026</p>
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
                <span className="stat-value block transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.15]" style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1, color: colors.text }}>{card.value}</span>
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
          className="rounded-2xl p-6 premium-card shimmer-card"
          style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(24px) saturate(1.6)', border: '1px solid rgba(255,255,255,0.6)' }}
        >
          <div className="flex items-center justify-center mb-5">
            <span className="text-[13px] font-bold tracking-wide" style={{ color: 'rgba(0,0,0,0.55)' }}>ASISTENCIA SEMANAL</span>
          </div>
          <div style={{ overflow: 'visible' }} className="no-clip-chart">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyAttendance} margin={{ top: 40, bottom: 0, left: 0, right: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={({ x, y, payload }: any) => (
                  <g transform={`translate(${x},${y})`}>
                    <text x={0} y={0} dy={16} textAnchor="middle" fontSize={11} fontWeight={payload.value === 'Hoy' ? 700 : 400} fill={payload.value === 'Hoy' ? '#30D158' : 'rgba(0,0,0,0.65)'}>
                      {payload.value}
                    </text>
                  </g>
                )}
              />
              <YAxis tick={{ fontSize: 11, fill: 'rgba(0,0,0,0.65)' }} axisLine={false} tickLine={false} />
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
                    const pillW = isToday ? 44 : 26
                    return (
                      <g>
                        <rect
                          x={x + width / 2 - pillW / 2}
                          y={y - 20}
                          width={pillW}
                          height={16}
                          rx={8}
                          fill={isToday ? '#30D158' : 'rgba(18,112,183,0.08)'}
                        />
                        <text
                          x={x + width / 2}
                          y={y - 10}
                          textAnchor="middle"
                          fontSize={isToday ? 11 : 10}
                          fontWeight={isToday ? 800 : 600}
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
          <div className="flex items-center justify-center mb-5">
            <span className="text-[13px] font-bold tracking-wide" style={{ color: 'rgba(0,0,0,0.55)' }}>HORA PICO DE LA SEMANA</span>
          </div>
          <div className="overflow-x-auto">
            <div className="flex gap-0" style={{ minWidth: 500 }}>
              {/* Hour labels column */}
              <div className="flex flex-col gap-[3px] pt-6 pr-2">
                {heatmapDays.map((wd) => (
                  <div key={wd.label} className="flex items-center justify-end h-[26px]">
                    <span className="text-[10px] font-semibold" style={{ color: wd.isToday ? '#30D158' : 'rgba(0,0,0,0.6)' }}>
                      {wd.label}
                    </span>
                    {wd.isToday && <span className="ml-1 w-1.5 h-1.5 rounded-full bg-[#30D158]" />}
                  </div>
                ))}
              </div>
              {/* Heatmap grid */}
              <div className="flex-1">
                <div className="flex gap-[3px] mb-[3px]">
                  {hours.map((h) => (
                    <div key={h} className="flex-1 text-center">
                      <span className="text-[9px] font-medium" style={{ color: 'rgba(0,0,0,0.5)' }}>
                        {h === 0 ? '12pm-1pm' : h === 10 ? '9pm-10pm' : `${h}pm-${h + 1}pm`}
                      </span>
                    </div>
                  ))}
                </div>
                {heatmapDays.map((wd) => (
                  <div key={wd.label} className="flex gap-[3px] mb-[3px]">
                    {hours.map((hour) => {
                      const entry = heatmapData.find(d => d.day === wd.label && d.hour === hour)
                      const value = entry?.value ?? 0
                      const intensity = value / maxHeatValue
                      const isToday = wd.isToday
                      return (
                        <div
                          key={`${wd.label}-${hour}`}
                          className="flex-1 rounded-lg cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-md flex items-center justify-center"
                          style={{
                            height: 26,
                            background: isToday
                              ? `rgba(48,209,88,${0.18 + intensity * 0.75})`
                              : `rgb(${Math.round(220 - 200 * intensity)}, ${Math.round(230 - 120 * intensity)}, ${Math.round(245 - 60 * intensity)})`,
                            opacity: isToday ? 1 : 1,
                          }}
                          title={`${wd.label} · ${hour === 0 ? '12pm' : `${hour}pm`}: ${value} asistencias`}
                        >
                          <span style={{ fontSize: 9, fontWeight: 700, color: (isToday ? intensity > 0.15 : intensity > 0.35) ? '#FFFFFF' : '#1A1A1E' }}>
                            {value}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
            {/* Legend */}
            <div className="flex items-center justify-between mt-4 px-1">
              {[0, 0.25, 0.5, 0.75, 1].map((t, i, arr) => {
                const from = i === 0 ? 0 : Math.round(maxHeatValue * arr[i - 1]) + 1
                const to = Math.round(maxHeatValue * t)
                const r = Math.round(220 - 200 * t)
                const g = Math.round(230 - 120 * t)
                const b = Math.round(245 - 60 * t)
                return (
                  <div key={i} className="flex items-center gap-1.5">
                    <div style={{ width: 22, height: 14, borderRadius: 4, background: `rgb(${r},${g},${b})` }} />
                    <span className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.6)' }}>{from}-{to}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
