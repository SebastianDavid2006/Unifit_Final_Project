import { prisma } from '../utils/prisma'
import { HttpError } from '../utils/HttpError'
import type { Universidad, NivelPrograma } from '@prisma/client'

export async function listarProgramas(incluirInactivos = false) {
  return prisma.programa.findMany({
    where: incluirInactivos ? undefined : { activo: true },
    orderBy: { nombre: 'asc' },
  })
}

export async function crearPrograma(nombre: string, universidad: Universidad, tipo_programa: NivelPrograma) {
  return prisma.programa.create({ data: { nombre, universidad, tipo_programa } })
}

export async function actualizarPrograma(
  id: string,
  data: { nombre?: string; universidad?: Universidad; tipo_programa?: NivelPrograma; activo?: boolean },
) {
  const existente = await prisma.programa.findUnique({ where: { id_programa: id } })
  if (!existente) throw new HttpError(404, 'Programa no encontrado')
  return prisma.programa.update({ where: { id_programa: id }, data })
}

export async function eliminarPrograma(id: string) {
  const existente = await prisma.programa.findUnique({ where: { id_programa: id } })
  if (!existente) throw new HttpError(404, 'Programa no encontrado')
  await prisma.programa.update({ where: { id_programa: id }, data: { activo: false } })
}

export async function listarCargos(incluirInactivos = false) {
  return prisma.cargo.findMany({
    where: incluirInactivos ? undefined : { activo: true },
    orderBy: { nombre: 'asc' },
  })
}

export async function listarAreas(incluirInactivos = false) {
  return prisma.area.findMany({
    where: incluirInactivos ? undefined : { activo: true },
    orderBy: { nombre: 'asc' },
  })
}

export async function crearCargo(nombre: string) {
  return prisma.cargo.create({ data: { nombre } })
}

export async function crearArea(nombre: string) {
  return prisma.area.create({ data: { nombre } })
}

export async function actualizarCargo(id: string, data: { nombre?: string; activo?: boolean }) {
  const existente = await prisma.cargo.findUnique({ where: { id_cargo: id } })
  if (!existente) throw new HttpError(404, 'Cargo no encontrado')
  return prisma.cargo.update({ where: { id_cargo: id }, data })
}

export async function actualizarArea(id: string, data: { nombre?: string; activo?: boolean }) {
  const existente = await prisma.area.findUnique({ where: { id_area: id } })
  if (!existente) throw new HttpError(404, 'Área no encontrada')
  return prisma.area.update({ where: { id_area: id }, data })
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