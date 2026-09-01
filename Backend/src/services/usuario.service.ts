import bcrypt from 'bcryptjs'
import { Prisma } from '@prisma/client'
import { prisma } from '../utils/prisma'
import { HttpError } from '../utils/HttpError'
import type {
  Genero,
  GrupoSanguineo,
  JornadaEstudiante,
  ModalidadEstudiante,
  Parentesco,
  TipoDocumento,
  TipoUsuario,
} from '@prisma/client'

type Tx = Prisma.TransactionClient

export interface RegistrarUsuarioData {
  primer_nombre: string
  segundo_nombre?: string
  primer_apellido: string
  segundo_apellido?: string
  email_contacto: string
  telefono_contacto?: string
  documento: string
  tipo_documento: TipoDocumento
  fecha_nacimiento?: Date
  genero: Genero
  genero_otro?: string
  eps?: string
  grupo_sanguineo?: GrupoSanguineo
  nombre_emergencia?: string
  telefono_emergencia?: string
  parentesco_emergencia?: Parentesco
  parentesco_otro?: string
  tipo_usuario: TipoUsuario
  // Estudiante
  id_programa?: string
  numero_carnet?: string
  semestre?: number
  modalidad?: ModalidadEstudiante
  jornada?: JornadaEstudiante
  es_egresado?: boolean
  // Profesor / Administrativo
  id_cargo?: string
  id_area?: string
  // Acudiente (requerido si menor de 18)
  acudiente_primer_nombre?: string
  acudiente_primer_apellido?: string
  acudiente_documento?: string
  acudiente_tipo_documento?: TipoDocumento
  acudiente_telefono_contacto?: string
}

const SALT_ROUNDS = 10

function calcularEdad(fechaNacimiento: Date): number {
  const hoy = new Date()
  let edad = hoy.getFullYear() - fechaNacimiento.getFullYear()
  const mes = hoy.getMonth() - fechaNacimiento.getMonth()
  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
    edad--
  }
  return edad
}

export async function registrarUsuario(data: RegistrarUsuarioData) {
  const passwordHash = await bcrypt.hash(data.documento, SALT_ROUNDS)
  const esMenor = data.fecha_nacimiento ? calcularEdad(data.fecha_nacimiento) < 18 : false

  return prisma.$transaction(async (tx: Tx) => {
    const usuario = await tx.usuario.create({
      data: {
        primer_nombre: data.primer_nombre,
        segundo_nombre: data.segundo_nombre,
        primer_apellido: data.primer_apellido,
        segundo_apellido: data.segundo_apellido,
        email_contacto: data.email_contacto,
        telefono_contacto: data.telefono_contacto,
        documento: data.documento,
        tipo_documento: data.tipo_documento,
        fecha_nacimiento: data.fecha_nacimiento,
        genero: data.genero,
        genero_otro: data.genero_otro,
        eps: data.eps,
        grupo_sanguineo: data.grupo_sanguineo,
        nombre_emergencia: data.nombre_emergencia,
        telefono_emergencia: data.telefono_emergencia,
        parentesco_emergencia: data.parentesco_emergencia,
        parentesco_otro: data.parentesco_otro,
        tipo_usuario: data.tipo_usuario,
        rol: 'usuario',
        estado: 'pendiente',
        password_hash: passwordHash,
        debe_cambiar_password: true,
      },
    })

    await crearFilaHija(tx, usuario.id_usuario, data)

    if (esMenor) {
      await tx.acudiente.create({
        data: {
          id_usuario_acudido: usuario.id_usuario,
          primer_nombre: data.acudiente_primer_nombre!,
          primer_apellido: data.acudiente_primer_apellido!,
          documento: data.acudiente_documento!,
          tipo_documento: data.acudiente_tipo_documento ?? 'CC',
          telefono_contacto: data.acudiente_telefono_contacto,
        },
      })
    }

    return usuario
  })
}

async function crearFilaHija(tx: Tx, idUsuario: string, data: RegistrarUsuarioData): Promise<void> {
  if (data.tipo_usuario === 'estudiante') {
    await tx.estudiante.create({
      data: {
        id_usuario: idUsuario,
        id_programa: data.id_programa!,
        numero_carnet: data.numero_carnet,
        semestre: data.semestre,
        modalidad: data.modalidad,
        jornada: data.jornada,
        es_egresado: data.es_egresado ?? false,
      },
    })
    return
  }

  if (data.tipo_usuario === 'profesor') {
    await tx.profesor.create({
      data: {
        id_usuario: idUsuario,
        id_cargo: data.id_cargo!,
        id_area: data.id_area!,
      },
    })
    return
  }

  await tx.administrativo.create({
    data: {
      id_usuario: idUsuario,
      id_cargo: data.id_cargo!,
      id_area: data.id_area!,
    },
  })
}

