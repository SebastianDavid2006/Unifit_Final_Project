import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  dayKey, dayLabelsGetDay, monthNames,
} from '../AgendaData'
import type { Appointment } from '../AgendaData'
import {
  defaultWeeklyTemplate, fmtDate, getMonthGrid, getWeekDates, overlapsRange, typeLabels,
} from './data'
import type { DayStatus } from './data'
import { getHoliday } from './holidays'
import { Banner } from './components/Banner'
import { DayModal } from './components/DayModal'
import { AppointmentModal, type AppointmentType } from './components/AppointmentModal'
import { PublishModal } from './components/PublishModal'
import { YearView } from './views/YearView'
import { MonthView } from './views/MonthView'
import { WeekView } from './views/WeekView'
import { DayView } from './views/DayView'
import { agendaToAppointment, apptTipoToAgenda } from './backend'
import {
  crearAgenda, editarAgenda, eliminarAgenda,
  getAgenda, getCuposDisponibles, publicarCupos, type HorarioPorDia,
} from '@/services/agenda.service'

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
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showApptModal, setShowApptModal] = useState(false)
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month' | 'year'>('month')
  const [hoveredCol, setHoveredCol] = useState<number | null>(null)
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)
  const [hoveredHour, setHoveredHour] = useState<string | null>(null)
  const [pressedCell, setPressedCell] = useState<{ col: number; row: number } | null>(null)
  const [dayModalDate, setDayModalDate] = useState<string | null>(null)

  const [weeklyTemplate] = useState(defaultWeeklyTemplate)

  const [dayExceptions, setDayExceptions] = useState<Record<string, { active: boolean; open?: string; close?: string; reason?: string }>>({})

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [editingApptId, setEditingApptId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const byName = useRef<Map<string, string>>(new Map())

  const [newApptType, setNewApptType] = useState<AppointmentType>('initial_assessment')
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [publishStart, setPublishStart] = useState('')
  const [publishEnd, setPublishEnd] = useState('')
  const [publishedDates, setPublishedDates] = useState<Set<string>>(new Set())
  const [publishDays, setPublishDays] = useState<string[]>(['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE'])
  const [publishStep, setPublishStep] = useState<1 | 2>(1)
  const [publishSelectedDay, setPublishSelectedDay] = useState<string | null>(null)
  const [showPublishConfirm, setShowPublishConfirm] = useState(false)
  const [showPublishSuccess, setShowPublishSuccess] = useState(false)
  const [publishDayConfig, setPublishDayConfig] = useState<Record<string, { ranges: { open: string; close: string }[] }>>({})
  const [rangeConflict, setRangeConflict] = useState<{ day: string; msg: string } | null>(null)
  const [newApptStart, setNewApptStart] = useState('08:00')
  const [newApptEnd, setNewApptEnd] = useState('09:00')
  const [newApptStudent, setNewApptStudent] = useState('')
  const [studentListOpen, setStudentListOpen] = useState(false)

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
    Promise.all([getAgenda(), getCuposDisponibles()])
      .then(([agenda, cupos]) => {
        if (!activo) return
        setAppointments(agenda.map(agendaToAppointment))
        setPublishedDates(new Set(cupos.map(c => c.fecha)))
      })
      .catch(() => {
        if (activo) setLoadError('No se pudo cargar la agenda')
      })
      .finally(() => {
        if (activo) setIsLoading(false)
      })
    return () => { activo = false }
  }, [students])

  function getDayStatus(dateStr: string): DayStatus {
    const dt = new Date(dateStr + 'T12:00:00')
    const dk = dayKey[dt.getDay()]
    const base = weeklyTemplate[dk] || { active: false, open: '08:00', close: '18:00' }
    const holiday = getHoliday(dateStr)
    if (dayExceptions[dateStr]) {
      const ex = dayExceptions[dateStr]
      return { active: ex.active, open: ex.open || base.open, close: ex.close || base.close, holiday: null }
    }
    if (holiday) return { active: false, open: base.open, close: base.close, holiday: holiday.name }
    return { ...base, holiday: null }
  }

  function getApptsForDate(dateStr: string) {
    return appointments.filter(a => a.date === dateStr)
  }

  async function handleSaveAppointment() {
    if (!selectedDate) return
    if (getDayStatus(selectedDate).holiday) return
    setActionError(null)
    const fecha = selectedDate
    const hora_inicio = newApptStart
    const hora_fin = newApptEnd || undefined
    const tipo = apptTipoToAgenda[newApptType]
    const tipo_otro = (newApptType === 'class' || newApptType === 'event') ? (typeLabels[newApptType] || 'Otro') : undefined
    try {
      if (editingApptId) {
        await editarAgenda(editingApptId, { fecha, hora_inicio, hora_fin, tipo, tipo_otro })
        const fallbackEnd = `${String(Number(newApptStart.split(':')[0]) + 1).padStart(2, '0')}:${newApptStart.split(':')[1] || '00'}`
        setAppointments(prev => prev.map(a => a.id === editingApptId ? {
          ...a, date: fecha, startTime: newApptStart, endTime: newApptEnd || fallbackEnd,
          type: newApptType, title: typeLabels[newApptType] || 'Cita',
          studentName: newApptStudent || undefined,
        } : a))
        setEditingApptId(null)
        setShowApptModal(false)
        setNewApptStudent('')
        return
      }
      const idUsuario = byName.current.get(newApptStudent)
      if (!idUsuario) {
        setActionError('Selecciona un estudiante de la lista para crear la cita')
        return
      }
      const creada = await crearAgenda({ id_usuario: idUsuario, fecha, hora_inicio, hora_fin, tipo, tipo_otro })
      setAppointments(prev => [...prev, agendaToAppointment(creada)])
      setShowApptModal(false)
      setNewApptStudent('')
    } catch (e) {
      setActionError('No se pudo guardar la cita')
    }
  }

  function handleEditAppointment(a: Appointment) {
    setDayModalDate(null)
    setSelectedDate(a.date)
    setNewApptType(a.type as AppointmentType)
    setNewApptStart(a.startTime)
    setNewApptEnd(a.endTime)
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
    } catch (e) {
      setActionError('No se pudo eliminar la cita')
    }
  }

  function handleSlotClick(dateStr: string, timeStr: string) {
    if (getDayStatus(dateStr).holiday) return
    setSelectedDate(dateStr)
    const [h, m] = timeStr.split(':')
    const normalized = `${String(Number(h)).padStart(2, '0')}:${m.padStart(2, '0')}`
    setNewApptStart(normalized)
    setNewApptEnd(`${String(Number(h) + 1).padStart(2, '0')}:${m.padStart(2, '0')}`)
    setNewApptType('initial_assessment')
    setNewApptStudent('')
    setEditingApptId(null)
    setShowApptModal(true)
  }

  function getDayConfig(day: string) {
    return publishDayConfig[day] || { ranges: [{ open: '06:00', close: '22:00' }] }
  }

  function updateDayRange(day: string, index: number, field: 'open' | 'close', value: string) {
    const cfg = getDayConfig(day)
    const ranges = cfg.ranges.map((r, i) => i === index ? { ...r, [field]: value } : r)
    const current = ranges[index]
    if (overlapsRange(current.open, current.close, ranges.slice(0, index))) {
      setRangeConflict({ day, msg: 'Horas ocupadas por un horario anterior' })
      return
    }
    setRangeConflict(null)
    setPublishDayConfig(prev => ({ ...prev, [day]: { ...cfg, ranges } }))
  }

  function addDayRange(day: string) {
    const cfg = getDayConfig(day)
    const defaults = [
      { open: '06:00', close: '08:00' }, { open: '08:00', close: '10:00' },
      { open: '10:00', close: '12:00' }, { open: '12:00', close: '14:00' },
      { open: '14:00', close: '16:00' }, { open: '16:00', close: '18:00' },
      { open: '18:00', close: '20:00' }, { open: '20:00', close: '22:00' },
    ]
    const free = defaults.find(d => !overlapsRange(d.open, d.close, cfg.ranges)) || { open: '07:00', close: '09:00' }
    setRangeConflict(null)
    setPublishDayConfig(prev => ({ ...prev, [day]: { ...cfg, ranges: [...cfg.ranges, free] } }))
  }

  function removeDayRange(day: string, index: number) {
    const cfg = getDayConfig(day)
    setRangeConflict(null)
    setPublishDayConfig(prev => ({ ...prev, [day]: { ...cfg, ranges: cfg.ranges.filter((_, i) => i !== index) } }))
  }

  function dayIsComplete(day: string) {
    const cfg = getDayConfig(day)
    return cfg.ranges.length > 0 && cfg.ranges.every(r => r.open && r.close && r.open < r.close)
  }

  async function handlePublish() {
    if (!publishStart || !publishEnd) return
    setActionError(null)

    const horariosPorDia = publishDays
      .map(key => {
        const cfg = getDayConfig(key)
        if (cfg.ranges.length === 0) return null
        return {
          dia: DIA_KEY_TO_LABEL[key],
          rangos: cfg.ranges.map(r => ({ inicio: r.open, fin: r.close })),
        }
      })
      .filter((x): x is HorarioPorDia => x !== null)

    if (horariosPorDia.length === 0) {
      setActionError('Configura al menos un horario por día para publicar')
      return
    }

    try {
      await publicarCupos({
        fecha_inicio: publishStart,
        fecha_fin: publishEnd,
        horarios_por_dia: horariosPorDia,
      })
      const start = new Date(publishStart + 'T00:00:00')
      const end = new Date(publishEnd + 'T00:00:00')
      const newDates = new Set(publishedDates)
      const current = new Date(start)
      while (current <= end) {
        newDates.add(fmtDate(current))
        current.setDate(current.getDate() + 1)
      }
      setPublishedDates(newDates)
      setRangeConflict(null)
      setShowPublishConfirm(false)
      setShowPublishSuccess(true)
    } catch (e) {
      setActionError('No se pudo publicar los cupos')
      setShowPublishConfirm(false)
    }
  }

  function openPublishModal() {
    setPublishStep(1)
    setRangeConflict(null)
    setPublishSelectedDay(null)
    setShowPublishConfirm(false)
    setShowPublishSuccess(false)
    setShowPublishModal(true)
  }

  function closePublishModal() {
    setRangeConflict(null)
    setPublishStep(1)
    setPublishSelectedDay(null)
    setShowPublishConfirm(false)
    setShowPublishSuccess(false)
    setShowPublishModal(false)
  }

  const allDaysComplete = publishDays.length > 0 && publishDays.every(dayIsComplete)
  const selDay = publishStep === 2 ? (publishSelectedDay && publishDays.includes(publishSelectedDay) ? publishSelectedDay : (publishDays[0] ?? null)) : null

  const editingAppt = editingApptId ? appointments.find(a => a.id === editingApptId) : null
  const apptDirty = !!editingAppt && (
    newApptType !== editingAppt.type ||
    newApptStart !== editingAppt.startTime ||
    newApptEnd !== editingAppt.endTime ||
    newApptStudent !== (editingAppt.studentName || '')
  )

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
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

  function openHoliday(ds: string) {
    setDayExceptions(prev => ({ ...prev, [ds]: { active: true } }))
  }

  function revertHoliday(ds: string) {
    setDayExceptions(prev => {
      const next = { ...prev }
      delete next[ds]
      return next
    })
  }

  const handleSelectDate = (ds: string) => {
    setSelectedDate(ds)
    setDayModalDate(ds)
  }

  const handleSelectMonth = (mi: number) => {
    setViewMode('month')
    setCurrentMonth(new Date(year, mi, 1))
  }

  const handleAddAppointmentFromModal = () => {
    setDayModalDate(null)
    setNewApptType('initial_assessment')
    setNewApptStart('08:00')
    setNewApptEnd('09:00')
    setNewApptStudent('')
    setEditingApptId(null)
    setShowApptModal(true)
  }

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
      <Banner onOpenPublish={openPublishModal} />

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
        holidayName={dayModalDate ? getHoliday(dayModalDate)?.name ?? null : null}
        isOverridden={!!(dayModalDate && dayExceptions[dayModalDate])}
        onOpenHoliday={() => { if (dayModalDate) openHoliday(dayModalDate) }}
        onRevertHoliday={() => { if (dayModalDate) revertHoliday(dayModalDate) }}
        appts={dayModalDate ? getApptsForDate(dayModalDate) : []}
        onAddAppointment={handleAddAppointmentFromModal}
        onEdit={handleEditAppointment}
      />

      <AppointmentModal
        show={showApptModal}
        title={editingApptId ? 'Reagendar Cita' : 'Nueva Cita'}
        editing={!!editingApptId}
        dirty={apptDirty}
        onClose={() => { setShowApptModal(false); setEditingApptId(null) }}
        onSave={handleSaveAppointment}
        onDelete={() => { if (editingApptId) handleDeleteAppointment(editingApptId) }}
        apptType={newApptType}
        onTypeChange={setNewApptType}
        startTime={newApptStart}
        endTime={newApptEnd}
        onStartChange={setNewApptStart}
        onEndChange={setNewApptEnd}
        student={newApptStudent}
        onStudentChange={setNewApptStudent}
        studentMatches={studentMatches}
        studentListOpen={studentListOpen}
        setStudentListOpen={setStudentListOpen}
      />

      <PublishModal
        show={showPublishModal}
        publishStep={publishStep}
        onClose={closePublishModal}
        publishStart={publishStart}
        publishEnd={publishEnd}
        onStartChange={setPublishStart}
        onEndChange={setPublishEnd}
        publishDays={publishDays}
        onToggleDay={(key) => setPublishDays(prev => prev.includes(key) ? prev.filter(d => d !== key) : [...prev, key])}
        selDay={selDay}
        onSelectDay={setPublishSelectedDay}
        allDaysComplete={allDaysComplete}
        dayIsComplete={dayIsComplete}
        showPublishSuccess={showPublishSuccess}
        showPublishConfirm={showPublishConfirm}
        onContinue={() => { setPublishSelectedDay(publishDays[0] ?? null); setPublishStep(2) }}
        onBack={() => setPublishStep(1)}
        onOpenConfirm={() => setShowPublishConfirm(true)}
        onCancelConfirm={() => setShowPublishConfirm(false)}
        onPublish={handlePublish}
        getDayConfig={getDayConfig}
        updateDayRange={updateDayRange}
        addDayRange={addDayRange}
        removeDayRange={removeDayRange}
        rangeConflict={rangeConflict}
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
