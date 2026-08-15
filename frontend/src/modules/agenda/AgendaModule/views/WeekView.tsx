import { motion } from 'motion/react'
import { BLUE, BLUE_GRAD, GOLD_GRAD, RED, dayLabels } from '../../AgendaData'
import type { Appointment } from '../../AgendaData'
import { fmtDate, TIME_SLOTS_WEEK, typeColors } from '../data'
import type { DayStatus } from '../data'
import { ViewHeader } from '../components/ViewHeader'

interface WeekViewProps {
  fullscreen?: boolean
  viewTitle: string
  viewMode: 'day' | 'week' | 'month' | 'year'
  onViewModeChange: (v: 'day' | 'week' | 'month' | 'year') => void
  onPrev: () => void
  onNext: () => void
  isExpanded: boolean
  onToggleExpand: () => void
  weekDates: Date[]
  todayStr: string
  publishedDates: Set<string>
  getDayStatus: (ds: string) => DayStatus
  hoveredCol: number | null
  hoveredHour: string | null
  setHoveredCol: (v: number | null) => void
  setHoveredHour: (v: string | null) => void
  getApptsForDate: (ds: string) => Appointment[]
  onSlotClick: (ds: string, t: string) => void
  hoverSlots?: boolean
}

export function WeekView({ fullscreen, viewTitle, viewMode, onViewModeChange, onPrev, onNext, isExpanded, onToggleExpand, weekDates, todayStr, publishedDates, getDayStatus, hoveredCol, hoveredHour, setHoveredCol, setHoveredHour, getApptsForDate, onSlotClick, hoverSlots = true }: WeekViewProps) {
  const dayHeader = (
    <div className="grid grid-cols-8" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
      <div className="w-14" />
      {weekDates.map((dt, i) => {
        const ds = fmtDate(dt)
        const isT = ds === todayStr
        const isPublished = publishedDates.has(ds)
        const st = getDayStatus(ds)
        const isHoliday = !!st.holiday
        const hovered = hoveredCol === i
        return (
          <div key={i} className="text-center py-2 relative rounded-xl transition-colors duration-200"
            style={{ background: hovered ? BLUE_GRAD : 'transparent' }}
            title={isHoliday ? st.holiday || undefined : undefined}
            onMouseEnter={() => setHoveredCol(i)}
            onMouseLeave={() => setHoveredCol(null)}>
            <div className="text-[10px] font-bold transition-colors duration-200" style={{ color: isT ? (hovered ? '#fff' : BLUE) : hovered ? '#fff' : isHoliday ? RED : 'rgba(0,0,0,0.4)' }}>{dayLabels[i]}</div>
            <div className="text-sm font-extrabold transition-colors duration-200" style={{ color: hovered ? '#fff' : isHoliday ? RED : '#1A1A1E' }}>{dt.getDate()}</div>
            {isHoliday && <div className="w-1 h-1 rounded-full mx-auto mt-0.5" style={{ background: RED, opacity: hovered ? 0.9 : 1 }} />}
            {isPublished && <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: GOLD_GRAD, opacity: hovered ? 0.9 : 1 }} />}
          </div>
        )
      })}
    </div>
  )
  const slots = TIME_SLOTS_WEEK.map(t => (
    <div key={t} className={`grid grid-cols-8${hoverSlots ? ' transition-colors duration-200' : ''}`} style={{ borderBottom: '1px solid rgba(0,0,0,0.03)', background: hoverSlots && hoveredHour === t ? 'rgba(18,112,183,0.03)' : 'transparent' }}>
      <div className="w-14 text-[11px] font-bold leading-none text-right pr-2 py-1.5 rounded-xl transition-colors duration-200" style={{ color: hoverSlots && hoveredHour === t ? '#fff' : 'rgba(0,0,0,0.55)', background: hoverSlots && hoveredHour === t ? BLUE_GRAD : 'transparent' }}>{t}</div>
      {weekDates.map((dt, di) => {
        const ds = fmtDate(dt)
        const appts = getApptsForDate(ds).filter(a => a.startTime <= t && a.endTime > t)
        const isHoliday = !!getDayStatus(ds).holiday
        return (
          <div key={di} className="px-0.5 cursor-pointer transition-colors duration-200" style={{ minHeight: 30, background: hoveredCol === di ? (hoverSlots ? 'rgba(18,112,183,0.08)' : 'rgba(18,112,183,0.05)') : isHoliday ? 'rgba(230,57,70,0.04)' : 'transparent' }}
            onMouseEnter={() => { setHoveredCol(di); if (hoverSlots) setHoveredHour(t) }}
            onMouseLeave={() => { setHoveredCol(null); if (hoverSlots) setHoveredHour(null) }}
            onClick={() => { if (appts.length === 0 && !isHoliday) onSlotClick(ds, t) }}>
            {appts.map(a => (
              <div key={a.id} className="rounded px-1 py-0.5 text-[8px] font-bold truncate leading-tight"
                style={{ background: `${typeColors[a.type]}18`, color: typeColors[a.type], borderLeft: `2px solid ${typeColors[a.type]}` }}
                title={`${a.startTime} – ${a.endTime} ${a.title}`}
              >{a.startTime} – {a.endTime} {a.title}</div>
            ))}
          </div>
        )
      })}
    </div>
  ))

  if (fullscreen) {
    return (
      <div className="rounded-2xl premium-card h-full flex flex-col">
        <ViewHeader shrink viewMode={viewMode} onViewModeChange={onViewModeChange} viewTitle={viewTitle} onPrev={onPrev} onNext={onNext} isExpanded={isExpanded} onToggleExpand={onToggleExpand} />
        <div className="flex-1 overflow-auto">
          {dayHeader}
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
      {dayHeader}
      <div style={{ maxHeight: '52vh', overflowY: 'auto' }}>
        {slots}
      </div>
    </motion.div>
  )
}
