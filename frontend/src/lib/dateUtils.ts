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