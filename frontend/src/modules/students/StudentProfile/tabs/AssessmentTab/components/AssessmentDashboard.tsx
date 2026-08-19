import { motion } from 'motion/react'
import { ClockView } from '@/assets/models/ui/objects/clock/ClockModel'
import { ListView } from '@/assets/models/ui/objects/list/ListModel'
import { CalendarView } from '@/assets/models/ui/objects/calendar/CalendarModel'
import fireGif from '@/assets/icons/animated/fire.gif'
import physicalAssessmentImg from '@/assets/illustrations/modules/physical_assessment.webp'
import { Plus } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
import type { ValuationForm } from '@/modules/students/StudentProfileData'
import { cardStyle, emptyValuationForm } from '@/modules/students/StudentProfileData'

interface AssessmentDashboardProps {
  canCreateValuation: boolean
  setValuationStep: Dispatch<SetStateAction<number>>
  setValuationSuccess: (v: boolean) => void
  setValuationViewMode: (v: boolean) => void
  setValuationForm: Dispatch<SetStateAction<ValuationForm>>
  setShowNewValuationModal: (v: boolean) => void
}

const items = [
  { label: 'Total de rutinas', value: `${4}`, model: 'list' },
  { label: 'Última rutina realizada', value: '15 May 2026', model: 'calendar' },
  { label: 'Fecha de la próxima valoración', value: '01 Ago 2026', model: 'calendar', highlight: true },
]

function getIcon(model: string) {
  const common = { width: 52, height: 52, objectFit: 'contain' as const }
  if (model === 'fire') return <img src={fireGif} alt="fire" style={common} />
  if (model === 'clock') return <div style={common}><ClockView /></div>
  if (model === 'list') return <div style={common}><ListView /></div>
  return <div style={common}><CalendarView /></div>
}

export function AssessmentDashboard({
  canCreateValuation,
  setValuationStep,
  setValuationSuccess,
  setValuationViewMode,
  setValuationForm,
  setShowNewValuationModal,
}: AssessmentDashboardProps) {
  return (
    <div className={`grid ${canCreateValuation ? 'grid-cols-4' : 'grid-cols-3'} gap-4`}>
      {items.map((m) => {
        const iconEl = getIcon(m.model)
        return (
          <motion.div
            key={m.label}
            whileHover={{ scale: 1.03 }}
            transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
            className="relative rounded-2xl p-4 flex flex-col items-center text-center group"
            style={{
              ...cardStyle,
              ...(m.highlight ? { border: '1px solid rgba(48,209,88,0.15)', boxShadow: '0 8px 32px rgba(48,209,88,0.12), 0 0 40px rgba(48,209,88,0.06)' } : {}),
            }}
          >
            <div
              className="transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.5] mb-5 flex items-center justify-center"
              style={{ transformOrigin: 'bottom center' }}
            >
              {iconEl}
            </div>
            <p style={{
              fontSize: '1.8rem', fontWeight: 700, lineHeight: 1,
              ...(m.highlight
                ? { background: 'linear-gradient(135deg, #30D158, #00C7BE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }
                : {}),
            }} className={m.highlight ? '' : 'text-gradient-warm'}>{m.value}</p>
            <p className="text-sm font-semibold mt-2" style={{
              color: m.highlight ? '#30D158' : 'rgba(0,0,0,0.5)',
            }}>{m.label}</p>
          </motion.div>
        )
      })}

      {canCreateValuation && (
        <motion.div
          whileHover={{ boxShadow: '0 12px 40px rgba(230,57,70,0.3), 0 0 60px rgba(230,57,70,0.1)' }}
          transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
          className="relative rounded-2xl flex flex-col items-center text-center group cursor-pointer"
          style={{
            borderRadius: 20,
            background: 'radial-gradient(ellipse at 20% 30%, rgba(230,57,70,0.9) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(18,112,183,0.4) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(241,200,39,0.25) 0%, transparent 50%), #CC0033',
            backgroundSize: '200% 200%',
            animation: 'mesh-shift 15s ease-in-out infinite',
            boxShadow: '0 8px 32px rgba(230,57,70,0.12), 0 2px 8px rgba(230,57,70,0.06)',
          }}
          onClick={() => { setValuationStep(1); setValuationSuccess(false); setValuationViewMode(false); setValuationForm(emptyValuationForm); setShowNewValuationModal(true) }}
        >
          <div className="w-full flex flex-col items-center relative z-10">
            <div
              className="transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.2]"
              style={{ width: '100%', height: 110, position: 'relative', transformOrigin: 'bottom center' }}
            >
              <img
                src={physicalAssessmentImg}
                alt=""
                className="w-full h-full object-contain drop-shadow-xl"
                style={{ objectPosition: 'bottom center' }}
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-14 pointer-events-none z-10" style={{
              background: 'linear-gradient(to top, #CC0033 0%, rgba(204,0,51,0) 100%)',
            }} />
          </div>
          <div className="flex items-center gap-1.5 mb-3 z-10">
            <span className="text-sm font-bold text-white/90">Nueva Valoración</span>
            <Plus size={16} className="text-white/90" />
          </div>
        </motion.div>
      )}
    </div>
  )
}
