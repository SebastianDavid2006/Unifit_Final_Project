import { Router } from 'express'
import { getAreas, getCargos, getProgramas } from '../controllers/catalogo.controller'

const router = Router()

router.get('/programas', getProgramas)
router.get('/cargos', getCargos)
router.get('/areas', getAreas)

export default router