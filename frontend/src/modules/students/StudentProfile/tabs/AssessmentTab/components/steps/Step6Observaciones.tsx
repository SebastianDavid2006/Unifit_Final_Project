import type { ValuationForm } from '@/modules/students/StudentProfileData'

interface Step6ObservacionesProps {
  valuationForm: ValuationForm
  setValuationForm: (f: ValuationForm) => void
  valuationViewMode: boolean
}

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

export function Step6Observaciones({ valuationForm, setValuationForm, valuationViewMode }: Step6ObservacionesProps) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-1">
        <textarea
          value={valuationForm.observacionesFinales}
          readOnly={valuationViewMode}
          onChange={e => setValuationForm(p => ({ ...p, observacionesFinales: e.target.value }))}
          placeholder="Escribe aquí las observaciones finales..."
          rows={6}
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