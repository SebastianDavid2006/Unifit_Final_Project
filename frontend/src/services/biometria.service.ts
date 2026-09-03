import { api } from '@/lib/api'

export interface HuellaEstado {
  tiene_huella: boolean
  huella: {
    id_huella: string
    indice_sensor: number
    activo: boolean
    fecha_creacion: string
  } | null
}

export interface HuellaRegistrada {
  id_huella: string
  id_usuario: string
  indice_sensor: number
  fecha_creacion: string
  usuario: {
    primer_nombre: string
    primer_apellido: string
    documento: string
    email_contacto: string
  }
}

export async function iniciarEnrolamiento(idUsuario: string): Promise<{ indice_sensor: number }> {
  const res = await api.post('/biometria/enrolar', { id_usuario: idUsuario })
  return res.data
}

export async function obtenerEstadoHuella(idUsuario: string): Promise<HuellaEstado> {
  const res = await api.get(`/biometria/estado/${idUsuario}`)
  return res.data
}

export async function listarHuellas(): Promise<HuellaRegistrada[]> {
  const res = await api.get('/biometria/huellas')
  return res.data
}
