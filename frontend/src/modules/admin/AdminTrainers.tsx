import { useState, useMemo, useEffect } from 'react'
import { motion } from 'motion/react'
import { Plus, ChevronRight } from 'lucide-react'
import trainersImg from '../../assets/illustrations/characters/trainers/trainers_group.webp'

const RED = '#F43843'
const BLUE = '#1270B7'
const RED_GRAD = 'linear-gradient(135deg, #F43843, #FF6B8A, #CC0033)'

interface Trainer {
  id: number
  name: string
  email: string
  phone: string
  speciality: string
  students: number
  status: 'active' | 'inactive'
  avatar: string
  rating: number
  joinedAt: string
  schedule: string
  certifications: string[]
}

const initialTrainers: Trainer[] = [
  { id: 1, name: 'Sebastián Morales', email: 'sebas.morales@unifit.edu', phone: '+1 555-0101', speciality: 'Fuerza y Acondicionamiento', students: 24, status: 'active', avatar: 'SM', rating: 96, joinedAt: '15 Ene 2024', schedule: 'Lun-Vie 6AM-2PM', certifications: ['Certificación NSCA', 'Entrenamiento Funcional Avanzado'] },
  { id: 2, name: 'Ana Lucía Rivas', email: 'ana.rivas@unifit.edu', phone: '+1 555-0102', speciality: 'Yoga y Flexibilidad', students: 18, status: 'active', avatar: 'AR', rating: 91, joinedAt: '01 Feb 2024', schedule: 'Lun-Vie 8AM-4PM', certifications: ['RYT 500 Yoga', 'Pilotes Matwork'] },
  { id: 3, name: 'Carlos Méndez', email: 'carlos.mendez@unifit.edu', phone: '+1 555-0103', speciality: 'Cardio y Resistencia', students: 31, status: 'active', avatar: 'CM', rating: 88, joinedAt: '10 Mar 2024', schedule: 'Mar-Sáb 10AM-6PM', certifications: ['ACE Certified', 'TRX Specialist'] },
  { id: 4, name: 'María Fernanda López', email: 'maria.lopez@unifit.edu', phone: '+1 555-0104', speciality: 'Nutrición Deportiva', students: 15, status: 'inactive', avatar: 'ML', rating: 78, joinedAt: '20 Abr 2024', schedule: 'Lun-Vie 7AM-3PM', certifications: ['Nutrition Coach', 'Dietética Deportiva'] },
  { id: 5, name: 'Roberto Jiménez', email: 'roberto.j@unifit.edu', phone: '+1 555-0105', speciality: 'Rehabilitación Física', students: 12, status: 'active', avatar: 'RJ', rating: 85, joinedAt: '05 May 2024', schedule: 'Lun-Jue 9AM-5PM', certifications: ['Fisioterapia Deportiva', 'Kinesiología'] },
]

