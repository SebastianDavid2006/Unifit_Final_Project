import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Calendar, CheckCircle2, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { AuthShell } from '@/auth/components/AuthShell'
import { updateUser } from '@/auth/services/authService'
import logotipo from '@/assets/logo/logo.webp'
import missingIllustration from '@/assets/illustrations/characters/coach/coach_missing_fingerprint_and_signature.webp'
import successVideoDesktop from '@/assets/scenes/videos/desktop/registration_pending_dekstop.mp4'
import successVideoMobile from '@/assets/scenes/videos/mobile/registration_pending_mobile.mp4'

const FIRE = '#E63946'
const AMBER = '#F5A623'
const GREEN = '#30D158'

type OnboardingPhase = 'intro' | 'schedule' | 'success'

const COLOMBIAN_HOLIDAYS_2026 = new Map([
  ['2026-01-01', 'Año Nuevo'],
  ['2026-01-06', 'Reyes Magos'],
  ['2026-03-23', 'San José'],
  ['2026-04-02', 'Jueves Santo'],
  ['2026-04-03', 'Viernes Santo'],
  ['2026-05-01', 'Día del Trabajo'],
  ['2026-06-15', 'Corpus Christi'],
  ['2026-06-22', 'Sagrado Corazón'],
  ['2026-07-06', 'San Pedro y San Pablo'],
  ['2026-07-20', 'Independencia'],
  ['2026-08-07', 'Batalla de Boyacá'],
  ['2026-08-17', 'Asunción de la Virgen'],
  ['2026-10-12', 'Día de la Raza'],
  ['2026-11-02', 'Todos los Santos'],
  ['2026-11-16', 'Independencia de Cartagena'],
  ['2026-12-08', 'Inmaculada Concepción'],
  ['2026-12-25', 'Navidad'],
])

interface DaySlot {
  time: string
  available: boolean
}

interface DayInfo {
  date: Date
  isToday: boolean
  isPast: boolean
  isHoliday: boolean
  holidayName?: string
  slots: DaySlot[]
}

const AVAILABLE_HOURS = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00']

function generateDayInfo(date: Date, today: Date): DayInfo {
  const dateStr = date.toISOString().split('T')[0]
  const isToday = date.toDateString() === today.toDateString()
  const isPast = date < today && !isToday
  const isHoliday = COLOMBIAN_HOLIDAYS_2026.has(dateStr)
  const holidayName = COLOMBIAN_HOLIDAYS_2026.get(dateStr)
  const dayOfWeek = date.getDay()

  const slots: DaySlot[] = AVAILABLE_HOURS.map(time => ({
    time,
    available: !isPast && !isHoliday && dayOfWeek !== 0 && Math.random() > 0.3
  }))

  return { date, isToday, isPast, isHoliday, holidayName, slots }
}

