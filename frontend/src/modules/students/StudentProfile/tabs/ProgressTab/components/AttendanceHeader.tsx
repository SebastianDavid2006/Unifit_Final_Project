import { Calendar } from 'lucide-react'

interface AttendanceHeaderProps {
  vistaCalendario: 'semana' | 'mes' | 'año'
  setVistaCalendario: (v: 'semana' | 'mes' | 'año') => void
  currentDate: Date
  prevPeriod: (vista: 'semana' | 'mes' | 'año', date: Date) => void
  nextPeriod: (vista: 'semana' | 'mes' | 'año', date: Date) => void
  formatWeekRange: (d: Date) => string
  monthNames: string[]
}

const RED_GRAD = 'linear-gradient(135deg, #FF6B6B, #E63946)'

export function AttendanceHeader({
  vistaCalendario,
  setVistaCalendario,
  currentDate,
  prevPeriod,
  nextPeriod,
  formatWeekRange,
  monthNames,
}: AttendanceHeaderProps) {
  return (
    <div className="rounded-2xl" style={{
      background: '#FFFFFF',
      border: '1px solid rgba(0,0,0,0.04)',
      borderRadius: 20,
      boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
      overflow: 'hidden',
    }}>
      <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="flex items-center gap-2 flex-1">
          <Calendar size={16} style={{ color: '#E63946' }} />
          <h3 className="text-[#0D1B2A] text-sm font-bold whitespace-nowrap">Historial de Entradas y Salidas</h3>
        </div>
        <div className="flex items-center gap-0.5 rounded-lg p-0.5 flex-shrink-0" style={{ background: 'rgba(0,0,0,0.04)' }}>
          {(['semana', 'mes', 'año'] as const).map(v => (
            <button
              key={v}
              onClick={() => setVistaCalendario(v)}
              className="px-3 py-1.5 rounded-md text-xs font-bold transition-all"
              style={{
                background: vistaCalendario === v ? RED_GRAD : 'transparent',
                color: vistaCalendario === v ? '#FFFFFF' : 'rgba(0,0,0,0.35)',
                boxShadow: vistaCalendario === v ? '0 2px 8px rgba(230,57,70,0.25)' : 'none',
              }}
            >
              {v === 'semana' ? 'Semana' : v === 'mes' ? 'Mes' : 'Año'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 flex-1 justify-end">
          <button
            onClick={() => prevPeriod(vistaCalendario, currentDate)}
            onMouseEnter={e => { e.currentTarget.style.background = RED_GRAD; e.currentTarget.style.color = '#FFFFFF' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = 'rgba(0,0,0,0.3)' }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold transition-all flex-shrink-0"
            style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.3)' }}
          >‹</button>
          <span className="text-sm font-bold px-1 text-center min-w-[160px]" style={{ color: '#0D1B2A' }}>
            {vistaCalendario === 'semana'
              ? formatWeekRange(currentDate)
              : vistaCalendario === 'mes'
                ? `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                : `${currentDate.getFullYear()}`}
          </span>
          <button
            onClick={() => nextPeriod(vistaCalendario, currentDate)}
            onMouseEnter={e => { e.currentTarget.style.background = RED_GRAD; e.currentTarget.style.color = '#FFFFFF' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = 'rgba(0,0,0,0.3)' }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold transition-all flex-shrink-0"
            style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.3)' }}
          >›</button>
        </div>
      </div>
    </div>
  )
}
