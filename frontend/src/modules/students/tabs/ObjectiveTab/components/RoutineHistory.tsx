import { motion } from 'motion/react'
import { History, TrendingUp, BarChart2, Calendar } from 'lucide-react'

interface Session {
  id: string
  date: string
  routine: string
  duration: string
  completed: number
  total: number
  calories: number
}

interface RoutineHistoryProps {
  history?: Session[]
}

const DEFAULT_HISTORY: Session[] = [
  { id: '1', date: '17 Jun 2026', routine: 'Rutina Hipertrofia Full Body', duration: '1h 15min', completed: 8, total: 10, calories: 420 },
  { id: '2', date: '14 Jun 2026', routine: 'Rutina Hipertrofia Full Body', duration: '1h 10min', completed: 10, total: 10, calories: 450 },
  { id: '3', date: '12 Jun 2026', routine: 'Rutina Fuerza Tren Superior', duration: '55min', completed: 7, total: 8, calories: 350 },
  { id: '4', date: '09 Jun 2026', routine: 'Rutina Hipertrofia Full Body', duration: '1h 20min', completed: 9, total: 10, calories: 430 },
  { id: '5', date: '07 Jun 2026', routine: 'Rutina Fuerza Tren Superior', duration: '1h 00min', completed: 8, total: 8, calories: 380 },
]

export function RoutineHistory({ history = DEFAULT_HISTORY }: RoutineHistoryProps) {
  if (history.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl p-8 text-center"
        style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)' }}
      >
        <History size={32} style={{ color: 'rgba(0,0,0,0.12)', margin: '0 auto 8px' }} />
        <p className="text-xs font-medium" style={{ color: 'rgba(0,0,0,0.45)' }}>Aún no tienes historial de rutinas</p>
      </motion.div>
    )
  }

  const totalSessions = history.length
  const totalCalories = history.reduce((acc, h) => acc + h.calories, 0)
  const avgCompletion = Math.round(history.reduce((acc, h) => acc + (h.completed / h.total), 0) / totalSessions * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl p-5"
      style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)' }}
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: 'rgba(230,57,70,0.3)' }} />
        <History size={18} style={{ color: '#0D1B2A' }} />
        <p className="text-lg font-extrabold" style={{ color: '#0D1B2A' }}>Historial de rutinas</p>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <StatCard icon={<BarChart2 size={14} />} label="Sesiones" value={String(totalSessions)} color="#1270B7" />
        <StatCard icon={<TrendingUp size={14} />} label="Completado" value={`${avgCompletion}%`} color="#22C55E" />
        <StatCard icon={<Calendar size={14} />} label="Calorías" value={`${totalCalories} cal`} color="#F43843" />
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
        {history.map((s) => {
          const completionPct = Math.round((s.completed / s.total) * 100)
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              className="flex items-center gap-3 p-2.5 rounded-xl"
              style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.03)' }}
            >
              <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center" style={{ background: 'rgba(18,112,183,0.1)', borderRadius: '6px' }}>
                <DumbbellLikeIcon />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate" style={{ color: '#0D1B2A' }}>{s.routine}</p>
                <p className="text-[9px] mt-0.5" style={{ color: 'rgba(0,0,0,0.4)' }}>{s.date} · {s.duration}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-bold" style={{ color: '#0D1B2A' }}>{completionPct}%</p>
                <div className="w-10 h-1.5 rounded-full mt-0.5" style={{ background: 'rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${completionPct}%`, background: completionPct >= 80 ? '#22C55E' : completionPct >= 50 ? '#FACC15' : '#F43843' }} />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-1.5 p-2.5 rounded-xl" style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.03)' }}>
      <span style={{ color }}>{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase font-bold" style={{ color: 'rgba(0,0,0,0.35)' }}>{label}</p>
        <p className="text-sm font-extrabold" style={{ color }}>{value}</p>
      </div>
    </div>
  )
}

function DumbbellLikeIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6" />
      <path d="M14.2 14.2L7.4 7.4" />
      <circle cx="12" cy="12" r="8" />
    </svg>
  )
}
