import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  dayKey, dayLabelsGetDay, monthNames,
} from '../AgendaData'
import type { Appointment } from '../AgendaData'
import {
  fmtDate, getMonthGrid, getWeekDates, setTimeSlots, typeLabels,
} from './data'
import type { DayStatus } from './data'
import { Banner } from './components/Banner'
import { DayModal } from './components/DayModal'
import { AppointmentModal, type AppointmentType } from './components/AppointmentModal'
import { YearView } from './views/YearView'
import { MonthView } from './views/MonthView'
import { WeekView } from './views/WeekView'
import { DayView } from './views/DayView'
import { agendaToAppointment, apptTipoToAgenda } from './backend'
import {
  crearAgenda, editarAgenda, eliminarAgenda, eliminarCupo,
  getAgenda, getBloques, getCupos, obtenerFestivos, publicarCupos, type BloqueDelDia, type CupoConReserva, type HorarioPorDia,
} from '@/services/agenda.service'
import { mensajeError } from '@/lib/api'
import { getUsuario } from '@/lib/auth'

interface AgendaStudent {
  name: string
  id_usuario?: string
  carnetId?: string
  program?: string
  faculty?: string
  avatar?: string
}

const DIA_KEY_TO_LABEL: Record<string, HorarioPorDia['dia']> = {
  DOM: 'dom',
  LUN: 'lun',
  MAR: 'mar',
  MIÉ: 'mié',
  JUE: 'jue',
  VIE: 'vie',
  SÁB: 'sáb',
}

