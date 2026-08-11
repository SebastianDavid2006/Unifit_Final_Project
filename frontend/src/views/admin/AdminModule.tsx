import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Users, Shield, Plus, Pencil, Trash2, X, Check, Search,
  UserPlus, CreditCard, Clock, Bell, AlertTriangle, FileText,
  Download, ChevronRight, ChevronLeft, Eye,
} from 'lucide-react'

const BLUE = '#1270B7'
const RED = '#F43843'
const GREEN = '#22C55E'
const BLUE_GRAD = 'linear-gradient(135deg, #1270B7 0%, #0E5D9E 100%)'

interface Trainer {
  id: number
  name: string
  email: string
  phone: string
  speciality: string
  status: 'active' | 'inactive'
  studentsCount: number
  joinedAt: string
}

interface Plan {
  id: number
  name: string
  price: string
  duration: string
  features: string[]
  color: string
}

interface AuditEntry {
  id: number
  action: string
  user: string
  target: string
  date: string
  type: 'create' | 'update' | 'delete' | 'warning'
}

const initialTrainers: Trainer[] = [
  { id: 1, name: 'Carlos Mendoza', email: 'carlos@gym.com', phone: '+1 555-0101', speciality: 'Fuerza y Potencia', status: 'active', studentsCount: 24, joinedAt: '2024-01-15' },
  { id: 2, name: 'Ana López', email: 'ana@gym.com', phone: '+1 555-0102', speciality: 'Cardio y Resistencia', status: 'active', studentsCount: 18, joinedAt: '2024-02-01' },
  { id: 3, name: 'Pedro Ramírez', email: 'pedro@gym.com', phone: '+1 555-0103', speciality: 'CrossFit Funcional', status: 'active', studentsCount: 31, joinedAt: '2024-03-10' },
  { id: 4, name: 'María Torres', email: 'maria@gym.com', phone: '+1 555-0104', speciality: 'Yoga y Flexibilidad', status: 'inactive', studentsCount: 12, joinedAt: '2024-04-20' },
]

const initialPlans: Plan[] = [
  { id: 1, name: 'Básico', price: '$200/mes', duration: 'Mensual', features: ['Acceso a máquinas', '2 clases grupales/semana', 'Lockers'], color: BLUE },
  { id: 2, name: 'Premium', price: '$350/mes', duration: 'Mensual', features: ['Acceso ilimitado', 'Clases grupales ilimitadas', 'Nutricionista', 'Lockers + Toalla'], color: '#F1C827' },
  { id: 3, name: 'VIP', price: '$500/mes', duration: 'Mensual', features: ['Todo incluido', 'Entrenador personal', 'Spa + Sauna', 'Acceso 24/7', 'Estacionamiento'], color: RED },
]

const initialAudit: AuditEntry[] = [
  { id: 1, action: 'Creó entrenador', user: 'Admin', target: 'Carlos Mendoza', date: 'Hace 2 horas', type: 'create' },
  { id: 2, action: 'Actualizó plan', user: 'Admin', target: 'Plan Premium', date: 'Hace 5 horas', type: 'update' },
  { id: 3, action: 'Desactivó estudiante', user: 'Admin', target: 'Juan Pérez', date: 'Hace 1 día', type: 'warning' },
  { id: 4, action: 'Eliminó plan', user: 'Admin', target: 'Plan Estudiante', date: 'Hace 2 días', type: 'delete' },
  { id: 5, action: 'Registró nuevo pago', user: 'Admin', target: 'María García', date: 'Hace 3 días', type: 'create' },
]

const specialities = ['Fuerza y Potencia', 'Cardio y Resistencia', 'CrossFit Funcional', 'Yoga y Flexibilidad', 'Nutrición Deportiva', 'Fisioterapia']

