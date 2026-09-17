export function isValidDate(date: string | undefined | null): boolean {
  if (!date) return false
  const d = new Date(date)
  return !Number.isNaN(d.getTime())
}

export function calcAge(date: string | undefined | null, reference: Date = new Date()): number {
  if (!isValidDate(date)) return -1
  const birth = new Date(date!)
  let age = reference.getFullYear() - birth.getFullYear()
  const m = reference.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && reference.getDate() < birth.getDate())) age--
  return age
}

export function isMinor(date: string | undefined | null, threshold = 18): boolean {
  const age = calcAge(date)
  return age >= 0 && age < threshold
}

export function formatDateES(date: string | undefined | null, options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' }): string {
  if (!isValidDate(date)) return 'No registrado'
  return new Date(date!).toLocaleDateString('es-CO', options)
}

const MESES_ES: Record<string, number> = {
  ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5,
  jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11,
}

function parseDateES(date: string): Date | null {
  const m = date.match(/(\d{1,2})\s+(\w{3})\s+(\d{4})/i)
  if (!m) return null
  const mes = MESES_ES[m[2].toLowerCase()]
  if (mes === undefined) return null
  return new Date(Number(m[3]), mes, Number(m[1]))
}

export function calcTenure(startDate: string, reference: Date = new Date()): string {
  const start = isValidDate(startDate) ? new Date(startDate) : parseDateES(startDate)
  if (!start || Number.isNaN(start.getTime())) return 'Desconocido'
  
  let years = reference.getFullYear() - start.getFullYear()
  let months = reference.getMonth() - start.getMonth()
  if (reference.getDate() < start.getDate()) months--
  if (months < 0) { years--; months += 12 }
  if (years <= 0) return `${months} ${months === 1 ? 'mes' : 'meses'}`
  return `${years} ${years === 1 ? 'año' : 'años'}${months > 0 ? ` y ${months} ${months === 1 ? 'mes' : 'meses'}` : ''}`
}