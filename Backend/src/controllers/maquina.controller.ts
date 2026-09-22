import { z } from 'zod'
import type { Request, Response } from 'express'
import * as fs from 'fs'
import { GrupoMuscular, NivelExperiencia } from '@prisma/client'
import {
  crearMaquina,
  desactivarMaquina,
  editarMaquina,
  listarMaquinasActivas,
  obtenerMaquinaPorId,
} from '../services/maquina.service'
import { responderErrorPrisma } from '../utils/prisma-errors'
import { uploadMultimedia } from '../middlewares/uploadMultimedia'
import { deleteFile, saveFile } from '../services/storage'

const crearMaquinaSchema = z.object({
  nombre: z.string().min(1),
  descripcion: z.string().optional(),
  grupos_musculares: z.array(z.string()).min(1),
  nivel: z.string().optional(),
  url_multimedia: z.string().min(1, 'La imagen es obligatoria'),
  ejercicioIds: z.array(z.string()).optional(),
})

const editarMaquinaSchema = z.object({
  nombre: z.string().min(1).optional(),
  descripcion: z.string().optional(),
  grupos_musculares: z.array(z.string()).optional(),
  nivel: z.string().optional(),
  url_multimedia: z.string().optional(),
  ejercicioIds: z.array(z.string()).optional(),
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
  const file = req.file

  if (!file) {
    res.status(400).json({ mensaje: 'La imagen es obligatoria' })
    return
  }

  // Validar que sea imagen (ya validado en multer, pero doble check)
  if (!req.file!.mimetype.startsWith('image/')) {
    fs.unlinkSync(req.file!.path)
    res.status(400).json({ mensaje: 'Solo se permiten imágenes para máquinas' })
    return
  }

  let fileMoved = false

  // Mover archivo a almacenamiento permanente
  try {
    const urlMultimedia = await saveFile(req.file!.path, req.file!.originalname)
    fileMoved = true

    // Parse JSON fields from multipart form data
    const body = { ...req.body }
    if (body.grupos_musculares && typeof body.grupos_musculares === 'string') {
      try { body.grupos_musculares = JSON.parse(body.grupos_musculares) } catch { body.grupos_musculares = [] }
    }
    if (body.ejercicioIds && typeof body.ejercicioIds === 'string') {
      try { body.ejercicioIds = JSON.parse(body.ejercicioIds) } catch { body.ejercicioIds = [] }
    }

    const parsed = crearMaquinaSchema.safeParse({
      ...body,
      url_multimedia: urlMultimedia,
    })

    if (!parsed.success) {
      res.status(400).json({ mensaje: 'Datos inválidos', errores: parsed.error.flatten() })
      return
    }

    const maquina = await crearMaquina({
      ...parsed.data,
      id_creador: req.usuario!.id_usuario,
    })
    res.status(201).json(maquina)
  } catch (error) {
    if (!fileMoved && fs.existsSync(req.file!.path)) fs.unlinkSync(req.file!.path)
    if (!responderErrorPrisma(error, res)) throw error
  }
}

export async function putMaquina(req: Request, res: Response): Promise<void> {
  const file = req.file

  try {
    const maquinaExistente = await obtenerMaquinaPorId(req.params.id as string)
    if (!maquinaExistente) {
      res.status(404).json({ mensaje: 'Máquina no encontrada' })
      return
    }

    // Parse JSON fields from multipart form data
    const body = { ...req.body }
    if (body.grupos_musculares && typeof body.grupos_musculares === 'string') {
      try { body.grupos_musculares = JSON.parse(body.grupos_musculares) } catch { body.grupos_musculares = [] }
    }
    if (body.ejercicioIds && typeof body.ejercicioIds === 'string') {
      try { body.ejercicioIds = JSON.parse(body.ejercicioIds) } catch { body.ejercicioIds = [] }
    }

    const parsed = editarMaquinaSchema.safeParse(body)
    if (!parsed.success) {
      res.status(400).json({ mensaje: 'Datos inválidos', errores: parsed.error.flatten() })
      return
    }

    let urlMultimedia = maquinaExistente.url_multimedia ?? undefined

    // Si se sube nueva imagen, borrar la anterior y guardar la nueva
    if (file) {
      if (!file.mimetype.startsWith('image/')) {
        fs.unlinkSync(file.path)
        res.status(400).json({ mensaje: 'Solo se permiten imágenes para máquinas' })
        return
      }

      // Borrar archivo anterior si existe
      if (maquinaExistente.url_multimedia) {
        await deleteFile(maquinaExistente.url_multimedia)
      }

      // Guardar nueva imagen
      urlMultimedia = await saveFile(file.path, file.originalname)
    }

    const maquina = await editarMaquina(req.params.id as string, {
      ...parsed.data,
      url_multimedia: urlMultimedia,
    })
    res.json(maquina)
  } catch (error) {
    if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path)
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
