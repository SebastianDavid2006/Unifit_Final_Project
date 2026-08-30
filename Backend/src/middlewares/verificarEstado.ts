import type { NextFunction, Request, Response } from 'express'

export function verificarEstado(rutasExceptuadas: string[] = []) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.usuario) {
      res.status(401).json({ mensaje: 'No autorizado' })
      return
    }

    if (req.usuario.estado === 'inactivo') {
      res.status(403).json({ mensaje: 'Debes completar tu registro presencial para acceder a esta sección' })
      return
    }

    if (req.usuario.estado === 'activo') {
      next()
      return
    }

    const rutaActual = req.baseUrl + req.path
    const rutaExceptuada = rutasExceptuadas.some((prefix) => rutaActual.startsWith(prefix))

    if (rutaExceptuada) {
      next()
      return
    }

    res.status(403).json({ mensaje: 'Debes completar tu registro presencial para acceder a esta sección' })
  }
}
