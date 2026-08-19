import { motion } from 'motion/react'
import musculoIcon from '@/assets/icons/anatomy/musculoskeletal.webp'
import lungsIcon from '@/assets/icons/anatomy/lungs.webp'
import brainIcon from '@/assets/icons/anatomy/brain.webp'
import cardioHealthIcon from '@/assets/icons/anatomy/cardio.webp'
import liverIcon from '@/assets/icons/anatomy/liver.webp'
import mindIcon from '@/assets/icons/health/mind.webp'
import type { ValuationForm } from '@/modules/students/StudentProfileData'

interface Step4AntecedentesProps {
  valuationForm: ValuationForm
  setValuationForm: (f: ValuationForm) => void
  valuationViewMode: boolean
}

const ANTECEDENTES = [
  { value: 'Osteomuscular', icon: musculoIcon },
  { value: 'Respiratorio', icon: lungsIcon },
  { value: 'Psiquiátrico', icon: brainIcon },
  { value: 'Cardiovascular', icon: cardioHealthIcon },
  { value: 'Metabólico', icon: liverIcon },
  { value: 'Psicológico', icon: mindIcon },
] as const

const TEXTAREA_STYLE = {
  base: {
    background: 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)',
    color: '#1A1A1E',
    border: '1px solid transparent',
  },
  hover: {
    background: 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(0,0,0,0.04)',
    borderColor: 'rgba(0,0,0,0.06)',
  },
  focus: {
    background: 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(18,112,183,0.04)',
    borderColor: '#1270B7',
    boxShadow: '0 0 0 3px rgba(18,112,183,0.08)',
  },
} as const

export function Step4Antecedentes({ valuationForm, setValuationForm, valuationViewMode }: Step4AntecedentesProps) {
  return (
    <div className="space-y-5">
      <div>
        <label className="text-xs font-bold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.6)' }}>Antecedentes de salud</label>
        <p className="text-[11px] mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>Selecciona uno o más antecedentes.</p>
        <div className="grid grid-cols-3 gap-2">
          {ANTECEDENTES.map(item => {
            const selected = valuationForm.antecedentesSalud.includes(item.value)
            return (
              <motion.button
                key={item.value}
                type="button"
                disabled={valuationViewMode}
                whileHover={!selected && !valuationViewMode ? { scale: 1.06 } : {}}
                whileTap={valuationViewMode ? {} : { scale: 0.95 }}
                onClick={() => {
                  if (valuationViewMode) return
                  setValuationForm(p => ({
                    ...p,
                    antecedentesSalud: selected
                      ? p.antecedentesSalud.filter((s: string) => s !== item.value)
                      : [...p.antecedentesSalud, item.value],
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
                  src={item.icon}
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
                <span>{item.value}</span>
              </motion.button>
            )
          })}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold" style={{ color: 'rgba(0,0,0,0.6)' }}>Observaciones del entrenador</label>
        <textarea
          value={valuationForm.observacionesEntrenador}
          readOnly={valuationViewMode}
          onChange={e => setValuationForm(p => ({ ...p, observacionesEntrenador: e.target.value }))}
          placeholder="Notas del entrenador sobre los antecedentes..."
          rows={3}
          className="w-full px-3 py-2.5 rounded-xl text-sm font-medium outline-none transition-all duration-200 resize-none"
          style={TEXTAREA_STYLE.base}
          onMouseEnter={e => { if (e.target !== document.activeElement) { Object.assign(e.target.style, TEXTAREA_STYLE.hover) } }}
          onMouseLeave={e => { if (e.target !== document.activeElement) { Object.assign(e.target.style, TEXTAREA_STYLE.base) } }}
          onFocus={e => { Object.assign(e.target.style, TEXTAREA_STYLE.focus) }}
          onBlur={e => { Object.assign(e.target.style, TEXTAREA_STYLE.base) }}
        />
      </div>
    </div>
  )
}