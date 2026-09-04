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
import {
  registrarUsuario,
  usuarioPublico,
  listarUsuarios,
  listarPersonal,
  obtenerUsuarioPorId,
  obtenerMiPerfil,
  aceptarDocumento,
  marcarParq,
  registrarHuella,
  desactivarUsuario,
  activarUsuario,
  cambiarRol,
  actualizarPerfil,
} from '../services/usuario.service'
import { responderErrorPrisma } from '../utils/prisma-errors'
import { HttpError } from '../utils/HttpError'

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
    rol: z.enum(['admin', 'entrenador', 'usuario']).optional().default('usuario'),
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
    // Acudiente (requerido si menor de 18)
    acudiente_primer_nombre: z.string().min(1).optional(),
    acudiente_primer_apellido: z.string().min(1).optional(),
    acudiente_documento: z.string().min(1).optional(),
    acudiente_tipo_documento: z.enum(TipoDocumento).optional(),
    acudiente_telefono_contacto: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.tipo_usuario === TipoUsuario.estudiante && !val.id_programa) {
      ctx.addIssue({ code: 'custom', path: ['id_programa'], message: 'id_programa es requerido para estudiantes' })
    }
    if (val.tipo_usuario !== TipoUsuario.estudiante && (!val.id_cargo || !val.id_area)) {
      ctx.addIssue({ code: 'custom', path: ['id_cargo'], message: 'id_cargo e id_area son requeridos' })
    }
    if ((val.rol === 'admin' || val.rol === 'entrenador') && val.tipo_usuario === TipoUsuario.estudiante) {
      ctx.addIssue({ code: 'custom', path: ['rol'], message: 'Un estudiante no puede tener rol de admin o entrenador' })
    }
    if (val.genero === Genero.otro && !val.genero_otro?.trim()) {
      ctx.addIssue({ code: 'custom', path: ['genero_otro'], message: 'genero_otro es requerido cuando genero es otro' })
    }
    if (val.parentesco_emergencia === Parentesco.otro && !val.parentesco_otro?.trim()) {
      ctx.addIssue({ code: 'custom', path: ['parentesco_otro'], message: 'parentesco_otro es requerido cuando parentesco_emergencia es otro' })
    }
    // Validación acudiente para menores de edad
    if (val.fecha_nacimiento) {
      const hoy = new Date()
      let edad = hoy.getFullYear() - val.fecha_nacimiento.getFullYear()
      const mes = hoy.getMonth() - val.fecha_nacimiento.getMonth()
      if (mes < 0 || (mes === 0 && hoy.getDate() < val.fecha_nacimiento.getDate())) {
        edad--
      }
      if (edad < 18) {
        if (!val.acudiente_primer_nombre?.trim()) {
          ctx.addIssue({ code: 'custom', path: ['acudiente_primer_nombre'], message: 'Nombre del acudiente es requerido para menores de edad' })
        }
        if (!val.acudiente_primer_apellido?.trim()) {
          ctx.addIssue({ code: 'custom', path: ['acudiente_primer_apellido'], message: 'Apellido del acudiente es requerido para menores de edad' })
        }
        if (!val.acudiente_documento?.trim()) {
          ctx.addIssue({ code: 'custom', path: ['acudiente_documento'], message: 'Documento del acudiente es requerido para menores de edad' })
        }
      }
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

export async function getUsuarios(_req: Request, res: Response): Promise<void> {
  try {
    const usuarios = await listarUsuarios()
    res.json(usuarios)
  } catch (error) {
    throw error
  }
}

export async function getPersonal(_req: Request, res: Response): Promise<void> {
  try {
    const personal = await listarPersonal()
    res.json(personal)
  } catch (error) {
    throw error
  }
}

export async function getUsuarioPorId(req: Request, res: Response): Promise<void> {
  const id = req.params.id as string

  try {
    const usuario = await obtenerUsuarioPorId(id)
    if (!usuario) {
      res.status(404).json({ mensaje: 'Usuario no encontrado' })
      return
    }
    res.json(usuario)
  } catch (error) {
    throw error
  }
}

const aceptarDocumentoSchema = z.object({
  tipo_documento_legal: z.enum(['contrato_gym', 'tratamiento_datos']),
})

export async function aceptarDocumentoHandler(req: Request, res: Response): Promise<void> {
  const id = req.params.id as string
  const parsed = aceptarDocumentoSchema.safeParse(req.body)

  if (!parsed.success) {
    res.status(400).json({ mensaje: 'Datos inválidos', errores: parsed.error.flatten() })
    return
  }

  try {
    await aceptarDocumento(id, req.usuario!.id_usuario, parsed.data.tipo_documento_legal)
    res.json({ mensaje: `Documento "${parsed.data.tipo_documento_legal}" aceptado correctamente` })
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ mensaje: error.message })
      return
    }
    if (!responderErrorPrisma(error, res)) throw error
  }
}

