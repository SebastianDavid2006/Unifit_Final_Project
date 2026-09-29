import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import type { UsuarioAutenticado } from '../types/express'
import { prisma } from '../utils/prisma'

type PayloadToken = UsuarioAutenticado & { iat?: number; exp?: number }

export async function verificarToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  const header = req.headers.authorization

  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ mensaje: 'No autorizado: token no proporcionado' })
    return
  }

  let payload: PayloadToken
  try {
    payload = jwt.verify(header.slice(7), process.env.JWT_SECRET!) as PayloadToken
  } catch {
    res.status(401).json({ mensaje: 'No autorizado: token inválido o expirado' })
    return
  }

  const claims = await prisma.usuario.findUnique({
    where: { id_usuario: payload.id_usuario },
    select: { rol: true, tipo_usuario: true, estado: true, debe_cambiar_password: true },
  })

  if (!claims) {
    res.status(401).json({ mensaje: 'No autorizado: usuario no existe' })
    return
  }

  req.usuario = {
    id_usuario: payload.id_usuario,
    rol: claims.rol,
    tipo_usuario: claims.tipo_usuario,
    estado: claims.estado,
    debe_cambiar_password: claims.debe_cambiar_password,
  }

  next()
}