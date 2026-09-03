import { api } from '@/lib/api'
import { mapDuracionFrontToBack, mapDiaFrontToBack } from './mapper'

export interface BackendRutinaEjercicio {
  id_rutina_ejercicio: string
  id_ejercicio: string
  dia_semana: string
  series: number | null
  repeticiones_min: number | null
  repeticiones_max: number | null
  descanso: number | null
  observaciones: string | null
  orden: number
  ejercicio?: { nombre: string; grupos_musculares: string[] }
}

export interface BackendRutina {
  id_rutina: string
  id_usuario: string
  id_valoracion: string | null
  nombre: string
  duracion: string | null
  nivel: string | null
  observaciones: string | null
  fecha_creacion: string
  fecha_modificacion: string
  ejercicios?: BackendRutinaEjercicio[]
}

export interface FrontendRutina {
  id: string
  nombre: string
  duracion: string
  nivel: string
  observaciones: string
  ejercicios: FrontendRutinaEjercicio[]
}

export interface FrontendRutinaEjercicio {
  id_ejercicio: string
  nombre: string
  dia_semana: string
  series: number
  repeticiones_min: number
  repeticiones_max: number
  descanso: number
  observaciones: string
  grupos_musculares: string[]
}

function mapBackendToFrontend(r: BackendRutina): FrontendRutina {
  return {
    id: r.id_rutina,
    nombre: r.nombre,
    duracion: r.duracion ?? '',
    nivel: r.nivel ?? '',
    observaciones: r.observaciones ?? '',
    ejercicios: (r.ejercicios ?? []).map(e => ({
      id_ejercicio: e.id_ejercicio,
      nombre: e.ejercicio?.nombre ?? '',
      dia_semana: e.dia_semana,
      series: e.series ?? 3,
      repeticiones_min: e.repeticiones_min ?? 10,
      repeticiones_max: e.repeticiones_max ?? 12,
      descanso: e.descanso ?? 60,
      observaciones: e.observaciones ?? '',
      grupos_musculares: e.ejercicio?.grupos_musculares ?? [],
    })),
  }
}

export async function getRutinasPorUsuario(idUsuario: string): Promise<FrontendRutina[]> {
  const { data } = await api.get<BackendRutina[]>(`/rutinas/usuario/${idUsuario}`)
  return data.map(mapBackendToFrontend)
}

export async function getRutinaPorId(id: string): Promise<FrontendRutina> {
  const { data } = await api.get<BackendRutina>(`/rutinas/${id}`)
  return mapBackendToFrontend(data)
}

export interface CrearRutinaPayload {
  id_usuario: string
  nombre: string
  duracion?: string
  nivel?: string
  observaciones?: string
  ejercicios: {
    id_ejercicio: string
    dia_semana: string
    series?: number
    repeticiones_min?: number
    repeticiones_max?: number
    descanso?: number
    observaciones?: string
  }[]
}

export async function crearRutina(data: {
  id_usuario: string
  nombre: string
  duracion: string
  nivel: string
  observaciones: string
  ejercicios: {
    id_ejercicio: string
    dia: string
    series: number
    reps: string
    rest: number
  }[]
}) {
  const payload: CrearRutinaPayload = {
    id_usuario: data.id_usuario,
    nombre: data.nombre,
    duracion: mapDuracionFrontToBack(data.duracion) || undefined,
    nivel: data.nivel || undefined,
    observaciones: data.observaciones || undefined,
    ejercicios: data.ejercicios.map(e => {
      const reps = e.reps.split('-').map(Number)
      return {
        id_ejercicio: e.id_ejercicio,
        dia_semana: mapDiaFrontToBack(e.dia),
        series: e.series,
        repeticiones_min: reps[0] || 10,
        repeticiones_max: reps[1] || reps[0] || 12,
        descanso: e.rest,
      }
    }),
  }

  const { data: result } = await api.post('/rutinas', payload)
  return result
}

export async function editarRutina(id: string, data: Partial<CrearRutinaPayload>) {
  const { data: result } = await api.put(`/rutinas/${id}`, data)
  return result
}
