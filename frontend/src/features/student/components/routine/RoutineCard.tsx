import { motion } from 'motion/react'
import { ChevronRight, CheckCircle, Clock, Flame, Dumbbell } from 'lucide-react'
import { RoutineWithAssessment } from '@/features/student/types/student'

interface RoutineCardProps {
  routine: {
    routine: {
      name: string
      duration: string
      frequency: string
      level: string
      rows: { name: string; sets: string }[]
    }
    assessment: {
      score: number
      date: string
      type: string
      evaluator: string
    }
    progress: {
      completedSessions: number
      totalSessions: number
      adherence: number
    }
  }
  onClick: () => void
}

export function RoutineCard({ routine, onClick }: RoutineCardProps) {
  const { routine: r, assessment, progress } = routine
  const totalExercises = r.rows.length
  const completedExercises = Math.min(progress.completedSessions, totalExercises)

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex flex-col p-4 rounded-2xl cursor-pointer transition-all"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-lg truncate mb-1">{r.name}</h3>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Valoración: {assessment.score}/100 · {assessment.date}</p>
        </div>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(245,166,35,0.15)', color: '#F5A623' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </motion.div>
      </div>

      <div className="flex gap-3 mb-3">
        <div className="flex-1 rounded-xl p-3 text-center" style={{ background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.15)' }}>
          <p style={{ color: '#F5A623', fontSize: 16, fontWeight: 700 }}>{r.duration}</p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>Duración</p>
        </div>
        <div className="flex-1 rounded-xl p-3 text-center" style={{ background: 'rgba(0,122,255,0.08)', border: '1px solid rgba(0,122,255,0.15)' }}>
          <p style={{ color: '#007AFF', fontSize: 16, fontWeight: 700 }}>{r.frequency}</p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>Frecuencia</p>
        </div>
        <div className="flex-1 rounded-xl p-3 text-center" style={{ background: 'rgba(230,57,70,0.08)', border: '1px solid rgba(230,57,70,0.15)' }}>
          <p style={{ color: '#E63946', fontSize: 16, fontWeight: 700 }}>{r.level}</p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>Nivel</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: '#30D158' }}>
            {r.rows.length}
          </span>
          <span style={{ color: '#30D158', fontSize: 12, fontWeight: 600 }}>{r.rows.length} ejercicios</span>
        </div>
        <div className="flex items-center gap-1.5" style={{ color: '#30D158' }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>{Math.floor(Math.random() * 30) + 70}%</span>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Adherencia</span>
        </div>
      </div>

      <div className="space-y-2">
        {r.rows.slice(0, 3).map((ex, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 p-2.5 rounded-xl"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.03)',
            }}
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(48,209,88,0.1)', color: '#30D158' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">{ex.name}</p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>{ex.sets}</p>
            </div>
          </motion.div>
        ))}
        {r.rows.length > 3 && (
          <div className="text-center py-2" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
            +{r.rows.length - 3} ejercicios más
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2" style={{ color: '#30D158' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span style={{ fontSize: 12, fontWeight: 600 }}>Ver detalles y valoración</span>
        </div>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(245,166,35,0.15)', color: '#F5A623' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 19l-7-7 7-7" />
          </svg>
        </motion.div>
      </div>
    </motion.button>
  )
}