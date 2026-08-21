import { motion } from 'motion/react'

interface ActivityRingProps {
  radius: number
  value: number
  max: number
  color: string
  strokeWidth?: number
}

export function ActivityRing({ radius, value, max, color, strokeWidth = 8 }: ActivityRingProps) {
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

interface ActivityRingsProps {
  rings: {
    label: string
    value: string
    color: string
    pct: number
  }[]
}

export function ActivityRings({ rings }: ActivityRingsProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative" style={{ width: 120, height: 120 }}>
        <svg viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)', width: 120, height: 120 }}>
          <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(245,166,35,0.08)" strokeWidth={8} />
          <circle cx="60" cy="60" r="40" fill="none" stroke="rgba(0,122,255,0.08)" strokeWidth={7} />
          <circle cx="60" cy="60" r="30" fill="none" stroke="rgba(230,57,70,0.08)" strokeWidth={6} />
          <ActivityRing radius={50} value={rings[0]?.pct || 0} max={100} color={rings[0]?.color || '#F5A623'} strokeWidth={8} />
          <ActivityRing radius={40} value={rings[1]?.pct || 0} max={100} color={rings[1]?.color || '#007AFF'} strokeWidth={7} />
          <ActivityRing radius={30} value={rings[2]?.pct || 0} max={100} color={rings[2]?.color || '#E63946'} strokeWidth={6} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{ color: 'white', fontSize: 20, fontWeight: 700, lineHeight: 1 }}
            >
              {rings[0]?.value?.split('/')[0] || '0'}
            </motion.p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9 }}>{rings[0]?.value?.split('/')[1] || 'kcal'}</p>
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-3">
        {rings.map((ring, i) => (
          <motion.div
            key={ring.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
          >
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
          </motion.div>
        ))}
      </div>
    </div>
  )
}

interface StreakCardProps {
  streak: number
  bestStreak: number
  color: string
  icon: React.ReactNode
}

export function StreakCard({ streak, bestStreak, color, icon }: StreakCardProps) {
  return (
    <div className="rounded-2xl p-5 mb-4 flex items-center gap-3" style={{
      background: `linear-gradient(135deg, ${color}10, ${color}05)`,
      border: `1px solid ${color}25`,
    }}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
        {icon}
      </div>
      <div>
        <p style={{ color, fontSize: 24, fontWeight: 800, lineHeight: 1 }}>{streak}</p>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>días de racha</p>
      </div>
      <div className="ml-auto text-right">
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Mejor racha</p>
        <p style={{ color: 'white', fontSize: 14, fontWeight: 700 }}>{bestStreak} días</p>
      </div>
    </div>
  )
}

interface WeeklyProgressProps {
  weeklyProgress: { day: string; done: boolean }[]
  activeColor: string
}

