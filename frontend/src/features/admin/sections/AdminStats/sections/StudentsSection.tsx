import { TrendingUp, Users, Activity, Briefcase } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer, LabelList } from 'recharts'
import KpiCard from '../components/KpiCard'
import ChartCard from '../components/ChartCard'
import { BLUE, CARGOS, mesCorto, SEXOS, SEXO_COLORS } from '../data'
import type { EstadisticasDTO } from '@/services/estadisticas.service'

export default function StudentsSection({ stats, loading }: {
  stats: EstadisticasDTO | null
  loading: boolean
}) {
  const usuarios = stats?.usuarios
  const total = usuarios?.total ?? 0

  const usersSeries = (stats?.usuarios_por_mes ?? []).map(m => ({ mes: mesCorto(m.fecha), usuarios: m.acumulado }))
  const sexData = (stats?.usuarios_por_sexo ?? []).map(s => ({ name: SEXOS[s.genero], value: s.total, color: SEXO_COLORS[SEXOS[s.genero]] })).filter(s => s.value > 0)
  const activityData = [
    { name: 'Activos', value: usuarios?.activos ?? 0, color: '#30D158' },
    { name: 'Inactivos', value: usuarios?.inactivos ?? 0, color: '#F43843' },
  ].filter(d => d.value > 0)
  const cargoData = (stats?.usuarios_por_tipo ?? [])
    .map(t => ({ cargo: CARGOS[t.tipo] ?? t.tipo, cantidad: t.total }))
    .filter(c => c.cantidad > 0)

  const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0)
  const pctSex = (name: string) => {
    const entry = sexData.find(s => s.name === name)
    return `${name} ${pct(entry?.value ?? 0)}%`
  }

  const cards = [
    { label: 'Total Usuarios', value: usuarios ? String(usuarios.total) : '—', sub: 'Registrados en el sistema', color: BLUE },
    { label: 'Usuarios Activos', value: usuarios ? String(usuarios.activos) : '—', sub: 'Con estado activo', color: '#30D158' },
    { label: 'Usuarios Inactivos', value: usuarios ? String(usuarios.inactivos) : '—', sub: 'Con estado inactivo', color: '#F43843' },
  ]

  const tooltipStyle = { borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }
  const tick = { fontSize: 11, fill: '#1A1A1E', fontWeight: 600 }
  const empty = (text: string) => (
    <div className="flex items-center justify-center" style={{ height: 280 }}>
      <span className="text-xs font-semibold" style={{ color: 'rgba(0,0,0,0.3)' }}>{text}</span>
    </div>
  )

  const leyenda = (items: { name: string; value: number; color: string }[]) => (
    <div className="flex justify-center gap-6 mt-2 flex-wrap">
      {items.map(s => (
        <div key={s.name} className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ background: s.color }} />
          <span className="text-[10px] font-medium" style={{ color: 'rgba(0,0,0,0.5)' }}>{pctSex(s.name)}</span>
        </div>
      ))}
    </div>
  )

  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {cards.map((card, i) => (
          <KpiCard key={card.label} label={card.label} value={card.value} sub={card.sub} color={card.color} index={i} labelClass="text-xs mt-1 font-bold truncate" />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8">
        <ChartCard icon={Users} title="DISTRIBUCIÓN POR SEXO" delay={0.25}>
          {loading ? empty('Cargando…') : sexData.length === 0 ? empty('Sin datos de sexo') : (
            <>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={sexData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" stroke="#FFFFFF" strokeWidth={2}>
                    {sexData.map(s => <Cell key={s.name} fill={s.color} />)}
                  </Pie>
                  <ReTooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              {leyenda(sexData)}
            </>
          )}
        </ChartCard>

        <ChartCard icon={Activity} title="ACTIVOS VS INACTIVOS" delay={0.3}>
          {loading ? empty('Cargando…') : activityData.filter(d => d.value > 0).length === 0 ? empty('Sin usuarios con estado') : (
            <>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={activityData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" stroke="#FFFFFF" strokeWidth={2}>
                    {activityData.map(d => <Cell key={d.name} fill={d.color} />)}
                  </Pie>
                  <ReTooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: '#30D158' }} />
                  <span className="text-[10px] font-medium" style={{ color: 'rgba(0,0,0,0.5)' }}>Activos {pct(usuarios?.activos ?? 0)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: '#F43843' }} />
                  <span className="text-[10px] font-medium" style={{ color: 'rgba(0,0,0,0.5)' }}>Inactivos {pct(usuarios?.inactivos ?? 0)}%</span>
                </div>
              </div>
            </>
          )}
        </ChartCard>

        <ChartCard icon={TrendingUp} title="EVOLUCIÓN DE USUARIOS" delay={0.35}>
          {loading ? empty('Cargando…') : usersSeries.length === 0 ? empty('Aún no hay usuarios registrados') : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={usersSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="mes" tick={tick} axisLine={false} tickLine={false} />
                <YAxis tick={tick} axisLine={false} tickLine={false} width={30} />
                <ReTooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="usuarios" stroke={BLUE} fill="url(#evoGrad)" strokeWidth={2.5} />
                <defs>
                  <linearGradient id="evoGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={BLUE} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={BLUE} stopOpacity={0} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard icon={Briefcase} title="DISTRIBUCIÓN POR CARGO UNIVERSITARIO" delay={0.4}>
          {loading ? empty('Cargando…') : cargoData.length === 0 ? empty('Sin datos de cargo universitario') : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={cargoData} margin={{ left: 0, right: 16, top: 0, bottom: 0 }} barCategoryGap="18%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="cargo" tick={tick} axisLine={false} tickLine={false} />
                <YAxis tick={tick} axisLine={false} tickLine={false} width={30} />
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
          )}
        </ChartCard>
      </div>
    </>
  )
}