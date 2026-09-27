import type { StudentRoutine } from '@/features/student/types/student'
import type { FrontendSesionRutina } from '@/services/rutina.service'

export function capitalizar(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/** Clave del día de hoy (es-CO, minúsculas y con tildes: 'sábado'). */
export function hoyKey(): string {
  return new Date().toLocaleDateString('es-CO', { weekday: 'long' }).toLowerCase()
}

const LETRAS_DIA: Record<string, string> = {
  lunes: 'L',
  martes: 'M',
  miercoles: 'X',
  jueves: 'J',
  viernes: 'V',
  sabado: 'S',
  domingo: 'D',
}

function sinAcentos(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

/** Letra corta de la semana (L, M, X, J, V, S, D) a partir del nombre del día. */
export function letraDeDia(dia: string): string {
  return LETRAS_DIA[sinAcentos(dia).toLowerCase()] ?? dia.charAt(0).toUpperCase()
}

/** Fecha local en formato YYYY-MM-DD (sin desfase de zona horaria). */
export function fechaISO(d: Date): string {
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-')
}

/** Día de calendario local (YYYY-MM-DD) de una fecha ISO del backend. */
export function fechaISOdeString(iso: string): string {
  return fechaISO(new Date(iso))
}

/** Compara una fecha (por su parte de calendario local) contra una fecha de referencia. */
export function esMismoDia(fecha: string, ref: Date): boolean {
  return fechaISOdeString(fecha) === fechaISO(ref)
}

/** Lunes 00:00 de la semana actual (local). */
export function inicioDeSemana(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7))
  return d
}

/** Número de semana ISO del año para una fecha. */
export function semanaDelAnio(fecha: Date = new Date()): number {
  const d = new Date(Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()))
  const dayNum = (d.getUTCDay() + 6) % 7
  d.setUTCDate(d.getUTCDate() - dayNum + 3)
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4))
  const firstDayNum = (firstThursday.getUTCDay() + 6) % 7
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNum + 3)
  return 1 + Math.round((d.getTime() - firstThursday.getTime()) / 604800000)
}

/** Días completados desde las sesiones reales: un día cuenta si existe al menos
 *  una sesión finalizada en esa fecha (fuente de verdad: backend). */
export function doneDaysDesdeSesiones(routine: StudentRoutine, sesiones: FrontendSesionRutina[]): string[] {
  const dias = routine.days ?? []
  if (!dias.length) return []
  const nombres = new Set<string>()
  for (const s of sesiones) {
    if (s.estado !== 'finalizada') continue
    const wd = new Date(s.fecha).toLocaleDateString('es-CO', { weekday: 'long' }).toLowerCase()
    const match = dias.find(d => d.toLowerCase() === wd)
    if (match) nombres.add(match)
  }
  return [...nombres]
}

/** Próxima sesión planificada a partir de mañana (búsqueda cíclica sobre los días). */
export function proximaSesion(routine: StudentRoutine): Date | null {
  const dias = routine.days ?? []
  if (!dias.length) return null
  const next = new Date()
  next.setDate(next.getDate() + 1)
  for (let i = 0; i < 7; i++) {
    const key = next.toLocaleDateString('es-CO', { weekday: 'long' }).toLowerCase()
    if (dias.some(d => d.toLowerCase() === key)) return next
    next.setDate(next.getDate() + 1)
  }
  return null
}

/** 'Martes 7 de septiembre' (sin año) para el mensaje de descanso. */
export function proximaSesionLabel(routine: StudentRoutine): string | null {
  const prox = proximaSesion(routine)
  if (!prox) return null
  return capitalizar(prox.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' }))
}