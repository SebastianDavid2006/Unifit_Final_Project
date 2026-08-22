import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronLeft, ChevronRight, Lock, Clock, User, CalendarCheck, CheckCircle2, XCircle } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { DayAvailability } from '@/features/student/types/student'
import { SectionTitle, cardStyle, FIRE, AMBER, BLUE, GREEN } from '@/features/student/components/ui/fitness'

const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const weekDaysShort = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

/* Horario del entrenador */
const COACH_SCHEDULE: Record<number, string[]> = {
  0: [],                                  // Domingo cerrado
  1: ['06:00', '07:00', '08:00', '16:00', '17:00', '18:00'],
  2: ['06:00', '07:00', '17:00', '18:00', '19:00'],
  3: ['07:00', '08:00', '16:00', '17:00'],
  4: ['06:00', '07:00', '08:00', '18:00', '19:00'],
  5: ['06:00', '09:00', '10:00'],
  6: ['09:00', '10:00'],                  // Sábado medio día
}

/* Festivos Colombia (Emiliani) — cálculo con Pascua */
function easterSunday(year: number): Date {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(year, month - 1, day)
}

function offset(d: Date, days: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + days)
}

function colombianHolidays(year: number): Map<string, string> {
  const map = new Map<string, string>()
  const key = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
  const addFixed = (m: number, day: number, name: string, moveMonday: boolean) => {
    let d = new Date(year, m, day)
    if (moveMonday) d = offset(d, (8 - d.getDay()) % 7 || 7)
    map.set(key(d), name)
  }
  const addEasterBased = (days: number, name: string, moveMonday: boolean) => {
    let d = offset(easterSunday(year), days)
    if (moveMonday) d = offset(d, (8 - d.getDay()) % 7 || 7)
    map.set(key(d), name)
  }
  addFixed(0, 1, 'Año Nuevo', false)
  addFixed(0, 6, 'Reyes Magos', true)
  addFixed(2, 19, 'San José', true)
  addFixed(4, 1, 'Día del Trabajo', false)
  addFixed(6, 20, 'Independencia', false)
  addFixed(7, 7, 'Batalla de Boyacá', false)
  addEasterBased(-3, 'Jueves Santo', false)
  addEasterBased(-2, 'Viernes Santo', false)
  addEasterBased(43, 'Ascensión', true)
  addEasterBased(64, 'Corpus Christi', true)
  addEasterBased(71, 'Sagrado Corazón', true)
  addFixed(7, 15, 'Asunción', true)
  addFixed(9, 12, 'Día de la Raza', true)
  addFixed(10, 1, 'Todos los Santos', true)
  addFixed(10, 11, 'Independencia de Cartagena', true)
  addFixed(11, 8, 'Inmaculada Concepción', false)
  addFixed(11, 25, 'Navidad', false)
  return map
}

/* Determinista: mismos cupos ocupados para una fecha */
function hashDate(d: Date): number {
  return (d.getDate() * 7 + (d.getMonth() + 1) * 13 + d.getFullYear() * 3) % 97
}

