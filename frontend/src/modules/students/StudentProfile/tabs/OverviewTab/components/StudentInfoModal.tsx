import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Check, PenLine, Power, X, AlertTriangle } from 'lucide-react'
import { StudentCardView } from '@/assets/models/ui/objects/student_card/StudentCardModel'
import { CapView } from '@/assets/models/ui/objects/cap/CapModel'
import { StethoscopeView } from '@/assets/models/ui/objects/stethoscope/StethoscopeModel'
import { TelephoneView } from '@/assets/models/ui/objects/telephone/TelephoneModel'
import { ModalShell } from '@/modules/students/shared/components/ModalShell'
import type { Student } from '../../StudentProfileData'

const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #7ec8e3)'
const GREEN = '#22C55E'
const RED = '#F43843'
const GREEN_BLUE_GRAD = 'linear-gradient(135deg, #22C55E, #1270B7)'

interface StudentInfoModalProps {
  isOpen: boolean
  student: Student
  editable: Student
  onClose: () => void
  onUpdate: (patch: Partial<Student>) => void
}

export function StudentInfoModal({ isOpen, student, editable, onClose, onUpdate }: StudentInfoModalProps) {
  const [editMode, setEditMode] = useState(false)
  const [draft, setDraft] = useState<Record<string, string> | null>(null)
  const [confirm, setConfirm] = useState<'save' | 'status' | null>(null)

  const curStatus = editable.status ?? 'active'

  function buildDraft(): Record<string, string> {
    return {
      firstName: editable.firstName,
      secondName: editable.secondName,
      lastName: editable.lastName,
      secondLastName: editable.secondLastName,
      birthDate: editable.birthDate,
      gender: editable.gender,
      eps: editable.eps,
      bloodType: editable.bloodType,
      email: editable.email,
      phone: editable.phone,
      contactName: editable.contactName,
      contactRelation: editable.contactRelation || '',
      contactPhone: editable.contactPhone,
    }
  }

  function startEdit() {
    setDraft(buildDraft())
    setEditMode(true)
  }

  function saveDraft() {
    if (!draft) return
    onUpdate({
      firstName: draft.firstName,
      secondName: draft.secondName,
      lastName: draft.lastName,
      secondLastName: draft.secondLastName,
      birthDate: draft.birthDate,
      gender: draft.gender,
      eps: draft.eps,
      bloodType: draft.bloodType,
      email: draft.email,
      phone: draft.phone,
      contactName: draft.contactName,
      contactRelation: draft.contactRelation,
      contactPhone: draft.contactPhone,
    })
    setEditMode(false)
    setDraft(null)
  }

  function handleDraftChange(key: string, value: string) {
    setDraft(prev => (prev ? { ...prev, [key]: value } : prev))
  }

  function cancelEdit() {
    setEditMode(false)
    setDraft(null)
  }

  function handleConfirm() {
    if (confirm === 'save') {
      saveDraft()
    } else if (confirm === 'status') {
      onUpdate({ status: curStatus === 'active' ? 'inactive' : 'active' })
    }
    setConfirm(null)
  }

  const fullName = [student.firstName, student.secondName, student.lastName, student.secondLastName].filter(Boolean).join(' ')

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} maxWidth="max-w-5xl" zIndex={115} backdropBlur="blur(6px)" backdropOpacity="rgba(0,0,0,0.35)">
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
              background: 'linear-gradient(135deg, #30D158, #20A040)',
              fontSize: 14,
            }}>
              {student.avatar}
            </div>
            <div>
              <h2 className="text-lg font-extrabold" style={{ color: '#0D1B2A' }}>
                {fullName}
              </h2>
              <p className="text-xs font-medium" style={{ color: 'rgba(0,0,0,0.4)' }}>
                {student.faculty || student.program} · {student.institution}
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
                    onClick={() => setConfirm('status')}
                    title={curStatus === 'active' ? 'Desactivar cuenta' : 'Activar cuenta'}
                    className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer"
                    style={curStatus === 'active' ? { background: 'rgba(244,56,67,0.1)', color: '#F43843' } : { background: 'rgba(34,197,94,0.12)', color: GREEN }}
                  >
                    <Power size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setConfirm('save')}
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
                    onClick={startEdit}
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
              onClick={() => { onClose(); cancelEdit(); }}
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
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  title: 'Información personal',
                  model: <StudentCardView />,
                  fields: [
                    { key: 'firstName', label: 'Primer nombre', value: editable.firstName },
                    { key: 'secondName', label: 'Segundo nombre', value: editable.secondName || '—' },
                    { key: 'lastName', label: 'Primer apellido', value: editable.lastName },
                    { key: 'secondLastName', label: 'Segundo apellido', value: editable.secondLastName || '—' },
                    { key: 'document', label: 'Documento', value: `${editable.documentType}. ${editable.documentNumber}`, readOnly: true },
                    { key: 'birthDate', label: 'Fecha de nacimiento', value: editable.birthDate },
                    { key: 'gender', label: 'Género', value: editable.gender },
                    { key: 'age', label: 'Edad', value: `${Math.abs(new Date(editable.birthDate.split('/').reverse().join('-')).getFullYear() - new Date().getFullYear())} años`, readOnly: true },
                  ],
                },
                {
                  title: student.role === 'profesor' || student.role === 'administrador' ? 'Información laboral' : 'Información académica',
                  model: <CapView />,
                  fields:
                    student.role === 'profesor' || student.role === 'administrador'
                      ? [
                          { key: 'area', label: 'Área', value: editable.area || '—' },
                          { key: 'cargo', label: 'Cargo', value: editable.cargo || '—' },
                        ]
                      : [
                          { key: 'carnetId', label: 'Número carnet', value: editable.carnetId, readOnly: true },
                          { key: 'graduationStatus', label: 'Estado', value: editable.graduationStatus },
                          { key: 'institution', label: 'Institución', value: editable.institution },
                          { key: 'modality', label: 'Modalidad', value: editable.modality },
                          { key: 'nivelFormacion', label: 'Nivel de formación', value: editable.nivelFormacion || 'Técnicos' },
                          { key: 'faculty', label: 'Carrera', value: editable.faculty || editable.program },
                          { key: 'semester', label: 'Semestre', value: editable.semester || `${editable.semestre}` },
                          { key: 'jornada', label: 'Jornada', value: editable.jornada },
                        ],
                },
                {
                  title: 'Información médica',
                  model: <StethoscopeView />,
                  fields: [
                    { key: 'eps', label: 'EPS', value: editable.eps },
                    { key: 'bloodType', label: 'Grupo sanguíneo', value: editable.bloodType },
                  ],
                },
                {
                  title: 'Información de contacto',
                  model: <TelephoneView />,
                  fields: [
                    { key: 'email', label: 'Email', value: editable.email },
                    { key: 'phone', label: 'Teléfono', value: editable.phone },
                    { key: 'contactName', label: 'Contacto de emergencia', value: editable.contactName },
                    { key: 'contactRelation', label: 'Parentesco', value: editable.contactRelation || '—' },
                    { key: 'contactPhone', label: 'Teléfono de emergencia', value: editable.contactPhone },
                  ],
                },
              ].map((cat, ci) => (
                <motion.div
                  key={cat.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 + ci * 0.06 }}
                  className="p-5 flex flex-col"
                  style={{
                    borderBottom: '1px solid rgba(0,0,0,0.04)',
                  }}
                >
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: 'rgba(18,112,183,0.35)' }} />
                    <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">{cat.model}</div>
                    <p className="text-sm font-extrabold capitalize" style={{ color: '#0D1B2A' }}>{cat.title}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-x-5 gap-y-3 flex-1">
                    {cat.fields.map((f: { key: string; label: string; value: string; readOnly?: boolean }) => (
                      <div key={f.key} className="flex flex-col">
                        <p className="text-[10px] font-bold uppercase tracking-wide mb-0.5" style={{ color: 'rgba(0,0,0,0.4)' }}>{f.label}</p>
                        {editMode && draft && !f.readOnly ? (
                          <input
                            type="text"
                            value={draft[f.key] ?? f.value}
                            onChange={e => handleDraftChange(f.key, e.target.value)}
                            className="text-sm font-semibold w-full border rounded p-1"
                            style={{ color: '#0D1B2A' }}
                          />
                        ) : (
                          <p className="text-sm font-semibold" style={{ color: '#0D1B2A' }}>{f.value || '—'}</p>
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

      {/* ── Confirmación de cambios ─────────── */}
      <AnimatePresence>
        {confirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-6"
            style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
            onClick={() => setConfirm(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl p-6"
              style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 25px 60px rgba(0,0,0,0.15)' }}
            >
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ background: confirm === 'status' ? 'rgba(244,56,67,0.1)' : 'rgba(18,112,183,0.1)', color: confirm === 'status' ? '#F43843' : '#1270B7' }}>
                  {confirm === 'status' ? <Power size={20} /> : <AlertTriangle size={20} />}
                </div>
                <p className="text-lg font-bold" style={{ color: '#1A1A1E' }}>{confirm === 'status' ? 'Confirmar estado' : 'Confirmar cambios'}</p>
                <p className="text-xs font-medium mt-0.5" style={{ color: 'rgba(0,0,0,0.4)' }}>{fullName}</p>
              </div>
              <p className="text-sm font-medium mb-6 text-center" style={{ color: 'rgba(0,0,0,0.55)' }}>
                {confirm === 'status'
                  ? (curStatus === 'active' ? '¿Estás seguro de desactivar la cuenta de este usuario?' : '¿Estás seguro de activar la cuenta de este usuario?')
                  : '¿Estás seguro de aplicar los cambios realizados?'}
              </p>
              <div className="flex items-center justify-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setConfirm(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                  style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.5)' }}
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleConfirm}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
                  style={{ background: confirm === 'status' ? (curStatus === 'active' ? RED : GREEN) : BLUE_GRAD }}
                >
                  {confirm === 'save' ? 'Aplicar' : curStatus === 'active' ? 'Sí, desactivar' : 'Sí, activar'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ModalShell>
  )
}
