import { useState, useEffect } from 'react'
import { listarCargos, listarAreas } from '@/services/catalogo.service'
import type { Cargo, Area } from '@/types/catalogo'

export function useCatalogoStaff() {
  const [cargos, setCargos] = useState<Cargo[]>([])
  const [areas, setAreas] = useState<Area[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([listarCargos(), listarAreas()])
      .then(([c, a]) => {
        setCargos(c.filter(x => x.activo))
        setAreas(a.filter(x => x.activo))
      })
      .catch(() => {
        setCargos([])
        setAreas([])
      })
      .finally(() => setLoading(false))
  }, [])

  return { cargos, areas, loading }
}