function getDayInfo(date: Date, holidays: Map<string, string>): DayAvailability {
  const holidayName = holidays.get(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`)
  if (holidayName) return { date, isHoliday: true, holidayName, isCoachDay: false, slots: [] }
  const times = COACH_SCHEDULE[date.getDay()] || []
  if (times.length === 0) return { date, isHoliday: false, isCoachDay: false, slots: [] }
  const takenCount = hashDate(date) % times.length // nunca todos ocupados salvo forzado abajo
  const allFull = hashDate(date) % 11 === 5 // ~9% de días completamente llenos
  const slots = times.map((time, i) => ({
    time,
    taken: allFull ? true : i < takenCount,
  }))
  return { date, isHoliday: false, isCoachDay: true, slots }
}

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

  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  const startingDay = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  const sameDay = (a: Date, b: Date) =>
    a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()

  const weekStart = (d: Date) => offset(d, -d.getDay())
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

  const infoFor = (d: Date) => getDayInfo(d, holidays)

  const freeSlots = (info: DayAvailability) => info.slots.filter(s => !s.taken).length

  /* ---- Panel de detalle del día (responsive: columna en desktop, sheet en mobile) ---- */
  const DayDetail = ({ info }: { info: DayAvailability }) => (
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
          <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.55)' }}>
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
              {!slot.taken && !booked && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPendingBooking({ info, time: slot.time })}
                  className="px-4 py-2 rounded-xl font-black uppercase tracking-wider"
                  style={{ background: `linear-gradient(135deg, ${GREEN}, #7CE495)`, color: '#052e12', fontSize: 10 }}
                >
                  Reservar
                </motion.button>
              )}
              {!slot.taken && booked && (
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

  /* ---------------- VISTA MES ---------------- */
  const renderMonth = () => (
    <motion.div key="month" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
      <div className="flex items-center justify-between">
        <button onClick={() => setCurrentDate(new Date(currentYear, currentMonth - 1, 1))} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}>
          <ChevronLeft size={19} />
        </button>
        <h2 className="uppercase italic font-black text-white" style={{ fontSize: 18 }}>{monthNames[currentMonth]} {currentYear}</h2>
        <button onClick={() => setCurrentDate(new Date(currentYear, currentMonth + 1, 1))} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}>
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
              onClick={() => setSelected(sel ? null : info)}
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
                opacity: info.isHoliday ? 0.75 : 1,
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
              {booked && sameDay(date, booked.date) && (
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

  /* ---------------- VISTA SEMANA ---------------- */
  const baseWeek = weekStart(offset(currentDate, weekOffset * 7))
  const renderWeek = () => (
    <motion.div key="week" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
      <div className="flex items-center justify-between">
        <button onClick={() => setWeekOffset(w => w - 1)} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}>
          <ChevronLeft size={19} />
        </button>
        <h2 className="uppercase italic font-black text-white text-center" style={{ fontSize: 15 }}>
          {format(baseWeek, 'd MMM', { locale: es })} — {format(offset(baseWeek, 6), 'd MMM yyyy', { locale: es })}
        </h2>
        <button onClick={() => setWeekOffset(w => w + 1)} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}>
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
                border: `1px solid ${statusColor}30`,
                opacity: info.isHoliday ? 0.8 : 1,
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
                        {!s.taken && !booked && (
                          <button onClick={() => setPendingBooking({ info, time: s.time })} className="px-2 py-1 rounded-lg font-black uppercase tracking-wide transition-transform hover:scale-105" style={{ background: `linear-gradient(135deg, ${GREEN}, #7CE495)`, color: '#052e12', fontSize: 8.5 }}>
                            Reservar
                          </button>
                        )}
                        {!s.taken && booked && (
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

  /* ---------------- VISTA DÍA ---------------- */
  const renderDay = () => {
    const info = getDayInfo(currentDate, holidays)
    return (
      <motion.div key="day" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
        <div className="flex items-center justify-between">
          <button onClick={() => setCurrentDate(d => offset(d, -1))} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}>
            <ChevronLeft size={19} />
          </button>
          <h2 className="uppercase italic font-black text-white capitalize text-center" style={{ fontSize: 15 }}>
            {format(currentDate, "EEEE d 'de' MMMM yyyy", { locale: es })}
          </h2>
          <button onClick={() => setCurrentDate(d => offset(d, 1))} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}>
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
                {!slot.taken && !booked && (
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setPendingBooking({ info, time: slot.time })} className="px-4 py-2 rounded-xl font-black uppercase tracking-wider" style={{ background: `linear-gradient(135deg, ${GREEN}, #7CE495)`, color: '#052e12', fontSize: 10 }}>
                    Reservar
                  </motion.button>
                )}
                {!slot.taken && booked && (
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
                La agenda queda bloqueada mientras tengas una sesión activa.
              </p>
            </div>
            <button
              onClick={cancelSession}
              className="px-3.5 py-2 rounded-xl font-black uppercase tracking-wider transition-transform hover:scale-105"
              style={{ fontSize: 9, background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.35)', color: '#FF8FA3' }}
            >
              Cancelar sesión
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {view === 'month' && renderMonth()}
        {view === 'week' && renderWeek()}
        {view === 'day' && renderDay()}
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
              <DayDetail info={selected} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal: confirmación de reserva */}
      <AnimatePresence>
        {pendingBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end md:items-center justify-center md:p-6"
            style={{ background: 'rgba(0,0,0,0.74)', backdropFilter: 'blur(8px)' }}
            onClick={() => setPendingBooking(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              className="w-full md:max-w-sm rounded-t-3xl md:rounded-3xl p-6 text-center"
              style={{
                background: 'linear-gradient(165deg, #12121C, #0A0A14)',
                border: '1px solid rgba(48,209,88,0.28)',
                boxShadow: '0 -10px 80px rgba(0,0,0,0.6), 0 30px 90px rgba(48,209,88,0.12)',
              }}
            >
              <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center" style={{ background: GREEN + '14', border: `1px solid ${GREEN}40` }}>
                <CalendarCheck size={30} style={{ color: GREEN }} />
              </div>
              <h3 className="uppercase italic font-black text-white mt-4" style={{ fontSize: 18 }}>¿Reservar esta sesión?</h3>
              <p style={{ color: 'rgba(255,255,255,0.52)', fontSize: 12.5, marginTop: 6 }}>
                ¿Estás seguro que deseas reservar para esta fecha?
              </p>
              <div className="rounded-2xl p-4 mt-4" style={{ background: 'rgba(48,209,88,0.06)', border: '1px solid rgba(48,209,88,0.22)' }}>
                <p className="capitalize text-white font-black" style={{ fontSize: 14.5 }}>
                  {format(pendingBooking.info.date, "EEEE d 'de' MMMM yyyy", { locale: es })}
                </p>
                <p className="flex items-center justify-center gap-1.5" style={{ color: '#7CE495', fontSize: 12.5, fontWeight: 800, marginTop: 4 }}>
                  <Clock size={13} /> {pendingBooking.time} h
                </p>
              </div>
              <div className="flex gap-2.5 mt-5">
                <button
                  onClick={() => setPendingBooking(null)}
                  className="flex-1 py-3.5 rounded-2xl font-black uppercase tracking-wider"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.55)', fontSize: 11 }}
                >
                  Cancelar
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={confirmBooking}
                  className="flex-1 py-3.5 rounded-2xl font-black uppercase tracking-wider"
                  style={{ background: `linear-gradient(135deg, ${GREEN}, #7CE495)`, color: '#052e12', fontSize: 11, boxShadow: '0 14px 36px rgba(48,209,88,0.3)' }}
                >
                  Sí, reservar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal: reserva exitosa */}
      <AnimatePresence>
        {booked && successOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end md:items-center justify-center md:p-6"
            style={{ background: 'rgba(0,0,0,0.74)', backdropFilter: 'blur(8px)' }}
            onClick={() => setSuccessOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              onClick={e => e.stopPropagation()}
              className="w-full md:max-w-sm rounded-t-3xl md:rounded-3xl p-7 text-center relative overflow-hidden"
              style={{
                background: 'linear-gradient(170deg, #101A12, #0A0A14)',
                border: '1px solid rgba(48,209,88,0.35)',
                boxShadow: '0 -10px 80px rgba(0,0,0,0.6), 0 30px 100px rgba(48,209,88,0.15)',
              }}
            >
              {/* Brillos de fondo */}
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(70% 50% at 50% 0%, rgba(48,209,88,0.14), transparent 65%)' }} />

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 240, damping: 13, delay: 0.1 }}
                className="w-24 h-24 mx-auto rounded-full flex items-center justify-center relative z-10"
                style={{ background: `radial-gradient(circle at 32% 28%, rgba(48,209,88,0.3), ${GREEN}18)`, border: `2px solid ${GREEN}66`, boxShadow: '0 0 60px rgba(48,209,88,0.35)' }}
              >
                <CheckCircle2 size={46} style={{ color: GREEN, filter: 'drop-shadow(0 6px 14px rgba(48,209,88,0.6))' }} />
                <motion.span
                  className="absolute inset-0 rounded-full"
                  style={{ border: `2px solid ${GREEN}` }}
                  animate={{ scale: [1, 1.45], opacity: [0.55, 0] }}
                  transition={{ duration: 1.7, repeat: Infinity, ease: 'easeOut' }}
                />
              </motion.div>

              <h3
                className="uppercase italic font-black mt-5 relative z-10"
                style={{
                  fontSize: 26,
                  background: `linear-gradient(135deg, #B8FFCE, ${GREEN})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                ¡Listo! Agendada
              </h3>
              <p className="relative z-10" style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12.5, marginTop: 6 }}>
                Tu sesión quedó reservada con el entrenador
              </p>

              <div className="rounded-2xl p-4 mt-4 relative z-10" style={{ background: 'rgba(48,209,88,0.07)', border: '1px solid rgba(48,209,88,0.25)' }}>
                <p className="capitalize text-white font-black" style={{ fontSize: 14.5 }}>
                  {format(booked.date, "EEEE d 'de' MMMM yyyy", { locale: es })}
                </p>
                <p className="flex items-center justify-center gap-1.5" style={{ color: '#7CE495', fontSize: 12.5, fontWeight: 800, marginTop: 4 }}>
                  <Clock size={13} /> {booked.time} h
                </p>
              </div>

              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSuccessOpen(false)}
                className="w-full py-4 rounded-2xl font-black uppercase tracking-widest mt-5 relative z-10"
                style={{ background: `linear-gradient(135deg, ${GREEN}, #7CE495)`, color: '#052e12', fontSize: 12, boxShadow: '0 14px 40px rgba(48,209,88,0.32)' }}
              >
                ¡Genial!
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
