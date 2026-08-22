import type { ValuationForm } from '@/modules/students/StudentProfileData'

interface Step2MedidasProps {
  valuationForm: ValuationForm
  setValuationForm: (f: ValuationForm) => void
  valuationViewMode: boolean
}

const CAMPOS = [
  { key: 'peso', label: 'Peso (kg)', type: 'number' },
  { key: 'estatura', label: 'Estatura (cm)', type: 'number' },
  { key: 'imc', label: 'IMC', type: 'number' },
  { key: 'grasaCorporal', label: 'Grasa corporal (%)', type: 'number' },
  { key: 'masaMuscular', label: 'Masa muscular (kg)', type: 'number' },
  { key: 'masaMagra', label: 'Masa magra (kg)', type: 'number' },
  { key: 'grasaVisceral', label: 'Grasa visceral (nivel)', type: 'number' },
] as const

const INPUT_STYLE = {
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

export function Step2Medidas({ valuationForm, setValuationForm, valuationViewMode }: Step2MedidasProps) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        {CAMPOS.map(field => (
          <div key={field.key} className="flex flex-col gap-1 group">
            <label className="text-xs font-bold" style={{ color: 'rgba(0,0,0,0.6)' }}>{field.label}</label>
            <input
              type={field.type}
              readOnly={valuationViewMode}
              value={(valuationForm as any)[field.key]}
              onChange={e => setValuationForm(p => ({ ...p, [field.key]: e.target.value }))}
              className="px-3 py-2 rounded-xl text-sm font-medium outline-none w-full transition-all duration-200"
              style={INPUT_STYLE.base}
              onMouseEnter={e => { if (e.target !== document.activeElement) { Object.assign(e.target.style, INPUT_STYLE.hover) } }}
              onMouseLeave={e => { if (e.target !== document.activeElement) { Object.assign(e.target.style, INPUT_STYLE.base) } }}
              onFocus={e => { Object.assign(e.target.style, INPUT_STYLE.focus) }}
              onBlur={e => { Object.assign(e.target.style, INPUT_STYLE.base) }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}