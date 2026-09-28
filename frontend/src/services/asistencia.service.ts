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

export async function getMiHistorial(
  page = 1,
  pageSize = 20
): Promise<PaginatedAsistencia> {
  const res = await api.get<PaginatedAsistencia>('/asistencia/usuario/me', {
    params: { page, pageSize },
  })
  return res.data
}