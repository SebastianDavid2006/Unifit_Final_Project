import { z } from 'zod'

/**
 * Política de contraseñas. El límite superior es 72 porque bcrypt ignora todo
 * lo que sigue a ese byte: aceptar más daría una falsa sensación de seguridad.
 */
export const PASSWORD_MIN = 8
export const PASSWORD_MAX = 72

// Contraseñas triviales que cumplen mayúscula/minúscula/número por casualidad.
const PALABRAS_PROHIBIDAS = ['password', 'contrasena', 'contraseña', 'unifit', 'qwerty', 'admin', 'abcd1234', '12345678']

function esSecuencia(valor: string): boolean {
  const s = valor.toLowerCase()
  if (/^(.)\1+$/.test(s)) return true
  const cadena = 'abcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i + 5 <= cadena.length; i++) {
    const tramo = cadena.slice(i, i + 5)
    if (s.includes(tramo) || s.includes([...tramo].reverse().join(''))) return true
  }
  return false
}

export const passwordNuevaSchema = z.string().superRefine((v, ctx) => {
  const falla = (message: string) => ctx.addIssue({ code: 'custom', message })

  if (v.length < PASSWORD_MIN) return falla(`La contraseña debe tener al menos ${PASSWORD_MIN} caracteres`)
  if (v.length > PASSWORD_MAX) return falla(`La contraseña no debe superar ${PASSWORD_MAX} caracteres`)
  if (/\s/.test(v)) return falla('La contraseña no puede contener espacios')
  if (!/[a-z]/.test(v)) return falla('Debe incluir al menos una letra minúscula')
  if (!/[A-Z]/.test(v)) return falla('Debe incluir al menos una letra mayúscula')
  if (!/\d/.test(v)) return falla('Debe incluir al menos un número')
  if (!/[^A-Za-z0-9]/.test(v)) return falla('Debe incluir al menos un símbolo (por ejemplo ! @ # $ %)')
  const minuscula = v.toLowerCase()
  if (PALABRAS_PROHIBIDAS.some((p) => minuscula.includes(p)) || esSecuencia(v)) {
    return falla('La contraseña es demasiado común o predecible')
  }
})
