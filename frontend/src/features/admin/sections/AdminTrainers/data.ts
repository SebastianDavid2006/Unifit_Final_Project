import { Shield, GraduationCap } from 'lucide-react'

export const RED = '#F43843'
export const BLUE = '#1270B7'
export const GREEN = '#22C55E'
export const RED_GRAD = 'linear-gradient(135deg, #F43843, #FF6B8A, #CC0033)'
export const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #7ec8e3)'
export const GREEN_BLUE_GRAD = 'linear-gradient(135deg, #22C55E, #1270B7)'

export const PAGE_SIZE = 6

export type RoleFilter = 'all' | 'trainer' | 'admin'

export const roleMeta: Record<'trainer' | 'admin', { label: string; icon: typeof Shield | typeof GraduationCap; color: string; bg: string; border: string }> = {
  trainer: { label: 'Entrenador', icon: GraduationCap, color: BLUE, bg: 'rgba(18,112,183,0.1)', border: 'rgba(18,112,183,0.18)' },
  admin: { label: 'Administrador', icon: Shield, color: RED, bg: 'rgba(244,56,67,0.1)', border: 'rgba(244,56,67,0.18)' },
}

export const statusMeta = {
  active: { label: 'Activo', color: '#1E8E3E', bg: 'rgba(34,197,94,0.13)' },
  inactive: { label: 'Inactivo', color: '#E31B23', bg: 'rgba(244,67,54,0.12)' },
}

export const tableHeaders = ['Nombre', 'Cargo', 'Estado', 'Fecha de creación']

const MONTHS: Record<string, number> = { Ene: 0, Feb: 1, Mar: 2, Abr: 3, May: 4, Jun: 5, Jul: 6, Ago: 7, Sep: 8, Oct: 9, Nov: 10, Dic: 11 }

export function gymTenure(joinedAt: string): string {
  const m = joinedAt.match(/(\d{1,2}) (\w{3}) (\d{4})/)
  if (!m || MONTHS[m[2]] === undefined) return joinedAt
  const start = new Date(Number(m[3]), MONTHS[m[2]], Number(m[1]))
  const now = new Date()
  let years = now.getFullYear() - start.getFullYear()
  let months = now.getMonth() - start.getMonth()
  if (now.getDate() < start.getDate()) months--
  if (months < 0) { years--; months += 12 }
  if (years <= 0) return `${months} ${months === 1 ? 'mes' : 'meses'}`
  return `${years} ${years === 1 ? 'año' : 'años'}${months > 0 ? ` y ${months} ${months === 1 ? 'mes' : 'meses'}` : ''}`
}
