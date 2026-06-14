import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Upload } from 'lucide-react'

const BLUE = '#1270B7'

interface NewStudentModalProps {
  open: boolean
  onClose: () => void
}

const TIPO_DOC = ['CC', 'CE', 'Pasaporte', 'NIT']
const GENEROS = ['Masculino', 'Femenino', 'Otro']
const GRUPOS_SANGRE = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const MODALIDADES = ['Presencial', 'Virtual', 'Híbrida']
const JORNADAS = ['Mañana', 'Tarde', 'Noche', 'Completa']
const ESTADOS = ['Activo', 'Inactivo', 'Proceso']

export default function NewStudentModal({ open, onClose }: NewStudentModalProps) {
  const [form, setForm] = useState({
    primerNombre: '', segundoNombre: '', primerApellido: '', segundoApellido: '',
    tipoDoc: 'CC', numDoc: '', fechaNac: '', genero: 'Masculino',
    eps: '', grupoSanguineo: 'O+', email: '', telefono: '',
    nombreContacto: '', telefonoContacto: '', numCarnet: '',
    programa: '', institucion: '', semestre: '', modalidad: 'Presencial',
    jornada: 'Mañana', estado: 'Activo',
  })
  const [certificado, setCertificado] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const set = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { ...form, certificado }
    console.log('Nuevo estudiante:', payload)
    onClose()
  }

  const field = (label: string, key: string, opts?: { type?: string; required?: boolean; placeholder?: string }) => (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.4)' }}>
        {label}{opts?.required && <span className="ml-0.5" style={{ color: '#F43843' }}>*</span>}
      </label>
      <input
        type={opts?.type ?? 'text'}
        value={(form as any)[key] ?? ''}
        onChange={e => set(key, e.target.value)}
        placeholder={opts?.placeholder}
        className="px-3 py-2 rounded-xl text-xs font-medium outline-none w-full"
        style={{ background: 'rgba(0,0,0,0.03)', color: '#1A1A1E' }}
        required={opts?.required}
      />
    </div>
  )

  const select = (label: string, key: string, options: string[], opts?: { required?: boolean }) => (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.4)' }}>
        {label}{opts?.required && <span className="ml-0.5" style={{ color: '#F43843' }}>*</span>}
      </label>
      <select
        value={(form as any)[key] ?? ''}
        onChange={e => set(key, e.target.value)}
        className="px-3 py-2 rounded-xl text-xs font-medium outline-none w-full appearance-none"
        style={{ background: 'rgba(0,0,0,0.03)', color: '#1A1A1E' }}
        required={opts?.required}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(6px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto mx-4"
            style={{
              background: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(255,255,255,0.6)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.12)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 pb-4" style={{
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(12px)',
              borderBottom: '1px solid rgba(0,0,0,0.04)',
            }}>
              <div>
                <h2 className="text-lg font-bold" style={{ color: '#1A1A1E' }}>Nuevo Estudiante</h2>
                <p className="text-xs font-medium mt-0.5" style={{ color: 'rgba(0,0,0,0.35)' }}>Completa los datos para registrar un nuevo UniFitter.</p>
              </div>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.3)' }}
              >
                <X size={16} />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Nombres */}
              <div className="grid grid-cols-2 gap-4">
                {field('Primer nombre', 'primerNombre', { required: true })}
                {field('Segundo nombre', 'segundoNombre')}
              </div>

              {/* Apellidos */}
              <div className="grid grid-cols-2 gap-4">
                {field('Primer apellido', 'primerApellido', { required: true })}
                {field('Segundo apellido', 'segundoApellido')}
              </div>

              {/* Documento */}
              <div className="grid grid-cols-[1fr_2fr] gap-4">
                {select('Tipo de documento', 'tipoDoc', TIPO_DOC, { required: true })}
                {field('Número de documento', 'numDoc', { required: true })}
              </div>

              {/* Fecha + Género */}
              <div className="grid grid-cols-2 gap-4">
                {field('Fecha de nacimiento', 'fechaNac', { type: 'date' })}
                {select('Género', 'genero', GENEROS)}
              </div>

              {/* EPS + Grupo sanguíneo */}
              <div className="grid grid-cols-2 gap-4">
                {field('EPS', 'eps')}
                {select('Grupo sanguíneo', 'grupoSanguineo', GRUPOS_SANGRE)}
              </div>

              {/* Certificado EPS */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.4)' }}>Certificado EPS</label>
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-medium"
                  style={{ background: 'rgba(18,112,183,0.06)', color: BLUE, border: '1px dashed rgba(18,112,183,0.2)' }}
                >
                  <Upload size={14} />
                  {certificado ? certificado.name : 'Subir certificado'}
                </button>
                <input ref={fileRef} type="file" accept=".pdf,.jpg,.png" className="hidden"
                  onChange={e => setCertificado(e.target.files?.[0] ?? null)} />
              </div>

              {/* Contacto */}
              <div className="grid grid-cols-2 gap-4">
                {field('Email', 'email', { type: 'email' })}
                {field('Teléfono', 'telefono')}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {field('Nombre contacto', 'nombreContacto')}
                {field('Teléfono contacto', 'telefonoContacto')}
              </div>

              {/* Académico */}
              <div className="grid grid-cols-2 gap-4">
                {field('Número carnet', 'numCarnet')}
                {field('Programa', 'programa')}
              </div>
              <div className="grid grid-cols-3 gap-4">
                {field('Institución', 'institucion')}
                {field('Semestre', 'semestre')}
                {select('Modalidad', 'modalidad', MODALIDADES)}
              </div>

              {/* Jornada + Estado */}
              <div className="grid grid-cols-2 gap-4">
                {select('Jornada', 'jornada', JORNADAS)}
                {select('Estado', 'estado', ESTADOS)}
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-3 pt-2">
                <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold"
                  style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.4)' }}
                >
                  Cancelar
                </motion.button>
                <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white"
                  style={{ background: BLUE }}
                >
                  Guardar estudiante
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}