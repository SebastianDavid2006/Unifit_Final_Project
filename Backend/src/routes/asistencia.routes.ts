import { Router, type NextFunction, type Request, type Response } from 'express'
import {
  registrarSensorHandler,
  listarAsistenciasHandler,
  historialUsuarioHandler,
  historialPropioHandler,
  resumenSemanaHandler,
  evolucionHandler,
  actualizarAsistenciaHandler,
} from '../controllers/asistencia.controller'
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
  '/asistencia/sensor',
  verificarApiKey,
  rateLimit(60, 60000),
  registrarSensorHandler,
)

router.get(
  '/asistencia/usuario/me',
  verificarToken,
  verificarEstado(),
  rateLimit(60, 60000),
  historialPropioHandler,
)

router.get(
  '/asistencia/usuario/:id',
  verificarToken,
  verificarEstado(),
  requierePropiedad(async (req) => {
    return req.params.id as string
  }, ['admin', 'entrenador']),
  rateLimit(60, 60000),
  historialUsuarioHandler,
)

router.get(
  '/asistencia',
  verificarToken,
  verificarEstado(),
  requiereRol('admin', 'entrenador'),
  rateLimit(60, 60000),
  listarAsistenciasHandler,
)

router.get(
  '/asistencia/resumen/semana',
  verificarToken,
  verificarEstado(),
  requiereRol('admin', 'entrenador'),
  rateLimit(60, 60000),
  resumenSemanaHandler,
)

router.get(
  '/asistencia/evolucion',
  verificarToken,
  verificarEstado(),
  requiereRol('admin', 'entrenador'),
  rateLimit(60, 60000),
  evolucionHandler,
)

router.patch(
  '/asistencia/:id',
  verificarToken,
  verificarEstado(),
  requiereRol('admin'),
  rateLimit(30, 60000),
  actualizarAsistenciaHandler,
)

export default router