import { Activity, BarChart2, Calendar, FileText } from 'lucide-react'

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
  id: number
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

export const routineExercises = [
  { name: 'Sentadilla con barra', sets: 4, reps: '8-10', weight: '80 kg', muscle: 'Cuádriceps', difficulty: 'Avanzado', calories: 95 },
  { name: 'Press de banca plano', sets: 4, reps: '8-10', weight: '70 kg', muscle: 'Pectoral', difficulty: 'Intermedio', calories: 80 },
  { name: 'Peso muerto', sets: 3, reps: '6-8', weight: '100 kg', muscle: 'Espalda baja', difficulty: 'Avanzado', calories: 110 },
  { name: 'Dominadas', sets: 3, reps: '8-12', weight: 'Peso corporal', muscle: 'Dorsal', difficulty: 'Intermedio', calories: 70 },
  { name: 'Press militar', sets: 3, reps: '10-12', weight: '50 kg', muscle: 'Hombros', difficulty: 'Intermedio', calories: 65 },
]

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
  { id: 'overview', label: 'General', icon: Activity },
  { id: 'progress', label: 'Actividad', icon: Calendar },
  { id: 'assessment', label: 'Evaluación Física', icon: BarChart2 },
  { id: 'documents', label: 'Documentos', icon: FileText },
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

export type ValuationForm = typeof emptyValuationForm

