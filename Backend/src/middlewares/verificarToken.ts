import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import type { UsuarioAutenticado } from '../types/express'

type PayloadToken = UsuarioAutenticado & { iat?: number; exp?: number }

export function verificarToken(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization

  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ mensaje: 'No autorizado: token no proporcionado' })
    return
  }

  try {
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET!) as PayloadToken

    req.usuario = {
      id_usuario: payload.id_usuario,
      rol: payload.rol,
      tipo_usuario: payload.tipo_usuario,
      estado: payload.estado,
      debe_cambiar_password: payload.debe_cambiar_password,
    }

    next()
  } catch {
    res.status(401).json({ mensaje: 'No autorizado: token inválido o expirado' })
  }
}