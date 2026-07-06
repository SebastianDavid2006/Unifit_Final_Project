import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import confetti from 'canvas-confetti'
import {
  Search, Plus, Dumbbell, X, List, Upload, Pencil, Trash2,
  ChevronDown, ChevronRight, ChevronLeft, Check, Camera,
} from 'lucide-react'
import type { Machine, Exercise, Status } from '../../data/types'
import {
  BLUE, BLUE_GRAD, GREEN_GRAD, ORANGE_GRAD, RED,
  muscleIcons, statusConfig, meshInputBg, meshInputHover, muscleToZones,
} from '../../data/constants'
import { StatusBadge } from '../../components/ui/StatusBadge'
import machineImg from '../../../assets/illustrations/objects/machine.png'
import machineTreadmillImg from '../../../assets/illustrations/objects/machine-treadmill.png'
import coachCongratsImg from '../../../assets/illustrations/characters/coach/coach_congratulations.webp'
import machineExercisesImg from '../../../assets/illustrations/objects/machine_exercises.png'
import checkSuccessImg from '../../../assets/objects/ui/check_success.png'

interface MachineModalProps {
  show: boolean
  editingMachine: Machine | null
  step: number
  showSuccess: boolean
  showConfirmClose: boolean
  form: {
    name: string
    zone: string
    status: 'active' | 'maintenance' | 'inactive'
    imageDataUrl: string
    description: string
    muscleGroups: string[]
    recommendedLevel: 'principiante' | 'intermedio' | 'avanzado'
    observations: string
    selectedIds: number[]
  }
  machines: Machine[]
  exercises: Exercise[]
  zones: string[]
  search: string
  onClose: () => void
  onSave: () => void
  onFormChange: (form: any) => void
  onStepChange: (step: number) => void
  onConfirmClose: (v: boolean) => void
  onOpenImageEditor: (dataUrl: string) => void
  onToggleExerciseSelection: (id: number) => void
}

