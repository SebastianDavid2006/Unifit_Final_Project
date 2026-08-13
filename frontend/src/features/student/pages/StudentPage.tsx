import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Home, Dumbbell, Trophy, User, Flame, Zap, Target, Heart,
  Star, Lock, ChevronRight, Play, CheckCircle, TrendingUp,
  Calendar, Brain, Award, Activity, Sparkles,
} from 'lucide-react'

const RED = '#E63946'
const BLUE = '#007AFF'
const YELLOW = '#F5A623'

const todayWorkout = {
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

const weeklyProgress = [
  { day: 'L', done: true },
  { day: 'M', done: true },
  { day: 'X', done: false },
  { day: 'J', done: true },
  { day: 'V', done: false },
  { day: 'S', done: false },
  { day: 'D', done: false },
]

const achievements = [
  { name: 'Primer Mes', icon: Star, unlocked: true, description: '30 días activo', color: YELLOW },
  { name: 'Racha 10', icon: Flame, unlocked: true, description: '10 días seguidos', color: YELLOW },
  { name: 'Fuerza Élite', icon: Zap, unlocked: true, description: '100kg en sentadilla', color: BLUE },
  { name: 'Cardio Pro', icon: Heart, unlocked: false, description: '50 sesiones cardio', color: RED },
  { name: 'Top Facultad', icon: Trophy, unlocked: false, description: '#1 en Ingeniería', color: BLUE },
  { name: 'Meta Cumplida', icon: Target, unlocked: false, description: 'Objetivo alcanzado', color: RED },
]

const ranking = [
  { position: 1, name: 'Luisa M.', faculty: 'Arte', score: 2450 },
  { position: 2, name: 'Ana G.', faculty: 'Ingeniería', score: 2280 },
  { position: 3, name: 'Carlos R.', faculty: 'Medicina', score: 2100 },
  { position: 4, name: 'Tú', faculty: 'Ingeniería', score: 1980, isUser: true },
  { position: 5, name: 'María F.', faculty: 'Derecho', score: 1870 },
]

const DARK_BG = '#0A0A14'

function ActivityRing({ radius, value, max, color, strokeWidth = 8 }: {
  radius: number; value: number; max: number; color: string; strokeWidth?: number
}) {
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(value / max, 1)
  return (
    <circle
      cx="60" cy="60" r={radius}
      fill="none" stroke={color} strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeDasharray={`${circumference * progress} ${circumference}`}
      strokeDashoffset={circumference * 0.25}
      style={{ filter: `drop-shadow(0 0 8px ${color}60)` }}
    />
  )
}

type MobileTab = 'home' | 'workout' | 'achievements' | 'profile'

export function StudentPage() {
  const [tab, setTab] = useState<MobileTab>('home')
  const [workoutStarted, setWorkoutStarted] = useState(false)

  return (
    <div className="size-full flex items-center justify-center" style={{
      background: 'radial-gradient(ellipse at 50% 30%, rgba(245,166,35,0.06) 0%, rgba(10,10,20,1) 60%)',
    }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-[0.03]" style={{
          background: 'radial-gradient(circle, #F5A623, transparent 70%)',
          animation: 'breathe 6s ease-in-out infinite',
        }} />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full opacity-[0.02]" style={{
          background: 'radial-gradient(circle, #007AFF, transparent 70%)',
          animation: 'breathe 8s ease-in-out infinite',
          animationDelay: '-3s',
        }} />
      </div>

      <div
        className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full z-10"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#30D158' }} />
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>App Móvil Estudiante — Vista previa</span>
      </div>

      <div
        className="relative flex flex-col overflow-hidden"
        style={{
          width: 390,
          height: 720,
          borderRadius: 48,
          background: DARK_BG,
          border: '10px solid rgba(255,255,255,0.06)',
          boxShadow: '0 60px 140px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 rounded-b-2xl z-50" style={{ background: 'rgba(0,0,0,0.85)' }}>
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-2.5 rounded-full" style={{ background: '#151520' }} />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden pt-7">
          <AnimatePresence mode="wait">
            {tab === 'home' && (
              <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full overflow-y-auto px-5 pt-3 pb-20">
                <div className="mb-5">
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Jueves, 28 Mayo</p>
                  <h2 className="text-white mt-0.5" style={{ fontSize: 22, fontWeight: 700 }}>Hola, <span style={{ color: RED }}>Ana</span></h2>
                </div>

                {/* Activity Rings */}
                <div className="rounded-3xl p-5 mb-4" style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(12px)',
                }}>
                  <div className="flex items-center gap-4">
                    <div className="relative" style={{ width: 120, height: 120 }}>
                      <svg viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)', width: 120, height: 120 }}>
                        <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(245,166,35,0.08)" strokeWidth={8} />
                        <circle cx="60" cy="60" r="40" fill="none" stroke="rgba(0,122,255,0.08)" strokeWidth={7} />
                        <circle cx="60" cy="60" r="30" fill="none" stroke="rgba(230,57,70,0.08)" strokeWidth={6} />
                        <ActivityRing radius={50} value={78} max={100} color={YELLOW} strokeWidth={8} />
                        <ActivityRing radius={40} value={65} max={100} color={BLUE} strokeWidth={7} />
                        <ActivityRing radius={30} value={90} max={100} color={RED} strokeWidth={6} />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p style={{ color: 'white', fontSize: 20, fontWeight: 700, lineHeight: 1 }}>420</p>
                          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9 }}>kcal</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 space-y-3">
                      {[
                        { label: 'Calorías', value: '420/540 kcal', color: YELLOW, pct: 78 },
                        { label: 'Ejercicio', value: '39/60 min', color: BLUE, pct: 65 },
                        { label: 'Movimiento', value: '8.1k/9k pasos', color: RED, pct: 90 },
                      ].map(ring => (
                        <div key={ring.label}>
                          <div className="flex justify-between mb-0.5">
                            <span style={{ color: ring.color, fontSize: 10, fontWeight: 600 }}>{ring.label}</span>
                            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>{ring.value}</span>
                          </div>
                          <div className="h-1.5 rounded-full" style={{ background: `${ring.color}12` }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${ring.pct}%` }}
                              transition={{ duration: 1.2, ease: 'easeOut' }}
                              className="h-full rounded-full"
                              style={{ background: ring.color, boxShadow: `0 0 6px ${ring.color}40` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Streak */}
                <div className="rounded-2xl p-5 mb-4 flex items-center gap-3" style={{
                  background: 'linear-gradient(135deg, rgba(245,166,35,0.1), rgba(245,166,35,0.05))',
                  border: '1px solid rgba(245,166,35,0.15)',
                }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,166,35,0.15)' }}>
                    <Flame size={22} style={{ color: YELLOW }} />
                  </div>
                  <div>
                    <p style={{ color: YELLOW, fontSize: 24, fontWeight: 800, lineHeight: 1 }}>12</p>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>días de racha</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Mejor racha</p>
                    <p style={{ color: 'white', fontSize: 14, fontWeight: 700 }}>18 días</p>
                  </div>
                </div>

                {/* Weekly summary */}
                <div className="rounded-2xl p-5 mb-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex justify-between items-center mb-3">
                    <p style={{ color: 'white', fontSize: 12, fontWeight: 600 }}>Esta semana</p>
                    <p style={{ color: BLUE, fontSize: 11, fontWeight: 600 }}>3/7 sesiones</p>
                  </div>
                  <div className="flex gap-2">
                    {weeklyProgress.map((day, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full rounded-xl flex items-center justify-center"
                          style={{
                            height: 34,
                            background: day.done ? `${YELLOW}15` : 'rgba(255,255,255,0.03)',
                            border: day.done ? `1px solid ${YELLOW}25` : '1px solid rgba(255,255,255,0.05)',
                          }}
                        >
                          {day.done && <CheckCircle size={13} style={{ color: YELLOW }} />}
                        </div>
                        <p style={{ color: day.done ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)', fontSize: 9, fontWeight: 600 }}>{day.day}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI coach */}
                <div className="rounded-2xl p-5" style={{
                  background: 'linear-gradient(135deg, rgba(245,166,35,0.08), rgba(10,10,20,0))',
                  border: '1px solid rgba(245,166,35,0.12)',
                }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Brain size={15} style={{ color: YELLOW }} />
                    <p style={{ color: 'white', fontSize: 12, fontWeight: 600 }}>Coach IA</p>
                    <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: '#30D158' }} />
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, lineHeight: 1.6 }}>
                    ¡Excelente racha, Ana! Hoy es día de <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Hipertrofia Superior</strong>. Recuerda calentar bien antes de sentadillas. <span style={{ color: '#BF5AF2' }}>Llevas 420 kcal</span> — vas muy bien.
                  </p>
                </div>
              </motion.div>
            )}

            {tab === 'workout' && (
              <motion.div key="workout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full overflow-y-auto px-5 pt-3 pb-20">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-white" style={{ fontSize: 18, fontWeight: 700 }}>Rutina de Hoy</h3>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>{todayWorkout.name}</p>
                  </div>
                  {!workoutStarted ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setWorkoutStarted(true)}
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl text-xs font-bold"
                      style={{
                        background: 'linear-gradient(135deg, #E63946, #CC0033)',
                        color: 'white',
                        boxShadow: '0 4px 16px rgba(230,57,70,0.3)',
                      }}
                    >
                      <Play size={14} /> Iniciar
                    </motion.button>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: 'rgba(48,209,88,0.1)', border: '1px solid rgba(48,209,88,0.2)' }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#30D158' }} />
                      <p style={{ color: '#30D158', fontSize: 11, fontWeight: 600 }}>En curso</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mb-5">
                  {[
                    { label: 'Duración', value: todayWorkout.duration, color: YELLOW },
                    { label: 'Calorías', value: `${todayWorkout.calories} kcal`, color: RED },
                    { label: 'Progreso', value: `${todayWorkout.completed}/${todayWorkout.exercises}`, color: BLUE },
                  ].map(s => (
                    <div key={s.label} className="flex-1 rounded-2xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <p style={{ color: s.color, fontSize: 14, fontWeight: 700 }}>{s.value}</p>
                      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9 }}>{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2.5">
                  {todayWorkout.exercises_list.map((ex, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="flex items-center gap-3 p-4 rounded-2xl"
                      style={{
                        background: ex.done ? 'rgba(48,209,88,0.04)' : 'rgba(255,255,255,0.03)',
                        border: ex.done ? '1px solid rgba(48,209,88,0.12)' : '1px solid rgba(255,255,255,0.05)',
                      }}
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: ex.done ? 'rgba(48,209,88,0.15)' : 'rgba(255,255,255,0.04)' }}
                      >
                        {ex.done ? (
                          <CheckCircle size={17} style={{ color: '#30D158' }} />
                        ) : (
                          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 14, fontWeight: 700 }}>{i + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p style={{
                          color: ex.done ? 'rgba(255,255,255,0.4)' : 'white',
                          fontSize: 12,
                          fontWeight: 600,
                          textDecoration: ex.done ? 'line-through' : 'none',
                        }}>
                          {ex.name}
                        </p>
                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>{ex.sets}</p>
                      </div>
                      {!ex.done && workoutStarted && (
                        <ChevronRight size={15} style={{ color: RED }} />
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {tab === 'achievements' && (
              <motion.div key="achievements" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full overflow-y-auto px-5 pt-3 pb-20">
                <h3 className="text-white mb-1" style={{ fontSize: 18, fontWeight: 700 }}>Logros</h3>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }} className="mb-5">3 de 6 desbloqueados</p>

                {/* XP bar */}
                <div className="rounded-2xl p-5 mb-5" style={{
                  background: 'linear-gradient(135deg, rgba(245,166,35,0.08), rgba(10,10,20,0))',
                  border: '1px solid rgba(245,166,35,0.12)',
                }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Star size={15} style={{ color: YELLOW }} />
                      <p style={{ color: 'white', fontSize: 13, fontWeight: 700 }}>Nivel 7 — Atleta</p>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>1,980 / 2,500 XP</p>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '79%' }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${YELLOW}, ${RED})` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-5">
                  {achievements.map((ach, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.06 }}
                      className="rounded-2xl p-4"
                      style={{
                        background: ach.unlocked ? `${ach.color}06` : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${ach.unlocked ? `${ach.color}20` : 'rgba(255,255,255,0.04)'}`,
                        opacity: ach.unlocked ? 1 : 0.45,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: ach.unlocked ? `${ach.color}15` : 'rgba(255,255,255,0.03)' }}>
                          {ach.unlocked ? (
                            <ach.icon size={17} style={{ color: ach.color }} />
                          ) : (
                            <Lock size={14} style={{ color: 'rgba(255,255,255,0.15)' }} />
                          )}
                        </div>
                        {ach.unlocked && <Sparkles size={12} style={{ color: ach.color }} />}
                      </div>
                      <p style={{ color: ach.unlocked ? 'white' : 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 600 }}>{ach.name}</p>
                      <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 9 }}>{ach.description}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Ranking */}
                <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <Trophy size={14} style={{ color: '#FFD60A' }} />
                    <p style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>Ranking Facultad</p>
                  </div>
                  <div className="space-y-2">
                    {ranking.map((r, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-2.5 rounded-xl"
                        style={{
                        background: r.isUser ? `${YELLOW}10` : 'transparent',
                        border: r.isUser ? `1px solid ${YELLOW}20` : '1px solid transparent',
                        }}
                      >
                        <p style={{ color: r.position <= 3 ? '#FFD60A' : 'rgba(255,255,255,0.3)', fontSize: 13, fontWeight: 700, width: 20 }}>
                          {r.position <= 3 ? ['🥇', '🥈', '🥉'][r.position - 1] : r.position}
                        </p>
                        <div className="flex-1">
                          <p style={{ color: r.isUser ? YELLOW : 'white', fontSize: 11, fontWeight: r.isUser ? 700 : 500 }}>{r.name}</p>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{r.score.toLocaleString()} XP</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {tab === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full overflow-y-auto px-5 pt-6 pb-20">
                <div className="flex flex-col items-center mb-6">
                  <div
                    className="w-20 h-20 rounded-3xl flex items-center justify-center text-white font-bold mb-3"
                    style={{
                      background: 'linear-gradient(135deg, #007AFF, #0055CC)',
                      fontSize: 28,
                      boxShadow: '0 12px 40px rgba(0,122,255,0.35)',
                    }}
                  >
                    AG
                  </div>
                  <h3 className="text-white" style={{ fontSize: 17, fontWeight: 700 }}>Ana García Martínez</h3>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>Ingeniería · Objetivo: Pérdida de peso</p>
                  <div className="flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full" style={{ background: 'rgba(48,209,88,0.08)', border: '1px solid rgba(48,209,88,0.15)' }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#30D158' }} />
                    <p style={{ color: '#30D158', fontSize: 10, fontWeight: 600 }}>Activo — Adherencia 92%</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-5">
                  {[
                    { label: 'Sesiones', value: '24', icon: Dumbbell, color: RED },
                    { label: 'Racha', value: '12d', icon: Flame, color: YELLOW },
                    { label: 'Nivel', value: '7', icon: Star, color: YELLOW },
                  ].map(s => (
                    <div key={s.label} className="rounded-2xl p-3.5 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <s.icon size={17} style={{ color: s.color, margin: '0 auto 4px' }} />
                      <p style={{ color: 'white', fontSize: 17, fontWeight: 700 }}>{s.value}</p>
                      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9 }}>{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl p-5 mb-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, marginBottom: 14 }}>Composición Corporal</p>
                  <div className="space-y-1">
                    {[
                      { label: 'Peso', value: '62 kg', change: '-6 kg', color: '#30D158' },
                      { label: 'Grasa corporal', value: '17%', change: '-5%', color: '#30D158' },
                      { label: 'Masa muscular', value: '52 kg', change: '+4 kg', color: '#00E5FF' },
                      { label: 'IMC', value: '22.8', change: 'Saludable', color: '#30D158' },
                    ].map(s => (
                      <div key={s.label} className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>{s.label}</span>
                        <div className="flex items-center gap-2">
                          <span style={{ color: 'white', fontSize: 12, fontWeight: 600 }}>{s.value}</span>
                          <span style={{ color: s.color, fontSize: 10, fontWeight: 700 }}>{s.change}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl p-5" style={{
                  background: 'linear-gradient(135deg, rgba(0,122,255,0.06), rgba(10,10,20,0))',
                  border: '1px solid rgba(0,122,255,0.1)',
                }}>
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar size={14} style={{ color: BLUE }} />
                    <p style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>Próximas sesiones</p>
                  </div>
                  {[
                    { name: 'Full Body', date: 'Mañana, 7:00 AM' },
                    { name: 'Valoración física', date: 'Lunes, 9:00 AM' },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between py-3" style={{ borderBottom: i === 0 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>{s.name}</p>
                      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10 }}>{s.date}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Tab Bar */}
        <div
          className="flex-shrink-0 flex items-center justify-around px-4 py-2"
          style={{
            background: 'rgba(10,10,20,0.97)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {[
            { id: 'home' as MobileTab, icon: Home, label: 'Inicio' },
            { id: 'workout' as MobileTab, icon: Dumbbell, label: 'Rutina' },
            { id: 'achievements' as MobileTab, icon: Trophy, label: 'Logros' },
            { id: 'profile' as MobileTab, icon: User, label: 'Perfil' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all"
              style={{ color: tab === t.id ? YELLOW : 'rgba(255,255,255,0.25)' }}
            >
              <t.icon size={21} />
              <span style={{ fontSize: 9, fontWeight: 600 }}>{t.label}</span>
              {tab === t.id && <div className="w-1 h-1 rounded-full" style={{ background: YELLOW }} />}
            </button>
          ))}
        </div>

        {/* Home indicator */}
        <div className="flex justify-center pb-2">
          <div className="w-28 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }} />
        </div>
      </div>
    </div>
  )
}
