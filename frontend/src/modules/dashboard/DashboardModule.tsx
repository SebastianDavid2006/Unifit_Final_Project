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
import { BLUE, BLUE_GRAD, RED } from '../../data/constants'
import coachImg from '../../assets/illustrations/characters/coach/coach_default.webp'

const CARD_COLORS = [
  { bg: 'rgba(18,112,183,0.08)', icon: 'rgba(18,112,183,0.15)', text: '#1270B7' },
  { bg: 'rgba(191,90,242,0.08)', icon: 'rgba(191,90,242,0.15)', text: '#BF5AF2' },
  { bg: 'rgba(48,209,88,0.08)', icon: 'rgba(48,209,88,0.15)', text: '#30D158' },
  { bg: 'rgba(241,200,39,0.08)', icon: 'rgba(241,200,39,0.15)', text: '#F1C827' },
]

const dayRecommendations = [
  { // Lun
    title: 'Planificación semanal',
    tips: [
      { icon: Target, text: 'Revisa los objetivos de adherencia de la semana pasada y ajusta metas individuales.', color: '#30D158' },
      { icon: Users, text: 'Tienes 12 estudiantes inactivos desde el viernes. Un mensaje de texto hoy puede recuperar el 40%.', color: RED },
      { icon: Clock, text: 'El horario más demandado será 5PM-7PM. Asegura disponibilidad de equipos.', color: '#BF5AF2' },
      { icon: AlertTriangle, text: '3 alumnos nuevos necesitan evaluación inicial antes del miércoles.', color: '#FF9500' },
    ],
  },
  { // Mar
    title: 'Seguimiento de rutinas',
    tips: [
      { icon: Target, text: 'Martes suele tener 15% más asistencia que lunes. Aprovecha para retar a los inactivos.', color: '#30D158' },
      { icon: Users, text: 'Los estudiantes de Ingeniería tienen 92% adherencia este mes. Mantén ese grupo motivado.', color: '#1270B7' },
      { icon: Clock, text: 'La franja 4PM-6PM tendrá alta ocupación. Considera agregar un turno extra.', color: '#BF5AF2' },
      { icon: AlertTriangle, text: '2 estudiantes han bajado su rendimiento un 30% esta semana. Revisa sus planes.', color: '#FF3B30' },
    ],
  },
  { // Mié
    title: 'Día clave de mitad de semana',
    tips: [
      { icon: Target, text: 'El miércoles es el día con mayor abandono. Envía recordatorios personalizados a los ausentes del lunes.', color: '#FF3B30' },
      { icon: Users, text: '7 estudiantes tienen citas pendientes de reprogramar. Agenda antes de que se desestimen.', color: '#1270B7' },
      { icon: Clock, text: 'El pico de asistencia será 5PM-8PM. Optimiza la distribución de estaciones.', color: '#BF5AF2' },
      { icon: AlertTriangle, text: 'Un grupo de 5 personas no ha registrado asistencia en 5 días consecutivos.', color: '#FF9500' },
    ],
  },
  { // Jue
    title: 'Ajuste y motivación',
    tips: [
      { icon: Target, text: 'Estás al 68% de la meta semanal de asistencia. Un esfuerzo extra hoy puede marcar la diferencia.', color: '#30D158' },
      { icon: Users, text: 'Los estudiantes de Diseño tienen la mayor caída esta semana. Considera una actividad grupal.', color: '#FF9500' },
      { icon: Clock, text: 'La ocupación máxima será a las 6PM. Prepara el espacio con anticipación.', color: '#BF5AF2' },
      { icon: AlertTriangle, text: '3 citas de hoy fueron confirmadas hace más de 48h. Envía un recordatorio 1h antes.', color: '#FF3B30' },
    ],
  },
  { // Vie
    title: 'Cierre de semana',
    tips: [
      { icon: Target, text: 'Último día hábil para alcanzar la meta semanal. Prioriza a los estudiantes más comprometidos.', color: '#30D158' },
      { icon: Users, text: 'Viernes tiene 20% menos asistencia que martes. Un incentivo puede mejorar la concurrencia.', color: '#1270B7' },
      { icon: Clock, text: 'El cierre temprano (3PM-5PM) es ideal para evaluaciones individuales.', color: '#BF5AF2' },
      { icon: AlertTriangle, text: 'Prepara el reporte semanal: 847 registrados, 12 asistencias hoy proyectadas.', color: '#FF9500' },
    ],
  },
  { // Sáb
    title: 'Actividad ligera',
    tips: [
      { icon: Target, text: 'Los sábados tienen 60% menos carga. Úsalo para organizar el espacio y revisar equipos.', color: '#30D158' },
      { icon: Users, text: 'Solo 34 asistencias esperadas. Enfócate en calidad de atención más que en cantidad.', color: '#1270B7' },
      { icon: Clock, text: 'Horario reducido: 9AM-1PM. Aprovecha la mañana para tareas administrativas.', color: '#BF5AF2' },
      { icon: AlertTriangle, text: 'Revisa el inventario: 2 equipos necesitan mantenimiento antes del lunes.', color: '#FF9500' },
    ],
  },
  { // Dom
    title: 'Descanso y preparación',
    tips: [
      { icon: Target, text: 'Domingo de recuperación. Revisa los datos de la semana desde tu celular.', color: '#30D158' },
      { icon: Users, text: 'Prepara la lista de prioridades para lunes: 14 revisiones pendientes.', color: '#1270B7' },
      { icon: Clock, text: 'El centro está cerrado. Usa este tiempo para planificar la semana siguiente.', color: '#BF5AF2' },
      { icon: AlertTriangle, text: '2 estudiantes enviaron mensajes fuera de horario. Respóndelos mañana temprano.', color: '#FF9500' },
    ],
  },
]

