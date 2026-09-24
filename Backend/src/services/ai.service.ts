import { z } from 'zod'
import Groq from 'groq-sdk'
import { prisma } from '../utils/prisma'
import { HttpError } from '../utils/HttpError'

export const MODELO_IA = process.env.GROQ_MODELO ?? 'openai/gpt-oss-20b'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY, timeout: 30_000 })

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

// --- Nivel del usuario: NivelActividad (valoración) -> NivelExperiencia (catálogo) ---
const NIVEL_ORDEN: Record<string, number> = {
  principiante: 1,
  intermedio: 2,
  avanzado: 3,
}

const NIVEL_LABEL: Record<string, string> = {
  principiante: 'Principiante',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
}

const ACTIVIDAD_A_NIVEL: Record<string, keyof typeof NIVEL_ORDEN> = {
  sedentario: 'principiante',
  ligero: 'principiante',
  moderado: 'intermedio',
  activo: 'intermedio',
  muy_activo: 'avanzado',
}

function nivelDesdeActividad(nivelActividad: string): string {
  const normalizado = nivelActividad.toLowerCase().replace(/\s+/g, '_')
  return ACTIVIDAD_A_NIVEL[normalizado] ?? 'principiante'
}

function nivelesPermitidos(nivelMaximo: string): string[] {
  const tope = NIVEL_ORDEN[nivelMaximo] ?? 1
  return Object.keys(NIVEL_ORDEN).filter((n) => NIVEL_ORDEN[n] <= tope)
}

// --- Días: normalización sin acentos (el enum Prisma usa "miercoles") ---
const ACENTOS: Record<string, string> = {
  á: 'a',
  é: 'e',
  í: 'i',
  ó: 'o',
  ú: 'u',
}

function normalizarDia(dia: string): string {
  const t = dia.trim().toLowerCase()
  return t.split('').map((c) => ACENTOS[c] ?? c).join('')
}

const DIAS_VALIDOS = new Set(['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'])

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

