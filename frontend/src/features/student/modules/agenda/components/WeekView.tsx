import { motion } from 'motion/react'
import { ChevronLeft, ChevronRight, Lock, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { DayAvailability } from '@/features/student/types/student'
import { FIRE, AMBER, GREEN } from '@/features/student/components/ui/fitness'
import { getDayInfo, freeSlots, weekDaysShort, sameDay, offset } from '../agendaUtils'

interface WeekViewProps {
  baseWeek: Date
  onChangeWeek: (delta: number) => void
  today: Date
  holidays: Map<string, string>
  /** true si hay una cita activa en la agenda */
  hasBooking: boolean
  isBookedDay: (d: Date) => boolean
  onBook: (info: DayAvailability, time: string) => void
}

export function WeekView({ baseWeek, onChangeWeek, today, holidays, hasBooking, isBookedDay, onBook }: WeekViewProps) {
  return (
    <motion.div key="week" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
      <div className="flex items-center justify-between">
        <button onClick={() => onChangeWeek(-1)} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}>
          <ChevronLeft size={19} />
        </button>
        <h2 className="uppercase italic font-black text-white text-center" style={{ fontSize: 15 }}>
          {format(baseWeek, 'd MMM', { locale: es })} — {format(offset(baseWeek, 6), 'd MMM yyyy', { locale: es })}
        </h2>
        <button onClick={() => onChangeWeek(1)} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}>
          <ChevronRight size={19} />
        </button>
      </div>

      <div className="space-y-2.5">
        {[0, 1, 2, 3, 4, 5, 6].map(off => {
          const date = offset(baseWeek, off)
          const info = getDayInfo(date, holidays)
          const free = freeSlots(info)
          const full = info.isCoachDay && free === 0
          const isToday = sameDay(date, today)

          const statusColor = info.isHoliday ? AMBER : full ? FIRE : info.isCoachDay ? GREEN : 'rgba(255,255,255,0.25)'
          const statusText = info.isHoliday ? 'Festivo' : full ? 'Lleno' : info.isCoachDay ? `${free} libres` : 'Descanso'

          return (
            <div
              key={off}
              className="rounded-2xl flex flex-col sm:flex-row overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: `1px solid ${isBookedDay(date) ? 'rgba(48,209,88,0.55)' : `${statusColor}30`}`,
                boxShadow: isBookedDay(date) ? '0 0 26px rgba(48,209,88,0.16), inset 0 0 30px rgba(48,209,88,0.05)' : 'none',
                opacity: info.isHoliday ? 0.8 : 1,
                ...(hasBooking && !isBookedDay(date) ? { opacity: 0.28, filter: 'blur(1.2px)' } : {}),
              }}
            >
              {/* Izquierda: día */}
              <div
                className="sm:w-[120px] flex-shrink-0 flex sm:flex-col items-center justify-center gap-1 py-3 px-3 relative"
                style={{ background: statusColor + '10', borderRight: '1px solid rgba(255,255,255,0.06)' }}
              >
                {isToday && <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full" style={{ background: AMBER }} />}
                <span className="uppercase tracking-widest" style={{ fontSize: 9.5, fontWeight: 800, color: 'rgba(255,255,255,0.45)' }}>
                  {weekDaysShort[date.getDay()]}
                </span>
                <span style={{ fontSize: 22, fontWeight: 900, lineHeight: 1, color: isToday ? AMBER : '#fff' }}>{date.getDate()}</span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full uppercase tracking-wider" style={{ fontSize: 8, fontWeight: 800, color: statusColor, background: statusColor + '15', marginTop: 3 }}>
                  {info.isHoliday && <Lock size={8} />}
                  {statusText}
                </span>
              </div>

              {/* Derecha: horarios */}
              <div className="flex-1 min-w-0 p-3 flex items-center">
                {info.isHoliday ? (
                  <p className="flex items-center gap-2 w-full justify-center py-2" style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12 }}>
                    <Lock size={13} style={{ color: AMBER }} />
                    {info.holidayName} — el gimnasio no abre
                  </p>
                ) : !info.isCoachDay ? (
                  <p className="w-full text-center py-2" style={{ color: 'rgba(255,255,255,0.28)', fontSize: 12 }}>El entrenador descansa este día</p>
                ) : (
                  <div className="flex flex-wrap gap-2 w-full">
                    {info.slots.map((s, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="flex items-center gap-2 pl-3 pr-1.5 py-1.5 rounded-xl"
                        style={{
                          background: s.taken ? 'rgba(230,57,70,0.07)' : 'rgba(48,209,88,0.07)',
                          border: `1px solid ${s.taken ? 'rgba(230,57,70,0.22)' : 'rgba(48,209,88,0.22)'}`,
                        }}
                      >
                        <Clock size={12} style={{ color: s.taken ? FIRE : GREEN }} />
                        <span style={{ fontSize: 11.5, fontWeight: 700, color: s.taken ? 'rgba(255,255,255,0.35)' : '#fff', textDecoration: s.taken ? 'line-through' : 'none' }}>
                          {s.time}
                        </span>
                        {!s.taken && !hasBooking && (
                          <button onClick={() => onBook(info, s.time)} className="px-2 py-1 rounded-lg font-black uppercase tracking-wide transition-transform hover:scale-105" style={{ background: `linear-gradient(135deg, ${GREEN}, #7CE495)`, color: '#052e12', fontSize: 8.5 }}>
                            Reservar
                          </button>
                        )}
                        {!s.taken && hasBooking && (
                          <span className="px-2 py-1 rounded-lg uppercase tracking-wide font-bold flex items-center gap-1" style={{ fontSize: 7.5, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)' }}>
                            <Lock size={8} /> Bloqueado
                          </span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
