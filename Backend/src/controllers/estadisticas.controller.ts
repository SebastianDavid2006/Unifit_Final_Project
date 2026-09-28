import { z } from 'zod'
import type { Request, Response } from 'express'
import { obtenerEstadisticas } from '../services/estadisticas.service'

const estadisticasSchema = z.object({
  fecha_inicio: z.string().datetime().optional(),
  fecha_fin: z.string().datetime().optional(),
})

export async function estadisticasHandler(req: Request, res: Response): Promise<void> {
  const parsed = estadisticasSchema.safeParse(req.query)

  if (!parsed.success) {
    res.status(400).json({ mensaje: 'Parámetros inválidos', errores: parsed.error.flatten() })
    return
  }

  const fecha_inicio = parsed.data.fecha_inicio ? new Date(parsed.data.fecha_inicio) : undefined
  const fecha_fin = parsed.data.fecha_fin ? new Date(parsed.data.fecha_fin) : undefined

  if (fecha_inicio && fecha_fin && fecha_inicio.getTime() > fecha_fin.getTime()) {
    res.status(400).json({ mensaje: 'fecha_inicio no puede ser posterior a fecha_fin' })
    return
  }

  const estadisticas = await obtenerEstadisticas(fecha_inicio, fecha_fin)
  res.json(estadisticas)
}