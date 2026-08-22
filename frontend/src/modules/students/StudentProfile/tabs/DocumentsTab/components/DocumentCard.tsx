import { motion } from 'motion/react'
import { Eye, FileText } from 'lucide-react'

interface DocumentItem {
  name: string
  date: string
  signed: boolean
  originalName?: string
}

interface DocumentCardProps {
  doc: DocumentItem
  si: number
  di: number
  openMenuDoc: string | null
  setOpenMenuDoc: (v: string | null) => void
  setFileModalData: (v: { name: string; date: string } | null) => void
  setFileModalOpen: (v: boolean) => void
}

export function DocumentCard({
  doc,
  si,
  di,
  openMenuDoc,
  setOpenMenuDoc,
  setFileModalData,
  setFileModalOpen,
}: DocumentCardProps) {
  const menuKey = `${si}-${di}`

  if (doc.signed) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: si * 0.1 + di * 0.06 }}
        className="rounded-xl p-5 transition-all duration-300 cursor-pointer relative overflow-hidden"
        style={{
          background: '#FFFFFF',
          border: '1px solid rgba(0,0,0,0.06)',
        }}
        onMouseEnter={(e) => {
          setOpenMenuDoc(menuKey)
          e.currentTarget.style.transform = 'scale(1.02)'
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'
        }}
        onMouseLeave={(e) => {
          setOpenMenuDoc(null)
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        <div className={`transition-all duration-300 ${openMenuDoc === menuKey ? 'opacity-0' : 'opacity-100'}`}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(230,57,70,0.06)' }}>
              <FileText size={16} style={{ color: '#E63946' }} />
            </div>
            <div>
              <p className="text-[#0D1B2A] text-sm font-semibold leading-tight">{doc.name}</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'rgba(0,0,0,0.5)' }}>{doc.date}</p>
              <p className="text-[10px] mt-0.5 font-mono" style={{ color: 'rgba(0,0,0,0.35)' }}>{doc.originalName}</p>
            </div>
          </div>
        </div>
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl transition-all duration-300 ${openMenuDoc === menuKey ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          style={{
            background: 'radial-gradient(circle at 20% 30%, rgba(230,57,70,0.08), rgba(230,57,70,0.02) 50%, rgba(255,255,255,0.95) 70%)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => {
            setFileModalData({ name: doc.name, date: doc.date })
            setFileModalOpen(true)
          }}
        >
          <Eye size={28} style={{ color: '#E63946' }} />
          <span className="text-xs font-semibold" style={{ color: '#E63946' }}>Ver contenido</span>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: si * 0.1 + di * 0.06 }}
      className="rounded-xl p-4 transition-all cursor-pointer"
      style={{
        background: 'rgba(230,57,70,0.04)',
        border: '1px dashed rgba(230,57,70,0.25)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.02)'
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(230,57,70,0.12)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(230,57,70,0.1)' }}>
          <FileText size={14} style={{ color: '#E63946' }} />
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md" style={{ background: 'rgba(230,57,70,0.1)', color: '#C62828' }}>
          Pendiente
        </span>
      </div>
      <p className="text-[#0D1B2A] text-sm font-semibold">{doc.name}</p>
      <p className="text-[11px] mt-1" style={{ color: '#C62828' }}>Este documento aún no ha sido entregado</p>
      <button
        className="mt-3 w-full py-2 rounded-xl text-xs font-bold transition-all"
        style={{ background: '#E63946', color: '#FFFFFF' }}
      >
        Solicitar
      </button>
    </motion.div>
  )
}
