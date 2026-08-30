import { Router } from 'express'
import { cambiarContrasena, iniciarSesion, registroWeb } from '../controllers/auth.controller'
import { verificarEstado } from '../middlewares/verificarEstado'
import { verificarToken } from '../middlewares/verificarToken'

const router = Router()

router.post('/login', iniciarSesion)
router.post('/registro', registroWeb)
router.put('/cambiar-password', verificarToken, verificarEstado(), cambiarContrasena)

export default router