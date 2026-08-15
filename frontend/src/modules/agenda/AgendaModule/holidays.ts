import { fmtDate } from './data'

export interface Holiday {
  date: string
  name: string
}

function easterDate(year: number): Date {
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

function on(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day)
}

function nextMonday(d: Date): Date {
  const r = new Date(d)
  const day = r.getDay()
  const add = day === 1 ? 0 : (8 - day) % 7
  r.setDate(r.getDate() + add)
  return r
}

export function getColombianHolidays(year: number): Holiday[] {
  const easter = easterDate(year)
  const sunday = (offset: number) => {
    const r = new Date(easter)
    r.setDate(r.getDate() + offset)
    return r
  }
  const emiliani = (d: Date, name: string): Holiday => ({ date: fmtDate(nextMonday(d)), name })
  const list: Holiday[] = [
    { date: fmtDate(on(year, 1, 1)), name: 'Año Nuevo' },
    emiliani(on(year, 1, 6), 'Día de los Reyes Magos'),
    emiliani(on(year, 3, 19), 'Día de San José'),
    { date: fmtDate(sunday(-3)), name: 'Jueves Santo' },
    { date: fmtDate(sunday(-2)), name: 'Viernes Santo' },
    { date: fmtDate(on(year, 5, 1)), name: 'Día del Trabajo' },
    emiliani(sunday(39), 'Día de la Ascensión'),
    emiliani(sunday(60), 'Corpus Christi'),
    emiliani(sunday(68), 'Sagrado Corazón de Jesús'),
    emiliani(on(year, 6, 29), 'San Pedro y San Pablo'),
  ]
  if (year >= 2026) {
    list.push(emiliani(on(year, 7, 9), 'Día de Nuestra Señora del Rosario de Chiquinquirá'))
  }
  list.push(
    { date: fmtDate(on(year, 7, 20)), name: 'Día de la Independencia' },
    { date: fmtDate(on(year, 8, 7)), name: 'Batalla de Boyacá' },
    emiliani(on(year, 8, 15), 'Asunción de la Virgen'),
    emiliani(on(year, 10, 12), 'Día de la Raza'),
    emiliani(on(year, 11, 1), 'Todos los Santos'),
    emiliani(on(year, 11, 11), 'Independencia de Cartagena'),
    { date: fmtDate(on(year, 12, 8)), name: 'Día de la Inmaculada Concepción' },
    { date: fmtDate(on(year, 12, 25)), name: 'Navidad' },
  )
  return list.sort((a, b) => a.date.localeCompare(b.date))
}

let holidayCache: { year: number; list: Holiday[] } | null = null

export function getHoliday(dateStr: string): { name: string } | null {
  const year = Number(dateStr.slice(0, 4))
  if (!holidayCache || holidayCache.year !== year) {
    holidayCache = { year, list: getColombianHolidays(year) }
  }
  const found = holidayCache.list.find(h => h.date === dateStr)
  return found ? { name: found.name } : null
}
