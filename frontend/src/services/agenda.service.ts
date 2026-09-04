import { api } from '@/lib/api'

export interface BackendAgenda {
  id_agenda: string
  id_usuario: string
  id_creador: string
  id_cupo: string | null
  fecha: string
  hora_inicio: string
  hora_fin: string | null
  tipo: 'valoracion' | 'registro' | 'seguimiento' | 'otro'
  tipo_otro: string | null
  estado: 'pendiente' | 'completado' | 'cancelado' | 'no_asistio'
  observaciones: string | null
  fecha_creacion: string
  fecha_modificacion: string
  usuario?: {
    id_usuario: string
    primer_nombre: string
    primer_apellido: string
    documento: string
  }
  creador?: {
    id_usuario: string
    primer_nombre: string
    primer_apellido: string
  }
  cupo?: {
    id_cupo: string
    hora_inicio: string
    hora_fin: string
  } | null
}

export interface BackendCupo {
  id_cupo: string
  id_creador: string
  fecha: string
  hora_inicio: string
  hora_fin: string
  creador?: {
    id_usuario: string
    primer_nombre: string
    primer_apellido: string
  }
}

export interface FrontendAgenda {
  id: string
  id_usuario: string
  fecha: string
  horaInicio: string
  horaFin: string
  tipo: BackendAgenda['tipo']
  tipoOtro: string
  estado: BackendAgenda['estado']
  observaciones: string
  estudiante: string
  creador: string
}

export interface FrontendCupo {
  id: string
  fecha: string
  horaInicio: string
  horaFin: string
}

function normFecha(v: string): string {
  return v.slice(0, 10)
}

function mapAgendaBackToFront(a: BackendAgenda): FrontendAgenda {
  const estudiante = a.usuario
    ? `${a.usuario.primer_nombre} ${a.usuario.primer_apellido}`.trim()
    : ''
  const creador = a.creador
    ? `${a.creador.primer_nombre} ${a.creador.primer_apellido}`.trim()
    : ''
  return {
    id: a.id_agenda,
    id_usuario: a.id_usuario,
    fecha: normFecha(a.fecha),
    horaInicio: a.hora_inicio,
    horaFin: a.hora_fin ?? '',
    tipo: a.tipo,
    tipoOtro: a.tipo_otro ?? '',
    estado: a.estado,
    observaciones: a.observaciones ?? '',
    estudiante,
    creador,
  }
}

function mapCupoBackToFront(c: BackendCupo): FrontendCupo {
  return {
    id: c.id_cupo,
    fecha: normFecha(c.fecha),
    horaInicio: c.hora_inicio,
    horaFin: c.hora_fin,
  }
}

export async function getAgenda(): Promise<FrontendAgenda[]> {
  const { data } = await api.get<BackendAgenda[]>('/agenda')
  return data.map(mapAgendaBackToFront)
}

export async function getMiAgenda(): Promise<FrontendAgenda[]> {
  const { data } = await api.get<BackendAgenda[]>('/agenda/mis-citas')
  return data.map(mapAgendaBackToFront)
}

export async function getAgendaPorId(id: string): Promise<FrontendAgenda> {
  const { data } = await api.get<BackendAgenda>(`/agenda/${id}`)
  return mapAgendaBackToFront(data)
}

export interface CrearAgendaPayload {
  id_usuario: string
  fecha: string
  hora_inicio: string
  hora_fin?: string
  tipo: 'valoracion' | 'registro' | 'seguimiento' | 'otro'
  tipo_otro?: string
  observaciones?: string
}

export async function crearAgenda(payload: CrearAgendaPayload): Promise<FrontendAgenda> {
  const { data } = await api.post<BackendAgenda>('/agenda', payload)
  return mapAgendaBackToFront(data)
}

export async function editarAgenda(id: string, payload: Partial<CrearAgendaPayload>): Promise<FrontendAgenda> {
  const { data } = await api.put<BackendAgenda>(`/agenda/${id}`, payload)
  return mapAgendaBackToFront(data)
}

export async function cambiarEstadoAgenda(id: string, estado: FrontendAgenda['estado']): Promise<FrontendAgenda> {
  const { data } = await api.put<BackendAgenda>(`/agenda/${id}/estado`, { estado })
  return mapAgendaBackToFront(data)
}

export async function eliminarAgenda(id: string) {
  const { data } = await api.delete(`/agenda/${id}`)
  return data
}

export type DiaPublicacion = 'dom' | 'lun' | 'mar' | 'mié' | 'jue' | 'vie' | 'sáb'

export interface RangoPublicacion {
  inicio: string
  fin: string
}

export interface HorarioPorDia {
  dia: DiaPublicacion
  rangos: RangoPublicacion[]
}

export interface PublicarCuposPayload {
  fecha_inicio: string
  fecha_fin: string
  horarios_por_dia: HorarioPorDia[]
}

export async function publicarCupos(payload: PublicarCuposPayload) {
  const { data } = await api.post<{ count: number }>('/cupos/publicar', payload)
  return data
}

export async function getCuposDisponibles(): Promise<FrontendCupo[]> {
  const { data } = await api.get<BackendCupo[]>('/cupos/disponibles')
  return data.map(mapCupoBackToFront)
}

export async function reservarCupo(idCupo: string): Promise<FrontendAgenda> {
  const { data } = await api.post<BackendAgenda>(`/cupos/${idCupo}/reservar`)
  return mapAgendaBackToFront(data)
}
