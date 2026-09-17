import { motion } from 'motion/react'
import {
  TIPO_DOC, GENEROS, GRUPOS_SANGRE, MODALIDADES, JORNADAS, ESTADOS, PARENTESCOS,
  TIPOS_USUARIO, BLUE, BLUE_GRAD,
} from '@/data/config/registration'
import type { TipoUsuario } from '@/data/config/registration'
import { useProgramasAgrupados } from '@/hooks/useCatalogo'
import { useCatalogoStaff } from '@/hooks/useCatalogoStaff'
import { UNIVERSIDADES, NIVELES, UNIVERSIDAD_LABELS, NIVEL_LABELS, type Universidad, type NivelPrograma } from '@/types/catalogo'
import {
  Select as UiSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'

interface RegisterFormSectionsProps {
  form: Record<string, string>
  setForm: React.Dispatch<React.SetStateAction<Record<string, string>>>
  tipoUsuario: TipoUsuario | null
  toggleTipoUsuario: (tipo: TipoUsuario) => void
  isMinor: boolean
  erroresCampo?: Record<string, string[]>
}

export function RegisterFormSections({ form, setForm, tipoUsuario, toggleTipoUsuario, isMinor, erroresCampo = {} }: RegisterFormSectionsProps) {
  const set = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }))

  const catalogo = useProgramasAgrupados()
  const { cargos, areas } = useCatalogoStaff()

  const inputStyle = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.09)',
    color: '#dbdbdb',
    borderRadius: 12,
    padding: '10px 12px',
    fontSize: 12,
    outline: 'none',
    width: '100%',
    colorScheme: 'dark',
  } as const

  const campoErrores = (key: string) => {
    const mensajes = erroresCampo[key]
    if (!mensajes || mensajes.length === 0) return null
    return (
      <div className="flex flex-col gap-0.5">
        {mensajes.map((m, i) => (
          <span key={i} className="text-[10px] font-semibold" style={{ color: '#FF8A90' }}>
            {m}
          </span>
        ))}
      </div>
    )
  }

  const field = (label: string, key: string, opts?: { type?: string; required?: boolean; placeholder?: string }) => (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.45)' }}>
        {label}{opts?.required && <span style={{ color: '#F43843' }}> *</span>}
      </label>
      <input
        type={opts?.type ?? 'text'}
        value={form[key] ?? ''}
        onChange={e => set(key, e.target.value)}
        placeholder={opts?.placeholder}
        style={{
          ...inputStyle,
          border: erroresCampo[key] ? '1px solid rgba(244,56,67,0.5)' : inputStyle.border,
        }}
      />
      {campoErrores(key)}
    </div>
  )

  const select = (label: string, key: string, options: (string | { value: string; label: string })[], opts?: { required?: boolean; onChange?: (v: string) => void }) => {
    const optValue = (o: string | { value: string; label: string }) => typeof o === 'string' ? o : o.value
    const optLabel = (o: string | { value: string; label: string }) => typeof o === 'string' ? o : o.label
    return (
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.45)' }}>
          {label}{opts?.required && <span style={{ color: '#F43843' }}> *</span>}
        </label>
        <UiSelect
          value={form[key] ?? ''}
          onValueChange={v => {
            set(key, v)
            opts?.onChange?.(v)
          }}
        >
          <SelectTrigger
            className="h-auto cursor-pointer data-[placeholder]:text-[rgba(255,255,255,0.35)]"
            style={{
              ...inputStyle,
              color: form[key] ? inputStyle.color : 'rgba(255,255,255,0.35)',
              border: erroresCampo[key] ? '1px solid rgba(244,56,67,0.5)' : inputStyle.border,
            }}
          >
            <SelectValue placeholder="Seleccionar…" />
          </SelectTrigger>
          <SelectContent
            position="popper"
            style={{
              background: '#1B1D23',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#dbdbdb',
              borderRadius: 12,
              zIndex: 999,
            }}
          >
            {options.map(o => (
              <SelectItem
                key={optValue(o)}
                value={optValue(o)}
                className="cursor-pointer text-[12px] focus:bg-[rgba(255,255,255,0.08)] focus:text-white"
              >
                <span className="truncate">{optLabel(o)}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </UiSelect>
        {campoErrores(key)}
      </div>
    )
  }

  const sectionTitle = (label: string) => (
    <div className="flex items-center gap-2 mt-1">
      <div className="w-1 h-4 rounded-full" style={{ background: BLUE_GRAD }} />
      <span className="text-[13px] font-bold" style={{ color: '#fff' }}>{label}</span>
    </div>
  )

  return (
    <div className="flex flex-col gap-4 px-5 py-4">
      {sectionTitle('Información personal')}
      <div className="grid grid-cols-2 gap-3">
        {field('Primer nombre', 'primerNombre', { required: true })}
        {field('Segundo nombre', 'segundoNombre')}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {field('Primer apellido', 'primerApellido', { required: true })}
        {field('Segundo apellido', 'segundoApellido')}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {select('Tipo de documento', 'tipoDoc', TIPO_DOC, { required: true })}
        {field('Número de documento', 'numDoc', { required: true })}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {field('Fecha de nacimiento', 'fechaNac', { type: 'date', required: true })}
        {select('Género', 'genero', GENEROS, { required: true })}
      </div>

      {isMinor && (
        <>
          {sectionTitle('Información del acudiente')}
          <div className="grid grid-cols-2 gap-3">
            {field('Primer nombre del acudiente', 'acudientePrimerNombre', { required: true })}
            {field('Primer apellido del acudiente', 'acudientePrimerApellido', { required: true })}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {field('Documento del acudiente', 'acudienteDocumento', { required: true })}
            {select('Tipo de documento', 'acudienteTipoDocumento', TIPO_DOC, { required: true })}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {field('Teléfono del acudiente', 'acudienteTelefonoContacto')}
            {select('Parentesco', 'parentescoAcudiente', PARENTESCOS, { required: true })}
          </div>
          {form.parentescoAcudiente === 'Otro'
            ? field('Especifique el parentesco', 'otroParentescoAcudiente', { required: true })
            : null}
        </>
      )}

      {sectionTitle('Información de contacto')}
      <div className="grid grid-cols-2 gap-3">
        {field('Email', 'email', { type: 'email', required: true })}
        {field('Teléfono', 'telefono')}
      </div>

      {sectionTitle('Información médica')}
      <div className="grid grid-cols-2 gap-3">
        {field('EPS', 'eps')}
        {select('Grupo sanguíneo', 'grupoSanguineo', GRUPOS_SANGRE)}
      </div>

      {sectionTitle('Contacto de emergencia')}
      <div className="grid grid-cols-2 gap-3">
        {field('Nombre contacto', 'nombreContacto')}
        {field('Teléfono contacto', 'telefonoContacto')}
      </div>
      <div>
        {select('Parentesco', 'parentesco', PARENTESCOS)}
      </div>

      {sectionTitle('Rol en la universidad')}
      <div className="grid grid-cols-3 gap-2">
        {TIPOS_USUARIO.map((opt, i) => {
          const selected = tipoUsuario === opt.id
          return (
            <motion.button
              key={opt.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.06 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleTipoUsuario(opt.id)}
              className="flex flex-col items-center gap-1 px-2 py-3 rounded-xl text-[10px] font-bold transition-all duration-200 cursor-pointer"
              style={{
                background: selected ? BLUE_GRAD : 'rgba(255,255,255,0.05)',
                color: selected ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
                border: selected ? '1px solid transparent' : '1px solid rgba(255,255,255,0.08)',
                boxShadow: selected ? `0 6px 24px ${BLUE}40` : 'none',
              }}
            >
              <motion.img
                src={opt.img}
                alt={opt.label}
                className="mb-0.5"
                animate={{
                  width: selected ? 46 : 24,
                  height: selected ? 46 : 24,
                  marginTop: selected ? -22 : 0,
                  filter: selected ? 'drop-shadow(0 8px 20px rgba(0,0,0,0.4))' : 'none',
                }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              />
              <span>{opt.label}</span>
            </motion.button>
          )
        })}
      </div>
      {!tipoUsuario && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: 'rgba(245,166,35,0.08)', border: '1px dashed rgba(245,166,35,0.35)' }}>
          <span className="text-[11px] font-semibold" style={{ color: '#FFC247' }}>
            Selecciona el rol en la universidad para completar su información.
          </span>
        </div>
      )}

      {tipoUsuario === 'estudiante' && (
        <>
          {sectionTitle('Información académica')}
          <p className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>
            La cuenta se activará al completar los 3 documentos y la huella.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {field('Número carnet', 'numCarnet', { required: true })}
            {select('Condición académica', 'estado', ESTADOS, { required: true })}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {select('Institución', 'institucion', UNIVERSIDADES.map(u => ({ value: u, label: UNIVERSIDAD_LABELS[u] })), {
              required: true,
              onChange: (inst) => {
                const u = inst as Universidad
                const level = (NIVELES[0] ?? 'tecnico') as NivelPrograma
                const prog = catalogo.nombres(u, level)[0] ?? ''
                setForm(prev => ({ ...prev, institucion: u, nivelFormacion: level, programa: prog }))
              }
            })}
            {select('Modalidad', 'modalidad', MODALIDADES, { required: true })}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {select('Nivel de formación', 'nivelFormacion', NIVELES.map(n => ({ value: n, label: NIVEL_LABELS[n] })), {
              required: true,
              onChange: (level) => {
                const n = level as NivelPrograma
                const u = (form.institucion as Universidad) || 'uni_colombia'
                const prog = catalogo.nombres(u, n)[0] ?? ''
                setForm(prev => ({ ...prev, nivelFormacion: n, programa: prog }))
              }
            })}
            {select('Carrera', 'programa', catalogo.nombres((form.institucion as Universidad) || 'uni_colombia', (form.nivelFormacion as NivelPrograma) || 'tecnico'), { required: true })}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {select('Semestre', 'semestre', ['1', '2', '3', '4', '5', '6', '7', '8', '9'], { required: true })}
            {select('Jornada', 'jornada', JORNADAS, { required: true })}
          </div>
        </>
      )}

      {(tipoUsuario === 'profesor' || tipoUsuario === 'administrativo') && (
        <>
          {sectionTitle('Información laboral')}
          <div className="grid grid-cols-2 gap-3">
            {select('Cargo', 'cargo', cargos.map(c => ({ value: c.id_cargo ?? c.id, label: c.nombre })), { required: true })}
            {select('Área', 'area', areas.map(a => ({ value: a.id_area ?? a.id, label: a.nombre })), { required: true })}
          </div>
        </>
      )}
    </div>
  )
}
