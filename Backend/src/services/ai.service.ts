import { z } from 'zod'
import Groq from 'groq-sdk'
import { prisma } from '../utils/prisma'
import { HttpError } from '../utils/HttpError'

export const MODELO_IA = process.env.GROQ_MODELO ?? 'llama3-8b-8192'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export interface GenerarRutinaInput {
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
}

const routineRowSchema = z.object({
  id_ejercicio: z.string().uuid(),
  dia: z.string().min(1),
  muscle: z.string().min(1),
  name: z.string().min(1),
  sets: z.string().min(1),
  reps: z.string().min(1),
  rest: z.string().min(1),
  weight: z.string().optional().default(''),
})

const routineResponseSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  duration: z.string().min(1),
  frequency: z.string().min(1),
  level: z.enum(['Principiante', 'Intermedio', 'Avanzado']),
  rows: z.array(routineRowSchema).min(1),
})

type RoutineRow = z.infer<typeof routineRowSchema>

function anonimizar(input: GenerarRutinaInput) {
  return {
    nivelActividad: input.nivelActividad,
    objetivos: input.objetivoTarjetas,
    objetivoDetalle: input.objetivoDetalle,
    metricas: {
      peso_kg: input.peso,
      estatura_cm: input.estatura,
      imc: input.imc,
      grasa_corporal_pct: input.grasaCorporal,
      masa_muscular_kg: input.masaMuscular,
      presion_arterial: input.presionArterial,
      resistencia_muscular: input.resistenciaMuscular,
    },
    antecedentes_salud: input.antecedentesSalud,
    observaciones_entrenador: input.observacionesEntrenador,
    dias_disponibles: input.diasDisponibles,
    observaciones_finales: input.observacionesFinales,
  }
}

function construirPrompt(ejercicios: Array<{ id: string; nombre: string; grupos: string[]; nivel: string }>) {
  const catalogo = ejercicios.map((e) => ({
    id: e.id,
    nombre: e.nombre,
    grupos_musculares: e.grupos,
    nivel: e.nivel,
  }))

  return {
    role: 'system' as const,
    content:
      'Eres un entrenador físico profesional. Generas rutinas de entrenamiento personalizadas. ' +
      'Solo puedes usar los ejercicios del catálogo proporcionado (por su id). ' +
      'Debes responder ÚNICAMENTE con JSON válido, sin texto adicional, con esta estructura exacta: ' +
      '{ "name": string, "description": string, "duration": string, "frequency": string, ' +
      '"level": "Principiante" | "Intermedio" | "Avanzado", ' +
      '"rows": [ { "id_ejercicio": string, "dia": string, "muscle": string, "name": string, ' +
      '"sets": string, "reps": string, "rest": string, "weight": string } ] }. ' +
      'Los días deben pertenecer a los días disponibles del usuario. No inventes id_ejercicio: usa solo ids del catálogo.',
  }
}

function extraerJson(texto: string): unknown {
  const inicio = texto.indexOf('{')
  const fin = texto.lastIndexOf('}')
  if (inicio === -1 || fin === -1 || fin <= inicio) {
    throw new Error('No se encontró JSON en la respuesta de la IA')
  }
  return JSON.parse(texto.slice(inicio, fin + 1))
}

async function llamarModelo(
  ejercicios: Array<{ id: string; nombre: string; grupos: string[]; nivel: string }>,
  datosAnonimos: unknown,
): Promise<RoutineRow[]> {
  const response = await groq.chat.completions.create({
    model: MODELO_IA,
    temperature: 0.4,
    messages: [
      construirPrompt(ejercicios),
      { role: 'user', content: `Datos para la rutina (sin datos personales): ${JSON.stringify(datosAnonimos)}` },
    ],
    response_format: { type: 'json_object' },
  })

  const contenido = response.choices?.[0]?.message?.content
  if (!contenido) throw new Error('La IA no devolvió contenido')

  const json = extraerJson(contenido)
  return routineResponseSchema.parse(json).rows
}

export async function generarRutinaIA(input: GenerarRutinaInput) {
  if (!process.env.GROQ_API_KEY) {
    throw new HttpError(500, 'La generación con IA no está configurada (falta GROQ_API_KEY)')
  }

  const ejerciciosDb = await prisma.ejercicio.findMany({
    where: { activo: true },
    select: {
      id_ejercicio: true,
      nombre: true,
      grupos_musculares: true,
      nivel: true,
    },
  })

  if (ejerciciosDb.length === 0) {
    throw new HttpError(400, 'No hay ejercicios activos en el catálogo para generar la rutina')
  }

  const ejercicios = ejerciciosDb.map((e) => ({
    id: e.id_ejercicio,
    nombre: e.nombre,
    grupos: (e.grupos_musculares as string[]) ?? [],
    nivel: e.nivel,
  }))

  const datosAnonimos = anonimizar(input)
  const dias = input.diasDisponibles.length ? input.diasDisponibles.slice(0, 6) : ['Lunes', 'Miércoles', 'Viernes']

  let rows: RoutineRow[] = []
  try {
    rows = await llamarModelo(ejercicios, datosAnonimos)
  } catch (primerError) {
    if (primerError instanceof HttpError) throw primerError
    try {
      rows = await llamarModelo(ejercicios, datosAnonimos)
    } catch {
      throw new HttpError(502, 'La IA no generó una rutina válida. Inténtalo de nuevo.')
    }
  }

  const catalogoPorId = new Map(ejercicios.map((e) => [e.id, e]))
  const filasValidas = rows.filter((r) => catalogoPorId.has(r.id_ejercicio))

  const rowsFinales = filasValidas.map((r, i) => ({
    id: r.id_ejercicio,
    dia: r.dia,
    muscle: r.muscle,
    name: r.name,
    sets: r.sets,
    reps: r.reps,
    rest: r.rest,
    weight: r.weight ?? '',
  }))

  return {
    name: `Rutina IA`,
    description: `Rutina generada con inteligencia artificial según la valoración: ${dias.length} días por semana.`,
    duration: '8 semanas',
    frequency: `${dias.length} días/semana`,
    level: rowsFinales.length ? 'Intermedio' : 'Principiante',
    rows: rowsFinales,
  }
}
