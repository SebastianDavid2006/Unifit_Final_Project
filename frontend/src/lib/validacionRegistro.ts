// ============================================================================
// MANTENER EN SINCRONÍA con Backend/src/controllers/usuario.controller.ts
// Bloques: DOC_REGEX (L41-47), EDAD_MIN/EDAD_MAX (registrarSchema L.92-103),
// telefonoSchema (L57-75), nombreSchema (L49-55). Mensajes de formato idénticos.
// ============================================================================

export const DOC_REGEX: Record<string, RegExp> = {
  CC: /^\d{7,10}$/,
  TI: /^\d{10,11}$/,
  CE: /^\d{6,10}$/,
  PA: /^[A-Za-z0-9]{6,9}$/,
  RC: /^\d{10,12}$/,
}

export const EDAD_MIN = 15
export const EDAD_MAX = 70

const NOMBRE_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s-]+$/
const REPETIDO_REGEX = /(.)\1{3,}/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function nombreErrores(val: string | undefined): string[] {
  if (!val?.trim()) return ['Este campo es requerido']
  const v = val.trim()
  const errores: string[] = []
  if (v.length < 2) errores.push('Muy corto')
  if (v.length > 50) errores.push('Muy largo')
  if (!NOMBRE_REGEX.test(v)) errores.push('Solo letras, espacios y guiones')
  if (REPETIDO_REGEX.test(v)) errores.push('Valor no válido')
  return errores
}

function documentoErrores(tipoDoc: string | undefined, numDoc: string | undefined): string[] {
  if (!numDoc?.trim()) return ['El documento es requerido']
  const regex = tipoDoc ? DOC_REGEX[tipoDoc] : undefined
  if (regex && !regex.test(numDoc.trim())) return [`Formato de documento inválido para ${tipoDoc}`]
  return []
}

function emailErrores(email: string | undefined): string[] {
  if (!email?.trim()) return ['Este campo es requerido']
  const v = email.trim()
  if (!EMAIL_REGEX.test(v)) return ['El correo electrónico no es válido']
  if (v.length > 254) return ['El correo electrónico es demasiado largo']
  return []
}

// Teléfono opcional: vacío => null (sin errores); lleno => reglas del telefonoSchema
function telefonoErrores(tel: string | undefined): string[] | null {
  if (!tel?.trim()) return null
  const v = tel.trim()
  if (v.length > 10) return ['El teléfono no debe superar los 10 dígitos']
  if (!/^\d{10}$/.test(v)) return ['Teléfono debe tener 10 dígitos']
  if (!v.startsWith('3')) return ['Teléfono debe iniciar con 3']
  if (/^(\d)\1{9}$/.test(v) || /^(0123456789|1234567890|9876543210)$/.test(v)) return ['Teléfono no válido']
  return []
}

// EPS opcional: vacío => null; lleno => reglas del eps (registrarSchema)
function epsErrores(val: string | undefined): string[] | null {
  if (!val?.trim()) return null
  const v = val.trim()
  if (v.length < 2) return ['Muy corto']
  if (v.length > 60) return ['Muy largo']
  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9\s.\-]+$/.test(v)) return ['Formato de EPS inválido']
  return []
}

import { isValidDate, calcAge } from './dateUtils'

export function fechaErrores(fecha: string | undefined, edadMin: number = EDAD_MIN): string[] {
  if (!isValidDate(fecha)) return ['Fecha de nacimiento es requerida']
  const d = new Date(fecha!)
  const hoy = new Date()
  if (d > hoy) return ['Fecha no puede ser futura']
  const edad = calcAge(fecha, hoy)
  if (edad < edadMin || edad > EDAD_MAX) return [`Edad válida solo entre ${edadMin} y ${EDAD_MAX} años`]
  return []
}

function generoErrores(genero: string | undefined): string[] {
  if (!genero) return ['Este campo es requerido']
  return []
}

export interface PasoInfo {
  primerNombre?: string
  segundoNombre?: string
  primerApellido?: string
  segundoApellido?: string
  tipoDoc?: string
  numDoc?: string
  email?: string
  telefono?: string
  fechaNac?: string
  genero?: string
  numCarnet?: string
  cargo?: string
  area?: string
  nombreContacto?: string
  telefonoContacto?: string
  eps?: string
}

