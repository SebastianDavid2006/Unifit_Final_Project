import { useState } from 'react'
import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Power, PenLine, Check } from 'lucide-react'
import type { Trainer } from '@/services/usuario.service'
import { StudentCardView } from '@/assets/models/ui/objects/student_card/StudentCardModel'
import { TelephoneView } from '@/assets/models/ui/objects/telephone/TelephoneModel'
import { BLUE_GRAD, GREEN_BLUE_GRAD, RED } from '../../../data'
import { TIPO_DOC, GENEROS } from '@/data/config/catalogosRegistro'

interface TrainerInfoModalProps {
  isOpen: boolean
  trainer: Trainer
  editMode: boolean
  draft: Record<string, string> | null
  onClose: () => void
  onEdit: () => void
  onSave: () => void | Promise<void>
  onStatusChange: () => void
  onDraftChange: (key: string, value: string) => void
  guardando?: boolean
  errorGuardado?: string | null
}

type CampoType = 'text' | 'email' | 'date' | 'select'

interface Campo {
  key: string
  label: string
  type?: CampoType
  required?: boolean
  options?: { value: string; label: string }[]
}

const TIPO_DOC_CODIGOS = TIPO_DOC.map(o => ({ value: o.value, label: o.value }))
const GENEROS_OPCIONES = GENEROS.map(g => ({ value: g, label: g }))

const CATEGORIES: { title: string; model: ReactNode; fields: Campo[] }[] = [
  {
    title: 'Información personal',
    model: <StudentCardView />,
    fields: [
      { key: 'firstName', label: 'Primer nombre', required: true },
      { key: 'secondName', label: 'Segundo nombre' },
      { key: 'lastName', label: 'Primer apellido', required: true },
      { key: 'secondLastName', label: 'Segundo apellido' },
      { key: 'documentType', label: 'Tipo de documento', type: 'select', required: true, options: TIPO_DOC_CODIGOS },
      { key: 'document', label: 'Número de documento', required: true },
      { key: 'birthDate', label: 'Fecha de nacimiento', type: 'date', required: true },
      { key: 'gender', label: 'Género', type: 'select', required: true, options: GENEROS_OPCIONES },
    ],
  },
  {
    title: 'Información de contacto',
    model: <TelephoneView />,
    fields: [
      { key: 'email', label: 'Email', type: 'email', required: true },
      { key: 'phone', label: 'Teléfono' },
    ],
  },
]

