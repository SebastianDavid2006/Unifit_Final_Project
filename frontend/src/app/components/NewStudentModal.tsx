import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  X, Upload, Check, Pen, FileText, User,
  ChevronLeft, ChevronRight, CheckCircle, RefreshCw, ScanLine
} from 'lucide-react'
import SignatureCanvas from 'react-signature-canvas'
import confetti from 'canvas-confetti'
import huellaImg from '../../assets/illustrations/objects/huella.png'
import lectorHuellaImg from '../../assets/illustrations/objects/lector_huella.png'
import coachCongratsImg from '../../assets/illustrations/characters/coach_congratulations.png'

const BLUE = '#1270B7'
const RED = '#F43843'
const GREEN = '#22C55E'
const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #7ec8e3)'
const GREEN_GRAD = 'linear-gradient(135deg, #00fb64, #009b95)'
const BRAND_GRADIENT = 'linear-gradient(135deg, #F5A623, #1270B7, #F43843)'
const MESH_ACTIVE = `
  radial-gradient(circle at 30% 20%, rgba(244,56,67,0.95) 0%, transparent 50%),
  radial-gradient(circle at 70% 25%, rgba(18,112,183,0.65) 0%, transparent 50%),
  radial-gradient(circle at 50% 75%, rgba(245,166,35,0.55) 0%, transparent 50%),
  #F43843
`
const MESH_BUTTON = `
  radial-gradient(circle at 25% 25%, rgba(18,112,183,0.95) 0%, transparent 50%),
  radial-gradient(circle at 75% 30%, rgba(244,56,67,0.45) 0%, transparent 50%),
  radial-gradient(circle at 50% 75%, rgba(245,166,35,0.35) 0%, transparent 50%),
  #1270B7
`

const TIPO_DOC = ['CC', 'CE', 'Pasaporte', 'NIT']
const GENEROS = ['Masculino', 'Femenino', 'Otro']
const GRUPOS_SANGRE = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const MODALIDADES = ['Presencial', 'Virtual']
const JORNADAS = ['Mañana', 'Tarde', 'Noche', 'Completa']
const ESTADOS = ['Egresado', 'No egresado']

const STEPS = [
  { num: 1, label: 'Información personal', icon: User },
  { num: 2, label: 'Tratamiento de datos', icon: FileText },
  { num: 3, label: 'Contrato', icon: FileText },
  { num: 4, label: 'Firma', icon: Pen },
  { num: 5, label: 'Huella digital', icon: ScanLine },
]

interface NewStudentModalProps {
  open: boolean
  onClose: () => void
}

type FingerprintStatus = 'idle' | 'scanning' | 'captured'

const INITIAL_FORM = {
  primerNombre: '', segundoNombre: '', primerApellido: '', segundoApellido: '',
  tipoDoc: 'CC', numDoc: '', fechaNac: '', genero: 'Masculino',
  eps: '', grupoSanguineo: 'O+', email: '', telefono: '',
  nombreContacto: '', telefonoContacto: '', numCarnet: '',
  programa: '', institucion: '', semestre: '', modalidad: 'Presencial',
  jornada: 'Mañana', estado: 'Activo',
}

