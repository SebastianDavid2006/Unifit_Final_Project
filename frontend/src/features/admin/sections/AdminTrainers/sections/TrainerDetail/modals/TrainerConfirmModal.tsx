import { motion } from 'motion/react'
import { Power, AlertTriangle } from 'lucide-react'
import type { Trainer } from '@/services/usuario.service'
import { BLUE_GRAD, GREEN_BLUE_GRAD, RED } from '../../../data'

interface TrainerConfirmModalProps {
  isOpen: boolean
  trainer: Trainer
  type: 'save' | 'status'
  onConfirm: () => void
  onCancel: () => void
}

export function TrainerConfirmModal({ isOpen, trainer, type, onConfirm, onCancel }: TrainerConfirmModalProps) {
  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[120] flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 10 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl p-6"
        style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 25px 60px rgba(0,0,0,0.15)' }}
      >
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ background: type === 'status' ? 'rgba(244,56,67,0.1)' : 'rgba(18,112,183,0.1)', color: type === 'status' ? RED : '#1270B7' }}>
            {type === 'status' ? <Power size={20} /> : <AlertTriangle size={20} />}
          </div>
          <p className="text-lg font-bold" style={{ color: '#1A1A1E' }}>Confirmar cambios</p>
          <p className="text-xs font-medium mt-0.5" style={{ color: 'rgba(0,0,0,0.4)' }}>{trainer.name}</p>
        </div>
        <p className="text-sm font-medium mb-6 text-center" style={{ color: 'rgba(0,0,0,0.55)' }}>
          {type === 'save'
            ? 'Â¿Estás seguro de aplicar los cambios realizados?'
            : trainer.status === 'active'
              ? 'Â¿Estás seguro de desactivar la cuenta de este usuario?'
              : 'Â¿Estás seguro de activar la cuenta de este usuario?'}
        </p>
        <div className="flex items-center justify-center gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
            style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.5)' }}
          >
            Cancelar
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
            style={{ background: type === 'status' ? (trainer.status === 'active' ? 'linear-gradient(135deg, #F43843, #D0202C)' : GREEN_BLUE_GRAD) : BLUE_GRAD }}
          >
            {type === 'save'
              ? 'Aplicar'
              : trainer.status === 'active'
                ? 'Sí, desactivar'
                : 'Sí, activar'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}