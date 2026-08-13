import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as ReTooltip, ResponsiveContainer, Cell, PieChart, Pie, LabelList,
} from 'recharts'
import {
  Users, Activity,
  TrendingUp, Building2, Search, X,
} from 'lucide-react'
import { StudentCardView } from '@/assets/models/ui/objects/student_card/StudentCardModel'
import { ListView } from '@/assets/models/ui/objects/list/ListModel'
import { StudentsView } from '@/assets/models/ui/users/students/StudentsModel'
import { CalendarView } from '@/assets/models/ui/objects/calendar/CalendarModel'
import { CAREER_STATS } from '@/data/careerStats'
import { INSTITUCIONES, getNiveles, getPrograms } from '@/data/academicPrograms'

const BLUE = '#1270B7'
const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #1A8CDB, #0D5F9E)'

const CAT_COLORS: Record<string, string> = {
  técnico: '#1270B7',
  profesional: '#30D158',
  especialización: '#BF5AF2',
}

const NIVEL_OPTIONS = ['Técnico', 'Profesional', 'Especialización']
const normalizeNivel = (cat: string) =>
  cat === 'técnico' ? 'Técnico' : cat === 'profesional' ? 'Profesional' : cat === 'especialización' ? 'Especialización' : cat

const programsByInstitution: Record<string, Set<string>> = {}
INSTITUCIONES.forEach(inst => {
  const s = new Set<string>()
  getNiveles(inst).forEach(lv => getPrograms(inst, lv).forEach(p => s.add(p)))
  programsByInstitution[inst] = s
})
const institutionOf = (faculty: string) =>
  INSTITUCIONES.find(inst => programsByInstitution[inst]?.has(faculty)) ?? INSTITUCIONES[0]

const PROGRAM_OPTIONS = [...new Set(
  INSTITUCIONES.flatMap(inst => getNiveles(inst).flatMap(lv => getPrograms(inst, lv))),
)]

const evolutionData = [
  { mes: 'Ene', date: '2026-01-15', usuarios: 380, asistencia: 2350 },
  { mes: 'Feb', date: '2026-02-15', usuarios: 415, asistencia: 2540 },
  { mes: 'Mar', date: '2026-03-15', usuarios: 450, asistencia: 2780 },
  { mes: 'Abr', date: '2026-04-15', usuarios: 495, asistencia: 3010 },
  { mes: 'May', date: '2026-05-15', usuarios: 545, asistencia: 3290 },
  { mes: 'Jun', date: '2026-06-15', usuarios: 595, asistencia: 3550 },
  { mes: 'Jul', date: '2026-07-15', usuarios: 660, asistencia: 3860 },
  { mes: 'Ago', date: '2026-08-15', usuarios: 720, asistencia: 4150 },
  { mes: 'Sep', date: '2026-09-15', usuarios: 775, asistencia: 4430 },
  { mes: 'Oct', date: '2026-10-15', usuarios: 805, asistencia: 4680 },
  { mes: 'Nov', date: '2026-11-15', usuarios: 830, asistencia: 4980 },
  { mes: 'Dic', date: '2026-12-15', usuarios: 847, asistencia: 5200 },
]

