import { motion } from 'motion/react'
import { BLUE, BLUE_GRAD, GOLD_GRAD, monthNames } from '../../AgendaData'
import type { Appointment } from '../../AgendaData'
import { ViewHeader } from '../components/ViewHeader'

interface YearViewProps {
  fullscreen?: boolean
  viewTitle: string
  viewMode: 'day' | 'week' | 'month' | 'year'
  onViewModeChange: (v: 'day' | 'week' | 'month' | 'year') => void
  onPrev: () => void
  onNext: () => void
  isExpanded: boolean
  onToggleExpand: () => void
  year: number
  todayStr: string
  appointments: Appointment[]
  publishedDates: Set<string>
  onSelectMonth: (mi: number) => void
}

export function YearView({ fullscreen, viewTitle, viewMode, onViewModeChange, onPrev, onNext, isExpanded, onToggleExpand, year, todayStr, appointments, publishedDates, onSelectMonth }: YearViewProps) {
  const grid = (
    <div className="grid grid-cols-4 gap-3 p-4">
      {Array.from({ length: 12 }, (_, mi) => {
        const mDays = new Date(year, mi + 1, 0).getDate()
        const firstDow = new Date(year, mi, 1).getDay()
        const pad = firstDow === 0 ? 6 : firstDow - 1
        const hasEvents = appointments.some(a => a.date.startsWith(`${year}-${String(mi + 1).padStart(2, '0')}`))
        return (
          <div key={mi} onClick={() => onSelectMonth(mi)}
            className="rounded-xl p-3 premium-card cursor-pointer transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold" style={{ color: '#1A1A1E' }}>{monthNames[mi]}</span>
              {hasEvents && <span className="w-1.5 h-1.5 rounded-full" style={{ background: BLUE }} />}
            </div>
            <div className="grid grid-cols-7 gap-0">
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((ld, ldi) => (
                <div key={ldi} className="text-[7px] font-bold text-center py-0.5" style={{ color: 'rgba(0,0,0,0.4)' }}>{ld}</div>
              ))}
              {Array.from({ length: pad }, (_, pi) => <div key={`p-${pi}`} />)}
              {Array.from({ length: mDays }, (_, di) => {
                const d = di + 1
                const ds = `${year}-${String(mi + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
                const isT = ds === todayStr
                const dayHasEvents = appointments.some(a => a.date === ds)
                const isPublished = publishedDates.has(ds)
                return (
                  <div key={di} onClick={(e) => { e.stopPropagation(); onSelectMonth(mi) }}
                    className="relative text-center text-[9px] font-bold py-0.5 rounded-sm cursor-pointer hover:bg-black/[0.03] transition-colors"
                    style={{
                      color: isT ? '#fff' : 'rgba(0,0,0,0.5)',
                      background: isT ? BLUE_GRAD : 'transparent',
                    }}
                  >
                    {d}
                    {dayHasEvents && !isT && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-0.5 rounded-full" style={{ background: BLUE }} />}
                    {isPublished && !isT && <span className="absolute -top-0.5 right-0 w-2.5 h-0.5 rounded-sm" style={{ background: GOLD_GRAD }} />}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )

  if (fullscreen) {
    return (
      <div className="rounded-2xl premium-card h-full overflow-auto">
        <ViewHeader viewMode={viewMode} onViewModeChange={onViewModeChange} viewTitle={viewTitle} onPrev={onPrev} onNext={onNext} isExpanded={isExpanded} onToggleExpand={onToggleExpand} />
        {grid}
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
      {grid}
    </motion.div>
  )
}
