import { FileText, Download, Eye } from 'lucide-react'
import { loadDocs, DOC_TITLES, type StoredDoc } from '@/data/documents'
import { useState } from 'react'
import { cardStyle, GREEN } from '@/features/student/components/ui/fitness'

type DocKey = 'contrato' | 'tratamiento' | 'parq'

const DOC_KEYS: DocKey[] = ['contrato', 'tratamiento', 'parq']

const DOC_HINTS: Record<DocKey, string> = {
  contrato: 'Contrato de prestación de servicios',
  tratamiento: 'Autorización para tratamiento de datos personales',
  parq: 'Cuestionario PAR-Q de aptitud física',
}

export function GymDocumentsPanel() {
  const [docs] = useState(() => loadDocs())
  const [preview, setPreview] = useState<DocKey | null>(null)

  const download = (key: DocKey, name: string) => {
    const a = document.createElement('a')
    a.href = name
    a.download = DOC_TITLES[key] ?? 'documento.pdf'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  const descriptedDoc = (key: DocKey): StoredDoc => {
    const d = (docs as Record<string, StoredDoc>)[key]
    return d ? { fileName: d.fileName, dataUrl: d.dataUrl } : { fileName: null, dataUrl: null }
  }

  return (
    <>
      {DOC_KEYS.map((key) => {
        const doc = descriptedDoc(key)
        return (
          <div key={key} className="rounded-2xl p-4 flex items-center gap-3.5" style={cardStyle}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: GREEN + '14', border: `1px solid ${GREEN}28` }}>
              <FileText size={19} style={{ color: GREEN }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm truncate">{DOC_TITLES[key]}</p>
              <p style={{ color: doc.dataUrl ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.25)', fontSize: 11 }}>
                {doc.dataUrl ? DOC_HINTS[key] : 'Documento no disponible'}
              </p>
            </div>
            <button
              onClick={() => doc.dataUrl && setPreview(key)}
              disabled={!doc.dataUrl}
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.06)', color: doc.dataUrl ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)', cursor: doc.dataUrl ? 'pointer' : 'default' }}
              title="Ver"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => doc.dataUrl && download(key, doc.dataUrl!)}
              disabled={!doc.dataUrl}
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.06)', color: doc.dataUrl ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)', cursor: doc.dataUrl ? 'pointer' : 'default' }}
              title="Descargar"
            >
              <Download size={16} />
            </button>
          </div>
        )
      })}

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
              <span className="text-sm font-extrabold" style={{ color: '#1A1A1E' }}>{DOC_TITLES[preview]}</span>
              <button onClick={() => setPreview(null)} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.05)', color: 'rgba(0,0,0,0.6)' }}>
                ✕
              </button>
            </div>
            <div className="p-4 bg-[#F5F5F7]" style={{ height: '75vh' }}>
              {descriptedDoc(preview).dataUrl ? (
                <iframe src={descriptedDoc(preview).dataUrl!} title={DOC_TITLES[preview]} className="w-full h-full rounded-2xl bg-white" style={{ border: '1px solid rgba(0,0,0,0.06)' }} />
              ) : (
                <div className="w-full h-full rounded-2xl flex flex-col items-center justify-center gap-2 bg-white" style={{ border: '1px dashed rgba(0,0,0,0.12)' }}>
                  <FileText size={28} style={{ color: 'rgba(0,0,0,0.2)' }} />
                  <p className="text-xs font-semibold" style={{ color: 'rgba(0,0,0,0.35)' }}>No hay documento para previsualizar.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}