export default function AgendaModule({ students = [] }: { students?: AgendaStudent[] }) {
  const isAdmin = getUsuario()?.rol === 'admin'
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showApptModal, setShowApptModal] = useState(false)
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month' | 'year'>('month')
  const [hoveredCol, setHoveredCol] = useState<number | null>(null)
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)
  const [hoveredHour, setHoveredHour] = useState<string | null>(null)
  const [pressedCell, setPressedCell] = useState<{ col: number; row: number } | null>(null)
  const [dayModalDate, setDayModalDate] = useState<string | null>(null)

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [cupos, setCupos] = useState<CupoConReserva[]>([])
  const [bloques, setBloques] = useState<BloqueDelDia[]>([])
  const [festivos, setFestivos] = useState<Map<string, string>>(new Map())
  const [publishedDates, setPublishedDates] = useState<Set<string>>(new Set())
  const [editingApptId, setEditingApptId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  // Errores del formulario de cita: viven dentro del modal y se limpian al abrirlo o cerrarlo
  const [apptError, setApptError] = useState<string | null>(null)

  useEffect(() => { setApptError(null) }, [showApptModal])
  // El aviso global (acciones fuera del modal) se descarta solo
  useEffect(() => {
    if (!actionError) return
    const t = setTimeout(() => setActionError(null), 6000)
    return () => clearTimeout(t)
  }, [actionError])
  const byName = useRef<Map<string, string>>(new Map())

  const [newApptType, setNewApptType] = useState<AppointmentType>('initial_assessment')
  const [newApptStart, setNewApptStart] = useState('08:00')
  const [newApptStudent, setNewApptStudent] = useState('')
  const [studentListOpen, setStudentListOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const studentMatches = useMemo(() => {
    const q = newApptStudent.trim().toLowerCase()
    if (!q) return []
    return students.filter(s => s.name.toLowerCase().includes(q))
  }, [students, newApptStudent])

  useEffect(() => {
    const mapa = new Map<string, string>()
    for (const s of students) if (s.id_usuario) mapa.set(s.name, s.id_usuario)
    byName.current = mapa

    let activo = true
    setIsLoading(true)
    setLoadError(null)
    Promise.all([getAgenda(), getCupos(), getBloques()])
      .then(([agenda, cuposData, bloquesData]) => {
        if (!activo) return
        setAppointments(agenda.map(agendaToAppointment))
        setCupos(cuposData)
        setBloques(bloquesData)
        setPublishedDates(new Set(cuposData.map(c => c.fecha)))
        setTimeSlots(bloquesData.map(b => b.inicio.slice(0, 5)))
      })
      .catch(() => {
        if (activo) setLoadError('No se pudo cargar la agenda')
      })
      .finally(() => {
        if (activo) setIsLoading(false)
      })
    return () => { activo = false }
  }, [students])

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  useEffect(() => {
    let activo = true
    obtenerFestivos(year)
      .then(fs => { if (activo) setFestivos(new Map(fs.map(f => [f.date, f.name]))) })
      .catch(() => { if (activo) setFestivos(new Map()) })
    return () => { activo = false }
  }, [year])

  useEffect(() => {
    if (dayModalDate) void refreshCupos()
  }, [dayModalDate])

  function getDayStatus(dateStr: string): DayStatus {
    const hol = festivos.get(dateStr)
    if (hol) return { active: false, open: '08:00', close: '22:00', holiday: hol }
    if (new Date(`${dateStr}T12:00:00`).getDay() === 0) {
      return { active: false, open: '08:00', close: '22:00', holiday: 'Cerrado', domingo: true }
    }
    return { active: true, open: '08:00', close: '22:00', holiday: null }
  }

  function getApptsForDate(dateStr: string) {
    return appointments.filter(a => a.date === dateStr)
  }

  const ocupadosEnFecha = useMemo(() => {
    const s = new Set<string>()
    if (!selectedDate) return s
    for (const a of appointments) if (a.date === selectedDate) s.add(a.startTime.slice(0, 5))
    return s
  }, [appointments, selectedDate])

  const cuposLibresEnFecha = useMemo(() => {
    const s = new Set<string>()
    if (!selectedDate) return s
    for (const c of cupos) if (c.fecha === selectedDate && !c.reserva) s.add(c.hora_inicio.slice(0, 5))
    return s
  }, [cupos, selectedDate])

  function handleStepFecha(delta: -1 | 1) {
    if (!selectedDate) return
    const d = new Date(selectedDate + 'T12:00:00')
    d.setDate(d.getDate() + delta)
    setSelectedDate(fmtDate(d))
  }

  async function handleSaveAppointment() {
    if (!selectedDate) return
    setApptError(null)
    const bloque = bloques.find(b => b.inicio.slice(0, 5) === newApptStart)
    if (!bloque) {
      setApptError('Selecciona un bloque válido (08:00 – 22:00)')
      return
    }
    const fecha = selectedDate
    const hora_inicio = newApptStart
    const hora_fin = bloque.fin
    const tipo = apptTipoToAgenda[newApptType]
    const tipo_otro = (newApptType === 'class' || newApptType === 'event') ? (typeLabels[newApptType] || 'Otro') : undefined
    try {
      if (editingApptId) {
        await editarAgenda(editingApptId, { fecha, hora_inicio, hora_fin, tipo, tipo_otro })
        setAppointments(prev => prev.map(a => a.id === editingApptId ? {
          ...a, date: fecha, startTime: hora_inicio, endTime: hora_fin,
          type: newApptType, title: typeLabels[newApptType] || 'Cita',
          studentName: newApptStudent || undefined,
        } : a))
        setEditingApptId(null)
        setShowApptModal(false)
        setNewApptStudent('')
        void refreshCupos()
        return
      }
      const idUsuario = byName.current.get(newApptStudent)
      if (!idUsuario) {
        setApptError('Selecciona un usuario de la lista para crear la cita')
        return
      }
      const creada = await crearAgenda({ id_usuario: idUsuario, fecha, hora_inicio, hora_fin, tipo, tipo_otro })
      setAppointments(prev => [...prev, agendaToAppointment(creada)])
      setShowApptModal(false)
      setNewApptStudent('')
      void refreshCupos()
    } catch (e) {
      setApptError(mensajeError(e) === 'Error inesperado' ? 'No se pudo guardar la cita' : mensajeError(e))
    }
  }

  function handleEditAppointment(a: Appointment) {
    setDayModalDate(null)
    setSelectedDate(a.date)
    setNewApptType(a.type as AppointmentType)
    setNewApptStart(a.startTime)
    setNewApptStudent(a.studentName || '')
    setEditingApptId(a.id)
    setShowApptModal(true)
  }

  async function handleDeleteAppointment(id: string) {
    try {
      await eliminarAgenda(id)
      setAppointments(prev => prev.filter(a => a.id !== id))
      setShowApptModal(false)
      setEditingApptId(null)
      void refreshCupos()
    } catch (e) {
      ;(showApptModal ? setApptError : setActionError)('No se pudo eliminar la cita')
    }
  }

  function handleVolverAlDia() {
    setShowApptModal(false)
    setEditingApptId(null)
    setNewApptStudent('')
    setDayModalDate(selectedDate)
  }

  function handleSlotClick(dateStr: string, timeStr: string) {
    if (getDayStatus(dateStr).holiday) return
    if (dateStr < todayStr) return
    setSelectedDate(dateStr)
    const [h, m] = timeStr.split(':')
    setNewApptStart(`${String(Number(h)).padStart(2, '0')}:${m.padStart(2, '0')}`)
    setNewApptType('initial_assessment')
    setNewApptStudent('')
    setEditingApptId(null)
    setShowApptModal(true)
  }

  function handleSelectDate(ds: string) {
    setSelectedDate(ds)
    setDayModalDate(ds)
  }

  function handleSelectMonth(mi: number) {
    setViewMode('month')
    setCurrentMonth(new Date(year, mi, 1))
  }

  function handleAddAppointmentFromModal() {
    if (selectedDate && selectedDate < todayStr) return
    setDayModalDate(null)
    setNewApptType('initial_assessment')
    setNewApptStart('08:00')
    setNewApptStudent('')
    setEditingApptId(null)
    setShowApptModal(true)
  }

  async function handlePublishDay(rangos: { inicio: string; fin: string }[]): Promise<boolean> {
    if (!dayModalDate || rangos.length === 0) return false
    setActionError(null)
    const dk = dayKey[new Date(dayModalDate + 'T12:00:00').getDay()]
    const dia = DIA_KEY_TO_LABEL[dk]
    if (!dia) {
      setActionError('Fecha inválida para publicar')
      return false
    }
    try {
      await publicarCupos({
        fecha_inicio: dayModalDate,
        fecha_fin: dayModalDate,
        horarios_por_dia: [{ dia, rangos }],
      })
      const updated = await getCupos()
      setCupos(updated)
      setPublishedDates(new Set(updated.map(c => c.fecha)))
      return true
    } catch (e) {
      const msg = mensajeError(e)
      setActionError(msg === 'Error inesperado' ? 'No se pudo publicar los cupos del día' : msg)
      return false
    }
  }

  async function refreshCupos() {
    try {
      const updated = await getCupos()
      setCupos(updated)
      setPublishedDates(new Set(updated.map(c => c.fecha)))
    } catch { /* silencioso */ }
  }

  async function handleQuitarCupo(idCupo: string): Promise<boolean> {
    try {
      await eliminarCupo(idCupo)
      const updated = await getCupos()
      setCupos(updated)
      setPublishedDates(new Set(updated.map(c => c.fecha)))
      return true
    } catch (e) {
      setActionError('No se pudo quitar el cupo')
      return false
    }
  }

  const editingAppt = editingApptId ? appointments.find(a => a.id === editingApptId) : null
  const apptDirty = !!editingAppt && (
    newApptType !== editingAppt.type ||
    newApptStart !== editingAppt.startTime ||
    newApptStudent !== (editingAppt.studentName || '') ||
    selectedDate !== editingAppt.date
  )

  const todayStr = fmtDate(new Date())
  const weekDates = getWeekDates(currentMonth)

  const handlePrevView = () => {
    if (viewMode === 'day') {
      const d = new Date(currentMonth)
      d.setDate(d.getDate() - 1)
      setCurrentMonth(d)
    } else if (viewMode === 'year') setCurrentMonth(prev => new Date(prev.getFullYear() - 1, prev.getMonth(), 1))
    else if (viewMode === 'week') {
      const d = new Date(weekDates[0])
      d.setDate(d.getDate() - 3)
      setCurrentMonth(d)
    } else setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }
  const handleNextView = () => {
    if (viewMode === 'day') {
      const d = new Date(currentMonth)
      d.setDate(d.getDate() + 1)
      setCurrentMonth(d)
    } else if (viewMode === 'year') setCurrentMonth(prev => new Date(prev.getFullYear() + 1, prev.getMonth(), 1))
    else if (viewMode === 'week') {
      const d = new Date(weekDates[6])
      d.setDate(d.getDate() + 4)
      setCurrentMonth(d)
    } else setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const viewTitle = viewMode === 'year'
    ? `Año ${year}`
    : viewMode === 'week'
    ? `Semana del ${weekDates[0].getDate()} al ${weekDates[6].getDate()} de ${monthNames[weekDates[0].getMonth()]}${weekDates[0].getMonth() !== weekDates[6].getMonth() ? ` - ${monthNames[weekDates[6].getMonth()]}` : ''}`
    : viewMode === 'day'
    ? `${dayLabelsGetDay[currentMonth.getDay()]} ${currentMonth.getDate()} de ${monthNames[currentMonth.getMonth()]}`
    : `${monthNames[month]} ${year}`

  const headerProps = {
    viewMode,
    onViewModeChange: setViewMode,
    viewTitle,
    onPrev: handlePrevView,
    onNext: handleNextView,
    isExpanded,
    onToggleExpand: () => setIsExpanded(!isExpanded),
  }

  function renderView(fullscreen: boolean) {
    if (viewMode === 'year') {
      return <YearView fullscreen={fullscreen} {...headerProps} year={year} todayStr={todayStr} appointments={appointments} publishedDates={publishedDates} onSelectMonth={handleSelectMonth} />
    }
    if (viewMode === 'week') {
      return <WeekView fullscreen={fullscreen} {...headerProps} weekDates={weekDates} todayStr={todayStr} publishedDates={publishedDates} getDayStatus={getDayStatus} hoveredCol={hoveredCol} hoveredHour={hoveredHour} setHoveredCol={setHoveredCol} setHoveredHour={setHoveredHour} getApptsForDate={getApptsForDate} onSlotClick={handleSlotClick} onEditAppt={handleEditAppointment} hoverSlots={!fullscreen} />
    }
    if (viewMode === 'day') {
      return <DayView fullscreen={fullscreen} {...headerProps} currentMonth={currentMonth} getDayStatus={getDayStatus} getApptsForDate={getApptsForDate} onSlotClick={handleSlotClick} onEditAppt={handleEditAppointment} />
    }
    return <MonthView fullscreen={fullscreen} {...headerProps} year={year} month={month} todayStr={todayStr} getMonthGrid={getMonthGrid} getDayStatus={getDayStatus} getApptsForDate={getApptsForDate} publishedDates={publishedDates} hoveredCol={hoveredCol} hoveredRow={hoveredRow} pressedCell={pressedCell} setHoveredCol={setHoveredCol} setHoveredRow={setHoveredRow} setPressedCell={setPressedCell} onSelectDate={handleSelectDate} />
  }

  return (
    <div className="p-8 pt-12 max-w-[1440px] mx-auto relative overflow-x-hidden" style={{ maxWidth: '100%' }}>
      <Banner />

      {loadError && (
        <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.35)', color: '#FF8FA3', fontSize: 12 }}>
          {loadError}
        </div>
      )}
      {actionError && (
        <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.35)', color: '#FF8FA3', fontSize: 12 }}>
          {actionError}
        </div>
      )}

      {isLoading ? (
        <div className="py-16 text-center" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12.5, fontWeight: 600 }}>
          Cargando agenda…
        </div>
      ) : (
        <div className="space-y-4">
          {renderView(false)}
        </div>
      )}

      <DayModal
        date={dayModalDate}
        onClose={() => setDayModalDate(null)}
        status={dayModalDate ? getDayStatus(dayModalDate) : null}
        appts={dayModalDate ? getApptsForDate(dayModalDate) : []}
        onAddAppointment={handleAddAppointmentFromModal}
        onEdit={handleEditAppointment}
        isAdmin={isAdmin}
        blocks={bloques}
        cuposDeFecha={dayModalDate ? cupos.filter(c => c.fecha === dayModalDate) : []}
        onPublishDay={handlePublishDay}
        onQuitarCupo={handleQuitarCupo}
      />

      <AppointmentModal
        show={showApptModal}
        title={editingApptId ? 'Reagendar Cita' : 'Nueva Cita'}
        editing={!!editingApptId}
        dirty={apptDirty}
        onClose={() => { setShowApptModal(false); setEditingApptId(null) }}
        onBack={handleVolverAlDia}
        onSave={handleSaveAppointment}
        onDelete={() => { if (editingApptId) handleDeleteAppointment(editingApptId) }}
        apptType={newApptType}
        onTypeChange={setNewApptType}
        fecha={selectedDate || ''}
        onStepFecha={editingApptId ? handleStepFecha : undefined}
        blocks={bloques}
        ocupados={ocupadosEnFecha}
        cuposLibres={cuposLibresEnFecha}
        startTime={newApptStart}
        onStartChange={setNewApptStart}
        student={newApptStudent}
        onStudentChange={setNewApptStudent}
        studentMatches={studentMatches}
        studentListOpen={studentListOpen}
        setStudentListOpen={setStudentListOpen}
        error={apptError}
      />

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(14px)' }}
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="w-full max-w-4xl mx-auto" style={{ height: '90vh' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="h-full space-y-4">
                {renderView(true)}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}