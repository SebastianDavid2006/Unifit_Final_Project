import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { ModalShell } from './ModalShell'

interface SignatureModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SignatureModal({ isOpen, onClose }: SignatureModalProps) {
  return (
    <ModalShell isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold" style={{ color: '#0D1B2A' }}>Firma del Estudiante</h3>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.4)' }}>Contrato Firmado</p>
        </div>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onClose}
          className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.04)' }}>
          <X size={16} style={{ color: 'rgba(0,0,0,0.4)' }} />
        </motion.button>
      </div>
      <div className="rounded-2xl p-6 flex flex-col items-center justify-center" style={{ background: 'rgba(0,0,0,0.02)', border: '1px dashed rgba(0,0,0,0.08)' }}>
        <svg viewBox="0 0 400 120" className="w-full h-auto" style={{ maxHeight: 120 }}>
          <path d="M30,90 C40,50 60,30 80,40 C100,50 95,75 110,65 C125,55 130,35 150,30 C170,25 180,50 195,55 C210,60 220,40 240,35 C260,30 270,55 280,60 C290,65 300,45 320,50 C340,55 345,70 355,65 C365,60 370,50 380,55"
            fill="none" stroke="#0D1B2A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="30" y1="100" x2="380" y2="100" stroke="rgba(0,0,0,0.1)" strokeWidth="1" strokeDasharray="4 3" />
        </svg>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md" style={{ background: 'rgba(48,209,88,0.12)', color: '#30D158' }}>Firmado</span>
          <span className="text-[10px]" style={{ color: 'rgba(0,0,0,0.35)' }}>15 Ene 2026 - 10:32 AM</span>
        </div>
        <button
          className="px-4 py-2 rounded-xl text-[11px] font-semibold transition-all"
          style={{ background: 'rgba(0,0,0,0.04)', color: '#0D1B2A', border: '1px solid rgba(0,0,0,0.06)' }}
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </ModalShell>
  )
}
