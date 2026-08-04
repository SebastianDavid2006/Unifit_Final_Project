import React, { createContext, useContext, useState } from 'react'
import { Usuario } from '../types'

interface AuthContextType {
  user: Usuario | null
  token: string | null
  login: (user: Usuario, token: string) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null)
  const [token, setToken] = useState<string | null>(null)

  function login(user: Usuario, token: string) {
    setUser(user)
    setToken(token)
  }

  function logout() {
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
