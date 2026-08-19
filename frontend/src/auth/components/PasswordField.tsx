import { useState } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'

interface PasswordFieldProps {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  autoComplete?: string
  className?: string
}

export function PasswordField({ value, onChange, placeholder = '••••••••', autoComplete, className = 'mb-4' }: PasswordFieldProps) {
  const [show, setShow] = useState(false)
  return (
    <div className={`flex items-center gap-3 px-5 rounded-2xl h-14 ${className}`} style={{
      background: 'rgba(255,255,255,0.08)',
      border: '1px solid rgba(255,255,255,0.12)',
    }}>
      <Lock size={18} style={{ color: 'rgba(255,255,255,0.45)' }} />
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-white/30"
      />
      <button type="button" onClick={() => setShow(!show)} className="flex items-center justify-center cursor-pointer">
        {show
          ? <EyeOff size={18} style={{ color: 'rgba(255,255,255,0.45)' }} />
          : <Eye size={18} style={{ color: 'rgba(255,255,255,0.45)' }} />}
      </button>
    </div>
  )
}
