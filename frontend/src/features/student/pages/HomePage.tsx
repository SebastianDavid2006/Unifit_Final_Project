import { motion, AnimatePresence } from 'motion/react'
import { Home, Dumbbell, Trophy, User, Flame, Zap, Target, Heart, Star, Lock, ChevronRight, Play, CheckCircle, TrendingUp, Calendar, Brain, Award, Activity, Sparkles, Flame as FlameIcon } from 'lucide-react'
import { useStudentApp } from '@/features/student/hooks/useStudentApp'
import {
  ActivityRings,
  StreakCard,
  WeeklyProgressBar,
  CoachCard,
  XPBar,
} from '@/features/student/components/ui/ActivityComponents'
import { mockStudent, todayWorkout, weeklyProgress, coachMessage, upcomingSessions, statsCards, nextSessions } from '@/features/student/utils/mockData.tsx'

const RED = '#E63946'
const BLUE = '#007AFF'
const YELLOW = '#F5A623'
const DARK_BG = '#0A0A14'

export function HomePage() {
  const { student, todayWorkout, weeklyProgress, coachMessage, upcomingSessions, statsCards, nextSessions } = useStudentApp()

  const rings = [
    { label: 'Calorías', value: `${student.weight * 7} kcal`, color: YELLOW, pct: 78 },
    { label: 'Ejercicio', value: '39/60 min', color: BLUE, pct: 65 },
    { label: 'Movimiento', value: '8.1k/9k pasos', color: RED, pct: 90 },
  ]

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
        className="relative flex flex-col overflow-hidden"
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 0,
          background: DARK_BG,
        }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 rounded-b-2xl z-50" style={{ background: 'rgba(0,0,0,0.85)' }}>
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-2.5 rounded-full" style={{ background: '#151520' }} />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden pt-7">
          <AnimatePresence mode="wait">
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full overflow-y-auto px-5 pt-3 pb-20"
            >
              <div className="mb-5">
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Jueves, 28 Mayo</p>
                <h2 className="text-white mt-0.5" style={{ fontSize: 22, fontWeight: 700 }}>Hola, <span style={{ color: RED }}>{student.firstName}</span></h2>
              </div>

              {/* Activity Rings */}
              <div className="rounded-3xl p-5 mb-4" style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(12px)',
              }}>
                <ActivityRings rings={[
                  { label: 'Calorías', value: '420/540 kcal', color: YELLOW, pct: 78 },
                  { label: 'Ejercicio', value: '39/60 min', color: BLUE, pct: 65 },
                  { label: 'Movimiento', value: '8.1k/9k pasos', color: RED, pct: 90 },
                ]} />
              </div>

              {/* Streak */}
              <StreakCard streak={12} bestStreak={18} color={YELLOW} icon={<Flame size={22} style={{ color: YELLOW }} />} />

              {/* Weekly Progress */}
              <WeeklyProgressBar weeklyProgress={weeklyProgress} activeColor={YELLOW} />

              {/* AI Coach */}
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
                  ¡Excelente racha! Hoy es día de <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Hipertrofia Superior</strong>. Recuerda calentar bien antes de sentadillas. <span style={{ color: '#BF5AF2' }}>Llevas 420 kcal</span> — vas muy bien.
                </p>
              </div>

              {/* Upcoming Sessions */}
              <div className="rounded-2xl p-5 mt-4" style={{
                background: 'linear-gradient(135deg, rgba(0,122,255,0.06), rgba(10,10,20,0))',
                border: '1px solid rgba(0,122,255,0.1)',
              }}>
                <div className="flex items-center gap-2 mb-4">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: BLUE }}>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <p style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>Próximas sesiones</p>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'Full Body', date: 'Mañana, 7:00 AM', icon: '🏋️', color: RED },
                    { name: 'Valoración física', date: 'Lunes, 9:00 AM', icon: '📋', color: BLUE },
                  ].map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between py-3"
                      style={{ borderBottom: i === 0 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                    >
                      <div className="flex items-center gap-2">
                        <span style={{ color: s.color }}>{s.icon}</span>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>{s.name}</p>
                      </div>
                      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10 }}>{s.date}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}