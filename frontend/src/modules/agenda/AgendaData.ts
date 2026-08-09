export const RED = '#F43843'
export const BLUE = '#1270B7'
export const YELLOW = '#F1C827'
export const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #1A8CDB, #0D5F9E)'
export const GOLD_GRAD = 'linear-gradient(135deg, #F1C827, #FFD60A, #D4A800)'

export interface Appointment {
  id: string; date: string; startTime: string; endTime: string
  type: 'class' | 'initial_assessment' | 'physical_assessment' | 'registration' | 'event'
  title: string; studentName?: string; trainer?: string; notes?: string
}

export const dayKey = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB']
export const dayLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
export const dayLabelsGetDay = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
export const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

export const DAY_GRAD = 'linear-gradient(135deg, #1270B7, #7ec8e3)'

export const WEEK_DAYS_6: { key: string; label: string; short: string }[] = [
  { key: 'LUN', label: 'Lunes', short: 'Lun' },
  { key: 'MAR', label: 'Martes', short: 'Mar' },
  { key: 'MIÉ', label: 'Miércoles', short: 'Mié' },
  { key: 'JUE', label: 'Jueves', short: 'Jue' },
  { key: 'VIE', label: 'Viernes', short: 'Vie' },
  { key: 'SÁB', label: 'Sábado', short: 'Sáb' },
]
