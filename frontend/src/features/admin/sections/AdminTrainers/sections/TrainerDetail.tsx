import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Fingerprint, PenLine, RefreshCw, ScanLine } from 'lucide-react'
import SignatureCanvas from 'react-signature-canvas'
import type { Trainer } from '@/data/trainers'
import DetailCard from '../components/DetailCard'
import FieldList from '../components/FieldList'
import { StudentCardView } from '@/assets/models/ui/objects/student_card/StudentCardModel'
import { TelephoneView } from '@/assets/models/ui/objects/telephone/TelephoneModel'
import { ListView } from '@/assets/models/ui/objects/list/ListModel'
import { StethoscopeView } from '@/assets/models/ui/objects/stethoscope/StethoscopeModel'
import { DocumentView } from '@/assets/models/ui/objects/document/DocumentModel'
import { CapView } from '@/assets/models/ui/objects/cap/CapModel'
import { BLUE, RED } from '../data'
import coach2Gif from '@/assets/illustrations/characters/coach_2/animated/coach_2.gif'
import lectorHuellaImg from '@/assets/illustrations/actions/fingerprint.webp'
import checkSuccessImg from '@/assets/illustrations/actions/feedback/success_check.webp'

const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #7ec8e3)'
const GREEN_BLUE_GRAD = 'linear-gradient(135deg, #22C55E, #1270B7)'
const GREEN = '#22C55E'

