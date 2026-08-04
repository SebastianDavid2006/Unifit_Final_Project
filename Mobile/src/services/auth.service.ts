import api from './api'
import { ENDPOINTS } from '../constants/api'

export const authService = {
  async login(email: string, password: string) {
    const { data } = await api.post(ENDPOINTS.LOGIN, { email, password })
    return data
  },

  async activate(email: string, documento: string) {
    const { data } = await api.post(ENDPOINTS.ACTIVATE, { email, documento })
    return data
  },

  async changePassword(token: string, newPassword: string) {
    const { data } = await api.post(ENDPOINTS.CHANGE_PASSWORD, { token, newPassword })
    return data
  },
}
