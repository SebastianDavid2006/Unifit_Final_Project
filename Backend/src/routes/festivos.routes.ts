import { Router } from 'express'
import { getFestivos } from '../controllers/festivos.controller'
import { verificarEstado } from '../middlewares/verificarEstado'
import { verificarToken } from '../middlewares/verificarToken'

const router = Router()

router.get(
  '/festivos',
  verificarToken,
  verificarEstado(['/api/festivos']),
  getFestivos,
)

export default router