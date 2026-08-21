import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  ClipboardList, FileText, UserCog, X, Camera, Flame,
  CheckCircle2, Clock, Download, ChevronRight, ChevronLeft
} from 'lucide-react'
import { useStudentApp } from '@/features/student/hooks/useStudentApp'
import { assessmentItems } from '@/modules/students/StudentProfileData'
import { studentDocuments } from '@/features/student/utils/mockData'
import { SectionTitle, GradientBorder, cardStyle, FIRE, AMBER, BLUE, GREEN } from '@/features/student/components/ui/fitness'
import { AssessmentDetail } from '@/features/student/components/ui/AssessmentDetail'
import studentBoy from '@/assets/illustrations/characters/students/student_boy.webp'
import studentGirl from '@/assets/illustrations/characters/students/student_girl.webp'

const personalSections = [
  {
    title: 'Información personal',
    items: [
      { label: 'Primer nombre', value: 'Ana' },
      { label: 'Segundo nombre', value: 'Lucía' },
      { label: 'Primer apellido', value: 'García' },
      { label: 'Segundo apellido', value: 'Restrepo' },
      { label: 'Tipo de documento', value: 'CC' },
      { label: 'Número de documento', value: '1.021.334.556' },
      { label: 'Fecha de nacimiento', value: '14/03/2004' },
      { label: 'Género', value: 'Femenino' },
    ],
  },
  {
    title: 'Información de contacto',
    items: [
      { label: 'Email', value: 'ana.garcia@ucol.edu.co' },
      { label: 'Teléfono', value: '+57 312 456 7890' },
    ],
  },
  {
    title: 'Información médica',
    items: [
      { label: 'EPS', value: 'Sanitas' },
      { label: 'Grupo sanguíneo', value: 'O+' },
      { label: 'Nombre contacto', value: 'María García' },
      { label: 'Teléfono contacto', value: '+57 310 222 3344' },
      { label: 'Parentesco', value: 'Madre' },
    ],
  },
  {
    title: 'Rol en la universidad',
    items: [{ label: 'Rol', value: 'Estudiante' }],
  },
  {
    title: 'Información académica',
    items: [
      { label: 'Número carnet', value: 'U-2021-10458' },
      { label: 'Estado', value: 'Activo' },
      { label: 'Institución', value: 'Universitaria de Colombia' },
      { label: 'Modalidad', value: 'Presencial' },
      { label: 'Nivel de formación', value: 'Profesional' },
      { label: 'Carrera', value: 'Ingeniería de Sistemas' },
      { label: 'Semestre', value: '7' },
      { label: 'Jornada', value: 'Diurna' },
    ],
  },
]

type ModalId = 'history' | 'documents' | 'personal' | null

