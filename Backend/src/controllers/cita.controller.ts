import { z } from 'zod'
import type { Request, Response } from 'express'
import { prisma } from '../utils/prisma'
import { HttpError } from '../utils/HttpError'

const crearCitaSchema = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  hora: z.string().regex(/^\d{2}:\d{2}$/),
})

export async function crearCita(req: Request, res: Response): Promise<void> {
  const parsed = crearCitaSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ mensaje: 'Datos inválidos', errores: parsed.error.flatten() })
    return
  }

  try {
    const { fecha, hora } = parsed.data
    const id_usuario = req.usuario!.id_usuario

    // Verificar que no tenga ya una cita pendiente
    const citaExistente = await prisma.agenda.findFirst({
      where: {
        id_usuario,
        tipo: 'valoracion',
        estado: 'pendiente',
      },
    })

    if (citaExistente) {
      throw new HttpError(400, 'Ya tienes una cita de valoración pendiente')
    }

    // Verificar que la fecha no sea pasada
    const fechaCita = new Date(`${fecha}T${hora}`)
    if (fechaCita < new Date()) {
      throw new HttpError(400, 'La fecha y hora de la cita no pueden ser pasadas')
    }

    const cita = await prisma.agenda.create({
      data: {
        id_usuario,
        id_creador: req.usuario!.id_usuario,
        fecha: new Date(fecha),
        hora_inicio: new Date(`1970-01-01T${hora}`),
        tipo: 'valoracion',
        estado: 'pendiente',
        observaciones: 'Cita agendada durante onboarding',
      },
    })

    res.status(201).json(cita)
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ mensaje: error.message })
      return
    }
    throw error
  }
}

export async function obtenerMiCita(req: Request, res: Response): Promise<void> {
  try {
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
  } catch (error) {
    throw error
  }
}