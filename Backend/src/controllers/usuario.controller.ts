import { z } from 'zod'
import type { Request, Response } from 'express'
import {
  Genero,
  GrupoSanguineo,
  JornadaEstudiante,
  ModalidadEstudiante,
  Parentesco,
  Prisma,
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
  buscarExistentePorCredenciales,
} from '../services/usuario.service'
import { obtenerMiCita } from './cita.controller'
import { responderErrorPrisma } from '../utils/prisma-errors'
import { HttpError } from '../utils/HttpError'
import {
  DOC_REGEX,
  nombreSchema,
  telefonoSchema,
  calcularEdad,
  esStaff,
  validarDocumento,
  validarEdad,
} from '../utils/validaciones-usuario'

export { obtenerMiCita }
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


export const registrarSchema = z
  .object({
    primer_nombre: nombreSchema,
    segundo_nombre: nombreSchema.optional(),
    primer_apellido: nombreSchema,
    segundo_apellido: nombreSchema.optional(),
    email_contacto: z
      .string()
      .trim()
      .email('El correo electrónico no es válido')
      .max(254, 'El correo electrónico es demasiado largo')
      .transform((v) => v.toLowerCase())
      .refine((email) => !DISPOSABLE_DOMAINS.has(email.split('@')[1] ?? ''), 'Dominio de correo no permitido'),
    telefono_contacto: telefonoSchema.optional(),
    documento: z.string().trim().min(1, 'El documento es requerido').max(20, 'El documento es demasiado largo'),
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
      }, 'Edad válida solo entre 15 y 70 años'),
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
    rol: z.enum(['admin', 'entrenador', 'usuario']).optional(),
    // Estudiante
    id_programa: z.string().uuid().optional(),
    numero_carnet: z.string().optional(),
    semestre: z.coerce.number().int().min(1, 'El semestre mínimo es 1').max(12, 'El semestre máximo es 12').optional(),
    modalidad: z.enum(ModalidadEstudiante).optional(),
    jornada: z.enum(JornadaEstudiante).optional(),
    es_egresado: z.boolean().optional(),
    // Profesor / Administrativo
    id_cargo: z.string().uuid().optional(),
    id_area: z.string().uuid().optional(),
    // Acudiente (requerido si menor de 18)
    acudiente_primer_nombre: nombreSchema.optional(),
    acudiente_primer_apellido: nombreSchema.optional(),
    acudiente_documento: z.string().min(1, 'El documento del acudiente es requerido').optional(),
    acudiente_tipo_documento: z.enum(TipoDocumento).optional(),
    acudiente_telefono_contacto: telefonoSchema.optional(),
    acudiente_parentesco: z.enum(Parentesco).optional(),
  })
  .strict()
  .superRefine(async (val, ctx) => {
    const esEstudiante = val.tipo_usuario === TipoUsuario.estudiante
    const esStaffReal = val.rol === 'admin' || val.rol === 'entrenador'

    // --- Rama Estudiante (usuario del gym) ---
    if (esEstudiante) {
      if (!val.id_programa) {
        ctx.addIssue({ code: 'custom', path: ['id_programa'], message: 'id_programa es requerido para estudiantes' })
      } else {
        const programa = await prisma.programa.findUnique({ where: { id_programa: val.id_programa } })
        if (!programa || !programa.activo) {
          ctx.addIssue({ code: 'custom', path: ['id_programa'], message: 'La carrera no existe o está inactiva' })
        }
      }
      if (val.rol && val.rol !== 'usuario') {
        ctx.addIssue({ code: 'custom', path: ['rol'], message: 'Un estudiante solo puede tener rol de usuario' })
      }
      if (!val.numero_carnet?.trim()) {
        ctx.addIssue({ code: 'custom', path: ['numero_carnet'], message: 'Número de carnet es requerido' })
      }
    }

    // --- Rama Staff REAL (rol === admin || rol === entrenador) ---
    if (esStaffReal) {
      // rol puede ser 'usuario' (miembro del gym) o 'entrenador'/'admin' (staff del sistema)
      if (val.rol && !['admin', 'entrenador', 'usuario'].includes(val.rol)) {
        ctx.addIssue({ code: 'custom', path: ['rol'], message: 'Rol inválido para staff' })
      }
      // Staff real debe ser mayor de 18 años
      if (val.fecha_nacimiento) {
        validarEdad(val.fecha_nacimiento, val.rol, ctx, ['fecha_nacimiento'])
      }
    }

    // --- Cargo y área: obligatorios para staff real y para profesor/administrativo ---
    if (esStaffReal || !esEstudiante) {
      if (!val.id_cargo) {
        ctx.addIssue({ code: 'custom', path: ['id_cargo'], message: 'El cargo es requerido' })
      } else {
        const cargo = await prisma.cargo.findUnique({ where: { id_cargo: val.id_cargo } })
        if (!cargo || !cargo.activo) {
          ctx.addIssue({ code: 'custom', path: ['id_cargo'], message: 'Cargo no existe o está inactivo' })
        }
      }
      if (!val.id_area) {
        ctx.addIssue({ code: 'custom', path: ['id_area'], message: 'El área es requerida' })
      } else {
        const area = await prisma.area.findUnique({ where: { id_area: val.id_area } })
        if (!area || !area.activo) {
          ctx.addIssue({ code: 'custom', path: ['id_area'], message: 'Área no existe o está inactiva' })
        }
      }
    }

    // --- Común: formato de documento según tipo_documento ---
    if (val.documento && val.tipo_documento) {
      validarDocumento(val.documento, val.tipo_documento, ctx, ['documento'])
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
      if (calcularEdad(val.fecha_nacimiento) < 18) {
        if (!val.acudiente_primer_nombre?.trim()) {
          ctx.addIssue({ code: 'custom', path: ['acudiente_primer_nombre'], message: 'Nombre del acudiente es requerido para menores de edad' })
        }
        if (!val.acudiente_primer_apellido?.trim()) {
          ctx.addIssue({ code: 'custom', path: ['acudiente_primer_apellido'], message: 'Apellido del acudiente es requerido para menores de edad' })
        }
        if (!val.acudiente_documento?.trim()) {
          ctx.addIssue({ code: 'custom', path: ['acudiente_documento'], message: 'Documento del acudiente es requerido para menores de edad' })
        }
        if (!val.acudiente_parentesco) {
          ctx.addIssue({ code: 'custom', path: ['acudiente_parentesco'], message: 'Parentesco del acudiente es requerido para menores de edad' })
        }
      }
    }

    // --- Común: formato de documento del acudiente (si se envía) ---
    if (val.acudiente_documento && val.acudiente_tipo_documento) {
      const regex = DOC_REGEX[val.acudiente_tipo_documento]
      if (regex && !regex.test(val.acudiente_documento.trim())) {
        ctx.addIssue({ code: 'custom', path: ['acudiente_documento'], message: `Formato de documento inválido para ${val.acudiente_tipo_documento}` })
      }
    }
  })

