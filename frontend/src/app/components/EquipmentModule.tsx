import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Cropper from 'react-easy-crop'
import confetti from 'canvas-confetti'
import {
  Search, Plus, Dumbbell, X, List, Upload, Pencil, Trash2,
  ChevronDown, ChevronRight, ChevronLeft, Check, Camera,
} from 'lucide-react'
import { WeightsView } from './WeightsModel'
import { TrashView } from './TrashModel'
import { PenView } from './PenModel'
import machineImg from '../../assets/illustrations/objects/machine.png'
import machineExercisesImg from '../../assets/illustrations/objects/machine_exercises.png'
import modalExercisesImg from '../../assets/illustrations/characters/modal_exercises.png'
import coachCongratsImg from '../../assets/illustrations/characters/coach_congratulations.png'
import coachExerciseSuccessImg from '../../assets/illustrations/characters/coach_exercise_success.png'
import machineTreadmillImg from '../../assets/illustrations/objects/machine-treadmill.png'
import chestIcon from '../../assets/icons/muscles/chest.webp'
import backIcon from '../../assets/icons/muscles/back.webp'
import shouldersIcon from '../../assets/icons/muscles/shoulders.webp'
import armIcon from '../../assets/icons/muscles/arm.webp'
import legIcon from '../../assets/icons/muscles/leg.webp'
import absIcon from '../../assets/icons/muscles/abs.webp'
import cardioIcon from '../../assets/icons/muscles/cardio.webp'
import fullBodyIcon from '../../assets/icons/muscles/full-body.webp'
import checkSuccessImg from '../../assets/objects/ui/check_success.png'

const muscleIcons: Record<string, string> = {
  Pecho: chestIcon,
  Espalda: backIcon,
  Hombros: shouldersIcon,
  Brazos: armIcon,
  Piernas: legIcon,
  'Abdomen/Core': absIcon,
  Cardio: cardioIcon,
  'General': fullBodyIcon,
}

const BLUE = '#1270B7'
const GREEN = '#30D158'
const YELLOW = '#F1C827'
const RED = '#F43843'
const ORANGE = '#FF9500'
const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #7ec8e3)'
const GREEN_GRAD = 'linear-gradient(135deg, #00fb64, #009b95)'
const ORANGE_GRAD = 'linear-gradient(135deg, #FF9500, #FF6B00)'

type Status = 'active' | 'maintenance' | 'inactive'

interface Exercise {
  id: number
  name: string
  zone: string
  description: string
  status: Status
  muscleGroups: string[]
  recommendedLevel: 'principiante' | 'intermedio' | 'avanzado'
  imageUrl: string
  videoUrl: string
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

const defaultExFields = {
  description: '', status: 'active' as Status,
  muscleGroups: [] as string[], recommendedLevel: 'principiante' as 'principiante' | 'intermedio' | 'avanzado',
  imageUrl: '', videoUrl: '',
}
const initialExercises: Exercise[] = [
  { id: 1, name: 'Caminata', zone: 'Cardio', ...defaultExFields, muscleGroups: ['Cardio', 'Piernas'] },
  { id: 2, name: 'Trote', zone: 'Cardio', ...defaultExFields, muscleGroups: ['Cardio', 'Piernas'] },
  { id: 3, name: 'Intervalos', zone: 'Cardio', ...defaultExFields, muscleGroups: ['Cardio'] },
  { id: 4, name: 'Ciclismo', zone: 'Cardio', ...defaultExFields, muscleGroups: ['Cardio', 'Piernas'] },
  { id: 5, name: 'Caminata Elíptica', zone: 'Cardio', ...defaultExFields, muscleGroups: ['Cardio'] },
  { id: 6, name: 'Sentadilla', zone: 'Pesas Libres', ...defaultExFields, muscleGroups: ['Piernas'] },
  { id: 7, name: 'Press Hombros', zone: 'Pesas Libres', ...defaultExFields, muscleGroups: ['Hombros'] },
  { id: 8, name: 'Press Plano', zone: 'Pesas Libres', ...defaultExFields, muscleGroups: ['Pecho'] },
  { id: 9, name: 'Press Inclinado', zone: 'Pesas Libres', ...defaultExFields, muscleGroups: ['Pecho'] },
  { id: 10, name: 'Press Declinado', zone: 'Pesas Libres', ...defaultExFields, muscleGroups: ['Pecho'] },
  { id: 11, name: 'Cruce de Cables', zone: 'Máquinas', ...defaultExFields, muscleGroups: ['Pecho', 'Brazos'] },
  { id: 12, name: 'Polea Alta', zone: 'Máquinas', ...defaultExFields, muscleGroups: ['Espalda', 'Brazos'] },
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
  viewMode: 'machines' | 'exercises'
  onViewModeChange: (v: 'machines' | 'exercises') => void
  onSearchChange: (v: string) => void
  onSearchFocus: (v: boolean) => void
  onStatusFilterChange: (v: Status | 'all') => void
}

export default function EquipmentModule({ search, searchFocused, statusFilter, showBlur, viewMode, onViewModeChange, onSearchChange, onSearchFocus, onStatusFilterChange }: Props) {
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
  const [previewMachine, setPreviewMachine] = useState<Machine | null>(null)
  const [previewMuscleFilter, setPreviewMuscleFilter] = useState<string>('all')
  const [previewExercise, setPreviewExercise] = useState<Exercise | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'machine' | 'exercise'; id: number } | null>(null)
  const [showCreatedToast, setShowCreatedToast] = useState(false)
  const [createdMachineName, setCreatedMachineName] = useState('')
  const [toastProgress, setToastProgress] = useState(100)
  const [showDeletedToast, setShowDeletedToast] = useState(false)
  const [deletedName, setDeletedName] = useState('')
  const [toastDeletedProgress, setToastDeletedProgress] = useState(100)
  const [showEditedToast, setShowEditedToast] = useState(false)
  const [editedName, setEditedName] = useState('')
  const [toastEditedProgress, setToastEditedProgress] = useState(100)
  const [showExerciseManager, setShowExerciseManager] = useState(false)
  const [machineSuccess, setMachineSuccess] = useState(false)
  const [machConfirmClose, setMachConfirmClose] = useState(false)
  const [exStep, setExStep] = useState(0)
  const [exSuccess, setExSuccess] = useState(false)
  const [exConfirmClose, setExConfirmClose] = useState(false)
  const [exAskCreateAnother, setExAskCreateAnother] = useState(false)
  const [exCreatedCount, setExCreatedCount] = useState(0)
  const [exForm, setExForm] = useState({
    name: '', zone: '', description: '', status: 'active' as Status,
    muscleGroups: [] as string[], recommendedLevel: 'principiante' as 'principiante' | 'intermedio' | 'avanzado',
    imageUrl: '', videoUrl: '',
  })
  const [exEditing, setExEditing] = useState<Exercise | null>(null)
  const [exFilterZone, setExFilterZone] = useState('')
  const [activeMuscleFilter, setActiveMuscleFilter] = useState('Todos')
  const [showMuscleDropdown, setShowMuscleDropdown] = useState(false)
  const muscleDropdownRef = useRef<HTMLButtonElement>(null)

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

  useEffect(() => {
    setActiveMuscleFilter('Todos')
  }, [machineStep])

  useEffect(() => {
    if (showCreatedToast) {
      setToastProgress(100)
      const start = Date.now()
      const duration = 4500
      const interval = setInterval(() => {
        const elapsed = Date.now() - start
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
        setToastProgress(remaining)
        if (remaining <= 0) clearInterval(interval)
      }, 30)
      return () => clearInterval(interval)
    }
  }, [showCreatedToast])

  useEffect(() => {
    if (showDeletedToast) {
      setToastDeletedProgress(100)
      const start = Date.now()
      const duration = 4500
      const interval = setInterval(() => {
        const elapsed = Date.now() - start
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
        setToastDeletedProgress(remaining)
        if (remaining <= 0) clearInterval(interval)
      }, 30)
      return () => clearInterval(interval)
    }
  }, [showDeletedToast])

  useEffect(() => {
    if (showEditedToast) {
      setToastEditedProgress(100)
      const start = Date.now()
      const duration = 4500
      const interval = setInterval(() => {
        const elapsed = Date.now() - start
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
        setToastEditedProgress(remaining)
        if (remaining <= 0) clearInterval(interval)
      }, 30)
      return () => clearInterval(interval)
    }
  }, [showEditedToast])

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

  const muscleToZones: Record<string, string[]> = {
    Cardio: ['Cardio'],
    Pecho: ['Pesas Libres', 'Máquinas'],
    Espalda: ['Pesas Libres', 'Máquinas'],
    Hombros: ['Pesas Libres', 'Máquinas'],
    Brazos: ['Pesas Libres', 'Máquinas'],
    Piernas: ['Pesas Libres', 'Máquinas'],
    'Abdomen/Core': ['Pesas Libres'],
    'General': zones.filter(z => z !== 'Máquinas'),
  }

  const filteredZones = useMemo(() => {
    if (machineForm.muscleGroups.length === 0) return zones
    const selected = new Set<string>()
    machineForm.muscleGroups.forEach(mg => {
      const mapped = muscleToZones[mg]
      if (mapped) mapped.forEach(z => selected.add(z))
    })
    return zones.filter(z => selected.has(z))
  }, [machineForm.muscleGroups, zones])

