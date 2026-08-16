export interface Trainer {
  id: number
  name: string
  email: string
  phone: string
  document: string
  speciality: string
  role: 'trainer' | 'admin'
  students: number
  status: 'active' | 'inactive'
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
}

export const initialTrainers: Trainer[] = [
  { id: 1, name: 'Sebastián Morales', email: 'sebas.morales@unifit.edu', phone: '3204567890', document: 'CC. 1018475623', speciality: 'Fuerza y Acondicionamiento', role: 'trainer', students: 24, status: 'active', avatar: 'SM', rating: 96, joinedAt: '15 Ene 2024', schedule: 'Lun-Vie 6AM-2PM', certifications: ['Certificación NSCA', 'Entrenamiento Funcional Avanzado'], contactName: 'Andrea Morales', contactPhone: '3123456789', contactRelation: 'Esposa', birthDate: '12/05/1995', gender: 'Masculino', eps: 'Sura', bloodType: 'O+' },
  { id: 2, name: 'Ana Lucía Rivas', email: 'ana.rivas@unifit.edu', phone: '3215678901', document: 'CC. 1023456781', speciality: 'Yoga y Flexibilidad', role: 'trainer', students: 18, status: 'active', avatar: 'AR', rating: 91, joinedAt: '01 Feb 2024', schedule: 'Lun-Vie 8AM-4PM', certifications: ['RYT 500 Yoga', 'Pilotes Matwork'], contactName: 'Diego Rivas', contactPhone: '3102345678', contactRelation: 'Hermano', birthDate: '23/08/1994', gender: 'Femenino', eps: 'Sanitas', bloodType: 'A+' },
  { id: 3, name: 'Carlos Méndez', email: 'carlos.mendez@unifit.edu', phone: '3226789012', document: 'CC. 1035402871', speciality: 'Cardio y Resistencia', role: 'trainer', students: 31, status: 'active', avatar: 'CM', rating: 88, joinedAt: '10 Mar 2024', schedule: 'Mar-Sáb 10AM-6PM', certifications: ['ACE Certified', 'TRX Specialist'], contactName: 'Patricia Méndez', contactPhone: '3111234567', contactRelation: 'Madre', birthDate: '05/03/1993', gender: 'Masculino', eps: 'Nueva EPS', bloodType: 'B+' },
  { id: 4, name: 'María Fernanda López', email: 'maria.lopez@unifit.edu', phone: '3237890123', document: 'CC. 1040756192', speciality: 'Nutrición Deportiva', role: 'trainer', students: 15, status: 'inactive', avatar: 'ML', rating: 78, joinedAt: '20 Abr 2024', schedule: 'Lun-Vie 7AM-3PM', certifications: ['Nutrition Coach', 'Dietética Deportiva'], contactName: 'Jorge López', contactPhone: '3139876543', contactRelation: 'Esposo', birthDate: '17/11/1996', gender: 'Femenino', eps: 'Coomeva', bloodType: 'O-' },
  { id: 5, name: 'Roberto Jiménez', email: 'roberto.j@unifit.edu', phone: '3248901234', document: 'CC. 1052309874', speciality: 'Rehabilitación Física', role: 'trainer', students: 12, status: 'active', avatar: 'RJ', rating: 85, joinedAt: '05 May 2024', schedule: 'Lun-Jue 9AM-5PM', certifications: ['Fisioterapia Deportiva', 'Kinesiología'], contactName: 'Camila Jiménez', contactPhone: '3145678901', contactRelation: 'Hermana', birthDate: '09/07/1990', gender: 'Masculino', eps: 'Sura', bloodType: 'AB+' },
  { id: 6, name: 'Valentina Giraldo', email: 'valentina.giraldo@unifit.edu', phone: '3259012345', document: 'CC. 1064523187', speciality: 'CrossFit y Alto Rendimiento', role: 'trainer', students: 22, status: 'active', avatar: 'VG', rating: 89, joinedAt: '12 Jun 2024', schedule: 'Mar-Sáb 6AM-2PM', certifications: ['CrossFit L1', 'Olympic Lifting'], contactName: 'Felipe Giraldo', contactPhone: '3156789012', contactRelation: 'Padre', birthDate: '28/02/1998', gender: 'Femenino', eps: 'Sanitas', bloodType: 'A-' },
  { id: 7, name: 'Andrés Felipe Torres', email: 'andres.torres@unifit.edu', phone: '3260123456', document: 'CC. 1073846210', speciality: 'Acondicionamiento Metabólico', role: 'trainer', students: 19, status: 'active', avatar: 'AT', rating: 84, joinedAt: '18 Jul 2024', schedule: 'Lun-Vie 2PM-10PM', certifications: ['HIIT Specialist', 'ACE Certified'], contactName: 'Luisa Torres', contactPhone: '3167890123', contactRelation: 'Esposa', birthDate: '14/09/1992', gender: 'Masculino', eps: 'Nueva EPS', bloodType: 'O+' },
  { id: 8, name: 'Daniela Osorio', email: 'daniela.osorio@unifit.edu', phone: '3271234567', document: 'CC. 1089214763', speciality: 'Pilates y Postura', role: 'trainer', students: 14, status: 'active', avatar: 'DO', rating: 87, joinedAt: '25 Ago 2024', schedule: 'Lun-Jue 7AM-3PM', certifications: ['Pilates Matwork', 'Movilidad Funcional'], contactName: 'Mateo Osorio', contactPhone: '3178901234', contactRelation: 'Hermano', birthDate: '06/12/1997', gender: 'Femenino', eps: 'Coomeva', bloodType: 'A+' },
  { id: 9, name: 'Julián Restrepo', email: 'julian.restrepo@unifit.edu', phone: '3282345678', document: 'CC. 1090142738', speciality: 'Entrenamiento de Fuerza', role: 'trainer', students: 27, status: 'active', avatar: 'JR', rating: 90, joinedAt: '03 Sep 2024', schedule: 'Lun-Vie 6AM-2PM', certifications: ['NSCA CPT', 'Powerlifting L1'], contactName: 'Sara Restrepo', contactPhone: '3189012345', contactRelation: 'Madre', birthDate: '21/04/1991', gender: 'Masculino', eps: 'Sura', bloodType: 'O+' },
  { id: 10, name: 'Laura Camila Gómez', email: 'laura.gomez@unifit.edu', phone: '3293456789', document: 'CC. 7890123456', speciality: 'Administración del Sistema', role: 'admin', students: 0, status: 'active', avatar: 'LG', rating: 95, joinedAt: '10 Ene 2024', schedule: 'Lun-Vie 8AM-5PM', certifications: ['Gestión de Plataforma', 'Auditoría'], contactName: 'Camilo Gómez', contactPhone: '3190123456', contactRelation: 'Esposo', birthDate: '03/12/1999', gender: 'Femenino', eps: 'Sanitas', bloodType: 'B-' },
  { id: 11, name: 'Andrés Cardona', email: 'andres.cardona@unifit.edu', phone: '3004567890', document: 'CC. 1007238914', speciality: 'Gestión General', role: 'admin', students: 0, status: 'active', avatar: 'AC', rating: 93, joinedAt: '22 Feb 2024', schedule: 'Lun-Vie 9AM-6PM', certifications: ['Gestión de Plataforma'], contactName: 'Mariana Cardona', contactPhone: '3001234567', contactRelation: 'Esposa', birthDate: '30/06/1990', gender: 'Masculino', eps: 'Nueva EPS', bloodType: 'A+' },
  { id: 12, name: 'Fernanda Ruiz', email: 'fernanda.ruiz@unifit.edu', phone: '3015678901', document: 'CC. 1005819473', speciality: 'Administración y Soporte', role: 'admin', students: 0, status: 'inactive', avatar: 'FR', rating: 81, joinedAt: '14 Mar 2024', schedule: 'Mar-Sáb 10AM-7PM', certifications: ['Gestión de Plataforma'], contactName: 'Andrés Ruiz', contactPhone: '3012345678', contactRelation: 'Madre', birthDate: '11/10/1995', gender: 'Femenino', eps: 'Coomeva', bloodType: 'O+' },
  { id: 13, name: 'Nicolás Peña', email: 'nicolas.pena@unifit.edu', phone: '3026789012', document: 'CC. 1009328571', speciality: 'Administración del Sistema', role: 'admin', students: 0, status: 'active', avatar: 'NP', rating: 89, joinedAt: '30 Abr 2024', schedule: 'Lun-Vie 8AM-4PM', certifications: ['Gestión de Plataforma'], contactName: 'Valeria Peña', contactPhone: '3023456789', contactRelation: 'Esposa', birthDate: '25/01/1996', gender: 'Masculino', eps: 'Sura', bloodType: 'AB+' },
]
