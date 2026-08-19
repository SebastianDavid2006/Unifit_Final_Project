import { CapView } from '@/assets/models/ui/objects/cap/CapModel'
import type { Student } from '@/modules/students/StudentProfileData'

interface AcademicInfoCardProps {
  student: Student
}

export function AcademicInfoCard({ student }: AcademicInfoCardProps) {
  const fields = [
    { label: 'Programa', value: student.program },
    { label: 'Semestre', value: `${student.semestre}°` },
    { label: 'Jornada', value: student.jornada },
  ]

  return (
    <div className="rounded-[28px] p-4 cursor-default" style={{ gridColumn: '1', gridRow: '3', background: 'rgba(255,255,255,0.5)' }}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: 'rgba(230,57,70,0.3)' }} />
        <div className="w-8 h-8 flex-shrink-0"><CapView /></div>
        <p className="text-lg font-extrabold capitalize" style={{ color: '#0D1B2A' }}>Información académica</p>
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