export default function AdminStats({ tab, onTabChange, showCareerFilter, onToggleCareerFilter, statsRange }: {
  tab: string
  onTabChange: (t: string) => void
  showCareerFilter: boolean
  onToggleCareerFilter: () => void
  statsRange: { start: string; end: string }
}) {
  const [careersModal, setCareersModal] = useState<'registered' | 'attendance' | null>(null)
  const [careerQuery, setCareerQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<'institucion' | 'nivel' | 'programa'>('institucion')
  const [filterSelections, setFilterSelections] = useState<Record<string, Set<string>>>({})
  const [filterSearch, setFilterSearch] = useState('')

  const filterLabels: Record<string, string> = {
    institucion: 'Institución',
    nivel: 'Nivel académico',
    programa: 'Programa',
  }
  const filterOptions: Record<string, string[]> = {
    institucion: [...INSTITUCIONES],
    nivel: NIVEL_OPTIONS,
    programa: PROGRAM_OPTIONS,
  }

  const filteredEvolution = (statsRange.start && statsRange.end)
    ? evolutionData.filter(m => m.date >= statsRange.start && m.date <= statsRange.end)
    : evolutionData
  const lastUsuarios = filteredEvolution[filteredEvolution.length - 1]?.usuarios ?? 847
  const asistenciasPeriodo = filteredEvolution.reduce((s, m) => s + m.asistencia, 0)

  const careerData = useMemo(() => CAREER_STATS.filter(c => {
    const entries = Object.entries(filterSelections).filter(([, v]) => v.size > 0)
    if (entries.length === 0) return true
    return entries.every(([cat, vals]) => {
      if (cat === 'nivel') return vals.has(normalizeNivel(c.cat))
      if (cat === 'programa') return vals.has(c.faculty)
      if (cat === 'institucion') return vals.has(institutionOf(c.faculty))
      return true
    })
  }), [filterSelections])
  const allCareers = careerData
  const careerCategories: { id: string; label: string }[] = [
    { id: 'técnico', label: 'Técnicos' },
    { id: 'profesional', label: 'Profesionales' },
    { id: 'especialización', label: 'Especializaciones' },
  ]
  const careerQueryNorm = careerQuery.trim().toLowerCase()
  const baseCareers = careerQueryNorm ? careerData.filter(c => c.faculty.toLowerCase().includes(careerQueryNorm)) : careerData
  const visibleCareers = baseCareers
  const modalCareers = careerQueryNorm ? allCareers.filter(c => c.faculty.toLowerCase().includes(careerQueryNorm)) : allCareers
  const careerChart = [...baseCareers].sort((a, b) => b.registered - a.registered).slice(0, 10)
  const attendanceChart = [...baseCareers].sort((a, b) => b.attendance - a.attendance).slice(0, 10)
  const empty = { faculty: '—', registered: 0, attendance: 0, color: BLUE }
  const totalCareers = visibleCareers.length
  const topRegistered = [...visibleCareers].sort((a, b) => b.registered - a.registered)[0] ?? empty
  const topAttendance = [...visibleCareers].sort((a, b) => b.attendance - a.attendance)[0] ?? empty
  const lowestAttendance = [...visibleCareers].sort((a, b) => a.attendance - b.attendance)[0] ?? empty
  const lowestRegistered = [...visibleCareers].sort((a, b) => a.registered - b.registered)[0] ?? empty

  return (
    <div className="p-8 space-y-6 w-full relative">
      {showCareerFilter && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative z-40 mb-4"
        >
          <div className="flex items-center justify-between gap-1 p-1 rounded-2xl w-full" style={{
            background: 'rgba(255,255,255,0.35)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.5)',
          }}>
            {Object.entries(filterLabels).map(([key, label]) => {
              const hasSelection = (filterSelections[key]?.size ?? 0) > 0
              return (
                <button key={key}
                  onClick={() => { setFilterCategory(key as any); setFilterSearch('') }}
                  className="relative px-4 py-1.5 rounded-xl text-[11px] font-bold transition-colors flex-1 text-center hover:bg-white/40"
                  style={{
                    color: filterCategory === key ? '#1A1A1E' : hasSelection ? '#1270B7' : 'rgba(0,0,0,0.35)',
                  }}
                >
                  {filterCategory === key && (
                    <motion.div
                      layoutId="statsFilterBg"
                      className="absolute inset-0 rounded-xl"
                      style={{ background: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-1.5">
                    {hasSelection && <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#1270B7' }} />}
                    {label}
                  </span>
                </button>
              )
            })}
          </div>

          <AnimatePresence>
            <motion.div
              key={filterCategory}
              initial={{ opacity: 0, y: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 rounded-2xl p-3"
              style={{
                background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.6)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
              }}
            >
              <div className="relative mb-2">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(0,0,0,0.2)' }} />
                <input
                  value={filterSearch}
                  onChange={e => setFilterSearch(e.target.value)}
                  placeholder="Buscar..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl text-xs font-medium outline-none"
                  style={{ background: 'rgba(0,0,0,0.03)', color: '#1A1A1E' }}
                />
              </div>

              <div className="flex flex-col gap-0.5 max-h-48 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                {(() => {
                  const currentSelected = filterSelections[filterCategory] ?? new Set()
                  return (
                    <>
                      <motion.button layout
                        onClick={() => {
                          setFilterSelections(prev => {
                            const next = { ...prev }
                            delete next[filterCategory]
                            return next
                          })
                          setFilterSearch('')
                        }}
                        whileHover={{ background: 'rgba(18,112,183,0.06)' }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full text-left px-3 py-2 rounded-xl text-[11px] font-bold flex items-center gap-2 transition-colors duration-300"
                        style={{
                          background: currentSelected.size === 0 ? 'rgba(18,112,183,0.1)' : 'transparent',
                          color: currentSelected.size === 0 ? '#1270B7' : 'rgba(0,0,0,0.45)',
                        }}
                      >
                        <motion.div className="w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0"
                          animate={{
                            borderColor: currentSelected.size === 0 ? '#1270B7' : 'rgba(0,0,0,0.15)',
                            background: currentSelected.size === 0 ? '#1270B7' : 'transparent',
                          }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <motion.span
                            animate={{
                              scale: currentSelected.size === 0 ? 1 : 0,
                              opacity: currentSelected.size === 0 ? 1 : 0,
                            }}
                            className="text-white text-[9px] font-bold"
                          >✓</motion.span>
                        </motion.div>
                        Todos
                      </motion.button>
                      {filterOptions[filterCategory]
                        ?.filter(opt => opt.toLowerCase().includes(filterSearch.toLowerCase()))
                        .map(opt => (
                          <motion.button key={opt} layout
                            onClick={() => {
                              setFilterSelections(prev => {
                                const catSet = new Set(prev[filterCategory] ?? [])
                                if (catSet.has(opt)) catSet.delete(opt)
                                else catSet.add(opt)
                                if (catSet.size === 0) {
                                  const next = { ...prev }
                                  delete next[filterCategory]
                                  return next
                                }
                                return { ...prev, [filterCategory]: catSet }
                              })
                              setFilterSearch('')
                            }}
                            whileHover={{ background: 'rgba(18,112,183,0.06)' }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full text-left px-3 py-2 rounded-xl text-[11px] font-bold flex items-center gap-2 transition-colors duration-300"
                            style={{
                              background: currentSelected.has(opt) ? 'rgba(18,112,183,0.1)' : 'transparent',
                              color: currentSelected.has(opt) ? '#1270B7' : 'rgba(0,0,0,0.45)',
                            }}
                          >
                            <motion.div className="w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0"
                              animate={{
                                borderColor: currentSelected.has(opt) ? '#1270B7' : 'rgba(0,0,0,0.15)',
                                background: currentSelected.has(opt) ? '#1270B7' : 'transparent',
                              }}
                              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            >
                              <motion.span
                                animate={{
                                  scale: currentSelected.has(opt) ? 1 : 0,
                                  opacity: currentSelected.has(opt) ? 1 : 0,
                                }}
                                className="text-white text-[9px] font-bold"
                              >✓</motion.span>
                            </motion.div>
                            {opt}
                          </motion.button>
                        ))}
                    </>
                  )
                })()}
              </div>
              <AnimatePresence>
                {Object.values(filterSelections).some(s => s.size > 0) && (
                  <motion.button
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    onClick={() => setFilterSelections({})}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full mt-2 py-2 rounded-xl text-[11px] font-bold text-center"
                    style={{ background: 'rgba(244,56,67,0.08)', color: '#F43843' }}
                  >
                    Limpiar filtros
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
      <div style={{ filter: showCareerFilter ? 'blur(4px)' : 'none', opacity: showCareerFilter ? 0.5 : 1, pointerEvents: showCareerFilter ? 'none' : 'auto', transition: 'filter 0.3s ease, opacity 0.3s ease' }}>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          {tab === 'overview' && (
            <>
              <div className="grid grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Usuarios', value: String(lastUsuarios), sub: 'Registrados en el sistema', color: '#1270B7', view: StudentsView },
                  { label: 'Asistencias del Período', value: asistenciasPeriodo.toLocaleString('en-US'), sub: 'Asistencias acumuladas', color: '#30D158', view: StudentCardView },
                  { label: 'Carrera con Más Estudiantes', value: topRegistered.faculty, sub: `${topRegistered.registered} registrados`, color: '#BF5AF2', view: CalendarView },
                  { label: 'Carreras Activas', value: String(totalCareers), sub: 'Facultades en el programa', color: '#FF9F0A', view: ListView },
                ].map((card, i) => {
                  const ModelView = card.view
                  return (
                    <motion.div key={card.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                      className="relative rounded-2xl p-4 group cursor-pointer transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{
                        background: '#FFFFFF',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-14 h-14 flex-shrink-0 z-20 pointer-events-none transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                        >
                          <ModelView />
                        </div>
                        <div className="relative z-10 min-w-0">
                          <span className="stat-value block transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ fontSize: '1.15rem', fontWeight: 800, lineHeight: 1.2, color: card.color }}>{card.value}</span>
                          <p className="text-[11px] mt-1 font-bold truncate" style={{ color: '#1A1A1E' }}>{card.label}</p>
                          <p className="text-[11px] mt-1 font-semibold truncate" style={{ color: 'rgba(0,0,0,0.65)' }}>{card.sub}</p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  whileHover={{ scale: 1.01 }}
                  className="rounded-2xl p-6 premium-card"
                >
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${BLUE}10` }}>
                      <TrendingUp size={14} style={{ color: BLUE }} />
                    </div>
                    <span className="text-xs font-bold tracking-wide" style={{ color: '#1A1A1E' }}>EVOLUCIÓN DE USUARIOS A TRAVÉS DEL TIEMPO</span>
                  </div>
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={filteredEvolution} margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                      <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 600 }} axisLine={false} tickLine={false} width={30} />
                      <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }} />
                      <defs>
                        <linearGradient id="evoUsersGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={BLUE} stopOpacity={0.25} />
                          <stop offset="100%" stopColor={BLUE} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="usuarios" stroke={BLUE} strokeWidth={2.5} fill="url(#evoUsersGrad)" dot={{ r: 3, fill: BLUE, strokeWidth: 0 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.01 }}
                  className="rounded-2xl p-6 premium-card"
                >
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${BLUE}10` }}>
                      <Activity size={14} style={{ color: BLUE }} />
                    </div>
                    <span className="text-xs font-bold tracking-wide" style={{ color: '#1A1A1E' }}>EVOLUCIÓN DE ASISTENCIA A TRAVÉS DEL TIEMPO</span>
                  </div>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={filteredEvolution} margin={{ left: 0, right: 16, top: 0, bottom: 0 }} barCategoryGap="26%">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                      <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 600 }} axisLine={false} tickLine={false} width={30} />
                      <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }} />
                      <defs>
                        <linearGradient id="evoAsistGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={BLUE} />
                          <stop offset="100%" stopColor="#FFFFFF" />
                        </linearGradient>
                      </defs>
                      <Bar dataKey="asistencia" fill="url(#evoAsistGrad)" radius={[8, 8, 0, 0]}>
                        <LabelList dataKey="asistencia" position="top" style={{ fontSize: 9, fontWeight: 700, fill: '#1270B7' }} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>
            </>
          )}

          {tab === 'careers' && (
            <>
              <div className="grid grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Carreras Activas', value: String(totalCareers), sub: 'Facultades en el programa', color: '#BF5AF2', view: ListView },
                  { label: 'Más Estudiantes', value: topRegistered.faculty, sub: `${topRegistered.registered} registrados`, color: BLUE, view: StudentsView },
                  { label: 'Más Asistencia', value: topAttendance.faculty, sub: `${topAttendance.attendance} asistiendo`, color: '#30D158', view: StudentCardView },
                  { label: 'Menos Asistencia', value: lowestAttendance.faculty, sub: `${lowestAttendance.attendance} asistiendo`, color: '#F43843', view: ListView },
                ].map((card, i) => {
                  const ModelView = card.view
                  return (
                    <motion.div key={card.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                      className="relative rounded-2xl p-4 group cursor-pointer transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{
                        background: '#FFFFFF',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-14 h-14 flex-shrink-0 z-20 pointer-events-none transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                        >
                          <ModelView />
                        </div>
                        <div className="relative z-10 min-w-0">
                          <span className="stat-value block transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ fontSize: '1.15rem', fontWeight: 800, lineHeight: 1.2, color: card.color }}>{card.value}</span>
                          <p className="text-[11px] mt-1 font-bold truncate" style={{ color: '#1A1A1E' }}>{card.label}</p>
                          <p className="text-[11px] mt-1 font-semibold truncate" style={{ color: 'rgba(0,0,0,0.65)' }}>{card.sub}</p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
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
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  whileHover={{ scale: 1.01 }}
                  className="rounded-2xl p-6 premium-card"
                >
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${BLUE}10` }}>
                      <Users size={14} style={{ color: BLUE }} />
                    </div>
                    <span className="text-xs font-bold tracking-wide" style={{ color: '#1A1A1E' }}>ESTUDIANTES REGISTRADOS POR CARRERA</span>
                  </div>
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
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.01 }}
                  className="rounded-2xl p-6 premium-card"
                >
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${BLUE}10` }}>
                      <Activity size={14} style={{ color: BLUE }} />
                    </div>
                    <span className="text-xs font-bold tracking-wide" style={{ color: '#1A1A1E' }}>ASISTENCIA DE ESTUDIANTES POR CARRERA</span>
                  </div>
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
                </motion.div>
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
                          {careersModal === 'registered' ? 'Estudiantes Registrados' : 'Asistencia de Estudiantes'} — {allCareers.length} Carreras
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
          )}

          {tab === 'students' && (            <>
              <div className="grid grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Estudiantes', value: '847', sub: 'Registrados en el sistema', color: '#1270B7', view: StudentsView },
                  { label: 'Estudiantes Activos', value: '623', sub: 'Con asistencia este mes', color: '#30D158', view: StudentCardView },
                  { label: 'Estudiantes Inactivos', value: '224', sub: 'Sin actividad reciente', color: '#F43843', view: ListView },
                  { label: 'Asistencias Totales', value: '2,847', sub: 'Acumuladas del período', color: '#BF5AF2', view: CalendarView },
                ].map((card, i) => {
                  const ModelView = card.view
                  return (
                    <motion.div key={card.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                      className="relative rounded-2xl p-4 group cursor-pointer transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{
                        background: '#FFFFFF',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-14 h-14 flex-shrink-0 z-20 pointer-events-none transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                        >
                          <ModelView />
                        </div>
                        <div className="relative z-10 min-w-0">
                          <span className="stat-value block transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ fontSize: '1.15rem', fontWeight: 800, lineHeight: 1.2, color: card.color }}>{card.value}</span>
                          <p className="text-xs mt-1 font-bold truncate" style={{ color: '#1A1A1E' }}>{card.label}</p>
                          <p className="text-[11px] mt-1 font-semibold truncate" style={{ color: 'rgba(0,0,0,0.65)' }}>{card.sub}</p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  whileHover={{ scale: 1.01 }}
                  className="rounded-2xl p-6 premium-card"
                >
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${BLUE}10` }}>
                      <TrendingUp size={14} style={{ color: BLUE }} />
                    </div>
                    <span className="text-xs font-bold tracking-wide" style={{ color: '#1A1A1E' }}>EVOLUCIÓN DE ESTUDIANTES</span>
                  </div>
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={[
                      { mes: 'Ene', estudiantes: 520 }, { mes: 'Feb', estudiantes: 580 },
                      { mes: 'Mar', estudiantes: 610 }, { mes: 'Abr', estudiantes: 680 },
                      { mes: 'May', estudiantes: 740 }, { mes: 'Jun', estudiantes: 847 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                      <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }} />
                      <Area type="monotone" dataKey="estudiantes" stroke={BLUE} fill="url(#evoGrad)" strokeWidth={2.5} />
                      <defs>
                        <linearGradient id="evoGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={BLUE} stopOpacity={0.25} />
                          <stop offset="100%" stopColor={BLUE} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.01 }}
                  className="rounded-2xl p-6 premium-card"
                >
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${BLUE}10` }}>
                      <Users size={14} style={{ color: BLUE }} />
                    </div>
                    <span className="text-xs font-bold tracking-wide" style={{ color: '#1A1A1E' }}>DISTRIBUCIÓN POR SEXO</span>
                  </div>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={[
                        { name: 'Masculino', value: 491, color: '#1270B7' },
                        { name: 'Femenino', value: 356, color: '#FF6B8A' },
                      ]} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={4}>
                        <Cell fill="#1270B7" />
                        <Cell fill="#FF6B8A" />
                      </Pie>
                      <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-6 mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: '#1270B7' }} />
                      <span className="text-[10px] font-medium" style={{ color: 'rgba(0,0,0,0.5)' }}>Masculino 58%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: '#FF6B8A' }} />
                      <span className="text-[10px] font-medium" style={{ color: 'rgba(0,0,0,0.5)' }}>Femenino 42%</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  whileHover={{ scale: 1.01 }}
                  className="rounded-2xl p-6 premium-card"
                >
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${BLUE}10` }}>
                      <Activity size={14} style={{ color: BLUE }} />
                    </div>
                    <span className="text-xs font-bold tracking-wide" style={{ color: '#1A1A1E' }}>ACTIVOS VS INACTIVOS</span>
                  </div>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={[
                        { name: 'Activos', value: 623, color: '#30D158' },
                        { name: 'Inactivos', value: 224, color: '#F43843' },
                      ]} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={4}>
                        <Cell fill="#30D158" />
                        <Cell fill="#F43843" />
                      </Pie>
                      <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-6 mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: '#30D158' }} />
                      <span className="text-[10px] font-medium" style={{ color: 'rgba(0,0,0,0.5)' }}>Activos 74%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: '#F43843' }} />
                      <span className="text-[10px] font-medium" style={{ color: 'rgba(0,0,0,0.5)' }}>Inactivos 26%</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.01 }}
                  className="rounded-2xl p-6 premium-card"
                >
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${BLUE}10` }}>
                      <Users size={14} style={{ color: BLUE }} />
                    </div>
                    <span className="text-xs font-bold tracking-wide" style={{ color: '#1A1A1E' }}>DISTRIBUCIÓN POR CARGO</span>
                  </div>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={[
                      { cargo: 'Estudiante', cantidad: 720 },
                      { cargo: 'Egresado', cantidad: 85 },
                      { cargo: 'Docente', cantidad: 25 },
                      { cargo: 'Administrativo', cantidad: 17 },
                    ]} margin={{ left: 0, right: 16, top: 0, bottom: 0 }} barCategoryGap="18%">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                      <XAxis dataKey="cargo" tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }} />
                      <defs>
                        <linearGradient id="barCargoGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563EB" />
                          <stop offset="100%" stopColor="#93C5FD" />
                        </linearGradient>
                      </defs>
                      <Bar dataKey="cantidad" fill="url(#barCargoGrad)" radius={[12, 12, 0, 0]}>
                        <LabelList dataKey="cantidad" position="top" style={{ fontSize: 11, fontWeight: 700, fill: '#2563EB' }} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  whileHover={{ scale: 1.01 }}
                  className="rounded-2xl p-6 premium-card"
                >
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${BLUE}10` }}>
                      <Building2 size={14} style={{ color: BLUE }} />
                    </div>
                    <span className="text-xs font-bold tracking-wide" style={{ color: '#1A1A1E' }}>DISTRIBUCIÓN POR ÁREA</span>
                  </div>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={[
                      { area: 'Ingeniería', cantidad: 212 },
                      { area: 'Cs. Salud', cantidad: 169 },
                      { area: 'Cs. Sociales', cantidad: 152 },
                      { area: 'Arte', cantidad: 127 },
                      { area: 'Administración', cantidad: 102 },
                      { area: 'Otras', cantidad: 85 },
                    ]} margin={{ left: 0, right: 16, top: 0, bottom: 0 }} barCategoryGap="18%">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                      <XAxis dataKey="area" tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#1A1A1E', fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }} />
                      <defs>
                        <linearGradient id="barAreaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563EB" />
                          <stop offset="100%" stopColor="#93C5FD" />
                        </linearGradient>
                      </defs>
                      <Bar dataKey="cantidad" fill="url(#barAreaGrad)" radius={[12, 12, 0, 0]}>
                        <LabelList dataKey="cantidad" position="top" style={{ fontSize: 11, fontWeight: 700, fill: '#2563EB' }} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>
            </>
          )}

        </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
