import type { Request, Response } from 'express'
import { prisma } from '../utils/prisma'
import { citaVigente } from '../utils/cita-vigencia'

export async function obtenerMiCita(req: Request, res: Response): Promise<void> {
  const id_usuario = req.usuario!.id_usuario

  // El estado de la cita cambia (caduca, se reagenda): un 410 cacheado por el navegador
  // seguía devolviéndose aun después de reservar una cita nueva.
  res.set('Cache-Control', 'no-store')

  const pendientes = await prisma.agenda.findMany({
    where: { id_usuario, estado: 'pendiente' },
    orderBy: [{ fecha: 'asc' }, { hora_inicio: 'asc' }],
  })

  const vigente = pendientes.find(citaVigente)

  if (vigente) {
    res.json(vigente)
    return
  }

  // Tenía cita pendiente pero ya venció: el cliente debe distinguirlo de "sin cita"
  if (pendientes.length > 0) {
    res.status(410).json({ mensaje: 'Tu cita caducó. Debes agendar nuevamente.' })
    return
  }

  res.status(404).json({ mensaje: 'No tienes una cita pendiente' })
}
