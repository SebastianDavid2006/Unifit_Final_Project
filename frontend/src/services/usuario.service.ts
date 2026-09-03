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
  parq_realizado?: boolean
  tiene_huella?: boolean
  acepta_contrato?: boolean
  acepta_tratamiento?: boolean
  estudiante?: { id_programa: string; semestre: number; modalidad: string; jornada: string; programa?: { nombre_programa: string } } | null
  profesor?: { id_cargo: string; id_area: string; cargo?: { nombre_cargo: string }; area?: { nombre_area: string } } | null
  administrativo?: { id_cargo: string; id_area: string; cargo?: { nombre_cargo: string }; area?: { nombre_area: string } } | null
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

function formatDate(dateStr?: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function mapBackendToStudent(u: BackendUsuario): Student {
  const estudiante = u.estudiante
  const profesor = u.profesor
  const administrativo = u.administrativo

  const program = estudiante?.programa?.nombre_programa ?? ''
  const cargo = profesor?.cargo?.nombre_cargo ?? administrativo?.cargo?.nombre_cargo ?? undefined
  const area = profesor?.area?.nombre_area ?? administrativo?.area?.nombre_area ?? undefined

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
    gender: '',
    eps: '',
    bloodType: '',
    email: u.email_contacto,
    phone: u.telefono_contacto ?? '',
    contactName: '',
    contactPhone: '',
    contactRelation: '',
    carnetId: '',
    program,
    institution: 'Universitaria de Colombia',
    faculty: '',
    semestre: estudiante?.semestre ?? 0,
    semester: String(estudiante?.semestre ?? ''),
    modality: estudiante?.modalidad ?? '',
    jornada: estudiante?.jornada ?? '',
    graduationStatus: 'No egresado',
    adherence: 0,
    risk: 'low' as const,
    status: STATUS_MAP[u.estado] ?? 'process',
    lastVisit: '',
    nextAssessment: 'Por agendar',
    avatar: buildAvatar(u),
    goal: '',
    sessions: 0,
    weight: 0,
    height: 0,
    tipo_usuario: u.tipo_usuario,
    cargo,
    area,
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
  }
}

export async function getUsuarios(): Promise<BackendUsuario[]> {
  const res = await api.get('/usuarios')
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
