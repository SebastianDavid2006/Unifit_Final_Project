export interface Trainer {
  id: number
  name: string
  email: string
  phone: string
  speciality: string
  students: number
  status: 'active' | 'inactive'
  avatar: string
  rating: number
  joinedAt: string
  schedule: string
  certifications: string[]
}

export const initialTrainers: Trainer[] = [
  { id: 1, name: 'Sebastián Morales', email: 'sebas.morales@unifit.edu', phone: '+1 555-0101', speciality: 'Fuerza y Acondicionamiento', students: 24, status: 'active', avatar: 'SM', rating: 96, joinedAt: '15 Ene 2024', schedule: 'Lun-Vie 6AM-2PM', certifications: ['Certificación NSCA', 'Entrenamiento Funcional Avanzado'] },
  { id: 2, name: 'Ana Lucía Rivas', email: 'ana.rivas@unifit.edu', phone: '+1 555-0102', speciality: 'Yoga y Flexibilidad', students: 18, status: 'active', avatar: 'AR', rating: 91, joinedAt: '01 Feb 2024', schedule: 'Lun-Vie 8AM-4PM', certifications: ['RYT 500 Yoga', 'Pilotes Matwork'] },
  { id: 3, name: 'Carlos Méndez', email: 'carlos.mendez@unifit.edu', phone: '+1 555-0103', speciality: 'Cardio y Resistencia', students: 31, status: 'active', avatar: 'CM', rating: 88, joinedAt: '10 Mar 2024', schedule: 'Mar-Sáb 10AM-6PM', certifications: ['ACE Certified', 'TRX Specialist'] },
  { id: 4, name: 'María Fernanda López', email: 'maria.lopez@unifit.edu', phone: '+1 555-0104', speciality: 'Nutrición Deportiva', students: 15, status: 'inactive', avatar: 'ML', rating: 78, joinedAt: '20 Abr 2024', schedule: 'Lun-Vie 7AM-3PM', certifications: ['Nutrition Coach', 'Dietética Deportiva'] },
  { id: 5, name: 'Roberto Jiménez', email: 'roberto.j@unifit.edu', phone: '+1 555-0105', speciality: 'Rehabilitación Física', students: 12, status: 'active', avatar: 'RJ', rating: 85, joinedAt: '05 May 2024', schedule: 'Lun-Jue 9AM-5PM', certifications: ['Fisioterapia Deportiva', 'Kinesiología'] },
]