  const muscleExercises = useMemo(() => {
    if (activeMuscleFilter === 'Todos') return globalExercises.filter(e => e.zone !== 'Máquinas')
    const zonesForMuscle = (muscleToZones[activeMuscleFilter] || []).filter(z => z !== 'Máquinas')
    return globalExercises.filter(e => zonesForMuscle.includes(e.zone))
  }, [activeMuscleFilter, globalExercises])

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
    if (!machineForm.name.trim()) return
    const data = {
      name: machineForm.name.trim(),
      zone: machineForm.muscleGroups.join(', ') || 'General',
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
      setEditedName(data.name)
      setShowEditedToast(true)
      setToastEditedProgress(100)
      setTimeout(() => setShowEditedToast(false), 4500)
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
    setExStep(0)
    setExSuccess(false)
    setExForm({
      name: '', zone: '', description: '', status: 'active',
      muscleGroups: [], recommendedLevel: 'principiante',
      imageUrl: '', videoUrl: '',
    })
  }

  function openEditExercise(e: Exercise) {
    setExEditing(e)
    setExStep(0)
    setExSuccess(false)
    setShowExerciseManager(true)
    setExForm({
      name: e.name, zone: e.zone, description: e.description, status: e.status,
      muscleGroups: [...e.muscleGroups], recommendedLevel: e.recommendedLevel,
      imageUrl: e.imageUrl, videoUrl: e.videoUrl,
    })
  }

