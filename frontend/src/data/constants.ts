import chestIcon from '../assets/icons/muscles/chest.webp'
import backIcon from '../assets/icons/muscles/back.webp'
import shouldersIcon from '../assets/icons/muscles/shoulders.webp'
import armIcon from '../assets/icons/muscles/arm.webp'
import legIcon from '../assets/icons/muscles/leg.webp'
import absIcon from '../assets/icons/muscles/abs.webp'
import cardioIcon from '../assets/icons/muscles/cardio.webp'
import fullBodyIcon from '../assets/icons/muscles/full-body.webp'
import type { Status } from './types'

export const BLUE = '#1270B7'
export const GREEN = '#30D158'
export const YELLOW = '#F1C827'
export const RED = '#F43843'
export const ORANGE = '#FF9500'
export const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #7ec8e3)'
export const GREEN_GRAD = 'linear-gradient(135deg, #00fb64, #009b95)'
export const ORANGE_GRAD = 'linear-gradient(135deg, #FF9500, #FF6B00)'

export const muscleIcons: Record<string, string> = {
  Pecho: chestIcon,
  Espalda: backIcon,
  Hombros: shouldersIcon,
  Brazos: armIcon,
  Piernas: legIcon,
  'Abdomen/Core': absIcon,
  Cardio: cardioIcon,
  General: fullBodyIcon,
}

export const muscleToZones: Record<string, string[]> = {
  Cardio: ['Cardio'],
  Pecho: ['Pesas Libres', 'Máquinas'],
  Espalda: ['Pesas Libres', 'Máquinas'],
  Hombros: ['Pesas Libres', 'Máquinas'],
  Brazos: ['Pesas Libres', 'Máquinas'],
  Piernas: ['Pesas Libres', 'Máquinas'],
  'Abdomen/Core': ['Pesas Libres'],
  General: [],
}

export const statusConfig: Record<Status, { label: string; color: string; bg: string; border: string }> = {
  active: { label: 'Activo', color: GREEN, bg: 'rgba(48,209,88,0.08)', border: 'rgba(48,209,88,0.15)' },
  maintenance: { label: 'Mantenimiento', color: YELLOW, bg: 'rgba(241,200,39,0.08)', border: 'rgba(241,200,39,0.15)' },
  inactive: { label: 'Inactiva', color: RED, bg: 'rgba(244,56,67,0.08)', border: 'rgba(244,56,67,0.15)' },
}

export const meshInputBg = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)'
export const meshInputHover = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(0,0,0,0.04)'
