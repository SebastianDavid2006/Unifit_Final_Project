import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { Machine, Exercise } from '@/data/types'
import { BLUE, meshInputBg, meshInputHover, muscleToZones } from '@/data/constants'
import { MuscleGroupPicker } from '@/modules/equipment/EquipmentPage/components/MuscleGroupPicker'
import { LevelSelector } from '@/modules/equipment/EquipmentPage/components/LevelSelector'
import { SuccessScreen } from './components/SuccessScreen'
import { StepHeader } from './components/StepHeader'
import { ImageUpload } from './components/ImageUpload'
import { StatusSelector } from './components/StatusSelector'
import { ExerciseSelector } from './components/ExerciseSelector'
import { ModalFooter } from './components/ModalFooter'
import { ConfirmCloseDialog } from './components/ConfirmCloseDialog'

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
  exercises: Exercise[]
  onClose: () => void
  onSave: () => void
  onFormChange: (form: any) => void
  onStepChange: (step: number) => void
  onConfirmClose: (v: boolean) => void
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
              <SuccessScreen onClose={props.onClose} />
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
                  <StepHeader
                    editingMachine={!!props.editingMachine}
                    step={props.step}
                    onConfirmClose={() => props.onConfirmClose(true)}
                    title={props.step === 0 ? 'Datos básicos' : props.step === 1 ? 'Descripción' : 'Ejercicios'}
                  />

                  {/* ── Body ── */}
                  <div className="flex-1 overflow-y-auto px-6 pb-6 pt-5">
                    {/* Step 1 — Image, Name, Type, Status */}
                    {props.step === 0 && (
                      <div className="space-y-4">
                        <ImageUpload
                          value={props.form.imageDataUrl}
                          onChange={dataUrl => props.onFormChange({ ...props.form, imageDataUrl: dataUrl })}
                        />
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.6)' }}>Nombre <span style={{ color: 'rgba(244,56,67,1)' }}>*</span></label>
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
                        <StatusSelector
                          value={props.form.status}
                          onChange={status => props.onFormChange({ ...props.form, status })}
                        />
                      </div>
                    )}

                    {/* Step 2 — Description, Muscle Groups, Level, Observations */}
                    {props.step === 1 && (
                      <div className="space-y-5">
                        <div>
                          <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.6)' }}>Grupos musculares</label>
                          <p className="text-[10px] mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>Selecciona uno o más grupos musculares que trabaja esta máquina.</p>
                          <MuscleGroupPicker
                            value={props.form.muscleGroups}
                            onChange={muscleGroups => props.onFormChange({ ...props.form, muscleGroups })}
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.6)' }}>Nivel Recomendado</label>
                          <LevelSelector
                            value={props.form.recommendedLevel}
                            onChange={recommendedLevel => props.onFormChange({ ...props.form, recommendedLevel })}
                          />
                        </div>
                      </div>
                    )}

                    {/* Step 3 — Exercises */}
                    {props.step === 2 && (
                      <ExerciseSelector
                        form={props.form}
                        exercises={props.exercises}
                        muscleExercises={muscleExercises}
                        showMuscleDropdown={showMuscleDropdown}
                        activeMuscleFilter={activeMuscleFilter}
                        muscleDropdownRef={muscleDropdownRef}
                        onToggleMuscleDropdown={() => setShowMuscleDropdown(f => !f)}
                        onMuscleFilterChange={setActiveMuscleFilter}
                        onToggleExerciseSelection={props.onToggleExerciseSelection}
                      />
                    )}
                  </div>

                  {/* ── Footer ── */}
                  <ModalFooter
                    editingMachine={!!props.editingMachine}
                    step={props.step}
                    nameTrimmed={!!props.form.name.trim()}
                    onStepChange={props.onStepChange}
                    onSave={props.onSave}
                  />
                </motion.div>
              </AnimatePresence></>
            )}
            <ConfirmCloseDialog
              show={props.showConfirmClose}
              editingMachine={!!props.editingMachine}
              onConfirm={props.onConfirmClose}
              onClose={props.onClose}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
