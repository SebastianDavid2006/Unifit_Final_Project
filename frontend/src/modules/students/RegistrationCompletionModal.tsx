import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  X, ChevronLeft, ChevronRight,
} from 'lucide-react'
import checkSuccessImg from '@/assets/illustrations/actions/feedback/success_check.webp'
import coachCongratsImg from '@/assets/illustrations/characters/coach/coach_congratulations.webp'
import { StepDocAgreement } from '@/modules/students/NewStudentModal/sections/StepDocAgreement'
import { StepAcudiente } from '@/modules/students/NewStudentModal/sections/StepAcudiente'
import { loadDocs, type StoredDocs } from '@/data/documents'
import { api, mensajeError } from '@/lib/api'

const BLUE = '#1270B7'
const GREEN = '#22C55E'
const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #7ec8e3)'
const GREEN_BLUE_GRAD = 'linear-gradient(135deg, #22C55E, #1270B7)'

const INITIAL_ACUENTE = {
  acudientePrimerNombre: '', acudienteSegundoNombre: '',
  acudientePrimerApellido: '', acudienteSegundoApellido: '',
  acudienteDocumento: '', acudienteTipoDoc: 'CC', acudienteTelefono: '',
}

interface Props {
  open: boolean
  onClose: () => void
  onComplete: () => void
  studentName: string
  userId: string
}

