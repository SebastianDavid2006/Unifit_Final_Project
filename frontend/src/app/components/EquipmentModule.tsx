import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Search, Plus, Dumbbell, Pencil, Trash2, X, List,
  Activity, Wrench, PowerOff, ChevronDown, ChevronRight, Check,
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
  zone: string
}

interface Machine {
  id: number
  name: string
  zone: string
  status: Status
  exerciseIds: number[]
}

const statusConfig: Record<Status, { label: string; color: string; bg: string; border: string }> = {
  active: { label: 'Activo', color: GREEN, bg: 'rgba(48,209,88,0.08)', border: 'rgba(48,209,88,0.15)' },
  maintenance: { label: 'Mantenimiento', color: YELLOW, bg: 'rgba(241,200,39,0.08)', border: 'rgba(241,200,39,0.15)' },
  inactive: { label: 'Inactiva', color: RED, bg: 'rgba(244,56,67,0.08)', border: 'rgba(244,56,67,0.15)' },
}

const initialExercises: Exercise[] = [
  { id: 1, name: 'Caminata', zone: 'Cardio' },
  { id: 2, name: 'Trote', zone: 'Cardio' },
  { id: 3, name: 'Intervalos', zone: 'Cardio' },
  { id: 4, name: 'Ciclismo', zone: 'Cardio' },
  { id: 5, name: 'Caminata Elíptica', zone: 'Cardio' },
  { id: 6, name: 'Sentadilla', zone: 'Pesas Libres' },
  { id: 7, name: 'Press Hombros', zone: 'Pesas Libres' },
  { id: 8, name: 'Press Plano', zone: 'Pesas Libres' },
  { id: 9, name: 'Press Inclinado', zone: 'Pesas Libres' },
  { id: 10, name: 'Press Declinado', zone: 'Pesas Libres' },
  { id: 11, name: 'Cruce de Cables', zone: 'Máquinas' },
  { id: 12, name: 'Polea Alta', zone: 'Máquinas' },
]

const initialMachines: Machine[] = [
  { id: 1, name: 'Cinta de Correr A1', zone: 'Cardio', status: 'active', exerciseIds: [1, 2, 3] },
  { id: 2, name: 'Rack Multipower', zone: 'Pesas Libres', status: 'active', exerciseIds: [6, 7] },
  { id: 3, name: 'Bicicleta Spinning B3', zone: 'Cardio', status: 'maintenance', exerciseIds: [4] },
  { id: 4, name: 'Press de Banca', zone: 'Pesas Libres', status: 'active', exerciseIds: [8, 9, 10] },
  { id: 5, name: 'Elíptica C2', zone: 'Cardio', status: 'active', exerciseIds: [5] },
  { id: 6, name: 'Cable Crossover', zone: 'Máquinas', status: 'inactive', exerciseIds: [11, 12] },
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
  showBlur: boolean
  onSearchChange: (v: string) => void
  onSearchFocus: (v: boolean) => void
  onStatusFilterChange: (v: Status | 'all') => void
}

