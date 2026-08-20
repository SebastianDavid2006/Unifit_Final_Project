import { Prisma } from '@prisma/client'
import type { Response } from 'express'

export function responderErrorPrisma(error: unknown, res: Response): boolean {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return false

  if (error.code === 'P2002') {
    res.status(409).json({ mensaje: 'El documento o correo electrónico ya está registrado' })
    return true
  }

  if (error.code === 'P2003') {
    res.status(400).json({ mensaje: 'Referencia inexistente: verifica programa, cargo o área' })
    return true
  }

  return false
}