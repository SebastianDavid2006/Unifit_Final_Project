export interface MetricasActuales {
  peso: number | null
  estatura: number | null
  imc: number | null
}

interface CurrentMetricsCardProps {
  /** Medidas de la valoración actual (la más reciente); null si no hay ninguna. */
  metricas: MetricasActuales | null
  cargando?: boolean
  onVerValoracion?: () => void
  className?: string
}

const fmt = (v: number | null, unidad = '') => (v == null || Number.isNaN(v) ? '—' : `${v}${unidad}`)

export function CurrentMetricsCard({ metricas, cargando = false, onVerValoracion, className = '' }: CurrentMetricsCardProps) {
  const items = metricas
    ? [
        { label: 'Peso', value: fmt(metricas.peso, ' kg') },
        { label: 'Estatura', value: fmt(metricas.estatura, ' cm') },
        { label: 'IMC', value: fmt(metricas.imc) },
      ]
    : null

  return (
    <div className={`rounded-[28px] p-4 cursor-default ${className}`} style={{ background: 'rgba(255,255,255,0.5)', height: '100%' }}>
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: 'rgba(230,57,70,0.3)' }} />
        <p className="text-lg font-extrabold capitalize" style={{ color: '#0D1B2A' }}>Métricas actuales</p>
      </div>
      {items ? (
        <>
          <div className="grid grid-cols-3 gap-2">
            {items.map(m => (
              <div key={m.label} className="rounded-xl p-3 text-center" style={{ background: 'rgba(0,0,0,0.02)' }}>
                <p className="text-base font-extrabold" style={{ color: '#0D1B2A' }}>{m.value}</p>
                <p className="text-[10px] font-semibold mt-0.5" style={{ color: 'rgba(0,0,0,0.35)' }}>{m.label}</p>
              </div>
            ))}
          </div>
          {onVerValoracion && (
            <button
              type="button"
              onClick={onVerValoracion}
              className="mt-3 w-full rounded-xl px-3 py-2 text-xs font-bold cursor-pointer transition-all hover:brightness-110 active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #1270B7, #7ec8e3)', color: '#FFFFFF' }}
            >
              Ver valoración
            </button>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center rounded-xl p-6" style={{ background: 'rgba(0,0,0,0.02)' }}>
          <p className="text-xs font-medium text-center" style={{ color: 'rgba(0,0,0,0.45)' }}>
            {cargando
              ? 'Cargando valoración…'
              : 'Esta persona aún no tiene una valoración registrada. Indícale que debe acercarse para realizar su primera valoración.'}
          </p>
        </div>
      )}
    </div>
  )
}
