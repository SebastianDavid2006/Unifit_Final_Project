import { prisma } from '../utils/prisma'
import { HttpError } from '../utils/HttpError'

export interface CrearValoracionData {
  id_usuario: string
  nivel_actividad: string
  objetivos: string[]
  objetivo_detalle?: string
  tipo_antecedentes: string[]
  observaciones_antecedentes?: string
  observaciones_finales?: string
  dias_disponibles: string[]
  proxima_valoracion?: Date
  medidas?: {
    peso: number
    estatura: number
    imc: number
    grasa_corporal: number
    masa_muscular: number
    masa_magra: number
    grasa_visceral: number
  }
  datos_medicos?: {
    presion_arterial: string
    edad_metabolica: number
    agua_corporal: number
    resistencia_muscular: number
  }
}

export interface EditarValoracionData {
  nivel_actividad?: string
  objetivos?: string[]
  objetivo_detalle?: string
  tipo_antecedentes?: string[]
  observaciones_antecedentes?: string
  observaciones_finales?: string
  dias_disponibles?: string[]
  proxima_valoracion?: Date
  medidas?: {
    peso: number
    estatura: number
    imc: number
    grasa_corporal: number
    masa_muscular: number
    masa_magra: number
    grasa_visceral: number
  }
  datos_medicos?: {
    presion_arterial: string
    edad_metabolica: number
    agua_corporal: number
    resistencia_muscular: number
  }
}

type ValoracionWithIncludes = Awaited<ReturnType<typeof prisma.valoracion.findMany>>[number]

function calcularTipo(valoraciones: ValoracionWithIncludes[]): (ValoracionWithIncludes & { tipo: string })[] {
  if (valoraciones.length === 0) return []
  const fechas = valoraciones.map(v => v.fecha.getTime())
  const earliestIdx = fechas.indexOf(Math.min(...fechas))
  const latestIdx = fechas.indexOf(Math.max(...fechas))
  return valoraciones.map((v, i) => ({
    ...v,
    tipo: i === latestIdx ? 'actual' : i === earliestIdx ? 'inicial' : 'seguimiento',
  }))
}

export async function listarValoracionesActivas() {
  const valoraciones = await prisma.valoracion.findMany({
    where: { activo: true },
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
      datos_medicos: true,
      medidas_corporales: true,
    },
    orderBy: { fecha_creacion: 'desc' },
  })

  return calcularTipo(valoraciones)
}

export async function obtenerValoracionPorId(id: string) {
  const valoracion = await prisma.valoracion.findUnique({
    where: { id_valoracion: id },
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
      datos_medicos: true,
      medidas_corporales: true,
    },
  })

  if (!valoracion) return null

  const todas = await prisma.valoracion.findMany({
    where: { id_usuario: valoracion.id_usuario, activo: true },
    select: { id_valoracion: true, fecha: true },
    orderBy: { fecha: 'asc' },
  })

  const isEarliest = todas.length > 0 && todas[0].id_valoracion === id
  const isLatest = todas.length > 0 && todas[todas.length - 1].id_valoracion === id

  return {
    ...valoracion,
    tipo: isLatest ? 'actual' : isEarliest ? 'inicial' : 'seguimiento',
  }
}

export async function listarValoracionesPorUsuario(id_usuario: string) {
  const valoraciones = await prisma.valoracion.findMany({
    where: { id_usuario, activo: true },
    include: {
      datos_medicos: true,
      medidas_corporales: true,
    },
    orderBy: { fecha_creacion: 'desc' },
  })

  return calcularTipo(valoraciones)
}

