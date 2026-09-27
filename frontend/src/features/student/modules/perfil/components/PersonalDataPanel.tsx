import { useState } from 'react'
import { motion } from 'motion/react'
import { Check, Lock, Pencil, X } from 'lucide-react'
import { BLUE, GREEN } from '@/features/student/components/ui/fitness'
import { useStudentApp } from '@/features/student/hooks/useStudentApp'
import type { Student } from '@/features/student/types/student'

interface Campo {
  key: string
  label: string
  editable: boolean
}

const SECCIONES: { title: string; items: Campo[] }[] = [
  {
    title: 'Información personal',
    items: [
      { key: 'firstName', label: 'Primer nombre', editable: true },
      { key: 'secondName', label: 'Segundo nombre', editable: true },
      { key: 'lastName', label: 'Primer apellido', editable: true },
      { key: 'secondLastName', label: 'Segundo apellido', editable: true },
      { key: 'documentType', label: 'Tipo de documento', editable: false },
      { key: 'documentNumber', label: 'Número de documento', editable: false },
      { key: 'birthDate', label: 'Fecha de nacimiento', editable: true },
      { key: 'genderLabel', label: 'Género', editable: true },
    ],
  },
  {
    title: 'Información de contacto',
    items: [
      { key: 'email', label: 'Email', editable: true },
      { key: 'phone', label: 'Teléfono', editable: true },
    ],
  },
  {
    title: 'Información médica',
    items: [
      { key: 'eps', label: 'EPS', editable: true },
      { key: 'bloodType', label: 'Grupo sanguíneo', editable: true },
      { key: 'contactName', label: 'Nombre contacto', editable: true },
      { key: 'contactPhone', label: 'Teléfono contacto', editable: true },
      { key: 'contactRelation', label: 'Parentesco', editable: true },
    ],
  },
  {
    title: 'Rol en la universidad',
    items: [{ key: 'roleLabel', label: 'Rol', editable: false }],
  },
  {
    title: 'Información académica',
    items: [
      { key: 'carnetId', label: 'Número carnet', editable: false },
      { key: 'statusLabel', label: 'Estado', editable: false },
      { key: 'institution', label: 'Institución', editable: false },
      { key: 'modality', label: 'Modalidad', editable: false },
      { key: 'career', label: 'Carrera', editable: false },
      { key: 'semesterLabel', label: 'Semestre', editable: false },
      { key: 'jornada', label: 'Jornada', editable: false },
    ],
  },
]

function valoresDe(student: Student): Record<string, string> {
  return {
    firstName: student.firstName,
    secondName: student.secondName ?? '',
    lastName: student.lastName,
    secondLastName: student.secondLastName ?? '',
    documentType: student.documentType ?? '',
    documentNumber: student.documentNumber ?? '',
    birthDate: student.birthDate ?? '',
    genderLabel: student.genderLabel ?? '',
    email: student.email,
    phone: student.phone ?? '',
    eps: student.eps ?? '',
    bloodType: student.bloodType ?? '',
    contactName: student.contactName ?? '',
    contactPhone: student.contactPhone ?? '',
    contactRelation: student.contactRelation ?? '',
    roleLabel: student.roleLabel ?? '',
    carnetId: student.carnetId ?? '',
    statusLabel: student.statusLabel ?? '',
    institution: student.institution ?? '',
    modality: student.modality ?? '',
    career: student.career ?? '',
    semesterLabel: student.semestre != null ? String(student.semestre) : '',
    jornada: student.jornada ?? '',
  }
}

export function PersonalDataPanel() {
  const { student } = useStudentApp()
  const [values, setValues] = useState<Record<string, string>>(() => valoresDe(student!))
  const [draft, setDraft] = useState<Record<string, string> | null>(null)
  const editing = draft !== null

  if (!student) return null

  const startEdit = () => setDraft({ ...values })
  const cancelEdit = () => setDraft(null)
  const saveEdit = () => {
    if (!draft) return
    setValues(draft)
    setDraft(null)
  }

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        {editing ? (
          <>
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={cancelEdit}
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.55)' }}
              title="Cancelar"
            >
              <X size={15} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={saveEdit}
              className="px-3.5 h-8 rounded-xl flex items-center gap-1.5 font-black uppercase tracking-wider"
              style={{ background: `linear-gradient(135deg, ${GREEN}, #7CE495)`, color: '#0A0A14', fontSize: 9.5 }}
              title="Guardar cambios"
            >
              <Check size={13} />
              Guardar
            </motion.button>
          </>
        ) : (
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={startEdit}
            className="px-3.5 h-8 rounded-xl flex items-center gap-1.5 font-black uppercase tracking-wider"
            style={{ background: `linear-gradient(135deg, ${BLUE}, #6db9e8)`, color: '#fff', fontSize: 9.5 }}
            title="Editar información"
          >
            <Pencil size={13} />
            Editar
          </motion.button>
        )}
      </div>

      {SECCIONES.map(sec => (
        <div key={sec.title}>
          <p className="uppercase tracking-[0.18em] mb-2 mt-1" style={{ fontSize: 9.5, fontWeight: 800, color: BLUE }}>{sec.title}</p>
          <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {sec.items.map((d, i) => {
              const locked = editing && !d.editable
              const actual = (editing ? draft! : values)[d.key] ?? ''
              return (
                <div key={d.key} className="flex items-center justify-between gap-3 px-4 py-2.5" style={{ borderBottom: i < sec.items.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <span style={{ color: 'rgba(255,255,255,0.42)', fontSize: 12 }}>{d.label}</span>
                  {editing && d.editable ? (
                    <input
                      value={actual}
                      onChange={e => setDraft(prev => (prev ? { ...prev, [d.key]: e.target.value } : prev))}
                      className="text-white font-semibold text-right rounded-lg px-2 py-1 outline-none w-40 sm:w-56 focus:border-white/30 transition-colors"
                      style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BLUE}45`, fontSize: 12.5 }}
                    />
                  ) : (
                    <span className="text-white font-semibold text-right flex items-center gap-1.5" style={{ fontSize: 12.5, opacity: locked ? 0.75 : 1 }}>
                      {locked && <Lock size={11} style={{ color: 'rgba(255,255,255,0.35)' }} />}
                      {actual || 'No registrado'}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {editing && (
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10.5 }} className="flex items-center gap-1.5 px-1">
          <Lock size={11} />
          Los datos de identidad y académicos solo pueden ser modificados por la universidad.
        </p>
      )}
    </>
  )
}