import axios from 'axios'
import { cerrarSesion, getToken } from './auth'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const teniaSesion = getToken() !== null
      cerrarSesion()
      if (teniaSesion) {
        window.location.href = '/'
      }
    }
    return Promise.reject(error)
  },
)

export function mensajeError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { mensaje?: string } | undefined
    return data?.mensaje ?? 'Error inesperado'
  }
  return 'Error inesperado'
}

export interface ErroresCampo {
  campo: string
  mensajes: string[]
}

export function erroresDeCampo(error: unknown): ErroresCampo[] {
  if (!axios.isAxiosError(error)) return []
  const data = error.response?.data as {
    errores?: { fieldErrors?: Record<string, string[]>; formErrors?: string[] }
  } | undefined
  const fieldErrors = data?.errores?.fieldErrors
  if (!fieldErrors) return []
  return Object.entries(fieldErrors).map(([campo, mensajes]) => ({
    campo,
    mensajes,
  }))
}

export const CAMPO_BACKEND_A_FORM: Record<string, string> = {
  primer_nombre: 'primerNombre',
  segundo_nombre: 'segundoNombre',
  primer_apellido: 'primerApellido',
  segundo_apellido: 'segundoApellido',
  email_contacto: 'email',
  telefono_contacto: 'telefono',
  documento: 'numDoc',
  tipo_documento: 'tipoDoc',
  fecha_nacimiento: 'fechaNac',
  genero: 'genero',
  eps: 'eps',
  grupo_sanguineo: 'grupoSanguineo',
  nombre_emergencia: 'nombreContacto',
  telefono_emergencia: 'telefonoContacto',
  parentesco_emergencia: 'parentesco',
  tipo_usuario: 'tipoUsuario',
  id_programa: 'programa',
  numero_carnet: 'numCarnet',
  semestre: 'semestre',
  modalidad: 'modalidad',
  jornada: 'jornada',
  es_egresado: 'estado',
  id_cargo: 'cargo',
  id_area: 'area',
  acudiente_primer_nombre: 'acudientePrimerNombre',
  acudiente_primer_apellido: 'acudientePrimerApellido',
  acudiente_documento: 'acudienteDocumento',
  acudiente_tipo_documento: 'acudienteTipoDocumento',
  acudiente_telefono_contacto: 'acudienteTelefonoContacto',
}

export function mapearErroresBackend(error: unknown): Record<string, string[]> {
  const campoErrores = erroresDeCampo(error)
  const mapeo: Record<string, string[]> = {}
  for (const e of campoErrores) {
    const claveForm = CAMPO_BACKEND_A_FORM[e.campo] ?? e.campo
    mapeo[claveForm] = e.mensajes
  }
  return mapeo
}