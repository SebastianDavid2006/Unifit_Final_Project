export type Rol = 'admin' | 'entrenador' | 'usuario'
export type TipoUsuario = 'estudiante' | 'profesor' | 'administrativo'
export type EstadoRutina = 'activa' | 'finalizada' | 'cancelada'

export interface Usuario {
  id_usuario: string
  primer_nombre: string
  segundo_nombre?: string
  primer_apellido: string
  segundo_apellido?: string
  email_contacto: string
  tipo_usuario: TipoUsuario
  rol: Rol
  estado: 'activo' | 'inactivo'
  avatar?: string
}

export interface Rutina {
  id_rutina: string
  nombre: string
  estado: EstadoRutina
  observaciones?: string
  fecha_creacion: string
}

export interface Valoracion {
  id_valoracion: string
  fecha: string
  peso: number
  estatura: number
  imc: number
  objetivo: string
}

export interface Cita {
  id_agenda: string
  fecha: string
  hora: string
  estado: 'pendiente' | 'completado' | 'cancelado' | 'no_asistio'
  observaciones?: string
}
