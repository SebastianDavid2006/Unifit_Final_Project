import { motion, AnimatePresence } from 'motion/react'
import { X, Power, PenLine, Check } from 'lucide-react'
import type { Trainer } from '@/data/trainers'
import { StudentCardView } from '@/assets/models/ui/objects/student_card/StudentCardModel'
import { TelephoneView } from '@/assets/models/ui/objects/telephone/TelephoneModel'
import { LockView } from '@/assets/models/ui/objects/lock/LockModel'
import { StethoscopeView } from '@/assets/models/ui/objects/stethoscope/StethoscopeModel'
import { CalendarView } from '@/assets/models/ui/objects/calendar/CalendarModel'
import { BLUE_GRAD, GREEN_BLUE_GRAD, RED } from '../../../data'

interface TrainerInfoModalProps {
  isOpen: boolean
  trainer: Trainer
  editMode: boolean
  draft: Record<string, string> | null
  onClose: () => void
  onEdit: () => void
  onSave: () => void
  onStatusChange: () => void
  onDraftChange: (key: string, value: string) => void
}

const CATEGORIES = [
  {
    title: 'InformaciÃ³n personal',
    model: <StudentCardView />,
    fields: [
      { key: 'firstName', label: 'Primer nombre' },
      { key: 'secondName', label: 'Segundo nombre' },
      { key: 'lastName', label: 'Primer apellido' },
      { key: 'secondLastName', label: 'Segundo apellido' },
      { key: 'document', label: 'Documento' },
      { key: 'birthDate', label: 'Fecha de nacimiento' },
      { key: 'gender', label: 'GÃ©nero' },
      { key: 'age', label: 'Edad', readOnly: true },
    ] as const,
  },
  {
    title: 'InformaciÃ³n mÃ©dica',
    model: <StethoscopeView />,
    fields: [
      { key: 'eps', label: 'EPS' },
      { key: 'bloodType', label: 'Grupo sanguÃ­neo' },
    ] as const,
  },
  {
    title: 'InformaciÃ³n de contacto',
    model: <TelephoneView />,
    fields: [
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'TelÃ©fono' },
      { key: 'contactName', label: 'Contacto de emergencia' },
      { key: 'contactRelation', label: 'Parentesco' },
      { key: 'contactPhone', label: 'TelÃ©fono de emergencia' },
    ] as const,
  },
] as const

export function TrainerInfoModal({ isOpen, trainer, editMode, draft, onClose, onEdit, onSave, onStatusChange, onDraftChange }: TrainerInfoModalProps) {
  if (!isOpen) return null

  const calculateAge = () => {
    if (!trainer.birthDate) return 'â€”'
    try {
      const parts = trainer.birthDate.split('/')
      if (parts.length !== 3) return 'â€”'
      const birth = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]))
      const now = new Date()
      let age = now.getFullYear() - birth.getFullYear()
      const monthDiff = now.getMonth() - birth.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) age--
      return `${age} aÃ±os`
    } catch {
      return 'â€”'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[115] flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)' }}
      onClick={() => { onClose(); if (editMode) onSave() }}
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
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onSave}
                    title="Guardar"
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white cursor-pointer"
                    style={{ background: GREEN_BLUE_GRAD }}
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
              onClick={() => { onClose(); if (editMode) onSave() }}
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer"
              style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.45)' }}
            >
              <X size={16} />
            </motion.button>
          </div>
        </div>

        {/* CategorÃ­as */}
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
                    {cat.fields.map(f => (
                      <div key={f.key} className="flex flex-col">
                        <p className="text-[10px] font-bold uppercase tracking-wide mb-0.5" style={{ color: 'rgba(0,0,0,0.4)' }}>{f.label}</p>
                        {editMode && draft && !f.readOnly ? (
                          <input
                            type="text"
                            value={draft[f.key] ?? (f.key === 'age' ? calculateAge() : (trainer as any)[f.key] ?? '')}
                            onChange={e => onDraftChange(f.key, e.target.value)}
                            className="text-sm font-semibold w-full border rounded p-1"
                            style={{ color: '#0D1B2A' }}
                          />
                        ) : (
                          <p className="text-sm font-semibold" style={{ color: '#0D1B2A' }}>
                            {f.key === 'age' ? calculateAge() : (trainer as any)[f.key] ?? 'â€”'}
                          </p>
                        )}
                      </div>
                    ))}
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