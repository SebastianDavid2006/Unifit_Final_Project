import { motion } from 'framer-motion'
import { ModalShell } from './ModalShell'
import { TrashView } from '@/assets/models/ui/actions/trash/TrashModel'

interface DeleteDocumentModalProps {
  isOpen: boolean
  docName: string
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteDocumentModal({ isOpen, docName, onConfirm, onCancel }: DeleteDocumentModalProps) {
  return (
    <ModalShell isOpen={isOpen} onClose={onCancel} maxWidth="max-w-md" zIndex={70} contentClassName="flex flex-col items-center text-center">
      <div className="w-14 h-14 mb-4">
        <TrashView />
      </div>
      <h3 className="text-base font-bold mb-1" style={{ color: '#0D1B2A' }}>¿Eliminar documento?</h3>
      <p className="text-sm mb-6" style={{ color: 'rgba(0,0,0,0.4)' }}>
        Esta acción no se puede deshacer.
      </p>
      <div className="flex gap-2.5 w-full">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all"
          style={{ background: 'rgba(0,0,0,0.04)', color: '#0D1B2A', border: '1px solid rgba(0,0,0,0.06)' }}
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all"
          style={{ background: '#E63946', color: '#FFFFFF' }}
        >
          Eliminar
        </button>
      </div>
    </ModalShell>
  )
}
