import { Router } from 'express'
import {
  registrar,
  getUsuarios,
  getPersonal,
  getUsuarioPorId,
  getMiPerfil,
  aceptarDocumentoHandler,
  marcarParqHandler,
  registrarHuellaHandler,
  desactivarUsuarioHandler,
  activarUsuarioHandler,
  cambiarRolHandler,
  actualizarPerfilHandler,
} from '../controllers/usuario.controller'
import { verificarToken } from '../middlewares/verificarToken'
import { verificarEstado } from '../middlewares/verificarEstado'
import { requiereRol } from '../middlewares/requiereRol'
import { requierePropiedad } from '../middlewares/requierePropiedad'

const router = Router()

// Crear usuario (admin/entrenador)
router.post(
  '/usuarios',
  verificarToken,
  verificarEstado(),
  requiereRol('admin', 'entrenador'),
  registrar,
)

// Listar usuarios (admin/entrenador) - solo rol 'usuario'
router.get(
  '/usuarios',
  verificarToken,
  verificarEstado(),
  requiereRol('admin', 'entrenador'),
  getUsuarios,
)

// Listar personal (solo admin) - rol 'admin' o 'entrenador'
router.get(
  '/usuarios/personal',
  verificarToken,
  verificarEstado(),
  requiereRol('admin'),
  getPersonal,
)

// Obtener perfil propio (dueño)
router.get(
  '/usuarios/me',
  verificarToken,
  verificarEstado(),
  getMiPerfil,
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

// Cambiar rol (solo admin)
router.put(
  '/usuarios/:id/rol',
  verificarToken,
  verificarEstado(),
  requiereRol('admin'),
  cambiarRolHandler,
)

// Actualizar perfil (dueño o admin)
router.put(
  '/usuarios/:id/perfil',
  verificarToken,
  verificarEstado(),
  requierePropiedad(async (req) => req.params.id as string, ['admin']),
  actualizarPerfilHandler,
)

export default router
