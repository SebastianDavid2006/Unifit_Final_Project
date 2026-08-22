import { motion, AnimatePresence } from 'motion/react'
import { X, Sparkles } from 'lucide-react'
import viewGif from '@/assets/icons/animated/actions/view.gif'
import { ValuationSuccess } from './ValuationSuccess'
import { Step1Contexto } from './steps/Step1Contexto'
import { Step2Medidas } from './steps/Step2Medidas'
import { Step3Clinica } from './steps/Step3Clinica'
import { Step4Antecedentes } from './steps/Step4Antecedentes'
import { Step5Plan } from './steps/Step5Plan'
import { Step6Observaciones } from './steps/Step6Observaciones'
import type { ValuationForm } from '@/modules/students/StudentProfileData'

interface NewValuationModalProps {
  isOpen: boolean
  valuationForm: ValuationForm
  setValuationForm: (f: ValuationForm) => void
  valuationStep: number
  setValuationStep: (s: number) => void
  valuationViewMode: boolean
  setValuationViewMode: (v: boolean) => void
  valuationSuccess: boolean
  setValuationSuccess: (s: boolean) => void
  aiGenerating: boolean
  startAiRoutine: () => void
  onClose: () => void
  onRequestClose: () => void
  onCreateManual: () => void
  onSave: () => void
}

const STEPS = [
  { num: 1, title: 'Contexto del estudiante' },
  { num: 2, title: 'Medidas corporales' },
  { num: 3, title: 'Evaluación Clínica' },
  { num: 4, title: 'Antecedentes de salud' },
  { num: 5, title: 'Plan de entrenamiento' },
  { num: 6, title: 'Observaciones finales' },
] as const

function StepContent({ valuationStep, valuationForm, setValuationForm, valuationViewMode }: {
  valuationStep: number
  valuationForm: ValuationForm
  setValuationForm: (f: ValuationForm) => void
  valuationViewMode: boolean
}) {
  switch (valuationStep) {
    case 1: return <Step1Contexto valuationForm={valuationForm} setValuationForm={setValuationForm} valuationViewMode={valuationViewMode} />
    case 2: return <Step2Medidas valuationForm={valuationForm} setValuationForm={setValuationForm} valuationViewMode={valuationViewMode} />
    case 3: return <Step3Clinica valuationForm={valuationForm} setValuationForm={setValuationForm} valuationViewMode={valuationViewMode} />
    case 4: return <Step4Antecedentes valuationForm={valuationForm} setValuationForm={setValuationForm} valuationViewMode={valuationViewMode} />
    case 5: return <Step5Plan valuationForm={valuationForm} setValuationForm={setValuationForm} valuationViewMode={valuationViewMode} />
    case 6: return <Step6Observaciones valuationForm={valuationForm} setValuationForm={setValuationForm} valuationViewMode={valuationViewMode} />
    default: return null
  }
}

