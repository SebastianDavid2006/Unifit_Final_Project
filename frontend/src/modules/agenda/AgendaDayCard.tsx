import { motion } from 'motion/react'
import { Check } from 'lucide-react'
import calendarCardImg from '../../assets/icons/objects/calendar.webp'
import { DAY_GRAD } from './AgendaData'

export function DayCard({ label, selected, done, onClick }: { label: string; selected: boolean; done?: boolean; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      whileHover={!selected ? { scale: 1.05 } : {}}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative flex flex-col items-center gap-1.5 px-2 py-3.5 rounded-xl text-sm font-bold transition-all duration-200"
      style={{
        background: selected ? DAY_GRAD : 'rgba(0,0,0,0.03)',
        color: selected ? '#FFFFFF' : 'rgba(0,0,0,0.35)',
        border: '1px solid transparent',
        boxShadow: selected ? '0 4px 20px rgba(18,112,183,0.25)' : 'none',
      }}
      onMouseEnter={e => { if (!selected) { e.currentTarget.style.background = 'rgba(18,112,183,0.12)'; e.currentTarget.style.color = '#1270B7' } }}
      onMouseLeave={e => { if (!selected) { e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; e.currentTarget.style.color = 'rgba(0,0,0,0.35)' } }}
    >
      <motion.img
        src={calendarCardImg}
        alt=""
        className="mb-0.5"
        animate={{
          width: selected ? 48 : 24,
          height: selected ? 48 : 24,
          marginTop: selected ? -24 : 0,
          filter: selected ? 'blur(0px) drop-shadow(0 8px 20px rgba(0,0,0,0.15))' : 'blur(0px)',
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      />
      <span className="text-sm leading-none text-center">{label}</span>
      {done !== undefined && (
        <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
          style={{ background: done ? '#30D158' : 'rgba(0,0,0,0.1)' }}>
          <Check size={10} color="#fff" strokeWidth={3.5} />
        </span>
      )}
    </motion.button>
  )
}
