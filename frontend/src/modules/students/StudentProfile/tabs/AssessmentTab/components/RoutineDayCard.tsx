import { motion } from 'motion/react'
import { X, AlertTriangle } from 'lucide-react'
import calendarImg from '@/assets/icons/objects/calendar.webp'

const ROUTINE_DAY_GRAD = 'linear-gradient(135deg, #1270B7, #7ec8e3)'

interface RoutineDayCardProps {
  day: string
  selected: boolean
  done: boolean
  invalid?: boolean
  onClick: () => void
  onRemove?: () => void
}

export function RoutineDayCard({ day, selected, done, invalid, onClick, onRemove }: RoutineDayCardProps) {
  return (
    <motion.div
      role="button"
      tabIndex={0}
      whileHover={!selected ? { scale: 1.05 } : {}}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() } }}
      className="relative flex flex-col items-center gap-1.5 px-2 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer"
      style={{
        background: selected ? ROUTINE_DAY_GRAD : 'rgba(0,0,0,0.03)',
        color: selected ? '#FFFFFF' : 'rgba(0,0,0,0.35)',
        border: invalid ? '2px solid rgba(217,119,6,0.85)' : '1px solid transparent',
        boxShadow: invalid
          ? `0 0 0 2px rgba(217,119,6,0.12)${selected ? ', 0 4px 20px rgba(18,112,183,0.25)' : ''}`
          : selected ? '0 4px 20px rgba(18,112,183,0.25)' : 'none',
      }}
      onMouseEnter={e => { if (!selected) { e.currentTarget.style.background = 'rgba(18,112,183,0.12)'; e.currentTarget.style.color = '#1270B7' } }}
      onMouseLeave={e => { if (!selected) { e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; e.currentTarget.style.color = 'rgba(0,0,0,0.35)' } }}
    >
      <motion.img
        src={calendarImg}
        alt=""
        className="mb-0.5"
        animate={{
          width: selected ? 52 : 28,
          height: selected ? 52 : 28,
          marginTop: selected ? -28 : 0,
          filter: selected ? 'blur(0px) drop-shadow(0 8px 20px rgba(0,0,0,0.15))' : 'blur(0px)',
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      />
      <span className="text-sm leading-none text-center">{day}</span>
      {invalid && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center z-10"
          style={{ background: selected ? 'rgba(197, 125, 0, 0.9)' : '#FFFFFF', boxShadow: selected ? '0 0 0 2px rgba(217,119,6,0.12), 0 2px 8px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.1)' }}
        >
          <AlertTriangle size={13} style={{ color: selected ? '#FFFFFF' : '#B45309', filter: selected ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' : 'none' }} />
        </motion.span>
      )}
      {onRemove && (
        <motion.button
          type="button"
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={e => { e.stopPropagation(); onRemove() }}
          className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer z-10"
          style={{ background: selected ? 'rgba(255,255,255,0.95)' : '#FFFFFF', color: '#E63946', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
        >
          <X size={11} strokeWidth={3.5} />
        </motion.button>
      )}
    </motion.div>
  )
}