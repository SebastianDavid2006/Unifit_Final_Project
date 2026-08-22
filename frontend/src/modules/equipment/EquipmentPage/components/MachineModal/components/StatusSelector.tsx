import { motion } from 'motion/react'
import { statusConfig } from '@/data/shared/constants'

interface StatusSelectorProps {
  value: 'active' | 'maintenance' | 'inactive'
  onChange: (status: 'active' | 'maintenance' | 'inactive') => void
}

export function StatusSelector({ value, onChange }: StatusSelectorProps) {
  return (
    <div>
      <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.6)' }}>Estado</label>
      <div className="flex gap-2">
        {(['active', 'maintenance', 'inactive'] as const).map(s => {
          const sel = value === s
          const c = statusConfig[s].color
          const grad = `linear-gradient(135deg, ${c}, ${c}cc)`
          return (
            <motion.button
              key={s}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onChange(s)}
              onMouseEnter={e => { if (!sel) { e.currentTarget.style.background = `${c}18`; e.currentTarget.style.color = c } }}
              onMouseLeave={e => { if (!sel) { e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; e.currentTarget.style.color = 'rgba(0,0,0,0.25)' } }}
              className="flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all duration-200"
              style={{
                background: sel ? grad : 'rgba(0,0,0,0.03)',
                color: sel ? '#FFFFFF' : 'rgba(0,0,0,0.25)',
                border: '1px solid transparent',
                boxShadow: sel ? `0 4px 16px ${c}40` : 'none',
              }}
            >
              {statusConfig[s].label}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
