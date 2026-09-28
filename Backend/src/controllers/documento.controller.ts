import type { Request, Response } from 'express'
import { guardarDocumento, listarDocumentosVigentes, type TipoDocumento } from '../services/documento.service'

const TIPOS: TipoDocumento[] = ['contrato_gym', 'tratamiento_datos']

export async function getDocumentos(_req: Request, res: Response): Promise<void> {
  res.json(await listarDocumentosVigentes())
}

export async function postDocumento(req: Request, res: Response): Promise<void> {
  const file = req.file

  if (!file) {
    res.status(400).json({ mensaje: 'El archivo PDF es obligatorio' })
    return
  }

  const { tipo } = req.params as { tipo: string }

  if (!TIPOS.includes(tipo as TipoDocumento)) {
    res.status(400).json({ mensaje: `Tipo de documento inválido. Permitidos: ${TIPOS.join(', ')}` })
    return
  }

  if (file.mimetype !== 'application/pdf') {
    res.status(400).json({ mensaje: 'Solo se permiten archivos PDF' })
    return
  }

  const doc = await guardarDocumento(tipo as TipoDocumento, file)
  res.status(200).json(doc)
}