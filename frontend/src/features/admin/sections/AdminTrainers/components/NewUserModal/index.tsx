import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import confetti from 'canvas-confetti'
import ModalHeader from './components/ModalHeader'
import ModalFooter from './components/ModalFooter'
import ConfirmCloseDialog from './components/ConfirmCloseDialog'
import RoleSelector from './components/RoleSelector'
import SuccessScreen from './components/SuccessScreen'
import PersonalInfoSection from './sections/PersonalInfoSection'
import DataConsentSection from './sections/DataConsentSection'
import { INITIAL_FORM } from './data'
import type { NewUserForm, UserRole, TipoUsuarioStaff } from './data'

interface NewUserModalProps {
  open: boolean
  onClose: () => void
  onSuccess?: (user: { name: string; email: string; phone: string; role: string; contactName: string; contactPhone: string; contactRelation: string; document: string; birthDate: string; gender: string; eps: string; bloodType: string; tipo_usuario: string; id_cargo?: string; id_area?: string }) => void
}

export default function NewUserModal({ open, onClose, onSuccess }: NewUserModalProps) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<NewUserForm>({ ...INITIAL_FORM })
  const [aceptaDatos, setAceptaDatos] = useState(false)
  const [role, setRole] = useState<UserRole | null>(null)
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuarioStaff | null>(null)
  const [success, setSuccess] = useState(false)
  const [shake, setShake] = useState(false)
  const [confirmClose, setConfirmClose] = useState(false)

  useEffect(() => {
    if (open) {
      setStep(1)
      setForm({ ...INITIAL_FORM })
      setAceptaDatos(false)
      setRole(null)
      setTipoUsuario(null)
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
    if (step === 3) return role !== null && tipoUsuario !== null
    return true
  }

  const handleNext = () => {
    if (!canGoNext()) {
      triggerShake()
      return
    }
    if (step === 3) {
      submitForm()
      return
    }
    setStep(p => p + 1)
  }

  const handlePrev = () => {
    if (step > 1) setStep(p => p - 1)
  }

  const submitForm = () => {
    const nombreCompleto = `${form.primerNombre} ${form.segundoNombre} ${form.primerApellido} ${form.segundoApellido}`.replace(/\s+/g, ' ').trim()
    onSuccess?.({
      name: nombreCompleto,
      email: form.email,
      phone: form.telefono,
      role: role ?? 'trainer',
      contactName: form.nombreContacto,
      contactPhone: form.telefonoContacto,
      contactRelation: form.parentesco === 'Otro' ? form.otroParentesco : form.parentesco,
      document: `${form.tipoDoc}. ${form.numDoc}`,
      birthDate: form.fechaNac,
      gender: form.genero,
      eps: form.eps,
      bloodType: form.grupoSanguineo,
      tipo_usuario: tipoUsuario ?? 'profesor',
    })
    setSuccess(true)
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.55 },
      colors: ['#1270B7', '#F43843', '#22C55E', '#F5A623'],
    })
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
            className={`flex flex-col relative overflow-hidden rounded-3xl w-full max-w-2xl mx-4 ${
              success ? '' : step === 1 ? 'h-[90vh] max-h-[700px]' : 'min-h-[480px] max-h-[600px] h-auto'
            }`}
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(0,0,0,0.04)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.12)',
            }}
            onClick={e => e.stopPropagation()}
          >
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
                  <ModalHeader step={step} onClose={handleCloseClick} />

                  <div className="flex-1 overflow-y-auto px-6 pb-6 pt-5">
                    <motion.div
                      animate={shake ? { x: [0, -4, 4, -4, 4, 0] } : {}}
                      transition={{ duration: 0.4 }}
                    >
                      {step === 1 && <PersonalInfoSection form={form} onChange={set} />}
                      {step === 2 && <DataConsentSection accepted={aceptaDatos} onChange={setAceptaDatos} />}
                      {step === 3 && (
                        <RoleSelector
                          role={role}
                          onRoleChange={setRole}
                          tipoUsuario={tipoUsuario}
                          onTipoUsuarioChange={setTipoUsuario}
                        />
                      )}
                    </motion.div>
                  </div>

                  <ModalFooter
                    step={step}
                    fingerprintStatus="idle"
                    onPrev={handlePrev}
                    onCapture={() => {}}
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
