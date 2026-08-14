import { motion } from 'motion/react'
import PillButton from './PillButton'

const EQUIP_GRAD = 'radial-gradient(ellipse at 30% 25%, #3A9BDC 0%, transparent 60%), radial-gradient(ellipse at 75% 70%, #1270B7 0%, transparent 55%), radial-gradient(ellipse at 90% 25%, rgba(244,56,67,0.5) 0%, transparent 45%), radial-gradient(ellipse at 10% 85%, rgba(241,200,39,0.45) 0%, transparent 45%), #1270B7'
const EQUIP_SHADOW = '0 2px 8px rgba(18,112,183,0.25)'

interface Props {
  search: string
  onSearchChange: (v: string) => void
  focused: boolean
  onFocusChange: (v: boolean) => void
  hovered: boolean
  onHoveredChange: (v: boolean) => void
  viewMode: 'machines' | 'exercises'
  onViewModeChange: (v: 'machines' | 'exercises') => void
}

export default function EquipmentSearch(props: Props) {
  const { search, onSearchChange, focused, onFocusChange, hovered, onHoveredChange, viewMode, onViewModeChange } = props
  const expanded = focused || search || hovered
  return (
    <div className="flex-1 flex items-center justify-center gap-3 relative">
      <div className="relative flex-shrink-0" style={{ width: 36, height: 36 }}>
        <div
          className="absolute top-0 h-full overflow-hidden"
          style={{
            right: 0,
            width: expanded ? 356 : 36,
            borderRadius: '9999px',
            background: focused || search ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(24px) saturate(1.6)',
            border: focused || search ? '1px solid rgba(255,255,255,0.5)' : '1px solid rgba(255,255,255,0.25)',
            boxShadow: focused || search ? '0 4px 24px rgba(0,0,0,0.06)' : '0 4px 16px rgba(0,0,0,0.03)',
            transition: 'width 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onMouseEnter={() => onHoveredChange(true)}
          onMouseLeave={() => onHoveredChange(false)}
        >
          <div className="flex items-center h-full">
            <input
              value={search}
              onChange={e => onSearchChange(e.target.value)}
              onFocus={() => onFocusChange(true)}
              onBlur={() => onFocusChange(false)}
              placeholder="Buscar máquina o ejercicio..."
              className="bg-transparent border-none outline-none text-sm placeholder:text-black/20 text-[#1A1A1E] font-medium"
              style={{
                flex: expanded ? '1' : '0',
                opacity: expanded ? 1 : 0,
                minWidth: 0,
                paddingRight: expanded ? '8px' : '0',
                paddingLeft: expanded ? '12px' : '0',
                transition: 'opacity 0.25s ease 0.1s, flex 0s 0.35s, padding 0s 0.35s',
              }}
            />
            <div className="flex-shrink-0" style={{ width: 36, height: 36 }} />
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: focused || search ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.3)', display: 'block' }}>
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </motion.div>
        </div>
      </div>

      <div
        className="flex items-center rounded-xl gap-0.5 px-1"
        style={{
          height: 36,
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(24px) saturate(1.6)',
          border: '1px solid rgba(255,255,255,0.25)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
        }}
      >
        <PillButton
          active={viewMode === 'machines'}
          activeBackground={EQUIP_GRAD}
          boxShadow={EQUIP_SHADOW}
          className="px-4 py-1.5 text-[11px] font-bold cursor-pointer rounded-lg transition-all duration-200"
          onClick={() => onViewModeChange('machines')}
        >
          Máquinas
        </PillButton>
        <PillButton
          active={viewMode === 'exercises'}
          activeBackground={EQUIP_GRAD}
          boxShadow={EQUIP_SHADOW}
          className="px-4 py-1.5 text-[11px] font-bold cursor-pointer rounded-lg transition-all duration-200"
          onClick={() => onViewModeChange('exercises')}
        >
          Ejercicios
        </PillButton>
      </div>
    </div>
  )
}
