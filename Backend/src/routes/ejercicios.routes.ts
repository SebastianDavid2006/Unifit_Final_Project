import { Router } from 'express'
import {
  desactivarEjercicioHandler,
  getEjercicios,
  getEjercicioPorId,
  postEjercicio,
  putEjercicio,
} from '../controllers/ejercicio.controller'
import { verificarEstado } from '../middlewares/verificarEstado'
import { verificarToken } from '../middlewares/verificarToken'
import { requiereRol } from '../middlewares/requiereRol'
import { uploadMultimedia } from '../middlewares/uploadMultimedia'

const router = Router()

router.get('/ejercicios', verificarToken, verificarEstado(), requiereRol('admin', 'entrenador'), getEjercicios)
router.get('/ejercicios/:id', verificarToken, verificarEstado(), requiereRol('admin', 'entrenador'), getEjercicioPorId)

router.post(
  '/ejercicios',
  verificarToken,
  verificarEstado(),
  requiereRol('admin', 'entrenador'),
  uploadMultimedia('exercise').single('media'),
  postEjercicio,
)

router.put(
  '/ejercicios/:id',
  verificarToken,
  verificarEstado(),
  requiereRol('admin'),
  uploadMultimedia('exercise').single('media'),
  putEjercicio,
)

router.put(
  '/ejercicios/:id/desactivar',
  verificarToken,
  verificarEstado(),
  requiereRol('admin'),
  desactivarEjercicioHandler,
)

export default router
