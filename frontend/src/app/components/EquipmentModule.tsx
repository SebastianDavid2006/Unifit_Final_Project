import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Search, Plus, Dumbbell, Pencil, Trash2, X, Check, MoreHorizontal,
  Activity, Wrench, PowerOff, ChevronDown, ChevronRight,
} from 'lucide-react'
import machineImg from '../../assets/illustrations/objects/machine.png'

const BLUE = '#1270B7'
const GREEN = '#30D158'
const YELLOW = '#F1C827'
const RED = '#F43843'
const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #7ec8e3)'

type Status = 'active' | 'maintenance' | 'inactive'

interface Exercise {
  id: number
  name: string
}

interface Machine {
  id: number
  name: string
  zone: string
  status: Status
  exercises: Exercise[]
}

const statusConfig: Record<Status, { label: string; color: string; bg: string; border: string }> = {
  active: { label: 'Activo', color: GREEN, bg: 'rgba(48,209,88,0.08)', border: 'rgba(48,209,88,0.15)' },
  maintenance: { label: 'Mantenimiento', color: YELLOW, bg: 'rgba(241,200,39,0.08)', border: 'rgba(241,200,39,0.15)' },
  inactive: { label: 'Inactiva', color: RED, bg: 'rgba(244,56,67,0.08)', border: 'rgba(244,56,67,0.15)' },
}

const initialMachines: Machine[] = [
  { id: 1, name: 'Cinta de Correr A1', zone: 'Cardio', status: 'active', exercises: [{ id: 1, name: 'Caminata' }, { id: 2, name: 'Trote' }, { id: 3, name: 'Intervalos' }] },
  { id: 2, name: 'Rack Multipower', zone: 'Pesas Libres', status: 'active', exercises: [{ id: 4, name: 'Sentadilla' }, { id: 5, name: 'Press Hombros' }] },
  { id: 3, name: 'Bicicleta Spinning B3', zone: 'Cardio', status: 'maintenance', exercises: [{ id: 6, name: 'Ciclismo' }] },
  { id: 4, name: 'Press de Banca', zone: 'Pesas Libres', status: 'active', exercises: [{ id: 7, name: 'Press Plano' }, { id: 8, name: 'Press Inclinado' }, { id: 9, name: 'Press Declinado' }] },
  { id: 5, name: 'Elíptica C2', zone: 'Cardio', status: 'active', exercises: [{ id: 10, name: 'Caminata Elíptica' }] },
  { id: 6, name: 'Cable Crossover', zone: 'Máquinas', status: 'inactive', exercises: [{ id: 11, name: 'Cruce de Cables' }, { id: 12, name: 'Polea Alta' }] },
]

function StatusBadge({ status }: { status: Status }) {
  const cfg = statusConfig[status]
  return (
    <span
      className="px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide whitespace-nowrap"
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
    >
      {cfg.label}
    </span>
  )
}

interface Props {
  search: string
  searchFocused: boolean
  statusFilter: Status | 'all'
  onSearchChange: (v: string) => void
  onSearchFocus: (v: boolean) => void
  onStatusFilterChange: (v: Status | 'all') => void
}

