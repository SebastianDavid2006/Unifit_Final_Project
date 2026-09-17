import FormField from '../components/FormField'
import FormSelect from '../components/FormSelect'
import SectionTitle from '../components/SectionTitle'
import { GENEROS, GRUPOS_SANGRE, PARENTESCOS, TIPO_DOC } from '../data'
import type { NewUserForm } from '../data'

export default function PersonalInfoSection({ form, onChange, erroresCampo = {}, isStaff = false }: {
  form: NewUserForm
  onChange: (key: string, value: string) => void
  erroresCampo?: Record<string, string[]>
  isStaff?: boolean
}) {
  return (
    <div className="space-y-5">
      <SectionTitle title="Información personal" />
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Primer nombre" value={form.primerNombre} onChange={v => onChange('primerNombre', v)} required errors={erroresCampo.primerNombre} />
        <FormField label="Segundo nombre" value={form.segundoNombre} onChange={v => onChange('segundoNombre', v)} errors={erroresCampo.segundoNombre} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Primer apellido" value={form.primerApellido} onChange={v => onChange('primerApellido', v)} required errors={erroresCampo.primerApellido} />
        <FormField label="Segundo apellido" value={form.segundoApellido} onChange={v => onChange('segundoApellido', v)} errors={erroresCampo.segundoApellido} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormSelect label="Tipo de documento" value={form.tipoDoc} onChange={v => onChange('tipoDoc', v)} options={TIPO_DOC} required errors={erroresCampo.tipoDoc} placeholder="Seleccionar tipo" />
        <FormField label="Número de documento" value={form.numDoc} onChange={v => onChange('numDoc', v)} required errors={erroresCampo.numDoc} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Fecha de nacimiento" value={form.fechaNac} onChange={v => onChange('fechaNac', v)} type="date" required errors={erroresCampo.fechaNac} />
        <FormSelect label="Género" value={form.genero} onChange={v => onChange('genero', v)} options={GENEROS} required errors={erroresCampo.genero} placeholder="Seleccionar género" />
      </div>

      <SectionTitle title="Información de contacto" />
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Email" value={form.email} onChange={v => onChange('email', v)} type="email" required errors={erroresCampo.email} />
        <FormField label="Teléfono" value={form.telefono} onChange={v => onChange('telefono', v)} errors={erroresCampo.telefono} />
      </div>

      {!isStaff && (
        <>
          <SectionTitle title="Información médica" />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="EPS" value={form.eps} onChange={v => onChange('eps', v)} errors={erroresCampo.eps} />
            <FormSelect label="Grupo sanguíneo" value={form.grupoSanguineo} onChange={v => onChange('grupoSanguineo', v)} options={GRUPOS_SANGRE} placeholder="Seleccionar grupo" />
          </div>

          <SectionTitle title="Contacto de emergencia" />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Nombre contacto" value={form.nombreContacto} onChange={v => onChange('nombreContacto', v)} errors={erroresCampo.nombreContacto} />
            <FormField label="Teléfono contacto" value={form.telefonoContacto} onChange={v => onChange('telefonoContacto', v)} errors={erroresCampo.telefonoContacto} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormSelect label="Parentesco" value={form.parentesco} onChange={v => onChange('parentesco', v)} options={PARENTESCOS} placeholder="Seleccionar parentesco" />
            {form.parentesco === 'Otro' ? (
              <FormField label="Especifique el parentesco" value={form.otroParentesco} onChange={v => onChange('otroParentesco', v)} required />
            ) : (
              <span />
            )}
          </div>
        </>
      )}
    </div>
  )
}