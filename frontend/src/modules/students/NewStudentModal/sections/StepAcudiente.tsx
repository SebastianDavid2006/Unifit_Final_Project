import { Field, Select } from '../components/Fields'
import { TIPO_DOC, BLUE_GRAD } from '@/modules/students/NewStudentData'

interface StepAcudienteProps {
  form: any
  set: (key: string, val: string) => void
}

export function StepAcudiente({ form, set }: StepAcudienteProps) {
  const sectionTitle = (title: string) => (
    <div className="flex items-center gap-2 pt-2 pb-1">
      <div className="w-0.5 h-5 rounded-full" style={{ background: BLUE_GRAD }} />
      <span className="text-sm font-semibold" style={{ color: '#1A1A1E' }}>{title}</span>
    </div>
  )

  return (
    <div className="space-y-5">
      {sectionTitle('Datos del acudiente')}
      <p className="text-xs" style={{ color: 'rgba(0,0,0,0.45)' }}>
        El usuario es menor de 18 años. Ingrese los datos de su representante legal o acudiente.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Primer nombre del acudiente" value={form.acudientePrimerNombre} onChange={v => set('acudientePrimerNombre', v)} required />
        <Field label="Segundo nombre del acudiente" value={form.acudienteSegundoNombre} onChange={v => set('acudienteSegundoNombre', v)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Primer apellido del acudiente" value={form.acudientePrimerApellido} onChange={v => set('acudientePrimerApellido', v)} required />
        <Field label="Segundo apellido del acudiente" value={form.acudienteSegundoApellido} onChange={v => set('acudienteSegundoApellido', v)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select label="Tipo de documento" value={form.acudienteTipoDoc} onChange={v => set('acudienteTipoDoc', v)} options={TIPO_DOC} required />
        <Field label="Número de documento" value={form.acudienteDocumento} onChange={v => set('acudienteDocumento', v)} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Teléfono de contacto" value={form.acudienteTelefono} onChange={v => set('acudienteTelefono', v)} />
      </div>
    </div>
  )
}
