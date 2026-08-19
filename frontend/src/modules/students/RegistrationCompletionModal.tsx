import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  X, Check, ScanLine, RefreshCw, ChevronLeft, ChevronRight,
} from 'lucide-react'
import SignatureCanvas from 'react-signature-canvas'
import lectorHuellaImg from '@/assets/illustrations/actions/fingerprint.webp'
import checkSuccessImg from '@/assets/illustrations/actions/feedback/success_check.webp'
import coachCongratsImg from '@/assets/illustrations/characters/coach/coach_congratulations.webp'
import { StepDocAgreement } from '@/modules/students/NewStudentModal/sections/StepDocAgreement'
import { loadDocs, type StoredDocs } from '@/data/documents'

const BLUE = '#1270B7'
const GREEN = '#22C55E'
const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #7ec8e3)'
const GREEN_BLUE_GRAD = 'linear-gradient(135deg, #22C55E, #1270B7)'

const STEPS = [
  { num: 1, label: 'Tratamiento de datos' },
  { num: 2, label: 'Contrato' },
  { num: 3, label: 'PAR-Q' },
  { num: 4, label: 'Firma' },
  { num: 5, label: 'Huella digital' },
]

type FingerprintStatus = 'idle' | 'scanning' | 'captured'

interface Props {
  open: boolean
  onClose: () => void
  onComplete: () => void
  studentName: string
}

