export type PreviewMode = 'celular' | 'desktop' | 'auto'

const KEY = 'unifit_preview_mode'

export function getPreviewMode(): PreviewMode {
  const v = localStorage.getItem(KEY)
  return v === 'celular' || v === 'desktop' ? v : 'auto'
}

export function setPreviewMode(v: PreviewMode) {
  localStorage.setItem(KEY, v)
}