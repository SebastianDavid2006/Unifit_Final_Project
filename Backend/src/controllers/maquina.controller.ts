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
  nombre: z.string({ message: 'El nombre es obligatorio' }).trim().min(1, 'El nombre es obligatorio'),
  descripcion: z.string().optional(),
  grupos_musculares: z.array(
    z.string(),
    { message: 'Debes seleccionar al menos un grupo muscular' },
  ).min(1, 'Debes seleccionar al menos un grupo muscular'),
  nivel: z.enum(['principiante', 'intermedio', 'avanzado']).optional(),
  url_multimedia: z.string().min(1, 'La imagen es obligatoria'),
  ejercicioIds: z.array(z.string()).optional(),
})

const editarMaquinaSchema = z.object({
  nombre: z.string().trim().min(1).optional(),
  descripcion: z.string().optional(),
  grupos_musculares: z.array(z.string()).optional(),
  nivel: z.enum(['principiante', 'intermedio', 'avanzado']).optional(),
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
  if (!file.mimetype.startsWith('image/')) {
    fs.unlinkSync(file.path)
    res.status(400).json({ mensaje: 'Solo se permiten imágenes para máquinas' })
    return
  }

  // Validar el body ANTES de persistir el archivo (evita archivos huérfanos)
  const body = { ...req.body }
  if (body.grupos_musculares && typeof body.grupos_musculares === 'string') {
    try { body.grupos_musculares = JSON.parse(body.grupos_musculares) } catch { body.grupos_musculares = [] }
  }
  if (body.ejercicioIds && typeof body.ejercicioIds === 'string') {
    try { body.ejercicioIds = JSON.parse(body.ejercicioIds) } catch { body.ejercicioIds = [] }
  }

  const parsed = crearMaquinaSchema.omit({ url_multimedia: true }).safeParse(body)
  if (!parsed.success) {
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path)
    res.status(400).json({ mensaje: Object.values(parsed.error.flatten().fieldErrors).flat()[0] ?? 'Datos inválidos', errores: parsed.error.flatten() })
    return
  }

  // Mover archivo a almacenamiento permanente
  let urlMultimedia: string | undefined
  try {
    urlMultimedia = await saveFile(file.path, file.originalname)
    const maquina = await crearMaquina({
      ...parsed.data,
      url_multimedia: urlMultimedia,
      id_creador: req.usuario!.id_usuario,
    })
    res.status(201).json(maquina)
  } catch (error) {
    // Si el archivo ya se guardó pero la base falló (p.ej. FK), se limpia para no dejar huérfanos.
    if (urlMultimedia) await deleteFile(urlMultimedia)
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path)
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
      res.status(400).json({ mensaje: Object.values(parsed.error.flatten().fieldErrors).flat()[0] ?? 'Datos inválidos', errores: parsed.error.flatten() })
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
