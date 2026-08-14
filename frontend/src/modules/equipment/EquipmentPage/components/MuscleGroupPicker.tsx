import { motion } from 'motion/react'
import { BLUE, BLUE_GRAD, muscleIcons, BODY_GROUPS } from '@/data/constants'
import { GOLD_GRAD, QUICK_GROUPS } from '@/modules/equipment/data'

interface MuscleGroupPickerProps {
  value: string[]
  onChange: (groups: string[]) => void
}

export function MuscleGroupPicker({ value, onChange }: MuscleGroupPickerProps) {
  if (BODY_GROUPS.some(g => value.includes(g))) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {BODY_GROUPS.map(label => {
          const selected = value.includes(label)
          const isGeneral = label === 'General'
          const defaultBg = 'rgba(0,0,0,0.03)'
          const hoverBg = isGeneral ? 'rgba(241,200,39,0.12)' : `${BLUE}12`
          const selectedBg = isGeneral ? GOLD_GRAD : BLUE_GRAD
          const textColor = selected ? '#FFFFFF' : 'rgba(0,0,0,0.35)'
          const shadow = isGeneral
            ? '0 4px 20px rgba(241,200,39,0.25)'
            : `0 4px 20px ${BLUE}40`
          return (
            <motion.button
              key={label}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onChange(selected ? [] : [label])}
              onMouseEnter={e => { if (!selected) { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = isGeneral ? '#B8860B' : BLUE } }}
              onMouseLeave={e => { if (!selected) { e.currentTarget.style.background = defaultBg; e.currentTarget.style.color = 'rgba(0,0,0,0.35)' } }}
              className="flex flex-col items-center gap-1.5 px-3 py-3.5 rounded-xl text-xs font-bold transition-all duration-200"
              style={{
                background: selected ? selectedBg : defaultBg,
                color: textColor,
                border: '1px solid transparent',
                boxShadow: selected ? shadow : 'none',
              }}
            >
              <motion.img
                src={muscleIcons[label]}
                alt=""
                className="mb-0.5"
                animate={{
                  width: selected ? 48 : 24,
                  height: selected ? 48 : 24,
                  marginTop: selected ? -24 : 0,
                  filter: selected ? 'blur(0px) drop-shadow(0 8px 20px rgba(0,0,0,0.15))' : 'blur(0px)',
                  opacity: 1,
                }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              />
              <span>{label}</span>
            </motion.button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-4 gap-2">
      {QUICK_GROUPS.map(label => {
        const selected = value.includes(label)
        const isGeneral = label === 'General'
        const defaultBg = 'rgba(0,0,0,0.03)'
        const generalSelected = value.includes('General')
        const disabled = generalSelected && !isGeneral
        const hoverBg = isGeneral ? 'rgba(241,200,39,0.12)' : `${BLUE}12`
        const selectedBg = isGeneral ? GOLD_GRAD : BLUE_GRAD
        const textColor = selected ? '#FFFFFF' : disabled ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.35)'
        const shadow = isGeneral
          ? '0 4px 20px rgba(241,200,39,0.25)'
          : `0 4px 20px ${BLUE}40`
        return (
          <motion.button
            key={label}
            whileHover={!disabled ? { scale: 1.06 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
            onClick={() => {
              if (disabled) return
              if (isGeneral) {
                onChange(selected ? [] : ['General'])
              } else if (generalSelected) {
                onChange(value.includes(label)
                  ? value.filter(g => g !== 'General')
                  : [...value.filter(g => g !== 'General'), label])
              } else {
                onChange(value.includes(label)
                  ? value.filter(g => g !== label)
                  : [...value, label])
              }
            }}
            onMouseEnter={e => { if (!selected && !disabled) { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = isGeneral ? '#B8860B' : BLUE } }}
            onMouseLeave={e => { if (!selected && !disabled) { e.currentTarget.style.background = defaultBg; e.currentTarget.style.color = 'rgba(0,0,0,0.35)' } }}
            className="flex flex-col items-center gap-1.5 px-3 py-3.5 rounded-xl text-xs font-bold transition-all duration-200"
            style={{
              background: selected ? selectedBg : defaultBg,
              color: textColor,
              border: '1px solid transparent',
              boxShadow: selected ? shadow : 'none',
              opacity: disabled ? 0.4 : 1,
              filter: disabled ? 'blur(0.6px)' : 'none',
              pointerEvents: disabled ? 'none' : 'auto',
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
          >
            <motion.img
              src={muscleIcons[label]}
              alt=""
              className="mb-0.5"
              animate={{
                width: selected ? 48 : 24,
                height: selected ? 48 : 24,
                marginTop: selected ? -24 : 0,
                filter: selected ? 'blur(0px) drop-shadow(0 8px 20px rgba(0,0,0,0.15))' : disabled ? 'grayscale(0.6) blur(0px)' : 'blur(0px)',
                opacity: disabled ? 0.3 : 1,
              }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            />
            <span>{label}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
