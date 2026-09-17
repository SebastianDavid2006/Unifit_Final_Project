import { Field, Select } from '../components/Fields'
import { TIPO_DOC, BLUE_GRAD, PARENTESCOS } from '@/modules/students/NewStudentData'

interface StepAcudienteProps {
  form: any
  set: (key: string, val: string) => void
  erroresCampo?: Record<string, string[]>
}

export function StepAcudiente({ form, set, erroresCampo = {} }: StepAcudienteProps) {
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
        <Field label="Primer nombre del acudiente" value={form.acudientePrimerNombre} onChange={v => set('acudientePrimerNombre', v)} required errors={erroresCampo.acudientePrimerNombre} />
        <Field label="Primer apellido del acudiente" value={form.acudientePrimerApellido} onChange={v => set('acudientePrimerApellido', v)} required errors={erroresCampo.acudientePrimerApellido} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select label="Tipo de documento" value={form.acudienteTipoDocumento} onChange={v => set('acudienteTipoDocumento', v)} options={TIPO_DOC} required errors={erroresCampo.acudienteTipoDocumento} placeholder="Seleccionar tipo" />
        <Field label="Número de documento" value={form.acudienteDocumento} onChange={v => set('acudienteDocumento', v)} required errors={erroresCampo.acudienteDocumento} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Teléfono de contacto" value={form.acudienteTelefonoContacto} onChange={v => set('acudienteTelefonoContacto', v)} errors={erroresCampo.acudienteTelefonoContacto} />
        <Select label="Parentesco" value={form.acudienteParentesco ?? ''} onChange={v => set('acudienteParentesco', v)} options={PARENTESCOS} required errors={erroresCampo.acudienteParentesco} placeholder="Seleccionar parentesco" />
      </div>
    </div>
  )
}
