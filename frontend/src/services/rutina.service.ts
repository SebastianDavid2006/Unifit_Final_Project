import { api } from '@/lib/api'
import { getImageUrl } from '@/lib/config'
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
  ejercicio?: {
    nombre: string
    url_multimedia?: string
    grupos_musculares: string[]
    maquinas?: { maquina: { id_maquina: string; nombre: string; url_multimedia?: string } }[]
  }
}

export type RutinaEstado = 'activa' | 'finalizada' | 'cancelada'

export interface BackendRutina {
  id_rutina: string
  id_usuario: string
  id_valoracion: string | null
  nombre: string
  duracion: string | null
  nivel: string | null
  estado: RutinaEstado
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
  estado: RutinaEstado
  observaciones: string
  fecha_creacion: string
  ejercicios: FrontendRutinaEjercicio[]
}

export interface FrontendRutinaMaquina {
  id: string
  nombre: string
  imageUrl: string
}

export interface FrontendRutinaEjercicio {
  id_rutina_ejercicio: string
  id_ejercicio: string
  nombre: string
  dia_semana: string
  series: number
  repeticiones_min: number
  repeticiones_max: number
  descanso: number
  observaciones: string
  urlMultimedia: string
  grupos_musculares: string[]
  maquinas: FrontendRutinaMaquina[]
}

function mapBackendToFrontend(r: BackendRutina): FrontendRutina {
  return {
    id: r.id_rutina,
    nombre: r.nombre,
    duracion: r.duracion ?? '',
    nivel: r.nivel ?? '',
    estado: r.estado,
    observaciones: r.observaciones ?? '',
    fecha_creacion: r.fecha_creacion,
    ejercicios: (r.ejercicios ?? []).map(e => ({
      id_rutina_ejercicio: e.id_rutina_ejercicio,
      id_ejercicio: e.id_ejercicio,
      nombre: e.ejercicio?.nombre ?? '',
      dia_semana: e.dia_semana,
      series: e.series ?? 3,
      repeticiones_min: e.repeticiones_min ?? 10,
      repeticiones_max: e.repeticiones_max ?? 12,
      descanso: e.descanso ?? 60,
      observaciones: e.observaciones ?? '',
      urlMultimedia: e.ejercicio?.url_multimedia ?? '',
      grupos_musculares: e.ejercicio?.grupos_musculares ?? [],
      maquinas: (e.ejercicio?.maquinas ?? []).map(m => ({
        id: m.maquina.id_maquina,
        nombre: m.maquina.nombre,
        imageUrl: getImageUrl(m.maquina.url_multimedia),
      })),
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
  id_valoracion: string
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
  id_valoracion: string
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
    id_valoracion: data.id_valoracion,
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

export type SesionEstado = 'en_progreso' | 'finalizada' | 'cancelada'

export interface BackendSesionRutina {
  id_sesion: string
  id_rutina: string
  estado: SesionEstado
  fecha: string
  hora_inicio: string | null
  hora_fin: string | null
  ejercicios_marcados: string[] | null
}

export interface FrontendSesionRutina {
  id: string
  idRutina: string
  estado: SesionEstado
  fecha: string
  horaInicio: string | null
  horaFin: string | null
  ejerciciosMarcados: string[]
}

function mapSesionBackendToFrontend(s: BackendSesionRutina): FrontendSesionRutina {
  return {
    id: s.id_sesion,
    idRutina: s.id_rutina,
    estado: s.estado,
    fecha: s.fecha,
    horaInicio: s.hora_inicio,
    horaFin: s.hora_fin,
    ejerciciosMarcados: s.ejercicios_marcados ?? [],
  }
}

export async function getSesionesDeRutina(idRutina: string): Promise<FrontendSesionRutina[]> {
  const { data } = await api.get<BackendSesionRutina[]>(`/rutinas/${idRutina}/sesiones`)
  return data.map(mapSesionBackendToFrontend)
}

export async function iniciarSesion(idRutina: string): Promise<FrontendSesionRutina> {
  const { data } = await api.post<BackendSesionRutina>(`/rutinas/${idRutina}/sesiones`)
  return mapSesionBackendToFrontend(data)
}

export async function finalizarSesion(idSesion: string): Promise<FrontendSesionRutina> {
  const { data } = await api.put<BackendSesionRutina>(`/sesiones/${idSesion}/finalizar`)
  return mapSesionBackendToFrontend(data)
}

export async function marcarEjercicios(idSesion: string, ids: string[]): Promise<FrontendSesionRutina> {
  const { data } = await api.patch<BackendSesionRutina>(`/sesiones/${idSesion}/ejercicios`, { ejerciciosMarcados: ids })
  return mapSesionBackendToFrontend(data)
}

export async function cancelarSesion(idSesion: string): Promise<FrontendSesionRutina> {
  const { data } = await api.put<BackendSesionRutina>(`/sesiones/${idSesion}/cancelar`)
  return mapSesionBackendToFrontend(data)
}
