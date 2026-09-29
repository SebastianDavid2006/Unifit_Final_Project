import type { Request, Response } from 'express'
import { prisma } from '../utils/prisma'

export async function obtenerMiCita(req: Request, res: Response): Promise<void> {
  const id_usuario = req.usuario!.id_usuario

  const cita = await prisma.agenda.findFirst({
    where: {
      id_usuario,
      tipo: 'valoracion',
      estado: 'pendiente',
    },
    orderBy: { fecha: 'asc' },
  })

  if (!cita) {
    res.status(404).json({ mensaje: 'No tienes una cita de valoración pendiente' })
    return
  }

  res.json(cita)
}