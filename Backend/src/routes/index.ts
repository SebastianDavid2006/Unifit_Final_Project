import { Router } from 'express'
import usuariosRoutes from './usuarios.routes'
import authRoutes from './auth.routes'
import catalogosRoutes from './catalogos.routes'

const router = Router()

router.use('/usuarios', usuariosRoutes)
router.use('/auth', authRoutes)
router.use(catalogosRoutes)

export default router