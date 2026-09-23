import { z } from 'zod'
import type { Request, Response } from 'express'
import * as fs from 'fs'
import * as path from 'path'
import { GrupoMuscular, NivelExperiencia } from '@prisma/client'
import {
  crearEjercicio,
  desactivarEjercicio,
  editarEjercicio,
  listarEjerciciosActivos,
  obtenerEjercicioPorId,
} from '../services/ejercicio.service'
import { responderErrorPrisma } from '../utils/prisma-errors'
import { uploadMultimedia } from '../middlewares/uploadMultimedia'
import { getVideoDuration } from '../utils/ffprobe'
import { saveFile, deleteFile } from '../services/storage'

const VIDEO_MAX_SEGUNDOS = 10

const crearEjercicioSchema = z.object({
  nombre: z.string({ message: 'El nombre es obligatorio' }).trim().min(1, 'El nombre es obligatorio'),
  descripcion: z.string().optional(),
  grupos_musculares: z.array(
    z.string(),
    { message: 'Debes seleccionar al menos un grupo muscular' },
  ).min(1, 'Debes seleccionar al menos un grupo muscular'),
  nivel: z.enum(['principiante', 'intermedio', 'avanzado']).optional(),
  url_multimedia: z.string().min(1, 'La imagen o video es obligatoria'),
})

const editarEjercicioSchema = z.object({
  nombre: z.string().trim().min(1).optional(),
  descripcion: z.string().optional(),
  grupos_musculares: z.array(z.string()).optional(),
  nivel: z.enum(['principiante', 'intermedio', 'avanzado']).optional(),
  url_multimedia: z.string().optional(),
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
  const file = req.file

  if (!file) {
    res.status(400).json({ mensaje: 'La imagen o video es obligatoria' })
    return
  }

  // Validar duración si es video
  if (file.mimetype.startsWith('video/')) {
    try {
      const duration = await getVideoDuration(file.path)
      if (duration > VIDEO_MAX_SEGUNDOS) {
        fs.unlinkSync(file.path)
        res.status(400).json({ mensaje: `El video supera la duración máxima de ${VIDEO_MAX_SEGUNDOS} segundos` })
        return
      }
    } catch (err) {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path)
      res.status(400).json({ mensaje: 'Error validando video' })
      return
    }
  }

  // Validar el body ANTES de persistir el archivo (evita archivos huérfanos)
  const body = { ...req.body }
  if (body.grupos_musculares && typeof body.grupos_musculares === 'string') {
    try { body.grupos_musculares = JSON.parse(body.grupos_musculares) } catch { body.grupos_musculares = [] }
  }

  const parsed = crearEjercicioSchema.omit({ url_multimedia: true }).safeParse(body)
  if (!parsed.success) {
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path)
    res.status(400).json({ mensaje: Object.values(parsed.error.flatten().fieldErrors).flat()[0] ?? 'Datos inválidos', errores: parsed.error.flatten() })
    return
  }

  // Mover archivo a almacenamiento permanente
  let mediaUrl: string | undefined
  try {
    mediaUrl = await saveFile(file.path, file.originalname)
    const ejercicio = await crearEjercicio({
      ...parsed.data,
      url_multimedia: mediaUrl,
      id_creador: req.usuario!.id_usuario,
    })
    res.status(201).json(ejercicio)
  } catch (error) {
    // Si el archivo ya se guardó pero la base falló, se limpia para no dejar huérfanos.
    if (mediaUrl) await deleteFile(mediaUrl)
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path)
    if (!responderErrorPrisma(error, res)) throw error
  }
}

export async function putEjercicio(req: Request, res: Response): Promise<void> {
  const file = req.file

  try {
    const ejercicioExistente = await obtenerEjercicioPorId(req.params.id as string)
    if (!ejercicioExistente) {
      res.status(404).json({ mensaje: 'Ejercicio no encontrado' })
      return
    }

    // Parse JSON fields from multipart form data
    const body = { ...req.body }
    if (body.grupos_musculares && typeof body.grupos_musculares === 'string') {
      try { body.grupos_musculares = JSON.parse(body.grupos_musculares) } catch { body.grupos_musculares = [] }
    }

    const parsed = editarEjercicioSchema.safeParse(body)
    if (!parsed.success) {
      res.status(400).json({ mensaje: Object.values(parsed.error.flatten().fieldErrors).flat()[0] ?? 'Datos inválidos', errores: parsed.error.flatten() })
      return
    }

    let urlMultimedia = ejercicioExistente.url_multimedia ?? undefined

    // Si se sube nuevo archivo (imagen o video), borrar el anterior y guardar el nuevo
    if (file) {
      // Validar duración si es video
      if (file.mimetype.startsWith('video/')) {
        try {
          const duration = await getVideoDuration(file.path)
          if (duration > VIDEO_MAX_SEGUNDOS) {
            fs.unlinkSync(file.path)
            res.status(400).json({ mensaje: `El video supera la duración máxima de ${VIDEO_MAX_SEGUNDOS} segundos` })
            return
          }
        } catch (err) {
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path)
          res.status(400).json({ mensaje: 'Error validando video' })
          return
        }
      }

      // Borrar archivo anterior si existe
      if (ejercicioExistente.url_multimedia) {
        await deleteFile(ejercicioExistente.url_multimedia)
      }

      // Guardar nuevo archivo
      urlMultimedia = await saveFile(file.path, file.originalname)
    }

    const ejercicio = await editarEjercicio(req.params.id as string, {
      ...parsed.data,
      url_multimedia: urlMultimedia,
    })
    res.json(ejercicio)
  } catch (error) {
    if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path)
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
