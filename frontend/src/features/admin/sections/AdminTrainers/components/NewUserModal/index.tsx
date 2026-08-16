import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import confetti from 'canvas-confetti'
import permissionsScene from '@/assets/scenes/permmisions_scene.png'
import ModalHeader from './components/ModalHeader'
import ModalFooter from './components/ModalFooter'
import ConfirmCloseDialog from './components/ConfirmCloseDialog'
import RoleSelector from './components/RoleSelector'
import FingerprintScanner from './components/FingerprintScanner'
import SuccessScreen from './components/SuccessScreen'
import PersonalInfoSection from './sections/PersonalInfoSection'
import DataConsentSection from './sections/DataConsentSection'
import ContractSection from './sections/ContractSection'
import ParqSection from './sections/ParqSection'
import { INITIAL_FORM } from './data'
import type { FingerprintStatus, NewUserForm, UserRole } from './data'

interface NewUserModalProps {
  open: boolean
  onClose: () => void
  onSuccess?: (user: { name: string; email: string; phone: string; role: string; contactName: string; contactPhone: string; contactRelation: string; document: string; birthDate: string; gender: string; eps: string; bloodType: string }) => void
}

export default function NewUserModal({ open, onClose, onSuccess }: NewUserModalProps) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<NewUserForm>({ ...INITIAL_FORM })
  const [aceptaDatos, setAceptaDatos] = useState(false)
  const [aceptaContrato, setAceptaContrato] = useState(false)
  const [aceptaParq, setAceptaParq] = useState(false)
  const [role, setRole] = useState<UserRole | null>(null)
  const [fingerprintStatus, setFingerprintStatus] = useState<FingerprintStatus>('idle')
  const [success, setSuccess] = useState(false)
  const [shake, setShake] = useState(false)
  const [confirmClose, setConfirmClose] = useState(false)

  useEffect(() => {
    if (open) {
      setStep(1)
      setForm({ ...INITIAL_FORM })
      setAceptaDatos(false)
      setAceptaContrato(false)
      setAceptaParq(false)
      setRole(null)
      setFingerprintStatus('idle')
      setSuccess(false)
      setShake(false)
      setConfirmClose(false)
    }
  }, [open])

  const handleCloseClick = () => {
    if (success) {
      onClose()
    } else {
      setConfirmClose(true)
    }
  }

  const set = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }))

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  const canGoNext = (): boolean => {
    if (step === 1) {
      return !!(form.primerNombre && form.primerApellido && form.numDoc)
    }
    if (step === 2) return aceptaDatos
    if (step === 3) return aceptaContrato
    if (step === 4) return aceptaParq
    if (step === 5) return role !== null
    if (step === 6) return fingerprintStatus === 'captured'
    return true
  }

  const handleNext = () => {
    if (!canGoNext()) {
      triggerShake()
      return
    }
    if (step === 6) {
      submitForm()
      return
    }
    setStep(p => p + 1)
  }

  const handlePrev = () => {
    if (step > 1) setStep(p => p - 1)
  }

  const submitForm = () => {
    const payload = {
      ...form,
      aceptaDatos,
      aceptaContrato,
      role,
      huella: fingerprintStatus === 'captured' ? 'capturada' : null,
    }
    console.log('Nuevo usuario:', payload)
    const nombreCompleto = `${form.primerNombre} ${form.segundoNombre} ${form.primerApellido} ${form.segundoApellido}`.replace(/\s+/g, ' ').trim()
    onSuccess?.({ name: nombreCompleto, email: form.email, phone: form.telefono, role: role ?? 'trainer', contactName: form.nombreContacto, contactPhone: form.telefonoContacto, contactRelation: form.parentesco === 'Otro' ? form.otroParentesco : form.parentesco, document: `${form.tipoDoc}. ${form.numDoc}`, birthDate: form.fechaNac, gender: form.genero, eps: form.eps, bloodType: form.grupoSanguineo })
    setSuccess(true)
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.55 },
      colors: ['#1270B7', '#F43843', '#22C55E', '#F5A623'],
    })
  }

  const handleCaptureFingerprint = () => {
    if (fingerprintStatus !== 'idle') return
    setFingerprintStatus('scanning')
    setTimeout(() => {
      setFingerprintStatus('captured')
    }, 5000)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(6px)' }}
          onClick={handleCloseClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={`flex flex-col relative ${success ? 'overflow-visible' : 'overflow-hidden'} ${step === 5 && !success
              ? 'w-full h-full'
              : `rounded-3xl w-full max-w-2xl mx-4 ${success ? '' : step === 1 ? 'h-[90vh] max-h-[700px]' : step === 6 ? 'min-h-[520px] max-h-[660px] h-auto' : 'min-h-[480px] max-h-[600px] h-auto'}`}`}
            style={{
              background: '#FFFFFF',
              border: step === 5 && !success ? 'none' : '1px solid rgba(0,0,0,0.04)',
              boxShadow: step === 5 && !success ? 'none' : '0 25px 60px rgba(0,0,0,0.12)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {step === 5 && !success && (
              <>
                <div className="absolute inset-0 z-0" style={{
                  background: 'radial-gradient(ellipse at center, #182634 0%, #0a1017 78%)',
                }} />
                <img
                  src={permissionsScene}
                  alt="Escena de permisos"
                  className="absolute inset-0 z-0 w-full h-full object-cover select-none pointer-events-none"
                  draggable={false}
                />
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.05 }}
                  className="absolute inset-0 z-0 pointer-events-none"
                  style={{ background: '#000000' }}
                />
                <div
                  className="absolute inset-0 z-0 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 38%, rgba(0,0,0,0.65) 100%)',
                  }}
                />
                <div
                  className="absolute inset-0 z-0 pointer-events-none"
                  style={{
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    maskImage: 'radial-gradient(ellipse at center, transparent 45%, black 100%)',
                    WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 45%, black 100%)',
                  }}
                />
              </>
            )}
            {success ? (
              <SuccessScreen onClose={onClose} />
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, filter: 'blur(6px)' }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col flex-1 min-h-0"
                >
                  {step !== 5 && (
                    <ModalHeader step={step} onClose={handleCloseClick} />
                  )}

                  <div className={step === 5 ? 'relative z-10 flex-1 overflow-hidden' : 'flex-1 overflow-y-auto px-6 pb-6 pt-5'}>
                    <motion.div
                      className={step === 5 ? 'h-full' : ''}
                      animate={shake ? { x: [0, -4, 4, -4, 4, 0] } : {}}
                      transition={{ duration: 0.4 }}
                    >
                      {step === 1 && <PersonalInfoSection form={form} onChange={set} />}
                      {step === 2 && <DataConsentSection accepted={aceptaDatos} onChange={setAceptaDatos} />}
                      {step === 3 && <ContractSection accepted={aceptaContrato} onChange={setAceptaContrato} />}
                      {step === 4 && <ParqSection accepted={aceptaParq} onChange={setAceptaParq} />}
                      {step === 5 && <RoleSelector role={role} onRoleChange={setRole} />}
                      {step === 6 && <FingerprintScanner status={fingerprintStatus} />}
                    </motion.div>
                  </div>

                  <ModalFooter
                    step={step}
                    fingerprintStatus={fingerprintStatus}
                    onPrev={handlePrev}
                    onCapture={handleCaptureFingerprint}
                    onNext={handleNext}
                  />
                </motion.div>
              </AnimatePresence>
            )}

            <AnimatePresence>
              {confirmClose && (
                <ConfirmCloseDialog
                  onStay={() => setConfirmClose(false)}
                  onLeave={() => { setConfirmClose(false); onClose() }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