export function usuarioPublico(usuario: { id_usuario: string; primer_nombre: string; primer_apellido: string; email_contacto: string; documento: string; rol: string; tipo_usuario: string; estado: string; debe_cambiar_password: boolean }) {
  return {
    id_usuario: usuario.id_usuario,
    primer_nombre: usuario.primer_nombre,
    primer_apellido: usuario.primer_apellido,
    email_contacto: usuario.email_contacto,
    documento: usuario.documento,
    rol: usuario.rol,
    tipo_usuario: usuario.tipo_usuario,
    estado: usuario.estado,
    debe_cambiar_password: usuario.debe_cambiar_password,
  }
}

export async function listarUsuarios() {
  const usuarios = await prisma.usuario.findMany({
    orderBy: { fecha_creacion: 'desc' },
    include: {
      estudiante: { include: { programa: true } },
      profesor: { include: { cargo: true, area: true } },
      administrativo: { include: { cargo: true, area: true } },
      huella: { select: { id_huella: true, indice_sensor: true } },
      aceptaciones: { select: { id_doc_legal: true, documento: { select: { tipo: true } } } },
      acudiente_de: true,
    },
  })

  return usuarios.map((u) => ({
    ...usuarioPublico(u),
    fecha_nacimiento: u.fecha_nacimiento,
    fecha_creacion: u.fecha_creacion,
    parq_realizado: u.parq_realizado,
    tiene_huella: !!u.huella,
    acepta_contrato: u.aceptaciones.some((a) => a.documento.tipo === 'contrato_gym'),
    acepta_tratamiento: u.aceptaciones.some((a) => a.documento.tipo === 'tratamiento_datos'),
    acudiente: u.acudiente_de ?? null,
    estudiante: u.estudiante
      ? {
          id_programa: u.estudiante.id_programa,
          semestre: u.estudiante.semestre,
          modalidad: u.estudiante.modalidad,
          jornada: u.estudiante.jornada,
          programa: u.estudiante.programa,
        }
      : null,
    profesor: u.profesor
      ? { id_cargo: u.profesor.id_cargo, id_area: u.profesor.id_area, cargo: u.profesor.cargo, area: u.profesor.area }
      : null,
    administrativo: u.administrativo
      ? { id_cargo: u.administrativo.id_cargo, id_area: u.administrativo.id_area, cargo: u.administrativo.cargo, area: u.administrativo.area }
      : null,
  }))
}

export async function obtenerUsuarioPorId(idUsuario: string) {
  const usuario = await prisma.usuario.findUnique({
    where: { id_usuario: idUsuario },
    include: {
      estudiante: { include: { programa: true } },
      profesor: { include: { cargo: true, area: true } },
      administrativo: { include: { cargo: true, area: true } },
      huella: { select: { id_huella: true, indice_sensor: true, activo: true } },
      aceptaciones: { select: { id_doc_legal: true, fecha_aceptacion: true, documento: { select: { tipo: true } } } },
      acudiente_de: true,
    },
  })

  if (!usuario) return null

  return {
    ...usuarioPublico(usuario),
    fecha_nacimiento: usuario.fecha_nacimiento,
    fecha_creacion: usuario.fecha_creacion,
    fecha_modificacion: usuario.fecha_modificacion,
    parq_realizado: usuario.parq_realizado,
    fecha_parq: usuario.fecha_parq,
    huella: usuario.huella,
    acepta_contrato: usuario.aceptaciones.some((a) => a.documento.tipo === 'contrato_gym'),
    acepta_tratamiento: usuario.aceptaciones.some((a) => a.documento.tipo === 'tratamiento_datos'),
    acudiente: usuario.acudiente_de ?? null,
    estudiante: usuario.estudiante,
    profesor: usuario.profesor,
    administrativo: usuario.administrativo,
  }
}

