import { useState } from 'react'
import { motion } from 'motion/react'
import { Users, Activity, GraduationCap, Search, X } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer, Cell, LabelList, PieChart, Pie } from 'recharts'
import KpiCard from '../components/KpiCard'
import ChartCard from '../components/ChartCard'
import { BLUE, CAT_COLORS, emptyCareer, type CareerRow } from '../data'

export default function CareersSection({ carreras, loading }: {
  carreras: CareerRow[]
  loading: boolean
}) {
  const [careersModal, setCareersModal] = useState<'registered' | 'attendance' | null>(null)
  const [careerQuery, setCareerQuery] = useState('')

  const careerQueryNorm = careerQuery.trim().toLowerCase()
  const baseCareers = careerQueryNorm ? carreras.filter(c => c.programa.toLowerCase().includes(careerQueryNorm)) : carreras
  const visibleCareers = baseCareers
  const modalCareers = baseCareers
  const careerChart = [...baseCareers].sort((a, b) => b.registrados - a.registrados).slice(0, 10)
  const attendanceChart = [...baseCareers].sort((a, b) => b.asistencias - a.asistencias).slice(0, 10)
  const universoPie = Object.entries(
    carreras.reduce<Record<string, number>>((acc, c) => {
      acc[c.universidadLabel] = (acc[c.universidadLabel] ?? 0) + c.registrados
      return acc
    }, {})
  ).map(([name, value]) => ({ name, value, color: name.includes('Bogotá') ? '#BF5AF2' : BLUE })).filter(d => d.value > 0).sort((a, b) => b.value - a.value)
  const totalUni = universoPie.reduce((acc, d) => acc + d.value, 0)
  const pctUni = (value: number) => (totalUni > 0 ? Math.round((value / totalUni) * 100) : 0)

  const totalCareers = visibleCareers.length
  const topRegistered = [...visibleCareers].sort((a, b) => b.registrados - a.registrados)[0] ?? emptyCareer
  const topAttendance = [...visibleCareers].sort((a, b) => b.asistencias - a.asistencias)[0] ?? emptyCareer
  const lowestAttendance = [...visibleCareers].sort((a, b) => a.asistencias - b.asistencias)[0] ?? emptyCareer

  const cards = [
    { label: 'Carreras registradas', value: String(totalCareers), sub: 'Programas en el sistema', color: '#BF5AF2' },
    { label: 'Más registradas', value: topRegistered.programa, sub: `${topRegistered.registrados} registrados`, color: BLUE },
    { label: 'Más Asistencia', value: topAttendance.programa, sub: `${topAttendance.asistencias} asistencias`, color: '#30D158' },
    { label: 'Menos Asistencia', value: lowestAttendance.programa, sub: `${lowestAttendance.asistencias} asistencias`, color: '#F43843' },
  ]

  const tooltipStyle = { borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }
  const tick = { fontSize: 11, fill: '#1A1A1E', fontWeight: 600 }
  const empty = (text: string) => (
    <div className="flex items-center justify-center" style={{ height: 360 }}>
      <span className="text-xs font-semibold" style={{ color: 'rgba(0,0,0,0.3)' }}>{text}</span>
    </div>
  )

  return (
    <>
      {!loading && totalCareers === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center rounded-2xl p-8 mb-6"
          style={{ background: 'rgba(255,255,255,0.6)', border: '1px dashed rgba(0,0,0,0.12)' }}
        >
          <p className="text-xs font-bold" style={{ color: 'rgba(0,0,0,0.4)' }}>No hay carreras que coincidan con los filtros seleccionados</p>
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col gap-4">
          {cards.map((card, i) => (
            <KpiCard key={card.label} label={card.label} value={card.value} sub={card.sub} color={card.color} index={i} />
          ))}
        </div>

        <ChartCard icon={GraduationCap} title="ESTUDIANTES POR UNIVERSIDAD" delay={0.35} fill>
          {loading || universoPie.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <span className="text-xs font-semibold" style={{ color: 'rgba(0,0,0,0.3)' }}>{loading ? 'Cargando…' : 'Sin estudiantes registrados'}</span>
            </div>
          ) : (
            <>
              <div className="flex-1 min-h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={universoPie} cx="50%" cy="50%" innerRadius="46%" outerRadius="70%" dataKey="value" stroke="#FFFFFF" strokeWidth={2}>
                      {universoPie.map(d => <Cell key={d.name} fill={d.color} />)}
                    </Pie>
                    <ReTooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-3 mt-2">
                {universoPie.map(d => (
                  <div key={d.name}>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                        <span className="text-[11px] font-bold truncate" style={{ color: 'rgba(0,0,0,0.6)' }}>{d.name}</span>
                      </div>
                      <span className="text-[11px] font-bold flex-shrink-0" style={{ color: d.color }}>{d.value} est. · {pctUni(d.value)}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.05)' }}>
                      <div className="h-full rounded-full" style={{ width: `${pctUni(d.value)}%`, background: d.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </ChartCard>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <ChartCard icon={Users} title="ESTUDIANTES REGISTRADOS POR CARRERA" delay={0.25}>
          {loading ? empty('Cargando…') : careerChart.length === 0 ? empty('Sin carreras registradas') : (
            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={careerChart} layout="vertical" margin={{ left: 0, right: 40, top: 0, bottom: 0 }} barCategoryGap="22%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" horizontal={false} />
                <XAxis type="number" tick={tick} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="programa" tick={tick} axisLine={false} tickLine={false} width={150} />
                <ReTooltip contentStyle={tooltipStyle} />
                <defs>
                  <linearGradient id="careerRegGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#1270B7" />
                  </linearGradient>
                </defs>
                <Bar dataKey="registrados" fill="url(#careerRegGrad)" radius={[0, 8, 8, 0]}>
                  <LabelList dataKey="registrados" position="right" style={{ fontSize: 11, fontWeight: 700, fill: '#1270B7' }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
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

        <ChartCard icon={Activity} title="ASISTENCIA POR CARRERA" delay={0.3}>
          {loading ? empty('Cargando…') : attendanceChart.length === 0 ? empty('Sin asistencias en el período') : (
            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={attendanceChart} layout="vertical" margin={{ left: 0, right: 40, top: 0, bottom: 0 }} barCategoryGap="22%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" horizontal={false} />
                <XAxis type="number" tick={tick} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="programa" tick={tick} axisLine={false} tickLine={false} width={150} />
                <ReTooltip contentStyle={tooltipStyle} />
                <defs>
                  <linearGradient id="careerAttGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#1270B7" />
                  </linearGradient>
                </defs>
                <Bar dataKey="asistencias" fill="url(#careerAttGrad)" radius={[0, 8, 8, 0]}>
                  <LabelList dataKey="asistencias" position="right" style={{ fontSize: 11, fontWeight: 700, fill: '#1270B7' }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
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
                  {careersModal === 'registered' ? 'Estudiantes Registrados' : 'Asistencia por Carrera'} — {modalCareers.length} Carreras
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
                {Object.entries(CAT_COLORS).map(([cat, color]) => (
                  <span key={cat} className="flex items-center gap-1.5 text-[10px] font-bold" style={{ color: 'rgba(0,0,0,0.5)' }}>
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                    {cat}
                  </span>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={Math.max(420, modalCareers.length * 34)}>
              <BarChart data={modalCareers} layout="vertical" margin={{ left: 0, right: 40, top: 0, bottom: 0 }} barCategoryGap="28%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" horizontal={false} />
                <XAxis type="number" tick={tick} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="programa" tick={tick} axisLine={false} tickLine={false} width={250} interval={0} />
                <ReTooltip contentStyle={tooltipStyle} />
                <Bar dataKey={careersModal === 'registered' ? 'registrados' : 'asistencias'} radius={[0, 6, 6, 0]}>
                  {modalCareers.map((c, i) => (
                    <Cell key={i} fill={CAT_COLORS[c.cat] ?? BLUE} />
                  ))}
                  <LabelList dataKey={careersModal === 'registered' ? 'registrados' : 'asistencias'} position="right" style={{ fontSize: 11, fontWeight: 700, fill: 'rgba(0,0,0,0.5)' }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}