import { Router } from 'express'
import { getDocumentos, postDocumento } from '../controllers/documento.controller'
import { verificarToken } from '../middlewares/verificarToken'
import { verificarEstado } from '../middlewares/verificarEstado'
import { requiereRol } from '../middlewares/requiereRol'
import { uploadDocumento } from '../middlewares/uploadDocumento'

const router = Router()

// Listar documentos legales vigentes (cualquier usuario autenticado)
router.get('/documentos', verificarToken, verificarEstado(), getDocumentos)

// Subir/reemplazar PDF de un documento legal (admin/entrenador)
router.post(
  '/documentos/:tipo',
  verificarToken,
  verificarEstado(),
  requiereRol('admin', 'entrenador'),
  uploadDocumento.single('media'),
  postDocumento,
)

export default router