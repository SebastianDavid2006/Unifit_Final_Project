import { motion } from 'motion/react'
import { Menu, BarChart3, Users, GraduationCap, Calendar } from 'lucide-react'
import type { RefObject } from 'react'
import { STATS_BTN_GRAD, STATS_BTN_SHADOW, PILL_GRAD } from '../data'

export default function StatsToolbar({
  showCareerFilter, onToggleCareerFilter, statsTab, onStatsTabChange,
  showStatsCalendar, onToggleStatsCalendar, calendarBtnRef,
}: {
  showCareerFilter: boolean
  onToggleCareerFilter: () => void
  statsTab: string
  onStatsTabChange: (t: string) => void
  showStatsCalendar: boolean
  onToggleStatsCalendar: () => void
  calendarBtnRef: RefObject<HTMLButtonElement | null>
}) {
  return (
    <div className="flex-1 flex items-center justify-center gap-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggleCareerFilter}
        title="Filtro de carreras"
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: showCareerFilter ? STATS_BTN_GRAD : 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(16px) saturate(1.5)',
          border: '1px solid rgba(255,255,255,0.25)',
          boxShadow: showCareerFilter ? STATS_BTN_SHADOW : '0 4px 16px rgba(0,0,0,0.04)',
        }}
      >
        <Menu size={18} style={{ color: showCareerFilter ? '#FFFFFF' : '#1270B7' }} />
      </motion.button>

      <div className="flex items-center gap-1 rounded-2xl px-2 py-1.5" style={{
        background: 'rgba(255,255,255,0.12)',
        backdropFilter: 'blur(24px) saturate(1.6)',
        border: '1px solid rgba(255,255,255,0.25)',
      }}>
        {([
          { id: 'overview', label: 'Resumen', icon: BarChart3 },
          { id: 'students', label: 'Estudiantes', icon: Users },
          { id: 'careers', label: 'Carreras', icon: GraduationCap },
        ] as const).map(t => (
          <motion.button key={t.id} onClick={() => onStatsTabChange(t.id)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all"
            style={{
              background: statsTab === t.id ? PILL_GRAD : 'transparent',
              color: statsTab === t.id ? '#FFFFFF' : 'rgba(0,0,0,0.3)',
            }}
          >
            <t.icon size={14} />
            {t.label}
          </motion.button>
        ))}
      </div>

      <motion.button
        ref={calendarBtnRef}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggleStatsCalendar}
        title="Rango de fechas"
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: showStatsCalendar ? STATS_BTN_GRAD : 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(16px) saturate(1.5)',
          border: '1px solid rgba(255,255,255,0.25)',
          boxShadow: showStatsCalendar ? STATS_BTN_SHADOW : '0 4px 16px rgba(0,0,0,0.04)',
        }}
      >
        <Calendar size={18} style={{ color: showStatsCalendar ? '#FFFFFF' : '#1270B7' }} />
      </motion.button>
    </div>
  )
}
