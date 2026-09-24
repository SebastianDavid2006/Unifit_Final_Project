import { motion } from 'motion/react'
import { Check } from 'lucide-react'
import { muscleIcons } from '@/data/shared/constants'
import { ROUTINE_CATEGORIES } from '@/modules/students/StudentProfileData'

const ROUTINE_GRAD = 'linear-gradient(135deg, #1270B7, #7ec8e3)'

export function RoutineCategoryPills({ selected, onChange }: {
  selected: string[]
  onChange: (cats: string[]) => void
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {ROUTINE_CATEGORIES.map(cat => {
        const isActive = selected.includes(cat)
        return (
          <motion.button
            key={cat}
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => onChange(isActive ? selected.filter(c => c !== cat) : [...selected, cat])}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all"
            style={{
              background: isActive ? ROUTINE_GRAD : 'rgba(0,0,0,0.03)',
              color: isActive ? '#FFFFFF' : 'rgba(0,0,0,0.45)',
              border: `1px solid ${isActive ? 'transparent' : 'rgba(0,0,0,0.06)'}`,
            }}
          >
            {muscleIcons[cat] && <img src={muscleIcons[cat]} alt="" className="w-4 h-4 flex-shrink-0" style={{ filter: isActive ? 'brightness(10)' : 'none' }} />}
            <span>{cat}</span>
            {isActive && <Check size={10} strokeWidth={3.5} />}
          </motion.button>
        )
      })}
    </div>
  )
}

export function RoutineExerciseCategories({ groups }: { groups: string[] }) {
  if (groups.length === 0) return null
  return (
    <div className="mt-2">
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(18,112,183,0.5)' }} />
        <span className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.45)' }}>Categorías del ejercicio</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {groups.map(g => (
          <span key={g} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ background: 'rgba(18,112,183,0.08)', color: '#1270B7', border: '1px solid rgba(18,112,183,0.15)' }}>
            {muscleIcons[g] ? <img src={muscleIcons[g]} alt="" className="w-4 h-4 flex-shrink-0" /> : null}
            <span>{g}</span>
          </span>
        ))}
      </div>
    </div>
  )
}