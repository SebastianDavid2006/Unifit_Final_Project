import { TrendingUp, Users, Activity, Building2 } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer, LabelList } from 'recharts'
import { StudentsView } from '@/assets/models/ui/users/students/StudentsModel'
import { StudentCardView } from '@/assets/models/ui/objects/student_card/StudentCardModel'
import { CalendarView } from '@/assets/models/ui/objects/calendar/CalendarModel'
import { ListView } from '@/assets/models/ui/objects/list/ListModel'
import KpiCard from '../components/KpiCard'
import ChartCard from '../components/ChartCard'
import { BLUE } from '../data'

const studentData = [
  { mes: 'Ene', estudiantes: 520 }, { mes: 'Feb', estudiantes: 580 },
  { mes: 'Mar', estudiantes: 610 }, { mes: 'Abr', estudiantes: 680 },
  { mes: 'May', estudiantes: 740 }, { mes: 'Jun', estudiantes: 847 },
]

const sexData = [
  { name: 'Masculino', value: 491, color: '#1270B7' },
  { name: 'Femenino', value: 356, color: '#FF6B8A' },
]

const activityData = [
  { name: 'Activos', value: 623, color: '#30D158' },
  { name: 'Inactivos', value: 224, color: '#F43843' },
]

const cargoData = [
  { cargo: 'Estudiante', cantidad: 720 },
  { cargo: 'Egresado', cantidad: 85 },
  { cargo: 'Docente', cantidad: 25 },
  { cargo: 'Administrativo', cantidad: 17 },
]

const areaData = [
  { area: 'Ingeniería', cantidad: 212 },
  { area: 'Cs. Salud', cantidad: 169 },
  { area: 'Cs. Sociales', cantidad: 152 },
  { area: 'Arte', cantidad: 127 },
  { area: 'Administración', cantidad: 102 },
  { area: 'Otras', cantidad: 85 },
]

export default function StudentsSection() {
  const cards = [
    { label: 'Total Estudiantes', value: '847', sub: 'Registrados en el sistema', color: '#1270B7', view: StudentsView },
    { label: 'Estudiantes Activos', value: '623', sub: 'Con asistencia este mes', color: '#30D158', view: StudentCardView },
    { label: 'Estudiantes Inactivos', value: '224', sub: 'Sin actividad reciente', color: '#F43843', view: ListView },
    { label: 'Asistencias Totales', value: '2,847', sub: 'Acumuladas del período', color: '#BF5AF2', view: CalendarView },
  ]

  const tooltipStyle = { borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }
  const tick = { fontSize: 11, fill: '#1A1A1E', fontWeight: 600 }

  return (
    <>
      <div className="grid grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => (
          <KpiCard key={card.label} label={card.label} value={card.value} sub={card.sub} color={card.color} view={card.view} index={i} labelClass="text-xs mt-1 font-bold truncate" />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <ChartCard icon={TrendingUp} title="EVOLUCIÓN DE ESTUDIANTES" delay={0.25}>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={studentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="mes" tick={tick} axisLine={false} tickLine={false} />
              <YAxis tick={tick} axisLine={false} tickLine={false} />
              <ReTooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="estudiantes" stroke={BLUE} fill="url(#evoGrad)" strokeWidth={2.5} />
              <defs>
                <linearGradient id="evoGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={BLUE} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={BLUE} stopOpacity={0} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard icon={Users} title="DISTRIBUCIÓN POR SEXO" delay={0.3}>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={sexData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={4}>
                <Cell fill="#1270B7" />
                <Cell fill="#FF6B8A" />
              </Pie>
              <ReTooltip contentStyle={tooltipStyle} />
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
        </ChartCard>

        <ChartCard icon={Activity} title="ACTIVOS VS INACTIVOS" delay={0.35}>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={activityData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={4}>
                <Cell fill="#30D158" />
                <Cell fill="#F43843" />
              </Pie>
              <ReTooltip contentStyle={tooltipStyle} />
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
        </ChartCard>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ChartCard icon={Users} title="DISTRIBUCIÓN POR CARGO" delay={0.4}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={cargoData} margin={{ left: 0, right: 16, top: 0, bottom: 0 }} barCategoryGap="18%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="cargo" tick={tick} axisLine={false} tickLine={false} />
              <YAxis tick={tick} axisLine={false} tickLine={false} />
              <ReTooltip contentStyle={tooltipStyle} />
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
        </ChartCard>

        <ChartCard icon={Building2} title="DISTRIBUCIÓN POR ÁREA" delay={0.45}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={areaData} margin={{ left: 0, right: 16, top: 0, bottom: 0 }} barCategoryGap="18%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="area" tick={tick} axisLine={false} tickLine={false} />
              <YAxis tick={tick} axisLine={false} tickLine={false} />
              <ReTooltip contentStyle={tooltipStyle} />
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
        </ChartCard>
      </div>
    </>
  )
}
