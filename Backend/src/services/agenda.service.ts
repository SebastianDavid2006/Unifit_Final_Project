import { prisma } from '../utils/prisma'
import { HttpError } from '../utils/HttpError'

function horaToStr(d: Date | null): string | null {
  if (!d) return null
  return d.toISOString().substring(11, 19)
}

function mapAgenda(a: any) {
  return {
    ...a,
    hora_inicio: horaToStr(a.hora_inicio),
    hora_fin: horaToStr(a.hora_fin),
    cupo: a.cupo ? {
      ...a.cupo,
      hora_inicio: horaToStr(a.cupo.hora_inicio),
      hora_fin: horaToStr(a.cupo.hora_fin),
    } : null,
  }
}

function mapCupo(c: any) {
  return {
    ...c,
    hora_inicio: horaToStr(c.hora_inicio),
    hora_fin: horaToStr(c.hora_fin),
  }
}

export interface CrearAgendaData {
  id_usuario: string
  fecha: string
  hora_inicio: string
  hora_fin?: string
  tipo: 'valoracion' | 'registro' | 'seguimiento' | 'otro'
  tipo_otro?: string
  observaciones?: string
}

export interface EditarAgendaData {
  fecha?: string
  hora_inicio?: string
  hora_fin?: string
  tipo?: 'valoracion' | 'registro' | 'seguimiento' | 'otro'
  tipo_otro?: string
  estado?: 'pendiente' | 'completado' | 'cancelado' | 'no_asistio'
  observaciones?: string
}

export type DiaSemana = 'dom' | 'lun' | 'mar' | 'mié' | 'jue' | 'vie' | 'sáb'

export interface RangoHorario {
  inicio: string
  fin: string
}

export interface ConfigHorarioPorDia {
  dia: DiaSemana
  rangos: RangoHorario[]
}

export interface PublicarCuposData {
  fecha_inicio: string
  fecha_fin: string
  horarios_por_dia: ConfigHorarioPorDia[]
}

const DIA_SEMANA_JS: Record<DiaSemana, number> = {
  dom: 0,
  lun: 1,
  mar: 2,
  mié: 3,
  jue: 4,
  vie: 5,
  sáb: 6,
}

export async function listarAgenda() {
  const agendas = await prisma.agenda.findMany({
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
        select: { id_usuario: true, primer_nombre: true, primer_apellido: true },
      },
      cupo: { select: { id_cupo: true, hora_inicio: true, hora_fin: true } },
    },
    orderBy: [{ fecha: 'asc' }, { hora_inicio: 'asc' }],
  })
  return agendas.map(mapAgenda)
}

export async function obtenerAgendaPorId(id: string) {
  const agenda = await prisma.agenda.findUnique({
    where: { id_agenda: id },
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
        select: { id_usuario: true, primer_nombre: true, primer_apellido: true },
      },
      cupo: { select: { id_cupo: true, hora_inicio: true, hora_fin: true } },
    },
  })
  return agenda ? mapAgenda(agenda) : null
}

export async function listarAgendaDeUsuario(id_usuario: string) {
  const agendas = await prisma.agenda.findMany({
    where: { id_usuario },
    include: {
      creador: {
        select: { id_usuario: true, primer_nombre: true, primer_apellido: true },
      },
      cupo: { select: { id_cupo: true, hora_inicio: true, hora_fin: true } },
    },
    orderBy: [{ fecha: 'asc' }, { hora_inicio: 'asc' }],
  })
  return agendas.map(mapAgenda)
}

