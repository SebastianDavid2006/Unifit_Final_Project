import { Router } from 'express'
import type { Request } from 'express'
import {
  desactivarRutinaHandler,
  getRutinas,
  getRutinaPorId,
  getRutinasPorUsuario,
  getSesiones,
  postRutina,
  postSesion,
  putCancelarSesion,
  putFinalizarSesion,
  putMarcarEjercicios,
  putRutina,
} from '../controllers/rutina.controller'
import { verificarEstado } from '../middlewares/verificarEstado'
import { verificarToken } from '../middlewares/verificarToken'
import { requiereRol } from '../middlewares/requiereRol'
import { requierePropiedad } from '../middlewares/requierePropiedad'
import { prisma } from '../utils/prisma'

const router = Router()

// Resolver de propiedad para las rutinas de un usuario.
const resolverDueñoRutina = async (req: Request) => {
  const rutina = await prisma.rutina.findUnique({
    where: { id_rutina: req.params.id as string },
    select: { id_usuario: true },
  })
  return rutina?.id_usuario ?? null
}

// Resolver de propiedad para una sesión: navega sesión → rutina → id_usuario.
// Responde "¿a quién pertenece?", nunca "¿existe la sesión?".
const resolverDueñoSesion = async (req: Request) => {
  const sesion = await prisma.sesionRutina.findUnique({
    where: { id_sesion: req.params.id as string },
    select: { rutina: { select: { id_usuario: true } } },
  })
  return sesion?.rutina.id_usuario ?? null
}

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
    return req.params.id as string
  }, ['admin', 'entrenador']),
  getRutinasPorUsuario,
)

router.get(
  '/rutinas/:id',
  verificarToken,
  verificarEstado(),
  requierePropiedad(resolverDueñoRutina, ['admin', 'entrenador']),
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

router.get(
  '/rutinas/:id/sesiones',
  verificarToken,
  verificarEstado(),
  requierePropiedad(resolverDueñoRutina, ['admin', 'entrenador']),
  getSesiones,
)

router.post(
  '/rutinas/:id/sesiones',
  verificarToken,
  verificarEstado(),
  requierePropiedad(resolverDueñoRutina, []),
  postSesion,
)

router.put(
  '/sesiones/:id/finalizar',
  verificarToken,
  verificarEstado(),
  requierePropiedad(resolverDueñoSesion, []),
  putFinalizarSesion,
)

router.put(
  '/sesiones/:id/cancelar',
  verificarToken,
  verificarEstado(),
  requierePropiedad(resolverDueñoSesion, []),
  putCancelarSesion,
)

router.patch(
  '/sesiones/:id/ejercicios',
  verificarToken,
  verificarEstado(),
  requierePropiedad(resolverDueñoSesion, []),
  putMarcarEjercicios,
)

export default router
