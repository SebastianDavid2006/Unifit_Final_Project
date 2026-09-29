import { prisma } from '../utils/prisma'
import { HttpError } from '../utils/HttpError'
import { fmtDate, obtenerFestivos } from './festivos.service'

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
  // Hora de inicio del bloque (p.ej. '08:00'); hora_fin se deriva del bloque (regla 1)
  hora_inicio: string
  tipo: 'valoracion' | 'registro' | 'seguimiento' | 'otro'
  tipo_otro?: string
  observaciones?: string
}

export interface EditarAgendaData {
  fecha?: string
  hora_inicio?: string
  tipo?: 'valoracion' | 'registro' | 'seguimiento' | 'otro'
  tipo_otro?: string
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

// Bloques fijos del día — única fuente (regla 1). El front los consume vía GET /agenda/bloques.
export interface BloqueDelDia {
  bloque: 'AM' | 'PM'
  inicio: string
  fin: string
}

export const BLOQUES_DEL_DIA: BloqueDelDia[] = [
  { bloque: 'AM', inicio: '08:00', fin: '09:00' },
  { bloque: 'AM', inicio: '09:00', fin: '10:00' },
  { bloque: 'AM', inicio: '10:00', fin: '11:00' },
  { bloque: 'AM', inicio: '11:00', fin: '12:00' },
  { bloque: 'PM', inicio: '12:00', fin: '13:00' },
  { bloque: 'PM', inicio: '13:00', fin: '14:00' },
  { bloque: 'PM', inicio: '14:00', fin: '15:00' },
  { bloque: 'PM', inicio: '15:00', fin: '16:00' },
  { bloque: 'PM', inicio: '16:00', fin: '17:00' },
  { bloque: 'PM', inicio: '17:00', fin: '18:00' },
  { bloque: 'PM', inicio: '18:00', fin: '19:00' },
  { bloque: 'PM', inicio: '19:00', fin: '20:00' },
  { bloque: 'PM', inicio: '20:00', fin: '21:00' },
  { bloque: 'PM', inicio: '21:00', fin: '22:00' },
]

export function listarBloques(): BloqueDelDia[] {
  return BLOQUES_DEL_DIA
}

function bloqueDe(horaInicio: string): BloqueDelDia | undefined {
  // Acepta '09:00' o '09:00:00' y lo compara contra el inicio del bloque canónico
  const partes = horaInicio.split(':')
  const clave = partes.length >= 2 ? `${partes[0]}:${partes[1]}` : horaInicio
  return BLOQUES_DEL_DIA.find((b) => b.inicio === clave)
}

export interface CupoConReserva {
  id_cupo: string
  fecha: string
  hora_inicio: string | null
  hora_fin: string | null
  creador: { id_usuario: string; nombre: string } | null
  reserva: {
    id_agenda: string
    id_usuario: string
    estado: string
    alumno: string
    tipo: string
  } | null
}

function fmtDiaLocal(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
}

function hoyMidnightLocal(): Date {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  return hoy
}

// Convierte una fecha almacenada (medianoche UTC del día calendario) a medianoche LOCAL del mismo día
function diaLocalDeFecha(fechaAlmacenada: Date): Date {
  return new Date(`${fmtDiaLocal(fechaAlmacenada)}T00:00:00`)
}

function bloqueYaComenzo(horaInicio: Date, ahora: Date): boolean {
  const inicio = new Date(ahora)
  inicio.setHours(Number(horaInicio.getUTCHours()), Number(horaInicio.getUTCMinutes()), 0, 0)
  return inicio <= ahora
}

// Regla: no se agendan citas en días pasados ni en bloques de HOY que ya comenzaron
function validarAgendable(fechaAlmacenada: Date, horaInicio: Date) {
  const ahora = new Date()
  const hoy = hoyMidnightLocal()
  const dia = diaLocalDeFecha(fechaAlmacenada)
  if (dia < hoy) {
    throw new HttpError(400, 'No se pueden agendar citas en días pasados')
  }
  if (dia.getTime() === hoy.getTime() && bloqueYaComenzo(horaInicio, ahora)) {
    throw new HttpError(400, 'El bloque ya comenzó')
  }
}

export async function listarCupos(): Promise<CupoConReserva[]> {
  const cupos = await prisma.cupo.findMany({
    include: {
      creador: { select: { id_usuario: true, primer_nombre: true, primer_apellido: true } },
      agenda: {
        select: {
          id_agenda: true,
          id_usuario: true,
          estado: true,
          tipo: true,
          usuario: { select: { primer_nombre: true, primer_apellido: true } },
        },
      },
    },
    orderBy: [{ fecha: 'asc' }, { hora_inicio: 'asc' }],
  })

  return cupos.map((c) => ({
    id_cupo: c.id_cupo,
    fecha: fmtDiaLocal(c.fecha),
    hora_inicio: horaToStr(c.hora_inicio),
    hora_fin: horaToStr(c.hora_fin),
    creador: c.creador
      ? { id_usuario: c.creador.id_usuario, nombre: `${c.creador.primer_nombre} ${c.creador.primer_apellido}`.trim() }
      : null,
    reserva: c.agenda
      ? {
          id_agenda: c.agenda.id_agenda,
          id_usuario: c.agenda.id_usuario,
          estado: c.agenda.estado,
          alumno: `${c.agenda.usuario.primer_nombre} ${c.agenda.usuario.primer_apellido}`.trim(),
          tipo: c.agenda.tipo,
        }
      : null,
  }))
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

  // Un bloque = un hueco. La hora debe ser de inicio de un bloque canónico (regla 1).
  const bloque = bloqueDe(data.hora_inicio)
  if (!bloque) {
    throw new HttpError(400, 'Hora no válida: debes elegir un bloque de agenda')
  }

  const fecha = new Date(data.fecha)
  validarAgendable(fecha, parseHora(bloque.inicio))

  return prisma.$transaction(async (tx) => {
    // Conflicto: un bloque solo admite una cita (directa o de cupo)
    const ocupado = await tx.agenda.findFirst({
      where: { fecha, hora_inicio: parseHora(bloque.inicio) },
      select: { id_agenda: true },
    })
    if (ocupado) throw new HttpError(409, 'Ese bloque ya está ocupado')

    // Opción A: si el bloque tiene un cupo público libre, la cita directa lo consume
    const cupoLibre = await tx.cupo.findFirst({
      where: { fecha, hora_inicio: parseHora(bloque.inicio), agenda: { is: null } },
      select: { id_cupo: true },
    })

    const agenda = await tx.agenda.create({
      data: {
        id_usuario: data.id_usuario,
        id_creador,
        id_cupo: cupoLibre?.id_cupo ?? null,
        fecha,
        hora_inicio: parseHora(bloque.inicio),
        hora_fin: parseHora(bloque.fin),
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
  })
}

export async function editarAgenda(id: string, data: EditarAgendaData) {
  if (
    data.fecha === undefined &&
    data.hora_inicio === undefined &&
    data.tipo === undefined &&
    data.tipo_otro === undefined &&
    data.observaciones === undefined
  ) {
    throw new HttpError(400, 'Debes indicar al menos un campo a actualizar')
  }

  const agenda = await prisma.agenda.findUnique({ where: { id_agenda: id } })
  if (!agenda) throw new HttpError(404, 'Cita no encontrada')

  const bloque = data.hora_inicio !== undefined ? bloqueDe(data.hora_inicio) : undefined
  if (data.hora_inicio !== undefined && !bloque) {
    throw new HttpError(400, 'Hora no válida: debes elegir un bloque de agenda')
  }

  const fechaDestino = data.fecha !== undefined ? new Date(data.fecha) : agenda.fecha
  const horaInicioDestino = bloque ? parseHora(bloque.inicio) : agenda.hora_inicio
  const horaFinDestino = bloque ? parseHora(bloque.fin) : agenda.hora_fin

  // ¿Se está moviendo de bloque/día temporalmente? Si no se mueve, el cupo sigue intacto.
  const seMueve =
    fmtDiaLocal(fechaDestino) !== fmtDiaLocal(agenda.fecha) ||
    horaInicioDestino.getTime() !== agenda.hora_inicio.getTime()

  if (seMueve) validarAgendable(fechaDestino, horaInicioDestino)

  return prisma.$transaction(async (tx) => {
    // Conflicto en el destino (otra cita en ese bloque)
    const ocupado = await tx.agenda.findFirst({
      where: { fecha: fechaDestino, hora_inicio: horaInicioDestino, id_agenda: { not: id } },
      select: { id_agenda: true },
    })
    if (ocupado) throw new HttpError(409, 'Ese bloque ya está ocupado')

    // Opción A en el destino: consumir cupo público libre si existe
    const cupoDestino = seMueve
      ? await tx.cupo.findFirst({
          where: { fecha: fechaDestino, hora_inicio: horaInicioDestino, agenda: { is: null } },
          select: { id_cupo: true },
        })
      : null

    const actualizada = await tx.agenda.update({
      where: { id_agenda: id },
      data: {
        ...(data.fecha !== undefined && { fecha: fechaDestino }),
        ...(bloque && { hora_inicio: horaInicioDestino, hora_fin: horaFinDestino }),
        // Al moverse se libera el cupo del bloque anterior (null) y se toma el del destino si lo hay
        ...(seMueve && { id_cupo: cupoDestino?.id_cupo ?? null }),
        ...(data.tipo !== undefined && { tipo: data.tipo }),
        ...(data.tipo !== undefined && data.tipo !== 'otro' && { tipo_otro: null }),
        ...(data.tipo_otro !== undefined && data.tipo === 'otro' && { tipo_otro: data.tipo_otro }),
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
  })
}

export async function cambiarEstadoAgenda(id: string, estado: 'pendiente' | 'completado' | 'cancelado' | 'no_asistio') {
  const agenda = await prisma.agenda.findUnique({ where: { id_agenda: id } })
  if (!agenda) throw new HttpError(404, 'Cita no encontrada')

  const actualizada = await prisma.agenda.update({
    where: { id_agenda: id },
    // Al cancelar se libera el bloque: si estaba ligado a un cupo público, vuelve a quedar libre
    data: { estado, ...(estado === 'cancelado' && { id_cupo: null }) },
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

export async function cancelarCitaAgenda(id: string, id_usuario: string, esStaff: boolean) {
  const agenda = await prisma.agenda.findUnique({ where: { id_agenda: id } })
  if (!agenda) throw new HttpError(404, 'Cita no encontrada')

  if (!esStaff && agenda.id_usuario !== id_usuario) {
    throw new HttpError(403, 'No autorizado')
  }
  if (agenda.estado !== 'pendiente') {
    throw new HttpError(400, 'Solo se pueden cancelar citas pendientes')
  }

  if (!esStaff) {
    // El dueño debe cancelar con al menos 24 horas de antelación (reloj del gimnasio)
    const inicioCita = new Date(
      agenda.fecha.getUTCFullYear(),
      agenda.fecha.getUTCMonth(),
      agenda.fecha.getUTCDate(),
      agenda.hora_inicio.getUTCHours(),
      agenda.hora_inicio.getUTCMinutes(),
      0,
      0,
    )
    if (inicioCita.getTime() - Date.now() < 24 * 60 * 60 * 1000) {
      throw new HttpError(400, 'Solo se puede cancelar con al menos 24 horas de antelación')
    }
  }

  const actualizada = await prisma.agenda.update({
    where: { id_agenda: id },
    data: { estado: 'cancelado', id_cupo: null },
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
  // 'Z' : la hora se guarda con el reloj del gimnasio sin corrimiento de zona horaria
  return new Date(`1970-01-01T${cadena}Z`)
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

  const ahora = new Date()
  const hoy = hoyMidnightLocal()
  if (fechaInicio < hoy) {
    throw new HttpError(400, 'No se pueden publicar cupos en días pasados')
  }

  // Cargar festivos colombianos dinámicamente (cálculo por año, fuente única)
  const year = fechaInicio.getFullYear()
  const festivoSet = new Set(obtenerFestivos(year).map(h => h.date))

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
    const esHoyDia = diaFecha.getTime() === hoy.getTime()

    for (const rango of rangos) {
      const horaInicio = parseHora(rango.inicio)
      const horaFin = parseHora(rango.fin)
      if (horaFin <= horaInicio) {
        throw new HttpError(400, 'El horario de fin debe ser posterior al de inicio')
      }
      // De HOY solo se publican bloques que aún no han comenzado
      if (esHoyDia && bloqueYaComenzo(horaInicio, ahora)) continue
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
  // 'fecha' se almacena como medianoche UTC del día calendario del gimnasio, así
  // que el límite inferior debe construirse en UTC o los cupos de HOY quedan fuera
  // (en UTC negativo la medianoche local cae horas después de la fecha almacenada).
  const hoy = new Date(Date.UTC(ahora.getFullYear(), ahora.getMonth(), ahora.getDate()))
  const manana = new Date(hoy)
  manana.setUTCDate(manana.getUTCDate() + 1)

  const cupos = await prisma.cupo.findMany({
    where: {
      fecha: { gte: manana },
      agenda: { is: null },
    },
    include: {
      creador: {
        select: { id_usuario: true, primer_nombre: true, primer_apellido: true },
      },
    },
    orderBy: [{ fecha: 'asc' }, { hora_inicio: 'asc' }],
  })

  const deHoy = await prisma.cupo.findMany({
    where: {
      fecha: { gte: hoy, lt: manana },
      agenda: { is: null },
    },
    include: {
      creador: {
        select: { id_usuario: true, primer_nombre: true, primer_apellido: true },
      },
    },
    orderBy: [{ hora_inicio: 'asc' }],
  })

  // De HOY solo se muestran los bloques que aún no han comenzado. El descarte se
  // hace en memoria a propósito: 'hora_inicio' es una columna TIME (hora de reloj
  // del gimnasio) y filtrarla contra un timestamp completo en SQL mezcla la fecha
  // UTC con la hora local, descartando cupos que aún no empiezan. Se reutiliza la
  // misma regla que aplica publicarCupos y reservarCupo.
  const disponiblesHoy = deHoy.filter(c => !bloqueYaComenzo(c.hora_inicio, ahora))

  return [...disponiblesHoy, ...cupos].map(mapCupo)
}

export async function reservarCupo(
  id_cupo: string,
  id_usuario: string,
  tipo: 'registro' | 'valoracion' = 'registro',
) {
  return prisma.$transaction(async (tx) => {
    const cupo = await tx.cupo.findUnique({
      where: { id_cupo: id_cupo },
      include: { agenda: true },
    })

    if (!cupo) throw new HttpError(404, 'Cupo no encontrado')
    if (cupo.agenda) throw new HttpError(400, 'Este cupo ya está reservado')

    // Misma regla que crearAgenda y actualizarAgenda: comparar la fecha almacenada
    // (medianoche UTC) contra el hoy local mezcla husos y daba por vencidos los
    // cupos de HOY que todavía no empiezan.
    validarAgendable(cupo.fecha, cupo.hora_inicio)

    const usuario = await tx.usuario.findUnique({
      where: { id_usuario },
      select: { id_usuario: true },
    })
    if (!usuario) throw new HttpError(404, 'Usuario no encontrado')

    if (tipo === 'valoracion') {
      const valoracionPendiente = await tx.agenda.findFirst({
        where: { id_usuario, tipo: 'valoracion', estado: 'pendiente' },
        select: { id_agenda: true },
      })
      if (valoracionPendiente) throw new HttpError(400, 'Ya tienes una cita de valoración pendiente')
    }

    const citaMismoDia = await tx.agenda.findFirst({
      where: { id_usuario, fecha: cupo.fecha, estado: { not: 'cancelado' } },
      select: { id_agenda: true },
    })
    if (citaMismoDia) throw new HttpError(400, 'Ya tienes una cita para este día')

    const agenda = await tx.agenda.create({
      data: {
        id_usuario,
        id_creador: cupo.id_creador,
        id_cupo: cupo.id_cupo,
        fecha: cupo.fecha,
        hora_inicio: cupo.hora_inicio,
        hora_fin: cupo.hora_fin,
        tipo,
        observaciones: tipo === 'valoracion' ? 'Valoración reservada a través de cupo' : 'Reservado a través de cupo',
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

export async function eliminarCupo(id_cupo: string) {
  const cupo = await prisma.cupo.findUnique({
    where: { id_cupo: id_cupo },
    include: { agenda: true },
  })

  if (!cupo) throw new HttpError(404, 'Cupo no encontrado')
  if (cupo.agenda) throw new HttpError(400, 'El cupo tiene una cita ligada; cancela la cita primero')

  await prisma.cupo.delete({ where: { id_cupo: id_cupo } })
  return { mensaje: 'Cupo eliminado' }
}
