import { useState, useEffect, useRef, Fragment } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight,
  Clock, CalendarCheck, X, FileText,
} from 'lucide-react'
import {
  TIPO_DOC, GENEROS, GRUPOS_SANGRE, MODALIDADES, JORNADAS, ESTADOS, PARENTESCOS,
  TIPOS_USUARIO, INITIAL_FORM, BLUE, GREEN, BLUE_GRAD, GREEN_GRAD,
} from '@/modules/students/NewStudentData'
import type { TipoUsuario } from '@/modules/students/NewStudentData'
import { INSTITUCIONES, getNiveles, getPrograms } from '@/data/academicPrograms'
import { dayLabels, dayLabelsGetDay, monthNames, DAY_GRAD } from '@/modules/agenda/AgendaData'
import { useIsMobile } from '@/shared/components/ui/use-mobile'
import coachImg from '@/assets/illustrations/characters/coach/coach_missing_fingerprint_and_signature.webp'
import logotipo from '@/assets/logo/logo.webp'
import welcomeDesktop from '@/assets/scenes/videos/welcome_desktop.mp4'
import welcomeMobile from '@/assets/scenes/videos/welcome_mobile.mp4'

const DARK_BG = '#0A0A14'

let persistedPreview: 'celular' | 'desktop' | 'auto' = 'auto'

const FORM_STEPS = [
  { num: 1, label: 'Información' },
  { num: 2, label: 'Tratamiento de datos' },
  { num: 3, label: 'Contrato' },
]

type Phase = 'intro' | 'form' | 'success' | 'schedule' | 'final'
type ViewMode = 'month' | 'week'

interface Slot { time: string; title: string; color: string }

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

const AGENDA_TIMES = ['07:00', '08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00']

interface RegisterPageProps {
  onBack: () => void
}

