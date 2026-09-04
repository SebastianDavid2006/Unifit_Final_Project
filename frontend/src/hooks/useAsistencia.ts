import { useState, useEffect, useCallback } from 'react'
import { getHistorialUsuario, getResumenSemana, getEvolucion } from '@/services/asistencia.service'
import type { PaginatedAsistencia, ResumenDia, EvolucionPunto } from '@/services/asistencia.service'

export function useAsistenciaHistorial(idUsuario: string, page = 1, pageSize = 20) {
  const [data, setData] = useState<PaginatedAsistencia | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    if (!idUsuario) {
      setLoading(false)
      return
    }
    let active = true
    setLoading(true)
    getHistorialUsuario(idUsuario, page, pageSize)
      .then(res => { if (active) setData(res) })
      .catch(err => { if (active) setError(err) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [idUsuario, page, pageSize])

  return { data, loading, error }
}

export function useAsistenciaSemana(fechaInicio: Date | null, fechaFin: Date | null) {
  const [data, setData] = useState<ResumenDia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)

  const load = useCallback(() => {
    if (!fechaInicio || !fechaFin) {
      setLoading(false)
      return
    }
    let active = true
    setLoading(true)
    getResumenSemana(fechaInicio, fechaFin)
      .then(res => { if (active) setData(res) })
      .catch(err => { if (active) setError(err) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [fechaInicio, fechaFin])

  useEffect(() => {
    load()
  }, [load])

  return { data, loading, error, refresh: load }
}

export function useAsistenciaEvolucion(
  fechaInicio: Date | null,
  fechaFin: Date | null,
  agrupacion: 'dia' | 'semana' | 'mes' = 'mes'
) {
  const [data, setData] = useState<EvolucionPunto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)

  const load = useCallback(() => {
    if (!fechaInicio || !fechaFin) {
      setLoading(false)
      return
    }
    let active = true
    setLoading(true)
    getEvolucion(fechaInicio, fechaFin, agrupacion)
      .then(res => { if (active) setData(res) })
      .catch(err => { if (active) setError(err) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [fechaInicio, fechaFin, agrupacion])

  useEffect(() => {
    load()
  }, [load])

  return { data, loading, error, refresh: load }
}