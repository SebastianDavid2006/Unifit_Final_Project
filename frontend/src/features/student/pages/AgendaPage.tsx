import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Calendar, ChevronLeft, ChevronRight, Clock, User } from 'lucide-react'
import { useAuthLayout } from '@/auth/hooks/useAuthLayout'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const RED = '#E63946'
const BLUE = '#007AFF'
const YELLOW = '#F5A623'
const GREEN = '#30D158'
const DARK_BG = '#0A0A14'

const mockAppointments = [
  { id: 1, title: 'Sesion Full Body', time: '07:00', duration: '60 min', trainer: 'Carlos Ruiz', type: 'workout', color: '#E63946' },
  { id: 2, title: 'Valoracion Fisica', time: '09:00', duration: '45 min', trainer: 'Laura Gomez', type: 'assessment', color: '#1270B7' },
  { id: 3, title: 'Sesion Cardio', time: '18:30', duration: '45 min', trainer: 'Ana', type: 'workout', color: '#30D158' },
  { id: 4, title: 'Sesion Fuerza', time: '07:00', duration: '60 min', trainer: 'Carlos Ruiz', type: 'workout', color: '#E63946' },
  { id: 5, title: 'Revision Progreso', time: '10:00', duration: '30 min', trainer: 'Laura Gomez', type: 'checkup', color: '#F5A623' },
]

const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const weekDays = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']

