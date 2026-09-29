import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Calendar, CheckCircle2, ArrowRight, ChevronLeft, ChevronRight, Lock, CalendarCheck } from 'lucide-react'
import { AuthShell } from '@/auth/components/AuthShell'
import { api } from '@/lib/api'
import { getCuposDisponibles, reservarCupo, obtenerFestivos, type FrontendCupo } from '@/services/agenda.service'
import { cerrarSesion, mapRolToPlatform } from '@/lib/auth'
import { useNavigate, useLocation } from 'react-router'
import logotipo from '@/assets/logo/logo.webp'
import successVideoDesktop from '@/assets/scenes/videos/desktop/registration_pending_dekstop.mp4'
import successVideoMobile from '@/assets/scenes/videos/mobile/registration_pending_mobile.mp4'

const FIRE = '#E63946'
const AMBER = '#F5A623'
const GREEN = '#30D158'

// Fases del onboarding, según la URL:
// - 'schedule' → /incorporacion: agenda para agendar la cita (aún sin cita).
// - 'waiting'  → /incorporacion/asistencia-presencial: cita ya agendada (espera).
// - 'success'  → sin uso (fase reservada, hoy nunca se activa).
type OnboardingPhase = 'schedule' | 'waiting' | 'success'

interface CupoSlot {
  id: string
  time: string
}

interface DayInfo {
  date: Date
  isToday: boolean
  isPast: boolean
  /** Sin cupos publicados no hay nada que agendar (misma regla que la agenda del estudiante) */
  isRestDay: boolean
  /** Festivo: el gimnasio no abre */
  isHoliday: boolean
  holidayName?: string
  slots: CupoSlot[]
}

function formatDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function makeDayInfo(date: Date, today: Date, cuposPorFecha: Map<string, CupoSlot[]>, holidayName?: string): DayInfo {
  const isToday = date.toDateString() === today.toDateString()
  const isPast = date < today && !isToday
  const slots = isPast ? [] : cuposPorFecha.get(formatDateKey(date)) ?? []
  // Sin cupos publicados no hay nada que agendar: se informa que no se publicaron.
  return { date, isToday, isPast, isHoliday: holidayName !== undefined, holidayName, isRestDay: slots.length === 0, slots }
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
  initialPhase?: 'schedule' | 'waiting'
  onComplete: () => void
  onBack: () => void
}

interface CitaResponse {
  id_agenda: string
  id_usuario: string
  id_creador: string
  id_cupo: string | null
  fecha: string
  hora_inicio: string
  tipo: string
  estado: string
  observaciones: string | null
  fecha_creacion: string
  fecha_modificacion: string
}

