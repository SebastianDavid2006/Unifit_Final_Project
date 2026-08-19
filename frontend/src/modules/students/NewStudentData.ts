import { User, FileText, ClipboardCheck, Pen, ScanLine } from 'lucide-react'

export {
  BLUE, GREEN, BLUE_GRAD, GREEN_GRAD,
  TIPO_DOC, GENEROS, GRUPOS_SANGRE, MODALIDADES, JORNADAS, ESTADOS, PARENTESCOS,
  TIPOS_USUARIO, INITIAL_FORM,
  type TipoUsuario,
} from '@/data/registration'

export const RED = '#F43843'
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

export const STEPS = [
  { num: 1, label: 'Información personal', icon: User },
  { num: 2, label: 'Tratamiento de datos', icon: FileText },
  { num: 3, label: 'Contrato', icon: FileText },
  { num: 4, label: 'PAR-Q', icon: ClipboardCheck },
  { num: 5, label: 'Firma', icon: Pen },
  { num: 6, label: 'Huella digital', icon: ScanLine },
]
