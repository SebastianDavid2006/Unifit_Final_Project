import { BLUE, monthNames } from '../AgendaData'
import { meshInputBg, meshInputHover } from '@/data/shared/constants'

export const typeColors: Record<string, string> = {
  class: BLUE,
  initial_assessment: '#FF6B35',
  physical_assessment: '#30D158',
  registration: '#AF52DE',
  event: '#FF9F0A',
}

export const typeLabels: Record<string, string> = {
  class: 'Clase',
  initial_assessment: 'Valoración Inicial',
  physical_assessment: 'Seguimiento',
  registration: 'Registro',
  event: 'Otro',
}

export interface DayStatus {
  active: boolean
  open: string
  close: string
  holiday?: string | null
}

// Rejilla horaria de las vistas. Fuente única = backend GET /agenda/bloques (regla 1).
// El módulo la puebla vía setTimeSlots(bloques) al cargar; el default espejo los 14 bloques canónicos.
export let TIME_SLOTS_WEEK: string[] = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']

export function setTimeSlots(inicios: string[]) {
  TIME_SLOTS_WEEK = inicios.map((h) => {
    const [hh, mm] = h.split('-')[0].split(':')
    return `${String(Number(hh)).padStart(2, '0')}:${mm}`
  })
}

export const MESH_GRAD = 'radial-gradient(ellipse at 20% 30%, rgba(241,200,39,0.2) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(230,57,70,0.18) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(18,112,183,0.35) 0%, transparent 50%), rgba(18,112,183,0.88)'

export function fmtDate(d: Date) {
  const y = d.getFullYear(); const m = String(d.getMonth() + 1).padStart(2, '0'); const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

export function fmtShortDate(ds: string) {
  if (!ds) return ''
  const d = new Date(ds + 'T00:00:00')
  return `${d.getDate()} ${monthNames[d.getMonth()].slice(0, 3)}`
}

export function getWeekDates(ref: Date): Date[] {
  const d = new Date(ref)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  const week: Date[] = []
  for (let i = 0; i < 7; i++) {
    week.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  return week
}

export function getMonthGrid(year: number, month: number): (Date | null)[][] {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const pad = first.getDay() === 0 ? 6 : first.getDay() - 1
  const weeks: (Date | null)[][] = []
  let wk: (Date | null)[] = []
  for (let i = 0; i < pad; i++) wk.push(null)
  for (let d = 1; d <= last.getDate(); d++) {
    const dt = new Date(year, month, d)
    wk.push(dt)
    if (wk.length === 7) { weeks.push(wk); wk = [] }
  }
  while (wk.length < 7) wk.push(null)
  if (wk.some(x => x)) weeks.push(wk)
  return weeks
}

export function enterMesh(el: HTMLElement) {
  if (el !== document.activeElement) { el.style.background = meshInputHover; el.style.borderColor = 'rgba(0,0,0,0.06)' }
}
export function leaveMesh(el: HTMLElement) {
  if (el !== document.activeElement) { el.style.background = meshInputBg; el.style.borderColor = 'transparent' }
}
export function focusMesh(el: HTMLElement) {
  el.style.borderColor = '#1270B7'; el.style.background = meshInputHover; el.style.boxShadow = '0 0 0 3px rgba(18,112,183,0.08)'
}
export function blurMesh(el: HTMLElement) {
  el.style.borderColor = 'transparent'; el.style.background = meshInputBg; el.style.boxShadow = 'none'
}
