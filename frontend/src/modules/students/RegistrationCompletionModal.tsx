import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Check, Pen, ScanLine, CheckCircle, RefreshCw } from 'lucide-react'
import SignatureCanvas from 'react-signature-canvas'
import lectorHuellaImg from '@/assets/illustrations/actions/fingerprint.webp'
import checkSuccessImg from '@/assets/illustrations/actions/feedback/success_check.webp'
import coachCongratsImg from '@/assets/illustrations/characters/coach/coach_congratulations.webp'

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
            ref={sigRef}
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
      {signaturePad('Firma del estudiante')}
    </motion.div>
  )

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col items-center pt-8 gap-4"
    >
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs font-medium text-center"
          style={{ color: '#22C55E' }}
        >
          ¡Huella capturada exitosamente!
        </motion.p>
      )}

      {fingerprintStatus === 'idle' && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={startFingerprintScan}
          className="mt-4 px-8 py-3 rounded-2xl text-base font-bold text-white flex items-center gap-2"
          style={{
            background: RED_GRAD,
            boxShadow: '0 6px 20px rgba(244,56,67,0.35)',
          }}
        >
          <ScanLine size={20} />
          Capturar Huella
        </motion.button>
      )}

      {fingerprintStatus === 'captured' && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setStep(3)}
          className="mt-4 px-8 py-3 rounded-2xl text-base font-bold text-white flex items-center gap-2"
          style={{ background: GREEN_GRAD }}
        >
          <CheckCircle size={20} />
          Continuar
        </motion.button>
      )}
    </motion.div>
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