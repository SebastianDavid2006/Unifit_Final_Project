import type { Request, Response } from 'express'
import { listarAreas, listarCargos, listarProgramas } from '../services/catalogo.service'

export async function getProgramas(_req: Request, res: Response): Promise<void> {
  res.json(await listarProgramas())
}

export async function getCargos(_req: Request, res: Response): Promise<void> {
  res.json(await listarCargos())
}

export async function getAreas(_req: Request, res: Response): Promise<void> {
  res.json(await listarAreas())
}