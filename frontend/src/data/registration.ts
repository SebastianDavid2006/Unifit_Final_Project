import studentRoleImg from '@/assets/icons/users/student.webp'
import teacherRoleImg from '@/assets/icons/users/teacher.webp'
import adminRoleImg from '@/assets/icons/users/administrator.webp'

export const BLUE = '#1270B7'
export const GREEN = '#22C55E'
export const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #7ec8e3)'
export const GREEN_GRAD = 'linear-gradient(135deg, #00fb64, #009b95)'

export const TIPO_DOC = ['CC', 'CE', 'Pasaporte', 'NIT']
export const GENEROS = ['Masculino', 'Femenino', 'Otro']
export const GRUPOS_SANGRE = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
export const MODALIDADES = ['Presencial', 'Virtual']
export const JORNADAS = ['Mañana', 'Noche', 'Fin de semana']
export const ESTADOS = ['Egresado', 'No egresado']
export const PARENTESCOS = ['Padre', 'Madre', 'Hermano(a)', 'Abuelo(a)', 'Tío(a)', 'Primo(a)', 'Otro']

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
  nombreAcudiente: '', parentescoAcudiente: '', otroParentescoAcudiente: '', telefonoAcudiente: '',
}
