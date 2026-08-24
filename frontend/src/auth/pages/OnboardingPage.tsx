import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Check, Calendar, FileText, Fingerprint, ArrowRight, ArrowLeft } from 'lucide-react'
import { AuthShell } from '@/auth/components/AuthShell'
import { updateUser } from '@/auth/services/authService'
import type { MockSession, MockOnboarding } from '@/auth/types'
import logotipo from '@/assets/logo/logo.webp'

const FIRE = '#E63946'
const AMBER = '#F5A623'
const GREEN = '#30D158'

interface Step {
  id: keyof MockOnboarding
  label: string
  icon: React.ReactNode
  description: string
}

const STEPS: Step[] = [
  { id: 'cita', label: 'Agendar cita', icon: <Calendar size={20} />, description: 'Agenda tu cita de valoración inicial con un entrenador' },
  { id: 'firma', label: 'Firmar documentos', icon: <FileText size={20} />, description: 'Firma los contratos y autorizaciones necesarias' },
  { id: 'huella', label: 'Registrar huella', icon: <Fingerprint size={20} />, description: 'Registra tu huella para acceso al gimnasio' },
]

interface OnboardingPageProps {
  session: MockSession
  onComplete: () => void
  onBack: () => void
}

export function OnboardingPage({ session, onComplete, onBack }: OnboardingPageProps) {
  const [onboarding, setOnboarding] = useState<MockOnboarding>(session.user.onboarding)
  const [currentStep, setCurrentStep] = useState<keyof MockOnboarding>('cita')
  const [completedSteps, setCompletedSteps] = useState<Set<keyof MockOnboarding>>(new Set())

  useEffect(() => {
    const firstIncomplete = STEPS.find(s => !onboarding[s.id])
    if (firstIncomplete) {
      setCurrentStep(firstIncomplete.id)
    } else {
      setCurrentStep('cita')
    }
    const completed = new Set(Object.entries(onboarding).filter(([, v]) => v).map(([k]) => k as keyof MockOnboarding))
    setCompletedSteps(completed)
  }, [onboarding])

  const handleStepComplete = async (stepId: keyof MockOnboarding) => {
    const newOnboarding = { ...onboarding, [stepId]: true }
    setOnboarding(newOnboarding)
    setCompletedSteps(prev => new Set([...prev, stepId]))

    await updateUser(session.user.email, { onboarding: newOnboarding })

    const nextIncomplete = STEPS.find(s => !newOnboarding[s.id])
    if (nextIncomplete) {
      setCurrentStep(nextIncomplete.id)
    } else {
      await updateUser(session.user.email, { estado: 'activo' })
      onComplete()
    }
  }

  const handleCitaComplete = () => handleStepComplete('cita')
  const handleFirmaComplete = () => handleStepComplete('firma')
  const handleHuellaComplete = () => handleStepComplete('huella')

  const currentStepData = STEPS.find(s => s.id === currentStep)!

  return (
    <AuthShell onBack={onBack} autoDesktopVideo>
      {(ctx) => (
        <div className={`flex-1 min-h-0 overflow-y-auto py-6 flex flex-col ${ctx.isPhonePreview ? 'px-5' : 'px-6 sm:px-10'}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col flex-1 max-w-xl mx-auto w-full"
          >
            <div className="flex items-center justify-center mb-8">
              <img src={logotipo} alt="UNIFIT" style={{ height: 56, objectFit: 'contain' }} />
            </div>

            <div className="text-center mb-10">
              <h1 className="uppercase italic font-black text-white" style={{ fontSize: 'clamp(24px, 4vw, 32px)', letterSpacing: '0.04em' }}>
                Bienvenido a UNIFIT
              </h1>
              <p className="mt-3 text-sm" style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 320, margin: '0 auto' }}>
                Completa estos 3 pasos para activar tu cuenta y acceder al gimnasio
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 mb-10">
              {STEPS.map((step, i) => (
                <motion.div key={step.id} layout>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all"
                      style={{
                        background: completedSteps.has(step.id) ? `linear-gradient(135deg, ${GREEN}, #7CE495)` :
                          currentStep === step.id ? `linear-gradient(135deg, ${FIRE}, ${AMBER})` :
                          'rgba(255,255,255,0.06)',
                        border: currentStep === step.id && !completedSteps.has(step.id) ? '2px solid rgba(255,255,255,0.3)' : 'none',
                        color: completedSteps.has(step.id) ? '#04110a' : '#fff',
                      }}
                    >
                      {completedSteps.has(step.id) ? <Check size={16} strokeWidth={3} /> : step.icon}
                    </div>
                    {i < STEPS.length - 1 && (
                      <motion.div
                        className="w-16 h-1 rounded-full overflow-hidden"
                        style={{ background: completedSteps.has(step.id) ? `linear-gradient(135deg, ${GREEN}, #7CE495)` : 'rgba(255,255,255,0.08)' }}
                      />
                    )}
                  </div>
                  <p className="text-[10px] mt-1.5 text-center uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>
                    {step.label}
                  </p>
                </motion.div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1 flex flex-col"
              >
                <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{
                    background: currentStep === 'cita' ? 'rgba(230,57,70,0.15)' :
                      currentStep === 'firma' ? 'rgba(245,166,35,0.15)' :
                      'rgba(48,209,88,0.15)',
                    border: `1px solid ${currentStep === 'cita' ? 'rgba(230,57,70,0.3)' : currentStep === 'firma' ? 'rgba(245,166,35,0.3)' : 'rgba(48,209,88,0.3)'}`
                  }}>
                    {currentStepData.icon}
                  </div>
                  <h2 className="uppercase italic font-black text-white mb-2" style={{ fontSize: 22, letterSpacing: '0.02em' }}>
                    {currentStepData.label}
                  </h2>
                  <p className="text-sm max-w-sm" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                    {currentStepData.description}
                  </p>
                </div>

                <div className="flex-shrink-0 w-full">
                  {currentStep === 'cita' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCitaComplete}
                      className="w-full h-14 rounded-2xl text-base font-bold text-white flex items-center justify-center gap-2 cursor-pointer"
                      style={{ background: `linear-gradient(135deg, ${FIRE}, ${AMBER})`, boxShadow: `0 10px 30px ${FIRE}40` }}
                    >
                      Ir a Agenda para agendar
                      <ArrowRight size={18} />
                    </motion.button>
                  )}
                  {currentStep === 'firma' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleFirmaComplete}
                      className="w-full h-14 rounded-2xl text-base font-bold text-white flex items-center justify-center gap-2 cursor-pointer"
                      style={{ background: `linear-gradient(135deg, ${AMBER}, ${FIRE})`, boxShadow: `0 10px 30px ${AMBER}40` }}
                    >
                      Firmar documentos
                      <ArrowRight size={18} />
                    </motion.button>
                  )}
                  {currentStep === 'huella' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleHuellaComplete}
                      className="w-full h-14 rounded-2xl text-base font-bold text-white flex items-center justify-center gap-2 cursor-pointer"
                      style={{ background: `linear-gradient(135deg, ${GREEN}, #7CE495)`, boxShadow: `0 10px 30px ${GREEN}40` }}
                    >
                      Registrar huella
                      <ArrowRight size={18} />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            <p className="text-[11px] text-center mt-6 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.35)' }}>
              Paso {STEPS.findIndex(s => s.id === currentStep) + 1} de {STEPS.length}
            </p>
          </motion.div>
        </div>
      )}
    </AuthShell>
  )
}