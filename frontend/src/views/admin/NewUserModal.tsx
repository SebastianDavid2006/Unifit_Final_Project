import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  X, Check, FileText, User,
  ChevronLeft, ChevronRight, RefreshCw, ScanLine, Shield, GraduationCap
} from 'lucide-react'
import confetti from 'canvas-confetti'
import lectorHuellaImg from '../../assets/illustrations/actions/fingerprint.webp'
import coachCongratsImg from '../../assets/illustrations/characters/coach/coach_congratulations.webp'
import checkSuccessImg from '../../assets/illustrations/actions/feedback/success_check.webp'
import permissionsScene from '../../assets/scenes/permmisions_scene.png'

const BLUE = '#1270B7'
const RED = '#F43843'
const GREEN = '#22C55E'
const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #7ec8e3)'
const GREEN_GRAD = 'linear-gradient(135deg, #00fb64, #009b95)'
const BRAND_GRADIENT = 'linear-gradient(135deg, #F5A623, #1270B7, #F43843)'

const TIPO_DOC = ['CC', 'CE', 'Pasaporte', 'NIT']
const GENEROS = ['Masculino', 'Femenino', 'Otro']
const GRUPOS_SANGRE = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const MODALIDADES = ['Presencial', 'Virtual']
const JORNADAS = ['Mañana', 'Tarde', 'Noche', 'Completa']

const STEPS = [
  { num: 1, label: 'Información personal', icon: User },
  { num: 2, label: 'Tratamiento de datos', icon: FileText },
  { num: 3, label: 'Contrato', icon: FileText },
  { num: 4, label: 'Rol del usuario', icon: Shield },
  { num: 5, label: 'Huella digital', icon: ScanLine },
]

interface NewUserModalProps {
  open: boolean
  onClose: () => void
  onSuccess?: (user: { name: string; email: string; phone: string; role: string }) => void
}

type FingerprintStatus = 'idle' | 'scanning' | 'captured'

const INITIAL_FORM = {
  primerNombre: '', segundoNombre: '', primerApellido: '', segundoApellido: '',
  tipoDoc: 'CC', numDoc: '', fechaNac: '', genero: 'Masculino',
  eps: '', grupoSanguineo: 'O+', email: '', telefono: '',
  nombreContacto: '', telefonoContacto: '', parentesco: '',
}

