import { z } from 'zod'
import type { Request, Response } from 'express'
import { GrupoMuscular, NivelExperiencia } from '@prisma/client'
import {
  crearMaquina,
  desactivarMaquina,
  editarMaquina,
  listarMaquinasActivas,
  obtenerMaquinaPorId,
} from '../services/maquina.service'
import { responderErrorPrisma } from '../utils/prisma-errors'

const crearMaquinaSchema = z.object({
  nombre: z.string().min(1),
  descripcion: z.string().optional(),
  grupos_musculares: z.array(z.enum(GrupoMuscular)).min(1),
  nivel: z.enum(NivelExperiencia).optional(),
  url_multimedia: z.string().url().optional(),
  ejercicioIds: z.array(z.string().uuid()).optional(),
})

const editarMaquinaSchema = z.object({
  nombre: z.string().min(1).optional(),
  descripcion: z.string().optional(),
  grupos_musculares: z.array(z.enum(GrupoMuscular)).min(1).optional(),
  nivel: z.enum(NivelExperiencia).optional(),
  url_multimedia: z.string().url().optional(),
  ejercicioIds: z.array(z.string().uuid()).optional(),
})

export async function getMaquinas(_req: Request, res: Response): Promise<void> {
  res.json(await listarMaquinasActivas())
}

export async function getMaquinaPorId(req: Request, res: Response): Promise<void> {
  const maquina = await obtenerMaquinaPorId(req.params.id as string)
  if (!maquina) {
    res.status(404).json({ mensaje: 'Máquina no encontrada' })
    return
  }
  res.json(maquina)
}

export async function postMaquina(req: Request, res: Response): Promise<void> {
  const parsed = crearMaquinaSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ mensaje: 'Datos inválidos', errores: parsed.error.flatten() })
    return
  }

  try {
    const maquina = await crearMaquina({
      ...parsed.data,
      id_creador: req.usuario!.id_usuario,
    })
    res.status(201).json(maquina)
  } catch (error) {
    if (!responderErrorPrisma(error, res)) throw error
  }
}

export async function putMaquina(req: Request, res: Response): Promise<void> {
  const parsed = editarMaquinaSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ mensaje: 'Datos inválidos', errores: parsed.error.flatten() })
    return
  }

  try {
    const maquina = await editarMaquina(req.params.id as string, parsed.data)
    res.json(maquina)
  } catch (error) {
    if (!responderErrorPrisma(error, res)) throw error
  }
}

export async function desactivarMaquinaHandler(req: Request, res: Response): Promise<void> {
  try {
    await desactivarMaquina(req.params.id as string)
    res.json({ mensaje: 'Máquina desactivada correctamente' })
  } catch (error) {
    if (!responderErrorPrisma(error, res)) throw error
  }
}
