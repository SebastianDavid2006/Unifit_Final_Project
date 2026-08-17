import { motion } from 'motion/react'
import { X } from 'lucide-react'
import { StudentCardView } from '@/assets/models/ui/objects/student_card/StudentCardModel'
import { CapView } from '@/assets/models/ui/objects/cap/CapModel'
import { StethoscopeView } from '@/assets/models/ui/objects/stethoscope/StethoscopeModel'
import { TelephoneView } from '@/assets/models/ui/objects/telephone/TelephoneModel'
import { IdentityAccessCard } from '@/modules/students/components/IdentityAccessCard'
import { ModalShell } from './ModalShell'
import type { Student } from '../../StudentProfileData'

interface StudentInfoModalProps {
  isOpen: boolean
  student: Student
  editable: Student
  onClose: () => void
  onUpdate: (patch: Partial<Student>) => void
}

export function StudentInfoModal({ isOpen, student, editable, onClose, onUpdate }: StudentInfoModalProps) {
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
              background: student.risk === 'high'
                ? 'linear-gradient(135deg, #FF3B30, #D32F2F)'
                : student.risk === 'medium'
                ? 'linear-gradient(135deg, #FF9500, #E68600)'
                : 'linear-gradient(135deg, #30D158, #20A040)',
              fontSize: 14,
            }}>
              {student.avatar}
            </div>
            <div>
              <h2 className="text-lg font-extrabold" style={{ color: '#0D1B2A' }}>
                {[student.firstName, student.secondName, student.lastName, student.secondLastName].filter(Boolean).join(' ')}
              </h2>
              <p className="text-xs font-medium" style={{ color: 'rgba(0,0,0,0.4)' }}>
                {student.faculty || student.program} · {student.institution}
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, background: 'rgba(244,56,67,0.1)', color: '#F43843' }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer"
            style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.45)' }}
          >
            <X size={16} />
          </motion.button>
        </div>

        {/* Categorías */}
        <div className="flex-1 min-h-0 overflow-y-auto px-7 py-6" style={{ scrollbarWidth: 'thin' }}>
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                title: 'Información personal',
                model: <StudentCardView />,
                fields: [
                  { label: 'Primer nombre', value: student.firstName },
                  { label: 'Segundo nombre', value: student.secondName || '—' },
                  { label: 'Primer apellido', value: student.lastName },
                  { label: 'Segundo apellido', value: student.secondLastName || '—' },
                  { label: 'Documento', value: `${student.documentType}. ${student.documentNumber}` },
                  { label: 'Fecha de nacimiento', value: student.birthDate },
                  { label: 'Género', value: student.gender },
                  { label: 'Edad', value: `${Math.abs(new Date(student.birthDate.split('/').reverse().join('-')).getFullYear() - new Date().getFullYear())} años` },
                ],
              },
              {
                title: student.role === 'profesor' || student.role === 'administrador' ? 'Información laboral' : 'Información académica',
                model: <CapView />,
                fields:
                  student.role === 'profesor' || student.role === 'administrador'
                    ? [
                        { label: 'Área', value: student.area || '—' },
                        { label: 'Cargo', value: student.cargo || '—' },
                      ]
                    : [
                        { label: 'Número carnet', value: student.carnetId },
                        { label: 'Estado', value: student.graduationStatus },
                        { label: 'Institución', value: student.institution },
                        { label: 'Modalidad', value: student.modality },
                        { label: 'Nivel de formación', value: student.nivelFormacion || 'Técnicos' },
                        { label: 'Carrera', value: student.faculty || student.program },
                        { label: 'Semestre', value: student.semester || `${student.semestre}` },
                        { label: 'Jornada', value: student.jornada },
                      ],
              },
              {
                title: 'Información médica',
                model: <StethoscopeView />,
                fields: [
                  { label: 'EPS', value: student.eps },
                  { label: 'Grupo sanguíneo', value: student.bloodType },
                ],
              },
              {
                title: 'Información de contacto',
                model: <TelephoneView />,
                fields: [
                  { label: 'Email', value: editable.email },
                  { label: 'Teléfono', value: student.phone },
                  { label: 'Contacto de emergencia', value: student.contactName },
                  { label: 'Parentesco', value: student.contactRelation || '—' },
                  { label: 'Teléfono de emergencia', value: student.contactPhone },
                ],
              },
            ].map((cat, ci) => (
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
                    <div key={f.label} className="flex flex-col">
                      <p className="text-[10px] font-bold uppercase tracking-wide mb-0.5" style={{ color: 'rgba(0,0,0,0.4)' }}>{f.label}</p>
                      <p className="text-sm font-semibold" style={{ color: '#0D1B2A' }}>{f.value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-4">
            <IdentityAccessCard student={editable} onUpdate={(patch) => onUpdate(patch)} />
          </div>
        </div>
      </motion.div>
    </ModalShell>
  )
}
