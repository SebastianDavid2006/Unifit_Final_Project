import { prisma } from '../utils/prisma'
import { HttpError } from '../utils/HttpError'
import type { Prisma } from '@prisma/client'

type Tx = Prisma.TransactionClient

const MAX_DURACION_MINUTOS = 360

export async function registrarDesdeSensor(indiceSensor: number) {
  const huella = await prisma.huella.findUnique({
    where: { indice_sensor: indiceSensor },
    select: { id_usuario: true },
  })

  if (!huella) {
    throw new HttpError(404, 'Huella no registrada en el sistema')
  }

  return prisma.$transaction(async (tx: Tx) => {
    const abierta = await tx.asistencia.findFirst({
      where: { id_usuario: huella.id_usuario, hora_salida: null },
    })

    const now = new Date()

    if (abierta) {
      const duracion = Math.floor((now.getTime() - abierta.hora_ingreso.getTime()) / 60000)
      const duracionFinal = Math.min(duracion, MAX_DURACION_MINUTOS)
      const observacion = duracion > MAX_DURACION_MINUTOS
        ? 'Cierre automático: límite 6h'
        : (abierta.observaciones ?? '')

      const actualizada = await tx.asistencia.update({
        where: { id_asistencia: abierta.id_asistencia },
        data: {
          hora_salida: now,
          duracion_minutos: duracionFinal,
          observaciones: observacion,
        },
      })

      return { tipo: 'salida', asistencia: actualizada }
    } else {
      const nueva = await tx.asistencia.create({
        data: {
          id_usuario: huella.id_usuario,
          hora_ingreso: now,
        },
      })

      return { tipo: 'entrada', asistencia: nueva }
    }
  })
}

export async function listarAsistencias(filtros: {
  id_usuario?: string
  fecha_desde?: Date
  fecha_hasta?: Date
  page?: number
  pageSize?: number
}) {
  const { id_usuario, fecha_desde, fecha_hasta, page = 1, pageSize = 20 } = filtros

  const where: Prisma.AsistenciaWhereInput = {}
  if (id_usuario) where.id_usuario = id_usuario
  if (fecha_desde || fecha_hasta) {
    where.fecha = {}
    if (fecha_desde) where.fecha.gte = fecha_desde
    if (fecha_hasta) where.fecha.lte = fecha_hasta
  }

  const [total, asistencias] = await Promise.all([
    prisma.asistencia.count({ where }),
    prisma.asistencia.findMany({
      where,
      include: {
        usuario: {
          select: {
            id_usuario: true,
            primer_nombre: true,
            primer_apellido: true,
            documento: true,
            email_contacto: true,
          },
        },
      },
      orderBy: { fecha: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ])

  return {
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    asistencias,
  }
}

export async function obtenerHistorialUsuario(idUsuario: string, page = 1, pageSize = 20) {
  const [total, asistencias] = await Promise.all([
    prisma.asistencia.count({ where: { id_usuario: idUsuario } }),
    prisma.asistencia.findMany({
      where: { id_usuario: idUsuario },
      orderBy: { fecha: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ])

  return {
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    asistencias,
  }
}

export async function obtenerResumenSemana(fechaInicio: Date, fechaFin: Date) {
  const asistencias = await prisma.asistencia.findMany({
    where: {
      fecha: { gte: fechaInicio, lte: fechaFin },
    },
    select: {
      fecha: true,
      hora_ingreso: true,
      hora_salida: true,
      duracion_minutos: true,
    },
  })

  const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  const resumen: Record<string, { asistentes: number; duracion_promedio: number }> = {}

  for (const a of asistencias) {
    const dia = diasSemana[a.fecha.getDay()]
    if (!resumen[dia]) resumen[dia] = { asistentes: 0, duracion_promedio: 0 }
    resumen[dia].asistentes++
    if (a.duracion_minutos) {
      resumen[dia].duracion_promedio += a.duracion_minutos
    }
  }

  for (const dia of Object.keys(resumen)) {
    if (resumen[dia].asistentes > 0) {
      resumen[dia].duracion_promedio = Math.round(resumen[dia].duracion_promedio / resumen[dia].asistentes)
    }
  }

  return diasSemana.map(dia => ({
    dia,
    ...(resumen[dia] || { asistentes: 0, duracion_promedio: 0 }),
  }))
}

export async function obtenerEvolucion(fechaInicio: Date, fechaFin: Date, agrupacion: 'dia' | 'semana' | 'mes' = 'dia') {
  const asistencias = await prisma.asistencia.findMany({
    where: {
      fecha: { gte: fechaInicio, lte: fechaFin },
    },
    select: {
      fecha: true,
      duracion_minutos: true,
    },
  })

  const grupos: Record<string, { usuarios: number; duracion_total: number }> = {}

  for (const a of asistencias) {
    let key: string
    const d = a.fecha
    if (agrupacion === 'dia') {
      key = d.toISOString().split('T')[0]
    } else if (agrupacion === 'semana') {
      const inicioSemana = new Date(d)
      inicioSemana.setDate(d.getDate() - d.getDay())
      key = inicioSemana.toISOString().split('T')[0]
    } else {
      key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    }

    if (!grupos[key]) grupos[key] = { usuarios: 0, duracion_total: 0 }
    grupos[key].usuarios++
    if (a.duracion_minutos) grupos[key].duracion_total += a.duracion_minutos
  }

  return Object.entries(grupos).map(([fecha, data]) => ({
    fecha,
    usuarios: data.usuarios,
    duracion_promedio: data.usuarios > 0 ? Math.round(data.duracion_total / data.usuarios) : 0,
  })).sort((a, b) => a.fecha.localeCompare(b.fecha))
}

export async function actualizarAsistencia(idAsistencia: string, data: {
  hora_ingreso?: Date
  hora_salida?: Date
  duracion_minutos?: number
  observaciones?: string
}) {
  const existente = await prisma.asistencia.findUnique({
    where: { id_asistencia: idAsistencia },
  })

  if (!existente) {
    throw new HttpError(404, 'Registro de asistencia no encontrado')
  }

  return prisma.asistencia.update({
    where: { id_asistencia: idAsistencia },
    data,
  })
}