export function RegisterPage({ onBack }: RegisterPageProps) {
  const isMobile = useIsMobile()
  const [previewMode, setPreviewMode] = useState<'celular' | 'desktop' | 'auto'>(persistedPreview)
  const changePreviewMode = (v: 'celular' | 'desktop' | 'auto') => {
    persistedPreview = v
    setPreviewMode(v)
    setPhase('intro')
  }
  const [phase, setPhase] = useState<Phase>('intro')
  const [form, setForm] = useState<Record<string, string>>({ ...INITIAL_FORM, parentesco: 'Padre', estado: 'No egresado' })
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario | null>(null)
  const [step, setStep] = useState(1)
  const [aceptaDatos, setAceptaDatos] = useState(false)
  const [aceptaContrato, setAceptaContrato] = useState(false)
  const [shake, setShake] = useState(false)
  const [agenda] = useState<Record<string, Slot[]>>(() => buildDemoAgenda())
  const [viewMonth, setViewMonth] = useState(new Date())
  const [viewMode, setViewMode] = useState<ViewMode>('month')
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [scheduled, setScheduled] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const introVideoRef = useRef<HTMLVideoElement>(null)
  const introContainerRef = useRef<HTMLDivElement>(null)
  const bgVideoRef = useRef<HTMLVideoElement>(null)

  const isDesktopVideo = previewMode === 'desktop'
  const isPhonePreview = previewMode === 'celular' || (previewMode === 'auto' && isMobile)
  const introSrc = isPhonePreview ? welcomeMobile : welcomeDesktop

  useEffect(() => {
    if (phase !== 'intro') return
    const v = introVideoRef.current
    if (!v) return
    v.muted = true
    v.play().catch(() => {})
    const t = setTimeout(() => {
      v.muted = false
      const p = v.play()
      if (p) p.catch(() => {
        v.muted = true
        v.play().catch(() => {})
      })
    }, 350)

    // Fullscreen solo en desktop y después de que el elemento esté montado
    const el = introContainerRef.current
    if (el && !isPhonePreview) {
      const doc = document as any
      if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
        const req = el.requestFullscreen?.() ?? el.webkitRequestFullscreen?.()
        if (req?.catch) req.catch(() => {})
      }
    }

    return () => {
      clearTimeout(t)
      const doc = document as any
      if (doc.fullscreenElement || doc.webkitFullscreenElement) {
        const exit = doc.exitFullscreen?.() ?? doc.webkitExitFullscreen?.()
        if (exit?.catch) exit.catch(() => {})
      }
    }
  }, [phase, introSrc, isPhonePreview])

  const skipIntro = () => {
    introVideoRef.current?.pause()
    const bg = bgVideoRef.current
    if (bg) {
      bg.currentTime = 0
      bg.play().catch(() => {})
    }
    setPhase('form')
  }

  const set = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }))

  const toggleTipoUsuario = (tipo: TipoUsuario) => {
    setTipoUsuario(prev => (prev === tipo ? null : tipo))
    const inst = 'Universitaria de Colombia'
    const level = getNiveles(inst)[0]
    const prog = getPrograms(inst, level)[0] ?? ''
    setForm(prev => ({
      ...prev,
      numCarnet: '', estado: 'No egresado',
      institucion: inst, nivelFormacion: level, programa: prog,
      semestre: '1', modalidad: 'Presencial', jornada: 'Mañana',
      cargo: '', area: '',
    }))
  }

  const canGoNext = () => {
    if (step === 1) return !!(tipoUsuario && form.primerNombre && form.primerApellido && form.numDoc)
    if (step === 2) return aceptaDatos
    if (step === 3) return aceptaContrato
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
    setShowConfirm(true)
  }

  const executeSchedule = () => {
    if (!selectedDay || !selectedSlot) return
    setScheduled(true)
    setShowConfirm(false)
    setShowSuccess(true)
  }

  const slotsOfDay = selectedDay ? (agenda[selectedDay] ?? []) : []

  const grid = getMonthGrid(viewMonth.getFullYear(), viewMonth.getMonth())
  const title = `${monthNames[viewMonth.getMonth()]} ${viewMonth.getFullYear()}`

  const weekGrid = getWeekGrid(viewMonth)
  const weekTitle = `${fmtDate(weekGrid[0]!)} - ${fmtDate(weekGrid[6]!)}`
  const currentTitle = viewMode === 'month' ? title : weekTitle

  const hasAvailableSlots = (dateStr: string) => (agenda[dateStr] ?? []).some(s => s.title === 'Disponible')

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

  const select = (label: string, key: string, options: string[], opts?: { required?: boolean; onChange?: (v: string) => void }) => (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.45)' }}>
        {label}{opts?.required && <span style={{ color: '#F43843' }}> *</span>}
      </label>
      <select
        value={form[key] ?? ''}
        onChange={e => {
          const v = e.target.value
          set(key, v)
          opts?.onChange?.(v)
        }}
        className="appearance-none cursor-pointer"
        style={inputStyle}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )

  const sectionTitle = (label: string) => (
    <div className="flex items-center gap-2 mt-1">
      <div className="w-1 h-4 rounded-full" style={{ background: BLUE_GRAD }} />
      <span className="text-[13px] font-bold" style={{ color: '#fff' }}>{label}</span>
    </div>
  )

  const formBody = () => (
    <div className="flex flex-col gap-4 px-5 py-4">
      {sectionTitle('Información personal')}
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

      {sectionTitle('Información de contacto')}
      <div className="grid grid-cols-2 gap-3">
        {field('Email', 'email', { type: 'email' })}
        {field('Teléfono', 'telefono')}
      </div>

      {sectionTitle('Información médica')}
      <div className="grid grid-cols-2 gap-3">
        {field('EPS', 'eps')}
        {select('Grupo sanguíneo', 'grupoSanguineo', GRUPOS_SANGRE)}
      </div>

      {sectionTitle('Contacto de emergencia')}
      <div className="grid grid-cols-2 gap-3">
        {field('Nombre contacto', 'nombreContacto')}
        {field('Teléfono contacto', 'telefonoContacto')}
      </div>
      <div>
        {select('Parentesco', 'parentesco', PARENTESCOS)}
      </div>
      {form.parentesco === 'Otro' && (
        <div className="mt-0">
          {field('Especifique el parentesco', 'otroParentesco', { required: true })}
        </div>
      )}

      {sectionTitle('Rol en la universidad')}
      <div className="grid grid-cols-3 gap-2">
        {TIPOS_USUARIO.map((opt, i) => {
          const selected = tipoUsuario === opt.id
          return (
            <motion.button
              key={opt.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.06 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleTipoUsuario(opt.id)}
              className="flex flex-col items-center gap-1 px-2 py-3 rounded-xl text-[10px] font-bold transition-all duration-200 cursor-pointer"
              style={{
                background: selected ? BLUE_GRAD : 'rgba(255,255,255,0.05)',
                color: selected ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
                border: selected ? '1px solid transparent' : '1px solid rgba(255,255,255,0.08)',
                boxShadow: selected ? `0 6px 24px ${BLUE}40` : 'none',
              }}
            >
              <motion.img
                src={opt.img}
                alt={opt.label}
                className="mb-0.5"
                animate={{
                  width: selected ? 46 : 24,
                  height: selected ? 46 : 24,
                  marginTop: selected ? -22 : 0,
                  filter: selected ? 'drop-shadow(0 8px 20px rgba(0,0,0,0.4))' : 'none',
                }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              />
              <span>{opt.label}</span>
            </motion.button>
          )
        })}
      </div>
      {!tipoUsuario && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: 'rgba(245,166,35,0.08)', border: '1px dashed rgba(245,166,35,0.35)' }}>
          <span className="text-[11px] font-semibold" style={{ color: '#FFC247' }}>
            Selecciona el rol en la universidad para completar su información.
          </span>
        </div>
      )}

      {tipoUsuario === 'estudiante' && (
        <>
          {sectionTitle('Información académica')}
          <div className="grid grid-cols-2 gap-3">
            {field('Número carnet', 'numCarnet')}
            {select('Estado', 'estado', ESTADOS)}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {select('Institución', 'institucion', INSTITUCIONES, {
              onChange: (inst) => {
                const level = getNiveles(inst)[0]
                const prog = getPrograms(inst, level)[0] ?? ''
                setForm(prev => ({ ...prev, institucion: inst, nivelFormacion: level, programa: prog }))
              }
            })}
            {select('Modalidad', 'modalidad', MODALIDADES)}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {select('Nivel de formación', 'nivelFormacion', getNiveles(form.institucion), {
              onChange: (level) => {
                const prog = getPrograms(form.institucion, level)[0] ?? ''
                setForm(prev => ({ ...prev, nivelFormacion: level, programa: prog }))
              }
            })}
            {select('Carrera', 'programa', getPrograms(form.institucion, form.nivelFormacion), { required: true })}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {select('Semestre', 'semestre', ['1', '2', '3', '4', '5', '6', '7', '8', '9'])}
            {select('Jornada', 'jornada', JORNADAS)}
          </div>
        </>
      )}

      {(tipoUsuario === 'profesor' || tipoUsuario === 'administrador') && (
        <>
          {sectionTitle('Información laboral')}
          <div className="grid grid-cols-2 gap-3">
            {field('Cargo', 'cargo', { required: true })}
            {field('Área', 'area', { required: true })}
          </div>
        </>
      )}
    </div>
  )

  const checkRow = (checked: boolean, onToggle: () => void, text: string) => (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div
        onClick={onToggle}
        className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 cursor-pointer"
        style={{
          background: checked ? BLUE_GRAD : 'transparent',
          border: `1.5px solid ${checked ? BLUE : 'rgba(255,255,255,0.25)'}`,
        }}
      >
        {checked && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
            <Check size={12} color="white" strokeWidth={3} />
          </motion.span>
        )}
      </div>
      <span className="text-[11px] font-semibold" style={{ color: checked ? '#7ec8e3' : 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
        {text}
      </span>
    </label>
  )

  const renderStep2 = () => (
    <div className="flex flex-col gap-4 px-5 py-4">
      <div className="rounded-2xl p-5 text-xs leading-relaxed max-h-[280px] overflow-y-auto" style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <p className="font-bold text-sm mb-3" style={{ color: '#fff' }}>Autorización para el tratamiento de datos personales</p>
        <p className="mb-3">
          En cumplimiento de la Ley 1581 de 2012 y sus decretos reglamentarios, UniFit S.A.S. en calidad de responsable del tratamiento de datos personales, solicita su autorización para recolectar, almacenar, usar, circular y suprimir los datos personales suministrados en el presente formulario, con la finalidad de gestionar su registro como estudiante, llevar a cabo el seguimiento académico, realizar comunicaciones institucionales, enviar información sobre programas y servicios, y cumplir con obligaciones legales y contractuales.
        </p>
        <p className="mb-3">
          Los datos serán conservados durante el tiempo necesario para cumplir con las finalidades descritas y de acuerdo con las disposiciones legales vigentes. El estudiante podrá ejercer sus derechos de acceso, actualización, rectificación, supresión y revocación de la autorización mediante comunicación escrita dirigida a nuestro correo electrónico: datos@unifit.co.
        </p>
        <p>
          La no autorización implica la imposibilidad de completar el proceso de registro como estudiante de UniFit.
        </p>
      </div>
      {checkRow(aceptaDatos, () => setAceptaDatos(!aceptaDatos), 'Autorizo el tratamiento de mis datos personales de acuerdo con la política de privacidad de UniFit.')}
    </div>
  )

  const renderStep3 = () => (
    <div className="flex flex-col gap-4 px-5 py-4">
      <div className="rounded-xl p-1.5" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="rounded-lg bg-white px-5 py-5 flex flex-col gap-3 max-h-[340px] overflow-y-auto" style={{ color: '#1A1A1E', boxShadow: '0 8px 30px rgba(0,0,0,0.25)' }}>
          <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
            <span className="text-[11px] font-extrabold" style={{ color: '#007AFF' }}>UNIFIT</span>
            <span className="text-[9px] font-bold tracking-[0.2em]" style={{ color: 'rgba(0,0,0,0.4)' }}>CONTRATO</span>
          </div>
          <p className="text-[12px] font-extrabold">Contrato de prestación de servicios estudiantiles</p>
          <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(0,0,0,0.65)' }}>
            El presente contrato regula la relación entre UniFit S.A.S., en adelante "LA INSTITUCIÓN", y el estudiante que se registra a través del presente formulario, en adelante "EL ESTUDIANTE".
          </p>
          <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(0,0,0,0.65)' }}>
            <strong>CLÁUSULA PRIMERA – OBJETO:</strong> LA INSTITUCIÓN se compromete a proporcionar al ESTUDIANTE los servicios de entrenamiento y acompañamiento deportivo contratados, de acuerdo con el programa académico y la modalidad seleccionada en el formulario de registro.
          </p>
          <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(0,0,0,0.65)' }}>
            <strong>CLÁUSULA SEGUNDA – OBLIGACIONES DEL ESTUDIANTE:</strong> El ESTUDIANTE se obliga a asistir puntualmente a las sesiones programadas, cumplir con las normas internas de LA INSTITUCIÓN, utilizar adecuadamente las instalaciones y equipos, y mantener una conducta respetuosa hacia el personal y demás estudiantes.
          </p>
          <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(0,0,0,0.65)' }}>
            <strong>CLÁUSULA TERCERA – OBLIGACIONES DE LA INSTITUCIÓN:</strong> LA INSTITUCIÓN se obliga a proporcionar entrenadores calificados, mantener las instalaciones en condiciones óptimas de seguridad e higiene, y garantizar la prestación del servicio de acuerdo con los estándares de calidad establecidos.
          </p>
          <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(0,0,0,0.65)' }}>
            <strong>CLÁUSULA CUARTA – VALOR Y FORMA DE PAGO:</strong> El valor del programa será el establecido en la tarifa vigente al momento de la matrícula. EL ESTUDIANTE acepta realizar los pagos en las fechas y montos acordados.
          </p>
          <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(0,0,0,0.65)' }}>
            <strong>CLÁUSULA QUINTA – TERMINACIÓN:</strong> El presente contrato podrá ser terminado por cualquiera de las partes mediante comunicación escrita con quince (15) días de antelación, o de forma inmediata por incumplimiento grave de las obligaciones aquí establecidas.
          </p>
          <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(0,0,0,0.65)' }}>
            <strong>CLÁUSULA SEXTA – ACEPTACIÓN:</strong> Las partes aceptan el presente contrato y se obligan a su cumplimiento en todos sus términos.
          </p>
        </div>
      </div>
      {checkRow(aceptaContrato, () => setAceptaContrato(!aceptaContrato), 'Acepto los términos y condiciones del contrato de prestación de servicios estudiantiles de UniFit.')}
    </div>
  )

  const openContractDocument = () => {
    const html = `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Contrato de prestación de servicios estudiantiles - UNIFIT</title><style>body{font-family:'Inter',Arial,sans-serif;color:#1A1A1E;max-width:720px;margin:0 auto;padding:48px 24px;line-height:1.7}header{display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #007AFF;padding-bottom:12px;margin-bottom:28px}header .brand{font-weight:800;color:#007AFF;letter-spacing:0.05em}header .doc{font-weight:700;letter-spacing:0.25em;color:rgba(0,0,0,0.45);font-size:12px}h1{font-size:20px;font-weight:800;margin:0 0 24px}p{font-size:14px;margin:0 0 14px}.footer{margin-top:48px;padding-top:16px;border-top:1px solid rgba(0,0,0,0.1);font-size:12px;color:rgba(0,0,0,0.5);display:flex;justify-content:space-between}</style></head><body><header><span class="brand">UNIFIT</span><span class="doc">CONTRATO</span></header><h1>Contrato de prestación de servicios estudiantiles</h1><p>El presente contrato regula la relación entre UniFit S.A.S., en adelante "LA INSTITUCIÓN", y el estudiante que se registra a través del presente formulario, en adelante "EL ESTUDIANTE".</p><p><strong>CLÁUSULA PRIMERA – OBJETO:</strong> LA INSTITUCIÓN se compromete a proporcionar al ESTUDIANTE los servicios de entrenamiento y acompañamiento deportivo contratados, de acuerdo con el programa académico y la modalidad seleccionada en el formulario de registro.</p><p><strong>CLÁUSULA SEGUNDA – OBLIGACIONES DEL ESTUDIANTE:</strong> El ESTUDIANTE se obliga a asistir puntualmente a las sesiones programadas, cumplir con las normas internas de LA INSTITUCIÓN, utilizar adecuadamente las instalaciones y equipos, y mantener una conducta respetuosa hacia el personal y demás estudiantes.</p><p><strong>CLÁUSULA TERCERA – OBLIGACIONES DE LA INSTITUCIÓN:</strong> LA INSTITUCIÓN se obliga a proporcionar entrenadores calificados, mantener las instalaciones en condiciones óptimas de seguridad e higiene, y garantizar la prestación del servicio de acuerdo con los estándares de calidad establecidos.</p><p><strong>CLÁUSULA CUARTA – VALOR Y FORMA DE PAGO:</strong> El valor del programa será el establecido en la tarifa vigente al momento de la matrícula. EL ESTUDIANTE acepta realizar los pagos en las fechas y montos acordados.</p><p><strong>CLÁUSULA QUINTA – TERMINACIÓN:</strong> El presente contrato podrá ser terminado por cualquiera de las partes mediante comunicación escrita con quince (15) días de antelación, o de forma inmediata por incumplimiento grave de las obligaciones aquí establecidas.</p><p><strong>CLÁUSULA SEXTA – ACEPTACIÓN:</strong> Las partes aceptan el presente contrato y se obligan a su cumplimiento en todos sus términos.</p><div class="footer"><span>UniFit S.A.S.</span><span>NIT 900.000.000-1</span></div></body></html>`
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }))
    window.open(url, '_blank')
  }

  const renderForm = () => (
    <>
      <div className="flex-shrink-0 flex flex-col items-center pt-6 pb-3">
        <img src={logotipo} alt="UNIFIT" style={{ height: 44, objectFit: 'contain' }} />
        <p className="text-[15px] font-extrabold mt-2" style={{ color: '#fff' }}>Crear cuenta</p>
        <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Completa tu información para afiliarte a UNIFIT
        </p>
      </div>

      <div className="flex-shrink-0 px-5 pb-1">
        <div className="flex items-center justify-center gap-1.5 mb-2">
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
        <span className="text-sm font-bold text-center block mb-2" style={{ color: '#fff' }}>
          {FORM_STEPS.find(s => s.num === step)!.label}
        </span>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -14 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="py-1"
        >
          {step === 1 ? formBody() : step === 2 ? renderStep2() : renderStep3()}
        </motion.div>
      </div>

      <div className="flex-shrink-0 px-5 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="relative flex items-center justify-between">
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
          {step === FORM_STEPS.length && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openContractDocument}
              className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.08)', color: '#7ec8e3', border: '1px solid rgba(126,200,227,0.25)' }}
            >
              <FileText size={13} />
              Ver documento
            </motion.button>
          )}
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
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex flex-col items-center justify-center flex-1 px-6 text-center min-h-0">
        <div className="relative flex items-center justify-center mb-2">
        {[...Array(24)].map((_, i) => {
          const angle = (i / 24) * 360
          const rad = (angle * Math.PI) / 180
          return (
            <motion.span
              key={i}
              className="absolute pointer-events-none text-base select-none"
              style={{ color: '#4ADE80' }}
              animate={{
                x: [0, Math.cos(rad) * (140 + (i % 6) * 24)],
                y: [0, Math.sin(rad) * (140 + (i % 6) * 24)],
                opacity: [0, 1, 0],
                scale: [0, 1.4, 0],
              }}
              transition={{
                duration: 2.6 + (i % 4) * 0.3,
                repeat: Infinity,
                delay: i * 0.06,
                ease: 'easeOut',
              }}
            >
              ✦
            </motion.span>
          )
        })}
        <motion.img
          src={coachImg}
          alt="éxito"
          className="w-[260px] h-[260px] sm:w-[360px] sm:h-[360px] object-contain object-bottom relative z-10"
          style={{
            WebkitMaskImage: 'linear-gradient(180deg, black 45%, transparent 100%)',
            maskImage: 'linear-gradient(180deg, black 45%, transparent 100%)',
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16 }}
        />
      </div>
      <h2 className="text-xl sm:text-2xl font-extrabold" style={{ color: '#fff' }}>¡Felicidades, registro exitoso!</h2>
      <p className="text-sm font-bold mt-3" style={{ color: '#7ec8e3' }}>
        Te faltan solo 3 pasos para tu acceso completo
      </p>
      <p className="text-xs mt-3 leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
        Agenda tu cita para capturar tu huella digital y tu firma, y completa tu PAR-Q, el registro que determina tus condiciones físicas. Así quedas listo para entrenar.
      </p>
      </div>

      <div className="flex-shrink-0 px-5 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setPhase('form')}
            className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-xs font-medium cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}
          >
            <ArrowLeft size={14} />
            Volver
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setPhase('schedule')}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
            style={{ background: GREEN_GRAD }}
          >
            <CalendarCheck size={14} />
            Agendar cita
          </motion.button>
        </div>
      </div>
    </div>
  )

  const renderFinal = () => (
    <div className="relative flex flex-col flex-1 min-h-0 overflow-hidden">
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 text-center min-h-0">
        <h2 className="text-xl sm:text-2xl font-extrabold" style={{ color: '#fff' }}>
          ¡Listo, tu cita quedó agendada!
        </h2>
        <p className="text-xs mt-3 font-bold" style={{ color: '#7ec8e3' }}>
          Para el {selectedDay ? new Date(selectedDay + 'T12:00:00').getDate() : ''} de {selectedDay ? monthNames[new Date(selectedDay + 'T12:00:00').getMonth()] : ''} a las {selectedSlot}
        </p>
        <p className="text-xs mt-3 leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Una vez termines el registro, la experiencia UNIFIT se habilitará y podrás empezar a entrenar.
        </p>
      </div>

      <div className="relative z-10 flex-shrink-0 pb-5">
        <div className="flex items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onBack}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.08)', color: '#fff' }}
          >
            <ArrowLeft size={14} />
            Volver
          </motion.button>
        </div>
      </div>
    </div>
  )

  const renderSchedule = () => (
    <div className="flex flex-col flex-1 min-h-0">
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

      <div className="px-4">
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

      <div className="flex-1 min-h-0" />

      <AnimatePresence>
        {selectedDay && !scheduled && (
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
        {showConfirm && (
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
        {showSuccess && (
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
                onClick={() => setPhase('final')}
                className="w-full py-3 rounded-xl text-sm font-bold text-white cursor-pointer"
                style={{ background: GREEN_GRAD }}
              >
                Finalizar
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-shrink-0 px-5 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setPhase('success')}
            className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-xs font-medium cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}
          >
            <ArrowLeft size={14} />
            Volver
          </motion.button>
          <motion.button
            whileHover={scheduled ? { scale: 1.03 } : {}}
            whileTap={scheduled ? { scale: 0.97 } : {}}
            onClick={scheduled ? () => setPhase('final') : undefined}
            disabled={!scheduled}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
            style={{ background: scheduled ? BLUE_GRAD : 'rgba(255,255,255,0.1)', opacity: scheduled ? 1 : 0.5 }}
          >
            {scheduled ? 'Finalizar' : 'Selecciona un horario'}
            <ArrowRight size={14} />
          </motion.button>
        </div>
      </div>
    </div>
  )

  const phaseContent = (
    <AnimatePresence mode="wait">
      {phase === 'form' && (
        <motion.div
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col flex-1 min-h-0"
        >
          <motion.div
            animate={shake ? { x: [0, -6, 6, -6, 6, 0] } : {}}
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
          className="flex flex-col flex-1 min-h-0 pt-6"
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
          className="flex flex-col flex-1 min-h-0 pt-3"
        >
          {renderSchedule()}
        </motion.div>
      )}
      {phase === 'final' && (
        <motion.div
          key="final"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col flex-1 min-h-0 pt-6"
        >
          {renderFinal()}
        </motion.div>
      )}
    </AnimatePresence>
  )

  const viewToolbar = (
    <div className="flex-shrink-0 flex items-center justify-center gap-1 z-50 pt-3 pb-2">
      <span className="text-[9px] font-bold uppercase tracking-widest mr-1.5" style={{ color: 'rgba(255,255,255,0.3)' }}>Vista</span>
      {(['celular', 'desktop', 'auto'] as const).map(v => (
        <button
          key={v}
          onClick={() => changePreviewMode(v)}
          className="px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer"
          style={{
            background: previewMode === v ? 'rgba(255,255,255,0.14)' : 'transparent',
            border: previewMode === v ? '1px solid rgba(255,255,255,0.22)' : '1px solid transparent',
            color: previewMode === v ? '#FFFFFF' : 'rgba(255,255,255,0.35)',
          }}
        >
          {v === 'celular' ? 'Celular' : v === 'desktop' ? 'Desktop' : 'Auto'}
        </button>
      ))}
    </div>
  )

  const backButton = (top: number) => phase === 'form' && (
    <button
      onClick={onBack}
      className="absolute z-40 w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors"
      style={{ top, left: 16, color: 'rgba(255,255,255,0.5)' }}
    >
      <ArrowLeft size={16} />
    </button>
  )

  return (
    <div className="relative size-full flex flex-col" style={{ background: DARK_BG }}>
      {viewToolbar}

      <div className="flex-1 min-h-0 relative">
        {isDesktopVideo ? (
          <div className="absolute inset-0 overflow-hidden" style={{ background: DARK_BG }}>
            <video
              ref={bgVideoRef}
              src={welcomeDesktop}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }} />
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(115deg, rgba(8,12,28,0.55) 0%, rgba(8,12,28,0.3) 45%, rgba(8,12,28,0.16) 100%)',
            }} />
            <div className="relative z-10 size-full flex items-center justify-center overflow-hidden" style={{ padding: 20 }}>
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-3xl h-full flex flex-col"
                style={{
                  background: 'rgba(10,14,24,0.78)',
                  backdropFilter: 'blur(28px) saturate(1.6)',
                  WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  boxShadow: '0 24px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.15)',
                  borderRadius: 32,
                }}
              >
                {phaseContent}
              </motion.div>
            </div>
          </div>
        ) : isPhonePreview ? (
          <motion.div
            key="phone"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col overflow-hidden mx-auto"
            style={isMobile ? {
              width: '100%',
              height: '100%',
              background: DARK_BG,
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
            <div className="absolute inset-0 overflow-hidden" style={{ background: '#000' }}>
              <video
                src={welcomeMobile}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0" style={{
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
              }} />
              <div className="absolute inset-0" style={{
                background: phase === 'form'
                  ? 'linear-gradient(180deg, rgba(8,12,28,0.9) 0%, rgba(8,12,28,0.84) 50%, rgba(8,12,28,0.88) 100%)'
                  : 'linear-gradient(180deg, rgba(8,12,28,0.65) 0%, rgba(8,12,28,0.45) 50%, rgba(8,12,28,0.6) 100%)',
              }} />
            </div>
            {backButton(isMobile ? 12 : 36)}
            {phase === 'intro' && (
              <motion.div
                key="intro-phone"
                className="absolute inset-0 z-50 overflow-hidden cursor-pointer"
                style={{ background: '#000' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                onClick={skipIntro}
              >
                <video
                  ref={introVideoRef}
                  src={introSrc}
                  autoPlay
                  muted
                  playsInline
                  onEnded={skipIntro}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </motion.div>
            )}
            <div className="relative z-10 flex flex-col flex-1 min-h-0">
                {phaseContent}
              </div>
          </motion.div>
        ) : (
          <motion.div
            key="desktop"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative size-full flex flex-col overflow-hidden"
            style={{
              background: 'rgba(10,14,24,0.92)',
              backdropFilter: 'blur(28px) saturate(1.6)',
              WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
            }}
          >
            {backButton(16)}
            <div className="flex-1 min-h-0 w-full max-w-3xl mx-auto flex flex-col">
              {phaseContent}
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {phase === 'intro' && !isPhonePreview && (
          <motion.div
            key="intro"
            ref={introContainerRef}
            className="absolute inset-0 z-50 overflow-hidden cursor-pointer"
            style={{ background: '#000' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.06 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            onClick={skipIntro}
          >
            <video
              ref={introVideoRef}
              src={introSrc}
              autoPlay
              muted
              playsInline
              onEnded={skipIntro}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
