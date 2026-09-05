import { BLUE, RED, meshInputBg, meshInputHover, meshInputFocus } from '../data'

export default function FormField({ label, value, onChange, required, type = 'text', placeholder }: {
  label: string
  value: string
  onChange: (v: string) => void
  required?: boolean
  type?: string
  placeholder?: string
}) {
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
          background: meshInputBg,
          color: '#1A1A1E',
          border: '1px solid transparent',
        }}
        onMouseEnter={e => { if (e.currentTarget !== document.activeElement) { e.currentTarget.style.background = meshInputHover; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)' } }}
        onMouseLeave={e => { if (e.currentTarget !== document.activeElement) { e.currentTarget.style.background = meshInputBg; e.currentTarget.style.borderColor = 'transparent' } }}
        onFocus={e => { e.currentTarget.style.borderColor = BLUE; e.currentTarget.style.background = meshInputFocus; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(18,112,183,0.08)' }}
        onBlur={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = meshInputBg; e.currentTarget.style.boxShadow = 'none' }}
        required={required}
      />
    </div>
  )
}
