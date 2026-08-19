import { TelephoneView } from '@/assets/models/ui/objects/telephone/TelephoneModel'
import type { Student } from '@/modules/students/StudentProfileData'

interface ContactCardProps {
  student: Student
}

export function ContactCard({ student }: ContactCardProps) {
  const fields = [
    { label: 'Email', value: student.email },
    { label: 'Teléfono', value: student.phone },
    { label: 'Contacto de emergencia', value: student.contactName },
    { label: 'Tel. contacto', value: student.contactPhone },
  ]

  return (
    <div className="rounded-[28px] p-5 cursor-default" style={{ gridColumn: '1', gridRow: '2', background: 'rgba(255,255,255,0.5)' }}>
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: 'rgba(230,57,70,0.3)' }} />
        <div className="w-8 h-8 flex-shrink-0"><TelephoneView /></div>
        <p className="text-lg font-extrabold capitalize" style={{ color: '#0D1B2A' }}>Contacto</p>
      </div>
      <div className="flex flex-col">
        {fields.map((field, fi, arr) => (
          <div key={field.label} className="flex flex-col" style={{ borderBottom: fi < arr.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none', paddingBottom: fi < arr.length - 1 ? 8 : 0 }}>
            <p className="text-xs mb-1" style={{ color: 'rgba(0,0,0,0.5)' }}>{field.label}</p>
            <p className="text-base font-semibold" style={{ color: '#0D1B2A' }}>{field.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