export async function aceptarDocumento(idUsuario: string, idActivador: string, tipoDocumento: 'contrato_gym' | 'tratamiento_datos') {
  const docLegal = await prisma.documentoLegal.findFirst({
    where: { tipo: tipoDocumento, estado: 'vigente' },
  })

  if (!docLegal) {
    throw new HttpError(404, `No existe un documento vigente de tipo "${tipoDocumento}"`)
  }

  return prisma.$transaction(async (tx: Tx) => {
    const aceptacion = await tx.aceptacionDocumento.upsert({
      where: {
        id_doc_legal_id_usuario: {
          id_doc_legal: docLegal.id_doc_legal,
          id_usuario: idUsuario,
        },
      },
      update: {
        id_activador: idActivador,
        fecha_aceptacion: new Date(),
      },
      create: {
        id_doc_legal: docLegal.id_doc_legal,
        id_usuario: idUsuario,
        id_activador: idActivador,
      },
    })

    await verificarYActivarSiCompleto(tx, idUsuario)

    return aceptacion
  })
}

export async function marcarParq(idUsuario: string) {
  return prisma.$transaction(async (tx: Tx) => {
    await tx.usuario.update({
      where: { id_usuario: idUsuario },
      data: { parq_realizado: true, fecha_parq: new Date() },
    })

    await verificarYActivarSiCompleto(tx, idUsuario)
  })
}

export async function desactivarUsuario(id: string) {
  const usuario = await prisma.usuario.findUnique({ where: { id_usuario: id } })
  if (!usuario) throw new HttpError(404, 'Usuario no encontrado')

  return prisma.usuario.update({
    where: { id_usuario: id },
    data: { estado: 'inactivo' },
  })
}

export async function activarUsuario(id: string) {
  const usuario = await prisma.usuario.findUnique({ where: { id_usuario: id } })
  if (!usuario) throw new HttpError(404, 'Usuario no encontrado')

  return prisma.usuario.update({
    where: { id_usuario: id },
    data: { estado: 'activo' },
  })
}

export async function registrarHuella(idUsuario: string, idSensor: number) {
  return prisma.$transaction(async (tx: Tx) => {
    const huella = await tx.huella.upsert({
      where: { id_usuario: idUsuario },
      update: { indice_sensor: idSensor, activo: true },
      create: { id_usuario: idUsuario, indice_sensor: idSensor },
    })

    await verificarYActivarSiCompleto(tx, idUsuario)

    return huella
  })
}

async function verificarYActivarSiCompleto(tx: Tx, idUsuario: string) {
  const [contratoDoc, tratamientoDoc] = await Promise.all([
    tx.documentoLegal.findFirst({ where: { tipo: 'contrato_gym', estado: 'vigente' }, select: { id_doc_legal: true } }),
    tx.documentoLegal.findFirst({ where: { tipo: 'tratamiento_datos', estado: 'vigente' }, select: { id_doc_legal: true } }),
  ])

  if (!contratoDoc || !tratamientoDoc) return

  const [huella, contrato, tratamiento, usuario] = await Promise.all([
    tx.huella.findUnique({ where: { id_usuario: idUsuario } }),
    tx.aceptacionDocumento.findUnique({
      where: { id_doc_legal_id_usuario: { id_doc_legal: contratoDoc.id_doc_legal, id_usuario: idUsuario } },
    }),
    tx.aceptacionDocumento.findUnique({
      where: { id_doc_legal_id_usuario: { id_doc_legal: tratamientoDoc.id_doc_legal, id_usuario: idUsuario } },
    }),
    tx.usuario.findUnique({
      where: { id_usuario: idUsuario },
      select: { parq_realizado: true, estado: true, fecha_nacimiento: true },
    }),
  ])

  if (!usuario || usuario.estado === 'activo') return

  const todasCondiciones = !!huella && !!contrato && !!tratamiento && usuario.parq_realizado
  if (!todasCondiciones) return

  // Si es menor de edad, verificar que exista acudiente
  if (usuario.fecha_nacimiento) {
    const hoy = new Date()
    let edad = hoy.getFullYear() - usuario.fecha_nacimiento.getFullYear()
    const mes = hoy.getMonth() - usuario.fecha_nacimiento.getMonth()
    if (mes < 0 || (mes === 0 && hoy.getDate() < usuario.fecha_nacimiento.getDate())) {
      edad--
    }
    if (edad < 18) {
      const acudiente = await tx.acudiente.findUnique({ where: { id_usuario_acudido: idUsuario } })
      if (!acudiente) return
    }
  }

  await tx.usuario.update({
    where: { id_usuario: idUsuario },
    data: { estado: 'activo' },
  })
}