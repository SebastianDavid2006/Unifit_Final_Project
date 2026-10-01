interface CitaConHorario {
  fecha: Date
  hora_inicio: Date
  hora_fin: Date | null
}

// Reloj del gimnasio: fecha y hora se guardan con sus componentes en UTC
export function finDeCita(c: CitaConHorario): Date {
  const h = c.hora_fin ?? c.hora_inicio
  return new Date(c.fecha.getUTCFullYear(), c.fecha.getUTCMonth(), c.fecha.getUTCDate(), h.getUTCHours(), h.getUTCMinutes(), 0, 0)
}

// Una cita pendiente solo cuenta mientras no haya terminado
export function citaVigente(c: CitaConHorario): boolean {
  return finDeCita(c).getTime() > Date.now()
}
