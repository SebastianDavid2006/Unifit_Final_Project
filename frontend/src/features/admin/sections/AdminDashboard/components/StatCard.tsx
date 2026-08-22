import { motion } from 'motion/react'
import type { DashboardCard } from '../data'

export default function StatCard({ card, colors, index, isActive }: {
  card: DashboardCard
  colors: { bg: string; icon: string; text: string }
  index: number
  isActive: boolean
}) {
  const ModelView = card.view
  return (
    <motion.div
      key={card.label}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.06, ease: [0.16, 1, 0.3, 1] }}
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
}
