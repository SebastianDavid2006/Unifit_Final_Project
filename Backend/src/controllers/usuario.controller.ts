import { z } from 'zod'
import type { Request, Response } from 'express'
import {
  Genero,
  GrupoSanguineo,
  JornadaEstudiante,
  ModalidadEstudiante,
  Parentesco,
  TipoDocumento,
  TipoUsuario,
} from '@prisma/client'
import { registrarUsuario, usuarioPublico } from '../services/usuario.service'
import { responderErrorPrisma } from '../utils/prisma-errors'

export const registrarSchema = z
  .object({
    primer_nombre: z.string().min(1),
    segundo_nombre: z.string().optional(),
    primer_apellido: z.string().min(1),
    segundo_apellido: z.string().optional(),
    email_contacto: z.string().email(),
    telefono_contacto: z.string().optional(),
    documento: z.string().min(1),
    tipo_documento: z.enum(TipoDocumento).default(TipoDocumento.CC),
    fecha_nacimiento: z.coerce.date().optional(),
    genero: z.enum(Genero),
    genero_otro: z.string().optional(),
    eps: z.string().optional(),
    grupo_sanguineo: z.enum(GrupoSanguineo).optional(),
    nombre_emergencia: z.string().optional(),
    telefono_emergencia: z.string().optional(),
    parentesco_emergencia: z.enum(Parentesco).optional(),
    parentesco_otro: z.string().optional(),
    tipo_usuario: z.enum(TipoUsuario),
    // Estudiante
    id_programa: z.string().uuid().optional(),
    numero_carnet: z.string().optional(),
    semestre: z.coerce.number().int().min(1).optional(),
    modalidad: z.enum(ModalidadEstudiante).optional(),
    jornada: z.enum(JornadaEstudiante).optional(),
    es_egresado: z.boolean().optional(),
    // Profesor / Administrativo
    id_cargo: z.string().uuid().optional(),
    id_area: z.string().uuid().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.tipo_usuario === TipoUsuario.estudiante && !val.id_programa) {
      ctx.addIssue({ code: 'custom', path: ['id_programa'], message: 'id_programa es requerido para estudiantes' })
    }
    if (val.tipo_usuario !== TipoUsuario.estudiante && (!val.id_cargo || !val.id_area)) {
      ctx.addIssue({ code: 'custom', path: ['id_cargo'], message: 'id_cargo e id_area son requeridos' })
    }
    if (val.genero === Genero.otro && !val.genero_otro?.trim()) {
      ctx.addIssue({ code: 'custom', path: ['genero_otro'], message: 'genero_otro es requerido cuando genero es otro' })
    }
    if (val.parentesco_emergencia === Parentesco.otro && !val.parentesco_otro?.trim()) {
      ctx.addIssue({ code: 'custom', path: ['parentesco_otro'], message: 'parentesco_otro es requerido cuando parentesco_emergencia es otro' })
    }
  })

export async function registrar(req: Request, res: Response): Promise<void> {
  const parsed = registrarSchema.safeParse(req.body)

  if (!parsed.success) {
    res.status(400).json({ mensaje: 'Datos inválidos', errores: parsed.error.flatten() })
    return
  }

  try {
    const usuario = await registrarUsuario(parsed.data)
    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      usuario: usuarioPublico(usuario),
    })
  } catch (error) {
    if (!responderErrorPrisma(error, res)) throw error
  }
}