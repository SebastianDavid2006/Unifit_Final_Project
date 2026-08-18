import { motion } from 'motion/react'
import { Check, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { ClockView } from '@/assets/models/ui/objects/clock/ClockModel'
import { ListView } from '@/assets/models/ui/objects/list/ListModel'
import { CalendarView } from '@/assets/models/ui/objects/calendar/CalendarModel'
import fireGif from '@/assets/icons/animated/fire.gif'
import listImg from '@/assets/icons/objects/list.webp'
import physicalAssessmentImg from '@/assets/illustrations/modules/physical_assessment.webp'
import type { Dispatch, SetStateAction } from 'react'
import type { ValuationForm } from '@/modules/students/StudentProfileData'
import { cardStyle, assessmentItems, emptyValuationForm } from '@/modules/students/StudentProfileData'

type AssessmentItem = (typeof assessmentItems)[number]

interface Props {
  canCreateValuation: boolean
  pagedAssessments: AssessmentItem[]
  assessmentPage: number
  setAssessmentPage: Dispatch<SetStateAction<number>>
  assessmentTotalPages: number
  assessmentCurrentPage: number
  assessmentPageNumbers: number[]
  setValuationStep: Dispatch<SetStateAction<number>>
  setValuationSuccess: (v: boolean) => void
  setValuationViewMode: (v: boolean) => void
  setValuationForm: Dispatch<SetStateAction<ValuationForm>>
  setShowNewValuationModal: (v: boolean) => void
  setSelectedAssessment: (v: AssessmentItem) => void
  setShowAssessmentOptions: (v: boolean) => void
}

export function AssessmentTab({
  canCreateValuation,
  pagedAssessments,
  setAssessmentPage,
  assessmentTotalPages,
  assessmentCurrentPage,
  assessmentPageNumbers,
  setValuationStep,
  setValuationSuccess,
  setValuationViewMode,
  setValuationForm,
  setShowNewValuationModal,
  setSelectedAssessment,
  setShowAssessmentOptions,
}: Props) {
  return (                      <div className="max-w-[1200px] mx-auto space-y-4">
                      {/* Mini Dashboard + Nueva Valoración */}
                      <div className={`grid ${canCreateValuation ? 'grid-cols-4' : 'grid-cols-3'} gap-4`}>
                        {(() => {
                          const totalRutinas = 4
                          const ultimaRutina = '15 May 2026'

                          const items = [
                            { label: 'Total de rutinas', value: `${totalRutinas}`, model: 'list' },
                            { label: 'Última rutina realizada', value: ultimaRutina, model: 'calendar' },
                            { label: 'Fecha de la próxima valoración', value: '01 Ago 2026', model: 'calendar', highlight: true },
                          ]
                          return items.map((m) => {
                            const iconEl = m.model === 'fire' ? (
                              <img src={fireGif} alt="fire" style={{ width: 52, height: 52, objectFit: 'contain' }} />
                            ) : m.model === 'clock' ? (
                              <div style={{ width: 52, height: 52 }}><ClockView /></div>
                            ) : m.model === 'list' ? (
                              <div style={{ width: 52, height: 52 }}><ListView /></div>
                            ) : (
                              <div style={{ width: 52, height: 52 }}><CalendarView /></div>
                            )
                            return (
                                <motion.div
                                  key={m.label}
                                  whileHover={{ scale: 1.03 }}
                                  transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
                                  className="relative rounded-2xl p-4 flex flex-col items-center text-center group"
                                  style={{
                                    ...cardStyle,
                                    ...(m.highlight ? { border: '1px solid rgba(48,209,88,0.15)', boxShadow: '0 8px 32px rgba(48,209,88,0.12), 0 0 40px rgba(48,209,88,0.06)' } : {}),
                                  }}
                                >
                                <div
                                  className="transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.5] mb-5 flex items-center justify-center"
                                  style={{ transformOrigin: 'bottom center' }}
                                >
                                  {iconEl}
                                </div>
                                <p style={{
                                  fontSize: '1.8rem', fontWeight: 700, lineHeight: 1,
                                  ...(m.highlight
                                    ? { background: 'linear-gradient(135deg, #30D158, #00C7BE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }
                                    : {}),
                                }} className={m.highlight ? '' : 'text-gradient-warm'}>{m.value}</p>
                                <p className="text-sm font-semibold mt-2" style={{
                                  color: m.highlight ? '#30D158' : 'rgba(0,0,0,0.5)',
                                }}>{m.label}</p>
                              </motion.div>
                            )
                          })
                        })()}
                        {canCreateValuation && (
                        /* Tarjeta Nueva Valoración */
                        <motion.div
                          whileHover={{ boxShadow: '0 12px 40px rgba(230,57,70,0.3), 0 0 60px rgba(230,57,70,0.1)' }}
                          transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
                          className="relative rounded-2xl flex flex-col items-center text-center group cursor-pointer"
                          style={{
                            borderRadius: 20,
                            background: 'radial-gradient(ellipse at 20% 30%, rgba(230,57,70,0.9) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(18,112,183,0.4) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(241,200,39,0.25) 0%, transparent 50%), #CC0033',
                            backgroundSize: '200% 200%',
                            animation: 'mesh-shift 15s ease-in-out infinite',
                            boxShadow: '0 8px 32px rgba(230,57,70,0.12), 0 2px 8px rgba(230,57,70,0.06)',
                          }}
                          onClick={() => { setValuationStep(1); setValuationSuccess(false); setValuationViewMode(false); setValuationForm(emptyValuationForm); setShowNewValuationModal(true) }}
                        >
                          <div className="w-full flex flex-col items-center relative z-10">
                            <div
                              className="transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.2]"
                              style={{ width: '100%', height: 110, position: 'relative', transformOrigin: 'bottom center' }}
                            >
                              <img
                                src={physicalAssessmentImg}
                                alt=""
                                className="w-full h-full object-contain drop-shadow-xl"
                                style={{ objectPosition: 'bottom center' }}
                              />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-14 pointer-events-none z-10" style={{
                              background: 'linear-gradient(to top, #CC0033 0%, rgba(204,0,51,0) 100%)',
                            }} />
                          </div>
                          <div className="flex items-center gap-1.5 mb-3 z-10">
                            <span className="text-sm font-bold text-white/90">Nueva Valoración</span>
                            <Plus size={16} className="text-white/90" />
                          </div>
                        </motion.div>
                        )}
                      </div>

                      <div className="flex flex-col">
                        <div className="grid grid-cols-[1.5fr_1fr_1fr_auto] items-center gap-4 px-4 mb-2">
                          <p className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: 'rgba(0,0,0,0.25)' }}>Valoración</p>
                          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-center" style={{ color: 'rgba(0,0,0,0.25)' }}>Fecha</p>
                          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-center" style={{ color: 'rgba(0,0,0,0.25)' }}>Próxima fecha</p>
                          <div className="w-8" />
                        </div>
                        <div className="space-y-2">
                          {pagedAssessments.map((v, i) => {
                            const isFirst = v.num === 1
                            const isLast = v.num === assessmentItems.length
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
                                className="relative grid grid-cols-[1.5fr_1fr_1fr_auto] items-center gap-4 p-4 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden"
                                style={{
                                  background: isFirst ? 'linear-gradient(135deg, #1270B7, #7ec8e3)' : '#FFFFFF',
                                  border: isFirst ? 'none' : '1px solid rgba(0,0,0,0.04)',
                                  borderRadius: 20,
                                  boxShadow: isFirst ? '0 8px 32px rgba(18,112,183,0.28), 0 2px 8px rgba(18,112,183,0.15)' : '0 2px 12px rgba(0,0,0,0.03)',
                                }}
                                onClick={() => { setSelectedAssessment(v); setShowAssessmentOptions(true) }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = isFirst ? '0 12px 40px rgba(18,112,183,0.35)' : '0 12px 40px rgba(0,0,0,0.08)' }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0px)'; e.currentTarget.style.boxShadow = isFirst ? '0 8px 32px rgba(18,112,183,0.28), 0 2px 8px rgba(18,112,183,0.15)' : '0 2px 12px rgba(0,0,0,0.03)' }}
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

                                <p className="text-xs font-semibold text-center" style={{ color: isFirst ? '#FFFFFF' : 'rgba(0,0,0,0.5)' }}>{v.date}</p>

                                {v.next ? (
                                  <p className="text-xs font-bold text-center" style={{ color: isFirst ? '#FFFFFF' : '#1270B7' }}>{v.next}</p>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold w-fit justify-self-center" style={{ background: 'rgba(34,197,94,0.13)', color: '#1E8E3E' }}>
                                    <Check size={11} strokeWidth={3} /> Concluida
                                  </span>
                                )}

                                {isFirst ? (
                                  <ChevronRight size={15} style={{ color: 'rgba(255,255,255,0.6)' }} />
                                ) : (
                                  <ChevronRight size={15} style={{ color: 'rgba(0,0,0,0.12)' }} />
                                )}
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
                    </div>

  )
}
