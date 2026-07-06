import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import confetti from 'canvas-confetti'
import {
  Plus, X, Check, ChevronDown, Dumbbell, Trash2, Pencil,
  ChevronLeft, Upload, Camera,
} from 'lucide-react'
import type { Exercise, Status } from '../../data/types'
import {
  BLUE, BLUE_GRAD, GREEN_GRAD, ORANGE_GRAD, RED, ORANGE,
  muscleIcons, statusConfig, meshInputBg, meshInputHover,
} from '../../data/constants'
import { StatusBadge } from '../../components/ui/StatusBadge'
import coachExerciseSuccessImg from '../../assets/illustrations/characters/coach/coach_exercise_success.webp'
import machineExercisesImg from '../../assets/illustrations/equipment/cable_machine.webp'
import coachCongratsImg from '../../assets/illustrations/characters/coach/coach_congratulations.webp'

interface ExerciseManagerModalProps {
  show: boolean
  editing: Exercise | null
  step: number
  showSuccess: boolean
  askCreateAnother: boolean
  createdCount: number
  confirmClose: boolean
  form: {
    name: string
    zone: string
    description: string
    status: Status
    muscleGroups: string[]
    recommendedLevel: string
    imageUrl: string
    videoUrl: string
  }
  onClose: () => void
  onSave: () => void
  onFormChange: (form: any) => void
  onStepChange: (step: number) => void
  onConfirmClose: (v: boolean) => void
  onAskCreateAnother: (v: boolean) => void
  onCreatedCountChange: (v: number) => void
  onCreateAnotherNo: () => void
}

