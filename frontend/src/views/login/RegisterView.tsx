import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import axios from 'axios'
import {
  ArrowLeft, Check, ChevronLeft, ChevronRight,
  Clock, CalendarCheck, ArrowRight,
} from 'lucide-react'
import { LoginBackground } from '../../components/ui/LoginBackground'
import {
  GENEROS, GRUPOS_SANGRE, MODALIDADES, JORNADAS, ESTADOS, PARENTESCOS,
  TIPOS_USUARIO, INITIAL_FORM, BLUE, GREEN, BLUE_GRAD, GREEN_GRAD,
} from '../../modules/students/NewStudentData'
import type { TipoUsuario } from '../../modules/students/NewStudentData'
import { dayLabels, monthNames, DAY_GRAD } from '../../modules/agenda/AgendaData'
import { useIsMobile } from '../../components/ui/use-mobile'
import { api, mensajeError } from '../../lib/api'
import successCheckImg from '../../assets/illustrations/actions/feedback/success_check.webp'
import logotipo from '../../assets/logo/logo.webp'

const DARK_BG = '#0A0A14'

type Phase = 'form' | 'pendiente' | 'schedule'

interface Slot { time: string; title: string; color: string }

interface ProgramaCatalogo { id_programa: string; nombre: string; universidad: string }
interface CatalogoItem { id: string; nombre: string }

const UNIVERSIDADES = [
  { value: 'uni_colombia', label: 'Universitaria de Colombia' },
  { value: 'uni_bogota', label: 'Universitaria de Bogotá' },
]

const DOC_OPCIONES = ['CC', 'TI', 'CE', 'Pasaporte', 'RC']
const SEMESTRES = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

const TIPO_DOC_MAP: Record<string, string> = { CC: 'CC', TI: 'TI', CE: 'CE', Pasaporte: 'PA', RC: 'RC' }
const GENERO_MAP: Record<string, string> = { Masculino: 'masculino', Femenino: 'femenino', Otro: 'otro' }
const GRUPO_MAP: Record<string, string> = {
  'A+': 'a_positivo', 'A-': 'a_negativo', 'B+': 'b_positivo', 'B-': 'b_negativo',
  'AB+': 'ab_positivo', 'AB-': 'ab_negativo', 'O+': 'o_positivo', 'O-': 'o_negativo',
}
const PARENTESCO_MAP: Record<string, string> = {
  Padre: 'padre', Madre: 'madre', 'Hermano(a)': 'hermano_a', 'Abuelo(a)': 'abuelo_a',
  'Tío(a)': 'tio_a', 'Primo(a)': 'primo_a', Otro: 'otro',
}
const MODALIDAD_MAP: Record<string, string> = { Presencial: 'presencial', Virtual: 'virtual' }
const JORNADA_MAP: Record<string, string> = { 'Mañana': 'diurna', Noche: 'nocturna', 'Fin de semana': 'finde' }

