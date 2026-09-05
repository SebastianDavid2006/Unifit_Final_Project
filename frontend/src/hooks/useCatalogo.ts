import { useState, useEffect, useCallback } from 'react'
import {
  listarProgramas,
  crearPrograma,
  actualizarPrograma,
  eliminarPrograma,
} from '@/services/catalogo.service'
import type { Programa, Universidad, NivelPrograma } from '@/types/catalogo'
import { UNIVERSIDADES, NIVELES, UNIVERSIDAD_LABELS, NIVEL_LABELS } from '@/types/catalogo'

export interface ProgramaOpcion {
  id_programa: string
  nombre: string
}

export function useProgramasAgrupados() {
  const [programas, setProgramas] = useState<Programa[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    listarProgramas()
      .then(setProgramas)
      .catch(() => setProgramas([]))
      .finally(() => setLoading(false))
  }, [])

  const programasDe = useCallback((universidad: Universidad, nivel: NivelPrograma): Programa[] => {
    return programas.filter(p => p.universidad === universidad && p.tipo_programa === nivel)
  }, [programas])

  const nombres = useCallback((universidad: Universidad, nivel: NivelPrograma): string[] => {
    return programasDe(universidad, nivel).map(p => p.nombre)
  }, [programasDe])

  const resolverId = useCallback((universidad: Universidad, nivel: NivelPrograma, nombre: string): string | undefined => {
    return programasDe(universidad, nivel).find(p => p.nombre === nombre)?.id_programa
  }, [programasDe])

  return {
    programas,
    loading,
    universidades: UNIVERSIDADES,
    niveles: NIVELES,
    universidadLabel: (u: Universidad) => UNIVERSIDAD_LABELS[u],
    nivelLabel: (n: NivelPrograma) => NIVEL_LABELS[n],
    nombres,
    resolverId,
  }
}

export function useProgramas() {
  const [programas, setProgramas] = useState<Programa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)

  const fetchProgramas = useCallback(async () => {
    setLoading(true)
    try {
      const data = await listarProgramas()
      setProgramas(data)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProgramas()
  }, [fetchProgramas])

  const crear = useCallback(async (nombre: string, universidad: Universidad, tipo_programa: NivelPrograma) => {
    const creado = await crearPrograma({ nombre, universidad, tipo_programa })
    setProgramas(prev => [...prev, creado])
    return creado
  }, [])

  const actualizar = useCallback(async (id: string, data: { nombre?: string; universidad?: Universidad; tipo_programa?: NivelPrograma }) => {
    const actualizado = await actualizarPrograma(id, data)
    setProgramas(prev => prev.map(p => p.id_programa === id ? actualizado : p))
    return actualizado
  }, [])

  const eliminar = useCallback(async (id: string) => {
    await eliminarPrograma(id)
    setProgramas(prev => prev.filter(p => p.id_programa !== id))
  }, [])

  return { programas, loading, error, refresh: fetchProgramas, crear, actualizar, eliminar }
}