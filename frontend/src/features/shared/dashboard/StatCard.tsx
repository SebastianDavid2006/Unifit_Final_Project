import { motion } from 'motion/react'

export default function StatCard({ label, value, color, index }: {
  label: string
  value: string
  color: string
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-2xl px-5 pb-5 pt-9 overflow-hidden"
      style={{ background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)' }}
    >
      <div className="absolute top-0 left-4 right-4 h-[3px] rounded-full" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
      <div className="relative z-10 text-center">
        <span className="stat-value text-gradient-warm block" style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1 }}>{value}</span>
        <p className="text-xs mt-2 font-semibold" style={{ color: 'rgba(0,0,0,0.45)' }}>{label}</p>
      </div>
    </motion.div>
  )
}