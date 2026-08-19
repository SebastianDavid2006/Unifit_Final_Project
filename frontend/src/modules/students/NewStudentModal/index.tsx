import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, ChevronLeft, ChevronRight, ExternalLink, ScanLine } from 'lucide-react'
import type SignatureCanvas from 'react-signature-canvas'
import confetti from 'canvas-confetti'
import DemoInbox from '@/modules/students/components/DemoInbox'
import { createAccount, generateTempPassword, sendEmail } from '@/auth/services/authService'
import { getNiveles, getPrograms } from '@/data/config/academicPrograms'
import { loadDocs, type StoredDocs } from '@/data/documents'
import { BLUE_GRAD, GREEN_GRAD, RED, STEPS, INITIAL_FORM } from '@/modules/students/NewStudentData'
import type { TipoUsuario } from '@/modules/students/NewStudentData'

import { Step1Info } from './sections/Step1Info'
import { StepDocAgreement } from './sections/StepDocAgreement'
import { StepSignature } from './sections/StepSignature'
import { StepFingerprint } from './sections/StepFingerprint'
import { SuccessView } from './sections/SuccessView'

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
  const [sigPos, setSigPos] = useState(0)
  const [sigDone, setSigDone] = useState(false)
  const [aceptaParq, setAceptaParq] = useState(false)
  const [docs, setDocs] = useState<StoredDocs>(() => loadDocs())
  const [fingerprintStatus, setFingerprintStatus] = useState<FingerprintStatus>('idle')
  const [success, setSuccess] = useState(false)
  const [shake, setShake] = useState(false)
  const [confirmClose, setConfirmClose] = useState(false)
  const [showInbox, setShowInbox] = useState(false)
  const [createdEmail, setCreatedEmail] = useState('')
  const [, setCreatedName] = useState('')
  const sigRef = useRef<SignatureCanvas>(null)
  const guardianRef = useRef<SignatureCanvas>(null)

  useEffect(() => {
    if (open) {
      setStep(1)
      setForm({ ...INITIAL_FORM })
      setTipoUsuario(null)
      setAceptaDatos(false)
      setAceptaContrato(false)
      setSigPos(0)
      setSigDone(false)
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
    if (step === 4) return aceptaParq
    if (step === 5) return sigDone
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

  const stepLocked = (step === 6 && fingerprintStatus !== 'captured') ||
    (step === 5 && !canGoNext())

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

  useEffect(() => {
    if (step !== 5) return
    const id = window.setInterval(() => {
      const studentEmpty = sigRef.current?.isEmpty() ?? true
      const guardianEmpty = isMinor ? (guardianRef.current?.isEmpty() ?? true) : false
      const done = !studentEmpty && (isMinor ? !guardianEmpty : true)
      setSigDone(prev => (prev === done ? prev : done))
    }, 250)
    return () => window.clearInterval(id)
  }, [step, isMinor])

  const submitForm = () => {
    const signatureData = sigRef.current?.toDataURL()
    const payload = {
      ...form,
      tipoUsuario,
      aceptaDatos,
      aceptaContrato,
      parq: {
        acepta: aceptaParq,
        fecha: new Date().toISOString(),
      },
      firma: signatureData ?? null,
      firmaAcudiente: isMinor ? (guardianRef.current?.toDataURL() ?? null) : null,
      nombreAcudiente: isMinor ? form.nombreAcudiente : null,
      parentescoAcudiente: isMinor ? (form.parentescoAcudiente === 'Otro' ? form.otroParentescoAcudiente : form.parentescoAcudiente) : null,
      telefonoAcudiente: isMinor ? form.telefonoAcudiente : null,
      huella: fingerprintStatus === 'captured' ? 'capturada' : null,
    }
    console.log('Nuevo estudiante:', payload)

    const email = (form.email || `${(form.primerNombre || 'estudiante').toLowerCase()}@unifit.com`).trim()
    const tempPassword = generateTempPassword()
    const created = createAccount({
      email,
      password: tempPassword,
      nombre: `${form.primerNombre || ''} ${form.primerApellido || ''}`.trim(),
      estado: 'activo',
      debeCambiarContrasena: true,
      onboarding: { cita: true, firma: true, huella: true },
    })
    sendEmail(
      email,
      'Tus credenciales de acceso a UniFit',
      `Hola${form.primerNombre ? ` ${form.primerNombre}` : ''}! Tu cuenta fue creada exitosamente. Tu usuario es tu correo electrónico (${email}) y te hemos enviado una contraseña temporal. Al ingresar por primera vez deberás cambiarla por una nueva.`,
      tempPassword,
    )
    setCreatedEmail(email)
    setCreatedName(created.nombre)

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

  return (
    <AnimatePresence>
      {open && (
        <>
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
                <SuccessView
                  createdEmail={createdEmail}
                  onShowInbox={() => setShowInbox(true)}
                  onClose={onClose}
                />
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
                    {/* Header */}
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

                    {/* Body (scrollable) */}
                    <div className="flex-1 flex flex-col min-h-0 px-6 pb-6 pt-5 overflow-y-auto">
                      <motion.div
                        className={step === 4 ? 'flex flex-col flex-1 min-h-0' : ''}
                        animate={shake ? { x: [0, -4, 4, -4, 4, 0] } : {}}
                        transition={{ duration: 0.4 }}
                      >
                        {step === 1 && (
                          <Step1Info
                            form={form}
                            set={set}
                            tipoUsuario={tipoUsuario}
                            toggleTipoUsuario={toggleTipoUsuario}
                            setForm={setForm}
                            isMinor={isMinor}
                          />
                        )}
                        {(step === 2 || step === 3 || step === 4) && (
                          <StepDocAgreement
                            step={step}
                            docs={docs}
                            aceptaDatos={aceptaDatos}
                            setAceptaDatos={setAceptaDatos}
                            aceptaContrato={aceptaContrato}
                            setAceptaContrato={setAceptaContrato}
                            aceptaParq={aceptaParq}
                            setAceptaParq={setAceptaParq}
                          />
                        )}
                        {step === 5 && (
                          <StepSignature
                            isMinor={isMinor}
                            sigPos={sigPos}
                            form={form}
                            sigRef={sigRef}
                            guardianRef={guardianRef}
                          />
                        )}
                        {step === 6 && (
                          <StepFingerprint
                            fingerprintStatus={fingerprintStatus}
                          />
                        )}
                      </motion.div>
                    </div>

                    {/* Footer */}
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
                                {sigPos + 1}/2
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

              {/* Close confirmation */}
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
          <DemoInbox open={showInbox} onClose={() => setShowInbox(false)} />
        </>
      )}
    </AnimatePresence>
  )
}
