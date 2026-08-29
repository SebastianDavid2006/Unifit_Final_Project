import type { NextFunction, Request, Response } from 'express'

type ObtenerIdDueño = (req: Request) => Promise<string | null>

export function requierePropiedad(
  obtenerIdDueño: ObtenerIdDueño,
  rolesPrivilegiados: string[] = ['admin'],
) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.usuario) {
      res.status(500).json({ mensaje: 'Error de programación: req.usuario no está definido' })
      return
    }

    const idDueño = await obtenerIdDueño(req)

    if (!idDueño) {
      res.status(404).json({ mensaje: 'Recurso no encontrado' })
      return
    }

    if (req.usuario.id_usuario !== idDueño && !rolesPrivilegiados.includes(req.usuario.rol)) {
      res.status(403).json({ mensaje: 'No tienes acceso a este recurso' })
      return
    }

    next()
  }
}
