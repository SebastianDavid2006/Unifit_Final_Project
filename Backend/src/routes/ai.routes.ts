import { Router } from 'express'
import { postGenerarRutinaIA } from '../controllers/ai.controller'
import { verificarToken } from '../middlewares/verificarToken'
import { verificarEstado } from '../middlewares/verificarEstado'
import { requiereRol } from '../middlewares/requiereRol'

const router = Router()

router.post(
  '/rutinas/generar-ia',
  verificarToken,
  verificarEstado(),
  requiereRol('admin', 'entrenador'),
  postGenerarRutinaIA,
)

export default router
