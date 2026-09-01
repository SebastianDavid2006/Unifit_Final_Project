import { Router } from 'express'
import authRoutes from './auth.routes'
import catalogosRoutes from './catalogos.routes'
import ejerciciosRoutes from './ejercicios.routes'
import maquinasRoutes from './maquinas.routes'
import usuarioRoutes from './usuario.routes'
import valoracionRoutes from './valoracion.routes'

const router = Router()

router.use('/auth', authRoutes)
router.use(catalogosRoutes)
router.use(ejerciciosRoutes)
router.use(maquinasRoutes)
router.use(usuarioRoutes)
router.use(valoracionRoutes)

export default router