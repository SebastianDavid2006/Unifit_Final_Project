import type { Exercise, Machine } from './types'

export const defaultExFields = {
  description: '', status: 'active' as const,
  muscleGroups: [] as string[], recommendedLevel: 'principiante' as const,
  imageUrl: '', videoUrl: '',
}

export const initialExercises: Exercise[] = [
  { id: 1, name: 'Caminata', zone: 'Cardio', ...defaultExFields, muscleGroups: ['Cardio', 'Piernas'] },
  { id: 2, name: 'Trote', zone: 'Cardio', ...defaultExFields, muscleGroups: ['Cardio', 'Piernas'] },
  { id: 3, name: 'Intervalos', zone: 'Cardio', ...defaultExFields, muscleGroups: ['Cardio'] },
  { id: 4, name: 'Ciclismo', zone: 'Cardio', ...defaultExFields, muscleGroups: ['Cardio', 'Piernas'] },
  { id: 5, name: 'Caminata Elíptica', zone: 'Cardio', ...defaultExFields, muscleGroups: ['Cardio'] },
  { id: 6, name: 'Sentadilla', zone: 'Pesas Libres', ...defaultExFields, muscleGroups: ['Piernas'] },
  { id: 7, name: 'Press Hombros', zone: 'Pesas Libres', ...defaultExFields, muscleGroups: ['Hombros'] },
  { id: 8, name: 'Press Plano', zone: 'Pesas Libres', ...defaultExFields, muscleGroups: ['Pecho'] },
  { id: 9, name: 'Press Inclinado', zone: 'Pesas Libres', ...defaultExFields, muscleGroups: ['Pecho'] },
  { id: 10, name: 'Press Declinado', zone: 'Pesas Libres', ...defaultExFields, muscleGroups: ['Pecho'] },
  { id: 11, name: 'Cruce de Cables', zone: 'Máquinas', ...defaultExFields, muscleGroups: ['Pecho', 'Brazos'] },
  { id: 12, name: 'Polea Alta', zone: 'Máquinas', ...defaultExFields, muscleGroups: ['Espalda', 'Brazos'] },
]

export const initialMachines: Machine[] = [
  { id: 1, name: 'Cinta de Correr A1', zone: 'Cardio', status: 'active', description: '', muscleGroups: ['Cardio'], recommendedLevel: 'principiante', observations: '', exerciseIds: [1, 2, 3] },
  { id: 2, name: 'Rack Multipower', zone: 'Pesas Libres', status: 'active', description: '', muscleGroups: ['Piernas', 'Pecho'], recommendedLevel: 'intermedio', observations: '', exerciseIds: [6, 7] },
  { id: 3, name: 'Bicicleta Spinning B3', zone: 'Cardio', status: 'maintenance', description: '', muscleGroups: ['Cardio'], recommendedLevel: 'intermedio', observations: '', exerciseIds: [4] },
  { id: 4, name: 'Press de Banca', zone: 'Pesas Libres', status: 'active', description: '', muscleGroups: ['Pecho'], recommendedLevel: 'principiante', observations: '', exerciseIds: [8, 9, 10] },
  { id: 5, name: 'Elíptica C2', zone: 'Cardio', status: 'active', description: '', muscleGroups: ['Cardio'], recommendedLevel: 'principiante', observations: '', exerciseIds: [5] },
  { id: 6, name: 'Cable Crossover', zone: 'Máquinas', status: 'inactive', description: '', muscleGroups: ['Brazos', 'Hombros'], recommendedLevel: 'intermedio', observations: '', exerciseIds: [11, 12] },
]
