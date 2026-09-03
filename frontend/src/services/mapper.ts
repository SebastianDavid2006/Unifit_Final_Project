const GRUPO_MUSCULAR_BACK_TO_FRONT: Record<string, string> = {
  pecho: 'Pecho',
  espalda: 'Espalda',
  hombros: 'Hombros',
  brazos: 'Brazos',
  piernas: 'Piernas',
  abdomen_core: 'Abdomen/Core',
  cardio: 'Cardio',
  general: 'General',
  tren_superior: 'Tren Superior',
  tren_inferior: 'Tren Inferior',
}

const GRUPO_MUSCULAR_FRONT_TO_BACK: Record<string, string> = Object.fromEntries(
  Object.entries(GRUPO_MUSCULAR_BACK_TO_FRONT).map(([k, v]) => [v, k])
)

const NIVEL_BACK_TO_FRONT: Record<string, string> = {
  principiante: 'Principiante',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
}

const NIVEL_FRONT_TO_BACK: Record<string, string> = Object.fromEntries(
  Object.entries(NIVEL_BACK_TO_FRONT).map(([k, v]) => [v, k])
)

const DIA_BACK_TO_FRONT: Record<string, string> = {
  lunes: 'Lunes',
  martes: 'Martes',
  miercoles: 'Miércoles',
  jueves: 'Jueves',
  viernes: 'Viernes',
  sabado: 'Sábado',
}

const DIA_FRONT_TO_BACK: Record<string, string> = {
  Lunes: 'lunes',
  Martes: 'martes',
  Miércoles: 'miercoles',
  Jueves: 'jueves',
  Viernes: 'viernes',
  Sábado: 'sabado',
  'Sabado': 'sabado',
}

const DURACION_BACK_TO_FRONT: Record<string, string> = {
  cuatro_semanas: '4 semanas',
  ocho_semanas: '8 semanas',
  doce_semanas: '12 semanas',
  dieciseis_semanas: '16 semanas',
}

const DURACION_FRONT_TO_BACK: Record<string, string> = Object.fromEntries(
  Object.entries(DURACION_BACK_TO_FRONT).map(([k, v]) => [v, k])
)

const OBJETIVO_BACK_TO_FRONT: Record<string, string> = {
  perdida_peso: 'Pérdida de peso',
  ganancia_muscular: 'Ganancia muscular',
  acondicionamiento_fisico: 'Acondicionamiento físico',
  salud: 'Salud',
  rendimiento_deportivo: 'Rendimiento deportivo',
  otro: 'Otro',
}

const OBJETIVO_FRONT_TO_BACK: Record<string, string> = Object.fromEntries(
  Object.entries(OBJETIVO_BACK_TO_FRONT).map(([k, v]) => [v, k])
)

const ANTENCEDENTE_BACK_TO_FRONT: Record<string, string> = {
  osteomuscular: 'Osteomuscular',
  respiratorio: 'Respiratorio',
  psiquiatrico: 'Psiquiátrico',
  cardiovascular: 'Cardiovascular',
  metabolico: 'Metabólico',
  psicologico: 'Psicológico',
}

const ANTENCEDENTE_FRONT_TO_BACK: Record<string, string> = Object.fromEntries(
  Object.entries(ANTENCEDENTE_BACK_TO_FRONT).map(([k, v]) => [v, k])
)

const NIVEL_ACTIVIDAD_BACK_TO_FRONT: Record<string, string> = {
  sedentario: 'Sedentario',
  ligero: 'Ligero',
  moderado: 'Moderado',
  activo: 'Activo',
  muy_activo: 'Muy activo',
}

const NIVEL_ACTIVIDAD_FRONT_TO_BACK: Record<string, string> = Object.fromEntries(
  Object.entries(NIVEL_ACTIVIDAD_BACK_TO_FRONT).map(([k, v]) => [v, k])
)

export function mapGrupoMuscularBackToFront(value: string): string {
  return GRUPO_MUSCULAR_BACK_TO_FRONT[value] ?? value
}

export function mapGrupoMuscularFrontToBack(value: string): string {
  return GRUPO_MUSCULAR_FRONT_TO_BACK[value] ?? value.toLowerCase()
}

export function mapNivelBackToFront(value: string): string {
  return NIVEL_BACK_TO_FRONT[value] ?? value
}

export function mapNivelFrontToBack(value: string): string {
  return NIVEL_FRONT_TO_BACK[value] ?? value.toLowerCase()
}

export function mapDiaBackToFront(value: string): string {
  return DIA_BACK_TO_FRONT[value] ?? value
}

export function mapDiaFrontToBack(value: string): string {
  return DIA_FRONT_TO_BACK[value] ?? value.toLowerCase()
}

export function mapDuracionBackToFront(value: string): string {
  return DURACION_BACK_TO_FRONT[value] ?? value
}

export function mapDuracionFrontToBack(value: string): string {
  return DURACION_FRONT_TO_BACK[value] ?? value
}

export function mapObjetivoBackToFront(value: string): string {
  return OBJETIVO_BACK_TO_FRONT[value] ?? value
}

export function mapObjetivoFrontToBack(value: string): string {
  return OBJETIVO_FRONT_TO_BACK[value] ?? value.toLowerCase().replace(/\s+/g, '_')
}

export function mapAntecedenteBackToFront(value: string): string {
  return ANTENCEDENTE_BACK_TO_FRONT[value] ?? value
}

export function mapAntecedenteFrontToBack(value: string): string {
  return ANTENCEDENTE_FRONT_TO_BACK[value] ?? value.toLowerCase().replace(/\s+/g, '_')
}

export function mapNivelActividadBackToFront(value: string): string {
  return NIVEL_ACTIVIDAD_BACK_TO_FRONT[value] ?? value
}

export function mapNivelActividadFrontToBack(value: string): string {
  return NIVEL_ACTIVIDAD_FRONT_TO_BACK[value] ?? value.toLowerCase().replace(/\s+/g, '_')
}

export function mapDiasArrayBackToFront(dias: string[]): string[] {
  return dias.map(mapDiaBackToFront)
}

export function mapDiasArrayFrontToBack(dias: string[]): string[] {
  return dias.map(mapDiaFrontToBack)
}

export function mapObjetivosArrayBackToFront(objetivos: string[]): string[] {
  return objetivos.map(mapObjetivoBackToFront)
}

export function mapObjetivosArrayFrontToBack(objetivos: string[]): string[] {
  return objetivos.map(mapObjetivoFrontToBack)
}

export function mapAntecedentesArrayBackToFront(antecedentes: string[]): string[] {
  return antecedentes.map(mapAntecedenteBackToFront)
}

export function mapAntecedentesArrayFrontToBack(antecedentes: string[]): string[] {
  return antecedentes.map(mapAntecedenteFrontToBack)
}