const today = new Date()
const monday = new Date(today)
monday.setDate(today.getDate() - ((today.getDay() + 6) % 7))

const dayIndex = (today.getDay() + 6) % 7 // 0=Lun ... 6=Dom
const todayRecommendations = dayRecommendations[dayIndex]

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
const basePattern = [15, 10, 8, 12, 18, 25, 35, 45, 55, 50]
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
                <p className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: 'rgba(0,0,0,0.25)' }}>{today.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
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
                <span className="text-[10px] font-bold tracking-[0.12em] uppercase" style={{ color: 'rgba(0,0,0,0.3)' }}>Recomendaciones IA · {todayRecommendations.title}</span>
                <div className="ml-auto flex items-center gap-1.5">
                  <div className="dot-live" style={{ width: 5, height: 5 }} />
                  <span className="text-[10px]" style={{ color: 'rgba(0,0,0,0.25)' }}>Generado para hoy</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {todayRecommendations.tips.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl nested-card">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}0A` }}>
                      <item.icon size={14} style={{ color: item.color }} />
                    </div>
                    <div>
                      <p className="text-xs leading-snug" style={{ color: 'rgba(0,0,0,0.6)', lineHeight: 1.5 }}>{item.text}</p>
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
                <span className="stat-value block transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.15]" style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1, color: colors.text }}>{card.value}</span>
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
                  </div>
                ))}
              </div>
              {/* Heatmap grid */}
              <div className="flex-1">
                <div className="flex gap-[3px] mb-[3px]">
                  {hourBlocks.map((block) => (
                    <div key={block.label} className="flex-1 text-center">
                      <span className="text-[9px] font-medium" style={{ color: 'rgba(0,0,0,0.5)' }}>
                        {block.label}
                      </span>
                    </div>
                  ))}
                </div>
                {heatmapDays.map((wd) => (
                  <div key={wd.label} className="flex gap-[3px] mb-[3px]">
                    {hourBlocks.map((block, bi) => {
                      const entry = heatmapData.find(d => d.day === wd.label && d.block === bi)
                      const value = entry?.value ?? 0
                      const intensity = value / maxHeatValue
                      const isToday = wd.isToday
                      const meshBg = isToday
                        ? `radial-gradient(ellipse at 20% 20%, rgba(48,209,88,${0.4 + intensity * 0.5}) 0%, transparent 60%),
                           radial-gradient(ellipse at 80% 80%, rgba(16,185,129,${0.3 + intensity * 0.55}) 0%, transparent 60%),
                           radial-gradient(ellipse at 50% 50%, rgba(5,150,105,${0.2 + intensity * 0.4}) 0%, transparent 70%),
                           linear-gradient(135deg, rgba(48,209,88,${0.15 + intensity * 0.3}), rgba(16,185,129,${0.1 + intensity * 0.25}))`
                        : `radial-gradient(ellipse at 20% 20%, rgba(99,148,237,${0.08 + intensity * 0.72}) 0%, transparent 60%),
                           radial-gradient(ellipse at 80% 80%, rgba(59,130,246,${0.05 + intensity * 0.75}) 0%, transparent 60%),
                           radial-gradient(ellipse at 50% 50%, rgba(37,99,235,${0.04 + intensity * 0.6}) 0%, transparent 70%),
                           linear-gradient(135deg, rgb(${Math.round(235 - 210 * intensity)},${Math.round(240 - 110 * intensity)},${Math.round(252 - 40 * intensity)}), rgb(${Math.round(180 - 160 * intensity)},${Math.round(210 - 80 * intensity)},${Math.round(250 - 20 * intensity)}))`
                      return (
                        <div
                          key={`${wd.label}-${bi}`}
                          className="flex-1 rounded-lg cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-md flex items-center justify-center"
                          style={{
                            height: 30,
                            background: meshBg,
                          }}
                          title={`${wd.label} · ${block.label}: ${value} asistencias`}
                        >
                          <span style={{ fontSize: 11, fontWeight: 800, color: isToday ? '#0D5C2F' : '#1B3A6B' }}>
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
          </div>
        </motion.div>
      </div>
    </div>
  )
}
