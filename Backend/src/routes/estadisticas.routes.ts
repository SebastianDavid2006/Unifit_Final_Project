import { Router, type NextFunction, type Request, type Response } from 'express'
import { estadisticasHandler } from '../controllers/estadisticas.controller'
import { verificarToken } from '../middlewares/verificarToken'
import { verificarEstado } from '../middlewares/verificarEstado'
import { requiereRol } from '../middlewares/requiereRol'

const router = Router()

const ventanasRateLimit = new Map<string, number[]>()

function rateLimit(maxRequests: number, ventanaMs: number) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const clave = (req.ip ?? 'desconocido') + ':' + req.path
    const now = Date.now()
    const ventana = (ventanasRateLimit.get(clave) ?? []).filter((ts) => now - ts < ventanaMs)

    if (ventana.length >= maxRequests) {
      res.status(429).json({ mensaje: 'Demasiadas peticiones. Intente más tarde.' })
      return
    }

    ventana.push(now)
    ventanasRateLimit.set(clave, ventana)
    next()
  }
}

setInterval(() => {
  const now = Date.now()
  for (const [clave, ventana] of ventanasRateLimit) {
    const vivos = ventana.filter((ts) => now - ts < 60000)
    if (vivos.length === 0) ventanasRateLimit.delete(clave)
    else ventanasRateLimit.set(clave, vivos)
  }
}, 60000)

router.get(
  '/estadisticas',
  verificarToken,
  verificarEstado(),
  requiereRol('admin', 'entrenador'),
  rateLimit(60, 60000),
  estadisticasHandler,
)

export default router