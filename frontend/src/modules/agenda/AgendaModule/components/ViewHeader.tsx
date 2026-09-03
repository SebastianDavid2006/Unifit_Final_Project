import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react'
import { BLUE_GRAD } from '../../AgendaData'

interface ViewHeaderProps {
  viewMode: 'day' | 'week' | 'month' | 'year'
  onViewModeChange: (v: 'day' | 'week' | 'month' | 'year') => void
  viewTitle: string
  onPrev: () => void
  onNext: () => void
  isExpanded: boolean
  onToggleExpand: () => void
  shrink?: boolean
}

export function ViewHeader({ viewMode, onViewModeChange, viewTitle, onPrev, onNext, isExpanded, onToggleExpand, shrink }: ViewHeaderProps) {
  return (
    <div className={`flex items-center justify-center gap-3 py-3 px-4${shrink ? ' flex-shrink-0' : ''}`} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
      <button onClick={onPrev}
        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/[0.04] transition-colors"
      ><ChevronLeft size={16} style={{ color: 'rgba(0,0,0,0.3)' }} /></button>
      <h2 className="text-sm font-extrabold" style={{ color: '#1A1A1E', letterSpacing: '-0.03em' }}>{viewTitle}</h2>
      <button onClick={onNext}
        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/[0.04] transition-colors"
      ><ChevronRight size={16} style={{ color: 'rgba(0,0,0,0.3)' }} /></button>
      <div className="ml-auto flex items-center gap-1 p-0.5 rounded-lg" style={{ background: 'rgba(0,0,0,0.04)' }}>
        {(['week', 'month', 'year'] as const).map(mode => (
          <button key={mode} onClick={() => onViewModeChange(mode)}
            className="px-3 py-1 rounded-md text-[10px] font-bold transition-all"
            style={{ background: viewMode === mode ? BLUE_GRAD : 'transparent', color: viewMode === mode ? '#fff' : 'rgba(0,0,0,0.3)' }}
          >{mode === 'month' ? 'Mes' : mode === 'week' ? 'Semana' : 'Año'}</button>
        ))}
      </div>
      <button onClick={onToggleExpand}
        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/[0.04] transition-colors ml-2"
        style={{ color: 'rgba(0,0,0,0.3)' }}
      >{isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}</button>
    </div>
  )
}
