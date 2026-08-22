import { useState, Fragment } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronLeft, ChevronRight, Clock, Check, X, ArrowRight, ArrowLeft } from 'lucide-react'
import { dayLabels, dayLabelsGetDay, monthNames, DAY_GRAD } from './AgendaData'

const AGENDA_TIMES = ['07:00', '08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
const BLUE = '#1270B7'
const GREEN = '#22C55E'
const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #7ec8e3)'
const GREEN_GRAD = 'linear-gradient(135deg, #00fb64, #009b95)'

interface Slot { time: string; title: string; color: string }

type ViewMode = 'month' | 'week'

function buildDemoAgenda(): Record<string, Slot[]> {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()
  const last = new Date(y, m + 1, 0).getDate()
  const d = (day: number) => `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  const available = '#4ADE80'
  const agenda: Record<string, Slot[]> = {}
  for (let day = 1; day <= last; day++) {
    const start = (day * 3) % (AGENDA_TIMES.length - 2)
    agenda[d(day)] = AGENDA_TIMES.slice(start, start + 3).map((time) => ({
      time,
      title: 'Disponible',
      color: available,
    }))
  }
  return agenda
}

function fmtDate(dt: Date) {
  const y = dt.getFullYear()
  const m = String(dt.getMonth() + 1).padStart(2, '0')
  const dd = String(dt.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

function getMonthGrid(year: number, month: number): (Date | null)[][] {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const pad = first.getDay() === 0 ? 6 : first.getDay() - 1
  const weeks: (Date | null)[][] = []
  let wk: (Date | null)[] = []
  for (let i = 0; i < pad; i++) wk.push(null)
  for (let day = 1; day <= last.getDate(); day++) {
    const dt = new Date(year, month, day)
    wk.push(dt)
    if (wk.length === 7) { weeks.push(wk); wk = [] }
  }
  while (wk.length < 7) wk.push(null)
  if (wk.some(x => x)) weeks.push(wk)
  return weeks
}

function getWeekGrid(date: Date): Date[] {
  const day = date.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(date)
  monday.setDate(date.getDate() + diff)
  const week: Date[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    week.push(d)
  }
  return week
}

interface Props {
  onConfirm: (fecha: string, hora: string) => void
  onBack?: () => void
}

export default function SchedulePicker({ onConfirm, onBack }: Props) {
  const [agenda] = useState<Record<string, Slot[]>>(() => buildDemoAgenda())
  const [viewMonth, setViewMonth] = useState(new Date())
  const [viewMode, setViewMode] = useState<ViewMode>('month')
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [success, setSuccess] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const slotsOfDay = selectedDay ? (agenda[selectedDay] ?? []) : []
  const grid = getMonthGrid(viewMonth.getFullYear(), viewMonth.getMonth())
  const title = `${monthNames[viewMonth.getMonth()]} ${viewMonth.getFullYear()}`
  const weekGrid = getWeekGrid(viewMonth)
  const weekTitle = `${fmtDate(weekGrid[0]!)} - ${fmtDate(weekGrid[6]!)}`
  const currentTitle = viewMode === 'month' ? title : weekTitle
  const hasAvailableSlots = (dateStr: string) => (agenda[dateStr] ?? []).some(s => s.title === 'Disponible')

  const confirmSchedule = () => {
    if (!selectedDay || !selectedSlot) return
    setShowConfirm(true)
  }

  const executeSchedule = () => {
    if (!selectedDay || !selectedSlot) return
    setShowConfirm(false)
    setSuccess(true)
  }

  return (
    <div className="relative flex flex-col flex-1 min-h-0 overflow-hidden">
      <div className="flex flex-col items-center pt-2">
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Agenda del entrenador</p>
        <p className="text-[13px] font-bold mt-0.5 mb-2" style={{ color: '#fff' }}>
          Selecciona el día para tu cita
        </p>
      </div>

      <div className="flex flex-col items-center gap-1.5 mb-2">
        <div className="flex items-center gap-1">
          {(['month', 'week'] as const).map(v => (
            <button
              key={v}
              onClick={() => setViewMode(v)}
              className="px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
              style={{
                background: viewMode === v ? 'rgba(255,255,255,0.14)' : 'transparent',
                border: viewMode === v ? '1px solid rgba(255,255,255,0.22)' : '1px solid transparent',
                color: viewMode === v ? '#FFFFFF' : 'rgba(255,255,255,0.35)',
              }}
            >
              {v === 'month' ? 'Mes' : 'Semana'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMonth(prev => viewMode === 'month'
              ? new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
              : new Date(prev.getTime() - 7 * 24 * 60 * 60 * 1000)
            )}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            <ChevronLeft size={15} />
          </button>
          <span className="text-xs font-extrabold" style={{ color: '#fff' }}>{currentTitle}</span>
          <button
            onClick={() => setViewMonth(prev => viewMode === 'month'
              ? new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
              : new Date(prev.getTime() + 7 * 24 * 60 * 60 * 1000)
            )}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <div className="px-4 flex-1 min-h-0 overflow-y-auto">
        {viewMode === 'month' ? (
          <>
            <div className="grid grid-cols-7 mb-1">
              {dayLabels.map(d => (
                <div key={d} className="text-center text-[9px] font-bold py-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{d}</div>
              ))}
            </div>
            {grid.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7">
                {week.map((dt, di) => {
                  if (!dt) return <div key={di} className="aspect-square" />
                  const ds = fmtDate(dt)
                  const hasSlots = hasAvailableSlots(ds)
                  const isSel = selectedDay === ds
                  const isToday = ds === fmtDate(new Date())
                  return (
                    <motion.div
                      key={di}
                      whileHover={hasSlots ? { scale: 1.15, zIndex: 10 } : {}}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => {
                        if (!hasSlots) return
                        setSelectedDay(ds)
                        setSelectedSlot(null)
                        setConfirmed(false)
                      }}
                      className="relative aspect-square flex items-center justify-center rounded-lg cursor-pointer select-none"
                      style={{
                        background: isSel ? DAY_GRAD : hasSlots ? 'rgba(18,112,183,0.12)' : 'transparent',
                        border: isSel ? 'none' : '1px solid rgba(255,255,255,0.05)',
                        color: isSel ? '#fff' : hasSlots ? '#fff' : isToday ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.35)',
                        fontWeight: hasSlots || isSel ? 800 : 500,
                        fontSize: 12,
                      }}
                    >
                      {dt.getDate()}
                      {hasSlots && !isSel && (
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ background: '#7ec8e3' }} />
                      )}
                    </motion.div>
                  )
                })}
              </div>
            ))}
          </>
        ) : (
          <div className="pb-1">
            <div className="grid" style={{ gridTemplateColumns: '32px repeat(7, 1fr)' }}>
              <div />
              {weekGrid.map((dt, i) => (
                <div key={i} className="text-center py-1">
                  <div className="text-[9px] font-bold" style={{ color: 'rgba(255,255,255,0.35)' }}>{dayLabels[i]}</div>
                  <div className="text-[10px] font-extrabold mt-0.5" style={{ color: fmtDate(dt) === fmtDate(new Date()) ? '#7ec8e3' : 'rgba(255,255,255,0.55)' }}>{dt.getDate()}</div>
                </div>
              ))}
              {AGENDA_TIMES.map(t => (
                <Fragment key={t}>
                  <div className="flex items-center justify-end pr-1 text-[9px] font-bold" style={{ color: 'rgba(255,255,255,0.35)' }}>{t}</div>
                  {weekGrid.map(dt => {
                    const ds = fmtDate(dt)
                    const slot = (agenda[ds] ?? []).find(s => s.title === 'Disponible' && s.time === t)
                    const isSel = selectedDay === ds && selectedSlot === t
                    return (
                      <motion.button
                        key={ds + t}
                        whileHover={slot ? { scale: 1.06, zIndex: 10 } : {}}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (!slot) return
                          setSelectedDay(ds)
                          setSelectedSlot(t)
                        }}
                        className="h-12 flex items-center justify-center rounded-lg cursor-pointer select-none"
                        style={{
                          background: isSel ? 'rgba(18,112,183,0.28)' : slot ? 'rgba(18,112,183,0.12)' : 'transparent',
                          border: slot ? `1px solid ${isSel ? BLUE : 'rgba(126,200,227,0.35)'}` : '1px solid rgba(255,255,255,0.04)',
                        }}
                      >
                        {slot && <Clock size={14} style={{ color: slot.color }} />}
                      </motion.button>
                    )
                  })}
                </Fragment>
              ))}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedDay && !success && !confirmed && (
          <motion.div
            key="day-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 z-40 flex items-end sm:items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[320px] rounded-3xl p-5 flex flex-col gap-3"
              style={{
                background: '#12121E',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold" style={{ color: '#7ec8e3' }}>
                    {dayLabelsGetDay[new Date(selectedDay + 'T12:00:00').getDay()]}
                  </p>
                  <p className="text-sm font-extrabold" style={{ color: '#fff' }}>
                    {new Date(selectedDay + 'T12:00:00').getDate()} de {monthNames[new Date(selectedDay + 'T12:00:00').getMonth()]}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedDay(null)
                    setSelectedSlot(null)
                  }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  <X size={16} />
                </button>
              </div>
              <div className="h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <p className="text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.45)' }}>{selectedSlot ? 'Horario seleccionado' : 'Horarios disponibles'}</p>
              <div className="flex flex-col gap-2 max-h-[260px] overflow-y-auto pr-1">
                {slotsOfDay.filter(s => !selectedSlot || s.time === selectedSlot).map(s => {
                  const isSelSlot = selectedSlot === s.time
                  return (
                    <motion.button
                      key={s.time}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedSlot(s.time)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left cursor-pointer transition-all"
                      style={{
                        background: isSelSlot ? 'rgba(18,112,183,0.2)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${isSelSlot ? BLUE : 'rgba(255,255,255,0.08)'}`,
                      }}
                    >
                      <Clock size={14} style={{ color: s.color }} />
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-bold" style={{ color: '#fff' }}>{s.time}</div>
                        <div className="text-[10px] truncate" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.title}</div>
                      </div>
                      {isSelSlot && <Check size={15} color="#7ec8e3" strokeWidth={3} />}
                    </motion.button>
                  )
                })}
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={confirmSchedule}
                disabled={!selectedSlot}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
                style={{ background: selectedSlot ? BLUE_GRAD : 'rgba(255,255,255,0.1)', opacity: selectedSlot ? 1 : 0.5 }}
              >
                Confirmar cita
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showConfirm && !success && (
          <motion.div
            key="confirm-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[320px] rounded-3xl p-6 flex flex-col gap-4 text-center"
              style={{
                background: '#12121E',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
              }}
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: 'rgba(18,112,183,0.15)', border: '1px solid rgba(18,112,183,0.3)' }}>
                <Clock size={28} style={{ color: BLUE }} />
              </div>
              <div>
                <h3 className="text-lg font-extrabold" style={{ color: '#fff' }}>Confirmar reserva</h3>
                <p className="text-[13px] mt-2 leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  ¿Seguro que deseas agendar para el <span className="font-bold" style={{ color: '#fff' }}>{new Date(selectedDay + 'T12:00:00').getDate()} de {monthNames[new Date(selectedDay + 'T12:00:00').getMonth()]}</span> a las <span className="font-bold" style={{ color: '#fff' }}>{selectedSlot}</span>?
                </p>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={executeSchedule}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
                  style={{ background: BLUE_GRAD }}
                >
                  Confirmar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {success && (
          <motion.div
            key="success-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 30 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[320px] rounded-3xl p-8 flex flex-col items-center gap-4 text-center"
              style={{
                background: '#12121E',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 16 }}
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}
              >
                <Check size={32} color={GREEN} strokeWidth={3} />
              </motion.div>
              <div>
                <h3 className="text-lg font-extrabold" style={{ color: '#fff' }}>¡Cita agendada exitosamente!</h3>
                <p className="text-[13px] mt-2 leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Tu cita quedó reservada para el <span className="font-bold" style={{ color: '#fff' }}>{new Date(selectedDay + 'T12:00:00').getDate()} de {monthNames[new Date(selectedDay + 'T12:00:00').getMonth()]}</span> a las <span className="font-bold" style={{ color: '#fff' }}>{selectedSlot}</span>.<br />
                  El entrenador te confirmará los detalles.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setConfirmed(true)
                  setSuccess(false)
                }}
                className="w-full py-3 rounded-xl text-sm font-bold text-white cursor-pointer"
                style={{ background: GREEN_GRAD }}
              >
                Continuar
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!success && onBack && (
        <div className="flex-shrink-0 px-5 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBack}
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-xs font-medium cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}
            >
              <ArrowLeft size={14} />
              Volver
            </motion.button>
            <div className="flex-1" />
            <motion.button
              whileHover={selectedDay || confirmed ? { scale: 1.03 } : {}}
              whileTap={selectedDay || confirmed ? { scale: 0.97 } : {}}
              onClick={() => {
                if (confirmed) onConfirm(selectedDay!, selectedSlot!)
                else if (selectedDay) setShowConfirm(true)
              }}
              disabled={!selectedDay && !confirmed}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
              style={{ background: selectedDay || confirmed ? BLUE_GRAD : 'rgba(255,255,255,0.1)', opacity: selectedDay || confirmed ? 1 : 0.5 }}
            >
              {confirmed ? 'Finalizar' : selectedDay ? 'Confirmar' : 'Selecciona un horario'}
              <ArrowRight size={14} />
            </motion.button>
          </div>
        </div>
      )}
    </div>
  )
}
