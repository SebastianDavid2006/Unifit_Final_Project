import { BLUE, RED, meshInputBg, meshInputHover, meshInputFocus } from '../data'

export default function FormSelect({ label, value, onChange, options, required }: {
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
  required?: boolean
}) {
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
            background: meshInputBg,
            color: '#1A1A1E',
            border: '1px solid transparent',
            paddingRight: 32,
          }}
          onMouseEnter={e => { if (e.currentTarget !== document.activeElement) { e.currentTarget.style.background = meshInputHover; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)' } }}
          onMouseLeave={e => { if (e.currentTarget !== document.activeElement) { e.currentTarget.style.background = meshInputBg; e.currentTarget.style.borderColor = 'transparent' } }}
          onFocus={e => { e.currentTarget.style.borderColor = BLUE; e.currentTarget.style.background = meshInputFocus; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(18,112,183,0.08)' }}
          onBlur={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = meshInputBg; e.currentTarget.style.boxShadow = 'none' }}
          required={required}
        >
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 group-hover:opacity-60" style={{ color: 'rgba(0,0,0,0.2)' }}>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  )
}
