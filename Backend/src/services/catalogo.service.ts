import { prisma } from '../utils/prisma'
import { HttpError } from '../utils/HttpError'

export async function listarProgramas() {
  return prisma.programa.findMany({ where: { activo: true }, orderBy: { nombre: 'asc' } })
}

export async function listarCargos() {
  return prisma.cargo.findMany({ where: { activo: true }, orderBy: { nombre: 'asc' } })
}

export async function listarAreas() {
  return prisma.area.findMany({ where: { activo: true }, orderBy: { nombre: 'asc' } })
}

export async function crearCargo(nombre: string) {
  return prisma.cargo.create({ data: { nombre } })
}

export async function crearArea(nombre: string) {
  return prisma.area.create({ data: { nombre } })
}

export async function actualizarCargo(id: string, nombre: string) {
  const existente = await prisma.cargo.findUnique({ where: { id_cargo: id } })
  if (!existente) throw new HttpError(404, 'Cargo no encontrado')
  return prisma.cargo.update({ where: { id_cargo: id }, data: { nombre } })
}

export async function actualizarArea(id: string, nombre: string) {
  const existente = await prisma.area.findUnique({ where: { id_area: id } })
  if (!existente) throw new HttpError(404, 'Área no encontrada')
  return prisma.area.update({ where: { id_area: id }, data: { nombre } })
}

export async function eliminarCargo(id: string) {
  const existente = await prisma.cargo.findUnique({ where: { id_cargo: id } })
  if (!existente) throw new HttpError(404, 'Cargo no encontrado')
  await prisma.cargo.update({ where: { id_cargo: id }, data: { activo: false } })
}

export async function eliminarArea(id: string) {
  const existente = await prisma.area.findUnique({ where: { id_area: id } })
  if (!existente) throw new HttpError(404, 'Área no encontrada')
  await prisma.area.update({ where: { id_area: id }, data: { activo: false } })
}