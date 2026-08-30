import { z } from 'zod'
import type { Request, Response } from 'express'
import { GrupoMuscular, NivelExperiencia } from '@prisma/client'
import {
  crearEjercicio,
  desactivarEjercicio,
  editarEjercicio,
  listarEjerciciosActivos,
  obtenerEjercicioPorId,
} from '../services/ejercicio.service'
import { responderErrorPrisma } from '../utils/prisma-errors'

const crearEjercicioSchema = z.object({
  nombre: z.string().min(1),
  descripcion: z.string().optional(),
  grupos_musculares: z.array(z.enum(GrupoMuscular)).min(1),
  nivel: z.enum(NivelExperiencia).optional(),
  url_multimedia: z.string().url().optional(),
})

const editarEjercicioSchema = z.object({
  nombre: z.string().min(1).optional(),
  descripcion: z.string().optional(),
  grupos_musculares: z.array(z.enum(GrupoMuscular)).min(1).optional(),
  nivel: z.enum(NivelExperiencia).optional(),
  url_multimedia: z.string().url().optional(),
})

export async function getEjercicios(_req: Request, res: Response): Promise<void> {
  res.json(await listarEjerciciosActivos())
}

export async function getEjercicioPorId(req: Request, res: Response): Promise<void> {
  const id = req.params.id as string
  const ejercicio = await obtenerEjercicioPorId(id)
  if (!ejercicio) {
    res.status(404).json({ mensaje: 'Ejercicio no encontrado' })
    return
  }
  res.json(ejercicio)
}

export async function postEjercicio(req: Request, res: Response): Promise<void> {
  const parsed = crearEjercicioSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ mensaje: 'Datos inválidos', errores: parsed.error.flatten() })
    return
  }

  try {
    const ejercicio = await crearEjercicio({
      ...parsed.data,
      id_creador: req.usuario!.id_usuario,
    })
    res.status(201).json(ejercicio)
  } catch (error) {
    if (!responderErrorPrisma(error, res)) throw error
  }
}

export async function putEjercicio(req: Request, res: Response): Promise<void> {
  const parsed = editarEjercicioSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ mensaje: 'Datos inválidos', errores: parsed.error.flatten() })
    return
  }

  try {
    const ejercicio = await editarEjercicio(req.params.id as string, parsed.data)
    res.json(ejercicio)
  } catch (error) {
    if (!responderErrorPrisma(error, res)) throw error
  }
}

export async function desactivarEjercicioHandler(req: Request, res: Response): Promise<void> {
  try {
    await desactivarEjercicio(req.params.id as string)
    res.json({ mensaje: 'Ejercicio desactivado correctamente' })
  } catch (error) {
    if (!responderErrorPrisma(error, res)) throw error
  }
}
