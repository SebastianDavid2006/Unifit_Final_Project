import { Student, TodayWorkout, WeeklyProgress, Achievement, RankingItem, CoachMessage, UpcomingSession, BodyComposition, StatsCard, NextSession, StudentRoutine } from '@/features/student/types/student'
import { Dumbbell, Flame, Trophy, Star, Zap, Heart, Calendar, Brain, Award, Activity, Sparkles, Target } from 'lucide-react'

export const mockStudent: Student = {
  id: 1,
  name: 'Ana GarcÃ­a MartÃ­nez',
  firstName: 'Ana',
  lastName: 'GarcÃ­a MartÃ­nez',
  email: 'ana.garcia@universitaria.edu.co',
  gender: 'F',
  avatar: 'AG',
  goal: 'PÃ©rdida de peso',
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
  { name: 'Primer Mes', icon: <Star size={17} />, unlocked: true, description: '30 dÃ­as activo', color: '#F5A623' },
  { name: 'Racha 10', icon: <Flame size={17} />, unlocked: true, description: '10 dÃ­as seguidos', color: '#F5A623' },
  { name: 'Fuerza Ã‰lite', icon: <Zap size={17} />, unlocked: true, description: '100kg en sentadilla', color: '#007AFF' },
  { name: 'Cardio Pro', icon: <Heart size={17} />, unlocked: false, description: '50 sesiones cardio', color: '#E63946' },
  { name: 'Top Facultad', icon: <Trophy size={17} />, unlocked: false, description: '#1 en IngenierÃ­a', color: '#007AFF' },
  { name: 'Meta Cumplida', icon: <Target size={17} />, unlocked: false, description: 'Objetivo alcanzado', color: '#E63946' },
]

export const ranking: RankingItem[] = [
  { position: 1, name: 'Luisa M.', faculty: 'Arte', score: 2450 },
  { position: 2, name: 'Ana G.', faculty: 'IngenierÃ­a', score: 2280 },
  { position: 3, name: 'Carlos R.', faculty: 'Medicina', score: 2100 },
  { position: 4, name: 'TÃº', faculty: 'IngenierÃ­a', score: 1980, isUser: true },
  { position: 5, name: 'MarÃ­a F.', faculty: 'Derecho', score: 1870 },
]

export const coachMessage: CoachMessage = {
  text: 'Â¡Excelente racha, Ana! Hoy es dÃ­a de Hipertrofia Superior. Recuerda calentar bien antes de sentadillas.',
  highlight: '420 kcal',
  highlightColor: '#BF5AF2',
}

export const upcomingSessions: UpcomingSession[] = [
  { name: 'Full Body', date: 'MaÃ±ana, 7:00 AM' },
  { name: 'ValoraciÃ³n fÃ­sica', date: 'Lunes, 9:00 AM' },
]

export const bodyComposition: BodyComposition[] = [
  { label: 'Peso', value: '62 kg', change: '-6 kg', color: '#30D158' },
  { label: 'Grasa corporal', value: '17%', change: '-5%', color: '#30D158' },
  { label: 'Masa muscular', value: '52 kg', change: '+4 kg', color: '#00E5FF' },
  { label: 'IMC', value: '22.8', change: 'Saludable', color: '#30D158' },
]

export const statsCards: StatsCard[] = [
  { label: 'Sesiones', value: '24', icon: 'ðŸ‹ï¸', color: '#E63946' },
  { label: 'Racha', value: '12d', icon: 'ðŸ”¥', color: '#F5A623' },
  { label: 'Nivel', value: '7', icon: 'â­', color: '#F5A623' },
]

export const nextSessions: NextSession[] = [
  { name: 'Full Body', date: 'MaÃ±ana, 7:00 AM' },
  { name: 'ValoraciÃ³n fÃ­sica', date: 'Lunes, 9:00 AM' },
]

export const motivationalQuotes = [
  'EL ÃšNICO ENTRENAMIENTO MALO ES EL QUE NO HICISTE',
  'MÃS FUERTE QUE AYER',
  'EL DOLOR DE HOY ES EL PODER DE MAÃ‘ANA',
  'TU ÃšNICO LÃMITE ERES TÃš',
]

