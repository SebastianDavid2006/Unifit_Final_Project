import type { Rol, TipoUsuario, EstadoUsuario } from '@prisma/client'

export interface UsuarioAutenticado {
  id_usuario: string
  rol: Rol
  tipo_usuario: TipoUsuario
  estado: EstadoUsuario
  debe_cambiar_password: boolean
}

declare global {
  namespace Express {
    interface Request {
      usuario?: UsuarioAutenticado
    }
  }
}