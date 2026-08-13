import type { Status } from '@/data/types'
import { statusConfig } from '@/data/constants'

export function StatusBadge({ status }: { status: Status }) {
  const cfg = statusConfig[status]
  return (
    <span
      className="px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide whitespace-nowrap"
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
    >
      {cfg.label}
    </span>
  )
}
