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

export default function FormField({ label, value, onChange, required, type = 'text', placeholder, errors }: {
  label: string
  value: string
  onChange: (v: string) => void
  required?: boolean
  type?: string
  placeholder?: string
  errors?: string[]
}) {
  const conError = !!(errors && errors.length > 0)
  return (
    <div className="flex flex-col gap-1 group">
      <label className="text-[11px] font-bold transition-colors duration-200" style={{ color: 'rgba(0,0,0,0.6)' }}>
        {label}{required && <span className="ml-0.5" style={{ color: RED }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="px-3 py-2 rounded-xl text-xs font-medium outline-none w-full transition-all duration-200"
        style={{
          background: conError ? ERROR_BG : meshInputBg,
          color: '#1A1A1E',
          border: conError ? '1px solid rgba(244,56,67,0.5)' : '1px solid transparent',
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
      />
      {renderErrors(errors)}
    </div>
  )
}