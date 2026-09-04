import { z } from 'zod'
import type { Request, Response } from 'express'
import {
  registrarDesdeSensor,
  listarAsistencias,
  obtenerHistorialUsuario,
  obtenerResumenSemana,
  obtenerEvolucion,
  actualizarAsistencia,
} from '../services/asistencia.service'
import { HttpError } from '../utils/HttpError'

const sensorSchema = z.object({
  indice_sensor: z.number().int().positive(),
})

export async function registrarSensorHandler(req: Request, res: Response): Promise<void> {
  const parsed = sensorSchema.safeParse(req.body)

  if (!parsed.success) {
    res.status(400).json({ mensaje: 'Datos inválidos', errores: parsed.error.flatten() })
    return
  }

  try {
    const resultado = await registrarDesdeSensor(parsed.data.indice_sensor)
    res.status(201).json({
      mensaje: `Asistencia registrada: ${resultado.tipo}`,
      ...resultado,
    })
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ mensaje: error.message })
      return
    }
    throw error
  }
}

const listarSchema = z.object({
  id_usuario: z.string().uuid().optional(),
  fecha_desde: z.string().datetime().optional(),
  fecha_hasta: z.string().datetime().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
})

export async function listarAsistenciasHandler(req: Request, res: Response): Promise<void> {
  const parsed = listarSchema.safeParse(req.query)

  if (!parsed.success) {
    res.status(400).json({ mensaje: 'Parámetros inválidos', errores: parsed.error.flatten() })
    return
  }

  const { id_usuario, fecha_desde, fecha_hasta, page, pageSize } = parsed.data

  try {
    const resultado = await listarAsistencias({
      id_usuario,
      fecha_desde: fecha_desde ? new Date(fecha_desde) : undefined,
      fecha_hasta: fecha_hasta ? new Date(fecha_hasta) : undefined,
      page,
      pageSize,
    })
    res.json(resultado)
  } catch (error) {
    throw error
  }
}

export async function historialUsuarioHandler(req: Request, res: Response): Promise<void> {
  const id = req.params.id as string

  const schema = z.object({
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(100).default(20),
  })

  const parsed = schema.safeParse(req.query)

  if (!parsed.success) {
    res.status(400).json({ mensaje: 'Parámetros inválidos', errores: parsed.error.flatten() })
    return
  }

  try {
    const resultado = await obtenerHistorialUsuario(id, parsed.data.page, parsed.data.pageSize)
    res.json(resultado)
  } catch (error) {
    throw error
  }
}

const resumenSemanaSchema = z.object({
  fecha_inicio: z.string().datetime(),
  fecha_fin: z.string().datetime(),
})

export async function resumenSemanaHandler(req: Request, res: Response): Promise<void> {
  const parsed = resumenSemanaSchema.safeParse(req.query)

  if (!parsed.success) {
    res.status(400).json({ mensaje: 'Parámetros inválidos', errores: parsed.error.flatten() })
    return
  }

  try {
    const resumen = await obtenerResumenSemana(
      new Date(parsed.data.fecha_inicio),
      new Date(parsed.data.fecha_fin)
    )
    res.json(resumen)
  } catch (error) {
    throw error
  }
}

const evolucionSchema = z.object({
  fecha_inicio: z.string().datetime(),
  fecha_fin: z.string().datetime(),
  agrupacion: z.enum(['dia', 'semana', 'mes']).default('dia'),
})

export async function evolucionHandler(req: Request, res: Response): Promise<void> {
  const parsed = evolucionSchema.safeParse(req.query)

  if (!parsed.success) {
    res.status(400).json({ mensaje: 'Parámetros inválidos', errores: parsed.error.flatten() })
    return
  }

  try {
    const evolucion = await obtenerEvolucion(
      new Date(parsed.data.fecha_inicio),
      new Date(parsed.data.fecha_fin),
      parsed.data.agrupacion
    )
    res.json(evolucion)
  } catch (error) {
    throw error
  }
}

const actualizarSchema = z.object({
  hora_ingreso: z.string().datetime().optional(),
  hora_salida: z.string().datetime().optional(),
  duracion_minutos: z.number().int().positive().optional(),
  observaciones: z.string().optional(),
})

export async function actualizarAsistenciaHandler(req: Request, res: Response): Promise<void> {
  const id = req.params.id as string
  const parsed = actualizarSchema.safeParse(req.body)

  if (!parsed.success) {
    res.status(400).json({ mensaje: 'Datos inválidos', errores: parsed.error.flatten() })
    return
  }

  try {
    const data: Record<string, any> = {}
    if (parsed.data.hora_ingreso) data.hora_ingreso = new Date(parsed.data.hora_ingreso)
    if (parsed.data.hora_salida) data.hora_salida = new Date(parsed.data.hora_salida)
    if (parsed.data.duracion_minutos) data.duracion_minutos = parsed.data.duracion_minutos
    if (parsed.data.observaciones) data.observaciones = parsed.data.observaciones

    const actualizada = await actualizarAsistencia(id, data)
    res.json({ mensaje: 'Asistencia actualizada', asistencia: actualizada })
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ mensaje: error.message })
      return
    }
    throw error
  }
}