import { RotateCcw } from 'lucide-react'
import editActionGif from '@/assets/icons/animated/actions/edit.gif'
import trashActionGif from '@/assets/icons/animated/actions/trash.gif'
import inactiveActionGif from '@/assets/icons/animated/actions/inactive.gif'

export type RowActionState = 'reactivate' | 'inactivate' | 'delete'

export default function RowActions({ state, onReactivate, onInactivate, onDelete, onEdit, reactivateTitle, inactivateTitle, deleteTitle, editTitle }: {
  state: RowActionState
  onReactivate: () => void
  onInactivate: () => void
  onDelete: () => void
  onEdit: () => void
  reactivateTitle?: string
  inactivateTitle?: string
  deleteTitle?: string
  editTitle?: string
}) {
  return (
    <div className="flex items-center gap-1 justify-end">
      {state === 'reactivate' ? (
        <button onClick={onReactivate} title={reactivateTitle ?? 'Reactivar'} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer hover:bg-[#30D158]/10 hover:scale-110 hover:shadow-[0_4px_14px_rgba(48,209,88,0.28)]" style={{ color: '#30D158', background: 'rgba(48,209,88,0.1)' }}>
          <RotateCcw size={13} />
        </button>
      ) : state === 'inactivate' ? (
        <button onClick={onInactivate} title={inactivateTitle ?? 'Inactivar'} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer hover:bg-[#F5A623]/10 hover:scale-110 hover:shadow-[0_4px_14px_rgba(245,166,35,0.28)]" style={{ background: 'rgba(245,166,35,0.1)' }}>
          <img src={inactiveActionGif} alt="Inactivar" className="w-4 h-4 object-contain" />
        </button>
      ) : (
        <button onClick={onDelete} title={deleteTitle ?? 'Eliminar'} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer hover:bg-[#F43843]/10 hover:scale-110 hover:shadow-[0_4px_14px_rgba(244,56,67,0.28)]" style={{ background: 'rgba(0,0,0,0.03)' }}>
          <img src={trashActionGif} alt="Eliminar" className="w-4 h-4 object-contain" />
        </button>
      )}
      <button onClick={onEdit} title={editTitle ?? 'Editar'} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer hover:bg-white hover:scale-110 hover:shadow-[0_4px_14px_rgba(18,112,183,0.28)]" style={{ background: 'rgba(0,0,0,0.03)' }}>
        <img src={editActionGif} alt="Editar" className="w-4 h-4 object-contain" />
      </button>
    </div>
  )
}
