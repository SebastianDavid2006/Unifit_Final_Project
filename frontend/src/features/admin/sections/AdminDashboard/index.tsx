import HeroBanner from './components/HeroBanner'
import StatCard from './components/StatCard'
import WeeklyAttendanceChart from './sections/WeeklyAttendanceChart'
import TopCareersChart from './sections/TopCareersChart'
import { CARD_COLORS, dashboardCards } from './data'

export default function AdminDashboard() {
  return (
    <div className="p-8 pt-12 space-y-6 max-w-[1440px] mx-auto relative">
      <style>{`.no-clip-chart .recharts-wrapper svg { overflow: visible !important; } .no-clip-chart .recharts-wrapper svg clipPath { clip-path: none !important; } .bar-hover rect { transition: opacity 0.2s, filter 0.2s; } .bar-hover:hover rect { opacity: 0.75; filter: brightness(1.15); } @keyframes card-shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } } .shimmer-card { position: relative; overflow: hidden; } .shimmer-card::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%); animation: card-shimmer 4s ease-in-out infinite; pointer-events: none; }`}</style>

      <HeroBanner />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardCards.map((card, i) => (
          <StatCard key={card.label} card={card} colors={CARD_COLORS[i]} index={i} isActive={i === 2} />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <WeeklyAttendanceChart />
        <TopCareersChart />
      </div>
    </div>
  )
}
