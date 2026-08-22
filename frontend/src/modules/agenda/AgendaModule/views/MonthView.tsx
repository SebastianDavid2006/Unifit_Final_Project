import { motion } from 'motion/react'
import { BLUE_GRAD, dayLabels } from '../../AgendaData'
import type { Appointment } from '../../AgendaData'
import type { DayStatus } from '../data'
import { ViewHeader } from '../components/ViewHeader'
import { DayCell } from '../components/DayCell'

interface MonthViewProps {
  fullscreen?: boolean
  viewTitle: string
  viewMode: 'day' | 'week' | 'month' | 'year'
  onViewModeChange: (v: 'day' | 'week' | 'month' | 'year') => void
  onPrev: () => void
  onNext: () => void
  isExpanded: boolean
  onToggleExpand: () => void
  year: number
  month: number
  todayStr: string
  getMonthGrid: (year: number, month: number) => (Date | null)[][]
  getDayStatus: (ds: string) => DayStatus
  getApptsForDate: (ds: string) => Appointment[]
  publishedDates: Set<string>
  hoveredCol: number | null
  hoveredRow: number | null
  pressedCell: { col: number; row: number } | null
  setHoveredCol: (v: number | null) => void
  setHoveredRow: (v: number | null) => void
  setPressedCell: (v: { col: number; row: number } | null) => void
  onSelectDate: (ds: string) => void
}

export function MonthView({ fullscreen, viewTitle, viewMode, onViewModeChange, onPrev, onNext, isExpanded, onToggleExpand, year, month, todayStr, getMonthGrid, getDayStatus, getApptsForDate, publishedDates, hoveredCol, hoveredRow, pressedCell, setHoveredCol, setHoveredRow, setPressedCell, onSelectDate }: MonthViewProps) {
  const grid = getMonthGrid(year, month)
  const dayHeader = (
    <div className="grid grid-cols-7" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
      {dayLabels.map((d, i) => (
        <div key={d} onMouseEnter={() => { setHoveredCol(i); setHoveredRow(0) }} onMouseLeave={() => { setHoveredCol(null); setHoveredRow(null) }}
          className="text-center py-2.5 text-[11px] font-bold tracking-wide transition-colors rounded-t-md"
          style={{ color: hoveredCol === i ? '#fff' : 'rgba(0,0,0,0.5)', background: hoveredCol === i ? BLUE_GRAD : 'transparent' }}>{d}</div>
      ))}
    </div>
  )
  const weeks = grid.map((week, wi) => (
    <div key={wi} className="grid grid-cols-7">
      {week.map((dt, di) => (
        <DayCell key={di} dt={dt} idx={di} lastRow={wi === grid.length - 1} rowIdx={wi}
          todayStr={todayStr} getDayStatus={getDayStatus} getApptsForDate={getApptsForDate}
          publishedDates={publishedDates} hoveredCol={hoveredCol} hoveredRow={hoveredRow}
          pressedCell={pressedCell} setHoveredCol={setHoveredCol} setHoveredRow={setHoveredRow}
          setPressedCell={setPressedCell} onSelectDate={onSelectDate} />
      ))}
    </div>
  ))

  if (fullscreen) {
    return (
      <div className="rounded-2xl premium-card h-full flex flex-col">
        <ViewHeader shrink viewMode={viewMode} onViewModeChange={onViewModeChange} viewTitle={viewTitle} onPrev={onPrev} onNext={onNext} isExpanded={isExpanded} onToggleExpand={onToggleExpand} />
        <div className="flex-1 overflow-auto">
          {dayHeader}
          {weeks}
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
      {weeks}
    </motion.div>
  )
}
