import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import confetti from 'canvas-confetti'
import {
  Search, Plus, Dumbbell, X, List, Upload, Pencil, Trash2,
  ChevronDown, ChevronRight, ChevronLeft, Check, Camera,
} from 'lucide-react'
import { WeightsView } from '../../assets/models/ui/equipment/weights/WeightsModel'
import { TrashView } from '../../assets/models/ui/actions/trash/TrashModel'
import { PenView } from '../../assets/models/ui/actions/pen/PenModel'
import machineImg from '../../assets/illustrations/modules/equipment_module.webp'
import machineExercisesImg from '../../assets/illustrations/equipment/cable_machine.webp'
import modalExercisesImg from '../../assets/illustrations/characters/coach/coach_bench_press.webp'
import coachCongratsImg from '../../assets/illustrations/characters/coach/coach_congratulations.webp'
import coachExerciseSuccessImg from '../../assets/illustrations/characters/coach/coach_exercise_success.webp'
import machineTreadmillImg from '../../assets/illustrations/equipment/treadmill.webp'
import { initialMachines, initialExercises } from '../../data/mockData'
import { BLUE, BLUE_GRAD, GREEN_GRAD, ORANGE_GRAD, RED, ORANGE, muscleIcons, statusConfig } from '../../data/constants'
import type { Machine, Exercise } from '../../data/types'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { MachineModal } from './MachineModal'
import { ExerciseManagerModal } from './ExerciseManagerModal'
import { MachinePreviewModal } from './MachinePreviewModal'
import { ExercisePreviewModal } from './ExercisePreviewModal'
import { useToast } from './hooks/useToast'
import { useMachines } from './hooks/useMachines'
import { useExercises } from './hooks/useExercises'

interface Props {
  search: string
  searchFocused: boolean
  viewMode: 'machines' | 'exercises'
  onViewModeChange: (v: 'machines' | 'exercises') => void
  onSearchChange: (v: string) => void
  onSearchFocus: (v: boolean) => void
}

