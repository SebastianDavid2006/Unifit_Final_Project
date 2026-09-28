import HeroBanner from './components/HeroBanner'
import StatCard from '@/features/shared/dashboard/StatCard'
import TopCareersChart from '@/features/shared/dashboard/TopCareersChart'
import { useDashboardStats } from '@/features/shared/dashboard/useDashboardStats'
import { CARD_COLORS } from '@/services/estadisticas.service'

export default function AdminDashboard() {
  const { stats, loading } = useDashboardStats()

  return (
    <div className="p-8 pt-12 space-y-6 max-w-[1440px] mx-auto relative">
      <style>{`.no-clip-chart .recharts-wrapper svg { overflow: visible !important; } .no-clip-chart .recharts-wrapper svg clipPath { clip-path: none !important; } .bar-hover rect { transition: opacity 0.2s, filter 0.2s; } .bar-hover:hover rect { opacity: 0.75; filter: brightness(1.15); }`}</style>

      <HeroBanner />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard label="Usuarios Registrados" value={stats ? String(stats.usuarios.total) : '—'} color={CARD_COLORS[0]} index={0} />
        <StatCard label="Citas Programadas" value={stats ? String(stats.citas.programadas) : '—'} color={CARD_COLORS[1]} index={1} />
      </div>

      <TopCareersChart carreras={stats?.carreras ?? []} loading={loading} />
    </div>
  )
}