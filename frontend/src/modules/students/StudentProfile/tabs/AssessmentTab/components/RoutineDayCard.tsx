import { motion } from 'motion/react'
import { X } from 'lucide-react'
import calendarImg from '@/assets/icons/objects/calendar.webp'

const ROUTINE_DAY_GRAD = 'linear-gradient(135deg, #1270B7, #7ec8e3)'

interface RoutineDayCardProps {
  day: string
  selected: boolean
  done: boolean
  onClick: () => void
  onRemove?: () => void
}

export function RoutineDayCard({ day, selected, done, onClick, onRemove }: RoutineDayCardProps) {
  return (
    <motion.button
      type="button"
      whileHover={!selected ? { scale: 1.05 } : {}}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative flex flex-col items-center gap-1.5 px-2 py-3.5 rounded-xl text-sm font-bold transition-all duration-200"
      style={{
        background: selected ? ROUTINE_DAY_GRAD : 'rgba(0,0,0,0.03)',
        color: selected ? '#FFFFFF' : 'rgba(0,0,0,0.35)',
        border: '1px solid transparent',
        boxShadow: selected ? '0 4px 20px rgba(18,112,183,0.25)' : 'none',
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
      {onRemove && (
        <motion.button
          type="button"
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={e => { e.stopPropagation(); onRemove() }}
          className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer z-10"
          style={{ background: selected ? 'rgba(255,255,255,0.95)' : 'rgba(244,56,67,0.12)', color: '#E63946', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
        >
          <X size={11} strokeWidth={3.5} />
        </motion.button>
      )}
    </motion.button>
  )
}