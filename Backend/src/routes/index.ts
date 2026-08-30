import { Router } from 'express'
import authRoutes from './auth.routes'
import catalogosRoutes from './catalogos.routes'
import ejerciciosRoutes from './ejercicios.routes'
import maquinasRoutes from './maquinas.routes'

const router = Router()

router.use('/auth', authRoutes)
router.use(catalogosRoutes)
router.use(ejerciciosRoutes)
router.use(maquinasRoutes)

export default router