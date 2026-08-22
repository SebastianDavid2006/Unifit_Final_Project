import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Lock, CheckCircle2 } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { DayAvailability } from '@/features/student/types/student'
import { SectionTitle, FIRE, AMBER, GREEN } from '@/features/student/components/ui/fitness'
import { colombianHolidays, offset, sameDay, weekStart, sessionDateTimeOf, HOURS_24_MS } from './agendaUtils'
import { MonthView } from './components/MonthView'
import { WeekView } from './components/WeekView'
import { DayView } from './components/DayView'
import { DayDetailSheet } from './components/DayDetailSheet'
import { BookingConfirmModal, BookingSuccessModal } from './components/BookingModals'

export function AgendaPage() {
  const today = useMemo(() => new Date(), [])
  const holidays = useMemo(() => {
    const y = today.getFullYear()
    const map = colombianHolidays(y)
    ;[...colombianHolidays(y + 1).entries()].forEach(([k, v]) => map.set(k, v))
    return map
  }, [today])

  const [currentDate, setCurrentDate] = useState<Date>(new Date(today.getFullYear(), today.getMonth(), 1))
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')
  const [selected, setSelected] = useState<DayAvailability | null>(null)
  const [weekOffset, setWeekOffset] = useState(0)

  /* ---- Flujo de reserva ---- */
  const [pendingBooking, setPendingBooking] = useState<{ info: DayAvailability; time: string } | null>(null)
  const [booked, setBooked] = useState<{ date: Date; time: string } | null>(null)
  const [successOpen, setSuccessOpen] = useState(false)

  const confirmBooking = () => {
    if (!pendingBooking) return
    setBooked({ date: pendingBooking.info.date, time: pendingBooking.time })
    setPendingBooking(null)
    setSelected(null)
    setSuccessOpen(true)
  }

  const cancelSession = () => {
    setBooked(null)
    setSuccessOpen(false)
  }

  /* Días distintos al de la cita activa se ven difuminados */
  const isBookedDay = (d: Date) => !!booked && sameDay(d, booked.date)

  /* Política de cancelación: mínimo 24 horas antes de la sesión */
  const canCancel = !!booked && sessionDateTimeOf(booked.date, booked.time).getTime() - Date.now() > HOURS_24_MS

  const baseWeek = weekStart(offset(currentDate, weekOffset * 7))

  return (
    <div className="space-y-4">
      <SectionTitle>Disponibilidad del entrenador</SectionTitle>

      {/* Switch de vista */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-2xl p-1" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {(['month', 'week', 'day'] as const).map(v => (
            <button
              key={v}
              onClick={() => { setView(v); setSelected(null) }}
              className="px-4 md:px-5 py-2 rounded-xl font-black uppercase tracking-wider transition-all"
              style={{
                background: view === v ? `linear-gradient(135deg, ${FIRE}, ${AMBER})` : 'transparent',
                color: view === v ? '#fff' : 'rgba(255,255,255,0.4)',
                fontSize: 10.5,
                boxShadow: view === v ? '0 8px 20px rgba(230,57,70,0.3)' : 'none',
              }}
            >
              {v === 'month' ? 'Mes' : v === 'week' ? 'Semana' : 'Día'}
            </button>
          ))}
        </div>
      </div>

      {/* Banner: sesión agendada — agenda bloqueada */}
      <AnimatePresence>
        {booked && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="rounded-2xl p-4 flex flex-wrap items-center gap-3"
            style={{ background: 'rgba(48,209,88,0.07)', border: '1px solid rgba(48,209,88,0.3)' }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(48,209,88,0.14)', border: '1px solid rgba(48,209,88,0.3)' }}>
              <CheckCircle2 size={19} style={{ color: GREEN }} />
            </div>
            <div className="flex-1 min-w-[190px]">
              <p className="text-white font-black capitalize" style={{ fontSize: 13 }}>
                Sesión agendada — {format(booked.date, "EEEE d 'de' MMMM", { locale: es })} · {booked.time}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: 11, marginTop: 2 }}>
                {canCancel
                  ? 'La agenda queda bloqueada mientras tengas una sesión activa.'
                  : 'Puedes cancelar hasta 24 horas antes de tu sesión — después queda bloqueada la cancelación.'}
              </p>
            </div>
            {canCancel ? (
              <button
                onClick={cancelSession}
                className="px-3.5 py-2 rounded-xl font-black uppercase tracking-wider transition-transform hover:scale-105"
                style={{ fontSize: 9, background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.35)', color: '#FF8FA3' }}
              >
                Cancelar sesión
              </button>
            ) : (
              <span
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold uppercase tracking-wider cursor-not-allowed"
                style={{ fontSize: 9, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.32)' }}
                title="Las cancelaciones requieren mínimo 24 horas de antelación"
              >
                <Lock size={11} />
                Cancelación no disponible
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {view === 'month' && (
          <MonthView
            key="month"
            currentDate={currentDate}
            onChangeMonth={delta => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + delta, 1))}
            today={today}
            holidays={holidays}
            selected={selected}
            onSelect={setSelected}
            hasBooking={!!booked}
            isBookedDay={isBookedDay}
          />
        )}
        {view === 'week' && (
          <WeekView
            key="week"
            baseWeek={baseWeek}
            onChangeWeek={delta => setWeekOffset(w => w + delta)}
            today={today}
            holidays={holidays}
            hasBooking={!!booked}
            isBookedDay={isBookedDay}
            onBook={(info, time) => setPendingBooking({ info, time })}
          />
        )}
        {view === 'day' && (
          <DayView
            key="day"
            currentDate={currentDate}
            onChangeDate={delta => setCurrentDate(d => offset(d, delta))}
            holidays={holidays}
            hasBooking={!!booked}
            isBookedDay={isBookedDay}
            onBook={(info, time) => setPendingBooking({ info, time })}
          />
        )}
      </AnimatePresence>

      {/* Detalle del día: modal solo en vista mes */}
      <AnimatePresence>
        {selected && view === 'month' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-6"
            style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)' }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              className="w-full md:max-w-md max-h-[80vh] overflow-y-auto rounded-t-3xl md:rounded-3xl"
              style={{
                background: 'linear-gradient(165deg, #12121C, #0A0A14)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 -10px 80px rgba(0,0,0,0.6)',
              }}
            >
              <DayDetailSheet
                info={selected}
                hasBooking={!!booked}
                onBook={time => setPendingBooking({ info: selected, time })}
                onClose={() => setSelected(null)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BookingConfirmModal
        pending={pendingBooking}
        onClose={() => setPendingBooking(null)}
        onConfirm={confirmBooking}
      />

      <BookingSuccessModal
        open={successOpen}
        booked={booked}
        onClose={() => setSuccessOpen(false)}
      />
    </div>
  )
}
