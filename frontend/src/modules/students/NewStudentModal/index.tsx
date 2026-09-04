import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import confetti from 'canvas-confetti'
import DemoInbox from '@/modules/students/components/DemoInbox'
import { api, mensajeError } from '@/lib/api'
import { getNiveles } from '@/types/catalogo'
import { listarProgramas } from '@/services/catalogo.service'
import { loadDocs, type StoredDocs } from '@/data/documents'
import { BLUE_GRAD, RED, STEPS_ADULT, STEPS_MINOR, INITIAL_FORM } from '@/modules/students/NewStudentData'
import type { TipoUsuario } from '@/modules/students/NewStudentData'

import { Step1Info } from './sections/Step1Info'
import { StepAcudiente } from './sections/StepAcudiente'
import { StepDocAgreement } from './sections/StepDocAgreement'
import { SuccessView } from './sections/SuccessView'

interface NewStudentModalProps {
  open: boolean
  onClose: () => void
}

export default function NewStudentModal({ open, onClose }: NewStudentModalProps) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ ...INITIAL_FORM })
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario | null>(null)
  const [aceptaDatos, setAceptaDatos] = useState(false)
  const [aceptaContrato, setAceptaContrato] = useState(false)
  const [aceptaParq, setAceptaParq] = useState(false)
  const [docs, setDocs] = useState<StoredDocs>(() => loadDocs())
  const [success, setSuccess] = useState(false)
  const [shake, setShake] = useState(false)
  const [confirmClose, setConfirmClose] = useState(false)
  const [showInbox, setShowInbox] = useState(false)
  const [createdEmail, setCreatedEmail] = useState('')
  const [error, setError] = useState('')

  const isMinor = useMemo(() => {
    if (!form.fechaNac) return false
    const birth = new Date(form.fechaNac)
    if (isNaN(birth.getTime())) return false
    const now = new Date()
    let age = now.getFullYear() - birth.getFullYear()
    const m = now.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--
    return age < 18
  }, [form.fechaNac])

  const steps = isMinor ? STEPS_MINOR : STEPS_ADULT
  const totalSteps = steps.length
  const currentStepLabel = steps.find(s => s.num === step)?.label ?? ''

  const [programasAgrupados, setProgramasAgrupados] = useState<Record<string, Record<string, { id_programa: string; nombre: string }[]>>>({})
  const [programasLoading, setProgramasLoading] = useState(true)

  useEffect(() => {
    setProgramasLoading(true)
    listarProgramas()
      .then(res => {
        const agrupados: Record<string, Record<string, { id_programa: string; nombre: string }[]>> = {}
        res.forEach(p => {
          if (!agrupados[p.universidad]) agrupados[p.universidad] = {}
          if (!agrupados[p.universidad][p.tipo_programa]) agrupados[p.universidad][p.tipo_programa] = []
          agrupados[p.universidad][p.tipo_programa].push({ id_programa: p.id_programa, nombre: p.nombre })
        })
        setProgramasAgrupados(agrupados)
      })
      .catch(() => {})
      .finally(() => setProgramasLoading(false))
  }, [])

  const getPrograms = (institucion: string, nivel: string) => {
    return programasAgrupados[institucion]?.[nivel]?.map(p => p.nombre) ?? []
  }

  useEffect(() => {
    if (open) {
      setStep(1)
      setForm({ ...INITIAL_FORM })
      setTipoUsuario(null)
      setAceptaDatos(false)
      setAceptaContrato(false)
      setAceptaParq(false)
      setDocs(loadDocs())
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

  const toggleTipoUsuario = (tipo: TipoUsuario) => {
    setTipoUsuario(prev => (prev === tipo ? null : tipo))
    const inst = 'Universitaria de Colombia'
    const level = getNiveles(inst)[0]
    const prog = getPrograms(inst, level)[0] ?? ''
    setForm(prev => ({
      ...prev,
      numCarnet: '', estado: 'Activo',
      institucion: inst, nivelFormacion: level, programa: prog,
      semestre: '1', modalidad: 'Presencial', jornada: 'Mañana',
      cargo: '', area: '',
    }))
  }

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  const canGoNext = (): boolean => {
    if (step === 1) {
      return !!(tipoUsuario && form.primerNombre && form.primerApellido && form.numDoc)
    }
    if (isMinor && step === 2) {
      return !!(form.acudientePrimerNombre && form.acudientePrimerApellido && form.acudienteDocumento)
    }
    const termsStep = isMinor ? 3 : 2
    if (step === termsStep) return aceptaDatos && aceptaContrato
    const parqStep = isMinor ? 4 : 3
    if (step === parqStep) return aceptaParq
    return true
  }

  const handleNext = () => {
    if (!canGoNext()) {
      triggerShake()
      return
    }
    if (step === totalSteps) {
      submitForm()
      return
    }
    setStep(p => p + 1)
  }

  const handlePrev = () => {
    if (step > 1) setStep(p => p - 1)
  }

  const termsStep = isMinor ? 3 : 2
  const stepDoc = step === termsStep ? docs.tratamiento : step === totalSteps ? docs.parq : null

  const submitForm = async () => {
    const MAP_TIPO_DOC: Record<string, string> = { CC: 'CC', TI: 'TI', CE: 'CE', Pasaporte: 'PA', RC: 'RC' }
    const MAP_GENERO: Record<string, string> = { Masculino: 'masculino', Femenino: 'femenino', Otro: 'otro' }
    const MAP_GRUPO: Record<string, string> = {
      'A+': 'a_positivo', 'A-': 'a_negativo', 'B+': 'b_positivo', 'B-': 'b_negativo',
      'AB+': 'ab_positivo', 'AB-': 'ab_negativo', 'O+': 'o_positivo', 'O-': 'o_negativo',
    }
    const MAP_PARENTESCO: Record<string, string> = {
      Padre: 'padre', Madre: 'madre', 'Hermano(a)': 'hermano_a', 'Abuelo(a)': 'abuelo_a',
      'Tío(a)': 'tio_a', 'Primo(a)': 'primo_a', Otro: 'otro',
    }
    const MAP_MODALIDAD: Record<string, string> = { Presencial: 'presencial', Virtual: 'virtual' }
    const MAP_JORNADA: Record<string, string> = { 'Mañana': 'diurna', Noche: 'nocturna', 'Fin de semana': 'finde' }
    const MAP_ROL: Record<string, string> = { estudiante: 'estudiante', profesor: 'profesor', administrador: 'administrativo' }

    const payload: Record<string, unknown> = {
      primer_nombre: form.primerNombre?.trim(),
      segundo_nombre: form.segundoNombre?.trim() || undefined,
      primer_apellido: form.primerApellido?.trim(),
      segundo_apellido: form.segundoApellido?.trim() || undefined,
      email_contacto: form.email?.trim(),
      telefono_contacto: form.telefono?.trim() || undefined,
      documento: form.numDoc?.trim(),
      tipo_documento: MAP_TIPO_DOC[form.tipoDoc] ?? 'CC',
      fecha_nacimiento: form.fechaNac || undefined,
      genero: MAP_GENERO[form.genero] ?? 'otro',
      eps: form.eps?.trim() || undefined,
      grupo_sanguineo: MAP_GRUPO[form.grupoSanguineo] ?? undefined,
      nombre_emergencia: form.nombreContacto?.trim() || undefined,
      telefono_emergencia: form.telefonoContacto?.trim() || undefined,
      parentesco_emergencia: form.parentesco ? MAP_PARENTESCO[form.parentesco] : undefined,
      tipo_usuario: MAP_ROL[tipoUsuario!] ?? 'estudiante',
    }

    if (isMinor) {
      payload.acudiente_primer_nombre = form.acudientePrimerNombre?.trim()
      payload.acudiente_primer_apellido = form.acudientePrimerApellido?.trim()
      payload.acudiente_documento = form.acudienteDocumento?.trim()
      payload.acudiente_tipo_documento = MAP_TIPO_DOC[form.acudienteTipoDoc] ?? 'CC'
      payload.acudiente_telefono_contacto = form.acudienteTelefono?.trim() || undefined
    }

    if (tipoUsuario === 'estudiante') {
      payload.id_programa = form.programa || undefined
      payload.numero_carnet = form.numCarnet?.trim() || undefined
      payload.semestre = form.semestre ? Number(form.semestre) : undefined
      payload.modalidad = MAP_MODALIDAD[form.modalidad]
      payload.jornada = MAP_JORNADA[form.jornada]
      payload.es_egresado = form.estado === 'Egresado'
    } else {
      payload.id_cargo = form.cargo || undefined
      payload.id_area = form.area || undefined
    }

    try {
      const res = await api.post('/usuarios', payload)
      const userId = res.data.usuario?.id_usuario
      if (userId) {
        await Promise.all([
          api.put(`/usuarios/${userId}/aceptar-documento`, { tipo_documento_legal: 'tratamiento_datos' }),
          api.put(`/usuarios/${userId}/aceptar-documento`, { tipo_documento_legal: 'contrato_gym' }),
          api.put(`/usuarios/${userId}/parq`),
        ])
      }
      const email = (form.email || '').trim()
      setCreatedEmail(email)
      setSuccess(true)
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#1270B7', '#F43843', '#22C55E', '#F5A623'],
      })
    } catch (err) {
      setError(mensajeError(err))
      triggerShake()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
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
              className={`rounded-3xl w-full max-w-2xl flex flex-col mx-4 relative ${success ? 'overflow-visible' : 'overflow-hidden'} ${success ? '' : step === 1 ? 'h-[90vh] max-h-[700px]' : 'min-h-[480px] max-h-[600px] h-auto'}`}
              style={{
                background: '#FFFFFF',
                border: '1px solid rgba(0,0,0,0.04)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.12)',
              }}
              onClick={e => e.stopPropagation()}
            >
              {success ? (
                <SuccessView
                  createdEmail={createdEmail}
                  onShowInbox={() => setShowInbox(true)}
                  onClose={onClose}
                />
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
                    {/* Header */}
                    <div className="sticky top-0 z-10 flex-shrink-0" style={{
                      background: 'rgba(255,255,255,0.9)',
                      borderBottom: '1px solid rgba(0,0,0,0.04)',
                    }}>
                      <div className="flex items-center justify-end p-4 pb-0">
                        <motion.button
                          initial="rest"
                          whileHover="hover"
                          whileTap="tap"
                          variants={{
                            rest: { scale: 1, background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.3)' },
                            hover: { scale: 1.15, background: 'rgba(244,56,67,0.1)', color: RED },
                            tap: { scale: 0.9 },
                          }}
                          onClick={handleCloseClick}
                          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors"
                        >
                          <X size={15} />
                        </motion.button>
                      </div>
                      <div className="flex items-center justify-center gap-1.5" style={{ marginTop: 12, marginBottom: 16 }}>
                        {steps.map((s) => (
                          <motion.div
                            key={s.num}
                            animate={{
                              width: s.num === step ? 16 : 6,
                              background: s.num === step ? BLUE_GRAD : 'rgba(0,0,0,0.12)',
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
                        {currentStepLabel}
                      </span>
                    </div>

                    {/* Body (scrollable) */}
                    <div className="flex-1 flex flex-col min-h-0 px-6 pb-6 pt-5 overflow-y-auto">
                      <motion.div
                        className={step === totalSteps ? 'flex flex-col flex-1 min-h-0' : ''}
                        animate={shake ? { x: [0, -4, 4, -4, 4, 0] } : {}}
                        transition={{ duration: 0.4 }}
                      >
                        {step === 1 && (
                          <Step1Info
                            form={form}
                            set={set}
                            tipoUsuario={tipoUsuario}
                            toggleTipoUsuario={toggleTipoUsuario}
                            setForm={setForm}
                            isMinor={isMinor}
                          />
                        )}
                        {isMinor && step === 2 && (
                          <StepAcudiente form={form} set={set} />
                        )}
                        {step === termsStep && (
                          <StepDocAgreement
                            step={2}
                            docs={docs}
                            aceptaDatos={aceptaDatos}
                            setAceptaDatos={setAceptaDatos}
                            aceptaContrato={aceptaContrato}
                            setAceptaContrato={setAceptaContrato}
                            aceptaParq={aceptaParq}
                            setAceptaParq={setAceptaParq}
                          />
                        )}
                        {step === totalSteps && (
                          <StepDocAgreement
                            step={4}
                            docs={docs}
                            aceptaDatos={aceptaDatos}
                            setAceptaDatos={setAceptaDatos}
                            aceptaContrato={aceptaContrato}
                            setAceptaContrato={setAceptaContrato}
                            aceptaParq={aceptaParq}
                            setAceptaParq={setAceptaParq}
                          />
                        )}
                      </motion.div>
                      {error && (
                        <div className="mt-3 px-4 py-2.5 rounded-xl text-[11px] font-semibold" style={{ background: 'rgba(244,56,67,0.08)', border: '1px solid rgba(244,56,67,0.25)', color: '#D32F2F' }}>
                          {error}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex-shrink-0 p-6 pt-4" style={{
                      borderTop: '1px solid rgba(0,0,0,0.04)',
                      background: 'rgba(255,255,255,0.8)',
                    }}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1 flex justify-start">
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handlePrev}
                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium cursor-pointer"
                            style={{ background: 'rgba(0,0,0,0.04)', color: step > 1 ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.15)' }}
                            disabled={step === 1}
                          >
                            <ChevronLeft size={14} />
                            Atrás
                          </motion.button>
                        </div>

                        <div className="flex-1 flex justify-center gap-3">
                          {stepDoc?.dataUrl && (
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => window.open(stepDoc.dataUrl, '_blank')}
                              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium cursor-pointer"
                              style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.5)' }}
                            >
                              <ExternalLink size={12} />
                              Abrir documento
                            </motion.button>
                          )}
                        </div>

                        <div className="flex-1 flex justify-end">
                          <motion.button
                            type="button"
                            variants={{
                              rest: { scale: 1, boxShadow: '0 4px 15px rgba(18,112,183,0)' },
                              hover: {
                                scale: 1.06,
                                boxShadow: step === totalSteps
                                  ? '0 8px 30px rgba(0,251,100,0.35), 0 0 60px rgba(0,155,149,0.15)'
                                  : '0 8px 30px rgba(18,112,183,0.35), 0 0 60px rgba(18,112,183,0.1)',
                                transition: { type: 'spring', stiffness: 400, damping: 12 },
                              },
                              tap: {
                                scale: 0.92,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                transition: { type: 'spring', stiffness: 500, damping: 10 },
                              },
                            }}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={handleNext}
                            disabled={!canGoNext()}
                            className="relative flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white overflow-hidden cursor-pointer"
                            style={{
                              background: !canGoNext() ? 'rgba(0,0,0,0.15)' : step === totalSteps ? 'linear-gradient(135deg, #22C55E, #1270B7)' : BLUE_GRAD,
                              cursor: !canGoNext() ? 'not-allowed' : 'pointer',
                            }}
                          >
                            <motion.span
                              variants={{
                                rest: { opacity: 0, scale: 0 },
                                hover: { opacity: 1, scale: 2.5 },
                                tap: { opacity: 0, scale: 0 },
                              }}
                              initial="rest"
                              className="absolute inset-0 rounded-xl pointer-events-none"
                              style={{ background: 'rgba(255,255,255,0.2)' }}
                            />
                            <motion.span
                              animate={{ x: [0, 3, 0] }}
                              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                              className="relative z-10"
                            >
                              {step === totalSteps ? 'Finalizar' : 'Siguiente'}
                            </motion.span>
                            {step < totalSteps && (
                              <motion.span
                                animate={{ x: [0, 2, 0] }}
                                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                className="relative z-10"
                              >
                                <ChevronRight size={14} />
                              </motion.span>
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Close confirmation */}
              <AnimatePresence>
                {confirmClose && (
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
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(244,56,67,0.1)' }}>
                        <X size={18} color={RED} />
                      </div>
                      <div>
                        <p className="text-sm font-bold mb-1" style={{ color: '#1A1A1E' }}>¿Abandonar el registro?</p>
                        <p className="text-xs leading-relaxed" style={{ color: 'rgba(0,0,0,0.4)' }}>
                          Si cierras ahora, los datos ingresados se perderán.
                        </p>
                      </div>
                      <div className="flex items-center gap-2.5 w-full">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setConfirmClose(false)}
                          className="flex-1 py-2.5 rounded-xl text-xs font-medium cursor-pointer"
                          style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.5)' }}
                        >
                          Seguir aquí
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => { setConfirmClose(false); onClose() }}
                          className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
                          style={{ background: RED }}
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
          <DemoInbox open={showInbox} onClose={() => setShowInbox(false)} />
        </>
      )}
    </AnimatePresence>
  )
}