export function WeeklyProgressBar({ weeklyProgress, activeColor }: WeeklyProgressProps) {
  return (
    <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex justify-between items-center mb-3">
        <p style={{ color: 'white', fontSize: 12, fontWeight: 600 }}>Esta semana</p>
        <p style={{ color: '#007AFF', fontSize: 11, fontWeight: 600 }}>
          {weeklyProgress.filter(d => d.done).length}/{weeklyProgress.length} sesiones
        </p>
      </div>
      <div className="flex gap-2">
        {weeklyProgress.map((day, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.05, type: 'spring', stiffness: 300, damping: 20 }}
            className="flex-1 flex flex-col items-center gap-1"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.05 + 0.1, type: 'spring', stiffness: 300, damping: 20 }}
              className="w-full rounded-xl flex items-center justify-center"
              style={{
                height: 34,
                background: day.done ? `${activeColor}15` : 'rgba(255,255,255,0.03)',
                border: day.done ? `1px solid ${activeColor}25` : '1px solid rgba(255,255,255,0.05)',
              }}
            >
              {day.done && <span style={{ color: activeColor }}>✓</span>}
            </motion.div>
            <p style={{ color: day.done ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)', fontSize: 9, fontWeight: 600 }}>{day.day}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

interface CoachCardProps {
  message: string
  highlight?: string
  highlightColor?: string
  icon: React.ReactNode
  accentColor: string
}

export function CoachCard({ message, highlight, highlightColor, icon, accentColor }: CoachCardProps) {
  return (
    <div className="rounded-2xl p-5" style={{
      background: `linear-gradient(135deg, ${accentColor}08, rgba(10,10,20,0))`,
      border: `1px solid ${accentColor}20`,
    }}>
      <div className="flex items-center gap-2 mb-3">
        <span style={{ color: accentColor }}>{icon}</span>
        <p style={{ color: 'white', fontSize: 12, fontWeight: 600 }}>Coach IA</p>
        <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: '#30D158' }} />
      </div>
      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, lineHeight: 1.6 }}>
        {message.split(highlight || '').map((part, i) =>
          part === (highlight || '') ? (
            <strong key={i} style={{ color: highlightColor || 'white' }}>{part}</strong>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </p>
    </div>
  )
}

interface XPBarProps {
  level: number
  xp: number
  nextLevelXp: number
  levelName: string
  accentColor: string
}

export function XPBar({ level, xp, nextLevelXp, levelName, accentColor }: XPBarProps) {
  const pct = Math.min((xp / nextLevelXp) * 100, 100)
  return (
    <div className="rounded-2xl p-5 mb-5" style={{
      background: `linear-gradient(135deg, ${accentColor}08, rgba(10,10,20,0))`,
      border: `1px solid ${accentColor}20`,
    }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span style={{ color: '#F5A623' }}>⭐</span>
          <p style={{ color: 'white', fontSize: 13, fontWeight: 700 }}>Nivel {level} — {levelName}</p>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{xp.toLocaleString()} / {nextLevelXp.toLocaleString()} XP</p>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, #F5A623, #E63946)` }}
        />
      </div>
    </div>
  )
}

interface AchievementCardProps {
  name: string
  icon: React.ReactNode
  unlocked: boolean
  description: string
  color: string
}

export function AchievementCard({ name, icon, unlocked, description, color }: AchievementCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl p-4"
      style={{
        background: unlocked ? `${color}06` : 'rgba(255,255,255,0.02)',
        border: `1px solid ${unlocked ? `${color}20` : 'rgba(255,255,255,0.04)'}`,
        opacity: unlocked ? 1 : 0.45,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: unlocked ? `${color}15` : 'rgba(255,255,255,0.03)' }}>
          {unlocked ? (
            <span style={{ color }}>{icon}</span>
          ) : (
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>🔒</span>
          )}
        </div>
        {unlocked && <span style={{ color }}>✨</span>}
      </div>
      <p style={{ color: unlocked ? 'white' : 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 600 }}>{name}</p>
      <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 9 }}>{description}</p>
    </motion.div>
  )
}

interface RankingItemProps {
  position: number
  name: string
  score: number
  isUser?: boolean
}

export function RankingItem({ position, name, score, isUser }: RankingItemProps) {
  const medals = ['🥇', '🥈', '🥉']
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: position * 0.05 }}
      className="flex items-center gap-2 p-2.5 rounded-xl"
      style={{
        background: isUser ? '#F5A62310' : 'transparent',
        border: isUser ? '1px solid #F5A62320' : '1px solid transparent',
      }}
    >
      <p style={{ color: position <= 3 ? '#FFD60A' : 'rgba(255,255,255,0.3)', fontSize: 13, fontWeight: 700, width: 20 }}>
        {position <= 3 ? medals[position - 1] : position}
      </p>
      <div className="flex-1">
        <p style={{ color: isUser ? '#F5A623' : 'white', fontSize: 11, fontWeight: isUser ? 700 : 500 }}>{name}</p>
      </div>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{score.toLocaleString()} XP</p>
    </motion.div>
  )
}

interface StatCardProps {
  label: string
  value: string
  icon: React.ReactNode
  color: string
}

export function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <div className="rounded-2xl p-3.5 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ color, margin: '0 auto 4px', display: 'flex', justifyContent: 'center' }}>{icon}</div>
      <p style={{ color: 'white', fontSize: 17, fontWeight: 700 }}>{value}</p>
      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9 }}>{label}</p>
    </div>
  )
}

interface BodyCompositionItemProps {
  label: string
  value: string
  change: string
  color: string
}

export function BodyCompositionItem({ label, value, change, color }: BodyCompositionItemProps) {
  return (
    <div className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>{label}</span>
      <div className="flex items-center gap-2">
        <span style={{ color: 'white', fontSize: 12, fontWeight: 600 }}>{value}</span>
        <span style={{ color, fontSize: 10, fontWeight: 700 }}>{change}</span>
      </div>
    </div>
  )
}

interface UpcomingSessionProps {
  name: string
  date: string
  icon: React.ReactNode
  iconColor: string
}

export function UpcomingSessionCard({ name, date, icon, iconColor }: UpcomingSessionProps) {
  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div className="flex items-center gap-2">
        <span style={{ color: iconColor }}>{icon}</span>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>{name}</p>
      </div>
      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10 }}>{date}</p>
    </div>
  )
}

interface StatsSummaryProps {
  cards: { label: string; value: string; icon: React.ReactNode; color: string }[]
}

export function StatsSummary({ cards }: StatsSummaryProps) {
  return (
    <div className="grid grid-cols-3 gap-2 mb-5">
      {cards.map((s, i) => (
        <StatCard key={i} {...s} />
      ))}
    </div>
  )
}