export interface Trainer {
  id: string
  name: string
  firstName: string
  secondName: string
  lastName: string
  secondLastName: string
  email: string
  phone: string
  document: string
  speciality: string
  role: 'trainer' | 'admin'
  students: number
  status: 'active' | 'inactive' | 'process'
  avatar: string
  rating: number
  joinedAt: string
  schedule: string
  certifications: string[]
  contactName: string
  contactPhone: string
  contactRelation: string
  birthDate: string
  gender: string
  eps: string
  bloodType: string
  accessLevel: 'Completo' | 'Parcial'
  lastAccess: string
  recentActivities: { action: string; date: string }[]
  firma?: string
  huella?: string
}

export const initialTrainers: Trainer[] = [
  { id: 'mock-t1', name: 'Sebastián Morales', firstName: 'Sebastián', secondName: '', lastName: 'Morales', secondLastName: '', email: 'sebas.morales@unifit.edu', phone: '3204567890', document: 'CC. 1018475623', speciality: 'Fuerza y Acondicionamiento', role: 'trainer', students: 24, status: 'active', avatar: 'SM', rating: 96, joinedAt: '15 Ene 2024', schedule: 'Lun-Vie 6AM-2PM', certifications: ['Certificación NSCA', 'Entrenamiento Funcional Avanzado'], contactName: 'Andrea Morales', contactPhone: '3123456789', contactRelation: 'Esposa', birthDate: '12/05/1995', gender: 'Masculino', eps: 'Sura', bloodType: 'O+', accessLevel: 'Parcial', lastAccess: 'Hoy 8:45 AM', recentActivities: [{ action: 'Actualizó el perfil de un estudiante', date: 'Hoy 8:45 AM' }, { action: 'Registró asistencia de grupo', date: 'Hoy 7:20 AM' }, { action: 'Modificó un plan de entrenamiento', date: 'Ayer 6:15 PM' }] },
  { id: 'mock-t2', name: 'Ana Lucía Rivas', firstName: 'Ana', secondName: 'Lucía', lastName: 'Rivas', secondLastName: '', email: 'ana.rivas@unifit.edu', phone: '3215678901', document: 'CC. 1023456781', speciality: 'Yoga y Flexibilidad', role: 'trainer', students: 18, status: 'process', avatar: 'AR', rating: 91, joinedAt: '01 Feb 2024', schedule: 'Lun-Vie 8AM-4PM', certifications: ['RYT 500 Yoga', 'Pilates Matwork'], contactName: 'Diego Rivas', contactPhone: '3102345678', contactRelation: 'Hermano', birthDate: '23/08/1994', gender: 'Femenino', eps: 'Sanitas', bloodType: 'A+', accessLevel: 'Parcial', lastAccess: 'Ayer 6:10 PM', recentActivities: [{ action: 'Creó una nueva clase de yoga', date: 'Ayer 6:10 PM' }, { action: 'Actualizó su horario', date: 'Ayer 3:30 PM' }, { action: 'Envió mensaje a un estudiante', date: 'Lun 10:05 AM' }] },
]
