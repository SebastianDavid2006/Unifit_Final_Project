import { motion } from 'motion/react'
import { Dumbbell } from 'lucide-react'
import type { Exercise } from '@/data/shared/types'
import { muscleIcons } from '@/data/shared/constants'
import { StatusBadge } from '@/shared/components/ui/StatusBadge'
import { LEVEL_BADGE } from '@/modules/equipment/data'

interface ExerciseCardGridProps {
  exercises: Exercise[]
  onPreview: (e: Exercise) => void
}

export function ExerciseCardGrid({ exercises, onPreview }: ExerciseCardGridProps) {
  if (exercises.length === 0) {
    return (
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-3 py-16 text-center">
          <p className="text-lg font-bold" style={{ color: 'rgba(0,0,0,0.2)' }}>No se encontraron ejercicios</p>
          <p className="text-sm mt-1" style={{ color: 'rgba(0,0,0,0.15)' }}>Agrega ejercicios para verlos aquí.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {exercises.map((e, i) => (
        <motion.div
          key={e.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 * i, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.04, boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onPreview(e)}
          className="rounded-2xl premium-card cursor-pointer"
          style={{
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.6)',
            boxShadow: '0 2px 20px rgba(0,0,0,0.04)',
          }}
        >
          <div className="w-full overflow-hidden relative" style={{ height: 96, background: 'radial-gradient(ellipse at 30% 20%, rgba(48,209,88,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(10,132,255,0.05) 0%, transparent 50%)' }}>
            {e.imageUrl ? (
              <img src={e.imageUrl} alt={e.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Dumbbell size={24} style={{ color: 'rgba(48,209,88,0.3)' }} />
              </div>
            )}
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(180deg, transparent 40%, rgba(48,209,88,0.08) 100%)',
              pointerEvents: 'none',
            }} />
          </div>
          <div className="px-5 pt-4 pb-3">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-[#1A1A1E] text-base leading-tight">{e.name}</h3>
              <StatusBadge status={e.status} />
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {e.muscleGroups.map((mg, i) => (
                muscleIcons[mg] ? (
                  <div key={i} className="relative group">
                    <div className="flex items-center justify-center rounded-full" style={{ width: 38, height: 38, background: 'linear-gradient(180deg, #ffffff 0%, #DBEAFE 100%)', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
                      <img src={muscleIcons[mg]} alt="" className="w-5 h-5" />
                    </div>
                    <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg whitespace-nowrap text-[10px] font-medium pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10" style={{ background: 'rgba(0,0,0,0.7)', color: '#FFFFFF' }}>
                      {mg}
                    </div>
                  </div>
                ) : null
              ))}
            </div>
          </div>
          <div className="px-5 pb-3 flex justify-center" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
            <span className="text-[11px] font-bold text-center px-2 py-0.5 rounded-md" style={{
              background: LEVEL_BADGE[e.recommendedLevel].bg,
              color: LEVEL_BADGE[e.recommendedLevel].color,
            }}>
              {LEVEL_BADGE[e.recommendedLevel].label}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
