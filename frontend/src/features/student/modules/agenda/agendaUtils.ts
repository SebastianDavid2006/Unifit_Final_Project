import type { DayAvailability } from '@/features/student/types/student'

export interface CupoSlot {
  time: string
  taken: boolean
}

export interface CupoRef {
  time: string
  idCupo: string
}

let cuposPorFecha: Record<string, CupoSlot[]> = {}
let cuposRefPorSlot: Record<string, string> = {}

export function setCuposDisponiblesPorFecha(cupos: Record<string, CupoSlot[]>, refs?: Record<string, string>): void {
  cuposPorFecha = cupos
  if (refs) cuposRefPorSlot = refs
}

export function getCupoIdPorSlot(date: Date, time: string): string | undefined {
  return cuposRefPorSlot[`${fmtDateKey(date)}@${time}`]
}

function fmtDateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

export function offset(d: Date, days: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + days)
}

export function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function weekStart(d: Date): Date {
  return offset(d, -d.getDay())
}

export function freeSlots(info: DayAvailability): number {
  return info.slots.filter(s => !s.taken).length
}

/* Disponibilidad real: consulta los cupos publicados cargados del backend.
   Los festivos llegan ya calculados desde el backend (GET /festivos) */
export function getDayInfo(date: Date, holidays: Map<string, string>): DayAvailability {
  const holidayName = holidays.get(fmtDateKey(date))
  if (holidayName) return { date, isHoliday: true, holidayName, isCoachDay: false, slots: [] }
  const slots = cuposPorFecha[fmtDateKey(date)] || []
  if (slots.length === 0) return { date, isHoliday: false, isCoachDay: false, slots: [] }
  return { date, isHoliday: false, isCoachDay: true, slots }
}

export const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
export const weekDaysShort = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

/* Política de cancelación: mínimo 24 horas antes de la sesión */
export const HOURS_24_MS = 24 * 60 * 60 * 1000

export function sessionDateTimeOf(date: Date, time: string): Date {
  const [h, m] = time.split(':').map(Number)
  const d = new Date(date)
  d.setHours(h || 0, m || 0, 0, 0)
  return d
}
