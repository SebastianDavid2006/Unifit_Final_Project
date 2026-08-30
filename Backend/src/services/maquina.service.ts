import { prisma } from '../utils/prisma'
import { HttpError } from '../utils/HttpError'

export interface CrearMaquinaData {
  nombre: string
  descripcion?: string
  grupos_musculares: string[]
  nivel?: string
  url_multimedia?: string
  ejercicioIds?: string[]
  id_creador: string
}

export interface EditarMaquinaData {
  nombre?: string
  descripcion?: string
  grupos_musculares?: string[]
  nivel?: string
  url_multimedia?: string
  ejercicioIds?: string[]
}

export async function listarMaquinasActivas() {
  return prisma.maquina.findMany({
    where: { estado: { not: 'sin_servicio' } },
    orderBy: { nombre: 'asc' },
    include: {
      ejercicios: {
        select: { id_ejercicio: true },
      },
    },
  })
}

export async function obtenerMaquinaPorId(id: string) {
  return prisma.maquina.findUnique({
    where: { id_maquina: id },
    include: {
      ejercicios: {
        select: { id_ejercicio: true },
      },
    },
  })
}

export async function crearMaquina(data: CrearMaquinaData) {
  return prisma.$transaction(async (tx) => {
    const maquina = await tx.maquina.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        grupos_musculares: data.grupos_musculares as any,
        nivel: (data.nivel as any) ?? 'principiante',
        url_multimedia: data.url_multimedia,
        id_creador: data.id_creador,
      },
    })

    if (data.ejercicioIds?.length) {
      await tx.maquinaEjercicio.createMany({
        data: data.ejercicioIds.map((id_ejercicio) => ({
          id_maquina: maquina.id_maquina,
          id_ejercicio,
        })),
      })
    }

    return maquina
  })
}

export async function editarMaquina(id: string, data: EditarMaquinaData) {
  const maquina = await prisma.maquina.findUnique({ where: { id_maquina: id } })
  if (!maquina) throw new HttpError(404, 'Máquina no encontrada')

  return prisma.$transaction(async (tx) => {
    const updated = await tx.maquina.update({
      where: { id_maquina: id },
      data: {
        ...(data.nombre !== undefined && { nombre: data.nombre }),
        ...(data.descripcion !== undefined && { descripcion: data.descripcion }),
        ...(data.grupos_musculares !== undefined && { grupos_musculares: data.grupos_musculares as any }),
        ...(data.nivel !== undefined && { nivel: data.nivel as any }),
        ...(data.url_multimedia !== undefined && { url_multimedia: data.url_multimedia }),
      },
    })

    if (data.ejercicioIds !== undefined) {
      await tx.maquinaEjercicio.deleteMany({ where: { id_maquina: id } })
      if (data.ejercicioIds.length) {
        await tx.maquinaEjercicio.createMany({
          data: data.ejercicioIds.map((id_ejercicio) => ({
            id_maquina: id,
            id_ejercicio,
          })),
        })
      }
    }

    return updated
  })
}

export async function desactivarMaquina(id: string) {
  const maquina = await prisma.maquina.findUnique({ where: { id_maquina: id } })
  if (!maquina) throw new HttpError(404, 'Máquina no encontrada')

  return prisma.maquina.update({
    where: { id_maquina: id },
    data: { estado: 'sin_servicio' },
  })
}
