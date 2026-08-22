import { motion } from 'motion/react'
import { Flame, Clock, Dumbbell, Check, Signal } from 'lucide-react'
import { useStudentApp } from '@/features/student/hooks/useStudentApp'
import { motivationalQuotes } from '@/features/student/utils/mockData'
import { SectionTitle, GradientBorder, cardStyle, FIRE, AMBER, GREEN } from '@/features/student/components/ui/fitness'
import { LEVEL_COLOR } from '@/features/student/modules/rutinas/routineAssets'
import studentBoy from '@/assets/illustrations/characters/students/student_boy.webp'
import studentGirl from '@/assets/illustrations/characters/students/student_girl.webp'

const QUOTE = motivationalQuotes[0]

export function HomePage() {
  const { student, todayWorkout, weeklyProgress } = useStudentApp()
  const doneCount = todayWorkout.exercises_list.filter(e => e.done).length
  const pct = Math.round((doneCount / todayWorkout.exercises_list.length) * 100)
  const photo = student.gender === 'M' ? studentBoy : studentGirl

  return (
    <div className="space-y-6">
      {/* Hero */}
      <GradientBorder radius={24}>
        <div className="relative overflow-hidden rounded-[23px]">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(90% 120% at 100% 0%, rgba(230,57,70,0.22), transparent 55%), radial-gradient(70% 100% at 0% 100%, rgba(245,166,35,0.12), transparent 60%)' }} />
          <div className="relative flex flex-col md:flex-row items-center gap-4 p-6 md:p-8">
            <div className="flex-1 min-w-0 order-2 md:order-1">
              <div className="flex items-center gap-2 mb-3">
                <Flame size={15} style={{ color: AMBER }} />
                <p className="uppercase tracking-[0.25em]" style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.45)' }}>
                  Jueves · Semana 12
                </p>
              </div>
              <h1 className="uppercase italic font-black text-white leading-[0.95]" style={{ fontSize: 'clamp(28px, 5vw, 44px)', letterSpacing: '-0.01em' }}>
                Hola, <span style={{ background: `linear-gradient(135deg, ${FIRE}, ${AMBER})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{student.firstName}</span>
              </h1>
              <p className="uppercase italic font-black mt-2" style={{ fontSize: 'clamp(11px, 1.6vw, 14px)', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.38)' }}>
                "{QUOTE}"
              </p>
            </div>
            <motion.img
              src={photo}
              alt={student.firstName}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="order-1 md:order-2 w-40 h-40 md:w-52 md:h-52 object-cover object-top rounded-3xl flex-shrink-0"
              style={{
                boxShadow: '0 24px 60px rgba(230,57,70,0.25)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            />
          </div>
        </div>
      </GradientBorder>

      {/* Workout de hoy */}
      <section>
        <SectionTitle>Entrenamiento de hoy</SectionTitle>
        <GradientBorder radius={22}>
          <div className="p-5 md:p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="min-w-0">
                <h3 className="uppercase italic font-black text-white" style={{ fontSize: 20, letterSpacing: '0.02em' }}>{todayWorkout.name}</h3>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 3 }}>Rutina actual · Entrenador Carlos Ruiz</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 mb-5">
              {[
                { icon: Clock, value: todayWorkout.duration, label: 'Duración', color: AMBER },
                { icon: Dumbbell, value: `${todayWorkout.exercises}`, label: 'Ejercicios', color: '#fff' },
                { icon: Signal, value: todayWorkout.level, label: 'Nivel', color: LEVEL_COLOR[todayWorkout.level] },
              ].map((s, i) => (
                <div key={i} className="rounded-2xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <s.icon size={16} style={{ color: s.color, margin: '0 auto 6px' }} />
                  <p className="text-white font-black" style={{ fontSize: 15 }}>{s.value}</p>
                  <p className="uppercase" style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.35)' }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Progreso */}
            <div>
              <div className="flex justify-between mb-2">
                <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)' }}>Progreso de sesión</span>
                <span style={{ fontSize: 11, fontWeight: 800, color: GREEN }}>{doneCount}/{todayWorkout.exercises_list.length} · {pct}%</span>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${GREEN}, #7CE495)` }}
                />
              </div>
            </div>
          </div>
        </GradientBorder>
      </section>

      {/* Racha + Semana */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-3xl p-5 flex items-center gap-4" style={cardStyle}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `linear-gradient(135deg, rgba(245,166,35,0.2), rgba(230,57,70,0.12))`, border: '1px solid rgba(245,166,35,0.3)' }}>
            <Flame size={26} style={{ color: AMBER }} />
          </div>
          <div className="flex-1">
            <p className="font-black text-white leading-none" style={{ fontSize: 30 }}>
              {student.streak}<span style={{ fontSize: 14, fontWeight: 700, color: AMBER }}> días</span>
            </p>
            <p className="uppercase tracking-widest" style={{ fontSize: 9.5, fontWeight: 700, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
              Racha activa · Mejor: {student.bestStreak} días
            </p>
          </div>
        </div>

        <div className="rounded-3xl p-5" style={cardStyle}>
          <div className="flex justify-between items-baseline mb-3">
            <p className="uppercase tracking-widest" style={{ fontSize: 9.5, fontWeight: 700, color: 'rgba(255,255,255,0.35)' }}>Esta semana</p>
            <p style={{ fontSize: 12, fontWeight: 800, color: GREEN }}>{weeklyProgress.filter(d => d.done).length}/7 sesiones</p>
          </div>
          <div className="flex justify-between">
            {weeklyProgress.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div
                  className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center font-black"
                  style={{
                    background: d.done ? `linear-gradient(135deg, ${GREEN}, #7CE495)` : 'rgba(255,255,255,0.05)',
                    color: d.done ? '#04110a' : 'rgba(255,255,255,0.3)',
                    border: d.done ? 'none' : '1px solid rgba(255,255,255,0.07)',
                    fontSize: 12,
                    boxShadow: d.done ? '0 6px 18px rgba(48,209,88,0.3)' : 'none',
                  }}
                >
                  {d.done ? <Check size={16} strokeWidth={3.5} /> : d.day}
                </div>
                {!d.done && <span className="md:hidden" style={{ fontSize: 8, color: 'rgba(255,255,255,0.25)' }}>{d.day}</span>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