export default function NewStudentModal({ open, onClose }: NewStudentModalProps) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ ...INITIAL_FORM })
  const [certificado, setCertificado] = useState<File | null>(null)
  const [aceptaDatos, setAceptaDatos] = useState(false)
  const [aceptaContrato, setAceptaContrato] = useState(false)
  const [fingerprintStatus, setFingerprintStatus] = useState<FingerprintStatus>('idle')
  const [success, setSuccess] = useState(false)
  const [shake, setShake] = useState(false)
  const [confirmClose, setConfirmClose] = useState(false)
  const sigRef = useRef<SignatureCanvas>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setStep(1)
      setForm({ ...INITIAL_FORM })
      setCertificado(null)
      setAceptaDatos(false)
      setAceptaContrato(false)
      setFingerprintStatus('idle')
      setSuccess(false)
      setShake(false)
      setConfirmClose(false)
    }
  }, [open])

  const handleCloseClick = () => {
    if (success) {
      onClose()
    } else {
      setConfirmClose(true)
    }
  }

  const set = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }))

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  const canGoNext = (): boolean => {
    if (step === 1) {
      return !!(form.primerNombre && form.primerApellido && form.numDoc)
    }
    if (step === 2) return aceptaDatos
    if (step === 3) return aceptaContrato
    if (step === 4) return !(sigRef.current?.isEmpty() ?? true)
    if (step === 5) return fingerprintStatus === 'captured'
    return true
  }

  const handleNext = () => {
    if (!canGoNext()) {
      triggerShake()
      return
    }
    if (step === 5) {
      submitForm()
      return
    }
    setStep(p => p + 1)
  }

  const handlePrev = () => {
    if (step > 1) setStep(p => p - 1)
  }

  const submitForm = () => {
    const signatureData = sigRef.current?.toDataURL()
    const payload = {
      ...form,
      certificado: certificado?.name ?? null,
      aceptaDatos,
      aceptaContrato,
      firma: signatureData ?? null,
      huella: fingerprintStatus === 'captured' ? 'capturada' : null,
    }
    console.log('Nuevo estudiante:', payload)
    setSuccess(true)
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.55 },
      colors: ['#1270B7', '#F43843', '#22C55E', '#F5A623'],
    })
  }

  const handleCaptureFingerprint = () => {
    if (fingerprintStatus !== 'idle') return
    setFingerprintStatus('scanning')
    setTimeout(() => {
      setFingerprintStatus('captured')
    }, 5000)
  }

  // ── Helpers ──────────────────────────────────────────────────

  const field = (label: string, key: string, opts?: { type?: string; required?: boolean; placeholder?: string }) => (
    <div className="flex flex-col gap-1 group">
      <label className="text-[11px] font-bold transition-colors duration-200" style={{ color: 'rgba(0,0,0,0.4)' }}>
        {label}{opts?.required && <span className="ml-0.5" style={{ color: RED }}>*</span>}
      </label>
      <input
        type={opts?.type ?? 'text'}
        value={(form as any)[key] ?? ''}
        onChange={e => set(key, e.target.value)}
        placeholder={opts?.placeholder}
        className="px-3 py-2 rounded-xl text-xs font-medium outline-none w-full transition-all duration-200"
        style={{
          background: 'rgba(0,0,0,0.03)',
          color: '#1A1A1E',
          border: '1px solid transparent',
        }}
        onMouseEnter={e => { if (e.target !== document.activeElement) { e.target.style.background = 'rgba(0,0,0,0.05)'; e.target.style.borderColor = 'rgba(0,0,0,0.06)' } }}
        onMouseLeave={e => { if (e.target !== document.activeElement) { e.target.style.background = 'rgba(0,0,0,0.03)'; e.target.style.borderColor = 'transparent' } }}
        onFocus={e => { e.target.style.borderColor = BLUE; e.target.style.background = 'rgba(18,112,183,0.04)'; e.target.style.boxShadow = '0 0 0 3px rgba(18,112,183,0.08)' }}
        onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.background = 'rgba(0,0,0,0.03)'; e.target.style.boxShadow = 'none' }}
        required={opts?.required}
      />
    </div>
  )

  const select = (label: string, key: string, options: string[], opts?: { required?: boolean }) => (
    <div className="flex flex-col gap-1 relative group">
      <label className="text-[11px] font-bold transition-colors duration-200" style={{ color: 'rgba(0,0,0,0.4)' }}>
        {label}{opts?.required && <span className="ml-0.5" style={{ color: RED }}>*</span>}
      </label>
      <div className="relative">
        <select
          value={(form as any)[key] ?? ''}
          onChange={e => set(key, e.target.value)}
          className="px-3 py-2 rounded-xl text-xs font-medium outline-none w-full appearance-none transition-all duration-200 cursor-pointer"
          style={{
            background: 'rgba(0,0,0,0.03)',
            color: '#1A1A1E',
            border: '1px solid transparent',
            paddingRight: 32,
          }}
          onMouseEnter={e => { if (e.target !== document.activeElement) { e.target.style.background = 'rgba(0,0,0,0.05)'; e.target.style.borderColor = 'rgba(0,0,0,0.06)' } }}
          onMouseLeave={e => { if (e.target !== document.activeElement) { e.target.style.background = 'rgba(0,0,0,0.03)'; e.target.style.borderColor = 'transparent' } }}
          onFocus={e => { e.target.style.borderColor = BLUE; e.target.style.background = 'rgba(18,112,183,0.04)'; e.target.style.boxShadow = '0 0 0 3px rgba(18,112,183,0.08)' }}
          onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.background = 'rgba(0,0,0,0.03)'; e.target.style.boxShadow = 'none' }}
          required={opts?.required}
        >
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 group-hover:opacity-60" style={{ color: 'rgba(0,0,0,0.2)' }}>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  )

  // ── Step indicator ───────────────────────────────────────────

  const stepIndicator = (
    <div className="flex flex-col items-center px-6 pb-10">
      <div className="flex items-start justify-center w-full max-w-xs">
        {STEPS.map((s, i) => (
          <div key={s.num} className="flex items-center" style={{ flex: 1 }}>
            <div className="flex items-center justify-center flex-shrink-0" style={{ width: 38 }}>
              <div className="relative flex items-center justify-center">
                {s.num === step && (
                  <motion.span
                    animate={{
                      scale: [1, 1.25, 1],
                      opacity: [0.6, 0.1, 0.6],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      boxShadow: '0 0 25px rgba(244,56,67,0.6), 0 0 50px rgba(245,166,35,0.3), 0 0 75px rgba(18,112,183,0.2)',
                    }}
                  />
                )}
                <motion.div
                  layout
                  animate={{
                    scale: s.num === step ? [1.05, 1.25, 1.1, 1.15] : s.num > step ? [1, 0.75, 0.9, 0.85] : 0.85,
                    color: s.num <= step ? '#FFFFFF' : 'rgba(0,0,0,0.25)',
                    opacity: s.num < step ? Math.max(0.06, 1.2 - (step - s.num) * 0.3) : 1,
                  }}
                  transition={{
                    layout: { type: 'spring', stiffness: 300, damping: 22, mass: 1.2 },
                    scale: { type: 'spring', stiffness: 350, damping: 16, mass: 1.5, velocity: 2 },
                    color: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                  }}
                  className="rounded-full flex items-center justify-center text-xs font-bold relative flex-shrink-0 z-10"
                  style={{
                    width: s.num === step ? 38 : 32,
                    height: s.num === step ? 38 : 32,
                    background: s.num === step ? MESH_ACTIVE : s.num < step ? GREEN_GRAD : 'rgba(0,0,0,0.06)',
                  }}
                >
                {s.num < step ? (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 0.9, 1] }} transition={{ type: 'spring', stiffness: 500, damping: 18, mass: 0.8 }}>
                    <Check size={14} />
                  </motion.span>
                ) : (
                  <motion.span key={s.num === step ? 'active' : 'inert'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
                    {s.num}
                  </motion.span>
                )}
              </motion.div>
            </div>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-0.5 mx-1 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: s.num < step ? '100%' : '0%' }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full"
                  style={{ background: GREEN }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  // ── Step renders ─────────────────────────────────────────────

  const sectionTitle = (title: string) => (
    <div className="flex items-center gap-2 pt-2 pb-1">
      <div className="w-0.5 h-4 rounded-full" style={{ background: MESH_ACTIVE }} />
      <span className="text-xs font-bold" style={{ color: '#1A1A1E' }}>{title}</span>
    </div>
  )

  const renderStep1 = () => (
    <div className="space-y-5">
      {sectionTitle('Información personal')}
      <div className="grid grid-cols-2 gap-4">
        {field('Primer nombre', 'primerNombre', { required: true })}
        {field('Segundo nombre', 'segundoNombre')}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {field('Primer apellido', 'primerApellido', { required: true })}
        {field('Segundo apellido', 'segundoApellido')}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {select('Tipo de documento', 'tipoDoc', TIPO_DOC, { required: true })}
        {field('Número de documento', 'numDoc', { required: true })}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {field('Fecha de nacimiento', 'fechaNac', { type: 'date' })}
        {select('Género', 'genero', GENEROS)}
      </div>

      {sectionTitle('Información de contacto')}
      <div className="grid grid-cols-2 gap-4">
        {field('Email', 'email', { type: 'email' })}
        {field('Teléfono', 'telefono')}
      </div>

      {sectionTitle('Información médica')}
      <div className="grid grid-cols-2 gap-4">
        {field('EPS', 'eps')}
        {select('Grupo sanguíneo', 'grupoSanguineo', GRUPOS_SANGRE)}
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.4)' }}>Certificado EPS</label>
        <button type="button" onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-medium cursor-pointer"
          style={{ background: 'rgba(18,112,183,0.06)', color: BLUE, border: '1px dashed rgba(18,112,183,0.2)' }}
        >
          <Upload size={14} />
          {certificado ? certificado.name : 'Subir certificado'}
        </button>
        <input ref={fileRef} type="file" accept=".pdf,.jpg,.png" className="hidden"
          onChange={e => setCertificado(e.target.files?.[0] ?? null)} />
      </div>

      {sectionTitle('Contacto de emergencia')}
      <div className="grid grid-cols-2 gap-4">
        {field('Nombre contacto', 'nombreContacto')}
        {field('Teléfono contacto', 'telefonoContacto')}
      </div>

      {sectionTitle('Información académica')}
      <div className="grid grid-cols-2 gap-4">
        {field('Número carnet', 'numCarnet')}
        {select('Estado', 'estado', ESTADOS)}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {select('Institución', 'institucion', ['Universitaria de Colombia', 'Universitaria de Bogotá'])}
        {select('Modalidad', 'modalidad', MODALIDADES)}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {field('Programa', 'programa')}
        {select('Semestre', 'semestre', ['1', '2', '3', '4', '5', '6', '7', '8', '9'])}
        {select('Jornada', 'jornada', JORNADAS)}
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-5">
      <div className="rounded-2xl p-5 text-xs leading-relaxed" style={{ background: 'rgba(0,0,0,0.02)', color: 'rgba(0,0,0,0.6)', border: '1px solid rgba(0,0,0,0.04)' }}>
        <p className="font-bold text-sm mb-3" style={{ color: '#1A1A1E' }}>Autorización para el tratamiento de datos personales</p>
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
      <label className="flex items-start gap-3 cursor-pointer group">
        <div
          onClick={() => setAceptaDatos(!aceptaDatos)}
          className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 cursor-pointer"
          style={{
            background: aceptaDatos ? BLUE_GRAD : 'rgba(0,0,0,0.04)',
            border: `1.5px solid ${aceptaDatos ? BLUE : 'rgba(0,0,0,0.1)'}`,
          }}
        >
          {aceptaDatos && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
              <Check size={12} color="white" strokeWidth={3} />
            </motion.span>
          )}
        </div>
        <span className="text-xs font-medium leading-relaxed" style={{ color: 'rgba(0,0,0,0.55)' }}>
          Autorizo el tratamiento de mis datos personales de acuerdo con la política de privacidad de UniFit.
        </span>
      </label>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-5">
      <div className="rounded-2xl p-5 text-xs leading-relaxed" style={{ background: 'rgba(0,0,0,0.02)', color: 'rgba(0,0,0,0.6)', border: '1px solid rgba(0,0,0,0.04)' }}>
        <p className="font-bold text-sm mb-3" style={{ color: '#1A1A1E' }}>Contrato de prestación de servicios estudiantiles</p>
        <p className="mb-3">
          El presente contrato regula la relación entre UniFit S.A.S., en adelante "LA INSTITUCIÓN", y el estudiante que se registra a través del presente formulario, en adelante "EL ESTUDIANTE".
        </p>
        <p className="mb-3">
          <strong>CLÁUSULA PRIMERA – OBJETO:</strong> LA INSTITUCIÓN se compromete a proporcionar al ESTUDIANTE los servicios de entrenamiento y acompañamiento deportivo contratados, de acuerdo con el programa académico y la modalidad seleccionada en el formulario de registro.
        </p>
        <p className="mb-3">
          <strong>CLÁUSULA SEGUNDA – OBLIGACIONES DEL ESTUDIANTE:</strong> El ESTUDIANTE se obliga a asistir puntualmente a las sesiones programadas, cumplir con las normas internas de LA INSTITUCIÓN, utilizar adecuadamente las instalaciones y equipos, y mantener una conducta respetuosa hacia el personal y demás estudiantes.
        </p>
        <p className="mb-3">
          <strong>CLÁUSULA TERCERA – OBLIGACIONES DE LA INSTITUCIÓN:</strong> LA INSTITUCIÓN se obliga a proporcionar entrenadores calificados, mantener las instalaciones en condiciones óptimas de seguridad e higiene, y garantizar la prestación del servicio de acuerdo con los estándares de calidad establecidos.
        </p>
        <p className="mb-3">
          <strong>CLÁUSULA CUARTA – VALOR Y FORMA DE PAGO:</strong> El valor del programa será el establecido en la tarifa vigente al momento de la matrícula. EL ESTUDIANTE acepta realizar los pagos en las fechas y montos acordados.
        </p>
        <p className="mb-3">
          <strong>CLÁUSULA QUINTA – TERMINACIÓN:</strong> El presente contrato podrá ser terminado por cualquiera de las partes mediante comunicación escrita con quince (15) días de antelación, o de forma inmediata por incumplimiento grave de las obligaciones aquí establecidas.
        </p>
        <p>
          <strong>CLÁUSULA SEXTA – ACEPTACIÓN:</strong> Las partes aceptan el presente contrato y se obligan a su cumplimiento en todos sus términos.
        </p>
      </div>
      <label className="flex items-start gap-3 cursor-pointer group">
        <div
          onClick={() => setAceptaContrato(!aceptaContrato)}
          className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 cursor-pointer"
          style={{
            background: aceptaContrato ? BLUE_GRAD : 'rgba(0,0,0,0.04)',
            border: `1.5px solid ${aceptaContrato ? BLUE : 'rgba(0,0,0,0.1)'}`,
          }}
        >
          {aceptaContrato && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
              <Check size={12} color="white" strokeWidth={3} />
            </motion.span>
          )}
        </div>
        <span className="text-xs font-medium leading-relaxed" style={{ color: 'rgba(0,0,0,0.55)' }}>
          Acepto los términos y condiciones del contrato de prestación de servicios estudiantiles de UniFit.
        </span>
      </label>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-5">
      <p className="text-xs font-medium" style={{ color: 'rgba(0,0,0,0.4)' }}>
        Dibuja tu firma en el recuadro utilizando el mouse o tu dedo (si usas pantalla táctil).
      </p>
      <div
        className="relative rounded-2xl p-4"
        style={{
          background: 'linear-gradient(135deg, rgba(18,112,183,0.04), rgba(126,200,227,0.02))',
          border: '1px solid rgba(18,112,183,0.1)',
          boxShadow: 'inset 0 0 30px rgba(18,112,183,0.03)',
        }}
      >
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 rounded-tl pointer-events-none" style={{ borderColor: 'rgba(18,112,183,0.2)' }} />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 rounded-tr pointer-events-none" style={{ borderColor: 'rgba(18,112,183,0.2)' }} />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 rounded-bl pointer-events-none" style={{ borderColor: 'rgba(18,112,183,0.2)' }} />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 rounded-br pointer-events-none" style={{ borderColor: 'rgba(18,112,183,0.2)' }} />
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
          <SignatureCanvas
            ref={sigRef}
            penColor="#1A1A1E"
            minWidth={1}
            maxWidth={2.5}
            canvasProps={{
              className: 'w-full',
              style: { height: 200, background: 'rgba(0,0,0,0.02)', borderRadius: '12px', width: '100%' },
            }}
          />
        </div>
      </div>
    </div>
  )

  const renderStep5 = () => (
    <div className="space-y-6 flex flex-col items-center py-4">
      <p className="text-xs font-medium text-center" style={{ color: 'rgba(0,0,0,0.4)' }}>
        Coloca tu dedo sobre el sensor para capturar tu huella digital.
      </p>

      <div className="relative flex items-center justify-center">
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 320,
            height: 320,
            background: fingerprintStatus === 'scanning'
              ? 'radial-gradient(circle, rgba(34,197,94,0.5) 0%, rgba(34,197,94,0.15) 40%, transparent 70%)'
              : 'radial-gradient(circle, rgba(18,112,183,0.5) 0%, rgba(18,112,183,0.12) 40%, transparent 70%)',
          }}
          animate={fingerprintStatus !== 'captured' ? {
            scale: [1, 1.15, 1],
            opacity: fingerprintStatus === 'scanning' ? [0.3, 1, 0.3] : [0.5, 0.9, 0.5],
          } : { opacity: 0, scale: 1.5 }}
          transition={{ duration: 3, repeat: fingerprintStatus === 'captured' ? 0 : Infinity, ease: 'easeInOut' }}
        />

        {fingerprintStatus === 'scanning' && (
          <>
            {[...Array(2)].map((_, i) => (
              <motion.div
                key={`ring-${i}`}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: 64,
                  height: 64,
                  border: '1.5px solid rgba(34,197,94,0.4)',
                }}
                animate={{ scale: [1, 5], opacity: [0.6, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 1.5, ease: 'easeOut' }}
              />
            ))}
          </>
        )}

        {[...Array(16)].map((_, i) => {
          const angle = (i / 16) * 360
          const rad = (angle * Math.PI) / 180
          const dist = 80 + (i % 5) * 20
          return (
            <motion.span
              key={i}
              className="absolute pointer-events-none text-sm select-none"
              style={{ color: '#FFFFFF' }}
              animate={fingerprintStatus !== 'captured' ? {
                x: [0, Math.cos(rad) * dist],
                y: [0, Math.sin(rad) * dist],
                opacity: [0, 1, 0],
                scale: [0, 1.2, 0],
              } : { opacity: 0, scale: 0 }}
              transition={{
                duration: 3 + (i % 4) * 0.5,
                repeat: fingerprintStatus === 'captured' ? 0 : Infinity,
                delay: i * 0.12,
                ease: 'easeOut',
              }}
            >
              ✦
            </motion.span>
          )
        })}

        {fingerprintStatus === 'captured' ? (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }}>
            <CheckCircle size={80} color={GREEN} />
          </motion.div>
        ) : (
          <div className="relative w-64 h-64">
            <motion.img
              src={huellaImg}
              alt="huella"
              className="absolute inset-0 w-full h-full object-contain"
              animate={{
                scale: fingerprintStatus === 'scanning' ? [1, 1.06, 1] : [1, 1.03, 1],
                opacity: fingerprintStatus === 'scanning' ? 0 : 0.6,
              }}
              transition={{
                scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                opacity: { duration: 0.5, ease: 'easeInOut' },
              }}
            />
            <motion.img
              src={lectorHuellaImg}
              alt="lector huella"
              className="absolute inset-0 w-full h-full object-contain"
              animate={{
                scale: fingerprintStatus === 'scanning' ? [1, 1.06, 1] : [1, 1.03, 1],
                opacity: fingerprintStatus === 'scanning' ? 1 : 0,
                filter: fingerprintStatus === 'scanning'
                  ? 'brightness(1.2) drop-shadow(0 0 20px rgba(34,197,94,0.6))'
                  : 'none',
              }}
              transition={{
                scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                opacity: { duration: 0.5, ease: 'easeInOut' },
              }}
            />
          </div>
        )}
      </div>

      {fingerprintStatus === 'scanning' && (
        <motion.div
          className="flex items-center gap-2"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
            <RefreshCw size={16} color={GREEN} />
          </motion.div>
          <span className="text-xs font-medium" style={{ color: GREEN }}>Escaneando huella...</span>
        </motion.div>
      )}

      {fingerprintStatus === 'captured' && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2"
        >
          <Check size={16} color={GREEN} />
          <span className="text-xs font-medium" style={{ color: GREEN }}>Huella capturada exitosamente</span>
        </motion.div>
      )}
    </div>
  )

  const renderSuccess = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center pt-8 px-6"
    >
      <div className="relative flex items-center justify-center -mt-28 mb-2">
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width: 360,
            height: 360,
            background: `
              radial-gradient(ellipse at 30% 40%, rgba(34,197,94,0.5) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 30%, rgba(0,155,149,0.3) 0%, transparent 40%),
              radial-gradient(ellipse at 50% 70%, rgba(34,197,94,0.2) 0%, transparent 45%),
              radial-gradient(ellipse at 20% 60%, rgba(74,222,128,0.25) 0%, transparent 35%)
            `,
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width: 260,
            height: 260,
            background: `
              radial-gradient(ellipse at 60% 50%, rgba(34,197,94,0.35) 0%, transparent 45%),
              radial-gradient(ellipse at 30% 30%, rgba(0,251,100,0.2) 0%, transparent 40%)
            `,
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
        {[...Array(20)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute pointer-events-none text-lg select-none"
            style={{ color: '#4ADE80' }}
            animate={{
              x: [0, Math.cos((i / 20) * Math.PI * 2) * (100 + (i % 5) * 25)],
              y: [0, Math.sin((i / 20) * Math.PI * 2) * (100 + (i % 5) * 25)],
              opacity: [0, 1, 0],
              scale: [0, 1.4, 0],
            }}
            transition={{
              duration: 2.5 + (i % 4) * 0.3,
              repeat: Infinity,
              delay: i * 0.08,
              ease: 'easeOut',
            }}
          >
            ✦
          </motion.span>
        ))}
        <div className="relative w-64">
          <div
            className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-72 h-14 rounded-full pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(34,197,94,0.3), rgba(0,155,149,0.2))',
              filter: 'blur(24px)',
            }}
          />
          <div
            className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-60 h-10 rounded-full pointer-events-none"
            style={{
              background: 'rgba(0,0,0,0.12)',
              filter: 'blur(20px)',
            }}
          />
          <motion.div
            className="rounded-2xl p-6"
            style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(0,155,149,0.05))' }}
          >
            <motion.img
              src={coachCongratsImg}
              alt="felicitaciones"
              className="w-full h-auto object-contain relative z-10"
              initial={{ scale: 0, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
            />
          </motion.div>
        </div>
      </div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="text-lg font-bold text-center"
        style={{ color: '#1A1A1E' }}
      >
        ¡Estudiante registrado exitosamente!
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="text-xs font-medium mt-1 text-center"
        style={{ color: 'rgba(0,0,0,0.35)' }}
      >
        Los datos del estudiante han sido guardados en el sistema.
      </motion.p>
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onClose}
        className="mt-8 mb-10 px-8 py-3 rounded-xl text-xs font-bold text-white cursor-pointer"
        style={{ background: BLUE_GRAD }}
      >
        Cerrar
      </motion.button>
    </motion.div>
  )

  // ── Main render ──────────────────────────────────────────────

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(6px)' }}
          onClick={handleCloseClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col mx-4 relative ${success ? 'overflow-visible' : 'overflow-hidden'}`}
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(0,0,0,0.04)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.12)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {success ? (
              renderSuccess()
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, filter: 'blur(6px)' }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col flex-1 min-h-0"
                >
                  {/* ── Header ──────────────────────────────── */}
                  <div className="sticky top-0 z-10 flex-shrink-0" style={{
                    background: 'rgba(255,255,255,0.9)',
                    borderBottom: '1px solid rgba(0,0,0,0.04)',
                  }}>
                    <div className="flex items-center justify-end p-4 pb-0">
                      <motion.button
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        variants={{
                          rest: { scale: 1, background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.3)' },
                          hover: { scale: 1.15, background: 'rgba(244,56,67,0.1)', color: RED },
                          tap: { scale: 0.9 },
                        }}
                        onClick={handleCloseClick}
                        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors"
                      >
                        <X size={15} />
                      </motion.button>
                    </div>
                    <span className="text-lg font-black tracking-wider uppercase text-center block" style={{
                      background: MESH_ACTIVE,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 2px 20px rgba(244,56,67,0.15)',
                      marginTop: 8,
                      marginBottom: 32,
                    }}>
                      {STEPS.find(s => s.num === step)!.label}
                    </span>
                    {stepIndicator}
                  </div>

                  {/* ── Body (scrollable) ─────────────────── */}
                  <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2">
                    <motion.div
                      animate={shake ? { x: [0, -4, 4, -4, 4, 0] } : {}}
                      transition={{ duration: 0.4 }}
                    >
                      {step === 1 && renderStep1()}
                      {step === 2 && renderStep2()}
                      {step === 3 && renderStep3()}
                      {step === 4 && renderStep4()}
                      {step === 5 && renderStep5()}
                    </motion.div>
                  </div>

                  {/* ── Footer ────────────────────────────── */}
                  <div className="flex-shrink-0 p-6 pt-4" style={{
                    borderTop: '1px solid rgba(0,0,0,0.04)',
                    background: 'rgba(255,255,255,0.8)',
                  }}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 flex justify-start">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handlePrev}
                          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium cursor-pointer"
                          style={{ background: 'rgba(0,0,0,0.04)', color: step > 1 ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.15)' }}
                          disabled={step === 1}
                        >
                          <ChevronLeft size={14} />
                          Atrás
                        </motion.button>
                      </div>

                      <div className="flex-1 flex justify-center gap-3">
                        {step === 4 && (
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => sigRef.current?.clear()}
                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium cursor-pointer"
                            style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.4)' }}
                          >
                            <RefreshCw size={12} />
                            Limpiar firma
                          </motion.button>
                        )}
                        {step === 5 && fingerprintStatus === 'idle' && (
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleCaptureFingerprint}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
                            style={{ background: BLUE_GRAD }}
                          >
                            <ScanLine size={16} />
                            Capturar huella
                          </motion.button>
                        )}
                      </div>

                      <div className="flex-1 flex justify-end">
                        <motion.button
                          type="button"
                          variants={{
                            rest: { scale: 1, boxShadow: '0 4px 15px rgba(18,112,183,0)' },
                            hover: step === 5 && fingerprintStatus !== 'captured' ? {} : {
                              scale: 1.06,
                              boxShadow: step === 5
                                ? '0 8px 30px rgba(0,251,100,0.35), 0 0 60px rgba(0,155,149,0.15)'
                                : '0 8px 30px rgba(18,112,183,0.35), 0 0 60px rgba(18,112,183,0.1)',
                              transition: { type: 'spring', stiffness: 400, damping: 12 },
                            },
                            tap: step === 5 && fingerprintStatus !== 'captured' ? {} : {
                              scale: 0.92,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                              transition: { type: 'spring', stiffness: 500, damping: 10 },
                            },
                          }}
                          initial="rest"
                          whileHover={step === 5 && fingerprintStatus !== 'captured' ? undefined : "hover"}
                          whileTap={step === 5 && fingerprintStatus !== 'captured' ? undefined : "tap"}
                          onClick={handleNext}
                          disabled={step === 5 && fingerprintStatus !== 'captured'}
                          className="relative flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white overflow-hidden cursor-pointer"
                          style={{
                            background: step === 5 && fingerprintStatus !== 'captured' ? 'rgba(0,0,0,0.15)' : step === 5 ? GREEN_GRAD : BLUE_GRAD,
                            cursor: step === 5 && fingerprintStatus !== 'captured' ? 'not-allowed' : 'pointer',
                          }}
                        >
                          <motion.span
                            variants={{
                              rest: { opacity: 0, scale: 0 },
                              hover: { opacity: 1, scale: 2.5 },
                              tap: { opacity: 0, scale: 0 },
                            }}
                            initial="rest"
                            className="absolute inset-0 rounded-xl pointer-events-none"
                            style={{ background: 'rgba(255,255,255,0.2)' }}
                          />
                          <motion.span
                            animate={step === 5 ? {} : { x: [0, 3, 0] }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="relative z-10"
                          >
                            {step === 5 ? 'Finalizar' : 'Siguiente'}
                          </motion.span>
                          {step < 5 && (
                            <motion.span
                              animate={{ x: [0, 2, 0] }}
                              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                              className="relative z-10"
                            >
                              <ChevronRight size={14} />
                            </motion.span>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </div>
            </motion.div>
          </AnimatePresence>
        )}

            {/* ── Close confirmation ────────────────────── */}
            <AnimatePresence>
              {confirmClose && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 z-20 flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.15)' }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 8 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center gap-5 p-8 rounded-2xl max-w-xs text-center"
                    style={{
                      background: '#FFFFFF',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                      border: '1px solid rgba(0,0,0,0.04)',
                    }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(244,56,67,0.1)' }}>
                      <X size={18} color={RED} />
                    </div>
                    <div>
                      <p className="text-sm font-bold mb-1" style={{ color: '#1A1A1E' }}>¿Abandonar el registro?</p>
                      <p className="text-xs leading-relaxed" style={{ color: 'rgba(0,0,0,0.4)' }}>
                        Si cierras ahora, los datos ingresados se perderán.
                      </p>
                    </div>
                    <div className="flex items-center gap-2.5 w-full">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setConfirmClose(false)}
                        className="flex-1 py-2.5 rounded-xl text-xs font-medium cursor-pointer"
                        style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.5)' }}
                      >
                        Seguir aquí
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { setConfirmClose(false); onClose() }}
                        className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
                        style={{ background: RED }}
                      >
                        Salir
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
