import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import type { LucideIcon } from 'lucide-react'
import { BLUE } from '../data'

export default function ChartCard({ icon: Icon, title, delay, children }: {
  icon: LucideIcon
  title: string
  delay: number
  children: ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.01 }}
      className="rounded-2xl p-6 premium-card"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${BLUE}10` }}>
          <Icon size={14} style={{ color: BLUE }} />
        </div>
        <span className="text-xs font-bold tracking-wide" style={{ color: '#1A1A1E' }}>{title}</span>
      </div>
      {children}
    </motion.div>
  )
}
