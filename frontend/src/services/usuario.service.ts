import { api } from '@/lib/api'
import type { Student } from '@/data/students'

export interface BackendUsuario {
  id_usuario: string
  primer_nombre: string
  segundo_nombre?: string
  primer_apellido: string
  segundo_apellido?: string
  email_contacto: string
  telefono_contacto?: string
  documento: string
  tipo_documento: string
  rol: 'admin' | 'entrenador' | 'usuario'
  tipo_usuario: 'estudiante' | 'profesor' | 'administrativo'
  estado: 'pendiente' | 'activo' | 'inactivo'
  debe_cambiar_password: boolean
  fecha_nacimiento?: string
  fecha_creacion?: string
  genero?: 'masculino' | 'femenino' | 'otro'
  genero_otro?: string
  eps?: string
  grupo_sanguineo?: string
  nombre_emergencia?: string
  telefono_emergencia?: string
  parentesco_emergencia?: string
  parq_realizado?: boolean
  tiene_huella?: boolean
  acepta_contrato?: boolean
  acepta_tratamiento?: boolean
  huella?: { id_huella: string; indice_sensor: number; activo: boolean; paso_enrolamiento: number | null } | null
  estudiante?: { id_programa: string; semestre: number; modalidad: string; jornada: string; es_egresado?: boolean; numero_carnet?: string; programa?: { id_programa: string; nombre: string; universidad?: string } | null } | null
  profesor?: { id_cargo: string; id_area: string; cargo?: { nombre: string } | null; area?: { nombre: string } | null } | null
  administrativo?: { id_cargo: string; id_area: string; cargo?: { nombre: string } | null; area?: { nombre: string } | null } | null
  acudiente?: { primer_nombre: string; segundo_nombre?: string; primer_apellido: string; segundo_apellido?: string; tipo_documento: string; documento: string; parentesco?: string; telefono_contacto?: string } | null
  valoraciones_count?: number
  ultimo_ingreso?: string | null
  proxima_valoracion?: string | null
}

export interface Trainer {
  id: string
  name: string
  firstName: string
  secondName: string
  lastName: string
  secondLastName: string
  email: string
  phone: string
  document: string
  speciality: string
  role: 'trainer' | 'admin'
  status: 'active' | 'inactive' | 'process'
  avatar: string
  joinedAt: string
  contactName: string
  contactPhone: string
  contactRelation: string
  birthDate: string
  gender: string
  eps: string
  bloodType: string
  accessLevel: 'Completo' | 'Parcial'
  lastAccess: string
  certificaciones: string[]
  huella?: string
}

const STATUS_MAP: Record<string, Student['status']> = {
  activo: 'active',
  inactivo: 'inactive',
  pendiente: 'process',
}

function buildName(u: BackendUsuario) {
  return `${u.primer_nombre} ${u.segundo_nombre ?? ''} ${u.primer_apellido} ${u.segundo_apellido ?? ''}`.replace(/\s+/g, ' ').trim()
}

function buildAvatar(u: BackendUsuario) {
  return `${(u.primer_nombre ?? '')[0] ?? ''}${(u.primer_apellido ?? '')[0] ?? ''}`.toUpperCase()
}

import { formatDateES, formatDateTimeES } from '@/lib/dateUtils'

function formatDate(dateStr?: string): string {
  return formatDateES(dateStr, { day: '2-digit', month: 'short', year: 'numeric' })
}

const GENERO_LABEL: Record<string, string> = {
  masculino: 'Masculino',
  femenino: 'Femenino',
  otro: 'Otro',
}

const UNIVERSIDAD_LABEL: Record<string, string> = {
  uni_colombia: 'Universitaria de Colombia',
  uni_bogota: 'Universitaria de Bogotá',
}

function mapGenero(u: BackendUsuario): string {
  if (!u.genero) return ''
  if (u.genero === 'otro' && u.genero_otro?.trim()) return u.genero_otro.trim()
  return GENERO_LABEL[u.genero] ?? u.genero
}

function mapInstitucion(u: BackendUsuario): string {
  const universidad = u.estudiante?.programa?.universidad
  return universidad ? (UNIVERSIDAD_LABEL[universidad] ?? universidad) : ''
}

