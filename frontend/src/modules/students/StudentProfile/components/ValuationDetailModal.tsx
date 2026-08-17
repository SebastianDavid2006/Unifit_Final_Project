import { motion } from 'framer-motion'
import { X, BarChart2, Dumbbell } from 'lucide-react'
import { ModalShell } from './ModalShell'

function valuationStat(label: string, value: string, color?: string) {
  return (
    <div className="rounded-xl p-3 flex items-center justify-between gap-2" style={{ background: 'rgba(0,0,0,0.02)' }}>
      <span className="text-[11px] font-medium" style={{ color: 'rgba(0,0,0,0.4)' }}>{label}</span>
      <span className="text-sm font-bold text-right" style={{ color: color ?? '#0D1B2A' }}>{value}</span>
    </div>
  )
}

interface ValuationDetailModalProps {
  isOpen: boolean
  assessment: any
  onClose: () => void
}

export function ValuationDetailModal({ isOpen, assessment, onClose }: ValuationDetailModalProps) {
  if (!assessment) return null
  return (
    <ModalShell isOpen={isOpen} onClose={onClose} maxWidth="max-w-xl" zIndex={50}>
      <div className="flex items-center justify-between mb-5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${assessment.color}15` }}>
            <BarChart2 size={20} style={{ color: assessment.color }} />
          </div>
          <div>
            <h3 className="text-base font-bold" style={{ color: '#0D1B2A' }}>Valoración {assessment.type}</h3>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.4)' }}>{assessment.date} · {assessment.evaluator}</p>
          </div>
        </div>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onClose}
          className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.04)' }}>
          <X size={16} style={{ color: 'rgba(0,0,0,0.4)' }} />
        </motion.button>
      </div>
      <div className="overflow-y-auto space-y-4 flex-1 pr-1" style={{ scrollbarWidth: 'thin', maxHeight: '60vh' }}>
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0" style={{ width: 88, height: 88 }}>
            <svg viewBox="0 0 36 36" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="2.8" />
              <circle cx="18" cy="18" r="15.9" fill="none" stroke={assessment.color} strokeWidth="2.8" strokeLinecap="round"
                strokeDasharray={`${assessment.score * 0.999} ${100 - assessment.score * 0.999}`} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-lg font-extrabold" style={{ color: assessment.color }}>{assessment.score}%</p>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <div className="rounded-xl px-3 py-2" style={{ background: 'rgba(0,0,0,0.02)' }}>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'rgba(0,0,0,0.35)' }}>Nivel de actividad física</p>
              <p className="text-sm font-bold" style={{ color: '#0D1B2A' }}>{assessment.nivelActividad}</p>
            </div>
            <div className="rounded-xl px-3 py-2" style={{ background: 'rgba(0,0,0,0.02)' }}>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'rgba(0,0,0,0.35)' }}>Evaluador</p>
              <p className="text-sm font-bold" style={{ color: '#0D1B2A' }}>{assessment.evaluator}</p>
            </div>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(0,0,0,0.35)' }}>Objetivos</p>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {assessment.objetivoTarjetas.map((o: string) => (
              <span key={o} className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #1270B7, #7ec8e3)' }}>{o}</span>
            ))}
          </div>
          <div className="rounded-xl px-3 py-2.5" style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(212,175,55,0.25)' }}>
            <p className="text-[11px] font-semibold italic leading-relaxed" style={{ color: '#B8860B' }}>"{assessment.objetivoDetalle}"</p>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(0,0,0,0.35)' }}>Medidas corporales</p>
          <div className="grid grid-cols-2 gap-3">
            {assessment.metrics.map((m: any) => (
              <div key={m.label} className="rounded-xl p-3 flex items-center justify-between" style={{ background: 'rgba(0,0,0,0.02)' }}>
                <span className="text-[11px] font-medium" style={{ color: 'rgba(0,0,0,0.4)' }}>{m.label}</span>
                <span className="text-sm font-bold" style={{ color: '#0D1B2A' }}>{m.value}</span>
              </div>
            ))}
            {valuationStat('Estatura', assessment.estatura)}
            {valuationStat('Masa magra', assessment.masaMagra)}
            {valuationStat('Grasa visceral', assessment.grasaVisceral, '#E63946')}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(0,0,0,0.35)' }}>Evaluación clínica</p>
          <div className="grid grid-cols-2 gap-3">
            {valuationStat('Presión arterial', assessment.presionArterial)}
            {valuationStat('Edad metabólica', `${assessment.edadMetabolica} años`)}
            {valuationStat('Agua corporal', assessment.aguaCorporal)}
            {valuationStat('Resistencia muscular', assessment.resistenciaMuscular)}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(0,0,0,0.35)' }}>Antecedentes de salud</p>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {assessment.antecedentesSalud.length === 0 ? (
              <span className="text-[11px] font-medium" style={{ color: 'rgba(0,0,0,0.35)' }}>Sin antecedentes registrados</span>
            ) : assessment.antecedentesSalud.map((a: string) => (
              <span key={a} className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #E63946, #FF8FA3)' }}>{a}</span>
            ))}
          </div>
          <div className="rounded-xl px-3 py-2.5" style={{ background: 'rgba(0,0,0,0.02)' }}>
            <p className="text-[11px] font-medium leading-relaxed" style={{ color: 'rgba(0,0,0,0.6)' }}>{assessment.observacionesEntrenador}</p>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(0,0,0,0.35)' }}>Plan de entrenamiento</p>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {assessment.diasDisponibles.map((d: string) => (
              <span key={d} className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #1A8A3F, #30D158)' }}>{d}</span>
            ))}
          </div>
          <div className="rounded-xl px-3 py-2.5 flex items-center gap-2" style={{ background: 'rgba(0,0,0,0.02)' }}>
            <Dumbbell size={14} style={{ color: 'rgba(0,0,0,0.4)' }} />
            <span className="text-sm font-semibold" style={{ color: '#0D1B2A' }}>{assessment.routine}</span>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(0,0,0,0.35)' }}>Observaciones finales</p>
          <div className="rounded-xl px-3 py-2.5" style={{ background: 'rgba(0,0,0,0.02)' }}>
            <p className="text-[11px] font-medium leading-relaxed" style={{ color: 'rgba(0,0,0,0.6)' }}>{assessment.observacionesFinales}</p>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 flex justify-end flex-shrink-0" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
          style={{ background: 'rgba(0,0,0,0.04)', color: '#0D1B2A', border: '1px solid rgba(0,0,0,0.06)' }}>
          Cerrar
        </button>
      </div>
    </ModalShell>
  )
}
