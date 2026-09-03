export interface RoutineRow {
  id: string
  dia: string
  muscle: string
  name: string
  sets: string
  reps: string
  rest: string
  weight: string
}

export interface AiRoutineInput {
  nivelActividad: string
  objetivoTarjetas: string[]
  objetivoDetalle: string
  peso: string
  estatura: string
  imc: string
  grasaCorporal: string
  masaMuscular: string
  presionArterial: string
  resistenciaMuscular: string
  antecedentesSalud: string[]
  observacionesEntrenador: string
  diasDisponibles: string[]
  observacionesFinales: string
  studentName?: string
}

export interface AiRoutine {
  name: string
  description: string
  duration: string
  frequency: string
  level: 'Principiante' | 'Intermedio' | 'Avanzado'
  rows: RoutineRow[]
}

export const AI_GENERATION_STEPS = [
  'Analizando medidas corporales',
  'Evaluando objetivos y nivel de actividad',
  'Revisando antecedentes de salud',
  'Seleccionando ejercicios personalizados',
  'Distribuyendo ejercicios por día',
  'Estructurando la tabla semanal',
  'Finalizando rutina con IA',
]