export const studentRoutines: StudentRoutine[] = [
  {
    id: 'hipertrofia-superior',
    name: 'Hipertrofia Superior',
    duration: '8 semanas',
    frequency: '3 dÃ­as/semana',
    level: 'Intermedio',
    focus: 'Tren superior',
    current: true,
    rows: [
      { name: 'Sentadilla con barra', sets: '4', reps: '8-10', rest: '90 s', weight: '80 kg', muscle: 'Cuádriceps', secondaryMuscle: 'Glúteos', instructions: 'Barra alta en trapecio, pies al ancho de hombros. Baja hasta que el fémur quede paralelo al suelo manteniendo la espalda recta y el pecho arriba. Empuja con todo el pie al subir.' },
      { name: 'Press de banca', sets: '4', reps: '8-10', rest: '90 s', weight: '70 kg', muscle: 'Pecho', secondaryMuscle: 'Tríceps', instructions: 'Escápulas retraídas y pies firmes. Baja la barra controlado hasta el pecho medio y empuja explosivamente sin bloquear los codos bruscamente.' },
      { name: 'Peso muerto', sets: '3', reps: '6-8', rest: '120 s', weight: '100 kg', muscle: 'Espalda', secondaryMuscle: 'Isquiotibiales', instructions: 'Barra sobre el medio del pie, agarre firme y espalda neutra. Extiende cadera y rodillas simultáneamente manteniendo la barra pegada al cuerpo.' },
      { name: 'Dominadas', sets: '3', reps: '8-12', rest: '90 s', weight: 'Peso corporal', muscle: 'Dorsal', secondaryMuscle: 'Brazos', instructions: 'Agarre prono ligeramente más ancho que los hombros. Sube llevando el pecho a la barra y baja controlado en 2-3 segundos.' },
      { name: 'Press militar', sets: '3', reps: '10-12', rest: '90 s', weight: '50 kg', muscle: 'Hombros', secondaryMuscle: 'Tríceps', instructions: 'De pie, core apretado y glúteos activos. Empuja la barra verticalmente pasando la cabeza al final, sin arquear la lumbar.' },
    ],
    assessmentNum: 1,
    progress: { completedSessions: 8, totalSessions: 12, adherence: 78, lastSession: '2026-05-20' },
  },
  {
    id: 'fuerza-tren-inferior',
    name: 'Fuerza Tren Inferior',
    duration: '6 semanas',
    frequency: '3 dÃ­as/semana',
    level: 'Avanzado',
    focus: 'Piernas y glÃºteos',
    rows: [
      { name: 'Sentadilla libre', sets: '5', reps: '5', rest: '180 s', weight: '120 kg', muscle: 'CuÃ¡driceps', instructions: 'Fuerza pura: series pesadas de 5 repeticiones. Descansa completo entre series y mantÃ©n tÃ©cnica impecable sobre volumen.' },
      { name: 'Prensa de piernas', sets: '4', reps: '8', rest: '120 s', weight: '200 kg', muscle: 'CuÃ¡driceps', instructions: 'Pies a ancho de hombros en la plataforma. Baja hasta 90 grados sin despegar la zona lumbar del respaldo.' },
      { name: 'Peso muerto rumano', sets: '4', reps: '6', rest: '120 s', weight: '140 kg', muscle: 'Isquiotibiales', instructions: 'Rodillas semiflexionadas fijas. Lleva la cadera hacia atrÃ¡s sintiendo el estiramiento de isquios y sube contrayendo glÃºteo.' },
      { name: 'Zancadas bÃºlgaras', sets: '3', reps: '10', rest: '90 s', weight: '20 kg', muscle: 'GlÃºteos', instructions: 'Pie trasero elevado en banco. Baja vertical controlando el equilibrio; el peso cae sobre la pierna adelantada.' },
      { name: 'ElevaciÃ³n de talones', sets: '4', reps: '15', rest: '60 s', weight: '40 kg', muscle: 'Pantorrilla', instructions: 'Rango completo: estira abajo, contrae arriba y pausa 1 segundo en la cima para mÃ¡ximo estÃ­mulo.' },
    ],
    assessmentNum: 2,
    progress: { completedSessions: 6, totalSessions: 12, adherence: 65, lastSession: '2026-05-15' },
  },
  {
    id: 'acondicionamiento-full-body',
    name: 'Acondicionamiento Full Body',
    duration: '12 semanas',
    frequency: '4 dÃ­as/semana',
    level: 'Intermedio',
    focus: 'Cardio y resistencia',
    rows: [
      { name: 'Burpees', sets: '4', reps: '10', rest: '60 s', weight: 'Peso corporal', muscle: 'Cardio', instructions: 'FlexiÃ³n + salto explosivo. MantÃ©n ritmo constante; si fatiga excesiva, elimina la flexiÃ³n pero conserva el salto.' },
      { name: 'Kettlebell swings', sets: '4', reps: '15', rest: '60 s', weight: '24 kg', muscle: 'GlÃºteos', instructions: 'El movimiento sale de la cadera, no de los brazos. La kettlebell flota; tÃº solo la proyectas con el impulso de cadera.' },
      { name: 'Push-ups', sets: '3', reps: '15', rest: '60 s', weight: 'Peso corporal', muscle: 'Pecho', instructions: 'Cuerpo en tabla rÃ­gida, codos a 45 grados. Pecho casi toca suelo y sube en bloque.' },
      { name: 'Mountain climbers', sets: '3', reps: '30 s', rest: '60 s', weight: 'Peso corporal', muscle: 'Core', instructions: 'PosiciÃ³n de plancha alta, alterna rodillas al pecho a mÃ¡xima velocidad sin elevar la cadera.' },
      { name: 'Plancha', sets: '3', reps: '60 s', rest: '60 s', weight: 'Peso corporal', muscle: 'Core', instructions: 'Antebrazos al suelo, glÃºteos y abdomen contraÃ­dos. Respira; no aguantes la respiraciÃ³n. Si falla la tÃ©cnica, descansa.' },
    ],
    assessmentNum: 3,
    progress: { completedSessions: 3, totalSessions: 16, adherence: 42, lastSession: '2026-05-10' },
  },
  {
    id: 'cardio-quemagrasas',
    name: 'Cardio Quemagrasas',
    duration: '8 semanas',
    frequency: '4 dÃ­as/semana',
    level: 'Intermedio',
    focus: 'Cardio y resistencia',
    rows: [
      { name: 'Sprints en cinta', sets: '6', reps: '30 s', rest: '60 s', weight: 'â€”', muscle: 'Cardio', instructions: 'Velocidad alta sostenida por 30 segundos, recuperaciÃ³n caminando. MantÃ©n la postura erguida y no te apoyes en las manijas.' },
      { name: 'Battle ropes', sets: '4', reps: '40 s', rest: '40 s', weight: 'â€”', muscle: 'Cardio', instructions: 'Ondas alternas rÃ¡pidas con core firme y rodillas semiflexionadas. El ritmo debe ser constante, no explosiones sueltas.' },
      { name: 'Remo en mÃ¡quina', sets: '3', reps: '500 m', rest: '90 s', weight: 'â€”', muscle: 'Cardio', instructions: 'Secuencia piernas-tronco-brazos al impulsar y brazos-tronco-piernas al regresar. Espalda neutra todo el recorrido.' },
      { name: 'Salto a la comba', sets: '4', reps: '60 s', rest: '45 s', weight: 'â€”', muscle: 'Cardio', instructions: 'Saltos bajos y muÃ±ecas activas. Aterriza con rodillas suaves para proteger las articulaciones.' },
      { name: 'Bicicleta intervalos', sets: '5', reps: '1 min', rest: '60 s', weight: 'Resistencia media-alta', muscle: 'Cardio', instructions: 'Alterna 1 minuto fuerte / 1 minuto suave. Regula el asiento a la altura de la cadera para un pedaleo eficiente.' },
    ],
    assessmentNum: 4,
    progress: { completedSessions: 5, totalSessions: 16, adherence: 55, lastSession: '2026-05-12' },
  },
  {
    id: 'core-poderoso',
    name: 'Core Poderoso',
    duration: '6 semanas',
    frequency: '3 dÃ­as/semana',
    level: 'Principiante',
    focus: 'Abdomen y zona media',
    rows: [
      { name: 'Crunch abdominal', sets: '3', reps: '15', rest: '45 s', weight: 'Peso corporal', muscle: 'Core', instructions: 'Manos a los lados de la cabeza sin tirar del cuello. Sube despegando hombros contrayendo el abdomen, baja lento.' },
      { name: 'ElevaciÃ³n de piernas', sets: '3', reps: '12', rest: '45 s', weight: 'Peso corporal', muscle: 'Core', instructions: 'Tumbado, manos bajo los glÃºteos para proteger la lumbar. Sube piernas rectas hasta 90 grados y baja sin tocar el suelo.' },
      { name: 'Plancha frontal', sets: '3', reps: '40 s', rest: '45 s', weight: 'Peso corporal', muscle: 'Core', instructions: 'Codos bajo hombros, cuerpo en lÃ­nea recta. Aprieta glÃºteos y abdomen; respira sin arquear la espalda.' },
      { name: 'Plancha lateral', sets: '3', reps: '30 s', rest: '45 s', weight: 'Peso corporal', muscle: 'Core', instructions: 'Apoyo sobre antebrazo y borde del pie. Cadera alta y alineada; cambia de lado tras cada serie.' },
      { name: 'Bird dog', sets: '3', reps: '10', rest: '40 s', weight: 'Peso corporal', muscle: 'Core', instructions: 'En cuadrupedia, extiende brazo y pierna opuestos manteniendo la cadera estable. Pausa 2 segundos arriba.' },
    ],
    assessmentNum: 5,
    progress: { completedSessions: 2, totalSessions: 12, adherence: 35, lastSession: '2026-05-08' },
  },
  {
    id: 'definicion-tren-superior',
    name: 'DefiniciÃ³n Tren Superior',
    duration: '10 semanas',
    frequency: '4 dÃ­as/semana',
    level: 'Avanzado',
    focus: 'Tren superior',
    rows: [
      { name: 'Press inclinado con mancuernas', sets: '4', reps: '10-12', rest: '75 s', weight: '22 kg c/u', muscle: 'Pecho', instructions: 'Banco a 30-45 grados. Baja mancuernas a la altura del pecho sintiendo estiramiento y sube juntando sin chocar.' },
      { name: 'Remo con barra', sets: '4', reps: '10', rest: '90 s', weight: '60 kg', muscle: 'Espalda', instructions: 'Tronco a 45 grados, espalda recta. Lleva la barra al ombligo apretando escÃ¡pulas al final del recorrido.' },
      { name: 'Elevaciones laterales', sets: '4', reps: '12-15', rest: '60 s', weight: '10 kg c/u', muscle: 'Hombros', instructions: 'Codos ligeramente flexionados, sube a la altura de los hombros sin encoger el trapecio. Baja controlado.' },
      { name: 'JalÃ³n al pecho', sets: '4', reps: '12', rest: '75 s', weight: '55 kg', muscle: 'Dorsal', instructions: 'Agarre ancho, pecho arriba. Lleva la barra a la clavÃ­cula pensando en codos hacia abajo, no en las manos.' },
      { name: 'Curl de bÃ­ceps alterno', sets: '3', reps: '12', rest: '60 s', weight: '14 kg c/u', muscle: 'Brazos', instructions: 'Codos pegados al torso, supina la muÃ±eca al subir. Sin balanceo; si te impulsas, baja el peso.' },
    ],
    assessmentNum: 6,
    progress: { completedSessions: 7, totalSessions: 16, adherence: 70, lastSession: '2026-05-18' },
  },
  {
    id: 'movilidad-functional',
    name: 'Movilidad Funcional',
    duration: '4 semanas',
    frequency: '3 dÃ­as/semana',
    level: 'Principiante',
    focus: 'Movilidad y prevenciÃ³n',
    rows: [
      { name: 'Cat-Camel spinal', sets: '2', reps: '10', rest: '30 s', weight: 'Peso corporal', muscle: 'Core', instructions: 'En cuadrupedia, alterna arquear y redondear la espalda lentamente coordinando con la respiraciÃ³n.' },
      { name: '90/90 cadera', sets: '3', reps: '8', rest: '40 s', weight: 'Peso corporal', muscle: 'Piernas', instructions: 'Sentado con piernas a 90 grados, rota las rodillas de lado a lado sin mover el torso. Gana rango progresivamente.' },
      { name: 'World greatest stretch', sets: '2', reps: '6', rest: '40 s', weight: 'Peso corporal', muscle: 'Full body', instructions: 'Zancada profunda con codo al interior y rotaciÃ³n torÃ¡cica hacia el techo. El mejor estiramiento integral.' },
      { name: 'DislocaciÃ³n de hombro', sets: '2', reps: '12', rest: '30 s', weight: 'Palo o banda', muscle: 'Hombros', instructions: 'Agarre ancho, pasa el palo por encima y detrÃ¡s lentamente. Reduce el agarre conforme ganes movilidad.' },
      { name: 'Sentadilla profunda sostenida', sets: '3', reps: '30 s', rest: '45 s', weight: 'Peso corporal', muscle: 'Piernas', instructions: 'Baja a sentadilla completa apoyando codos en rodillas, talones al suelo. Respira profundo para abrir caderas.' },
    ],
    assessmentNum: 7,
    progress: { completedSessions: 4, totalSessions: 12, adherence: 58, lastSession: '2026-05-19' },
  },
  {
    id: 'cross-training-unifit',
    name: 'Cross Training UNIFIT',
    duration: '8 semanas',
    frequency: '5 dÃ­as/semana',
    level: 'Avanzado',
    focus: 'Full body intenso',
    rows: [
      { name: 'Thrusters', sets: '5', reps: '10', rest: '90 s', weight: '40 kg', muscle: 'Full body', instructions: 'Front squat + press overhead en un solo movimiento explosivo. Usa el impulso de piernas para proyectar la barra.' },
      { name: 'Kettlebell swings', sets: '4', reps: '20', rest: '60 s', weight: '24 kg', muscle: 'GlÃºteos', instructions: 'Cadera como pistÃ³n, brazos solo de guÃ­a. La kettlebell llega a la altura del pecho con glÃºteo contraÃ­do.' },
      { name: 'Toes to bar', sets: '4', reps: '8', rest: '75 s', weight: 'Peso corporal', muscle: 'Core', instructions: 'Colgado de la barra, lleva los pies hasta ella con control lumbar. Si aÃºn no llegas, haz knee raises.' },
      { name: 'Wall balls', sets: '4', reps: '15', rest: '60 s', weight: '9 kg', muscle: 'Full body', instructions: 'Sentadilla profunda lanzando el balÃ³n a un punto de 3 metros. Atrapa en cuclillas y encadena el siguiente.' },
      { name: 'Farmer walk', sets: '3', reps: '40 m', rest: '90 s', weight: '2Ã—28 kg', muscle: 'Core', instructions: 'Camina con pesas a los lados, hombros atrÃ¡s y core firme. Pasos cortos y respiraciÃ³n constante.' },
    ],
    assessmentNum: 8,
    progress: { completedSessions: 9, totalSessions: 20, adherence: 80, lastSession: '2026-05-21' },
  },
  {
    id: 'tonificacion-general',
    name: 'TonificaciÃ³n General',
    duration: '6 semanas',
    frequency: '3 dÃ­as/semana',
    level: 'Principiante',
    focus: 'Full body suave',
    rows: [
      { name: 'Goblet squat', sets: '3', reps: '12', rest: '60 s', weight: '12 kg', muscle: 'Piernas', instructions: 'Mancuerna vertical al pecho. Baja entre las rodillas con pecho orgulloso y empuja desde el talÃ³n.' },
      { name: 'Push-ups inclinados', sets: '3', reps: '10', rest: '60 s', weight: 'Peso corporal', muscle: 'Pecho', instructions: 'Manos elevadas en banco para reducir carga. Cuerpo recto, pecho hacia el banco, codos a 45 grados.' },
      { name: 'Remo con mancuerna', sets: '3', reps: '12', rest: '60 s', weight: '16 kg', muscle: 'Espalda', instructions: 'Una mano y rodilla apoyadas en banco. Lleva la mancuerna a la cadera apretando la espalda media.' },
      { name: 'Puente de glÃºteos', sets: '3', reps: '15', rest: '45 s', weight: 'Peso corporal', muscle: 'GlÃºteos', instructions: 'Tumbado, sube cadera apretando glÃºteos hasta alinear rodilla-cadera-hombro. Pausa 1 segundo arriba.' },
      { name: 'Dead bug', sets: '3', reps: '10', rest: '45 s', weight: 'Peso corporal', muscle: 'Core', instructions: 'Tumbado, extiende brazo y pierna opuestos manteniendo la lumbar pegada al suelo. Lento y controlado.' },
    ],
    assessmentNum: 3,
    progress: { completedSessions: 1, totalSessions: 12, adherence: 20, lastSession: null },
  },
]

export const studentDocuments = [
  { name: 'Contrato de prestaciÃ³n de servicios', status: 'firmado', date: '12 Ago 2025' },
  { name: 'Tratamiento de datos personales', status: 'firmado', date: '12 Ago 2025' },
]