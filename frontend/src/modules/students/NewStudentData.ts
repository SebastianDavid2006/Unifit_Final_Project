import { User, FileText, ClipboardCheck, Pen, ScanLine } from 'lucide-react'
import studentRoleImg from '../../assets/icons/users/student.webp'
import teacherRoleImg from '../../assets/icons/users/teacher.webp'
import adminRoleImg from '../../assets/icons/users/administrator.webp'

export const BLUE = '#1270B7'
export const RED = '#F43843'
export const GREEN = '#22C55E'
export const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #7ec8e3)'
export const GREEN_GRAD = 'linear-gradient(135deg, #00fb64, #009b95)'
export const BRAND_GRADIENT = 'linear-gradient(135deg, #F5A623, #1270B7, #F43843)'
export const MESH_ACTIVE = `
  radial-gradient(circle at 30% 20%, rgba(244,56,67,0.95) 0%, transparent 50%),
  radial-gradient(circle at 70% 25%, rgba(18,112,183,0.65) 0%, transparent 50%),
  radial-gradient(circle at 50% 75%, rgba(245,166,35,0.55) 0%, transparent 50%),
  #F43843
`
export const MESH_BUTTON = `
  radial-gradient(circle at 25% 25%, rgba(18,112,183,0.95) 0%, transparent 50%),
  radial-gradient(circle at 75% 30%, rgba(244,56,67,0.45) 0%, transparent 50%),
  radial-gradient(circle at 50% 75%, rgba(245,166,35,0.35) 0%, transparent 50%),
  #1270B7
`

export const TIPO_DOC = ['CC', 'CE', 'Pasaporte', 'NIT']
export const GENEROS = ['Masculino', 'Femenino', 'Otro']
export const GRUPOS_SANGRE = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
export const MODALIDADES = ['Presencial', 'Virtual']
export const JORNADAS = ['Mañana', 'Noche', 'Fin de semana']
export const ESTADOS = ['Egresado', 'No egresado']
export const PARENTESCOS = ['Padre', 'Madre', 'Hermano(a)', 'Abuelo(a)', 'Tío(a)', 'Primo(a)', 'Otro']

export const STEPS = [
  { num: 1, label: 'Información personal', icon: User },
  { num: 2, label: 'Tratamiento de datos', icon: FileText },
  { num: 3, label: 'Contrato', icon: FileText },
  { num: 4, label: 'PAR-Q', icon: ClipboardCheck },
  { num: 5, label: 'Firma', icon: Pen },
  { num: 6, label: 'Huella digital', icon: ScanLine },
]

export type TipoUsuario = 'estudiante' | 'profesor' | 'administrador'

export const TIPOS_USUARIO: { id: TipoUsuario; label: string; img: string; gradient: string; accent: string }[] = [
  { id: 'estudiante', label: 'Estudiante', img: studentRoleImg, gradient: 'linear-gradient(135deg, #1270B7, #7ec8e3)', accent: BLUE },
  { id: 'profesor', label: 'Profesor', img: teacherRoleImg, gradient: 'linear-gradient(135deg, #00A36C, #22C55E)', accent: GREEN },
  { id: 'administrador', label: 'Administrativo', img: adminRoleImg, gradient: 'linear-gradient(135deg, #F5A623, #FFC247)', accent: '#F5A623' },
]

export const INITIAL_FORM = {
  primerNombre: '', segundoNombre: '', primerApellido: '', segundoApellido: '',
  tipoDoc: 'CC', numDoc: '', fechaNac: '', genero: 'Masculino',
  eps: '', grupoSanguineo: 'O+', email: '', telefono: '',
  nombreContacto: '', telefonoContacto: '', parentesco: '', otroParentesco: '', numCarnet: '',
  institucion: 'Universitaria de Colombia',
  nivelFormacion: 'Técnicos',
  programa: 'Auxiliar Administrativo',
  semestre: '1', modalidad: 'Presencial',
  jornada: 'Mañana', estado: 'Activo', cargo: '', area: '',
  nombreAcudiente: '', docAcudiente: '',
}