export async function crearAgenda(data: CrearAgendaData, id_creador: string) {
  const usuario = await prisma.usuario.findUnique({
    where: { id_usuario: data.id_usuario },
    select: { id_usuario: true },
  })
  if (!usuario) throw new HttpError(404, 'Usuario no encontrado')

  const agenda = await prisma.agenda.create({
    data: {
      id_usuario: data.id_usuario,
      id_creador,
      fecha: new Date(data.fecha),
      hora_inicio: new Date(`1970-01-01T${data.hora_inicio}`),
      hora_fin: data.hora_fin ? new Date(`1970-01-01T${data.hora_fin}`) : null,
      tipo: data.tipo,
      tipo_otro: data.tipo === 'otro' ? data.tipo_otro ?? null : null,
      observaciones: data.observaciones,
    },
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
        select: { id_usuario: true, primer_nombre: true, primer_apellido: true },
      },
      cupo: { select: { id_cupo: true, hora_inicio: true, hora_fin: true } },
    },
  })
  return mapAgenda(agenda)
}

export async function editarAgenda(id: string, data: EditarAgendaData) {
  const agenda = await prisma.agenda.findUnique({ where: { id_agenda: id } })
  if (!agenda) throw new HttpError(404, 'Cita no encontrada')

  if (agenda.id_cupo) {
    throw new HttpError(400, 'No se puede editar una cita reservada a través de un cupo')
  }

  const actualizada = await prisma.agenda.update({
    where: { id_agenda: id },
    data: {
      ...(data.fecha !== undefined && { fecha: new Date(data.fecha) }),
      ...(data.hora_inicio !== undefined && { hora_inicio: new Date(`1970-01-01T${data.hora_inicio}`) }),
      ...(data.hora_fin !== undefined && { hora_fin: data.hora_fin ? new Date(`1970-01-01T${data.hora_fin}`) : null }),
      ...(data.tipo !== undefined && { tipo: data.tipo }),
      ...(data.tipo !== undefined && data.tipo !== 'otro' && { tipo_otro: null }),
      ...(data.tipo_otro !== undefined && data.tipo === 'otro' && { tipo_otro: data.tipo_otro }),
      ...(data.estado !== undefined && { estado: data.estado }),
      ...(data.observaciones !== undefined && { observaciones: data.observaciones }),
    },
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
        select: { id_usuario: true, primer_nombre: true, primer_apellido: true },
      },
      cupo: { select: { id_cupo: true, hora_inicio: true, hora_fin: true } },
    },
  })
  return mapAgenda(actualizada)
}

export async function cambiarEstadoAgenda(id: string, estado: EditarAgendaData['estado']) {
  const agenda = await prisma.agenda.findUnique({ where: { id_agenda: id } })
  if (!agenda) throw new HttpError(404, 'Cita no encontrada')

  const actualizada = await prisma.agenda.update({
    where: { id_agenda: id },
    data: { estado },
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
        select: { id_usuario: true, primer_nombre: true, primer_apellido: true },
      },
      cupo: { select: { id_cupo: true, hora_inicio: true, hora_fin: true } },
    },
  })
  return mapAgenda(actualizada)
}

export async function eliminarAgenda(id: string) {
  const agenda = await prisma.agenda.findUnique({ where: { id_agenda: id } })
  if (!agenda) throw new HttpError(404, 'Cita no encontrada')

  await prisma.agenda.delete({ where: { id_agenda: id } })
  return { id_agenda: id }
}

function parseHora(cadena: string): Date {
  return new Date(`1970-01-01T${cadena}`)
}

// Helper: calcular fecha de Pascua (algoritmo de Gauss)
function easterCalc(year: number): Date {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(year, month - 1, day)
}

