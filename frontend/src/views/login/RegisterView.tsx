import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight,
  Clock, CalendarCheck,
} from 'lucide-react'
import { TIPO_DOC, GENEROS, GRUPOS_SANGRE, PARENTESCOS } from '../../modules/students/NewStudentData'
import { dayLabels, monthNames, DAY_GRAD } from '../../modules/agenda/AgendaData'
import { useIsMobile } from '../../components/ui/use-mobile'
import successCheckImg from '../../assets/illustrations/actions/feedback/success_check.webp'
import logotipo from '../../assets/logo/logo.webp'

const BLUE = '#1270B7'
const GREEN = '#22C55E'
const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #7ec8e3)'
const GREEN_GRAD = 'linear-gradient(135deg, #00fb64, #009b95)'
const DARK_BG = '#0A0A14'

const FORM_STEPS = [
  { num: 1, label: 'Datos personales' },
  { num: 2, label: 'Contacto' },
  { num: 3, label: 'Emergencia' },
]

const INITIAL_FORM = {
  primerNombre: '', segundoNombre: '', primerApellido: '', segundoApellido: '',
  tipoDoc: 'CC', numDoc: '', fechaNac: '', genero: 'Masculino',
  email: '', telefono: '', eps: '', grupoSanguineo: 'O+',
  nombreContacto: '', telefonoContacto: '', parentesco: 'Padre',
}

type Phase = 'form' | 'success' | 'schedule'

interface Slot { time: string; title: string; color: string }

