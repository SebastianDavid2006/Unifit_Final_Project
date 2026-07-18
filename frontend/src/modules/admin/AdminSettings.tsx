import { useState } from 'react'
import { motion } from 'motion/react'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer,
} from 'recharts'
import {
  TrendingUp, Users, Activity, Target, Award, AlertTriangle,
  Clock, BarChart2, Zap, Shield, Brain, ArrowUp, ArrowDown,
  Calendar, MapPin, Sparkles, Eye, UserPlus, FileText, ClipboardList,
  Search, Plus, Trash2, Edit, MoreHorizontal, CheckCircle, X, Download,
  ChevronRight, Bell,
} from 'lucide-react'

const RED = '#E63946'
const BLUE = '#007AFF'
const YELLOW = '#F5A623'

const monthlyTrend = [
  { month: 'Ene', activos: 120, nuevos: 28, abandonos: 5 },
  { month: 'Feb', activos: 138, nuevos: 24, abandonos: 6 },
  { month: 'Mar', activos: 145, nuevos: 19, abandonos: 12 },
  { month: 'Abr', activos: 149, nuevos: 22, abandonos: 18 },
  { month: 'May', activos: 156, nuevos: 31, abandonos: 24 },
]

const facultyData = [
  { faculty: 'Ingeniería', activos: 42, adherencia: 87, nps: 92 },
  { faculty: 'Medicina', activos: 38, adherencia: 73, nps: 85 },
  { faculty: 'Derecho', activos: 29, adherencia: 61, nps: 71 },
  { faculty: 'Administración', activos: 35, adherencia: 78, nps: 88 },
  { faculty: 'Arte', activos: 18, adherencia: 54, nps: 68 },
  { faculty: 'Ciencias', activos: 22, adherencia: 69, nps: 79 },
]

const occupancyByHour = [
  { hour: '6AM', mon: 35, tue: 30, wed: 28, thu: 32, fri: 25 },
  { hour: '8AM', mon: 55, tue: 60, wed: 52, thu: 58, fri: 48 },
  { hour: '10AM', mon: 40, tue: 45, wed: 42, thu: 38, fri: 35 },
  { hour: '12PM', mon: 30, tue: 28, wed: 35, thu: 32, fri: 30 },
  { hour: '2PM', mon: 25, tue: 22, wed: 28, thu: 26, fri: 24 },
  { hour: '4PM', mon: 85, tue: 90, wed: 88, thu: 92, fri: 95 },
  { hour: '6PM', mon: 95, tue: 88, wed: 92, thu: 90, fri: 85 },
  { hour: '8PM', mon: 60, tue: 55, wed: 58, thu: 52, fri: 40 },
]

const kpis = [
  { label: 'Estudiantes Activos', value: '156', change: +12, icon: Users, color: BLUE, sub: 'Este mes' },
  { label: 'Adherencia Global', value: '73%', change: +4.2, icon: Target, color: BLUE, sub: 'Promedio institucional' },
  { label: 'NPS Institucional', value: '82', change: +6, icon: Award, color: YELLOW, sub: 'Satisfacción' },
  { label: 'Tasa de Abandono', value: '8.4%', change: -2.1, icon: AlertTriangle, color: RED, sub: 'Reducción vs. mes ant.' },
  { label: 'Sesiones/Semana', value: '412', change: +28, icon: Activity, color: BLUE, sub: 'Total semanal' },
  { label: 'Ocupación Pico', value: '95%', change: +3, icon: Clock, color: YELLOW, sub: 'Viernes 6PM' },
]

const predictiveMetrics = [
  { label: 'Crecimiento proyectado (Jun)', value: '+18 estudiantes', confidence: 87, color: BLUE },
  { label: 'Riesgo de abandono masivo', value: 'Bajo (6%)', confidence: 91, color: YELLOW },
  { label: 'Necesidad de turno nocturno', value: 'Alta probabilidad', confidence: 78, color: RED },
  { label: 'Facturación proyectada', value: '$124,000 MXN', confidence: 83, color: BLUE },
]