export default function AdminTrainers({ search, onSelectTrainer, backSignal, trainerTab }: { search: string; onSelectTrainer?: () => void; backSignal?: number; trainerTab?: string }) {
  const [trainers] = useState(initialTrainers)
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null)

  useEffect(() => {
    setSelectedTrainer(null)
  }, [backSignal])

  function handleSelectTrainer(t: Trainer) {
    setSelectedTrainer(t)
    onSelectTrainer?.()
  }

  const filtered = useMemo(() =>
    trainers.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.speciality.toLowerCase().includes(search.toLowerCase())),
    [trainers, search]
  )

  const tableHeaders = ['Nombre', 'Especialidad', 'Estudiantes', 'Estado', '']

  if (selectedTrainer) {
    if (trainerTab && trainerTab !== 'overview') {
      return <div className="p-8 pt-12 max-w-[1440px] mx-auto" />
    }
    return (
      <div className="p-8 pt-12 space-y-6 max-w-[1440px] mx-auto relative">
        <div className="grid gap-2 items-start" style={{ gridTemplateColumns: '1fr 2fr 1fr', gridTemplateRows: 'auto auto auto' }}>
          <div className="rounded-[28px] p-5 transition-transform duration-200 hover:scale-[1.02]" style={{ gridColumn: '1', gridRow: '1', background: 'rgba(255,255,255,0.5)' }}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: `${RED}30` }} />
              <p className="text-lg font-extrabold capitalize" style={{ color: '#0D1B2A' }}>Información General</p>
            </div>
            <div className="flex flex-col">
              {[
                { label: 'ID', value: `#${selectedTrainer.id}` },
                { label: 'Estado', value: selectedTrainer.status === 'active' ? 'Activo' : 'Inactivo' },
                { label: 'Ingresó', value: selectedTrainer.joinedAt },
              ].map((field, fi, arr) => (
                <div key={field.label} className="flex flex-col" style={{ borderBottom: fi < arr.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none', paddingBottom: fi < arr.length - 1 ? 6 : 0 }}>
                  <p className="text-xs mb-0.5" style={{ color: 'rgba(0,0,0,0.5)' }}>{field.label}</p>
                  <p className="text-base font-semibold" style={{ color: '#0D1B2A' }}>{field.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center relative" style={{ gridColumn: '2', gridRow: '1 / 4', paddingTop: 16, alignSelf: 'stretch', overflow: 'visible' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold shadow-lg mb-3 relative z-10" style={{
              background: selectedTrainer.status === 'active' ? 'linear-gradient(135deg, #30D158, #20A040)' : 'linear-gradient(135deg, #8E8E93, #636366)',
              fontSize: 26,
            }}>
              {selectedTrainer.avatar}
            </div>
            <h2 className="text-[#0D1B2A] text-2xl font-bold text-center mb-2 relative z-10">{selectedTrainer.name}</h2>
            <p className="text-sm font-medium text-center relative z-10" style={{ color: 'rgba(0,0,0,0.4)' }}>{selectedTrainer.speciality}</p>
          </div>

          <div className="rounded-[28px] p-5 transition-transform duration-200 hover:scale-[1.02]" style={{ gridColumn: '3', gridRow: '1', background: 'rgba(255,255,255,0.5)' }}>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: `${BLUE}30` }} />
              <p className="text-lg font-extrabold capitalize" style={{ color: '#0D1B2A' }}>Rendimiento</p>
            </div>
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
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="url(#trainerScoreGrad)" strokeWidth="2.8" strokeLinecap="round" strokeDasharray={`${selectedTrainer.rating * 0.999} ${100 - selectedTrainer.rating * 0.999}`} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-2xl font-extrabold" style={{ background: 'linear-gradient(90deg, #30D158, #00C7BE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{selectedTrainer.rating}%</p>
                </div>
              </div>
              <div className="flex flex-col flex-1 gap-3">
                {[
                  { label: 'Efectividad', value: selectedTrainer.rating, gradient: 'linear-gradient(90deg, #30D158, #00C7BE)' },
                  { label: 'Retención', value: Math.min(100, selectedTrainer.rating + 3), gradient: 'linear-gradient(90deg, #FF9500, #FFCC02)' },
                  { label: 'Carga laboral', value: Math.min(100, selectedTrainer.students * 3 + 10), gradient: 'linear-gradient(90deg, #FF6B8A, #FF375F)' },
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
          </div>

          <div className="rounded-[28px] p-5 transition-transform duration-200 hover:scale-[1.02]" style={{ gridColumn: '1', gridRow: '2', background: 'rgba(255,255,255,0.5)' }}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: `${RED}30` }} />
              <p className="text-lg font-extrabold capitalize" style={{ color: '#0D1B2A' }}>Contacto</p>
            </div>
            <div className="flex flex-col">
              {[
                { label: 'Email', value: selectedTrainer.email },
                { label: 'Teléfono', value: selectedTrainer.phone },
              ].map((field, fi, arr) => (
                <div key={field.label} className="flex flex-col" style={{ borderBottom: fi < arr.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none', paddingBottom: fi < arr.length - 1 ? 8 : 0 }}>
                  <p className="text-xs mb-1" style={{ color: 'rgba(0,0,0,0.5)' }}>{field.label}</p>
                  <p className="text-base font-semibold" style={{ color: '#0D1B2A' }}>{field.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] p-5 transition-transform duration-200 hover:scale-[1.02]" style={{ gridColumn: '3', gridRow: '2', background: 'rgba(255,255,255,0.5)' }}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: `${BLUE}30` }} />
              <p className="text-lg font-extrabold capitalize" style={{ color: '#0D1B2A' }}>Estadísticas</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Estudiantes', value: `${selectedTrainer.students}` },
                { label: 'Horario', value: selectedTrainer.schedule },
                { label: 'Antigüedad', value: selectedTrainer.joinedAt },
                { label: 'Evaluación', value: `${selectedTrainer.rating}/100` },
              ].map(m => (
                <div key={m.label} className="rounded-xl p-3 text-center" style={{ background: 'rgba(0,0,0,0.02)' }}>
                  <p className="text-sm font-extrabold" style={{ color: '#0D1B2A' }}>{m.value}</p>
                  <p className="text-[10px] font-semibold mt-0.5" style={{ color: 'rgba(0,0,0,0.35)' }}>{m.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] p-5 transition-transform duration-200 hover:scale-[1.02]" style={{ gridColumn: '1', gridRow: '3', background: 'rgba(255,255,255,0.5)' }}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: `${RED}30` }} />
              <p className="text-lg font-extrabold capitalize" style={{ color: '#0D1B2A' }}>Horario</p>
            </div>
            <div className="flex flex-col">
              {[
                { label: 'Jornada', value: selectedTrainer.schedule },
                { label: 'Días laborales', value: selectedTrainer.schedule.split(' ')[0] },
              ].map((field, fi, arr) => (
                <div key={field.label} className="flex flex-col" style={{ borderBottom: fi < arr.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none', paddingBottom: fi < arr.length - 1 ? 6 : 0 }}>
                  <p className="text-xs mb-0.5" style={{ color: 'rgba(0,0,0,0.5)' }}>{field.label}</p>
                  <p className="text-base font-semibold" style={{ color: '#0D1B2A' }}>{field.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] p-5 relative overflow-hidden transition-transform duration-200 hover:scale-[1.02]" style={{ gridColumn: '3', gridRow: '3', background: 'linear-gradient(135deg, rgba(255,215,0,0.08), rgba(255,185,0,0.05), rgba(255,215,0,0.08))' }}>
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'linear-gradient(110deg, transparent 25%, rgba(255,215,0,0.15) 37%, rgba(255,255,255,0.4) 50%, rgba(255,215,0,0.15) 63%, transparent 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 3s ease-in-out infinite',
            }} />
            <div className="relative z-10">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: 'rgba(212,175,55,0.5)' }} />
                <p className="text-lg font-extrabold capitalize" style={{ color: '#B8860B' }}>Certificaciones</p>
              </div>
              <div className="space-y-2">
                {selectedTrainer.certifications.map((cert, i) => (
                  <div key={i} className="rounded-2xl p-3" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)' }}>
                    <p className="text-sm font-bold" style={{ color: '#B8860B' }}>{cert}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="p-8 pt-12 space-y-6 max-w-[1440px] mx-auto relative">

        {/* Banner card */}
        <motion.div className="relative rounded-3xl mb-8" style={{ background: 'linear-gradient(90deg, #FFFFFF 0%, #F8FBFF 40%, rgba(248,251,255,0) 100%)', boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}>
          <div className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden" style={{
            maskImage: 'linear-gradient(to right, black 60%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, black 60%, transparent 100%)'
          }}>
            <div className="absolute inset-0 opacity-30" style={{
              background: 'radial-gradient(ellipse at 80% 10%, rgba(0,122,255,0.03) 0%, transparent 40%), radial-gradient(ellipse at 10% 80%, rgba(245,166,35,0.02) 0%, transparent 40%), radial-gradient(ellipse at 50% 50%, rgba(230,57,70,0.02) 0%, transparent 50%)',
              backgroundSize: '200% 200%',
              animation: 'mesh-shift 15s ease-in-out infinite',
            }} />
          </div>

          <div className="relative z-10 p-8 flex items-center justify-between">
            <div className="flex items-center gap-6 ml-56">
              <div className="w-1 h-12 rounded-full" style={{ background: RED_GRAD }} />
              <div>
                <h1 style={{ color: '#1A1A1E', fontSize: '2rem', fontWeight: 800 }}>Usuarios</h1>
                <p className="text-xs text-black/40">Crea y gestiona administradores y entrenadores del sistema.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pr-4">
              <motion.button
                initial="initial"
                whileHover="hover"
                whileTap={{ scale: 0.9, boxShadow: '0 0 40px rgba(244,56,67,0.6), 0 0 80px rgba(18,112,183,0.4), 0 0 120px rgba(241,200,39,0.2)', transition: { duration: 0.15 } }}
                className="flex items-center rounded-full overflow-hidden relative text-white"
                style={{
                  height: 44,
                  padding: '0 12px',
                  background: `
                    radial-gradient(at 20% 20%, #F43843 0%, transparent 50%),
                    radial-gradient(at 80% 15%, #1270B7 0%, transparent 50%),
                    radial-gradient(at 50% 80%, #F1C827 0%, transparent 60%),
                    radial-gradient(at 30% 60%, #F43843 0%, transparent 40%),
                    radial-gradient(at 70% 70%, #1270B7 0%, transparent 40%),
                    #F43843
                  `,
                  backgroundSize: '150% 150%',
                  boxShadow: '0 10px 25px -5px rgba(230,57,70,0.3)',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 10px 30px -3px rgba(230,57,70,0.5), 0 0 20px rgba(230,57,70,0.2)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(230,57,70,0.3)' }}
              >
                <motion.div
                  variants={{
                    hover: { maxWidth: 180, opacity: 1, marginRight: 10, transition: { delay: 0.12, duration: 0.4, ease: 'easeOut' } },
                    initial: { maxWidth: 0, opacity: 0, marginRight: 0, transition: { duration: 0.25 } }
                  }}
                  whileTap={{ opacity: 0.35, transition: { duration: 0.12 } }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  <span className="text-xs font-bold">Nuevo Entrenador</span>
                </motion.div>
                <motion.div
                  whileTap={{ scale: 0.85, opacity: 0.35, transition: { duration: 0.12 } }}
                  className="flex items-center justify-center flex-shrink-0"
                >
                  <Plus size={18} strokeWidth={3} />
                </motion.div>
              </motion.button>
            </div>
          </div>

          <div
            style={{ position: 'absolute', left: 10, bottom: 0, width: 220, zIndex: 20, opacity: 0, animation: 'blur-fade 0.6s 0.3s ease forwards' }}
          >
            <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', width: '85%', height: '45%', background: 'rgba(18,112,183,0.12)', filter: 'blur(25px)', borderRadius: '50%' }} />
            <img src={trainersImg} alt="Trainers" className="w-full h-auto drop-shadow-xl relative" style={{ transform: 'translateY(2%)' }} />
          </div>
        </motion.div>

        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-6 mb-3">
          {tableHeaders.map((h, i) => (
            <p key={i} className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: 'rgba(0,0,0,0.25)' }}>{h}</p>
          ))}
          <div className="w-5" />
        </div>

        <div className="space-y-2">
          {filtered.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => handleSelectTrainer(t)}
              whileHover={{ y: -3, scale: 1.002, background: 'rgba(255,255,255,0.8)' }}
              className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] items-center gap-4 p-4 rounded-2xl cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.4)' }}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0" style={{ background: t.status === 'active' ? 'linear-gradient(135deg, #30D158, #20A040)' : 'linear-gradient(135deg, #8E8E93, #636366)', fontSize: 13 }}>{t.avatar}</div>
                <div className="min-w-0">
                  <p className="text-[#1A1A1E] text-sm font-bold truncate">{t.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.3)' }}>{t.email}</p>
                </div>
              </div>
              <p className="text-xs font-semibold" style={{ color: 'rgba(0,0,0,0.5)' }}>{t.speciality}</p>
              <p className="text-xs font-bold" style={{ color: '#1D1D1F' }}>{t.students}</p>
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold" style={{
                background: t.status === 'active' ? 'rgba(48,209,88,0.08)' : 'rgba(142,142,147,0.08)',
                color: t.status === 'active' ? '#30D158' : '#8E8E93',
                border: `1px solid ${t.status === 'active' ? 'rgba(48,209,88,0.15)' : 'rgba(142,142,147,0.15)'}`,
              }}>
                {t.status === 'active' ? 'Activo' : 'Inactivo'}
              </span>
              <ChevronRight size={15} style={{ color: 'rgba(0,0,0,0.12)' }} />
            </motion.div>
          ))}
        </div>
      </div>
    </>
  )
}
