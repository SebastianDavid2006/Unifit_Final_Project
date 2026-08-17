import { motion } from 'framer-motion'
import { X, FileText, Download, Upload, Trash2 } from 'lucide-react'
import { ModalShell } from './ModalShell'

interface DocumentViewerModalProps {
  isOpen: boolean
  fileData: { name: string; date: string } | null
  onClose: () => void
  onDelete: (docName: string) => void
}

export function DocumentViewerModal({ isOpen, fileData, onClose, onDelete }: DocumentViewerModalProps) {
  if (!fileData) return null
  return (
    <ModalShell isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl" zIndex={60} contentClassName="p-0 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(230,57,70,0.08)' }}>
            <FileText size={16} style={{ color: '#E63946' }} />
          </div>
          <div>
            <h3 className="text-sm font-bold" style={{ color: '#0D1B2A' }}>{fileData.name}</h3>
            <p className="text-[10px]" style={{ color: 'rgba(0,0,0,0.35)' }}>{fileData.date} · PDF</p>
          </div>
        </div>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onClose}
          className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.04)' }}>
          <X size={16} style={{ color: 'rgba(0,0,0,0.4)' }} />
        </motion.button>
      </div>
      <div className="p-6 flex flex-col items-center justify-center min-h-[300px]" style={{ background: 'rgba(0,0,0,0.02)' }}>
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(230,57,70,0.06)' }}>
          <FileText size={36} style={{ color: '#E63946' }} />
        </div>
        <p className="text-sm font-semibold mb-1" style={{ color: '#0D1B2A' }}>Vista previa del documento</p>
        <p className="text-xs text-center max-w-xs" style={{ color: 'rgba(0,0,0,0.4)' }}>Este es un documento firmado electrónicamente.</p>
        <div className="flex gap-2 mt-6">
          <button className="px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2" style={{ background: '#E63946', color: '#FFFFFF' }}>
            <Download size={14} /> Descargar
          </button>
          <button className="px-5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2" style={{ background: 'rgba(0,0,0,0.04)', color: '#0D1B2A', border: '1px solid rgba(0,0,0,0.06)' }}>
            <Upload size={14} /> Reemplazar
          </button>
          <button onClick={() => { onClose(); onDelete(fileData.name) }} className="px-5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2" style={{ background: 'rgba(230,57,70,0.08)', color: '#E63946', border: '1px solid rgba(230,57,70,0.15)' }}>
            <Trash2 size={14} /> Eliminar
          </button>
        </div>
      </div>
    </ModalShell>
  )
}
