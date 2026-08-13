import { motion, AnimatePresence } from 'motion/react'
import { Menu } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'

export interface FilterOption {
  id: string
  label: string
  color: string
  icon?: ReactNode
}

interface FilterDropdownProps {
  open: boolean
  onToggle: () => void
  options: FilterOption[]
  value: string
  onSelect: (id: string) => void
  buttonStyle?: CSSProperties
}

export default function FilterDropdown({ open, onToggle, options, value, onSelect, buttonStyle }: FilterDropdownProps) {
  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onToggle}
        className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
        style={{
          background: open ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(24px) saturate(1.6)',
          border: open ? '1px solid rgba(255,255,255,0.6)' : '1px solid rgba(255,255,255,0.25)',
          boxShadow: open ? '0 4px 24px rgba(0,0,0,0.08)' : '0 4px 16px rgba(0,0,0,0.03)',
          color: open ? '#1A1A1E' : 'rgba(0,0,0,0.3)',
          ...buttonStyle,
        }}
      >
        <Menu size={18} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.93, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -6, scale: 0.93, filter: 'blur(6px)' }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 flex gap-1.5 p-2 rounded-xl"
            style={{
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(24px) saturate(1.6)',
              border: '1px solid rgba(255,255,255,0.5)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            }}
          >
            {options.map(o => {
              const active = value === o.id
              return (
                <motion.button
                  key={o.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onSelect(o.id)}
                  className="px-3 py-1.5 rounded-xl text-[11px] font-bold tracking-wide whitespace-nowrap transition-all flex items-center gap-1.5"
                  style={{
                    background: active ? `${o.color}15` : 'transparent',
                    color: active ? o.color : 'rgba(0,0,0,0.3)',
                    border: `1px solid ${active ? `${o.color}30` : 'transparent'}`,
                  }}
                >
                  {o.icon}
                  {o.label}
                </motion.button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
