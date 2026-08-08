export type DocKey = 'contrato' | 'tratamiento' | 'parq'

export type StoredDoc = {
  fileName: string | null
  dataUrl: string | null
}

export type StoredDocs = Record<DocKey, StoredDoc>

export const DOC_ORDER: DocKey[] = ['contrato', 'tratamiento', 'parq']

export const DOC_TITLES: Record<DocKey, string> = {
  contrato: 'Contrato.pdf',
  tratamiento: 'Tratamiento de datos.pdf',
  parq: 'PAR-Q.pdf',
}

const STORAGE_KEY = 'unifit_docs_v1'

const EMPTY: StoredDocs = {
  contrato: { fileName: null, dataUrl: null },
  tratamiento: { fileName: null, dataUrl: null },
  parq: { fileName: null, dataUrl: null },
}

export function loadDocs(): StoredDocs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        const out: StoredDocs = { ...EMPTY }
        DOC_ORDER.forEach(key => {
          const item = parsed[key]
          if (item && typeof item === 'object') {
            out[key] = {
              fileName: typeof item.fileName === 'string' ? item.fileName : null,
              dataUrl: typeof item.dataUrl === 'string' ? item.dataUrl : null,
            }
          }
        })
        return out
      }
    }
  } catch { /* fallback to empty */ }
  return { ...EMPTY }
}

export function saveDoc(key: DocKey, fileName: string, dataUrl: string) {
  try {
    const docs = loadDocs()
    docs[key] = { fileName, dataUrl }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs))
  } catch { /* storage unavailable */ }
}
