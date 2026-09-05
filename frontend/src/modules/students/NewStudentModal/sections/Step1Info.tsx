import { motion } from 'motion/react'
import { Field, Select } from '../components/Fields'
import {
  BLUE_GRAD, TIPO_DOC, GENEROS, GRUPOS_SANGRE, PARENTESCOS, ESTADOS, MODALIDADES, JORNADAS,
  TIPOS_USUARIO,
} from '@/modules/students/NewStudentData'
import type { TipoUsuario } from '@/modules/students/NewStudentData'
import { UNIVERSIDADES, NIVELES, UNIVERSIDAD_LABELS, NIVEL_LABELS, type Universidad, type NivelPrograma } from '@/types/catalogo'
import type { useProgramasAgrupados } from '@/hooks/useCatalogo'
import type { Cargo, Area } from '@/types/catalogo'

interface Step1InfoProps {
  form: any
  set: (key: string, val: string) => void
  tipoUsuario: TipoUsuario | null
  toggleTipoUsuario: (tipo: TipoUsuario) => void
  setForm: React.Dispatch<React.SetStateAction<any>>
  isMinor: boolean
  catalogo: ReturnType<typeof useProgramasAgrupados>
  cargos: Cargo[]
  areas: Area[]
}

export function Step1Info({ form, set, tipoUsuario, toggleTipoUsuario, setForm, isMinor, catalogo, cargos, areas }: Step1InfoProps) {
  const sectionTitle = (title: string) => (
    <div className="flex items-center gap-2 pt-2 pb-1">
      <div className="w-0.5 h-5 rounded-full" style={{ background: BLUE_GRAD }} />
      <span className="text-sm font-semibold" style={{ color: '#1A1A1E' }}>{title}</span>
    </div>
  )

  return (
    <div className="space-y-5">
      {sectionTitle('Información personal')}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Primer nombre" value={form.primerNombre} onChange={v => set('primerNombre', v)} required />
        <Field label="Segundo nombre" value={form.segundoNombre} onChange={v => set('segundoNombre', v)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Primer apellido" value={form.primerApellido} onChange={v => set('primerApellido', v)} required />
        <Field label="Segundo apellido" value={form.segundoApellido} onChange={v => set('segundoApellido', v)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select label="Tipo de documento" value={form.tipoDoc} onChange={v => set('tipoDoc', v)} options={TIPO_DOC} required />
        <Field label="Número de documento" value={form.numDoc} onChange={v => set('numDoc', v)} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Fecha de nacimiento" value={form.fechaNac} onChange={v => set('fechaNac', v)} type="date" />
        <Select label="Género" value={form.genero} onChange={v => set('genero', v)} options={GENEROS} />
      </div>

      {sectionTitle('Información de contacto')}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Email" value={form.email} onChange={v => set('email', v)} type="email" />
        <Field label="Teléfono" value={form.telefono} onChange={v => set('telefono', v)} />
      </div>

      {sectionTitle('Información médica')}
      <div className="grid grid-cols-2 gap-4">
        <Field label="EPS" value={form.eps} onChange={v => set('eps', v)} />
        <Select label="Grupo sanguíneo" value={form.grupoSanguineo} onChange={v => set('grupoSanguineo', v)} options={GRUPOS_SANGRE} />
      </div>

      {sectionTitle('Contacto de emergencia')}
      <div className="grid grid-cols-3 gap-4">
        <Field label="Nombre contacto" value={form.nombreContacto} onChange={v => set('nombreContacto', v)} />
        <Field label="Teléfono contacto" value={form.telefonoContacto} onChange={v => set('telefonoContacto', v)} />
        <Select label="Parentesco" value={form.parentesco} onChange={v => set('parentesco', v)} options={PARENTESCOS} />
      </div>
      {form.parentesco === 'Otro' && (
        <div className="mt-4">
          <Field label="Especifique el parentesco" value={form.otroParentesco} onChange={v => set('otroParentesco', v)} required />
        </div>
      )}

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
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleTipoUsuario(opt.id)}
              onMouseEnter={e => {
                if (!selected) {
                  e.currentTarget.style.background = `${opt.accent}12`
                  e.currentTarget.style.color = opt.accent
                }
              }}
              onMouseLeave={e => {
                if (!selected) {
                  e.currentTarget.style.background = 'rgba(0,0,0,0.03)'
                  e.currentTarget.style.color = 'rgba(0,0,0,0.35)'
                }
              }}
              className="flex flex-col items-center gap-1.5 px-3 py-3.5 rounded-xl text-xs font-bold transition-all duration-200"
              style={{
                background: selected ? opt.gradient : 'rgba(0,0,0,0.03)',
                color: selected ? '#FFFFFF' : 'rgba(0,0,0,0.35)',
                border: '1px solid transparent',
                boxShadow: selected ? `0 4px 20px ${opt.accent}40` : 'none',
              }}
            >
              <motion.img
                src={opt.img}
                alt={opt.label}
                className="mb-0.5"
                animate={{
                  width: selected ? 48 : 24,
                  height: selected ? 48 : 24,
                  marginTop: selected ? -24 : 0,
                  filter: selected ? 'blur(0px) drop-shadow(0 8px 20px rgba(0,0,0,0.15))' : 'blur(0px)',
                  opacity: 1,
                }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              />
              <span>{opt.label}</span>
            </motion.button>
          )
        })}
      </div>

      {tipoUsuario === 'estudiante' && (
        <>
          {sectionTitle('Información académica')}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Número carnet" value={form.numCarnet} onChange={v => set('numCarnet', v)} />
            <Select label="Estado" value={form.estado} onChange={v => set('estado', v)} options={ESTADOS} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Institución"
              value={form.institucion}
              onChange={inst => {
                const u = inst as Universidad
                const nivel = NIVELES[0] ?? 'tecnico'
                const nombres = catalogo.nombres(u, nivel)
                const prog = nombres[0] ?? ''
                setForm(prev => ({ ...prev, institucion: u, nivelFormacion: nivel, programa: prog }))
              }}
              options={UNIVERSIDADES.map(u => ({ value: u, label: UNIVERSIDAD_LABELS[u] }))}
            />
            <Select label="Modalidad" value={form.modalidad} onChange={v => set('modalidad', v)} options={MODALIDADES} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Nivel de formación"
              value={form.nivelFormacion}
              onChange={level => {
                const n = level as NivelPrograma
                const u = (form.institucion as Universidad) || 'uni_colombia'
                const nombres = catalogo.nombres(u, n)
                const prog = nombres[0] ?? ''
                setForm(prev => ({ ...prev, nivelFormacion: n, programa: prog }))
              }}
              options={NIVELES.map(n => ({ value: n, label: NIVEL_LABELS[n] }))}
            />
            <Select
              label="Carrera"
              value={form.programa}
              onChange={v => set('programa', v)}
              options={catalogo.nombres((form.institucion as Universidad) || 'uni_colombia', (form.nivelFormacion as NivelPrograma) || 'tecnico')}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Semestre" value={form.semestre} onChange={v => set('semestre', v)} options={['1', '2', '3', '4', '5', '6', '7', '8', '9']} />
            <Select label="Jornada" value={form.jornada} onChange={v => set('jornada', v)} options={JORNADAS} />
          </div>
        </>
      )}

      {(tipoUsuario === 'profesor' || tipoUsuario === 'administrador') && (
        <>
          {sectionTitle('Información laboral')}
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Cargo"
              value={form.cargo}
              onChange={v => set('cargo', v)}
              options={cargos.map(c => ({ value: c.id_cargo ?? c.id, label: c.nombre }))}
              required
            />
            <Select
              label="Área"
              value={form.area}
              onChange={v => set('area', v)}
              options={areas.map(a => ({ value: a.id_area ?? a.id, label: a.nombre }))}
              required
            />
          </div>
        </>
      )}

      {!tipoUsuario && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: 'rgba(245,166,35,0.07)', border: '1px dashed rgba(245,166,35,0.3)' }}>
          <span className="text-[11px] font-semibold" style={{ color: '#1A1A1E' }}>
            Selecciona el rol en la universidad para completar su información.
          </span>
        </div>
      )}
    </div>
  )
}
