import { api } from '@/lib/api'

export type TipoDocumento = 'contrato_gym' | 'tratamiento_datos'

export interface DocumentoLegalItem {
  id_doc_legal: string
  nombre: string | null
  tipo: TipoDocumento
  version: string | null
  url_pdf: string | null
  fecha_creacion: string
  fecha_modificacion: string
}

export async function getDocumentosVigentes(): Promise<DocumentoLegalItem[]> {
  const { data } = await api.get<DocumentoLegalItem[]>('/documentos')
  return data
}

export async function subirDocumento(tipo: TipoDocumento, file: File): Promise<DocumentoLegalItem> {
  const formData = new FormData()
  formData.append('media', file)
  const { data } = await api.post<DocumentoLegalItem>(`/documentos/${tipo}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}