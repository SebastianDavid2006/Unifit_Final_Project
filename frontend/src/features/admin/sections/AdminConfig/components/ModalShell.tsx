import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { X } from 'lucide-react'
import { useEscape } from './useEscape'

export function ModalCloseButton({ onClick, color = 'red' }: { onClick: () => void; color?: 'red' | 'gray' }) {
  const variants = color === 'red'
    ? {
        rest: { scale: 1, background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.3)' },
        hover: { scale: 1.15, background: 'rgba(244,56,67,0.1)', color: '#F43843' },
        tap: { scale: 0.9 },
      }
    : {
        rest: { scale: 1, background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.4)' },
        hover: { scale: 1.15 },
        tap: { scale: 0.9 },
      }
  return (
    <motion.button
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      variants={variants}
      onClick={onClick}
      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors"
    >
      <X size={15} />
    </motion.button>
  )
}

export default function ModalShell({ children, onClose, overlay = 'rgba(0,0,0,0.25)', cardShadow = '0 25px 60px rgba(0,0,0,0.12)', maxWidth = 'max-w-lg', closeOnEscape = true }: {
  children: ReactNode
  onClose: () => void
  overlay?: string
  cardShadow?: string
  maxWidth?: string
  closeOnEscape?: boolean
}) {
  useEscape(closeOnEscape ? onClose : () => {})

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: overlay, backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={`relative w-full ${maxWidth} rounded-3xl overflow-hidden`}
        style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.04)', boxShadow: cardShadow }}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