export function OnboardingPage({ session, initialPhase = 'schedule', onComplete, onBack }: OnboardingPageProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [phase, setPhase] = useState<OnboardingPhase>(() => {
    // Si el usuario llega directo a /incorporacion/asistencia-presencial,
    // se arranca en la fase de espera; si no, en la agenda.
    if (typeof window !== 'undefined' && window.location.pathname.includes('/asistencia-presencial')) {
      return 'waiting'
    }
    return 'schedule'
  })

  // Sync phase with URL pathname (handles all navigation: modal, browser back, direct links)
  useEffect(() => {
    const isWaitingRoute = location.pathname.includes('/asistencia-presencial')
    if (isWaitingRoute && phase !== 'waiting') {
      setPhase('waiting')
    } else if (!isWaitingRoute && phase === 'waiting') {
      setPhase('schedule')
    }
  }, [location.pathname, phase])

  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<DayInfo | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedCupoId, setSelectedCupoId] = useState<string | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [cupos, setCupos] = useState<FrontendCupo[]>([])
  const [loadingCupos, setLoadingCupos] = useState(false)
  const [cuposError, setCuposError] = useState<string | null>(null)
  const [bookError, setBookError] = useState<string | null>(null)
  const [citaCheck, setCitaCheck] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const today = useMemo(() => new Date(), [])

  const cuposPorFecha = useMemo(() => {
    const map = new Map<string, CupoSlot[]>()
    for (const c of cupos) {
      const key = c.fecha.slice(0, 10)
      const slots = map.get(key) ?? []
      slots.push({ id: c.id, time: c.horaInicio.slice(0, 5) })
      map.set(key, slots)
    }
    for (const slots of map.values()) slots.sort((a, b) => a.time.localeCompare(b.time))
    return map
  }, [cupos])

  // Días festivos del año visible y el siguiente (el usuario puede avanzar meses).
  const [holidays, setHolidays] = useState<Map<string, string>>(new Map())

  useEffect(() => {
    let activo = true
    const anio = currentMonth.getFullYear()
    Promise.all([obtenerFestivos(anio), obtenerFestivos(anio + 1)])
      .then(([anioActual, anioSiguiente]) => {
        if (!activo) return
        const map = new Map<string, string>()
        for (const f of [...anioActual, ...anioSiguiente]) map.set(f.date, f.name)
        setHolidays(map)
      })
      .catch(() => { if (activo) setHolidays(new Map()) })
    return () => { activo = false }
  }, [currentMonth])

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDay = firstDay.getDay()
    const days: (DayInfo | null)[] = []

    for (let i = 0; i < startDay; i++) days.push(null)
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d)
      days.push(makeDayInfo(date, today, cuposPorFecha, holidays.get(formatDateKey(date))))
    }
    return days
  }, [currentMonth, today, cuposPorFecha, holidays])

  // Check for existing cita on mount, when phase changes to schedule, and after a failed booking
  // Única consulta de cita pendiente: si el usuario ya agendó su valoración,
  // se redirige a la pantalla de espera (asistencia-presencial).
  // El 404 es la respuesta esperada cuando todavía no tiene cita.
  useEffect(() => {
    if (phase === 'schedule') {
      api.get('/usuarios/me/cita')
        .then(res => {
          const cita = res.data as CitaResponse
          if (cita && cita.fecha && cita.hora_inicio) {
            const hora = new Date(cita.hora_inicio).toTimeString().slice(0, 5)
            setSelectedDay(makeDayInfo(new Date(cita.fecha + 'T12:00:00'), today, new Map()))
            setSelectedTime(hora)
            setPhase('waiting')
            navigate('/incorporacion/asistencia-presencial', { replace: true })
          }
        })
        .catch(err => {
          if (err.response?.status !== 404) console.error(err)
        })
    }
  }, [phase, today, navigate, citaCheck])

  // Cargar los cupos reales publicados por el gimnasio (fuente única de disponibilidad)
  useEffect(() => {
    if (phase !== 'schedule') return
    let cancelled = false
    setLoadingCupos(true)
    setCuposError(null)
    getCuposDisponibles()
      .then(list => { if (!cancelled) setCupos(list) })
      .catch(() => { if (!cancelled) setCuposError('No se pudieron cargar los horarios disponibles') })
      .finally(() => { if (!cancelled) setLoadingCupos(false) })
    return () => { cancelled = true }
  }, [phase])

  const handleDayClick = (day: DayInfo | null) => {
    // Cualquier día de hoy en adelante se puede abrir, tenga o no cupos: si no
    // tiene, el panel de abajo informa que no se publicaron cupos. Los días
    // pasados y los festivos no se pueden agendar.
    if (!day || day.isPast || day.isHoliday) return
    setSelectedDay(day)
    setSelectedTime(null)
    setSelectedCupoId(null)
    setBookError(null)
    setShowConfirmModal(false)
  }

  const handleTimeClick = (slot: CupoSlot) => {
    setSelectedTime(slot.time)
    setSelectedCupoId(slot.id)
    setBookError(null)
    setShowConfirmModal(true)
  }

  const handleConfirmBooking = async () => {
    if (!selectedCupoId) return
    setShowConfirmModal(false)
    setBookError(null)

    try {
      await reservarCupo(selectedCupoId, 'valoracion')
      setShowSuccessModal(true)
      setTimeout(() => {
        setShowSuccessModal(false)
        setPhase('waiting')
        navigate('/incorporacion/asistencia-presencial', { replace: true })
      }, 1500)
    } catch (error) {
      const err = error as { response?: { data?: { mensaje?: string } } }
      const msg = err.response?.data?.mensaje
      setBookError(msg || 'No se pudo agendar la cita. Elige otro horario.')
      getCuposDisponibles().then(setCupos).catch(() => {})
      setCitaCheck(t => t + 1)
    }
  }

  const handleSuccessContinue = () => {
    const platform = mapRolToPlatform(session.user.rol)
    if (platform === 'student') navigate('/usuario/inicio')
    else if (platform === 'trainer') navigate('/entrenador/dashboard')
    else navigate('/admin/dashboard')
  }

  const prevMonth = () => setCurrentMonth(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  const nextMonth = () => setCurrentMonth(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))
  const monthLabel = currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })

  const renderWaiting = () => (
    <div className="flex flex-col items-center justify-center flex-1 px-6 text-center">
      <Calendar size={64} className="mb-6 text-gray-400" />
      <h2 className="text-xl font-bold text-white mb-4">Cita agendada</h2>
      <p className="text-lg text-gray-300 mb-2">
        Tu cita ha sido programada para el <strong>{selectedDay?.date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</strong> a las <strong>{selectedTime}</strong>.
      </p>
      <div className="mt-8 max-w-md mx-auto p-6 rounded-xl border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}>
        <p className="font-semibold text-white mb-3">Próximos pasos:</p>
        <ul className="text-left space-y-2 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
          <li>• Acude al gimnasio en la fecha y hora indicadas</li>
          <li>• Firma los documentos solicitados en el gimnasio</li>
          <li>• Completa el cuestionario PAR-Q</li>
          <li>• Registra tu huella digital</li>
        </ul>
        <p className="mt-6 text-sm font-medium" style={{ color: '#7ec8e3' }}>
          Tu cuenta se activará automáticamente una vez el personal del gimnasio complete tu proceso presencial.
        </p>
      </div>
      <div className="mt-6 flex justify-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { cerrarSesion(); navigate('/login') }}
          className="px-6 py-2.5 rounded-xl text-sm font-medium"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)' }}
        >
          Volver al login
        </motion.button>
      </div>
    </div>
  )

  return (
    <AuthShell onBack={onBack} autoDesktopVideo videosPaused={true}>
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

                  {loadingCupos && (
                    <p className="text-xs text-center mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>Cargando horarios disponibles…</p>
                  )}
                  {cuposError && !loadingCupos && (
                    <p className="text-xs text-center mb-4" style={{ color: FIRE }}>{cuposError}</p>
                  )}
                  {!loadingCupos && !cuposError && cupos.length === 0 && (
                    <p className="text-xs text-center mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>Aún no hay horarios publicados. Intenta de nuevo más tarde.</p>
                  )}
                  {bookError && (
                    <p className="text-xs text-center mb-4" style={{ color: FIRE }}>{bookError}</p>
                  )}

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

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 pb-2" style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: GREEN }} />
                        Con horarios
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }} />
                        Sin cupos
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: AMBER }} />
                        Festivo
                      </span>
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
                          whileHover={{ scale: day && !day.isPast && !day.isHoliday ? 1.05 : 1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => day && handleDayClick(day)}
                          disabled={!day || day.isPast || day.isHoliday}
                          className="relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all"
                          style={{
                            background: day && !day.isPast
                              ? (selectedDay?.date.getTime() === day.date.getTime()
                                ? `linear-gradient(135deg, ${FIRE}, ${AMBER})`
                                : day.isHoliday
                                  ? 'rgba(245,166,35,0.08)'
                                  : day.isRestDay
                                    ? 'rgba(255,255,255,0.02)'
                                    : 'rgba(48,209,88,0.07)')
                              : 'transparent',
                            border: day && !day.isPast
                              ? (selectedDay?.date.getTime() === day.date.getTime()
                                ? 'none'
                                : day.isHoliday
                                  ? '1px solid rgba(245,166,35,0.35)'
                                  : day.isRestDay
                                    ? '1px solid rgba(255,255,255,0.05)'
                                    : '1px solid rgba(48,209,88,0.28)')
                              : 'none',
                            color: day?.isToday ? '#7ec8e3' : day?.isPast ? 'rgba(255,255,255,0.15)' : '#fff',
                            opacity: day?.isPast ? 0.4 : day?.isHoliday ? 0.65 : 1,
                            cursor: day && !day.isPast && !day.isHoliday ? 'pointer' : 'not-allowed',
                          }}
                        >
                          <span style={{ fontSize: day?.isToday ? 15 : 13, fontWeight: day?.isToday ? 800 : 500 }}>
                            {day?.date.getDate()}
                          </span>
                          {day?.isToday && <span className="w-2 h-2 rounded-full mt-1" style={{ background: '#7ec8e3' }} />}
                          {day?.isHoliday && <Lock size={9} className="absolute bottom-1" style={{ color: AMBER }} />}
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
                          {!selectedDay.isRestDay && (
                            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                              {selectedDay.slots.length === 1 ? '1 horario disponible' : `${selectedDay.slots.length} horarios disponibles`}
                            </p>
                          )}
                        </div>
                      </div>

                      {selectedDay.slots.length === 0 ? (
                        <div className="flex flex-col items-center py-6 text-center">
                          <CalendarCheck size={32} className="mb-2" style={{ opacity: 0.4, color: 'rgba(255,255,255,0.5)' }} />
                          <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>
                            Cupos no publicados
                          </p>
                          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                            Elige otro día para ver los horarios disponibles.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-4 gap-2">
                          {selectedDay.slots.map(slot => (
                            <motion.button
                              key={slot.id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleTimeClick(slot)}
                              className="aspect-square rounded-xl font-bold text-sm transition-all"
                              style={{
                                background: selectedTime === slot.time
                                  ? `linear-gradient(135deg, ${FIRE}, ${AMBER})`
                                  : 'rgba(255,255,255,0.05)',
                                border: selectedTime === slot.time
                                  ? 'none'
                                  : '1px solid rgba(255,255,255,0.08)',
                                color: '#fff',
                              }}
                            >
                              {slot.time}
                            </motion.button>
                          ))}
                        </div>
                      )}
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
                      onClick={() => setPhase('schedule')}
                      className="w-full h-14 rounded-2xl text-base font-bold flex items-center justify-center gap-2 cursor-pointer"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '2px solid rgba(255,255,255,0.15)', color: '#fff' }}
                    >
                      <ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} />
                      Volver
                    </motion.button>
                  </motion.div>
                </div>
              )}

              {phase === 'waiting' && renderWaiting()}

              {phase === 'success' && (
                <div className="flex flex-col items-center justify-center text-center relative">
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
                      ¡Tu cuenta está activa!
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
                      Tu cuenta ya está activa. Puedes acceder a la app con tu nueva contraseña.
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
                      Entrar a la app
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