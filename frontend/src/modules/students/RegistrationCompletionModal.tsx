import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Check, Pen, ScanLine, CheckCircle } from 'lucide-react'
import SignatureCanvas from 'react-signature-canvas'
import { SignaturePad } from './components/SignaturePad'
import { FingerprintCapture } from './components/FingerprintCapture'

const BLUE = '#1270B7'
const RED = '#F43843'
const GREEN = '#22C55E'
const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #7ec8e3)'
const RED_GRAD = 'linear-gradient(135deg, #F43843, #FF6B8A)'
const GREEN_GRAD = 'linear-gradient(135deg, #22C55E, #16A34A)'

type FingerprintStatus = 'idle' | 'scanning' | 'captured'

interface Props {
  open: boolean
  onClose: () => void
  onComplete: () => void
  studentName: string
}

export default function RegistrationCompletionModal({ open, onClose, onComplete, studentName }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [fingerprintStatus, setFingerprintStatus] = useState<FingerprintStatus>('idle')
  const [success, setSuccess] = useState(false)
  const sigRef = useRef<SignatureCanvas>(null)

  useEffect(() => {
    if (open) {
      setStep(1)
      setFingerprintStatus('idle')
      setSuccess(false)
    }
  }, [open])

  const handleCloseClick = () => {
    if (success) {
      onComplete()
      onClose()
    } else {
      onClose()
    }
  }

  const clearSignature = () => {
    sigRef.current?.clear()
  }

  const startFingerprintScan = () => {
    setFingerprintStatus('scanning')
    setTimeout(() => {
      setFingerprintStatus('captured')
    }, 3000)
  }

  const canGoNext = () => {
    if (step === 1) {
      return sigRef.current && !sigRef.current.isEmpty()
    }
    if (step === 2) {
      return fingerprintStatus === 'captured'
    }
    return false
  }

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col items-center pt-8 gap-4"
    >
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-2"
        style={{ background: 'linear-gradient(135deg, rgba(18,112,183,0.15), rgba(18,112,183,0.05))' }}
      >
        <Pen size={36} style={{ color: BLUE }} />
      </motion.div>
      <h3 className="text-xl font-bold" style={{ color: '#1A1A1E' }}>Firma Digital</h3>
      <p className="text-sm text-center" style={{ color: 'rgba(0,0,0,0.5)' }}>
        {studentName} debe firmar el contrato para completar su registro
      </p>
      <SignaturePad
        title="Firma del estudiante"
        ref={sigRef}
        onClear={clearSignature}
      />
    </motion.div>
  )

  const renderStep2 = () => (
    <FingerprintCapture
      status={fingerprintStatus}
      onStartScan={startFingerprintScan}
      onCaptureComplete={() => setStep(3)}
    />
  )

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center pt-8 gap-4"
    >
      <motion.div
        animate={{ scale: [0, 1.2, 1], rotate: [0, 360] }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-24 h-24 rounded-full flex items-center justify-center mb-4"
        style={{
          background: 'linear-gradient(135deg, #22C55E, #16A34A)',
          boxShadow: '0 0 40px rgba(34,197,94,0.4)',
        }}
      >
        <CheckCircle size={48} className="text-white" />
      </motion.div>

      <h3 className="text-2xl font-bold" style={{ color: '#1A1A1E' }}>¡Registro Completado!</h3>
      <p className="text-lg" style={{ color: 'rgba(0,0,0,0.5)' }}>
        {studentName} ahora es un estudiante activo en UniFit.
      </p>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleCloseClick}
        className="mt-4 w-full max-w-xs px-8 py-3 rounded-2xl text-base font-bold text-white flex items-center justify-center gap-2"
        style={{
          background: 'linear-gradient(135deg, #22C55E, #16A34A)',
          boxShadow: '0 4px 16px rgba(34,197,94,0.3)',
        }}
      >
        <CheckCircle size={20} />
        Finalizar
      </motion.button>
    </motion.div>
  )

  if (!open) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
        style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)' }}
        onClick={handleCloseClick}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-xl rounded-3xl overflow-hidden"
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.15)',
          }}
        >
          <div className="relative px-8 py-6">
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(135deg, rgba(18,112,183,0.08) 0%, rgba(244,56,67,0.06) 50%, rgba(245,166,35,0.05) 100%)',
            }} />
            <div className="absolute top-0 left-0 right-0 h-1" style={{
              background: 'linear-gradient(90deg, #1270B7, #F43843, #F1C827)',
            }} />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{
                  background: step === 1 ? BLUE_GRAD :
                           step === 2 ? RED_GRAD :
                           'linear-gradient(135deg, #22C55E, #16A34A)',
                }}>
                  {step === 1 && <Pen size={24} className="text-white" />}
                  {step === 2 && <ScanLine size={24} className="text-white" />}
                  {step === 3 && <CheckCircle size={24} className="text-white" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold" style={{ color: '#1A1A1E' }}>
                    {step === 1 && 'Completar Firma Digital'}
                    {step === 2 && 'Capturar Huella Digital'}
                    {step === 3 && '¡Registro Completado!'}
                  </h3>
                  <p className="text-sm mt-0.5" style={{ color: 'rgba(0,0,0,0.4)' }}>
                    {step === 1 && 'Firma el contrato para continuar'}
                    {step === 2 && 'Verificacion biometrica requerida'}
                    {step === 3 && 'El estudiante ahora esta activo'}
                  </p>
                </div>
              </div>
              {step !== 3 && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCloseClick}
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.04)' }}
                >
                  <X size={18} style={{ color: 'rgba(0,0,0,0.4)' }} />
                </motion.button>
              )}
            </div>
          </div>

          <div className="px-8 pb-4 flex items-center justify-center gap-2">
            {[1, 2].map(s => (
              <motion.div
                key={s}
                animate={{
                  backgroundColor: s < step ? '#22C55E' : s === step ? '#1270B7' : 'rgba(0,0,0,0.1)',
                  scale: s === step ? 1.1 : 1,
                }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="w-16 h-1.5 rounded-full flex-shrink-0 relative"
              >
                {s < step && (
                  <CheckCircle size={16} className="text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                )}
              </motion.div>
            ))}
          </div>

          <div className="px-8 pb-8">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </div>

          <AnimatePresence>
            {step !== 3 && step !== 1 && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep(s => s - 1)}
                className="absolute bottom-8 left-8 px-4 py-2 rounded-xl text-sm font-bold"
                style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.4)' }}
              >
                <Check size={14} /> Atras
              </motion.button>
            )}
            {(step === 1 || step === 2) && !success && (
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => canGoNext() && setStep(s => s + 1)}
                disabled={!canGoNext()}
                className="absolute bottom-8 right-8 px-6 py-2.5 rounded-2xl text-sm font-bold text-white flex items-center gap-2"
                style={{
                  background: canGoNext() ? (step === 1 ? BLUE_GRAD : RED_GRAD) : 'rgba(0,0,0,0.1)',
                  boxShadow: canGoNext() ? (step === 1 ? '0 4px 16px rgba(18,112,183,0.35)' : '0 4px 16px rgba(244,56,67,0.35)') : 'none',
                  cursor: canGoNext() ? 'pointer' : 'not-allowed',
                }}
              >
                {step === 2 ? <CheckCircle size={16} /> : <Check size={14} />}
                {step === 2 ? 'Finalizar' : 'Siguiente'}
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}