const initialTrainers = [
  { id: 1, name: 'Sebastián Morales', email: 'sebas.morales@unifit.edu', phone: '+1 555-0101', speciality: 'Fuerza y Acondicionamiento', students: 24, status: 'active', avatar: 'SM' },
  { id: 2, name: 'Ana Lucía Rivas', email: 'ana.rivas@unifit.edu', phone: '+1 555-0102', speciality: 'Yoga y Flexibilidad', students: 18, status: 'active', avatar: 'AR' },
  { id: 3, name: 'Carlos Méndez', email: 'carlos.mendez@unifit.edu', phone: '+1 555-0103', speciality: 'Cardio y Resistencia', students: 31, status: 'active', avatar: 'CM' },
  { id: 4, name: 'María Fernanda López', email: 'maria.lopez@unifit.edu', phone: '+1 555-0104', speciality: 'Nutrición Deportiva', students: 15, status: 'inactive', avatar: 'ML' },
  { id: 5, name: 'Roberto Jiménez', email: 'roberto.j@unifit.edu', phone: '+1 555-0105', speciality: 'Rehabilitación Física', students: 12, status: 'active', avatar: 'RJ' },
]

const initialDocuments = [
  { id: 1, name: 'Reglamento Interno.pdf', type: 'PDF', size: '2.4 MB', date: '15 May 2026', category: 'Legal' },
  { id: 2, name: 'Formato de Registro.xlsx', type: 'XLSX', size: '1.1 MB', date: '12 May 2026', category: 'Administrativo' },
  { id: 3, name: 'Plan de Entrenamiento Base.docx', type: 'DOCX', size: '3.7 MB', date: '10 May 2026', category: 'Entrenamiento' },
  { id: 4, name: 'Manual de Seguridad.pdf', type: 'PDF', size: '5.2 MB', date: '8 May 2026', category: 'Legal' },
  { id: 5, name: 'Reporte Mensual Abril.pdf', type: 'PDF', size: '1.8 MB', date: '5 May 2026', category: 'Reportes' },
  { id: 6, name: 'Inventario de Equipo.xlsx', type: 'XLSX', size: '0.9 MB', date: '3 May 2026', category: 'Administrativo' },
]

const auditLogs = [
  { id: 1, user: 'Sebastián Morales', action: 'Inició sesión', module: 'Dashboard', date: 'Hoy, 7:30 AM', type: 'info' },
  { id: 2, user: 'Ana Lucía Rivas', action: 'Creó valoración física', module: 'Valoraciones', date: 'Hoy, 7:45 AM', type: 'create' },
  { id: 3, user: 'Sistema', action: 'Reporte automático generado', module: 'Estadísticas', date: 'Hoy, 6:00 AM', type: 'system' },
  { id: 4, user: 'Carlos Méndez', action: 'Modificó rutina HIIT', module: 'Rutinas', date: 'Ayer, 4:30 PM', type: 'update' },
  { id: 5, user: 'María Fernanda López', action: 'Eliminó estudiante', module: 'Estudiantes', date: 'Ayer, 3:15 PM', type: 'delete' },
  { id: 6, user: 'Roberto Jiménez', action: 'Actualizó perfil', module: 'Configuración', date: 'Ayer, 2:00 PM', type: 'update' },
  { id: 7, user: 'Sistema', action: 'Backup completado', module: 'Sistema', date: 'Ayer, 1:00 AM', type: 'system' },
  { id: 8, user: 'Ana Lucía Rivas', action: 'Inició sesión', module: 'Dashboard', date: 'Ayer, 8:00 AM', type: 'info' },
]

const cardStyle = {
  background: '#FFFFFF',
  border: '1px solid rgba(0,0,0,0.04)',
  borderRadius: 20,
  boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.03), 0 12px 32px rgba(0,0,0,0.02)',
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(0,0,0,0.06)',
      borderRadius: 12,
      padding: '10px 16px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
    }}>
      <p style={{ color: 'rgba(0,0,0,0.4)', fontSize: 11, marginBottom: 4 }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || '#1D1D1F', fontSize: 13, fontWeight: 600 }}>
          {p.value} <span style={{ color: 'rgba(0,0,0,0.35)', fontWeight: 400 }}>{p.name}</span>
        </p>
      ))}
    </div>
  )
}

