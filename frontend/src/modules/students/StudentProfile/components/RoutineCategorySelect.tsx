import { motion, AnimatePresence } from 'motion/react'
import { List, ChevronDown, Check } from 'lucide-react'
import { muscleIcons } from '@/data/shared/constants'
import type { RoutineRow } from '../../aiRoutine'
import { ROUTINE_CATEGORIES, ROUTINE_MUSCLE_TO_CAT } from '../../StudentProfileData'

const ROUTINE_GRAD = 'linear-gradient(135deg, #1270B7, #7ec8e3)'
const meshInputBg = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)'
const meshInputHover = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(0,0,0,0.04)'

interface RoutineCategorySelectProps {
  row: RoutineRow
  routineViewMode: boolean
  open: boolean
  onToggle: () => void
  onSelect: (muscle: string) => void
  onClose: () => void
}

export function RoutineCategorySelect({ row, routineViewMode, open, onToggle, onSelect, onClose }: RoutineCategorySelectProps) {
  const category = ROUTINE_MUSCLE_TO_CAT[row.muscle] || row.muscle
  const icon = category && muscleIcons[category]
  return (
    <div className="relative">
      <button
        type="button"
        disabled={routineViewMode}
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold outline-none cursor-pointer transition-all duration-200"
        style={{ background: meshInputBg, border: '1px solid transparent', color: row.muscle ? '#0D1B2A' : 'rgba(0,0,0,0.35)' }}
        onMouseEnter={e => { if (e.currentTarget !== document.activeElement) { e.currentTarget.style.background = meshInputHover; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)' } }}
        onMouseLeave={e => { if (e.currentTarget !== document.activeElement) { e.currentTarget.style.background = meshInputBg; e.currentTarget.style.borderColor = 'transparent' } }}
        onFocus={e => { e.currentTarget.style.borderColor = '#1270B7'; e.currentTarget.style.background = meshInputHover; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(18,112,183,0.08)' }}
        onBlur={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = meshInputBg; e.currentTarget.style.boxShadow = 'none' }}
      >
        {icon ? (
          <img src={icon} alt="" className="w-4 h-4 flex-shrink-0" />
        ) : (
          <div className="w-4 h-4 rounded flex-shrink-0 flex items-center justify-center" style={{ background: 'rgba(18,112,183,0.12)' }}>
            <List size={11} style={{ color: '#1270B7' }} />
          </div>
        )}
        <span className="flex-1 truncate text-left">{category || 'Categoría'}</span>
        {!routineViewMode && (
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ color: 'rgba(0,0,0,0.25)' }} className="flex-shrink-0">
            <ChevronDown size={13} />
          </motion.div>
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-0 right-0 z-50 mt-1 rounded-xl max-h-44 overflow-y-auto"
            style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 12px 40px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)' }}
          >
            {ROUTINE_CATEGORIES.map(m => {
              const isActive = category === m
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => onSelect(m)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[11px] font-medium transition-colors relative"
                  style={{
                    color: isActive ? '#FFFFFF' : 'rgba(0,0,0,0.6)',
                    background: isActive ? ROUTINE_GRAD : 'transparent',
                    borderBottom: '1px solid rgba(0,0,0,0.03)',
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = '#1270B7' } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(0,0,0,0.6)' } }}
                >
                  {muscleIcons[m] && (
                    <img src={muscleIcons[m]} alt="" className="w-4 h-4 flex-shrink-0" style={{ filter: isActive ? 'brightness(10)' : 'none' }} />
                  )}
                  <span>{m}</span>
                  {isActive && <Check size={12} className="ml-auto text-white" />}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}