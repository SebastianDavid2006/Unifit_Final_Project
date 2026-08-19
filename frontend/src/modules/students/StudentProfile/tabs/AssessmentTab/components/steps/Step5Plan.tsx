import { motion } from 'motion/react'
import calendarImg from '@/assets/icons/objects/calendar.webp'
import type { ValuationForm } from '@/modules/students/StudentProfileData'

interface Step5PlanProps {
  valuationForm: ValuationForm
  setValuationForm: (f: ValuationForm) => void
  valuationViewMode: boolean
}

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'] as const

export function Step5Plan({ valuationForm, setValuationForm, valuationViewMode }: Step5PlanProps) {
  return (
    <div className="space-y-5">
      <div>
        <label className="text-xs font-bold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.6)' }}>Días de la semana</label>
        <p className="text-[11px] mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>Selecciona los días disponibles.</p>
        <div className="grid grid-cols-6 gap-2">
          {DIAS.map(dia => {
            const selected = valuationForm.diasDisponibles.includes(dia)
            return (
              <motion.button
                key={dia}
                type="button"
                disabled={valuationViewMode}
                whileHover={!selected && !valuationViewMode ? { scale: 1.06 } : {}}
                whileTap={valuationViewMode ? {} : { scale: 0.95 }}
                onClick={() => {
                  if (valuationViewMode) return
                  setValuationForm(p => ({
                    ...p,
                    diasDisponibles: selected
                      ? p.diasDisponibles.filter((d: string) => d !== dia)
                      : [...p.diasDisponibles, dia],
                  }))
                }}
                className="flex flex-col items-center gap-1.5 px-3 py-3.5 rounded-xl text-sm font-bold transition-all duration-200"
                style={{
                  background: selected ? 'linear-gradient(135deg, #1270B7, #7ec8e3)' : 'rgba(0,0,0,0.03)',
                  color: selected ? '#FFFFFF' : 'rgba(0,0,0,0.35)',
                  border: '1px solid transparent',
                  boxShadow: selected ? '0 4px 20px rgba(18,112,183,0.25)' : 'none',
                }}
                onMouseEnter={e => { if (!selected) { e.currentTarget.style.background = 'rgba(18,112,183,0.12)'; e.currentTarget.style.color = '#1270B7' } }}
                onMouseLeave={e => { if (!selected) { e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; e.currentTarget.style.color = 'rgba(0,0,0,0.35)' } }}
              >
                <motion.img
                  src={calendarImg}
                  alt=""
                  className="mb-0.5"
                  animate={{
                    width: selected ? 48 : 24,
                    height: selected ? 48 : 24,
                    marginTop: selected ? -24 : 0,
                    filter: selected ? 'blur(0px) drop-shadow(0 8px 20px rgba(0,0,0,0.15))' : 'blur(0px)',
                  }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                />
                <span className="text-sm">{dia}</span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}