export async function marcarParqHandler(req: Request, res: Response): Promise<void> {
  const id = req.params.id as string

  try {
    const usuario = await obtenerUsuarioPorId(id)
    if (!usuario) {
      res.status(404).json({ mensaje: 'Usuario no encontrado' })
      return
    }

    await marcarParq(id)
    res.json({ mensaje: 'PAR-Q marcado como completado' })
  } catch (error) {
    throw error
  }
}

const registrarHuellaSchema = z.object({
  indice_sensor: z.number().int().positive(),
})

export async function registrarHuellaHandler(req: Request, res: Response): Promise<void> {
  const id = req.params.id as string
  const parsed = registrarHuellaSchema.safeParse(req.body)

  if (!parsed.success) {
    res.status(400).json({ mensaje: 'Datos inválidos', errores: parsed.error.flatten() })
    return
  }

  try {
    const usuario = await obtenerUsuarioPorId(id)
    if (!usuario) {
      res.status(404).json({ mensaje: 'Usuario no encontrado' })
      return
    }

    await registrarHuella(id, parsed.data.indice_sensor)
    res.status(201).json({ mensaje: 'Huella registrada correctamente' })
  } catch (error) {
    if (!responderErrorPrisma(error, res)) throw error
  }
}

export async function desactivarUsuarioHandler(req: Request, res: Response): Promise<void> {
  try {
    await desactivarUsuario(req.params.id as string)
    res.json({ mensaje: 'Usuario desactivado correctamente' })
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ mensaje: error.message })
      return
    }
    if (!responderErrorPrisma(error, res)) throw error
  }
}

export async function activarUsuarioHandler(req: Request, res: Response): Promise<void> {
  try {
    await activarUsuario(req.params.id as string)
    res.json({ mensaje: 'Usuario activado correctamente' })
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ mensaje: error.message })
      return
    }
    if (!responderErrorPrisma(error, res)) throw error
  }
}

const cambiarRolSchema = z.object({
  rol: z.enum(['admin', 'entrenador', 'usuario']),
})

export async function cambiarRolHandler(req: Request, res: Response): Promise<void> {
  const parsed = cambiarRolSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ mensaje: 'Datos inválidos', errores: parsed.error.flatten() })
    return
  }

  try {
    await cambiarRol(req.params.id as string, parsed.data.rol)
    res.json({ mensaje: 'Rol actualizado correctamente' })
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ mensaje: error.message })
      return
    }
    if (!responderErrorPrisma(error, res)) throw error
  }
}

const actualizarPerfilSchema = z.object({
  nombre_completo: z.string().optional(),
  email_contacto: z.string().email().optional(),
  telefono_contacto: z.string().optional(),
  id_cargo: z.string().uuid().optional(),
  id_area: z.string().uuid().optional(),
})

export async function actualizarPerfilHandler(req: Request, res: Response): Promise<void> {
  const parsed = actualizarPerfilSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ mensaje: 'Datos inválidos', errores: parsed.error.flatten() })
    return
  }

  try {
    const usuario = await actualizarPerfil(req.params.id as string, parsed.data)
    res.json(usuario)
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ mensaje: error.message })
      return
    }
    if (!responderErrorPrisma(error, res)) throw error
  }
}

export async function getMiPerfil(req: Request, res: Response): Promise<void> {
  try {
    const usuario = await obtenerMiPerfil(req.usuario!.id_usuario)
    if (!usuario) {
      res.status(404).json({ mensaje: 'Usuario no encontrado' })
      return
    }
    res.json(usuario)
  } catch (error) {
    throw error
  }
}