export default function RegistrationCompletionModal({ open, onClose, onComplete, studentName, userId }: Props) {
  const [step, setStep] = useState(1)
  const [aceptaDatos, setAceptaDatos] = useState(false)
  const [aceptaContrato, setAceptaContrato] = useState(false)
  const [aceptaParq, setAceptaParq] = useState(false)
  const [docs, setDocs] = useState<StoredDocs>(() => loadDocs())
  const [success, setSuccess] = useState(false)
  const [shake, setShake] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isMinor, setIsMinor] = useState(false)
  const [acudienteForm, setAcudienteForm] = useState({ ...INITIAL_ACUENTE })

  const steps = useMemo(() => {
    if (isMinor) {
      return [
        { num: 1, label: 'Datos del acudiente' },
        { num: 2, label: 'Términos y condiciones' },
        { num: 3, label: 'PAR-Q' },
      ]
    }
    return [
      { num: 1, label: 'Términos y condiciones' },
      { num: 2, label: 'PAR-Q' },
    ]
  }, [isMinor])

  const totalSteps = steps.length

  useEffect(() => {
    if (open && userId) {
      api.get(`/usuarios/${userId}`).then(res => {
        const user = res.data
        if (user.fecha_nacimiento) {
          const birth = new Date(user.fecha_nacimiento)
          const now = new Date()
          let age = now.getFullYear() - birth.getFullYear()
          const m = now.getMonth() - birth.getMonth()
          if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--
          setIsMinor(age < 18)
        }
      }).catch(() => {})
    }
  }, [open, userId])

  useEffect(() => {
    if (open) {
      setStep(1)
      setAceptaDatos(false)
      setAceptaContrato(false)
      setAceptaParq(false)
      setDocs(loadDocs())
      setSuccess(false)
      setLoading(false)
      setError('')
      setAcudienteForm({ ...INITIAL_ACUENTE })
    }
  }, [open])

  const handleCloseClick = () => {
    if (success) onComplete()
    onClose()
  }

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 400)
  }

  const setAcudiente = (key: string, val: string) => setAcudienteForm(prev => ({ ...prev, [key]: val }))

  const canGoNext = () => {
    if (isMinor && step === 1) {
      return !!(acudienteForm.acudientePrimerNombre && acudienteForm.acudientePrimerApellido && acudienteForm.acudienteDocumento)
    }
    const termsStep = isMinor ? 2 : 1
    if (step === termsStep) return aceptaDatos && aceptaContrato
    const parqStep = isMinor ? 3 : 2
    if (step === parqStep) return aceptaParq
    return false
  }

  const handlePrev = () => setStep(s => Math.max(1, s - 1))

  const handleNext = async () => {
    if (!canGoNext()) { triggerShake(); return }

    setLoading(true)
    setError('')

    try {
      const termsStep = isMinor ? 2 : 1
      const parqStep = isMinor ? 3 : 2

      if (isMinor && step === 1) {
        const MAP_TIPO_DOC: Record<string, string> = { CC: 'CC', TI: 'TI', CE: 'CE', Pasaporte: 'PA', RC: 'RC' }
        await api.put(`/usuarios/${userId}`, {
          acudiente_primer_nombre: acudienteForm.acudientePrimerNombre?.trim(),
          acudiente_primer_apellido: acudienteForm.acudientePrimerApellido?.trim(),
          acudiente_documento: acudienteForm.acudienteDocumento?.trim(),
          acudiente_tipo_documento: MAP_TIPO_DOC[acudienteForm.acudienteTipoDoc] ?? 'CC',
          acudiente_telefono_contacto: acudienteForm.acudienteTelefono?.trim() || undefined,
        })
        setStep(2)
      } else if (step === termsStep) {
        await Promise.all([
          api.put(`/usuarios/${userId}/aceptar-documento`, { tipo_documento_legal: 'tratamiento_datos' }),
          api.put(`/usuarios/${userId}/aceptar-documento`, { tipo_documento_legal: 'contrato_gym' }),
        ])
        setStep(parqStep)
      } else if (step === parqStep) {
        await api.put(`/usuarios/${userId}/parq`)
        setSuccess(true)
      }
    } catch (err) {
      setError(mensajeError(err))
      triggerShake()
    } finally {
      setLoading(false)
    }
  }

  const renderSuccess = () => (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col items-center space-y-4 pt-8 px-6">
      <div className="relative flex items-center justify-center -mt-28 mb-6">
        {[...Array(24)].map((_, i) => { const angle = (i / 24) * 360, rad = (angle * Math.PI) / 180; return <motion.span key={i} className="absolute pointer-events-none text-lg select-none" style={{ color: '#4ADE80' }} animate={{ x: [0, Math.cos(rad) * (110 + (i % 6) * 20)], y: [0, Math.sin(rad) * (110 + (i % 6) * 20)], opacity: [0, 1, 0], scale: [0, 1.4, 0] }} transition={{ duration: 2.5 + (i % 4) * 0.3, repeat: Infinity, delay: i * 0.07, ease: 'easeOut' }}>✦</motion.span> })}
        <div className="relative flex items-center justify-center">
          <motion.img src={coachCongratsImg} alt="felicitaciones" className="w-72 h-auto object-contain relative z-10" style={{ filter: 'drop-shadow(0 0 30px rgba(34,197,94,0.15))' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }} />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-24 pointer-events-none z-20" style={{ background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, transparent 60%)' }} />
        </div>
      </div>
      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }} className="text-base font-bold text-center" style={{ color: '#1A1A1E' }}>¡Estudiante registrado exitosamente!</motion.p>
      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.4 }} className="text-sm font-medium text-center max-w-xs leading-relaxed" style={{ color: 'rgba(0,0,0,0.45)' }}>Tu cuenta queda habilitada. Tu usuario es tu correo electrónico y tu contraseña es tu número de documento; deberás cambiarla la primera vez que ingreses al sistema.</motion.p>
      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.4 }} className="text-sm font-bold text-center" style={{ color: BLUE }}>¡Para que empieces tu experiencia en UniFit y conquistes tu mejor versión!</motion.p>
      <motion.button whileHover={{ scale: 1.04, boxShadow: '0 8px 25px rgba(0,155,149,0.35)', transition: { duration: 0.15 } }} whileTap={{ scale: 0.92, boxShadow: '0 2px 8px rgba(0,155,149,0.2)', transition: { duration: 0.1 } }} onClick={handleCloseClick} className="mt-8 mb-10 px-8 py-3 rounded-2xl text-xs font-bold text-white cursor-pointer" style={{ background: GREEN_BLUE_GRAD }}>Cerrar</motion.button>
    </motion.div>
  )

  if (!open) return null

  const termsStep = isMinor ? 2 : 1
  const parqStep = isMinor ? 3 : 2
  const stepDoc = step === termsStep ? docs.tratamiento : step === parqStep ? docs.parq : null

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(6px)' }} onClick={handleCloseClick}>
        <motion.div initial={{ opacity: 0, scale: 0.97, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 8 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className={`rounded-3xl w-full max-w-2xl flex flex-col mx-4 relative ${success ? 'overflow-visible' : 'overflow-hidden'}`} style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 25px 60px rgba(0,0,0,0.12)', maxHeight: '90vh' }} onClick={e => e.stopPropagation()}>
          {success ? (
            renderSuccess()
          ) : (
            <>
              {/* Header */}
              <div className="sticky top-0 z-10 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.9)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                <div className="flex items-center justify-end p-4 pb-0">
                  <motion.button initial="rest" whileHover="hover" whileTap="tap" variants={{ rest: { scale: 1, background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.3)' }, hover: { scale: 1.15, background: 'rgba(244,56,67,0.1)', color: '#F43843' }, tap: { scale: 0.9 } }} onClick={handleCloseClick} className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors"><X size={15} /></motion.button>
                </div>
                <div className="flex items-center justify-center gap-1.5" style={{ marginTop: 12, marginBottom: 16 }}>
                  {steps.map((s) => (
                    <motion.div key={s.num} animate={{ width: s.num === step ? 16 : 6, background: s.num === step ? BLUE_GRAD : 'rgba(0,0,0,0.12)' }} transition={{ type: 'spring', stiffness: 300, damping: 22 }} className="rounded-full" style={{ height: 6 }} />
                  ))}
                </div>
                <span className="text-lg font-bold tracking-wide text-center block" style={{ color: '#1A1A1E', marginBottom: 10 }}>{steps.find(s => s.num === step)!.label}</span>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-6 pb-6 pt-5">
                <motion.div animate={shake ? { x: [0, -4, 4, -4, 4, 0] } : {}} transition={{ duration: 0.4 }}>
                  {isMinor && step === 1 && (
                    <StepAcudiente form={acudienteForm} set={setAcudiente} />
                  )}
                  {step === termsStep && (
                    <StepDocAgreement
                      step={2}
                      docs={docs}
                      aceptaDatos={aceptaDatos}
                      setAceptaDatos={setAceptaDatos}
                      aceptaContrato={aceptaContrato}
                      setAceptaContrato={setAceptaContrato}
                      aceptaParq={aceptaParq}
                      setAceptaParq={setAceptaParq}
                    />
                  )}
                  {step === parqStep && (
                    <StepDocAgreement
                      step={4}
                      docs={docs}
                      aceptaDatos={aceptaDatos}
                      setAceptaDatos={setAceptaDatos}
                      aceptaContrato={aceptaContrato}
                      setAceptaContrato={setAceptaContrato}
                      aceptaParq={aceptaParq}
                      setAceptaParq={setAceptaParq}
                    />
                  )}
                </motion.div>
                {error && (
                  <div className="mt-3 px-4 py-2.5 rounded-xl text-[11px] font-semibold" style={{ background: 'rgba(244,56,67,0.08)', border: '1px solid rgba(244,56,67,0.25)', color: '#D32F2F' }}>
                    {error}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex-shrink-0 p-6 pt-4" style={{ borderTop: '1px solid rgba(0,0,0,0.04)', background: 'rgba(255,255,255,0.8)' }}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 flex justify-start">
                    <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handlePrev} className="flex items-center gap-1.5 px-4 py-2 rounded-3xl text-sm font-medium cursor-pointer" style={{ background: 'rgba(0,0,0,0.04)', color: step > 1 ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.15)' }} disabled={step === 1}><ChevronLeft size={14} />Atrás</motion.button>
                  </div>

                  <div className="flex-1 flex justify-end">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleNext}
                      disabled={!canGoNext() || loading}
                      className="flex items-center gap-1.5 px-5 py-2 rounded-3xl text-sm font-bold text-white"
                      style={{
                        background: (!canGoNext() || loading) ? 'rgba(0,0,0,0.1)' : (step === parqStep ? GREEN_BLUE_GRAD : BLUE_GRAD),
                        cursor: (!canGoNext() || loading) ? 'not-allowed' : 'pointer',
                        boxShadow: canGoNext() ? '0 4px 16px rgba(18,112,183,0.35)' : 'none',
                      }}
                    >
                      <span>{loading ? 'Guardando...' : (step === parqStep ? 'Finalizar' : 'Siguiente')}</span>
                      {!loading && step < parqStep && <ChevronRight size={14} />}
                    </motion.button>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
