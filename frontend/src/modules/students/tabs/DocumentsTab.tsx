import { motion } from 'framer-motion'
import { Eye, FileText } from 'lucide-react'
import { ScalesOfJusticeView } from '../../../assets/models/ui/objects/scales_of_justice/ScalesOfJusticeModel'
import { StethoscopeView } from '../../../assets/models/ui/objects/stethoscope/StethoscopeModel'
import { KitView } from '../../../assets/models/ui/objects/kit/KitModel'

interface Props {
  openMenuDoc: string | null
  setOpenMenuDoc: (v: string | null) => void
  setFileModalData: (v: { name: string; date: string } | null) => void
  setFileModalOpen: (v: boolean) => void
}

export function DocumentsTab({
  openMenuDoc,
  setOpenMenuDoc,
  setFileModalData,
  setFileModalOpen,
}: Props) {
  return (                    <div className="max-w-[1200px] mx-auto grid grid-cols-3 gap-6 items-start">
                      {[
                        {
                          title: 'Documentos Legales',
                          desc: 'Contratos y consentimientos firmados',
                          docs: [
                            { name: 'Contrato Firmado', date: '15 Ene 2026', signed: true, originalName: 'contrato_firmado_v2.pdf' },
                            { name: 'Aceptación de Tratamiento de Datos', date: '15 Ene 2026', signed: true, originalName: 'aceptacion_datos_2026.pdf' },
                            { name: 'PAR-Q+', date: '15 Ene 2026', signed: true, originalName: 'parq_plus_2026.pdf' },
                          ],
                        },
                        {
                          title: 'Informes Médicos',
                          desc: 'Certificados y expedientes médicos',
                          docs: [
                            { name: 'Certificado EPS', date: '20 Ene 2026', signed: true, originalName: 'certificado_eps_2026.pdf' },
                            { name: 'Historia Clínica', date: '22 Ene 2026', signed: true, originalName: 'historia_clinica.pdf' },
                          ],
                        },
                        {
                          title: 'Lesiones y Seguimiento',
                          desc: 'Reportes de lesiones y recuperación',
                          docs: [
                            { name: 'Reporte de Lesión - Tobillo', date: '12 Feb 2026', signed: true, originalName: 'reporte_tobillo.pdf' },
                            { name: 'Seguimiento de Recuperación', date: '28 Feb 2026', signed: true, originalName: 'seguimiento_recuperacion.pdf' },
                          ],
                        },
                      ].map((section, si) => (
                          <motion.div
                            key={section.title}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: si * 0.1 }}
                            className="rounded-2xl p-5 flex flex-col"
                            style={{
                              background: 'rgba(255,255,255,0.6)',
                              backdropFilter: 'blur(16px)',
                              WebkitBackdropFilter: 'blur(16px)',
                              border: '1px solid rgba(255,255,255,0.7)',
                              borderRadius: 20,
                              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                            }}
                          >
                            <div className="flex items-start gap-3 mb-5">
                              <div className="w-14 h-14 flex-shrink-0">
                                {si === 0 ? <ScalesOfJusticeView /> : si === 1 ? <StethoscopeView /> : <KitView />}
                              </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-[#0D1B2A] text-lg font-bold">{section.title}</h3>
                              <p className="text-sm mt-0.5" style={{ color: '#0D1B2A' }}>{section.desc}</p>
                            </div>
                          </div>
                          <div className="flex-1 space-y-4">
                            {[...section.docs].map((doc, di) => (
                              doc.signed ? (
                                <motion.div
                                  key={di}
                                  initial={{ opacity: 0, x: -6 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: si * 0.1 + di * 0.06 }}
                                  className="rounded-xl p-5 transition-all duration-300 cursor-pointer relative overflow-hidden"
                                  style={{
                                    background: '#FFFFFF',
                                    border: '1px solid rgba(0,0,0,0.06)',
                                  }}
                                  onMouseEnter={(e) => {
                                    setOpenMenuDoc(`${si}-${di}`)
                                    e.currentTarget.style.transform = 'scale(1.02)'
                                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'
                                  }}
                                  onMouseLeave={(e) => {
                                    setOpenMenuDoc(null)
                                    e.currentTarget.style.transform = 'scale(1)'
                                    e.currentTarget.style.boxShadow = 'none'
                                  }}
                                >
                                  <div className={`transition-all duration-300 ${openMenuDoc === `${si}-${di}` ? 'opacity-0' : 'opacity-100'}`}>
                                    <div className="flex items-center gap-3 mb-2">
                                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(230,57,70,0.06)' }}>
                                        <FileText size={16} style={{ color: '#E63946' }} />
                                      </div>
                                      <div>
                                        <p className="text-[#0D1B2A] text-sm font-semibold leading-tight">{doc.name}</p>
                                        <p className="text-[10px] mt-0.5" style={{ color: 'rgba(0,0,0,0.5)' }}>{doc.date}</p>
                                        <p className="text-[10px] mt-0.5 font-mono" style={{ color: 'rgba(0,0,0,0.35)' }}>{doc.originalName}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl transition-all duration-300 ${openMenuDoc === `${si}-${di}` ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} style={{ background: 'radial-gradient(circle at 20% 30%, rgba(230,57,70,0.08), rgba(230,57,70,0.02) 50%, rgba(255,255,255,0.95) 70%)', backdropFilter: 'blur(4px)' }}
                                    onClick={() => {
                                      setFileModalData({ name: doc.name, date: doc.date })
                                      setFileModalOpen(true)
                                    }}
                                  >
                                    <Eye size={28} style={{ color: '#E63946' }} />
                                    <span className="text-xs font-semibold" style={{ color: '#E63946' }}>Ver contenido</span>
                                  </div>
                                </motion.div>
                              ) : (
                                <motion.div
                                  key={di}
                                  initial={{ opacity: 0, x: -6 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: si * 0.1 + di * 0.06 }}
                                  className="rounded-xl p-4 transition-all cursor-pointer"
                                  style={{
                                    background: 'rgba(230,57,70,0.04)',
                                    border: '1px dashed rgba(230,57,70,0.25)',
                                  }}
                                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(230,57,70,0.12)' }}
                                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(230,57,70,0.1)' }}>
                                      <FileText size={14} style={{ color: '#E63946' }} />
                                    </div>
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md" style={{ background: 'rgba(230,57,70,0.1)', color: '#C62828' }}>
                                      Pendiente
                                    </span>
                                  </div>
                                  <p className="text-[#0D1B2A] text-sm font-semibold">{doc.name}</p>
                                  <p className="text-[11px] mt-1" style={{ color: '#C62828' }}>Este documento aún no ha sido entregado</p>
                                  <button
                                    className="mt-3 w-full py-2 rounded-xl text-xs font-bold transition-all"
                                    style={{ background: '#E63946', color: '#FFFFFF' }}
                                  >
                                    Solicitar
                                  </button>
                                </motion.div>
                              )
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>

  )
}
