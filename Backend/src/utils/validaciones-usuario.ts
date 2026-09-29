import { z } from 'zod'
import { TipoDocumento } from '@prisma/client'

/**
 * Validaciones compartidas entre el registro de usuarios y la actualización de
 * perfil. Centralizadas aquí para que la regla de edad y el formato de documento
 * no puedan divergir entre ambos endpoints.
 */

export const DOC_REGEX: Record<TipoDocumento, RegExp> = {
  CC: /^\d{7,10}$/,
  TI: /^\d{10,11}$/,
  CE: /^\d{6,10}$/,
  PA: /^[A-Za-z0-9]{6,9}$/,
  RC: /^\d{10,12}$/,
}

export const nombreSchema = z
  .string()
  .trim()
  .min(2, 'Muy corto')
  .max(50, 'Muy largo')
  .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s-]+$/, 'Solo letras, espacios y guiones')
  .refine((val) => !/(.)\1{3,}/.test(val), 'Valor no válido')

export const telefonoSchema = z
  .string()
  .superRefine((v, ctx) => {
    if (v.length > 10) {
      ctx.addIssue({ code: 'custom', message: 'El teléfono no debe superar los 10 dígitos' })
      return
    }
    if (!/^\d{10}$/.test(v)) {
      ctx.addIssue({ code: 'custom', message: 'Teléfono debe tener 10 dígitos' })
      return
    }
    if (!v.startsWith('3')) {
      ctx.addIssue({ code: 'custom', message: 'Teléfono debe iniciar con 3' })
      return
    }
    if (/^(\d)\1{9}$/.test(v) || /^(0123456789|1234567890|9876543210)$/.test(v)) {
      ctx.addIssue({ code: 'custom', message: 'Teléfono no válido' })
    }
  })

export const RANGO_EDAD_ESTUDIANTE = { min: 15, max: 70 }
export const RANGO_EDAD_STAFF = { min: 18, max: 70 }

export function calcularEdad(fecha: Date): number {
  const hoy = new Date()
  let edad = hoy.getFullYear() - fecha.getFullYear()
  const mes = hoy.getMonth() - fecha.getMonth()
  if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) edad--
  return edad
}

export function esStaff(rol?: string | null): boolean {
  return rol === 'admin' || rol === 'entrenador'
}

/** Valida la edad contra el rango del rol y agrega issues al ctx de zod. */
export function validarEdad(
  fechaNacimiento: Date,
  rol: string | null | undefined,
  ctx: z.RefinementCtx,
  path: (string | number)[],
): void {
  const edad = calcularEdad(fechaNacimiento)
  const { min, max } = esStaff(rol) ? RANGO_EDAD_STAFF : RANGO_EDAD_ESTUDIANTE

  if (esStaff(rol) && edad < RANGO_EDAD_STAFF.min) {
    ctx.addIssue({ code: 'custom', path, message: 'Staff debe ser mayor de 18 años' })
    return
  }
  if (edad < min) {
    ctx.addIssue({ code: 'custom', path, message: `Edad válida solo entre ${min} y ${max} años` })
    return
  }
  if (edad > max) {
    ctx.addIssue({ code: 'custom', path, message: `Edad válida solo entre ${min} y ${max} años` })
  }
}

/** Valida el formato del documento según su tipo. */
export function validarDocumento(
  documento: string,
  tipoDocumento: TipoDocumento,
  ctx: z.RefinementCtx,
  path: (string | number)[],
): void {
  const regex = DOC_REGEX[tipoDocumento]
  if (regex && !regex.test(documento)) {
    ctx.addIssue({ code: 'custom', path, message: `Formato de documento inválido para ${tipoDocumento}` })
  }
}
