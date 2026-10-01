import { RefreshCw } from 'lucide-react'

interface AvisoCatalogoProps {
  mensaje: string
  onReintentar?: () => void
  /** Fondo oscuro (registro público) o claro (modales del panel). */
  oscuro?: boolean
}

/** Aviso cuando un catálogo (cargos, áreas, carreras) no cargó o no tiene opciones. */
export function AvisoCatalogo({ mensaje, onReintentar, oscuro = false }: AvisoCatalogoProps) {
  return (
    <div
      role="alert"
      className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl"
      style={{ background: 'rgba(244,56,67,0.10)', border: '1px solid rgba(244,56,67,0.35)' }}
    >
      <span className="text-[11px] font-semibold" style={{ color: oscuro ? '#FF8A90' : '#C62833' }}>{mensaje}</span>
      {onReintentar && (
        <button
          type="button"
          onClick={onReintentar}
          className="flex items-center gap-1 text-[11px] font-bold cursor-pointer flex-shrink-0"
          style={{ color: oscuro ? '#fff' : '#1A1A1E' }}
        >
          <RefreshCw size={12} />
          Reintentar
        </button>
      )}
    </div>
  )
}
