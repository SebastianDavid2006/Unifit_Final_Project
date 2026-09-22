import { motion, AnimatePresence } from 'motion/react'
import { AlertTriangle, X } from 'lucide-react'

interface SaveErrorModalProps {
  show: boolean
  message: string | null
  onClose: () => void
}

export function SaveErrorModal({ show, message, onClose }: SaveErrorModalProps) {
  return (
    <AnimatePresence>
      {show && message && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl flex flex-col relative p-8"
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(244,56,67,0.15)',
              boxShadow: '0 25px 60px rgba(244,56,67,0.15)',
            }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.04)' }}
            >
              <X size={16} style={{ color: 'rgba(0,0,0,0.4)' }} />
            </button>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(244,56,67,0.12)' }}>
              <AlertTriangle size={22} style={{ color: '#F43843' }} />
            </div>
            <p className="text-base font-bold" style={{ color: '#0D1B2A' }}>No se pudo guardar</p>
            <p className="text-sm font-medium mt-1 leading-relaxed" style={{ color: 'rgba(0,0,0,0.45)' }}>{message}</p>
            <button
              onClick={onClose}
              className="mt-6 px-5 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #F43843, #FF6B6B)', boxShadow: '0 8px 20px rgba(244,56,67,0.3)' }}
            >
              Entendido
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}