import FormField from '../components/FormField'
import FormSelect from '../components/FormSelect'
import SectionTitle from '../components/SectionTitle'
import { GENEROS, GRUPOS_SANGRE, PARENTESCOS, TIPO_DOC } from '../data'
import type { NewUserForm } from '../data'

export default function PersonalInfoSection({ form, onChange }: {
  form: NewUserForm
  onChange: (key: string, value: string) => void
}) {
  return (
    <div className="space-y-5">
      <SectionTitle title="Información personal" />
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Primer nombre" value={form.primerNombre} onChange={v => onChange('primerNombre', v)} required />
        <FormField label="Segundo nombre" value={form.segundoNombre} onChange={v => onChange('segundoNombre', v)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Primer apellido" value={form.primerApellido} onChange={v => onChange('primerApellido', v)} required />
        <FormField label="Segundo apellido" value={form.segundoApellido} onChange={v => onChange('segundoApellido', v)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormSelect label="Tipo de documento" value={form.tipoDoc} onChange={v => onChange('tipoDoc', v)} options={TIPO_DOC} required />
        <FormField label="Número de documento" value={form.numDoc} onChange={v => onChange('numDoc', v)} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Fecha de nacimiento" value={form.fechaNac} onChange={v => onChange('fechaNac', v)} type="date" />
        <FormSelect label="Género" value={form.genero} onChange={v => onChange('genero', v)} options={GENEROS} />
      </div>

      <SectionTitle title="Información de contacto" />
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Email" value={form.email} onChange={v => onChange('email', v)} type="email" />
        <FormField label="Teléfono" value={form.telefono} onChange={v => onChange('telefono', v)} />
      </div>

      <SectionTitle title="Información médica" />
      <div className="grid grid-cols-2 gap-4">
        <FormField label="EPS" value={form.eps} onChange={v => onChange('eps', v)} />
        <FormSelect label="Grupo sanguíneo" value={form.grupoSanguineo} onChange={v => onChange('grupoSanguineo', v)} options={GRUPOS_SANGRE} />
      </div>

      <SectionTitle title="Contacto de emergencia" />
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Nombre contacto" value={form.nombreContacto} onChange={v => onChange('nombreContacto', v)} />
        <FormField label="Teléfono contacto" value={form.telefonoContacto} onChange={v => onChange('telefonoContacto', v)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormSelect label="Parentesco" value={form.parentesco} onChange={v => onChange('parentesco', v)} options={PARENTESCOS} />
        {form.parentesco === 'Otro' ? (
          <FormField label="Especifique el parentesco" value={form.otroParentesco} onChange={v => onChange('otroParentesco', v)} required />
        ) : (
          <span />
        )}
      </div>
    </div>
  )
}
