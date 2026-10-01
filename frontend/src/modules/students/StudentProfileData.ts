import { Activity, BarChart2, Calendar, Target } from 'lucide-react'
import type { Acudiente } from '@/data/students'

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
  lastVisit: string
  avatar: string
  valoraciones?: number
  faculty?: string
  semester?: string
  nextAssessment?: string
  nextApptType?: 'valoracion' | 'registro' | 'seguimiento' | 'otro'
  nextApptOther?: string
  status?: 'active' | 'inactive' | 'process'
  role?: 'estudiante' | 'profesor' | 'administrativo'
  nivelFormacion?: string
  area?: string
  cargo?: string
  firma?: string
  huella?: string
  acudiente?: Acudiente
  tipo_usuario?: TipoUsuario
}

export type TipoUsuario = 'estudiante' | 'profesor' | 'administrativo'

export function getTipoUsuario(student: { tipo_usuario?: TipoUsuario; role?: TipoUsuario }): TipoUsuario {
  return student.tipo_usuario ?? student.role ?? 'estudiante'
}

export function esEstudiante(student: { tipo_usuario?: TipoUsuario; role?: TipoUsuario }): boolean {
  return getTipoUsuario(student) === 'estudiante'
}

export function esPersonal(student: { tipo_usuario?: TipoUsuario; role?: TipoUsuario }): boolean {
  const tipo = getTipoUsuario(student)
  return tipo === 'profesor' || tipo === 'administrativo'
}

export const RED = '#E63946'

export const cardStyle = {
  background: '#FFFFFF',
  border: '1px solid rgba(0,0,0,0.04)',
  borderRadius: 20,
  boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.03), 0 12px 32px rgba(0,0,0,0.02)',
}

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


