import { useRef, useState, type MouseEvent } from 'react'
import { motion } from 'motion/react'
import { FileText, ShieldCheck, ClipboardCheck, Upload, Eye } from 'lucide-react'
import { loadDocs, saveDoc, DOC_ORDER, DOC_TITLES, type DocKey, type StoredDocs } from '@/data/documents'
import ModalShell, { ModalCloseButton } from '../components/ModalShell'
import { BLUE, BLUE_GRAD } from '../components/fields'

const DOC_META: Record<DocKey, { icon: typeof FileText; color: string; hint: string }> = {
  contrato: { icon: FileText, color: BLUE, hint: 'Contrato de prestación de servicios estudiantiles' },
  tratamiento: { icon: ShieldCheck, color: '#30D158', hint: 'Autorización para el tratamiento de datos personales' },
  parq: { icon: ClipboardCheck, color: '#F5A623', hint: 'Cuestionario de aptitud física antes de entrenar' },
}

export default function DocsSection() {
  const [docs, setDocs] = useState<StoredDocs>(() => loadDocs())
  const [preview, setPreview] = useState<DocKey | null>(null)
  const [pendingKey, setPendingKey] = useState<DocKey | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const pickFile = (key: DocKey) => {
    setPendingKey(key)
    fileRef.current?.click()
  }

  const onFile = (e: MouseEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0]
    e.currentTarget.value = ''
    if (!file || !pendingKey) return
    if (file.type !== 'application/pdf') {
      alert('Solo se permiten archivos PDF.')
      setPendingKey(null)
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      saveDoc(pendingKey, file.name, dataUrl)
      setDocs(loadDocs())
      setPendingKey(null)
    }
    reader.readAsDataURL(file)
  }

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-3 gap-5">
        {DOC_ORDER.map((key, i) => {
          const meta = DOC_META[key]
          const doc = docs[key]
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.08 }}
              className="rounded-2xl p-6 flex flex-col"
              style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${meta.color}10`, border: `1px solid ${meta.color}15` }}>
                <meta.icon size={18} style={{ color: meta.color }} />
              </div>
              <h4 className="text-sm font-bold" style={{ color: '#1D1D1F' }}>{DOC_TITLES[key]}</h4>
              <p className="text-[11px] mt-1.5" style={{ color: 'rgba(0,0,0,0.3)' }}>{meta.hint}</p>

              <div className="mt-4 flex items-center gap-1.5 rounded-xl px-3 py-2 w-fit text-[10px] font-bold" style={{ background: doc.dataUrl ? `${meta.color}0D` : 'rgba(0,0,0,0.03)', color: doc.dataUrl ? meta.color : 'rgba(0,0,0,0.35)' }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: doc.dataUrl ? meta.color : 'rgba(0,0,0,0.2)' }} />
                {doc.dataUrl ? `Actualizado: ${doc.fileName}` : 'Sin documento cargado'}
              </div>

              <div className="flex gap-2 mt-5 pt-4" style={{ borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => pickFile(key)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
                  style={{ background: BLUE_GRAD, boxShadow: `0 6px 16px ${BLUE}2E` }}
                >
                  <Upload size={13} />
                  {doc.dataUrl ? 'Reemplazar' : 'Subir PDF'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: doc.dataUrl ? 1.03 : 1 }}
                  whileTap={{ scale: doc.dataUrl ? 0.97 : 1 }}
                  onClick={() => doc.dataUrl && setPreview(key)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                  style={{ background: 'rgba(0,0,0,0.04)', color: doc.dataUrl ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.2)', cursor: doc.dataUrl ? 'pointer' : 'default' }}
                >
                  <Eye size={13} />
                  Ver
                </motion.button>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      <input ref={fileRef} type="file" accept="application/pdf" className="hidden" onChange={onFile} />

      {preview && (
        <ModalShell onClose={() => setPreview(null)} overlay="rgba(0,0,0,0.3)" cardShadow="0 25px 60px rgba(0,0,0,0.15)" maxWidth="max-w-3xl">
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
            <div className="flex items-center gap-2">
              <FileText size={15} style={{ color: DOC_META[preview].color }} />
              <span className="text-sm font-extrabold" style={{ color: '#1A1A1E' }}>{DOC_TITLES[preview]}</span>
            </div>
            <ModalCloseButton onClick={() => setPreview(null)} color="gray" />
          </div>
          <div className="p-6 bg-[#F5F5F7]">
            {docs[preview].dataUrl ? (
              <iframe src={docs[preview].dataUrl} title={DOC_TITLES[preview]} className="w-full h-[70vh] rounded-2xl bg-white" style={{ border: '1px solid rgba(0,0,0,0.06)' }} />
            ) : (
              <div className="w-full h-[70vh] rounded-2xl flex flex-col items-center justify-center gap-2 bg-white" style={{ border: '1px dashed rgba(0,0,0,0.12)' }}>
                <FileText size={28} style={{ color: 'rgba(0,0,0,0.2)' }} />
                <p className="text-xs font-semibold" style={{ color: 'rgba(0,0,0,0.35)' }}>No hay documento cargado para previsualizar.</p>
              </div>
            )}
          </div>
        </ModalShell>
      )}
    </>
  )
}
