import { z } from 'zod'
import type { Request, Response } from 'express'
import {
  cambiarEstadoAgenda,
  cancelarCitaAgenda,
  crearAgenda,
  editarAgenda,
  eliminarAgenda,
  eliminarCupo,
  listarAgenda,
  listarAgendaDeUsuario,
  listarBloques,
  listarCupos,
  listarCuposDisponibles,
  obtenerAgendaPorId,
  publicarCupos,
  reservarCupo,
} from '../services/agenda.service'
import { responderErrorPrisma } from '../utils/prisma-errors'

const crearAgendaSchema = z.object({
  id_usuario: z.string().uuid(),
  fecha: z.string().min(1),
  // Hora de inicio del bloque (p.ej. '08:00'); hora_fin se deriva del bloque
  hora_inicio: z.string().min(1),
  tipo: z.enum(['valoracion', 'registro', 'seguimiento', 'otro']),
  tipo_otro: z.string().optional(),
  observaciones: z.string().optional(),
})

const editarAgendaSchema = z.object({
  fecha: z.string().min(1).optional(),
  hora_inicio: z.string().min(1).optional(),
  tipo: z.enum(['valoracion', 'registro', 'seguimiento', 'otro']).optional(),
  tipo_otro: z.string().optional(),
  observaciones: z.string().optional(),
})

const cambiarEstadoSchema = z.object({
  estado: z.enum(['pendiente', 'completado', 'cancelado', 'no_asistio']),
})

const rangoHorarioSchema = z.object({
  inicio: z.string().min(1),
  fin: z.string().min(1),
})

const publicarCuposSchema = z.object({
  fecha_inicio: z.string().min(1),
  fecha_fin: z.string().min(1),
  horarios_por_dia: z
    .array(
      z.object({
        dia: z.enum(['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']),
        rangos: z.array(rangoHorarioSchema).min(1),
      }),
    )
    .min(1),
})

const reservarCupoSchema = z
  .object({
    tipo: z.enum(['valoracion', 'registro', 'seguimiento', 'otro']).optional(),
    tipo_otro: z.string().trim().max(200).optional(),
  })
  .refine((d) => d.tipo !== 'otro' || !!d.tipo_otro, {
    message: 'Debes especificar el detalle de la cita',
    path: ['tipo_otro'],
  })

export async function getAgenda(_req: Request, res: Response): Promise<void> {
  res.json(await listarAgenda())
}

export async function getAgendaPorId(req: Request, res: Response): Promise<void> {
  const agenda = await obtenerAgendaPorId(req.params.id as string)
  if (!agenda) {
    res.status(404).json({ mensaje: 'Cita no encontrada' })
    return
  }
  res.json(agenda)
}

export async function getAgendaDeUsuario(req: Request, res: Response): Promise<void> {
  res.json(await listarAgendaDeUsuario(req.params.id as string))
}

export async function getMiAgenda(req: Request, res: Response): Promise<void> {
  res.json(await listarAgendaDeUsuario(req.usuario!.id_usuario))
}

export async function postAgenda(req: Request, res: Response): Promise<void> {
  const parsed = crearAgendaSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ mensaje: 'Datos inválidos', errores: parsed.error.flatten() })
    return
  }

  try {
    const agenda = await crearAgenda(parsed.data, req.usuario!.id_usuario)
    res.status(201).json(agenda)
  } catch (error) {
    if (!responderErrorPrisma(error, res)) throw error
  }
}

export async function putAgenda(req: Request, res: Response): Promise<void> {
  const parsed = editarAgendaSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ mensaje: 'Datos inválidos', errores: parsed.error.flatten() })
    return
  }

  try {
    const agenda = await editarAgenda(req.params.id as string, parsed.data)
    res.json(agenda)
  } catch (error) {
    if (!responderErrorPrisma(error, res)) throw error
  }
}

export async function putEstadoAgenda(req: Request, res: Response): Promise<void> {
  const parsed = cambiarEstadoSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ mensaje: 'Datos inválidos', errores: parsed.error.flatten() })
    return
  }

  try {
    const agenda = await cambiarEstadoAgenda(req.params.id as string, parsed.data.estado)
    res.json(agenda)
  } catch (error) {
    if (!responderErrorPrisma(error, res)) throw error
  }
}

export async function deleteAgenda(req: Request, res: Response): Promise<void> {
  try {
    const resultado = await eliminarAgenda(req.params.id as string)
    res.json(resultado)
  } catch (error) {
    if (!responderErrorPrisma(error, res)) throw error
  }
}

export async function postPublicarCupos(req: Request, res: Response): Promise<void> {
  const parsed = publicarCuposSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ mensaje: 'Datos inválidos', errores: parsed.error.flatten() })
    return
  }

  try {
    const resultado = await publicarCupos(parsed.data, req.usuario!.id_usuario)
    res.status(201).json(resultado)
  } catch (error) {
    if (!responderErrorPrisma(error, res)) throw error
  }
}

export async function getCuposDisponibles(_req: Request, res: Response): Promise<void> {
  res.json(await listarCuposDisponibles())
}

export async function getBloques(_req: Request, res: Response): Promise<void> {
  res.json(await listarBloques())
}

export async function getCupos(_req: Request, res: Response): Promise<void> {
  res.json(await listarCupos())
}

export async function postReservarCupo(req: Request, res: Response): Promise<void> {
  const parsed = reservarCupoSchema.safeParse(req.body ?? {})
  if (!parsed.success) {
    res.status(400).json({ mensaje: 'Datos inválidos', errores: parsed.error.flatten() })
    return
  }

  try {
    const agenda = await reservarCupo(req.params.id as string, req.usuario!.id_usuario, parsed.data.tipo ?? 'registro', parsed.data.tipo_otro)
    res.status(201).json(agenda)
  } catch (error) {
    if (!responderErrorPrisma(error, res)) throw error
  }
}

export async function deleteCupo(req: Request, res: Response): Promise<void> {
  try {
    const resultado = await eliminarCupo(req.params.id as string)
    res.json(resultado)
  } catch (error) {
    if (!responderErrorPrisma(error, res)) throw error
  }
}

export async function postCancelarAgenda(req: Request, res: Response): Promise<void> {
  try {
    const esStaff = req.usuario!.rol === 'admin' || req.usuario!.rol === 'entrenador'
    const agenda = await cancelarCitaAgenda(req.params.id as string, req.usuario!.id_usuario, esStaff)
    res.json(agenda)
  } catch (error) {
    if (!responderErrorPrisma(error, res)) throw error
  }
}
