import { useState, useRef, useEffect, useMemo, type RefObject } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  X, Check, RefreshCw, ChevronLeft, ChevronRight, ExternalLink
} from 'lucide-react'
import SignatureCanvas from 'react-signature-canvas'
import confetti from 'canvas-confetti'
import lectorHuellaImg from '../../assets/illustrations/actions/fingerprint.webp'
import coachCongratsImg from '../../assets/illustrations/characters/coach/coach_congratulations.webp'
import checkSuccessImg from '../../assets/illustrations/actions/feedback/success_check.webp'
import { INSTITUCIONES, getNiveles, getPrograms } from '../../data/academicPrograms'
import { loadDocs, type StoredDocs } from '../../data/documents'
import {
  PARQ_GENERAL, PARQ_BLOCKS, PARQ_RECOMMENDATIONS, PARQ_DELAY, PARQ_DECLARATION_TEXT,
  getParqQuestion, buildParqSequence, parqPendingCount, type YesNo,
} from '../../data/parq'
import {
  BLUE, RED, GREEN, BLUE_GRAD, GREEN_GRAD, BRAND_GRADIENT, MESH_ACTIVE, MESH_BUTTON,
  TIPO_DOC, GENEROS, GRUPOS_SANGRE, MODALIDADES, JORNADAS, ESTADOS, PARENTESCOS,
  STEPS, TIPOS_USUARIO, INITIAL_FORM,
} from './NewStudentData'
import type { TipoUsuario } from './NewStudentData'

interface NewStudentModalProps {
  open: boolean
  onClose: () => void
}

type FingerprintStatus = 'idle' | 'scanning' | 'captured'

