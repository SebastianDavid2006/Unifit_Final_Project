import { useEffect, useState } from 'react'
import { obtenerEstadisticas, type EstadisticasDTO } from '@/services/estadisticas.service'

interface Estado {
  stats: EstadisticasDTO | null
  loading: boolean
  error: boolean
}

export function useDashboardStats(desde?: Date, hasta?: Date): Estado {
  const [estado, setEstado] = useState<Estado>({ stats: null, loading: true, error: false })

  useEffect(() => {
    let activo = true
    setEstado({ stats: null, loading: true, error: false })
    obtenerEstadisticas(desde, hasta)
      .then((stats) => {
        if (activo) setEstado({ stats, loading: false, error: false })
      })
      .catch(() => {
        if (activo) setEstado({ stats: null, loading: false, error: true })
      })
    return () => {
      activo = false
    }
  }, [desde, hasta])

  return estado
}