export function TrainerInfoModal({ isOpen, trainer, editMode, draft, onClose, onEdit, onSave, onStatusChange, onDraftChange, guardando = false, errorGuardado = null }: TrainerInfoModalProps) {
  const [errores, setErrores] = useState<Record<string, boolean>>({})

  if (!isOpen) return null

  function faltantes(): string[] {
    return CATEGORIES.flatMap(cat => cat.fields.filter(f => errores[f.key]).map(f => f.label))
  }

  function validar(): boolean {
    if (!draft) return false
    const vacios: Record<string, boolean> = {}
    for (const cat of CATEGORIES) {
      for (const f of cat.fields) {
        if (f.required && !(draft[f.key] ?? '').trim()) vacios[f.key] = true
      }
    }
    setErrores(vacios)
    return Object.keys(vacios).length === 0
  }

  function limpiarError(key: string) {
    if (!errores[key]) return
    setErrores(prev => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  async function handleSave() {
    if (validar()) await onSave()
  }

  // Al cerrar ya no se auto-guarda: con persistencia remota el guardado es
  // asíncrono y cerraría antes de que el backend responda. Para discarding
  // cambios hay que pulsar Guardar explícitamente.
  function handleClose() {
    onClose()
  }

  const faltantesList = faltantes()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[115] flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)' }}
      onClick={handleClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-5xl max-h-[85vh] flex flex-col rounded-[28px] relative overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.6)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.18)',
        }}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-7 pt-6 pb-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0" style={{
              background: trainer.status === 'active'
                ? 'linear-gradient(135deg, #30D158, #20A040)'
                : 'linear-gradient(135deg, #8E8E93, #636366)',
              fontSize: 14,
            }}>
              {trainer.avatar}
            </div>
            <div>
              <h2 className="text-lg font-extrabold" style={{ color: '#0D1B2A' }}>{trainer.name}</h2>
              <p className="text-xs font-medium" style={{ color: 'rgba(0,0,0,0.4)' }}>
                {trainer.role === 'admin' ? 'Administrador' : 'Entrenador'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AnimatePresence mode="wait" initial={false}>
              {editMode && draft ? (
                <motion.div
                  key="edit"
                  initial={{ opacity: 0, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, filter: 'blur(4px)' }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-2"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onStatusChange}
                    title={trainer.status === 'active' ? 'Desactivar cuenta' : 'Activar cuenta'}
                    className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer"
                    style={trainer.status === 'active'
                      ? { background: 'rgba(244,56,67,0.1)', color: RED }
                      : { background: 'rgba(34,197,94,0.12)', color: '#22C55E' }}
                  >
                    <Power size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: guardando ? 1 : 1.1 }}
                    whileTap={{ scale: guardando ? 1 : 0.9 }}
                    onClick={handleSave}
                    disabled={guardando}
                    title={guardando ? 'Guardando...' : 'Guardar'}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white cursor-pointer disabled:cursor-not-allowed"
                    style={{ background: guardando ? 'rgba(18,112,183,0.45)' : GREEN_BLUE_GRAD }}
                  >
                    <Check size={16} />
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="view"
                  initial={{ opacity: 0, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, filter: 'blur(4px)' }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-2"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onEdit}
                    title="Editar"
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white cursor-pointer"
                    style={{ background: BLUE_GRAD, boxShadow: '0 4px 12px rgba(18,112,183,0.25)' }}
                  >
                    <PenLine size={16} />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button
              whileHover={{ scale: 1.1, background: 'rgba(244,56,67,0.1)', color: '#F43843' }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer"
              style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.45)' }}
            >
              <X size={16} />
            </motion.button>
          </div>
        </div>

        {/* Categorías */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={editMode ? 'edit' : 'view'}
            initial={{ opacity: 0, filter: 'blur(6px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(6px)' }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 min-h-0 overflow-y-auto px-7 py-6"
            style={{ scrollbarWidth: 'thin' }}
          >
            {editMode && errorGuardado && (
              <div className="mb-4 rounded-xl px-4 py-3" style={{ background: 'rgba(244,56,67,0.08)', border: '1px solid rgba(244,56,67,0.25)' }}>
                <p className="text-xs font-bold" style={{ color: RED }}>No se pudo guardar</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.55)' }}>{errorGuardado}</p>
              </div>
            )}

            {editMode && faltantesList.length > 0 && (
              <div className="mb-4 rounded-xl px-4 py-3" style={{ background: 'rgba(244,56,67,0.08)', border: '1px solid rgba(244,56,67,0.25)' }}>
                <p className="text-xs font-bold" style={{ color: RED }}>Faltan campos obligatorios</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.55)' }}>{faltantesList.join(', ')}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {CATEGORIES.map((cat, ci) => (
                <motion.div
                  key={cat.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 + ci * 0.06 }}
                  className="rounded-2xl p-5 flex flex-col"
                  style={{
                    background: 'linear-gradient(145deg, rgba(18,112,183,0.09) 0%, rgba(18,112,183,0.03) 55%, rgba(255,255,255,0.6) 100%)',
                    boxShadow: '0 1px 0 rgba(255,255,255,0.7) inset, 0 4px 16px rgba(18,112,183,0.06)',
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl flex-shrink-0 overflow-hidden" style={{ background: 'rgba(18,112,183,0.10)' }}>
                      {cat.model}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-6 rounded-full flex-shrink-0" style={{ background: 'rgba(18,112,183,0.35)' }} />
                      <p className="text-sm font-extrabold capitalize" style={{ color: '#0D1B2A' }}>{cat.title}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-5 gap-y-3 flex-1">
                    {cat.fields.map(f => {
                      const valor = draft?.[f.key] ?? (trainer as any)[f.key] ?? ''
                      const conError = !!errores[f.key]
                      return (
                        <div key={f.key} className="flex flex-col">
                          <p className="text-[10px] font-bold uppercase tracking-wide mb-0.5" style={{ color: conError ? RED : 'rgba(0,0,0,0.4)' }}>
                            {f.label}
                            {f.required && <span style={{ color: RED }}> *</span>}
                          </p>
                          {editMode && draft ? (
                            f.type === 'select' ? (
                              <select
                                value={valor}
                                onChange={e => { onDraftChange(f.key, e.target.value); limpiarError(f.key) }}
                                className="text-sm font-semibold w-full border rounded p-1 bg-transparent"
                                style={{ color: '#0D1B2A', borderColor: conError ? RED : 'rgba(0,0,0,0.12)' }}
                              >
                                <option value="">Seleccionar</option>
                                {f.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                              </select>
                            ) : (
                              <input
                                type={f.type === 'date' ? 'date' : f.type === 'email' ? 'email' : 'text'}
                                value={valor}
                                onChange={e => { onDraftChange(f.key, e.target.value); limpiarError(f.key) }}
                                className="text-sm font-semibold w-full border rounded p-1 bg-transparent"
                                style={{ color: '#0D1B2A', borderColor: conError ? RED : 'rgba(0,0,0,0.12)' }}
                              />
                            )
                          ) : (
                            <p className="text-sm font-semibold" style={{ color: '#0D1B2A' }}>{valor || '—'}</p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
