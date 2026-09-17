import { Shield, GraduationCap } from 'lucide-react'
import { calcTenure } from '@/lib/dateUtils'

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
  process: { label: 'En proceso', color: '#1270B7', bg: 'rgba(18,112,183,0.12)' },
}

export const tableHeaders = ['Nombre', 'Cargo', 'Estado', 'Fecha de creación']

export const gymTenure = (joinedAt: string): string => calcTenure(joinedAt)
