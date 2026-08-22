import { motion } from 'motion/react'
import { AlertTriangle } from 'lucide-react'
import ModalShell, { ModalCloseButton } from './ModalShell'
import { BLUE_GRAD } from './fields'

export default function ConfirmModal({ title, description, confirmLabel, color, onConfirm, onClose }: {
  title: string
  description: string
  confirmLabel: string
  color: string
  onConfirm: () => void
  onClose: () => void
}) {
  return (
    <ModalShell onClose={onClose} maxWidth="max-w-md">
      <div className="relative px-7 pt-8 pb-6 text-center" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
        <div className="absolute top-5 right-6">
          <ModalCloseButton onClick={onClose} />
        </div>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto" style={{ background: `${color}0F`, border: `1px solid ${color}1A` }}>
          <AlertTriangle size={24} style={{ color }} />
        </div>
        <h2 className="mt-4 text-base font-extrabold tracking-tight" style={{ color: '#1A1A1E' }}>{title}</h2>
      </div>

      <div className="px-7 py-6">
        <p className="text-sm font-medium leading-relaxed text-center" style={{ color: 'rgba(0,0,0,0.55)' }}>{description}</p>
        <div className="flex flex-col gap-2.5 mt-7">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onClose} className="w-full py-3 rounded-xl text-xs font-bold text-white cursor-pointer" style={{ background: BLUE_GRAD, boxShadow: '0 8px 20px rgba(18,112,183,0.3)' }}>
            Seguir aquí
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onConfirm} className="w-full py-3 rounded-xl text-xs font-bold text-white cursor-pointer" style={{ background: `linear-gradient(135deg, ${color}, ${color}E6)`, boxShadow: `0 8px 20px ${color}3D` }}>
            {confirmLabel}
          </motion.button>
        </div>
      </div>
    </ModalShell>
  )
}
