import { useState, useEffect, useCallback } from 'react'
import { listarCargos, listarAreas } from '@/services/catalogo.service'
import type { Cargo, Area } from '@/types/catalogo'

export function useCatalogoStaff() {
  const [cargos, setCargos] = useState<Cargo[]>([])
  const [areas, setAreas] = useState<Area[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    let vigente = true
    setLoading(true)
    setError(false)
    Promise.all([listarCargos(), listarAreas()])
      .then(([c, a]) => {
        if (!vigente) return
        setCargos(c.filter(x => x.activo))
        setAreas(a.filter(x => x.activo))
      })
      .catch(() => {
        if (!vigente) return
        setCargos([])
        setAreas([])
        setError(true)
      })
      .finally(() => { if (vigente) setLoading(false) })
    return () => { vigente = false }
  }, [intento])

  const reintentar = useCallback(() => setIntento(n => n + 1), [])

  return { cargos, areas, loading, error, reintentar }
}