function buildDemoAgenda(): Record<string, Slot[]> {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()
  const last = new Date(y, m + 1, 0).getDate()
  const days = [...new Set([
    now.getDate(),
    Math.min(now.getDate() + 1, last),
    Math.min(now.getDate() + 2, last),
    Math.min(now.getDate() + 3, last),
  ])]
  const d = (day: number) => `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  const reg = '#AF52DE'
  const assess = '#FF6B35'
  const physical = '#30D158'
  return {
    [d(days[0])]: [
      { time: '07:00', title: 'Registro Nuevo Ingreso', color: reg },
      { time: '09:00', title: 'Valoración Inicial', color: assess },
      { time: '11:00', title: 'Valoración Física', color: physical },
    ],
    [d(days[1])]: [
      { time: '08:00', title: 'Valoración Inicial', color: assess },
      { time: '14:00', title: 'Registro Nuevo Ingreso', color: reg },
    ],
    [d(days[2])]: [
      { time: '10:00', title: 'Registro Nuevo Ingreso', color: reg },
      { time: '16:00', title: 'Valoración Física', color: physical },
    ],
    [d(days[3])]: [
      { time: '09:00', title: 'Valoración Inicial', color: assess },
      { time: '15:00', title: 'Registro Nuevo Ingreso', color: reg },
    ],
  }
}

function fmtDate(dt: Date) {
  const y = dt.getFullYear()
  const m = String(dt.getMonth() + 1).padStart(2, '0')
  const dd = String(dt.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

function getMonthGrid(year: number, month: number): (Date | null)[][] {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const pad = first.getDay() === 0 ? 6 : first.getDay() - 1
  const weeks: (Date | null)[][] = []
  let wk: (Date | null)[] = []
  for (let i = 0; i < pad; i++) wk.push(null)
  for (let day = 1; day <= last.getDate(); day++) {
    const dt = new Date(year, month, day)
    wk.push(dt)
    if (wk.length === 7) { weeks.push(wk); wk = [] }
  }
  while (wk.length < 7) wk.push(null)
  if (wk.some(x => x)) weeks.push(wk)
  return weeks
}

interface RegisterViewProps {
  onBack: () => void
  initialPhase?: Phase
}

export function RegisterView({ onBack, initialPhase }: RegisterViewProps) {
  const isMobile = useIsMobile()
  const [previewMode, setPreviewMode] = useState<'celular' | 'desktop' | 'auto'>('auto')
  const [phase, setPhase] = useState<Phase>(initialPhase ?? 'form')
  const [form, setForm] = useState<Record<string, string>>({
    ...INITIAL_FORM, parentesco: 'Padre', estado: 'No egresado', generoOtro: '',
  })
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario | null>(null)
  const [universidad, setUniversidad] = useState('uni_colombia')
  const [programaId, setProgramaId] = useState('')
  const [cargoId, setCargoId] = useState('')
  const [areaId, setAreaId] = useState('')
  const [programas, setProgramas] = useState<ProgramaCatalogo[]>([])
  const [cargos, setCargos] = useState<CatalogoItem[]>([])
  const [areas, setAreas] = useState<CatalogoItem[]>([])
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [shake, setShake] = useState(false)
  const [agenda] = useState<Record<string, Slot[]>>(() => buildDemoAgenda())
  const [viewMonth, setViewMonth] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [scheduled, setScheduled] = useState(false)

  useEffect(() => {
    if (initialPhase && initialPhase !== 'form') return
    let activo = true
    Promise.all([api.get('/programas'), api.get('/cargos'), api.get('/areas')])
      .then(([progs, carg, ar]) => {
        if (!activo) return
        setProgramas(progs.data)
        setCargos(carg.data.map((c: { id_cargo: string; nombre: string }) => ({ id: c.id_cargo, nombre: c.nombre })))
        setAreas(ar.data.map((a: { id_area: string; nombre: string }) => ({ id: a.id_area, nombre: a.nombre })))
      })
      .catch(() => {
        if (activo) setError('No se pudieron cargar los catálogos. Recarga la página e intenta de nuevo.')
      })
    return () => { activo = false }
  }, [])

  const isDesktopVideo = previewMode === 'desktop'
  const isPhonePreview = previewMode === 'celular' || (previewMode === 'auto' && isMobile)

  const set = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }))

  const toggleTipoUsuario = (tipo: TipoUsuario) => {
    setTipoUsuario(prev => (prev === tipo ? null : tipo))
    setProgramaId('')
    setCargoId('')
    setAreaId('')
  }

  const programasFiltrados = programas.filter(p => p.universidad === universidad)

  const validar = (): string | null => {
    const requeridos: [string, string][] = [
      ['primerNombre', 'Primer nombre'],
      ['primerApellido', 'Primer apellido'],
      ['numDoc', 'Número de documento'],
      ['email', 'Correo electrónico'],
    ]
    for (const [k, label] of requeridos) {
      if (!form[k]?.trim()) return `Completa el campo ${label}`
    }
    if (!tipoUsuario) return 'Selecciona el rol en la universidad'
    if (tipoUsuario === 'estudiante' && !programaId) return 'Selecciona el programa'
    if (tipoUsuario !== 'estudiante' && (!cargoId || !areaId)) return 'Selecciona cargo y área'
    if (form.genero === 'Otro' && !form.generoOtro?.trim()) return 'Especifica el género'
    if (form.parentesco === 'Otro' && !form.otroParentesco?.trim()) return 'Especifica el parentesco'
    return null
  }

  const buildPayload = () => {
    const payload: Record<string, unknown> = {
      primer_nombre: form.primerNombre?.trim(),
      segundo_nombre: form.segundoNombre?.trim() || undefined,
      primer_apellido: form.primerApellido?.trim(),
      segundo_apellido: form.segundoApellido?.trim() || undefined,
      email_contacto: form.email?.trim(),
      telefono_contacto: form.telefono?.trim() || undefined,
      documento: form.numDoc?.trim(),
      tipo_documento: TIPO_DOC_MAP[form.tipoDoc] ?? 'CC',
      fecha_nacimiento: form.fechaNac || undefined,
      genero: GENERO_MAP[form.genero] ?? 'otro',
      genero_otro: form.genero === 'Otro' ? form.generoOtro?.trim() : undefined,
      eps: form.eps?.trim() || undefined,
      grupo_sanguineo: GRUPO_MAP[form.grupoSanguineo],
      nombre_emergencia: form.nombreContacto?.trim() || undefined,
      telefono_emergencia: form.telefonoContacto?.trim() || undefined,
      parentesco_emergencia: form.parentesco ? PARENTESCO_MAP[form.parentesco] : undefined,
      parentesco_otro: form.parentesco === 'Otro' ? form.otroParentesco?.trim() : undefined,
      tipo_usuario: tipoUsuario === 'administrador' ? 'administrativo' : tipoUsuario,
    }

    if (tipoUsuario === 'estudiante') {
      payload.id_programa = programaId
      payload.numero_carnet = form.numCarnet?.trim() || undefined
      payload.semestre = form.semestre ? Number(form.semestre) : undefined
      payload.modalidad = MODALIDAD_MAP[form.modalidad]
      payload.jornada = JORNADA_MAP[form.jornada]
      payload.es_egresado = form.estado === 'Egresado'
    } else {
      payload.id_cargo = cargoId
      payload.id_area = areaId
    }

    return payload
  }

  const handleSubmit = async () => {
    const mensaje = validar()
    if (mensaje) {
      setError(mensaje)
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }
    setError('')
    setEnviando(true)
    try {
      await api.post('/auth/registro', buildPayload())
      setPhase('pendiente')
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        setError('El documento o correo electrónico ya está registrado')
      } else {
        setError(mensajeError(err))
      }
    } finally {
      setEnviando(false)
    }
  }

  const confirmSchedule = () => {
    if (!selectedDay || !selectedSlot) return
    setScheduled(true)
  }

  const slotsOfDay = selectedDay ? (agenda[selectedDay] ?? []) : []

  const grid = getMonthGrid(viewMonth.getFullYear(), viewMonth.getMonth())
  const title = `${monthNames[viewMonth.getMonth()]} ${viewMonth.getFullYear()}`

  const inputStyle = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.09)',
    color: '#FFFFFF',
    borderRadius: 12,
    padding: '10px 12px',
    fontSize: 12,
    outline: 'none',
    width: '100%',
  } as const

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
        style={inputStyle}
      />
    </div>
  )

  const select = (label: string, key: string, options: string[], opts?: { required?: boolean; onChange?: (v: string) => void }) => (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.45)' }}>
        {label}{opts?.required && <span style={{ color: '#F43843' }}> *</span>}
      </label>
      <select
        value={form[key] ?? ''}
        onChange={e => {
          const v = e.target.value
          set(key, v)
          opts?.onChange?.(v)
        }}
        className="appearance-none cursor-pointer"
        style={{ ...inputStyle, background: '#151520' }}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )

  const selectCatalogo = (label: string, value: string, options: { value: string; label: string }[], onChange: (v: string) => void, opts?: { required?: boolean }) => (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.45)' }}>
        {label}{opts?.required && <span style={{ color: '#F43843' }}> *</span>}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="appearance-none cursor-pointer"
        style={{ ...inputStyle, background: '#151520' }}
      >
        <option value="">Selecciona...</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )

  const sectionTitle = (label: string) => (
    <div className="flex items-center gap-2 mt-1">
      <div className="w-1 h-4 rounded-full" style={{ background: BLUE_GRAD }} />
      <span className="text-[13px] font-bold" style={{ color: '#fff' }}>{label}</span>
    </div>
  )

  const formBody = () => (
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
        {select('Tipo de documento', 'tipoDoc', DOC_OPCIONES)}
        {field('Número de documento', 'numDoc', { required: true })}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {field('Fecha de nacimiento', 'fechaNac', { type: 'date' })}
        {select('Género', 'genero', GENEROS)}
      </div>
      {form.genero === 'Otro' && (
        <div>
          {field('Especifique el género', 'generoOtro', { required: true })}
        </div>
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
      {form.parentesco === 'Otro' && (
        <div className="mt-0">
          {field('Especifique el parentesco', 'otroParentesco', { required: true })}
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
          <div className="grid grid-cols-2 gap-3">
            {field('Número carnet', 'numCarnet')}
            {select('Estado', 'estado', ESTADOS)}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {selectCatalogo('Institución', universidad, UNIVERSIDADES, (v) => { setUniversidad(v); setProgramaId('') })}
            {select('Modalidad', 'modalidad', MODALIDADES)}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {selectCatalogo('Programa', programaId, programasFiltrados.map(p => ({ value: p.id_programa, label: p.nombre })), setProgramaId, { required: true })}
            {select('Jornada', 'jornada', JORNADAS)}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {select('Semestre', 'semestre', SEMESTRES)}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Estado académico
              </label>
              <div className="flex-1 flex items-center justify-center rounded-xl px-3 text-[11px] font-semibold" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.5)' }}>
                Activo
              </div>
            </div>
          </div>
        </>
      )}

      {(tipoUsuario === 'profesor' || tipoUsuario === 'administrador') && (
        <>
          {sectionTitle('Información laboral')}
          <div className="grid grid-cols-2 gap-3">
            {selectCatalogo('Cargo', cargoId, cargos.map(c => ({ value: c.id, label: c.nombre })), setCargoId, { required: true })}
            {selectCatalogo('Área', areaId, areas.map(a => ({ value: a.id, label: a.nombre })), setAreaId, { required: true })}
          </div>
        </>
      )}
    </div>
  )

  const renderForm = () => (
    <>
      <div className="flex-shrink-0 flex flex-col items-center pt-6 pb-3">
        <img src={logotipo} alt="UNIFIT" style={{ height: 44, objectFit: 'contain' }} />
        <p className="text-[15px] font-extrabold mt-2" style={{ color: '#fff' }}>Crear cuenta</p>
        <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Completa tu información para afiliarte a UNIFIT
        </p>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <motion.div
          key="form"
          animate={shake ? { x: [0, -6, 6, -6, 6, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="py-1"
        >
          {error && (
            <div className="mx-5 mb-3 px-4 py-2.5 rounded-xl text-[11px] font-semibold" style={{ background: 'rgba(244,56,67,0.12)', border: '1px solid rgba(244,56,67,0.35)', color: '#FF8A90' }}>
              {error}
            </div>
          )}
          {formBody()}
        </motion.div>
      </div>

      <div className="flex-shrink-0 px-5 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={enviando}
          className="w-full flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
          style={{ background: enviando ? 'rgba(255,255,255,0.15)' : BLUE_GRAD }}
        >
          {enviando ? 'Enviando registro...' : 'Enviar registro'}
          <ArrowRight size={14} />
        </motion.button>
      </div>
    </>
  )

  const renderPendiente = () => (
    <div className="flex flex-col items-center justify-center flex-1 px-6 text-center">
      <div className="relative flex items-center justify-center mb-4">
        {[...Array(20)].map((_, i) => {
          const angle = (i / 20) * 360
          const rad = (angle * Math.PI) / 180
          return (
            <motion.span
              key={i}
              className="absolute pointer-events-none text-sm select-none"
              style={{ color: '#4ADE80' }}
              animate={{
                x: [0, Math.cos(rad) * (90 + (i % 6) * 18)],
                y: [0, Math.sin(rad) * (90 + (i % 6) * 18)],
                opacity: [0, 1, 0],
                scale: [0, 1.3, 0],
              }}
              transition={{
                duration: 2.4 + (i % 4) * 0.3,
                repeat: Infinity,
                delay: i * 0.07,
                ease: 'easeOut',
              }}
            >
              ✦
            </motion.span>
          )
        })}
        <motion.img
          src={successCheckImg}
          alt="éxito"
          className="w-28 h-auto object-contain relative z-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16 }}
        />
      </div>
      <h2 className="text-lg font-extrabold" style={{ color: '#fff' }}>¡Registro enviado!</h2>
      <p className="text-xs mt-2 leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
        Tu cuenta está en estado <b style={{ color: '#FFC247' }}>pendiente</b>.
        Habla con un administrador para activarla.
        Tu contraseña temporal es tu número de documento.
      </p>
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={onBack}
        className="mt-6 flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-white cursor-pointer"
        style={{ background: GREEN_GRAD }}
      >
        <ArrowLeft size={16} />
        Volver al inicio
      </motion.button>
    </div>
  )

  const renderSchedule = () => (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex flex-col items-center pt-5">
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Agenda del entrenador</p>
        <p className="text-[13px] font-bold mt-0.5 mb-2" style={{ color: '#fff' }}>
          Selecciona el día para tu cita
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 mb-2">
        <button
          onClick={() => setViewMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          <ChevronLeft size={15} />
        </button>
        <span className="text-xs font-extrabold" style={{ color: '#fff' }}>{title}</span>
        <button
          onClick={() => setViewMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          <ChevronRight size={15} />
        </button>
      </div>

      <div className="px-4">
        <div className="grid grid-cols-7 mb-1">
          {dayLabels.map(d => (
            <div key={d} className="text-center text-[9px] font-bold py-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{d}</div>
          ))}
        </div>
        {grid.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7">
            {week.map((dt, di) => {
              if (!dt) return <div key={di} className="aspect-square" />
              const ds = fmtDate(dt)
              const hasSlots = !!agenda[ds]
              const isSel = selectedDay === ds
              const isToday = ds === fmtDate(new Date())
              return (
                <motion.div
                  key={di}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => {
                    if (!hasSlots) return
                    setSelectedDay(ds)
                    setSelectedSlot(null)
                  }}
                  className="relative aspect-square flex items-center justify-center rounded-lg cursor-pointer select-none"
                  style={{
                    background: isSel ? DAY_GRAD : hasSlots ? 'rgba(18,112,183,0.12)' : 'transparent',
                    border: isSel ? 'none' : '1px solid rgba(255,255,255,0.05)',
                    color: isSel ? '#fff' : hasSlots ? '#fff' : isToday ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.35)',
                    fontWeight: hasSlots || isSel ? 800 : 500,
                    fontSize: 12,
                  }}
                >
                  {dt.getDate()}
                  {hasSlots && !isSel && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ background: '#7ec8e3' }} />
                  )}
                </motion.div>
              )
            })}
          </div>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-5 mt-3">
        {!selectedDay ? (
          <div className="flex flex-col items-center py-8 gap-2">
            <CalendarCheck size={22} style={{ color: 'rgba(255,255,255,0.2)' }} />
            <p className="text-[11px] text-center" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Toca un día resaltado para ver los horarios disponibles
            </p>
          </div>
        ) : scheduled ? (
          <div className="flex flex-col items-center py-6 gap-3 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 16 }}
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}
            >
              <Check size={22} color={GREEN} strokeWidth={3} />
            </motion.div>
            <h3 className="text-sm font-extrabold" style={{ color: '#fff' }}>¡Cita agendada!</h3>
            <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Tu valoración quedó programada para el {selectedDay} a las {selectedSlot}.<br />
              El entrenador te confirmará la hora.
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onBack}
              className="mt-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
              style={{ background: GREEN_GRAD }}
            >
              Volver al inicio
            </motion.button>
          </div>
        ) : (
          <>
            <p className="text-[10px] font-bold mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>Horarios disponibles</p>
            <div className="flex flex-col gap-2">
              {slotsOfDay.map(s => {
                const isSelSlot = selectedSlot === s.time
                return (
                  <motion.button
                    key={s.time}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedSlot(s.time)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left cursor-pointer transition-all"
                    style={{
                      background: isSelSlot ? 'rgba(18,112,183,0.2)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${isSelSlot ? BLUE : 'rgba(255,255,255,0.08)'}`,
                    }}
                  >
                    <Clock size={14} style={{ color: s.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-bold" style={{ color: '#fff' }}>{s.time}</div>
                      <div className="text-[10px] truncate" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.title}</div>
                    </div>
                    {isSelSlot && <Check size={15} color="#7ec8e3" strokeWidth={3} />}
                  </motion.button>
                )
              })}
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={confirmSchedule}
              disabled={!selectedSlot}
              className="w-full mt-3 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
              style={{ background: selectedSlot ? BLUE_GRAD : 'rgba(255,255,255,0.1)', opacity: selectedSlot ? 1 : 0.5 }}
            >
              Confirmar cita
            </motion.button>
          </>
        )}
      </div>
    </div>
  )

  const phaseContent = (
    <AnimatePresence mode="wait">
      {phase === 'form' && (
        <motion.div
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col flex-1 min-h-0"
        >
          {renderForm()}
        </motion.div>
      )}
      {phase === 'pendiente' && (
        <motion.div
          key="pendiente"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col flex-1 min-h-0 pt-6"
        >
          {renderPendiente()}
        </motion.div>
      )}
      {phase === 'schedule' && (
        <motion.div
          key="schedule"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col flex-1 min-h-0 pt-3"
        >
          {renderSchedule()}
        </motion.div>
      )}
    </AnimatePresence>
  )

  const viewToolbar = (
    <div className="flex-shrink-0 flex items-center justify-center gap-1 z-50 pt-3 pb-2">
      <span className="text-[9px] font-bold uppercase tracking-widest mr-1.5" style={{ color: 'rgba(255,255,255,0.3)' }}>Vista</span>
      {(['celular', 'desktop', 'auto'] as const).map(v => (
        <button
          key={v}
          onClick={() => setPreviewMode(v)}
          className="px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer"
          style={{
            background: previewMode === v ? 'rgba(255,255,255,0.14)' : 'transparent',
            border: previewMode === v ? '1px solid rgba(255,255,255,0.22)' : '1px solid transparent',
            color: previewMode === v ? '#FFFFFF' : 'rgba(255,255,255,0.35)',
          }}
        >
          {v === 'celular' ? 'Celular' : v === 'desktop' ? 'Desktop' : 'Auto'}
        </button>
      ))}
    </div>
  )

  const backButton = (top: number) => phase === 'form' && (
    <button
      onClick={onBack}
      className="absolute z-40 w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors"
      style={{ top, left: 16, color: 'rgba(255,255,255,0.5)' }}
    >
      <ArrowLeft size={16} />
    </button>
  )

  return (
    <div className="size-full flex flex-col" style={{ background: DARK_BG }}>
      {viewToolbar}

      <div className="flex-1 min-h-0 relative">
        {isDesktopVideo ? (
          <div className="absolute inset-0 overflow-hidden" style={{ background: DARK_BG }}>
            <LoginBackground />
            <div className="relative z-10 size-full flex items-center justify-center overflow-hidden" style={{ padding: 20 }}>
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-3xl h-full flex flex-col"
                style={{
                  background: 'rgba(10,14,24,0.78)',
                  backdropFilter: 'blur(28px) saturate(1.6)',
                  WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  boxShadow: '0 24px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.15)',
                  borderRadius: 32,
                }}
              >
                {phaseContent}
              </motion.div>
            </div>
          </div>
        ) : isPhonePreview ? (
          <motion.div
            key="phone"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col overflow-hidden mx-auto"
            style={isMobile ? {
              width: '100%',
              height: '100%',
              background: DARK_BG,
            } : {
              width: 390,
              height: 720,
              borderRadius: 48,
              background: DARK_BG,
              border: '10px solid rgba(255,255,255,0.06)',
              boxShadow: '0 60px 140px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            {!isMobile && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 rounded-b-2xl z-50" style={{ background: 'rgba(0,0,0,0.85)' }}>
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-2.5 rounded-full" style={{ background: '#151520' }} />
              </div>
            )}
            {backButton(isMobile ? 12 : 36)}
            {phaseContent}
          </motion.div>
        ) : (
          <motion.div
            key="desktop"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative size-full flex flex-col overflow-hidden"
            style={{
              background: 'rgba(10,14,24,0.92)',
              backdropFilter: 'blur(28px) saturate(1.6)',
              WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
            }}
          >
            {backButton(16)}
            <div className="flex-1 min-h-0 w-full max-w-3xl mx-auto flex flex-col">
              {phaseContent}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}