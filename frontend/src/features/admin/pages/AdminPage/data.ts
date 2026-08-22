import { LayoutDashboard, UserPlus, Settings, BarChart3, Building2 } from 'lucide-react'

export const RED = '#F43843'
export const BLUE = '#1270B7'
export const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #1A8CDB, #0D5F9E)'
export const RED_GRAD = 'linear-gradient(135deg, #F43843, #FF6B8A, #CC0033)'

export type AdminSection = 'dashboard' | 'trainers' | 'stats' | 'gym' | 'config'

export const sidebarItems: { id: AdminSection; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'trainers', label: 'Personal', icon: UserPlus },
  { id: 'stats', label: 'Estadísticas', icon: BarChart3 },
  { id: 'gym', label: 'Gestión', icon: Building2 },
  { id: 'config', label: 'Configuración', icon: Settings },
]

export const PILL_GRAD = 'radial-gradient(ellipse at 20% 30%, rgba(244,56,67,0.35) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(18,112,183,0.3) 0%, transparent 50%), radial-gradient(ellipse at 50% 90%, rgba(241,200,39,0.3) 0%, transparent 50%), rgba(244,56,67,0.85)'
export const GYM_TAB_GRAD = 'radial-gradient(ellipse at 20% 30%, rgba(230,57,70,0.35) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(18,112,183,0.3) 0%, transparent 50%), radial-gradient(ellipse at 50% 90%, rgba(241,200,39,0.3) 0%, transparent 50%), rgba(230,57,70,0.85)'
export const GYM_TAB_SHADOW = '0 2px 8px rgba(230,57,70,0.2), 0 0 20px rgba(230,57,70,0.1)'
export const STATS_BTN_GRAD = 'radial-gradient(ellipse at 20% 30%, rgba(244,56,67,0.3) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(18,112,183,0.35) 0%, transparent 50%), radial-gradient(ellipse at 50% 90%, rgba(241,200,39,0.3) 0%, transparent 50%), rgba(18,112,183,0.85)'
export const STATS_BTN_SHADOW = '0 4px 20px rgba(18,112,183,0.35)'
export const EQUIP_GRAD = 'radial-gradient(ellipse at 30% 25%, #3A9BDC 0%, transparent 60%), radial-gradient(ellipse at 75% 70%, #1270B7 0%, transparent 55%), radial-gradient(ellipse at 90% 25%, rgba(244,56,67,0.5) 0%, transparent 45%), radial-gradient(ellipse at 10% 85%, rgba(241,200,39,0.45) 0%, transparent 45%), #1270B7'
export const EQUIP_SHADOW = '0 2px 8px rgba(18,112,183,0.25)'
export const GYM_FLOAT_SHADOW = '0 2px 8px rgba(244,56,67,0.25)'
