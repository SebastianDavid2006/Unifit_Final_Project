import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronLeft, Dumbbell, Search, Filter, Star, Clock, Flame, Trophy, Target, Calendar, User, CheckCircle, ArrowRight } from 'lucide-react'
import { useAuthLayout } from '@/auth/hooks/useAuthLayout'
import { useStudentApp } from '@/features/student/hooks/useStudentApp'
import { useRoutines } from '@/features/student/hooks/useRoutines'
import { RoutineCard } from '@/features/student/components/routine/RoutineCard'
import { mockStudent } from '@/features/student/utils/mockData.tsx'
import { assessmentItems } from '@/modules/students/StudentProfileData'

const RED = '#E63946'
const BLUE = '#007AFF'
const YELLOW = '#F5A623'
const GREEN = '#30D158'
const DARK_BG = '#0A0A14'

const routineFilters = ['Todas', 'Activas', 'Completadas', 'Pendientes'] as const
type RoutineFilter = typeof routineFilters[number]

export function RoutinesPage() {
  const { isPhonePreview, isMobile } = useAuthLayout()
  const { student } = useStudentApp()
  const [filter, setFilter] = useState<'Todas' | 'Activas' | 'Completadas' | 'Pendientes'>('Todas')
  const [search, setSearch] = useState('')
  const [selectedRoutine, setSelectedRoutine] = useState<any>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const routines = useRoutines(assessmentItems)

  const filteredRoutines = routines.routines
    .filter(r => {
      if (filter === 'Activas' && r.progress.adherence < 100) return true
      if (filter === 'Completadas' && r.progress.adherence >= 100) return true
      if (filter === 'Pendientes' && r.progress.completedSessions === 0) return true
      return filter === 'Todas'
    })
    .filter(r =>
      r.routine.name.toLowerCase().includes(search.toLowerCase()) ||
      r.assessment.evaluator.toLowerCase().includes(search.toLowerCase())
    )

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
          <div className="px-5 pb-4 flex items-center justify-between">
            <h1 className="text-white" style={{ fontSize: 20, fontWeight: 700 }}>Mis Rutinas</h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #F5A623, #E63946)', color: 'white', boxShadow: '0 4px 16px rgba(245,166,35,0.3)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </motion.button>
          </div>

          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key="routines"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full overflow-y-auto px-5 pb-20"
              >
                {/* Search */}
                <div className="relative mb-4">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.2)' }}>
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Buscar rutinas..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl text-sm"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', outline: 'none' }}
                  />
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                  {['Todas', 'Activas', 'Completadas', 'Pendientes'].map(f => (
                    <motion.button
                      key={f}
                      onClick={() => setFilter(f as 'Todas' | 'Activas' | 'Completadas' | 'Pendientes')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all"
                      style={{
                        background: filter === f ? 'rgba(245,166,35,0.15)' : 'transparent',
                        color: filter === f ? '#F5A623' : 'rgba(255,255,255,0.35)',
                        border: filter === f ? '1px solid rgba(245,166,35,0.25)' : '1px solid transparent',
                      }}
                    >
                      {f}
                    </motion.button>
                  ))}
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="rounded-2xl p-3 text-center" style={{ background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.15)' }}>
                    <p style={{ color: '#F5A623', fontSize: 18, fontWeight: 700 }}>24</p>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9 }}>Sesiones Totales</p>
                  </div>
                  <div className="rounded-2xl p-3 text-center" style={{ background: 'rgba(0,122,255,0.08)', border: '1px solid rgba(0,122,255,0.15)' }}>
                    <p style={{ color: '#007AFF', fontSize: 18, fontWeight: 700 }}>92%</p>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9 }}>Adherencia</p>
                  </div>
                  <div className="rounded-2xl p-3 text-center" style={{ background: 'rgba(48,209,88,0.08)', border: '1px solid rgba(48,209,88,0.15)' }}>
                    <p style={{ color: '#30D158', fontSize: 18, fontWeight: 700 }}>12d</p>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9 }}>Racha Actual</p>
                  </div>
                </div>

                {/* Routines List */}
                <div className="space-y-3">
                  {routines.routines.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3" style={{ opacity: 0.3 }}>
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                      <p className="text-lg font-medium">No hay rutinas</p>
                      <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Completa una valoración para generar tu rutina</p>
                    </div>
                  ) : (
                    [
                      {
                        routine: {
                          name: 'Hipertrofia Superior',
                          duration: '60 min',
                          frequency: '3 días/semana',
                          level: 'Intermedio',
                          rows: [
                            { name: 'Sentadilla con barra', sets: '4x8-10', reps: '8-10', rest: '90 s', weight: '80 kg', muscle: 'Cuádriceps' },
                            { name: 'Press de banca', sets: '4x8-10', reps: '8-10', rest: '90 s', weight: '70 kg', muscle: 'Pecho' },
                            { name: 'Peso muerto', sets: '3x6-8', reps: '6-8', rest: '120 s', weight: '100 kg', muscle: 'Espalda' },
                            { name: 'Dominadas', sets: '3x8-12', reps: '8-12', rest: '90 s', weight: 'Peso corporal', muscle: 'Dorsal' },
                            { name: 'Press militar', sets: '3x10-12', reps: '10-12', rest: '90 s', weight: '50 kg', muscle: 'Hombros' },
                          ]
                        },
                        assessment: {
                          score: 87,
                          date: '15 May 2026',
                          evaluator: 'Carlos Ruiz',
                          metrics: [
                            { label: 'Peso', value: '72 kg' },
                            { label: 'IMC', value: '23.4' },
                            { label: 'Grasa Corporal', value: '18%' },
                            { label: 'Masa Muscular', value: '32 kg' },
                          ],
                          objetivoDetalle: 'Incrementar masa muscular y mejorar la condición física general para competencias de fin de año.',
                        },
                        progress: { completedSessions: 8, totalSessions: 12, adherence: 78, lastSession: '2026-05-20' }
                      },
                      {
                        routine: {
                          name: 'Fuerza Tren Inferior',
                          duration: '75 min',
                          frequency: '3 días/semana',
                          level: 'Avanzado',
                          rows: [
                            { name: 'Sentadilla libre', sets: '5x5', reps: '5', rest: '180 s', weight: '120 kg', muscle: 'Cuádriceps' },
                            { name: 'Prensa de piernas', sets: '4x8', reps: '8', rest: '120 s', weight: '200 kg', muscle: 'Cuádriceps' },
                            { name: 'Peso muerto rumano', sets: '4x6', reps: '6', rest: '120 s', weight: '140 kg', muscle: 'Isquiotibiales' },
                            { name: 'Zancadas búlgaras', sets: '3x10', reps: '10', rest: '90 s', weight: '20 kg', muscle: 'Glúteos' },
                            { name: 'Elevación de talones', sets: '4x15', reps: '15', rest: '60 s', weight: '40 kg', muscle: 'Pantorrilla' },
                          ]
                        },
                        assessment: {
                          score: 82,
                          date: '20 Feb 2026',
                          evaluator: 'Carlos Ruiz',
                          metrics: [
                            { label: 'Peso', value: '73 kg' },
                            { label: 'IMC', value: '23.8' },
                            { label: 'Grasa Corporal', value: '19%' },
                            { label: 'Masa Muscular', value: '31 kg' },
                          ],
                          objetivoDetalle: 'Aumentar fuerza en tren inferior y mejorar los levantamientos básicos.',
                        },
                        progress: { completedSessions: 6, totalSessions: 12, adherence: 65, lastSession: '2026-05-15' }
                      },
                      {
                        routine: {
                          name: 'Acondicionamiento Full Body',
                          duration: '45 min',
                          frequency: '4 días/semana',
                          level: 'Intermedio',
                          rows: [
                            { name: 'Burpees', sets: '4x10', reps: '10', rest: '60 s', weight: 'Peso corporal', muscle: 'Cardio' },
                            { name: 'Kettlebell swings', sets: '4x15', reps: '15', rest: '60 s', weight: '24 kg', muscle: 'Glúteos' },
                            { name: 'Push-ups', sets: '3x15', reps: '15', rest: '60 s', weight: 'Peso corporal', muscle: 'Pecho' },
                            { name: 'Mountain climbers', sets: '3x30s', reps: '30s', rest: '60 s', weight: 'Peso corporal', muscle: 'Core' },
                            { name: 'Plancha', sets: '3x60s', reps: '60s', rest: '60 s', weight: 'Peso corporal', muscle: 'Core' },
                          ]
                        },
                        assessment: {
                          score: 78,
                          date: '10 Nov 2025',
                          evaluator: 'Carlos Ruiz',
                          metrics: [
                            { label: 'Peso', value: '74 kg' },
                            { label: 'IMC', value: '24.1' },
                            { label: 'Grasa Corporal', value: '20%' },
                            { label: 'Masa Muscular', value: '30 kg' },
                          ],
                          objetivoDetalle: 'Mejorar resistencia cardiovascular y bienestar general.',
                        },
                        progress: { completedSessions: 3, totalSessions: 16, adherence: 42, lastSession: '2026-05-10' }
                      }
                    ].map((routine, i) => (
                      <motion.div
                        key={routine.routine.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <div
                          className="flex flex-col p-4 rounded-2xl cursor-pointer transition-all"
                          style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.06)',
                          }}
                          onClick={() => setSelectedRoutine(routine)}
                        >
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white font-bold text-lg truncate mb-1">{routine.routine.name}</h3>
                              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Valoración: {routine.assessment.score}/100 · {routine.assessment.date}</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(245,166,35,0.15)', color: '#F5A623' }}>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 19l-7-7 7-7" />
                              </svg>
                            </div>
                          </div>

                          <div className="flex gap-3 mb-3">
                            <div className="flex-1 rounded-xl p-3 text-center" style={{ background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.15)' }}>
                              <p style={{ color: '#F5A623', fontSize: 16, fontWeight: 700 }}>{routine.routine.duration}</p>
                              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>Duración</p>
                            </div>
                            <div className="flex-1 rounded-xl p-3 text-center" style={{ background: 'rgba(0,122,255,0.08)', border: '1px solid rgba(0,122,255,0.15)' }}>
                              <p style={{ color: '#007AFF', fontSize: 16, fontWeight: 700 }}>{routine.routine.frequency}</p>
                              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>Frecuencia</p>
                            </div>
                            <div className="flex-1 rounded-xl p-3 text-center" style={{ background: 'rgba(230,57,70,0.08)', border: '1px solid rgba(230,57,70,0.15)' }}>
                              <p style={{ color: '#E63946', fontSize: 16, fontWeight: 700 }}>{routine.routine.level}</p>
                              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>Nivel</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: '#30D158' }}>5</span>
                              <span style={{ color: '#30D158', fontSize: 12, fontWeight: 600 }}>5 ejercicios</span>
                            </div>
                            <div className="flex items-center gap-1.5" style={{ color: '#30D158' }}>
                              <span style={{ fontSize: 14, fontWeight: 700 }}>{routine.progress.adherence}%</span>
                              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Adherencia</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            {routine.routine.rows.slice(0, 3).map((ex, idx) => (
                              <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.03)' }}>
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(48,209,88,0.1)', color: '#30D158' }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-white font-medium text-sm truncate">{ex.name}</p>
                                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>{ex.muscle} · {ex.sets}</p>
                                </div>
                              </div>
                            ))}
                            {routine.routine.rows.length > 3 && (
                              <div className="text-center py-2" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
                                +{routine.routine.rows.length - 3} ejercicios más
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                            <div className="flex items-center gap-2" style={{ color: '#30D158' }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                              <span style={{ fontSize: 12, fontWeight: 600 }}>Ver detalles y valoración</span>
                            </div>
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,166,35,0.15)', color: '#F5A623' }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 19l-7-7 7-7" /></svg>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Routine Detail Modal */}
      <AnimatePresence>
        {selectedRoutine && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={() => setSelectedRoutine(null)}
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
              <div className="flex-1 overflow-hidden flex">
                <div className="w-full md:w-1/2 flex flex-col overflow-hidden" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="p-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <h3 className="text-white font-bold text-lg mb-2">Ejercicios</h3>
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                      {selectedRoutine.routine.rows.map((ex: any, i: number) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center gap-4 p-4 rounded-2xl"
                          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
                        >
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(48,209,88,0.1)', color: '#30D158' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
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

                  <div className="w-full md:w-1/2 flex flex-col overflow-hidden">
                    <div className="p-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <h3 className="text-white font-bold text-lg mb-2">Valoración Vinculada</h3>
                      <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, #1270B710, rgba(10,10,20,0))', border: '1px solid #1270B720' }}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span style={{ color: '#1270B7' }}>📊</span>
                            <p style={{ color: 'white', fontSize: 13, fontWeight: 700 }}>Score: {selectedRoutine.assessment.score}/100</p>
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#1270B720', color: '#1270B7' }}>{selectedRoutine.assessment.type}</span>
                        </div>
                        <p style={{ color: 'white', fontSize: 13, marginBottom: 12 }}>{selectedRoutine.assessment.objetivoDetalle}</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {selectedRoutine.assessment.metrics.slice(0, 6).map((m: any, i: number) => (
                            <div key={i} className="flex items-center justify-between py-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>{m.label}</span>
                              <span style={{ color: 'white', fontWeight: 600 }}>{m.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-5" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <button onClick={() => setSelectedRoutine(null)} className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                  Cerrar
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #F5A623, #E63946)', boxShadow: '0 8px 24px rgba(245,166,35,0.3)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                  Iniciar Rutina
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}