import type { ComponentType } from 'react'
import { StudentsView } from '@/assets/models/ui/users/students/StudentsModel'
import { StudentCardView } from '@/assets/models/ui/objects/student_card/StudentCardModel'
import { CalendarView } from '@/assets/models/ui/objects/calendar/CalendarModel'
import { ListView } from '@/assets/models/ui/objects/list/ListModel'

export const CARD_COLORS = [
  { bg: 'rgba(18,112,183,0.08)', icon: 'rgba(18,112,183,0.15)', text: '#1270B7' },
  { bg: 'rgba(191,90,242,0.08)', icon: 'rgba(191,90,242,0.15)', text: '#BF5AF2' },
  { bg: 'rgba(48,209,88,0.08)', icon: 'rgba(48,209,88,0.15)', text: '#30D158' },
  { bg: 'rgba(241,200,39,0.08)', icon: 'rgba(241,200,39,0.15)', text: '#F1C827' },
]

const today = new Date()
const monday = new Date(today)
monday.setDate(today.getDate() - ((today.getDay() + 6) % 7))

export type DashboardCard = { label: string; value: string; view: ComponentType }

export const dashboardCards: DashboardCard[] = [
  { label: 'Estudiantes Registrados', value: '847', view: StudentCardView },
  { label: 'Asistencias de Hoy', value: '12', view: ListView },
  { label: 'Personas Activas', value: '43', view: StudentsView },
  { label: 'Citas Programadas', value: '24', view: CalendarView },
]

const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

export const weekDays = dayNames.map((name, i) => {
  const d = new Date(monday)
  d.setDate(monday.getDate() + i)
  return { name, date: d.getDate(), isToday: d.toDateString() === today.toDateString() }
})

export const weeklyAttendance = weekDays.map(wd => ({
  day: wd.isToday ? 'Hoy' : `${wd.name} ${wd.date}`,
  asistentes: Math.round(20 + Math.random() * 70),
  isToday: wd.isToday,
}))

export const topCareers = [
  { name: 'Administración de Empresas', label: 'Adm. Empresas', students: 42, color: '#1270B7' },
  { name: 'Ingeniería de Software', label: 'Ing. Software', students: 40, color: '#30D158' },
  { name: 'Auxiliar en Enfermería', label: 'Enfermería', students: 38, color: '#FF9F0A' },
  { name: 'Contaduría Pública', label: 'Contaduría', students: 36, color: '#BF5AF2' },
  { name: 'Auxiliar Administrativo', label: 'Adm. Auxiliar', students: 35, color: '#F43843' },
  { name: 'Ingeniería de Sistemas', label: 'Sistemas', students: 34, color: '#5E5CE6' },
  { name: 'Diseño Gráfico', label: 'Diseño', students: 33, color: '#FF6482' },
  { name: 'Ingeniería Industrial', label: 'Ing. Industrial', students: 31, color: '#00C7BE' },
  { name: 'Derecho', label: 'Derecho', students: 30, color: '#64D2FF' },
  { name: 'Operaciones Software y Redes', label: 'Software y Redes', students: 30, color: '#FF9F0A' },
]
