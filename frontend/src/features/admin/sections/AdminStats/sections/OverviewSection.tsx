import { TrendingUp, Activity } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer, LabelList } from 'recharts'
import KpiCard from '../components/KpiCard'
import ChartCard from '../components/ChartCard'
import { BLUE, mapCarrera, mesCorto } from '../data'
import type { EstadisticasDTO } from '@/services/estadisticas.service'

export default function OverviewSection({ stats, loading }: {
  stats: EstadisticasDTO | null
  loading: boolean
}) {
  const carreras = (stats?.carreras ?? []).map(mapCarrera)
  const topRegistered = [...carreras].sort((a, b) => b.registrados - a.registrados)[0]

  const usersSeries = (stats?.usuarios_por_mes ?? []).map(m => ({ mes: mesCorto(m.fecha), usuarios: m.acumulado }))
  const asistSeries = (stats?.asistencias.por_mes ?? []).map(m => ({ mes: mesCorto(m.fecha), asistencia: m.total }))

  const cards = [
    { label: 'Total Usuarios', value: stats ? String(stats.usuarios.total) : '—', sub: 'Registrados en el sistema', color: BLUE },
    { label: 'Asistencias', value: stats ? String(stats.asistencias.periodo) : '—', sub: 'Asistencias del período', color: '#30D158' },
    { label: 'Carreras Más Registradas', value: topRegistered?.programa ?? (loading ? '—' : 'Sin registros'), sub: topRegistered ? `${topRegistered.registrados} registrados` : '', color: '#BF5AF2' },
  ]

  const empty = (text: string) => (
    <div className="flex items-center justify-center" style={{ height: 280 }}>
      <span className="text-xs font-semibold" style={{ color: 'rgba(0,0,0,0.3)' }}>{text}</span>
    </div>
  )

  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {cards.map((card, i) => (
          <KpiCard key={card.label} label={card.label} value={card.value} sub={card.sub} color={card.color} index={i} />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ChartCard icon={TrendingUp} title="EVOLUCIÓN DE USUARIOS A TRAVÉS DEL TIEMPO" delay={0.25}>
          {loading ? empty('Cargando…') : usersSeries.length === 0 ? empty('Aún no hay usuarios registrados') : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={usersSeries} margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
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
          )}
        </ChartCard>

        <ChartCard icon={Activity} title="EVOLUCIÓN DE ASISTENCIA A TRAVÉS DEL TIEMPO" delay={0.3}>
          {loading ? empty('Cargando…') : asistSeries.length === 0 ? empty('Aún no hay asistencias en el período') : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={asistSeries} margin={{ left: 0, right: 16, top: 0, bottom: 0 }} barCategoryGap="26%">
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
          )}
        </ChartCard>
      </div>
    </>
  )
}