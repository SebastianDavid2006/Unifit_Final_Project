import { motion } from 'motion/react'

interface ValuationStatProps {
  label: string
  value: string
  color?: string
}

export function ValuationStat({ label, value, color }: ValuationStatProps) {
  return (
    <div className="rounded-xl p-3 flex items-center justify-between gap-2" style={{ background: 'rgba(0,0,0,0.02)' }}>
      <span className="text-[11px] font-medium" style={{ color: 'rgba(0,0,0,0.4)' }}>{label}</span>
      <span className="text-sm font-bold text-right" style={{ color: color ?? '#0D1B2A' }}>{value}</span>
    </div>
  )
}