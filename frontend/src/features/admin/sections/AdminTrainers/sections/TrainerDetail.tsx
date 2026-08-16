import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Maximize2, X } from 'lucide-react'
import type { Trainer } from '@/data/trainers'
import DetailCard from '../components/DetailCard'
import FieldList from '../components/FieldList'
import { StudentCardView } from '@/assets/models/ui/objects/student_card/StudentCardModel'
import { TrophyView } from '@/assets/models/ui/objects/trophy/TrophyModel'
import { TelephoneView } from '@/assets/models/ui/objects/telephone/TelephoneModel'
import { ListView } from '@/assets/models/ui/objects/list/ListModel'
import { ClockView } from '@/assets/models/ui/objects/clock/ClockModel'
import { DocumentView } from '@/assets/models/ui/objects/document/DocumentModel'
import { CapView } from '@/assets/models/ui/objects/cap/CapModel'
import { StethoscopeView } from '@/assets/models/ui/objects/stethoscope/StethoscopeModel'
import { BLUE, RED } from '../data'

export default function TrainerDetail({ trainer }: { trainer: Trainer }) {
  const [showInfoModal, setShowInfoModal] = useState(false)
  return (
    <div className="relative z-10 p-8 overflow-hidden">
      <div className="w-full">
        <div className="grid gap-2 items-start" style={{ gridTemplateColumns: '1fr 2fr 1fr', gridTemplateRows: 'auto auto auto' }}>
          <DetailCard gridColumn="1" gridRow="1" accent={RED} title="Información General" model={<StudentCardView />}>
            <div className="flex items-start justify-between">
              <FieldList fields={[
                { label: 'Documento', value: trainer.document },
                { label: 'Fecha de nacimiento', value: trainer.birthDate },
                { label: 'Género', value: trainer.gender },
              ]} />
              <motion.button
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowInfoModal(true)}
                className="w-8 h-8 rounded-xl flex items-center justify-center ml-2 flex-shrink-0 cursor-pointer transition-colors"
                style={{
                  background: 'rgba(18,112,183,0.1)',
                  color: '#1270B7',
                  border: '1px solid rgba(18,112,183,0.18)',
                }}
              >
                <Maximize2 size={14} />
              </motion.button>
            </div>
          </DetailCard>

          <div className="flex flex-col items-center relative" style={{ gridColumn: '2', gridRow: '1 / 4', paddingTop: 16, alignSelf: 'stretch', overflow: 'visible' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold shadow-lg mb-3 relative z-10" style={{
              background: trainer.status === 'active' ? 'linear-gradient(135deg, #30D158, #20A040)' : 'linear-gradient(135deg, #8E8E93, #636366)',
              fontSize: 26,
            }}>
              {trainer.avatar}
            </div>
            <h2 className="text-[#0D1B2A] text-2xl font-bold text-center mb-2 relative z-10">{trainer.name}</h2>
            <p className="text-sm font-medium text-center relative z-10" style={{ color: 'rgba(0,0,0,0.4)' }}>{trainer.speciality}</p>
          </div>

          <DetailCard gridColumn="3" gridRow="1" accent={BLUE} title="Rendimiento" model={<TrophyView />}>
            <div className="flex items-center gap-5">
              <div className="relative flex-shrink-0" style={{ width: 96, height: 96 }}>
                <svg viewBox="0 0 36 36" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
                  <defs>
                    <linearGradient id="trainerScoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#30D158" />
                      <stop offset="100%" stopColor="#00C7BE" />
                    </linearGradient>
                  </defs>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="2.8" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="url(#trainerScoreGrad)" strokeWidth="2.8" strokeLinecap="round" strokeDasharray={`${trainer.rating * 0.999} ${100 - trainer.rating * 0.999}`} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-2xl font-extrabold" style={{ background: 'linear-gradient(90deg, #30D158, #00C7BE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{trainer.rating}%</p>
                </div>
              </div>
              <div className="flex flex-col flex-1 gap-3">
                {[
                  { label: 'Efectividad', value: trainer.rating, gradient: 'linear-gradient(90deg, #30D158, #00C7BE)' },
                  { label: 'Retención', value: Math.min(100, trainer.rating + 3), gradient: 'linear-gradient(90deg, #FF9500, #FFCC02)' },
                  { label: 'Carga laboral', value: Math.min(100, trainer.students * 3 + 10), gradient: 'linear-gradient(90deg, #FF6B8A, #FF375F)' },
                ].map(m => (
                  <div key={m.label}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[10px] font-semibold" style={{ color: 'rgba(0,0,0,0.5)' }}>{m.label}</p>
                      <p className="text-[10px] font-bold" style={{ color: 'rgba(0,0,0,0.6)' }}>{m.value}%</p>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ background: 'rgba(0,0,0,0.05)' }}>
                      <div className="h-full rounded-full" style={{ width: `${m.value}%`, background: m.gradient }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DetailCard>

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

          <DetailCard gridColumn="1" gridRow="3" accent={RED} title="Horario" model={<ClockView />}>
            <FieldList fields={[
              { label: 'Jornada', value: trainer.schedule },
              { label: 'Días laborales', value: trainer.schedule.split(' ')[0] },
            ]} />
          </DetailCard>

          <div className="rounded-[28px] p-5 relative overflow-hidden transition-transform duration-200 hover:scale-[1.02]" style={{ gridColumn: '3', gridRow: '3', background: 'linear-gradient(135deg, rgba(255,215,0,0.08), rgba(255,185,0,0.05), rgba(255,215,0,0.08))' }}>
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
    </div>
  )
}
