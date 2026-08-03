// Servicio de almacenamiento — hoy usa Cloudinary via backend
// Si cambian de proveedor, solo cambia el backend, no este archivo

import api from './api'

export const storageService = {
  async uploadFile(uri: string, type: string, name: string) {
    const formData = new FormData()
    formData.append('file', { uri, type, name } as any)
    const { data } = await api.post('/storage/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.url as string
  },
}
