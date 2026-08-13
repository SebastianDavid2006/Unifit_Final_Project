import { TrendingUp, Activity } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer, LabelList } from 'recharts'
import { StudentsView } from '@/assets/models/ui/users/students/StudentsModel'
import { StudentCardView } from '@/assets/models/ui/objects/student_card/StudentCardModel'
import { CalendarView } from '@/assets/models/ui/objects/calendar/CalendarModel'
import { ListView } from '@/assets/models/ui/objects/list/ListModel'
import KpiCard from '../components/KpiCard'
import ChartCard from '../components/ChartCard'
import { BLUE, emptyCareer, type CareerStat, type EvolutionPoint } from '../data'

export default function OverviewSection({ careerData, filteredEvolution }: {
  careerData: CareerStat[]
  filteredEvolution: EvolutionPoint[]
}) {
  const lastUsuarios = filteredEvolution[filteredEvolution.length - 1]?.usuarios ?? 847
  const asistenciasPeriodo = filteredEvolution.reduce((s, m) => s + m.asistencia, 0)
  const totalCareers = careerData.length
  const topRegistered = [...careerData].sort((a, b) => b.registered - a.registered)[0] ?? emptyCareer
  const topAttendance = [...careerData].sort((a, b) => b.attendance - a.attendance)[0] ?? emptyCareer
  const lowestAttendance = [...careerData].sort((a, b) => a.attendance - b.attendance)[0] ?? emptyCareer

  const cards = [
    { label: 'Total Usuarios', value: String(lastUsuarios), sub: 'Registrados en el sistema', color: '#1270B7', view: StudentsView },
    { label: 'Asistencias del Período', value: asistenciasPeriodo.toLocaleString('en-US'), sub: 'Asistencias acumuladas', color: '#30D158', view: StudentCardView },
    { label: 'Carrera con Más Estudiantes', value: topRegistered.faculty, sub: `${topRegistered.registered} registrados`, color: '#BF5AF2', view: CalendarView },
    { label: 'Carreras Activas', value: String(totalCareers), sub: 'Facultades en el programa', color: '#FF9F0A', view: ListView },
  ]

  return (
    <>
      <div className="grid grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => (
          <KpiCard key={card.label} label={card.label} value={card.value} sub={card.sub} color={card.color} view={card.view} index={i} />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ChartCard icon={TrendingUp} title="EVOLUCIÓN DE USUARIOS A TRAVÉS DEL TIEMPO" delay={0.25}>
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
        </ChartCard>

        <ChartCard icon={Activity} title="EVOLUCIÓN DE ASISTENCIA A TRAVÉS DEL TIEMPO" delay={0.3}>
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
        </ChartCard>
      </div>
    </>
  )
}
