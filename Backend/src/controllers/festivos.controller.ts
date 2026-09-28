import type { Request, Response } from 'express'
import { obtenerFestivos } from '../services/festivos.service'

export async function getFestivos(req: Request, res: Response): Promise<void> {
  const anioRaw = typeof req.query.anio === 'string' ? req.query.anio.trim() : ''
  const anio = anioRaw ? parseInt(anioRaw, 10) : new Date().getFullYear()

  if (!Number.isInteger(anio) || anio < 1900 || anio > 2100) {
    res.status(400).json({ mensaje: 'Año inválido', anio: anioRaw })
    return
  }

  res.json({ anio, festivos: obtenerFestivos(anio) })
}