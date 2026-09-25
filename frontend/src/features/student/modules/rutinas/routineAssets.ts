import legImg from '@/assets/icons/anatomy/leg.webp'
import chestImg from '@/assets/icons/anatomy/chest.webp'
import backImg from '@/assets/icons/anatomy/back.webp'
import shouldersImg from '@/assets/icons/anatomy/shoulders.webp'
import absImg from '@/assets/icons/anatomy/abs.webp'
import armImg from '@/assets/icons/anatomy/arm.webp'
import cardioImg from '@/assets/icons/anatomy/cardio.webp'
import fullBodyImg from '@/assets/icons/anatomy/full-body.webp'
import upperBodyImg from '@/assets/icons/anatomy/upper_body.webp'
import lowerBodyImg from '@/assets/icons/anatomy/lower_body.webp'

export const MUSCLE_IMG: Record<string, string> = {
  Piernas: legImg, Glúteos: legImg, Cuádriceps: legImg, Isquiotibiales: legImg, Pantorrilla: legImg,
  Pecho: chestImg,
  Espalda: backImg, Dorsal: backImg,
  Hombros: shouldersImg,
  Core: absImg, Abdomen: absImg, 'Abdomen/Core': absImg,
  Brazos: armImg, Bíceps: armImg, Tríceps: armImg,
  Cardio: cardioImg,
  General: fullBodyImg, 'Full body': fullBodyImg,
  'Tren Superior': upperBodyImg,
  'Tren Inferior': lowerBodyImg,
}

export const FULL_BODY_IMG = fullBodyImg

export const LEVEL_COLOR: Record<string, string> = {
  Principiante: '#30D158',
  Intermedio: '#007AFF',
  Avanzado: '#E63946',
}
