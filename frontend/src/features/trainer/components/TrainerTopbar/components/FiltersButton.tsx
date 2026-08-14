import { motion } from 'motion/react'
import { Menu } from 'lucide-react'

export default function FiltersButton({ active, onClick, offset }: {
  active: boolean
  onClick?: () => void
  offset: boolean
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
      style={{
        marginLeft: offset ? 6 : 0,
        background: active ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(24px) saturate(1.6)',
        border: active ? '1px solid rgba(255,255,255,0.6)' : '1px solid rgba(255,255,255,0.25)',
        boxShadow: active ? '0 4px 24px rgba(0,0,0,0.08)' : '0 4px 16px rgba(0,0,0,0.03)',
        color: active ? '#1A1A1E' : 'rgba(0,0,0,0.3)',
      }}
    >
      <Menu size={18} />
    </motion.button>
  )
}
