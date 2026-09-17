import type { Student } from '@/modules/students/StudentProfileData'

interface AcudienteCardProps {
  student: Student
  className?: string
}

export function AcudienteCard({ student, className = '' }: AcudienteCardProps) {
  const ac = student.acudiente
  const nombreCompleto = ac
    ? `${ac.primerNombre} ${ac.segundoNombre ?? ''} ${ac.primerApellido} ${ac.segundoApellido ?? ''}`.replace(/\s+/g, ' ').trim()
    : null

  const fields = nombreCompleto
    ? [
        { label: 'Nombre completo', value: nombreCompleto },
        { label: 'Documento', value: `${ac!.tipoDocumento}. ${ac!.documento}` },
        { label: 'Parentesco', value: ac!.parentesco ?? 'No registrado' },
        { label: 'Teléfono', value: ac!.telefonoContacto ?? 'No registrado' },
      ]
    : null

  return (
    <div className={`rounded-[28px] p-4 cursor-default ${className}`} style={{ background: 'rgba(255,255,255,0.5)', height: '100%' }}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: 'rgba(245,166,35,0.3)' }} />
        <p className="text-lg font-extrabold capitalize" style={{ color: '#0D1B2A' }}>Acudiente</p>
      </div>
      {fields ? (
        <div className="flex flex-col">
          {fields.map((field, fi, arr) => (
            <div key={field.label} className="flex flex-col" style={{ borderBottom: fi < arr.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none', paddingBottom: fi < arr.length - 1 ? 6 : 0 }}>
              <p className="text-xs mb-0.5" style={{ color: 'rgba(0,0,0,0.5)' }}>{field.label}</p>
              <p className="text-base font-semibold" style={{ color: '#0D1B2A' }}>{field.value}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center rounded-xl p-4" style={{ background: 'rgba(245,166,35,0.05)', border: '1px dashed rgba(245,166,35,0.3)' }}>
          <p className="text-xs font-medium text-center" style={{ color: 'rgba(0,0,0,0.5)' }}>
            Este usuario es menor de edad pero no tiene acudiente registrado. Contacta al administrador.
          </p>
        </div>
      )}
    </div>
  )
}