export function MachineModal(props: MachineModalProps) {
  const [showMuscleDropdown, setShowMuscleDropdown] = useState(false)
  const [activeMuscleFilter, setActiveMuscleFilter] = useState('Todos')
  const muscleDropdownRef = useRef<HTMLButtonElement>(null)

  const muscleExercises = useMemo(() => {
    if (activeMuscleFilter === 'Todos') return props.exercises.filter(e => e.zone !== 'Máquinas')
    const zonesForMuscle = (muscleToZones[activeMuscleFilter] || []).filter(z => z !== 'Máquinas')
    return props.exercises.filter(e => zonesForMuscle.includes(e.zone))
  }, [activeMuscleFilter, props.exercises])

  useEffect(() => {
    setActiveMuscleFilter('Todos')
  }, [props.step])

  return (
    <AnimatePresence>
      {props.show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)' }}
          onClick={() => props.onConfirmClose(true)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
            className="rounded-3xl w-full flex flex-col mx-4 relative"
            style={props.showSuccess ? {
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
            {props.showSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center px-6 pb-8 relative"
                style={{ overflow: 'visible' }}
              >
                <div className="relative flex items-center justify-center z-10" style={{ marginTop: '-120px', marginBottom: '1.5rem' }}>
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
                  onClick={() => { props.onClose() }}
                  className="px-8 py-2.5 rounded-2xl text-xs font-bold text-white cursor-pointer"
                  style={{ background: GREEN_GRAD }}
                >
                  Cerrar
                </motion.button>
              </motion.div>
            ) : (
              <><AnimatePresence mode="wait">
              <motion.div
                key={props.step}
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
                      {props.editingMachine ? (
                        <div className="flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2">
                          <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                            <Pencil size={12} style={{ color: 'rgba(0,0,0,0.25)' }} />
                          </div>
                          <span className="text-[10px] font-bold" style={{ color: 'rgba(0,0,0,0.25)' }}>Editando...</span>
                        </div>
                      ) : null}
                      <motion.button
                        whileHover={{ scale: 1.15, background: 'rgba(244,56,67,0.1)', color: RED }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => props.onConfirmClose(true)}
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
                            width: s === props.step + 1 ? 16 : 6,
                            background: s === props.step + 1 ? (props.editingMachine ? ORANGE_GRAD : BLUE_GRAD) : 'rgba(0,0,0,0.12)',
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
                      {props.step === 0 ? 'Datos básicos' : props.step === 1 ? 'Descripción' : 'Ejercicios'}
                    </span>
                  </div>

                  {/* ── Body ── */}
                  <div className="flex-1 overflow-y-auto px-6 pb-6 pt-5">
                    {/* Step 1 — Image, Name, Type, Status */}
                    {props.step === 0 && (
                      <div className="space-y-4">
                        <div>
                          <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.6)' }}>Imagen de la máquina</label>
                          <motion.div
                            whileHover={{ scale: 1.03 }}
                            transition={{ duration: 0.2 }}
                            className="w-full h-40 rounded-xl cursor-pointer overflow-hidden relative group"
                            style={{
                              background: props.form.imageDataUrl ? 'radial-gradient(ellipse at 30% 20%, rgba(48,209,88,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(48,209,88,0.08) 0%, transparent 50%), rgba(255,255,255,0.6)' : meshInputBg,
                              border: `1px solid ${props.form.imageDataUrl ? 'rgba(48,209,88,0.2)' : 'transparent'}`,
                            }}
                            onClick={() => document.getElementById('machine-image-input')?.click()}
                            onMouseEnter={e => { if (!props.form.imageDataUrl) { e.currentTarget.style.background = meshInputHover; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)' } }}
                            onMouseLeave={e => { if (!props.form.imageDataUrl) { e.currentTarget.style.background = meshInputBg; e.currentTarget.style.borderColor = 'transparent' } }}
                          >
                            {props.form.imageDataUrl ? (
                              <>
                                <img src={props.form.imageDataUrl} alt="" className="w-full h-full object-cover" />
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
                                  props.onOpenImageEditor(reader.result as string)
                                }
                                reader.readAsDataURL(file)
                              }
                            }}
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.6)' }}>Nombre <span style={{ color: RED }}>*</span></label>
                          <input
                            value={props.form.name}
                            onChange={e => props.onFormChange({ ...props.form, name: e.target.value })}
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
                            value={props.form.description}
                            onChange={e => props.onFormChange({ ...props.form, description: e.target.value })}
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
                              const sel = props.form.status === s
                              const c = statusConfig[s].color
                              const grad = `linear-gradient(135deg, ${c}, ${c}cc)`
                              return (
                                <motion.button
                                  key={s}
                                  whileHover={{ scale: 1.06 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => props.onFormChange({ ...props.form, status: s })}
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
                    {props.step === 1 && (
                      <div className="space-y-5">
                        <div>
                          <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.6)' }}>Grupos musculares</label>
                          <p className="text-[10px] mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>Selecciona uno o más grupos musculares que trabaja esta máquina.</p>
                          <div className="grid grid-cols-4 gap-2">
                            {[
                              'Pecho', 'Espalda', 'Hombros', 'Brazos',
                              'Piernas', 'Abdomen/Core', 'Cardio', 'General',
                            ].map(label => {
                              const selected = props.form.muscleGroups.includes(label)
                              const isGeneral = label === 'General'
                              const GOLD_GRAD = 'linear-gradient(135deg, #F1C827, #FFE066)'
                              const defaultBg = 'rgba(0,0,0,0.03)'
                              const generalSelected = props.form.muscleGroups.includes('General')
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
                                      props.onFormChange({
                                        ...props.form,
                                        muscleGroups: selected ? [] : ['General']
                                      })
                                    } else if (generalSelected) {
                                      props.onFormChange({
                                        ...props.form,
                                        muscleGroups: props.form.muscleGroups.includes(label)
                                          ? props.form.muscleGroups.filter(g => g !== 'General')
                                          : [...props.form.muscleGroups.filter(g => g !== 'General'), label]
                                      })
                                    } else {
                                      props.onFormChange({
                                        ...props.form,
                                        muscleGroups: props.form.muscleGroups.includes(label)
                                          ? props.form.muscleGroups.filter(g => g !== label)
                                          : [...props.form.muscleGroups, label]
                                      })
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
                              const selected = props.form.recommendedLevel === level
                              const selectedBg = `linear-gradient(135deg, ${lvlHex}, ${lvlHex}cc)`
                              const defaultBg = 'rgba(0,0,0,0.03)'
                              const hoverBg = `${lvlHex}1a`
                              return (
                                <motion.button
                                  key={level}
                                  whileHover={{ scale: 1.06 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => props.onFormChange({ ...props.form, recommendedLevel: level })}
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
                    {props.step === 2 && (
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
                                    ] as string[]).filter(g => props.form.muscleGroups.includes(g)),
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
                                    const selected = props.form.selectedIds.includes(ex.id)
                                    return (
                                      <motion.button
                                        key={ex.id}
                                        layout
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => props.onToggleExerciseSelection(ex.id)}
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
                            Ejercicios Seleccionados ({props.form.selectedIds.length})
                          </label>
                          <div
                            className="min-h-[70px] rounded-xl p-3 transition-all duration-200"
                            style={{
                              background: props.form.selectedIds.length > 0 ? `${BLUE}06` : 'rgba(0,0,0,0.02)',
                              border: `1px solid ${props.form.selectedIds.length > 0 ? `${BLUE}20` : 'rgba(0,0,0,0.06)'}`,
                            }}
                          >
                            {props.form.selectedIds.length === 0 ? (
                              <p className="text-xs py-1 text-center" style={{ color: 'rgba(0,0,0,0.2)' }}>
                                Aún no has seleccionado ejercicios
                              </p>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                {props.form.selectedIds.map(id => {
                                  const ex = props.exercises.find(e => e.id === id)
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
                                        onClick={() => props.onToggleExerciseSelection(id)}
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
                          onClick={() => props.onStepChange(props.step - 1)}
                          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium cursor-pointer"
                          style={{ background: 'rgba(0,0,0,0.04)', color: props.step > 0 ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.15)' }}
                        >
                          <ChevronLeft size={14} />
                          Atrás
                        </motion.button>
                      </div>
                      <div className="flex-1 flex justify-end">
                        <motion.button
                          whileHover={props.step < 2 || (props.step === 2 && true) ? { scale: 1.06 } : {}}
                          whileTap={{ scale: 0.92 }}
                          onClick={() => { if (props.step < 2) props.onStepChange(props.step + 1); else props.onSave() }}
                          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
                          style={{
                            background: props.step === 0 && !props.form.name.trim() ? 'rgba(0,0,0,0.15)' : (props.editingMachine ? ORANGE_GRAD : (props.step === 2 ? GREEN_GRAD : BLUE_GRAD)),
                            cursor: props.step === 0 && !props.form.name.trim() ? 'not-allowed' : 'pointer',
                          }}
                        >
                          {props.step < 2 ? (
                            <>
                              Siguiente <ChevronRight size={14} />
                            </>
                          ) : (
                            props.editingMachine ? 'Guardar Cambios' : 'Registrar Máquina'
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence></>
            )}
            <AnimatePresence>
              {props.showConfirmClose && (
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
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: props.editingMachine ? 'rgba(255,149,0,0.1)' : `${RED}15` }}>
                      <X size={18} color={props.editingMachine ? ORANGE : RED} />
                    </div>
                    <div>
                      <p className="text-sm font-bold mb-1" style={{ color: '#1A1A1E' }}>{props.editingMachine ? '¿Deseas salirte de la edición?' : '¿Abandonar el registro?'}</p>
                      <p className="text-xs leading-relaxed" style={{ color: 'rgba(0,0,0,0.4)' }}>
                        {props.editingMachine ? 'Si sales ahora, los cambios no guardados se perderán.' : 'Si cierras ahora, los datos ingresados se perderán.'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2.5 w-full">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => props.onConfirmClose(false)}
                        className="flex-1 py-2.5 rounded-xl text-xs font-medium cursor-pointer"
                        style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.5)' }}
                      >
                        Seguir aquí
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { props.onConfirmClose(false); props.onClose() }}
                        className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
                        style={{ background: props.editingMachine ? ORANGE : RED }}
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
  )
}
