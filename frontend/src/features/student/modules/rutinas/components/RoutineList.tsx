import { useState } from 'react'
import { motion } from 'motion/react'
import { ChevronLeft, ChevronRight, Dumbbell, Trophy } from 'lucide-react'
import { studentRoutines } from '@/features/student/utils/mockData'
import type { StudentRoutine } from '@/features/student/types/student'
import { SectionTitle, GradientBorder, cardStyle, FIRE, AMBER, GREEN } from '@/features/student/components/ui/fitness'
import { LEVEL_COLOR } from '../routineAssets'

interface RoutineListProps {
  openRoutine: (r: StudentRoutine) => void
  completedIds: string[]
}

const FIRST_PAGE = 7
const OTHER_PAGES = 8

export function RoutineList({ openRoutine, completedIds }: RoutineListProps) {
  const [page, setPage] = useState(1)
  /* Página 1: 7 rutinas (la actual ocupa fila entera), siguientes: 8 por página */
  const totalPages = Math.max(1, Math.ceil((studentRoutines.length - FIRST_PAGE) / OTHER_PAGES) + 1)
  const pageStart = page === 1 ? 0 : FIRST_PAGE + (page - 2) * OTHER_PAGES
  const pageSize = page === 1 ? FIRST_PAGE : OTHER_PAGES
  const visibleRoutines = studentRoutines.slice(pageStart, pageStart + pageSize)

  return (
    <div className="space-y-4">
      <SectionTitle>Rutinas asignadas por tu entrenador</SectionTitle>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-5">
        {visibleRoutines.map((r, i) => {
          const done = completedIds.includes(r.id)
          if (r.current) {
            /* --- RUTINA ACTUAL: resaltada con borde gradiente --- */
            return (
              <motion.div key={r.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="xl:col-span-2">
                <motion.button whileHover={{ y: -3 }} whileTap={{ scale: 0.985 }} onClick={() => openRoutine(r)} className="w-full text-left relative">
                  <span
                    className="absolute -top-3 left-5 z-10 px-3 py-1 rounded-full uppercase italic font-black tracking-widest"
                    style={{ background: `linear-gradient(135deg, ${FIRE}, ${AMBER})`, color: '#fff', fontSize: 9.5, boxShadow: '0 8px 20px rgba(230,57,70,0.4)' }}
                  >
                    ★ Rutina actual
                  </span>
                  <GradientBorder radius={22}>
                    <div className="p-5 pt-6">
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <h3 className="uppercase italic font-black text-white truncate flex items-center gap-2" style={{ fontSize: 19 }}>
                          {r.name}
                          {done && <Trophy size={15} style={{ color: GREEN }} />}
                        </h3>
                        <Dumbbell size={20} style={{ color: FIRE, opacity: 0.7 }} className="flex-shrink-0" />
                      </div>

                      <div className="grid grid-cols-2 gap-2.5 max-w-[340px]">
                        <div className="rounded-xl p-3" style={{ background: AMBER + '10', border: `1px solid ${AMBER}25` }}>
                          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Duración</p>
                          <p style={{ color: AMBER, fontSize: 14, fontWeight: 800, marginTop: 2 }}>{r.duration}</p>
                        </div>
                        <div className="rounded-xl p-3" style={{ background: LEVEL_COLOR[r.level] + '10', border: `1px solid ${LEVEL_COLOR[r.level]}25` }}>
                          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Nivel</p>
                          <p style={{ color: LEVEL_COLOR[r.level], fontSize: 14, fontWeight: 800, marginTop: 2 }}>{r.level}</p>
                        </div>
                      </div>
                    </div>
                  </GradientBorder>
                </motion.button>
              </motion.div>
            )
          }
          /* --- OTRAS RUTINAS --- */
          return (
            <motion.div key={r.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <motion.button whileHover={{ y: -3 }} whileTap={{ scale: 0.985 }} onClick={() => openRoutine(r)} className="w-full text-left">
                <div className="rounded-[22px] p-5 h-full" style={cardStyle}>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <h3 className="uppercase italic font-black text-white truncate flex items-center gap-2" style={{ fontSize: 16 }}>
                      {r.name}
                      {done && <Trophy size={13} style={{ color: GREEN }} />}
                    </h3>
                    <Dumbbell size={17} style={{ color: 'rgba(255,255,255,0.25)' }} className="flex-shrink-0" />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="rounded-xl p-2.5 text-center" style={{ background: AMBER + '10', border: `1px solid ${AMBER}25` }}>
                      <p style={{ color: AMBER, fontSize: 12.5, fontWeight: 800 }}>{r.duration}</p>
                      <p style={{ color: 'rgba(255,255,255,0.32)', fontSize: 8.5 }}>Duración</p>
                    </div>
                    <div className="rounded-xl p-2.5 text-center" style={{ background: LEVEL_COLOR[r.level] + '10', border: `1px solid ${LEVEL_COLOR[r.level]}25` }}>
                      <p style={{ color: LEVEL_COLOR[r.level], fontSize: 12.5, fontWeight: 800 }}>{r.level}</p>
                      <p style={{ color: 'rgba(255,255,255,0.32)', fontSize: 8.5 }}>Nivel</p>
                    </div>
                  </div>
                </div>
              </motion.button>
            </motion.div>
          )
        })}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-8">
          <motion.button
            whileHover={page > 1 ? { scale: 1.08 } : undefined}
            whileTap={page > 1 ? { scale: 0.92 } : undefined}
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: page === 1 ? 'rgba(255,255,255,0.2)' : '#fff',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
            }}
          >
            <ChevronLeft size={17} />
          </motion.button>
          {Array.from({ length: totalPages }).map((_, i) => {
            const active = page === i + 1
            return (
              <motion.button
                key={i}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setPage(i + 1)}
                className="w-9 h-9 rounded-xl font-black transition-all"
                style={{
                  background: active ? `linear-gradient(135deg, ${FIRE}, ${AMBER})` : 'rgba(255,255,255,0.05)',
                  border: active ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  color: active ? '#fff' : 'rgba(255,255,255,0.45)',
                  fontSize: 13,
                  boxShadow: active ? '0 6px 18px rgba(230,57,70,0.35)' : 'none',
                }}
              >
                {i + 1}
              </motion.button>
            )
          })}
          <motion.button
            whileHover={page < totalPages ? { scale: 1.08 } : undefined}
            whileTap={page < totalPages ? { scale: 0.92 } : undefined}
            disabled={page === totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: page === totalPages ? 'rgba(255,255,255,0.2)' : '#fff',
              cursor: page === totalPages ? 'not-allowed' : 'pointer',
            }}
          >
            <ChevronRight size={17} />
          </motion.button>
        </div>
      )}
    </div>
  )
}
