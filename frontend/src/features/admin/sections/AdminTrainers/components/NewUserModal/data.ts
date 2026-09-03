import { User, FileText, Shield } from 'lucide-react'

export const BLUE = '#1270B7'
export const RED = '#F43843'
export const GREEN = '#22C55E'
export const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #7ec8e3)'
export const GREEN_GRAD = 'linear-gradient(135deg, #00fb64, #009b95)'
export const BRAND_GRADIENT = 'linear-gradient(135deg, #F5A623, #1270B7, #F43843)'

export const TIPO_DOC = ['CC', 'CE', 'Pasaporte', 'NIT']
export const GENEROS = ['Masculino', 'Femenino', 'Otro']
export const GRUPOS_SANGRE = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
export const MODALIDADES = ['Presencial', 'Virtual']
export const JORNADAS = ['Mañana', 'Tarde', 'Noche', 'Completa']
export const PARENTESCOS = ['Padre', 'Madre', 'Hermano(a)', 'Abuelo(a)', 'Tío(a)', 'Primo(a)', 'Otro']

export const STEPS = [
  { num: 1, label: 'Información personal', icon: User },
  { num: 2, label: 'Tratamiento de datos', icon: FileText },
  { num: 3, label: 'Rol del usuario', icon: Shield },
]

export const INITIAL_FORM = {
  primerNombre: '', segundoNombre: '', primerApellido: '', segundoApellido: '',
  tipoDoc: 'CC', numDoc: '', fechaNac: '', genero: 'Masculino',
  eps: '', grupoSanguineo: 'O+', email: '', telefono: '',
  nombreContacto: '', telefonoContacto: '', parentesco: '', otroParentesco: '',
}

export type NewUserForm = typeof INITIAL_FORM
export type UserRole = 'trainer' | 'admin'
export type TipoUsuarioStaff = 'profesor' | 'administrativo'

export const meshInputBg = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)'
export const meshInputHover = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(0,0,0,0.04)'
export const meshInputFocus = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(18,112,183,0.04)'
