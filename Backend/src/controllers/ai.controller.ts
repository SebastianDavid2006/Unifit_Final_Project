import { z } from 'zod'
import type { Request, Response } from 'express'
import { generarRutinaIA } from '../services/ai.service'

const generarRutinaSchema = z.object({
  nivelActividad: z.string().optional().default(''),
  objetivoTarjetas: z.array(z.string()).optional().default([]),
  objetivoDetalle: z.string().optional().default(''),
  peso: z.string().optional().default(''),
  estatura: z.string().optional().default(''),
  imc: z.string().optional().default(''),
  grasaCorporal: z.string().optional().default(''),
  masaMuscular: z.string().optional().default(''),
  presionArterial: z.string().optional().default(''),
  resistenciaMuscular: z.string().optional().default(''),
  antecedentesSalud: z.array(z.string()).optional().default([]),
  observacionesEntrenador: z.string().optional().default(''),
  diasDisponibles: z.array(z.string()).optional().default([]),
  observacionesFinales: z.string().optional().default(''),
})

export async function postGenerarRutinaIA(req: Request, res: Response): Promise<void> {
  const parsed = generarRutinaSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ mensaje: 'Datos inválidos', errores: parsed.error.flatten() })
    return
  }

  try {
    const rutina = await generarRutinaIA(parsed.data)
    res.json(rutina)
  } catch (error) {
    const status = (error as { status?: number }).status
    if (status && status >= 400 && status < 600) {
      res.status(status).json({ mensaje: (error as Error).message })
      return
    }
    throw error
  }
}
