import { motion, AnimatePresence } from 'motion/react'
import { Dumbbell, Flame, Trophy, User, Star, Calendar, Target, Calendar as CalendarIcon, CheckCircle, Flame as FlameIcon, Zap, Heart } from 'lucide-react'
import { useStudentApp } from '@/features/student/hooks/useStudentApp'
import {
  ActivityRings,
  StreakCard,
  XPBar,
  AchievementCard,
  RankingItem,
  StatsSummary,
  BodyCompositionItem,
  UpcomingSessionCard,
  StatsSummary as StatsSummaryComponent,
  StatCard,
  BodyCompositionItem,
  UpcomingSessionCard,
} from '@/features/student/components/ui/ActivityComponents'
import { mockStudent, achievements, ranking, bodyComposition, statsCards, nextSessions, weeklyProgress } from '@/features/student/utils/mockData.tsx'

const RED = '#E63946'
const BLUE = '#007AFF'
const YELLOW = '#F5A623'
const GREEN = '#30D158'
const DARK_BG = '#0A0A14'

export function ProfilePage() {
  const { student, achievements, ranking, bodyComposition, statsCards, nextSessions } = useStudentApp()

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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 rounded-b-2xl z-50" style={{ background: 'rgba(0,0,0,0.85)' }}>
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-2.5 rounded-full" style={{ background: '#151520' }} />
        </div>

        <div className="flex-1 overflow-hidden pt-7">
          <AnimatePresence mode="wait">
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full overflow-y-auto px-5 pt-6 pb-20"
            >
              <div className="flex flex-col items-center mb-6">
                <div
                  className="w-20 h-20 rounded-3xl flex items-center justify-center text-white font-bold mb-3"
                  style={{
                    background: 'linear-gradient(135deg, #007AFF, #0055CC)',
                    fontSize: 28,
                    boxShadow: '0 12px 40px rgba(0,122,255,0.35)',
                  }}
                >
                  {student.firstName[0]}{student.lastName[0]}
                </div>
                <h3 className="text-white" style={{ fontSize: 17, fontWeight: 700 }}>{student.name}</h3>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>{student.goal} · {student.goal}</p>
                <div className="flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full" style={{ background: 'rgba(48,209,88,0.08)', border: '1px solid rgba(48,209,88,0.15)' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: GREEN }} />
                  <p style={{ color: GREEN, fontSize: 10, fontWeight: 600 }}>Activo — Adherencia {student.adherence}%</p>
                </div>
              </div>

              <StatsSummary cards={statsCards} />

              <div className="rounded-2xl p-5 mb-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, marginBottom: 14 }}>Composición Corporal</p>
                <div className="space-y-1">
                  {bodyComposition.map(s => (
                    <BodyCompositionItem key={s.label} {...s} />
                  ))}
                </div>
              </div>

              <XPBar level={student.level} xp={student.xp} nextLevelXp={student.nextLevelXp} levelName="Atleta" accentColor={YELLOW} />

              <div className="grid grid-cols-2 gap-2 mb-5">
                {achievements.map((ach, i) => (
                  <AchievementCard key={i} {...ach} />
                ))}
              </div>

              <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <Trophy size={14} style={{ color: '#FFD60A' }} />
                  <p style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>Ranking Facultad</p>
                </div>
                <div className="space-y-2">
                  {ranking.map((r, i) => (
                    <RankingItem key={i} {...r} />
                  ))}
                </div>
              </div>

              <div className="rounded-2xl p-5 mt-4" style={{
                background: 'linear-gradient(135deg, rgba(0,122,255,0.06), rgba(10,10,20,0))',
                border: '1px solid rgba(0,122,255,0.1)',
              }}>
                <div className="flex items-center gap-2 mb-4">
                  <CalendarIcon size={14} style={{ color: BLUE }} />
                  <p style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>Próximas sesiones</p>
                </div>
                {nextSessions.map((s, i) => (
                  <UpcomingSessionCard key={i} name={s.name} date={s.date} icon={<CalendarIcon size={14} />} iconColor={BLUE} />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}