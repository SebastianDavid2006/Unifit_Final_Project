import { motion } from 'motion/react'
import type { CSSProperties, ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  delay?: number
}

export default function GlassCard({ children, className = '', style, delay = 0.25 }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`rounded-2xl p-6 premium-card shimmer-card ${className}`}
      style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(24px) saturate(1.6)', border: '1px solid rgba(255,255,255,0.6)', ...style }}
    >
      {children}
    </motion.div>
  )
}