export function ExerciseManagerModal(props: ExerciseManagerModalProps) {
  const [showMuscleDropdown, setShowMuscleDropdown] = useState(false)
  const muscleDropdownRef = useRef<HTMLButtonElement>(null)

  return (
    <AnimatePresence>
      {props.show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
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
                    ¡{props.editing ? 'Ejercicio actualizado' : 'Registro Exitoso'}!
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="text-sm text-center mt-1.5 mb-8"
                    style={{ color: 'rgba(0,0,0,0.7)' }}
                  >
                    {props.editing || props.createdCount <= 1 ? (
                      <><span style={{ background: 'linear-gradient(135deg, #30D158, #0A84FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700 }}>{props.form.name}</span> ahora está disponible<br /></>
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
                    onClick={() => { props.onClose(); props.onCreatedCountChange(0) }}
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
                    {props.editing ? (
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
                          background: s === props.step + 1 ? (props.editing ? ORANGE_GRAD : BLUE_GRAD) : 'rgba(0,0,0,0.12)',
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                        className="rounded-full"
                        style={{ height: 6 }}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-bold tracking-wide text-center block pb-4" style={{ color: '#1A1A1E' }}>
                    {props.step === 0 ? 'Datos básicos' : props.step === 1 ? 'Categoría y dificultad' : 'Contenido visual'}
                  </span>
                </div>

                {/* ── Body ── */}
                <div className="flex-1 overflow-y-auto px-6 pb-6 pt-5">
                  {/* Step 0 — Name, Description, Status */}
                  {props.step === 0 && (
                    <div className="space-y-4">
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

                  {/* Step 1 — Muscle Groups + Level */}
                  {props.step === 1 && (
                    <div className="space-y-5">
                      <div>
                        <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.6)' }}>Grupos musculares</label>
                        <p className="text-[10px] mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>Selecciona uno o más grupos musculares que trabaja este ejercicio.</p>
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

                  {/* Step 2 — Visual Content */}
                  {props.step === 2 && (
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.6)' }}>Imagen <span style={{ color: 'rgba(0,0,0,0.2)' }}>(Opcional)</span></label>
                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          transition={{ duration: 0.2 }}
                          className="w-full h-full min-h-[120px] rounded-xl cursor-pointer overflow-hidden relative group"
                          style={{
                            background: props.form.imageUrl ? 'radial-gradient(ellipse at 30% 20%, rgba(48,209,88,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(48,209,88,0.08) 0%, transparent 50%), rgba(255,255,255,0.6)' : meshInputBg,
                            border: `1px solid ${props.form.imageUrl ? 'rgba(48,209,88,0.2)' : 'transparent'}`,
                          }}
                          onClick={() => {
                            if (!props.form.imageUrl) {
                              const input = document.createElement('input')
                              input.type = 'file'
                              input.accept = 'image/*'
                              input.onchange = e => {
                                const file = (e.target as HTMLInputElement).files?.[0]
                                if (file) {
                                  const reader = new FileReader()
                                  reader.onload = ev => props.onFormChange({ ...props.form, imageUrl: ev.target?.result as string })
                                  reader.readAsDataURL(file)
                                }
                              }
                              input.click()
                            }
                          }}
                          onMouseEnter={e => { if (!props.form.imageUrl) { e.currentTarget.style.background = meshInputHover; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)' } }}
                          onMouseLeave={e => { if (!props.form.imageUrl) { e.currentTarget.style.background = meshInputBg; e.currentTarget.style.borderColor = 'transparent' } }}
                        >
                          {props.form.imageUrl ? (
                            <>
                              <img src={props.form.imageUrl} alt="" className="w-full h-full object-cover" />
                              <div
                                onClick={e => { e.stopPropagation(); const input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*'; input.onchange = ev => { const file = (ev.target as HTMLInputElement).files?.[0]; if (file) { const reader = new FileReader(); reader.onload = ev2 => props.onFormChange({ ...props.form, imageUrl: ev2.target?.result as string }); reader.readAsDataURL(file) } }; input.click() }}
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
                            background: props.form.videoUrl ? 'radial-gradient(ellipse at 30% 20%, rgba(48,209,88,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(48,209,88,0.08) 0%, transparent 50%), rgba(255,255,255,0.6)' : meshInputBg,
                            border: `1px solid ${props.form.videoUrl ? 'rgba(48,209,88,0.2)' : 'transparent'}`,
                          }}
                          onClick={() => {
                            if (!props.form.videoUrl) {
                              const input = document.createElement('input')
                              input.type = 'file'
                              input.accept = 'video/*'
                              input.onchange = e => {
                                const file = (e.target as HTMLInputElement).files?.[0]
                                if (file) {
                                  const url = URL.createObjectURL(file)
                                  props.onFormChange({ ...props.form, videoUrl: url })
                                }
                              }
                              input.click()
                            }
                          }}
                          onMouseEnter={e => { if (!props.form.videoUrl) { e.currentTarget.style.background = meshInputHover; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)' } }}
                          onMouseLeave={e => { if (!props.form.videoUrl) { e.currentTarget.style.background = meshInputBg; e.currentTarget.style.borderColor = 'transparent' } }}
                        >
                          {props.form.videoUrl ? (
                            <>
                              <video src={props.form.videoUrl} className="w-full h-full object-cover" />
                              <div
                                onClick={e => { e.stopPropagation(); const input = document.createElement('input'); input.type = 'file'; input.accept = 'video/*'; input.onchange = ev => { const file = (ev.target as HTMLInputElement).files?.[0]; if (file) { props.onFormChange({ ...props.form, videoUrl: URL.createObjectURL(file) }) } }; input.click() }}
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
                      if (props.step > 0) props.onStepChange(props.step - 1)
                      else props.onConfirmClose(true)
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold"
                    style={{ color: 'rgba(0,0,0,0.3)' }}
                  >
                    <ChevronLeft size={14} />
                    {props.step === 0 ? 'Cancelar' : 'Anterior'}
                  </motion.button>
                  <motion.button
                    whileHover={props.step < 2 || !props.form.name.trim() ? { scale: 1 } : { scale: 1.06, boxShadow: props.editing ? '0 8px 30px rgba(255,149,0,0.35), 0 0 60px rgba(255,149,0,0.1)' : '0 8px 30px rgba(18,112,183,0.35), 0 0 60px rgba(18,112,183,0.1)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      if (props.step < 2) { props.onStepChange(props.step + 1) }
                      else { props.onSave() }
                    }}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all duration-200"
                    style={{
                      background: props.editing ? ORANGE_GRAD : BLUE_GRAD,
                      boxShadow: props.editing ? '0 4px 20px rgba(255,149,0,0.3)' : '0 4px 20px rgba(18,112,183,0.3)',
                      opacity: props.step === 0 && !props.form.name.trim() ? 0.5 : 1,
                    }}
                    disabled={props.step === 0 && !props.form.name.trim()}
                  >
                    {props.step < 2 ? 'Siguiente' : 'Guardar Ejercicio'}
                  </motion.button>
                </div>
              </>
            )}
            <AnimatePresence>
              {props.askCreateAnother && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer"
                  style={{ background: 'rgba(0,0,0,0.15)' }}
                  onClick={() => props.onAskCreateAnother(false)}
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
                          props.onFormChange({ name: '', zone: '', description: '', status: 'active' as Status, muscleGroups: [], recommendedLevel: 'principiante', imageUrl: '', videoUrl: '' })
                          props.onStepChange(0)
                          props.onAskCreateAnother(false)
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
                          props.onAskCreateAnother(false)
                          props.onCreateAnotherNo()
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
              {props.confirmClose && (
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
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: props.editing ? 'rgba(255,149,0,0.1)' : `${RED}15` }}>
                      <X size={18} color={props.editing ? ORANGE : RED} />
                    </div>
                    <div>
                      <p className="text-sm font-bold mb-1" style={{ color: '#1A1A1E' }}>{props.editing ? '¿Deseas salirte de la edición?' : '¿Abandonar el registro?'}</p>
                      <p className="text-xs leading-relaxed" style={{ color: 'rgba(0,0,0,0.4)' }}>
                        {props.editing ? 'Si sales ahora, los cambios no guardados se perderán.' : 'Si cierras ahora, los datos ingresados se perderán.'}
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
                        onClick={() => { props.onConfirmClose(false); props.onClose(); props.onCreatedCountChange(0) }}
                        className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
                        style={{ background: props.editing ? ORANGE : RED }}
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
