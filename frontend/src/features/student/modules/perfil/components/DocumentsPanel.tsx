import { FileText, Download } from 'lucide-react'
import { studentDocuments } from '@/features/student/utils/mockData'
import { cardStyle, GREEN } from '@/features/student/components/ui/fitness'

export function DocumentsPanel() {
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
    </>
  )
}
