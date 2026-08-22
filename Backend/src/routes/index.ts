import { Router } from 'express'
import authRoutes from './auth.routes'
import catalogosRoutes from './catalogos.routes'

const router = Router()

router.use('/auth', authRoutes)
router.use(catalogosRoutes)

export default router