export default function NewStudentModal({ open, onClose }: NewStudentModalProps) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ ...INITIAL_FORM })
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario | null>(null)
  const [aceptaDatos, setAceptaDatos] = useState(false)
  const [aceptaContrato, setAceptaContrato] = useState(false)
  const [parqAnswers, setParqAnswers] = useState<Record<string, YesNo>>({})
  const [parqDetails, setParqDetails] = useState<Record<string, string>>({})
  const [parqPos, setParqPos] = useState(0)
  const [sigPos, setSigPos] = useState(0)
  const [aceptaParq, setAceptaParq] = useState(false)
  const [docs, setDocs] = useState<StoredDocs>(() => loadDocs())
  const [fingerprintStatus, setFingerprintStatus] = useState<FingerprintStatus>('idle')
  const [success, setSuccess] = useState(false)
  const [shake, setShake] = useState(false)
  const [confirmClose, setConfirmClose] = useState(false)
  const sigRef = useRef<SignatureCanvas>(null)
  const guardianRef = useRef<SignatureCanvas>(null)

  useEffect(() => {
    if (open) {
      setStep(1)
      setForm({ ...INITIAL_FORM })
      setTipoUsuario(null)
      setAceptaDatos(false)
      setAceptaContrato(false)
      setParqAnswers({})
      setParqDetails({})
      setParqPos(0)
      setSigPos(0)
      setAceptaParq(false)
      setDocs(loadDocs())
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

  const toggleTipoUsuario = (tipo: TipoUsuario) => {
    setTipoUsuario(prev => (prev === tipo ? null : tipo))
    const inst = 'Universitaria de Colombia'
    const level = getNiveles(inst)[0]
    const prog = getPrograms(inst, level)[0] ?? ''
    setForm(prev => ({
      ...prev,
      numCarnet: '', estado: 'Activo',
      institucion: inst, nivelFormacion: level, programa: prog,
      semestre: '1', modalidad: 'Presencial', jornada: 'Mañana',
      cargo: '', area: '',
    }))
  }

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  const canGoNext = (): boolean => {
    if (step === 1) {
      return !!(tipoUsuario && form.primerNombre && form.primerApellido && form.numDoc)
    }
    if (step === 2) return aceptaDatos
    if (step === 3) return aceptaContrato
    if (step === 4) return parqComplete
    if (step === 5) {
      if (sigRef.current?.isEmpty() ?? true) return false
      if (isMinor) {
        return !!form.nombreAcudiente && !!form.docAcudiente && !(guardianRef.current?.isEmpty() ?? true)
      }
      return true
    }
    if (step === 6) return fingerprintStatus === 'captured'
    return true
  }

  const handleNext = () => {
    if (!canGoNext()) {
      triggerShake()
      return
    }
    if (step === 6) {
      submitForm()
      return
    }
    setStep(p => p + 1)
  }

  const handlePrev = () => {
    if (step > 1) setStep(p => p - 1)
  }

  const stepDoc = step === 2 ? docs.tratamiento : step === 3 ? docs.contrato : step === 4 ? docs.parq : null

  const parqSequence = useMemo(() => buildParqSequence(parqAnswers), [parqAnswers])
  const parqPending = useMemo(
    () => parqPendingCount(parqAnswers, parqDetails, parqSequence),
    [parqAnswers, parqDetails, parqSequence],
  )
  const parqComplete = parqPending === 0 && aceptaParq
  const parqCurrentIndex = Math.min(parqPos, Math.max(0, parqSequence.length - 1))
  const parqCurrent = parqSequence[parqCurrentIndex]
  const parqQCount = parqSequence.filter(s => s.kind === 'general' || s.kind === 'gate' || s.kind === 'sub').length
  const parqDone = Math.max(0, parqQCount - parqPending)
  const stepLocked = (step === 6 && fingerprintStatus !== 'captured') || (step === 4 && !parqComplete)

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

  const submitForm = () => {
    const signatureData = sigRef.current?.toDataURL()
    const payload = {
      ...form,
      tipoUsuario,
      aceptaDatos,
      aceptaContrato,
      parq: {
        respuestas: parqAnswers,
        detalles: parqDetails,
        acepta: aceptaParq,
        fecha: new Date().toISOString(),
      },
      firma: signatureData ?? null,
      firmaAcudiente: isMinor ? (guardianRef.current?.toDataURL() ?? null) : null,
      nombreAcudiente: isMinor ? form.nombreAcudiente : null,
      docAcudiente: isMinor ? form.docAcudiente : null,
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

  const select = (label: string, key: string, options: string[], opts?: { required?: boolean; onChange?: (value: string) => void }) => (
    <div className="flex flex-col gap-1 relative group">
      <label className="text-[11px] font-bold transition-colors duration-200" style={{ color: 'rgba(0,0,0,0.6)' }}>
        {label}{opts?.required && <span className="ml-0.5" style={{ color: RED }}>*</span>}
      </label>
      <div className="relative">
        <select
          value={(form as any)[key] ?? ''}
          onChange={e => { set(key, e.target.value); opts?.onChange?.(e.target.value) }}
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

  // ── Step renders ─────────────────────────────────────────────

  const sectionTitle = (title: string) => (
    <div className="flex items-center gap-2 pt-2 pb-1">
      <div className="w-0.5 h-5 rounded-full" style={{ background: BLUE_GRAD }} />
      <span className="text-sm font-semibold" style={{ color: '#1A1A1E' }}>{title}</span>
    </div>
  )

  const signaturePad = (title: string, ref: RefObject<SignatureCanvas | null>) => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold" style={{ color: '#1A1A1E' }}>{title}</p>
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.93 }}
          onClick={() => ref.current?.clear()}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer"
          style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.4)' }}
        >
          <RefreshCw size={11} />
          Limpiar
        </motion.button>
      </div>
      <p className="text-[11px] font-medium mb-2" style={{ color: 'rgba(0,0,0,0.4)' }}>
        Dibuja tu firma en el recuadro utilizando el mouse o tu dedo (si usas pantalla táctil).
      </p>
      <div
        className="relative rounded-2xl p-4 overflow-hidden"
        style={{
          background: '#FFFFFF',
          border: '1px solid rgba(0,0,0,0.04)',
        }}
      >
        <motion.div
          className="absolute top-0 left-0 right-0 h-0.5 pointer-events-none z-10"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(18,112,183,0.3), transparent)' }}
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 pointer-events-none z-10"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(18,112,183,0.3), transparent)' }}
          animate={{ x: ['100%', '-100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 rounded-tl pointer-events-none" style={{ borderColor: 'rgba(18,112,183,0.2)' }} />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 rounded-tr pointer-events-none" style={{ borderColor: 'rgba(18,112,183,0.2)' }} />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 rounded-bl pointer-events-none" style={{ borderColor: 'rgba(18,112,183,0.2)' }} />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 rounded-br pointer-events-none" style={{ borderColor: 'rgba(18,112,183,0.2)' }} />
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.04)' }}>
          <SignatureCanvas
            ref={ref}
            penColor="#1A1A1E"
            minWidth={1}
            maxWidth={2.5}
            canvasProps={{
              className: 'w-full',
              style: { height: 200, background: '#FFFFFF', borderRadius: '12px', width: '100%' },
            }}
          />
        </div>
      </div>
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
        {select('Parentesco', 'parentesco', PARENTESCOS)}
      </div>

      {sectionTitle('Tipo de usuario')}
      <div className="grid grid-cols-3 gap-2">
        {TIPOS_USUARIO.map((opt, i) => {
          const selected = tipoUsuario === opt.id
          return (
            <motion.button
              key={opt.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.06 }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleTipoUsuario(opt.id)}
              onMouseEnter={e => { if (!selected) { e.currentTarget.style.background = `${opt.accent}12`; e.currentTarget.style.color = opt.accent } }}
              onMouseLeave={e => { if (!selected) { e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; e.currentTarget.style.color = 'rgba(0,0,0,0.35)' } }}
              className="flex flex-col items-center gap-1.5 px-3 py-3.5 rounded-xl text-xs font-bold transition-all duration-200"
              style={{
                background: selected ? opt.gradient : 'rgba(0,0,0,0.03)',
                color: selected ? '#FFFFFF' : 'rgba(0,0,0,0.35)',
                border: '1px solid transparent',
                boxShadow: selected ? `0 4px 20px ${opt.accent}40` : 'none',
              }}
            >
              <motion.img
                src={opt.img}
                alt={opt.label}
                className="mb-0.5"
                animate={{
                  width: selected ? 48 : 24,
                  height: selected ? 48 : 24,
                  marginTop: selected ? -24 : 0,
                  filter: selected ? 'blur(0px) drop-shadow(0 8px 20px rgba(0,0,0,0.15))' : 'blur(0px)',
                  opacity: 1,
                }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              />
              <span>{opt.label}</span>
            </motion.button>
          )
        })}
      </div>

      {tipoUsuario === 'estudiante' && (
        <>
          {sectionTitle('Información académica')}
          <div className="grid grid-cols-2 gap-4">
            {field('Número carnet', 'numCarnet')}
            {select('Estado', 'estado', ESTADOS)}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {select('Institución', 'institucion', INSTITUCIONES, {
              onChange: (inst) => {
                const levels = getNiveles(inst)
                const level = levels[0]
                const prog = getPrograms(inst, level)[0] ?? ''
                setForm(prev => ({ ...prev, institucion: inst, nivelFormacion: level, programa: prog }))
              }
            })}
            {select('Modalidad', 'modalidad', MODALIDADES)}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {select('Nivel de formación', 'nivelFormacion', getNiveles(form.institucion), {
              onChange: (level) => {
                const prog = getPrograms(form.institucion, level)[0] ?? ''
                setForm(prev => ({ ...prev, nivelFormacion: level, programa: prog }))
              }
            })}
            {select('Carrera', 'programa', getPrograms(form.institucion, form.nivelFormacion), { required: true })}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {select('Semestre', 'semestre', ['1', '2', '3', '4', '5', '6', '7', '8', '9'])}
            {select('Jornada', 'jornada', JORNADAS)}
          </div>
        </>
      )}

      {(tipoUsuario === 'profesor' || tipoUsuario === 'administrador') && (
        <>
          {sectionTitle('Información laboral')}
          <div className="grid grid-cols-2 gap-4">
            {field('Cargo', 'cargo', { required: true })}
            {field('Área', 'area', { required: true })}
          </div>
        </>
      )}

      {!tipoUsuario && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: 'rgba(245,166,35,0.07)', border: '1px dashed rgba(245,166,35,0.3)' }}>
          <span className="text-[11px] font-semibold" style={{ color: '#1A1A1E' }}>
            Selecciona el tipo de usuario para completar su información.
          </span>
        </div>
      )}
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-5">
      {docs.tratamiento.dataUrl ? (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
          <iframe src={docs.tratamiento.dataUrl} title="Tratamiento de datos" className="w-full h-[280px] bg-white" />
        </div>
      ) : (
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
      )}
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
      {docs.contrato.dataUrl ? (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
          <iframe src={docs.contrato.dataUrl} title="Contrato" className="w-full h-[340px] bg-white" />
        </div>
      ) : (
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
      )}
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

  const parqBlockFor = (id: string) => {
    const idx = PARQ_BLOCKS.findIndex(b => b.gate.id === id || b.subs.some(s => s.id === id))
    return idx >= 0 ? { block: PARQ_BLOCKS[idx], number: idx + 1 } : null
  }

  const renderParqDetail = (q: NonNullable<ReturnType<typeof getParqQuestion>>) => {
    if (!q.detail || parqAnswers[q.id] !== 'si') return null
    const d = q.detail
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden"
      >
        <p className="text-[10px] font-bold mb-1.5 mt-3" style={{ color: RED }}>{d.label}</p>
        <textarea
          value={parqDetails[d.id] ?? ''}
          onChange={e => setParqDetails(prev => ({ ...prev, [d.id]: e.target.value }))}
          placeholder={d.placeholder}
          rows={2}
          className="w-full rounded-xl px-3 py-2.5 text-xs outline-none resize-none"
          style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)', color: '#1A1A1E' }}
        />
      </motion.div>
    )
  }

  const renderParqQuestion = (q: NonNullable<ReturnType<typeof getParqQuestion>>) => {
    const value = parqAnswers[q.id]
    let chip = { text: '', color: BLUE }
    if (q.kind === 'general') {
      const n = PARQ_GENERAL.findIndex(g => g.id === q.id) + 1
      chip = { text: `Pregunta general ${n} de 7`, color: BLUE }
    } else {
      const found = parqBlockFor(q.id)
      if (found) {
        chip = {
          text: q.kind === 'gate' ? `Bloque ${found.number} · ${found.block.title}` : `Seguimiento · ${found.block.title}`,
          color: '#7C3AED',
        }
      }
    }
    return (
      <div className="rounded-2xl p-5" style={{ border: '1px solid rgba(0,0,0,0.04)', background: '#FFFFFF' }}>
        <span
          className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wide"
          style={{ background: `${chip.color}0F`, color: chip.color }}
        >
          {chip.text}
        </span>
        <p className="text-sm font-semibold leading-relaxed mt-3" style={{ color: '#1A1A1E' }}>
          {q.kind === 'sub' ? `${q.id}) ` : ''}{q.text}
        </p>
        {q.note && (
          <p className="text-[11px] leading-relaxed mt-2" style={{ color: 'rgba(0,0,0,0.45)' }}>
            {q.note}
          </p>
        )}
        <div className="flex gap-2.5 mt-4">
          {(['si', 'no'] as const).map(opt => (
            <motion.button
              key={opt}
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => setParqAnswers(prev => ({ ...prev, [q.id]: opt }))}
              className="px-4 py-2 rounded-xl text-[11px] font-bold uppercase cursor-pointer transition-all duration-200"
              style={{
                background: value === opt ? (opt === 'si' ? '#F43843' : '#22C55E') : 'rgba(0,0,0,0.04)',
                color: value === opt ? '#FFFFFF' : 'rgba(0,0,0,0.4)',
                boxShadow: value === opt ? `0 4px 12px ${opt === 'si' ? 'rgba(244,56,67,0.3)' : 'rgba(34,197,94,0.3)'}` : 'none',
              }}
            >
              {opt === 'si' ? 'Sí' : 'No'}
            </motion.button>
          ))}
        </div>
        {renderParqDetail(q)}
      </div>
    )
  }

  const renderParqInfo = (kind: string) => {
    if (kind === 'info-rec') {
      return (
        <div className="rounded-2xl p-5" style={{ border: '1px solid rgba(34,197,94,0.15)', background: '#FFFFFF' }}>
          <span
            className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wide"
            style={{ background: 'rgba(34,197,94,0.1)', color: GREEN }}
          >
            Recomendaciones
          </span>
          <p className="text-xs leading-relaxed mt-3 font-medium" style={{ color: 'rgba(0,0,0,0.6)' }}>
            Si usted contestó NO a todas las preguntas de SEGUIMIENTO (páginas 2-3) sobre trastornos médicos, está en condiciones de volverse más activo físicamente. Firme la DECLARACIÓN DEL PARTICIPANTE a continuación:
          </p>
          <div className="space-y-2.5 mt-4">
            {PARQ_RECOMMENDATIONS.map((r, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span
                  className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: 'rgba(34,197,94,0.12)' }}
                >
                  <Check size={9} color={GREEN} strokeWidth={3} />
                </span>
                <p className="text-[11px] leading-relaxed font-medium" style={{ color: 'rgba(0,0,0,0.6)' }}>{r}</p>
              </div>
            ))}
          </div>
        </div>
      )
    }
    if (kind === 'info-delay') {
      return (
        <div className="rounded-2xl p-5" style={{ border: '1px solid rgba(245,166,35,0.3)', background: 'rgba(245,166,35,0.04)' }}>
          <span
            className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wide"
            style={{ background: 'rgba(245,166,35,0.12)', color: '#C77700' }}
          >
            Retarde el inicio de la actividad física si:
          </span>
          <div className="space-y-2.5 mt-3">
            {PARQ_DELAY.map((r, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="text-[10px] font-bold flex-shrink-0 mt-0.5" style={{ color: '#C77700' }}>•</span>
                <p className="text-[11px] leading-relaxed font-medium" style={{ color: 'rgba(0,0,0,0.6)' }}>{r}</p>
              </div>
            ))}
          </div>
        </div>
      )
    }
    const nombre = `${form.primerNombre ?? ''} ${form.primerApellido ?? ''}`.trim()
    const fecha = new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })
    return (
      <div className="space-y-4">
        <div className="rounded-2xl p-5" style={{ border: '1px solid rgba(18,112,183,0.12)', background: '#FFFFFF' }}>
          <span
            className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wide"
            style={{ background: `${BLUE}0F`, color: BLUE }}
          >
            Declaración del participante
          </span>
          <p className="text-[11px] leading-relaxed mt-3 font-medium" style={{ color: 'rgba(0,0,0,0.55)' }}>
            Todo aquel que haya completado el PAR-Q+ debe leer y firmar la declaración que sigue a continuación.
          </p>
          <div className="rounded-xl px-4 py-3.5 mt-3" style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
            <p className="text-[11px] leading-relaxed italic" style={{ color: 'rgba(0,0,0,0.6)' }}>{PARQ_DECLARATION_TEXT}</p>
          </div>
          <p className="text-[10px] leading-relaxed mt-2 font-medium" style={{ color: '#C77700' }}>
            Si es usted menor de edad, la persona responsable por usted también debe firmar la declaración.
          </p>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div>
              <p className="text-[9px] font-bold uppercase mb-1" style={{ color: 'rgba(0,0,0,0.4)' }}>Nombre</p>
              <div className="rounded-xl px-3 py-2.5 text-xs font-semibold" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: '#1A1A1E' }}>
                {nombre || '—'}
              </div>
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase mb-1" style={{ color: 'rgba(0,0,0,0.4)' }}>Fecha</p>
              <div className="rounded-xl px-3 py-2.5 text-xs font-semibold" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: '#1A1A1E' }}>
                {fecha}
              </div>
            </div>
          </div>
        </div>

        <label className="flex items-start gap-3 cursor-pointer group">
          <div
            onClick={() => setAceptaParq(!aceptaParq)}
            className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 cursor-pointer"
            style={{
              background: aceptaParq ? BLUE_GRAD : 'transparent',
              border: `1.5px solid ${aceptaParq ? BLUE : 'rgba(0,0,0,0.06)'}`,
            }}
          >
            {aceptaParq && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
                <Check size={12} color="white" strokeWidth={3} />
              </motion.span>
            )}
          </div>
          <span style={{
            fontSize: 12,
            fontWeight: 500,
            lineHeight: 1.6,
            color: aceptaParq ? 'transparent' : 'rgba(0,0,0,0.55)',
            background: aceptaParq ? BLUE_GRAD : 'none',
            backgroundClip: aceptaParq ? 'text' : 'none',
            WebkitBackgroundClip: aceptaParq ? 'text' : 'none',
          }}>
            Declaro haber leído y comprendido el cuestionario PAR-Q+ y acepto la declaración del participante.
          </span>
        </label>
      </div>
    )
  }

  const renderStepParq = () => {
    const q = parqCurrent ? getParqQuestion(parqCurrent.id) : undefined
    const progressPct = parqQCount > 0 ? (parqDone / parqQCount) * 100 : 0
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 rounded-xl px-3.5 py-2.5" style={{ background: `${BLUE}0A`, border: '1px solid rgba(18,112,183,0.12)' }}>
          <ClipboardCheck size={15} style={{ color: BLUE }} />
          <p className="text-[11px] font-semibold" style={{ color: 'rgba(0,0,0,0.55)' }}>
            PAR-Q+ · El cuestionario indicará si es necesario consultar a su médico o profesional de la salud antes de volverse más activo físicamente.
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: 'rgba(0,0,0,0.4)' }}>
              Progreso del PAR-Q+
            </span>
            <span className="text-[10px] font-bold tabular-nums" style={{ color: parqQCount > 0 && parqDone < parqQCount ? '#C77700' : GREEN }}>
              {parqQCount > 0 ? `${parqDone}/${parqQCount}` : '0/0'} preguntas
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: parqQCount > 0 && parqDone < parqQCount ? BLUE_GRAD : GREEN_GRAD }}
              animate={{ width: `${progressPct}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={parqCurrent?.id ?? 'none'}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {q ? renderParqQuestion(q) : renderParqInfo(parqCurrent?.kind ?? 'info-rec')}
          </motion.div>
        </AnimatePresence>

        {parqPending > 0 && (
          <p className="text-[10px] font-semibold text-center" style={{ color: RED }}>
            Faltan {parqPending} pregunta{parqPending !== 1 ? 's' : ''} por responder para poder continuar
          </p>
        )}
      </div>
    )
  }

  const renderStep4 = () => (
    <div className="space-y-6">
      {isMinor ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={sigPos}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            {sigPos === 0 && (
              <>
                <div className="flex items-start gap-3 rounded-2xl px-4 py-3.5" style={{ background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.25)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(245,166,35,0.15)' }}>
                    <User size={15} style={{ color: '#D98E00' }} />
                  </div>
                  <div>
                    <p className="text-xs font-bold" style={{ color: '#B37000' }}>Eres menor de edad</p>
                    <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: 'rgba(0,0,0,0.5)' }}>
                      Primero firma tu acudiente o responsable legal, y después firmarás tú.
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold mb-2" style={{ color: '#1A1A1E' }}>Datos del acudiente</p>
                  <div className="grid grid-cols-2 gap-4">
                    {field('Nombre del acudiente', 'nombreAcudiente', { required: true })}
                    {field('Documento del acudiente', 'docAcudiente', { required: true })}
                  </div>
                </div>

                {signaturePad('Firma del acudiente (responsable legal)', guardianRef)}
              </>
            )}
            {sigPos === 1 && signaturePad('Firma del estudiante', sigRef)}
          </motion.div>
        </AnimatePresence>
      ) : (
        signaturePad('Firma del estudiante', sigRef)
      )}
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
        ¡Estudiante registrado exitosamente!
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.4 }}
        className="text-xs font-medium mt-1 text-center"
        style={{ color: 'rgba(0,0,0,0.35)' }}
      >
        Los datos del estudiante han sido guardados en el sistema.
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
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={`rounded-3xl w-full max-w-2xl flex flex-col mx-4 relative ${success ? 'overflow-visible' : 'overflow-hidden'} ${success ? '' : step === 1 ? 'h-[90vh] max-h-[700px]' : step === 6 ? 'min-h-[520px] max-h-[660px] h-auto' : 'min-h-[480px] max-h-[600px] h-auto'}`}
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
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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

                  {/* ── Body (scrollable) ─────────────────── */}
                  <div className="flex-1 overflow-y-auto px-6 pb-6 pt-5">
                    <motion.div
                      animate={shake ? { x: [0, -4, 4, -4, 4, 0] } : {}}
                      transition={{ duration: 0.4 }}
                    >
                      {step === 1 && renderStep1()}
                      {step === 2 && renderStep2()}
                      {step === 3 && renderStep3()}
                      {step === 4 && renderStepParq()}
                      {step === 5 && renderStep4()}
                      {step === 6 && renderStep5()}
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
                          <div className="flex items-center gap-1.5">
                            <motion.button
                              type="button"
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setParqPos(p => Math.max(0, p - 1))}
                              disabled={parqCurrentIndex <= 0}
                              className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                              style={{
                                background: parqCurrentIndex > 0 ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.02)',
                                color: parqCurrentIndex > 0 ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0.15)',
                              }}
                            >
                              <ChevronLeft size={16} />
                            </motion.button>
                            <span className="text-[10px] font-bold tabular-nums min-w-[56px] text-center" style={{ color: 'rgba(0,0,0,0.4)' }}>
                              {parqCurrentIndex + 1} de {parqSequence.length}
                            </span>
                            <motion.button
                              type="button"
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setParqPos(p => Math.min(Math.max(0, parqSequence.length - 1), p + 1))}
                              disabled={parqCurrentIndex >= parqSequence.length - 1}
                              className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                              style={{
                                background: parqCurrentIndex < parqSequence.length - 1 ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.02)',
                                color: parqCurrentIndex < parqSequence.length - 1 ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0.15)',
                              }}
                            >
                              <ChevronRight size={16} />
                            </motion.button>
                          </div>
                        )}
                        {stepDoc?.dataUrl && (
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => window.open(stepDoc.dataUrl, '_blank')}
                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium cursor-pointer"
                            style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.5)' }}
                          >
                            <ExternalLink size={12} />
                            Abrir documento
                          </motion.button>
                        )}
                        {step === 5 && isMinor && (
                          <div className="flex items-center gap-1.5">
                            <motion.button
                              type="button"
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setSigPos(p => Math.max(0, p - 1))}
                              disabled={sigPos <= 0}
                              className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                              style={{
                                background: sigPos > 0 ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.02)',
                                color: sigPos > 0 ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0.15)',
                              }}
                            >
                              <ChevronLeft size={16} />
                            </motion.button>
                            <span className="text-[10px] font-bold tabular-nums min-w-[56px] text-center" style={{ color: 'rgba(0,0,0,0.4)' }}>
                              {sigPos + 1} de 2
                            </span>
                            <motion.button
                              type="button"
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setSigPos(p => Math.min(1, p + 1))}
                              disabled={sigPos >= 1}
                              className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                              style={{
                                background: sigPos < 1 ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.02)',
                                color: sigPos < 1 ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0.15)',
                              }}
                            >
                              <ChevronRight size={16} />
                            </motion.button>
                          </div>
                        )}
                        {step === 6 && fingerprintStatus === 'idle' && (
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
                            hover: stepLocked ? {} : {
                              scale: 1.06,
                              boxShadow: step === 6
                                ? '0 8px 30px rgba(0,251,100,0.35), 0 0 60px rgba(0,155,149,0.15)'
                                : '0 8px 30px rgba(18,112,183,0.35), 0 0 60px rgba(18,112,183,0.1)',
                              transition: { type: 'spring', stiffness: 400, damping: 12 },
                            },
                            tap: stepLocked ? {} : {
                              scale: 0.92,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                              transition: { type: 'spring', stiffness: 500, damping: 10 },
                            },
                          }}
                          initial="rest"
                          whileHover={stepLocked ? undefined : "hover"}
                          whileTap={stepLocked ? undefined : "tap"}
                          onClick={handleNext}
                          disabled={stepLocked}
                          className="relative flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white overflow-hidden cursor-pointer"
                          style={{
                            background: stepLocked ? 'rgba(0,0,0,0.15)' : step === 6 ? GREEN_GRAD : BLUE_GRAD,
                            cursor: stepLocked ? 'not-allowed' : 'pointer',
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
                            animate={step === 6 ? {} : { x: [0, 3, 0] }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="relative z-10"
                          >
                            {step === 6 ? 'Finalizar' : 'Siguiente'}
                          </motion.span>
                          {step < 6 && (
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


