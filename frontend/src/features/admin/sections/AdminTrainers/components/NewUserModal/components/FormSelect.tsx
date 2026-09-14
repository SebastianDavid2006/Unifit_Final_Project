import { BLUE, RED, meshInputBg, meshInputHover, meshInputFocus } from '../data'

const ERROR_BG = 'radial-gradient(ellipse at 30% 20%, rgba(244,56,67,0.1) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(244,56,67,0.08) 0%, transparent 50%), rgba(244,56,67,0.04)'

function renderErrors(errors?: string[]) {
  if (!errors || errors.length === 0) return null
  return (
    <div className="flex flex-col gap-0.5">
      {errors.map((m, i) => (
        <span key={i} className="text-[10px] font-semibold" style={{ color: '#FF8A90' }}>
          {m}
        </span>
      ))}
    </div>
  )
}

export default function FormSelect({ label, value, onChange, options, required, errors }: {
  label: string
  value: string
  onChange: (v: string) => void
  options: (string | { value: string; label: string })[]
  required?: boolean
  errors?: string[]
}) {
  const conError = !!(errors && errors.length > 0)
  const optValue = (o: string | { value: string; label: string }) => typeof o === 'string' ? o : o.value
  const optLabel = (o: string | { value: string; label: string }) => typeof o === 'string' ? o : o.label
  return (
    <div className="flex flex-col gap-1 relative group">
      <label className="text-[11px] font-bold transition-colors duration-200" style={{ color: 'rgba(0,0,0,0.6)' }}>
        {label}{required && <span className="ml-0.5" style={{ color: RED }}>*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="px-3 py-2 rounded-xl text-xs font-medium outline-none w-full appearance-none transition-all duration-200 cursor-pointer"
          style={{
            background: conError ? ERROR_BG : meshInputBg,
            color: '#1A1A1E',
            border: conError ? '1px solid rgba(244,56,67,0.5)' : '1px solid transparent',
            paddingRight: 32,
          }}
          onMouseEnter={e => {
            if (e.currentTarget !== document.activeElement) {
              e.currentTarget.style.background = conError ? ERROR_BG : meshInputHover
              e.currentTarget.style.borderColor = conError ? 'rgba(244,56,67,0.5)' : 'rgba(0,0,0,0.06)'
            }
          }}
          onMouseLeave={e => {
            if (e.currentTarget !== document.activeElement) {
              e.currentTarget.style.background = conError ? ERROR_BG : meshInputBg
              e.currentTarget.style.borderColor = conError ? 'rgba(244,56,67,0.5)' : 'transparent'
            }
          }}
          onFocus={e => {
            e.currentTarget.style.borderColor = BLUE
            e.currentTarget.style.background = meshInputFocus
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(18,112,183,0.08)'
          }}
          onBlur={e => {
            e.currentTarget.style.borderColor = conError ? 'rgba(244,56,67,0.5)' : 'transparent'
            e.currentTarget.style.background = conError ? ERROR_BG : meshInputBg
            e.currentTarget.style.boxShadow = 'none'
          }}
          required={required}
        >
          {options.map(o => <option key={optValue(o)} value={optValue(o)}>{optLabel(o)}</option>)}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 group-hover:opacity-60" style={{ color: 'rgba(0,0,0,0.2)' }}>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      {renderErrors(errors)}
    </div>
  )
}