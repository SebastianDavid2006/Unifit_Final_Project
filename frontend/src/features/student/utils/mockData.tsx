import { Student, TodayWorkout, WeeklyProgress, Achievement, RankingItem, CoachMessage, UpcomingSession, BodyComposition, StatsCard, NextSession } from '@/features/student/types/student'
import { Dumbbell, Flame, Trophy, Star, Zap, Heart, Calendar, Brain, Award, Activity, Sparkles, Target } from 'lucide-react'

export const mockStudent: Student = {
  id: 1,
  name: 'Ana García Martínez',
  firstName: 'Ana',
  lastName: 'García Martínez',
  email: 'ana.garcia@universitaria.edu.co',
  avatar: 'AG',
  goal: 'Pérdida de peso',
  risk: 'low',
  adherence: 92,
  weight: 62,
  height: 165,
  bodyFat: 17,
  muscleMass: 52,
  imc: 22.8,
  streak: 12,
  bestStreak: 18,
  sessionsThisWeek: 3,
  totalSessions: 24,
  level: 7,
  xp: 1980,
  nextLevelXp: 2500,
  bodyFatChange: '-5%',
  muscleChange: '+4 kg',
  weightChange: '-6 kg',
  imcStatus: 'Saludable',
}

export const todayWorkout: TodayWorkout = {
  name: 'Hipertrofia Superior',
  duration: '60 min',
  exercises: 5,
  calories: 420,
  completed: 2,
  exercises_list: [
    { name: 'Sentadilla con barra', sets: '4x8-10', done: true },
    { name: 'Press de banca', sets: '4x8-10', done: true },
    { name: 'Peso muerto', sets: '3x6-8', done: false },
    { name: 'Dominadas', sets: '3x8-12', done: false },
    { name: 'Press militar', sets: '3x10-12', done: false },
  ],
}

export const weeklyProgress: WeeklyProgress[] = [
  { day: 'L', done: true },
  { day: 'M', done: true },
  { day: 'X', done: false },
  { day: 'J', done: true },
  { day: 'V', done: false },
  { day: 'S', done: false },
  { day: 'D', done: false },
]

export const achievements: Achievement[] = [
  { name: 'Primer Mes', icon: <Star size={17} />, unlocked: true, description: '30 días activo', color: '#F5A623' },
  { name: 'Racha 10', icon: <Flame size={17} />, unlocked: true, description: '10 días seguidos', color: '#F5A623' },
  { name: 'Fuerza Élite', icon: <Zap size={17} />, unlocked: true, description: '100kg en sentadilla', color: '#007AFF' },
  { name: 'Cardio Pro', icon: <Heart size={17} />, unlocked: false, description: '50 sesiones cardio', color: '#E63946' },
  { name: 'Top Facultad', icon: <Trophy size={17} />, unlocked: false, description: '#1 en Ingeniería', color: '#007AFF' },
  { name: 'Meta Cumplida', icon: <Target size={17} />, unlocked: false, description: 'Objetivo alcanzado', color: '#E63946' },
]

export const ranking: RankingItem[] = [
  { position: 1, name: 'Luisa M.', faculty: 'Arte', score: 2450 },
  { position: 2, name: 'Ana G.', faculty: 'Ingeniería', score: 2280 },
  { position: 3, name: 'Carlos R.', faculty: 'Medicina', score: 2100 },
  { position: 4, name: 'Tú', faculty: 'Ingeniería', score: 1980, isUser: true },
  { position: 5, name: 'María F.', faculty: 'Derecho', score: 1870 },
]

export const coachMessage: CoachMessage = {
  text: '¡Excelente racha, Ana! Hoy es día de Hipertrofia Superior. Recuerda calentar bien antes de sentadillas.',
  highlight: '420 kcal',
  highlightColor: '#BF5AF2',
}

export const upcomingSessions: UpcomingSession[] = [
  { name: 'Full Body', date: 'Mañana, 7:00 AM' },
  { name: 'Valoración física', date: 'Lunes, 9:00 AM' },
]

export const bodyComposition: BodyComposition[] = [
  { label: 'Peso', value: '62 kg', change: '-6 kg', color: '#30D158' },
  { label: 'Grasa corporal', value: '17%', change: '-5%', color: '#30D158' },
  { label: 'Masa muscular', value: '52 kg', change: '+4 kg', color: '#00E5FF' },
  { label: 'IMC', value: '22.8', change: 'Saludable', color: '#30D158' },
]

export const statsCards: StatsCard[] = [
  { label: 'Sesiones', value: '24', icon: '🏋️', color: '#E63946' },
  { label: 'Racha', value: '12d', icon: '🔥', color: '#F5A623' },
  { label: 'Nivel', value: '7', icon: '⭐', color: '#F5A623' },
]

export const nextSessions: NextSession[] = [
  { name: 'Full Body', date: 'Mañana, 7:00 AM' },
  { name: 'Valoración física', date: 'Lunes, 9:00 AM' },
]