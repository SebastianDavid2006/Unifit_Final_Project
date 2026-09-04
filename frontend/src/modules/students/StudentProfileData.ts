import { Activity, BarChart2, Calendar, Target } from 'lucide-react'

export const ROUTINE_CATEGORIES = ['Pecho', 'Espalda', 'Hombros', 'Brazos', 'Piernas', 'Abdomen/Core', 'Cardio', 'General', 'Tren Superior', 'Tren Inferior']

export const ROUTINE_MUSCLE_TO_CAT: Record<string, string> = {
  Pecho: 'Pecho',
  Espalda: 'Espalda',
  Hombros: 'Hombros',
  Bíceps: 'Brazos',
  Tríceps: 'Brazos',
  Cuádriceps: 'Piernas',
  Glúteos: 'Piernas',
  Isquiotibiales: 'Piernas',
  Pantorrilla: 'Piernas',
  Core: 'Abdomen/Core',
}

export interface Student {
  id: string
  name: string
  firstName: string
  secondName: string
  lastName: string
  secondLastName: string
  documentType: string
  documentNumber: string
  birthDate: string
  gender: string
  eps: string
  bloodType: string
  epsCertificate?: string
  email: string
  phone: string
  contactName: string
  contactPhone: string
  contactRelation?: string
  carnetId: string
  program: string
  institution: string
  semestre: number
  modality: string
  jornada: string
  graduationStatus: string
  adherence: number
  risk: 'low' | 'medium' | 'high'
  lastVisit: string
  avatar: string
  goal: string
  sessions: number
  weight: number
  height: number
  faculty?: string
  semester?: string
  nextAssessment?: string
  status?: 'active' | 'inactive' | 'process'
  role?: 'estudiante' | 'profesor' | 'administrador'
  nivelFormacion?: string
  area?: string
  cargo?: string
  firma?: string
  huella?: string
}

export const RED = '#E63946'

export const cardStyle = {
  background: '#FFFFFF',
  border: '1px solid rgba(0,0,0,0.04)',
  borderRadius: 20,
  boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.03), 0 12px 32px rgba(0,0,0,0.02)',
}

export interface AttendanceRecord {
  dia: string
  fecha: string
  entrada: string
  salida: string
  duracion: string
}

export const historialAsistencia: AttendanceRecord[] = [
  { dia: 'Lunes',    fecha: '04 Mayo',  entrada: '06:30 AM', salida: '08:15 AM', duracion: '1h 45min' },
  { dia: 'Martes',   fecha: '05 Mayo',  entrada: '07:00 AM', salida: '08:30 AM', duracion: '1h 30min' },
  { dia: 'Miércoles',fecha: '06 Mayo',  entrada: '06:45 AM', salida: '08:00 AM', duracion: '1h 15min' },
  { dia: 'Viernes',  fecha: '08 Mayo',  entrada: '07:15 AM', salida: '09:00 AM', duracion: '1h 45min' },
  { dia: 'Lunes',    fecha: '11 Mayo',  entrada: '06:30 AM', salida: '08:15 AM', duracion: '1h 45min' },
  { dia: 'Martes',   fecha: '12 Mayo',  entrada: '07:00 AM', salida: '08:45 AM', duracion: '1h 45min' },
  { dia: 'Miércoles',fecha: '13 Mayo',  entrada: '06:45 AM', salida: '08:00 AM', duracion: '1h 15min' },
  { dia: 'Jueves',   fecha: '14 Mayo',  entrada: '07:00 AM', salida: '08:30 AM', duracion: '1h 30min' },
  { dia: 'Viernes',  fecha: '15 Mayo',  entrada: '06:30 AM', salida: '08:15 AM', duracion: '1h 45min' },
  { dia: 'Lunes',    fecha: '18 Mayo',  entrada: '07:00 AM', salida: '08:00 AM', duracion: '1h 00min' },
]

export const TABS = [
  { id: 'general', label: 'General', icon: Activity },
  { id: 'actividad', label: 'Actividad', icon: Calendar },
  { id: 'valoracion', label: 'Evaluación Física', icon: BarChart2 },
] as const

export const emptyValuationForm = {
    nivelActividad: '', objetivoTarjetas: [] as string[], objetivoDetalle: '',
    peso: '', estatura: '', imc: '', grasaCorporal: '',
    masaMuscular: '', masaMagra: '', grasaVisceral: '',
    presionArterial: '', edadMetabolica: '', aguaCorporal: '', resistenciaMuscular: '',
    antecedentesSalud: [] as string[], observacionesEntrenador: '',
    diasDisponibles: [] as string[], observacionesFinales: '',
  }

export const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

export const numOnly = (s: any) => String(s ?? '').replace(/[^\d.]/g, '')

export type ValuationForm = typeof emptyValuationForm

export interface AssessmentItem {
  num: number
  date: string
  next?: string | null
  color: string
  type: string
  evaluator?: string
  evaluador?: string
  score: number
  metrics: { label: string; value: string }[]
  nivelActividad: string
  objetivoTarjetas: string[]
  objetivoDetalle: string
  estatura: string
  masaMagra: string
  grasaVisceral: string
  presionArterial: string
  edadMetabolica: string
  aguaCorporal: string
  resistenciaMuscular: string
  antecedentesSalud: string[]
  observacionesEntrenador: string
  diasDisponibles?: string[]
  observacionesFinales: string
}

export const assessmentItems: AssessmentItem[] = []


