import studentRoleImg from '@/assets/icons/users/student.webp'
import teacherRoleImg from '@/assets/icons/users/teacher.webp'
import adminRoleImg from '@/assets/icons/users/administrator.webp'
import {
  TIPO_DOC, GENEROS, GRUPOS_SANGRE, MODALIDADES, JORNADAS, ESTADOS, PARENTESCOS,
  MAP_GENERO, MAP_GRUPO, MAP_PARENTESCO, MAP_JORNADA, MAP_MODALIDAD,
} from '@/data/config/catalogosRegistro'

export {
  TIPO_DOC, GENEROS, GRUPOS_SANGRE, MODALIDADES, JORNADAS, ESTADOS, PARENTESCOS,
  MAP_GENERO, MAP_GRUPO, MAP_PARENTESCO, MAP_JORNADA, MAP_MODALIDAD,
}

export const BLUE = '#1270B7'
export const GREEN = '#22C55E'
export const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #7ec8e3)'
export const GREEN_GRAD = 'linear-gradient(135deg, #00fb64, #009b95)'

export type TipoUsuario = 'estudiante' | 'profesor' | 'administrativo'

export const TIPOS_USUARIO: { id: TipoUsuario; label: string; img: string; gradient: string; accent: string }[] = [
  { id: 'estudiante', label: 'Estudiante', img: studentRoleImg, gradient: 'linear-gradient(135deg, #1270B7, #7ec8e3)', accent: BLUE },
  { id: 'profesor', label: 'Profesor', img: teacherRoleImg, gradient: 'linear-gradient(135deg, #00A36C, #22C55E)', accent: GREEN },
  { id: 'administrativo', label: 'Administrativo', img: adminRoleImg, gradient: 'linear-gradient(135deg, #F5A623, #FFC247)', accent: '#F5A623' },
]

export const INITIAL_FORM = {
  primerNombre: '', segundoNombre: '', primerApellido: '', segundoApellido: '',
  tipoDoc: 'CC', numDoc: '', fechaNac: undefined, genero: 'Masculino',
  eps: '', grupoSanguineo: 'O+', email: '', telefono: '',
  nombreContacto: '', telefonoContacto: '', parentesco: '', otroParentesco: '', numCarnet: '',
  institucion: 'uni_colombia',
  nivelFormacion: 'tecnico',
  programa: '',
  semestre: '1', modalidad: 'Presencial',
  jornada: 'Mañana', estado: 'No egresado', cargo: '', area: '',
  acudientePrimerNombre: '', acudientePrimerApellido: '', acudienteDocumento: '',
  acudienteTipoDocumento: 'CC', acudienteParentesco: '', acudienteTelefonoContacto: '',
}
