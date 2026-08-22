import { motion } from 'motion/react'

export default function PillButton({ active, activeBackground, boxShadow, inactiveColor = 'rgba(0,0,0,0.35)', className, children, onClick }: {
  active: boolean
  activeBackground: string
  boxShadow: string
  inactiveColor?: string
  className: string
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={className}
      style={{
        background: active ? activeBackground : 'transparent',
        color: active ? '#FFFFFF' : inactiveColor,
        boxShadow: active ? boxShadow : 'none',
      }}
    >
      {children}
    </motion.button>
  )
}