export default function EquipmentModule({ search, searchFocused, statusFilter, showBlur, onSearchChange, onSearchFocus, onStatusFilterChange }: Props) {
  const [machines, setMachines] = useState<Machine[]>(initialMachines)
  const [globalExercises, setGlobalExercises] = useState<Exercise[]>(initialExercises)
  const [showMachineModal, setShowMachineModal] = useState(false)
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null)
  const [machineForm, setMachineForm] = useState({ name: '', zone: '', status: 'active' as Status, selectedIds: [] as number[] })
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [showExerciseManager, setShowExerciseManager] = useState(false)
  const [exForm, setExForm] = useState({ name: '', zone: '' })
  const [exEditing, setExEditing] = useState<Exercise | null>(null)
  const [exFilterZone, setExFilterZone] = useState('')

  const zones = useMemo(() => [...new Set(globalExercises.map(e => e.zone))], [globalExercises])

  const filtered = useMemo(() => {
    let list = machines
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.zone.toLowerCase().includes(q) ||
        m.exerciseIds.some(id => {
          const ex = globalExercises.find(e => e.id === id)
          return ex?.name.toLowerCase().includes(q)
        })
      )
    }
    if (statusFilter !== 'all') {
      list = list.filter(m => m.status === statusFilter)
    }
    return list
  }, [machines, search, statusFilter, globalExercises])

  const nextMachineId = useMemo(() => Math.max(...machines.map(m => m.id), 0) + 1, [machines])
  const nextExerciseId = useMemo(() => Math.max(...globalExercises.map(e => e.id), 0) + 1, [globalExercises])

  function getMachineExercises(m: Machine) {
    return globalExercises.filter(e => m.exerciseIds.includes(e.id))
  }

  function openAddMachine() {
    setEditingMachine(null)
    setMachineForm({ name: '', zone: '', status: 'active', selectedIds: [] })
    setShowMachineModal(true)
  }

  function openEditMachine(m: Machine) {
    setEditingMachine(m)
    setMachineForm({ name: m.name, zone: m.zone, status: m.status, selectedIds: [...m.exerciseIds] })
    setShowMachineModal(true)
  }

  function saveMachine() {
    if (!machineForm.name.trim() || !machineForm.zone.trim()) return
    if (editingMachine) {
      setMachines(prev => prev.map(m =>
        m.id === editingMachine.id
          ? { ...m, name: machineForm.name.trim(), zone: machineForm.zone.trim(), status: machineForm.status, exerciseIds: machineForm.selectedIds }
          : m
      ))
    } else {
      setMachines(prev => [...prev, { id: nextMachineId, name: machineForm.name.trim(), zone: machineForm.zone.trim(), status: machineForm.status, exerciseIds: machineForm.selectedIds }])
    }
    setShowMachineModal(false)
  }

  function toggleExerciseSelection(id: number) {
    setMachineForm(f => ({
      ...f,
      selectedIds: f.selectedIds.includes(id)
        ? f.selectedIds.filter(x => x !== id)
        : [...f.selectedIds, id]
    }))
  }

  function deleteMachine(id: number) {
    setMachines(prev => prev.filter(m => m.id !== id))
    if (expandedId === id) setExpandedId(null)
  }

  function changeStatus(id: number, status: Status) {
    setMachines(prev => prev.map(m => m.id === id ? { ...m, status } : m))
  }

  // ── Exercise Manager ──

  function openAddExercise() {
    setExEditing(null)
    setExForm({ name: '', zone: zones[0] || '' })
  }

  function openEditExercise(e: Exercise) {
    setExEditing(e)
    setExForm({ name: e.name, zone: e.zone })
  }

  function saveExercise() {
    if (!exForm.name.trim() || !exForm.zone) return
    if (exEditing) {
      setGlobalExercises(prev => prev.map(e =>
        e.id === exEditing.id ? { ...e, name: exForm.name.trim(), zone: exForm.zone } : e
      ))
    } else {
      setGlobalExercises(prev => [...prev, { id: nextExerciseId, name: exForm.name.trim(), zone: exForm.zone }])
    }
    setExForm({ name: '', zone: zones[0] || '' })
    setExEditing(null)
  }

  function deleteExercise(id: number) {
    setGlobalExercises(prev => prev.filter(e => e.id !== id))
    setMachines(prev => prev.map(m => ({
      ...m,
      exerciseIds: m.exerciseIds.filter(x => x !== id)
    })))
  }

  const filteredExercises = useMemo(() => {
    let list = globalExercises
    if (exFilterZone) list = list.filter(e => e.zone === exFilterZone)
    return list
  }, [globalExercises, exFilterZone])

  return (
    <div className="p-8 pt-12 max-w-[1440px] mx-auto relative" style={showBlur ? { filter: 'blur(4px)', transition: 'filter 0.2s ease' } : undefined}>
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
              onClick={() => { openAddExercise(); setShowExerciseManager(true) }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold"
              style={{
                background: 'rgba(0,0,0,0.04)',
                color: BLUE,
                border: '1px solid rgba(0,0,0,0.05)',
              }}
            >
              <List size={15} /> Ejercicios
            </motion.button>
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
        {filtered.map((machine, i) => {
          const machineExercises = getMachineExercises(machine)
          return (
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
                <p className="text-xs mt-1" style={{ color: 'rgba(0,0,0,0.35)' }}>{machine.zone}</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.25)' }}>
                  {machineExercises.length} ejercicio{machineExercises.length !== 1 ? 's' : ''}
                </p>
              </div>

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
                  {expandedId === machine.id ? 'Ocultar' : `${machineExercises.length} ejercicios`}
                  {expandedId === machine.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </motion.button>
              </div>

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
                          Ejercicios asignados
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => openEditMachine(machine)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold"
                          style={{
                            background: `${BLUE}10`,
                            color: BLUE,
                            border: `1px solid ${BLUE}25`,
                          }}
                        >
                          <List size={11} /> Seleccionar
                        </motion.button>
                      </div>
                      {machineExercises.length === 0 ? (
                        <p className="text-xs py-3 text-center" style={{ color: 'rgba(0,0,0,0.2)' }}>
                          Ningún ejercicio asignado. Selecciona desde "Ejercicios" al crear la máquina.
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {machineExercises.map(ex => (
                            <div
                              key={ex.id}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium"
                              style={{
                                background: 'rgba(0,0,0,0.03)',
                                border: '1px solid rgba(0,0,0,0.04)',
                                color: '#1A1A1E',
                              }}
                            >
                              <span>{ex.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
        {filtered.length === 0 && (
          <div className="col-span-3 py-16 text-center">
            <p className="text-lg font-bold" style={{ color: 'rgba(0,0,0,0.2)' }}>No se encontraron máquinas</p>
            <p className="text-sm mt-1" style={{ color: 'rgba(0,0,0,0.15)' }}>Prueba con otros filtros o agrega una nueva máquina</p>
          </div>
        )}
      </div>

      {/* ── Machine Modal ── */}
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
                background: '#FFFFFF',
                border: '1px solid rgba(0,0,0,0.06)',
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

                {/* Exercise Selector */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider mb-1.5 block" style={{ color: 'rgba(0,0,0,0.35)' }}>
                    Ejercicios ({machineForm.selectedIds.length} seleccionados)
                  </label>
                  <p className="text-[10px] mb-2" style={{ color: 'rgba(0,0,0,0.2)' }}>
                    Selecciona los ejercicios que componen esta máquina:
                  </p>
                  <div
                    className="max-h-48 overflow-y-auto rounded-xl p-2"
                    style={{
                      background: 'rgba(0,0,0,0.02)',
                      border: '1px solid rgba(0,0,0,0.06)',
                    }}
                  >
                    {globalExercises.length === 0 ? (
                      <p className="text-xs py-3 text-center" style={{ color: 'rgba(0,0,0,0.2)' }}>
                        No hay ejercicios registrados. Ve a "Ejercicios" para crear algunos.
                      </p>
                    ) : (
                      <div className="space-y-1">
                        {zones.map(zone => {
                          const zoneExercises = globalExercises.filter(e => e.zone === zone)
                          return (
                            <div key={zone}>
                              <p className="text-[10px] font-bold uppercase tracking-wider px-2 py-1" style={{ color: 'rgba(0,0,0,0.2)' }}>{zone}</p>
                              {zoneExercises.map(ex => {
                                const selected = machineForm.selectedIds.includes(ex.id)
                                return (
                                  <motion.button
                                    key={ex.id}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => toggleExerciseSelection(ex.id)}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                                    style={{
                                      background: selected ? `${BLUE}10` : 'transparent',
                                      color: selected ? BLUE : 'rgba(0,0,0,0.5)',
                                    }}
                                  >
                                    <div
                                      className="w-4 h-4 rounded-md flex items-center justify-center"
                                      style={{
                                        background: selected ? BLUE : 'rgba(0,0,0,0.06)',
                                        border: `1px solid ${selected ? BLUE : 'rgba(0,0,0,0.1)'}`,
                                      }}
                                    >
                                      {selected && <Check size={10} className="text-white" />}
                                    </div>
                                    {ex.name}
                                  </motion.button>
                                )
                              })}
                            </div>
                          )
                        })}
                      </div>
                    )}
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

      {/* ── Exercise Manager Modal ── */}
      <AnimatePresence>
        {showExerciseManager && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowExerciseManager(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-2xl rounded-2xl p-6"
              style={{
                 background: '#FFFFFF',
                 border: '1px solid rgba(0,0,0,0.06)',
                 boxShadow: '0 40px 80px rgba(0,0,0,0.12)',
               }}
             >
               <div className="flex items-center justify-between mb-5">
                 <h2 className="text-lg font-extrabold" style={{ color: '#1A1A1E' }}>Gestión de Ejercicios</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowExerciseManager(false)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ color: 'rgba(0,0,0,0.3)' }}
                >
                  <X size={16} />
                </motion.button>
              </div>

              <p className="text-xs mb-4" style={{ color: 'rgba(0,0,0,0.35)' }}>
                Estos ejercicios estarán disponibles para asignar a cualquier máquina. La IA los usará para crear rutinas personalizadas sin inventar ejercicios.
              </p>

              {/* Add/Edit Form */}
              <div className="flex items-end gap-3 mb-5 p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
                <div className="flex-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider mb-1 block" style={{ color: 'rgba(0,0,0,0.3)' }}>Nombre</label>
                  <input
                    value={exForm.name}
                    onChange={e => setExForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Ej: Flexiones"
                    className="w-full px-3 py-2 rounded-xl text-xs font-medium outline-none"
                    style={{
                      background: 'rgba(255,255,255,0.5)',
                      border: '1px solid rgba(0,0,0,0.06)',
                      color: '#1A1A1E',
                    }}
                    onKeyDown={e => { if (e.key === 'Enter') saveExercise() }}
                  />
                </div>
                <div className="w-40">
                  <label className="text-[10px] font-bold uppercase tracking-wider mb-1 block" style={{ color: 'rgba(0,0,0,0.3)' }}>Zona</label>
                  <div className="flex gap-1">
                    {zones.map(z => (
                      <motion.button
                        key={z}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setExForm(f => ({ ...f, zone: z }))}
                        className="flex-1 py-2 rounded-lg text-[10px] font-bold"
                        style={{
                          background: exForm.zone === z ? `${BLUE}15` : 'rgba(255,255,255,0.5)',
                          color: exForm.zone === z ? BLUE : 'rgba(0,0,0,0.3)',
                          border: `1px solid ${exForm.zone === z ? `${BLUE}30` : 'rgba(0,0,0,0.06)'}`,
                        }}
                      >
                        {z}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { if (exForm.name.trim() && exForm.zone) saveExercise() }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white"
                  style={{
                    background: BLUE_GRAD,
                    boxShadow: '0 2px 8px rgba(18,112,183,0.2)',
                    opacity: exForm.name.trim() && exForm.zone ? 1 : 0.5,
                  }}
                  disabled={!exForm.name.trim() || !exForm.zone}
                >
                  {exEditing ? 'Actualizar' : 'Agregar'}
                </motion.button>
                {exEditing && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { setExEditing(null); setExForm({ name: '', zone: zones[0] || '' }) }}
                    className="px-3 py-2 rounded-xl text-xs font-bold"
                    style={{ color: 'rgba(0,0,0,0.3)' }}
                  >
                    Cancelar
                  </motion.button>
                )}
              </div>

              {/* Zone Filter */}
              <div className="flex gap-1.5 mb-4">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setExFilterZone('')}
                  className="px-3 py-1 rounded-lg text-[10px] font-bold"
                  style={{
                    background: !exFilterZone ? `${BLUE}15` : 'rgba(0,0,0,0.03)',
                    color: !exFilterZone ? BLUE : 'rgba(0,0,0,0.3)',
                  }}
                >
                  Todas
                </motion.button>
                {zones.map(z => (
                  <motion.button
                    key={z}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setExFilterZone(exFilterZone === z ? '' : z)}
                    className="px-3 py-1 rounded-lg text-[10px] font-bold"
                    style={{
                      background: exFilterZone === z ? `${BLUE}15` : 'rgba(0,0,0,0.03)',
                      color: exFilterZone === z ? BLUE : 'rgba(0,0,0,0.3)',
                    }}
                  >
                    {z}
                  </motion.button>
                ))}
              </div>

              {/* Exercises List */}
              <div className="max-h-64 overflow-y-auto space-y-1">
                {filteredExercises.length === 0 ? (
                  <p className="text-xs py-6 text-center" style={{ color: 'rgba(0,0,0,0.2)' }}>
                    No hay ejercicios en esta zona. Agrega el primero arriba.
                  </p>
                ) : (
                  filteredExercises.map(ex => (
                    <div
                      key={ex.id}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl group"
                      style={{ border: '1px solid rgba(0,0,0,0.04)' }}
                    >
                      <Dumbbell size={13} style={{ color: 'rgba(0,0,0,0.2)' }} />
                      <span className="flex-1 text-xs font-medium" style={{ color: '#1A1A1E' }}>{ex.name}</span>
                      <span
                        className="px-2 py-0.5 rounded-md text-[9px] font-bold"
                        style={{ background: `${BLUE}08`, color: BLUE }}
                      >
                        {ex.zone}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => openEditExercise(ex)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ color: 'rgba(0,0,0,0.25)' }}
                      >
                        <Pencil size={12} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1, color: RED }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteExercise(ex.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ color: 'rgba(0,0,0,0.2)' }}
                      >
                        <X size={12} />
                      </motion.button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