export default function NewUserModal({ open, onClose, onSuccess }: NewUserModalProps) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ ...INITIAL_FORM })
  const [aceptaDatos, setAceptaDatos] = useState(false)
  const [aceptaContrato, setAceptaContrato] = useState(false)
  const [role, setRole] = useState<'trainer' | 'admin'>('trainer')
  const [fingerprintStatus, setFingerprintStatus] = useState<FingerprintStatus>('idle')
  const [success, setSuccess] = useState(false)
  const [shake, setShake] = useState(false)
  const [confirmClose, setConfirmClose] = useState(false)

  useEffect(() => {
    if (open) {
      setStep(1)
      setForm({ ...INITIAL_FORM })
      setAceptaDatos(false)
      setAceptaContrato(false)
      setRole('trainer')
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
    if (step === 4) return true
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
    const payload = {
      ...form,
      aceptaDatos,
      aceptaContrato,
      role,
      huella: fingerprintStatus === 'captured' ? 'capturada' : null,
    }
    console.log('Nuevo usuario:', payload)
    const nombreCompleto = `${form.primerNombre} ${form.segundoNombre} ${form.primerApellido} ${form.segundoApellido}`.replace(/\s+/g, ' ').trim()
    onSuccess?.({ name: nombreCompleto, email: form.email, phone: form.telefono, role })
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

  const meshInputBg = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)'
  const meshInputHover = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(0,0,0,0.04)'
  const field = (label: string, key: string, opts?: { type?: string; required?: boolean; placeholder?: string }) => (
    <div className="flex flex-col gap-1 group">
      <label className="text-[11px] font-bold transition-colors duration-200" style={{ color: 'rgba(0,0,0,0.6)' }}>
        {label}{opts?.required && <span className="ml-0.5" style={{ color: RED }}>*</span>}
      </label>
      <input
        type={opts?.type ?? 'text'}
        value={(form as any)[key] ?? ''}
        onChange={e => set(key, e.target.value)}
        placeholder={opts?.placeholder}
        className="px-3 py-2 rounded-xl text-xs font-medium outline-none w-full transition-all duration-200"
        style={{
          background: meshInputBg,
          color: '#1A1A1E',
          border: '1px solid transparent',
        }}
        onMouseEnter={e => { if (e.target !== document.activeElement) { e.target.style.background = meshInputHover; e.target.style.borderColor = 'rgba(0,0,0,0.06)' } }}
        onMouseLeave={e => { if (e.target !== document.activeElement) { e.target.style.background = meshInputBg; e.target.style.borderColor = 'transparent' } }}
        onFocus={e => { e.target.style.borderColor = BLUE; e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(18,112,183,0.04)'; e.target.style.boxShadow = '0 0 0 3px rgba(18,112,183,0.08)' }}
        onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.background = meshInputBg; e.target.style.boxShadow = 'none' }}
        required={opts?.required}
      />
    </div>
  )

  const select = (label: string, key: string, options: string[], opts?: { required?: boolean }) => (
    <div className="flex flex-col gap-1 relative group">
      <label className="text-[11px] font-bold transition-colors duration-200" style={{ color: 'rgba(0,0,0,0.6)' }}>
        {label}{opts?.required && <span className="ml-0.5" style={{ color: RED }}>*</span>}
      </label>
      <div className="relative">
        <select
          value={(form as any)[key] ?? ''}
          onChange={e => set(key, e.target.value)}
          className="px-3 py-2 rounded-xl text-xs font-medium outline-none w-full appearance-none transition-all duration-200 cursor-pointer"
          style={{
            background: meshInputBg,
            color: '#1A1A1E',
            border: '1px solid transparent',
            paddingRight: 32,
          }}
          onMouseEnter={e => { if (e.target !== document.activeElement) { e.target.style.background = meshInputHover; e.target.style.borderColor = 'rgba(0,0,0,0.06)' } }}
          onMouseLeave={e => { if (e.target !== document.activeElement) { e.target.style.background = meshInputBg; e.target.style.borderColor = 'transparent' } }}
          onFocus={e => { e.target.style.borderColor = BLUE; e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(18,112,183,0.04)'; e.target.style.boxShadow = '0 0 0 3px rgba(18,112,183,0.08)' }}
          onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.background = meshInputBg; e.target.style.boxShadow = 'none' }}
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

  const sectionTitle = (title: string) => (
    <div className="flex items-center gap-2 pt-2 pb-1">
      <div className="w-0.5 h-5 rounded-full" style={{ background: BLUE_GRAD }} />
      <span className="text-sm font-semibold" style={{ color: '#1A1A1E' }}>{title}</span>
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

      {sectionTitle('Contacto de emergencia')}
      <div className="grid grid-cols-3 gap-4">
        {field('Nombre contacto', 'nombreContacto')}
        {field('Teléfono contacto', 'telefonoContacto')}
        {field('Parentesco', 'parentesco')}
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-5">
      <div className="rounded-2xl p-5 text-xs leading-relaxed max-h-[280px] overflow-y-auto" style={{ background: 'rgba(0,0,0,0.02)', color: 'rgba(0,0,0,0.6)', border: '1px solid rgba(0,0,0,0.04)' }}>
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
            background: aceptaDatos ? BLUE_GRAD : 'transparent',
            border: `1.5px solid ${aceptaDatos ? BLUE : 'rgba(0,0,0,0.06)'}`,
          }}
        >
          {aceptaDatos && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
              <Check size={12} color="white" strokeWidth={3} />
            </motion.span>
          )}
        </div>
        <span style={{
          fontSize: 12,
          fontWeight: 500,
          lineHeight: 1.6,
          color: aceptaDatos ? 'transparent' : 'rgba(0,0,0,0.55)',
          background: aceptaDatos ? BLUE_GRAD : 'none',
          backgroundClip: aceptaDatos ? 'text' : 'none',
          WebkitBackgroundClip: aceptaDatos ? 'text' : 'none',
        }}>
          Autorizo el tratamiento de mis datos personales de acuerdo con la política de privacidad de UniFit.
        </span>
      </label>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-5">
      <div className="rounded-2xl p-5 text-xs leading-relaxed max-h-[280px] overflow-y-auto" style={{ background: 'rgba(0,0,0,0.02)', color: 'rgba(0,0,0,0.6)', border: '1px solid rgba(0,0,0,0.04)' }}>
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
            background: aceptaContrato ? BLUE_GRAD : 'transparent',
            border: `1.5px solid ${aceptaContrato ? BLUE : 'rgba(0,0,0,0.06)'}`,
          }}
        >
          {aceptaContrato && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
              <Check size={12} color="white" strokeWidth={3} />
            </motion.span>
          )}
        </div>
        <span style={{
          fontSize: 12,
          fontWeight: 500,
          lineHeight: 1.6,
          color: aceptaContrato ? 'transparent' : 'rgba(0,0,0,0.55)',
          background: aceptaContrato ? BLUE_GRAD : 'none',
          backgroundClip: aceptaContrato ? 'text' : 'none',
          WebkitBackgroundClip: aceptaContrato ? 'text' : 'none',
        }}>
          Acepto los términos y condiciones del contrato de prestación de servicios estudiantiles de UniFit.
        </span>
      </label>
    </div>
  )

  const renderStep4 = () => (
    <div className="relative h-full min-h-[400px] flex flex-col overflow-hidden rounded-2xl">
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-8 py-10 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="flex flex-col items-center text-center"
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <Shield size={28} style={{ color: '#FFFFFF' }} />
          </div>
          <h2 className="text-xl font-extrabold" style={{ color: '#FFFFFF' }}>Selecciona el rol</h2>
          <p className="text-sm mt-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Define qué tipo de acceso tendrá este usuario en el sistema
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
          {[
            {
              id: 'trainer' as const,
              label: 'Entrenador',
              desc: 'Gestión de estudiantes, rutinas, valoraciones y agenda.',
              icon: GraduationCap,
              gradient: 'linear-gradient(135deg, #1270B7, #0E5D9E)',
              accent: BLUE,
            },
            {
              id: 'admin' as const,
              label: 'Administrador',
              desc: 'Control total del sistema: usuarios, planes, configuración y reportes.',
              icon: Shield,
              gradient: 'linear-gradient(135deg, #F43843, #CC0033)',
              accent: RED,
            },
          ].map((opt, i) => (
            <motion.button
              key={opt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.1 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setRole(opt.id)}
              className="relative flex flex-col items-center text-center p-6 rounded-2xl overflow-hidden cursor-pointer"
              style={{
                background: role === opt.id
                  ? opt.gradient
                  : 'rgba(255,255,255,0.06)',
                border: role === opt.id
                  ? '1px solid rgba(255,255,255,0.2)'
                  : '1px solid rgba(255,255,255,0.1)',
                boxShadow: role === opt.id
                  ? `0 8px 32px ${opt.accent}40`
                  : '0 4px 16px rgba(0,0,0,0.1)',
              }}
            >
              {role === opt.id && (
                <motion.div
                  layoutId="roleCheck"
                  className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.25)' }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <Check size={13} color="#FFFFFF" strokeWidth={3} />
                </motion.div>
              )}
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{
                background: role === opt.id
                  ? 'rgba(255,255,255,0.15)'
                  : 'rgba(255,255,255,0.08)',
              }}>
                <opt.icon size={22} style={{ color: role === opt.id ? '#FFFFFF' : 'rgba(255,255,255,0.6)' }} />
              </div>
              <p className="text-sm font-bold" style={{ color: '#FFFFFF' }}>{opt.label}</p>
              <p className="text-[10px] mt-1.5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {opt.desc}
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )

  const renderStep5 = () => (
    <div className="flex flex-col items-center pt-8 gap-3 min-h-[400px]">
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
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="relative flex items-center justify-center"
          >
            <div className="absolute w-64 h-64 rounded-full" style={{
              background: 'radial-gradient(circle, rgba(34,197,94,0.25) 0%, transparent 70%)',
            }} />
            {[...Array(12)].map((_, i) => {
              const angle = (i / 12) * 360
              const rad = (angle * Math.PI) / 180
              const dist = 80 + (i % 3) * 20
              return (
                <motion.span
                  key={i}
                  className="absolute pointer-events-none text-lg select-none"
                  style={{ color: '#22C55E' }}
                  animate={{
                    x: [0, Math.cos(rad) * dist],
                    y: [0, Math.sin(rad) * dist],
                    opacity: [0, 1, 0],
                    scale: [0, 1.2, 0],
                  }}
                  transition={{
                    duration: 2 + (i % 4) * 0.3,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: 'easeOut',
                  }}
                >
                  ✦
                </motion.span>
              )
            })}
            <div className="relative w-64 h-64 flex items-center justify-center">
              <motion.img
                src={checkSuccessImg}
                alt="check"
                className="w-32 h-auto object-contain relative z-10"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        ) : (
          <div className="relative flex items-center justify-center">
            <div className="relative w-64 h-64">
              <motion.img
                src={lectorHuellaImg}
                alt="lector huella"
                className="w-full h-full object-contain"
                animate={{
                  scale: [1, 1.02, 1],
                  opacity: fingerprintStatus === 'scanning' ? 0.3 : 0.4,
                }}
                transition={{
                  scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                  opacity: { duration: 0.3 },
                }}
              />

            {fingerprintStatus === 'scanning' && (
              <>
                <motion.div
                  className="absolute inset-0 pointer-events-none z-10 overflow-hidden"
                  style={{
                    filter: 'brightness(1.3) drop-shadow(0 0 15px rgba(34,197,94,0.5))',
                  }}
                  animate={{
                    clipPath: [
                      'inset(90% 0 10% 0)',
                      'inset(10% 0 80% 0)',
                      'inset(90% 0 10% 0)',
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <img src={lectorHuellaImg} alt="" className="w-full h-full object-contain" />
                </motion.div>
              </>
            )}
          </div>
          </div>
        )}
      </div>

      {fingerprintStatus === 'idle' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs font-medium text-center"
          style={{ color: 'rgba(0,0,0,0.4)' }}
        >
          Coloca tu dedo sobre el sensor para capturar tu huella digital.
        </motion.p>
      )}

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
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-medium text-center"
          style={{ color: GREEN }}
        >
          Huella capturada exitosamente
        </motion.p>
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
      <div className="relative flex items-center justify-center -mt-28 mb-6">
        {[...Array(24)].map((_, i) => {
          const angle = (i / 24) * 360
          const rad = (angle * Math.PI) / 180
          return (
            <motion.span
              key={i}
              className="absolute pointer-events-none text-lg select-none"
              style={{ color: '#4ADE80' }}
              animate={{
                x: [0, Math.cos(rad) * (110 + (i % 6) * 20)],
                y: [0, Math.sin(rad) * (110 + (i % 6) * 20)],
                opacity: [0, 1, 0],
                scale: [0, 1.4, 0],
              }}
              transition={{
                duration: 2.5 + (i % 4) * 0.3,
                repeat: Infinity,
                delay: i * 0.07,
                ease: 'easeOut',
              }}
            >
              ✦
            </motion.span>
          )
        })}
        <div className="relative flex items-center justify-center">
          <motion.img
            src={coachCongratsImg}
            alt="felicitaciones"
            className="w-72 h-auto object-contain relative z-10"
            style={{ filter: 'drop-shadow(0 0 30px rgba(34,197,94,0.15))' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-24 pointer-events-none z-20" style={{
            background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, transparent 60%)',
          }} />
        </div>
      </div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="text-lg font-bold text-center"
        style={{ color: '#1A1A1E' }}
      >
        ¡Usuario registrado exitosamente!
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.4 }}
        className="text-xs font-medium mt-1 text-center"
        style={{ color: 'rgba(0,0,0,0.35)' }}
      >
        Los datos del usuario han sido guardados en el sistema.
      </motion.p>
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        whileHover={{ scale: 1.04, boxShadow: '0 8px 25px rgba(0,155,149,0.35)', transition: { duration: 0.15 } }}
        whileTap={{ scale: 0.92, boxShadow: '0 2px 8px rgba(0,155,149,0.2)', transition: { duration: 0.1 } }}
        onClick={onClose}
        className="mt-8 mb-10 px-8 py-3 rounded-2xl text-xs font-bold text-white cursor-pointer"
        style={{ background: GREEN_GRAD }}
      >
        Cerrar
      </motion.button>
    </motion.div>
  )

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
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={`flex flex-col relative ${success ? 'overflow-visible' : 'overflow-hidden'} ${step === 4 && !success
              ? 'w-full h-full'
              : `rounded-3xl w-full max-w-2xl mx-4 ${success ? '' : step === 1 ? 'h-[90vh] max-h-[700px]' : step === 5 ? 'min-h-[520px] max-h-[660px] h-auto' : 'min-h-[480px] max-h-[600px] h-auto'}`}`}
            style={{
              background: '#FFFFFF',
              border: step === 4 && !success ? 'none' : '1px solid rgba(0,0,0,0.04)',
              boxShadow: step === 4 && !success ? 'none' : '0 25px 60px rgba(0,0,0,0.12)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {step === 4 && !success && (
              <>
                <div className="absolute inset-0 z-0" style={{
                  background: 'radial-gradient(ellipse at center, #182634 0%, #0a1017 78%)',
                }} />
                <img
                  src={permissionsScene}
                  alt="Escena de permisos"
                  className="absolute inset-0 z-0 w-full h-full object-cover select-none pointer-events-none"
                  draggable={false}
                />
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.05 }}
                  className="absolute inset-0 z-0 pointer-events-none"
                  style={{ background: '#000000' }}
                />
              </>
            )}
            {success ? (
              renderSuccess()
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, filter: 'blur(6px)' }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col flex-1 min-h-0"
                >
                  {/* ── Header ──────────────────────────────── */}
                  {step !== 4 && (
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
                    <div className="flex items-center justify-center gap-1.5" style={{ marginTop: 12, marginBottom: 16 }}>
                      {STEPS.map((s) => (
                        <motion.div
                          key={s.num}
                          animate={{
                            width: s.num === step ? 16 : 6,
                            background: s.num === step ? BLUE_GRAD : 'rgba(0,0,0,0.12)',
                          }}
                          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                          className="rounded-full"
                          style={{ height: 6 }}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-bold tracking-wide text-center block" style={{
                      color: '#1A1A1E',
                      marginBottom: 10,
                    }}>
                      {STEPS.find(s => s.num === step)!.label}
                    </span>
                  </div>
                  )}

                  {/* ── Body (scrollable) ─────────────────── */}
                  <div className={step === 4 ? 'relative z-10 flex-1 overflow-hidden' : 'flex-1 overflow-y-auto px-6 pb-6 pt-5'}>
                    <motion.div
                      className={step === 4 ? 'h-full' : ''}
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
                  <div className={step === 4 ? 'relative z-10 flex-shrink-0 p-6 pt-4' : 'flex-shrink-0 p-6 pt-4'} style={{
                    borderTop: step === 4 ? 'none' : '1px solid rgba(0,0,0,0.04)',
                    background: step === 4 ? 'transparent' : 'rgba(255,255,255,0.8)',
                  }}>
                    <div className="flex items-center justify-between">
                      {step !== 4 && (
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
                      )}

                      <div className="flex-1 flex justify-center gap-3">
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

                      <div className={step === 4 ? 'flex justify-center w-full' : 'flex-1 flex justify-end'}>
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
