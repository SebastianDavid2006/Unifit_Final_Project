import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { Exercise, Status } from '@/data/types'
import { BLUE, meshInputBg, meshInputHover } from '@/data/constants'
import { MuscleGroupPicker } from '@/modules/equipment/EquipmentPage/components/MuscleGroupPicker'
import { LevelSelector } from '@/modules/equipment/EquipmentPage/components/LevelSelector'
import { SuccessScreen } from './components/SuccessScreen'
import { StepHeader } from './components/StepHeader'
import { ImageUpload } from './components/ImageUpload'
import { ModalFooter } from './components/ModalFooter'
import { CreateAnotherDialog } from './components/CreateAnotherDialog'
import { ConfirmCloseDialog } from './components/ConfirmCloseDialog'

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
              <SuccessScreen
                editing={!!props.editing}
                createdCount={props.createdCount}
                name={props.form.name}
                onClose={props.onClose}
                onCreatedCountChange={props.onCreatedCountChange}
              />
            ) : (
              <>
                {/* ── Header ── */}
                <StepHeader
                  editing={!!props.editing}
                  step={props.step}
                  onConfirmClose={() => props.onConfirmClose(true)}
                  title={props.step === 0 ? 'Datos básicos' : props.step === 1 ? 'Categoría y dificultad' : 'Contenido visual'}
                />

                {/* ── Body ── */}
                <div className="flex-1 overflow-y-auto px-6 pb-6 pt-5">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={props.step}
                      initial={{ opacity: 0, filter: 'blur(6px)' }}
                      animate={{ opacity: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, filter: 'blur(6px)' }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                  {/* Step 0 — Name, Description */}
                  {props.step === 0 && (
                    <div className="space-y-4">
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
                    </div>
                  )}

                  {/* Step 1 — Muscle Groups + Level */}
                  {props.step === 1 && (
                    <div className="space-y-5">
                      <div>
                        <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.6)' }}>Grupos musculares</label>
                        <p className="text-[10px] mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>Selecciona uno o más grupos musculares que trabaja este ejercicio.</p>
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

                  {/* Step 2 — Visual Content */}
                  {props.step === 2 && (
                    <ImageUpload
                      value={props.form.imageUrl}
                      onChange={imageUrl => props.onFormChange({ ...props.form, imageUrl })}
                    />
                  )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* ── Footer ── */}
                <ModalFooter
                  editing={!!props.editing}
                  step={props.step}
                  nameTrimmed={!!props.form.name.trim()}
                  onStepChange={props.onStepChange}
                  onConfirmClose={() => props.onConfirmClose(true)}
                  onSave={props.onSave}
                />
              </>
            )}
            <CreateAnotherDialog
              show={props.askCreateAnother}
              onAskCreateAnother={props.onAskCreateAnother}
              onStepChange={props.onStepChange}
              onFormChange={props.onFormChange}
              onCreateAnotherNo={props.onCreateAnotherNo}
            />
            <ConfirmCloseDialog
              show={props.confirmClose}
              editing={!!props.editing}
              onConfirm={props.onConfirmClose}
              onClose={props.onClose}
              onCreatedCountChange={props.onCreatedCountChange}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