// Helper: obtener festivos colombianos para un año (Ley Emiliani + variables)
function getColombianHolidays(year: number, easterDate: Date): Holiday[] {
  const sunday = (offset: number): Date => {
    const r = new Date(easterDate)
    r.setDate(r.getDate() + offset)
    return r
  }
  const on = (y: number, m: number, d: number): Date => new Date(y, m - 1, d)
  const emiliani = (d: Date, name: string): Holiday => ({ date: fmtDate(nextMonday(d)), name })
  const list: Holiday[] = [
    { date: fmtDate(on(year, 1, 1)), name: 'Año Nuevo' },
    emiliani(on(year, 1, 6), 'Día de los Reyes Magos'),
    emiliani(on(year, 3, 19), 'Día de San José'),
    { date: fmtDate(sunday(-3)), name: 'Jueves Santo' },
    { date: fmtDate(sunday(-2)), name: 'Viernes Santo' },
    { date: fmtDate(on(year, 5, 1)), name: 'Día del Trabajo' },
    emiliani(sunday(39), 'Día de la Ascensión'),
    emiliani(sunday(60), 'Corpus Christi'),
    emiliani(sunday(68), 'Sagrado Corazón de Jesús'),
    emiliani(on(year, 6, 29), 'San Pedro y San Pablo'),
  ]
  if (year >= 2026) {
    list.push(emiliani(on(year, 7, 9), 'Día de Nuestra Señora del Rosario de Chiquinquirá'))
  }
  list.push(
    { date: fmtDate(on(year, 7, 20)), name: 'Día de la Independencia' },
    { date: fmtDate(on(year, 8, 7)), name: 'Batalla de Boyacá' },
    emiliani(on(year, 8, 15), 'Asunción de la Virgen'),
    emiliani(on(year, 10, 12), 'Día de la Raza'),
    emiliani(on(year, 11, 1), 'Todos los Santos'),
    emiliani(on(year, 11, 11), 'Independencia de Cartagena'),
    { date: fmtDate(on(year, 12, 8)), name: 'Día de la Inmaculada Concepción' },
    { date: fmtDate(on(year, 12, 25)), name: 'Navidad' },
  )
  return list.sort((a, b) => a.date.localeCompare(b.date))
}

// Utility: formatear fecha a string YYYY-MM-DD
function fmtDate(d: Date): string {
  return d.toISOString().split('T')[0]
}

// Interfaz auxiliar para festivos
interface Holiday {
  date: string
  name: string
}

// Helper: avanzar al siguiente lunes (Ley Emiliani)
function nextMonday(d: Date): Date {
  const r = new Date(d)
  const day = r.getDay()
  const add = day === 1 ? 0 : (8 - day) % 7
  r.setDate(r.getDate() + add)
  return r
}

export async function publicarCupos(data: PublicarCuposData, id_creador: string) {
  if (data.horarios_por_dia.length === 0) {
    throw new HttpError(400, 'Debes indicar al menos un día con horario')
  }

  const fechaInicio = new Date(`${data.fecha_inicio}T00:00:00`)
  const fechaFin = new Date(`${data.fecha_fin}T00:00:00`)

  if (fechaFin < fechaInicio) {
    throw new HttpError(400, 'La fecha final no puede ser anterior a la fecha inicial')
  }

  // Cargar festivos colombianos dinámicamente 
  const year = fechaInicio.getFullYear()
  const easterDate = easterCalc(year)
  const colombianHolidays = getColombianHolidays(year, easterDate)
  const festivoSet = new Set(colombianHolidays.map(h => h.date))

  const porDiaJS = new Map<number, RangoHorario[]>()
  for (const cfg of data.horarios_por_dia) {
    const js = DIA_SEMANA_JS[cfg.dia]
    if (cfg.rangos.length === 0) {
      throw new HttpError(400, `El día ${cfg.dia} no tiene ningún horario`)
    }
    for (let i = 0; i < cfg.rangos.length; i++) {
      const a = cfg.rangos[i]
      if (parseHora(a.fin) <= parseHora(a.inicio)) {
        throw new HttpError(400, `El horario de fin debe ser posterior al de inicio en el día ${cfg.dia}`)
      }
      for (let j = i + 1; j < cfg.rangos.length; j++) {
        const b = cfg.rangos[j]
        if (parseHora(a.inicio) < parseHora(b.fin) && parseHora(b.inicio) < parseHora(a.fin)) {
          throw new HttpError(400, `Los horarios del día ${cfg.dia} se superponen`)
        }
      }
    }
    porDiaJS.set(js, cfg.rangos)
  }

  const cupos: Array<{ fecha: Date; hora_inicio: Date; hora_fin: Date }> = []

  for (let dia = new Date(fechaInicio); dia <= fechaFin; dia.setDate(dia.getDate() + 1)) {
    const dayKey = dia.getDay()
    const dayDateStr = fmtDate(dia)
    // Si es festivo, saltar este día completamente
    if (festivoSet.has(dayDateStr)) continue

    const rangos = porDiaJS.get(dayKey)
    if (!rangos) continue

    const diaFecha = new Date(dia)
    diaFecha.setHours(0, 0, 0, 0)

    for (const rango of rangos) {
      const horaInicio = parseHora(rango.inicio)
      const horaFin = parseHora(rango.fin)
      if (horaFin <= horaInicio) {
        throw new HttpError(400, 'El horario de fin debe ser posterior al de inicio')
      }
      cupos.push({
        fecha: diaFecha,
        hora_inicio: new Date(horaInicio),
        hora_fin: new Date(horaFin),
      })
    }
  }

  if (cupos.length === 0) {
    throw new HttpError(400, 'No se generaron cupos para el rango indicado')
  }

  return prisma.$transaction(async (tx) => {
    const datos = cupos.map((c) => ({
      id_creador,
      fecha: c.fecha,
      hora_inicio: c.hora_inicio,
      hora_fin: c.hora_fin,
    }))
    const creados = await tx.cupo.createMany({ data: datos })
    return { count: creados.count }
  })
}

