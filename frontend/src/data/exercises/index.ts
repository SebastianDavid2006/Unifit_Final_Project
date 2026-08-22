export interface Exercise {
  id: string
  name: string
  muscle: string
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado'
  sets: number
  reps: string
  weight: string
  calories: number
  avoid?: string[]
}

export const exerciseCatalog: Exercise[] = [
  { id: 'press-banca', name: 'Press de banca plano', muscle: 'Pecho', difficulty: 'Intermedio', sets: 4, reps: '8-10', weight: '70 kg', calories: 80, avoid: ['Cardiovascular'] },
  { id: 'press-inclinado', name: 'Press de banca inclinado', muscle: 'Pecho', difficulty: 'Intermedio', sets: 3, reps: '10-12', weight: '55 kg', calories: 75 },
  { id: 'aperturas', name: 'Aperturas con mancuernas', muscle: 'Pecho', difficulty: 'Principiante', sets: 3, reps: '12-15', weight: '12 kg', calories: 55 },
  { id: 'flexiones', name: 'Flexiones de pecho', muscle: 'Pecho', difficulty: 'Principiante', sets: 3, reps: '12-15', weight: 'Peso corporal', calories: 60 },
  { id: 'jalon', name: 'Jalón al pecho', muscle: 'Espalda', difficulty: 'Principiante', sets: 3, reps: '12-15', weight: '45 kg', calories: 65 },
  { id: 'remo-mancuerna', name: 'Remo con mancuerna', muscle: 'Espalda', difficulty: 'Intermedio', sets: 3, reps: '10-12', weight: '25 kg', calories: 70 },
  { id: 'dominadas', name: 'Dominadas', muscle: 'Espalda', difficulty: 'Intermedio', sets: 3, reps: '8-12', weight: 'Peso corporal', calories: 70, avoid: ['Osteomuscular'] },
  { id: 'peso-muerto', name: 'Peso muerto', muscle: 'Espalda', difficulty: 'Avanzado', sets: 3, reps: '6-8', weight: '100 kg', calories: 110, avoid: ['Osteomuscular', 'Cardiovascular'] },
  { id: 'press-militar', name: 'Press militar', muscle: 'Hombros', difficulty: 'Intermedio', sets: 3, reps: '10-12', weight: '50 kg', calories: 65, avoid: ['Osteomuscular'] },
  { id: 'elevaciones-lat', name: 'Elevaciones laterales', muscle: 'Hombros', difficulty: 'Principiante', sets: 3, reps: '12-15', weight: '8 kg', calories: 45 },
  { id: 'face-pull', name: 'Face pull', muscle: 'Hombros', difficulty: 'Principiante', sets: 3, reps: '15-20', weight: '15 kg', calories: 40 },
  { id: 'curl-barra', name: 'Curl con barra', muscle: 'Bíceps', difficulty: 'Intermedio', sets: 3, reps: '10-12', weight: '25 kg', calories: 45 },
  { id: 'curl-martillo', name: 'Curl martillo', muscle: 'Bíceps', difficulty: 'Principiante', sets: 3, reps: '12-15', weight: '10 kg', calories: 40 },
  { id: 'frances', name: 'Extensión de tríceps (francés)', muscle: 'Tríceps', difficulty: 'Intermedio', sets: 3, reps: '10-12', weight: '15 kg', calories: 45 },
  { id: 'soga-triceps', name: 'Extensión de tríceps en soga', muscle: 'Tríceps', difficulty: 'Principiante', sets: 3, reps: '12-15', weight: '20 kg', calories: 40 },
  { id: 'sentadilla', name: 'Sentadilla con barra', muscle: 'Cuádriceps', difficulty: 'Avanzado', sets: 4, reps: '8-10', weight: '80 kg', calories: 95, avoid: ['Osteomuscular'] },
  { id: 'sentadilla-goblet', name: 'Sentadilla goblet', muscle: 'Cuádriceps', difficulty: 'Principiante', sets: 3, reps: '12-15', weight: '16 kg', calories: 60 },
  { id: 'prensa', name: 'Prensa de piernas', muscle: 'Cuádriceps', difficulty: 'Intermedio', sets: 4, reps: '10-12', weight: '120 kg', calories: 85, avoid: ['Osteomuscular'] },
  { id: 'zancadas', name: 'Zancadas con mancuernas', muscle: 'Glúteos', difficulty: 'Intermedio', sets: 3, reps: '10-12', weight: '12 kg', calories: 80 },
  { id: 'hip-thrust', name: 'Hip thrust', muscle: 'Glúteos', difficulty: 'Intermedio', sets: 4, reps: '10-12', weight: '60 kg', calories: 85 },
  { id: 'curl-femoral', name: 'Curl femoral', muscle: 'Isquiotibiales', difficulty: 'Intermedio', sets: 3, reps: '10-12', weight: '35 kg', calories: 65 },
  { id: 'peso-muerto-rumano', name: 'Peso muerto rumano', muscle: 'Isquiotibiales', difficulty: 'Intermedio', sets: 3, reps: '10-12', weight: '50 kg', calories: 75, avoid: ['Osteomuscular'] },
  { id: 'elevacion-pantorrilla', name: 'Elevación de pantorrilla', muscle: 'Pantorrilla', difficulty: 'Principiante', sets: 4, reps: '15-20', weight: '30 kg', calories: 35 },
  { id: 'plancha', name: 'Plancha abdominal', muscle: 'Core', difficulty: 'Principiante', sets: 3, reps: '30-45 s', weight: 'Peso corporal', calories: 30 },
  { id: 'crunch', name: 'Crunch abdominal', muscle: 'Core', difficulty: 'Principiante', sets: 3, reps: '15-20', weight: 'Peso corporal', calories: 35 },
  { id: 'elevacion-piernas', name: 'Elevación de piernas', muscle: 'Core', difficulty: 'Intermedio', sets: 3, reps: '12-15', weight: 'Peso corporal', calories: 40 },
  { id: 'russian-twist', name: 'Russian twist', muscle: 'Core', difficulty: 'Intermedio', sets: 3, reps: '20-30', weight: '8 kg', calories: 45 },
]
