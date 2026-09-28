import { api } from '@/lib/api'
import type { Programa, Cargo, Area } from '@/types/catalogo'

export async function listarProgramas(incluirInactivos = false): Promise<Programa[]> {
  const res = await api.get('/programas', { params: incluirInactivos ? { incluirInactivos: true } : undefined })
  return res.data
}

export async function crearPrograma(data: {
  nombre: string
  universidad: string
  tipo_programa: string
}): Promise<Programa> {
  const res = await api.post('/programas', data)
  return res.data
}

export async function actualizarPrograma(
  id: string,
  data: { nombre?: string; universidad?: string; tipo_programa?: string; activo?: boolean },
): Promise<Programa> {
  const res = await api.put(`/programas/${id}`, data)
  return res.data
}

export async function listarCargos(incluirInactivos = false): Promise<Cargo[]> {
  const res = await api.get('/cargos', { params: incluirInactivos ? { incluirInactivos: true } : undefined })
  return res.data
}

export async function listarAreas(incluirInactivos = false): Promise<Area[]> {
  const res = await api.get('/areas', { params: incluirInactivos ? { incluirInactivos: true } : undefined })
  return res.data
}

export async function crearArea(nombre: string): Promise<Area> {
  const res = await api.post('/areas', { nombre })
  return res.data
}

export async function crearCargo(nombre: string): Promise<Cargo> {
  const res = await api.post('/cargos', { nombre })
  return res.data
}

export async function actualizarArea(id: string, data: { nombre?: string; activo?: boolean }): Promise<Area> {
  const res = await api.put(`/areas/${id}`, data)
  return res.data
}

export async function actualizarCargo(id: string, data: { nombre?: string; activo?: boolean }): Promise<Cargo> {
  const res = await api.put(`/cargos/${id}`, data)
  return res.data
}