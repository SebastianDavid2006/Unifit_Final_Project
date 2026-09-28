import * as fs from 'fs'
import * as path from 'path'
import { prisma } from '../utils/prisma'

export type TipoDocumento = 'contrato_gym' | 'tratamiento_datos'

const NOMBRES: Record<TipoDocumento, string> = {
  contrato_gym: 'Contrato de prestación de servicios estudiantiles',
  tratamiento_datos: 'Autorización para el tratamiento de datos personales',
}

export async function listarDocumentosVigentes() {
  return prisma.documentoLegal.findMany({
    where: { estado: 'vigente' },
    orderBy: { tipo: 'asc' },
    select: {
      id_doc_legal: true,
      nombre: true,
      tipo: true,
      version: true,
      url_pdf: true,
      fecha_creacion: true,
      fecha_modificacion: true,
    },
  })
}

export async function guardarDocumento(tipo: TipoDocumento, file: Express.Multer.File) {
  const urlPdf = `/uploads/documents/${path.basename(file.path)}`
  const existente = await prisma.documentoLegal.findFirst({
    where: { tipo, estado: 'vigente' },
  })

  if (existente) {
    if (existente.url_pdf && existente.url_pdf.startsWith('/uploads/documents/')) {
      const previo = path.join(process.cwd(), 'uploads', 'documents', path.basename(existente.url_pdf))
      if (fs.existsSync(previo)) fs.unlinkSync(previo)
    }
    return prisma.documentoLegal.update({
      where: { id_doc_legal: existente.id_doc_legal },
      data: { url_pdf: urlPdf },
    })
  }

  return prisma.documentoLegal.create({
    data: { tipo, estado: 'vigente', nombre: NOMBRES[tipo], url_pdf: urlPdf },
  })
}