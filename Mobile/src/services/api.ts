import axios from 'axios'
import { API_URL } from '../constants/api'

const api = axios.create({ baseURL: API_URL })

// Agrega el token JWT a cada request automáticamente
api.interceptors.request.use((config) => {
  // Token se inyecta desde AuthContext
  return config
})

export default api
