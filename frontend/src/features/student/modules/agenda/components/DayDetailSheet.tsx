import { motion } from 'motion/react'
import { Clock, Lock, CalendarCheck, XCircle } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { DayAvailability } from '@/features/student/types/student'
import { cardStyle, FIRE, AMBER, GREEN } from '@/features/student/components/ui/fitness'
import { freeSlots } from '../agendaUtils'

interface DayDetailSheetProps {
  info: DayAvailability
  hasBooking: boolean
  onBook: (time: string) => void
  onClose: () => void
}

export function DayDetailSheet({ info, hasBooking, onBook, onClose }: DayDetailSheetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 14 }}
      className="rounded-3xl overflow-hidden"
      style={cardStyle}
    >
      <div className="p-5 pb-4" style={{ background: 'linear-gradient(135deg, rgba(230,57,70,0.14), rgba(245,166,35,0.05))', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="uppercase italic font-black text-white capitalize" style={{ fontSize: 17 }}>
              {format(info.date, "EEEE d 'de' MMMM", { locale: es })}
            </p>
            {info.isHoliday ? (
              <p style={{ color: AMBER, fontSize: 11.5, marginTop: 3 }}>Festivo: {info.holidayName}</p>
            ) : info.isCoachDay ? (
              <p style={{ color: freeSlots(info) > 0 ? GREEN : FIRE, fontSize: 11.5, marginTop: 3 }}>
                {freeSlots(info) > 0 ? `${freeSlots(info)} cupos disponibles` : 'Sin cupos — agenda llena'}
              </p>
            ) : (
              <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 11.5, marginTop: 3 }}>El entrenador no abre agenda este día</p>
            )}
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.55)' }}>
            <XCircle size={17} />
          </button>
        </div>
      </div>

      {info.isCoachDay && (
        <div className="p-4 space-y-2">
          {info.slots.map((slot, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-3 p-3 rounded-2xl"
              style={{
                background: slot.taken ? 'rgba(230,57,70,0.05)' : 'rgba(48,209,88,0.05)',
                border: `1px solid ${slot.taken ? 'rgba(230,57,70,0.16)' : 'rgba(48,209,88,0.2)'}`,
              }}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: slot.taken ? 'rgba(230,57,70,0.1)' : 'rgba(48,209,88,0.1)' }}>
                <Clock size={18} style={{ color: slot.taken ? FIRE : GREEN }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold" style={{ fontSize: 14 }}>{slot.time}</p>
                <p style={{ color: slot.taken ? FIRE : GREEN, fontSize: 11 }}>
                  {slot.taken ? 'Ocupado' : 'Disponible'}
                </p>
              </div>
              {!slot.taken && !hasBooking && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onBook(slot.time)}
                  className="px-4 py-2 rounded-xl font-black uppercase tracking-wider"
                  style={{ background: `linear-gradient(135deg, ${GREEN}, #7CE495)`, color: '#052e12', fontSize: 10 }}
                >
                  Reservar
                </motion.button>
              )}
              {!slot.taken && hasBooking && (
                <span className="flex items-center gap-1 px-3 py-1.5 rounded-xl uppercase tracking-wider font-bold" style={{ fontSize: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)' }}>
                  <Lock size={9} /> Bloqueado
                </span>
              )}
            </motion.div>
          ))}
        </div>
      )}
      {info.isHoliday && (
        <div className="flex flex-col items-center py-8" style={{ color: 'rgba(255,255,255,0.35)' }}>
          <Lock size={34} style={{ color: AMBER, marginBottom: 10 }} />
          <p style={{ fontSize: 12.5 }}>No hay atención en días festivos</p>
        </div>
      )}
      {!info.isCoachDay && !info.isHoliday && (
        <div className="flex flex-col items-center py-8" style={{ color: 'rgba(255,255,255,0.35)' }}>
          <CalendarCheck size={34} style={{ marginBottom: 10, opacity: 0.4 }} />
          <p style={{ fontSize: 12.5 }}>Descanso del entrenador</p>
        </div>
      )}
    </motion.div>
  )
}