function construirPrompt(
  ejercicios: Array<{ id: string; nombre: string; grupos: string[]; nivel: string }>,
  contexto: { nivelMaximo: string; objetivos: string[]; dias: string[] },
) {
  const catalogo = ejercicios.map((e) => ({
    id: e.id,
    nombre: e.nombre,
    grupos_musculares: e.grupos,
    nivel: e.nivel,
  }))

  const nivelLabel = NIVEL_LABEL[contexto.nivelMaximo] ?? contexto.nivelMaximo

  const content =
    [
      'Eres un entrenador físico profesional. Generas rutinas de entrenamiento personalizadas.',
      'Debes responder ÚNICAMENTE con JSON válido, sin texto adicional, con esta estructura exacta: { "name": string, "description": string, "duration": string, "frequency": string, "level": "Principiante" | "Intermedio" | "Avanzado", "rows": [ { "id_ejercicio": string, "dia": string, "muscle": string, "name": string, "sets": string, "reps": string, "rest": string, "weight": string } ] }.',
      '',
      'Además, "duration" debe ser exactamente UNO de estos valores: "cuatro_semanas", "ocho_semanas", "doce_semanas", "dieciseis_semanas". Elige el más acorde al perfil y objetivos del usuario (por defecto usa "ocho_semanas").',
      '',
      'REGLA DE SEGURIDAD — PRIORITARIA ANTE CUALQUIER OTRA:',
      'El mensaje del usuario incluye sus antecedentes de salud ("antecedentes_salud"). Antes de elegir cada ejercicio debes revisarlos activamente y respetarlos:',
      '- Si los antecedentes mencionan una zona corporal (por ejemplo, rodilla, espalda, hombro, pierna) o una condición (cardiovascular, metabólica, respiratoria, psiquiátrica), NO asignes ejercicios que carguen o comprometan esa zona ni ejercicios de alta exigencia sobre ella.',
      '- Si un ejercicio del catálogo pudiera ser riesgoso por los antecedentes, sustitúyelo por uno que no comprometa esa zona, o reduce su exigencia (menos series, menos peso).',
      '- Ante CUALQUIER duda sobre la seguridad de un ejercicio dados los antecedentes, EXCLUYE ese ejercicio y elige otro del catálogo. En la duda, excluir es siempre la opción correcta: nunca arriesgues la salud del usuario por llenar la rutina.',
      '- Si existen VARIOS antecedentes a la vez, cada ejercicio debe cumplir TODAS las restricciones de forma simultánea: si un ejercicio viola al menos una de ellas, no lo uses, aunque cumpla las demás.',
      '- La seguridad prevalece sobre la cantidad de ejercicios y sobre cualquier otro objetivo.',
      '- Si "antecedentes_salud" llega vacío, incompleto o con etiquetas genéricas (por ejemplo, solo "Osteomuscular" sin detalle), NO asumas que el usuario no tiene limitaciones: aplica de todas formas un criterio conservador por defecto — intensidad moderada, sin esfuerzos máximos ni cargas altas en la primera semana, y progresión gradual.',
      '',
      `Nivel de experiencia del usuario: ${nivelLabel}. El catálogo ya fue filtrado a ejercicios permitidos para ese nivel.`,
      '',
      `Objetivos del usuario: ${contexto.objetivos.join(', ')}. Interpreta esos objetivos y elige ejercicios del catálogo cuya zona de trabajo ("grupos_musculares") esté relacionada con ellos. Guía de orientación: objetivos de resistencia, cardiovascular o maratón se asocian con cardio, piernas o tren_inferior/general; objetivos de fuerza con grupos de fuerza (pecho, espalda, hombros, brazos, piernas); objetivos de abdomen o core con abdomen_core; objetivos de tonificación con una mezcla equilibrada.`,
      '',
      `Si el catálogo filtrado no tiene ejercicios directamente afines al objetivo, elige los más cercanos disponibles (por ejemplo, piernas si no hay tren_inferior) y mantén variedad de grupos, pero NO rellenes la rutina con un único grupo ajeno al objetivo (por ejemplo, no llenes todos los días con espalda o abdomen_core) cuando existan alternativas más variadas. Todo siempre sin contradecir la REGLA DE SEGURIDAD.`,
      '',
      `Cantidad y parámetros: cada día de los listados debe llevar entre 3 y 6 ejercicios (usa la mayoría del catálogo si es pequeño; no repitas un ejercicio dentro del mismo día, aunque puede repetirse en días distintos). Varía "sets" entre 2 y 4, expresa "reps" como rango numérico (por ejemplo "8-12" o "10-15"; "20-30" para esfuerzo de condición física) y ajusta "rest" al tipo de esfuerzo (por ejemplo "60 seg" para fuerza y "90 seg" para movimientos compuestos exigentes).`,
      '',
      `Días disponibles del usuario (usa exactamente estos días en "dia"): ${contexto.dias.join(', ')}.`,
      '',
      'No inventes id_ejercicio: usa solo los ids del catálogo. Cada fila pertenece a un único día de la lista anterior.',
      '',
      'Aquí está el catálogo de ejercicios disponibles con sus IDs reales:\n' + JSON.stringify(catalogo),
    ].join('\n')

  return {
    role: 'system' as const,
    content,
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
  contexto: { nivelMaximo: string; objetivos: string[]; dias: string[] },
): Promise<{ name: string; description: string; duration: string; frequency: string; level: string; rows: RoutineRow[] }> {
  const response = await groq.chat.completions.create({
    model: MODELO_IA,
    temperature: 0.4,
    max_tokens: 4000,
    messages: [
      construirPrompt(ejercicios, contexto),
      {
        role: 'user' as const,
        content:
          `Datos para la rutina (sin datos personales):\n${JSON.stringify(datosAnonimos)}\n\n` +
          'IMPORTANTE: aplica la REGLA DE SEGURIDAD del prompt del sistema sobre los "antecedentes_salud" incluidos en estos datos; ante la duda, excluye el ejercicio.',
      },
    ],
    response_format: { type: 'json_object' },
  })

  const contenido = response.choices?.[0]?.message?.content
  if (!contenido) throw new Error('La IA no devolvió contenido')

  const json = extraerJson(contenido)
  return routineResponseSchema.parse(json)
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

  const nivelMaximo = nivelDesdeActividad(input.nivelActividad)
  const permitidos = new Set(nivelesPermitidos(nivelMaximo))
  const ejerciciosFiltrados = ejerciciosDb.filter((e) => permitidos.has(e.nivel))

  if (ejerciciosFiltrados.length === 0) {
    const label = NIVEL_LABEL[nivelMaximo] ?? nivelMaximo
    throw new HttpError(400, `No hay ejercicios activos para el nivel ${label} en el catálogo para generar la rutina`)
  }

  const ejercicios = ejerciciosFiltrados.map((e) => ({
    id: e.id_ejercicio,
    nombre: e.nombre,
    grupos: (e.grupos_musculares as string[]) ?? [],
    nivel: e.nivel,
  }))

  const datosAnonimos = anonimizar(input)
  const dias = input.diasDisponibles.slice(0, 6)
  const diasNormalizados = new Set(
    dias.map(normalizarDia).filter((d) => DIAS_VALIDOS.has(d)),
  )
  const contexto = { nivelMaximo, objetivos: input.objetivoTarjetas, dias }

  let respuesta: { name: string; description: string; duration: string; frequency: string; level: string; rows: RoutineRow[] }
  try {
    respuesta = await llamarModelo(ejercicios, datosAnonimos, contexto)
  } catch (primerError) {
    if (primerError instanceof HttpError) throw primerError
    try {
      respuesta = await llamarModelo(ejercicios, datosAnonimos, contexto)
    } catch {
      throw new HttpError(502, 'La IA no generó una rutina válida. Inténtalo de nuevo.')
    }
  }

  const catalogoPorId = new Map(ejercicios.map((e) => [e.id, e]))
  const tope = NIVEL_ORDEN[nivelMaximo] ?? 1
  const etiquetaPorDia = new Map(dias.map((d) => [normalizarDia(d), d]))

  const filasValidas = respuesta.rows.filter((r) => {
    const cat = catalogoPorId.get(r.id_ejercicio)
    if (!cat) return false
    if (NIVEL_ORDEN[cat.nivel] > tope) return false
    const dia = normalizarDia(r.dia)
    if (!dia) return false
    if (diasNormalizados.size > 0 && !diasNormalizados.has(dia)) return false
    if (!DIAS_VALIDOS.has(dia)) return false
    return true
  })

  const rowsFinales = filasValidas.map((r) => {
    const cat = catalogoPorId.get(r.id_ejercicio)!
    const grupos = (cat.grupos ?? []).filter(Boolean)
    return {
      id: r.id_ejercicio,
      dia: etiquetaPorDia.get(normalizarDia(r.dia)) ?? normalizarDia(r.dia),
      muscle: grupos.length > 0 ? grupos.join(', ') : r.muscle,
      name: cat.nombre,
      sets: r.sets,
      reps: r.reps,
      rest: r.rest,
      weight: r.weight ?? '',
    }
  })

  if (rowsFinales.length === 0) {
    throw new HttpError(502, 'La IA no generó una rutina válida. Inténtalo de nuevo.')
  }

  return {
    name: respuesta.name,
    description: respuesta.description,
    duration: respuesta.duration,
    frequency: respuesta.frequency,
    level: respuesta.level,
    rows: rowsFinales,
  }
}