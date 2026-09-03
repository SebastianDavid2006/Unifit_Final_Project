import { Router } from 'express'
import {
  deleteAgenda,
  getAgenda,
  getAgendaDeUsuario,
  getAgendaPorId,
  getCuposDisponibles,
  getMiAgenda,
  postAgenda,
  postPublicarCupos,
  postReservarCupo,
  putAgenda,
  putEstadoAgenda,
} from '../controllers/agenda.controller'
import { verificarEstado } from '../middlewares/verificarEstado'
import { verificarToken } from '../middlewares/verificarToken'
import { requiereRol } from '../middlewares/requiereRol'
import { requierePropiedad } from '../middlewares/requierePropiedad'
import { prisma } from '../utils/prisma'

const router = Router()

const RUTAS_EXCEPTUADAS = ['/api/cupos/', '/api/agenda/mis-citas']

router.get(
  '/agenda',
  verificarToken,
  verificarEstado(),
  requiereRol('admin', 'entrenador'),
  getAgenda,
)

router.get(
  '/agenda/mis-citas',
  verificarToken,
  verificarEstado(RUTAS_EXCEPTUADAS),
  getMiAgenda,
)

router.get(
  '/agenda/usuario/:id',
  verificarToken,
  verificarEstado(),
  requiereRol('admin', 'entrenador'),
  getAgendaDeUsuario,
)

router.get(
  '/agenda/:id',
  verificarToken,
  verificarEstado(),
  requierePropiedad(async (req) => {
    const agenda = await prisma.agenda.findUnique({
      where: { id_agenda: req.params.id as string },
      select: { id_usuario: true },
    })
    return agenda?.id_usuario ?? null
  }, ['admin', 'entrenador']),
  getAgendaPorId,
)

router.post(
  '/agenda',
  verificarToken,
  verificarEstado(),
  requiereRol('admin', 'entrenador'),
  postAgenda,
)

router.put(
  '/agenda/:id',
  verificarToken,
  verificarEstado(),
  requiereRol('admin', 'entrenador'),
  putAgenda,
)

router.put(
  '/agenda/:id/estado',
  verificarToken,
  verificarEstado(),
  requiereRol('admin', 'entrenador'),
  putEstadoAgenda,
)

router.delete(
  '/agenda/:id',
  verificarToken,
  verificarEstado(),
  requiereRol('admin'),
  deleteAgenda,
)

router.post(
  '/cupos/publicar',
  verificarToken,
  verificarEstado(),
  requiereRol('admin'),
  postPublicarCupos,
)

router.get(
  '/cupos/disponibles',
  verificarToken,
  verificarEstado(RUTAS_EXCEPTUADAS),
  getCuposDisponibles,
)

router.post(
  '/cupos/:id/reservar',
  verificarToken,
  verificarEstado(RUTAS_EXCEPTUADAS),
  postReservarCupo,
)

export default router
