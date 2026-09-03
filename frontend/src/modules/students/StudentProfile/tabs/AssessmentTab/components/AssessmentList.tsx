import { motion } from 'motion/react'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import listImg from '@/assets/icons/objects/list.webp'
import type { Dispatch, SetStateAction } from 'react'
import type { AssessmentItem } from '@/services/valoracion.service'
import { useIsMobile } from '@/shared/components/ui/use-mobile'

interface AssessmentListProps {
  pagedAssessments: AssessmentItem[]
  totalAssessments: number
  assessmentPage: number
  setAssessmentPage: Dispatch<SetStateAction<number>>
  assessmentTotalPages: number
  assessmentCurrentPage: number
  assessmentPageNumbers: number[]
  setSelectedAssessment: (v: AssessmentItem) => void
  setShowAssessmentOptions: (v: boolean) => void
}

export function AssessmentList({
  pagedAssessments,
  totalAssessments,
  setAssessmentPage,
  assessmentTotalPages,
  assessmentCurrentPage,
  assessmentPageNumbers,
  setSelectedAssessment,
  setShowAssessmentOptions,
}: AssessmentListProps) {
  const isMobile = useIsMobile()
  return (
    <div className="flex flex-col">
      {!isMobile && (
        <div className="grid grid-cols-[1.5fr_1fr_1fr_auto] items-center gap-4 px-4 mb-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: 'rgba(0,0,0,0.25)' }}>Valoración</p>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-center" style={{ color: 'rgba(0,0,0,0.25)' }}>Fecha</p>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-center" style={{ color: 'rgba(0,0,0,0.25)' }}>Próxima fecha</p>
          <div className="w-8" />
        </div>
      )}
      <div className="space-y-2">
        {pagedAssessments.map((v, i) => {
          const isFirst = v.num === 1
          const isLast = v.num === totalAssessments
          const status = isFirst ? 'Actual' : isLast ? 'Inicial' : 'Seguimiento'
          const statusColor = v.color
          const statusBg = statusColor === '#1270B7' ? 'rgba(18,112,183,0.12)' : statusColor === '#E63946' ? 'rgba(230,57,70,0.12)' : 'rgba(255,149,0,0.12)'
          const name = `Valoración ${v.num}`
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
              className={`relative items-center gap-4 p-4 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden ${isMobile ? 'flex flex-col' : 'grid grid-cols-[1.5fr_1fr_1fr_auto]'}`}
              style={{
                background: isFirst ? 'linear-gradient(135deg, #1270B7, #7ec8e3)' : '#FFFFFF',
                border: isFirst ? 'none' : '1px solid rgba(0,0,0,0.04)',
                borderRadius: 20,
                boxShadow: isFirst ? '0 8px 32px rgba(18,112,183,0.28), 0 2px 8px rgba(18,112,183,0.15)' : '0 2px 12px rgba(0,0,0,0.03)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = isFirst ? '0 12px 40px rgba(18,112,183,0.35)' : '0 12px 40px rgba(0,0,0,0.08)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0px)'; e.currentTarget.style.boxShadow = isFirst ? '0 8px 32px rgba(18,112,183,0.28), 0 2px 8px rgba(18,112,183,0.15)' : '0 2px 12px rgba(0,0,0,0.03)' }}
              onClick={() => { setSelectedAssessment(v); setShowAssessmentOptions(true) }}
            >
              {isFirst && (
                <motion.div aria-hidden className="absolute inset-0 pointer-events-none rounded-[20px]" style={{ overflow: 'hidden' }}>
                  <motion.div
                    className="absolute top-0 left-0 h-full w-2/5"
                    style={{
                      background: 'linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                    }}
                    animate={{ x: ['-120%', '340%'] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.3 }}
                  />
                </motion.div>
              )}

              <div className="flex items-center gap-4 min-w-0">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: isFirst ? 'rgba(255,255,255,0.22)' : statusBg }}>
                  <img src={listImg} alt="" className="w-5 h-5" style={{ filter: isFirst ? 'brightness(0) invert(1)' : 'none', opacity: 0.9 }} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate" style={{ color: isFirst ? '#FFFFFF' : '#0D1B2A' }}>{name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-bold" style={{ color: isFirst ? 'rgba(255,255,255,0.85)' : statusColor }}>{status}</span>
                    {isFirst && (
                      <span className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>· Última valoración</span>
                    )}
                  </div>
                </div>
              </div>

              {!isMobile && (
                <>
                  <p className="text-xs font-semibold text-center" style={{ color: isFirst ? '#FFFFFF' : 'rgba(0,0,0,0.5)' }}>{v.date}</p>

                  {v.next ? (
                    <p className="text-xs font-bold text-center" style={{ color: isFirst ? '#FFFFFF' : '#1270B7' }}>{v.next}</p>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold w-fit justify-self-center" style={{ background: 'rgba(34,197,94,0.13)', color: '#1E8E3E' }}>
                      <Check size={11} strokeWidth={3} /> Concluida
                    </span>
                  )}
                </>
              )}

              <ChevronRight size={15} style={{ color: isFirst ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.12)' }} />
            </motion.div>
          )
        })}
      </div>

      {assessmentTotalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-4">
          <motion.button
            whileHover={assessmentCurrentPage > 1 ? { scale: 1.1 } : {}}
            whileTap={assessmentCurrentPage > 1 ? { scale: 0.92 } : {}}
            onClick={() => setAssessmentPage(p => Math.max(1, p - 1))}
            disabled={assessmentCurrentPage === 1}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{
              background: assessmentCurrentPage === 1 ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.06)',
              color: assessmentCurrentPage === 1 ? 'rgba(0,0,0,0.2)' : '#111111',
              cursor: assessmentCurrentPage === 1 ? 'default' : 'pointer',
            }}
          >
            <ChevronLeft size={15} />
          </motion.button>

          {assessmentPageNumbers.map(p => (
            <motion.button
              key={p}
              whileHover={p !== assessmentCurrentPage ? { scale: 1.1 } : {}}
              whileTap={{ scale: 0.92 }}
              onClick={() => setAssessmentPage(p)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold transition-all"
              style={{
                background: p === assessmentCurrentPage ? '#111111' : 'rgba(0,0,0,0.05)',
                color: p === assessmentCurrentPage ? '#FFFFFF' : '#111111',
                boxShadow: p === assessmentCurrentPage ? '0 4px 12px rgba(0,0,0,0.25)' : 'none',
                cursor: 'pointer',
              }}
            >
              {p}
            </motion.button>
          ))}

          <motion.button
            whileHover={assessmentCurrentPage < assessmentTotalPages ? { scale: 1.1 } : {}}
            whileTap={assessmentCurrentPage < assessmentTotalPages ? { scale: 0.92 } : {}}
            onClick={() => setAssessmentPage(p => Math.min(assessmentTotalPages, p + 1))}
            disabled={assessmentCurrentPage === assessmentTotalPages}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{
              background: assessmentCurrentPage === assessmentTotalPages ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.06)',
              color: assessmentCurrentPage === assessmentTotalPages ? 'rgba(0,0,0,0.2)' : '#111111',
              cursor: assessmentCurrentPage === assessmentTotalPages ? 'default' : 'pointer',
            }}
          >
            <ChevronRight size={15} />
          </motion.button>
        </div>
      )}
    </div>
  )
}