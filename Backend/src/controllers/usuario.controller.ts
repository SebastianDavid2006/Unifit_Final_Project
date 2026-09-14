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
import { prisma } from '../utils/prisma'

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', '10minutemail.com', 'tempmail.com',
  'temp-mail.org', 'throwawaymail.com', 'fakeinbox.com', 'trashmail.com',
  'maildrop.cc', 'getnada.com', 'yopmail.com', 'dispostable.com',
  'mailnesia.com', 'mytemp.email', 'emailondeck.com', 'spamgourmet.com',
  'sharklasers.com', 'grr.la', 'guerrillamailblock.com', 'pokemail.net',
  'discard.email', 'mailcatch.com', 'spambox.us', 'tempinbox.com',
  'incognitomail.org', 'mohmal.com', 'tmpmail.org',
])

const DOC_REGEX: Record<TipoDocumento, RegExp> = {
  CC: /^\d{7,10}$/,
  TI: /^\d{10,11}$/,
  CE: /^\d{6,10}$/,
  PA: /^[A-Za-z0-9]{6,9}$/,
  RC: /^\d{10,12}$/,
}

const nombreSchema = z
  .string()
  .trim()
  .min(2, 'Muy corto')
  .max(50, 'Muy largo')
  .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s-]+$/, 'Solo letras, espacios y guiones')
  .refine((val) => !/(.)\1{3,}/.test(val), 'Valor no válido')

const telefonoSchema = z
  .string()
  .regex(/^\d{10}$/, 'Teléfono debe tener 10 dígitos')
  .refine((v) => v.startsWith('3'), 'Teléfono debe iniciar con 3')
  .refine((v) => !/^(\d)\1{9}$/.test(v), 'Teléfono no válido')
  .refine((v) => !/^(0123456789|1234567890|9876543210)$/.test(v), 'Teléfono no válido')

export const registrarSchema = z
  .object({
    primer_nombre: nombreSchema,
    segundo_nombre: nombreSchema.optional(),
    primer_apellido: nombreSchema,
    segundo_apellido: nombreSchema.optional(),
    email_contacto: z
      .string()
      .email()
      .max(254)
      .transform((v) => v.toLowerCase())
      .refine((email) => !DISPOSABLE_DOMAINS.has(email.split('@')[1] ?? ''), 'Dominio de correo no permitido'),
    telefono_contacto: telefonoSchema.optional(),
    documento: z.string().min(1),
    tipo_documento: z.enum(TipoDocumento).default(TipoDocumento.CC),
    fecha_nacimiento: z
      .string({ error: 'Fecha de nacimiento es requerida' })
      .min(1, 'Fecha de nacimiento es requerida')
      .pipe(z.coerce.date())
      .refine((d) => d <= new Date(), 'Fecha no puede ser futura')
      .refine((d) => {
        const hoy = new Date()
        let edad = hoy.getFullYear() - d.getFullYear()
        const mes = hoy.getMonth() - d.getMonth()
        if (mes < 0 || (mes === 0 && hoy.getDate() < d.getDate())) edad--
        return edad >= 15 && edad <= 70
      }, 'Edad debe estar entre 15 y 70 años'),
    genero: z.enum(Genero),
    eps: z
      .string()
      .trim()
      .min(2, 'Muy corto')
      .max(60, 'Muy largo')
      .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9\s.\-]+$/, 'Formato de EPS inválido')
      .optional(),
    grupo_sanguineo: z.enum(GrupoSanguineo).optional(),
    nombre_emergencia: nombreSchema.optional(),
    telefono_emergencia: telefonoSchema.optional(),
    parentesco_emergencia: z.enum(Parentesco).optional(),
    tipo_usuario: z.enum(TipoUsuario),
    rol: z.enum(['admin', 'entrenador']).optional(),
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
    acudiente_primer_nombre: nombreSchema.optional(),
    acudiente_primer_apellido: nombreSchema.optional(),
    acudiente_documento: z.string().min(1).optional(),
    acudiente_tipo_documento: z.enum(TipoDocumento).optional(),
    acudiente_telefono_contacto: telefonoSchema.optional(),
  })
  .strict()
  .superRefine(async (val, ctx) => {
    const esEstudiante = val.tipo_usuario === TipoUsuario.estudiante
    const esStaff = val.tipo_usuario === TipoUsuario.profesor || val.tipo_usuario === TipoUsuario.administrativo

    // --- Rama Estudiante (usuario del gym) ---
    if (esEstudiante) {
      if (!val.id_programa) {
        ctx.addIssue({ code: 'custom', path: ['id_programa'], message: 'id_programa es requerido para estudiantes' })
      }
      if (val.rol) {
        ctx.addIssue({ code: 'custom', path: ['rol'], message: 'Un estudiante no puede tener rol de admin o entrenador' })
      }
      if (!val.numero_carnet?.trim()) {
        ctx.addIssue({ code: 'custom', path: ['numero_carnet'], message: 'Número de carnet es requerido' })
      }
    }

    // --- Rama Staff (admin/entrenador) ---
    if (esStaff) {
      if (val.rol !== 'admin' && val.rol !== 'entrenador') {
        ctx.addIssue({ code: 'custom', path: ['rol'], message: 'Rol (admin o entrenador) es requerido para el personal' })
      }
      if (!val.id_cargo) {
        ctx.addIssue({ code: 'custom', path: ['id_cargo'], message: 'id_cargo es requerido para el personal' })
      }
      if (!val.id_area) {
        ctx.addIssue({ code: 'custom', path: ['id_area'], message: 'id_area es requerido para el personal' })
      }
      // Validar cargo existe y está activo
      if (val.id_cargo) {
        const cargo = await prisma.cargo.findUnique({ where: { id_cargo: val.id_cargo } })
        if (!cargo || !cargo.activo) {
          ctx.addIssue({ code: 'custom', path: ['id_cargo'], message: 'Cargo no existe o está inactivo' })
        }
      }
      // Validar área existe y está activa
      if (val.id_area) {
        const area = await prisma.area.findUnique({ where: { id_area: val.id_area } })
        if (!area || !area.activo) {
          ctx.addIssue({ code: 'custom', path: ['id_area'], message: 'Área no existe o está inactiva' })
        }
      }
    }

    // --- Común: formato de documento según tipo_documento ---
    if (val.documento && val.tipo_documento) {
      const regex = DOC_REGEX[val.tipo_documento]
      if (regex && !regex.test(val.documento)) {
        ctx.addIssue({ code: 'custom', path: ['documento'], message: `Formato de documento inválido para ${val.tipo_documento}` })
      }
    }

    // --- Común (solo estudiante): formato de número de carnet ---
    if (esEstudiante && val.numero_carnet && val.tipo_documento) {
      const regex = DOC_REGEX[val.tipo_documento]
      if (regex && !regex.test(val.numero_carnet)) {
        ctx.addIssue({ code: 'custom', path: ['numero_carnet'], message: 'Formato de carnet inválido' })
      }
    }

    // --- Común: validación acudiente para menores de edad ---
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
  const parsed = await registrarSchema.safeParseAsync(req.body)

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