import { StudentCardView } from '@/assets/models/ui/objects/student_card/StudentCardModel'
import type { Student } from '@/modules/students/StudentProfileData'

interface GeneralInfoCardProps {
  student: Student
  className?: string
}

export function GeneralInfoCard({ student, className = '' }: GeneralInfoCardProps) {
  const fields = [
    { label: 'Documento', value: `${student.documentType}. ${student.documentNumber}` },
    { label: 'Fecha de nacimiento', value: student.birthDate },
    { label: 'Género', value: student.gender },
  ]

  return (
    <div className={`rounded-[28px] p-4 cursor-default ${className}`} style={{ background: 'rgba(255,255,255,0.5)', height: '100%' }}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: 'rgba(230,57,70,0.3)' }} />
        <div className="w-8 h-8 flex-shrink-0"><StudentCardView /></div>
        <p className="text-lg font-extrabold capitalize" style={{ color: '#0D1B2A' }}>Información General</p>
      </div>
      <div className="flex flex-col">
        {fields.map((field, fi, arr) => (
          <div key={field.label} className="flex flex-col" style={{ borderBottom: fi < arr.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none', paddingBottom: fi < arr.length - 1 ? 6 : 0 }}>
            <p className="text-xs mb-0.5" style={{ color: 'rgba(0,0,0,0.5)' }}>{field.label}</p>
            <p className="text-base font-semibold" style={{ color: '#0D1B2A' }}>{field.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
