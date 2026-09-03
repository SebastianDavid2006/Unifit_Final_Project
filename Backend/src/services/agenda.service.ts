import { prisma } from '../utils/prisma'
import { HttpError } from '../utils/HttpError'

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
  duracion_min: number
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
  return prisma.agenda.findMany({
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
}

export async function obtenerAgendaPorId(id: string) {
  return prisma.agenda.findUnique({
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
}

export async function listarAgendaDeUsuario(id_usuario: string) {
  return prisma.agenda.findMany({
    where: { id_usuario },
    include: {
      creador: {
        select: { id_usuario: true, primer_nombre: true, primer_apellido: true },
      },
      cupo: { select: { id_cupo: true, hora_inicio: true, hora_fin: true } },
    },
    orderBy: [{ fecha: 'asc' }, { hora_inicio: 'asc' }],
  })
}

export async function crearAgenda(data: CrearAgendaData, id_creador: string) {
  const usuario = await prisma.usuario.findUnique({
    where: { id_usuario: data.id_usuario },
    select: { id_usuario: true },
  })
  if (!usuario) throw new HttpError(404, 'Usuario no encontrado')

  return prisma.agenda.create({
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
  })
}

export async function editarAgenda(id: string, data: EditarAgendaData) {
  const agenda = await prisma.agenda.findUnique({ where: { id_agenda: id } })
  if (!agenda) throw new HttpError(404, 'Cita no encontrada')

  if (agenda.id_cupo) {
    throw new HttpError(400, 'No se puede editar una cita reservada a través de un cupo')
  }

  return prisma.agenda.update({
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
  })
}

export async function cambiarEstadoAgenda(id: string, estado: EditarAgendaData['estado']) {
  const agenda = await prisma.agenda.findUnique({ where: { id_agenda: id } })
  if (!agenda) throw new HttpError(404, 'Cita no encontrada')

  return prisma.agenda.update({
    where: { id_agenda: id },
    data: { estado },
  })
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

export async function publicarCupos(data: PublicarCuposData, id_creador: string) {
  if (data.duracion_min <= 0) throw new HttpError(400, 'La duración del bloque debe ser mayor a 0')
  if (data.horarios_por_dia.length === 0) {
    throw new HttpError(400, 'Debes indicar al menos un día con horario')
  }

  const fechaInicio = new Date(`${data.fecha_inicio}T00:00:00`)
  const fechaFin = new Date(`${data.fecha_fin}T00:00:00`)

  if (fechaFin < fechaInicio) {
    throw new HttpError(400, 'La fecha final no puede ser anterior a la fecha inicial')
  }

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

  const bloques: Array<{ fecha: Date; hora_inicio: Date; hora_fin: Date }> = []

  for (let dia = new Date(fechaInicio); dia <= fechaFin; dia.setDate(dia.getDate() + 1)) {
    const rangos = porDiaJS.get(dia.getDay())
    if (!rangos) continue

    const diaFecha = new Date(dia)
    diaFecha.setHours(0, 0, 0, 0)

    for (const rango of rangos) {
      const limite = parseHora(rango.fin)
      let actual = parseHora(rango.inicio)

      while (actual < limite) {
        const finBloque = new Date(actual.getTime() + data.duracion_min * 60000)
        if (finBloque > limite) break

        bloques.push({
          fecha: diaFecha,
          hora_inicio: new Date(actual),
          hora_fin: new Date(finBloque),
        })
        actual = finBloque
      }
    }
  }

  if (bloques.length === 0) {
    throw new HttpError(400, 'No se generaron bloques de tiempo para el rango indicado')
  }

  return prisma.$transaction(async (tx) => {
    const datos = bloques.map((b) => ({
      id_creador,
      fecha: b.fecha,
      hora_inicio: b.hora_inicio,
      hora_fin: b.hora_fin,
    }))
    const creados = await tx.cupo.createMany({ data: datos })
    return { count: creados.count }
  })
}

export async function listarCuposDisponibles() {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  return prisma.cupo.findMany({
    where: {
      fecha: { gte: hoy },
      agenda: { is: null },
    },
    include: {
      creador: {
        select: { id_usuario: true, primer_nombre: true, primer_apellido: true },
      },
    },
    orderBy: [{ fecha: 'asc' }, { hora_inicio: 'asc' }],
  })
}

export async function reservarCupo(id_cupo: string, id_usuario: string) {
  return prisma.$transaction(async (tx) => {
    const cupo = await tx.cupo.findUnique({
      where: { id_cupo: id_cupo },
      include: { agenda: true },
    })

    if (!cupo) throw new HttpError(404, 'Cupo no encontrado')
    if (cupo.agenda) throw new HttpError(400, 'Este cupo ya está reservado')

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
    })

    return agenda
  })
}
