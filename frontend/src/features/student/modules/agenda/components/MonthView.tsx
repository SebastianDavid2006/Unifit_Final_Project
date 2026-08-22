import { motion } from 'motion/react'
import { ChevronLeft, ChevronRight, Lock, CheckCircle2 } from 'lucide-react'
import type { DayAvailability } from '@/features/student/types/student'
import { FIRE, AMBER, GREEN } from '@/features/student/components/ui/fitness'
import { getDayInfo, freeSlots, monthNames, weekDaysShort, sameDay } from '../agendaUtils'

interface MonthViewProps {
  currentDate: Date
  onChangeMonth: (delta: number) => void
  today: Date
  holidays: Map<string, string>
  selected: DayAvailability | null
  onSelect: (info: DayAvailability | null) => void
  /** true si hay una cita activa en la agenda */
  hasBooking: boolean
  isBookedDay: (d: Date) => boolean
}

export function MonthView({ currentDate, onChangeMonth, today, holidays, selected, onSelect, hasBooking, isBookedDay }: MonthViewProps) {
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  const startingDay = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  return (
    <motion.div key="month" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
      <div className="flex items-center justify-between">
        <button onClick={() => onChangeMonth(-1)} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}>
          <ChevronLeft size={19} />
        </button>
        <h2 className="uppercase italic font-black text-white" style={{ fontSize: 18 }}>{monthNames[currentMonth]} {currentYear}</h2>
        <button onClick={() => onChangeMonth(1)} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}>
          <ChevronRight size={19} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekDaysShort.map(day => (
          <div key={day} className="h-8 flex items-center justify-center text-[10px] font-black uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.28)' }}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {Array.from(Array(startingDay)).map((_, i) => <div key={'e' + i} />)}
        {Array.from(Array(daysInMonth)).map((_, i) => {
          const day = i + 1
          const date = new Date(currentYear, currentMonth, day)
          const info = getDayInfo(date, holidays)
          const free = freeSlots(info)
          const full = info.isCoachDay && free === 0
          const sel = selected && sameDay(selected.date, date)
          const isToday = sameDay(date, today)

          return (
            <motion.button
              key={day}
              whileTap={{ scale: 0.92 }}
              disabled={info.isHoliday}
              onClick={() => onSelect(sel ? null : info)}
              className="relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all"
              style={{
                background: sel ? `linear-gradient(135deg, ${FIRE}, ${AMBER})`
                  : full ? 'rgba(230,57,70,0.1)'
                  : info.isCoachDay ? 'rgba(48,209,88,0.07)'
                  : 'rgba(255,255,255,0.02)',
                border: sel ? 'none'
                  : full ? '1px solid rgba(230,57,70,0.35)'
                  : info.isCoachDay ? '1px solid rgba(48,209,88,0.22)'
                  : '1px solid rgba(255,255,255,0.05)',
                cursor: info.isHoliday ? 'not-allowed' : 'pointer',
                ...(hasBooking && !isBookedDay(date)
                  ? { opacity: 0.28, filter: 'blur(1.5px)' }
                  : { opacity: info.isHoliday ? 0.75 : 1 }),
              }}
            >
              <span style={{
                color: sel ? '#fff' : isToday ? AMBER : info.isHoliday ? 'rgba(255,255,255,0.4)' : 'white',
                fontSize: 13,
                fontWeight: isToday || sel ? 800 : 600,
              }}>
                {day}
              </span>
              {/* Subrayado de disponibilidad */}
              {info.isCoachDay && (
                <span className="absolute bottom-1.5 h-[3px] rounded-full transition-all" style={{
                  width: sel ? 18 : 12,
                  background: sel ? '#fff' : full ? FIRE : GREEN,
                  boxShadow: !sel && !full ? '0 0 8px rgba(48,209,88,0.6)' : 'none',
                }} />
              )}
              {info.isHoliday && <Lock size={10} style={{ position: 'absolute', bottom: 5, color: AMBER }} />}
              {isBookedDay(date) && (
                <CheckCircle2 size={13} style={{ position: 'absolute', top: 5, right: 5, color: GREEN, filter: 'drop-shadow(0 0 6px rgba(48,209,88,0.7))' }} />
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 px-1">
        {[
          { color: GREEN, label: 'Cupos disponibles' },
          { color: FIRE, label: 'Agenda llena' },
          { color: AMBER, label: 'Festivo / bloqueado' },
        ].map(l => (
          <span key={l.label} className="flex items-center gap-1.5" style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.42)', fontWeight: 600 }}>
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
            {l.label}
          </span>
        ))}
      </div>
    </motion.div>
  )
}
