import { Router } from 'express'
import {
  registrar,
  getUsuarios,
  getUsuarioPorId,
  aceptarDocumentoHandler,
  marcarParqHandler,
  registrarHuellaHandler,
  desactivarUsuarioHandler,
  activarUsuarioHandler,
} from '../controllers/usuario.controller'
import { verificarToken } from '../middlewares/verificarToken'
import { verificarEstado } from '../middlewares/verificarEstado'
import { requiereRol } from '../middlewares/requiereRol'

const router = Router()

// Crear usuario (admin/entrenador)
router.post(
  '/usuarios',
  verificarToken,
  verificarEstado(),
  requiereRol('admin', 'entrenador'),
  registrar,
)

// Listar usuarios (admin/entrenador)
router.get(
  '/usuarios',
  verificarToken,
  verificarEstado(),
  requiereRol('admin', 'entrenador'),
  getUsuarios,
)

// Obtener usuario por ID (admin/entrenador)
router.get(
  '/usuarios/:id',
  verificarToken,
  verificarEstado(),
  requiereRol('admin', 'entrenador'),
  getUsuarioPorId,
)

// Aceptar documento (contrato_gym o tratamiento_datos)
router.put(
  '/usuarios/:id/aceptar-documento',
  verificarToken,
  verificarEstado(),
  requiereRol('admin', 'entrenador'),
  aceptarDocumentoHandler,
)

// Marcar PAR-Q como completado
router.put(
  '/usuarios/:id/parq',
  verificarToken,
  verificarEstado(),
  requiereRol('admin', 'entrenador'),
  marcarParqHandler,
)

// Registrar huella (temporal - endpoint manual)
router.post(
  '/usuarios/:id/huella',
  verificarToken,
  verificarEstado(),
  requiereRol('admin', 'entrenador'),
  registrarHuellaHandler,
)

// Desactivar usuario (solo admin)
router.put(
  '/usuarios/:id/desactivar',
  verificarToken,
  verificarEstado(),
  requiereRol('admin'),
  desactivarUsuarioHandler,
)

// Activar usuario (solo admin)
router.put(
  '/usuarios/:id/activar',
  verificarToken,
  verificarEstado(),
  requiereRol('admin'),
  activarUsuarioHandler,
)

export default router
