import { motion } from 'motion/react'
import { LEVEL_HEX } from '@/modules/equipment/data'

type Level = 'principiante' | 'intermedio' | 'avanzado'

interface LevelSelectorProps {
  value: string
  onChange: (level: Level) => void
}

export function LevelSelector({ value, onChange }: LevelSelectorProps) {
  return (
    <div className="flex gap-2">
      {(['principiante', 'intermedio', 'avanzado'] as const).map(level => {
        const lvlHex = LEVEL_HEX[level]
        const selected = value === level
        const selectedBg = `linear-gradient(135deg, ${lvlHex}, ${lvlHex}cc)`
        const defaultBg = 'rgba(0,0,0,0.03)'
        const hoverBg = `${lvlHex}1a`
        return (
          <motion.button
            key={level}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(level)}
            onMouseEnter={e => { if (!selected) { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = lvlHex } }}
            onMouseLeave={e => { if (!selected) { e.currentTarget.style.background = defaultBg; e.currentTarget.style.color = 'rgba(0,0,0,0.25)' } }}
            className="flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all duration-200"
            style={{
              background: selected ? selectedBg : defaultBg,
              color: selected ? '#FFFFFF' : 'rgba(0,0,0,0.25)',
              border: '1px solid transparent',
              boxShadow: selected ? `0 4px 16px ${lvlHex}4d` : 'none',
            }}
          >
            {level}
          </motion.button>
        )
      })}
    </div>
  )
}
