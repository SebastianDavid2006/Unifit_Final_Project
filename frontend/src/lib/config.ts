export function getBaseUrl(): string {
  const url = import.meta.env.VITE_API_URL
  if (!url) throw new Error('VITE_API_URL es requerida')
  return url.replace(/\/api$/, '')
}

export function getImageUrl(relativePath?: string): string {
  if (!relativePath) return ''
  if (relativePath.startsWith('http') || relativePath.startsWith('data:')) return relativePath
  return `${getBaseUrl()}${relativePath}`
}