import type { DayAvailability } from '@/features/student/types/student'

/* Horario del entrenador */
export const COACH_SCHEDULE: Record<number, string[]> = {
  0: [],                                  // Domingo cerrado
  1: ['06:00', '07:00', '08:00', '16:00', '17:00', '18:00'],
  2: ['06:00', '07:00', '17:00', '18:00', '19:00'],
  3: ['07:00', '08:00', '16:00', '17:00'],
  4: ['06:00', '07:00', '08:00', '18:00', '19:00'],
  5: ['06:00', '09:00', '10:00'],
  6: ['09:00', '10:00'],                  // Sábado medio día
}

/* Festivos Colombia (Emiliani) — cálculo con Pascua */
function easterSunday(year: number): Date {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(year, month - 1, day)
}

export function offset(d: Date, days: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + days)
}

export function colombianHolidays(year: number): Map<string, string> {
  const map = new Map<string, string>()
  const key = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
  const addFixed = (m: number, day: number, name: string, moveMonday: boolean) => {
    let d = new Date(year, m, day)
    if (moveMonday) d = offset(d, (8 - d.getDay()) % 7 || 7)
    map.set(key(d), name)
  }
  const addEasterBased = (days: number, name: string, moveMonday: boolean) => {
    let d = offset(easterSunday(year), days)
    if (moveMonday) d = offset(d, (8 - d.getDay()) % 7 || 7)
    map.set(key(d), name)
  }
  addFixed(0, 1, 'Año Nuevo', false)
  addFixed(0, 6, 'Reyes Magos', true)
  addFixed(2, 19, 'San José', true)
  addFixed(4, 1, 'Día del Trabajo', false)
  addFixed(6, 20, 'Independencia', false)
  addFixed(7, 7, 'Batalla de Boyacá', false)
  addEasterBased(-3, 'Jueves Santo', false)
  addEasterBased(-2, 'Viernes Santo', false)
  addEasterBased(43, 'Ascensión', true)
  addEasterBased(64, 'Corpus Christi', true)
  addEasterBased(71, 'Sagrado Corazón', true)
  addFixed(7, 15, 'Asunción', true)
  addFixed(9, 12, 'Día de la Raza', true)
  addFixed(10, 1, 'Todos los Santos', true)
  addFixed(10, 11, 'Independencia de Cartagena', true)
  addFixed(11, 8, 'Inmaculada Concepción', false)
  addFixed(11, 25, 'Navidad', false)
  return map
}

/* Determinista: mismos cupos ocupados para una fecha */
function hashDate(d: Date): number {
  return (d.getDate() * 7 + (d.getMonth() + 1) * 13 + d.getFullYear() * 3) % 97
}

export function getDayInfo(date: Date, holidays: Map<string, string>): DayAvailability {
  const holidayName = holidays.get(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`)
  if (holidayName) return { date, isHoliday: true, holidayName, isCoachDay: false, slots: [] }
  const times = COACH_SCHEDULE[date.getDay()] || []
  if (times.length === 0) return { date, isHoliday: false, isCoachDay: false, slots: [] }
  const takenCount = hashDate(date) % times.length // nunca todos ocupados salvo forzado abajo
  const allFull = hashDate(date) % 11 === 5 // ~9% de días completamente llenos
  const slots = times.map((time, i) => ({
    time,
    taken: allFull ? true : i < takenCount,
  }))
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