export async function crearValoracion(data: CrearValoracionData, id_creador: string) {
  const usuario = await prisma.usuario.findUnique({
    where: { id_usuario: data.id_usuario },
    select: { parq_realizado: true, estado: true },
  })

  if (!usuario) throw new HttpError(404, 'Usuario no encontrado')
  if (!usuario.parq_realizado) {
    throw new HttpError(400, 'El usuario debe completar el PAR-Q antes de crear una valoración')
  }

  return prisma.$transaction(async (tx) => {
    const valoracion = await tx.valoracion.create({
      data: {
        id_usuario: data.id_usuario,
        id_creador,
        nivel_actividad: data.nivel_actividad as any,
        objetivos: data.objetivos as any,
        objetivo_detalle: data.objetivo_detalle,
        tipo_antecedentes: data.tipo_antecedentes as any,
        observaciones_antecedentes: data.observaciones_antecedentes,
        observaciones_finales: data.observaciones_finales,
        dias_disponibles: data.dias_disponibles as any,
        proxima_valoracion: data.proxima_valoracion,
      },
    })

    if (data.medidas) {
      await tx.medidasCorporales.create({
        data: {
          id_valoracion: valoracion.id_valoracion,
          peso: data.medidas.peso,
          estatura: data.medidas.estatura,
          imc: data.medidas.imc,
          grasa_corporal: data.medidas.grasa_corporal,
          masa_muscular: data.medidas.masa_muscular,
          masa_magra: data.medidas.masa_magra,
          grasa_visceral: data.medidas.grasa_visceral,
        },
      })
    }

    if (data.datos_medicos) {
      await tx.datosMedicos.create({
        data: {
          id_valoracion: valoracion.id_valoracion,
          presion_arterial: data.datos_medicos.presion_arterial,
          edad_metabolica: data.datos_medicos.edad_metabolica,
          agua_corporal: data.datos_medicos.agua_corporal,
          resistencia_muscular: data.datos_medicos.resistencia_muscular,
        },
      })
    }

    return valoracion
  })
}

export async function editarValoracion(id: string, data: EditarValoracionData) {
  const valoracion = await prisma.valoracion.findUnique({ where: { id_valoracion: id } })
  if (!valoracion) throw new HttpError(404, 'Valoración no encontrada')

  return prisma.$transaction(async (tx) => {
    const updated = await tx.valoracion.update({
      where: { id_valoracion: id },
      data: {
        ...(data.nivel_actividad !== undefined && { nivel_actividad: data.nivel_actividad as any }),
        ...(data.objetivos !== undefined && { objetivos: data.objetivos as any }),
        ...(data.objetivo_detalle !== undefined && { objetivo_detalle: data.objetivo_detalle }),
        ...(data.tipo_antecedentes !== undefined && { tipo_antecedentes: data.tipo_antecedentes as any }),
        ...(data.observaciones_antecedentes !== undefined && { observaciones_antecedentes: data.observaciones_antecedentes }),
        ...(data.observaciones_finales !== undefined && { observaciones_finales: data.observaciones_finales }),
        ...(data.dias_disponibles !== undefined && { dias_disponibles: data.dias_disponibles as any }),
        ...(data.proxima_valoracion !== undefined && { proxima_valoracion: data.proxima_valoracion }),
      },
    })

    if (data.medidas) {
      await tx.medidasCorporales.upsert({
        where: { id_valoracion: id },
        create: {
          id_valoracion: id,
          peso: data.medidas.peso,
          estatura: data.medidas.estatura,
          imc: data.medidas.imc,
          grasa_corporal: data.medidas.grasa_corporal,
          masa_muscular: data.medidas.masa_muscular,
          masa_magra: data.medidas.masa_magra,
          grasa_visceral: data.medidas.grasa_visceral,
        },
        update: {
          peso: data.medidas.peso,
          estatura: data.medidas.estatura,
          imc: data.medidas.imc,
          grasa_corporal: data.medidas.grasa_corporal,
          masa_muscular: data.medidas.masa_muscular,
          masa_magra: data.medidas.masa_magra,
          grasa_visceral: data.medidas.grasa_visceral,
        },
      })
    }

    if (data.datos_medicos) {
      await tx.datosMedicos.upsert({
        where: { id_valoracion: id },
        create: {
          id_valoracion: id,
          presion_arterial: data.datos_medicos.presion_arterial,
          edad_metabolica: data.datos_medicos.edad_metabolica,
          agua_corporal: data.datos_medicos.agua_corporal,
          resistencia_muscular: data.datos_medicos.resistencia_muscular,
        },
        update: {
          presion_arterial: data.datos_medicos.presion_arterial,
          edad_metabolica: data.datos_medicos.edad_metabolica,
          agua_corporal: data.datos_medicos.agua_corporal,
          resistencia_muscular: data.datos_medicos.resistencia_muscular,
        },
      })
    }

    return updated
  })
}

export async function desactivarValoracion(id: string) {
  const valoracion = await prisma.valoracion.findUnique({ where: { id_valoracion: id } })
  if (!valoracion) throw new HttpError(404, 'Valoración no encontrada')

  return prisma.valoracion.update({
    where: { id_valoracion: id },
    data: { activo: false },
  })
}
