import { Search, X } from 'lucide-react'

export default function ListSearch({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 w-72" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)' }}>
      <Search size={14} style={{ color: 'rgba(0,0,0,0.3)' }} />
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="flex-1 bg-transparent text-[11px] font-semibold outline-none" style={{ color: '#1A1A1E' }} />
      {value && (
        <button onClick={() => onChange('')} className="flex-shrink-0 cursor-pointer" style={{ color: 'rgba(0,0,0,0.4)' }}>
          <X size={12} />
        </button>
      )}
    </div>
  )
}
