import { motion } from 'motion/react'
import { ChevronLeft, ChevronRight, Lock, Clock, CalendarCheck } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { DayAvailability } from '@/features/student/types/student'
import { cardStyle, FIRE, AMBER, GREEN } from '@/features/student/components/ui/fitness'
import { getDayInfo, offset } from '../agendaUtils'

interface DayViewProps {
  currentDate: Date
  onChangeDate: (delta: number) => void
  holidays: Map<string, string>
  /** true si hay una cita activa en la agenda */
  hasBooking: boolean
  isBookedDay: (d: Date) => boolean
  onBook: (info: DayAvailability, time: string) => void
}

export function DayView({ currentDate, onChangeDate, holidays, hasBooking, isBookedDay, onBook }: DayViewProps) {
  const info = getDayInfo(currentDate, holidays)

  return (
    <motion.div key="day" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3" style={hasBooking && !isBookedDay(currentDate) ? { opacity: 0.28, filter: 'blur(1.2px)' } : undefined}>
      <div className="flex items-center justify-between">
        <button onClick={() => onChangeDate(-1)} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}>
          <ChevronLeft size={19} />
        </button>
        <h2 className="uppercase italic font-black text-white capitalize text-center" style={{ fontSize: 15 }}>
          {format(currentDate, "EEEE d 'de' MMMM yyyy", { locale: es })}
        </h2>
        <button onClick={() => onChangeDate(1)} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}>
          <ChevronRight size={19} />
        </button>
      </div>

      {info.isCoachDay && !info.isHoliday ? (
        <div className="space-y-2">
          {info.slots.map((slot, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-3 p-3.5 rounded-2xl"
              style={{
                ...cardStyle,
                borderColor: slot.taken ? 'rgba(230,57,70,0.2)' : 'rgba(48,209,88,0.24)',
                background: slot.taken ? 'linear-gradient(160deg, rgba(230,57,70,0.06), rgba(255,255,255,0.015))' : 'linear-gradient(160deg, rgba(48,209,88,0.06), rgba(255,255,255,0.015))',
              }}
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: slot.taken ? 'rgba(230,57,70,0.1)' : 'rgba(48,209,88,0.1)' }}>
                <Clock size={20} style={{ color: slot.taken ? FIRE : GREEN }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-black" style={{ fontSize: 15 }}>{slot.time}</p>
                <p style={{ color: slot.taken ? FIRE : GREEN, fontSize: 11 }}>{slot.taken ? 'Cupo ocupado' : 'Cupo libre'}</p>
              </div>
              {!slot.taken && !hasBooking && (
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => onBook(info, slot.time)} className="px-4 py-2 rounded-xl font-black uppercase tracking-wider" style={{ background: `linear-gradient(135deg, ${GREEN}, #7CE495)`, color: '#052e12', fontSize: 10 }}>
                  Reservar
                </motion.button>
              )}
              {!slot.taken && hasBooking && (
                <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl uppercase tracking-wider font-bold" style={{ fontSize: 9, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)' }}>
                  <Lock size={11} /> Bloqueado
                </span>
              )}
            </motion.div>
          ))}
        </div>
      ) : info.isHoliday ? (
        <div className="flex flex-col items-center py-12 rounded-3xl" style={cardStyle}>
          <Lock size={36} style={{ color: AMBER, marginBottom: 12 }} />
          <p className="text-white font-bold" style={{ fontSize: 15 }}>Festivo — {info.holidayName}</p>
          <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12, marginTop: 4 }}>El gimnasio no abre hoy</p>
        </div>
      ) : (
        <div className="flex flex-col items-center py-12 rounded-3xl" style={cardStyle}>
          <CalendarCheck size={36} style={{ marginBottom: 12, opacity: 0.4, color: 'rgba(255,255,255,0.5)' }} />
          <p className="text-white font-bold" style={{ fontSize: 15 }}>Sin agenda este día</p>
          <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12, marginTop: 4 }}>El entrenador descansa</p>
        </div>
      )}
    </motion.div>
  )
}
