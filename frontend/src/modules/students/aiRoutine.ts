import { Exercise, exerciseCatalog } from '@/data/exercises'

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

const GOAL_LABELS: Record<string, string> = {
  'Ganancia muscular': 'Hipertrofia',
  'Perdida de peso': 'Definición y Pérdida de Peso',
  'Acondicionamiento fisico': 'Acondicionamiento Físico',
  'Salud': 'Salud y Bienestar',
  'Rendimiento deportivo': 'Rendimiento Deportivo',
}

const MUSCLE_PRIORITY: Record<string, string[]> = {
  'Ganancia muscular': ['Cuádriceps', 'Pecho', 'Espalda', 'Hombros', 'Bíceps', 'Tríceps', 'Isquiotibiales', 'Core'],
  'Perdida de peso': ['Glúteos', 'Core', 'Cuádriceps', 'Pecho', 'Espalda', 'Hombros', 'Isquiotibiales'],
  'Acondicionamiento fisico': ['Core', 'Glúteos', 'Cuádriceps', 'Pecho', 'Espalda', 'Hombros'],
  'Salud': ['Core', 'Glúteos', 'Pecho', 'Espalda', 'Hombros', 'Cuádriceps'],
  'Rendimiento deportivo': ['Cuádriceps', 'Glúteos', 'Espalda', 'Pecho', 'Isquiotibiales', 'Core'],
}

const REST_BY_GOAL: Record<string, string> = {
  'Ganancia muscular': '90 s',
  'Perdida de peso': '45 s',
  'Acondicionamiento fisico': '60 s',
  'Salud': '60 s',
  'Rendimiento deportivo': '120 s',
}

const LEVEL_ORDER: Record<string, number> = { 'Principiante': 1, 'Intermedio': 2, 'Avanzado': 3 }

function detectHealthFlags(input: AiRoutineInput): string[] {
  const flags = new Set(input.antecedentesSalud)
  const obs = (input.observacionesEntrenador || '') + ' ' + (input.observacionesFinales || '')
  if (/rodilla|espalda|hombro|columna|cadera|articulac|osteo|músculo|musculo/i.test(obs)) flags.add('Osteomuscular')
  if (/coraz|cardi|hipertensi|presi|taquicard/i.test(obs)) flags.add('Cardiovascular')
  if (/respir|asma|pulm|bronqu/i.test(obs)) flags.add('Respiratorio')
  if (/diabet|glucosa|metab|tiroid/i.test(obs)) flags.add('Metabólico')
  return [...flags]
}

function resolveLevel(input: AiRoutineInput): 'Principiante' | 'Intermedio' | 'Avanzado' {
  switch (input.nivelActividad) {
    case 'Muy activo':
    case 'Extremadamente activo':
      return 'Avanzado'
    case 'Activo':
      return 'Intermedio'
    default:
      return 'Principiante'
  }
}

function goalPhrase(input: AiRoutineInput): string {
  for (const goal of input.objetivoTarjetas) {
    if (GOAL_LABELS[goal]) return GOAL_LABELS[goal]
  }
  return 'Personalizada'
}

function pickExercises(input: AiRoutineInput, level: 'Principiante' | 'Intermedio' | 'Avanzado', days: number): Exercise[] {
  const flags = detectHealthFlags(input)
  const levelRank = LEVEL_ORDER[level]
  const goals = input.objetivoTarjetas.length ? input.objetivoTarjetas : ['Acondicionamiento fisico']
  const priority = [...new Set(goals.flatMap(g => MUSCLE_PRIORITY[g] || MUSCLE_PRIORITY['Acondicionamiento fisico']))]

  const pool = exerciseCatalog.filter(ex => {
    if (LEVEL_ORDER[ex.difficulty] > levelRank + 1) return false
    if (ex.avoid && ex.avoid.some(a => flags.includes(a))) return false
    return true
  })

  const used = new Set<string>()
  const chosen: Exercise[] = []
  const maxExercises = days >= 5 ? 12 : days === 4 ? 10 : days === 3 ? 9 : 6

  let round = 0
  while (chosen.length < maxExercises && round < 20) {
    round++
    let added = false
    for (const muscle of priority) {
      if (chosen.length >= maxExercises) break
      const candidates = pool.filter(ex => ex.muscle === muscle && !used.has(ex.id))
      if (!candidates.length) continue
      const ex = candidates[Math.floor(Math.random() * candidates.length)]
      used.add(ex.id)
      chosen.push(ex)
      added = true
    }
    if (!added) break
  }

  return chosen.slice(0, maxExercises)
}

function buildRows(exercises: Exercise[], days: string[], goal: string): RoutineRow[] {
  const rest = REST_BY_GOAL[goal] ?? '60 s'
  const perDay = Math.max(2, Math.ceil(exercises.length / days.length))
  const rows: RoutineRow[] = []
  days.forEach((dia, di) => {
    const chunk = exercises.slice(di * perDay, (di + 1) * perDay)
    chunk.forEach((ex, ei) => {
      rows.push({
        id: `r-${di}-${ei}`,
        dia,
        muscle: ex.muscle,
        name: ex.name,
        sets: String(ex.sets),
        reps: ex.reps,
        rest,
        weight: ex.weight,
      })
    })
  })
  return rows
}

export function buildAiRoutine(input: AiRoutineInput): AiRoutine {
  const level = resolveLevel(input)
  const phrase = goalPhrase(input)
  const days = input.diasDisponibles.length ? input.diasDisponibles.slice(0, 6) : ['Lunes', 'Miércoles', 'Viernes']
  const exercises = pickExercises(input, level, days.length)
  const rows = buildRows(exercises, days, input.objetivoTarjetas[0] ?? '')

  const flags = detectHealthFlags(input)
  const healthNote = flags.length
    ? ` Rutina adaptada: se evitaron ejercicios contraindicados por los antecedentes registrados (${flags.join(', ')}).`
    : ''
  const detail = input.objetivoDetalle ? ` Enfoque: ${input.objetivoDetalle}.` : ''
  const metrics = input.imc ? ` IMC ${input.imc}.` : ''

  const name = `Rutina ${phrase}${input.studentName ? ` · ${input.studentName}` : ''}`
  const description = `Rutina personalizada generada con IA según la valoración física: objetivo ${phrase.toLowerCase()}, nivel ${level.toLowerCase()}, ${days.length} días por semana.${detail}${metrics}${healthNote}`

  return {
    name,
    description,
    duration: '8 semanas',
    frequency: `${days.length} días/semana`,
    level,
    rows,
  }
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
