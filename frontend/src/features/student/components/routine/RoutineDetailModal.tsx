import { motion, AnimatePresence } from 'motion/react'
import { X, ChevronRight, CheckCircle, Clock, Dumbbell, Flame, Zap, Heart, Star, Target, Award, Activity, Brain, Stethoscope, FileText, Calendar, User, Trophy, Flame as FlameIcon } from 'lucide-react'
import { RoutineWithAssessment } from '@/features/student/types/student'

interface RoutineDetailModalProps {
  isOpen: boolean
  routine: {
    routine: {
      name: string
      description: string
      duration: string
      frequency: string
      level: string
      rows: { name: string; sets: string; reps: string; rest: string; weight: string; muscle: string }[]
    }
    assessment: {
      score: number
      date: string
      next: string | null
      type: string
      evaluator: string
      metrics: { label: string; value: string }[]
      nivelActividad: string
      objetivoTarjetas: string[]
      objetivoDetalle: string
      estatura: string
      masaMagra: string
      grasaVisceral: string
      presionArterial: string
      edadMetabolica: string
      aguaCorporal: string
      resistenciaMuscular: string
      antecedentesSalud: string[]
      observacionesEntrenador: string
      diasDisponibles: string[]
      observacionesFinales: string
    }
    progress: {
      completedSessions: number
      totalSessions: number
      lastSession: string | null
      adherence: number
    }
  } | null
  onClose: () => void
}

export function RoutineDetailModal({ isOpen, routine, onClose }: RoutineDetailModalProps) {
  if (!isOpen || !routine) return null

  const { routine: r, assessment, progress } = routine
  const totalExercises = r.rows.length

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl flex flex-col"
          style={{
            background: '#0A0A14',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F5A623, #E63946)' }}>
                <Dumbbell size={24} color="white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-xl">{r.name}</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{r.description}</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </motion.button>
          </div>

          <div className="flex-1 overflow-hidden flex">
            {/* Left Panel - Routine Exercises */}
            <div className="w-full md:w-1/2 flex flex-col overflow-hidden" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="p-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold text-lg">Ejercicios ({r.rows.length})</h3>
                  <div className="flex items-center gap-2" style={{ color: '#30D158' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>Progreso: {Math.floor(Math.random() * 30) + 70}%</span>
                  </div>
                </div>

                <div className="flex gap-2 mb-4">
                  {[
                    { label: 'Duración', value: '60 min', color: '#F5A623', icon: '⏱️' },
                    { label: 'Calorías', value: '420 kcal', color: '#E63946', icon: '🔥' },
                    { label: 'Ejercicios', value: '5', color: '#007AFF', icon: '🏋️' },
                  ].map(s => (
                    <div key={s.label} className="flex-1 rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <p style={{ color: s.color, fontSize: 14, fontWeight: 700 }}>{s.value}</p>
                      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9 }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {r.rows.map((ex, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 p-4 rounded-2xl"
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.04)',
                    }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(48,209,88,0.1)', color: '#30D158' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-base truncate">{ex.name}</p>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{ex.muscle} · {ex.sets} × {ex.reps} · Descanso {ex.rest}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-white font-bold text-sm">{ex.sets} × {ex.reps}</p>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{ex.weight}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Panel - Assessment */}
            <div className="w-full md:w-1/2 flex flex-col overflow-hidden">
              <div className="p-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(18,112,183,0.15)' }}>
                    <Stethoscope size={24} color="#1270B7" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Valoración Vinculada</h3>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{assessment.date} · Score: {assessment.score}/100</p>
                  </div>
                </div>

                <div className="rounded-2xl p-4 mb-4" style={{ background: 'linear-gradient(135deg, #1270B710, rgba(10,10,20,0))', border: '1px solid #1270B720' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span style={{ color: '#1270B7' }}>📊</span>
                      <p style={{ color: 'white', fontSize: 13, fontWeight: 700 }}>Score: {assessment.score}/100</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#1270B720', color: '#1270B7' }}>{assessment.type}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {assessment.metrics.slice(0, 4).map((m, i) => (
                      <div key={i} className="flex items-center justify-between py-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <span style={{ color: 'rgba(255,255,255,0.4)' }}>{m.label}</span>
                        <span style={{ color: 'white', fontWeight: 600 }}>{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, marginBottom: 8 }}>Objetivo</p>
                    <p className="text-white text-sm">{assessment.objetivoDetalle || 'Sin detalles'}</p>
                  </div>

                  <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, marginBottom: 8 }}>Métricas Clave</p>
                    <div className="grid grid-cols-2 gap-2">
                      {assessment.metrics.map((m, i) => (
                        <div key={i} className="flex items-center justify-between py-1">
                          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>{m.label}</span>
                          <span style={{ color: 'white', fontSize: 11, fontWeight: 600 }}>{m.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, marginBottom: 8 }}>Entrenador: {assessment.evaluator}</p>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10 }}>{assessment.observacionesEntrenador || 'Sin observaciones'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="flex items-center justify-between p-5" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
              Cerrar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #F5A623, #E63946)', boxShadow: '0 8px 24px rgba(245,166,35,0.3)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Iniciar Rutina
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}