export function AgendaPage() {
  const layout = useAuthLayout()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState('month')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
  const startingDay = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const prevMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  const nextMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))
  const today = new Date()

  const appointmentsForDate = (date: Date) => {
    const day = date.getDate()
    return mockAppointments.filter((_, i) => (i + 1) === day || (i + 1) === day + 7 || (i + 1) === day + 14)
  }

  const isToday = (date: Date) => date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()

  const isSelected = (date: Date) => selectedDate && date.getDate() === selectedDate.getDate() && date.getMonth() === selectedDate.getMonth() && date.getFullYear() === selectedDate.getFullYear()

  return (
    <div className="size-full flex items-center justify-center" style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(245,166,35,0.06) 0%, rgba(10,10,20,1) 60%)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-[0.03]" style={{ background: 'radial-gradient(circle, #F5A623, transparent 70%)', animation: 'breathe 6s ease-in-out infinite' }} />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full opacity-[0.02]" style={{ background: 'radial-gradient(circle, #007AFF, transparent 70%)', animation: 'breathe 8s ease-in-out infinite', animationDelay: '-3s' }} />
      </div>
      <div className="relative flex flex-col overflow-hidden" style={{ width: '100%', height: '100%', borderRadius: 0, background: DARK_BG }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 rounded-b-2xl z-50" style={{ background: 'rgba(0,0,0,0.85)' }}>
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-2.5 rounded-full" style={{ background: '#151520' }} />
        </div>
        <div className="flex-1 overflow-hidden pt-7">
          <div className="px-5 pb-4 flex items-center justify-between">
            <h1 className="text-white" style={{ fontSize: 20, fontWeight: 700 }}>Agenda</h1>
            <div className="flex items-center gap-1">
              {['month', 'week', 'day'].map(v => (
                <button key={v} onClick={() => setView(v)} className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                  style={{ background: view === v ? 'rgba(245,166,35,0.15)' : 'transparent', color: view === v ? '#F5A623' : 'rgba(255,255,255,0.35)', border: view === v ? '1px solid rgba(245,166,35,0.25)' : '1px solid transparent' }}>
                  {v === 'month' ? 'Mes' : v === 'week' ? 'Semana' : 'Dia'}
                </button>
              ))}
            </div>
          </div>
          <AnimatePresence mode="wait">
            {view === 'month' && (
              <motion.div key="month" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full overflow-y-auto px-5 pb-20">
                <div className="flex items-center justify-between mb-4">
                  <motion.button whileTap={{ scale: 0.95 }} onClick={prevMonth} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                  </motion.button>
                  <div className="flex-1 text-center"><h2 className="text-white" style={{ fontSize: 20, fontWeight: 700 }}>{monthNames[currentMonth]} {currentYear}</h2></div>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={nextMonth} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                  </motion.button>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekDays.map(day => <div key={day} className="h-8 flex items-center justify-center text-xs font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from(Array(startingDay)).map((_, i) => <div key={'empty-' + i} className="aspect-square" />)}
                  {Array.from(Array(daysInMonth)).map((_, i) => {
                    const day = i + 1
                    const date = new Date(currentYear, currentMonth, day)
                    const appointments = appointmentsForDate(date)
                    return (
                      <motion.button key={day} onClick={() => setSelectedDate(date)} whileTap={{ scale: 0.95 }} className="relative aspect-square rounded-xl flex flex-col items-start justify-start p-2"
                        style={{ background: isSelected(date) ? '#F5A62320' : isToday(date) ? '#F5A62310' : 'rgba(255,255,255,0.02)', border: isSelected(date) ? '1px solid #F5A623' : isToday(date) ? '1px solid #F5A623' : '1px solid rgba(255,255,255,0.04)' }}>
                        <span style={{ color: isToday(date) ? '#F5A623' : isSelected(date) ? '#F5A623' : 'white', fontSize: 13, fontWeight: isToday(date) || isSelected(date) ? 700 : 500 }}>{day}</span>
                        <div className="mt-1 flex flex-col gap-1 max-h-16 overflow-hidden">
                          {appointments.slice(0, 3).map((apt, idx) => <div key={idx} className="text-[9px] px-1.5 py-0.5 rounded truncate" style={{ background: apt.color + '20', color: apt.color, fontSize: 8, fontWeight: 600 }}>{apt.time} {apt.title}</div>)}
                          {appointments.length > 3 && <div className="text-[9px] text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>+{appointments.length - 3} mas</div>}
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>
            )}
            {view === 'week' && (
              <motion.div key="week" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full overflow-y-auto px-5 pb-20">
                <div className="flex items-center justify-between mb-4">
                  <motion.button whileTap={{ scale: 0.95 }} onClick={prevMonth} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                  </motion.button>
                  <div className="flex-1 text-center"><h2 className="text-white" style={{ fontSize: 20, fontWeight: 700 }}>Semana {format(currentDate, 'w', { locale: es })} {format(currentDate, 'MMMM yyyy', { locale: es })}</h2></div>
                  <button className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {[0, 1, 2, 3, 4, 5, 6].map(offset => {
                    const date = new Date(currentDate)
                    date.setDate(currentDate.getDate() - currentDate.getDay() + offset)
                    const appointments = appointmentsForDate(date)
                    const isTodayDate = isToday(date)
                    return (
                      <motion.div key={offset} className="flex flex-col h-72 overflow-hidden rounded-2xl" style={{ background: isToday(date) ? '#F5A62310' : 'rgba(255,255,255,0.02)', border: isToday(date) ? '1px solid #F5A623' : '1px solid rgba(255,255,255,0.04)' }}>
                        <div className="px-3 py-2 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <span style={{ color: isToday(date) ? '#F5A623' : 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600 }}>{weekDays[date.getDay()]}</span>
                          <span style={{ color: isToday(date) ? '#F5A623' : 'white', fontSize: 16, fontWeight: 700 }}>{date.getDate()}</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-1">
                          {appointments.map((apt, idx) => (
                            <div key={idx} className="px-2 py-1.5 rounded-xl text-xs" style={{ background: apt.color + '20', color: apt.color, fontSize: 10, fontWeight: 600 }}>
                              <div className="flex items-center gap-1 mb-0.5"><span>{apt.time}</span><span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9 }}>{apt.duration}</span></div>
                              <div className="truncate font-medium">{apt.title}</div>
                              <div className="flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 8 }}><User size={8} />{apt.trainer}</div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )}
            {view === 'day' && (
              <motion.div key="day" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full overflow-y-auto px-5 pb-20">
                <div className="flex items-center justify-between mb-4">
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => setCurrentDate(d => { const nd = new Date(d); nd.setDate(nd.getDate() - 1); return nd })} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                  </motion.button>
                  <div className="flex-1 text-center"><h2 className="text-white" style={{ fontSize: 20, fontWeight: 700 }}>{format(currentDate, 'EEEE, d MMMM yyyy', { locale: es })}</h2></div>
                  <button className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                  </button>
                </div>
                <div className="space-y-3">
                  {mockAppointments.map((apt, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: apt.color + '15', color: apt.color }}><Clock size={20} /></div>
                      <div className="flex-1 min-w-0"><p className="text-white font-semibold truncate">{apt.title}</p><p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>{apt.time} · {apt.duration}</p></div>
                      <div className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}><User size={14} />{apt.trainer}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            {selectedDate && (
              <AnimatePresence>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-0 left-0 right-0 z-40">
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="fixed bottom-0 left-0 right-0 z-40 rounded-t-3xl p-5 max-h-[60vh] overflow-y-auto" style={{ background: '#0A0A14', borderTop: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 -10px 40px rgba(0,0,0,0.3)' }}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-bold">Citas para {format(selectedDate, 'EEEE, d MMMM', { locale: es })}</h3>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setSelectedDate(null)} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
                        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                      </motion.button>
                    </div>
                    <div className="space-y-2">
                      {appointmentsForDate(selectedDate).map((apt, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: apt.color + '10', border: '1px solid ' + apt.color + '20' }}>
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: apt.color + '15', color: apt.color }}><Clock size={20} /></div>
                          <div className="flex-1 min-w-0"><p className="text-white font-semibold truncate">{apt.title}</p><p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>{apt.time} · {apt.duration}</p></div>
                          <div className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}><User size={14} />{apt.trainer}</div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}