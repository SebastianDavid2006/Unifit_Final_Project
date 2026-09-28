import { RotateCcw } from 'lucide-react'
import editActionGif from '@/assets/icons/animated/actions/edit.gif'
import inactiveActionGif from '@/assets/icons/animated/actions/inactive.gif'

export type RowActionState = 'reactivate' | 'inactivate'

export default function RowActions({ state, onReactivate, onInactivate, onEdit, reactivateTitle, inactivateTitle, editTitle }: {
  state: RowActionState
  onReactivate: () => void
  onInactivate: () => void
  onEdit: () => void
  reactivateTitle?: string
  inactivateTitle?: string
  editTitle?: string
}) {
  return (
    <div className="flex items-center gap-1 justify-end">
      {state === 'reactivate' ? (
        <button onClick={onReactivate} title={reactivateTitle ?? 'Reactivar'} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer hover:bg-[#30D158]/10 hover:scale-110 hover:shadow-[0_4px_14px_rgba(48,209,88,0.28)]" style={{ color: '#30D158', background: 'rgba(48,209,88,0.1)' }}>
          <RotateCcw size={13} />
        </button>
      ) : (
        <button onClick={onInactivate} title={inactivateTitle ?? 'Deshabilitar'} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer hover:bg-[#F5A623]/10 hover:scale-110 hover:shadow-[0_4px_14px_rgba(245,166,35,0.28)]" style={{ background: 'rgba(245,166,35,0.1)' }}>
          <img src={inactiveActionGif} alt="Deshabilitar" className="w-4 h-4 object-contain" />
        </button>
      )}
      <button onClick={onEdit} title={editTitle ?? 'Editar'} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer hover:bg-white hover:scale-110 hover:shadow-[0_4px_14px_rgba(18,112,183,0.28)]" style={{ background: 'rgba(0,0,0,0.03)' }}>
        <img src={editActionGif} alt="Editar" className="w-4 h-4 object-contain" />
      </button>
    </div>
  )
}