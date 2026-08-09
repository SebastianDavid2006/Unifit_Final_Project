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
}

export const initialTrainers: Trainer[] = [
  { id: 1, name: 'Sebastián Morales', email: 'sebas.morales@unifit.edu', phone: '+1 555-0101', document: 'CC 1018475623', speciality: 'Fuerza y Acondicionamiento', role: 'trainer', students: 24, status: 'active', avatar: 'SM', rating: 96, joinedAt: '15 Ene 2024', schedule: 'Lun-Vie 6AM-2PM', certifications: ['Certificación NSCA', 'Entrenamiento Funcional Avanzado'] },
  { id: 2, name: 'Ana Lucía Rivas', email: 'ana.rivas@unifit.edu', phone: '+1 555-0102', document: 'CC 1023456781', speciality: 'Yoga y Flexibilidad', role: 'trainer', students: 18, status: 'active', avatar: 'AR', rating: 91, joinedAt: '01 Feb 2024', schedule: 'Lun-Vie 8AM-4PM', certifications: ['RYT 500 Yoga', 'Pilotes Matwork'] },
  { id: 3, name: 'Carlos Méndez', email: 'carlos.mendez@unifit.edu', phone: '+1 555-0103', document: 'CC 1035402871', speciality: 'Cardio y Resistencia', role: 'trainer', students: 31, status: 'active', avatar: 'CM', rating: 88, joinedAt: '10 Mar 2024', schedule: 'Mar-Sáb 10AM-6PM', certifications: ['ACE Certified', 'TRX Specialist'] },
  { id: 4, name: 'María Fernanda López', email: 'maria.lopez@unifit.edu', phone: '+1 555-0104', document: 'CC 1040756192', speciality: 'Nutrición Deportiva', role: 'trainer', students: 15, status: 'inactive', avatar: 'ML', rating: 78, joinedAt: '20 Abr 2024', schedule: 'Lun-Vie 7AM-3PM', certifications: ['Nutrition Coach', 'Dietética Deportiva'] },
  { id: 5, name: 'Roberto Jiménez', email: 'roberto.j@unifit.edu', phone: '+1 555-0105', document: 'CC 1052309874', speciality: 'Rehabilitación Física', role: 'trainer', students: 12, status: 'active', avatar: 'RJ', rating: 85, joinedAt: '05 May 2024', schedule: 'Lun-Jue 9AM-5PM', certifications: ['Fisioterapia Deportiva', 'Kinesiología'] },
  { id: 6, name: 'Valentina Giraldo', email: 'valentina.giraldo@unifit.edu', phone: '+1 555-0106', document: 'CC 1064523187', speciality: 'CrossFit y Alto Rendimiento', role: 'trainer', students: 22, status: 'active', avatar: 'VG', rating: 89, joinedAt: '12 Jun 2024', schedule: 'Mar-Sáb 6AM-2PM', certifications: ['CrossFit L1', 'Olympic Lifting'] },
  { id: 7, name: 'Andrés Felipe Torres', email: 'andres.torres@unifit.edu', phone: '+1 555-0107', document: 'CC 1073846210', speciality: 'Acondicionamiento Metabólico', role: 'trainer', students: 19, status: 'active', avatar: 'AT', rating: 84, joinedAt: '18 Jul 2024', schedule: 'Lun-Vie 2PM-10PM', certifications: ['HIIT Specialist', 'ACE Certified'] },
  { id: 8, name: 'Daniela Osorio', email: 'daniela.osorio@unifit.edu', phone: '+1 555-0108', document: 'CC 1089214763', speciality: 'Pilates y Postura', role: 'trainer', students: 14, status: 'active', avatar: 'DO', rating: 87, joinedAt: '25 Ago 2024', schedule: 'Lun-Jue 7AM-3PM', certifications: ['Pilates Matwork', 'Movilidad Funcional'] },
  { id: 9, name: 'Julián Restrepo', email: 'julian.restrepo@unifit.edu', phone: '+1 555-0109', document: 'CC 1090142738', speciality: 'Entrenamiento de Fuerza', role: 'trainer', students: 27, status: 'active', avatar: 'JR', rating: 90, joinedAt: '03 Sep 2024', schedule: 'Lun-Vie 6AM-2PM', certifications: ['NSCA CPT', 'Powerlifting L1'] },
  { id: 10, name: 'Laura Camila Gómez', email: 'laura.gomez@unifit.edu', phone: '+1 555-0110', document: 'CC 1003456127', speciality: 'Administración del Sistema', role: 'admin', students: 0, status: 'active', avatar: 'LG', rating: 95, joinedAt: '10 Ene 2024', schedule: 'Lun-Vie 8AM-5PM', certifications: ['Gestión de Plataforma', 'Auditoría'] },
  { id: 11, name: 'Andrés Cardona', email: 'andres.cardona@unifit.edu', phone: '+1 555-0111', document: 'CC 1007238914', speciality: 'Gestión General', role: 'admin', students: 0, status: 'active', avatar: 'AC', rating: 93, joinedAt: '22 Feb 2024', schedule: 'Lun-Vie 9AM-6PM', certifications: ['Gestión de Plataforma'] },
  { id: 12, name: 'Fernanda Ruiz', email: 'fernanda.ruiz@unifit.edu', phone: '+1 555-0112', document: 'CC 1005819473', speciality: 'Administración y Soporte', role: 'admin', students: 0, status: 'inactive', avatar: 'FR', rating: 81, joinedAt: '14 Mar 2024', schedule: 'Mar-Sáb 10AM-7PM', certifications: ['Gestión de Plataforma'] },
  { id: 13, name: 'Nicolás Peña', email: 'nicolas.pena@unifit.edu', phone: '+1 555-0113', document: 'CC 1009328571', speciality: 'Administración del Sistema', role: 'admin', students: 0, status: 'active', avatar: 'NP', rating: 89, joinedAt: '30 Abr 2024', schedule: 'Lun-Vie 8AM-4PM', certifications: ['Gestión de Plataforma'] },
]
