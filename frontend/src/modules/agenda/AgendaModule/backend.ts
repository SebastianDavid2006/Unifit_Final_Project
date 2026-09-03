import type { Appointment } from '../AgendaData'
import type { AppointmentType } from './components/AppointmentModal'
import { typeLabels } from './data'
import type { BackendAgenda, FrontendAgenda } from '@/services/agenda.service'

export const apptTipoToAgenda: Record<AppointmentType, BackendAgenda['tipo']> = {
  class: 'otro',
  initial_assessment: 'valoracion',
  physical_assessment: 'seguimiento',
  registration: 'registro',
  event: 'otro',
}

export function agendaTipoToAppt(tipo: BackendAgenda['tipo']): AppointmentType {
  switch (tipo) {
    case 'valoracion': return 'initial_assessment'
    case 'registro': return 'registration'
    case 'seguimiento': return 'physical_assessment'
    case 'otro': return 'event'
  }
}

export function agendaToAppointment(a: FrontendAgenda): Appointment {
  const type = agendaTipoToAppt(a.tipo)
  const startH = Number(a.horaInicio.split(':')[0]) || 0
  const end = a.horaFin || `${String(startH + 1).padStart(2, '0')}:${a.horaInicio.split(':')[1] || '00'}`
  return {
    id: a.id,
    date: a.fecha,
    startTime: a.horaInicio,
    endTime: end,
    type,
    title: typeLabels[type] || 'Cita',
    studentName: a.estudiante || undefined,
    trainer: a.creador || undefined,
  }
}
