import type { RoutineRow } from '@/modules/students/aiRoutineTypes'

export function esFilaValida(fila: RoutineRow): boolean {
  if (!fila.name?.trim()) return false
  const sets = (fila.sets ?? '').trim()
  if (!sets || parseInt(sets, 10) < 1) return false
  const [minRaw, maxRaw] = (fila.reps ?? '').split('-')
  const min = parseInt((minRaw ?? '').trim(), 10)
  const max = parseInt((maxRaw ?? '').trim(), 10)
  if (!Number.isInteger(min) || min < 1 || !Number.isInteger(max) || max < 1 || min > max) return false
  const rest = (fila.rest ?? '').trim()
  if (!rest || parseInt(rest, 10) < 1) return false
  return true
}

export function diasUsados(diasExplicitos: string[], filas: RoutineRow[]): string[] {
  return [...new Set([...diasExplicitos, ...filas.map(f => f.dia)])]
}

export function diasIncompletos(diasExplicitos: string[], filas: RoutineRow[]): string[] {
  return diasUsados(diasExplicitos, filas).filter(d => {
    const delDia = filas.filter(f => f.dia === d)
    return delDia.length === 0 || !delDia.every(esFilaValida)
  })
}