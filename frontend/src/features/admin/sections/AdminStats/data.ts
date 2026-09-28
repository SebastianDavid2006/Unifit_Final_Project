import { UNIVERSIDADES, type EstadisticasCarrera } from '@/services/estadisticas.service'

export const BLUE = '#1270B7'
export const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #1A8CDB, #0D5F9E)'

export const CAT_COLORS: Record<string, string> = {
  'Técnico': '#1270B7',
  'Profesional': '#30D158',
  'Especialización': '#BF5AF2',
}

export const NIVEL_OPTIONS = ['Técnico', 'Profesional', 'Especialización']

export const normalizeNivel = (tipo: string) =>
  tipo === 'tecnico' ? 'Técnico' : tipo === 'profesional' ? 'Profesional' : 'Especialización'

export const MESES_CORTOS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

export function mesCorto(fecha: string): string {
  const [anio, mes] = fecha.split('-').map(Number)
  if (!anio || !mes) return fecha
  return `${MESES_CORTOS[mes - 1] ?? ''} ${anio}`
}

export type CareerRow = {
  programa: string
  universidadLabel: string
  cat: string
  registrados: number
  asistencias: number
}

export const mapCarrera = (c: EstadisticasCarrera): CareerRow => ({
  programa: c.programa,
  universidadLabel: UNIVERSIDADES[c.universidad],
  cat: normalizeNivel(c.tipo_programa),
  registrados: c.registrados,
  asistencias: c.asistencias,
})

export const emptyCareer: CareerRow = {
  programa: '—',
  universidadLabel: '—',
  cat: '—',
  registrados: 0,
  asistencias: 0,
}

export const CARGOS: Record<string, string> = {
  estudiante: 'Estudiante',
  egresado: 'Egresado',
  docente: 'Docente',
  administrativo: 'Administrativo',
}

export const SEXOS: Record<string, string> = {
  masculino: 'Masculino',
  femenino: 'Femenino',
  otro: 'Otro',
}

export const SEXO_COLORS: Record<string, string> = {
  Masculino: '#1270B7',
  Femenino: '#FF6B8A',
  Otro: '#BF5AF2',
}

export type FilterCategory = 'institucion' | 'nivel' | 'programa'

export const FILTER_LABELS: Record<FilterCategory, string> = {
  institucion: 'Institución',
  nivel: 'Nivel académico',
  programa: 'Programa',
}

export function filterOptions(carreras: CareerRow[]): Record<FilterCategory, string[]> {
  return {
    institucion: [...new Set(carreras.map(c => c.universidadLabel))],
    nivel: [...new Set(carreras.map(c => c.cat))],
    programa: [...new Set(carreras.map(c => c.programa))],
  }
}