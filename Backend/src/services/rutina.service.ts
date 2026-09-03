import { prisma } from '../utils/prisma'
import { HttpError } from '../utils/HttpError'

export interface CrearRutinaEjercicioData {
  id_ejercicio: string
  dia_semana: string
  series?: number
  repeticiones_min?: number
  repeticiones_max?: number
  descanso?: number
  observaciones?: string
}

export interface CrearRutinaData {
  id_usuario: string
  nombre: string
  duracion?: string
  nivel?: string
  observaciones?: string
  ejercicios: CrearRutinaEjercicioData[]
}

export interface EditarRutinaData {
  nombre?: string
  duracion?: string
  nivel?: string
  observaciones?: string
  ejercicios?: CrearRutinaEjercicioData[]
}

const DURACION_MAP: Record<string, string> = {
  '4 semanas': 'cuatro_semanas',
  '8 semanas': 'ocho_semanas',
  '12 semanas': 'doce_semanas',
  '16 semanas': 'dieciseis_semanas',
}

function parsearDuracion(duracion?: string): string | null {
  if (!duracion) return null
  return DURACION_MAP[duracion] ?? null
}

function validarEjercicio(ej: CrearRutinaEjercicioData, index: number) {
  if (ej.series !== undefined && (ej.series < 1 || ej.series > 20)) {
    throw new HttpError(400, `Ejercicio #${index + 1}: series debe estar entre 1 y 20`)
  }
  if (ej.repeticiones_min !== undefined && (ej.repeticiones_min < 1 || ej.repeticiones_min > 100)) {
    throw new HttpError(400, `Ejercicio #${index + 1}: repeticiones_min debe estar entre 1 y 100`)
  }
  if (ej.repeticiones_max !== undefined && (ej.repeticiones_max < 1 || ej.repeticiones_max > 100)) {
    throw new HttpError(400, `Ejercicio #${index + 1}: repeticiones_max debe estar entre 1 y 100`)
  }
  if (ej.repeticiones_min !== undefined && ej.repeticiones_max !== undefined && ej.repeticiones_min > ej.repeticiones_max) {
    throw new HttpError(400, `Ejercicio #${index + 1}: repeticiones_min no puede ser mayor que repeticiones_max`)
  }
  if (ej.descanso !== undefined && (ej.descanso < 0 || ej.descanso > 600)) {
    throw new HttpError(400, `Ejercicio #${index + 1}: descanso debe estar entre 0 y 600 segundos`)
  }
}

function prepararEjercicio(ej: CrearRutinaEjercicioData, orden: number) {
  return {
    id_ejercicio: ej.id_ejercicio,
    dia_semana: ej.dia_semana.toLowerCase() as any,
    series: ej.series ?? null,
    repeticiones_min: ej.repeticiones_min ?? null,
    repeticiones_max: ej.repeticiones_max ?? null,
    descanso: ej.descanso ?? null,
    orden,
    observaciones: ej.observaciones ?? null,
  }
}

export async function listarRutinasActivas() {
  return prisma.rutina.findMany({
    where: { estado: 'activa' },
    include: {
      usuario: {
        select: {
          id_usuario: true,
          primer_nombre: true,
          primer_apellido: true,
          documento: true,
        },
      },
      creador: {
        select: {
          id_usuario: true,
          primer_nombre: true,
          primer_apellido: true,
        },
      },
      _count: { select: { ejercicios: true, sesiones: true } },
    },
    orderBy: { fecha_creacion: 'desc' },
  })
}

export async function obtenerRutinaPorId(id: string) {
  const rutina = await prisma.rutina.findUnique({
    where: { id_rutina: id },
    include: {
      usuario: {
        select: {
          id_usuario: true,
          primer_nombre: true,
          primer_apellido: true,
          documento: true,
        },
      },
      creador: {
        select: {
          id_usuario: true,
          primer_nombre: true,
          primer_apellido: true,
        },
      },
      ejercicios: {
        orderBy: [{ dia_semana: 'asc' }, { orden: 'asc' }],
        include: {
          ejercicio: {
            select: {
              id_ejercicio: true,
              nombre: true,
              descripcion: true,
              url_multimedia: true,
            },
          },
        },
      },
      _count: { select: { sesiones: true } },
    },
  })

  if (!rutina) return null
  if (rutina.estado === 'cancelada') return null

  return rutina
}

