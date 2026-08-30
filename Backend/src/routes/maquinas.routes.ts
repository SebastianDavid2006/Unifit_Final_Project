import { Router } from 'express'
import {
  desactivarMaquinaHandler,
  getMaquinas,
  getMaquinaPorId,
  postMaquina,
  putMaquina,
} from '../controllers/maquina.controller'
import { verificarEstado } from '../middlewares/verificarEstado'
import { verificarToken } from '../middlewares/verificarToken'
import { requiereRol } from '../middlewares/requiereRol'

const router = Router()

router.get('/maquinas', verificarToken, verificarEstado(), requiereRol('admin', 'entrenador'), getMaquinas)
router.get('/maquinas/:id', verificarToken, verificarEstado(), requiereRol('admin', 'entrenador'), getMaquinaPorId)

router.post(
  '/maquinas',
  verificarToken,
  verificarEstado(),
  requiereRol('admin', 'entrenador'),
  postMaquina,
)

router.put(
  '/maquinas/:id',
  verificarToken,
  verificarEstado(),
  requiereRol('admin'),
  putMaquina,
)

router.put(
  '/maquinas/:id/desactivar',
  verificarToken,
  verificarEstado(),
  requiereRol('admin'),
  desactivarMaquinaHandler,
)

export default router
