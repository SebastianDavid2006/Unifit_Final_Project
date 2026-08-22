import { motion } from 'motion/react'
import { ChevronLeft, Dumbbell, ClipboardCheck } from 'lucide-react'
import type { StudentRoutine } from '@/features/student/types/student'
import { FIRE, AMBER } from '@/features/student/components/ui/fitness'
import routineScene from '@/assets/scenes/physical_routine.webp'

interface DetailHeaderProps {
  routine: StudentRoutine
  evaluator?: string
  detailTab: 'exercises' | 'assessment'
  onTabChange: (tab: 'exercises' | 'assessment') => void
  onBack: () => void
}

export function DetailHeader({ routine, evaluator, detailTab, onTabChange, onBack }: DetailHeaderProps) {
  return (
    <>
      {/* Header con volver */}
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={onBack}
          className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', color: '#fff' }}
        >
          <ChevronLeft size={20} />
        </motion.button>
        <div className="min-w-0">
          <h2 className="uppercase italic font-black text-white truncate leading-tight" style={{ fontSize: 19 }}>{routine.name}</h2>
          <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 11.5 }}>
            {routine.duration} · {routine.focus} · Entrenador {evaluator}
          </p>
        </div>
      </div>

      {/* Imagen default de la rutina */}
      <div className="relative overflow-hidden rounded-3xl" style={{ height: 150, border: '1px solid rgba(255,255,255,0.09)' }}>
        <img src={routineScene} alt="Rutina física" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: '50% 22%' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 20%, rgba(7,7,14,0.85))' }} />
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3">
          <div>
            <p className="uppercase italic font-black text-white" style={{ fontSize: 17, lineHeight: 1.1 }}>{routine.name}</p>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11 }}>{routine.frequency} · Nivel {routine.level.toLowerCase()}</p>
          </div>
          {routine.current && (
            <span className="px-2.5 py-1 rounded-full uppercase italic font-black tracking-widest flex-shrink-0" style={{ background: `linear-gradient(135deg, ${FIRE}, ${AMBER})`, color: '#fff', fontSize: 8.5 }}>
              Actual
            </span>
          )}
        </div>
      </div>

      {/* Selector: Ver rutina / Valoración física */}
      <div className="grid grid-cols-2 gap-3">
        {([
          { id: 'exercises', label: 'Ver rutina', icon: Dumbbell },
          { id: 'assessment', label: 'Valoración física', icon: ClipboardCheck },
        ] as const).map(opt => {
          const active = detailTab === opt.id
          return (
            <motion.button
              key={opt.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onTabChange(opt.id)}
              className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl font-black uppercase tracking-wider transition-all"
              style={{
                background: active ? `linear-gradient(135deg, ${FIRE}, ${AMBER})` : 'rgba(255,255,255,0.04)',
                border: active ? 'none' : '1px solid rgba(255,255,255,0.09)',
                color: active ? '#fff' : 'rgba(255,255,255,0.45)',
                fontSize: 11.5,
                boxShadow: active ? '0 12px 30px rgba(230,57,70,0.3)' : 'none',
              }}
            >
              <opt.icon size={16} />
              {opt.label}
            </motion.button>
          )
        })}
      </div>
    </>
  )
}