export default function AdminModule() {
  const [tab, setTab] = useState<'trainers' | 'plans' | 'audit'>('trainers')
  const [trainers, setTrainers] = useState(initialTrainers)
  const [plans, setPlans] = useState(initialPlans)
  const [audit] = useState(initialAudit)
  const [search, setSearch] = useState('')
  const [showTrainerModal, setShowTrainerModal] = useState(false)
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null)
  const [trainerForm, setTrainerForm] = useState({ name: '', email: '', phone: '', speciality: '', status: 'active' as 'active' | 'inactive' })
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [planForm, setPlanForm] = useState({ name: '', price: '', duration: '', features: '' })

  function resetTrainerForm() {
    setTrainerForm({ name: '', email: '', phone: '', speciality: specialities[0] || '', status: 'active' })
  }

  function openNewTrainer() {
    setEditingTrainer(null)
    resetTrainerForm()
    setShowTrainerModal(true)
  }

  function openEditTrainer(t: Trainer) {
    setEditingTrainer(t)
    setTrainerForm({ name: t.name, email: t.email, phone: t.phone, speciality: t.speciality, status: t.status })
    setShowTrainerModal(true)
  }

  function saveTrainer() {
    if (!trainerForm.name.trim() || !trainerForm.email.trim()) return
    if (editingTrainer) {
      setTrainers(prev => prev.map(t =>
        t.id === editingTrainer.id ? { ...t, ...trainerForm } : t
      ))
    } else {
      setTrainers(prev => [...prev, {
        id: Math.max(0, ...prev.map(t => t.id)) + 1,
        ...trainerForm,
        studentsCount: 0,
        joinedAt: new Date().toISOString().split('T')[0],
      }])
    }
    setShowTrainerModal(false)
  }

  function deleteTrainer(id: number) {
    setTrainers(prev => prev.filter(t => t.id !== id))
  }

  function resetPlanForm() {
    setPlanForm({ name: '', price: '', duration: 'Mensual', features: '' })
  }

  function savePlan() {
    if (!planForm.name.trim() || !planForm.price.trim()) return
    setPlans(prev => [...prev, {
      id: Math.max(0, ...prev.map(p => p.id)) + 1,
      name: planForm.name.trim(),
      price: planForm.price.trim(),
      duration: planForm.duration,
      features: planForm.features.split(',').map(f => f.trim()).filter(Boolean),
      color: [BLUE, '#F1C827', RED, GREEN][prev.length % 4],
    }])
    setShowPlanModal(false)
  }

  function deletePlan(id: number) {
    setPlans(prev => prev.filter(p => p.id !== id))
  }

  const filteredTrainers = trainers.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.speciality.toLowerCase().includes(search.toLowerCase())
  )

  function TabButton({ id, label, icon: Icon }: { id: typeof tab; label: string; icon: typeof Users }) {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setTab(id)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
        style={{
          background: tab === id ? `${BLUE}10` : 'rgba(0,0,0,0.02)',
          color: tab === id ? BLUE : 'rgba(0,0,0,0.4)',
          border: `1px solid ${tab === id ? `${BLUE}25` : 'rgba(0,0,0,0.04)'}`,
        }}
      >
        <Icon size={15} />
        {label}
      </motion.button>
    )
  }

  return (
    <div className="size-full p-8 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${BLUE}12` }}>
          <Shield size={20} style={{ color: BLUE }} />
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#1A1A1E' }}>Panel de Administración</h1>
          <p className="text-xs" style={{ color: 'rgba(0,0,0,0.35)' }}>Gestión avanzada del sistema</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6">
        <TabButton id="trainers" label="Personal" icon={UserPlus} />
        <TabButton id="plans" label="Planes" icon={CreditCard} />
        <TabButton id="audit" label="Auditoría" icon={Clock} />
      </div>

      {tab === 'trainers' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="relative flex-1 max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(0,0,0,0.2)' }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar entrenador..."
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs font-medium outline-none"
                style={{ background: 'rgba(0,0,0,0.03)', color: '#1A1A1E', border: '1px solid transparent' }}
                onFocus={e => { e.target.style.borderColor = BLUE; e.target.style.background = 'rgba(18,112,183,0.04)' }}
                onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.background = 'rgba(0,0,0,0.03)' }}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={openNewTrainer}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white"
              style={{ background: BLUE_GRAD }}
            >
              <Plus size={14} /> Nuevo Entrenador
            </motion.button>
          </div>

          <div className="grid gap-3">
            {filteredTrainers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm" style={{ color: 'rgba(0,0,0,0.3)' }}>No se encontraron entrenadores</p>
              </div>
            ) : filteredTrainers.map(t => (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl px-5 py-4 flex items-center gap-4"
                style={{
                  background: 'rgba(255,255,255,0.5)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.4)',
                }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${BLUE}10` }}>
                  <Users size={18} style={{ color: BLUE }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm" style={{ color: '#1A1A1E' }}>{t.name}</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{
                      background: t.status === 'active' ? `${GREEN}15` : `${RED}12`,
                      color: t.status === 'active' ? GREEN : RED,
                    }}>
                      {t.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <p className="text-[11px] mt-0.5" style={{ color: 'rgba(0,0,0,0.35)' }}>{t.speciality} · {t.email}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'rgba(0,0,0,0.25)' }}>
                    {t.studentsCount} estudiantes · Desde {t.joinedAt}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <motion.button
                    whileHover={{ scale: 1.1, color: BLUE }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => openEditTrainer(t)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ color: 'rgba(0,0,0,0.25)' }}
                  >
                    <Pencil size={14} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, color: RED }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteTrainer(t.id)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ color: 'rgba(0,0,0,0.25)' }}
                  >
                    <Trash2 size={14} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {tab === 'plans' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs" style={{ color: 'rgba(0,0,0,0.35)' }}>Planes de membresía activos ({plans.length})</p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { resetPlanForm(); setShowPlanModal(true) }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white"
              style={{ background: BLUE_GRAD }}
            >
              <Plus size={14} /> Nuevo Plan
            </motion.button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {plans.map(p => {
              const planColor = p.color
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl p-6 relative overflow-hidden"
                  style={{
                    background: 'rgba(255,255,255,0.5)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.4)',
                  }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-[0.06] pointer-events-none" style={{ background: `radial-gradient(circle, ${planColor}, transparent 60%)`, transform: 'translate(30%, -30%)' }} />
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: `${planColor}15`, color: planColor }}>{p.duration}</span>
                    <div className="flex items-center gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1, color: RED }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deletePlan(p.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ color: 'rgba(0,0,0,0.2)' }}
                      >
                        <Trash2 size={13} />
                      </motion.button>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold" style={{ color: '#1A1A1E' }}>{p.name}</h3>
                  <p className="text-2xl font-bold mt-1 mb-4" style={{ color: planColor }}>{p.price}</p>
                  <div className="space-y-1.5">
                    {p.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check size={11} style={{ color: GREEN }} />
                        <span className="text-[11px]" style={{ color: 'rgba(0,0,0,0.5)' }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {tab === 'audit' && (
        <div>
          <p className="text-xs mb-4" style={{ color: 'rgba(0,0,0,0.35)' }}>Actividad reciente del sistema</p>
          <div className="space-y-2">
            {audit.map(entry => {
              const entryColor = entry.type === 'create' ? GREEN : entry.type === 'update' ? BLUE : entry.type === 'delete' ? RED : '#F1C827'
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl px-5 py-3 flex items-center gap-4"
                  style={{
                    background: 'rgba(255,255,255,0.5)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.4)',
                  }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${entryColor}12` }}>
                    {entry.type === 'create' ? <Plus size={14} style={{ color: entryColor }} /> :
                     entry.type === 'delete' ? <Trash2 size={14} style={{ color: entryColor }} /> :
                     entry.type === 'warning' ? <AlertTriangle size={14} style={{ color: entryColor }} /> :
                     <Pencil size={14} style={{ color: entryColor }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium" style={{ color: '#1A1A1E' }}>
                      {entry.action} <span style={{ color: entryColor }}>{entry.target}</span>
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'rgba(0,0,0,0.3)' }}>
                      por {entry.user} · {entry.date}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* Trainer Modal */}
      <AnimatePresence>
        {showTrainerModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowTrainerModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              className="rounded-3xl w-full max-w-md mx-4 overflow-hidden"
              style={{
                background: '#FFFFFF',
                border: '1px solid rgba(0,0,0,0.04)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.12)',
              }}
            >
              <div className="flex items-center justify-between p-5 pb-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                <h2 className="text-base font-bold" style={{ color: '#1A1A1E' }}>
                  {editingTrainer ? 'Editar Entrenador' : 'Nuevo Entrenador'}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.15, color: RED, background: 'rgba(244,56,67,0.1)' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowTrainerModal(false)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.3)' }}
                >
                  <X size={15} />
                </motion.button>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold" style={{ color: 'rgba(0,0,0,0.5)' }}>Nombre <span style={{ color: RED }}>*</span></label>
                    <input
                      value={trainerForm.name}
                      onChange={e => setTrainerForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Nombre completo"
                      className="px-3 py-2 rounded-xl text-xs font-medium outline-none"
                      style={{ background: 'rgba(0,0,0,0.03)', color: '#1A1A1E', border: '1px solid transparent' }}
                      onFocus={e => { e.target.style.borderColor = BLUE; e.target.style.background = `${BLUE}04`; e.target.style.boxShadow = `0 0 0 3px ${BLUE}14` }}
                      onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.background = 'rgba(0,0,0,0.03)'; e.target.style.boxShadow = 'none' }}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold" style={{ color: 'rgba(0,0,0,0.5)' }}>Email <span style={{ color: RED }}>*</span></label>
                    <input
                      value={trainerForm.email}
                      onChange={e => setTrainerForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="email@ejemplo.com"
                      className="px-3 py-2 rounded-xl text-xs font-medium outline-none"
                      style={{ background: 'rgba(0,0,0,0.03)', color: '#1A1A1E', border: '1px solid transparent' }}
                      onFocus={e => { e.target.style.borderColor = BLUE; e.target.style.background = `${BLUE}04`; e.target.style.boxShadow = `0 0 0 3px ${BLUE}14` }}
                      onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.background = 'rgba(0,0,0,0.03)'; e.target.style.boxShadow = 'none' }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold" style={{ color: 'rgba(0,0,0,0.5)' }}>Teléfono</label>
                    <input
                      value={trainerForm.phone}
                      onChange={e => setTrainerForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="+1 555-0000"
                      className="px-3 py-2 rounded-xl text-xs font-medium outline-none"
                      style={{ background: 'rgba(0,0,0,0.03)', color: '#1A1A1E', border: '1px solid transparent' }}
                      onFocus={e => { e.target.style.borderColor = BLUE; e.target.style.background = `${BLUE}04`; e.target.style.boxShadow = `0 0 0 3px ${BLUE}14` }}
                      onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.background = 'rgba(0,0,0,0.03)'; e.target.style.boxShadow = 'none' }}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold" style={{ color: 'rgba(0,0,0,0.5)' }}>Especialidad</label>
                    <select
                      value={trainerForm.speciality}
                      onChange={e => setTrainerForm(f => ({ ...f, speciality: e.target.value }))}
                      className="px-3 py-2 rounded-xl text-xs font-medium outline-none"
                      style={{ background: 'rgba(0,0,0,0.03)', color: '#1A1A1E', border: '1px solid transparent' }}
                    >
                      {specialities.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.5)' }}>Estado</label>
                  <div className="flex gap-2">
                    {(['active', 'inactive'] as const).map(s => (
                      <motion.button
                        key={s}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setTrainerForm(f => ({ ...f, status: s }))}
                        className="flex-1 py-2 rounded-xl text-xs font-bold"
                        style={{
                          background: trainerForm.status === s ? `${s === 'active' ? GREEN : RED}15` : 'rgba(0,0,0,0.03)',
                          color: trainerForm.status === s ? (s === 'active' ? GREEN : RED) : 'rgba(0,0,0,0.25)',
                          border: `1px solid ${trainerForm.status === s ? `${s === 'active' ? GREEN : RED}30` : 'rgba(0,0,0,0.06)'}`,
                        }}
                      >
                        {s === 'active' ? 'Activo' : 'Inactivo'}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end p-5 pt-3" style={{ borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={saveTrainer}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white"
                  style={{
                    background: (!trainerForm.name.trim() || !trainerForm.email.trim()) ? 'rgba(0,0,0,0.15)' : BLUE_GRAD,
                    cursor: (!trainerForm.name.trim() || !trainerForm.email.trim()) ? 'not-allowed' : 'pointer',
                  }}
                >
                  {editingTrainer ? 'Guardar Cambios' : 'Crear Entrenador'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Plan Modal */}
      <AnimatePresence>
        {showPlanModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowPlanModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              className="rounded-3xl w-full max-w-md mx-4 overflow-hidden"
              style={{
                background: '#FFFFFF',
                border: '1px solid rgba(0,0,0,0.04)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.12)',
              }}
            >
              <div className="flex items-center justify-between p-5 pb-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                <h2 className="text-base font-bold" style={{ color: '#1A1A1E' }}>Nuevo Plan</h2>
                <motion.button
                  whileHover={{ scale: 1.15, color: RED, background: 'rgba(244,56,67,0.1)' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowPlanModal(false)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.3)' }}
                >
                  <X size={15} />
                </motion.button>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold" style={{ color: 'rgba(0,0,0,0.5)' }}>Nombre <span style={{ color: RED }}>*</span></label>
                    <input
                      value={planForm.name}
                      onChange={e => setPlanForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Ej: Premium Plus"
                      className="px-3 py-2 rounded-xl text-xs font-medium outline-none"
                      style={{ background: 'rgba(0,0,0,0.03)', color: '#1A1A1E', border: '1px solid transparent' }}
                      onFocus={e => { e.target.style.borderColor = BLUE; e.target.style.background = `${BLUE}04`; e.target.style.boxShadow = `0 0 0 3px ${BLUE}14` }}
                      onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.background = 'rgba(0,0,0,0.03)'; e.target.style.boxShadow = 'none' }}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold" style={{ color: 'rgba(0,0,0,0.5)' }}>Precio <span style={{ color: RED }}>*</span></label>
                    <input
                      value={planForm.price}
                      onChange={e => setPlanForm(f => ({ ...f, price: e.target.value }))}
                      placeholder="Ej: $300/mes"
                      className="px-3 py-2 rounded-xl text-xs font-medium outline-none"
                      style={{ background: 'rgba(0,0,0,0.03)', color: '#1A1A1E', border: '1px solid transparent' }}
                      onFocus={e => { e.target.style.borderColor = BLUE; e.target.style.background = `${BLUE}04`; e.target.style.boxShadow = `0 0 0 3px ${BLUE}14` }}
                      onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.background = 'rgba(0,0,0,0.03)'; e.target.style.boxShadow = 'none' }}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold" style={{ color: 'rgba(0,0,0,0.5)' }}>Duración</label>
                  <div className="flex gap-2">
                    {['Mensual', 'Trimestral', 'Semestral', 'Anual'].map(d => (
                      <motion.button
                        key={d}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setPlanForm(f => ({ ...f, duration: d }))}
                        className="flex-1 py-2 rounded-xl text-[10px] font-bold"
                        style={{
                          background: planForm.duration === d ? `${BLUE}10` : 'rgba(0,0,0,0.03)',
                          color: planForm.duration === d ? BLUE : 'rgba(0,0,0,0.3)',
                          border: `1px solid ${planForm.duration === d ? `${BLUE}25` : 'rgba(0,0,0,0.06)'}`,
                        }}
                      >
                        {d}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold" style={{ color: 'rgba(0,0,0,0.5)' }}>Características <span style={{ color: 'rgba(0,0,0,0.2)' }}>(separadas por coma)</span></label>
                  <textarea
                    value={planForm.features}
                    onChange={e => setPlanForm(f => ({ ...f, features: e.target.value }))}
                    placeholder="Ej: Acceso ilimitado, Clases grupales, Nutricionista"
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl text-xs font-medium outline-none resize-none"
                    style={{ background: 'rgba(0,0,0,0.03)', color: '#1A1A1E', border: '1px solid transparent' }}
                    onFocus={e => { e.target.style.borderColor = BLUE; e.target.style.background = `${BLUE}04`; e.target.style.boxShadow = `0 0 0 3px ${BLUE}14` }}
                    onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.background = 'rgba(0,0,0,0.03)'; e.target.style.boxShadow = 'none' }}
                  />
                </div>
              </div>
              <div className="flex justify-end p-5 pt-3" style={{ borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={savePlan}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white"
                  style={{
                    background: (!planForm.name.trim() || !planForm.price.trim()) ? 'rgba(0,0,0,0.15)' : BLUE_GRAD,
                    cursor: (!planForm.name.trim() || !planForm.price.trim()) ? 'not-allowed' : 'pointer',
                  }}
                >
                  Crear Plan
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
