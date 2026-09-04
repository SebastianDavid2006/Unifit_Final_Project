export interface Programa {
  id_programa: string
  nombre: string
  universidad: string
  tipo_programa: string
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

export interface ProgramasAgrupados {
  [institucion: string]: {
    [nivel: string]: Programa[]
  }
}

export function agruparProgramas(programas: Programa[]): ProgramasAgrupados {
  return programas.reduce((acc, p) => {
    const inst = p.universidad
    const nivel = p.tipo_programa
    if (!acc[inst]) acc[inst] = {}
    if (!acc[inst][nivel]) acc[inst][nivel] = []
    acc[inst][nivel].push(p)
    return acc
  }, {} as ProgramasAgrupados)
}

export const INSTITUCIONES = ['Universitaria de Colombia', 'Universitaria de Bogotá'] as const

export type Institucion = typeof INSTITUCIONES[number]

export function getNiveles(institucion: string): string[] {
  if (institucion === 'Universitaria de Bogotá') {
    return ['Pregrado']
  }
  return ['Técnicos', 'Profesionales', 'Especializaciones']
}