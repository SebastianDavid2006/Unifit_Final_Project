import { Router } from 'express'
import authRoutes from './auth.routes'
import catalogosRoutes from './catalogos.routes'
import ejerciciosRoutes from './ejercicios.routes'
import maquinasRoutes from './maquinas.routes'
import usuarioRoutes from './usuario.routes'
import valoracionRoutes from './valoracion.routes'
import rutinaRoutes from './rutina.routes'
import agendaRoutes from './agenda.routes'
import aiRoutes from './ai.routes'
import biometriaRoutes from './biometria.routes'
import asistenciaRoutes from './asistencia.routes'

const router = Router()

router.use('/auth', authRoutes)
router.use(catalogosRoutes)
router.use(ejerciciosRoutes)
router.use(maquinasRoutes)
router.use(usuarioRoutes)
router.use(valoracionRoutes)
router.use(rutinaRoutes)
router.use(agendaRoutes)
router.use(aiRoutes)
router.use(biometriaRoutes)
router.use(asistenciaRoutes)

export default router