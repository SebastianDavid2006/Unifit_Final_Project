import { prisma } from '../utils/prisma'
import { obtenerEvolucion } from './asistencia.service'

// Medianoche UTC de HOY, igual que las fechas de Agenda (@db.Date se almacena a medianoche UTC)
function inicioDeHoyUtc(): Date {
  return new Date(`${new Date().toISOString().split('T')[0]}T00:00:00Z`)
}

function claveMes(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export async function obtenerEstadisticas(fechaInicio?: Date, fechaFin?: Date) {
  const inicio = fechaInicio ?? new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000)
  const fin = fechaFin ?? new Date()
  const hoyUtc = inicioDeHoyUtc()

  const usuarios = await prisma.usuario.findMany({
    where: { rol: 'usuario' },
    select: {
      id_usuario: true,
      estado: true,
      genero: true,
      tipo_usuario: true,
      fecha_creacion: true,
      estudiante: {
        select: {
          es_egresado: true,
          programa: {
            select: { nombre: true, universidad: true, tipo_programa: true },
          },
        },
      },
    },
  })

  // Resumen de usuarios (siempre de todo el tiempo, independiente del rango)
  const total = usuarios.length
  const activos = usuarios.filter(u => u.estado === 'activo').length
  const inactivos = usuarios.filter(u => u.estado === 'inactivo').length
  const pendientes = total - activos - inactivos

  // Por sexo (los tres valores siempre presentes para que el front pinté pie estable)
  const sexos: Record<string, number> = { masculino: 0, femenino: 0, otro: 0 }
  for (const u of usuarios) sexos[u.genero] += 1
  const usuarios_por_sexo = (['masculino', 'femenino', 'otro'] as const).map(genero => ({
    genero,
    total: sexos[genero],
  }))

  // Cargo universitario
  const tipos: Record<string, number> = { estudiante: 0, egresado: 0, docente: 0, administrativo: 0 }
  for (const u of usuarios) {
    if (u.tipo_usuario === 'profesor') tipos.docente += 1
    else if (u.tipo_usuario === 'administrativo') tipos.administrativo += 1
    else if (u.estudiante?.es_egresado) tipos.egresado += 1
    else tipos.estudiante += 1
  }
  const usuarios_por_tipo = (['estudiante', 'egresado', 'docente', 'administrativo'] as const).map(tipo => ({
    tipo,
    total: tipos[tipo],
  }))

  // Evolución: altas por mes (acumulado incluido para la curva)
  const porMes: Record<string, number> = {}
  for (const u of usuarios) {
    const key = claveMes(u.fecha_creacion)
    porMes[key] = (porMes[key] ?? 0) + 1
  }
  let acumulado = 0
  const usuarios_por_mes = Object.entries(porMes)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([fecha, totalMes]) => {
      acumulado += totalMes
      return { fecha, total: totalMes, acumulado }
    })

  // Asistencias del rango por usuario (para repartirlas por carrera)
  const asistenciasPorUsuario = new Map<string, number>()
  const agrupadas = await prisma.asistencia.groupBy({
    by: ['id_usuario'],
    where: { fecha: { gte: inicio, lte: fin } },
    _count: { _all: true },
  })
  for (const g of agrupadas) asistenciasPorUsuario.set(g.id_usuario, g._count._all)

  // Carreras (programas con estudiantes) — registrados + asistencias del rango
  const carrerasMap = new Map<string, {
    programa: string
    universidad: string
    tipo_programa: string
    registrados: number
    asistencias: number
  }>()
  for (const u of usuarios) {
    const programa = u.estudiante?.programa
    if (!programa) continue
    const key = `${programa.nombre}::${programa.universidad}`
    const fila = carrerasMap.get(key) ?? {
      programa: programa.nombre,
      universidad: programa.universidad,
      tipo_programa: programa.tipo_programa,
      registrados: 0,
      asistencias: 0,
    }
    fila.registrados += 1
    fila.asistencias += asistenciasPorUsuario.get(u.id_usuario) ?? 0
    carrerasMap.set(key, fila)
  }
  const carreras = Array.from(carrerasMap.values()).sort(
    (a, b) => b.registrados - a.registrados || b.asistencias - a.asistencias || a.programa.localeCompare(b.programa)
  )

  // Asistencia: total del período + serie mensual (reusa el bucket de asistencia.service)
  const [periodo, evolucion] = await Promise.all([
    prisma.asistencia.count({ where: { fecha: { gte: inicio, lte: fin } } }),
    obtenerEvolucion(inicio, fin, 'mes'),
  ])

  // Citas programadas = desde hoy en adelante y no canceladas
  const programadas = await prisma.agenda.count({
    where: { fecha: { gte: hoyUtc }, estado: { not: 'cancelado' } },
  })

  return {
    usuarios: { total, activos, inactivos, pendientes },
    usuarios_por_sexo,
    usuarios_por_tipo,
    usuarios_por_mes,
    carreras,
    asistencias: {
      periodo,
      por_mes: evolucion.map(e => ({ fecha: e.fecha, total: e.usuarios })),
    },
    citas: { programadas },
  }
}