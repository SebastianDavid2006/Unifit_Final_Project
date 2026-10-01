// ============================================================================
// MANTENER EN SINCRONÍA con Backend/src/utils/validaciones-password.ts
// ============================================================================

export const PASSWORD_MIN = 8
export const PASSWORD_MAX = 72

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

export interface RequisitoPassword {
  id: string
  texto: string
  cumple: boolean
}

/** Checklist para mostrar en pantalla mientras el usuario escribe. */
export function requisitosPassword(v: string): RequisitoPassword[] {
  return [
    { id: 'largo', texto: `Entre ${PASSWORD_MIN} y ${PASSWORD_MAX} caracteres`, cumple: v.length >= PASSWORD_MIN && v.length <= PASSWORD_MAX },
    { id: 'minuscula', texto: 'Una letra minúscula', cumple: /[a-z]/.test(v) },
    { id: 'mayuscula', texto: 'Una letra mayúscula', cumple: /[A-Z]/.test(v) },
    { id: 'numero', texto: 'Un número', cumple: /\d/.test(v) },
    { id: 'simbolo', texto: 'Un símbolo (! @ # $ %)', cumple: /[^A-Za-z0-9]/.test(v) },
  ]
}

/** Primer error de la política de contraseña, o null si es válida. */
export function errorPasswordNueva(v: string): string | null {
  if (v.length < PASSWORD_MIN) return `La contraseña debe tener al menos ${PASSWORD_MIN} caracteres`
  if (v.length > PASSWORD_MAX) return `La contraseña no debe superar ${PASSWORD_MAX} caracteres`
  if (/\s/.test(v)) return 'La contraseña no puede contener espacios'
  if (!/[a-z]/.test(v)) return 'Debe incluir al menos una letra minúscula'
  if (!/[A-Z]/.test(v)) return 'Debe incluir al menos una letra mayúscula'
  if (!/\d/.test(v)) return 'Debe incluir al menos un número'
  if (!/[^A-Za-z0-9]/.test(v)) return 'Debe incluir al menos un símbolo (por ejemplo ! @ # $ %)'
  const minuscula = v.toLowerCase()
  if (PALABRAS_PROHIBIDAS.some(p => minuscula.includes(p)) || esSecuencia(v)) {
    return 'La contraseña es demasiado común o predecible'
  }
  return null
}

export function errorCambioPassword(actual: string, nueva: string, confirmar: string): string | null {
  if (!actual) return 'Ingresa tu contraseña actual'
  const errorNueva = errorPasswordNueva(nueva)
  if (errorNueva) return errorNueva
  if (nueva === actual) return 'La nueva contraseña debe ser distinta de la actual'
  if (nueva !== confirmar) return 'Las contraseñas no coinciden'
  return null
}
