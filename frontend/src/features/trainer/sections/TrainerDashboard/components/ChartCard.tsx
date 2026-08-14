import type { ReactNode } from 'react'
import { motion } from 'motion/react'

export default function ChartCard({ delay, children }: {
  delay: number
  children: ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-2xl p-6 premium-card shimmer-card"
      style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(24px) saturate(1.6)', border: '1px solid rgba(255,255,255,0.6)' }}
    >
      {children}
    </motion.div>
  )
}