function formatDateKey(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function OnboardingPage({ session, onComplete, onBack }: OnboardingPageProps) {
  const [phase, setPhase] = useState<OnboardingPhase>('intro')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<DayInfo | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const today = useMemo(() => new Date(), [])

  useEffect(() => {
    if (phase === 'success' && videoRef.current) {
      videoRef.current.muted = true
      videoRef.current.play().catch(() => {})
      const t = setTimeout(() => {
        videoRef.current!.muted = false
        videoRef.current!.play().catch(() => {})
      }, 300)
      return () => clearTimeout(t)
    }
  }, [phase])

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDay = firstDay.getDay()
    const days: (DayInfo | null)[] = []

    for (let i = 0; i < startDay; i++) days.push(null)
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(generateDayInfo(new Date(year, month, d), today))
    }
    return days
  }, [currentMonth, today])

  const handleDayClick = (day: DayInfo | null) => {
    if (!day || day.isPast || day.isHoliday || day.slots.every(s => !s.available)) return
    setSelectedDay(day)
    setSelectedTime(null)
    setShowConfirmModal(false)
  }

  const handleTimeClick = (time: string, available: boolean) => {
    if (!available) return
    setSelectedTime(time)
    setShowConfirmModal(true)
  }

  const handleConfirmBooking = async () => {
    if (!selectedDay || !selectedTime) return
    setShowConfirmModal(false)
    setShowSuccessModal(true)

    await updateUser(session.user.email, {
      onboarding: { cita: true, firma: true, huella: true },
      estado: 'activo',
      cita: { fecha: formatDateKey(selectedDay.date), hora: selectedTime }
    })

    setTimeout(() => {
      setShowSuccessModal(false)
      setPhase('success')
    }, 1500)
  }

  const handleSuccessContinue = () => {
    onComplete()
  }

  const prevMonth = () => setCurrentMonth(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  const nextMonth = () => setCurrentMonth(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))
  const monthLabel = currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })

  return (
    <AuthShell onBack={onBack} autoDesktopVideo>
      {(ctx) => (
        <div className={`flex-1 min-h-0 overflow-y-auto flex flex-col ${ctx.isPhonePreview ? 'px-5' : 'px-6 sm:px-10'}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col flex-1 max-w-xl mx-auto w-full"
            >
              {phase === 'intro' && (
                <div className="flex flex-col flex-1 items-center justify-center text-center">
                  <div className="flex items-center justify-center mb-8">
                    <img src={logotipo} alt="UNIFIT" style={{ height: 56, objectFit: 'contain' }} />
                  </div>

                  <motion.img
                    src={missingIllustration}
                    alt="Onboarding"
                    className="w-full max-w-[400px] mb-8 object-contain"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  />

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="uppercase italic font-black text-white mb-4"
                    style={{ fontSize: 'clamp(24px, 4vw, 32px)', letterSpacing: '0.04em' }}
                  >
                    Te faltan unos pasos más
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-lg max-w-sm font-semibold"
                    style={{ color: '#7ec8e3', lineHeight: 1.4 }}
                  >
                    para experimentar la app UNIFIT
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-sm max-w-sm mt-3"
                    style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}
                  >
                    Agenda tu cita de valoración inicial y desbloquea tu acceso al gimnasio
                  </motion.p>

                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPhase('schedule')}
                    className="mt-10 w-full max-w-[280px] h-14 rounded-2xl text-base font-bold text-white flex items-center justify-center gap-2 cursor-pointer"
                    style={{ background: `linear-gradient(135deg, ${FIRE}, ${AMBER})`, boxShadow: `0 10px 30px ${FIRE}40` }}
                  >
                    Agendar mi cita
                    <ArrowRight size={18} />
                  </motion.button>
                </div>
              )}

              {phase === 'schedule' && (
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center justify-center mb-8">
                      <img src={logotipo} alt="UNIFIT" style={{ height: 48, objectFit: 'contain' }} />
                    </div>
                  </div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="uppercase italic font-black text-white mb-2 text-center"
                    style={{ fontSize: 'clamp(22px, 3.5vw, 28px)', letterSpacing: '0.04em' }}
                  >
                    Agenda tu valoración
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-sm text-center mb-6"
                    style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}
                  >
                    Selecciona día y hora para tu primera valoración física
                  </motion.p>

                  <div className="rounded-2xl mb-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={prevMonth}
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)' }}
                      >
                        <ChevronLeft size={20} />
                      </motion.button>
                      <span className="font-black text-white capitalize" style={{ fontSize: 16 }}>{monthLabel}</span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={nextMonth}
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)' }}
                      >
                        <ChevronRight size={20} />
                      </motion.button>
                    </div>

                    <div className="grid grid-cols-7 gap-0.5 p-2">
                      {['D', 'L', 'M', 'X', 'J', 'V', 'S'].map((d, i) => (
                        <div key={d} className="h-8 flex items-center justify-center text-[10px] font-bold uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>
                          {d}
                        </div>
                      ))}
                      {daysInMonth.map((day, i) => (
                        <motion.button
                          key={day ? formatDateKey(day.date) : `empty-${i}`}
                          whileHover={{ scale: day && !day.isPast && !day.isHoliday && day.slots.some(s => s.available) ? 1.05 : 1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => day && handleDayClick(day)}
                          disabled={!day || day.isPast || day.isHoliday || day.slots.every(s => !s.available)}
                          className="relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all"
                          style={{
                            background: day && !day.isPast && !day.isHoliday && day.slots.some(s => s.available)
                              ? (selectedDay?.date.getTime() === day.date.getTime() ? `linear-gradient(135deg, ${FIRE}, ${AMBER})` : 'rgba(255,255,255,0.04)')
                              : 'transparent',
                            border: day && !day.isPast && !day.isHoliday && day.slots.some(s => s.available)
                              ? (selectedDay?.date.getTime() === day.date.getTime() ? 'none' : '1px solid rgba(255,255,255,0.08)')
                              : 'none',
                            color: day?.isToday ? '#7ec8e3' : day?.isPast || day?.isHoliday || day?.slots.every(s => !s.available) ? 'rgba(255,255,255,0.15)' : '#fff',
                            opacity: day?.isPast || day?.isHoliday || day?.slots.every(s => !s.available) ? 0.4 : 1,
                          }}
                        >
                          <span style={{ fontSize: day?.isToday ? 15 : 13, fontWeight: day?.isToday ? 800 : 500 }}>
                            {day?.date.getDate()}
                          </span>
                          {day?.isToday && <span className="w-2 h-2 rounded-full mt-1" style={{ background: '#7ec8e3' }} />}
                          {day?.isHoliday && <span className="text-[8px] mt-1" style={{ color: AMBER }}>🎉</span>}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {selectedDay && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="rounded-2xl p-4 mb-6"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(230,57,70,0.15)', border: '1px solid rgba(230,57,70,0.3)' }}>
                          <Calendar size={24} style={{ color: FIRE }} />
                        </div>
                        <div>
                          <p className="font-black text-white" style={{ fontSize: 16 }}>
                            {selectedDay.date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                            {selectedDay.isToday && <span className="ml-2 text-[10px] font-bold" style={{ color: '#7ec8e3' }}>Hoy</span>}
                          </p>
                          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                            {selectedDay.slots.filter(s => s.available).length} horarios disponibles
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-2">
                        {selectedDay.slots.map(slot => (
                          <motion.button
                            key={slot.time}
                            whileHover={slot.available ? { scale: 1.05 } : {}}
                            whileTap={slot.available ? { scale: 0.95 } : {}}
                            onClick={() => handleTimeClick(slot.time, slot.available)}
                            disabled={!slot.available}
                            className="aspect-square rounded-xl font-bold text-sm transition-all"
                            style={{
                              background: selectedTime === slot.time
                                ? `linear-gradient(135deg, ${FIRE}, ${AMBER})`
                                : slot.available
                                ? 'rgba(255,255,255,0.05)'
                                : 'rgba(255,255,255,0.02)',
                              border: selectedTime === slot.time
                                ? 'none'
                                : slot.available
                                ? '1px solid rgba(255,255,255,0.08)'
                                : '1px solid rgba(255,255,255,0.03)',
                              color: slot.available ? (selectedTime === slot.time ? '#fff' : '#fff') : 'rgba(255,255,255,0.15)',
                              opacity: slot.available ? 1 : 0.4,
                            }}
                          >
                            {slot.time}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-auto pt-6"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setPhase('intro')}
                      className="w-full h-14 rounded-2xl text-base font-bold flex items-center justify-center gap-2 cursor-pointer"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '2px solid rgba(255,255,255,0.15)', color: '#fff' }}
                    >
                      <ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} />
                      Volver
                    </motion.button>
                  </motion.div>
                </div>
              )}

              {phase === 'success' && (
                <div className="flex flex-col flex-1 items-center justify-center text-center relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    loop
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    style={{ opacity: 0.3 }}
                  >
                    <source src={ctx.isPhonePreview ? successVideoMobile : successVideoDesktop} type="video/mp4" />
                  </video>

                  <div className="relative z-10 flex flex-col flex-1 items-center justify-center px-6">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                      className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                      style={{ background: `linear-gradient(135deg, ${GREEN}, #7CE495)`, boxShadow: `0 10px 30px ${GREEN}40` }}
                    >
                      <CheckCircle2 size={32} style={{ color: '#04110a' }} />
                    </motion.div>

                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="uppercase italic font-black text-white mb-3"
                      style={{ fontSize: 'clamp(24px, 4vw, 32px)', letterSpacing: '0.04em' }}
                    >
                      ¡Listo!
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="text-lg max-w-sm"
                      style={{ color: '#7ec8e3', fontWeight: 600 }}
                    >
                      Tu cita fue agendada
                    </motion.p>

                    {selectedDay && selectedTime && (
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="text-sm max-w-sm mt-2 font-medium"
                        style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}
                      >
                        {selectedDay.date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })} a las {selectedTime}
                      </motion.p>
                    )}

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="text-sm max-w-sm mt-4"
                      style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}
                    >
                      Te esperamos para tu valoración inicial. Recibirás un recordatorio.
                    </motion.p>

                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSuccessContinue}
                      className="mt-10 w-full max-w-[280px] h-14 rounded-2xl text-base font-bold text-white flex items-center justify-center gap-2 cursor-pointer"
                      style={{ background: `linear-gradient(135deg, ${GREEN}, #7CE495)`, boxShadow: `0 10px 30px ${GREEN}40` }}
                    >
                      Continuar a UNIFIT
                      <ArrowRight size={18} />
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {showConfirmModal && selectedDay && selectedTime && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
                onClick={() => setShowConfirmModal(false)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  onClick={e => e.stopPropagation()}
                  className="w-full max-w-sm rounded-3xl p-6 text-center"
                  style={{ background: '#12121C', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}
                >
                  <div className="mx-auto mb-4 w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${FIRE}, ${AMBER})` }}>
                    <Calendar size={28} style={{ color: '#fff' }} />
                  </div>
                  <h3 className="uppercase italic font-black text-white mb-2" style={{ fontSize: 20, letterSpacing: '0.02em' }}>
                    Confirmar cita
                  </h3>
                  <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {selectedDay.date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </p>
                  <p className="text-xl font-black mb-6" style={{ color: '#7ec8e3' }}>
                    {selectedTime}
                  </p>
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ background: 'rgba(255,255,255,0.1)' }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setShowConfirmModal(false)}
                      className="flex-1 py-3 rounded-xl font-bold text-white"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleConfirmBooking}
                      className="flex-1 py-3 rounded-xl font-black text-white"
                      style={{ background: `linear-gradient(135deg, ${FIRE}, ${AMBER})`, boxShadow: `0 8px 24px ${FIRE}40` }}
                    >
                      Confirmar
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showSuccessModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  className="w-full max-w-sm rounded-3xl p-6 text-center"
                  style={{ background: '#12121C', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}
                >
                  <div className="mx-auto mb-4 w-14 h-14 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${GREEN}, #7CE495)` }}>
                    <CheckCircle2 size={28} style={{ color: '#04110a' }} />
                  </div>
                  <h3 className="uppercase italic font-black text-white mb-2" style={{ fontSize: 20, letterSpacing: '0.02em' }}>
                    ¡Cita agendada!
                  </h3>
                  <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    Tu valoración ha sido programada exitosamente.
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AuthShell>
  )
}

interface SessionUser {
  id_usuario: string
  email: string
  nombre: string
  rol: 'admin' | 'entrenador' | 'usuario'
  tipo_usuario: 'estudiante' | 'profesor' | 'administrativo'
  estado: 'pendiente' | 'activo' | 'inactivo'
  debeCambiarContrasena: boolean
}

interface OnboardingPageProps {
  session: {
    user: SessionUser
    token: string
  }
  onComplete: () => void
  onBack: () => void
}