  function saveExercise() {
    if (!exForm.name.trim()) return
    const zoneFromGroups = exForm.muscleGroups.length > 0
      ? (exForm.muscleGroups.includes('General') ? [...new Set(['Cardio', 'Pesas Libres'])] : exForm.muscleGroups.flatMap(g => muscleToZones[g] || []))
      : []
    const zone = zoneFromGroups.length > 0 ? zoneFromGroups[0] : (exForm.zone || 'Cardio')
    const data = {
      name: exForm.name.trim(), zone,
      description: exForm.description, status: exForm.status,
      muscleGroups: exForm.muscleGroups, recommendedLevel: exForm.recommendedLevel,
      imageUrl: exForm.imageUrl, videoUrl: exForm.videoUrl,
    }
    if (!exEditing) {
      setGlobalExercises(prev => [...prev, { id: nextExerciseId, ...data }])
      setExCreatedCount(c => c + 1)
      setExAskCreateAnother(true)
    } else {
      setGlobalExercises(prev => prev.map(e =>
        e.id === exEditing.id ? { ...e, ...data } : e
      ))
      setShowExerciseManager(false)
      setExSuccess(false)
      setExEditing(null)
      setEditedName(data.name)
      setShowEditedToast(true)
      setToastEditedProgress(100)
      setTimeout(() => setShowEditedToast(false), 4500)
    }
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
                  className="relative w-80 h-96 rounded-3xl flex flex-col items-center justify-end p-8 overflow-hidden cursor-pointer"
                  style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
                >
                  <img src={machineExercisesImg} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none scale-125 translate-y-6" />
                  <div className="absolute inset-0 pointer-events-none" style={{
                    background: 'linear-gradient(to top, rgba(18,112,183,0.95) 0%, rgba(18,112,183,0.6) 50%, rgba(0,0,0,0.5) 100%)',
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
                  className="relative w-80 h-96 rounded-3xl flex flex-col items-center justify-end p-8 overflow-hidden cursor-pointer"
                  style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
                >
                  <img src={modalExercisesImg} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none scale-150 -translate-y-2 translate-x-20" />
                  <div className="absolute inset-0 pointer-events-none" style={{
                    background: 'linear-gradient(to top, rgba(48,209,88,0.95) 0%, rgba(48,209,88,0.6) 50%, rgba(0,0,0,0.5) 100%)',
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

      {viewMode === 'machines' ? (
        /* ── Machines Grid ── */
        <div className="grid grid-cols-3 gap-4">
          {filtered.map((machine, i) => {
            const machineExercises = getMachineExercises(machine)
            return (
              <motion.div
                key={machine.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * i, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.04, boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setPreviewMachine(machine); setPreviewMuscleFilter('all') }}
                className="rounded-2xl premium-card cursor-pointer"
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
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-[#1A1A1E] text-base leading-tight">{machine.name}</h3>
                    <StatusBadge status={machine.status} />
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {machine.muscleGroups.map((mg, i) => (
                      muscleIcons[mg] ? (
                        <div key={i} className="relative group">
                          <div className="flex items-center justify-center rounded-full" style={{ width: 38, height: 38, background: 'linear-gradient(180deg, #ffffff 0%, #DBEAFE 100%)', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
                            <img src={muscleIcons[mg]} alt="" className="w-5 h-5" />
                          </div>
                          <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg whitespace-nowrap text-[10px] font-medium pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10" style={{ background: 'rgba(0,0,0,0.7)', color: '#FFFFFF' }}>
                            {mg}
                          </div>
                        </div>
                      ) : null
                    ))}
                  </div>
                </div>

                <div className="px-5 pb-3 flex justify-center" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                  <span className="text-[11px] font-bold text-center" style={{ color: BLUE }}>
                    {machineExercises.length} ejercicio{machineExercises.length !== 1 ? 's' : ''}
                  </span>
                </div>

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
      ) : (
        /* ── Exercises Grid ── */
        <div className="grid grid-cols-3 gap-4">
          {filteredExercises.length === 0 ? (
            <div className="col-span-3 py-16 text-center">
              <p className="text-lg font-bold" style={{ color: 'rgba(0,0,0,0.2)' }}>No se encontraron ejercicios</p>
              <p className="text-sm mt-1" style={{ color: 'rgba(0,0,0,0.15)' }}>Agrega ejercicios para verlos aquí.</p>
            </div>
          ) : (
            filteredExercises.map((ex, i) => (
              <motion.div
                key={ex.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * i, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.04, boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPreviewExercise(ex)}
                className="rounded-2xl premium-card cursor-pointer"
                style={{
                  background: 'rgba(255,255,255,0.85)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.6)',
                  boxShadow: '0 2px 20px rgba(0,0,0,0.04)',
                }}
              >
                {/* Exercise image */}
                <div className="w-full overflow-hidden relative" style={{ height: 96, background: 'radial-gradient(ellipse at 30% 20%, rgba(48,209,88,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(10,132,255,0.05) 0%, transparent 50%)' }}>
                  {ex.imageUrl ? (
                    <img src={ex.imageUrl} alt={ex.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Dumbbell size={24} style={{ color: 'rgba(48,209,88,0.3)' }} />
                    </div>
                  )}
                  <div className="absolute inset-0" style={{
                    background: 'linear-gradient(180deg, transparent 40%, rgba(48,209,88,0.08) 100%)',
                    pointerEvents: 'none',
                  }} />
                </div>

                <div className="px-5 pt-4 pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-[#1A1A1E] text-base leading-tight">{ex.name}</h3>
                    <StatusBadge status={ex.status} />
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {ex.muscleGroups.map((mg, i) => (
                      muscleIcons[mg] ? (
                        <div key={i} className="relative group">
                          <div className="flex items-center justify-center rounded-full" style={{ width: 38, height: 38, background: 'linear-gradient(180deg, #ffffff 0%, #DBEAFE 100%)', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
                            <img src={muscleIcons[mg]} alt="" className="w-5 h-5" />
                          </div>
                          <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg whitespace-nowrap text-[10px] font-medium pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10" style={{ background: 'rgba(0,0,0,0.7)', color: '#FFFFFF' }}>
                            {mg}
                          </div>
                        </div>
                      ) : null
                    ))}
                  </div>
                </div>

                <div className="px-5 pb-3 flex justify-center" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                  <span className="text-[11px] font-bold text-center px-2 py-0.5 rounded-md" style={{
                    background: ex.recommendedLevel === 'principiante' ? 'rgba(48,209,88,0.1)' : ex.recommendedLevel === 'intermedio' ? 'rgba(245,166,35,0.1)' : 'rgba(244,56,67,0.1)',
                    color: ex.recommendedLevel === 'principiante' ? '#30D158' : ex.recommendedLevel === 'intermedio' ? '#F5A623' : '#F43843',
                  }}>
                    {ex.recommendedLevel === 'principiante' ? 'Principiante' : ex.recommendedLevel === 'intermedio' ? 'Intermedio' : 'Avanzado'}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* ── Machine Modal (3-step) ── */}
      <AnimatePresence>
        {showMachineModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)' }}
            onClick={() => setMachConfirmClose(true)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              className="rounded-3xl w-full flex flex-col mx-4 relative"
              style={machineSuccess ? {
                background: '#FFFFFF',
                border: '1px solid rgba(0,0,0,0.04)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.12)',
                maxWidth: 672,
                overflow: 'visible',
              } : {
                background: '#FFFFFF',
                border: '1px solid rgba(0,0,0,0.04)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.12)',
                maxHeight: '90vh',
                maxWidth: 576,
                overflow: showMuscleDropdown ? 'visible' : 'hidden',
                clipPath: showMuscleDropdown ? 'inset(0 round 24px)' : 'none',
              }}
            >
              {machineSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center px-6 pb-8 relative"
                  style={{ overflow: 'visible' }}
                >
                  <div className="relative flex items-center justify-center z-10" style={{ marginTop: '-120px', marginBottom: '1.5rem' }}>
                    {/* Treadmill - small behind coach */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-20 h-20 pointer-events-none z-0" style={{ opacity: 0.4 }}>
                      <img src={machineTreadmillImg} alt="" className="w-full h-full object-contain" />
                    </div>
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
                        src={coachCongratsImg}
                        alt="felicitaciones"
                        className="w-72 h-auto object-contain relative z-10"
                        style={{}}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                      />
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-48 pointer-events-none z-20" style={{
                        background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 15%, rgba(255,255,255,0) 55%)',
                      }} />
                    </div>
                  </div>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="text-3xl font-bold text-center z-10"
                    style={{ color: '#1A1A1E' }}
                  >
                    ¡Registro Exitoso!
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="text-sm text-center mt-1.5 mb-8 z-10"
                    style={{ color: 'rgba(0,0,0,0.7)' }}
                  >
                    <span style={{ background: 'linear-gradient(135deg, #30D158, #0A84FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700 }}>La máquina</span> se registró exitosamente.<br />
                    <span className="text-xs" style={{ color: 'rgba(0,0,0,0.4)' }}>Ahora está disponible para ser utilizada<br />en las rutinas del gimnasio.</span>
                  </motion.p>
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setShowMachineModal(false); setMachineSuccess(false); setCreatedMachineName(machineForm.name.trim()); setShowCreatedToast(true); setToastProgress(100); setTimeout(() => setShowCreatedToast(false), 4500) }}
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
                      <div className="flex items-center justify-between px-4 pt-4 pb-0">
                        <div className="flex-1" />
                        {editingMachine ? (
                          <div className="flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2">
                            <div className="w-5 h-5 flex-shrink-0">
                              <PenView />
                            </div>
                            <span className="text-[10px] font-bold" style={{ color: 'rgba(0,0,0,0.25)' }}>Editando...</span>
                          </div>
                        ) : null}
                        <motion.button
                          whileHover={{ scale: 1.15, background: 'rgba(244,56,67,0.1)', color: RED }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setMachConfirmClose(true)}
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
                            background: s === machineStep + 1 ? (editingMachine ? ORANGE_GRAD : BLUE_GRAD) : 'rgba(0,0,0,0.12)',
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
                            whileHover={{ scale: 1.03 }}
                            transition={{ duration: 0.2 }}
                            className="w-full h-40 rounded-xl cursor-pointer overflow-hidden relative group"
                            style={{
                              background: machineForm.imageDataUrl ? 'radial-gradient(ellipse at 30% 20%, rgba(48,209,88,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(48,209,88,0.08) 0%, transparent 50%), rgba(255,255,255,0.6)' : meshInputBg,
                              border: `1px solid ${machineForm.imageDataUrl ? 'rgba(48,209,88,0.2)' : 'transparent'}`,
                            }}
                            onClick={() => document.getElementById('machine-image-input')?.click()}
                            onMouseEnter={e => { if (!machineForm.imageDataUrl) { e.currentTarget.style.background = meshInputHover; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)' } }}
                            onMouseLeave={e => { if (!machineForm.imageDataUrl) { e.currentTarget.style.background = meshInputBg; e.currentTarget.style.borderColor = 'transparent' } }}
                          >
                            {machineForm.imageDataUrl ? (
                              <>
                                <img src={machineForm.imageDataUrl} alt="" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200" style={{ background: 'rgba(0,0,0,0.45)' }}>
                                  <Camera size={24} className="text-white" />
                                  <span className="text-xs font-semibold text-white">Cambiar imagen</span>
                                </div>
                              </>
                            ) : (
                              <div className="flex flex-col items-center gap-1.5 py-6">
                                <Upload size={18} style={{ color: 'rgba(0,0,0,0.2)' }} />
                                <span className="text-xs font-medium" style={{ color: 'rgba(0,0,0,0.2)' }}>Subir imagen</span>
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
                        <div>
                          <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.6)' }}>Descripción</label>
                          <textarea
                            value={machineForm.description}
                            onChange={e => setMachineForm(f => ({ ...f, description: e.target.value }))}
                            placeholder="Describe brevemente la máquina..."
                            rows={2}
                            className="w-full px-3 py-2 rounded-xl text-xs font-medium outline-none resize-none transition-all duration-200"
                            style={{ background: meshInputBg, color: '#1A1A1E', border: '1px solid transparent' }}
                            onMouseEnter={e => { if (e.target !== document.activeElement) { e.target.style.background = meshInputHover; e.target.style.borderColor = 'rgba(0,0,0,0.06)' } }}
                            onMouseLeave={e => { if (e.target !== document.activeElement) { e.target.style.background = meshInputBg; e.target.style.borderColor = 'transparent' } }}
                            onFocus={e => { e.target.style.borderColor = BLUE; e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(18,112,183,0.04)'; e.target.style.boxShadow = '0 0 0 3px rgba(18,112,183,0.08)' }}
                            onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.background = meshInputBg; e.target.style.boxShadow = 'none' }}
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.6)' }}>Estado</label>
                          <div className="flex gap-2">
                            {(['active', 'maintenance', 'inactive'] as const).map(s => {
                              const sel = machineForm.status === s
                              const c = statusConfig[s].color
                              const grad = `linear-gradient(135deg, ${c}, ${c}cc)`
                              return (
                                <motion.button
                                  key={s}
                                  whileHover={{ scale: 1.06 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setMachineForm(f => ({ ...f, status: s }))}
                                  onMouseEnter={e => { if (!sel) { e.currentTarget.style.background = `${c}18`; e.currentTarget.style.color = c } }}
                                  onMouseLeave={e => { if (!sel) { e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; e.currentTarget.style.color = 'rgba(0,0,0,0.25)' } }}
                                  className="flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all duration-200"
                                  style={{
                                    background: sel ? grad : 'rgba(0,0,0,0.03)',
                                    color: sel ? '#FFFFFF' : 'rgba(0,0,0,0.25)',
                                    border: '1px solid transparent',
                                    boxShadow: sel ? `0 4px 16px ${c}40` : 'none',
                                  }}
                                >
                                  {statusConfig[s].label}
                                </motion.button>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2 — Description, Muscle Groups, Level, Observations */}
                    {machineStep === 1 && (
                      <div className="space-y-5">
                        <div>
                          <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.6)' }}>Grupos musculares</label>
                          <p className="text-[10px] mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>Selecciona uno o más grupos musculares que trabaja esta máquina.</p>
                          <div className="grid grid-cols-4 gap-2">
                            {[
                              'Pecho', 'Espalda', 'Hombros', 'Brazos',
                              'Piernas', 'Abdomen/Core', 'Cardio', 'General',
                            ].map(label => {
                              const selected = machineForm.muscleGroups.includes(label)
                              const isGeneral = label === 'General'
                              const GOLD_GRAD = 'linear-gradient(135deg, #F1C827, #FFE066)'
                              const defaultBg = 'rgba(0,0,0,0.03)'
                              const generalSelected = machineForm.muscleGroups.includes('General')
                              const disabled = generalSelected && !isGeneral
                              const hoverBg = isGeneral ? 'rgba(241,200,39,0.12)' : `${BLUE}12`
                              const selectedBg = isGeneral ? GOLD_GRAD : BLUE_GRAD
                              const textColor = selected ? '#FFFFFF' : disabled ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.35)'
                              const shadow = isGeneral
                                ? '0 4px 20px rgba(241,200,39,0.25)'
                                : `0 4px 20px ${BLUE}40`
                              return (
                                <motion.button
                                  key={label}
                                  whileHover={!disabled ? { scale: 1.06 } : {}}
                                  whileTap={!disabled ? { scale: 0.95 } : {}}
                                  onClick={() => {
                                    if (disabled) return
                                    if (isGeneral) {
                                      setMachineForm(f => ({
                                        ...f,
                                        muscleGroups: selected ? [] : ['General']
                                      }))
                                    } else if (generalSelected) {
                                      setMachineForm(f => ({
                                        ...f,
                                        muscleGroups: f.muscleGroups.includes(label)
                                          ? f.muscleGroups.filter(g => g !== 'General')
                                          : [...f.muscleGroups.filter(g => g !== 'General'), label]
                                      }))
                                    } else {
                                      setMachineForm(f => ({
                                        ...f,
                                        muscleGroups: f.muscleGroups.includes(label)
                                          ? f.muscleGroups.filter(g => g !== label)
                                          : [...f.muscleGroups, label]
                                      }))
                                    }
                                  }}
                                  onMouseEnter={e => { if (!selected && !disabled) { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = isGeneral ? '#B8860B' : BLUE } }}
                                  onMouseLeave={e => { if (!selected && !disabled) { e.currentTarget.style.background = defaultBg; e.currentTarget.style.color = 'rgba(0,0,0,0.35)' } }}
                                  className="flex flex-col items-center gap-1.5 px-3 py-3.5 rounded-xl text-xs font-bold transition-all duration-200"
                                  style={{
                                    background: selected ? selectedBg : defaultBg,
                                    color: textColor,
                                    border: '1px solid transparent',
                                    boxShadow: selected ? shadow : 'none',
                                    opacity: disabled ? 0.4 : 1,
                                    filter: disabled ? 'blur(0.6px)' : 'none',
                                    pointerEvents: disabled ? 'none' : 'auto',
                                    cursor: disabled ? 'not-allowed' : 'pointer',
                                  }}
                                >
                                  <motion.img
                                    src={muscleIcons[label]}
                                    alt=""
                                    className="mb-0.5"
                                    animate={{
                                      width: selected ? 48 : 24,
                                      height: selected ? 48 : 24,
                                      marginTop: selected ? -24 : 0,
                                      filter: selected ? 'blur(0px) drop-shadow(0 8px 20px rgba(0,0,0,0.15))' : disabled ? 'grayscale(0.6) blur(0px)' : 'blur(0px)',
                                      opacity: disabled ? 0.3 : 1,
                                    }}
                                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                  />
                                  <span>{label}</span>
                                </motion.button>
                              )
                            })}
                          </div>
                        </div>
                        <div>
                          <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.6)' }}>Nivel Recomendado</label>
                          <div className="flex gap-2">
                            {(['principiante', 'intermedio', 'avanzado'] as const).map(level => {
                              const lvlHex = level === 'principiante' ? '#1270B7' : level === 'intermedio' ? '#F1C827' : '#F43843'
                              const selected = machineForm.recommendedLevel === level
                              const selectedBg = `linear-gradient(135deg, ${lvlHex}, ${lvlHex}cc)`
                              const defaultBg = 'rgba(0,0,0,0.03)'
                              const hoverBg = `${lvlHex}1a`
                              return (
                                <motion.button
                                  key={level}
                                  whileHover={{ scale: 1.06 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setMachineForm(f => ({ ...f, recommendedLevel: level }))}
                                  onMouseEnter={e => { if (!selected) { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = lvlHex } }}
                                  onMouseLeave={e => { if (!selected) { e.currentTarget.style.background = defaultBg; e.currentTarget.style.color = 'rgba(0,0,0,0.25)' } }}
                                  className="flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all duration-200"
                                  style={{
                                    background: selected ? selectedBg : defaultBg,
                                    color: selected ? '#FFFFFF' : 'rgba(0,0,0,0.25)',
                                    border: '1px solid transparent',
                                    boxShadow: selected ? `0 4px 16px ${lvlHex}4d` : 'none',
                                  }}
                                >
                                  {level}
                                </motion.button>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 3 — Exercises */}
                    {machineStep === 2 && (
                      <div className="space-y-4">
                        <div>
                          <label className="text-[11px] font-bold block mb-3" style={{ color: 'rgba(0,0,0,0.6)' }}>Ejercicios</label>
                          {/* Muscle group dropdown */}
                          <div className="relative mb-3">
                            <motion.button
                              ref={muscleDropdownRef}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setShowMuscleDropdown(f => !f)}
                              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium outline-none cursor-pointer transition-all duration-200"
                              style={{
                                background: meshInputBg,
                                color: activeMuscleFilter === 'Todos' ? 'rgba(0,0,0,0.3)' : '#1A1A1E',
                                border: '1px solid transparent',
                              }}
                              onMouseEnter={e => { e.currentTarget.style.background = meshInputHover; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)' }}
                              onMouseLeave={e => { e.currentTarget.style.background = meshInputBg; e.currentTarget.style.borderColor = 'transparent' }}
                            >
                              {activeMuscleFilter !== 'Todos' ? (
                                <img src={muscleIcons[activeMuscleFilter]} alt="" className="w-5 h-5" />
                              ) : (
                                <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: `${BLUE}15` }}>
                                  <List size={12} style={{ color: BLUE }} />
                                </div>
                              )}
                              {activeMuscleFilter === 'Todos' ? 'Mostrar todos' : activeMuscleFilter}
                              <div className="flex-1" />
                              <motion.div
                                animate={{ rotate: showMuscleDropdown ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                                style={{ color: 'rgba(0,0,0,0.2)' }}
                              >
                                <ChevronDown size={14} />
                              </motion.div>
                            </motion.button>
                            <AnimatePresence initial={false}>
                              {showMuscleDropdown && (
                                <motion.div
                                  initial={{ opacity: 0, y: -4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -4 }}
                                  transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                                  className="absolute top-full left-0 right-0 z-50 mt-1 rounded-xl max-h-48 overflow-y-auto"
                                  style={{
                                    background: '#FFFFFF',
                                    border: '1px solid rgba(0,0,0,0.06)',
                                    boxShadow: '0 12px 40px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)',
                                  }}
                                >
                                  {[
                                    'Todos',
                                    ...(['Pecho', 'Espalda', 'Hombros', 'Brazos',
                                      'Piernas', 'Abdomen/Core', 'Cardio', 'General',
                                    ] as string[]).filter(g => machineForm.muscleGroups.includes(g)),
                                  ].map(label => {
                                    const isActive = activeMuscleFilter === label
                                    return (
                                      <motion.button
                                        key={label}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => { setActiveMuscleFilter(label); setShowMuscleDropdown(false) }}
                                        className="w-full flex items-center gap-2.5 px-3 py-3 text-xs font-medium transition-colors relative"
                                        style={{
                                          color: isActive ? '#FFFFFF' : 'rgba(0,0,0,0.6)',
                                          background: isActive ? BLUE_GRAD : 'transparent',
                                          borderBottom: '1px solid rgba(0,0,0,0.03)',
                                        }}
                                        onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = BLUE } }}
                                        onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(0,0,0,0.6)' } }}
                                      >
                                        {label === 'Todos' ? (
                                          <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: isActive ? 'rgba(255,255,255,0.2)' : `${BLUE}15` }}>
                                            <List size={12} style={{ color: isActive ? '#FFFFFF' : BLUE }} />
                                          </div>
                                        ) : (
                                          <img src={muscleIcons[label]} alt="" className="w-5 h-5" style={{ filter: isActive ? 'brightness(10)' : 'none' }} />
                                        )}
                                        <span className={isActive ? 'font-bold' : ''}>
                                          {label === 'Todos' ? 'Mostrar todos' : label}
                                        </span>
                                        {isActive && (
                                          <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="ml-auto"
                                          >
                                            <Check size={12} className="text-white" />
                                          </motion.div>
                                        )}
                                      </motion.button>
                                    )
                                  })}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                          {/* Exercises for selected muscle group */}
                          {activeMuscleFilter ? (
                            <div className="max-h-32 overflow-y-auto rounded-xl p-2" style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.06)' }}>
                              {muscleExercises.length === 0 ? (
                                <p className="text-xs py-3 text-center" style={{ color: 'rgba(0,0,0,0.2)' }}>
                                  No hay ejercicios disponibles para este grupo muscular
                                </p>
                              ) : (
                                <div className="space-y-1">
                                  {muscleExercises.map(ex => {
                                    const selected = machineForm.selectedIds.includes(ex.id)
                                    return (
                                      <motion.button
                                        key={ex.id}
                                        layout
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => toggleExerciseSelection(ex.id)}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200"
                                        style={{
                                          background: selected ? `${BLUE}08` : 'transparent',
                                          color: selected ? BLUE : 'rgba(0,0,0,0.5)',
                                          border: `1px solid ${selected ? `${BLUE}25` : 'transparent'}`,
                                        }}
                                        onMouseEnter={e => { if (!selected) { e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; e.currentTarget.style.color = BLUE } }}
                                        onMouseLeave={e => { if (!selected) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(0,0,0,0.5)' } }}
                                      >
                                        <div
                                          className="w-5 h-5 rounded-lg flex items-center justify-center transition-all duration-200"
                                          style={{
                                            background: selected ? BLUE_GRAD : 'rgba(0,0,0,0.05)',
                                            boxShadow: selected ? `0 2px 8px ${BLUE}50` : 'none',
                                          }}
                                        >
                                          {selected && (
                                            <motion.div
                                              initial={{ scale: 0 }}
                                              animate={{ scale: 1 }}
                                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                            >
                                              <Check size={11} className="text-white" />
                                            </motion.div>
                                          )}
                                        </div>
                                        {ex.name}
                                      </motion.button>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.06)' }}>
                              <p className="text-xs" style={{ color: 'rgba(0,0,0,0.2)' }}>
                                Selecciona un grupo muscular en el menú de arriba
                              </p>
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="text-[11px] font-bold mb-2 block" style={{ color: 'rgba(0,0,0,0.6)' }}>
                            Ejercicios Seleccionados ({machineForm.selectedIds.length})
                          </label>
                          <div
                            className="min-h-[70px] rounded-xl p-3 transition-all duration-200"
                            style={{
                              background: machineForm.selectedIds.length > 0 ? `${BLUE}06` : 'rgba(0,0,0,0.02)',
                              border: `1px solid ${machineForm.selectedIds.length > 0 ? `${BLUE}20` : 'rgba(0,0,0,0.06)'}`,
                            }}
                          >
                            {machineForm.selectedIds.length === 0 ? (
                              <p className="text-xs py-1 text-center" style={{ color: 'rgba(0,0,0,0.2)' }}>
                                Aún no has seleccionado ejercicios
                              </p>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                {machineForm.selectedIds.map(id => {
                                  const ex = globalExercises.find(e => e.id === id)
                                  return ex ? (
                                    <motion.div
                                      key={id}
                                      layout
                                      initial={{ scale: 0.8, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      exit={{ scale: 0.8, opacity: 0 }}
                                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold"
                                      style={{
                                        background: BLUE_GRAD,
                                        color: '#FFFFFF',
                                        boxShadow: `0 2px 8px ${BLUE}40`,
                                      }}
                                    >
                                      <Check size={10} className="text-white" />
                                      <span>{ex.name}</span>
                                      <motion.button
                                        whileHover={{ scale: 1.3, background: 'rgba(255,255,255,0.2)' }}
                                        whileTap={{ scale: 0.8 }}
                                        onClick={() => toggleExerciseSelection(id)}
                                        className="w-4 h-4 rounded-full flex items-center justify-center"
                                        style={{ background: 'rgba(255,255,255,0.15)' }}
                                      >
                                        <X size={9} className="text-white" />
                                      </motion.button>
                                    </motion.div>
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
                          whileHover={machineStep < 2 || (machineStep === 2 && true) ? { scale: 1.06 } : {}}
                          whileTap={{ scale: 0.92 }}
                          onClick={() => { if (machineStep < 2) setMachineStep(s => s + 1); else saveMachine() }}
                          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
                          style={{
                            background: machineStep === 0 && !machineForm.name.trim() ? 'rgba(0,0,0,0.15)' : (editingMachine ? ORANGE_GRAD : (machineStep === 2 ? GREEN_GRAD : BLUE_GRAD)),
                            cursor: machineStep === 0 && !machineForm.name.trim() ? 'not-allowed' : 'pointer',
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
              <AnimatePresence>
                {machConfirmClose && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 z-20 flex items-center justify-center"
                    style={{ background: 'rgba(0,0,0,0.15)' }}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.92, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.92, y: 8 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="flex flex-col items-center gap-5 p-8 rounded-2xl max-w-xs text-center"
                      style={{
                        background: '#FFFFFF',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                        border: '1px solid rgba(0,0,0,0.04)',
                      }}
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: editingMachine ? 'rgba(255,149,0,0.1)' : `${RED}15` }}>
                        <X size={18} color={editingMachine ? ORANGE : RED} />
                      </div>
                      <div>
                        <p className="text-sm font-bold mb-1" style={{ color: '#1A1A1E' }}>{editingMachine ? '¿Deseas salirte de la edición?' : '¿Abandonar el registro?'}</p>
                        <p className="text-xs leading-relaxed" style={{ color: 'rgba(0,0,0,0.4)' }}>
                          {editingMachine ? 'Si sales ahora, los cambios no guardados se perderán.' : 'Si cierras ahora, los datos ingresados se perderán.'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2.5 w-full">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setMachConfirmClose(false)}
                          className="flex-1 py-2.5 rounded-xl text-xs font-medium cursor-pointer"
                          style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.5)' }}
                        >
                          Seguir aquí
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => { setMachConfirmClose(false); setShowMachineModal(false) }}
                          className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
                          style={{ background: editingMachine ? ORANGE : RED }}
                        >
                          Salir
                        </motion.button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
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

      {/* ── Exercise Manager Modal (3-step) ── */}
      <AnimatePresence>
        {showExerciseManager && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)' }}
            onClick={() => setExConfirmClose(true)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              className="rounded-3xl w-full flex flex-col mx-4 relative"
              style={exSuccess ? {
                background: '#FFFFFF',
                border: '1px solid rgba(0,0,0,0.04)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.12)',
                maxWidth: 672,
                overflow: 'visible',
              } : {
                background: '#FFFFFF',
                border: '1px solid rgba(0,0,0,0.04)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.12)',
                maxHeight: '90vh',
                maxWidth: 576,
                overflow: showMuscleDropdown ? 'visible' : 'hidden',
                clipPath: showMuscleDropdown ? 'inset(0 round 24px)' : 'none',
              }}
            >
              {exSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center px-6 pb-12 relative"
                  style={{ overflow: 'visible', minHeight: 420 }}
                >
                  {/* Background layer: image + sparkles */}
                  <div className="absolute left-0 right-0 z-0 flex flex-col items-center" style={{ top: '-80px', overflow: 'visible' }}>
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
                    <div className="relative flex flex-col items-center justify-center">
                      <motion.img
                        src={coachExerciseSuccessImg}
                        alt="felicitaciones"
                        className="w-80 h-auto object-contain"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                      />
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-48 pointer-events-none" style={{
                        background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 15%, rgba(255,255,255,0) 55%)',
                      }} />
                    </div>
                  </div>
                  {/* Foreground layer: text + button */}
                  <div className="relative z-10 flex flex-col items-center mt-auto pt-48">
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className="text-3xl font-bold text-center"
                      style={{ color: '#1A1A1E' }}
                    >
                      ¡{exEditing ? 'Ejercicio actualizado' : 'Registro Exitoso'}!
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.4 }}
                      className="text-sm text-center mt-1.5 mb-8"
                      style={{ color: 'rgba(0,0,0,0.7)' }}
                    >
                      {exEditing || exCreatedCount <= 1 ? (
                        <><span style={{ background: 'linear-gradient(135deg, #30D158, #0A84FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700 }}>{exForm.name}</span> ahora está disponible<br /></>
                      ) : (
                        <><span style={{ background: 'linear-gradient(135deg, #30D158, #0A84FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700 }}>Los ejercicios</span> ya están disponibles<br /></>
                      )}
                      <span className="text-xs" style={{ color: 'rgba(0,0,0,0.4)' }}>para asignar a las rutinas y máquinas del gimnasio.</span>
                    </motion.p>
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.4 } }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      onClick={() => { setShowExerciseManager(false); setExSuccess(false); setExCreatedCount(0) }}
                      className="px-8 py-2.5 rounded-2xl text-xs font-bold text-white cursor-pointer"
                      style={{ background: GREEN_GRAD }}
                    >
                      Cerrar
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <>
                  {/* ── Header ── */}
                  <div className="sticky top-0 z-10 flex-shrink-0" style={{
                    background: 'rgba(255,255,255,0.9)',
                    borderBottom: '1px solid rgba(0,0,0,0.04)',
                  }}>
                    <div className="flex items-center justify-between px-4 pt-4 pb-0">
                      <div className="flex-1" />
                      {exEditing ? (
                        <div className="flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2">
                          <div className="w-5 h-5 flex-shrink-0">
                            <PenView />
                          </div>
                          <span className="text-[10px] font-bold" style={{ color: 'rgba(0,0,0,0.25)' }}>Editando...</span>
                        </div>
                      ) : null}
                      <motion.button
                        whileHover={{ scale: 1.15, background: 'rgba(244,56,67,0.1)', color: RED }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setExConfirmClose(true)}
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
                            width: s === exStep + 1 ? 16 : 6,
                            background: s === exStep + 1 ? ORANGE_GRAD : 'rgba(0,0,0,0.12)',
                          }}
                          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                          className="rounded-full"
                          style={{ height: 6 }}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-bold tracking-wide text-center block pb-4" style={{ color: '#1A1A1E' }}>
                      {exStep === 0 ? 'Datos básicos' : exStep === 1 ? 'Categoría y dificultad' : 'Contenido visual'}
                    </span>
                  </div>

                  {/* ── Body ── */}
                  <div className="flex-1 overflow-y-auto px-6 pb-6 pt-5">
                    {/* Step 0 — Name, Description, Status */}
                    {exStep === 0 && (
                      <div className="space-y-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.6)' }}>Nombre <span style={{ color: RED }}>*</span></label>
                          <input
                            value={exForm.name}
                            onChange={e => setExForm(f => ({ ...f, name: e.target.value }))}
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
                        <div>
                          <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.6)' }}>Descripción</label>
                          <textarea
                            value={exForm.description}
                            onChange={e => setExForm(f => ({ ...f, description: e.target.value }))}
                            placeholder="Describe brevemente el ejercicio..."
                            rows={2}
                            className="w-full px-3 py-2 rounded-xl text-xs font-medium outline-none resize-none transition-all duration-200"
                            style={{ background: meshInputBg, color: '#1A1A1E', border: '1px solid transparent' }}
                            onMouseEnter={e => { if (e.target !== document.activeElement) { e.target.style.background = meshInputHover; e.target.style.borderColor = 'rgba(0,0,0,0.06)' } }}
                            onMouseLeave={e => { if (e.target !== document.activeElement) { e.target.style.background = meshInputBg; e.target.style.borderColor = 'transparent' } }}
                            onFocus={e => { e.target.style.borderColor = BLUE; e.target.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(18,112,183,0.04)'; e.target.style.boxShadow = '0 0 0 3px rgba(18,112,183,0.08)' }}
                            onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.background = meshInputBg; e.target.style.boxShadow = 'none' }}
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.6)' }}>Estado</label>
                          <div className="flex gap-2">
                            {(['active', 'maintenance', 'inactive'] as const).map(s => {
                              const sel = exForm.status === s
                              const c = statusConfig[s].color
                              const grad = `linear-gradient(135deg, ${c}, ${c}cc)`
                              return (
                                <motion.button
                                  key={s}
                                  whileHover={{ scale: 1.06 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setExForm(f => ({ ...f, status: s }))}
                                  onMouseEnter={e => { if (!sel) { e.currentTarget.style.background = `${c}18`; e.currentTarget.style.color = c } }}
                                  onMouseLeave={e => { if (!sel) { e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; e.currentTarget.style.color = 'rgba(0,0,0,0.25)' } }}
                                  className="flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all duration-200"
                                  style={{
                                    background: sel ? grad : 'rgba(0,0,0,0.03)',
                                    color: sel ? '#FFFFFF' : 'rgba(0,0,0,0.25)',
                                    border: '1px solid transparent',
                                    boxShadow: sel ? `0 4px 16px ${c}40` : 'none',
                                  }}
                                >
                                  {statusConfig[s].label}
                                </motion.button>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 1 — Muscle Groups + Level */}
                    {exStep === 1 && (
                      <div className="space-y-5">
                        <div>
                          <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.6)' }}>Grupos musculares</label>
                          <p className="text-[10px] mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>Selecciona uno o más grupos musculares que trabaja este ejercicio.</p>
                          <div className="grid grid-cols-4 gap-2">
                            {[
                              'Pecho', 'Espalda', 'Hombros', 'Brazos',
                              'Piernas', 'Abdomen/Core', 'Cardio', 'General',
                            ].map(label => {
                              const selected = exForm.muscleGroups.includes(label)
                              const isGeneral = label === 'General'
                              const GOLD_GRAD = 'linear-gradient(135deg, #F1C827, #FFE066)'
                              const defaultBg = 'rgba(0,0,0,0.03)'
                              const generalSelected = exForm.muscleGroups.includes('General')
                              const disabled = generalSelected && !isGeneral
                              const hoverBg = isGeneral ? 'rgba(241,200,39,0.12)' : `${BLUE}12`
                              const selectedBg = isGeneral ? GOLD_GRAD : BLUE_GRAD
                              const textColor = selected ? '#FFFFFF' : disabled ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.35)'
                              const shadow = isGeneral
                                ? '0 4px 20px rgba(241,200,39,0.25)'
                                : `0 4px 20px ${BLUE}40`
                              return (
                                <motion.button
                                  key={label}
                                  whileHover={!disabled ? { scale: 1.06 } : {}}
                                  whileTap={!disabled ? { scale: 0.95 } : {}}
                                  onClick={() => {
                                    if (disabled) return
                                    if (isGeneral) {
                                      setExForm(f => ({
                                        ...f,
                                        muscleGroups: selected ? [] : ['General']
                                      }))
                                    } else if (generalSelected) {
                                      setExForm(f => ({
                                        ...f,
                                        muscleGroups: f.muscleGroups.includes(label)
                                          ? f.muscleGroups.filter(g => g !== 'General')
                                          : [...f.muscleGroups.filter(g => g !== 'General'), label]
                                      }))
                                    } else {
                                      setExForm(f => ({
                                        ...f,
                                        muscleGroups: f.muscleGroups.includes(label)
                                          ? f.muscleGroups.filter(g => g !== label)
                                          : [...f.muscleGroups, label]
                                      }))
                                    }
                                  }}
                                  onMouseEnter={e => { if (!selected && !disabled) { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = isGeneral ? '#B8860B' : BLUE } }}
                                  onMouseLeave={e => { if (!selected && !disabled) { e.currentTarget.style.background = defaultBg; e.currentTarget.style.color = 'rgba(0,0,0,0.35)' } }}
                                  className="flex flex-col items-center gap-1.5 px-3 py-3.5 rounded-xl text-xs font-bold transition-all duration-200"
                                  style={{
                                    background: selected ? selectedBg : defaultBg,
                                    color: textColor,
                                    border: '1px solid transparent',
                                    boxShadow: selected ? shadow : 'none',
                                    opacity: disabled ? 0.4 : 1,
                                    filter: disabled ? 'blur(0.6px)' : 'none',
                                    pointerEvents: disabled ? 'none' : 'auto',
                                    cursor: disabled ? 'not-allowed' : 'pointer',
                                  }}
                                >
                                  <motion.img
                                    src={muscleIcons[label]}
                                    alt=""
                                    className="mb-0.5"
                                    animate={{
                                      width: selected ? 48 : 24,
                                      height: selected ? 48 : 24,
                                      marginTop: selected ? -24 : 0,
                                      filter: selected ? 'blur(0px) drop-shadow(0 8px 20px rgba(0,0,0,0.15))' : disabled ? 'grayscale(0.6) blur(0px)' : 'blur(0px)',
                                      opacity: disabled ? 0.3 : 1,
                                    }}
                                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                  />
                                  <span>{label}</span>
                                </motion.button>
                              )
                            })}
                          </div>
                        </div>
                        <div>
                          <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.6)' }}>Nivel Recomendado</label>
                          <div className="flex gap-2">
                            {(['principiante', 'intermedio', 'avanzado'] as const).map(level => {
                              const lvlHex = level === 'principiante' ? '#1270B7' : level === 'intermedio' ? '#F1C827' : '#F43843'
                              const selected = exForm.recommendedLevel === level
                              const selectedBg = `linear-gradient(135deg, ${lvlHex}, ${lvlHex}cc)`
                              const defaultBg = 'rgba(0,0,0,0.03)'
                              const hoverBg = `${lvlHex}1a`
                              return (
                                <motion.button
                                  key={level}
                                  whileHover={{ scale: 1.06 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setExForm(f => ({ ...f, recommendedLevel: level }))}
                                  onMouseEnter={e => { if (!selected) { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = lvlHex } }}
                                  onMouseLeave={e => { if (!selected) { e.currentTarget.style.background = defaultBg; e.currentTarget.style.color = 'rgba(0,0,0,0.25)' } }}
                                  className="flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all duration-200"
                                  style={{
                                    background: selected ? selectedBg : defaultBg,
                                    color: selected ? '#FFFFFF' : 'rgba(0,0,0,0.25)',
                                    border: '1px solid transparent',
                                    boxShadow: selected ? `0 4px 16px ${lvlHex}4d` : 'none',
                                  }}
                                >
                                  {level}
                                </motion.button>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2 — Visual Content */}
                    {exStep === 2 && (
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.6)' }}>Imagen <span style={{ color: 'rgba(0,0,0,0.2)' }}>(Opcional)</span></label>
                          <motion.div
                            whileHover={{ scale: 1.03 }}
                            transition={{ duration: 0.2 }}
                            className="w-full h-full min-h-[120px] rounded-xl cursor-pointer overflow-hidden relative group"
                            style={{
                              background: exForm.imageUrl ? 'radial-gradient(ellipse at 30% 20%, rgba(48,209,88,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(48,209,88,0.08) 0%, transparent 50%), rgba(255,255,255,0.6)' : meshInputBg,
                              border: `1px solid ${exForm.imageUrl ? 'rgba(48,209,88,0.2)' : 'transparent'}`,
                            }}
                            onClick={() => {
                              if (!exForm.imageUrl) {
                                const input = document.createElement('input')
                                input.type = 'file'
                                input.accept = 'image/*'
                                input.onchange = e => {
                                  const file = (e.target as HTMLInputElement).files?.[0]
                                  if (file) {
                                    const reader = new FileReader()
                                    reader.onload = ev => setExForm(f => ({ ...f, imageUrl: ev.target?.result as string }))
                                    reader.readAsDataURL(file)
                                  }
                                }
                                input.click()
                              }
                            }}
                            onMouseEnter={e => { if (!exForm.imageUrl) { e.currentTarget.style.background = meshInputHover; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)' } }}
                            onMouseLeave={e => { if (!exForm.imageUrl) { e.currentTarget.style.background = meshInputBg; e.currentTarget.style.borderColor = 'transparent' } }}
                          >
                            {exForm.imageUrl ? (
                              <>
                                <img src={exForm.imageUrl} alt="" className="w-full h-full object-cover" />
                                <div
                                  onClick={e => { e.stopPropagation(); const input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*'; input.onchange = ev => { const file = (ev.target as HTMLInputElement).files?.[0]; if (file) { const reader = new FileReader(); reader.onload = ev2 => setExForm(f => ({ ...f, imageUrl: ev2.target?.result as string })); reader.readAsDataURL(file) } }; input.click() }}
                                  className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 cursor-pointer"
                                  style={{ background: 'rgba(0,0,0,0.45)' }}
                                >
                                  <Camera size={24} className="text-white" />
                                  <span className="text-xs font-semibold text-white">Cambiar imagen</span>
                                </div>
                              </>
                            ) : (
                              <div className="flex flex-col items-center gap-1.5 py-6">
                                <Upload size={18} style={{ color: 'rgba(0,0,0,0.2)' }} />
                                <span className="text-xs font-medium" style={{ color: 'rgba(0,0,0,0.2)' }}>Subir imagen</span>
                              </div>
                            )}
                          </motion.div>
                        </div>
                        <div className="flex-1">
                          <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.6)' }}>Video <span style={{ color: 'rgba(0,0,0,0.2)' }}>(Opcional)</span></label>
                          <motion.div
                            whileHover={{ scale: 1.03 }}
                            transition={{ duration: 0.2 }}
                            className="w-full h-full min-h-[120px] rounded-xl cursor-pointer overflow-hidden relative group"
                            style={{
                              background: exForm.videoUrl ? 'radial-gradient(ellipse at 30% 20%, rgba(48,209,88,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(48,209,88,0.08) 0%, transparent 50%), rgba(255,255,255,0.6)' : meshInputBg,
                              border: `1px solid ${exForm.videoUrl ? 'rgba(48,209,88,0.2)' : 'transparent'}`,
                            }}
                            onClick={() => {
                              if (!exForm.videoUrl) {
                                const input = document.createElement('input')
                                input.type = 'file'
                                input.accept = 'video/*'
                                input.onchange = e => {
                                  const file = (e.target as HTMLInputElement).files?.[0]
                                  if (file) {
                                    const url = URL.createObjectURL(file)
                                    setExForm(f => ({ ...f, videoUrl: url }))
                                  }
                                }
                                input.click()
                              }
                            }}
                            onMouseEnter={e => { if (!exForm.videoUrl) { e.currentTarget.style.background = meshInputHover; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)' } }}
                            onMouseLeave={e => { if (!exForm.videoUrl) { e.currentTarget.style.background = meshInputBg; e.currentTarget.style.borderColor = 'transparent' } }}
                          >
                            {exForm.videoUrl ? (
                              <>
                                <video src={exForm.videoUrl} className="w-full h-full object-cover" />
                                <div
                                  onClick={e => { e.stopPropagation(); const input = document.createElement('input'); input.type = 'file'; input.accept = 'video/*'; input.onchange = ev => { const file = (ev.target as HTMLInputElement).files?.[0]; if (file) { setExForm(f => ({ ...f, videoUrl: URL.createObjectURL(file) })) } }; input.click() }}
                                  className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 cursor-pointer"
                                  style={{ background: 'rgba(0,0,0,0.45)' }}
                                >
                                  <Camera size={24} className="text-white" />
                                  <span className="text-xs font-semibold text-white">Cambiar video</span>
                                </div>
                              </>
                            ) : (
                              <div className="flex flex-col items-center gap-1.5 py-6">
                                <Upload size={18} style={{ color: 'rgba(0,0,0,0.2)' }} />
                                <span className="text-xs font-medium" style={{ color: 'rgba(0,0,0,0.2)' }}>Subir video</span>
                              </div>
                            )}
                          </motion.div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ── Footer ── */}
                  <div className="flex items-center justify-between px-6 pb-6 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        if (exStep > 0) setExStep(s => s - 1)
                        else setExConfirmClose(true)
                      }}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold"
                      style={{ color: 'rgba(0,0,0,0.3)' }}
                    >
                      <ChevronLeft size={14} />
                      {exStep === 0 ? 'Cancelar' : 'Anterior'}
                    </motion.button>
                    <motion.button
                      whileHover={exStep < 2 || !exForm.name.trim() ? { scale: 1 } : { scale: 1.06, boxShadow: '0 8px 30px rgba(255,149,0,0.35), 0 0 60px rgba(255,149,0,0.1)' }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        if (exStep < 2) { setExStep(s => s + 1) }
                        else { saveExercise() }
                      }}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all duration-200"
                      style={{
                        background: ORANGE_GRAD,
                        boxShadow: '0 4px 20px rgba(255,149,0,0.3)',
                        opacity: exStep === 0 && !exForm.name.trim() ? 0.5 : 1,
                      }}
                      disabled={exStep === 0 && !exForm.name.trim()}
                    >
                      {exStep < 2 ? 'Siguiente' : 'Guardar Ejercicio'}
                    </motion.button>
                  </div>
                </>
              )}
              <AnimatePresence>
                {exAskCreateAnother && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer"
                      style={{ background: 'rgba(0,0,0,0.15)' }}
                      onClick={() => setExAskCreateAnother(false)}
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 8 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col items-center gap-5 p-8 rounded-2xl max-w-xs text-center cursor-default"
                        style={{
                          background: '#FFFFFF',
                          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                          border: '1px solid rgba(0,0,0,0.04)',
                        }}
                        onClick={e => e.stopPropagation()}
                      >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(10,132,255,0.1)' }}>
                          <Dumbbell size={18} color="#0A84FF" />
                        </div>
                        <div>
                          <p className="text-sm font-bold mb-1" style={{ color: '#1A1A1E' }}>¿Desea crear otro ejercicio?</p>
                          <p className="text-xs leading-relaxed" style={{ color: 'rgba(0,0,0,0.4)' }}>
                            Puede seguir registrando ejercicios o finalizar.
                          </p>
                        </div>
                        <div className="flex items-center gap-2.5 w-full">
                          <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setExForm({ name: '', zone: '', description: '', status: 'active', muscleGroups: [], recommendedLevel: 'principiante', imageUrl: '', videoUrl: '' })
                            setExStep(0)
                            setExEditing(null)
                            setExAskCreateAnother(false)
                          }}
                          className="flex-1 py-2.5 rounded-xl text-xs font-medium cursor-pointer"
                          style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.5)' }}
                        >
                          Sí, crear otro
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setExAskCreateAnother(false)
                            setExSuccess(true)
                          }}
                          className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
                          style={{ background: GREEN_GRAD }}
                        >
                          No, finalizar
                        </motion.button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {exConfirmClose && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 z-20 flex items-center justify-center"
                    style={{ background: 'rgba(0,0,0,0.15)' }}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.92, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.92, y: 8 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="flex flex-col items-center gap-5 p-8 rounded-2xl max-w-xs text-center"
                      style={{
                        background: '#FFFFFF',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                        border: '1px solid rgba(0,0,0,0.04)',
                      }}
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: exEditing ? 'rgba(255,149,0,0.1)' : `${RED}15` }}>
                        <X size={18} color={exEditing ? ORANGE : RED} />
                      </div>
                      <div>
                        <p className="text-sm font-bold mb-1" style={{ color: '#1A1A1E' }}>{exEditing ? '¿Deseas salirte de la edición?' : '¿Abandonar el registro?'}</p>
                        <p className="text-xs leading-relaxed" style={{ color: 'rgba(0,0,0,0.4)' }}>
                          {exEditing ? 'Si sales ahora, los cambios no guardados se perderán.' : 'Si cierras ahora, los datos ingresados se perderán.'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2.5 w-full">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setExConfirmClose(false)}
                          className="flex-1 py-2.5 rounded-xl text-xs font-medium cursor-pointer"
                          style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.5)' }}
                        >
                          Seguir aquí
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => { setExConfirmClose(false); setShowExerciseManager(false); setExCreatedCount(0) }}
                          className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
                          style={{ background: exEditing ? ORANGE : RED }}
                        >
                          Salir
                        </motion.button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Machine Preview Modal ── */}
      <AnimatePresence>
        {previewMachine && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)' }}
            onClick={() => setPreviewMachine(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              className="rounded-3xl w-full max-w-lg flex flex-col mx-4 overflow-hidden"
              style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 25px 60px rgba(0,0,0,0.12)' }}
            >
              {/* Image */}
              <div className="relative" style={{ height: 160, background: `${statusConfig[previewMachine.status].color}08` }}>
                <img
                  src={previewMachine.imageDataUrl || machineImg}
                  alt={previewMachine.name}
                  className="w-full h-full"
                  style={{
                    objectFit: previewMachine.imageDataUrl ? 'cover' : 'contain',
                    padding: previewMachine.imageDataUrl ? 0 : '12px',
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setPreviewMachine(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.9)', color: 'rgba(0,0,0,0.4)' }}
                >
                  <X size={16} />
                </motion.button>
              </div>

              {/* Content */}
              <div className="px-6 pt-5 pb-6">
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-lg font-bold" style={{ color: '#1A1A1E' }}>{previewMachine.name}</h2>
                  <StatusBadge status={previewMachine.status} />
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <div
                    onClick={() => setPreviewMuscleFilter('all')}
                    className="flex items-center justify-center rounded-full transition-transform duration-200 hover:scale-110 cursor-pointer"
                    style={{
                      width: 38, height: 38,
                      background: previewMuscleFilter === 'all' ? BLUE_GRAD : 'linear-gradient(180deg, #ffffff 0%, #DBEAFE 100%)',
                      boxShadow: previewMuscleFilter === 'all' ? '0 2px 8px rgba(18,112,183,0.3)' : '0 2px 8px rgba(0,0,0,0.07)',
                    }}
                    title="Todos los ejercicios"
                  >
                    <List size={16} color={previewMuscleFilter === 'all' ? '#FFFFFF' : '#1270B7'} />
                  </div>
                  {previewMachine.muscleGroups.map((mg, i) => (
                    muscleIcons[mg] ? (
                      <div key={i} className="relative group">
                        <div
                          onClick={() => setPreviewMuscleFilter(mg)}
                          className="flex items-center justify-center rounded-full transition-transform duration-200 hover:scale-110 cursor-pointer"
                          style={{
                            width: 38, height: 38,
                            background: previewMuscleFilter === mg ? BLUE_GRAD : 'linear-gradient(180deg, #ffffff 0%, #DBEAFE 100%)',
                            boxShadow: previewMuscleFilter === mg ? '0 2px 8px rgba(18,112,183,0.3)' : '0 2px 8px rgba(0,0,0,0.07)',
                          }}
                        >
                          <img src={muscleIcons[mg]} alt="" className="w-5 h-5" style={{ filter: previewMuscleFilter === mg ? 'brightness(0) invert(1)' : 'none' }} />
                        </div>
                        <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg whitespace-nowrap text-[10px] font-medium pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10" style={{ background: 'rgba(0,0,0,0.7)', color: '#FFFFFF' }}>
                          {mg}
                        </div>
                      </div>
                    ) : null
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { setPreviewMachine(null); openEditMachine(previewMachine) }}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                    style={{ background: `${BLUE}10`, color: BLUE, border: `1px solid ${BLUE}25` }}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <Pencil size={13} /> Editar
                    </div>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setDeleteConfirm({ type: 'machine', id: previewMachine.id })}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
                    style={{ background: RED }}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <Trash2 size={13} /> Eliminar
                    </div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Exercise Preview Modal ── */}
      <AnimatePresence>
        {previewExercise && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)' }}
            onClick={() => setPreviewExercise(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              className="rounded-3xl w-full max-w-lg flex flex-col mx-4 overflow-hidden"
              style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 25px 60px rgba(0,0,0,0.12)' }}
            >
              {/* Image */}
              <div className="relative" style={{ height: 160, background: 'radial-gradient(ellipse at 30% 20%, rgba(48,209,88,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(10,132,255,0.05) 0%, transparent 50%)' }}>
                {previewExercise.imageUrl ? (
                  <img src={previewExercise.imageUrl} alt={previewExercise.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Dumbbell size={40} style={{ color: 'rgba(48,209,88,0.2)' }} />
                  </div>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setPreviewExercise(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.9)', color: 'rgba(0,0,0,0.4)' }}
                >
                  <X size={16} />
                </motion.button>
              </div>

              {/* Content */}
              <div className="px-6 pt-5 pb-6">
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-lg font-bold" style={{ color: '#1A1A1E' }}>{previewExercise.name}</h2>
                  <StatusBadge status={previewExercise.status} />
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {previewExercise.muscleGroups.map((mg, i) => (
                    muscleIcons[mg] ? (
                      <div key={i} className="relative group">
                        <div className="flex items-center justify-center rounded-full" style={{ width: 38, height: 38, background: 'linear-gradient(180deg, #ffffff 0%, #DBEAFE 100%)', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
                          <img src={muscleIcons[mg]} alt="" className="w-5 h-5" />
                        </div>
                        <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg whitespace-nowrap text-[10px] font-medium pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10" style={{ background: 'rgba(0,0,0,0.7)', color: '#FFFFFF' }}>
                          {mg}
                        </div>
                      </div>
                    ) : null
                  ))}
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-md font-medium" style={{
                    background: previewExercise.recommendedLevel === 'principiante' ? 'rgba(48,209,88,0.1)' : previewExercise.recommendedLevel === 'intermedio' ? 'rgba(245,166,35,0.1)' : 'rgba(244,56,67,0.1)',
                    color: previewExercise.recommendedLevel === 'principiante' ? '#30D158' : previewExercise.recommendedLevel === 'intermedio' ? '#F5A623' : '#F43843',
                  }}>
                    {previewExercise.recommendedLevel === 'principiante' ? 'Principiante' : previewExercise.recommendedLevel === 'intermedio' ? 'Intermedio' : 'Avanzado'}
                  </span>
                  <span className="text-xs" style={{ color: 'rgba(0,0,0,0.35)' }}>{previewExercise.zone}</span>
                </div>

                {previewExercise.description && (
                  <p className="text-xs mb-4" style={{ color: 'rgba(0,0,0,0.5)' }}>{previewExercise.description}</p>
                )}

                {/* Video */}
                {previewExercise.videoUrl && (
                  <div className="mb-4 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
                    <video
                      src={previewExercise.videoUrl}
                      controls
                      className="w-full"
                      style={{ maxHeight: 200 }}
                    />
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { setPreviewExercise(null); openEditExercise(previewExercise) }}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                    style={{ background: `${BLUE}10`, color: BLUE, border: `1px solid ${BLUE}25` }}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <Pencil size={13} /> Editar
                    </div>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setDeleteConfirm({ type: 'exercise', id: previewExercise.id })}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
                    style={{ background: RED }}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <Trash2 size={13} /> Eliminar
                    </div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete Confirm ── */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)' }}
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-5 p-8 rounded-3xl max-w-xs text-center mx-4"
              style={{
                background: '#FFFFFF',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                border: '1px solid rgba(0,0,0,0.04)',
              }}
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0" style={{ background: `${RED}10` }}>
                <TrashView />
              </div>
              <div>
                <p className="text-sm font-bold mb-1" style={{ color: '#1A1A1E' }}>¿Eliminar {deleteConfirm.type === 'machine' ? 'máquina' : 'ejercicio'}?</p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(0,0,0,0.4)' }}>
                  Esta acción no se puede deshacer.
                </p>
              </div>
              <div className="flex items-center gap-2.5 w-full">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-medium cursor-pointer"
                  style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.5)' }}
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const name = deleteConfirm.type === 'machine'
                      ? machines.find(m => m.id === deleteConfirm.id)?.name
                      : exercises.find(e => e.id === deleteConfirm.id)?.name
                    if (deleteConfirm.type === 'machine') {
                      deleteMachine(deleteConfirm.id)
                      setPreviewMachine(null)
                      if (name) { setDeletedName(name); setShowDeletedToast(true); setToastDeletedProgress(100); setTimeout(() => setShowDeletedToast(false), 4500) }
                    } else {
                      deleteExercise(deleteConfirm.id)
                      setPreviewExercise(null)
                    }
                    setDeleteConfirm(null)
                  }}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
                  style={{ background: RED }}
                >
                  Eliminar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete Toast (bottom-right) ── */}
      <AnimatePresence>
        {showDeletedToast && deletedName && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-6 z-[70] flex items-center gap-4 rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.75)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              boxShadow: '0 24px 80px rgba(244,56,67,0.12), 0 8px 32px rgba(0,0,0,0.08)',
              border: '1px solid rgba(255,255,255,0.5)',
            }}
          >
            {/* 3D Model */}
            <div className="w-[60px] h-[60px] flex-shrink-0" style={{ background: `${RED}08` }}>
              <TrashView />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0 py-3 pr-5">
              <p className="text-sm font-extrabold" style={{ color: '#1A1A1E' }}>Máquina eliminada</p>
              <p className="text-xs font-medium mt-0.5 truncate" style={{ color: 'rgba(0,0,0,0.45)' }}>{deletedName}</p>
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: 'rgba(0,0,0,0.06)' }}>
              <div style={{ width: `${toastDeletedProgress}%`, height: '100%', background: `linear-gradient(90deg, ${RED}, #FF6B6B)`, transition: 'width 0.1s linear' }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Edit Toast (bottom-right) ── */}
      <AnimatePresence>
        {showEditedToast && editedName && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-6 z-[70] flex items-center gap-4 rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.75)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              boxShadow: '0 24px 80px rgba(18,112,183,0.15), 0 8px 32px rgba(0,0,0,0.08)',
              border: '1px solid rgba(255,255,255,0.5)',
            }}
          >
            <div className="w-[60px] h-[60px] flex-shrink-0" style={{ background: `${BLUE}08` }}>
              <PenView />
            </div>
            <div className="flex-1 min-w-0 py-3 pr-5">
              <p className="text-sm font-extrabold" style={{ color: '#1A1A1E' }}>Registro actualizado</p>
              <p className="text-xs font-medium mt-0.5 truncate" style={{ color: 'rgba(0,0,0,0.45)' }}>{editedName}</p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: 'rgba(0,0,0,0.06)' }}>
              <div style={{ width: `${toastEditedProgress}%`, height: '100%', background: 'linear-gradient(90deg, #1270B7, #7ec8e3)', transition: 'width 0.1s linear' }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Creation Toast (bottom-right) ── */}
      <AnimatePresence>
        {showCreatedToast && createdMachineName && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-6 z-[70] flex items-center gap-4 rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.75)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              boxShadow: '0 24px 80px rgba(18,112,183,0.15), 0 8px 32px rgba(0,0,0,0.08)',
              border: '1px solid rgba(255,255,255,0.5)',
            }}
          >
            {/* 3D Model */}
            <div className="w-[76px] h-[76px] flex-shrink-0" style={{ background: 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), rgba(248,251,255,0.8)' }}>
              <WeightsView />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0 py-3 pr-5">
              <p className="text-sm font-extrabold" style={{ color: '#1A1A1E' }}>¡Máquina creada!</p>
              <p className="text-xs font-medium mt-0.5 truncate" style={{ color: 'rgba(0,0,0,0.45)' }}>{createdMachineName}</p>
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: 'rgba(0,0,0,0.06)' }}>
              <div style={{ width: `${toastProgress}%`, height: '100%', background: 'linear-gradient(90deg, #1270B7, #7ec8e3)', transition: 'width 0.1s linear' }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
