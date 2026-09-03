import { Router, type NextFunction, type Request, type Response } from 'express'
import {
  iniciarEnrolamientoHandler,
  registrarDesdeSensorHandler,
  obtenerHuellasPendientesHandler,
  obtenerEstadoHandler,
  listarHuellasHandler,
} from '../controllers/biometria.controller'
import { verificarToken } from '../middlewares/verificarToken'
import { verificarEstado } from '../middlewares/verificarEstado'
import { requiereRol } from '../middlewares/requiereRol'
import { requierePropiedad } from '../middlewares/requierePropiedad'
import { prisma } from '../utils/prisma'

const router = Router()

function verificarApiKey(req: Request, res: Response, next: NextFunction): void {
  const apiKey = req.headers['x-api-key']
  if (!apiKey || apiKey !== process.env.BIOMETRIA_API_KEY) {
    res.status(401).json({ mensaje: 'API key inválida' })
    return
  }
  next()
}

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

function limpiarVentanasRateLimit() {
  const now = Date.now()
  for (const [clave, ventana] of ventanasRateLimit) {
    const vivos = ventana.filter((ts) => now - ts < 60000)
    if (vivos.length === 0) ventanasRateLimit.delete(clave)
    else ventanasRateLimit.set(clave, vivos)
  }
}

setInterval(limpiarVentanasRateLimit, 60000)

router.post(
  '/biometria/enrolar',
  verificarToken,
  verificarEstado(),
  requiereRol('admin', 'entrenador'),
  rateLimit(30, 60000),
  iniciarEnrolamientoHandler,
)

router.post(
  '/biometria/registrar',
  verificarApiKey,
  rateLimit(10, 60000),
  registrarDesdeSensorHandler,
)

router.get(
  '/biometria/pendientes',
  verificarApiKey,
  rateLimit(20, 60000),
  obtenerHuellasPendientesHandler,
)

router.get(
  '/biometria/estado/:id',
  verificarToken,
  verificarEstado(),
  requierePropiedad(async (req) => {
    const huella = await prisma.huella.findUnique({
      where: { id_usuario: req.params.id as string },
      select: { id_usuario: true },
    })
    return huella?.id_usuario ?? null
  }, ['admin', 'entrenador']),
  rateLimit(60, 60000),
  obtenerEstadoHandler,
)

router.get(
  '/biometria/huellas',
  verificarToken,
  verificarEstado(),
  requiereRol('admin'),
  rateLimit(60, 60000),
  listarHuellasHandler,
)

export default router
