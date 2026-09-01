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
  { id: '1', name: 'Ana García Martínez', firstName: 'Ana', secondName: 'María', lastName: 'García', secondLastName: 'Martínez', documentType: 'CC', documentNumber: '1234567890', birthDate: '15/03/1998', gender: 'Femenino', eps: 'Sanitas', bloodType: 'O+', email: 'ana.garcia@email.com', phone: '3001234567', contactName: 'Carlos García', contactPhone: '3107654321', contactRelation: 'Padre', carnetId: 'UNI-001', program: 'Sistemas', institution: 'Universitaria de Colombia', faculty: 'Ingeniería de Sistemas', semestre: 6, semester: '6', modality: 'Presencial', jornada: 'Diurna', graduationStatus: 'No egresado', adherence: 92, risk: 'low' as const, status: 'active' as const, lastVisit: 'Hoy, 7:30 AM', nextAssessment: '12/08/2026', avatar: 'AG', goal: 'Quiero reducir mi porcentaje de grasa corporal de 22% a 17% y mejorar mi composición corporal a través de entrenamiento de fuerza y cardio moderado, acompañado de un plan nutricional personalizado', sessions: 24, weight: 62, height: 165, tipo_usuario: 'estudiante', cargo: 'Estudiante', area: 'Ingeniería' },
  { id: '2', name: 'Carlos Rodríguez', firstName: 'Carlos', secondName: 'Andrés', lastName: 'Rodríguez', secondLastName: 'López', documentType: 'CC', documentNumber: '2345678901', birthDate: '22/07/1995', gender: 'Masculino', eps: 'Compensar', bloodType: 'A+', email: 'carlos.rodriguez@email.com', phone: '3012345678', contactName: 'María Rodríguez', contactPhone: '3118765432', contactRelation: 'Madre', carnetId: 'UNI-002', program: 'Medicina', institution: 'Universitaria de Bogotá', faculty: 'Auxiliar en Enfermería', semestre: 4, semester: '4', modality: 'Presencial', jornada: 'Nocturna', graduationStatus: 'No egresado', adherence: 34, risk: 'high' as const, status: 'inactive' as const, lastVisit: 'Hace 12 días', nextAssessment: '20/08/2026', avatar: 'CR', goal: 'Fuerza', sessions: 8, weight: 78, height: 178, tipo_usuario: 'estudiante', cargo: 'Estudiante', area: 'Ciencias de la Salud' },
  { id: '3', name: 'María Fernández', firstName: 'María', secondName: 'José', lastName: 'Fernández', secondLastName: 'Díaz', documentType: 'CC', documentNumber: '3456789012', birthDate: '10/11/1997', gender: 'Femenino', eps: 'Sura', bloodType: 'B+', email: 'maria.fernandez@email.com', phone: '3023456789', contactName: 'Pedro Fernández', contactPhone: '3129876543', contactRelation: 'Padre', carnetId: 'UNI-003', program: 'Derecho', institution: 'Universitaria de Colombia', faculty: 'Derecho', semestre: 8, semester: '8', modality: 'Virtual', jornada: 'Diurna', graduationStatus: 'Egresado', adherence: 78, risk: 'low' as const, status: 'process' as const, lastVisit: 'Ayer', nextAssessment: 'Por agendar', avatar: 'MF', goal: 'Resistencia', sessions: 19, weight: 58, height: 162, tipo_usuario: 'estudiante', cargo: 'Estudiante', area: 'Ciencias Sociales' },
  { id: '4', name: 'Diego López', firstName: 'Diego', secondName: 'Alejandro', lastName: 'López', secondLastName: 'Mora', documentType: 'CE', documentNumber: '4567890123', birthDate: '05/06/1994', gender: 'Masculino', eps: 'Sanitas', bloodType: 'AB+', email: 'diego.lopez@email.com', phone: '3034567890', contactName: 'Ana López', contactPhone: '3130987654', contactRelation: 'Madre', carnetId: 'UNI-004', program: 'Administración', institution: 'Universitaria de Bogotá', faculty: 'Administración de Empresas', semestre: 2, semester: '2', modality: 'Presencial', jornada: 'Diurna', graduationStatus: 'No egresado', adherence: 51, risk: 'medium' as const, status: 'active' as const, lastVisit: 'Hace 5 días', nextAssessment: '25/08/2026', avatar: 'DL', goal: 'Masa muscular', sessions: 14, weight: 82, height: 181, tipo_usuario: 'estudiante', cargo: 'Estudiante', area: 'Administración' },
  { id: '5', name: 'Valentina Torres', firstName: 'Valentina', secondName: '', lastName: 'Torres', secondLastName: 'Paz', documentType: 'CC', documentNumber: '5678901234', birthDate: '28/02/2000', gender: 'Femenino', eps: 'Salud Total', bloodType: 'O-', email: 'valentina.torres@email.com', phone: '3045678901', contactName: 'Luis Torres', contactPhone: '3141098765', contactRelation: 'Padre', carnetId: 'UNI-005', program: 'Biología', institution: 'Universitaria de Colombia', faculty: 'Medicina Veterinaria y Zootecnia', semestre: 5, semester: '5', modality: 'Presencial', jornada: 'Nocturna', graduationStatus: 'No egresado', adherence: 88, risk: 'low' as const, status: 'active' as const, lastVisit: 'Hoy, 9:15 AM', nextAssessment: '10/08/2026', avatar: 'VT', goal: 'Flexibilidad', sessions: 31, weight: 55, height: 160, tipo_usuario: 'estudiante', cargo: 'Estudiante', area: 'Ciencias Naturales' },
  { id: '6', name: 'Sebastián Herrera', firstName: 'Sebastián', secondName: '', lastName: 'Herrera', secondLastName: 'Castro', documentType: 'CC', documentNumber: '6789012345', birthDate: '14/09/1996', gender: 'Masculino', eps: 'Famisanar', bloodType: 'A-', email: 'sebastian.herrera@email.com', phone: '3056789012', contactName: 'Laura Herrera', contactPhone: '3152109876', contactRelation: 'Hermana', carnetId: 'UNI-006', program: 'Industrial', institution: 'Universitaria de Bogotá', faculty: 'Ingeniería Industrial', semestre: 9, semester: '9', modality: 'Presencial', jornada: 'Diurna', graduationStatus: 'Egresado', adherence: 22, risk: 'high' as const, status: 'inactive' as const, lastVisit: 'Hace 18 días', nextAssessment: '22/08/2026', avatar: 'SH', goal: 'Cardio', sessions: 4, weight: 91, height: 183, tipo_usuario: 'estudiante', cargo: 'Estudiante', area: 'Ingeniería' },
  { id: '7', name: 'Luisa Mendoza', firstName: 'Luisa', secondName: 'Fernanda', lastName: 'Mendoza', secondLastName: 'Ríos', documentType: 'CC', documentNumber: '7890123456', birthDate: '03/12/1999', gender: 'Femenino', eps: 'Sanitas', bloodType: 'O+', email: 'luisa.mendoza@email.com', phone: '3067890123', contactName: 'Raúl Mendoza', contactPhone: '3163210987', contactRelation: 'Padre', carnetId: 'UNI-007', program: 'Artes Plásticas', institution: 'Universitaria de Colombia', faculty: 'Diseño Gráfico', semestre: 3, semester: '3', modality: 'Presencial', jornada: 'Diurna', graduationStatus: 'No egresado', adherence: 95, risk: 'low' as const, status: 'process' as const, lastVisit: 'Hoy, 6:00 AM', nextAssessment: 'Por agendar', avatar: 'LM', goal: 'Bienestar', sessions: 42, weight: 60, height: 168, tipo_usuario: 'estudiante', cargo: 'Estudiante', area: 'Arte y Diseño' },
  { id: '8', name: 'Andrés Camilo Vega Ortiz', firstName: 'Andrés', secondName: 'Camilo', lastName: 'Vega', secondLastName: 'Ortiz', documentType: 'CC', documentNumber: '8901234567', birthDate: '19/05/1997', gender: 'Masculino', eps: 'Savia Salud', bloodType: 'O+', email: 'andres.vega@email.com', phone: '3078901234', contactName: 'Rosa Vega', contactPhone: '3174321098', contactRelation: 'Madre', carnetId: 'UNI-008', program: 'Enfermería', institution: 'Universitaria de Bogotá', faculty: 'Auxiliar en Enfermería', semestre: 7, semester: '7', modality: 'Presencial', jornada: 'Diurna', graduationStatus: 'No egresado', adherence: 63, risk: 'medium' as const, status: 'active' as const, lastVisit: 'Hace 2 días', nextAssessment: '30/08/2026', avatar: 'AV', goal: 'Fuerza', sessions: 17, weight: 74, height: 176, tipo_usuario: 'estudiante', cargo: 'Estudiante', area: 'Ciencias de la Salud' },
]
