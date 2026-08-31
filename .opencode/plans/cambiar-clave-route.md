# Plan: Reemplazar olvido-clave por cambiar-clave

## Archivo: Frontend/src/app/App.tsx

### Cambio 1: Import (linea 5)
```
- import { ForgotPasswordPage } from '@/auth/pages/ForgotPasswordPage'
+ import { ChangePasswordPage } from '@/auth/pages/ChangePasswordPage'
```

### Cambio 2: Reemplazar ForgotPasswordWrapper (lineas 75-78) por ChangePasswordWrapper
```tsx
function ChangePasswordWrapper() {
  const navigate = useNavigate()
  const session = JSON.parse(sessionStorage.getItem('loginSession') || 'null') as LoginSession | null
  if (!session) return <Navigate to="/login" replace />

  return (
    <ChangePasswordPage
      email={session.user.email}
      onSuccess={() => {
        if (session.user.rol === 'admin') navigate('/admin/dashboard')
        else if (session.user.rol === 'entrenador') navigate('/entrenador/dashboard')
        else navigate('/usuario/inicio')
      }}
      onBack={() => { sessionStorage.removeItem('loginSession'); navigate('/login') }}
    />
  )
}
```

### Cambio 3: Agregar check de debeCambiarContrasena en LoginPageWrapper (lineas 47-62)
Reemplazar el bloque completo de navegacion por:
```tsx
onSelect={(platform, session) => {
  if (session) {
    setSession(session)
    sessionStorage.setItem('loginSession', JSON.stringify(session))
    if (session.user.debeCambiarContrasena) {
      navigate('/cambiar-clave')
    } else if (session.user.estado === 'pendiente') {
      navigate('/usuario/onboarding')
    } else if (platform === 'student') {
      navigate('/usuario/inicio')
    } else if (platform === 'trainer') {
      navigate('/entrenador/dashboard')
    } else if (platform === 'admin') {
      navigate('/admin/dashboard')
    }
  }
}}
```

### Cambio 4: Reemplazar ruta (linea 135)
```
- <Route path="/olvido-clave" element={<ForgotPasswordWrapper />} />
+ <Route path="/cambiar-clave" element={<ChangePasswordWrapper />} />
```

### Cambio 5: Actualizar AUTH_ROUTES (linea 107)
```
- const AUTH_ROUTES = ['/login', '/registro', '/olvido-clave', '/usuario/onboarding']
+ const AUTH_ROUTES = ['/login', '/registro', '/cambiar-clave', '/usuario/onboarding']
```
