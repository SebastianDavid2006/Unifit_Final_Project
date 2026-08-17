import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  ArrowLeft, ArrowRight, Check, X, Maximize2,
} from 'lucide-react'
import {
  TIPO_DOC, GENEROS, GRUPOS_SANGRE, MODALIDADES, JORNADAS, ESTADOS, PARENTESCOS,
  TIPOS_USUARIO, INITIAL_FORM, BLUE, GREEN, BLUE_GRAD, GREEN_GRAD,
} from '@/modules/students/NewStudentData'
import type { TipoUsuario } from '@/modules/students/NewStudentData'
import { INSTITUCIONES, getNiveles, getPrograms } from '@/data/academicPrograms'
import { useIsMobile } from '@/shared/components/ui/use-mobile'
import { createAccount, generateTempPassword, sendEmail } from '@/shared/mock/mockAuth'
import logotipo from '@/assets/logo/logo.webp'
import accountCreatedImg from '@/assets/illustrations/characters/coach/account_created.webp'
import welcomeDesktop from '@/assets/scenes/videos/welcome_desktop.mp4'
import welcomeMobile from '@/assets/scenes/videos/welcome_mobile.mp4'

const DARK_BG = '#0A0A14'

let persistedPreview: 'celular' | 'desktop' | 'auto' = 'auto'

const FORM_STEPS = [
  { num: 1, label: 'Información personal' },
]

