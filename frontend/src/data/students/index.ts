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
  email: string
  phone: string
  contactName: string
  contactPhone: string
  contactRelation: string
  carnetId: string
  program: string
  institution: string
  faculty: string
  semestre: number
  semester: string
  modality: string
  jornada: string
  graduationStatus: string
  adherence: number
  risk: 'high' | 'medium' | 'low'
  status: 'active' | 'inactive' | 'process'
  lastVisit: string
  nextAssessment: string
  avatar: string
  goal: string
  sessions: number
  weight: number
  height: number
  tipo_usuario?: 'estudiante' | 'profesor' | 'administrativo'
  cargo?: string
  area?: string
}

export const students: Student[] = [
  { id: 'mock-1', name: 'María Fernández', firstName: 'María', secondName: 'José', lastName: 'Fernández', secondLastName: 'Díaz', documentType: 'CC', documentNumber: '3456789012', birthDate: '10/11/1997', gender: 'Femenino', eps: 'Sura', bloodType: 'B+', email: 'maria.fernandez@email.com', phone: '3023456789', contactName: 'Pedro Fernández', contactPhone: '3129876543', contactRelation: 'Padre', carnetId: 'UNI-003', program: 'Derecho', institution: 'Universitaria de Colombia', faculty: 'Derecho', semestre: 8, semester: '8', modality: 'Virtual', jornada: 'Diurna', graduationStatus: 'Egresado', adherence: 78, risk: 'low' as const, status: 'process' as const, lastVisit: 'Ayer', nextAssessment: 'Por agendar', avatar: 'MF', goal: 'Resistencia', sessions: 19, weight: 58, height: 162, tipo_usuario: 'estudiante', cargo: 'Estudiante', area: 'Ciencias Sociales' },
  { id: 'mock-2', name: 'Ana García Martínez', firstName: 'Ana', secondName: 'María', lastName: 'García', secondLastName: 'Martínez', documentType: 'CC', documentNumber: '1234567890', birthDate: '15/03/1998', gender: 'Femenino', eps: 'Sanitas', bloodType: 'O+', email: 'ana.garcia@email.com', phone: '3001234567', contactName: 'Carlos García', contactPhone: '3107654321', contactRelation: 'Padre', carnetId: 'UNI-001', program: 'Sistemas', institution: 'Universitaria de Colombia', faculty: 'Ingeniería de Sistemas', semestre: 6, semester: '6', modality: 'Presencial', jornada: 'Diurna', graduationStatus: 'No egresado', adherence: 92, risk: 'low' as const, status: 'active' as const, lastVisit: 'Hoy, 7:30 AM', nextAssessment: '12/08/2026', avatar: 'AG', goal: 'Reducir grasa corporal', sessions: 24, weight: 62, height: 165, tipo_usuario: 'estudiante', cargo: 'Estudiante', area: 'Ingeniería' },
]
