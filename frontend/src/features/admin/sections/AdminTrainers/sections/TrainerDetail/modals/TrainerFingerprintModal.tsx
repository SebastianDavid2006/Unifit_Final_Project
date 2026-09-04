import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, RefreshCw, ScanLine } from 'lucide-react'
import type { Trainer } from '@/data/trainers'
import lectorHuellaImg from '@/assets/illustrations/actions/fingerprint.webp'
import checkSuccessImg from '@/assets/illustrations/actions/feedback/success_check.webp'
import { BLUE_GRAD, GREEN_BLUE_GRAD, GREEN } from '../../../data'
import { iniciarEnrolamiento, obtenerEstadoHuella } from '@/services/biometria.service'
import { mensajeError } from '@/lib/api'

type EnrollStep = 1 | 2 | 3

const STEP_MESSAGES: Record<EnrollStep, string> = {
  1: 'Coloca tu dedo sobre el sensor...',
  2: 'Retira el dedo y espera...',
  3: 'Vuelve a acercar tu dedo (acerca nuevamente la huella)...',
}

interface TrainerFingerprintModalProps {
  isOpen: boolean
  trainer: Trainer
  huella: string | null
  onClose: () => void
}

export function TrainerFingerprintModal({ isOpen, trainer, huella, onClose }: TrainerFingerprintModalProps) {
  const [fingerprintStatus, setFingerprintStatus] = useState<'idle' | 'scanning' | 'captured'>('idle')
  const [fingerprintSuccess, setFingerprintSuccess] = useState(false)
  const [fpStep, setFpStep] = useState<EnrollStep | null>(null)
  const [fpError, setFpError] = useState('')
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [showFingerprintModal, setShowFingerprintModal] = useState(isOpen)

  useEffect(() => () => {
    if (pollingRef.current) clearInterval(pollingRef.current)
  }, [])

  useEffect(() => {
    setShowFingerprintModal(isOpen)
    if (isOpen) {
      setFingerprintStatus(huella ? 'captured' : 'idle')
      setFingerprintSuccess(false)
      setFpStep(null)
      setFpError('')
    }
  }, [isOpen, huella])

  if (!showFingerprintModal) return null

  const handleReset = () => {
    if (pollingRef.current) clearInterval(pollingRef.current)
    pollingRef.current = null
    setShowFingerprintModal(false)
    onClose()
    setFingerprintStatus('idle')
    setFingerprintSuccess(false)
    setFpStep(null)
    setFpError('')
  }

  const handleStartScan = async () => {
    setFpError('')
    setFpStep(null)
    try {
      await iniciarEnrolamiento(trainer.id)
      setFingerprintStatus('scanning')
      pollingRef.current = setInterval(async () => {
        try {
          const estado = await obtenerEstadoHuella(trainer.id)
          if (estado.huella?.paso_enrolamiento) {
            setFpStep(estado.huella.paso_enrolamiento as EnrollStep)
          }
          if (estado.tiene_huella) {
            if (pollingRef.current) clearInterval(pollingRef.current)
            pollingRef.current = null
            setFingerprintStatus('captured')
          }
        } catch {
          if (pollingRef.current) clearInterval(pollingRef.current)
          pollingRef.current = null
          setFpError('Error al verificar estado de la huella')
          setFingerprintStatus('idle')
        }
      }, 2000)
    } catch (err) {
      setFpError(mensajeError(err))
    }
  }

  const handleNext = () => {
    setFingerprintSuccess(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[115] flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(6px)' }}
      onClick={handleReset}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
        className="rounded-3xl w-full max-w-lg flex flex-col overflow-hidden min-h-[520px]"
        style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 25px 60px rgba(0,0,0,0.12)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
          <div>
            <p className="text-lg font-bold" style={{ color: '#1A1A1E' }}>Huella digital</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.4)' }}>{trainer.name}</p>
          </div>
          <motion.button whileHover={{ scale: 1.1, background: 'rgba(244,56,67,0.1)', color: '#F43843' }} whileTap={{ scale: 0.9 }} onClick={handleReset} className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer" style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.45)' }}>
            <X size={16} />
          </motion.button>
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
          <AnimatePresence mode="wait">
            {fingerprintSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center gap-3"
              >
                <motion.img src={checkSuccessImg} alt="éxito" className="w-28 h-auto object-contain" animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />
                <p className="text-lg font-bold" style={{ color: '#1A1A1E' }}>Huella registrada</p>
                <p className="text-xs font-medium text-center max-w-[260px]" style={{ color: 'rgba(0,0,0,0.45)' }}>La huella digital de {trainer.name} ha sido capturada exitosamente.</p>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={handleReset} className="mt-4 px-8 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer" style={{ background: GREEN_BLUE_GRAD }}>
                  Finalizar
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="scan"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative flex items-center justify-center">
                  <motion.div
                    className="absolute rounded-full pointer-events-none"
                    style={{ width: 280, height: 280, background: fingerprintStatus === 'scanning' ? 'radial-gradient(circle, rgba(34,197,94,0.5) 0%, rgba(34,197,94,0.15) 40%, transparent 70%)' : 'radial-gradient(circle, rgba(18,112,183,0.5) 0%, rgba(18,112,183,0.12) 40%, transparent 70%)' }}
                    animate={fingerprintStatus !== 'captured' ? { scale: [1, 1.15, 1], opacity: fingerprintStatus === 'scanning' ? [0.3, 1, 0.3] : [0.5, 0.9, 0.5] } : { opacity: 0, scale: 1.5 }}
                    transition={{ duration: 3, repeat: fingerprintStatus === 'captured' ? 0 : Infinity, ease: 'easeInOut' }}
                  />
                  {fingerprintStatus === 'scanning' && (
                    <>
                      {[0, 1].map(i => (
                        <motion.div key={`ring-${i}`} className="absolute rounded-full pointer-events-none" style={{ width: 64, height: 64, border: '1.5px solid rgba(34,197,94,0.4)' }} animate={{ scale: [1, 5], opacity: [0.6, 0] }} transition={{ duration: 3, repeat: Infinity, delay: i * 1.5, ease: 'easeOut' }} />
                      ))}
                    </>
                  )}
                  <AnimatePresence mode="wait">
                    {fingerprintStatus === 'captured' ? (
                      <motion.div
                        key="captured"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                        className="relative flex items-center justify-center"
                      >
                        <div className="absolute w-56 h-56 rounded-full" style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.25) 0%, transparent 70%)' }} />
                        {[...Array(12)].map((_, i) => {
                          const angle = (i / 12) * 360, rad = (angle * Math.PI) / 180, dist = 80 + (i % 3) * 20
                          return <motion.span key={i} className="absolute pointer-events-none text-lg select-none" style={{ color: GREEN }} animate={{ x: [0, Math.cos(rad) * dist], y: [0, Math.sin(rad) * dist], opacity: [0, 1, 0], scale: [0, 1.2, 0] }} transition={{ duration: 2 + (i % 4) * 0.3, repeat: Infinity, delay: i * 0.1, ease: 'easeOut' }}>âœ¦</motion.span>
                        })}
                        <div className="relative w-56 h-56 flex items-center justify-center"><motion.img src={checkSuccessImg} alt="check" className="w-28 h-auto object-contain relative z-10" animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} /></div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="scanner"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="relative flex items-center justify-center"
                      >
                        <div className="relative w-56 h-56">
                          <motion.img src={lectorHuellaImg} alt="lector huella" className="w-full h-full object-contain" animate={{ scale: [1, 1.02, 1], opacity: fingerprintStatus === 'scanning' ? 0.3 : 0.4 }} transition={{ scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' }, opacity: { duration: 0.3 } }} />
                          {fingerprintStatus === 'scanning' && (
                            <motion.div className="absolute inset-0 pointer-events-none z-10 overflow-hidden" style={{ filter: 'brightness(1.3) drop-shadow(0 0 15px rgba(34,197,94,0.5))' }} animate={{ clipPath: ['inset(90% 0 10% 0)', 'inset(10% 0 80% 0)', 'inset(90% 0 10% 0)'] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}><img src={lectorHuellaImg} alt="" className="w-full h-full object-contain" /></motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-6 text-center">
                  {fingerprintStatus === 'idle' && <p className="text-xs font-medium" style={{ color: 'rgba(0,0,0,0.4)' }}>Coloca tu dedo sobre el sensor para capturar tu huella digital.</p>}
                  {fingerprintStatus === 'scanning' && <motion.div className="flex items-center gap-2 justify-center" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><RefreshCw size={16} color={GREEN} /></motion.div><span className="text-xs font-medium" style={{ color: GREEN }}>{fpStep ? STEP_MESSAGES[fpStep] : 'Escaneando huella...'}</span></motion.div>}
                  {fingerprintStatus === 'captured' && <p className="text-xs font-medium" style={{ color: GREEN }}>Huella capturada exitosamente</p>}
                  {fpError && <p className="text-xs font-medium mt-2" style={{ color: '#D32F2F' }}>{fpError}</p>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {!fingerprintSuccess && (
          <div className="flex-shrink-0 p-6 pt-4 flex items-center justify-between" style={{ borderTop: '1px solid rgba(0,0,0,0.04)', background: 'rgba(255,255,255,0.8)' }}>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleReset} className="px-5 py-2.5 rounded-xl text-xs font-medium cursor-pointer" style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.5)' }}>
              Cerrar
            </motion.button>
            <div className="flex gap-3">
              {fingerprintStatus === 'idle' && (
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={handleStartScan} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer" style={{ background: BLUE_GRAD }}>
                  <ScanLine size={16} /> Capturar huella
                </motion.button>
              )}
              {fingerprintStatus === 'scanning' && (
                <motion.button disabled className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white cursor-not-allowed" style={{ background: 'rgba(0,0,0,0.15)' }}>
                  <RefreshCw size={16} className="animate-spin" /> Escaneando...
                </motion.button>
              )}
              {fingerprintStatus === 'captured' && (
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={handleNext} className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer" style={{ background: BLUE_GRAD }}>
                  Siguiente â†’
                </motion.button>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}