export default function EquipmentModule({
  search, searchFocused,
  viewMode, onViewModeChange, onSearchChange, onSearchFocus,
}: Props) {
  const machine = useMachines(initialMachines, search)
  const ex = useExercises(initialExercises)
  const createToast = useToast()
  const deleteToast = useToast()
  const editToast = useToast()

  const [showCreateOptions, setShowCreateOptions] = useState(false)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [previewMachine, setPreviewMachine] = useState<Machine | null>(null)
  const [previewMuscleFilter, setPreviewMuscleFilter] = useState<string>('all')
  const [previewExercise, setPreviewExercise] = useState<Exercise | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'machine' | 'exercise'; id: number } | null>(null)
  const [pendingMachineToast, setPendingMachineToast] = useState<{ name: string; edited: boolean } | null>(null)
  const [pendingExerciseToast, setPendingExerciseToast] = useState<{ name: string } | null>(null)

  const [showMuscleDropdown, setShowMuscleDropdown] = useState(false)
  const muscleDropdownRef = useRef<HTMLButtonElement>(null)

  const [activeMuscleFilter, setActiveMuscleFilter] = useState('Todos')

  const zones = useMemo(() => [...new Set(ex.exercises.map(e => e.zone))], [ex.exercises])

  const muscleToZones: Record<string, string[]> = {
    Cardio: ['Cardio'],
    Pecho: ['Pesas Libres', 'Máquinas'],
    Espalda: ['Pesas Libres', 'Máquinas'],
    Hombros: ['Pesas Libres', 'Máquinas'],
    Brazos: ['Pesas Libres', 'Máquinas'],
    Piernas: ['Pesas Libres', 'Máquinas'],
    'Abdomen/Core': ['Pesas Libres'],
    General: zones.filter(z => z !== 'Máquinas'),
    'Tren Superior': ['Pesas Libres', 'Máquinas'],
    'Tren Inferior': ['Pesas Libres'],
  }

  const filteredZones = useMemo(() => {
    if (machine.form.muscleGroups.length === 0) return zones
    const selected = new Set<string>()
    machine.form.muscleGroups.forEach(mg => {
      const mapped = muscleToZones[mg]
      if (mapped) mapped.forEach(z => selected.add(z))
    })
    return zones.filter(z => selected.has(z))
  }, [machine.form.muscleGroups, zones])

  const muscleExercises = useMemo(() => {
    if (activeMuscleFilter === 'Todos') return ex.exercises.filter(e => e.zone !== 'Máquinas')
    const zonesForMuscle = (muscleToZones[activeMuscleFilter] || []).filter(z => z !== 'Máquinas')
    return ex.exercises.filter(e => zonesForMuscle.includes(e.zone))
  }, [activeMuscleFilter, ex.exercises])

  const meshInputBg = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)'
  const meshInputHover = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(0,0,0,0.04)'

  useEffect(() => {
    setActiveMuscleFilter('Todos')
  }, [machine.step])

  useEffect(() => {
    if (!machine.showModal && pendingMachineToast) {
      const { name, edited } = pendingMachineToast
      if (edited) editToast.trigger(name)
      else createToast.trigger(name)
      setPendingMachineToast(null)
    }
  }, [machine.showModal])

  useEffect(() => {
    if (!ex.showModal && pendingExerciseToast) {
      editToast.trigger(pendingExerciseToast.name)
      setPendingExerciseToast(null)
    }
  }, [ex.showModal])

  function getMachineExercises(m: Machine) {
    return ex.exercises.filter(e => m.exerciseIds.includes(e.id))
  }

  function handleSaveMachine() {
    const result = machine.save()
    if (!result) return
    machine.setShowSuccess(true)
    setPendingMachineToast({ name: result.name, edited: result.edited })
  }

  function handleSaveExercise() {
    const result = ex.save()
    if (!result) return
    if (result.wasNew) {
      ex.setAskCreateAnother(true)
    } else {
      ex.setShowSuccess(true)
      setPendingExerciseToast({ name: result.name })
    }
  }

  function handleExerciseCreateAnotherNo() {
    ex.setShowSuccess(true)
    ex.setCreatedCount(0)
  }

  function handleDelete() {
    if (!deleteConfirm) return
    const name = deleteConfirm.type === 'machine'
      ? machine.machines.find(m => m.id === deleteConfirm.id)?.name
      : ex.exercises.find(e => e.id === deleteConfirm.id)?.name
    if (deleteConfirm.type === 'machine') {
      machine.remove(deleteConfirm.id)
      setPreviewMachine(null)
      if (name) deleteToast.trigger(name)
    } else {
      ex.remove(deleteConfirm.id)
      setPreviewExercise(null)
    }
    setDeleteConfirm(null)
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

      {/* ── Create Options ── */}
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
                <motion.button
                  whileHover={{ scale: 1.04, y: -6 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setShowCreateOptions(false); machine.openAdd(); machine.setShowModal(true) }}
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

                <motion.button
                  whileHover={{ scale: 1.04, y: -6 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setShowCreateOptions(false); ex.openAdd(); ex.setShowModal(true) }}
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
        <div className="grid grid-cols-3 gap-4">
          {machine.filtered.map((m, i) => {
            const machineExercises = getMachineExercises(m)
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * i, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.04, boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setPreviewMachine(m); setPreviewMuscleFilter('all') }}
                className="rounded-2xl premium-card cursor-pointer"
                style={{
                  background: 'rgba(255,255,255,0.85)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.6)',
                  boxShadow: '0 2px 20px rgba(0,0,0,0.04)',
                }}
              >
                <div className="w-full overflow-hidden relative" style={{ height: 96, background: `${statusConfig[m.status].color}08` }}>
                  <img
                    src={m.imageDataUrl || machineImg}
                    alt={m.name}
                    className="w-full h-full"
                    style={{
                      objectFit: m.imageDataUrl ? 'cover' : 'contain',
                      objectPosition: m.imageDataUrl ? 'center' : 'bottom center',
                      filter: m.imageDataUrl ? 'none' : `grayscale(${0.1 + (m.id * 0.05) % 0.5}) contrast(${0.8 + (m.id * 0.03) % 0.4})`,
                      padding: m.imageDataUrl ? 0 : '8px',
                    }}
                  />
                  <div className="absolute inset-0" style={{
                    background: `linear-gradient(180deg, transparent 40%, ${statusConfig[m.status].color}15 100%)`,
                    pointerEvents: 'none',
                  }} />
                </div>
                <div className="px-5 pt-4 pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-[#1A1A1E] text-base leading-tight">{m.name}</h3>
                    <StatusBadge status={m.status} />
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {m.muscleGroups.map((mg, i) => (
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
          {machine.filtered.length === 0 && (
            <div className="col-span-3 py-16 text-center">
              <p className="text-lg font-bold" style={{ color: 'rgba(0,0,0,0.2)' }}>No se encontraron máquinas</p>
              <p className="text-sm mt-1" style={{ color: 'rgba(0,0,0,0.15)' }}>Prueba con otros filtros o agrega una nueva máquina</p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {ex.filtered.length === 0 ? (
            <div className="col-span-3 py-16 text-center">
              <p className="text-lg font-bold" style={{ color: 'rgba(0,0,0,0.2)' }}>No se encontraron ejercicios</p>
              <p className="text-sm mt-1" style={{ color: 'rgba(0,0,0,0.15)' }}>Agrega ejercicios para verlos aquí.</p>
            </div>
          ) : (
            ex.filtered.map((e, i) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * i, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.04, boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPreviewExercise(e)}
                className="rounded-2xl premium-card cursor-pointer"
                style={{
                  background: 'rgba(255,255,255,0.85)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.6)',
                  boxShadow: '0 2px 20px rgba(0,0,0,0.04)',
                }}
              >
                <div className="w-full overflow-hidden relative" style={{ height: 96, background: 'radial-gradient(ellipse at 30% 20%, rgba(48,209,88,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(10,132,255,0.05) 0%, transparent 50%)' }}>
                  {e.imageUrl ? (
                    <img src={e.imageUrl} alt={e.name} className="w-full h-full object-cover" />
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
                    <h3 className="font-bold text-[#1A1A1E] text-base leading-tight">{e.name}</h3>
                    <StatusBadge status={e.status} />
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {e.muscleGroups.map((mg, i) => (
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
                    background: e.recommendedLevel === 'principiante' ? 'rgba(48,209,88,0.1)' : e.recommendedLevel === 'intermedio' ? 'rgba(245,166,35,0.1)' : 'rgba(244,56,67,0.1)',
                    color: e.recommendedLevel === 'principiante' ? '#30D158' : e.recommendedLevel === 'intermedio' ? '#F5A623' : '#F43843',
                  }}>
                    {e.recommendedLevel === 'principiante' ? 'Principiante' : e.recommendedLevel === 'intermedio' ? 'Intermedio' : 'Avanzado'}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* ── Machine Modal ── */}
      <MachineModal
        show={machine.showModal}
        editingMachine={machine.editingMachine}
        step={machine.step}
        showSuccess={machine.showSuccess}
        showConfirmClose={machine.showConfirmClose}
        form={machine.form}
        machines={machine.machines}
        exercises={ex.exercises}
        zones={zones}
        search={search}
        onClose={() => machine.closeModal()}
        onSave={handleSaveMachine}
        onFormChange={(f) => machine.setForm(f)}
        onStepChange={(s) => machine.setStep(s)}
        onConfirmClose={(v) => machine.setShowConfirmClose(v)}
        onToggleExerciseSelection={(id) => machine.toggleExerciseSelection(id)}
      />

      {/* ── Exercise Manager Modal ── */}
      <ExerciseManagerModal
        show={ex.showModal}
        editing={ex.editing}
        step={ex.step}
        showSuccess={ex.showSuccess}
        askCreateAnother={ex.askCreateAnother}
        createdCount={ex.createdCount}
        confirmClose={ex.confirmClose}
        form={ex.form}
        onClose={() => ex.closeModal()}
        onSave={handleSaveExercise}
        onFormChange={(f) => ex.setForm(f)}
        onStepChange={(s) => ex.setStep(s)}
        onConfirmClose={(v) => ex.setConfirmClose(v)}
        onAskCreateAnother={(v) => ex.setAskCreateAnother(v)}
        onCreatedCountChange={(v) => ex.setCreatedCount(v)}
        onCreateAnotherNo={handleExerciseCreateAnotherNo}
      />

      {/* ── Machine Preview Modal ── */}
      <MachinePreviewModal
        machine={previewMachine}
        exercises={ex.exercises}
        previewMuscleFilter={previewMuscleFilter}
        onMuscleFilterChange={setPreviewMuscleFilter}
        onEdit={(m) => { setPreviewMachine(null); machine.openEdit(m) }}
        onDelete={(m) => setDeleteConfirm({ type: 'machine', id: m.id })}
        onClose={() => setPreviewMachine(null)}
      />

      {/* ── Exercise Preview Modal ── */}
      <ExercisePreviewModal
        exercise={previewExercise}
        onEdit={(e) => { setPreviewExercise(null); ex.openEdit(e) }}
        onDelete={(e) => setDeleteConfirm({ type: 'exercise', id: e.id })}
        onClose={() => setPreviewExercise(null)}
      />

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
                  onClick={handleDelete}
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

      {/* ── Delete Toast ── */}
      <AnimatePresence>
        {deleteToast.show && deleteToast.name && (
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
            <div className="w-[60px] h-[60px] flex-shrink-0" style={{ background: `${RED}08` }}>
              <TrashView />
            </div>
            <div className="flex-1 min-w-0 py-3 pr-5">
              <p className="text-sm font-extrabold" style={{ color: '#1A1A1E' }}>Máquina eliminada</p>
              <p className="text-xs font-medium mt-0.5 truncate" style={{ color: 'rgba(0,0,0,0.45)' }}>{deleteToast.name}</p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: 'rgba(0,0,0,0.06)' }}>
              <div style={{ width: `${deleteToast.progress}%`, height: '100%', background: `linear-gradient(90deg, ${RED}, #FF6B6B)`, transition: 'width 0.1s linear' }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Edit Toast ── */}
      <AnimatePresence>
        {editToast.show && editToast.name && (
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
              <p className="text-xs font-medium mt-0.5 truncate" style={{ color: 'rgba(0,0,0,0.45)' }}>{editToast.name}</p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: 'rgba(0,0,0,0.06)' }}>
              <div style={{ width: `${editToast.progress}%`, height: '100%', background: 'linear-gradient(90deg, #F5A623, #FF8C42)', transition: 'width 0.1s linear' }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Creation Toast ── */}
      <AnimatePresence>
        {createToast.show && createToast.name && (
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
            <div className="w-[76px] h-[76px] flex-shrink-0" style={{ background: 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), rgba(248,251,255,0.8)' }}>
              <WeightsView />
            </div>
            <div className="flex-1 min-w-0 py-3 pr-5">
              <p className="text-sm font-extrabold" style={{ color: '#1A1A1E' }}>¡Máquina creada!</p>
              <p className="text-xs font-medium mt-0.5 truncate" style={{ color: 'rgba(0,0,0,0.45)' }}>{createToast.name}</p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: 'rgba(0,0,0,0.06)' }}>
              <div style={{ width: `${createToast.progress}%`, height: '100%', background: 'linear-gradient(90deg, #1270B7, #1A8CDB)', transition: 'width 0.1s linear' }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
