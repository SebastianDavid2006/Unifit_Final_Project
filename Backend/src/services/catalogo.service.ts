import { prisma } from '../utils/prisma'

export async function listarProgramas() {
  return prisma.programa.findMany({ orderBy: { nombre: 'asc' } })
}

export async function listarCargos() {
  return prisma.cargo.findMany({ orderBy: { nombre: 'asc' } })
}

export async function listarAreas() {
  return prisma.area.findMany({ orderBy: { nombre: 'asc' } })
}