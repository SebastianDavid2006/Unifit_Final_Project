import bcrypt from 'bcryptjs'
import { Prisma } from '@prisma/client'
import { prisma } from '../utils/prisma'
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
}

const SALT_ROUNDS = 10

export async function registrarUsuario(data: RegistrarUsuarioData) {
  const passwordHash = await bcrypt.hash(data.documento, SALT_ROUNDS)

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