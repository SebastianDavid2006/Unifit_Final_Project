import { motion, AnimatePresence } from 'motion/react'
import { X, RefreshCw, Check } from 'lucide-react'
import SignatureCanvas from 'react-signature-canvas'
import type { Trainer } from '@/data/trainers'
import checkSuccessImg from '@/assets/illustrations/actions/feedback/success_check.webp'
import { BLUE_GRAD, GREEN_BLUE_GRAD, RED } from '../../../data'

interface TrainerSignatureModalProps {
  isOpen: boolean
  trainer: Trainer
  onClose: () => void
}

export function TrainerSignatureModal({ isOpen, trainer, onClose }: TrainerSignatureModalProps) {
  const sigRef = React.useRef<SignatureCanvas>(null)
  const [signatureDrawn, setSignatureDrawn] = React.useState(false)
  const [signatureSuccess, setSignatureSuccess] = React.useState(false)

  if (!isOpen) return null

  const handleClear = () => {
    sigRef.current?.clear()
    setSignatureDrawn(false)
  }

  const handleSave = () => {
    if (!signatureDrawn) return
    setSignatureSuccess(true)
  }

  const handleNext = () => {
    if (!signatureDrawn) return
    setSignatureSuccess(true)
  }

  const handleReset = () => {
    setShowSignatureModal(false)
    setSignatureDrawn(false)
    sigRef.current?.clear()
    setSignatureSuccess(false)
  }

  const [showSignatureModal, setShowSignatureModal] = React.useState(isOpen)

  React.useEffect(() => {
    setShowSignatureModal(isOpen)
  }, [isOpen])

  if (!showSignatureModal) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[115] flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(6px)' }}
      onClick={() => { setShowSignatureModal(false); onClose() }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
        className="rounded-3xl w-full max-w-lg flex flex-col overflow-hidden"
        style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 25px 60px rgba(0,0,0,0.12)', maxHeight: '85vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
          <div>
            <p className="text-lg font-bold" style={{ color: '#1A1A1E' }}>Firma del personal</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.4)' }}>{trainer.name}</p>
          </div>
          <motion.button whileHover={{ scale: 1.1, background: 'rgba(244,56,67,0.1)', color: RED }} whileTap={{ scale: 0.9 }} onClick={() => { setShowSignatureModal(false); onClose() }} className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer" style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.45)' }}>
            <X size={16} />
          </motion.button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-5">
          <AnimatePresence mode="wait">
            {signatureSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center py-10 gap-3"
              >
                <motion.img src={checkSuccessImg} alt="Ã©xito" className="w-28 h-auto object-contain" animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />
                <p className="text-lg font-bold" style={{ color: '#1A1A1E' }}>Firma registrada</p>
                <p className="text-xs font-medium text-center max-w-[260px]" style={{ color: 'rgba(0,0,0,0.45)' }}>La firma de {trainer.name} ha sido guardada exitosamente.</p>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={handleReset} className="mt-4 px-8 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer" style={{ background: GREEN_BLUE_GRAD }}>
                  Finalizar
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="draw"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold" style={{ color: '#1A1A1E' }}>Dibuja tu firma</p>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }} onClick={handleClear} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer" style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.4)' }}>
                    <RefreshCw size={11} /> Limpiar firma
                  </motion.button>
                </div>
                <p className="text-[11px] font-medium mb-3" style={{ color: 'rgba(0,0,0,0.4)' }}>
                  Dibuja tu firma en el recuadro utilizando el mouse o tu dedo.
                </p>
                <div className="relative rounded-2xl p-4 overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.04)' }}>
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
                      canvasProps={{ className: 'w-full', style: { height: 200, background: '#FFFFFF', borderRadius: 12, width: '100%' } }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {!signatureSuccess && (
          <div className="flex-shrink-0 p-6 pt-4 flex items-center justify-between" style={{ borderTop: '1px solid rgba(0,0,0,0.04)', background: 'rgba(255,255,255,0.8)' }}>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { setShowSignatureModal(false); onClose(); handleClear(); setSignatureSuccess(false); }} className="px-5 py-2.5 rounded-xl text-xs font-medium cursor-pointer" style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.5)' }}>
              Cancelar
            </motion.button>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={handleNext} className="px-5 py-2.5 rounded-xl text-xs font-bold text-white" style={{ background: signatureDrawn ? BLUE_GRAD : 'rgba(0,0,0,0.1)', cursor: signatureDrawn ? 'pointer' : 'not-allowed' }}>
              Siguiente â†’
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}