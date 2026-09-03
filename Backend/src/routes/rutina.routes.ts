import { Router } from 'express'
import {
  desactivarRutinaHandler,
  getRutinas,
  getRutinaPorId,
  getRutinasPorUsuario,
  postRutina,
  putRutina,
} from '../controllers/rutina.controller'
import { verificarEstado } from '../middlewares/verificarEstado'
import { verificarToken } from '../middlewares/verificarToken'
import { requiereRol } from '../middlewares/requiereRol'
import { requierePropiedad } from '../middlewares/requierePropiedad'
import { prisma } from '../utils/prisma'

const router = Router()

router.get(
  '/rutinas',
  verificarToken,
  verificarEstado(),
  requiereRol('admin', 'entrenador'),
  getRutinas,
)

router.get(
  '/rutinas/usuario/:id',
  verificarToken,
  verificarEstado(),
  requierePropiedad(async (req) => {
    const rutina = await prisma.rutina.findFirst({
      where: { id_usuario: req.params.id as string, estado: 'activa' },
      select: { id_usuario: true },
    })
    return rutina?.id_usuario ?? null
  }, ['admin', 'entrenador']),
  getRutinasPorUsuario,
)

router.get(
  '/rutinas/:id',
  verificarToken,
  verificarEstado(),
  requierePropiedad(async (req) => {
    const rutina = await prisma.rutina.findUnique({
      where: { id_rutina: req.params.id as string },
      select: { id_usuario: true },
    })
    return rutina?.id_usuario ?? null
  }, ['admin', 'entrenador']),
  getRutinaPorId,
)

router.post(
  '/rutinas',
  verificarToken,
  verificarEstado(),
  requiereRol('admin', 'entrenador'),
  postRutina,
)

router.put(
  '/rutinas/:id',
  verificarToken,
  verificarEstado(),
  requiereRol('admin', 'entrenador'),
  putRutina,
)

router.put(
  '/rutinas/:id/desactivar',
  verificarToken,
  verificarEstado(),
  requiereRol('admin', 'entrenador'),
  desactivarRutinaHandler,
)

export default router
