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
import { uploadMultimedia } from '../middlewares/uploadMultimedia'

const router = Router()

router.get('/maquinas', verificarToken, verificarEstado(), requiereRol('admin', 'entrenador'), getMaquinas)
router.get('/maquinas/:id', verificarToken, verificarEstado(), requiereRol('admin', 'entrenador'), getMaquinaPorId)

router.post(
  '/maquinas',
  verificarToken,
  verificarEstado(),
  requiereRol('admin', 'entrenador'),
  uploadMultimedia('machine').single('media'),
  postMaquina,
)

router.put(
  '/maquinas/:id',
  verificarToken,
  verificarEstado(),
  requiereRol('admin'),
  uploadMultimedia('machine').single('media'),
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
