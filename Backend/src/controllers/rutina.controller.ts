import { z } from 'zod'
import type { Request, Response } from 'express'
import {
  cancelarSesion,
  crearRutina,
  crearSesion,
  desactivarRutina,
  editarRutina,
  finalizarSesion,
  listarRutinasActivas,
  listarSesiones,
  marcarEjercicios,
  obtenerRutinaPorId,
  listarRutinasPorUsuario,
} from '../services/rutina.service'
import { responderErrorPrisma } from '../utils/prisma-errors'

const rutinaEjercicioSchema = z
  .object({
    id_ejercicio: z.string().uuid(),
    dia_semana: z.string().min(1),
    series: z.coerce.number().int().min(1).max(20).optional(),
    repeticiones_min: z.coerce.number().int().min(1).max(100).optional(),
    repeticiones_max: z.coerce.number().int().min(1).max(100).optional(),
    descanso: z.coerce.number().int().min(0).max(600).optional(),
    observaciones: z.string().optional(),
  })
  .refine(
    d => d.repeticiones_min === undefined || d.repeticiones_max === undefined || d.repeticiones_min <= d.repeticiones_max,
    { message: 'repeticiones_min no puede ser mayor que repeticiones_max', path: ['repeticiones_min'] },
  )

const crearRutinaSchema = z.object({
  id_usuario: z.string().uuid(),
  id_valoracion: z.string().uuid(),
  nombre: z.string().min(1),
  duracion: z.string().optional(),
  nivel: z.string().optional(),
  observaciones: z.string().optional(),
  ejercicios: z.array(rutinaEjercicioSchema).min(1),
})

const editarRutinaSchema = z.object({
  nombre: z.string().min(1).optional(),
  duracion: z.string().optional(),
  nivel: z.string().optional(),
  observaciones: z.string().optional(),
  ejercicios: z.array(rutinaEjercicioSchema).min(1).optional(),
})

export async function getRutinas(_req: Request, res: Response): Promise<void> {
  res.json(await listarRutinasActivas())
}

export async function getRutinaPorId(req: Request, res: Response): Promise<void> {
  const rutina = await obtenerRutinaPorId(req.params.id as string)
  if (!rutina) {
    res.status(404).json({ mensaje: 'Rutina no encontrada' })
    return
  }
  res.json(rutina)
}

export async function getRutinasPorUsuario(req: Request, res: Response): Promise<void> {
  const rutinas = await listarRutinasPorUsuario(req.params.id as string)
  res.json(rutinas)
}

export async function postRutina(req: Request, res: Response): Promise<void> {
  const parsed = crearRutinaSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ mensaje: Object.values(parsed.error.flatten().fieldErrors).flat()[0] ?? 'Datos inválidos', errores: parsed.error.flatten() })
    return
  }

  try {
    const rutina = await crearRutina(parsed.data, req.usuario!.id_usuario)
    res.status(201).json(rutina)
  } catch (error) {
    if (!responderErrorPrisma(error, res)) throw error
  }
}

export async function putRutina(req: Request, res: Response): Promise<void> {
  const parsed = editarRutinaSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ mensaje: Object.values(parsed.error.flatten().fieldErrors).flat()[0] ?? 'Datos inválidos', errores: parsed.error.flatten() })
    return
  }

  try {
    const rutina = await editarRutina(req.params.id as string, parsed.data)
    res.json(rutina)
  } catch (error) {
    if (!responderErrorPrisma(error, res)) throw error
  }
}

export async function desactivarRutinaHandler(req: Request, res: Response): Promise<void> {
  try {
    await desactivarRutina(req.params.id as string)
    res.json({ mensaje: 'Rutina desactivada correctamente' })
  } catch (error) {
    if (!responderErrorPrisma(error, res)) throw error
  }
}

export async function postSesion(req: Request, res: Response): Promise<void> {
  try {
    const sesion = await crearSesion(req.params.id as string)
    res.status(201).json(sesion)
  } catch (error) {
    if (!responderErrorPrisma(error, res)) throw error
  }
}

export async function getSesiones(req: Request, res: Response): Promise<void> {
  const sesiones = await listarSesiones(req.params.id as string)
  res.json(sesiones)
}

export async function putFinalizarSesion(req: Request, res: Response): Promise<void> {
  try {
    const sesion = await finalizarSesion(req.params.id as string)
    res.json(sesion)
  } catch (error) {
    if (!responderErrorPrisma(error, res)) throw error
  }
}

export async function putCancelarSesion(req: Request, res: Response): Promise<void> {
  try {
    const sesion = await cancelarSesion(req.params.id as string)
    res.json(sesion)
  } catch (error) {
    if (!responderErrorPrisma(error, res)) throw error
  }
}

export async function putMarcarEjercicios(req: Request, res: Response): Promise<void> {
  const ids = req.body?.ejerciciosMarcados
  if (!Array.isArray(ids) || ids.some((id: unknown) => typeof id !== 'string')) {
    res.status(400).json({ mensaje: 'ejerciciosMarcados debe ser un arreglo de strings' })
    return
  }

  try {
    const sesion = await marcarEjercicios(req.params.id as string, ids)
    res.json(sesion)
  } catch (error) {
    if (!responderErrorPrisma(error, res)) throw error
  }
}
