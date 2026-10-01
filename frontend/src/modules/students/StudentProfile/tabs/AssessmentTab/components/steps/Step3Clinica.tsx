import type { Dispatch, SetStateAction } from 'react'
import type { ValuationForm } from '@/modules/students/StudentProfileData'
import { CAMPOS_CLINICOS, type ErroresValoracion } from '@/lib/validacionValoracion'

interface Step3ClinicaProps {
  valuationForm: ValuationForm
  setValuationForm: Dispatch<SetStateAction<ValuationForm>>
  valuationViewMode: boolean
  errores?: ErroresValoracion
}

const CAMPOS = [
  { key: 'presionArterial', label: 'Presión arterial', type: 'text' },
  { key: 'edadMetabolica', label: 'Edad metabólica', type: 'number' },
  { key: 'aguaCorporal', label: 'Agua corporal (%)', type: 'number' },
  { key: 'resistenciaMuscular', label: 'Resistencia muscular', type: 'number' },
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

export function Step3Clinica({ valuationForm, setValuationForm, valuationViewMode, errores = {} }: Step3ClinicaProps) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        {CAMPOS.map(field => (
          <div key={field.key} className="flex flex-col gap-1 group">
            <label className="text-xs font-bold" style={{ color: 'rgba(0,0,0,0.6)' }}>{field.label}</label>
            <input
              type={field.type}
              {...(field.type === 'number'
                ? { min: CAMPOS_CLINICOS[field.key].min, max: CAMPOS_CLINICOS[field.key].max, step: CAMPOS_CLINICOS[field.key].entero ? 1 : 'any', onKeyDown: (e: React.KeyboardEvent) => { if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault() } }
                : { maxLength: 7, placeholder: '120/80', inputMode: 'numeric' as const })}
              readOnly={valuationViewMode}
              value={(valuationForm as any)[field.key]}
              onChange={e => setValuationForm(p => ({ ...p, [field.key]: e.target.value }))}
              className="px-3 py-2 rounded-xl text-sm font-medium outline-none w-full transition-all duration-200"
              aria-invalid={!!errores[field.key]}
              style={errores[field.key] ? { ...INPUT_STYLE.base, borderColor: '#F43843' } : INPUT_STYLE.base}
              onMouseEnter={e => { if (e.target !== document.activeElement) { Object.assign(e.currentTarget.style, INPUT_STYLE.hover) } }}
              onMouseLeave={e => { if (e.target !== document.activeElement) { Object.assign(e.currentTarget.style, INPUT_STYLE.base) } }}
              onFocus={e => { Object.assign(e.currentTarget.style, INPUT_STYLE.focus) }}
              onBlur={e => { Object.assign(e.currentTarget.style, INPUT_STYLE.base) }}
            />
            {errores[field.key] && <span role="alert" className="text-[11px] font-semibold" style={{ color: '#F43843' }}>{errores[field.key]}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}