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

const medidasSchema = z.object({
  peso: z.number().positive(),
  estatura: z.number().positive(),
  imc: z.number().positive(),
  grasa_corporal: z.number().min(0).max(100),
  masa_muscular: z.number().positive(),
  masa_magra: z.number().positive(),
  grasa_visceral: z.number().min(0),
})

const datosMedicosSchema = z.object({
  presion_arterial: z.string().min(1),
  edad_metabolica: z.number().positive(),
  agua_corporal: z.number().min(0).max(100),
  resistencia_muscular: z.number().positive(),
})

const crearValoracionSchema = z.object({
  id_usuario: z.string().uuid(),
  nivel_actividad: z.enum(NivelActividad),
  objetivos: z.array(z.enum(ObjetivoUsuario)).min(1),
  objetivo_detalle: z.string().optional(),
  tipo_antecedentes: z.array(z.enum(TipoAntecedente)),
  observaciones_antecedentes: z.string().optional(),
  observaciones_finales: z.string().optional(),
  dias_disponibles: z.array(z.enum(DiaSemana)).min(1),
  proxima_valoracion: z.coerce.date().optional(),
  medidas: medidasSchema.optional(),
  datos_medicos: datosMedicosSchema.optional(),
})

const editarValoracionSchema = z.object({
  nivel_actividad: z.enum(NivelActividad).optional(),
  objetivos: z.array(z.enum(ObjetivoUsuario)).min(1).optional(),
  objetivo_detalle: z.string().optional(),
  tipo_antecedentes: z.array(z.enum(TipoAntecedente)).optional(),
  observaciones_antecedentes: z.string().optional(),
  observaciones_finales: z.string().optional(),
  dias_disponibles: z.array(z.enum(DiaSemana)).min(1).optional(),
  proxima_valoracion: z.coerce.date().optional(),
  medidas: medidasSchema.optional(),
  datos_medicos: datosMedicosSchema.optional(),
})

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