function buildDemoAgenda(): Record<string, Slot[]> {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()
  const last = new Date(y, m + 1, 0).getDate()
  const days = [...new Set([
    now.getDate(),
    Math.min(now.getDate() + 1, last),
    Math.min(now.getDate() + 2, last),
    Math.min(now.getDate() + 3, last),
  ])]
  const d = (day: number) => `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  const reg = '#AF52DE'
  const assess = '#FF6B35'
  const physical = '#30D158'
  return {
    [d(days[0])]: [
      { time: '07:00', title: 'Registro Nuevo Ingreso', color: reg },
      { time: '09:00', title: 'Valoración Inicial', color: assess },
      { time: '11:00', title: 'Valoración Física', color: physical },
    ],
    [d(days[1])]: [
      { time: '08:00', title: 'Valoración Inicial', color: assess },
      { time: '14:00', title: 'Registro Nuevo Ingreso', color: reg },
    ],
    [d(days[2])]: [
      { time: '10:00', title: 'Registro Nuevo Ingreso', color: reg },
      { time: '16:00', title: 'Valoración Física', color: physical },
    ],
    [d(days[3])]: [
      { time: '09:00', title: 'Valoración Inicial', color: assess },
      { time: '15:00', title: 'Registro Nuevo Ingreso', color: reg },
    ],
  }
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

interface RegisterViewProps {
  onBack: () => void
}

export function RegisterView({ onBack }: RegisterViewProps) {
  const isMobile = useIsMobile()
  const [phase, setPhase] = useState<Phase>('form')
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<Record<string, string>>({ ...INITIAL_FORM })
  const [shake, setShake] = useState(false)
  const [agenda] = useState<Record<string, Slot[]>>(() => buildDemoAgenda())
  const [viewMonth, setViewMonth] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [scheduled, setScheduled] = useState(false)

  const set = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }))

  const canGoNext = () => {
    if (step === 1) return !!(form.primerNombre && form.primerApellido && form.numDoc)
    if (step === 2) return !!(form.email && form.telefono)
    if (step === 3) return !!(form.nombreContacto && form.telefonoContacto)
    return true
  }

  const handleNext = () => {
    if (!canGoNext()) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }
    if (step < FORM_STEPS.length) {
      setStep(p => p + 1)
    } else {
      setPhase('success')
    }
  }

  const handlePrev = () => {
    if (step > 1) setStep(p => p - 1)
    else onBack()
  }

  const confirmSchedule = () => {
    if (!selectedDay || !selectedSlot) return
    setScheduled(true)
  }

  const slotsOfDay = selectedDay ? (agenda[selectedDay] ?? []) : []

  const grid = getMonthGrid(viewMonth.getFullYear(), viewMonth.getMonth())
  const title = `${monthNames[viewMonth.getMonth()]} ${viewMonth.getFullYear()}`

  const inputStyle = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.09)',
    color: '#FFFFFF',
    borderRadius: 12,
    padding: '10px 12px',
    fontSize: 12,
    outline: 'none',
    width: '100%',
  } as const

  const field = (label: string, key: string, opts?: { type?: string; required?: boolean; placeholder?: string }) => (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.45)' }}>
        {label}{opts?.required && <span style={{ color: '#F43843' }}> *</span>}
      </label>
      <input
        type={opts?.type ?? 'text'}
        value={form[key] ?? ''}
        onChange={e => set(key, e.target.value)}
        placeholder={opts?.placeholder}
        style={inputStyle}
      />
    </div>
  )

  const select = (label: string, key: string, options: string[]) => (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</label>
      <select
        value={form[key] ?? ''}
        onChange={e => set(key, e.target.value)}
        className="appearance-none cursor-pointer"
        style={{ ...inputStyle, background: '#151520' }}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )

  const stepBody = () => {
    if (step === 1) {
      return (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-0.5 h-5 rounded-full" style={{ background: BLUE_GRAD }} />
            <span className="text-[13px] font-bold" style={{ color: '#fff' }}>Información personal</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {field('Primer nombre', 'primerNombre', { required: true })}
            {field('Segundo nombre', 'segundoNombre')}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {field('Primer apellido', 'primerApellido', { required: true })}
            {field('Segundo apellido', 'segundoApellido')}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {select('Tipo de documento', 'tipoDoc', TIPO_DOC)}
            {field('Número de documento', 'numDoc', { required: true })}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {field('Fecha de nacimiento', 'fechaNac', { type: 'date' })}
            {select('Género', 'genero', GENEROS)}
          </div>
        </div>
      )
    }
    if (step === 2) {
      return (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-0.5 h-5 rounded-full" style={{ background: BLUE_GRAD }} />
            <span className="text-[13px] font-bold" style={{ color: '#fff' }}>Información de contacto</span>
          </div>
          <div className="flex flex-col gap-3">
            {field('Email', 'email', { type: 'email', required: true })}
            {field('Teléfono', 'telefono', { required: true })}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-0.5 h-5 rounded-full" style={{ background: BLUE_GRAD }} />
            <span className="text-[13px] font-bold" style={{ color: '#fff' }}>Información médica</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {field('EPS', 'eps')}
            {select('Grupo sanguíneo', 'grupoSanguineo', GRUPOS_SANGRE)}
          </div>
        </div>
      )
    }
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="w-0.5 h-5 rounded-full" style={{ background: BLUE_GRAD }} />
          <span className="text-[13px] font-bold" style={{ color: '#fff' }}>Contacto de emergencia</span>
        </div>
        {field('Nombre contacto', 'nombreContacto', { required: true })}
        {field('Teléfono contacto', 'telefonoContacto', { required: true })}
        {select('Parentesco', 'parentesco', PARENTESCOS)}
      </div>
    )
  }

  const renderForm = () => (
    <>
      <div className="flex flex-col items-center pt-4">
        <img src={logotipo} alt="UNIFIT" style={{ height: 46, objectFit: 'contain' }} />
        <p className="text-xs mt-2 mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>Crear cuenta de estudiante</p>
      </div>

      <div className="flex items-center justify-center gap-1.5 mb-3">
        {FORM_STEPS.map(s => (
          <motion.div
            key={s.num}
            animate={{
              width: s.num === step ? 18 : 7,
              background: s.num <= step ? BLUE_GRAD : 'rgba(255,255,255,0.12)',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="rounded-full"
            style={{ height: 6 }}
          />
        ))}
      </div>
      <span className="text-sm font-bold text-center block mb-3" style={{ color: '#fff' }}>
        {FORM_STEPS.find(s => s.num === step)!.label}
      </span>

      <div className="flex-1 overflow-y-auto px-5">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -14 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="py-2"
        >
          {stepBody()}
        </motion.div>
      </div>

      <div className="flex-shrink-0 p-5 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePrev}
            className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-xs font-medium cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}
          >
            <ArrowLeft size={14} />
            {step === 1 ? 'Salir' : 'Atrás'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleNext}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
            style={{ background: BLUE_GRAD }}
          >
            {step === FORM_STEPS.length ? 'Finalizar' : 'Siguiente'}
            <ArrowRight size={14} />
          </motion.button>
        </div>
      </div>
    </>
  )

  const renderSuccess = () => (
    <div className="flex flex-col items-center justify-center flex-1 px-6 text-center">
      <div className="relative flex items-center justify-center mb-4">
        {[...Array(20)].map((_, i) => {
          const angle = (i / 20) * 360
          const rad = (angle * Math.PI) / 180
          return (
            <motion.span
              key={i}
              className="absolute pointer-events-none text-sm select-none"
              style={{ color: '#4ADE80' }}
              animate={{
                x: [0, Math.cos(rad) * (90 + (i % 6) * 18)],
                y: [0, Math.sin(rad) * (90 + (i % 6) * 18)],
                opacity: [0, 1, 0],
                scale: [0, 1.3, 0],
              }}
              transition={{
                duration: 2.4 + (i % 4) * 0.3,
                repeat: Infinity,
                delay: i * 0.07,
                ease: 'easeOut',
              }}
            >
              ✦
            </motion.span>
          )
        })}
        <motion.img
          src={successCheckImg}
          alt="éxito"
          className="w-28 h-auto object-contain relative z-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16 }}
        />
      </div>
      <h2 className="text-lg font-extrabold" style={{ color: '#fff' }}>¡Felicidades, registro exitoso!</h2>
      <p className="text-xs mt-2 leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
        Agenda tu cita para continuar con el proceso.
      </p>
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setPhase('schedule')}
        className="mt-6 flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-white cursor-pointer"
        style={{ background: GREEN_GRAD }}
      >
        <CalendarCheck size={16} />
        Agendar cita
      </motion.button>
    </div>
  )

  const renderSchedule = () => (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex flex-col items-center pt-4">
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Agenda del entrenador</p>
        <p className="text-[13px] font-bold mt-0.5 mb-2" style={{ color: '#fff' }}>
          Selecciona el día para tu cita
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 mb-2">
        <button
          onClick={() => setViewMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          <ChevronLeft size={15} />
        </button>
        <span className="text-xs font-extrabold" style={{ color: '#fff' }}>{title}</span>
        <button
          onClick={() => setViewMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          <ChevronRight size={15} />
        </button>
      </div>

      <div className="px-4">
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
              const hasSlots = !!agenda[ds]
              const isSel = selectedDay === ds
              const isToday = ds === fmtDate(new Date())
              return (
                <motion.div
                  key={di}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => {
                    if (!hasSlots) return
                    setSelectedDay(ds)
                    setSelectedSlot(null)
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
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-5 mt-3">
        {!selectedDay ? (
          <div className="flex flex-col items-center py-8 gap-2">
            <CalendarCheck size={22} style={{ color: 'rgba(255,255,255,0.2)' }} />
            <p className="text-[11px] text-center" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Toca un día resaltado para ver los horarios disponibles
            </p>
          </div>
        ) : scheduled ? (
          <div className="flex flex-col items-center py-6 gap-3 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 16 }}
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}
            >
              <Check size={22} color={GREEN} strokeWidth={3} />
            </motion.div>
            <h3 className="text-sm font-extrabold" style={{ color: '#fff' }}>¡Cita agendada!</h3>
            <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Tu valoración quedó programada para el {selectedDay} a las {selectedSlot}.<br />
              El entrenador te confirmará la hora.
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onBack}
              className="mt-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
              style={{ background: GREEN_GRAD }}
            >
              Volver al inicio
            </motion.button>
          </div>
        ) : (
          <>
            <p className="text-[10px] font-bold mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>Horarios disponibles</p>
            <div className="flex flex-col gap-2">
              {slotsOfDay.map(s => {
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
              className="w-full mt-3 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
              style={{ background: selectedSlot ? BLUE_GRAD : 'rgba(255,255,255,0.1)', opacity: selectedSlot ? 1 : 0.5 }}
            >
              Confirmar cita
            </motion.button>
          </>
        )}
      </div>
    </div>
  )

  return (
    <div className="size-full flex items-center justify-center" style={{
      background: 'radial-gradient(ellipse at 50% 30%, rgba(18,112,183,0.08) 0%, rgba(10,10,20,1) 60%)',
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex flex-col overflow-hidden"
        style={isMobile ? {
          width: '100%',
          height: '100dvh',
          background: DARK_BG,
          paddingTop: 'env(safe-area-inset-top)',
        } : {
          width: 390,
          height: 720,
          borderRadius: 48,
          background: DARK_BG,
          border: '10px solid rgba(255,255,255,0.06)',
          boxShadow: '0 60px 140px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        {!isMobile && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 rounded-b-2xl z-50" style={{ background: 'rgba(0,0,0,0.85)' }}>
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-2.5 rounded-full" style={{ background: '#151520' }} />
          </div>
        )}

        {phase === 'form' && (
          <button
            onClick={onBack}
            className="absolute z-40 w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors"
            style={{ top: isMobile ? 'calc(env(safe-area-inset-top) + 12px)' : 36, left: 16, color: 'rgba(255,255,255,0.5)' }}
          >
            <ArrowLeft size={16} />
          </button>
        )}

        <AnimatePresence mode="wait">
          {phase === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col flex-1 min-h-0 pt-7"
            >
              <motion.div
                animate={shake ? { x: [0, -4, 4, -4, 4, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="flex flex-col flex-1 min-h-0"
              >
                {renderForm()}
              </motion.div>
            </motion.div>
          )}
          {phase === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col flex-1 min-h-0 pt-7"
            >
              {renderSuccess()}
            </motion.div>
          )}
          {phase === 'schedule' && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col flex-1 min-h-0 pt-7"
            >
              {renderSchedule()}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
