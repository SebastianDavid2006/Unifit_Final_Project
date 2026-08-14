import { motion } from 'motion/react'
import type { Appointment } from '../../AgendaData'
import { fmtDate, TIME_SLOTS_WEEK, typeColors } from '../data'
import { ViewHeader } from '../components/ViewHeader'

interface DayViewProps {
  fullscreen?: boolean
  viewTitle: string
  viewMode: 'day' | 'week' | 'month' | 'year'
  onViewModeChange: (v: 'day' | 'week' | 'month' | 'year') => void
  onPrev: () => void
  onNext: () => void
  isExpanded: boolean
  onToggleExpand: () => void
  currentMonth: Date
  getApptsForDate: (ds: string) => Appointment[]
  onSlotClick: (ds: string, t: string) => void
}

export function DayView({ fullscreen, viewTitle, viewMode, onViewModeChange, onPrev, onNext, isExpanded, onToggleExpand, currentMonth, getApptsForDate, onSlotClick }: DayViewProps) {
  const ds = fmtDate(currentMonth)
  const timeText = fullscreen ? 'text-[10px]' : 'text-[9px]'
  const apptText = fullscreen ? 'text-[11px]' : 'text-[10px]'
  const slots = TIME_SLOTS_WEEK.map(t => {
    const appts = getApptsForDate(ds).filter(a => a.startTime <= t && a.endTime > t)
    return (
      <div key={t} className="flex items-center gap-2 px-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.03)', minHeight: fullscreen ? 40 : 36, paddingTop: fullscreen ? 8 : 6, paddingBottom: fullscreen ? 8 : 6 }}>
        <div className={`w-14 font-bold flex-shrink-0 ${timeText}`} style={{ color: 'rgba(0,0,0,0.2)' }}>{t}</div>
        <div className="flex-1 cursor-pointer" onClick={() => onSlotClick(ds, t)}>
          {appts.map(a => (
            <div key={a.id} className={`rounded-md px-2 py-1 font-bold truncate ${apptText}`}
              style={{ background: `${typeColors[a.type]}18`, color: typeColors[a.type], borderLeft: `3px solid ${typeColors[a.type]}` }}
            >
              <span>{a.startTime} – {a.endTime}</span> {a.title}
              {a.studentName && <span className="ml-1 font-medium" style={{ opacity: 0.7 }}>— {a.studentName}</span>}
            </div>
          ))}
          {appts.length === 0 && (
            <div className={`font-medium ${timeText}`} style={{ color: 'rgba(0,0,0,0.1)' }}>—</div>
          )}
        </div>
      </div>
    )
  })

  if (fullscreen) {
    return (
      <div className="rounded-2xl premium-card h-full flex flex-col">
        <ViewHeader shrink viewMode={viewMode} onViewModeChange={onViewModeChange} viewTitle={viewTitle} onPrev={onPrev} onNext={onNext} isExpanded={isExpanded} onToggleExpand={onToggleExpand} />
        <div className="flex-1 overflow-auto">
          {slots}
        </div>
      </div>
    )
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 }}
      className="rounded-2xl premium-card"
    >
      <ViewHeader viewMode={viewMode} onViewModeChange={onViewModeChange} viewTitle={viewTitle} onPrev={onPrev} onNext={onNext} isExpanded={isExpanded} onToggleExpand={onToggleExpand} />
      <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        {slots}
      </div>
    </motion.div>
  )
}
