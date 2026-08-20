import HeroBanner from './components/HeroBanner'
import StatCard from './components/StatCard'
import WeeklyAttendanceChart from './sections/WeeklyAttendanceChart'
import TopCareersChart from './sections/TopCareersChart'
import { CARD_COLORS, dashboardCards } from './data'

export default function TrainerDashboard() {
  return (
    <div className="p-8 pt-12 space-y-6 max-w-[1440px] mx-auto relative">
      <style>{`
        .gradient-border {
          border: 1.5px solid rgba(255,255,255,0.75);
        }
        .bar-hover rect {
          transition: opacity 0.2s;
        }
        .no-clip-chart .recharts-surface {
          overflow: visible;
        }
        .shimmer-card {
          position: relative;
          overflow: hidden;
        }
        .shimmer-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%);
          background-size: 200% 100%;
          animation: shimmer-sweep 3.5s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes shimmer-sweep {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes mesh-shift {
          0%, 100% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
        }
      `}</style>
      <HeroBanner />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardCards.map((card, i) => (
          <StatCard key={card.label} card={card} colors={CARD_COLORS[i % CARD_COLORS.length]} index={i} isActive={card.label === 'Asistencias de Hoy'} />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <WeeklyAttendanceChart />
        <TopCareersChart />
      </div>
    </div>
  )
}
