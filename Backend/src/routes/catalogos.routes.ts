import { Router } from 'express'
import {
  getAreas,
  getCargos,
  getProgramas,
  postArea,
  postCargo,
  putArea,
  putCargo,
  deleteArea,
  deleteCargo,
  postPrograma,
  putPrograma,
  deletePrograma,
} from '../controllers/catalogo.controller'
import { verificarToken } from '../middlewares/verificarToken'
import { verificarEstado } from '../middlewares/verificarEstado'
import { requiereRol } from '../middlewares/requiereRol'

const router = Router()

router.get('/programas', getProgramas)
router.get('/cargos', getCargos)
router.get('/areas', getAreas)

router.post('/cargos', verificarToken, verificarEstado(), requiereRol('admin'), postCargo)
router.post('/areas', verificarToken, verificarEstado(), requiereRol('admin'), postArea)

router.put('/cargos/:id', verificarToken, verificarEstado(), requiereRol('admin'), putCargo)
router.put('/areas/:id', verificarToken, verificarEstado(), requiereRol('admin'), putArea)

router.delete('/cargos/:id', verificarToken, verificarEstado(), requiereRol('admin'), deleteCargo)
router.delete('/areas/:id', verificarToken, verificarEstado(), requiereRol('admin'), deleteArea)

router.post('/programas', verificarToken, verificarEstado(), requiereRol('admin'), postPrograma)
router.put('/programas/:id', verificarToken, verificarEstado(), requiereRol('admin'), putPrograma)
router.delete('/programas/:id', verificarToken, verificarEstado(), requiereRol('admin'), deletePrograma)

export default router