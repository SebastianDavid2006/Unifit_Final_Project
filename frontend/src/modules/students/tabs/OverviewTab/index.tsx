import { motion } from 'motion/react'
import { Maximize2 } from 'lucide-react'
import { StudentCardView } from '@/assets/models/ui/objects/student_card/StudentCardModel'
import { TelephoneView } from '@/assets/models/ui/objects/telephone/TelephoneModel'
import { CapView } from '@/assets/models/ui/objects/cap/CapModel'
import { TrophyView } from '@/assets/models/ui/objects/trophy/TrophyModel'
import type { Student } from '@/modules/students/StudentProfileData'
import { IdentityAccessCard } from '@/modules/students/components/IdentityAccessCard'

interface Props {
  student: Student
  imc: string
  onShowInfo: () => void
  onUpdate: (patch: Partial<Student>) => void
}

export function OverviewTab({ student, imc, onShowInfo, onUpdate }: Props) {
  const setShowInfoModal = onShowInfo
  return (                <div className="grid gap-2 items-start" style={{ gridTemplateColumns: '1fr 2fr 1fr', gridTemplateRows: 'auto auto auto' }}>
                  {/* Fila 1 - Izquierda: Info General */}
                  <div className="rounded-[28px] p-4 transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg cursor-default" style={{ gridColumn: '1', gridRow: '1', background: 'rgba(255,255,255,0.5)' }}>
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: 'rgba(230,57,70,0.3)' }} />
                      <div className="w-8 h-8 flex-shrink-0"><StudentCardView /></div>
                      <p className="text-lg font-extrabold capitalize" style={{ color: '#0D1B2A' }}>Información General</p>
                      <motion.button
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowInfoModal(true)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center ml-auto flex-shrink-0 cursor-pointer transition-colors"
                        style={{
                          background: 'rgba(18,112,183,0.1)',
                          color: '#1270B7',
                          border: '1px solid rgba(18,112,183,0.18)',
                        }}
                      >
                        <Maximize2 size={14} />
                      </motion.button>
                    </div>
                    <div className="flex flex-col">
                      {[
                        { label: 'Documento', value: `${student.documentType}. ${student.documentNumber}` },
                        { label: 'Fecha de nacimiento', value: student.birthDate },
                        { label: 'Género', value: student.gender },
                      ].map((field, fi, arr) => (
                        <div key={field.label} className="flex flex-col" style={{ borderBottom: fi < arr.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none', paddingBottom: fi < arr.length - 1 ? 6 : 0 }}>
                          <p className="text-xs mb-0.5" style={{ color: 'rgba(0,0,0,0.5)' }}>{field.label}</p>
                          <p className="text-base font-semibold" style={{ color: '#0D1B2A' }}>{field.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Centro - spans todas las filas */}
                  <div className="flex flex-col items-center relative" style={{ gridColumn: '2', gridRow: '1 / 4', paddingTop: 16, alignSelf: 'stretch', overflow: 'visible' }}>
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold shadow-lg mb-3 relative z-10"
                      style={{
                        background: student.risk === 'high'
                          ? 'linear-gradient(135deg, #FF3B30, #D32F2F)'
                          : student.risk === 'medium'
                          ? 'linear-gradient(135deg, #FF9500, #E68600)'
                          : 'linear-gradient(135deg, #30D158, #20A040)',
                        fontSize: 26,
                      }}
                    >
                      {student.avatar}
                    </div>
                    <h2 className="text-[#0D1B2A] text-2xl font-bold text-center mb-2 relative z-10">
                      {[student.firstName, student.secondName, student.lastName, student.secondLastName].filter(Boolean).join(' ')}
                    </h2>
                    <div className="absolute left-0 right-0" style={{ top: 110, bottom: -60 }}>
                      <video
                        src="/student-body.webm"
                        autoPlay loop muted playsInline preload="auto"
                        className="absolute inset-0 w-full h-full"
                        style={{
                          objectFit: 'contain',
                          filter: 'saturate(1.1)',
                          maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
                          WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Fila 1 - Derecha: Identidad y Acceso */}
                  <div className="rounded-[28px] p-5 transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg cursor-default" style={{ gridColumn: '3', gridRow: '1', background: 'rgba(255,255,255,0.5)' }}>
                    <IdentityAccessCard student={student} onUpdate={onUpdate} />
                  </div>

                  {/* Fila 2 - Izquierda: Contacto */}
                  <div className="rounded-[28px] p-5 transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg cursor-default" style={{ gridColumn: '1', gridRow: '2', background: 'rgba(255,255,255,0.5)' }}>
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: 'rgba(230,57,70,0.3)' }} />
                      <div className="w-8 h-8 flex-shrink-0"><TelephoneView /></div>
                      <p className="text-lg font-extrabold capitalize" style={{ color: '#0D1B2A' }}>Contacto</p>
                    </div>
                    <div className="flex flex-col">
                      {[
                        { label: 'Email', value: student.email },
                        { label: 'Teléfono', value: student.phone },
                        { label: 'Contacto de emergencia', value: student.contactName },
                        { label: 'Tel. contacto', value: student.contactPhone },
                      ].map((field, fi, arr) => (
                        <div key={field.label} className="flex flex-col" style={{ borderBottom: fi < arr.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none', paddingBottom: fi < arr.length - 1 ? 8 : 0 }}>
                          <p className="text-xs mb-1" style={{ color: 'rgba(0,0,0,0.5)' }}>{field.label}</p>
                          <p className="text-base font-semibold" style={{ color: '#0D1B2A' }}>{field.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fila 2 - Derecha: Métricas actuales */}
                  <div className="rounded-[28px] p-4 transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg cursor-default" style={{ gridColumn: '3', gridRow: '2', background: 'rgba(255,255,255,0.5)' }}>
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: 'rgba(230,57,70,0.3)' }} />
                      <p className="text-lg font-extrabold capitalize" style={{ color: '#0D1B2A' }}>Métricas actuales</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Peso', value: `${student.weight} kg` },
                        { label: 'Estatura', value: `${student.height} cm` },
                        { label: 'IMC', value: imc },
                        { label: 'Grasa corporal', value: '17%' },
                        { label: 'Masa muscular', value: '52 kg' },
                        { label: 'Agua corporal', value: '58%' },
                      ].map(m => (
                        <div key={m.label} className="rounded-xl p-3 text-center" style={{ background: 'rgba(0,0,0,0.02)' }}>
                          <p className="text-base font-extrabold" style={{ color: '#0D1B2A' }}>{m.value}</p>
                          <p className="text-[10px] font-semibold mt-0.5" style={{ color: 'rgba(0,0,0,0.35)' }}>{m.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fila 3 - Izquierda: Info académica */}
                  <div className="rounded-[28px] p-4 transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg cursor-default" style={{ gridColumn: '1', gridRow: '3', background: 'rgba(255,255,255,0.5)' }}>
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: 'rgba(230,57,70,0.3)' }} />
                      <div className="w-8 h-8 flex-shrink-0"><CapView /></div>
                      <p className="text-lg font-extrabold capitalize" style={{ color: '#0D1B2A' }}>Información académica</p>
                    </div>
                    <div className="flex flex-col">
                      {[
                        { label: 'Programa', value: student.program },
                        { label: 'Semestre', value: `${student.semestre}°` },
                        { label: 'Jornada', value: student.jornada },
                      ].map((field, fi, arr) => (
                        <div key={field.label} className="flex flex-col" style={{ borderBottom: fi < arr.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none', paddingBottom: fi < arr.length - 1 ? 6 : 0 }}>
                          <p className="text-xs mb-0.5" style={{ color: 'rgba(0,0,0,0.5)' }}>{field.label}</p>
                          <p className="text-base font-semibold" style={{ color: '#0D1B2A' }}>{field.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fila 3 - Derecha: Objetivo físico */}
                  <div className="rounded-[28px] p-5 relative overflow-hidden transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg cursor-default" style={{ gridColumn: '3', gridRow: '3', background: 'linear-gradient(135deg, rgba(255,215,0,0.08), rgba(255,185,0,0.05), rgba(255,215,0,0.08))' }}>
                    <div className="absolute inset-0 pointer-events-none" style={{
                      background: 'linear-gradient(110deg, transparent 25%, rgba(255,215,0,0.15) 37%, rgba(255,255,255,0.4) 50%, rgba(255,215,0,0.15) 63%, transparent 75%)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 3s ease-in-out infinite',
                    }} />
                    <div className="relative z-10">
                      <div className="flex items-center gap-2.5 mb-4">
                        <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: 'rgba(212,175,55,0.5)' }} />
                        <div className="w-8 h-8 flex-shrink-0"><TrophyView /></div>
                        <p className="text-lg font-extrabold capitalize" style={{ color: '#B8860B' }}>Objetivo físico</p>
                      </div>
                      <div className="rounded-2xl p-4" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)' }}>
                        <p className="text-sm font-bold leading-relaxed" style={{ color: '#B8860B' }}>{student.goal}</p>
                      </div>
                    </div>
                  </div>
                </div>

  )
}