export default function RegistrationCompletionModal({ open, onClose, onComplete, studentName }: Props) {
  const [step, setStep] = useState(1)
  const [aceptaDatos, setAceptaDatos] = useState(false)
  const [aceptaContrato, setAceptaContrato] = useState(false)
  const [aceptaParq, setAceptaParq] = useState(false)
  const [docs, setDocs] = useState<StoredDocs>(() => loadDocs())
  const [fingerprintStatus, setFingerprintStatus] = useState<FingerprintStatus>('idle')
  const [success, setSuccess] = useState(false)
  const [shake, setShake] = useState(false)
  const sigRef = useRef<SignatureCanvas>(null)
  const [signatureDrawn, setSignatureDrawn] = useState(false)

  useEffect(() => {
    if (open) {
      setStep(1)
      setAceptaDatos(false)
      setAceptaContrato(false)
      setAceptaParq(false)
      setDocs(loadDocs())
      setFingerprintStatus('idle')
      setSuccess(false)
      setSignatureDrawn(false)
    }
  }, [open])

  const handleCloseClick = () => {
    if (success) onComplete()
    onClose()
  }

  const clearSignature = () => {
    sigRef.current?.clear()
    setSignatureDrawn(false)
  }

  const startFingerprintScan = () => {
    setFingerprintStatus('scanning')
    setTimeout(() => setFingerprintStatus('captured'), 3000)
  }

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 400)
  }

  const canGoNext = () => {
    if (step === 1) return aceptaDatos
    if (step === 2) return aceptaContrato
    if (step === 3) return aceptaParq
    if (step === 4) return signatureDrawn
    if (step === 5) return fingerprintStatus === 'captured'
    return false
  }

  const handlePrev = () => setStep(s => Math.max(1, s - 1))
  const handleNext = () => {
    if (!canGoNext()) { triggerShake(); return }
    if (step === 5) setSuccess(true)
    else setStep(s => s + 1)
  }

  const signaturePad = (title: string) => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold" style={{ color: '#1A1A1E' }}>{title}</p>
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.93 }}
          onClick={clearSignature}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer"
          style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.4)' }}
        >
          <RefreshCw size={11} />
          Limpiar firma
        </motion.button>
      </div>
      <p className="text-[11px] font-medium mb-2" style={{ color: 'rgba(0,0,0,0.4)' }}>
        Dibuja tu firma en el recuadro utilizando el mouse o tu dedo (si usas pantalla táctil).
      </p>
      <div className="relative rounded-2xl p-4 overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.04)' }}>
        <motion.div className="absolute top-0 left-0 right-0 h-0.5 pointer-events-none z-10" style={{ background: 'linear-gradient(90deg, transparent, rgba(18,112,183,0.3), transparent)' }} animate={{ x: ['-100%', '100%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} />
        <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 pointer-events-none z-10" style={{ background: 'linear-gradient(90deg, transparent, rgba(18,112,183,0.3), transparent)' }} animate={{ x: ['100%', '-100%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} />
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 rounded-tl pointer-events-none" style={{ borderColor: 'rgba(18,112,183,0.2)' }} />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 rounded-tr pointer-events-none" style={{ borderColor: 'rgba(18,112,183,0.2)' }} />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 rounded-bl pointer-events-none" style={{ borderColor: 'rgba(18,112,183,0.2)' }} />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 rounded-br pointer-events-none" style={{ borderColor: 'rgba(18,112,183,0.2)' }} />
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.04)' }}>
          <SignatureCanvas
            ref={sigRef}
            penColor="#1A1A1E"
            minWidth={1}
            maxWidth={2.5}
            onEnd={() => setSignatureDrawn(true)}
            canvasProps={{
              className: 'w-full',
              style: { height: 200, background: '#FFFFFF', borderRadius: '12px', width: '100%' },
            }}
          />
        </div>
      </div>
    </div>
  )

  const renderStepFirma = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="space-y-6">
      <div className="text-center">
        <p className="text-sm mt-1" style={{ color: 'rgba(0,0,0,0.5)' }}>{studentName} debe firmar para completar su registro</p>
      </div>
      {signaturePad('Firma del estudiante')}
    </motion.div>
  )

  const renderStepHuella = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="flex flex-col items-center space-y-4">
      <div className="relative flex items-center justify-center">
        <motion.div className="absolute rounded-full pointer-events-none" style={{ width: 320, height: 320, background: fingerprintStatus === 'scanning' ? 'radial-gradient(circle, rgba(34,197,94,0.5) 0%, rgba(34,197,94,0.15) 40%, transparent 70%)' : 'radial-gradient(circle, rgba(18,112,183,0.5) 0%, rgba(18,112,183,0.12) 40%, transparent 70%)' }} animate={fingerprintStatus !== 'captured' ? { scale: [1, 1.15, 1], opacity: fingerprintStatus === 'scanning' ? [0.3, 1, 0.3] : [0.5, 0.9, 0.5] } : { opacity: 0, scale: 1.5 }} transition={{ duration: 3, repeat: fingerprintStatus === 'captured' ? 0 : Infinity, ease: 'easeInOut' }} />
        {fingerprintStatus === 'scanning' && <><motion.div key="ring-0" className="absolute rounded-full pointer-events-none" style={{ width: 64, height: 64, border: '1.5px solid rgba(34,197,94,0.4)' }} animate={{ scale: [1, 5], opacity: [0.6, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 1.5, ease: 'easeOut' }} /><motion.div key="ring-1" className="absolute rounded-full pointer-events-none" style={{ width: 64, height: 64, border: '1.5px solid rgba(34,197,94,0.4)' }} animate={{ scale: [1, 5], opacity: [0.6, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 1.5, ease: 'easeOut' }} /></>}
        <AnimatePresence mode="wait">
          {fingerprintStatus === 'captured' ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }} className="relative flex items-center justify-center">
              <div className="absolute w-64 h-64 rounded-full" style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.25) 0%, transparent 70%)' }} />
              {[...Array(12)].map((_, i) => {
                const angle = (i / 12) * 360, rad = (angle * Math.PI) / 180, dist = 80 + (i % 3) * 20
                return <motion.span key={i} className="absolute pointer-events-none text-lg select-none" style={{ color: '#22C55E' }} animate={{ x: [0, Math.cos(rad) * dist], y: [0, Math.sin(rad) * dist], opacity: [0, 1, 0], scale: [0, 1.2, 0] }} transition={{ duration: 2 + (i % 4) * 0.3, repeat: Infinity, delay: i * 0.1, ease: 'easeOut' }}>✦</motion.span>
              })}
              <div className="relative w-64 h-64 flex items-center justify-center"><motion.img src={checkSuccessImg} alt="check" className="w-32 h-auto object-contain relative z-10" animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} /></div>
            </motion.div>
          ) : (
            <div className="relative flex items-center justify-center">
              <div className="relative w-64 h-64">
                <motion.img src={lectorHuellaImg} alt="lector huella" className="w-full h-full object-contain" animate={{ scale: [1, 1.02, 1], opacity: fingerprintStatus === 'scanning' ? 0.3 : 0.4 }} transition={{ scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' }, opacity: { duration: 0.3 } }} />
                {fingerprintStatus === 'scanning' && (
                  <motion.div className="absolute inset-0 pointer-events-none z-10 overflow-hidden" style={{ filter: 'brightness(1.3) drop-shadow(0 0 15px rgba(34,197,94,0.5))' }} animate={{ clipPath: ['inset(90% 0 10% 0)', 'inset(10% 0 80% 0)', 'inset(90% 0 10% 0)'] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}><img src={lectorHuellaImg} alt="" className="w-full h-full object-contain" /></motion.div>
                )}
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
      {fingerprintStatus === 'idle' && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-medium text-center" style={{ color: 'rgba(0,0,0,0.4)' }}>Coloca tu dedo sobre el sensor para capturar tu huella digital.</motion.p>}
      {fingerprintStatus === 'scanning' && <motion.div className="flex items-center gap-2" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><RefreshCw size={16} color={GREEN} /></motion.div><span className="text-xs font-medium" style={{ color: GREEN }}>Escaneando huella...</span></motion.div>}
      {fingerprintStatus === 'captured' && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-medium text-center" style={{ color: '#22C55E' }}>¡Huella capturada exitosamente!</motion.p>}
    </motion.div>
  )

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
      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.4 }} className="text-sm font-medium text-center max-w-xs leading-relaxed" style={{ color: 'rgba(0,0,0,0.45)' }}>Tu cuenta queda habilitada. Te enviamos un correo con las credenciales.</motion.p>
      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.4 }} className="text-sm font-bold text-center" style={{ color: BLUE }}>¡Para que empieces tu experiencia en UniFit y conquistes tu mejor versión!</motion.p>
      <motion.button whileHover={{ scale: 1.04, boxShadow: '0 8px 25px rgba(0,155,149,0.35)', transition: { duration: 0.15 } }} whileTap={{ scale: 0.92, boxShadow: '0 2px 8px rgba(0,155,149,0.2)', transition: { duration: 0.1 } }} onClick={handleCloseClick} className="mt-8 mb-10 px-8 py-3 rounded-2xl text-xs font-bold text-white cursor-pointer" style={{ background: GREEN_BLUE_GRAD }}>Cerrar</motion.button>
    </motion.div>
  )

  if (!open) return null

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
                  {STEPS.map((s) => (
                    <motion.div key={s.num} animate={{ width: s.num === step ? 16 : 6, background: s.num === step ? BLUE_GRAD : 'rgba(0,0,0,0.12)' }} transition={{ type: 'spring', stiffness: 300, damping: 22 }} className="rounded-full" style={{ height: 6 }} />
                  ))}
                </div>
                <span className="text-lg font-bold tracking-wide text-center block" style={{ color: '#1A1A1E', marginBottom: 10 }}>{STEPS.find(s => s.num === step)!.label}</span>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-6 pb-6 pt-5">
                <motion.div animate={shake ? { x: [0, -4, 4, -4, 4, 0] } : {}} transition={{ duration: 0.4 }}>
                  {(step === 1 || step === 2 || step === 3) && (
                    <StepDocAgreement
                      step={step + 1}
                      docs={docs}
                      aceptaDatos={aceptaDatos}
                      setAceptaDatos={setAceptaDatos}
                      aceptaContrato={aceptaContrato}
                      setAceptaContrato={setAceptaContrato}
                      aceptaParq={aceptaParq}
                      setAceptaParq={setAceptaParq}
                    />
                  )}
                  {step === 4 && renderStepFirma()}
                  {step === 5 && renderStepHuella()}
                </motion.div>
              </div>

              {/* Footer */}
              <div className="flex-shrink-0 p-6 pt-4" style={{ borderTop: '1px solid rgba(0,0,0,0.04)', background: 'rgba(255,255,255,0.8)' }}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 flex justify-start">
                    <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handlePrev} className="flex items-center gap-1.5 px-4 py-2 rounded-3xl text-sm font-medium cursor-pointer" style={{ background: 'rgba(0,0,0,0.04)', color: step > 1 ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.15)' }} disabled={step === 1}><ChevronLeft size={14} />Atrás</motion.button>
                  </div>

                  <div className="flex-1 flex justify-center">
                    {step === 5 && fingerprintStatus === 'idle' && (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={startFingerprintScan}
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
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleNext}
                      disabled={!canGoNext()}
                      className="flex items-center gap-1.5 px-5 py-2 rounded-3xl text-sm font-bold text-white"
                      style={{
                        background: canGoNext() ? (step === 3 ? GREEN_BLUE_GRAD : BLUE_GRAD) : 'rgba(0,0,0,0.1)',
                        cursor: canGoNext() ? 'pointer' : 'not-allowed',
                        boxShadow: canGoNext() ? '0 4px 16px rgba(18,112,183,0.35)' : 'none',
                      }}
                    >
                      <span>{step === 5 ? 'Finalizar' : 'Siguiente'}</span>
                      {step < 5 && <ChevronRight size={14} />}
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