export function mapBackendToStudent(u: BackendUsuario): Student {
  const estudiante = u.estudiante
  const profesor = u.profesor
  const administrativo = u.administrativo

  const program = estudiante?.programa?.nombre ?? ''
  const cargo = profesor?.cargo?.nombre ?? administrativo?.cargo?.nombre ?? undefined
  const area = profesor?.area?.nombre ?? administrativo?.area?.nombre ?? undefined

  const acudiente = u.acudiente ? {
    primerNombre: u.acudiente.primer_nombre,
    segundoNombre: u.acudiente.segundo_nombre ?? undefined,
    primerApellido: u.acudiente.primer_apellido,
    segundoApellido: u.acudiente.segundo_apellido ?? undefined,
    tipoDocumento: u.acudiente.tipo_documento ?? 'CC',
    documento: u.acudiente.documento ?? '',
    parentesco: u.acudiente.parentesco ?? undefined,
    telefonoContacto: u.acudiente.telefono_contacto ?? undefined,
  } : undefined

  return {
    id: u.id_usuario,
    name: buildName(u),
    firstName: u.primer_nombre,
    secondName: u.segundo_nombre ?? '',
    lastName: u.primer_apellido,
    secondLastName: u.segundo_apellido ?? '',
    documentType: u.tipo_documento,
    documentNumber: u.documento,
    birthDate: u.fecha_nacimiento ?? '',
    gender: mapGenero(u),
    eps: u.eps ?? '',
    bloodType: u.grupo_sanguineo ?? '',
    email: u.email_contacto,
    phone: u.telefono_contacto ?? '',
    contactName: u.nombre_emergencia ?? '',
    contactPhone: u.telefono_emergencia ?? '',
    contactRelation: u.parentesco_emergencia ?? '',
    carnetId: estudiante?.numero_carnet ?? '',
    program,
    institution: mapInstitucion(u),
    faculty: '',
    semestre: estudiante?.semestre ?? 0,
    semester: String(estudiante?.semestre ?? ''),
    modality: estudiante?.modalidad ?? '',
    jornada: estudiante?.jornada ?? '',
    graduationStatus: estudiante?.es_egresado ? 'Egresado' : 'No egresado',
    adherence: 0,
    status: STATUS_MAP[u.estado] ?? 'process',
    lastVisit: u.ultimo_ingreso ? formatDateTimeES(u.ultimo_ingreso) : '',
    nextAssessment: u.proxima_valoracion ? formatDateTimeES(u.proxima_valoracion) : 'Por agendar',
    avatar: buildAvatar(u),
    goal: '',
    sessions: 0,
    valoraciones: u.valoraciones_count ?? 0,
    weight: 0,
    height: 0,
    tipo_usuario: u.tipo_usuario,
    cargo,
    area,
    createdAt: u.fecha_creacion,
    aceptaContrato: u.acepta_contrato,
    aceptaTratamiento: u.acepta_tratamiento,
    parqRealizado: u.parq_realizado,
    acudiente,
  }
}

export function mapBackendToTrainer(u: BackendUsuario): Trainer {
  return {
    id: u.id_usuario,
    name: buildName(u),
    firstName: u.primer_nombre,
    secondName: u.segundo_nombre ?? '',
    lastName: u.primer_apellido,
    secondLastName: u.segundo_apellido ?? '',
    email: u.email_contacto,
    phone: u.telefono_contacto ?? '',
    document: `${u.tipo_documento}. ${u.documento}`,
    speciality: u.rol === 'admin' ? 'Administración del Sistema' : 'Entrenamiento General',
    role: u.rol === 'admin' ? 'admin' : 'trainer',
    status: STATUS_MAP[u.estado] ?? 'process',
    avatar: buildAvatar(u),
    joinedAt: formatDate(u.fecha_creacion),
    contactName: '',
    contactPhone: '',
    contactRelation: '',
    birthDate: u.fecha_nacimiento ?? '',
    gender: '',
    eps: '',
    bloodType: '',
    accessLevel: u.rol === 'admin' ? 'Completo' : 'Parcial',
    lastAccess: '',
    certificaciones: [],
    huella: u.huella?.indice_sensor ? 'capturada' : 'sin_capturar',
  }
}

export async function getUsuarios(): Promise<BackendUsuario[]> {
  const res = await api.get('/usuarios')
  return res.data
}

export async function getMiPerfil(): Promise<BackendUsuario> {
  const res = await api.get('/usuarios/me')
  return res.data
}

export async function getPersonal(): Promise<BackendUsuario[]> {
  const res = await api.get('/usuarios/personal')
  return res.data
}

export async function registrarUsuario(data: Record<string, unknown>): Promise<{ usuario: BackendUsuario }> {
  const res = await api.post('/usuarios', data)
  return res.data
}

export async function cambiarRol(id: string, rol: 'admin' | 'entrenador' | 'usuario'): Promise<void> {
  await api.put(`/usuarios/${id}/rol`, { rol })
}

export async function actualizarPerfil(id: string, data: Record<string, unknown>): Promise<BackendUsuario> {
  const res = await api.put(`/usuarios/${id}/perfil`, data)
  return res.data
}

export async function desactivarUsuario(id: string): Promise<void> {
  await api.put(`/usuarios/${id}/desactivar`)
}

export async function activarUsuario(id: string): Promise<void> {
  await api.put(`/usuarios/${id}/activar`)
}
