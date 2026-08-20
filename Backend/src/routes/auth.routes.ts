import { Router } from 'express'
import { cambiarContrasena, iniciarSesion, registroWeb } from '../controllers/auth.controller'
import { verificarToken } from '../middlewares/verificarToken'

const router = Router()

router.post('/login', iniciarSesion)
router.post('/registro', registroWeb)
router.put('/cambiar-password', verificarToken, cambiarContrasena)

export default router