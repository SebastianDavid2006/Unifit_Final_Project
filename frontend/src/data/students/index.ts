export interface Acudiente {
  primerNombre: string
  segundoNombre?: string
  primerApellido: string
  segundoApellido?: string
  tipoDocumento: string
  documento: string
  parentesco?: string
  telefonoContacto?: string
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
  status: 'active' | 'inactive' | 'process'
  lastVisit: string
  nextAssessment: string
  avatar: string
  goal: string
  sessions: number
  valoraciones: number
  weight: number
  height: number
  tipo_usuario?: 'estudiante' | 'profesor' | 'administrativo'
  cargo?: string
  area?: string
  createdAt?: string
  aceptaContrato?: boolean
  aceptaTratamiento?: boolean
  parqRealizado?: boolean
  acudiente?: Acudiente
}
