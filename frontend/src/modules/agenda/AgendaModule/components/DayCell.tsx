import { Plus, Sparkles } from 'lucide-react'
import { BLUE, BLUE_GRAD, GOLD_GRAD, RED } from '../../AgendaData'
import type { Appointment } from '../../AgendaData'
import { fmtDate, typeColors, typeLabels } from '../data'
import type { DayStatus } from '../data'

interface DayCellProps {
  dt: Date | null
  idx: number
  lastRow?: boolean
  rowIdx?: number
  todayStr: string
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

export function DayCell({ dt, idx, lastRow, rowIdx = 0, todayStr, getDayStatus, getApptsForDate, publishedDates, hoveredCol, hoveredRow, pressedCell, setHoveredCol, setHoveredRow, setPressedCell, onSelectDate }: DayCellProps) {
  if (!dt) return <div key={idx} className="min-h-[100px]" />
  const ds = fmtDate(dt)
  const isT = ds === todayStr
  const st = getDayStatus(ds)
  const isHoliday = !!st.holiday
  const appts = getApptsForDate(ds).sort((a, b) => a.startTime.localeCompare(b.startTime))
  const visible = appts.slice(0, 4)
  const hidden = appts.slice(4)
  const hasNoAppts = appts.length === 0
  const isPublished = publishedDates.has(ds)
  const isHoveredCell = hoveredCol === idx && hoveredRow === rowIdx
  const isPressed = pressedCell?.col === idx && pressedCell?.row === rowIdx
  let colBg = 'transparent'
  if (isHoveredCell) {
    colBg = 'rgba(18,112,183,0.06)'
  } else if (isT) {
    colBg = 'rgba(18,112,183,0.04)'
  }
  return (
    <div
      key={idx}
      onClick={() => onSelectDate(ds)}
      onMouseEnter={() => { setHoveredCol(idx); setHoveredRow(rowIdx) }}
      onMouseLeave={() => { setHoveredCol(null); setHoveredRow(null); setPressedCell(null) }}
      onMouseDown={() => setPressedCell({ col: idx, row: rowIdx })}
      onMouseUp={() => setPressedCell(null)}
      className="day-cell-hover relative min-h-[100px] p-2 cursor-pointer"
      style={{
        background: colBg,
        boxShadow: 'none',
        borderRight: idx < 6 ? '1px solid rgba(0,0,0,0.03)' : 'none',
        borderBottom: !lastRow ? '1px solid rgba(0,0,0,0.03)' : 'none',
        transform: isPressed ? 'scale(0.97)' : isHoveredCell ? 'scale(1.04)' : 'scale(1)',
        transition: 'transform 0.18s ease',
        zIndex: isPressed || isHoveredCell ? 25 : 1,
      }}
    >
      {isPublished && (
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: GOLD_GRAD }} />
      )}
      {isHoliday && (
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: RED }} title={st.holiday || undefined} />
      )}
      {isHoveredCell && hasNoAppts && !isHoliday && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg shadow-md" style={{ background: BLUE_GRAD }}>
            <Plus size={16} color="#fff" strokeWidth={3} />
          </div>
        </div>
      )}
      {isPublished && !hasNoAppts && (
        <div className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 rounded-full" style={{ background: GOLD_GRAD, boxShadow: '0 2px 6px rgba(241,200,39,0.3)' }}>
          <Sparkles size={9} color="#fff" strokeWidth={2.5} />
        </div>
      )}
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-xs font-bold" style={{
          color: isT ? '#fff' : isHoliday ? RED : st.active ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.2)',
          width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 6, background: isT ? BLUE_GRAD : 'transparent',
          ...(isHoveredCell && !isT ? { background: BLUE_GRAD, backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } : {}),
        }}>
          {dt.getDate()}
        </span>
      </div>
      <div className="space-y-0.5">
        {visible.map(a => (
          <div key={a.id} className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold leading-tight flex items-center justify-between" style={{ background: `${typeColors[a.type]}18`, color: typeColors[a.type], borderLeft: `2.5px solid ${typeColors[a.type]}` }}
            title={`${a.startTime} – ${a.endTime} ${typeLabels[a.type]}${a.studentName ? ' - ' + a.studentName : ''}`}
          >
            <div className="text-[10px] font-extrabold truncate pr-1">{a.studentName || `${a.startTime} – ${a.endTime}`}</div>
            <span className="flex-shrink-0 text-[8px] font-bold px-1.5 py-0.5 rounded" style={{ background: `${typeColors[a.type]}30`, color: typeColors[a.type] }}>
              {typeLabels[a.type]}
            </span>
          </div>
        ))}
        {hidden.length > 0 && (
          <div className="text-[9px] font-bold text-center mt-0.5 py-0.5 rounded-md cursor-pointer hover:bg-black/[0.05]" style={{ color: BLUE }}>
            +{hidden.length} más
          </div>
        )}
      </div>
    </div>
  )
}
