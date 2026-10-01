import { z } from 'zod'
import type { Request, Response } from 'express'
import { NivelActividad, ObjetivoUsuario, TipoAntecedente, DiaSemana } from '@prisma/client'
import {
  crearValoracion,
  desactivarValoracion,
  editarValoracion,
  listarValoracionesActivas,
  obtenerValoracionPorId,
  listarValoracionesPorUsuario,
} from '../services/valoracion.service'
import { responderErrorPrisma } from '../utils/prisma-errors'
import { medidasSchema, datosMedicosSchema, textoCorto, textoLargo } from '../utils/validaciones-valoracion'

const objetivosSchema = z.array(z.enum(ObjetivoUsuario)).min(1, 'Selecciona al menos un objetivo').max(6)
const diasSchema = z.array(z.enum(DiaSemana)).min(1, 'Selecciona al menos un día disponible').max(7)

// Si el objetivo es "otro" el detalle deja de ser opcional: sin él no hay objetivo real.
function exigirDetalleOtro(
  v: { objetivos?: ObjetivoUsuario[]; objetivo_detalle?: string },
  ctx: z.RefinementCtx,
): void {
  if (v.objetivos?.includes(ObjetivoUsuario.otro) && !v.objetivo_detalle) {
    ctx.addIssue({ code: 'custom', path: ['objetivo_detalle'], message: 'Describe el objetivo cuando eliges "Otro"' })
  }
}

const crearValoracionSchema = z
  .object({
    id_usuario: z.string().uuid(),
    nivel_actividad: z.enum(NivelActividad),
    objetivos: objetivosSchema,
    objetivo_detalle: textoCorto('El detalle del objetivo').optional(),
    tipo_antecedentes: z.array(z.enum(TipoAntecedente)).max(10),
    observaciones_antecedentes: textoLargo('Las observaciones de antecedentes').optional(),
    observaciones_finales: textoLargo('Las observaciones finales').optional(),
    dias_disponibles: diasSchema,
    proxima_valoracion: z.coerce.date().optional(),
    // Al crear, ambos bloques son obligatorios; al editar siguen siendo opcionales.
    medidas: medidasSchema,
    datos_medicos: datosMedicosSchema,
  })
  .superRefine(exigirDetalleOtro)

const editarValoracionSchema = z
  .object({
    nivel_actividad: z.enum(NivelActividad).optional(),
    objetivos: objetivosSchema.optional(),
    objetivo_detalle: textoCorto('El detalle del objetivo').optional(),
    tipo_antecedentes: z.array(z.enum(TipoAntecedente)).max(10).optional(),
    observaciones_antecedentes: textoLargo('Las observaciones de antecedentes').optional(),
    observaciones_finales: textoLargo('Las observaciones finales').optional(),
    dias_disponibles: diasSchema.optional(),
    proxima_valoracion: z.coerce.date().optional(),
    medidas: medidasSchema.optional(),
    datos_medicos: datosMedicosSchema.optional(),
  })
  .superRefine(exigirDetalleOtro)

export async function getValoraciones(_req: Request, res: Response): Promise<void> {
  res.json(await listarValoracionesActivas())
}

export async function getValoracionPorId(req: Request, res: Response): Promise<void> {
  const valoracion = await obtenerValoracionPorId(req.params.id as string)
  if (!valoracion) {
    res.status(404).json({ mensaje: 'Valoración no encontrada' })
    return
  }
  res.json(valoracion)
}

export async function getValoracionesPorUsuario(req: Request, res: Response): Promise<void> {
  const valoraciones = await listarValoracionesPorUsuario(req.params.id as string)
  res.json(valoraciones)
}

export async function postValoracion(req: Request, res: Response): Promise<void> {
  const parsed = crearValoracionSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ mensaje: 'Datos inválidos', errores: parsed.error.flatten() })
    return
  }

  try {
    const valoracion = await crearValoracion(parsed.data, req.usuario!.id_usuario)
    res.status(201).json(valoracion)
  } catch (error) {
    if (!responderErrorPrisma(error, res)) throw error
  }
}

export async function putValoracion(req: Request, res: Response): Promise<void> {
  const parsed = editarValoracionSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ mensaje: 'Datos inválidos', errores: parsed.error.flatten() })
    return
  }

  try {
    const valoracion = await editarValoracion(req.params.id as string, parsed.data)
    res.json(valoracion)
  } catch (error) {
    if (!responderErrorPrisma(error, res)) throw error
  }
}

export async function desactivarValoracionHandler(req: Request, res: Response): Promise<void> {
  try {
    await desactivarValoracion(req.params.id as string)
    res.json({ mensaje: 'Valoración desactivada correctamente' })
  } catch (error) {
    if (!responderErrorPrisma(error, res)) throw error
  }
}
