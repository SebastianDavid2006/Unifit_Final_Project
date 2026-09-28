import { useState } from 'react'
import { motion } from 'motion/react'
import { FileText, Download, Eye } from 'lucide-react'
import { cardStyle, GREEN } from '@/features/student/components/ui/fitness'
import { getImageUrl } from '@/lib/config'
import type { DocumentoLegalItem } from '@/services/documento.service'

interface GymDocumentsPanelProps {
  docs: DocumentoLegalItem[]
  loading: boolean
}

const TIPOS_LABEL: Record<string, string> = {
  contrato_gym: 'Contrato de prestación de servicios',
  tratamiento_datos: 'Autorización para el tratamiento de datos personales',
}

export function GymDocumentsPanel({ docs, loading }: GymDocumentsPanelProps) {
  const [preview, setPreview] = useState<DocumentoLegalItem | null>(null)

  const cargados = docs.filter(d => d.url_pdf)

  if (loading && cargados.length === 0) {
    return (
      <div className="space-y-3">
        {[0, 1].map(i => (
          <div key={i} className="rounded-2xl h-20 animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
        ))}
      </div>
    )
  }

  if (cargados.length === 0) {
    return (
      <div className="rounded-2xl p-6 text-center" style={cardStyle}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>No hay documentos cargados.</p>
      </div>
    )
  }

  const descargar = (url: string, nombre: string) => {
    const a = document.createElement('a')
    a.href = getImageUrl(url)
    a.download = nombre
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  return (
    <>
      {cargados.map((doc, i) => (
        <motion.div
          key={doc.id_doc_legal}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: Math.min(i * 0.04, 0.3) }}
          className="rounded-2xl p-4 flex items-center gap-3.5"
          style={cardStyle}
        >
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: GREEN + '14', border: `1px solid ${GREEN}28` }}>
            <FileText size={19} style={{ color: GREEN }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm truncate">{doc.nombre}</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{TIPOS_LABEL[doc.tipo]}</p>
          </div>
          <button
            onClick={() => setPreview(doc)}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}
            title="Ver"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => descargar(doc.url_pdf!, doc.nombre || `${doc.tipo}.pdf`)}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}
            title="Descargar"
          >
            <Download size={16} />
          </button>
        </motion.div>
      ))}

      {preview && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)' }}
          onClick={() => setPreview(null)}
        >
          <div
            className="w-full max-w-3xl max-h-[85vh] rounded-3xl overflow-hidden bg-white"
            style={{ border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 -10px 80px rgba(0,0,0,0.6)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', background: '#fff' }}>
              <span className="text-sm font-extrabold" style={{ color: '#1A1A1E' }}>{preview.nombre || TIPOS_LABEL[preview.tipo]}</span>
              <button onClick={() => setPreview(null)} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.05)', color: 'rgba(0,0,0,0.6)' }}>
                ✕
              </button>
            </div>
            <div className="p-4 bg-[#F5F5F7]" style={{ height: '75vh' }}>
              <iframe src={getImageUrl(preview.url_pdf!)} title={preview.nombre || TIPOS_LABEL[preview.tipo]} className="w-full h-full rounded-2xl bg-white" style={{ border: '1px solid rgba(0,0,0,0.06)' }} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}