import type { Student } from '@/modules/students/StudentProfileData'

interface CurrentMetricsCardProps {
  student: Student
  imc: string
}

export function CurrentMetricsCard({ student, imc }: CurrentMetricsCardProps) {
  const metrics = [
    { label: 'Peso', value: `${student.weight} kg` },
    { label: 'Estatura', value: `${student.height} cm` },
    { label: 'IMC', value: imc },
    { label: 'Grasa corporal', value: '17%' },
    { label: 'Masa muscular', value: '52 kg' },
    { label: 'Agua corporal', value: '58%' },
  ]

  return (
    <div className="rounded-[28px] p-4 cursor-default" style={{ gridColumn: '3', gridRow: '2', background: 'rgba(255,255,255,0.5)' }}>
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: 'rgba(230,57,70,0.3)' }} />
        <p className="text-lg font-extrabold capitalize" style={{ color: '#0D1B2A' }}>Métricas actuales</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {metrics.map(m => (
          <div key={m.label} className="rounded-xl p-3 text-center" style={{ background: 'rgba(0,0,0,0.02)' }}>
            <p className="text-base font-extrabold" style={{ color: '#0D1B2A' }}>{m.value}</p>
            <p className="text-[10px] font-semibold mt-0.5" style={{ color: 'rgba(0,0,0,0.35)' }}>{m.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