export function NewValuationModal({
  isOpen,
  valuationForm,
  setValuationForm,
  valuationStep,
  setValuationStep,
  valuationViewMode,
  setValuationViewMode,
  valuationSuccess,
  setValuationSuccess,
  aiGenerating,
  startAiRoutine,
  onClose,
  onRequestClose,
  onCreateManual,
  onSave,
}: NewValuationModalProps) {
  if (!isOpen) return null
  const handleClose = () => {
    if (valuationViewMode || valuationSuccess) {
      onClose()
    } else {
      onRequestClose()
    }
  }
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(6px)' }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
            className={`rounded-3xl w-full max-w-2xl flex flex-col mx-4 relative ${valuationSuccess ? 'overflow-visible' : 'overflow-hidden'}`}
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(0,0,0,0.04)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.12)',
              maxHeight: '90vh',
            }}
          >
            {/* Header */}
            <div className="flex-shrink-0 px-6 pt-4 pb-0">
              <div className="relative flex justify-end">
                {valuationViewMode && (
                  <img src={viewGif} alt="" className="absolute left-1/2 -translate-x-1/2 w-6 h-6 pointer-events-none" />
                )}
                <motion.button
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  variants={{
                    rest: { scale: 1, background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.3)' },
                    hover: { scale: 1.15, background: 'rgba(244,56,67,0.1)', color: '#F43843' },
                    tap: { scale: 0.9 },
                  }}
                  onClick={handleClose}
                  className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X size={15} />
                </motion.button>
              </div>
              {!valuationSuccess && (
                <>
                  {/* Step dots */}
                  <div className="flex items-center justify-center gap-1.5" style={{ marginTop: 12, marginBottom: 16 }}>
                    {STEPS.map(s => (
                      <motion.div
                        key={s.num}
                        animate={{
                          width: s.num === valuationStep ? 16 : 6,
                          background: s.num === valuationStep ? 'linear-gradient(135deg, #1270B7, #7ec8e3)' : 'rgba(0,0,0,0.12)',
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                        className="rounded-full"
                        style={{ height: 6 }}
                      />
                    ))}
                  </div>
                  {/* Step title */}
                  <span className="text-lg font-bold tracking-wide text-center block" style={{
                    color: '#1A1A1E',
                    marginBottom: 10,
                  }}>
                    {STEPS[valuationStep - 1]?.title}
                  </span>
                </>
              )}
            </div>

            {/* Scrollable body */}
            <div className={`flex-1 px-6 ${valuationSuccess ? 'overflow-visible pb-0' : 'overflow-y-auto pb-6'}`}>
              {valuationSuccess ? (
                <ValuationSuccess
                  aiGenerating={aiGenerating}
                  onStartAiRoutine={startAiRoutine}
                  onCreateManual={onCreateManual}
                />
              ) : (
                <motion.div
                  key={valuationStep}
                  initial={{ opacity: 0, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, filter: 'blur(6px)' }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <StepContent
                    valuationStep={valuationStep}
                    valuationForm={valuationForm}
                    setValuationForm={setValuationForm}
                    valuationViewMode={valuationViewMode}
                  />
                </motion.div>
              )}
            </div>

            {/* Footer */}
            {!valuationSuccess && (
              <div className="flex-shrink-0 px-6 py-4" style={{ borderTop: '1px solid rgba(0,0,0,0.04)', background: 'rgba(255,255,255,0.8)' }}>
                <div className="relative flex items-center justify-between">
                  {valuationViewMode && (
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.04, boxShadow: '0 10px 28px rgba(124,58,237,0.45)', transition: { duration: 0.15 } }}
                      whileTap={{ scale: 0.94, boxShadow: '0 2px 8px rgba(124,58,237,0.2)', transition: { duration: 0.1 } }}
                      onClick={startAiRoutine}
                      className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
                      style={{
                        background: 'linear-gradient(135deg, #BF5AF2, #7C3AED)',
                        boxShadow: '0 8px 22px rgba(124,58,237,0.3)',
                      }}
                    >
                      <Sparkles size={14} />
                      Generar rutina con IA
                    </motion.button>
                  )}
                  <div className="flex-1 flex justify-start">
                    {valuationStep > 1 ? (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setValuationStep(s => s - 1)}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer"
                        style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.5)' }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                        Atrás
                      </motion.button>
                    ) : <div />}
                  </div>

                  <div className="flex-1 flex justify-end">
                    <motion.button
                      type="button"
                      whileHover={valuationStep < 6 ? { scale: 1.04, boxShadow: '0 8px 25px rgba(18,112,183,0.35)', transition: { duration: 0.15 } } : {}}
                      whileTap={valuationStep < 6 ? { scale: 0.92, boxShadow: '0 2px 8px rgba(18,112,183,0.2)', transition: { duration: 0.1 } } : {}}
                      onClick={() => {
                        if (valuationStep < 6) {
                          setValuationStep(s => s + 1)
                        } else if (valuationViewMode) {
                          onClose()
                        } else {
                          onSave()
                        }
                      }}
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
                      style={{
                        background: !valuationViewMode && valuationStep === 6 ? 'linear-gradient(135deg, #22C55E, #16A34A)' : 'linear-gradient(135deg, #1270B7, #7ec8e3)',
                      }}
                    >
                      {valuationStep === 6 && valuationViewMode ? (
                        <>Cerrar</>
                      ) : valuationStep === 6 ? (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          Guardar Valoración
                        </>
                      ) : (
                        <>
                          Siguiente
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}