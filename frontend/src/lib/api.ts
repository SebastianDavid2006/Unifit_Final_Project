import axios from 'axios'
import { cerrarSesion, getToken } from './auth'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const teniaSesion = getToken() !== null
      cerrarSesion()
      if (teniaSesion) {
        window.location.href = '/'
      }
    }
    return Promise.reject(error)
  },
)

export function mensajeError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { mensaje?: string } | undefined
    return data?.mensaje ?? 'Error inesperado'
  }
  return 'Error inesperado'
}