export function ProfilePage() {
  const { student } = useStudentApp()
  const [modal, setModal] = useState<ModalId>(null)
  const [photo, setPhoto] = useState<string | null>(null)
  const [historySel, setHistorySel] = useState<number | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const epsRef = useRef<HTMLInputElement>(null)
  const histRef = useRef<HTMLInputElement>(null)
  const lesRef = useRef<HTMLInputElement>(null)
  const [medEps, setMedEps] = useState<File | null>(null)
  const [medHistoria, setMedHistoria] = useState<File | null>(null)
  const [lesiones, setLesiones] = useState<File[]>([])

  const defaultPhoto = student.gender === 'M' ? studentBoy : studentGirl
  const latest = assessmentItems[0]

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setPhoto(URL.createObjectURL(file))
  }

  const menuItems = [
    { id: 'history' as const, label: 'Historial de valoraciones', desc: `${assessmentItems.length} valoraciones registradas`, icon: ClipboardList, color: BLUE },
    { id: 'documents' as const, label: 'Documentos', desc: 'PAR-Q, consentimientos y más', icon: FileText, color: AMBER },
    { id: 'personal' as const, label: 'Datos personales', desc: 'Información de tu perfil', icon: UserCog, color: GREEN },
  ]

  return (
    <div className="space-y-6">
      {/* Header perfil */}
      <GradientBorder radius={24}>
        <div className="relative overflow-hidden rounded-[23px]">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(90% 120% at 100% 0%, rgba(230,57,70,0.2), transparent 55%), radial-gradient(70% 100% at 0% 100%, rgba(245,166,35,0.1), transparent 60%)' }} />
          <div className="relative flex flex-col sm:flex-row items-center gap-5 p-6 md:p-8">
            {/* Avatar con opción de subir foto */}
            <div className="relative flex-shrink-0">
              <img
                src={photo || defaultPhoto}
                alt={student.firstName}
                className="w-28 h-28 rounded-3xl object-cover object-top"
                style={{ border: '2px solid rgba(255,255,255,0.15)', boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}
              />
              <motion.button
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1.5 -right-1.5 w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${FIRE}, ${AMBER})`, boxShadow: '0 8px 20px rgba(230,57,70,0.45)' }}
                title="Cambiar foto de perfil"
              >
                <Camera size={15} color="#fff" />
              </motion.button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
            </div>

            <div className="text-center sm:text-left min-w-0">
              <h2 className="uppercase italic font-black text-white leading-tight" style={{ fontSize: 'clamp(20px, 3vw, 26px)' }}>{student.name}</h2>
              <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: 12.5, marginTop: 4 }}>
                {personalData.find(p => p.label === 'Programa académico')?.value} · Semestre {personalData.find(p => p.label === 'Semestre')?.value}
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
                <span className="px-3 py-1 rounded-full font-bold" style={{ background: 'rgba(48,209,88,0.1)', border: '1px solid rgba(48,209,88,0.25)', color: GREEN, fontSize: 10.5 }}>
                  Objetivo: {student.goal}
                </span>
                <span className="px-3 py-1 rounded-full font-bold" style={{ background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.22)', color: AMBER, fontSize: 10.5 }}>
                  Adherencia {student.adherence}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </GradientBorder>

      {/* Métricas actuales (última valoración del entrenador) */}
      <section>
        <SectionTitle>Métricas actuales</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {[
            { v: latest.metrics[0].value, l: 'Peso' },
            { v: latest.estatura, l: 'Estatura' },
            { v: latest.metrics[1].value, l: 'IMC' },
            { v: latest.metrics[2].value, l: 'Grasa corporal' },
            { v: latest.metrics[3].value, l: 'Masa muscular' },
            { v: latest.presionArterial, l: 'Presión arterial' },
          ].map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-2xl p-4 text-center" style={cardStyle}>
              <p className="text-white font-black" style={{ fontSize: 17 }}>{m.v}</p>
              <p className="uppercase" style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.38)', marginTop: 4 }}>{m.l}</p>
            </motion.div>
          ))}
        </div>
        <div className="rounded-2xl p-4 mt-3 flex items-start gap-3" style={{ background: 'rgba(245,166,35,0.05)', border: '1px solid rgba(245,166,35,0.14)' }}>
          <Flame size={16} style={{ color: AMBER, marginTop: 2, flexShrink: 0 }} />
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12.5, lineHeight: 1.6 }}>
            Última valoración: <strong style={{ color: '#fff' }}>{latest.date}</strong> por {latest.evaluator} — Score {latest.score}/100
          </p>
        </div>
      </section>

      {/* Menú */}
      <section>
        <SectionTitle>Mi cuenta</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {menuItems.map((item, i) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setModal(item.id); if (item.id === 'history') setHistorySel(null) }}
              className="rounded-2xl p-5 text-left w-full"
              style={cardStyle}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: item.color + '15', border: `1px solid ${item.color}28` }}>
                  <item.icon size={21} style={{ color: item.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold truncate" style={{ fontSize: 14 }}>{item.label}</p>
                  <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 11, marginTop: 2 }}>{item.desc}</p>
                </div>
                <ChevronRight size={17} style={{ color: 'rgba(255,255,255,0.25)' }} className="flex-shrink-0" />
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* ---------- MODALES ---------- */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-6"
            style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)' }}
            onClick={() => { setModal(null); setHistorySel(null) }}
          >
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              className="w-full md:max-w-xl max-h-[82vh] overflow-y-auto rounded-t-3xl md:rounded-3xl"
              style={{
                background: 'linear-gradient(165deg, #12121C, #0A0A14)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 -10px 80px rgba(0,0,0,0.6)',
              }}
            >
              <div className="sticky top-0 z-10 flex items-center justify-between p-5" style={{ background: 'rgba(18,18,28,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <h3 className="uppercase italic font-black text-white" style={{ fontSize: 16 }}>
                  {modal === 'history' ? 'Historial de valoraciones' : modal === 'documents' ? 'Documentos' : 'Datos personales'}
                </h3>
                <button onClick={() => { setModal(null); setHistorySel(null) }} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)' }}>
                  <X size={17} />
                </button>
              </div>

              <div className="p-5 space-y-3">
                {/* Historial: lista de valoraciones */}
                {modal === 'history' && historySel === null && [...assessmentItems].reverse().map((a, i) => {
                  const ev = (a as any).evaluator || (a as any).evaluador
                  return (
                    <motion.button
                      key={a.num}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setHistorySel(a.num)}
                      className="rounded-2xl p-4 w-full text-left block"
                      style={cardStyle}
                    >
                      <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-black" style={{ background: a.color + '15', color: a.color, fontSize: 13 }}>
                            {a.score}
                          </div>
                          <div className="min-w-0">
                            <p className="text-white font-bold text-sm truncate">{a.date}</p>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{a.type} · {ev}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {a.num === 1 && (
                            <span className="px-2.5 py-1 rounded-full uppercase italic font-black tracking-wider" style={{ background: `linear-gradient(135deg, ${GREEN}, #7CE495)`, color: '#052e12', fontSize: 8.5 }}>
                              Actual
                            </span>
                          )}
                          <ChevronRight size={15} style={{ color: 'rgba(255,255,255,0.3)' }} />
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {a.metrics.map((m, k) => (
                          <div key={k} className="rounded-lg p-2 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
                            <p className="text-white font-bold" style={{ fontSize: 11.5 }}>{m.value}</p>
                            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 8 }}>{m.label}</p>
                          </div>
                        ))}
                      </div>
                    </motion.button>
                  )
                })}

                {/* Historial: detalle de la valoración seleccionada */}
                {modal === 'history' && historySel !== null && (() => {
                  const sel = assessmentItems.find(a => a.num === historySel)
                  if (!sel) return null
                  return (
                    <div>
                      <button
                        onClick={() => setHistorySel(null)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-colors hover:bg-white/10"
                        style={{ background: 'rgba(18,112,183,0.12)', border: '1px solid rgba(18,112,183,0.25)', color: '#7CC7FF', fontSize: 11.5 }}
                      >
                        <ChevronLeft size={14} />
                        Volver al historial
                      </button>
                      <div className="rounded-2xl p-4 mt-3" style={cardStyle}>
                        <AssessmentDetail item={sel as any} />
                      </div>
                    </div>
                  )
                })()}

                {/* Documentos */}
                {modal === 'documents' && studentDocuments.map((doc, i) => {
                  const statusColor = doc.status === 'firmado' || doc.status === 'disponible' ? GREEN : AMBER
                  return (
                    <div key={i} className="rounded-2xl p-4 flex items-center gap-3.5" style={cardStyle}>
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: statusColor + '14', border: `1px solid ${statusColor}28` }}>
                        {doc.status === 'pendiente' ? <Clock size={19} style={{ color: statusColor }} /> : <FileText size={19} style={{ color: statusColor }} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-sm truncate">{doc.name}</p>
                        <p style={{ color: statusColor, fontSize: 11, textTransform: 'capitalize' }}>
                          {doc.status}{doc.date !== '—' ? ` · ${doc.date}` : ''}
                        </p>
                      </div>
                      {doc.status !== 'pendiente' && (
                        <button className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }} title="Descargar">
                          <Download size={16} />
                        </button>
                      )}
                    </div>
                  )
                })}

                {/* Datos personales */}
                {modal === 'personal' && personalData.map((d, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ color: 'rgba(255,255,255,0.42)', fontSize: 12 }}>{d.label}</span>
                    <span className="text-white font-semibold text-right" style={{ fontSize: 12.5 }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