export default function EquipmentModule({ search, searchFocused, statusFilter, onSearchChange, onSearchFocus, onStatusFilterChange }: Props) {
  const [machines, setMachines] = useState<Machine[]>(initialMachines)
  const [showMachineModal, setShowMachineModal] = useState(false)
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null)
  const [machineForm, setMachineForm] = useState({ name: '', zone: '', status: 'active' as Status })
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [showExerciseModal, setShowExerciseModal] = useState(false)
  const [exerciseMachine, setExerciseMachine] = useState<Machine | null>(null)
  const [exerciseName, setExerciseName] = useState('')
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null)

  const filtered = useMemo(() => {
    let list = machines
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.zone.toLowerCase().includes(q) ||
        m.exercises.some(e => e.name.toLowerCase().includes(q))
      )
    }
    if (statusFilter !== 'all') {
      list = list.filter(m => m.status === statusFilter)
    }
    return list
  }, [machines, search, statusFilter])

  let nextMachineId = useMemo(() => Math.max(...machines.map(m => m.id), 0) + 1, [machines])
  let nextExerciseId = useMemo(() => {
    const all = machines.flatMap(m => m.exercises)
    return Math.max(...all.map(e => e.id), 0) + 1
  }, [machines])

  function openAddMachine() {
    setEditingMachine(null)
    setMachineForm({ name: '', zone: '', status: 'active' })
    setShowMachineModal(true)
  }

  function openEditMachine(m: Machine) {
    setEditingMachine(m)
    setMachineForm({ name: m.name, zone: m.zone, status: m.status })
    setShowMachineModal(true)
  }

  function saveMachine() {
    if (!machineForm.name.trim() || !machineForm.zone.trim()) return
    if (editingMachine) {
      setMachines(prev => prev.map(m =>
        m.id === editingMachine.id ? { ...m, name: machineForm.name.trim(), zone: machineForm.zone.trim(), status: machineForm.status } : m
      ))
    } else {
      const newMachine: Machine = { id: nextMachineId, name: machineForm.name.trim(), zone: machineForm.zone.trim(), status: machineForm.status, exercises: [] }
      setMachines(prev => [...prev, newMachine])
    }
    setShowMachineModal(false)
  }

  function deleteMachine(id: number) {
    setMachines(prev => prev.filter(m => m.id !== id))
    if (expandedId === id) setExpandedId(null)
  }

  function changeStatus(id: number, status: Status) {
    setMachines(prev => prev.map(m => m.id === id ? { ...m, status } : m))
  }

  function openAddExercise(m: Machine) {
    setExerciseMachine(m)
    setEditingExercise(null)
    setExerciseName('')
    setShowExerciseModal(true)
  }

  function openEditExercise(m: Machine, e: Exercise) {
    setExerciseMachine(m)
    setEditingExercise(e)
    setExerciseName(e.name)
    setShowExerciseModal(true)
  }

  function saveExercise() {
    if (!exerciseName.trim() || !exerciseMachine) return
    if (editingExercise) {
      setMachines(prev => prev.map(m =>
        m.id === exerciseMachine.id
          ? { ...m, exercises: m.exercises.map(e => e.id === editingExercise.id ? { ...e, name: exerciseName.trim() } : e) }
          : m
      ))
    } else {
      const newExercise: Exercise = { id: nextExerciseId, name: exerciseName.trim() }
      setMachines(prev => prev.map(m =>
        m.id === exerciseMachine.id ? { ...m, exercises: [...m.exercises, newExercise] } : m
      ))
    }
    setShowExerciseModal(false)
  }

  function deleteExercise(machineId: number, exerciseId: number) {
    setMachines(prev => prev.map(m =>
      m.id === machineId ? { ...m, exercises: m.exercises.filter(e => e.id !== exerciseId) } : m
    ))
  }

  return (
    <div className="p-8 pt-12 max-w-[1440px] mx-auto relative">
      {/* ── Banner Card ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-3xl mb-8"
        style={{
          background: 'linear-gradient(90deg, #FFFFFF 0%, #F8FBFF 40%, rgba(248,251,255,0) 100%)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
        }}
      >
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

        {/* Machine image */}
        <div style={{ position: 'absolute', left: 20, bottom: 0, height: 160, width: 230, zIndex: 20, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', width: '90%', height: '50%', background: 'rgba(18,112,183,0.1)', filter: 'blur(30px)', borderRadius: '50%' }} />
          <img src={machineImg} alt="Máquinas" className="w-full h-full object-scale-down drop-shadow-xl relative" style={{ objectPosition: 'bottom center' }} />
        </div>

        <div className="relative z-10 p-8 flex items-center justify-between">
          <div className="flex items-center gap-6 ml-64">
            <div className="w-1 h-12 rounded-full" style={{ background: BLUE_GRAD }} />
            <div>
              <h1 style={{ color: '#1A1A1E', fontSize: '2rem', fontWeight: 800 }}>Máquinas y Equipos</h1>
              <p className="text-xs text-black/40">Registra máquinas, asigna ejercicios y controla su estado operativo.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 pr-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={openAddMachine}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold premium-btn"
            >
              <Plus size={15} /> Nueva Máquina
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Machines Grid */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.map((machine, i) => (
          <motion.div
            key={machine.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 * i, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl overflow-hidden premium-card"
            style={{
              background: 'rgba(255,255,255,0.5)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.4)',
            }}
          >
            {/* Card Top — status colores + icon */}
            <div className="px-5 pt-5 pb-3">
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${statusConfig[machine.status].color}12` }}
                >
                  <Dumbbell size={18} style={{ color: statusConfig[machine.status].color }} />
                </div>
                <StatusBadge status={machine.status} />
              </div>
              <h3 className="font-bold text-[#1A1A1E] text-base leading-tight">{machine.name}</h3>
              <p className="text-xs mt-1" style={{ color: 'rgba(0,0,0,0.35)' }}>
                {machine.zone}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.25)' }}>
                {machine.exercises.length} ejercicio{machine.exercises.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Quick Status */}
            <div className="px-5 pb-2 flex items-center gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider mr-2" style={{ color: 'rgba(0,0,0,0.2)' }}>Estado:</span>
              {(['active', 'maintenance', 'inactive'] as const).map(s => (
                <motion.button
                  key={s}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => changeStatus(machine.id, s)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{
                    background: machine.status === s ? `${statusConfig[s].color}18` : 'transparent',
                    color: machine.status === s ? statusConfig[s].color : 'rgba(0,0,0,0.12)',
                  }}
                  title={statusConfig[s].label}
                >
                  {s === 'active' ? <Activity size={13} /> : s === 'maintenance' ? <Wrench size={13} /> : <PowerOff size={13} />}
                </motion.button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 px-5 pb-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => openEditMachine(machine)}
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ color: 'rgba(0,0,0,0.25)' }}
              >
                <Pencil size={14} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1, color: RED }}
                whileTap={{ scale: 0.9 }}
                onClick={() => deleteMachine(machine.id)}
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ color: 'rgba(0,0,0,0.25)' }}
              >
                <Trash2 size={14} />
              </motion.button>
              <div className="flex-1" />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setExpandedId(expandedId === machine.id ? null : machine.id)}
                className="flex items-center gap-1.5 text-[11px] font-bold"
                style={{ color: BLUE }}
              >
                {expandedId === machine.id ? 'Ocultar' : `${machine.exercises.length} ejercicios`}
                {expandedId === machine.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </motion.button>
            </div>

            {/* Expanded Exercises */}
            <AnimatePresence>
              {expandedId === machine.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-4 pt-3">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(0,0,0,0.2)' }}>
                        Ejercicios
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => openAddExercise(machine)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold"
                        style={{
                          background: `${BLUE}10`,
                          color: BLUE,
                          border: `1px solid ${BLUE}25`,
                        }}
                      >
                        <Plus size={11} /> Añadir
                      </motion.button>
                    </div>
                    {machine.exercises.length === 0 ? (
                      <p className="text-xs py-3 text-center" style={{ color: 'rgba(0,0,0,0.2)' }}>
                        Añade ejercicios para que la IA los use en rutinas.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {machine.exercises.map(ex => (
                          <motion.div
                            key={ex.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium group"
                            style={{
                              background: 'rgba(0,0,0,0.03)',
                              border: '1px solid rgba(0,0,0,0.04)',
                              color: '#1A1A1E',
                            }}
                          >
                            <span>{ex.name}</span>
                            <button
                              onClick={() => openEditExercise(machine, ex)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              style={{ color: 'rgba(0,0,0,0.25)' }}
                            >
                              <Pencil size={10} />
                            </button>
                            <button
                              onClick={() => deleteExercise(machine.id, ex.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              style={{ color: 'rgba(0,0,0,0.2)' }}
                            >
                              <X size={10} />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 py-16 text-center">
            <p className="text-lg font-bold" style={{ color: 'rgba(0,0,0,0.2)' }}>No se encontraron máquinas</p>
            <p className="text-sm mt-1" style={{ color: 'rgba(0,0,0,0.15)' }}>Prueba con otros filtros o agrega una nueva máquina</p>
          </div>
        )}
      </div>

      {/* Machine Modal */}
      <AnimatePresence>
        {showMachineModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowMachineModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl p-6"
              style={{
                background: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(40px)',
                border: '1px solid rgba(255,255,255,0.5)',
                boxShadow: '0 40px 80px rgba(0,0,0,0.12)',
              }}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-extrabold" style={{ color: '#1A1A1E' }}>
                  {editingMachine ? 'Editar Máquina' : 'Nueva Máquina'}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowMachineModal(false)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ color: 'rgba(0,0,0,0.3)' }}
                >
                  <X size={16} />
                </motion.button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider mb-1.5 block" style={{ color: 'rgba(0,0,0,0.35)' }}>Nombre</label>
                  <input
                    value={machineForm.name}
                    onChange={e => setMachineForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Ej: Press de Banca"
                    className="w-full px-4 py-2.5 rounded-xl text-sm font-medium outline-none"
                    style={{
                      background: 'rgba(0,0,0,0.03)',
                      border: '1px solid rgba(0,0,0,0.06)',
                      color: '#1A1A1E',
                    }}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider mb-1.5 block" style={{ color: 'rgba(0,0,0,0.35)' }}>Zona</label>
                  <input
                    value={machineForm.zone}
                    onChange={e => setMachineForm(f => ({ ...f, zone: e.target.value }))}
                    placeholder="Ej: Cardio, Pesas Libres, Máquinas"
                    className="w-full px-4 py-2.5 rounded-xl text-sm font-medium outline-none"
                    style={{
                      background: 'rgba(0,0,0,0.03)',
                      border: '1px solid rgba(0,0,0,0.06)',
                      color: '#1A1A1E',
                    }}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider mb-1.5 block" style={{ color: 'rgba(0,0,0,0.35)' }}>Estado</label>
                  <div className="flex gap-2">
                    {(['active', 'maintenance', 'inactive'] as const).map(s => (
                      <motion.button
                        key={s}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setMachineForm(f => ({ ...f, status: s }))}
                        className="flex-1 py-2.5 rounded-xl text-xs font-bold"
                        style={{
                          background: machineForm.status === s ? `${statusConfig[s].color}15` : 'rgba(0,0,0,0.03)',
                          color: machineForm.status === s ? statusConfig[s].color : 'rgba(0,0,0,0.25)',
                          border: `1px solid ${machineForm.status === s ? `${statusConfig[s].color}30` : 'rgba(0,0,0,0.06)'}`,
                        }}
                      >
                        {statusConfig[s].label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowMachineModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold"
                  style={{
                    background: 'rgba(0,0,0,0.03)',
                    color: 'rgba(0,0,0,0.35)',
                    border: '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={saveMachine}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white"
                  style={{
                    background: BLUE_GRAD,
                    boxShadow: '0 4px 16px rgba(18,112,183,0.25)',
                    opacity: machineForm.name.trim() && machineForm.zone.trim() ? 1 : 0.5,
                  }}
                  disabled={!machineForm.name.trim() || !machineForm.zone.trim()}
                >
                  {editingMachine ? 'Guardar Cambios' : 'Registrar Máquina'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exercise Modal */}
      <AnimatePresence>
        {showExerciseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowExerciseModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl p-6"
              style={{
                background: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(40px)',
                border: '1px solid rgba(255,255,255,0.5)',
                boxShadow: '0 40px 80px rgba(0,0,0,0.12)',
              }}
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-extrabold" style={{ color: '#1A1A1E' }}>
                    {editingExercise ? 'Editar Ejercicio' : 'Añadir Ejercicio'}
                  </h2>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.35)' }}>
                    Para: {exerciseMachine?.name}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowExerciseModal(false)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ color: 'rgba(0,0,0,0.3)' }}
                >
                  <X size={16} />
                </motion.button>
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider mb-1.5 block" style={{ color: 'rgba(0,0,0,0.35)' }}>
                  Nombre del ejercicio
                </label>
                <input
                  value={exerciseName}
                  onChange={e => setExerciseName(e.target.value)}
                  placeholder="Ej: Flexiones, Dominadas, Curl de Bíceps"
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-medium outline-none"
                  style={{
                    background: 'rgba(0,0,0,0.03)',
                    border: '1px solid rgba(0,0,0,0.06)',
                    color: '#1A1A1E',
                  }}
                  onKeyDown={e => { if (e.key === 'Enter') saveExercise() }}
                />
                <p className="text-[10px] mt-1.5" style={{ color: 'rgba(0,0,0,0.2)' }}>
                  Estos ejercicios alimentarán la IA para crear rutinas personalizadas sin inventar ejercicios.
                </p>
              </div>
              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowExerciseModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold"
                  style={{
                    background: 'rgba(0,0,0,0.03)',
                    color: 'rgba(0,0,0,0.35)',
                    border: '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={saveExercise}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white"
                  style={{
                    background: BLUE_GRAD,
                    boxShadow: '0 4px 16px rgba(18,112,183,0.25)',
                    opacity: exerciseName.trim() ? 1 : 0.5,
                  }}
                  disabled={!exerciseName.trim()}
                >
                  {editingExercise ? 'Guardar Cambios' : 'Añadir Ejercicio'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
