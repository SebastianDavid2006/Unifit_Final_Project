import { Router } from 'express'
import {
  desactivarValoracionHandler,
  getValoraciones,
  getValoracionPorId,
  getValoracionesPorUsuario,
  postValoracion,
  putValoracion,
} from '../controllers/valoracion.controller'
import { verificarEstado } from '../middlewares/verificarEstado'
import { verificarToken } from '../middlewares/verificarToken'
import { requiereRol } from '../middlewares/requiereRol'
import { requierePropiedad } from '../middlewares/requierePropiedad'
import { prisma } from '../utils/prisma'

const router = Router()

router.get(
  '/valoraciones',
  verificarToken,
  verificarEstado(),
  requiereRol('admin', 'entrenador'),
  getValoraciones,
)

router.get(
  '/valoraciones/usuario/:id',
  verificarToken,
  verificarEstado(),
  requierePropiedad(async (req) => {
    const valoracion = await prisma.valoracion.findFirst({
      where: { id_usuario: req.params.id as string, activo: true },
      select: { id_usuario: true },
    })
    return valoracion?.id_usuario ?? null
  }),
  getValoracionesPorUsuario,
)

router.get(
  '/valoraciones/:id',
  verificarToken,
  verificarEstado(),
  requierePropiedad(async (req) => {
    const valoracion = await prisma.valoracion.findUnique({
      where: { id_valoracion: req.params.id as string },
      select: { id_usuario: true },
    })
    return valoracion?.id_usuario ?? null
  }),
  getValoracionPorId,
)

router.post(
  '/valoraciones',
  verificarToken,
  verificarEstado(),
  requiereRol('admin', 'entrenador'),
  postValoracion,
)

router.put(
  '/valoraciones/:id',
  verificarToken,
  verificarEstado(),
  requiereRol('admin', 'entrenador'),
  putValoracion,
)

router.put(
  '/valoraciones/:id/desactivar',
  verificarToken,
  verificarEstado(),
  requiereRol('admin'),
  desactivarValoracionHandler,
)

export default router
