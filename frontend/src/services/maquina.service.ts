import { api } from '@/lib/api'
import { mapGrupoMuscularBackToFront, mapGrupoMuscularFrontToBack, mapNivelBackToFront, mapNivelFrontToBack } from './mapper'

export interface BackendMaquina {
  id_maquina: string
  id_creador: string
  nombre: string
  descripcion: string | null
  grupos_musculares: string[]
  nivel: string
  url_multimedia: string | null
  estado: string
  fecha_creacion: string
  fecha_modificacion: string
  ejercicios?: { id_ejercicio: string }[]
}

export interface FrontendMachine {
  id: string
  name: string
  zone: string
  status: 'active' | 'maintenance' | 'inactive'
  imageDataUrl?: string
  description: string
  muscleGroups: string[]
  recommendedLevel: 'principiante' | 'intermedio' | 'avanzado'
  observations: string
  exerciseIds: string[]
}

const ESTADO_MAP: Record<string, FrontendMachine['status']> = {
  disponible: 'active',
  mantenimiento: 'maintenance',
  sin_servicio: 'inactive',
}

const STATUS_MAP_REV: Record<string, string> = {
  active: 'disponible',
  maintenance: 'mantenimiento',
  inactive: 'sin_servicio',
}

function mapBackendToFrontend(m: BackendMaquina): FrontendMachine {
  return {
    id: m.id_maquina,
    name: m.nombre,
    zone: m.grupos_musculares.length > 0 ? mapGrupoMuscularBackToFront(m.grupos_musculares[0]) : 'General',
    status: ESTADO_MAP[m.estado] ?? 'active',
    imageDataUrl: m.url_multimedia ?? undefined,
    description: m.descripcion ?? '',
    muscleGroups: m.grupos_musculares.map(mapGrupoMuscularBackToFront),
    recommendedLevel: mapNivelBackToFront(m.nivel).toLowerCase() as 'principiante' | 'intermedio' | 'avanzado',
    observations: '',
    exerciseIds: m.ejercicios?.map(e => e.id_ejercicio) ?? [],
  }
}

function mapFrontendToBackend(m: Partial<FrontendMachine>): {
  nombre?: string
  descripcion?: string
  grupos_musculares?: string[]
  nivel?: string
  url_multimedia?: string
  ejercicioIds?: string[]
} {
  const data: Record<string, unknown> = {}
  if (m.name !== undefined) data.nombre = m.name
  if (m.description !== undefined) data.descripcion = m.description
  if (m.muscleGroups !== undefined) data.grupos_musculares = m.muscleGroups.map(mapGrupoMuscularFrontToBack)
  if (m.recommendedLevel !== undefined) data.nivel = mapNivelFrontToBack(m.recommendedLevel)
  if (m.imageDataUrl !== undefined) data.url_multimedia = m.imageDataUrl || null
  if (m.exerciseIds !== undefined) data.ejercicioIds = m.exerciseIds
  return data
}

export async function getMaquinas(): Promise<FrontendMachine[]> {
  const { data } = await api.get<BackendMaquina[]>('/maquinas')
  return data.map(mapBackendToFrontend)
}

export async function getMaquinaPorId(id: string): Promise<FrontendMachine> {
  const { data } = await api.get<BackendMaquina>(`/maquinas/${id}`)
  return mapBackendToFrontend(data)
}

export async function crearMaquina(machine: Omit<FrontendMachine, 'id'>): Promise<FrontendMachine> {
  const payload = mapFrontendToBackend(machine)
  const { data } = await api.post<BackendMaquina>('/maquinas', payload)
  return mapBackendToFrontend(data)
}

export async function editarMaquina(id: string, machine: Partial<FrontendMachine>): Promise<FrontendMachine> {
  const payload = mapFrontendToBackend(machine)
  const { data } = await api.put<BackendMaquina>(`/maquinas/${id}`, payload)
  return mapBackendToFrontend(data)
}

export async function desactivarMaquina(id: string): Promise<void> {
  await api.put(`/maquinas/${id}/desactivar`)
}
