import type { ReactNode } from 'react'

export default function DetailCard({ gridColumn, gridRow, accent, title, model, children }: {
  gridColumn: string
  gridRow: string
  accent: string
  title: string
  model?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="rounded-[28px] p-5 transition-transform duration-200 hover:scale-[1.02]" style={{ gridColumn, gridRow, background: 'rgba(255,255,255,0.5)' }}>
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: `${accent}30` }} />
        {model && <div className="w-8 h-8 flex-shrink-0">{model}</div>}
        <p className="text-lg font-extrabold capitalize" style={{ color: '#0D1B2A' }}>{title}</p>
      </div>
      {children}
    </div>
  )
}
