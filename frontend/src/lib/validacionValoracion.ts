// ============================================================================
// MANTENER EN SINCRONÍA con Backend/src/utils/validaciones-valoracion.ts
// Los valores del formulario son strings; aquí se validan antes de enviarlos.
// ============================================================================

import type { ValuationForm } from '@/modules/students/StudentProfileData'

export const MAX_TEXTO_CORTO = 500
export const MAX_TEXTO_LARGO = 1000
export const TOLERANCIA_IMC = 2

interface Rango { min: number; max: number; etiqueta: string; entero?: boolean }

export const CAMPOS_MEDIDAS: Record<string, Rango> = {
  peso: { min: 20, max: 300, etiqueta: 'El peso' },
  estatura: { min: 100, max: 250, etiqueta: 'La estatura' },
  imc: { min: 10, max: 60, etiqueta: 'El IMC' },
  grasaCorporal: { min: 2, max: 70, etiqueta: 'La grasa corporal' },
  masaMuscular: { min: 5, max: 150, etiqueta: 'La masa muscular' },
  masaMagra: { min: 10, max: 250, etiqueta: 'La masa magra' },
  grasaVisceral: { min: 1, max: 59, etiqueta: 'La grasa visceral', entero: true },
}

export const CAMPOS_CLINICOS: Record<string, Rango> = {
  edadMetabolica: { min: 10, max: 99, etiqueta: 'La edad metabólica', entero: true },
  aguaCorporal: { min: 20, max: 80, etiqueta: 'El agua corporal' },
  resistenciaMuscular: { min: 1, max: 300, etiqueta: 'La resistencia muscular' },
}

const SISTOLICA = { min: 70, max: 250 }
const DIASTOLICA = { min: 40, max: 150 }

export type ErroresValoracion = Record<string, string>

function errorRango(raw: string, r: Rango): string | null {
  if (!raw.trim()) return `${r.etiqueta}: ingresa un valor`
  const n = Number(raw)
  if (!Number.isFinite(n)) return `${r.etiqueta} no es válido`
  if (r.entero && !Number.isInteger(n)) return `${r.etiqueta} debe ser un número entero`
  if (n < r.min || n > r.max) return `${r.etiqueta} debe estar entre ${r.min} y ${r.max}`
  return null
}

const valorDe = (form: ValuationForm, k: string) => String((form as unknown as Record<string, unknown>)[k] ?? '')

function validarPaso1(form: ValuationForm): ErroresValoracion {
  const e: ErroresValoracion = {}
  if (!form.nivelActividad) e.nivelActividad = 'Selecciona el nivel de actividad'
  if (form.objetivoTarjetas.length === 0) e.objetivoTarjetas = 'Selecciona al menos un objetivo'
  const detalle = form.objetivoDetalle.trim()
  if (form.objetivoTarjetas.includes('Otro') && !detalle) e.objetivoDetalle = 'Describe el objetivo cuando eliges "Otro"'
  else if (detalle.length > MAX_TEXTO_CORTO) e.objetivoDetalle = `No debe superar ${MAX_TEXTO_CORTO} caracteres`
  return e
}

// Las medidas son obligatorias: se exigen todos los campos.
function validarPaso2(form: ValuationForm): ErroresValoracion {
  const e: ErroresValoracion = {}
  const claves = Object.keys(CAMPOS_MEDIDAS)
  for (const k of claves) {
    const msg = errorRango(valorDe(form, k), CAMPOS_MEDIDAS[k])
    if (msg) e[k] = msg
  }
  if (!e.peso && !e.estatura && !e.imc) {
    const peso = Number(form.peso)
    const metros = Number(form.estatura) / 100
    const calculado = peso / (metros * metros)
    if (Math.abs(calculado - Number(form.imc)) > TOLERANCIA_IMC) {
      e.imc = `El IMC no coincide con el peso y la estatura (debería rondar ${calculado.toFixed(1)})`
    }
  }
  if (!e.peso) {
    if (!e.masaMagra && Number(form.masaMagra) > Number(form.peso)) e.masaMagra = 'La masa magra no puede superar el peso'
    if (!e.masaMuscular && Number(form.masaMuscular) > Number(form.peso)) e.masaMuscular = 'La masa muscular no puede superar el peso'
  }
  return e
}

export function errorPresionArterial(raw: string): string | null {
  const v = raw.trim()
  if (!v) return 'La presión arterial es requerida'
  const m = /^(\d{2,3})\/(\d{2,3})$/.exec(v)
  if (!m) return 'Usa el formato sistólica/diastólica, por ejemplo 120/80'
  const sis = Number(m[1])
  const dia = Number(m[2])
  if (sis < SISTOLICA.min || sis > SISTOLICA.max || dia < DIASTOLICA.min || dia > DIASTOLICA.max) {
    return `Presión fuera de rango (sistólica ${SISTOLICA.min}–${SISTOLICA.max}, diastólica ${DIASTOLICA.min}–${DIASTOLICA.max})`
  }
  if (sis <= dia) return 'La sistólica debe ser mayor que la diastólica'
  return null
}

function validarPaso3(form: ValuationForm): ErroresValoracion {
  const e: ErroresValoracion = {}
  const presion = errorPresionArterial(form.presionArterial)
  if (presion) e.presionArterial = presion
  for (const k of Object.keys(CAMPOS_CLINICOS)) {
    const msg = errorRango(valorDe(form, k), CAMPOS_CLINICOS[k])
    if (msg) e[k] = msg
  }
  return e
}

function validarPaso4(form: ValuationForm): ErroresValoracion {
  if (form.observacionesEntrenador.trim().length > MAX_TEXTO_LARGO) {
    return { observacionesEntrenador: `No debe superar ${MAX_TEXTO_LARGO} caracteres` }
  }
  return {}
}

function validarPaso5(form: ValuationForm): ErroresValoracion {
  return form.diasDisponibles.length === 0 ? { diasDisponibles: 'Selecciona al menos un día disponible' } : {}
}

function validarPaso6(form: ValuationForm): ErroresValoracion {
  if (form.observacionesFinales.trim().length > MAX_TEXTO_LARGO) {
    return { observacionesFinales: `No debe superar ${MAX_TEXTO_LARGO} caracteres` }
  }
  return {}
}

const VALIDADORES: Record<number, (form: ValuationForm) => ErroresValoracion> = {
  1: validarPaso1, 2: validarPaso2, 3: validarPaso3, 4: validarPaso4, 5: validarPaso5, 6: validarPaso6,
}

export function validarPasoValoracion(paso: number, form: ValuationForm): ErroresValoracion {
  return VALIDADORES[paso]?.(form) ?? {}
}

/** Primer paso con errores (para guardar), o null si todo es válido. */
export function primerPasoInvalido(form: ValuationForm): number | null {
  for (let paso = 1; paso <= 6; paso++) {
    if (Object.keys(validarPasoValoracion(paso, form)).length > 0) return paso
  }
  return null
}
