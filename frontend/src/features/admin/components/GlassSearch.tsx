import { motion } from 'motion/react'
import { Search } from 'lucide-react'

interface GlassSearchProps {
  value: string
  onChange: (v: string) => void
  focused: boolean
  onFocusChange: (f: boolean) => void
  placeholder?: string
}

export default function GlassSearch({ value, onChange, focused, onFocusChange, placeholder }: GlassSearchProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0, scaleX: focused ? 1.04 : 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="flex items-center gap-3 px-4 py-2 rounded-2xl flex-1 min-w-0"
      style={{
        background: focused ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.12)',
        backdropFilter: 'blur(24px) saturate(1.6)',
        border: focused ? '1px solid rgba(255,255,255,0.5)' : '1px solid rgba(255,255,255,0.25)',
        boxShadow: focused ? '0 4px 24px rgba(0,0,0,0.06)' : '0 4px 16px rgba(0,0,0,0.03)',
        transformOrigin: 'center',
      }}
    >
      <Search size={16} style={{ color: focused ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.3)' }} />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => onFocusChange(true)}
        onBlur={() => onFocusChange(false)}
        placeholder={placeholder}
        className="bg-transparent border-none outline-none text-sm w-full placeholder:text-black/20 text-[#1A1A1E] font-medium"
      />
    </motion.div>
  )
}
