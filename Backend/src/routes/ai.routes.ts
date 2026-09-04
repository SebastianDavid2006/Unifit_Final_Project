import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { postGenerarRutinaIA } from '../controllers/ai.controller'
import { verificarToken } from '../middlewares/verificarToken'
import { verificarEstado } from '../middlewares/verificarEstado'
import { requiereRol } from '../middlewares/requiereRol'

const router = Router()

const ventanasRateLimit = new Map<string, { count: number; ventanaInicio: number }>()
const LIMITE_POR_MINUTO = 10
const DURACION_VENTANA_MS = 60_000

function rateLimitIa(req: Request, res: Response, next: NextFunction): void {
  const raw = req as unknown as Record<string, unknown>
  const usuario = raw.usuario as { id_usuario?: string } | undefined
  const id = usuario?.id_usuario ?? req.ip ?? 'anon'
  const ahora = Date.now()
  const registro = ventanasRateLimit.get(id)

  if (!registro || ahora - registro.ventanaInicio > DURACION_VENTANA_MS) {
    ventanasRateLimit.set(id, { count: 1, ventanaInicio: ahora })
    next()
    return
  }

  if (registro.count >= LIMITE_POR_MINUTO) {
    res.status(429).json({ mensaje: 'Límite de llamadas a IA excedido. Intente de nuevo en un minuto.' })
    return
  }

  registro.count++
  next()
}

router.post(
  '/rutinas/generar-ia',
  verificarToken,
  verificarEstado(),
  requiereRol('admin', 'entrenador'),
  rateLimitIa,
  postGenerarRutinaIA,
)

export default router