export default function TrainerDetail({ trainer }: { trainer: Trainer }) {
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [showSignatureModal, setShowSignatureModal] = useState(false)
  const [showFingerprintModal, setShowFingerprintModal] = useState(false)
  const [fingerprintStatus, setFingerprintStatus] = useState<'idle' | 'scanning' | 'captured'>('idle')
  const [fingerprintSuccess, setFingerprintSuccess] = useState(false)
  const sigRef = useRef<SignatureCanvas>(null)
  const [signatureDrawn, setSignatureDrawn] = useState(false)
  const [signatureSuccess, setSignatureSuccess] = useState(false)
  return (
    <div className="relative z-10 p-8 overflow-hidden">
      <div className="w-full">
        <div className="grid gap-2 items-stretch" style={{ gridTemplateColumns: '1fr 2fr 1fr', gridTemplateRows: '1fr 1fr 1fr' }}>
          <DetailCard gridColumn="1" gridRow="1" accent={RED} title="Información General" model={<StudentCardView />}>
            <FieldList fields={[
              { label: 'Documento', value: trainer.document },
              { label: 'Fecha de nacimiento', value: trainer.birthDate },
              { label: 'Género', value: trainer.gender },
            ]} />
          </DetailCard>

          <div className="flex flex-col items-center relative" style={{ gridColumn: '2', gridRow: '1 / 4', paddingTop: 16, alignSelf: 'stretch', overflow: 'visible' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold shadow-lg mb-3 relative z-10" style={{
              background: trainer.status === 'active' ? 'linear-gradient(135deg, #30D158, #20A040)' : 'linear-gradient(135deg, #8E8E93, #636366)',
              fontSize: 26,
            }}>
              {trainer.avatar}
            </div>
            <h2 className="text-[#0D1B2A] text-2xl font-bold text-center mb-2 relative z-10">{trainer.name}</h2>
            <img src={coach2Gif} alt="coach" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[680px] z-0 pointer-events-none" style={{ maskImage: 'linear-gradient(to bottom, black 40%, transparent 95%)', WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 95%)' }} />
            <button onClick={() => setShowInfoModal(true)} className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 px-6 py-2.5 rounded-2xl text-sm font-bold text-white cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl" style={{ background: `radial-gradient(circle at 82% 12%, rgba(230,0,18,0.95) 0%, transparent 60%), radial-gradient(circle at 18% 12%, rgba(91,37,133,0.95) 0%, transparent 60%), radial-gradient(circle at 8% 55%, rgba(0,160,233,0.9) 0%, transparent 55%), radial-gradient(circle at 15% 92%, rgba(0,168,143,0.9) 0%, transparent 55%), radial-gradient(circle at 50% 90%, rgba(255,241,0,0.9) 0%, transparent 60%), radial-gradient(circle at 88% 92%, rgba(243,152,0,0.9) 0%, transparent 55%), #1A0B2E`, boxShadow: '0 4px 24px rgba(0,0,0,0.35)' }}>
              Ver información
            </button>
          </div>

          {/* Tarjeta Identidad y Acceso */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[28px] p-5"
            style={{
              gridColumn: '3',
              gridRow: '1',
              background: 'rgba(255,255,255,0.5)',
              borderRadius: 28,
              padding: 20,
            }}
          >
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: 'rgba(18,112,183,0.3)' }} />
              <p className="text-lg font-extrabold capitalize" style={{ color: '#0D1B2A' }}>Identidad y acceso</p>
            </div>
              <div className="grid grid-cols-2 gap-3">
                {/* Box Firma */}
                <div className="rounded-xl p-3 flex flex-col" style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <p className="text-[9px] font-bold uppercase tracking-wide mb-2" style={{ color: 'rgba(0,0,0,0.4)' }}>Firma</p>
                  <div className="flex items-center justify-center mb-2.5 min-h-[40px]">
                    {trainer.firma ? (
                      <img src={trainer.firma} alt="firma" className="max-h-10" />
                    ) : (
                      <svg viewBox="0 0 400 120" className="w-full h-auto opacity-20" style={{ maxHeight: 40 }}>
                        <path d="M30,90 C40,50 60,30 80,40 C100,50 95,75 110,65 C125,55 130,35 150,30 C170,25 180,50 195,55 C210,60 220,40 240,35 C260,30 270,55 280,60 C290,65 300,45 320,50 C340,55 345,70 355,65 C365,60 370,50 380,55" fill="none" stroke="#0D1B2A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <button onClick={() => setShowSignatureModal(true)} className="self-center inline-flex items-center gap-1.5 px-4 py-1.5 rounded-3xl text-[10px] font-bold text-white cursor-pointer" style={{ background: BLUE_GRAD, boxShadow: '0 4px 12px rgba(18,112,183,0.25)' }}>
                    <PenLine size={12} /> {trainer.firma ? 'Editar firma' : 'Firmar ahora'}
                  </button>
                </div>

                {/* Box Huella */}
                <div className="rounded-xl p-3 flex flex-col" style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[9px] font-bold uppercase tracking-wide" style={{ color: 'rgba(0,0,0,0.4)' }}>Huella digital</p>
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: trainer.huella ? 'rgba(34,197,94,0.12)' : 'rgba(0,0,0,0.05)', color: trainer.huella ? GREEN : 'rgba(0,0,0,0.35)' }}>
                      {trainer.huella ? 'Capturada ✓' : 'Sin capturar'}
                    </span>
                  </div>
                  <div className="flex items-center justify-center py-1 mb-2">
                    <Fingerprint size={32} strokeWidth={1.5} style={{ color: trainer.huella ? GREEN : 'rgba(0,0,0,0.15)' }} />
                  </div>
                  <button onClick={() => { setShowFingerprintModal(true); setFingerprintStatus('idle'); }} className="self-center inline-flex items-center gap-1.5 px-4 py-1.5 rounded-3xl text-[10px] font-bold text-white cursor-pointer" style={{ background: GREEN_BLUE_GRAD, boxShadow: '0 4px 12px rgba(18,112,183,0.25)' }}>
                    <Fingerprint size={12} /> {trainer.huella ? 'Actualizar huella' : 'Capturar huella'}
                  </button>
                </div>
              </div>
          </motion.div>

          <DetailCard gridColumn="1" gridRow="2" accent={RED} title="Contacto" model={<TelephoneView />}>
            <FieldList fields={[
              { label: 'Email', value: trainer.email },
              { label: 'Teléfono', value: trainer.phone },
              { label: 'Contacto de emergencia', value: trainer.contactName },
              { label: 'Tel. contacto', value: trainer.contactPhone },
            ]} labelMb={1} itemPb={8} />
          </DetailCard>

          <DetailCard gridColumn="3" gridRow="2" accent={BLUE} title="Estadísticas" model={<ListView />}>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Estudiantes', value: `${trainer.students}` },
                { label: 'Horario', value: trainer.schedule },
                { label: 'Antigüedad', value: trainer.joinedAt },
                { label: 'Evaluación', value: `${trainer.rating}/100` },
              ].map(m => (
                <div key={m.label} className="rounded-xl p-3 text-center" style={{ background: 'rgba(0,0,0,0.02)' }}>
                  <p className="text-sm font-extrabold" style={{ color: '#0D1B2A' }}>{m.value}</p>
                  <p className="text-[10px] font-semibold mt-0.5" style={{ color: 'rgba(0,0,0,0.35)' }}>{m.label}</p>
                </div>
              ))}
            </div>
          </DetailCard>

          <DetailCard gridColumn="1" gridRow="3" accent={RED} title="Información Médica" model={<StethoscopeView />}>
            <FieldList fields={[
              { label: 'EPS', value: trainer.eps },
              { label: 'Grupo sanguíneo', value: trainer.bloodType },
            ]} />
          </DetailCard>

          <div className="rounded-[28px] p-5 relative overflow-hidden" style={{ gridColumn: '3', gridRow: '3', background: 'linear-gradient(135deg, rgba(255,215,0,0.08), rgba(255,185,0,0.05), rgba(255,215,0,0.08))' }}>
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'linear-gradient(110deg, transparent 25%, rgba(255,215,0,0.15) 37%, rgba(255,255,255,0.4) 50%, rgba(255,215,0,0.15) 63%, transparent 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 3s ease-in-out infinite',
            }} />
            <div className="relative z-10">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: 'rgba(212,175,55,0.5)' }} />
                <div className="w-8 h-8 flex-shrink-0"><DocumentView /></div>
                <p className="text-lg font-extrabold capitalize" style={{ color: '#B8860B' }}>Certificaciones</p>
              </div>
              <div className="space-y-2">
                {trainer.certifications.map((cert, i) => (
                  <div key={i} className="rounded-2xl p-3" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)' }}>
                    <p className="text-sm font-bold" style={{ color: '#B8860B' }}>{cert}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Info completa (modal por categorías) ─────────── */}
      <AnimatePresence>
        {showInfoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[115] flex items-center justify-center p-6"
            style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)' }}
            onClick={() => setShowInfoModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-5xl max-h-[85vh] flex flex-col rounded-[28px] relative overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.96)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.6)',
                boxShadow: '0 24px 80px rgba(0,0,0,0.18)',
              }}
            >
              {/* Header */}
              <div className="flex-shrink-0 flex items-center justify-between px-7 pt-6 pb-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0" style={{
                    background: trainer.status === 'active'
                      ? 'linear-gradient(135deg, #30D158, #20A040)'
                      : 'linear-gradient(135deg, #8E8E93, #636366)',
                    fontSize: 14,
                  }}>
                    {trainer.avatar}
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold" style={{ color: '#0D1B2A' }}>{trainer.name}</h2>
                    <p className="text-xs font-medium" style={{ color: 'rgba(0,0,0,0.4)' }}>
                      {trainer.role === 'admin' ? 'Administrador' : 'Entrenador'} · {trainer.speciality}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, background: 'rgba(244,56,67,0.1)', color: '#F43843' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowInfoModal(false)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer"
                  style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.45)' }}
                >
                  <X size={16} />
                </motion.button>
              </div>

              {/* Categorías */}
              <div className="flex-1 min-h-0 overflow-y-auto px-7 py-6" style={{ scrollbarWidth: 'thin' }}>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      title: 'Información personal',
                      model: <StudentCardView />,
                      fields: [
                        { label: 'Nombre completo', value: trainer.name },
                        { label: 'Documento', value: trainer.document },
                        { label: 'Fecha de nacimiento', value: trainer.birthDate },
                        { label: 'Género', value: trainer.gender },
                      ],
                    },
                    {
                      title: 'Información laboral',
                      model: <CapView />,
                      fields: [
                        { label: 'Cargo', value: trainer.role === 'admin' ? 'Administrador' : 'Entrenador' },
                        { label: 'Especialidad', value: trainer.speciality },
                        { label: 'Estado', value: trainer.status === 'active' ? 'Activo' : 'Inactivo' },
                        { label: 'Fecha de ingreso', value: trainer.joinedAt },
                        { label: 'Horario', value: trainer.schedule },
                        { label: 'Certificaciones', value: trainer.certifications.join(', ') },
                      ],
                    },
                    {
                      title: 'Información médica',
                      model: <StethoscopeView />,
                      fields: [
                        { label: 'EPS', value: trainer.eps },
                        { label: 'Grupo sanguíneo', value: trainer.bloodType },
                      ],
                    },
                    {
                      title: 'Información de contacto',
                      model: <TelephoneView />,
                      fields: [
                        { label: 'Email', value: trainer.email },
                        { label: 'Teléfono', value: trainer.phone },
                        { label: 'Contacto de emergencia', value: trainer.contactName },
                        { label: 'Parentesco', value: trainer.contactRelation },
                        { label: 'Teléfono de emergencia', value: trainer.contactPhone },
                      ],
                    },
                  ].map((cat, ci) => (
                    <motion.div
                      key={cat.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 + ci * 0.06 }}
                      className="rounded-2xl p-5 flex flex-col"
                      style={{
                        background: 'linear-gradient(145deg, rgba(18,112,183,0.09) 0%, rgba(18,112,183,0.03) 55%, rgba(255,255,255,0.6) 100%)',
                        boxShadow: '0 1px 0 rgba(255,255,255,0.7) inset, 0 4px 16px rgba(18,112,183,0.06)',
                      }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl flex-shrink-0 overflow-hidden" style={{ background: 'rgba(18,112,183,0.10)' }}>
                          {cat.model}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-6 rounded-full flex-shrink-0" style={{ background: 'rgba(18,112,183,0.35)' }} />
                          <p className="text-sm font-extrabold capitalize" style={{ color: '#0D1B2A' }}>{cat.title}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-x-5 gap-y-3 flex-1">
                        {cat.fields.map(f => (
                          <div key={f.label} className="flex flex-col">
                            <p className="text-[10px] font-bold uppercase tracking-wide mb-0.5" style={{ color: 'rgba(0,0,0,0.4)' }}>{f.label}</p>
                            <p className="text-sm font-semibold" style={{ color: '#0D1B2A' }}>{f.value || '—'}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modal Firma ─────────── */}
      <AnimatePresence>
        {showSignatureModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[115] flex items-center justify-center p-6"
            style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(6px)' }}
            onClick={() => setShowSignatureModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              className="rounded-3xl w-full max-w-lg flex flex-col overflow-hidden"
              style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 25px 60px rgba(0,0,0,0.12)', maxHeight: '85vh' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                <div>
                  <p className="text-lg font-bold" style={{ color: '#1A1A1E' }}>Firma del personal</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.4)' }}>{trainer.name}</p>
                </div>
                <motion.button whileHover={{ scale: 1.1, background: 'rgba(244,56,67,0.1)', color: '#F43843' }} whileTap={{ scale: 0.9 }} onClick={() => setShowSignatureModal(false)} className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer" style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.45)' }}>
                  <X size={16} />
                </motion.button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-6 pb-6 pt-5">
                {signatureSuccess ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col items-center py-10 gap-3">
                    <motion.img src={checkSuccessImg} alt="éxito" className="w-28 h-auto object-contain" animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />
                    <p className="text-lg font-bold" style={{ color: '#1A1A1E' }}>Firma registrada</p>
                    <p className="text-xs font-medium text-center max-w-[260px]" style={{ color: 'rgba(0,0,0,0.45)' }}>La firma de {trainer.name} ha sido guardada exitosamente.</p>
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => { setShowSignatureModal(false); setSignatureDrawn(false); sigRef.current?.clear(); setSignatureSuccess(false); }} className="mt-4 px-8 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer" style={{ background: GREEN_BLUE_GRAD }}>
                      Finalizar
                    </motion.button>
                  </motion.div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-bold" style={{ color: '#1A1A1E' }}>Dibuja tu firma</p>
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }} onClick={() => { sigRef.current?.clear(); setSignatureDrawn(false); }} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer" style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.4)' }}>
                        <RefreshCw size={11} /> Limpiar firma
                      </motion.button>
                    </div>
                    <p className="text-[11px] font-medium mb-3" style={{ color: 'rgba(0,0,0,0.4)' }}>
                      Dibuja tu firma en el recuadro utilizando el mouse o tu dedo.
                    </p>
                    <div className="relative rounded-2xl p-4 overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.04)' }}>
                      <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 rounded-tl pointer-events-none" style={{ borderColor: 'rgba(18,112,183,0.2)' }} />
                      <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 rounded-tr pointer-events-none" style={{ borderColor: 'rgba(18,112,183,0.2)' }} />
                      <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 rounded-bl pointer-events-none" style={{ borderColor: 'rgba(18,112,183,0.2)' }} />
                      <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 rounded-br pointer-events-none" style={{ borderColor: 'rgba(18,112,183,0.2)' }} />
                      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.04)' }}>
                        <SignatureCanvas
                          ref={sigRef}
                          penColor="#1A1A1E"
                          minWidth={1}
                          maxWidth={2.5}
                          onEnd={() => setSignatureDrawn(true)}
                          canvasProps={{ className: 'w-full', style: { height: 200, background: '#FFFFFF', borderRadius: 12, width: '100%' } }}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="flex-shrink-0 p-6 pt-4 flex items-center justify-between" style={{ borderTop: '1px solid rgba(0,0,0,0.04)', background: 'rgba(255,255,255,0.8)' }}>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { setShowSignatureModal(false); setSignatureDrawn(false); sigRef.current?.clear(); setSignatureSuccess(false); }} className="px-5 py-2.5 rounded-xl text-xs font-medium cursor-pointer" style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.5)' }}>
                  Cancelar
                </motion.button>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => { if (!signatureDrawn && !signatureSuccess) return; if (signatureSuccess) { setShowSignatureModal(false); setSignatureDrawn(false); sigRef.current?.clear(); setSignatureSuccess(false); return; } setSignatureSuccess(true); }} className="px-5 py-2.5 rounded-xl text-xs font-bold text-white" style={{ background: (signatureDrawn || signatureSuccess) ? (signatureSuccess ? GREEN_BLUE_GRAD : BLUE_GRAD) : 'rgba(0,0,0,0.1)', cursor: (signatureDrawn || signatureSuccess) ? 'pointer' : 'not-allowed' }}>
                  Finalizar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modal Huella Digital ─────────── */}
      <AnimatePresence>
        {showFingerprintModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[115] flex items-center justify-center p-6"
            style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(6px)' }}
            onClick={() => setShowFingerprintModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              className="rounded-3xl w-full max-w-lg flex flex-col overflow-hidden min-h-[520px]"
              style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 25px 60px rgba(0,0,0,0.12)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                <div>
                  <p className="text-lg font-bold" style={{ color: '#1A1A1E' }}>Huella digital</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.4)' }}>{trainer.name}</p>
                </div>
                <motion.button whileHover={{ scale: 1.1, background: 'rgba(244,56,67,0.1)', color: '#F43843' }} whileTap={{ scale: 0.9 }} onClick={() => setShowFingerprintModal(false)} className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer" style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.45)' }}>
                  <X size={16} />
                </motion.button>
              </div>

              {/* Body */}
              <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
                {fingerprintSuccess ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2" style={{ background: 'rgba(34,197,94,0.12)' }}>
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }} className="text-3xl">✓</motion.span>
                    </div>
                    <p className="text-lg font-bold" style={{ color: '#1A1A1E' }}>Huella registrada</p>
                    <p className="text-xs font-medium text-center max-w-[260px]" style={{ color: 'rgba(0,0,0,0.45)' }}>La huella digital de {trainer.name} ha sido capturada exitosamente.</p>
                  </motion.div>
                ) : (
                <>
                <div className="relative flex items-center justify-center">
                  <motion.div
                    className="absolute rounded-full pointer-events-none"
                    style={{ width: 280, height: 280, background: fingerprintStatus === 'scanning' ? 'radial-gradient(circle, rgba(34,197,94,0.5) 0%, rgba(34,197,94,0.15) 40%, transparent 70%)' : 'radial-gradient(circle, rgba(18,112,183,0.5) 0%, rgba(18,112,183,0.12) 40%, transparent 70%)' }}
                    animate={fingerprintStatus !== 'captured' ? { scale: [1, 1.15, 1], opacity: fingerprintStatus === 'scanning' ? [0.3, 1, 0.3] : [0.5, 0.9, 0.5] } : { opacity: 0, scale: 1.5 }}
                    transition={{ duration: 3, repeat: fingerprintStatus === 'captured' ? 0 : Infinity, ease: 'easeInOut' }}
                  />
                  {fingerprintStatus === 'scanning' && (
                    <>
                      {[0, 1].map(i => (
                        <motion.div key={`ring-${i}`} className="absolute rounded-full pointer-events-none" style={{ width: 64, height: 64, border: '1.5px solid rgba(34,197,94,0.4)' }} animate={{ scale: [1, 5], opacity: [0.6, 0] }} transition={{ duration: 3, repeat: Infinity, delay: i * 1.5, ease: 'easeOut' }} />
                      ))}
                    </>
                  )}
                  <AnimatePresence mode="wait">
                    {fingerprintStatus === 'captured' ? (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }} className="relative flex items-center justify-center">
                        <div className="absolute w-56 h-56 rounded-full" style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.25) 0%, transparent 70%)' }} />
                        {[...Array(12)].map((_, i) => {
                          const angle = (i / 12) * 360, rad = (angle * Math.PI) / 180, dist = 80 + (i % 3) * 20
                          return <motion.span key={i} className="absolute pointer-events-none text-lg select-none" style={{ color: '#22C55E' }} animate={{ x: [0, Math.cos(rad) * dist], y: [0, Math.sin(rad) * dist], opacity: [0, 1, 0], scale: [0, 1.2, 0] }} transition={{ duration: 2 + (i % 4) * 0.3, repeat: Infinity, delay: i * 0.1, ease: 'easeOut' }}>✦</motion.span>
                        })}
                        <div className="relative w-56 h-56 flex items-center justify-center"><motion.img src={checkSuccessImg} alt="check" className="w-28 h-auto object-contain relative z-10" animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} /></div>
                      </motion.div>
                    ) : (
                      <div className="relative flex items-center justify-center">
                        <div className="relative w-56 h-56">
                          <motion.img src={lectorHuellaImg} alt="lector huella" className="w-full h-full object-contain" animate={{ scale: [1, 1.02, 1], opacity: fingerprintStatus === 'scanning' ? 0.3 : 0.4 }} transition={{ scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' }, opacity: { duration: 0.3 } }} />
                          {fingerprintStatus === 'scanning' && (
                            <motion.div className="absolute inset-0 pointer-events-none z-10 overflow-hidden" style={{ filter: 'brightness(1.3) drop-shadow(0 0 15px rgba(34,197,94,0.5))' }} animate={{ clipPath: ['inset(90% 0 10% 0)', 'inset(10% 0 80% 0)', 'inset(90% 0 10% 0)'] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}><img src={lectorHuellaImg} alt="" className="w-full h-full object-contain" /></motion.div>
                          )}
                        </div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-6 text-center">
                  {fingerprintStatus === 'idle' && <p className="text-xs font-medium" style={{ color: 'rgba(0,0,0,0.4)' }}>Coloca tu dedo sobre el sensor para capturar tu huella digital.</p>}
                  {fingerprintStatus === 'scanning' && <motion.div className="flex items-center gap-2 justify-center" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><RefreshCw size={16} color={GREEN} /></motion.div><span className="text-xs font-medium" style={{ color: GREEN }}>Escaneando huella...</span></motion.div>}
                  {fingerprintStatus === 'captured' && <p className="text-xs font-medium" style={{ color: GREEN }}>Huella capturada exitosamente</p>}
                </div>
                </>
                )}
              </div>

              {/* Footer */}
              <div className="flex-shrink-0 p-6 pt-4 flex items-center justify-between" style={{ borderTop: '1px solid rgba(0,0,0,0.04)', background: 'rgba(255,255,255,0.8)' }}>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { setShowFingerprintModal(false); setFingerprintStatus('idle'); setFingerprintSuccess(false); }} className="px-5 py-2.5 rounded-xl text-xs font-medium cursor-pointer" style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.5)' }}>
                  Cerrar
                </motion.button>
                <div className="flex gap-3">
                  {fingerprintStatus === 'idle' && (
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => { setFingerprintStatus('scanning'); setTimeout(() => setFingerprintStatus('captured'), 5000); }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer" style={{ background: BLUE_GRAD }}>
                      <ScanLine size={16} /> Capturar huella
                    </motion.button>
                  )}
                  {fingerprintStatus === 'scanning' && (
                    <motion.button disabled className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white cursor-not-allowed" style={{ background: 'rgba(0,0,0,0.15)' }}>
                      <RefreshCw size={16} className="animate-spin" /> Escaneando...
                    </motion.button>
                  )}
                  {fingerprintStatus === 'captured' && !fingerprintSuccess && (
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setFingerprintSuccess(true)} className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer" style={{ background: GREEN_BLUE_GRAD, boxShadow: '0 4px 16px rgba(18,112,183,0.35)' }}>
                      Finalizar
                    </motion.button>
                  )}
                  {fingerprintSuccess && (
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => { setShowFingerprintModal(false); setFingerprintStatus('idle'); setFingerprintSuccess(false); }} className="px-5 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer" style={{ background: GREEN_BLUE_GRAD }}>
                      Cerrar
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}