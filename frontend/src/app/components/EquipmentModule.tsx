import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Cropper from 'react-easy-crop'
import confetti from 'canvas-confetti'
import {
  Search, Plus, Dumbbell, Pencil, Trash2, X, List, Upload,
  Activity, Wrench, PowerOff, ChevronDown, ChevronRight, ChevronLeft, Check,
} from 'lucide-react'
import machineImg from '../../assets/illustrations/objects/machine.png'
import exercisesImg from '../../assets/illustrations/objects/exercises.png'

const BLUE = '#1270B7'
const GREEN = '#30D158'
const YELLOW = '#F1C827'
const RED = '#F43843'
const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #7ec8e3)'
const GREEN_GRAD = 'linear-gradient(135deg, #00fb64, #009b95)'

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
  imageDataUrl?: string
  description: string
  muscleGroups: string[]
  recommendedLevel: 'principiante' | 'intermedio' | 'avanzado'
  observations: string
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
  { id: 1, name: 'Cinta de Correr A1', zone: 'Cardio', status: 'active', description: '', muscleGroups: ['Cardio'], recommendedLevel: 'principiante', observations: '', exerciseIds: [1, 2, 3] },
  { id: 2, name: 'Rack Multipower', zone: 'Pesas Libres', status: 'active', description: '', muscleGroups: ['Piernas', 'Pecho'], recommendedLevel: 'intermedio', observations: '', exerciseIds: [6, 7] },
  { id: 3, name: 'Bicicleta Spinning B3', zone: 'Cardio', status: 'maintenance', description: '', muscleGroups: ['Cardio'], recommendedLevel: 'intermedio', observations: '', exerciseIds: [4] },
  { id: 4, name: 'Press de Banca', zone: 'Pesas Libres', status: 'active', description: '', muscleGroups: ['Pecho'], recommendedLevel: 'principiante', observations: '', exerciseIds: [8, 9, 10] },
  { id: 5, name: 'Elíptica C2', zone: 'Cardio', status: 'active', description: '', muscleGroups: ['Cardio'], recommendedLevel: 'principiante', observations: '', exerciseIds: [5] },
  { id: 6, name: 'Cable Crossover', zone: 'Máquinas', status: 'inactive', description: '', muscleGroups: ['Brazos', 'Hombros'], recommendedLevel: 'intermedio', observations: '', exerciseIds: [11, 12] },
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
  const [showCreateOptions, setShowCreateOptions] = useState(false)
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null)
  const [machineStep, setMachineStep] = useState(0)
  const meshInputBg = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)'
  const meshInputHover = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(0,0,0,0.04)'
  const [machineForm, setMachineForm] = useState({
    name: '', zone: '', status: 'active' as Status,
    imageDataUrl: '', description: '', muscleGroups: [] as string[],
    recommendedLevel: 'principiante' as 'principiante' | 'intermedio' | 'avanzado',
    observations: '', selectedIds: [] as number[]
  })
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [showExerciseManager, setShowExerciseManager] = useState(false)
  const [machineSuccess, setMachineSuccess] = useState(false)
  const [exForm, setExForm] = useState({ name: '', zone: '' })
  const [exEditing, setExEditing] = useState<Exercise | null>(null)
  const [exFilterZone, setExFilterZone] = useState('')

  const [showImageEditor, setShowImageEditor] = useState(false)
  const [imageToEdit, setImageToEdit] = useState('')
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ x: number; y: number; width: number; height: number } | null>(null)
  const [cinematicIntensity, setCinematicIntensity] = useState(0)
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (imageToEdit) {
      const img = new Image()
      img.onload = () => setNaturalSize({ width: img.width, height: img.height })
      img.src = imageToEdit
    }
  }, [imageToEdit])

  function getCinematicFilter(intensity: number): string {
    const t = intensity / 100
    const contrast = 1 + t * 0.35
    const brightness = 1 - t * 0.1
    const saturate = 1 - t * 0.25
    const sepia = t * 0.12
    const hueRotate = t * 10
    return `contrast(${contrast}) brightness(${brightness}) saturate(${saturate}) sepia(${sepia}) hue-rotate(${hueRotate}deg)`
  }

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
    setMachineStep(0)
    setMachineForm({
      name: '', zone: '', status: 'active',
      imageDataUrl: '', description: '', muscleGroups: [],
      recommendedLevel: 'principiante', observations: '', selectedIds: []
    })
    setShowMachineModal(true)
  }

  function openEditMachine(m: Machine) {
    setEditingMachine(m)
    setMachineStep(0)
    setMachineForm({
      name: m.name, zone: m.zone, status: m.status,
      imageDataUrl: m.imageDataUrl || '', description: m.description,
      muscleGroups: [...m.muscleGroups], recommendedLevel: m.recommendedLevel,
      observations: m.observations, selectedIds: [...m.exerciseIds]
    })
    setShowMachineModal(true)
  }

  function saveMachine() {
    if (!machineForm.name.trim() || !machineForm.zone.trim()) return
    const data = {
      name: machineForm.name.trim(),
      zone: machineForm.zone.trim(),
      status: machineForm.status,
      imageDataUrl: machineForm.imageDataUrl || undefined,
      description: machineForm.description.trim(),
      muscleGroups: machineForm.muscleGroups,
      recommendedLevel: machineForm.recommendedLevel,
      observations: machineForm.observations.trim(),
      exerciseIds: machineForm.selectedIds,
    }
    if (editingMachine) {
      setMachines(prev => prev.map(m =>
        m.id === editingMachine.id ? { ...m, ...data } : m
      ))
    } else {
      setMachines(prev => [...prev, { id: nextMachineId, ...data }])
    }
    if (editingMachine) {
      setShowMachineModal(false)
    } else {
      setMachineSuccess(true)
    }
  }

  function toggleExerciseSelection(id: number) {
    setMachineForm(f => ({
      ...f,
      selectedIds: f.selectedIds.includes(id)
        ? f.selectedIds.filter(x => x !== id)
        : [...f.selectedIds, id]
    }))
  }

  function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = url
    })
  }

  async function applyCropAndFilter() {
    if (!imageToEdit || !croppedAreaPixels) return
    try {
      const image = await createImage(imageToEdit)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      canvas.width = croppedAreaPixels.width
      canvas.height = croppedAreaPixels.height
      ctx.filter = getCinematicFilter(cinematicIntensity)
      ctx.drawImage(
        image,
        croppedAreaPixels.x, croppedAreaPixels.y,
        croppedAreaPixels.width, croppedAreaPixels.height,
        0, 0,
        croppedAreaPixels.width, croppedAreaPixels.height
      )
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
      setMachineForm(f => ({ ...f, imageDataUrl: dataUrl }))
      setShowImageEditor(false)
      setImageToEdit('')
      setCinematicIntensity(0)
      setZoom(1)
      setCrop({ x: 0, y: 0 })
      setCroppedAreaPixels(null)
    } catch (e) {
      console.error('Error applying crop/filter', e)
    }
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
    <div className="p-8 pt-12 max-w-[1440px] mx-auto relative" style={showBlur ? { filter: 'blur(4px)', transition: 'filter 0.25s ease' } : undefined}>
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
              <h1 style={{ color: '#1A1A1E', fontSize: '2rem', fontWeight: 800 }}>Máquinas y Ejercicios</h1>
              <p className="text-xs text-black/40">Registra máquinas, asigna ejercicios y controla su estado operativo.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 pr-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateOptions(true)}
              className="relative flex items-center justify-start gap-2 h-11 overflow-hidden cursor-pointer group rounded-full"
              style={{
                width: 44,
                transition: 'width 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                background: 'radial-gradient(ellipse at 20% 30%, rgba(230,57,70,0.9) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(18,112,183,0.4) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(241,200,39,0.25) 0%, transparent 50%), #CC0033',
                boxShadow: '0 4px 16px rgba(230,57,70,0.25)',
                color: '#FFFFFF',
                border: 'none',
              }}
              onMouseEnter={e => { e.currentTarget.style.width = '110px'; const t = e.currentTarget.querySelector('span'); if (t) t.style.opacity = '1' }}
              onMouseLeave={e => { e.currentTarget.style.width = '44px'; const t = e.currentTarget.querySelector('span'); if (t) t.style.opacity = '0' }}
            >
              <div className="flex items-center justify-center flex-shrink-0 relative z-10" style={{ width: 44, height: 44 }}>
                <Plus size={18} />
              </div>
              <span className="text-sm whitespace-nowrap relative z-10" style={{
                opacity: 0,
                fontWeight: 600,
                transition: 'opacity 0.2s ease 0.08s',
              }}>Crear</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ── Premium Create Options ── */}
      <AnimatePresence>
        {showCreateOptions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowCreateOptions(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex gap-6">
                {/* Card: Máquina */}
                <motion.button
                  whileHover={{ scale: 1.04, y: -6 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setShowCreateOptions(false); openAddMachine() }}
                  className="relative w-80 h-96 rounded-3xl flex flex-col items-center justify-end p-8 overflow-hidden"
                  style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
                >
                  <img src={exercisesImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{
                    background: 'linear-gradient(to top, rgba(18,112,183,0.85) 0%, rgba(18,112,183,0.4) 50%, rgba(0,0,0,0.3) 100%)',
                  }} />
                  <div className="relative z-10 flex flex-col items-center">
                    <span className="text-xl font-extrabold text-white tracking-tight">¡Registrar Máquina!</span>
                    <span className="text-[11px] text-white/60 mt-1">Agrega una nueva máquina</span>
                  </div>
                </motion.button>

                {/* Card: Ejercicio */}
                <motion.button
                  whileHover={{ scale: 1.04, y: -6 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setShowCreateOptions(false); openAddExercise(); setShowExerciseManager(true) }}
                  className="relative w-64 h-80 rounded-3xl flex flex-col items-center justify-end p-8 overflow-hidden"
                  style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
                >
                  <img src={exercisesImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{
                    background: 'linear-gradient(to top, rgba(48,209,88,0.85) 0%, rgba(48,209,88,0.4) 50%, rgba(0,0,0,0.3) 100%)',
                  }} />
                  <div className="relative z-10 flex flex-col items-center">
                    <span className="text-lg font-extrabold text-white tracking-tight">¡Registrar Ejercicio!</span>
                    <span className="text-[11px] text-white/60 mt-1">Añade un nuevo ejercicio</span>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                background: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.6)',
                boxShadow: '0 2px 20px rgba(0,0,0,0.04)',
              }}
            >
              {/* Machine image */}
              <div className="w-full overflow-hidden relative" style={{ height: 96, background: `${statusConfig[machine.status].color}08` }}>
                <img
                  src={machine.imageDataUrl || machineImg}
                  alt={machine.name}
                  className="w-full h-full"
                  style={{
                    objectFit: machine.imageDataUrl ? 'cover' : 'contain',
                    objectPosition: machine.imageDataUrl ? 'center' : 'bottom center',
                    filter: machine.imageDataUrl ? 'none' : `grayscale(${0.1 + (machine.id * 0.05) % 0.5}) contrast(${0.8 + (machine.id * 0.03) % 0.4})`,
                    padding: machine.imageDataUrl ? 0 : '8px',
                  }}
                />
                <div className="absolute inset-0" style={{
                  background: `linear-gradient(180deg, transparent 40%, ${statusConfig[machine.status].color}15 100%)`,
                  pointerEvents: 'none',
                }} />
              </div>

              <div className="px-5 pt-4 pb-3">
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

      {/* ── Machine Modal (3-step) ── */}
      <AnimatePresence>
        {showMachineModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(6px)' }}
            onClick={() => setShowMachineModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              className={`rounded-3xl w-full flex flex-col mx-4 ${machineSuccess ? 'overflow-visible' : 'overflow-hidden'}`}
              style={machineSuccess ? {
                background: '#FFFFFF',
                border: '1px solid rgba(0,0,0,0.04)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.12)',
                maxWidth: 672,
                minHeight: 520,
                maxHeight: 660,
              } : {
                background: '#FFFFFF',
                border: '1px solid rgba(0,0,0,0.04)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.12)',
                maxHeight: '90vh',
                maxWidth: 576,
              }}
            >
              {machineSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center pt-14 px-6"
                >
                  <div className="relative flex items-center justify-center -mt-28 mb-6">
                    {[...Array(24)].map((_, i) => {
                      const angle = (i / 24) * 360
                      const rad = (angle * Math.PI) / 180
                      return (
                        <motion.span
                          key={i}
                          className="absolute pointer-events-none text-lg select-none"
                          style={{ color: '#4ADE80' }}
                          animate={{
                            x: [0, Math.cos(rad) * (110 + (i % 6) * 20)],
                            y: [0, Math.sin(rad) * (110 + (i % 6) * 20)],
                            opacity: [0, 1, 0],
                            scale: [0, 1.4, 0],
                          }}
                          transition={{
                            duration: 2.5 + (i % 4) * 0.3,
                            repeat: Infinity,
                            delay: i * 0.07,
                            ease: 'easeOut',
                          }}
                        >
                          ✦
                        </motion.span>
                      )
                    })}
                    <div className="relative flex items-center justify-center">
                      <motion.img
                        src={machineImg}
                        alt="máquina"
                        className="w-72 h-auto object-contain relative z-10"
                        style={{ filter: 'drop-shadow(0 0 30px rgba(34,197,94,0.15))' }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                      />
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-24 pointer-events-none z-20" style={{
                        background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, transparent 60%)',
                      }} />
                    </div>
                  </div>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="text-lg font-bold text-center"
                    style={{ color: '#1A1A1E' }}
                  >
                    ¡Máquina registrada exitosamente!
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="text-sm text-center mt-1 mb-8"
                    style={{ color: 'rgba(0,0,0,0.4)' }}
                  >
                    La máquina se ha añadido correctamente al sistema.
                  </motion.p>
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setShowMachineModal(false); setMachineSuccess(false) }}
                    className="px-8 py-2.5 rounded-2xl text-xs font-bold text-white cursor-pointer"
                    style={{ background: GREEN_GRAD }}
                  >
                    Cerrar
                  </motion.button>
                </motion.div>
              ) : (
                <><AnimatePresence mode="wait">
                <motion.div
                  key={machineStep}
                  initial={{ opacity: 0, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, filter: 'blur(6px)' }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col flex-1 min-h-0"
                >
                  {/* ── Header ── */}
                  <div className="sticky top-0 z-10 flex-shrink-0" style={{
                    background: 'rgba(255,255,255,0.9)',
                    borderBottom: '1px solid rgba(0,0,0,0.04)',
                  }}>
                    <div className="flex items-center justify-end p-4 pb-0">
                      <motion.button
                        whileHover={{ scale: 1.15, background: 'rgba(244,56,67,0.1)', color: RED }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowMachineModal(false)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors"
                        style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.3)' }}
                      >
                        <X size={15} />
                      </motion.button>
                    </div>
                    <div className="flex items-center justify-center gap-1.5" style={{ marginTop: 12, marginBottom: 16 }}>
                      {[1, 2, 3].map(s => (
                        <motion.div
                          key={s}
                          animate={{
                            width: s === machineStep + 1 ? 16 : 6,
                            background: s === machineStep + 1 ? BLUE_GRAD : 'rgba(0,0,0,0.12)',
                          }}
                          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                          className="rounded-full"
                          style={{ height: 6 }}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-bold tracking-wide text-center block" style={{
                      color: '#1A1A1E',
                      marginBottom: 10,
                    }}>
                      {machineStep === 0 ? 'Datos básicos' : machineStep === 1 ? 'Descripción' : 'Ejercicios'}
                    </span>
                  </div>

                  {/* ── Body ── */}
                  <div className="flex-1 overflow-y-auto px-6 pb-6 pt-5">
                    {/* Step 1 — Image, Name, Type, Status */}
                    {machineStep === 0 && (
                      <div className="space-y-4">
                        <div>
                          <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.6)' }}>Imagen de la máquina</label>
                          <motion.div
                            className="w-full h-40 rounded-xl flex items-center justify-center cursor-pointer overflow-hidden relative"
                            style={{ border: machineForm.imageDataUrl ? `1px solid ${GREEN}30` : '1px dashed rgba(0,0,0,0.12)' }}
                            whileHover={{ borderColor: machineForm.imageDataUrl ? GREEN : BLUE, background: machineForm.imageDataUrl ? `${GREEN}05` : 'rgba(18,112,183,0.03)', scale: 1.005 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => document.getElementById('machine-image-input')?.click()}
                          >
                            {machineForm.imageDataUrl ? (
                              <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: `${GREEN}15` }}>
                                  <Check size={24} style={{ color: GREEN }} />
                                </div>
                                <span className="text-xs font-medium" style={{ color: GREEN }}>Imagen subida</span>
                                <span className="text-[9px]" style={{ color: 'rgba(0,0,0,0.2)' }}>Haz clic para cambiar</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-2">
                                <Upload size={24} style={{ color: 'rgba(0,0,0,0.2)' }} />
                                <span className="text-xs" style={{ color: 'rgba(0,0,0,0.2)' }}>Haz clic para subir imagen</span>
                              </div>
                            )}
                          </motion.div>
                          <input
                            id="machine-image-input"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => {
                              const file = e.target.files?.[0]
                              if (file) {
                                const reader = new FileReader()
                                reader.onload = () => {
                                  setImageToEdit(reader.result as string)
                                  setCrop({ x: 0, y: 0 })
                                  setZoom(1)
                                  setCroppedAreaPixels(null)
                                  setShowImageEditor(true)
                                }
                                reader.readAsDataURL(file)
                              }
                            }}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.6)' }}>Nombre <span style={{ color: RED }}>*</span></label>
                            <input
                              value={machineForm.name}
                              onChange={e => setMachineForm(f => ({ ...f, name: e.target.value }))}
                              placeholder="Ej: Press de Banca"
                              className="px-3 py-2 rounded-xl text-xs font-medium outline-none w-full transition-all duration-200"
                              style={{
                                background: meshInputBg,
                                color: '#1A1A1E',
                                border: '1px solid transparent',
                              }}
                              onMouseEnter={e => { if (e.target !== document.activeElement) { e.target.style.background = meshInputHover; e.target.style.borderColor = 'rgba(0,0,0,0.06)' } }}
                              onMouseLeave={e => { if (e.target !== document.activeElement) { e.target.style.background = meshInputBg; e.target.style.borderColor = 'transparent' } }}
                              onFocus={e => { e.target.style.borderColor = BLUE; e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(18,112,183,0.04)'; e.target.style.boxShadow = '0 0 0 3px rgba(18,112,183,0.08)' }}
                              onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.background = meshInputBg; e.target.style.boxShadow = 'none' }}
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.6)' }}>Tipo de Máquina <span style={{ color: RED }}>*</span></label>
                            <input
                              value={machineForm.zone}
                              onChange={e => setMachineForm(f => ({ ...f, zone: e.target.value }))}
                              placeholder="Ej: Cardio, Pesas Libres"
                              className="px-3 py-2 rounded-xl text-xs font-medium outline-none w-full transition-all duration-200"
                              style={{
                                background: meshInputBg,
                                color: '#1A1A1E',
                                border: '1px solid transparent',
                              }}
                              onMouseEnter={e => { if (e.target !== document.activeElement) { e.target.style.background = meshInputHover; e.target.style.borderColor = 'rgba(0,0,0,0.06)' } }}
                              onMouseLeave={e => { if (e.target !== document.activeElement) { e.target.style.background = meshInputBg; e.target.style.borderColor = 'transparent' } }}
                              onFocus={e => { e.target.style.borderColor = BLUE; e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(18,112,183,0.04)'; e.target.style.boxShadow = '0 0 0 3px rgba(18,112,183,0.08)' }}
                              onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.background = meshInputBg; e.target.style.boxShadow = 'none' }}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.6)' }}>Estado</label>
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
                    )}

                    {/* Step 2 — Description, Muscle Groups, Level, Observations */}
                    {machineStep === 1 && (
                      <div className="space-y-5">
                        <div>
                          <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.6)' }}>Descripción</label>
                          <textarea
                            value={machineForm.description}
                            onChange={e => setMachineForm(f => ({ ...f, description: e.target.value }))}
                            placeholder="Describe brevemente la máquina..."
                            rows={3}
                            className="w-full px-3 py-2 rounded-xl text-xs font-medium outline-none resize-none transition-all duration-200"
                            style={{ background: meshInputBg, color: '#1A1A1E', border: '1px solid transparent' }}
                            onMouseEnter={e => { if (e.target !== document.activeElement) { e.target.style.background = meshInputHover; e.target.style.borderColor = 'rgba(0,0,0,0.06)' } }}
                            onMouseLeave={e => { if (e.target !== document.activeElement) { e.target.style.background = meshInputBg; e.target.style.borderColor = 'transparent' } }}
                            onFocus={e => { e.target.style.borderColor = BLUE; e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(18,112,183,0.04)'; e.target.style.boxShadow = '0 0 0 3px rgba(18,112,183,0.08)' }}
                            onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.background = meshInputBg; e.target.style.boxShadow = 'none' }}
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.6)' }}>Grupo Muscular Principal</label>
                          <p className="text-[10px] mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>¿A qué grupo muscular se dedica principalmente esta máquina?</p>
                          <div className="grid grid-cols-4 gap-2">
                            {[
                              { label: 'Pecho', icon: '🏋️' },
                              { label: 'Espalda', icon: '💪' },
                              { label: 'Hombros', icon: '🔥' },
                              { label: 'Brazos', icon: '💪' },
                              { label: 'Piernas', icon: '🦵' },
                              { label: 'Abdomen/Core', icon: '🤸' },
                              { label: 'Cardio', icon: '❤️' },
                              { label: 'Otro', icon: '📌' },
                            ].map(group => (
                              <motion.button
                                key={group.label}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                  setMachineForm(f => ({
                                    ...f,
                                    muscleGroups: f.muscleGroups.includes(group.label)
                                      ? f.muscleGroups.filter(g => g !== group.label)
                                      : [...f.muscleGroups, group.label]
                                  }))
                                }}
                                className="px-3 py-3 rounded-xl text-xs font-bold text-center flex flex-col items-center gap-1"
                                style={{
                                  background: machineForm.muscleGroups.includes(group.label) ? `${BLUE}12` : 'rgba(0,0,0,0.03)',
                                  color: machineForm.muscleGroups.includes(group.label) ? BLUE : 'rgba(0,0,0,0.35)',
                                  border: `1px solid ${machineForm.muscleGroups.includes(group.label) ? `${BLUE}25` : 'rgba(0,0,0,0.06)'}`,
                                }}
                              >
                                <span className="text-base">{group.icon}</span>
                                <span>{group.label}</span>
                              </motion.button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.6)' }}>Nivel Recomendado</label>
                          <div className="flex gap-2">
                            {(['principiante', 'intermedio', 'avanzado'] as const).map(level => {
                              const lvlColor = level === 'principiante' ? BLUE : level === 'intermedio' ? '#F1C827' : '#F43843'
                              return (
                                <motion.button
                                  key={level}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => setMachineForm(f => ({ ...f, recommendedLevel: level }))}
                                  className="flex-1 py-2.5 rounded-xl text-xs font-bold capitalize"
                                  style={{
                                    background: machineForm.recommendedLevel === level ? `${lvlColor}15` : 'rgba(0,0,0,0.03)',
                                    color: machineForm.recommendedLevel === level ? lvlColor : 'rgba(0,0,0,0.25)',
                                    border: `1px solid ${machineForm.recommendedLevel === level ? `${lvlColor}30` : 'rgba(0,0,0,0.06)'}`,
                                  }}
                                >
                                  {level}
                                </motion.button>
                              )
                            })}
                          </div>
                        </div>
                        <div>
                          <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.6)' }}>Observaciones <span style={{ color: 'rgba(0,0,0,0.2)' }}>(Opcional)</span></label>
                          <textarea
                            value={machineForm.observations}
                            onChange={e => setMachineForm(f => ({ ...f, observations: e.target.value }))}
                            placeholder="Notas adicionales sobre la máquina..."
                            rows={2}
                            className="w-full px-3 py-2 rounded-xl text-xs font-medium outline-none resize-none transition-all duration-200"
                            style={{ background: meshInputBg, color: '#1A1A1E', border: '1px solid transparent' }}
                            onMouseEnter={e => { if (e.target !== document.activeElement) { e.target.style.background = meshInputHover; e.target.style.borderColor = 'rgba(0,0,0,0.06)' } }}
                            onMouseLeave={e => { if (e.target !== document.activeElement) { e.target.style.background = meshInputBg; e.target.style.borderColor = 'transparent' } }}
                            onFocus={e => { e.target.style.borderColor = BLUE; e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(18,112,183,0.04)'; e.target.style.boxShadow = '0 0 0 3px rgba(18,112,183,0.08)' }}
                            onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.background = meshInputBg; e.target.style.boxShadow = 'none' }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Step 3 — Exercises */}
                    {machineStep === 2 && (
                      <div className="space-y-4">
                        <div>
                          <label className="text-[11px] font-bold block mb-3" style={{ color: 'rgba(0,0,0,0.6)' }}>Ejercicios</label>
                          {/* "Crear nuevo ejercicio" button above selected */}
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => { openAddExercise(); setShowExerciseManager(true) }}
                            className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold mb-3"
                            style={{
                              background: `${BLUE}08`,
                              color: BLUE,
                              border: `1px solid ${BLUE}20`,
                            }}
                          >
                            <Plus size={14} /> Crear nuevo ejercicio
                          </motion.button>
                          <div
                            className="max-h-40 overflow-y-auto rounded-xl p-2"
                            style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.06)' }}
                          >
                            {globalExercises.length === 0 ? (
                              <p className="text-xs py-3 text-center" style={{ color: 'rgba(0,0,0,0.2)' }}>
                                No hay ejercicios registrados. Crea uno nuevo arriba.
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
                        <div>
                          <label className="text-[11px] font-bold mb-2 block" style={{ color: 'rgba(0,0,0,0.6)' }}>
                            Ejercicios Seleccionados ({machineForm.selectedIds.length})
                          </label>
                          <div
                            className="min-h-[70px] rounded-xl p-3"
                            style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.06)' }}
                          >
                            {machineForm.selectedIds.length === 0 ? (
                              <p className="text-xs py-1 text-center" style={{ color: 'rgba(0,0,0,0.2)' }}>
                                Aún no has seleccionado ejercicios
                              </p>
                            ) : (
                              <div className="flex flex-wrap gap-1.5">
                                {machineForm.selectedIds.map(id => {
                                  const ex = globalExercises.find(e => e.id === id)
                                  return ex ? (
                                    <div
                                      key={id}
                                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium"
                                      style={{
                                        background: `${BLUE}08`,
                                        border: `1px solid ${BLUE}20`,
                                        color: BLUE,
                                      }}
                                    >
                                      <span>{ex.name}</span>
                                      <motion.button
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.8 }}
                                        onClick={() => toggleExerciseSelection(id)}
                                        className="w-3.5 h-3.5 rounded-full flex items-center justify-center"
                                        style={{ color: BLUE }}
                                      >
                                        <X size={10} />
                                      </motion.button>
                                    </div>
                                  ) : null
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ── Footer ── */}
                  <div className="flex-shrink-0 p-6 pt-4" style={{
                    borderTop: '1px solid rgba(0,0,0,0.04)',
                    background: 'rgba(255,255,255,0.8)',
                  }}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 flex justify-start">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setMachineStep(s => s - 1)}
                          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium cursor-pointer"
                          style={{ background: 'rgba(0,0,0,0.04)', color: machineStep > 0 ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.15)' }}
                        >
                          <ChevronLeft size={14} />
                          Atrás
                        </motion.button>
                      </div>
                      <div className="flex-1 flex justify-end">
                        <motion.button
                          whileHover={machineStep < 2 || (machineStep === 2 && true) ? { scale: 1.06, boxShadow: '0 8px 30px rgba(18,112,183,0.35), 0 0 60px rgba(18,112,183,0.1)' } : {}}
                          whileTap={{ scale: 0.92 }}
                          onClick={() => { if (machineStep < 2) setMachineStep(s => s + 1); else saveMachine() }}
                          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
                          style={{
                            background: machineStep === 0 && (!machineForm.name.trim() || !machineForm.zone.trim()) ? 'rgba(0,0,0,0.15)' : BLUE_GRAD,
                            cursor: machineStep === 0 && (!machineForm.name.trim() || !machineForm.zone.trim()) ? 'not-allowed' : 'pointer',
                          }}
                        >
                          {machineStep < 2 ? (
                            <>
                              Siguiente <ChevronRight size={14} />
                            </>
                          ) : (
                            editingMachine ? 'Guardar Cambios' : 'Registrar Máquina'
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence></>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Image Editor Modal ── */}
      <AnimatePresence>
        {showImageEditor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowImageEditor(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              className="rounded-3xl w-full max-w-xl flex flex-col mx-4 overflow-hidden"
              style={{
                background: '#FFFFFF',
                border: '1px solid rgba(0,0,0,0.04)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.12)',
                maxHeight: '90vh',
              }}
            >
              <div className="flex items-center justify-between p-4 pb-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                <h2 className="text-base font-bold" style={{ color: '#1A1A1E' }}>Editar imagen</h2>
                <motion.button
                  whileHover={{ scale: 1.15, background: 'rgba(244,56,67,0.1)', color: RED }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowImageEditor(false)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.3)' }}
                >
                  <X size={15} />
                </motion.button>
              </div>

              <div className="flex" style={{ height: 380, background: '#f5f5f5' }}>
                <div className="flex-1 relative">
                  <Cropper
                    image={imageToEdit}
                    crop={crop}
                    zoom={zoom}
                    aspect={4 / 3}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={(_: unknown, pixels) => setCroppedAreaPixels(pixels)}
                    style={{ containerStyle: { borderRadius: 0 } }}
                    imgStyle={{ filter: getCinematicFilter(cinematicIntensity) }}
                  />
                </div>

                {/* Live previews */}
                <div className="flex-shrink-0 w-[200px] p-3 flex flex-col gap-4 overflow-y-auto">
                  {/* Card preview */}
                  <div>
                    <span className="text-[9px] font-bold block mb-1.5" style={{ color: 'rgba(0,0,0,0.3)' }}>VISTA EN TARJETAS</span>
                    <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.06)' }}>
                      <div style={{ width: 176, height: 132 }}>
                        <div className="w-full h-full overflow-hidden relative">
                          {croppedAreaPixels && naturalSize.width > 0 ? (
                            <img
                              src={imageToEdit}
                              alt=""
                              className="absolute"
                              style={{
                                width: naturalSize.width * (176 / croppedAreaPixels.width),
                                height: naturalSize.height * (176 / croppedAreaPixels.width),
                                transform: `translate(${-croppedAreaPixels.x * (176 / croppedAreaPixels.width)}px, ${-croppedAreaPixels.y * (176 / croppedAreaPixels.width)}px)`,
                                filter: getCinematicFilter(cinematicIntensity),
                                maxWidth: 'none',
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-[9px]" style={{ color: 'rgba(0,0,0,0.15)' }}>—</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phone screen preview */}
                  <div>
                    <span className="text-[9px] font-bold block mb-1.5" style={{ color: 'rgba(0,0,0,0.3)' }}>VISTA EN APP MÓVIL</span>
                    <div className="mx-auto rounded-[18px] overflow-hidden" style={{ border: '2px solid rgba(0,0,0,0.12)', background: '#fff' }}>
                      <div style={{ width: 120, height: 213 }}>
                        <div className="w-full h-full overflow-hidden relative">
                          {croppedAreaPixels && naturalSize.width > 0 ? (
                            <img
                              src={imageToEdit}
                              alt=""
                              className="absolute"
                              style={{
                                width: naturalSize.width * (120 / croppedAreaPixels.width),
                                height: naturalSize.height * (120 / croppedAreaPixels.width),
                                transform: `translate(${-croppedAreaPixels.x * (120 / croppedAreaPixels.width)}px, ${-croppedAreaPixels.y * (120 / croppedAreaPixels.width)}px)`,
                                filter: getCinematicFilter(cinematicIntensity),
                                maxWidth: 'none',
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-[9px]" style={{ color: 'rgba(0,0,0,0.15)' }}>—</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cinematic intensity */}
              <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold" style={{ color: 'rgba(0,0,0,0.35)' }}>ESTILO CINEMATOGRÁFICO</span>
                  <span className="text-[10px] font-bold" style={{ color: cinematicIntensity > 50 ? '#F43843' : BLUE }}>{cinematicIntensity}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={cinematicIntensity}
                  onChange={e => setCinematicIntensity(Number(e.target.value))}
                  className="w-full"
                  style={{ accentColor: cinematicIntensity > 50 ? '#F43843' : BLUE }}
                />
                <div className="flex justify-between text-[9px] mt-1" style={{ color: 'rgba(0,0,0,0.2)' }}>
                  <span>Original</span>
                  <span>Cinematográfico</span>
                </div>
              </div>

              {/* Zoom */}
              <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                <span className="text-[10px] font-bold flex-shrink-0" style={{ color: 'rgba(0,0,0,0.35)' }}>ZOOM</span>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={e => setZoom(Number(e.target.value))}
                  className="w-full"
                  style={{ accentColor: BLUE }}
                />
                <span className="text-[10px] font-bold flex-shrink-0" style={{ color: 'rgba(0,0,0,0.4)' }}>{zoom.toFixed(1)}x</span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 p-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowImageEditor(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium"
                  style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.5)' }}
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: '0 8px 25px rgba(18,112,183,0.35)' }}
                  whileTap={{ scale: 0.92 }}
                  onClick={applyCropAndFilter}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white"
                  style={{ background: BLUE_GRAD }}
                >
                  Aplicar
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
