export type Universidad = 'uni_colombia' | 'uni_bogota'
export type NivelPrograma = 'tecnico' | 'profesional' | 'especializacion'

export interface Programa {
  id_programa: string
  nombre: string
  universidad: Universidad
  tipo_programa: NivelPrograma
  activo: boolean
  fecha_creacion: string
  fecha_modificacion: string
}

export interface Cargo {
  id_cargo: string
  id: string
  nombre: string
  activo: boolean
  fecha_creacion: string
}

export interface Area {
  id_area: string
  id: string
  nombre: string
  activo: boolean
  fecha_creacion: string
}

export const NIVEL_LABELS: Record<NivelPrograma, string> = {
  tecnico: 'Técnico',
  profesional: 'Profesional',
  especializacion: 'Especialización',
}

export const UNIVERSIDAD_LABELS: Record<Universidad, string> = {
  uni_colombia: 'Universitaria de Colombia',
  uni_bogota: 'Universitaria de Bogotá',
}

export const UNIVERSIDADES: Universidad[] = ['uni_colombia', 'uni_bogota']

export const NIVELES: NivelPrograma[] = ['tecnico', 'profesional', 'especializacion']