export default function AdminSettings() {
  const [activeView, setActiveView] = useState<'overview' | 'faculties' | 'occupancy' | 'predictive' | 'trainers' | 'documents' | 'audit'>('overview')

  const [trainers, setTrainers] = useState(initialTrainers)
  const [showTrainerModal, setShowTrainerModal] = useState(false)
  const [editTrainerId, setEditTrainerId] = useState<number | null>(null)
  const [trainerName, setTrainerName] = useState('')
  const [trainerEmail, setTrainerEmail] = useState('')
  const [trainerPhone, setTrainerPhone] = useState('')
  const [trainerSpeciality, setTrainerSpeciality] = useState('')
  const [trainerSearch, setTrainerSearch] = useState('')

  const [documents, setDocuments] = useState(initialDocuments)
  const [docSearch, setDocSearch] = useState('')

  return (
    <div className="size-full overflow-y-auto relative" style={{ minHeight: 0 }}>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-1 h-10 rounded-full" style={{ background: 'linear-gradient(135deg, #007AFF, #0055CC)' }} />
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1D1D1F', letterSpacing: '-0.02em', margin: 0 }}>Ajustes Administrativos</h2>
              <p style={{ fontSize: 12, margin: '2px 0 0 0', color: 'rgba(0,0,0,0.35)' }}>Gestión del sistema</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.04)' }}>
          {([
            { id: 'overview', label: 'Resumen', icon: Eye },
            { id: 'faculties', label: 'Facultades', icon: Users },
            { id: 'occupancy', label: 'Ocupación', icon: Clock },
            { id: 'predictive', label: 'Predictivo IA', icon: Brain },
            { id: 'trainers', label: 'Entrenadores', icon: UserPlus },
            { id: 'documents', label: 'Documentos', icon: FileText },
            { id: 'audit', label: 'Auditoría', icon: ClipboardList },
          ] as const).map(v => (
            <button
              key={v.id}
              onClick={() => setActiveView(v.id)}
              className="relative flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{ color: activeView === v.id ? '#FFFFFF' : 'rgba(0,0,0,0.35)' }}
            >
              {activeView === v.id && (
                <motion.div
                  layoutId="admin-settings-tab"
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: 'linear-gradient(135deg, #007AFF, #0055CC)',
                    boxShadow: '0 4px 12px rgba(0,122,255,0.2)',
                  }}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              <v.icon size={13} className="relative z-10" />
              <span className="relative z-10 font-semibold">{v.label}</span>
            </button>
          ))}
        </div>

        {activeView !== 'trainers' && activeView !== 'documents' && activeView !== 'audit' && (
          <div className="grid grid-cols-6 gap-4">
            {kpis.map((kpi, i) => (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.04 }}
                whileHover={{ y: -4 }}
                className="relative rounded-2xl p-4 overflow-hidden"
                style={cardStyle}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${kpi.color}08` }}>
                    <kpi.icon size={16} style={{ color: kpi.color }} />
                  </div>
                  <div className="flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-lg" style={{
                    background: kpi.change > 0 ? 'rgba(48,209,88,0.08)' : 'rgba(255,59,48,0.08)',
                    color: kpi.change > 0 ? '#30D158' : '#FF3B30',
                  }}>
                    {kpi.change > 0 ? <ArrowUp size={9} /> : <ArrowDown size={9} />}
                    {Math.abs(kpi.change)}
                  </div>
                </div>
                <p className="stat-value" style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1, color: '#1D1D1F' }}>{kpi.value}</p>
                <p className="text-xs mt-1 font-semibold" style={{ color: '#1D1D1F' }}>{kpi.label}</p>
                <p className="text-[10px] mt-0.5" style={{ color: 'rgba(0,0,0,0.3)' }}>{kpi.sub}</p>
              </motion.div>
            ))}
          </div>
        )}

        {activeView === 'overview' && (
          <>
            <div className="grid grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="col-span-2 rounded-2xl p-6"
                style={cardStyle}
              >
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-[#1D1D1F] text-sm font-semibold">Crecimiento Institucional</h3>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.35)' }}>Estudiantes activos, nuevos ingresos y abandonos por mes</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span style={{ color: 'rgba(0,0,0,0.4)' }}><span className="w-3 h-[2px] inline-block rounded mr-1" style={{ background: BLUE }} />Activos</span>
                    <span style={{ color: 'rgba(0,0,0,0.4)' }}><span className="w-3 h-[2px] inline-block rounded mr-1" style={{ background: '#30D158' }} />Nuevos</span>
                    <span style={{ color: 'rgba(0,0,0,0.4)' }}><span className="w-3 h-[2px] inline-block rounded mr-1" style={{ background: YELLOW }} />Abandonos</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={monthlyTrend}>
                    <defs>
                      <linearGradient id="activosGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#007AFF" stopOpacity={0.12} />
                        <stop offset="100%" stopColor="#007AFF" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="nuevosGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#30D158" stopOpacity={0.1} />
                        <stop offset="100%" stopColor="#30D158" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
                    <XAxis dataKey="month" tick={{ fill: 'rgba(0,0,0,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'rgba(0,0,0,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
                    <ReTooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="activos" stroke={RED} strokeWidth={2.5} fill="url(#activosGrad)" name="Activos" />
                    <Area type="monotone" dataKey="nuevos" stroke="#30D158" strokeWidth={1.5} fill="url(#nuevosGrad)" name="Nuevos" />
                    <Area type="monotone" dataKey="abandonos" stroke={YELLOW} strokeWidth={1.5} fill="none" strokeDasharray="4 3" name="Abandonos" />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="rounded-2xl p-6"
                style={cardStyle}
              >
                <h3 className="text-[#1D1D1F] text-sm font-semibold mb-1">Resumen Ejecutivo</h3>
                <p className="text-xs mb-5" style={{ color: 'rgba(0,0,0,0.35)' }}>Indicadores clave del mes</p>
                <div className="space-y-5">
                  {[
                    { label: 'Retención general', value: 91.6, color: BLUE },
                    { label: 'Satisfacción NPS', value: 82, color: YELLOW },
                    { label: 'Uso de instalaciones', value: 68, color: BLUE },
                    { label: 'Cobertura estudiantil', value: 45, color: RED },
                  ].map((m, i) => (
                    <div key={m.label}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-xs font-medium" style={{ color: 'rgba(0,0,0,0.45)' }}>{m.label}</span>
                        <span className="text-xs font-bold" style={{ color: '#1D1D1F' }}>{m.value}%</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.04)' }}>
                        <motion.div
                          className="h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${m.value}%` }}
                          transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                          style={{ background: m.color, boxShadow: `0 0 8px ${m.color}40` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl p-6"
              style={cardStyle}
            >
              <h3 className="text-[#1D1D1F] text-sm font-semibold mb-5">Comportamiento por Facultad</h3>
              <div className="grid grid-cols-6 gap-4">
                {facultyData.map((f, i) => (
                  <motion.div
                    key={f.faculty}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + i * 0.05 }}
                    whileHover={{ y: -4 }}
                    className="rounded-xl p-5 text-center"
                    style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}
                  >
                    <p className="text-[#1D1D1F] font-bold" style={{ fontSize: '1.6rem' }}>{f.activos}</p>
                    <p className="text-xs mt-0.5 mb-4 font-medium" style={{ color: 'rgba(0,0,0,0.4)' }}>{f.faculty}</p>
                    <div className="h-1.5 rounded-full mb-2" style={{ background: 'rgba(0,0,0,0.04)' }}>
                      <div className="h-full rounded-full" style={{ width: `${f.adherencia}%`, background: f.adherencia >= 80 ? '#30D158' : f.adherencia >= 65 ? '#FF9500' : '#FF3B30' }} />
                    </div>
                    <p className="text-xs font-bold" style={{ color: f.adherencia >= 80 ? '#30D158' : f.adherencia >= 65 ? '#FF9500' : '#FF3B30' }}>{f.adherencia}% adher.</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}

        {activeView === 'faculties' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="rounded-2xl p-6" style={cardStyle}>
              <h3 className="text-[#1D1D1F] text-sm font-semibold mb-5">Comparativa de Facultades</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={facultyData} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
                  <XAxis dataKey="faculty" tick={{ fill: 'rgba(0,0,0,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(0,0,0,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
                  <ReTooltip content={<ChartTooltip />} />
                  <Bar dataKey="activos" name="Activos" fill={BLUE} fillOpacity={0.8} radius={[6, 6, 0, 0]} />
                  <Bar dataKey="adherencia" name="Adherencia %" fill={YELLOW} fillOpacity={0.6} radius={[6, 6, 0, 0]} />
                  <Bar dataKey="nps" name="NPS" fill="#30D158" fillOpacity={0.5} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {facultyData.slice(0, 3).map((f, i) => (
                <motion.div key={f.faculty} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-2xl p-6" style={cardStyle}>
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-[#1D1D1F] font-semibold">{f.faculty}</h3>
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold" style={{ background: f.adherencia >= 80 ? 'rgba(48,209,88,0.08)' : 'rgba(255,149,0,0.08)', color: f.adherencia >= 80 ? '#30D158' : '#FF9500', border: `1px solid ${f.adherencia >= 80 ? 'rgba(48,209,88,0.15)' : 'rgba(255,149,0,0.15)'}` }}>
                      {f.adherencia >= 80 ? 'Óptimo' : 'Medio'}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {[
                      { label: 'Estudiantes activos', value: `${f.activos}` },
                      { label: 'Adherencia', value: `${f.adherencia}%` },
                      { label: 'NPS', value: `${f.nps}/100` },
                    ].map(m => (
                      <div key={m.label} className="flex justify-between py-2.5" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                        <span className="text-xs" style={{ color: 'rgba(0,0,0,0.4)' }}>{m.label}</span>
                        <span className="text-xs font-bold" style={{ color: '#1D1D1F' }}>{m.value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeView === 'occupancy' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="rounded-2xl p-6" style={cardStyle}>
              <h3 className="text-[#1D1D1F] text-sm font-semibold mb-1">Heatmap de Ocupación — Esta semana</h3>
              <p className="text-xs mb-6" style={{ color: 'rgba(0,0,0,0.35)' }}>Porcentaje de ocupación por hora y día</p>
              <div className="grid grid-cols-6 gap-2.5">
                <div />
                {['Lun', 'Mar', 'Mié', 'Jue', 'Vie'].map(d => (
                  <p key={d} className="text-center text-xs font-semibold" style={{ color: 'rgba(0,0,0,0.4)' }}>{d}</p>
                ))}
                {occupancyByHour.map(row => (
                  <>
                    <p key={`label-${row.hour}`} className="text-xs flex items-center font-medium" style={{ color: 'rgba(0,0,0,0.35)' }}>{row.hour}</p>
                    {[row.mon, row.tue, row.wed, row.thu, row.fri].map((val, ci) => {
                      const color = val >= 85 ? RED : val >= 60 ? YELLOW : val >= 35 ? '#FFD60A' : '#30D158'
                      return (
                        <motion.div
                          key={`${row.hour}-${ci}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 + ci * 0.03 }}
                          whileHover={{ scale: 1.05 }}
                          className="rounded-xl flex items-center justify-center text-xs font-bold"
                          style={{ height: 40, background: `${color}12`, border: `1px solid ${color}20`, color: val >= 60 ? color : 'rgba(0,0,0,0.3)' }}
                        >
                          {val}%
                        </motion.div>
                      )
                    })}
                  </>
                ))}
              </div>
              <div className="flex items-center gap-6 mt-6">
                {[
                  { label: '< 35%', color: '#30D158' },
                  { label: '35–60%', color: '#FFD60A' },
                  { label: '60–85%', color: YELLOW },
                  { label: '> 85%', color: RED },
                ].map(l => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded" style={{ background: `${l.color}15`, border: `1px solid ${l.color}30` }} />
                    <span className="text-xs" style={{ color: 'rgba(0,0,0,0.4)' }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl p-6" style={cardStyle}>
              <h3 className="text-[#1D1D1F] text-sm font-semibold mb-5">Asistencia Promedio por Hora</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={occupancyByHour}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
                  <XAxis dataKey="hour" tick={{ fill: 'rgba(0,0,0,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(0,0,0,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
                  <ReTooltip content={<ChartTooltip />} />
                  <Bar dataKey="mon" name="Lunes" fill={RED} fillOpacity={0.7} radius={[6, 6, 0, 0]} />
                  <Bar dataKey="fri" name="Viernes" fill="#FF6B8A" fillOpacity={0.6} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {activeView === 'predictive' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="rounded-2xl p-8" style={{
              background: 'linear-gradient(145deg, rgba(230,57,70,0.03), rgba(255,255,255,0.3))',
              border: '1px solid rgba(230,57,70,0.08)',
            }}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(230,57,70,0.12), rgba(204,0,51,0.08))', border: '1px solid rgba(230,57,70,0.1)' }}>
                  <Brain size={22} style={{ color: RED }} />
                </div>
                <div>
                  <h3 className="text-[#1D1D1F] font-semibold">Métricas Predictivas IA</h3>
                  <p className="text-xs" style={{ color: 'rgba(0,0,0,0.35)' }}>Modelo entrenado con datos históricos · Actualizado hoy</p>
                </div>
                <div className="ml-auto flex items-center gap-2.5 px-4 py-2 rounded-xl" style={{ background: 'rgba(48,209,88,0.06)', border: '1px solid rgba(48,209,88,0.1)' }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: '#30D158' }} />
                  <span className="text-xs font-semibold" style={{ color: '#30D158' }}>Modelo activo</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {predictiveMetrics.map((m, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} whileHover={{ y: -4 }} className="rounded-2xl p-6" style={cardStyle}>
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-xs font-medium" style={{ color: 'rgba(0,0,0,0.45)' }}>{m.label}</p>
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold" style={{ background: `${m.color}10`, color: m.color, border: `1px solid ${m.color}15` }}>{m.confidence}% conf.</span>
                    </div>
                    <p className="stat-value" style={{ color: m.color, fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>{m.value}</p>
                    <div className="h-1.5 rounded-full mt-4" style={{ background: 'rgba(0,0,0,0.04)' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${m.confidence}%` }} transition={{ duration: 1.2, delay: 0.5 + i * 0.1, ease: [0.16, 1, 0.3, 1] }} className="h-full rounded-full" style={{ background: m.color, boxShadow: `0 0 8px ${m.color}40` }} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl p-6" style={cardStyle}>
              <h3 className="text-[#1D1D1F] text-sm font-semibold mb-5">Proyección de Crecimiento — Próximos 3 meses</h3>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={[...monthlyTrend, { month: 'Jun', activos: 174, nuevos: 31, abandonos: 13 }, { month: 'Jul', activos: 192, nuevos: 28, abandonos: 10 }, { month: 'Ago', activos: 215, nuevos: 35, abandonos: 12 }]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
                  <XAxis dataKey="month" tick={{ fill: 'rgba(0,0,0,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(0,0,0,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} width={32} />
                  <ReTooltip content={<ChartTooltip />} />
                  <Line type="monotone" dataKey="activos" stroke={RED} strokeWidth={3} dot={{ fill: RED, r: 5, stroke: 'white', strokeWidth: 2 }} activeDot={{ r: 7, fill: RED, stroke: 'white', strokeWidth: 2 }} name="Estudiantes Activos" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {activeView === 'trainers' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[#1D1D1F] font-semibold">Gestión de Entrenadores</h3>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.35)' }}>{trainers.length} entrenadores registrados</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <Search size={14} style={{ color: 'rgba(0,0,0,0.2)' }} />
                  <input value={trainerSearch} onChange={e => setTrainerSearch(e.target.value)} placeholder="Buscar entrenador..." className="bg-transparent text-sm outline-none w-40" style={{ color: '#1D1D1F' }} />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setEditTrainerId(null)
                    setTrainerName('')
                    setTrainerEmail('')
                    setTrainerPhone('')
                    setTrainerSpeciality('')
                    setShowTrainerModal(true)
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold"
                  style={{ background: 'linear-gradient(135deg, #E63946, #CC0033)', color: 'white', boxShadow: '0 4px 16px rgba(230,57,70,0.2)' }}
                >
                  <Plus size={15} /><span>Nuevo Entrenador</span>
                </motion.button>
              </div>
            </div>

            <div className="space-y-2">
              {trainers.filter(t => t.name.toLowerCase().includes(trainerSearch.toLowerCase())).map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-4 p-4 rounded-2xl"
                  style={cardStyle}
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0" style={{ background: t.status === 'active' ? 'linear-gradient(135deg, #30D158, #20A040)' : 'linear-gradient(135deg, #8E8E93, #636366)', fontSize: 14 }}>{t.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#1D1D1F] text-sm font-bold">{t.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.3)' }}>{t.speciality} · {t.email}</p>
                  </div>
                  <div className="text-center w-20">
                    <p className="text-sm font-extrabold" style={{ color: '#1D1D1F' }}>{t.students}</p>
                    <p className="text-[10px]" style={{ color: 'rgba(0,0,0,0.25)' }}>estudiantes</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold" style={{
                    background: t.status === 'active' ? 'rgba(48,209,88,0.08)' : 'rgba(142,142,147,0.08)',
                    color: t.status === 'active' ? '#30D158' : '#8E8E93',
                    border: `1px solid ${t.status === 'active' ? 'rgba(48,209,88,0.15)' : 'rgba(142,142,147,0.15)'}`,
                  }}>
                    {t.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                  <div className="flex gap-1">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => {
                        setEditTrainerId(t.id)
                        setTrainerName(t.name)
                        setTrainerEmail(t.email)
                        setTrainerPhone(t.phone)
                        setTrainerSpeciality(t.speciality)
                        setShowTrainerModal(true)
                      }}
                      className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(0,0,0,0.03)' }}
                    >
                      <Edit size={13} style={{ color: 'rgba(0,0,0,0.25)' }} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setTrainers(prev => prev.filter(x => x.id !== t.id))}
                      className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(255,59,48,0.06)' }}
                    >
                      <Trash2 size={13} style={{ color: '#FF3B30' }} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            {showTrainerModal && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={() => setShowTrainerModal(false)}>
                <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(8px)' }} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  onClick={e => e.stopPropagation()}
                  className="relative w-full max-w-md rounded-3xl p-8"
                  style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(40px) saturate(1.4)', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 40px 100px rgba(0,0,0,0.12)' }}
                >
                  <h3 className="text-xl font-extrabold mb-2" style={{ color: '#1D1D1F' }}>{editTrainerId ? 'Editar Entrenador' : 'Nuevo Entrenador'}</h3>
                  <p className="text-sm mb-6" style={{ color: 'rgba(0,0,0,0.35)' }}>Registra un nuevo entrenador en el sistema.</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>NOMBRE COMPLETO</label>
                      <input value={trainerName} onChange={e => setTrainerName(e.target.value)} placeholder="Ej: Juan Pérez" className="w-full p-3.5 rounded-xl text-sm font-medium outline-none" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: '#1D1D1F' }} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>CORREO ELECTRÓNICO</label>
                      <input value={trainerEmail} onChange={e => setTrainerEmail(e.target.value)} placeholder="correo@unifit.edu" className="w-full p-3.5 rounded-xl text-sm font-medium outline-none" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: '#1D1D1F' }} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>TELÉFONO</label>
                      <input value={trainerPhone} onChange={e => setTrainerPhone(e.target.value)} placeholder="+1 555-0100" className="w-full p-3.5 rounded-xl text-sm font-medium outline-none" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: '#1D1D1F' }} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>ESPECIALIDAD</label>
                      <input value={trainerSpeciality} onChange={e => setTrainerSpeciality(e.target.value)} placeholder="Ej: Fuerza y Acondicionamiento" className="w-full p-3.5 rounded-xl text-sm font-medium outline-none" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: '#1D1D1F' }} />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-8">
                    <motion.button whileHover={{ scale: 1.02 }} onClick={() => setShowTrainerModal(false)} className="flex-1 py-3 rounded-xl text-sm font-bold" style={{ background: 'rgba(0,0,0,0.03)', color: 'rgba(0,0,0,0.4)', border: '1px solid rgba(0,0,0,0.06)' }}>Cancelar</motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() => {
                        if (editTrainerId) {
                          setTrainers(prev => prev.map(t => t.id === editTrainerId ? { ...t, name: trainerName, email: trainerEmail, phone: trainerPhone, speciality: trainerSpeciality } : t))
                        } else {
                          const newTrainer = {
                            id: Date.now(),
                            name: trainerName,
                            email: trainerEmail,
                            phone: trainerPhone,
                            speciality: trainerSpeciality,
                            students: 0,
                            status: 'active' as const,
                            avatar: trainerName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
                          }
                          setTrainers(prev => [...prev, newTrainer])
                        }
                        setShowTrainerModal(false)
                      }}
                      className="flex-1 py-3 rounded-xl text-sm font-bold"
                      style={{ background: 'linear-gradient(135deg, #E63946, #CC0033)', color: 'white', boxShadow: '0 4px 16px rgba(230,57,70,0.2)' }}
                    >
                      <span>{editTrainerId ? 'Guardar Cambios' : 'Crear Entrenador'}</span>
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}

        {activeView === 'documents' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[#1D1D1F] font-semibold">Gestión de Documentos</h3>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.35)' }}>{documents.length} documentos registrados</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <Search size={14} style={{ color: 'rgba(0,0,0,0.2)' }} />
                  <input value={docSearch} onChange={e => setDocSearch(e.target.value)} placeholder="Buscar documento..." className="bg-transparent text-sm outline-none w-40" style={{ color: '#1D1D1F' }} />
                </div>
                <motion.button whileHover={{ scale: 1.02 }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold" style={{ background: 'linear-gradient(135deg, #E63946, #CC0033)', color: 'white', boxShadow: '0 4px 16px rgba(230,57,70,0.2)' }}>
                  <Plus size={15} /><span>Subir Documento</span>
                </motion.button>
              </div>
            </div>

            <div className="rounded-2xl p-6" style={cardStyle}>
              <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 px-2 mb-3">
                {['', 'Nombre', 'Categoría', 'Tamaño', 'Fecha', ''].map((h, i) => (
                  <p key={i} className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: 'rgba(0,0,0,0.2)' }}>{h}</p>
                ))}
              </div>
              <div className="space-y-1">
                {documents.filter(d => d.name.toLowerCase().includes(docSearch.toLowerCase())).map((d, i) => (
                  <motion.div
                    key={d.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 items-center p-3 rounded-xl"
                    style={{ borderBottom: i < documents.length - 1 ? '1px solid rgba(0,0,0,0.03)' : 'none' }}
                    whileHover={{ background: 'rgba(0,0,0,0.02)' }}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: d.type === 'PDF' ? 'rgba(230,57,70,0.08)' : d.type === 'XLSX' ? 'rgba(48,209,88,0.08)' : 'rgba(0,122,255,0.08)' }}>
                      <FileText size={16} style={{ color: d.type === 'PDF' ? RED : d.type === 'XLSX' ? '#30D158' : '#007AFF' }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#1D1D1F' }}>{d.name}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold" style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.4)' }}>{d.category}</span>
                    <span className="text-xs" style={{ color: 'rgba(0,0,0,0.3)' }}>{d.size}</span>
                    <span className="text-xs" style={{ color: 'rgba(0,0,0,0.3)' }}>{d.date}</span>
                    <motion.button whileHover={{ scale: 1.05 }} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.03)' }}>
                      <Download size={13} style={{ color: 'rgba(0,0,0,0.25)' }} />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeView === 'audit' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[#1D1D1F] font-semibold">Registro de Auditoría</h3>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.35)' }}>Actividad reciente en el sistema</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(255,149,0,0.06)', border: '1px solid rgba(255,149,0,0.1)' }}>
                <Clock size={14} style={{ color: '#FF9500' }} />
                <span className="text-xs font-medium" style={{ color: '#FF9500' }}>{auditLogs.length} eventos</span>
              </div>
            </div>

            <div className="rounded-2xl p-6" style={cardStyle}>
              <div className="space-y-1">
                {auditLogs.map((log, i) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-4 p-3.5 rounded-xl"
                    style={{ borderBottom: i < auditLogs.length - 1 ? '1px solid rgba(0,0,0,0.03)' : 'none' }}
                    whileHover={{ background: 'rgba(0,0,0,0.015)' }}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{
                      background: log.type === 'create' ? 'rgba(48,209,88,0.08)' : log.type === 'delete' ? 'rgba(255,59,48,0.08)' : log.type === 'update' ? 'rgba(0,122,255,0.08)' : log.type === 'system' ? 'rgba(142,142,147,0.08)' : 'rgba(90,200,250,0.08)',
                    }}>
                      {log.type === 'create' ? <CheckCircle size={15} style={{ color: '#30D158' }} /> :
                       log.type === 'delete' ? <Trash2 size={15} style={{ color: '#FF3B30' }} /> :
                       log.type === 'system' ? <Shield size={15} style={{ color: '#8E8E93' }} /> :
                       <Bell size={15} style={{ color: log.type === 'update' ? '#007AFF' : '#5AC8FA' }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: '#1D1D1F' }}>{log.action}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.3)' }}>
                        <strong>{log.user}</strong> · {log.module}
                      </p>
                    </div>
                    <span className="text-xs" style={{ color: 'rgba(0,0,0,0.25)' }}>{log.date}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
