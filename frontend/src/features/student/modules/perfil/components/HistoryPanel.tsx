import { motion } from 'motion/react'
import { Activity, ChevronRight, ChevronLeft } from 'lucide-react'
import { assessmentItems } from '@/modules/students/StudentProfileData'
import { cardStyle, GREEN } from '@/features/student/components/ui/fitness'
import { AssessmentDetail } from '@/features/student/components/ui/AssessmentDetail'

interface HistoryPanelProps {
  selectedNum: number | null
  onSelect: (num: number) => void
  onBack: () => void
}

export function HistoryPanel({ selectedNum, onSelect, onBack }: HistoryPanelProps) {
  /* Lista de valoraciones (actual de primeras) */
  if (selectedNum === null) {
    return (
      <>
        {assessmentItems.map((a, i) => (
          <motion.button
            key={a.num}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(a.num)}
            className="rounded-2xl p-4 w-full text-left block"
            style={cardStyle}
          >
            <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: a.color + '15', border: `1px solid ${a.color}30` }}>
                  <Activity size={18} style={{ color: a.color }} />
                </div>
                <div className="min-w-0">
                  <p className="text-white font-bold text-sm truncate">{a.date}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{a.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {a.num === 1 && (
                  <span className="px-2.5 py-1 rounded-full uppercase italic font-black tracking-wider" style={{ background: `linear-gradient(135deg, ${GREEN}, #7CE495)`, color: '#052e12', fontSize: 8.5 }}>
                    Actual
                  </span>
                )}
                <ChevronRight size={15} style={{ color: 'rgba(255,255,255,0.3)' }} />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {a.metrics.map((m, k) => (
                <div key={k} className="rounded-lg p-2 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <p className="text-white font-bold" style={{ fontSize: 11.5 }}>{m.value}</p>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 8 }}>{m.label}</p>
                </div>
              ))}
            </div>
          </motion.button>
        ))}
      </>
    )
  }

  /* Detalle de la valoración seleccionada */
  const sel = assessmentItems.find(a => a.num === selectedNum)
  if (!sel) return null

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-colors hover:bg-white/10"
        style={{ background: 'rgba(18,112,183,0.12)', border: '1px solid rgba(18,112,183,0.25)', color: '#7CC7FF', fontSize: 11.5 }}
      >
        <ChevronLeft size={14} />
        Volver al historial
      </button>
      <div className="rounded-2xl p-4 mt-3" style={cardStyle}>
        <AssessmentDetail item={sel as any} />
      </div>
    </div>
  )
}
