import { useState } from 'react'
import { motion } from 'motion/react'
import { Users, Activity, Search, X } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer, Cell, LabelList } from 'recharts'
import { StudentsView } from '@/assets/models/ui/users/students/StudentsModel'
import { StudentCardView } from '@/assets/models/ui/objects/student_card/StudentCardModel'
import { ListView } from '@/assets/models/ui/objects/list/ListModel'
import KpiCard from '../components/KpiCard'
import ChartCard from '../components/ChartCard'
import { BLUE, CAT_COLORS, emptyCareer, type CareerStat } from '../data'

const careerCategories: { id: string; label: string }[] = [
  { id: 'técnico', label: 'Técnicos' },
  { id: 'profesional', label: 'Profesionales' },
  { id: 'especialización', label: 'Especializaciones' },
]

export default function CareersSection({ careerData }: { careerData: CareerStat[] }) {
  const [careersModal, setCareersModal] = useState<'registered' | 'attendance' | null>(null)
  const [careerQuery, setCareerQuery] = useState('')

  const careerQueryNorm = careerQuery.trim().toLowerCase()
  const baseCareers = careerQueryNorm ? careerData.filter(c => c.faculty.toLowerCase().includes(careerQueryNorm)) : careerData
  const visibleCareers = baseCareers
  const modalCareers = careerQueryNorm ? careerData.filter(c => c.faculty.toLowerCase().includes(careerQueryNorm)) : careerData
  const careerChart = [...baseCareers].sort((a, b) => b.registered - a.registered).slice(0, 10)
  const attendanceChart = [...baseCareers].sort((a, b) => b.attendance - a.attendance).slice(0, 10)
  const totalCareers = visibleCareers.length
  const topRegistered = [...visibleCareers].sort((a, b) => b.registered - a.registered)[0] ?? emptyCareer
  const topAttendance = [...visibleCareers].sort((a, b) => b.attendance - a.attendance)[0] ?? emptyCareer
  const lowestAttendance = [...visibleCareers].sort((a, b) => a.attendance - b.attendance)[0] ?? emptyCareer

  const cards = [
    { label: 'Carreras Activas', value: String(totalCareers), sub: 'Facultades en el programa', color: '#BF5AF2', view: ListView },
    { label: 'Más Estudiantes', value: topRegistered.faculty, sub: `${topRegistered.registered} registrados`, color: BLUE, view: StudentsView },
    { label: 'Más Asistencia', value: topAttendance.faculty, sub: `${topAttendance.attendance} asistiendo`, color: '#30D158', view: StudentCardView },
    { label: 'Menos Asistencia', value: lowestAttendance.faculty, sub: `${lowestAttendance.attendance} asistiendo`, color: '#F43843', view: ListView },
  ]

  return (
    <>
      <div className="grid grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => (
          <KpiCard key={card.label} label={card.label} value={card.value} sub={card.sub} color={card.color} view={card.view} index={i} />
        ))}
      </div>

      {totalCareers === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center rounded-2xl p-8 mb-6"
          style={{ background: 'rgba(255,255,255,0.6)', border: '1px dashed rgba(0,0,0,0.12)' }}
        >
          <p className="text-xs font-bold" style={{ color: 'rgba(0,0,0,0.4)' }}>No hay carreras que coincidan con los filtros seleccionados</p>
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <ChartCard icon={Users} title="ESTUDIANTES REGISTRADOS POR CARRERA" delay={0.25}>
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={careerChart} layout="vertical" margin={{ left: 0, right: 40, top: 0, bottom: 0 }} barCategoryGap="22%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="faculty" tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 600 }} axisLine={false} tickLine={false} width={150} />
              <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }} />
              <defs>
                <linearGradient id="careerRegGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#1270B7" />
                </linearGradient>
              </defs>
              <Bar dataKey="registered" fill="url(#careerRegGrad)" radius={[0, 8, 8, 0]}>
                <LabelList dataKey="registered" position="right" style={{ fontSize: 11, fontWeight: 700, fill: '#1270B7' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCareersModal('registered')}
            className="mt-4 w-full py-2.5 rounded-xl text-xs font-bold transition-all"
            style={{ background: `${BLUE}08`, color: BLUE, border: `1px solid ${BLUE}20` }}
          >
            Ver todas las carreras
          </motion.button>
        </ChartCard>

        <ChartCard icon={Activity} title="ASISTENCIA DE ESTUDIANTES POR CARRERA" delay={0.3}>
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={attendanceChart} layout="vertical" margin={{ left: 0, right: 40, top: 0, bottom: 0 }} barCategoryGap="22%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="faculty" tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 600 }} axisLine={false} tickLine={false} width={150} />
              <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }} />
              <defs>
                <linearGradient id="careerAttGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#1270B7" />
                </linearGradient>
              </defs>
              <Bar dataKey="attendance" fill="url(#careerAttGrad)" radius={[0, 8, 8, 0]}>
                <LabelList dataKey="attendance" position="right" style={{ fontSize: 11, fontWeight: 700, fill: '#1270B7' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCareersModal('attendance')}
            className="mt-4 w-full py-2.5 rounded-xl text-xs font-bold transition-all"
            style={{ background: `${BLUE}08`, color: BLUE, border: `1px solid ${BLUE}20` }}
          >
            Ver todas las carreras
          </motion.button>
        </ChartCard>
      </div>

      {careersModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}
          onClick={() => setCareersModal(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl p-6"
            style={{ background: '#FFFFFF', boxShadow: '0 24px 80px rgba(0,0,0,0.15)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${BLUE}10` }}>
                  {careersModal === 'registered' ? <Users size={16} style={{ color: BLUE }} /> : <Activity size={16} style={{ color: BLUE }} />}
                </div>
                <h2 className="text-lg font-extrabold" style={{ color: '#1A1A1E' }}>
                  {careersModal === 'registered' ? 'Estudiantes Registrados' : 'Asistencia de Estudiantes'} — {careerData.length} Carreras
                </h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCareersModal(null)}
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.05)' }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="rgba(0,0,0,0.3)" strokeWidth="2" strokeLinecap="round"/></svg>
              </motion.button>
            </div>
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}>
                <Search size={14} style={{ color: 'rgba(0,0,0,0.3)' }} />
                <input
                  value={careerQuery}
                  onChange={e => setCareerQuery(e.target.value)}
                  placeholder="Buscar carrera..."
                  className="bg-transparent text-xs font-semibold outline-none"
                  style={{ color: '#1A1A1E' }}
                />
                {careerQuery && (
                  <button onClick={() => setCareerQuery('')} className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.05)' }}>
                    <X size={12} style={{ color: 'rgba(0,0,0,0.4)' }} />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-4 ml-auto">
                {careerCategories.map(cat => (
                  <span key={cat.id} className="flex items-center gap-1.5 text-[10px] font-bold" style={{ color: 'rgba(0,0,0,0.5)' }}>
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: CAT_COLORS[cat.id] }} />
                    {cat.label}
                  </span>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={Math.max(420, modalCareers.length * 34)}>
              <BarChart data={modalCareers} layout="vertical" margin={{ left: 0, right: 40, top: 0, bottom: 0 }} barCategoryGap="28%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="faculty" tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 600 }} axisLine={false} tickLine={false} width={250} interval={0} />
                <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }} />
                <Bar dataKey={careersModal === 'registered' ? 'registered' : 'attendance'} radius={[0, 6, 6, 0]}>
                  {modalCareers.map((c, i) => (
                    <Cell key={i} fill={CAT_COLORS[c.cat] ?? BLUE} />
                  ))}
                  <LabelList dataKey={careersModal === 'registered' ? 'registered' : 'attendance'} position="right" style={{ fontSize: 11, fontWeight: 700, fill: 'rgba(0,0,0,0.5)' }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}
