import { BLUE, RED } from '@/modules/students/NewStudentData'

const meshInputBg = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)'
const meshInputHover = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(0,0,0,0.04)'

interface FieldProps {
  label: string
  value: string
  onChange: (val: string) => void
  type?: string
  required?: boolean
  placeholder?: string
}

export function Field({ label, value, onChange, type = 'text', required, placeholder }: FieldProps) {
  return (
    <div className="flex flex-col gap-1 group">
      <label className="text-[11px] font-bold transition-colors duration-200" style={{ color: 'rgba(0,0,0,0.6)' }}>
        {label}{required && <span className="ml-0.5" style={{ color: RED }}>*</span>}
      </label>
      <input
        type={type}
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="px-3 py-2 rounded-xl text-xs font-medium outline-none w-full transition-all duration-200"
        style={{
          background: meshInputBg,
          color: '#1A1A1E',
          border: '1px solid transparent',
        }}
        onMouseEnter={e => {
          if (e.currentTarget !== document.activeElement) {
            e.currentTarget.style.background = meshInputHover
            e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'
          }
        }}
        onMouseLeave={e => {
          if (e.currentTarget !== document.activeElement) {
            e.currentTarget.style.background = meshInputBg
            e.currentTarget.style.borderColor = 'transparent'
          }
        }}
        onFocus={e => {
          e.currentTarget.style.borderColor = BLUE
          e.currentTarget.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(18,112,183,0.04)'
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(18,112,183,0.08)'
        }}
        onBlur={e => {
          e.currentTarget.style.borderColor = 'transparent'
          e.currentTarget.style.background = meshInputBg
          e.currentTarget.style.boxShadow = 'none'
        }}
        required={required}
      />
    </div>
  )
}

interface SelectProps {
  label: string
  value: string
  onChange: (val: string) => void
  options: (string | { value: string; label: string })[]
  required?: boolean
}

function optValue(o: string | { value: string; label: string }): string {
  return typeof o === 'string' ? o : o.value
}
function optLabel(o: string | { value: string; label: string }): string {
  return typeof o === 'string' ? o : o.label
}

export function Select({ label, value, onChange, options, required }: SelectProps) {
  return (
    <div className="flex flex-col gap-1 relative group">
      <label className="text-[11px] font-bold transition-colors duration-200" style={{ color: 'rgba(0,0,0,0.6)' }}>
        {label}{required && <span className="ml-0.5" style={{ color: RED }}>*</span>}
      </label>
      <div className="relative">
        <select
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
          className="px-3 py-2 rounded-xl text-xs font-medium outline-none w-full appearance-none transition-all duration-200 cursor-pointer"
          style={{
            background: meshInputBg,
            color: '#1A1A1E',
            border: '1px solid transparent',
            paddingRight: 32,
          }}
          onMouseEnter={e => {
            if (e.currentTarget !== document.activeElement) {
              e.currentTarget.style.background = meshInputHover
              e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'
            }
          }}
          onMouseLeave={e => {
            if (e.currentTarget !== document.activeElement) {
              e.currentTarget.style.background = meshInputBg
              e.currentTarget.style.borderColor = 'transparent'
            }
          }}
          onFocus={e => {
            e.currentTarget.style.borderColor = BLUE
            e.currentTarget.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(18,112,183,0.04)'
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(18,112,183,0.08)'
          }}
          onBlur={e => {
            e.currentTarget.style.borderColor = 'transparent'
            e.currentTarget.style.background = meshInputBg
            e.currentTarget.style.boxShadow = 'none'
          }}
          required={required}
        >
          {options.map(o => (
            <option key={optValue(o)} value={optValue(o)}>{optLabel(o)}</option>
          ))}
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