export async function listarRutinasPorUsuario(id_usuario: string) {
  return prisma.rutina.findMany({
    where: { id_usuario, estado: 'activa' },
    include: {
      ejercicios: {
        orderBy: [{ dia_semana: 'asc' }, { orden: 'asc' }],
        include: {
          ejercicio: {
            select: {
              id_ejercicio: true,
              nombre: true,
              url_multimedia: true,
            },
          },
        },
      },
      _count: { select: { sesiones: true } },
    },
    orderBy: { fecha_creacion: 'desc' },
  })
}

export async function crearRutina(data: CrearRutinaData, id_creador: string) {
  const usuario = await prisma.usuario.findUnique({
    where: { id_usuario: data.id_usuario },
    select: { id_usuario: true },
  })
  if (!usuario) throw new HttpError(404, 'Usuario no encontrado')

  if (!data.ejercicios || data.ejercicios.length === 0) {
    throw new HttpError(400, 'Debe incluir al menos un ejercicio')
  }

  data.ejercicios.forEach((ej, i) => validarEjercicio(ej, i))

  const duracionEnum = parsearDuracion(data.duracion)

  const valoracionReciente = await prisma.valoracion.findFirst({
    where: {
      id_usuario: data.id_usuario,
      activo: true,
      rutina: null,
    },
    orderBy: { fecha_creacion: 'desc' },
    select: { id_valoracion: true },
  })
  if (!valoracionReciente) {
    throw new HttpError(400, 'El usuario no tiene valoraciones disponibles para asociar a una rutina')
  }

  return prisma.$transaction(async (tx) => {
    const rutina = await tx.rutina.create({
      data: {
        id_usuario: data.id_usuario,
        id_creador,
        id_valoracion: valoracionReciente.id_valoracion,
        nombre: data.nombre,
        duracion: duracionEnum as any,
        nivel: (data.nivel?.toLowerCase() ?? 'principiante') as any,
        observaciones: data.observaciones,
      },
    })

    const ejerciciosData = data.ejercicios.map((ej, i) => ({
      ...prepararEjercicio(ej, i + 1),
      id_rutina: rutina.id_rutina,
    }))

    await tx.rutinaEjercicio.createMany({ data: ejerciciosData })

    return rutina
  })
}

export async function editarRutina(id: string, data: EditarRutinaData) {
  const rutina = await prisma.rutina.findUnique({ where: { id_rutina: id } })
  if (!rutina) throw new HttpError(404, 'Rutina no encontrada')
  if (rutina.estado === 'cancelada') throw new HttpError(400, 'No se puede editar una rutina cancelada')

  if (data.ejercicios) {
    if (data.ejercicios.length === 0) {
      throw new HttpError(400, 'Debe incluir al menos un ejercicio')
    }
    data.ejercicios.forEach((ej, i) => validarEjercicio(ej, i))
  }

  const duracionEnum = data.duracion !== undefined ? parsearDuracion(data.duracion) : undefined

  return prisma.$transaction(async (tx) => {
    const updated = await tx.rutina.update({
      where: { id_rutina: id },
      data: {
        ...(data.nombre !== undefined && { nombre: data.nombre }),
        ...(duracionEnum !== undefined && { duracion: duracionEnum as any }),
        ...(data.nivel !== undefined && { nivel: data.nivel.toLowerCase() as any }),
        ...(data.observaciones !== undefined && { observaciones: data.observaciones }),
      },
    })

    if (data.ejercicios) {
      await tx.rutinaEjercicio.deleteMany({ where: { id_rutina: id } })

      const ejerciciosData = data.ejercicios.map((ej, i) => ({
        ...prepararEjercicio(ej, i + 1),
        id_rutina: id,
      }))

      await tx.rutinaEjercicio.createMany({ data: ejerciciosData })
    }

    return updated
  })
}

export async function desactivarRutina(id: string) {
  const rutina = await prisma.rutina.findUnique({ where: { id_rutina: id } })
  if (!rutina) throw new HttpError(404, 'Rutina no encontrada')

  return prisma.rutina.update({
    where: { id_rutina: id },
    data: { estado: 'cancelada' },
  })
}
