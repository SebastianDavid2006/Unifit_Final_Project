import { api } from '@/lib/api'

export interface AsistenciaRecord {
  id_asistencia: string
  id_usuario: string
  fecha: string
  hora_ingreso: string
  hora_salida: string | null
  duracion_minutos: number | null
  observaciones: string | null
  usuario?: {
    id_usuario: string
    primer_nombre: string
    primer_apellido: string
    documento: string
    email_contacto: string
  }
}

export interface PaginatedAsistencia {
  total: number
  page: number
  pageSize: number
  totalPages: number
  asistencias: AsistenciaRecord[]
}

export interface ResumenDia {
  dia: string
  asistentes: number
  duracion_promedio: number
}

export interface EvolucionPunto {
  fecha: string
  usuarios: number
  duracion_promedio: number
}

export async function getHistorialUsuario(
  idUsuario: string,
  page = 1,
  pageSize = 20
): Promise<PaginatedAsistencia> {
  const res = await api.get<PaginatedAsistencia>(`/asistencia/usuario/${idUsuario}`, {
    params: { page, pageSize },
  })
  return res.data
}

export async function getMiHistorial(
  page = 1,
  pageSize = 20
): Promise<PaginatedAsistencia> {
  const res = await api.get<PaginatedAsistencia>('/asistencia/usuario/me', {
    params: { page, pageSize },
  })
  return res.data
}

export async function getResumenSemana(
  fechaInicio: Date,
  fechaFin: Date
): Promise<ResumenDia[]> {
  const res = await api.get<ResumenDia[]>('/asistencia/resumen/semana', {
    params: {
      fecha_inicio: fechaInicio.toISOString(),
      fecha_fin: fechaFin.toISOString(),
    },
  })
  return res.data
}

export async function getEvolucion(
  fechaInicio: Date,
  fechaFin: Date,
  agrupacion: 'dia' | 'semana' | 'mes' = 'dia'
): Promise<EvolucionPunto[]> {
  const res = await api.get<EvolucionPunto[]>('/asistencia/evolucion', {
    params: {
      fecha_inicio: fechaInicio.toISOString(),
      fecha_fin: fechaFin.toISOString(),
      agrupacion,
    },
  })
  return res.data
}