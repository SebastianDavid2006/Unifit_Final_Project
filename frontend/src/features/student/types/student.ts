export interface Student {
  id: string
  name: string
  firstName: string
  lastName: string
  email: string
  gender: 'M' | 'F'
  avatar: string
  adherence: number
  /* -- Datos reales de perfil (fuente: GET /usuarios/me) -- */
  secondName?: string
  secondLastName?: string
  genderLabel?: string
  documentType?: string
  documentNumber?: string
  birthDate?: string
  eps?: string
  bloodType?: string
  phone?: string
  contactName?: string
  contactPhone?: string
  contactRelation?: string
  carnetId?: string
  career?: string
  institution?: string
  semestre?: number | null
  modality?: string
  jornada?: string
  roleLabel?: string
  statusLabel?: string
  cargo?: string
  area?: string
}

export type MobileTab = 'home' | 'routines' | 'agenda' | 'profile'

export interface ExerciseRow {
  idRutinaEjercicio?: string
  name: string
  sets: string
  reps: string
  rest: string
  weight: string
  muscle: string
  secondaryMuscle?: string
  groups?: string[]
  level?: string
  dia?: string
  instructions: string
  image?: string
  machines?: { id: string; nombre: string; imageUrl: string }[]
}

export interface RoutineProgress {
  completedSessions: number
  totalSessions: number
  adherence: number
  lastSession: string | null
}

export interface StudentRoutine {
  id: string
  name: string
  createdAt: string
  duration: string
  frequency: string
  level: 'Principiante' | 'Intermedio' | 'Avanzado'
  focus: string
  current?: boolean
  estado: 'activa' | 'finalizada' | 'cancelada'
  days?: string[]
  rows: ExerciseRow[]
  assessmentNum: number
  progress: RoutineProgress
}

export interface AgendaSlot {
  time: string
  taken: boolean
}

export interface DayAvailability {
  date: Date
  isHoliday: boolean
  holidayName?: string
  isCoachDay: boolean
  slots: AgendaSlot[]
}