export async function registrar(req: Request, res: Response): Promise<void> {
  // Solo el admin crea personal (admin/entrenador); el entrenador únicamente crea miembros.
  // Se autoriza antes de validar el cuerpo: la autorización no depende de que los datos sean válidos.
  const rolSolicitado = req.body?.rol
  if (rolSolicitado !== undefined && rolSolicitado !== 'usuario' && req.usuario!.rol !== 'admin') {
    res.status(403).json({ mensaje: 'Solo un administrador puede registrar personal' })
    return
  }

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
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      const existente = await buscarExistentePorCredenciales(parsed.data.documento, parsed.data.email_contacto)
      if (existente) {
        res.status(409).json({
          mensaje: 'El documento o correo electrónico ya está registrado',
          usuario_existente: existente,
        })
        return
      }
    }
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
  console.log('aceptarDocumentoHandler - params:', req.params, 'body:', req.body, 'user:', req.usuario)
  const id = req.params.id as string
  const parsed = aceptarDocumentoSchema.safeParse(req.body)

  if (!parsed.success) {
    res.status(400).json({ mensaje: 'Datos inválidos', errores: parsed.error.flatten() })
    return
  }

  try {
    await aceptarDocumento(id, req.usuario!.id_usuario, parsed.data.tipo_documento_legal, req.usuario!.rol)
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

/**
 * El schema depende del id destino porque las reglas dependen del rol real del
 * usuario en base: el personal (admin/entrenador) debe ser mayor de 18 años,
 * mientras que los miembros del gym admiten desde los 15. Validar contra el rol
 * guardado y no contra quien hace la petición evita que un entrenador se
 * self-edite a una fecha que lo deje en edad menor de 18.
 */
const actualizarPerfilSchema = (idUsuario: string) =>
  z
    .object({
      primer_nombre: nombreSchema.optional(),
      segundo_nombre: nombreSchema.optional(),
      primer_apellido: nombreSchema.optional(),
      segundo_apellido: nombreSchema.optional(),
      email_contacto: z
        .string()
        .email('El correo electrónico no es válido')
        .max(254, 'El correo electrónico es demasiado largo')
        .transform((v) => v.toLowerCase())
        .optional(),
      telefono_contacto: telefonoSchema.optional(),
      documento: z.string().min(1, 'El documento es requerido').optional(),
      tipo_documento: z.enum(TipoDocumento).optional(),
      fecha_nacimiento: z
        .string()
        .pipe(z.coerce.date())
        .refine((d) => d <= new Date(), 'Fecha no puede ser futura')
        .optional(),
      genero: z.enum(Genero).optional(),
      genero_otro: z.string().trim().min(1, 'Especifica el género').optional(),
      id_cargo: z.string().uuid().optional(),
      id_area: z.string().uuid().optional(),
    })
    .superRefine(async (val, ctx) => {
      const usuario = await prisma.usuario.findUnique({
        where: { id_usuario: idUsuario },
        select: { rol: true },
      })
      if (!usuario) return

      if (val.fecha_nacimiento) {
        validarEdad(val.fecha_nacimiento, usuario.rol, ctx, ['fecha_nacimiento'])
      }

      if (val.documento && val.tipo_documento) {
        validarDocumento(val.documento, val.tipo_documento, ctx, ['documento'])
      }

      if (val.genero === 'otro' && !val.genero_otro?.trim()) {
        ctx.addIssue({ code: 'custom', path: ['genero_otro'], message: 'Especifica el género' })
      }
    })

export async function actualizarPerfilHandler(req: Request, res: Response): Promise<void> {
  const parsed = actualizarPerfilSchema(req.params.id as string).safeParse(req.body)
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
