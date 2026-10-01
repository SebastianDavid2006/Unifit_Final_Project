import { z } from 'zod'

/**
 * Rangos fisiológicos plausibles para una valoración. Buscan atrapar errores de
 * digitación (peso 7500, estatura 17), no emitir juicio clínico.
 * Mantener en sincronía con Frontend/src/lib/validacionValoracion.ts.
 */
export const RANGOS_VALORACION = {
  peso: { min: 20, max: 300, unidad: 'kg' },
  estatura: { min: 100, max: 250, unidad: 'cm' },
  imc: { min: 10, max: 60 },
  grasa_corporal: { min: 2, max: 70, unidad: '%' },
  masa_muscular: { min: 5, max: 150, unidad: 'kg' },
  masa_magra: { min: 10, max: 250, unidad: 'kg' },
  grasa_visceral: { min: 1, max: 59 },
  edad_metabolica: { min: 10, max: 99 },
  agua_corporal: { min: 20, max: 80, unidad: '%' },
  resistencia_muscular: { min: 1, max: 300 },
  sistolica: { min: 70, max: 250 },
  diastolica: { min: 40, max: 150 },
} as const

export const MAX_TEXTO_CORTO = 500
export const MAX_TEXTO_LARGO = 1000
/** Diferencia máxima tolerada entre el IMC digitado y el calculado con peso/estatura. */
export const TOLERANCIA_IMC = 2

const PRESION_REGEX = /^(\d{2,3})\/(\d{2,3})$/

function numero(campo: keyof typeof RANGOS_VALORACION, etiqueta: string, entero = false) {
  const { min, max } = RANGOS_VALORACION[campo]
  let base = z.number({ error: `${etiqueta}: ingresa un valor` }).finite(`${etiqueta} no es válido`)
  if (entero) base = base.int(`${etiqueta} debe ser un número entero`)
  return base.min(min, `${etiqueta} debe estar entre ${min} y ${max}`).max(max, `${etiqueta} debe estar entre ${min} y ${max}`)
}

/** La estatura se maneja siempre en centímetros. */
const estaturaSchema = numero('estatura', 'La estatura')

export const medidasSchema = z
  .object({
    peso: numero('peso', 'El peso'),
    estatura: estaturaSchema,
    imc: numero('imc', 'El IMC'),
    grasa_corporal: numero('grasa_corporal', 'La grasa corporal'),
    masa_muscular: numero('masa_muscular', 'La masa muscular'),
    masa_magra: numero('masa_magra', 'La masa magra'),
    grasa_visceral: numero('grasa_visceral', 'La grasa visceral', true),
  }, { error: 'Las medidas corporales son obligatorias' })
  .superRefine((m, ctx) => {
    const metros = m.estatura / 100
    const imcCalculado = m.peso / (metros * metros)
    if (Math.abs(imcCalculado - m.imc) > TOLERANCIA_IMC) {
      ctx.addIssue({
        code: 'custom',
        path: ['imc'],
        message: `El IMC no coincide con el peso y la estatura (debería rondar ${imcCalculado.toFixed(1)})`,
      })
    }
    if (m.masa_magra > m.peso) {
      ctx.addIssue({ code: 'custom', path: ['masa_magra'], message: 'La masa magra no puede superar el peso' })
    }
    if (m.masa_muscular > m.peso) {
      ctx.addIssue({ code: 'custom', path: ['masa_muscular'], message: 'La masa muscular no puede superar el peso' })
    }
  })

export const presionArterialSchema = z
  .string({ error: 'La presión arterial es requerida' })
  .trim()
  .superRefine((v, ctx) => {
    const m = PRESION_REGEX.exec(v)
    if (!m) {
      ctx.addIssue({ code: 'custom', message: 'Presión arterial con formato sistólica/diastólica, por ejemplo 120/80' })
      return
    }
    const sis = Number(m[1])
    const dia = Number(m[2])
    const { sistolica, diastolica } = RANGOS_VALORACION
    if (sis < sistolica.min || sis > sistolica.max || dia < diastolica.min || dia > diastolica.max) {
      ctx.addIssue({
        code: 'custom',
        message: `Presión fuera de rango (sistólica ${sistolica.min}–${sistolica.max}, diastólica ${diastolica.min}–${diastolica.max})`,
      })
      return
    }
    if (sis <= dia) {
      ctx.addIssue({ code: 'custom', message: 'La sistólica debe ser mayor que la diastólica' })
    }
  })

export const datosMedicosSchema = z.object({
  presion_arterial: presionArterialSchema,
  edad_metabolica: numero('edad_metabolica', 'La edad metabólica', true),
  agua_corporal: numero('agua_corporal', 'El agua corporal'),
  resistencia_muscular: numero('resistencia_muscular', 'La resistencia muscular'),
}, { error: 'Los datos clínicos son obligatorios' })

export const textoCorto = (etiqueta: string) =>
  z.string().trim().max(MAX_TEXTO_CORTO, `${etiqueta} no debe superar ${MAX_TEXTO_CORTO} caracteres`)

export const textoLargo = (etiqueta: string) =>
  z.string().trim().max(MAX_TEXTO_LARGO, `${etiqueta} no debe superar ${MAX_TEXTO_LARGO} caracteres`)
