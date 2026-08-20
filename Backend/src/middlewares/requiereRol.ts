import type { NextFunction, Request, Response } from 'express'
import type { Rol } from '@prisma/client'

export function requiereRol(...roles: Rol[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.usuario) {
      res.status(401).json({ mensaje: 'No autorizado' })
      return
    }

    if (!roles.includes(req.usuario.rol)) {
      res.status(403).json({ mensaje: 'No tienes permisos para realizar esta acción' })
      return
    }

    next()
  }
}