export async function listarCuposDisponibles() {
  const ahora = new Date()
  const hoy = new Date(ahora)
  hoy.setHours(0, 0, 0, 0)
  const manana = new Date(hoy)
  manana.setDate(manana.getDate() + 1)

  const cupos = await prisma.cupo.findMany({
    where: {
      OR: [
        { fecha: { gte: manana } },
        {
          fecha: { gte: hoy, lt: manana },
          hora_inicio: { gt: ahora },
        },
      ],
      agenda: { is: null },
    },
    include: {
      creador: {
        select: { id_usuario: true, primer_nombre: true, primer_apellido: true },
      },
    },
    orderBy: [{ fecha: 'asc' }, { hora_inicio: 'asc' }],
  })
  return cupos.map(mapCupo)
}

export async function reservarCupo(id_cupo: string, id_usuario: string) {
  return prisma.$transaction(async (tx) => {
    const cupo = await tx.cupo.findUnique({
      where: { id_cupo: id_cupo },
      include: { agenda: true },
    })

    if (!cupo) throw new HttpError(404, 'Cupo no encontrado')
    if (cupo.agenda) throw new HttpError(400, 'Este cupo ya está reservado')

    const ahora = new Date()
    const hoy = new Date(ahora)
    hoy.setHours(0, 0, 0, 0)
    const manana = new Date(hoy)
    manana.setDate(manana.getDate() + 1)

    const cupoVencido = cupo.fecha < hoy || (cupo.fecha.getTime() === hoy.getTime() && cupo.hora_inicio <= ahora)
    if (cupoVencido) throw new HttpError(400, 'Este cupo ya no está disponible')

    const usuario = await tx.usuario.findUnique({
      where: { id_usuario },
      select: { id_usuario: true },
    })
    if (!usuario) throw new HttpError(404, 'Usuario no encontrado')

    const agenda = await tx.agenda.create({
      data: {
        id_usuario,
        id_creador: cupo.id_creador,
        id_cupo: cupo.id_cupo,
        fecha: cupo.fecha,
        hora_inicio: cupo.hora_inicio,
        hora_fin: cupo.hora_fin,
        tipo: 'registro',
        observaciones: 'Reservado a través de cupo',
      },
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
          select: { id_usuario: true, primer_nombre: true, primer_apellido: true },
        },
        cupo: { select: { id_cupo: true, hora_inicio: true, hora_fin: true } },
      },
    })

    return mapAgenda(agenda)
  })
}
