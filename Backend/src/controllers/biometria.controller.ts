import { z } from 'zod'
import type { Request, Response } from 'express'
import {
  iniciarEnrolamiento,
  registrarHuellaDesdeSensor,
  obtenerHuellasPendientes,
  obtenerEstadoHuella,
  listarHuellas,
  actualizarPasoEnrolamiento,
} from '../services/biometria.service'
import { HttpError } from '../utils/HttpError'

export async function iniciarEnrolamientoHandler(req: Request, res: Response): Promise<void> {
  const schema = z.object({ id_usuario: z.string().uuid() })
  const parsed = schema.safeParse(req.body)

  if (!parsed.success) {
    res.status(400).json({ mensaje: 'Datos inválidos', errores: parsed.error.flatten() })
    return
  }

  try {
    const result = await iniciarEnrolamiento(parsed.data.id_usuario)
    res.status(201).json({ mensaje: 'Enrolamiento iniciado', ...result })
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ mensaje: error.message })
      return
    }
    throw error
  }
}

const registrarDesdeSensorSchema = z.object({
  id_usuario: z.string().uuid(),
  indice_sensor: z.number().int().positive(),
})

export async function registrarDesdeSensorHandler(req: Request, res: Response): Promise<void> {
  const parsed = registrarDesdeSensorSchema.safeParse(req.body)

  if (!parsed.success) {
    res.status(400).json({ mensaje: 'Datos inválidos', errores: parsed.error.flatten() })
    return
  }

  try {
    const { id_usuario, indice_sensor } = parsed.data
    const huella = await registrarHuellaDesdeSensor(id_usuario, indice_sensor)
    res.status(201).json({ mensaje: 'Huella registrada correctamente', huella })
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ mensaje: error.message })
      return
    }
    throw error
  }
}

export async function obtenerHuellasPendientesHandler(_req: Request, res: Response): Promise<void> {
  try {
    const pendientes = await obtenerHuellasPendientes()
    res.json(pendientes)
  } catch (error) {
    throw error
  }
}

export async function obtenerEstadoHandler(req: Request, res: Response): Promise<void> {
  const id = req.params.id as string

  try {
    const estado = await obtenerEstadoHuella(id)
    res.json(estado)
  } catch (error) {
    throw error
  }
}

export async function listarHuellasHandler(_req: Request, res: Response): Promise<void> {
  try {
    const huellas = await listarHuellas()
    res.json(huellas)
  } catch (error) {
    throw error
  }
}

const actualizarPasoSchema = z.object({
  id_usuario: z.string().uuid(),
  paso: z.number().int().min(1).max(3),
})

export async function actualizarPasoEnrolamientoHandler(req: Request, res: Response): Promise<void> {
  const parsed = actualizarPasoSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ mensaje: 'Datos inválidos', errores: parsed.error.flatten() })
    return
  }
  try {
    await actualizarPasoEnrolamiento(parsed.data.id_usuario, parsed.data.paso)
    res.json({ mensaje: 'Paso actualizado' })
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ mensaje: error.message })
      return
    }
    throw error
  }
}
