import { prisma } from '../utils/prisma'
import { HttpError } from '../utils/HttpError'
import { verificarYActivarSiCompleto } from './usuario.service'
import type { Prisma } from '@prisma/client'

type Tx = Prisma.TransactionClient

const SENSOR_SLOTS_MAX = 100
const ENROLAMIENTO_TIMEOUT_MIN = 10

export async function iniciarEnrolamiento(idUsuario: string) {
  const usuario = await prisma.usuario.findUnique({
    where: { id_usuario: idUsuario },
    select: { id_usuario: true, estado: true },
  })
  if (!usuario) throw new HttpError(404, 'Usuario no encontrado')

  const huellaExistente = await prisma.huella.findUnique({
    where: { id_usuario: idUsuario },
  })
  if (huellaExistente && huellaExistente.activo) {
    throw new HttpError(409, 'El usuario ya tiene una huella registrada. Use actualizar si desea reemplazarla.')
  }

  const slotsOcupados = await prisma.huella.findMany({
    select: { indice_sensor: true },
  })
  const ocupados = new Set(slotsOcupados.map((h) => h.indice_sensor))
  let indiceSensor = 1
  while (ocupados.has(indiceSensor) && indiceSensor <= SENSOR_SLOTS_MAX) {
    indiceSensor++
  }
  if (indiceSensor > SENSOR_SLOTS_MAX) {
    throw new HttpError(507, 'No hay slots disponibles en el sensor AS608')
  }

  const huella = await prisma.huella.upsert({
    where: { id_usuario: idUsuario },
    update: { indice_sensor: indiceSensor, activo: false },
    create: { id_usuario: idUsuario, indice_sensor: indiceSensor, activo: false },
  })

  return { indice_sensor: huella.indice_sensor }
}

export async function registrarHuellaDesdeSensor(idUsuario: string, indiceSensor: number, templateHuella: string) {
  return prisma.$transaction(async (tx: Tx) => {
    const huella = await tx.huella.findUnique({
      where: { id_usuario: idUsuario },
    })

    if (!huella) {
      throw new HttpError(404, 'No hay enrolamiento pendiente para este usuario. Inicie enrolamiento primero.')
    }

    if (huella.activo) {
      throw new HttpError(409, 'El usuario ya tiene una huella activa.')
    }

    const actualizada = await tx.huella.update({
      where: { id_usuario: idUsuario },
      data: {
        indice_sensor: indiceSensor,
        activo: true,
      },
    })

    await verificarYActivarSiCompleto(tx, idUsuario)

    return actualizada
  })
}

export async function obtenerHuellasPendientes() {
  const limite = new Date(Date.now() - ENROLAMIENTO_TIMEOUT_MIN * 60 * 1000)

  await prisma.huella.deleteMany({
    where: { activo: false, fecha_creacion: { lt: limite } },
  })

  return prisma.huella.findMany({
    where: { activo: false, fecha_creacion: { gte: limite } },
    select: {
      id_usuario: true,
      indice_sensor: true,
      fecha_creacion: true,
    },
    orderBy: { fecha_creacion: 'asc' },
  })
}

export async function obtenerEstadoHuella(idUsuario: string) {
  const huella = await prisma.huella.findUnique({
    where: { id_usuario: idUsuario },
    select: {
      id_huella: true,
      indice_sensor: true,
      activo: true,
      fecha_creacion: true,
    },
  })

  return {
    tiene_huella: !!huella && huella.activo,
    huella: huella ?? null,
  }
}

export async function listarHuellas() {
  return prisma.huella.findMany({
    where: { activo: true },
    select: {
      id_huella: true,
      id_usuario: true,
      indice_sensor: true,
      fecha_creacion: true,
      usuario: {
        select: {
          primer_nombre: true,
          primer_apellido: true,
          documento: true,
          email_contacto: true,
        },
      },
    },
    orderBy: { fecha_creacion: 'desc' },
  })
}
