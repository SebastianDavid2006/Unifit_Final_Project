import { prisma } from '../utils/prisma'
import { HttpError } from '../utils/HttpError'

export interface CrearEjercicioData {
  nombre: string
  descripcion?: string
  grupos_musculares: string[]
  nivel?: string
  url_multimedia?: string
  id_creador: string
}

export interface EditarEjercicioData {
  nombre?: string
  descripcion?: string
  grupos_musculares?: string[]
  nivel?: string
  url_multimedia?: string
}

export async function listarEjerciciosActivos() {
  return prisma.ejercicio.findMany({
    where: { activo: true },
    orderBy: { nombre: 'asc' },
  })
}

export async function obtenerEjercicioPorId(id: string) {
  return prisma.ejercicio.findUnique({
    where: { id_ejercicio: id },
  })
}

export async function crearEjercicio(data: CrearEjercicioData) {
  return prisma.ejercicio.create({
    data: {
      nombre: data.nombre,
      descripcion: data.descripcion,
      grupos_musculares: data.grupos_musculares as any,
      nivel: (data.nivel as any) ?? 'principiante',
      url_multimedia: data.url_multimedia,
      id_creador: data.id_creador,
    },
  })
}

export async function editarEjercicio(id: string, data: EditarEjercicioData) {
  const ejercicio = await prisma.ejercicio.findUnique({ where: { id_ejercicio: id } })
  if (!ejercicio) throw new HttpError(404, 'Ejercicio no encontrado')

  return prisma.ejercicio.update({
    where: { id_ejercicio: id },
    data: {
      ...(data.nombre !== undefined && { nombre: data.nombre }),
      ...(data.descripcion !== undefined && { descripcion: data.descripcion }),
      ...(data.grupos_musculares !== undefined && { grupos_musculares: data.grupos_musculares as any }),
      ...(data.nivel !== undefined && { nivel: data.nivel as any }),
      ...(data.url_multimedia !== undefined && { url_multimedia: data.url_multimedia }),
    },
  })
}

export async function desactivarEjercicio(id: string) {
  const ejercicio = await prisma.ejercicio.findUnique({ where: { id_ejercicio: id } })
  if (!ejercicio) throw new HttpError(404, 'Ejercicio no encontrado')

  return prisma.ejercicio.update({
    where: { id_ejercicio: id },
    data: { activo: false },
  })
}
