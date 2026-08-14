import machineImg from '@/assets/illustrations/modules/equipment_module.webp'
import machineExercisesImg from '@/assets/illustrations/equipment/cable_machine.webp'
import modalExercisesImg from '@/assets/illustrations/characters/coach/coach_bench_press.webp'
import machineTreadmillImg from '@/assets/illustrations/equipment/treadmill.webp'
import coachCongratsImg from '@/assets/illustrations/characters/coach/coach_congratulations.webp'
import coachExerciseSuccessImg from '@/assets/illustrations/characters/coach/coach_exercise_success.webp'

export const EQUIPMENT_IMAGES = {
  machineImg,
  machineExercisesImg,
  modalExercisesImg,
  machineTreadmillImg,
  coachCongratsImg,
  coachExerciseSuccessImg,
}

export const GOLD_GRAD = 'linear-gradient(135deg, #F1C827, #FFE066)'

export const LEVEL_BADGE = {
  principiante: { label: 'Principiante', color: '#30D158', bg: 'rgba(48,209,88,0.1)' },
  intermedio: { label: 'Intermedio', color: '#F5A623', bg: 'rgba(245,166,35,0.1)' },
  avanzado: { label: 'Avanzado', color: '#F43843', bg: 'rgba(244,56,67,0.1)' },
} as const

export const LEVEL_HEX = {
  principiante: '#1270B7',
  intermedio: '#F1C827',
  avanzado: '#F43843',
} as const

export const QUICK_GROUPS = [
  'Pecho', 'Espalda', 'Hombros', 'Brazos',
  'Piernas', 'Abdomen/Core', 'Cardio', 'General',
] as const

export const ALL_GROUPS = [
  ...QUICK_GROUPS,
  'Tren Superior', 'Tren Inferior',
] as const
