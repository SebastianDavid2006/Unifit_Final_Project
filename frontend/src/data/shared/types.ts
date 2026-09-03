export type Status = 'active' | 'maintenance' | 'inactive'

export interface Exercise {
  id: string
  name: string
  zone: string
  description: string
  status: Status
  muscleGroups: string[]
  recommendedLevel: 'principiante' | 'intermedio' | 'avanzado'
  imageUrl: string
  videoUrl: string
}

export interface Machine {
  id: string
  name: string
  zone: string
  status: Status
  imageDataUrl?: string
  description: string
  muscleGroups: string[]
  recommendedLevel: 'principiante' | 'intermedio' | 'avanzado'
  observations: string
  exerciseIds: string[]
}
