import { useRef } from 'react'
import { motion } from 'motion/react'
import { FileText, X, CheckCircle2, Download, AlertTriangle, Upload, Plus, ClipboardList } from 'lucide-react'
import { studentDocuments } from '@/features/student/utils/mockData'
import { cardStyle, FIRE, AMBER, GREEN } from '@/features/student/components/ui/fitness'

interface DocumentsPanelProps {
  medEps: File | null
  setMedEps: (f: File | null) => void
  medHistoria: File | null
  setMedHistoria: (f: File | null) => void
  lesiones: File[]
  setLesiones: (updater: (prev: File[]) => File[]) => void
}

export function DocumentsPanel({ medEps, setMedEps, medHistoria, setMedHistoria, lesiones, setLesiones }: DocumentsPanelProps) {
  const epsRef = useRef<HTMLInputElement>(null)
  const histRef = useRef<HTMLInputElement>(null)
  const lesRef = useRef<HTMLInputElement>(null)

  return (
    <>
      {studentDocuments.map((doc, i) => {
        const statusColor = GREEN
        return (
          <div key={i} className="rounded-2xl p-4 flex items-center gap-3.5" style={cardStyle}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: statusColor + '14', border: `1px solid ${statusColor}28` }}>
              <FileText size={19} style={{ color: statusColor }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm truncate">{doc.name}</p>
              <p style={{ color: statusColor, fontSize: 11, textTransform: 'capitalize' }}>
                Firmado · {doc.date}
              </p>
            </div>
            <button className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }} title="Descargar">
              <Download size={16} />
            </button>
          </div>
        )
      })}

      {/* Documentos médicos — subida por el estudiante */}
      <p className="uppercase tracking-[0.18em] pt-2" style={{ fontSize: 9.5, fontWeight: 800, color: AMBER }}>Documentos médicos</p>

      {/* Certificado EPS */}
      <div
        className="rounded-2xl p-4 flex items-center gap-3.5"
        style={{
          border: medEps ? `1px solid ${GREEN}35` : `1px dashed ${FIRE}50`,
          background: medEps ? GREEN + '06' : FIRE + '05',
        }}
      >
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: (medEps ? GREEN : FIRE) + '14', border: `1px solid ${(medEps ? GREEN : FIRE)}30` }}>
          {medEps ? <CheckCircle2 size={19} style={{ color: GREEN }} /> : <AlertTriangle size={19} style={{ color: FIRE }} />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm">Certificado EPS</p>
          <p className="truncate" style={{ color: medEps ? GREEN : FIRE, fontSize: 11 }}>
            {medEps ? medEps.name : 'Documento faltante'}
          </p>
        </div>
        {medEps ? (
          <button onClick={() => setMedEps(null)} title="Quitar archivo" className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors hover:bg-red-500/20" style={{ background: 'rgba(230,57,70,0.1)', color: FIRE }}>
            <X size={16} />
          </button>
        ) : null}
        <motion.button whileTap={{ scale: 0.94 }} onClick={() => epsRef.current?.click()} className="px-3.5 py-2 rounded-xl font-black uppercase tracking-wider flex-shrink-0 flex items-center gap-1.5" style={{ background: `linear-gradient(135deg, ${FIRE}, ${AMBER})`, color: '#fff', fontSize: 9.5 }}>
          <Upload size={12} />
          Subir
        </motion.button>
      </div>

      {/* Historial médico */}
      <div
        className="rounded-2xl p-4 flex items-center gap-3.5"
        style={{
          border: medHistoria ? `1px solid ${GREEN}35` : `1px dashed ${FIRE}50`,
          background: medHistoria ? GREEN + '06' : FIRE + '05',
        }}
      >
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: (medHistoria ? GREEN : FIRE) + '14', border: `1px solid ${(medHistoria ? GREEN : FIRE)}30` }}>
          {medHistoria ? <CheckCircle2 size={19} style={{ color: GREEN }} /> : <AlertTriangle size={19} style={{ color: FIRE }} />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm">Historial médico</p>
          <p className="truncate" style={{ color: medHistoria ? GREEN : FIRE, fontSize: 11 }}>
            {medHistoria ? medHistoria.name : 'Documento faltante'}
          </p>
        </div>
        {medHistoria ? (
          <button onClick={() => setMedHistoria(null)} title="Quitar archivo" className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors hover:bg-red-500/20" style={{ background: 'rgba(230,57,70,0.1)', color: FIRE }}>
            <X size={16} />
          </button>
        ) : null}
        <motion.button whileTap={{ scale: 0.94 }} onClick={() => histRef.current?.click()} className="px-3.5 py-2 rounded-xl font-black uppercase tracking-wider flex-shrink-0 flex items-center gap-1.5" style={{ background: `linear-gradient(135deg, ${FIRE}, ${AMBER})`, color: '#fff', fontSize: 9.5 }}>
          <Upload size={12} />
          Subir
        </motion.button>
      </div>

      {/* Lesiones — múltiples archivos */}
      <div className="rounded-2xl p-4" style={{ border: `1px dashed ${AMBER}45`, background: AMBER + '05' }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: AMBER + '14', border: `1px solid ${AMBER}30` }}>
            <ClipboardList size={19} style={{ color: AMBER }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm">Lesiones</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
              {lesiones.length > 0 ? `${lesiones.length} archivo${lesiones.length > 1 ? 's' : ''} subido${lesiones.length > 1 ? 's' : ''}` : 'Puedes subir varios archivos'}
            </p>
          </div>
        </div>
        {lesiones.length > 0 && (
          <div className="space-y-1.5 mb-3">
            {lesiones.map((f, i) => (
              <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <FileText size={14} style={{ color: AMBER, flexShrink: 0 }} />
                <span className="flex-1 min-w-0 truncate text-white font-semibold" style={{ fontSize: 11.5 }}>{f.name}</span>
                <button
                  onClick={() => setLesiones(prev => prev.filter((_, k) => k !== i))}
                  className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors hover:bg-red-500/20"
                  style={{ color: FIRE }}
                >
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
        <motion.button whileTap={{ scale: 0.98 }} onClick={() => lesRef.current?.click()} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-black uppercase tracking-wider transition-all hover:bg-white/10" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${AMBER}40`, color: AMBER, fontSize: 10 }}>
          <Plus size={14} />
          Agregar archivo de lesión
        </motion.button>
      </div>

      {/* Inputs ocultos */}
      <input ref={epsRef} type="file" accept=".pdf,.jpg,.jpeg,.png,image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) setMedEps(f); e.target.value = '' }} />
      <input ref={histRef} type="file" accept=".pdf,.jpg,.jpeg,.png,image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) setMedHistoria(f); e.target.value = '' }} />
      <input
        ref={lesRef}
        type="file"
        multiple
        accept=".pdf,.jpg,.jpeg,.png,image/*"
        className="hidden"
        onChange={e => { const fs = e.target.files; if (fs && fs.length) setLesiones(prev => [...prev, ...Array.from(fs)]); e.target.value = '' }}
      />
    </>
  )
}