export interface RamaOpciones {
  tipoUsuario?: string
  // true para el modal de estudiantes (valida tambien rama, carnet o cargo/area)
  incluyeRama?: boolean
  edadMin?: number
}

export function validarPasoInfo(form: PasoInfo, opts?: RamaOpciones): Record<string, string[]> {
  const errores: Record<string, string[]> = {}
  const set = (campo: string, msgs: string[]) => {
    if (msgs.length > 0) errores[campo] = msgs
  }

  set('primerNombre', nombreErrores(form.primerNombre))
  if (form.segundoNombre) set('segundoNombre', nombreErrores(form.segundoNombre))
  set('primerApellido', nombreErrores(form.primerApellido))
  if (form.segundoApellido) set('segundoApellido', nombreErrores(form.segundoApellido))
  set('numDoc', documentoErrores(form.tipoDoc, form.numDoc))
  set('email', emailErrores(form.email))
  set('fechaNac', fechaErrores(form.fechaNac, opts?.edadMin))
  set('genero', generoErrores(form.genero))
  const tel = telefonoErrores(form.telefono)
  if (tel) set('telefono', tel)
  if (form.nombreContacto?.trim()) set('nombreContacto', nombreErrores(form.nombreContacto))
  const telContacto = telefonoErrores(form.telefonoContacto)
  if (telContacto) set('telefonoContacto', telContacto)
  const eps = epsErrores(form.eps)
  if (eps) set('eps', eps)

  if (opts?.incluyeRama) {
    if (opts.tipoUsuario === 'estudiante') {
      if (!form.numCarnet?.trim()) {
        set('numCarnet', ['Número de carnet es requerido'])
      } else {
        const regex = form.tipoDoc ? DOC_REGEX[form.tipoDoc] : undefined
        if (regex && !regex.test(form.numCarnet.trim())) set('numCarnet', ['Formato de carnet inválido'])
      }
    } else if (opts.tipoUsuario === 'profesor' || opts.tipoUsuario === 'administrativo') {
      if (!form.cargo) set('cargo', ['Selecciona un cargo'])
      if (!form.area) set('area', ['Selecciona un área'])
    }
  }

  return errores
}

export interface AcudienteInfo {
  acudientePrimerNombre?: string
  acudientePrimerApellido?: string
  acudienteTipoDocumento?: string
  acudienteDocumento?: string
  acudienteTelefonoContacto?: string
}

export function validarAcudiente(form: AcudienteInfo): Record<string, string[]> {
  const errores: Record<string, string[]> = {}
  const setNombre = (campo: string, requerido: string, val?: string) => {
    if (!val?.trim()) {
      errores[campo] = [requerido]
      return
    }
    const format = nombreErrores(val)
    if (format.length > 0) errores[campo] = format
  }
  const setDoc = (campo: string, requerido: string, tipo?: string, val?: string) => {
    if (!val?.trim()) {
      errores[campo] = [requerido]
      return
    }
    const regex = tipo ? DOC_REGEX[tipo] : undefined
    if (regex && !regex.test(val.trim())) errores[campo] = [`Formato de documento inválido para ${tipo}`]
  }
  setNombre('acudientePrimerNombre', 'Nombre del acudiente es requerido para menores de edad', form.acudientePrimerNombre)
  setNombre('acudientePrimerApellido', 'Apellido del acudiente es requerido para menores de edad', form.acudientePrimerApellido)
  setDoc('acudienteDocumento', 'Documento del acudiente es requerido para menores de edad', form.acudienteTipoDocumento, form.acudienteDocumento)
  const tel = telefonoErrores(form.acudienteTelefonoContacto)
  if (tel && tel.length > 0) errores.acudienteTelefonoContacto = tel
  return errores
}

export function validarPasoRol(role: unknown, tipoUsuario: unknown, idCargo: unknown, idArea: unknown): Record<string, string[]> {
  const errores: Record<string, string[]> = {}
  if (!role) errores.role = ['Selecciona un rol']
  if (!tipoUsuario) errores.tipoUsuario = ['Selecciona el tipo de usuario']
  if (!idCargo) errores.idCargo = ['Selecciona un cargo']
  if (!idArea) errores.idArea = ['Selecciona un área']
  return errores
}