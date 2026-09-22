import { api } from '@/lib/api'
import { getImageUrl } from '@/lib/config'
import { mapGrupoMuscularFrontToBack, mapGrupoMuscularBackToFront, mapNivelFrontToBack, mapNivelBackToFront } from './mapper'

export interface BackendEjercicio {
  id_ejercicio: string
  id_creador: string
  nombre: string
  descripcion: string | null
  grupos_musculares: string[]
  nivel: string
  url_multimedia: string
  activo: boolean
  fecha_creacion: string
  fecha_modificacion: string
}

export interface FrontendExercise {
  id: string
  name: string
  zone: string
  description: string
  status: 'active' | 'maintenance' | 'inactive'
  muscleGroups: string[]
  recommendedLevel: 'principiante' | 'intermedio' | 'avanzado'
  imageUrl: string
  videoUrl: string
  fecha_creacion: string
}

export interface CrearEjercicioData extends Omit<FrontendExercise, 'id' | 'fecha_creacion'> {
  imageFile?: File | null
}

function mapBackendToFrontend(ej: BackendEjercicio): FrontendExercise {
  return {
    id: ej.id_ejercicio,
    name: ej.nombre,
    zone: ej.grupos_musculares.length > 0 ? mapGrupoMuscularBackToFront(ej.grupos_musculares[0]) : 'General',
    description: ej.descripcion ?? '',
    status: ej.activo ? 'active' : 'inactive',
    muscleGroups: ej.grupos_musculares.map(mapGrupoMuscularBackToFront),
    recommendedLevel: mapNivelBackToFront(ej.nivel).toLowerCase() as 'principiante' | 'intermedio' | 'avanzado',
    imageUrl: getImageUrl(ej.url_multimedia),
    videoUrl: '',
    fecha_creacion: ej.fecha_creacion,
  }
}

function mapFrontendToBackend(ex: Partial<FrontendExercise>): {
  nombre?: string
  descripcion?: string
  grupos_musculares?: string[]
  nivel?: string
  url_multimedia?: string
} {
  const data: Record<string, unknown> = {}
  if (ex.name !== undefined) data.nombre = ex.name
  if (ex.description !== undefined) data.descripcion = ex.description
  if (ex.muscleGroups !== undefined) data.grupos_musculares = ex.muscleGroups.map(mapGrupoMuscularFrontToBack)
  if (ex.recommendedLevel !== undefined) data.nivel = mapNivelFrontToBack(ex.recommendedLevel)
  if (ex.imageUrl !== undefined) data.url_multimedia = ex.imageUrl || ''
  return data
}

export async function getEjercicios(): Promise<FrontendExercise[]> {
  const { data } = await api.get<BackendEjercicio[]>('/ejercicios')
  return data.map(mapBackendToFrontend)
}

export async function getEjercicioPorId(id: string): Promise<FrontendExercise> {
  const { data } = await api.get<BackendEjercicio>(`/ejercicios/${id}`)
  return mapBackendToFrontend(data)
}

export async function crearEjercicio(exercise: CrearEjercicioData): Promise<FrontendExercise> {
  const formData = new FormData()
  formData.append('nombre', exercise.name)
  if (exercise.description) formData.append('descripcion', exercise.description)
  if (exercise.muscleGroups?.length) {
    const mappedGroups = exercise.muscleGroups.map(mapGrupoMuscularFrontToBack)
    formData.append('grupos_musculares', JSON.stringify(mappedGroups))
  }
  if (exercise.recommendedLevel) formData.append('nivel', exercise.recommendedLevel)
  if (exercise.imageFile) formData.append('media', exercise.imageFile)

  const { data } = await api.post<BackendEjercicio>('/ejercicios', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return mapBackendToFrontend(data)
}

export async function editarEjercicio(id: string, exercise: Partial<FrontendExercise>): Promise<FrontendExercise> {
  const payload = mapFrontendToBackend(exercise)
  const { data } = await api.put<BackendEjercicio>(`/ejercicios/${id}`, payload)
  return mapBackendToFrontend(data)
}

export async function desactivarEjercicio(id: string): Promise<void> {
  await api.put(`/ejercicios/${id}/desactivar`)
}
