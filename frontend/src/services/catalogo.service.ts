import { api } from '@/lib/api'
import type { Programa, Cargo, Area } from '@/types/catalogo'

export async function listarProgramas(): Promise<Programa[]> {
  const res = await api.get('/programas')
  return res.data
}

export async function listarCargos(): Promise<Cargo[]> {
  const res = await api.get('/cargos')
  return res.data
}

export async function listarAreas(): Promise<Area[]> {
  const res = await api.get('/areas')
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

export async function actualizarArea(id: string, nombre: string): Promise<Area> {
  const res = await api.put(`/areas/${id}`, { nombre })
  return res.data
}

export async function actualizarCargo(id: string, nombre: string): Promise<Cargo> {
  const res = await api.put(`/cargos/${id}`, { nombre })
  return res.data
}

export async function eliminarArea(id: string): Promise<void> {
  await api.delete(`/areas/${id}`)
}

export async function eliminarCargo(id: string): Promise<void> {
  await api.delete(`/cargos/${id}`)
}