type Phase = 'intro' | 'form' | 'success'
const CONTRACT_TITLE = 'Contrato de prestación de servicios estudiantiles'
const CONTRACT_INTRO = 'El presente contrato regula la relación entre UniFit S.A.S., en adelante "LA INSTITUCIÓN", y el estudiante que se registra a través del presente formulario, en adelante "EL ESTUDIANTE".'
const CONTRACT_CLAUSES = [
  { t: 'CLÁUSULA PRIMERA – OBJETO:', b: 'LA INSTITUCIÓN se compromete a proporcionar al ESTUDIANTE los servicios de entrenamiento y acompañamiento deportivo contratados, de acuerdo con el programa académico y la modalidad seleccionada en el formulario de registro.' },
  { t: 'CLÁUSULA SEGUNDA – OBLIGACIONES DEL ESTUDIANTE:', b: 'El ESTUDIANTE se obliga a asistir puntualmente a las sesiones programadas, cumplir con las normas internas de LA INSTITUCIÓN, utilizar adecuadamente las instalaciones y equipos, y mantener una conducta respetuosa hacia el personal y demás estudiantes.' },
  { t: 'CLÁUSULA TERCERA – OBLIGACIONES DE LA INSTITUCIÓN:', b: 'LA INSTITUCIÓN se obliga a proporcionar entrenadores calificados, mantener las instalaciones en condiciones óptimas de seguridad e higiene, y garantizar la prestación del servicio de acuerdo con los estándares de calidad establecidos.' },
  { t: 'CLÁUSULA CUARTA – VALOR Y FORMA DE PAGO:', b: 'El valor del programa será el establecido en la tarifa vigente al momento de la matrícula. EL ESTUDIANTE acepta realizar los pagos en las fechas y montos acordados.' },
  { t: 'CLÁUSULA QUINTA – TERMINACIÓN:', b: 'El presente contrato podrá ser terminado por cualquiera de las partes mediante comunicación escrita con quince (15) días de antelación, o de forma inmediata por incumplimiento grave de las obligaciones aquí establecidas.' },
  { t: 'CLÁUSULA SEXTA – ACEPTACIÓN:', b: 'Las partes aceptan el presente contrato y se obligan a su cumplimiento en todos sus términos.' },
]

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
  const [showContractExpand, setShowContractExpand] = useState(false)
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

  const isMinor = useMemo(() => {
    if (!form.fechaNac) return false
    const birth = new Date(form.fechaNac)
    if (isNaN(birth.getTime())) return false
    const now = new Date()
    let age = now.getFullYear() - birth.getFullYear()
    const m = now.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--
    return age < 18
  }, [form.fechaNac])

  const canGoNext = () => {
    if (step === 1) {
      const base = !!(tipoUsuario && form.primerNombre && form.primerApellido && form.numDoc)
      if (!base) return false
      if (isMinor) {
        return !!form.nombreAcudiente &&
          !!form.parentescoAcudiente &&
          !!form.telefonoAcudiente &&
          (form.parentescoAcudiente !== 'Otro' || !!form.otroParentescoAcudiente)
      }
      return true
    }
    return true
  }

  const handleNext = () => {
    if (!canGoNext()) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }
    createMockAccount()
    setPhase('success')
  }

  const createMockAccount = () => {
    const email = (form.email || 'estudiante.demo@unifit.com').trim()
    const tempPassword = generateTempPassword()
    createAccount({
      email,
      password: tempPassword,
      nombre: `${form.primerNombre || 'Estudiante'} ${form.primerApellido || ''}`.trim(),
      estado: 'en_proceso',
      debeCambiarContrasena: true,
      onboarding: { cita: false, firma: false, huella: false },
    })
    sendEmail(
      email,
      'Tus credenciales de acceso a UniFit',
      `Hola${form.primerNombre ? ` ${form.primerNombre}` : ''}! Tu cuenta fue creada exitosamente. Tu usuario es tu correo electrónico (${email}) y tu contraseña temporal es la que encuentras abajo. Al ingresar por primera vez deberás cambiarla por una nueva.`,
      tempPassword,
    )
  }

  const handlePrev = () => {
    if (step > 1) setStep(p => p - 1)
    else onBack()
  }

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

      {isMinor && (
        <>
          {sectionTitle('Información del acudiente')}
          <div className="grid grid-cols-2 gap-3">
            {field('Nombre completo del acudiente', 'nombreAcudiente', { required: true })}
            {field('Teléfono del acudiente', 'telefonoAcudiente', { required: true })}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {select('Parentesco', 'parentescoAcudiente', PARENTESCOS, { required: true })}
            {form.parentescoAcudiente === 'Otro'
              ? field('Especifique el parentesco', 'otroParentescoAcudiente', { required: true })
              : <span />}
          </div>
        </>
      )}

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
    <div className="flex flex-col gap-4 px-5 py-4 h-full min-h-0">
      <div className="flex-1 min-h-0 rounded-2xl p-5 text-xs leading-relaxed overflow-y-auto" style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.07)' }}>
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
    <div className="flex flex-col gap-4 px-5 py-4 h-full min-h-0">
      <div className="rounded-xl p-1.5 flex-1 min-h-0 flex flex-col" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex-1 min-h-0 rounded-lg bg-white px-5 py-5 flex flex-col gap-3 overflow-y-auto" style={{ color: '#1A1A1E', boxShadow: '0 8px 30px rgba(0,0,0,0.25)' }}>
          <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
            <span className="text-[11px] font-extrabold" style={{ color: '#007AFF' }}>UNIFIT</span>
            <span className="text-[9px] font-bold tracking-[0.2em]" style={{ color: 'rgba(0,0,0,0.4)' }}>CONTRATO</span>
          </div>
          <p className="text-[12px] font-extrabold">{CONTRACT_TITLE}</p>
          <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(0,0,0,0.65)' }}>{CONTRACT_INTRO}</p>
          {CONTRACT_CLAUSES.map((c, i) => (
            <p key={i} className="text-[10px] leading-relaxed" style={{ color: 'rgba(0,0,0,0.65)' }}>
              <strong>{c.t}</strong> {c.b}
            </p>
          ))}
        </div>
      </div>
      {checkRow(aceptaContrato, () => setAceptaContrato(!aceptaContrato), 'Acepto los términos y condiciones del contrato de prestación de servicios estudiantiles de UniFit.')}
    </div>
  )

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
          className="h-full py-1"
        >
          {step === 1 ? formBody() : step === 2 ? renderStep2() : renderStep3()}
        </motion.div>
      </div>

      <div className="flex-shrink-0 px-5 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePrev}
            className="flex items-center gap-1 px-3.5 py-2.5 rounded-xl text-xs font-medium cursor-pointer justify-self-start"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}
          >
            <ArrowLeft size={14} />
            {step === 1 ? 'Salir' : 'Atrás'}
          </motion.button>
            {step === FORM_STEPS.length ? (
              <span />
            ) : (
              <span />
            )}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleNext}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer justify-self-end"
            style={{ background: BLUE_GRAD }}
          >
            Finalizar
            <ArrowRight size={14} />
          </motion.button>
        </div>
      </div>
    </>
  )

  const renderSuccess = () => (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex flex-col items-center justify-center flex-1 px-6 text-center min-h-0">
        <div className="mb-6 relative flex items-center justify-center">
          <motion.img
            src={accountCreatedImg}
            alt="Cuenta creada"
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
        <h2 className="text-xl sm:text-2xl font-extrabold" style={{ color: '#fff' }}>¡Bienvenido a UniFit!</h2>
        <p className="text-sm font-bold mt-3 leading-relaxed" style={{ color: '#7ec8e3' }}>
          Tus credenciales de acceso fueron enviadas a tu correo electrónico.
        </p>
        <p className="text-xs mt-2 leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Revisa tu bandeja de entrada y activa tu cuenta para comenzar a entrenar.
        </p>
      </div>

      <div className="flex-shrink-0 px-5 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onBack}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
            style={{ background: BLUE_GRAD }}
          >
            <ArrowLeft size={14} />
            Volver al inicio
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
            {showContractExpand ? (
              <div className="relative z-10 flex flex-col flex-1 min-h-0">
                <div className="flex-shrink-0 flex items-center px-5 pt-4 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-extrabold" style={{ color: '#007AFF' }}>UNIFIT</span>
                    <span className="text-[9px] font-bold tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.4)' }}>CONTRATO</span>
                  </div>
                </div>
                <div className="relative flex-1 min-h-0 px-4 pb-4">
                  <div className="h-full rounded-2xl bg-white overflow-y-auto px-5 py-5 text-[11px] leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)', boxShadow: '0 8px 30px rgba(0,0,0,0.25)' }}>
                    <p className="text-[13px] font-extrabold mb-3" style={{ color: '#1A1A1E' }}>{CONTRACT_TITLE}</p>
                    <p className="mb-3">{CONTRACT_INTRO}</p>
                    {CONTRACT_CLAUSES.map((c, i) => (
                      <p key={i} className="mb-3">
                        <strong>{c.t}</strong> {c.b}
                      </p>
                    ))}
                    <div className="flex items-center justify-between pt-3 mt-3" style={{ borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                      <span className="text-[10px] font-bold" style={{ color: 'rgba(0,0,0,0.5)' }}>UniFit S.A.S.</span>
                      <span className="text-[10px] font-bold" style={{ color: 'rgba(0,0,0,0.5)' }}>NIT 900.000.000-1</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowContractExpand(false)}
                    title="Contraer"
                    className="absolute top-4 right-6 w-9 h-9 rounded-xl flex items-center justify-center z-20 cursor-pointer"
                    style={{ background: '#FFFFFF', color: '#1A1A1E', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 14px rgba(0,0,0,0.2)' }}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative z-10 flex flex-col flex-1 min-h-0">
                {phaseContent}
              </div>
            )}
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

      <AnimatePresence>
        {showContractExpand && !isPhonePreview && (
          <motion.div
            key="contract-expand"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[70] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-2xl h-[85%] flex flex-col rounded-3xl overflow-hidden"
              style={{ background: '#FFFFFF', border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 40px 120px rgba(0,0,0,0.7)' }}
            >
              <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-extrabold" style={{ color: '#007AFF' }}>UNIFIT</span>
                  <span className="text-[9px] font-bold tracking-[0.2em]" style={{ color: 'rgba(0,0,0,0.4)' }}>CONTRATO</span>
                </div>
                <button
                  onClick={() => setShowContractExpand(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-black/5 transition-colors cursor-pointer"
                  style={{ color: 'rgba(0,0,0,0.5)' }}
                >
                  <X size={16} />
                </button>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6 text-xs leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
                <p className="text-[14px] font-extrabold mb-4" style={{ color: '#1A1A1E' }}>Contrato de prestación de servicios estudiantiles</p>
                <p className="mb-4">
                  El presente contrato regula la relación entre UniFit S.A.S., en adelante "LA INSTITUCIÓN", y el estudiante que se registra a través del presente formulario, en adelante "EL ESTUDIANTE".
                </p>
                <p className="mb-4">
                  <strong>CLÁUSULA PRIMERA – OBJETO:</strong> LA INSTITUCIÓN se compromete a proporcionar al ESTUDIANTE los servicios de entrenamiento y acompañamiento deportivo contratados, de acuerdo con el programa académico y la modalidad seleccionada en el formulario de registro.
                </p>
                <p className="mb-4">
                  <strong>CLÁUSULA SEGUNDA – OBLIGACIONES DEL ESTUDIANTE:</strong> El ESTUDIANTE se obliga a asistir puntualmente a las sesiones programadas, cumplir con las normas internas de LA INSTITUCIÓN, utilizar adecuadamente las instalaciones y equipos, y mantener una conducta respetuosa hacia el personal y demás estudiantes.
                </p>
                <p className="mb-4">
                  <strong>CLÁUSULA TERCERA – OBLIGACIONES DE LA INSTITUCIÓN:</strong> LA INSTITUCIÓN se obliga a proporcionar entrenadores calificados, mantener las instalaciones en condiciones óptimas de seguridad e higiene, y garantizar la prestación del servicio de acuerdo con los estándares de calidad establecidos.
                </p>
                <p className="mb-4">
                  <strong>CLÁUSULA CUARTA – VALOR Y FORMA DE PAGO:</strong> El valor del programa será el establecido en la tarifa vigente al momento de la matrícula. EL ESTUDIANTE acepta realizar los pagos en las fechas y montos acordados.
                </p>
                <p className="mb-4">
                  <strong>CLÁUSULA QUINTA – TERMINACIÓN:</strong> El presente contrato podrá ser terminado por cualquiera de las partes mediante comunicación escrita con quince (15) días de antelación, o de forma inmediata por incumplimiento grave de las obligaciones aquí establecidas.
                </p>
                <p className="mb-4">
                  <strong>CLÁUSULA SEXTA – ACEPTACIÓN:</strong> Las partes aceptan el presente contrato y se obligan a su cumplimiento en todos sus términos.
                </p>
                <div className="flex items-center justify-between pt-4 mt-4" style={{ borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                  <span className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.5)' }}>UniFit S.A.S.</span>
                  <span className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.5)' }}>NIT 900.000.000-1</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
