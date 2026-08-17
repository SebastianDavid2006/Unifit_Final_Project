import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { ModalShell } from './ModalShell'

interface CancelConfirmModalProps {
  isOpen: boolean
  type: 'valuation' | 'routine' | 'ai'
  onConfirm: () => void
  onCancel: () => void
}

export function CancelConfirmModal({ isOpen, type, onConfirm, onCancel }: CancelConfirmModalProps) {
  return (
    <ModalShell isOpen={isOpen} onClose={onCancel} maxWidth="max-w-sm" zIndex={110} backdropBlur="blur(6px)" backdropOpacity="rgba(0,0,0,0.35)" contentClassName="flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: 'rgba(244,56,67,0.1)' }}>
        <AlertTriangle size={22} color="#F43843" />
      </div>
      <p className="text-base font-bold" style={{ color: '#1A1A1E' }}>
        ¿Seguro que deseas cancelar el proceso?
      </p>
      <p className="text-xs font-medium mt-1.5" style={{ color: 'rgba(0,0,0,0.4)' }}>
        {type === 'ai'
          ? 'La rutina generada hasta ahora no se guardará.'
          : 'Los datos ingresados no se guardarán.'}
      </p>
      <div className="flex items-center gap-2.5 mt-6 w-full">
        <button
          onClick={onCancel}
          className="flex-1 px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
          style={{ background: 'rgba(0,0,0,0.05)', color: 'rgba(0,0,0,0.6)' }}
        >
          Seguir
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all"
          style={{ background: 'linear-gradient(135deg, #FF6B6B, #E63946)' }}
        >
          Sí, cancelar
        </button>
      </div>
    </ModalShell>
  )
}
