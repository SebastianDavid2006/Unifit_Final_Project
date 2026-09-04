import { prisma } from '../utils/prisma'
import { HttpError } from '../utils/HttpError'
import { verificarYActivarSiCompleto } from './usuario.service'
import type { Prisma } from '@prisma/client'

type Tx = Prisma.TransactionClient

const SENSOR_SLOTS_MAX = 250
const ENROLAMIENTO_TIMEOUT_MIN = 10

function logBiometria(msg: string, data?: any) {
  console.log(`[BIOMETRIA] ${new Date().toISOString()} | ${msg}`, data ?? '')
}

export async function iniciarEnrolamiento(idUsuario: string) {
  const usuario = await prisma.usuario.findUnique({
    where: { id_usuario: idUsuario },
    select: { id_usuario: true, estado: true },
  })
  if (!usuario) throw new HttpError(404, 'Usuario no encontrado')

  const huellaExistente = await prisma.huella.findUnique({
    where: { id_usuario: idUsuario },
  })

  logBiometria('iniciarEnrolamiento', { idUsuario, huellaExistente: huellaExistente ? { id_huella: huellaExistente.id_huella, indice_sensor: huellaExistente.indice_sensor, activo: huellaExistente.activo, paso_enrolamiento: huellaExistente.paso_enrolamiento, fecha_creacion: huellaExistente.fecha_creacion } : null })

  // Se reutiliza slot en caso de actualizar/reemplazar huella
  let indiceSensor: number
  if (huellaExistente && huellaExistente.indice_sensor) {
    indiceSensor = huellaExistente.indice_sensor
    logBiometria('Reutilizando slot existente (re-enrollment)', { idUsuario, indiceSensor })
  } else {
    const limiteReciente = new Date(Date.now() - ENROLAMIENTO_TIMEOUT_MIN * 60 * 1000)
    const slotsOcupados = await prisma.huella.findMany({
      where: {
        OR: [
          { activo: true },
          { activo: false, paso_enrolamiento: { not: null }, fecha_creacion: { gte: limiteReciente } },
        ],
      },
      select: { indice_sensor: true },
    })
    const ocupados = new Set(slotsOcupados.map((h) => h.indice_sensor))
    indiceSensor = 1
    while (ocupados.has(indiceSensor) && indiceSensor <= SENSOR_SLOTS_MAX) {
      indiceSensor++
    }
    if (indiceSensor > SENSOR_SLOTS_MAX) {
      throw new HttpError(507, 'No hay slots disponibles en el sensor AS608')
    }
    logBiometria('Nuevo slot asignado', { idUsuario, indiceSensor, slotsOcupados: Array.from(ocupados) })
  }

  const huella = await prisma.huella.upsert({
    where: { id_usuario: idUsuario },
    update: { indice_sensor: indiceSensor, activo: false, paso_enrolamiento: 1 },
    create: { id_usuario: idUsuario, indice_sensor: indiceSensor, activo: false, paso_enrolamiento: 1 },
  })

  logBiometria('Enrolamiento creado/actualizado', { idUsuario, id_huella: huella.id_huella, indice_sensor: huella.indice_sensor, activo: huella.activo, paso_enrolamiento: huella.paso_enrolamiento })

  return { indice_sensor: huella.indice_sensor }
}

export async function registrarHuellaDesdeSensor(idUsuario: string, indiceSensor: number) {
  logBiometria('registrarHuellaDesdeSensor INICIO', { idUsuario, indiceSensor })

  return prisma.$transaction(async (tx: Tx) => {
    const huella = await tx.huella.findUnique({
      where: { id_usuario: idUsuario },
    })

    logBiometria('registrarHuellaDesdeSensor - huella encontrada', { idUsuario, huella: huella ? { id_huella: huella.id_huella, indice_sensor: huella.indice_sensor, activo: huella.activo, paso_enrolamiento: huella.paso_enrolamiento } : null })

    if (!huella) {
      throw new HttpError(404, 'No hay enrolamiento pendiente para este usuario. Inicie enrolamiento primero.')
    }

    if (indiceSensor !== huella.indice_sensor) {
      throw new HttpError(400, 'Slot no coincide con enrolamiento asignado')
    }

    const actualizada = await tx.huella.update({
      where: { id_usuario: idUsuario },
      data: {
        indice_sensor: indiceSensor,
        activo: true,
        paso_enrolamiento: null,
      },
    })

    logBiometria('registrarHuellaDesdeSensor - huella ACTIVADA', { idUsuario, id_huella: actualizada.id_huella, indice_sensor: actualizada.indice_sensor, activo: actualizada.activo })

    await verificarYActivarSiCompleto(tx, idUsuario)

    return actualizada
  })
}

export async function limpiarEnrolamientosExpirados(): Promise<number> {
  const limite = new Date(Date.now() - ENROLAMIENTO_TIMEOUT_MIN * 60 * 1000)
  const borrados = await prisma.huella.deleteMany({
    where: { activo: false, fecha_creacion: { lt: limite } },
  })
  if (borrados.count > 0) {
    logBiometria('limpiarEnrolamientosExpirados - EXPIRADOS BORRADOS', { count: borrados.count, limite: limite.toISOString() })
  }
  return borrados.count
}

export async function obtenerHuellasPendientes() {
  const limite = new Date(Date.now() - ENROLAMIENTO_TIMEOUT_MIN * 60 * 1000)

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
      paso_enrolamiento: true,
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

export async function actualizarPasoEnrolamiento(idUsuario: string, paso: number): Promise<void> {
  const huella = await prisma.huella.findUnique({ where: { id_usuario: idUsuario } })
  if (!huella) throw new HttpError(404, 'No hay enrolamiento pendiente para este usuario')
  if (huella.activo) throw new HttpError(409, 'El usuario ya tiene huella activa')
  if (paso < 1 || paso > 3) throw new HttpError(400, 'Paso inválido (1-3)')
  await prisma.huella.update({
    where: { id_usuario: idUsuario },
    data: { paso_enrolamiento: paso },
  })
}