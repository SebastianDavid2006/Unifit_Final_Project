import type { ComponentType } from 'react'
import { motion } from 'motion/react'

export default function KpiCard({ label, value, sub, color, view: ModelView, index, labelClass = 'text-[11px] mt-1 font-bold truncate' }: {
  label: string
  value: string
  sub: string
  color: string
  view: ComponentType
  index: number
  labelClass?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-2xl p-4 group cursor-pointer transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        background: '#FFFFFF',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
      }}
    >
      <div className="flex items-center gap-4">
        <div
          className="w-14 h-14 flex-shrink-0 z-20 pointer-events-none transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
        >
          <ModelView />
        </div>
        <div className="relative z-10 min-w-0">
          <span className="stat-value block transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ fontSize: '1.15rem', fontWeight: 800, lineHeight: 1.2, color }}>{value}</span>
          <p className={labelClass} style={{ color: '#1A1A1E' }}>{label}</p>
          <p className="text-[11px] mt-1 font-semibold truncate" style={{ color: 'rgba(0,0,0,0.65)' }}>{sub}</p>
        </div>
      </div>
    </motion.div>
  )
}
