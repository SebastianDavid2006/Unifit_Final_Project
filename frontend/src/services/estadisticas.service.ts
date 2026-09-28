import { api } from '@/lib/api'

export interface EstadisticasCarrera {
  programa: string
  universidad: 'uni_colombia' | 'uni_bogota'
  tipo_programa: 'especializacion' | 'tecnico' | 'profesional'
  registrados: number
  asistencias: number
}

export interface EstadisticasDTO {
  usuarios: { total: number; activos: number; inactivos: number; pendientes: number }
  usuarios_por_sexo: { genero: 'masculino' | 'femenino' | 'otro'; total: number }[]
  usuarios_por_tipo: { tipo: 'estudiante' | 'egresado' | 'docente' | 'administrativo'; total: number }[]
  usuarios_por_mes: { fecha: string; total: number; acumulado: number }[]
  carreras: EstadisticasCarrera[]
  asistencias: { periodo: number; por_mes: { fecha: string; total: number }[] }
  citas: { programadas: number }
}

// Fuente única de etiquetas y colores de los dashboards/estadísticas
export const UNIVERSIDADES: Record<EstadisticasCarrera['universidad'], string> = {
  uni_colombia: 'Universitaria de Colombia',
  uni_bogota: 'Universitaria de Bogotá',
}

const ABREV_CARRERA: Record<string, string> = {
  Administración: 'Adm.',
  Ingeniería: 'Ing.',
  Tecnología: 'Tec.',
  Entrenamiento: 'Entr.',
}

export function labelCarreraCorta(nombre: string): string {
  return nombre
    .split(' ')
    .map((palabra) => ABREV_CARRERA[palabra] ?? palabra)
    .join(' ')
}

export const CARD_COLORS = ['#1270B7', '#BF5AF2', '#30D158', '#F1C827']

export async function obtenerEstadisticas(desde?: Date, hasta?: Date): Promise<EstadisticasDTO> {
  const params = new URLSearchParams()
  if (desde) params.set('fecha_inicio', desde.toISOString())
  if (hasta) params.set('fecha_fin', hasta.toISOString())
  const { data } = await api.get<EstadisticasDTO>(`/estadisticas${params.toString() ? `?${params}` : ''}`)
  return data
}