export const assessmentItems = [
    { num: 1, date: '15 May 2026', next: '01 Ago 2026', color: '#1270B7', type: 'Actual', evaluator: 'Carlos Ruiz', score: 87, routine: 'Rutina Hipertrofia Full Body', metrics: [{ label: 'Peso', value: '72 kg' }, { label: 'IMC', value: '23.4' }, { label: 'Grasa Corporal', value: '18%' }, { label: 'Masa Muscular', value: '32 kg' }], nivelActividad: 'Activo', objetivoTarjetas: ['Ganancia muscular', 'Acondicionamiento fisico'], objetivoDetalle: 'Incrementar masa muscular y mejorar la condición física general para competencias de fin de año.', estatura: '1.75 m', masaMagra: '31.2 kg', grasaVisceral: '8', presionArterial: '120/80', edadMetabolica: '25', aguaCorporal: '58%', resistenciaMuscular: 'Alta (30 min)', antecedentesSalud: [], observacionesEntrenador: 'Sin novedades relevantes. Muy buena disposición al entrenamiento.', diasDisponibles: ['Lunes', 'Miércoles', 'Viernes'], observacionesFinales: 'Seguir con la rutina de hipertrofia y controlar la ingesta proteica. Próxima valoración en agosto.' },
    { num: 2, date: '20 Feb 2026', next: null, color: '#FF9500', type: 'Seguimiento', evaluator: 'Carlos Ruiz', score: 82, routine: 'Rutina Fuerza Tren Superior', metrics: [{ label: 'Peso', value: '73 kg' }, { label: 'IMC', value: '23.8' }, { label: 'Grasa Corporal', value: '19%' }, { label: 'Masa Muscular', value: '31 kg' }], nivelActividad: 'Activo', objetivoTarjetas: ['Ganancia muscular'], objetivoDetalle: 'Aumentar fuerza en tren superior y mejorar los levantamientos básicos.', estatura: '1.75 m', masaMagra: '30.4 kg', grasaVisceral: '8', presionArterial: '122/80', edadMetabolica: '26', aguaCorporal: '57%', resistenciaMuscular: 'Media (20 min)', antecedentesSalud: ['Metabólico'], observacionesEntrenador: 'Seguimiento a la planificación de fuerza, buena respuesta a cargas.', diasDisponibles: ['Lunes', 'Martes', 'Jueves', 'Viernes'], observacionesFinales: 'Ajustar cargas progresivamente cada 3 semanas.' },
    { num: 3, date: '10 Nov 2025', next: null, color: '#FF9500', type: 'Seguimiento', evaluator: 'Carlos Ruiz', score: 78, routine: 'Rutina Resistencia', metrics: [{ label: 'Peso', value: '74 kg' }, { label: 'IMC', value: '24.1' }, { label: 'Grasa Corporal', value: '20%' }, { label: 'Masa Muscular', value: '30 kg' }], nivelActividad: 'Ligeramente activo', objetivoTarjetas: ['Acondicionamiento fisico', 'Salud'], objetivoDetalle: 'Mejorar resistencia cardiovascular y bienestar general.', estatura: '1.75 m', masaMagra: '29.6 kg', grasaVisceral: '9', presionArterial: '125/82', edadMetabolica: '27', aguaCorporal: '55%', resistenciaMuscular: 'Media (15 min)', antecedentesSalud: ['Cardiovascular'], observacionesEntrenador: 'Monitorear frecuencia cardíaca durante el cardio.', diasDisponibles: ['Martes', 'Jueves', 'Sábado'], observacionesFinales: 'Resistencia en aumento, continuar plan cardiovascular.' },
    { num: 4, date: '05 Jun 2025', next: null, color: '#FF9500', type: 'Seguimiento', evaluator: 'Laura Gómez', score: 80, routine: 'Rutina Full Body', metrics: [{ label: 'Peso', value: '74 kg' }, { label: 'IMC', value: '24.0' }, { label: 'Grasa Corporal', value: '19.5%' }, { label: 'Masa Muscular', value: '30.5 kg' }], nivelActividad: 'Activo', objetivoTarjetas: ['Perdida de peso'], objetivoDetalle: 'Reducir porcentaje graso manteniendo la masa muscular actual.', estatura: '1.75 m', masaMagra: '29.8 kg', grasaVisceral: '9', presionArterial: '123/81', edadMetabolica: '26', aguaCorporal: '56%', resistenciaMuscular: 'Media (18 min)', antecedentesSalud: [], observacionesEntrenador: 'Buena respuesta al cardio programado.', diasDisponibles: ['Lunes', 'Miércoles', 'Sábado'], observacionesFinales: 'Definición avanzando según lo esperado.' },
    { num: 5, date: '12 Dic 2024', next: null, color: '#FF9500', type: 'Seguimiento', evaluador: 'Laura Gómez', score: 75, routine: 'Rutina Tonificación', metrics: [{ label: 'Peso', value: '75 kg' }, { label: 'IMC', value: '24.5' }, { label: 'Grasa Corporal', value: '21%' }, { label: 'Masa Muscular', value: '29 kg' }], nivelActividad: 'Sedentario', objetivoTarjetas: ['Salud'], objetivoDetalle: 'Comenzar hábitos saludables y mejorar la calidad de vida.', estatura: '1.75 m', masaMagra: '29.1 kg', grasaVisceral: '10', presionArterial: '128/84', edadMetabolica: '28', aguaCorporal: '54%', resistenciaMuscular: 'Baja (10 min)', antecedentesSalud: ['Osteomuscular', 'Cardiovascular'], observacionesEntrenador: 'Inicio de rutina de adaptación, cuidar técnica en todos los ejercicios.', diasDisponibles: ['Martes', 'Jueves'], observacionesFinales: 'Adaptación a la rutina, priorizar técnica sobre carga.' },
    { num: 6, date: '20 Jul 2024', next: null, color: '#FF9500', type: 'Seguimiento', evaluador: 'Laura Gómez', score: 76, routine: 'Rutina Acondicionamiento', metrics: [{ label: 'Peso', value: '75 kg' }, { label: 'IMC', value: '24.4' }, { label: 'Grasa Corporal', value: '21%' }, { label: 'Masa Muscular', value: '29.2 kg' }], nivelActividad: 'Ligeramente activo', objetivoTarjetas: ['Acondicionamiento fisico'], objetivoDetalle: 'Mantener constancia y mejorar el acondicionamiento general.', estatura: '1.75 m', masaMagra: '29.0 kg', grasaVisceral: '10', presionArterial: '126/83', edadMetabolica: '28', aguaCorporal: '54%', resistenciaMuscular: 'Media (15 min)', antecedentesSalud: [], observacionesEntrenador: 'Asistencia regular a las sesiones.', diasDisponibles: ['Lunes', 'Martes', 'Miércoles', 'Jueves'], observacionesFinales: 'Continúa progresando de forma constante.' },
    { num: 7, date: '15 Mar 2024', next: null, color: '#FF9500', type: 'Seguimiento', evaluador: 'Laura Gómez', score: 72, routine: 'Rutina Básica', metrics: [{ label: 'Peso', value: '76 kg' }, { label: 'IMC', value: '24.8' }, { label: 'Grasa Corporal', value: '22%' }, { label: 'Masa Muscular', value: '28 kg' }], nivelActividad: 'Sedentario', objetivoTarjetas: ['Perdida de peso', 'Salud'], objetivoDetalle: 'Bajar de peso y reducir el riesgo cardiovascular.', estatura: '1.75 m', masaMagra: '28.6 kg', grasaVisceral: '11', presionArterial: '130/86', edadMetabolica: '29', aguaCorporal: '53%', resistenciaMuscular: 'Baja (8 min)', antecedentesSalud: ['Cardiovascular', 'Metabólico'], observacionesEntrenador: 'Controlar la intensidad inicial de las sesiones.', diasDisponibles: ['Miércoles', 'Viernes'], observacionesFinales: 'Requiere mayor constancia en la asistencia.' },
    { num: 8, date: '08 Oct 2023', next: null, color: '#E63946', type: 'Inicial', evaluator: 'Laura Gómez', score: 70, routine: 'Rutina Adaptación', metrics: [{ label: 'Peso', value: '77 kg' }, { label: 'IMC', value: '25.1' }, { label: 'Grasa Corporal', value: '23%' }, { label: 'Masa Muscular', value: '27 kg' }], nivelActividad: 'Sedentario', objetivoTarjetas: ['Salud'], objetivoDetalle: 'Iniciar actividad física por recomendación médica.', estatura: '1.75 m', masaMagra: '28.0 kg', grasaVisceral: '12', presionArterial: '132/88', edadMetabolica: '30', aguaCorporal: '52%', resistenciaMuscular: 'Baja (5 min)', antecedentesSalud: ['Osteomuscular', 'Respiratorio', 'Cardiovascular'], observacionesEntrenador: 'Valoración inicial, plan conservador de adaptación.', diasDisponibles: ['Martes', 'Jueves'], observacionesFinales: 'Ajustar rutina tras la primera evaluación de seguimiento.' },
  ]


