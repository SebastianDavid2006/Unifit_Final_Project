import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer,
} from 'recharts'
import {
  TrendingUp, Users, Activity, Target, Award, AlertTriangle,
  Clock, BarChart2, Zap, Shield, Brain, ArrowUp, ArrowDown,
  Calendar, MapPin, Sparkles, Eye, UserPlus, FileText, ClipboardList,
  Search, Plus, Trash2, Edit, MoreHorizontal, CheckCircle, X, Download,
  ChevronRight, ChevronLeft, Bell, Settings, Lock, Globe, BookOpen,
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
  { id: 1, name: 'Sebastián Morales', email: 'sebas.morales@unifit.edu', phone: '+1 555-0101', speciality: 'Fuerza y Acondicionamiento', students: 24, status: 'active', avatar: 'SM', rating: 96, joinedAt: '15 Ene 2024', schedule: 'Lun-Vie 6AM-2PM', certifications: ['Certificación NSCA', 'Entrenamiento Funcional Avanzado'] },
  { id: 2, name: 'Ana Lucía Rivas', email: 'ana.rivas@unifit.edu', phone: '+1 555-0102', speciality: 'Yoga y Flexibilidad', students: 18, status: 'active', avatar: 'AR', rating: 91, joinedAt: '01 Feb 2024', schedule: 'Lun-Vie 8AM-4PM', certifications: ['RYT 500 Yoga', 'Pilotes Matwork'] },
  { id: 3, name: 'Carlos Méndez', email: 'carlos.mendez@unifit.edu', phone: '+1 555-0103', speciality: 'Cardio y Resistencia', students: 31, status: 'active', avatar: 'CM', rating: 88, joinedAt: '10 Mar 2024', schedule: 'Mar-Sáb 10AM-6PM', certifications: ['ACE Certified', 'TRX Specialist'] },
  { id: 4, name: 'María Fernanda López', email: 'maria.lopez@unifit.edu', phone: '+1 555-0104', speciality: 'Nutrición Deportiva', students: 15, status: 'inactive', avatar: 'ML', rating: 78, joinedAt: '20 Abr 2024', schedule: 'Lun-Vie 7AM-3PM', certifications: ['Nutrition Coach', 'Dietética Deportiva'] },
  { id: 5, name: 'Roberto Jiménez', email: 'roberto.j@unifit.edu', phone: '+1 555-0105', speciality: 'Rehabilitación Física', students: 12, status: 'active', avatar: 'RJ', rating: 85, joinedAt: '05 May 2024', schedule: 'Lun-Jue 9AM-5PM', certifications: ['Fisioterapia Deportiva', 'Kinesiología'] },
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

export default function AdminSettings({ activeTab }: { activeTab: string }) {
  const [selectedTrainer, setSelectedTrainer] = useState<typeof initialTrainers[0] | null>(null)

  const [trainers, setTrainers] = useState(initialTrainers)
  const [trainerSearch, setTrainerSearch] = useState('')

  const [documents, setDocuments] = useState(initialDocuments)
  const [docSearch, setDocSearch] = useState('')

  return (
    <div className="size-full overflow-y-auto relative" style={{ minHeight: 0 }}>
      <div className="p-8 space-y-6">

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'general' && (
              <>
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

            {activeTab === 'config' && (
              <div className="rounded-2xl p-8" style={cardStyle}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${BLUE}10`, border: `1px solid ${BLUE}15` }}>
                    <Settings size={22} style={{ color: BLUE }} />
                  </div>
                  <div>
                    <h3 className="text-[#1D1D1F] text-lg font-bold">Configuración del Gimnasio</h3>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.35)' }}>Información general y preferencias del sistema</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: 'Nombre del Gimnasio', value: 'UNIFIT Gym', placeholder: 'Ej: UNIFIT Gym' },
                    { label: 'Dirección', value: 'Av. Universidad 123, Edificio Deportivo', placeholder: 'Dirección del gimnasio' },
                    { label: 'Teléfono', value: '+1 555-000-1234', placeholder: 'Teléfono de contacto' },
                    { label: 'Correo Electrónico', value: 'contacto@unifit.edu', placeholder: 'Correo electrónico' },
                    { label: 'Horario Apertura', value: '6:00 AM', placeholder: 'Hora de apertura' },
                    { label: 'Horario Cierre', value: '10:00 PM', placeholder: 'Hora de cierre' },
                  ].map((field, i) => (
                    <div key={field.label}>
                      <label className="block text-xs font-bold mb-1.5" style={{ color: 'rgba(0,0,0,0.4)' }}>{field.label.toUpperCase()}</label>
                      <input
                        defaultValue={field.value}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none"
                        style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: '#1D1D1F' }}
                        onFocus={e => { e.target.style.borderColor = BLUE; e.target.style.background = `${BLUE}04` }}
                        onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.06)'; e.target.style.background = 'rgba(0,0,0,0.03)' }}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <label className="block text-xs font-bold mb-1.5" style={{ color: 'rgba(0,0,0,0.4)' }}>DESCRIPCIÓN</label>
                  <textarea
                    defaultValue="Gimnasio universitario con instalaciones de primer nivel para el desarrollo físico y deportivo de los estudiantes."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none resize-none"
                    style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: '#1D1D1F' }}
                    onFocus={e => { e.target.style.borderColor = BLUE; e.target.style.background = `${BLUE}04` }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.06)'; e.target.style.background = 'rgba(0,0,0,0.03)' }}
                  />
                </div>
                <div className="flex justify-end mt-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-3 rounded-xl text-sm font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #007AFF, #0055CC)', boxShadow: '0 4px 16px rgba(0,122,255,0.2)' }}
                  >
                    Guardar Cambios
                  </motion.button>
                </div>
              </div>
            )}

            {activeTab === 'roles' && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${YELLOW}10`, border: `1px solid ${YELLOW}15` }}>
                    <Lock size={22} style={{ color: YELLOW }} />
                  </div>
                  <div>
                    <h3 className="text-[#1D1D1F] text-lg font-bold">Roles y Permisos</h3>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.35)' }}>Administración de roles y permisos del sistema</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    {
                      role: 'Administrador', icon: Shield, users: 3, color: RED,
                      permissions: ['Dashboard', 'Configuración', 'Roles', 'Entrenadores', 'Documentación', 'Auditoría'],
                    },
                    {
                      role: 'Entrenador', icon: Users, users: 12, color: BLUE,
                      permissions: ['Dashboard', 'Estudiantes', 'Máquinas', 'Agenda', 'Estadísticas', 'Valoraciones'],
                    },
                    {
                      role: 'Estudiante', icon: BookOpen, users: 156, color: '#30D158',
                      permissions: ['Perfil', 'Progreso', 'Rutinas', 'Agenda Personal'],
                    },
                  ].map((r, i) => (
                    <motion.div
                      key={r.role}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="rounded-2xl p-6"
                      style={cardStyle}
                    >
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${r.color}10`, border: `1px solid ${r.color}15` }}>
                          <r.icon size={20} style={{ color: r.color }} />
                        </div>
                        <div>
                          <h4 className="text-[#1D1D1F] font-bold text-sm">{r.role}</h4>
                          <p className="text-[11px]" style={{ color: 'rgba(0,0,0,0.3)' }}>{r.users} usuarios</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {r.permissions.map(p => (
                          <div key={p} className="flex items-center justify-between py-2 px-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.02)' }}>
                            <span className="text-xs font-medium" style={{ color: 'rgba(0,0,0,0.5)' }}>{p}</span>
                            <div className="w-8 h-4 rounded-full relative cursor-pointer" style={{ background: `${r.color}30`, transition: 'background 0.2s' }}>
                              <div className="w-3.5 h-3.5 rounded-full absolute top-0.5 right-0.5" style={{ background: r.color, boxShadow: `0 1px 4px ${r.color}40` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'trainers' && !selectedTrainer && (
              <div className="space-y-4">
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
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold"
                      style={{ background: 'linear-gradient(135deg, #E63946, #CC0033)', color: 'white', boxShadow: '0 4px 16px rgba(230,57,70,0.2)' }}
                    >
                      <Plus size={15} /><span>Nuevo Entrenador</span>
                    </motion.button>
                  </div>
                </div>

                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-2 mb-3">
                  {['Nombre', 'Especialidad', 'Estudiantes', 'Estado', ''].map((h, i) => (
                    <p key={i} className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: 'rgba(0,0,0,0.25)' }}>{h}</p>
                  ))}
                </div>

                <div className="space-y-2">
                  {trainers.filter(t => t.name.toLowerCase().includes(trainerSearch.toLowerCase())).map((t, i) => (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => setSelectedTrainer(t)}
                      whileHover={{ y: -2, scale: 1.002, background: 'rgba(255,255,255,0.8)' }}
                      className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] items-center gap-4 p-4 rounded-2xl cursor-pointer"
                      style={cardStyle}
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
            )}

            {activeTab === 'trainers' && selectedTrainer && (
              <div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedTrainer(null)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(16px) saturate(1.5)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}
                >
                  <ChevronLeft size={18} style={{ color: 'rgba(0,0,0,0.35)' }} />
                </motion.button>

                <div className="grid gap-2 items-start" style={{ gridTemplateColumns: '1fr 2fr 1fr', gridTemplateRows: 'auto auto auto' }}>
                  {/* Left — Información General */}
                  <div className="rounded-[28px] p-5 transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg cursor-default" style={{ gridColumn: '1', gridRow: '1', background: 'rgba(255,255,255,0.5)' }}>
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

                  {/* Center — Avatar + Name */}
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

                  {/* Right — Rendimiento */}
                  <div className="rounded-[28px] p-5 transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg cursor-default" style={{ gridColumn: '3', gridRow: '1', background: 'rgba(255,255,255,0.5)' }}>
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

                  {/* Left — Contacto */}
                  <div className="rounded-[28px] p-5 transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg cursor-default" style={{ gridColumn: '1', gridRow: '2', background: 'rgba(255,255,255,0.5)' }}>
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

                  {/* Right — Estadísticas */}
                  <div className="rounded-[28px] p-5 transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg cursor-default" style={{ gridColumn: '3', gridRow: '2', background: 'rgba(255,255,255,0.5)' }}>
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

                  {/* Left — Horario */}
                  <div className="rounded-[28px] p-5 transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg cursor-default" style={{ gridColumn: '1', gridRow: '3', background: 'rgba(255,255,255,0.5)' }}>
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

                  {/* Right — Certificaciones */}
                  <div className="rounded-[28px] p-5 relative overflow-hidden transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg cursor-default" style={{ gridColumn: '3', gridRow: '3', background: 'linear-gradient(135deg, rgba(255,215,0,0.08), rgba(255,185,0,0.05), rgba(255,215,0,0.08))' }}>
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
            )}

            {activeTab === 'docs' && (
              <div className="space-y-4">
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
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
