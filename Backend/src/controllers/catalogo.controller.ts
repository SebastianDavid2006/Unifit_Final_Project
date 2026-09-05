import { z } from 'zod'
import type { Request, Response } from 'express'
import {
  listarAreas,
  listarCargos,
  listarProgramas,
  crearArea,
  crearCargo,
  actualizarArea,
  actualizarCargo,
  eliminarArea,
  eliminarCargo,
  crearPrograma,
  actualizarPrograma,
  eliminarPrograma,
} from '../services/catalogo.service'
import { HttpError } from '../utils/HttpError'

export async function getProgramas(_req: Request, res: Response): Promise<void> {
  res.json(await listarProgramas())
}

export async function getCargos(_req: Request, res: Response): Promise<void> {
  res.json(await listarCargos())
}

export async function getAreas(_req: Request, res: Response): Promise<void> {
  res.json(await listarAreas())
}

const nombreSchema = z.object({ nombre: z.string().min(1).max(120) })

export async function postCargo(req: Request, res: Response): Promise<void> {
  const parsed = nombreSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ mensaje: 'Datos inválidos', errores: parsed.error.flatten() })
    return
  }
  try {
    const cargo = await crearCargo(parsed.data.nombre)
    res.status(201).json(cargo)
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ mensaje: error.message })
      return
    }
    throw error
  }
}

export async function postArea(req: Request, res: Response): Promise<void> {
  const parsed = nombreSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ mensaje: 'Datos inválidos', errores: parsed.error.flatten() })
    return
  }
  try {
    const area = await crearArea(parsed.data.nombre)
    res.status(201).json(area)
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ mensaje: error.message })
      return
    }
    throw error
  }
}

export async function putCargo(req: Request, res: Response): Promise<void> {
  const parsed = nombreSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ mensaje: 'Datos inválidos', errores: parsed.error.flatten() })
    return
  }
  try {
    const cargo = await actualizarCargo(req.params.id as string, parsed.data.nombre)
    res.json(cargo)
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ mensaje: error.message })
      return
    }
    throw error
  }
}

export async function putArea(req: Request, res: Response): Promise<void> {
  const parsed = nombreSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ mensaje: 'Datos inválidos', errores: parsed.error.flatten() })
    return
  }
  try {
    const area = await actualizarArea(req.params.id as string, parsed.data.nombre)
    res.json(area)
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ mensaje: error.message })
      return
    }
    throw error
  }
}

export async function deleteCargo(req: Request, res: Response): Promise<void> {
  try {
    await eliminarCargo(req.params.id as string)
    res.json({ mensaje: 'Cargo eliminado' })
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ mensaje: error.message })
      return
    }
    throw error
  }
}

export async function deleteArea(req: Request, res: Response): Promise<void> {
  try {
    await eliminarArea(req.params.id as string)
    res.json({ mensaje: 'Área eliminada' })
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ mensaje: error.message })
      return
    }
    throw error
  }
}

const programaSchema = z.object({
  nombre: z.string().min(1).max(120),
  universidad: z.enum(['uni_colombia', 'uni_bogota']),
  tipo_programa: z.enum(['tecnico', 'profesional', 'especializacion']),
})

const programaUpdateSchema = z.object({
  nombre: z.string().min(1).max(120).optional(),
  universidad: z.enum(['uni_colombia', 'uni_bogota']).optional(),
  tipo_programa: z.enum(['tecnico', 'profesional', 'especializacion']).optional(),
})

export async function postPrograma(req: Request, res: Response): Promise<void> {
  const parsed = programaSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ mensaje: 'Datos inválidos', errores: parsed.error.flatten() })
    return
  }
  try {
    const programa = await crearPrograma(parsed.data.nombre, parsed.data.universidad, parsed.data.tipo_programa)
    res.status(201).json(programa)
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ mensaje: error.message })
      return
    }
    throw error
  }
}

export async function putPrograma(req: Request, res: Response): Promise<void> {
  const parsed = programaUpdateSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ mensaje: 'Datos inválidos', errores: parsed.error.flatten() })
    return
  }
  try {
    const programa = await actualizarPrograma(req.params.id as string, parsed.data)
    res.json(programa)
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ mensaje: error.message })
      return
    }
    throw error
  }
}

export async function deletePrograma(req: Request, res: Response): Promise<void> {
  try {
    await eliminarPrograma(req.params.id as string)
    res.json({ mensaje: 'Programa eliminado' })
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ mensaje: error.message })
      return
    }
    throw error
  }
}