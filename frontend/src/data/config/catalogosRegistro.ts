export interface CatalogOption {
  value: string
  label: string
}

export const TIPO_DOC: CatalogOption[] = [
  { value: 'CC', label: 'CC - Cédula de Ciudadanía' },
  { value: 'TI', label: 'TI - Tarjeta de Identidad' },
  { value: 'CE', label: 'CE - Cédula de Extranjería' },
  { value: 'PA', label: 'PA - Pasaporte' },
  { value: 'RC', label: 'RC - Registro Civil' },
]

export const GENEROS = ['Masculino', 'Femenino', 'Otro']
export const GRUPOS_SANGRE = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
export const MODALIDADES = ['Presencial', 'Virtual']
export const JORNADAS = ['Mañana', 'Noche', 'Fin de semana']
export const ESTADOS = ['Egresado', 'No egresado']
export const PARENTESCOS = ['Padre', 'Madre', 'Hermano(a)', 'Abuelo(a)', 'Tío(a)', 'Primo(a)', 'Otro']

export const MAP_GENERO: Record<string, string> = { Masculino: 'masculino', Femenino: 'femenino', Otro: 'otro' }
export const MAP_GRUPO: Record<string, string> = {
  'A+': 'a_positivo', 'A-': 'a_negativo', 'B+': 'b_positivo', 'B-': 'b_negativo',
  'AB+': 'ab_positivo', 'AB-': 'ab_negativo', 'O+': 'o_positivo', 'O-': 'o_negativo',
}
export const MAP_PARENTESCO: Record<string, string> = {
  Padre: 'padre', Madre: 'madre', 'Hermano(a)': 'hermano_a', 'Abuelo(a)': 'abuelo_a',
  'Tío(a)': 'tio_a', 'Primo(a)': 'primo_a', Otro: 'otro',
}
export const MAP_JORNADA: Record<string, string> = { Mañana: 'diurna', Noche: 'nocturna', 'Fin de semana': 'finde' }
export const MAP_MODALIDAD: Record<string, string> = { Presencial: 'presencial', Virtual: 'virtual' }