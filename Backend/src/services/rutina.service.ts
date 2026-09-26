import { prisma } from '../utils/prisma'
import { HttpError } from '../utils/HttpError'
import { normalizarDia } from './ai.service'

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
  id_valoracion: string
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
  // Formato legacy (para compatibilidad con clientes antiguos)
  '4 semanas': 'cuatro_semanas',
  '8 semanas': 'ocho_semanas',
  '12 semanas': 'doce_semanas',
  '16 semanas': 'dieciseis_semanas',
  // Formato enum (lo que envía el frontend actual)
  'cuatro_semanas': 'cuatro_semanas',
  'ocho_semanas': 'ocho_semanas',
  'doce_semanas': 'doce_semanas',
  'dieciseis_semanas': 'dieciseis_semanas',
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
    // La actual (activa) y las pasadas (finalizada) se ven; las canceladas no.
    where: { id_usuario, estado: { in: ['activa', 'finalizada'] } },
    include: {
      ejercicios: {
        orderBy: [{ dia_semana: 'asc' }, { orden: 'asc' }],
        include: {
          ejercicio: {
            select: {
              id_ejercicio: true,
              nombre: true,
              url_multimedia: true,
              grupos_musculares: true,
              maquinas: {
                select: {
                  maquina: {
                    select: {
                      id_maquina: true,
                      nombre: true,
                      url_multimedia: true,
                    },
                  },
                },
              },
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

  const valoracion = await prisma.valoracion.findUnique({
    where: { id_valoracion: data.id_valoracion },
    select: {
      id_valoracion: true,
      id_usuario: true,
      activo: true,
      rutina: { select: { id_rutina: true } },
    },
  })
  if (!valoracion) {
    throw new HttpError(404, 'Valoración no encontrada')
  }
  if (valoracion.id_usuario !== data.id_usuario) {
    throw new HttpError(400, 'La valoración no pertenece a este usuario')
  }
  if (!valoracion.activo) {
    throw new HttpError(400, 'La valoración no está activa')
  }
  if (valoracion.rutina) {
    throw new HttpError(400, 'Esta valoración ya tiene una rutina')
  }

  return prisma.$transaction(async (tx) => {
    // Regla "1 rutina activa": crear una nueva finaliza las anteriores del usuario.
    await tx.rutina.updateMany({
      where: { id_usuario: data.id_usuario, estado: 'activa' },
      data: { estado: 'finalizada' },
    })

    const rutina = await tx.rutina.create({
      data: {
        id_usuario: data.id_usuario,
        id_creador,
        id_valoracion: data.id_valoracion,
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
  if (rutina.estado === 'finalizada') throw new HttpError(400, 'No se puede editar una rutina finalizada')

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

// Inicio del día actual en hora local (para comparar "hoy" contra fechas de sesión).
function inicioDeHoy(): Date {
  const ahora = new Date()
  return new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate())
}

export async function crearSesion(idRutina: string) {
  const rutina = await prisma.rutina.findUnique({
    where: { id_rutina: idRutina },
    select: { id_rutina: true, estado: true },
  })
  if (!rutina) throw new HttpError(404, 'Rutina no encontrada')
  // Solo la rutina actual (activa) puede iniciar sesiones; las finalizadas/canceladas no.
  if (rutina.estado !== 'activa') {
    throw new HttpError(400, 'La rutina no está activa — no se pueden iniciar sesiones en ella')
  }

  // Regla "entrena el día planificado solo si es ese día": hoy debe ser un día de
  // entrenamiento de la rutina (unidad: dia_semana de sus ejercicios, sin acentos).
  const hoy = normalizarDia(new Date().toLocaleDateString('es-CO', { weekday: 'long' }))
  const diasRutina = await prisma.rutinaEjercicio.findMany({
    where: { id_rutina: idRutina },
    distinct: ['dia_semana'],
    select: { dia_semana: true },
  })
  const diasPlanificados = new Set(diasRutina.map(d => normalizarDia(d.dia_semana)))
  if (!diasPlanificados.has(hoy)) {
    throw new HttpError(400, 'Hoy no es un día de entrenamiento de esta rutina')
  }

  // Regla: una sesión en_progreso de un día anterior queda huérfana ("colgada").
  // Al crear una nueva se auto-cancela con hora_fin = ahora.
  await prisma.sesionRutina.updateMany({
    where: {
      id_rutina: idRutina,
      estado: 'en_progreso',
      fecha: { lt: inicioDeHoy() },
    },
    data: { estado: 'cancelada', hora_fin: new Date() },
  })

  const activaHoy = await prisma.sesionRutina.findFirst({
    where: {
      id_rutina: idRutina,
      estado: 'en_progreso',
      fecha: { gte: inicioDeHoy() },
    },
  })
  if (activaHoy) throw new HttpError(400, 'Ya hay una sesión en curso para hoy')

  return prisma.sesionRutina.create({
    data: {
      id_rutina: idRutina,
      fecha: new Date(),
      hora_inicio: new Date(),
    },
  })
}

export async function listarSesiones(idRutina: string) {
  const rutina = await prisma.rutina.findUnique({
    where: { id_rutina: idRutina },
    select: { id_rutina: true },
  })
  if (!rutina) throw new HttpError(404, 'Rutina no encontrada')

  return prisma.sesionRutina.findMany({
    where: { id_rutina: idRutina },
    orderBy: { fecha: 'desc' },
  })
}

async function transicionarSesion(idSesion: string, estadoFinal: 'finalizada' | 'cancelada') {
  const sesion = await prisma.sesionRutina.findUnique({ where: { id_sesion: idSesion } })
  if (!sesion) throw new HttpError(404, 'Sesión no encontrada')
  if (sesion.estado !== 'en_progreso') throw new HttpError(400, 'La sesión no está en curso')

  return prisma.sesionRutina.update({
    where: { id_sesion: idSesion },
    data: { estado: estadoFinal, hora_fin: new Date() },
  })
}

export async function finalizarSesion(idSesion: string) {
  return transicionarSesion(idSesion, 'finalizada')
}

export async function cancelarSesion(idSesion: string) {
  return transicionarSesion(idSesion, 'cancelada')
}

export async function marcarEjercicios(idSesion: string, ids: string[]) {
  const sesion = await prisma.sesionRutina.findUnique({ where: { id_sesion: idSesion } })
  if (!sesion) throw new HttpError(404, 'Sesión no encontrada')
  if (sesion.estado !== 'en_progreso') throw new HttpError(400, 'La sesión no está en curso')

  // Los ids deben pertenecer a ejercicios reales de la rutina de esta sesión —
  // nunca guardar IDs de otra rutina ni basura en el campo Json.
  const ejerciciosRutina = await prisma.rutinaEjercicio.findMany({
    where: { id_rutina: sesion.id_rutina },
    select: { id_rutina_ejercicio: true },
  })
  const validos = new Set(ejerciciosRutina.map(e => e.id_rutina_ejercicio))
  for (const id of ids) {
    if (!validos.has(id)) {
      throw new HttpError(400, 'Uno o más ejercicios no pertenecen a la rutina de esta sesión')
    }
  }

  return prisma.sesionRutina.update({
    where: { id_sesion: idSesion },
    data: { ejercicios_marcados: [...new Set(ids)] },
  })
}
