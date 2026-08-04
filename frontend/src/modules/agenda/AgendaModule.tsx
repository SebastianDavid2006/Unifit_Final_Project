import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronRight, Plus, X, ChevronLeft, Sparkles, Maximize2, Minimize2, Check, AlertTriangle } from 'lucide-react'
import calendarImg from '../../assets/illustrations/modules/calendar_module.webp'
import calendarCardImg from '../../assets/icons/objects/calendar.webp'
import coachCalendarSuccessImg from '../../assets/illustrations/characters/coach/coach_calendar_success.webp'
import { meshInputBg, meshInputHover, GREEN_GRAD } from '../../data/constants'
import { initialTrainers } from '../../data/trainers'

const RED = '#F43843'
const BLUE = '#1270B7'
const YELLOW = '#F1C827'
const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #1A8CDB, #0D5F9E)'
const GOLD_GRAD = 'linear-gradient(135deg, #F1C827, #FFD60A, #D4A800)'

interface Appointment {
  id: string; date: string; startTime: string; endTime: string
  type: 'class' | 'initial_assessment' | 'physical_assessment' | 'registration' | 'event'
  title: string; studentName?: string; trainer?: string; notes?: string
}

const dayKey = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB']
const dayLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const dayLabelsGetDay = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

const DAY_GRAD = 'linear-gradient(135deg, #1270B7, #7ec8e3)'

const WEEK_DAYS_6: { key: string; label: string; short: string }[] = [
  { key: 'LUN', label: 'Lunes', short: 'Lun' },
  { key: 'MAR', label: 'Martes', short: 'Mar' },
  { key: 'MIÉ', label: 'Miércoles', short: 'Mié' },
  { key: 'JUE', label: 'Jueves', short: 'Jue' },
  { key: 'VIE', label: 'Viernes', short: 'Vie' },
  { key: 'SÁB', label: 'Sábado', short: 'Sáb' },
]

function DayCard({ label, selected, done, onClick }: { label: string; selected: boolean; done?: boolean; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      whileHover={!selected ? { scale: 1.05 } : {}}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative flex flex-col items-center gap-1.5 px-2 py-3.5 rounded-xl text-sm font-bold transition-all duration-200"
      style={{
        background: selected ? DAY_GRAD : 'rgba(0,0,0,0.03)',
        color: selected ? '#FFFFFF' : 'rgba(0,0,0,0.35)',
        border: '1px solid transparent',
        boxShadow: selected ? '0 4px 20px rgba(18,112,183,0.25)' : 'none',
      }}
      onMouseEnter={e => { if (!selected) { e.currentTarget.style.background = 'rgba(18,112,183,0.12)'; e.currentTarget.style.color = '#1270B7' } }}
      onMouseLeave={e => { if (!selected) { e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; e.currentTarget.style.color = 'rgba(0,0,0,0.35)' } }}
    >
      <motion.img
        src={calendarCardImg}
        alt=""
        className="mb-0.5"
        animate={{
          width: selected ? 48 : 24,
          height: selected ? 48 : 24,
          marginTop: selected ? -24 : 0,
          filter: selected ? 'blur(0px) drop-shadow(0 8px 20px rgba(0,0,0,0.15))' : 'blur(0px)',
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      />
      <span className="text-sm leading-none text-center">{label}</span>
      {done !== undefined && (
        <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
          style={{ background: done ? '#30D158' : 'rgba(0,0,0,0.1)' }}>
          <Check size={10} color="#fff" strokeWidth={3.5} />
        </span>
      )}
    </motion.button>
  )
}

export default function AgendaModule({ students = [] }: { students?: { name: string; carnetId?: string; program?: string; faculty?: string; avatar?: string }[] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showApptModal, setShowApptModal] = useState(false)
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month' | 'year'>('month')
  const [hoveredCol, setHoveredCol] = useState<number | null>(null)
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)
  const [hoveredHour, setHoveredHour] = useState<string | null>(null)
  const [pressedCell, setPressedCell] = useState<{ col: number; row: number } | null>(null)
  const [dayModalDate, setDayModalDate] = useState<string | null>(null)

  const [weeklyTemplate] = useState<Record<string, { active: boolean; open: string; close: string }>>({
    LUN: { active: true, open: '06:00', close: '22:00' },
    MAR: { active: true, open: '06:00', close: '22:00' },
    MIÉ: { active: true, open: '06:00', close: '22:00' },
    JUE: { active: true, open: '06:00', close: '22:00' },
    VIE: { active: true, open: '06:00', close: '22:00' },
    SÁB: { active: true, open: '08:00', close: '18:00' },
    DOM: { active: false, open: '08:00', close: '14:00' },
  })

  const [dayExceptions, setDayExceptions] = useState<Record<string, { active: boolean; open?: string; close?: string; reason?: string }>>({})

  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: '1', date: '2026-06-22', startTime: '07:00', endTime: '08:00', type: 'class', title: 'Spinning', trainer: 'Carlos' },
    { id: '2', date: '2026-06-22', startTime: '10:00', endTime: '11:00', type: 'initial_assessment', title: 'Valoración Inicial', studentName: 'Ana Pérez' },
    { id: '3', date: '2026-06-23', startTime: '08:00', endTime: '09:00', type: 'class', title: 'CrossFit', trainer: 'Luis' },
    { id: '4', date: '2026-06-23', startTime: '14:00', endTime: '15:00', type: 'class', title: 'Funcional', trainer: 'María' },
    { id: '5', date: '2026-06-24', startTime: '07:00', endTime: '08:00', type: 'class', title: 'Spinning', trainer: 'Carlos' },
    { id: '6', date: '2026-06-24', startTime: '16:00', endTime: '17:00', type: 'class', title: 'Boxeo', trainer: 'Pedro' },
    { id: '7', date: '2026-06-25', startTime: '09:00', endTime: '10:00', type: 'physical_assessment', title: 'Valoración Física', studentName: 'Lucía Gómez' },
    { id: '8', date: '2026-06-25', startTime: '15:00', endTime: '16:00', type: 'event', title: 'Mantenimiento General' },
    { id: '9', date: '2026-06-26', startTime: '17:00', endTime: '18:00', type: 'class', title: 'Zumba', trainer: 'María' },
    { id: '10', date: '2026-06-27', startTime: '09:00', endTime: '10:00', type: 'registration', title: 'Registro Nuevo Ingreso', studentName: 'Diego Ramírez' },
    { id: '11', date: '2026-06-28', startTime: '10:00', endTime: '11:00', type: 'initial_assessment', title: 'Valoración Inicial', studentName: 'Carlos Ruiz' },
    { id: '12', date: '2026-06-21', startTime: '09:00', endTime: '10:00', type: 'class', title: 'Yoga Restaurativo', trainer: 'Ana', studentName: 'María Fernández' },
    { id: '13', date: '2026-06-21', startTime: '11:00', endTime: '12:00', type: 'initial_assessment', title: 'Valoración Inicial', studentName: 'Pedro Sánchez' },
    { id: '14', date: '2026-06-21', startTime: '15:00', endTime: '16:00', type: 'registration', title: 'Registro Membresía', studentName: 'Laura Vega' },
    { id: '15', date: '2026-06-24', startTime: '10:00', endTime: '11:00', type: 'physical_assessment', title: 'Valoración Física', studentName: 'Sofía Morales' },
    { id: '16', date: '2026-06-20', startTime: '08:00', endTime: '09:00', type: 'registration', title: 'Registro Nuevo Ingreso', studentName: 'Jorge Torres' },
  ])

  const [newApptType, setNewApptType] = useState<'class' | 'initial_assessment' | 'physical_assessment' | 'registration' | 'event'>('initial_assessment')
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
  const [publishDayConfig, setPublishDayConfig] = useState<Record<string, { duration: string; ranges: { open: string; close: string }[] }>>({})
  const [rangeConflict, setRangeConflict] = useState<{ day: string; msg: string } | null>(null)
  const [newApptStart, setNewApptStart] = useState('08:00')
  const [newApptEnd, setNewApptEnd] = useState('09:00')
  const [newApptTrainer, setNewApptTrainer] = useState('')
  const [trainerListOpen, setTrainerListOpen] = useState(false)
  const [newApptStudent, setNewApptStudent] = useState('')
  const [studentListOpen, setStudentListOpen] = useState(false)

  const studentMatches = useMemo(() => {
    const q = newApptStudent.trim().toLowerCase()
    if (!q) return []
    return students.filter(s => s.name.toLowerCase().includes(q))
  }, [students, newApptStudent])

  const trainerMatches = useMemo(() => {
    const q = newApptTrainer.trim().toLowerCase()
    if (!q) return []
    return initialTrainers.filter(t => t.name.toLowerCase().includes(q))
  }, [newApptTrainer])

  function fmtDate(d: Date) {
    const y = d.getFullYear(); const m = String(d.getMonth() + 1).padStart(2, '0'); const dd = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${dd}`
  }

  function getWeekDates(ref: Date): Date[] {
    const d = new Date(ref)
    const day = d.getDay()
    const diff = day === 0 ? -6 : 1 - day
    d.setDate(d.getDate() + diff)
    const week: Date[] = []
    for (let i = 0; i < 7; i++) {
      week.push(new Date(d))
      d.setDate(d.getDate() + 1)
    }
    return week
  }

  function getMonthGrid(year: number, month: number): (Date | null)[][] {
    const first = new Date(year, month, 1)
    const last = new Date(year, month + 1, 0)
    const pad = first.getDay() === 0 ? 6 : first.getDay() - 1
    const weeks: (Date | null)[][] = []
    let wk: (Date | null)[] = []
    for (let i = 0; i < pad; i++) wk.push(null)
    for (let d = 1; d <= last.getDate(); d++) {
      const dt = new Date(year, month, d)
      wk.push(dt)
      if (wk.length === 7) { weeks.push(wk); wk = [] }
    }
    while (wk.length < 7) wk.push(null)
    if (wk.some(x => x)) weeks.push(wk)
    return weeks
  }

  function getDayStatus(dateStr: string) {
    const dt = new Date(dateStr + 'T12:00:00')
    const dk = dayKey[dt.getDay()]
    const base = weeklyTemplate[dk] || { active: false, open: '08:00', close: '18:00' }
    if (dayExceptions[dateStr]) {
      const ex = dayExceptions[dateStr]
      return { active: ex.active, open: ex.open || base.open, close: ex.close || base.close }
    }
    return base
  }

  function getApptsForDate(dateStr: string) {
    return appointments.filter(a => a.date === dateStr)
  }

  function handleAddAppointment() {
    if (!selectedDate) return
    const newId = String(Date.now())
    setAppointments(prev => [...prev, {
      id: newId, date: selectedDate, startTime: newApptStart, endTime: newApptEnd,
      type: newApptType, title: typeLabels[newApptType] || 'Cita', trainer: newApptTrainer || undefined,
      studentName: newApptStudent || undefined,
    }])
    setShowApptModal(false)
    setNewApptStudent(''); setNewApptTrainer('')
  }

  function handleSlotClick(dateStr: string, timeStr: string) {
    setSelectedDate(dateStr)
    const [h, m] = timeStr.split(':')
    const normalized = `${String(Number(h)).padStart(2, '0')}:${m.padStart(2, '0')}`
    setNewApptStart(normalized)
    setNewApptEnd(`${String(Number(h) + 1).padStart(2, '0')}:${m.padStart(2, '0')}`)
    setNewApptType('initial_assessment')
    setNewApptTrainer('')
    setNewApptStudent('')
    setShowApptModal(true)
  }

  function getDayConfig(day: string) {
    return publishDayConfig[day] || { duration: '60', ranges: [{ open: '06:00', close: '22:00' }] }
  }

  function overlapsRange(open: string, close: string, ranges: { open: string; close: string }[]) {
    return ranges.some(r => r.open < close && open < r.close)
  }

  function updateDayDuration(day: string, duration: string) {
    const cfg = getDayConfig(day)
    setPublishDayConfig(prev => ({ ...prev, [day]: { ...cfg, duration } }))
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

  function handlePublish() {
    if (!publishStart || !publishEnd) return
    const start = new Date(publishStart + 'T00:00:00')
    const end = new Date(publishEnd + 'T00:00:00')
    const newDates = new Set(publishedDates)
    const current = new Date(start)
    while (current <= end) {
      const ds = fmtDate(current)
      const dk = dayKey[current.getDay()]
      if (publishDays.includes(dk)) {
        if (newDates.has(ds)) newDates.delete(ds)
        else newDates.add(ds)
      }
      current.setDate(current.getDate() + 1)
    }
    setPublishedDates(newDates)
    setRangeConflict(null)
    setShowPublishConfirm(false)
    setShowPublishSuccess(true)
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

  function dayIsComplete(day: string) {
    const cfg = getDayConfig(day)
    return cfg.ranges.length > 0 && cfg.ranges.every(r => r.open && r.close && r.open < r.close)
  }

  const allDaysComplete = publishDays.length > 0 && publishDays.every(dayIsComplete)
  const selDay = publishStep === 2 ? (publishSelectedDay && publishDays.includes(publishSelectedDay) ? publishSelectedDay : (publishDays[0] ?? null)) : null

  function fmtShortDate(ds: string) {
    if (!ds) return ''
    const d = new Date(ds + 'T00:00:00')
    return `${d.getDate()} ${monthNames[d.getMonth()].slice(0, 3)}`
  }

  function renderPublishSuccess() {
    const activeLabels = publishDays.map(dk => WEEK_DAYS_6.find(w => w.key === dk)?.label).filter(Boolean) as string[]
    const activeStr = activeLabels.length > 1
      ? activeLabels.slice(0, -1).join(', ') + ' y ' + activeLabels[activeLabels.length - 1]
      : activeLabels[0] || ''
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center px-6 pb-8 relative"
        style={{ overflow: 'visible' }}
      >
        <div className="relative flex items-center justify-center z-10" style={{ marginTop: '-120px', marginBottom: '1.5rem' }}>
          {[...Array(24)].map((_, i) => {
            const angle = (i / 24) * 360
            const rad = (angle * Math.PI) / 180
            return (
              <motion.span
                key={i}
                className="absolute pointer-events-none text-lg select-none"
                style={{ color: '#4ADE80' }}
                animate={{
                  x: [0, Math.cos(rad) * (110 + (i % 6) * 20)],
                  y: [0, Math.sin(rad) * (110 + (i % 6) * 20)],
                  opacity: [0, 1, 0],
                  scale: [0, 1.4, 0],
                }}
                transition={{
                  duration: 2.5 + (i % 4) * 0.3,
                  repeat: Infinity,
                  delay: i * 0.07,
                  ease: 'easeOut',
                }}
              >
                ✦
              </motion.span>
            )
          })}
          <div className="relative flex items-center justify-center">
            <motion.img
              src={coachCalendarSuccessImg}
              alt="felicitaciones"
              className="w-72 h-auto object-contain relative z-10"
              style={{ filter: 'drop-shadow(0 0 30px rgba(34,197,94,0.15))' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-48 pointer-events-none z-20" style={{
              background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 15%, rgba(255,255,255,0) 55%)',
            }} />
          </div>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-3xl font-bold text-center z-10"
          style={{ color: '#1A1A1E' }}
        >
          ¡Cupos publicados!
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-sm text-center mt-1.5 mb-8 z-10"
          style={{ color: 'rgba(0,0,0,0.7)' }}
        >
          <span style={{ background: 'linear-gradient(135deg, #30D158, #0A84FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700 }}>Tu agenda</span> quedó lista en el calendario.<br />
          <span className="text-xs" style={{ color: 'rgba(0,0,0,0.4)' }}>
            {fmtShortDate(publishStart)} – {fmtShortDate(publishEnd)} · {activeStr}
          </span>
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={closePublishModal}
          className="px-8 py-2.5 rounded-2xl text-xs font-bold text-white cursor-pointer"
          style={{ background: GREEN_GRAD }}
        >
          Cerrar
        </motion.button>
      </motion.div>
    )
  }

  function enterMesh(el: HTMLElement) {
    if (el !== document.activeElement) { el.style.background = meshInputHover; el.style.borderColor = 'rgba(0,0,0,0.06)' }
  }
  function leaveMesh(el: HTMLElement) {
    if (el !== document.activeElement) { el.style.background = meshInputBg; el.style.borderColor = 'transparent' }
  }
  function focusMesh(el: HTMLElement) {
    el.style.borderColor = '#1270B7'; el.style.background = meshInputHover; el.style.boxShadow = '0 0 0 3px rgba(18,112,183,0.08)'
  }
  function blurMesh(el: HTMLElement) {
    el.style.borderColor = 'transparent'; el.style.background = meshInputBg; el.style.boxShadow = 'none'
  }

  function renderDayCell(dt: Date | null, idx: number, lastRow?: boolean, mini?: boolean, rowIdx: number = 0, totalRows: number = 1) {
    if (!dt) return <div key={idx} className={mini ? 'min-h-[60px]' : 'min-h-[100px]'} />
    const ds = fmtDate(dt)
    const today = fmtDate(new Date())
    const isT = ds === today
    const st = getDayStatus(ds)
    const appts = getApptsForDate(ds).sort((a, b) => a.startTime.localeCompare(b.startTime))
    const visible = appts.slice(0, mini ? 2 : 4)
    const hidden = appts.slice(mini ? 2 : 4)
    const typeColors: Record<string, string> = { class: BLUE, initial_assessment: '#FF6B35', physical_assessment: '#30D158', registration: '#AF52DE', event: '#FF9F0A' }
    const hasNoAppts = !mini && appts.length === 0
    const isPublished = publishedDates.has(ds)
    const isHoveredCell = hoveredCol === idx && hoveredRow === rowIdx && !mini
    const isPressed = pressedCell?.col === idx && pressedCell?.row === rowIdx
    let colBg = 'transparent'
    if (isHoveredCell) {
      colBg = 'rgba(18,112,183,0.06)'
    } else if (isT) {
      colBg = 'rgba(18,112,183,0.04)'
    }
    return (
      <div
        key={idx}
        onClick={(e) => {
          setSelectedDate(ds)
          setDayModalDate(ds)
        }}
        onMouseEnter={() => { setHoveredCol(idx); setHoveredRow(rowIdx) }}
        onMouseLeave={() => { setHoveredCol(null); setHoveredRow(null); setPressedCell(null) }}
        onMouseDown={() => setPressedCell({ col: idx, row: rowIdx })}
        onMouseUp={() => setPressedCell(null)}
        className={`day-cell-hover relative ${mini ? 'min-h-[60px] p-1' : 'min-h-[100px] p-2'} cursor-pointer`}
        style={{
          background: colBg,
          boxShadow: 'none',
          borderRight: idx < 6 ? '1px solid rgba(0,0,0,0.03)' : 'none',
          borderBottom: !lastRow ? '1px solid rgba(0,0,0,0.03)' : 'none',
          transform: isPressed ? 'scale(0.97)' : isHoveredCell && !mini ? 'scale(1.04)' : 'scale(1)',
          transition: 'transform 0.18s ease',
          zIndex: isPressed || isHoveredCell && !mini ? 25 : 1,
        }}
      >
        {isPublished && !mini && (
          <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: GOLD_GRAD }} />
        )}
        {isHoveredCell && hasNoAppts && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg shadow-md" style={{ background: BLUE_GRAD }}>
              <Plus size={16} color="#fff" strokeWidth={3} />
            </div>
          </div>
        )}
        {isPublished && !hasNoAppts && (
          <div className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 rounded-full" style={{ background: GOLD_GRAD, boxShadow: '0 2px 6px rgba(241,200,39,0.3)' }}>
            <Sparkles size={9} color="#fff" strokeWidth={2.5} />
          </div>
        )}
        <div className="flex items-center justify-between mb-0.5">
          <span className={mini ? 'text-[9px] font-bold' : 'text-xs font-bold'} style={{
            color: isT ? '#fff' : st.active ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.2)',
            width: mini ? 18 : 22, height: mini ? 18 : 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 6, background: isT ? BLUE_GRAD : 'transparent',
            ...(isHoveredCell && !isT ? { background: BLUE_GRAD, backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } : {}),
          }}>
            {dt.getDate()}
          </span>
        </div>
        {!mini && (
          <div className="space-y-0.5">
              {visible.map(a => (
                  <div key={a.id} className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold leading-tight truncate" style={{ background: `${typeColors[a.type]}18`, color: typeColors[a.type], borderLeft: `2.5px solid ${typeColors[a.type]}` }}
                    title={`${a.startTime} – ${a.endTime} ${a.title}${a.studentName ? ' - ' + a.studentName : ''}`}
                  >
                    {a.studentName ? (
                      <>
                        <div className="text-[10px] font-extrabold truncate">{a.studentName}</div>
                        <div className="flex items-center gap-1 text-[8px] font-medium truncate" style={{ opacity: 0.75 }}>
                          <span className="truncate">{a.title}</span>
                          <span className="flex-shrink-0">{a.startTime} – {a.endTime}</span>
                        </div>
                      </>
                    ) : (
                      <><span style={{ opacity: 0.75 }}>{a.startTime} – {a.endTime}</span> <span className="font-extrabold">{a.title}</span></>
                    )}
                  </div>
                ))}
              {hidden.length > 0 && (
                <div className="text-[9px] font-bold text-center mt-0.5 py-0.5 rounded-md cursor-pointer hover:bg-black/[0.05]" style={{ color: BLUE }}>
                  +{hidden.length} más
                </div>
              )}
          </div>
        )}
      </div>
    )
  }

  const TIME_SLOTS_WEEK = ['6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']
  const MESH_GRAD = 'radial-gradient(ellipse at 20% 30%, rgba(241,200,39,0.2) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(230,57,70,0.18) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(18,112,183,0.35) 0%, transparent 50%), rgba(18,112,183,0.88)'
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const todayStr = fmtDate(new Date())
  const weekDates = getWeekDates(currentMonth)

  const typeColors: Record<string, string> = { class: BLUE, initial_assessment: '#FF6B35', physical_assessment: '#30D158', registration: '#AF52DE', event: '#FF9F0A' }
  const typeLabels: Record<string, string> = { class: 'Clase', initial_assessment: 'Valoración Inicial', physical_assessment: 'Seguimiento', registration: 'Registro', event: 'Otro' }

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

  return (
    <div className="p-8 pt-12 max-w-[1440px] mx-auto relative">
      {/* ── Banner Card ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-3xl mb-8"
        style={{
          background: 'linear-gradient(90deg, #FFFFFF 0%, #F8FBFF 40%, rgba(248,251,255,0) 100%)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
        }}
      >
        <div className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden" style={{
          maskImage: 'linear-gradient(to right, black 60%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, black 60%, transparent 100%)'
        }}>
          <div className="absolute inset-0 opacity-30" style={{
            background: 'radial-gradient(ellipse at 80% 10%, rgba(0,122,255,0.03) 0%, transparent 40%), radial-gradient(ellipse at 10% 80%, rgba(245,166,35,0.02) 0%, transparent 40%), radial-gradient(ellipse at 50% 50%, rgba(230,57,70,0.02) 0%, transparent 50%)',
            backgroundSize: '200% 200%',
            animation: 'mesh-shift 15s ease-in-out infinite',
          }} />
        </div>

        {/* Imagen de calendario — sobresale arriba, toca abajo */}
        <div style={{ position: 'absolute', left: 40, bottom: 0, height: 170, width: 220, zIndex: 20, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', width: '90%', height: '50%', background: 'rgba(18,112,183,0.1)', filter: 'blur(30px)', borderRadius: '50%' }} />
          <img src={calendarImg} alt="Calendario" className="w-full h-full object-cover drop-shadow-xl relative" style={{ objectPosition: 'center top' }} />
        </div>

        <div className="relative z-10 p-8 flex items-center justify-between">
          <div className="flex items-center gap-6 ml-64">
            <div className="w-1 h-12 rounded-full" style={{ background: BLUE_GRAD }} />
            <div>
              <h1 style={{ color: '#1A1A1E', fontSize: '2rem', fontWeight: 800 }}>Agenda</h1>
              <p className="text-xs text-black/40">Organiza tus clases, valoraciones y eventos.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 pr-4">
            <motion.button
              initial="initial"
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
              onClick={openPublishModal}
              className="flex items-center rounded-full overflow-hidden text-white"
              style={{ height: 44, padding: '0 12px', background: MESH_GRAD }}
            >
              <motion.div
                variants={{
                  hover: { maxWidth: 80, opacity: 1, marginRight: 6, transition: { delay: 0.12, duration: 0.35, ease: 'easeOut' } },
                  initial: { maxWidth: 0, opacity: 0, marginRight: 0, transition: { duration: 0.2 } }
                }}
                className="overflow-hidden whitespace-nowrap"
              >
                <span className="text-xs font-bold">Nueva Agenda</span>
              </motion.div>
              <div className="flex items-center justify-center flex-shrink-0">
                <Plus size={18} strokeWidth={3} />
              </div>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ── Calendar ── */}
      <div className="space-y-4">
        {viewMode === 'year' ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            className="rounded-2xl premium-card"
          >
            <div className="flex items-center justify-center gap-3 py-3 px-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
              <button onClick={handlePrevView}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/[0.04] transition-colors"
              ><ChevronLeft size={16} style={{ color: 'rgba(0,0,0,0.3)' }} /></button>
              <h2 className="text-sm font-extrabold" style={{ color: '#1A1A1E', letterSpacing: '-0.03em' }}>{viewTitle}</h2>
              <button onClick={handleNextView}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/[0.04] transition-colors"
              ><ChevronRight size={16} style={{ color: 'rgba(0,0,0,0.3)' }} /></button>
              <div className="ml-auto flex items-center gap-1 p-0.5 rounded-lg" style={{ background: 'rgba(0,0,0,0.04)' }}>
                {(['week', 'month', 'year'] as const).map(mode => (
                  <button key={mode} onClick={() => setViewMode(mode)}
                    className="px-3 py-1 rounded-md text-[10px] font-bold transition-all"
                    style={{ background: viewMode === mode ? BLUE_GRAD : 'transparent', color: viewMode === mode ? '#fff' : 'rgba(0,0,0,0.3)' }}
                  >{mode === 'day' ? 'Día' : mode === 'month' ? 'Mes' : mode === 'week' ? 'Semana' : 'Año'}</button>
                ))}
              </div>
              <button onClick={() => setIsExpanded(!isExpanded)}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/[0.04] transition-colors ml-2"
                style={{ color: 'rgba(0,0,0,0.3)' }}
              >{isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}</button>
            </div>
              <div className="grid grid-cols-4 gap-3 p-4">
                {Array.from({ length: 12 }, (_, mi) => {
                  const mDays = new Date(year, mi + 1, 0).getDate()
                  const firstDow = new Date(year, mi, 1).getDay()
                  const pad = firstDow === 0 ? 6 : firstDow - 1
                  const hasEvents = appointments.some(a => a.date.startsWith(`${year}-${String(mi + 1).padStart(2, '0')}`))
                  return (
                    <div key={mi} onClick={() => { setViewMode('month'); setCurrentMonth(new Date(year, mi, 1)) }}
                      className="rounded-xl p-3 premium-card cursor-pointer transition-all hover:shadow-md"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-extrabold" style={{ color: '#1A1A1E' }}>{monthNames[mi]}</span>
                        {hasEvents && <span className="w-1.5 h-1.5 rounded-full" style={{ background: BLUE }} />}
                      </div>
                      <div className="grid grid-cols-7 gap-0">
                        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((ld, ldi) => (
                          <div key={ldi} className="text-[7px] font-bold text-center py-0.5" style={{ color: 'rgba(0,0,0,0.4)' }}>{ld}</div>
                        ))}
                        {Array.from({ length: pad }, (_, pi) => <div key={`p-${pi}`} />)}
                        {Array.from({ length: mDays }, (_, di) => {
                          const d = di + 1
                            const ds = `${year}-${String(mi + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
                            const isT = ds === todayStr
                            const dayHasEvents = appointments.some(a => a.date === ds)
                            const isPublished = publishedDates.has(ds)
                            return (
                              <div key={di} onClick={(e) => { e.stopPropagation(); setViewMode('month'); setCurrentMonth(new Date(year, mi, 1)) }}
                                className="relative text-center text-[9px] font-bold py-0.5 rounded-sm cursor-pointer hover:bg-black/[0.03] transition-colors"
                                style={{
                                  color: isT ? '#fff' : 'rgba(0,0,0,0.5)',
                                  background: isT ? BLUE_GRAD : 'transparent',
                                }}
                              >
                                {d}
                                {dayHasEvents && !isT && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-0.5 rounded-full" style={{ background: BLUE }} />}
                                {isPublished && !isT && <span className="absolute -top-0.5 right-0 w-2.5 h-0.5 rounded-sm" style={{ background: GOLD_GRAD }} />}
                              </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>

          ) : viewMode === 'week' ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 }}
              className="rounded-2xl premium-card"
            >
              <div className="flex items-center justify-center gap-3 py-3 px-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                <button onClick={handlePrevView}
                  className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/[0.04] transition-colors"
                ><ChevronLeft size={16} style={{ color: 'rgba(0,0,0,0.3)' }} /></button>
                <h2 className="text-sm font-extrabold" style={{ color: '#1A1A1E', letterSpacing: '-0.03em' }}>{viewTitle}</h2>
                <button onClick={handleNextView}
                  className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/[0.04] transition-colors"
                ><ChevronRight size={16} style={{ color: 'rgba(0,0,0,0.3)' }} /></button>
                <div className="ml-auto flex items-center gap-1 p-0.5 rounded-lg" style={{ background: 'rgba(0,0,0,0.04)' }}>
                  {(['week', 'month', 'year'] as const).map(mode => (
                    <button key={mode} onClick={() => setViewMode(mode)}
                      className="px-3 py-1 rounded-md text-[10px] font-bold transition-all"
                      style={{ background: viewMode === mode ? BLUE_GRAD : 'transparent', color: viewMode === mode ? '#fff' : 'rgba(0,0,0,0.3)' }}
                    >{mode === 'day' ? 'Día' : mode === 'month' ? 'Mes' : mode === 'week' ? 'Semana' : 'Año'}</button>
                  ))}
                </div>
                <button onClick={() => setIsExpanded(!isExpanded)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/[0.04] transition-colors ml-2"
                  style={{ color: 'rgba(0,0,0,0.3)' }}
                >{isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}</button>
              </div>
              <div className="grid grid-cols-8" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <div className="w-14" />
                  {weekDates.map((dt, i) => {
                    const ds = fmtDate(dt)
                    const isT = ds === todayStr
                    const isPublished = publishedDates.has(ds)
                    const hovered = hoveredCol === i
                    return (
                      <div key={i} className="text-center py-2 relative rounded-xl transition-colors duration-200"
                        style={{ background: hovered ? BLUE_GRAD : 'transparent' }}
                        onMouseEnter={() => setHoveredCol(i)}
                        onMouseLeave={() => setHoveredCol(null)}>
                        <div className="text-[10px] font-bold transition-colors duration-200" style={{ color: isT ? (hovered ? '#fff' : BLUE) : hovered ? '#fff' : 'rgba(0,0,0,0.4)' }}>{dayLabels[i]}</div>
                        <div className="text-sm font-extrabold transition-colors duration-200" style={{ color: hovered ? '#fff' : '#1A1A1E' }}>{dt.getDate()}</div>
                        {isPublished && <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: GOLD_GRAD, opacity: hovered ? 0.9 : 1 }} />}
                      </div>
                    )
                  })}
              </div>
                      <div style={{ maxHeight: '52vh', overflowY: 'auto' }}>
                        {TIME_SLOTS_WEEK.map(t => (
                          <div key={t} className="grid grid-cols-8 transition-colors duration-200" style={{ borderBottom: '1px solid rgba(0,0,0,0.03)', background: hoveredHour === t ? 'rgba(18,112,183,0.03)' : 'transparent' }}>
                            <div className="w-14 text-[11px] font-bold leading-none text-right pr-2 py-1.5 rounded-xl transition-colors duration-200" style={{ color: hoveredHour === t ? '#fff' : 'rgba(0,0,0,0.55)', background: hoveredHour === t ? BLUE_GRAD : 'transparent' }}>{t}</div>
                            {weekDates.map((dt, di) => {
                              const ds = fmtDate(dt)
                              const appts = getApptsForDate(ds).filter(a => a.startTime <= t && a.endTime > t)
                              return (
                                <div key={di} className="px-0.5 cursor-pointer transition-colors duration-200" style={{ minHeight: 30, background: hoveredCol === di ? 'rgba(18,112,183,0.08)' : 'transparent' }}
                                  onMouseEnter={() => { setHoveredCol(di); setHoveredHour(t) }}
                                  onMouseLeave={() => { setHoveredCol(null); setHoveredHour(null) }}
                                  onClick={() => { if (appts.length === 0) handleSlotClick(ds, t) }}>
                          {appts.map(a => (
                            <div key={a.id} className="rounded px-1 py-0.5 text-[8px] font-bold truncate leading-tight"
                              style={{ background: `${typeColors[a.type]}18`, color: typeColors[a.type], borderLeft: `2px solid ${typeColors[a.type]}` }}
                              title={`${a.startTime} – ${a.endTime} ${a.title}`}
                            >{a.startTime} – {a.endTime} {a.title}</div>
                          ))}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </motion.div>

          ) : viewMode === 'day' ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 }}
              className="rounded-2xl premium-card"
            >
              <div className="flex items-center justify-center gap-3 py-3 px-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                <button onClick={handlePrevView}
                  className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/[0.04] transition-colors"
                ><ChevronLeft size={16} style={{ color: 'rgba(0,0,0,0.3)' }} /></button>
                <h2 className="text-sm font-extrabold" style={{ color: '#1A1A1E', letterSpacing: '-0.03em' }}>{viewTitle}</h2>
                <button onClick={handleNextView}
                  className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/[0.04] transition-colors"
                ><ChevronRight size={16} style={{ color: 'rgba(0,0,0,0.3)' }} /></button>
                <div className="ml-auto flex items-center gap-1 p-0.5 rounded-lg" style={{ background: 'rgba(0,0,0,0.04)' }}>
                  {(['week', 'month', 'year'] as const).map(mode => (
                    <button key={mode} onClick={() => setViewMode(mode)}
                      className="px-3 py-1 rounded-md text-[10px] font-bold transition-all"
                      style={{ background: viewMode === mode ? BLUE_GRAD : 'transparent', color: viewMode === mode ? '#fff' : 'rgba(0,0,0,0.3)' }}
                    >{mode === 'day' ? 'Día' : mode === 'month' ? 'Mes' : mode === 'week' ? 'Semana' : 'Año'}</button>
                  ))}
                </div>
                <button onClick={() => setIsExpanded(!isExpanded)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/[0.04] transition-colors ml-2"
                  style={{ color: 'rgba(0,0,0,0.3)' }}
                >{isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}</button>
              </div>
              <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                {TIME_SLOTS_WEEK.map(t => {
                  const dt = currentMonth
                  const ds = fmtDate(dt)
                  const appts = getApptsForDate(ds).filter(a => a.startTime <= t && a.endTime > t)
                  return (
                    <div key={t} className="flex items-center gap-2 px-4 py-1.5" style={{ borderBottom: '1px solid rgba(0,0,0,0.03)', minHeight: 36 }}>
                      <div className="w-14 text-[9px] font-bold flex-shrink-0" style={{ color: 'rgba(0,0,0,0.2)' }}>{t}</div>
                      <div className="flex-1 cursor-pointer" onClick={() => handleSlotClick(ds, t)}>
                        {appts.map(a => (
                          <div key={a.id} className="rounded-md px-2 py-1 text-[10px] font-bold truncate"
                            style={{ background: `${typeColors[a.type]}18`, color: typeColors[a.type], borderLeft: `3px solid ${typeColors[a.type]}` }}
                          >
                          <span>{a.startTime} – {a.endTime}</span> {a.title}
                          {a.studentName && <span className="ml-1 font-medium" style={{ opacity: 0.7 }}>— {a.studentName}</span>}
                          </div>
                        ))}
                        {appts.length === 0 && (
                          <div className="text-[9px] font-medium" style={{ color: 'rgba(0,0,0,0.1)' }}>—</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>

          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 }}
              className="rounded-2xl premium-card"
            >
              <div className="flex items-center justify-center gap-3 py-3 px-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                <button onClick={handlePrevView}
                  className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/[0.04] transition-colors"
                ><ChevronLeft size={16} style={{ color: 'rgba(0,0,0,0.3)' }} /></button>
                <h2 className="text-sm font-extrabold" style={{ color: '#1A1A1E', letterSpacing: '-0.03em' }}>{viewTitle}</h2>
                <button onClick={handleNextView}
                  className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/[0.04] transition-colors"
                ><ChevronRight size={16} style={{ color: 'rgba(0,0,0,0.3)' }} /></button>
                <div className="ml-auto flex items-center gap-1 p-0.5 rounded-lg" style={{ background: 'rgba(0,0,0,0.04)' }}>
                  {(['week', 'month', 'year'] as const).map(mode => (
                    <button key={mode} onClick={() => setViewMode(mode)}
                      className="px-3 py-1 rounded-md text-[10px] font-bold transition-all"
                      style={{ background: viewMode === mode ? BLUE_GRAD : 'transparent', color: viewMode === mode ? '#fff' : 'rgba(0,0,0,0.3)' }}
                    >{mode === 'day' ? 'Día' : mode === 'month' ? 'Mes' : mode === 'week' ? 'Semana' : 'Año'}</button>
                  ))}
                </div>
                <button onClick={() => setIsExpanded(!isExpanded)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/[0.04] transition-colors ml-2"
                  style={{ color: 'rgba(0,0,0,0.3)' }}
                >{isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}</button>
              </div>
              <div className="grid grid-cols-7" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                {dayLabels.map((d, i) => (
                  <div key={d} onMouseEnter={() => { setHoveredCol(i); setHoveredRow(0) }} onMouseLeave={() => { setHoveredCol(null); setHoveredRow(null) }}
                    className="text-center py-2.5 text-[11px] font-bold tracking-wide transition-colors rounded-t-md"
                    style={{ color: hoveredCol === i ? '#fff' : 'rgba(0,0,0,0.5)', background: hoveredCol === i ? BLUE_GRAD : 'transparent' }}>{d}</div>
                ))}
              </div>
              {getMonthGrid(year, month).map((week, wi) => (
                <div key={wi} className="grid grid-cols-7">
                  {week.map((dt, di) => renderDayCell(dt, di, wi === getMonthGrid(year, month).length - 1, false, wi, getMonthGrid(year, month).length))}
                </div>
              ))}
            </motion.div>
          )}
        </div>

      {/* Day Detail Modal */}
      <AnimatePresence>
        {dayModalDate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)' }}
            onClick={() => setDayModalDate(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="rounded-3xl w-full max-w-sm overflow-hidden"
              style={{ background: '#fff', boxShadow: '0 25px 60px rgba(0,0,0,0.15)' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-8 rounded-full" style={{ background: BLUE_GRAD }} />
                    <p className="text-base font-extrabold" style={{ color: '#1A1A1E' }}>
                      {dayLabelsGetDay[new Date(dayModalDate + 'T12:00:00').getDay()]} {new Date(dayModalDate + 'T12:00:00').getDate()}
                    </p>
                  </div>
                  <button onClick={() => setDayModalDate(null)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/5 transition-colors">
                    <X size={14} style={{ color: 'rgba(0,0,0,0.3)' }} />
                  </button>
                </div>
                {(() => {
                  const st = getDayStatus(dayModalDate)
                  return st.active ? (
                    <p className="text-[11px] font-medium mb-4" style={{ color: 'rgba(0,0,0,0.35)' }}>
                      {st.open} – {st.close}
                    </p>
                  ) : (
                    <p className="text-[11px] font-medium mb-4" style={{ color: RED }}>Cerrado</p>
                  )
                })()}
                <div className="space-y-1.5 mb-4 max-h-[260px] overflow-y-auto">
                  {getApptsForDate(dayModalDate).length === 0 ? (
                    <p className="text-xs py-4 text-center" style={{ color: 'rgba(0,0,0,0.2)' }}>Sin citas este día</p>
                  ) : (
                    getApptsForDate(dayModalDate).sort((a, b) => a.startTime.localeCompare(b.startTime)).map(a => (
                      <div key={a.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: `${typeColors[a.type]}12`, borderLeft: `3.5px solid ${typeColors[a.type]}` }}>
                        <div className="text-[11px] font-bold min-w-[65px]" style={{ color: 'rgba(0,0,0,0.55)' }}>{a.startTime} – {a.endTime}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-bold truncate" style={{ color: '#1A1A1E' }}>{a.title}</div>
                          {a.studentName && <div className="text-[11px] font-medium truncate" style={{ color: 'rgba(0,0,0,0.5)' }}>{a.studentName}</div>}
                          {a.trainer && <div className="text-[10px] font-medium" style={{ color: 'rgba(0,0,0,0.35)' }}>Con {a.trainer}</div>}
                        </div>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: `${typeColors[a.type]}12`, color: typeColors[a.type] }}>{typeLabels[a.type]}</span>
                      </div>
                    ))
                  )}
                </div>
                <button onClick={() => { setDayModalDate(null); setNewApptType('initial_assessment'); setNewApptStart('08:00'); setNewApptEnd('09:00'); setNewApptTrainer(''); setNewApptStudent(''); setShowApptModal(true) }}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-white transition-all"
                  style={{ background: MESH_GRAD }}
                ><Plus size={13} /> Agregar Cita</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Appointment Modal */}
      <AnimatePresence>
        {showApptModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowApptModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="rounded-3xl w-full max-w-md overflow-hidden"
              style={{ background: '#fff', boxShadow: '0 25px 60px rgba(0,0,0,0.15)' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 pt-6 pb-3">
                <h2 className="text-lg font-extrabold" style={{ color: '#1A1A1E' }}>Nueva Cita</h2>
                <button onClick={() => setShowApptModal(false)} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-black/5 transition-colors"><X size={16} style={{ color: 'rgba(0,0,0,0.3)' }} /></button>
              </div>
              <div className="px-6 pb-6 space-y-4">
                <div>
                  <label className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.5)' }}>Tipo</label>
                  <div className="grid grid-cols-4 gap-2 mt-1.5">
                    {(['initial_assessment', 'registration', 'physical_assessment', 'event'] as const).map(t => {
                      const sel = newApptType === t
                      const c = typeColors[t]
                      const grad = `linear-gradient(135deg, ${c}, ${c}cc)`
                      return (
                        <motion.button
                          key={t}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setNewApptType(t)}
                          onMouseEnter={e => { if (!sel) { e.currentTarget.style.background = `${c}18`; e.currentTarget.style.color = c } }}
                          onMouseLeave={e => { if (!sel) { e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; e.currentTarget.style.color = 'rgba(0,0,0,0.35)' } }}
                          className="flex items-center justify-center px-1 py-2.5 rounded-xl text-[11px] font-bold text-center transition-all duration-200"
                          style={{
                            background: sel ? grad : 'rgba(0,0,0,0.03)',
                            color: sel ? '#FFFFFF' : 'rgba(0,0,0,0.35)',
                            border: '1px solid transparent',
                            boxShadow: sel ? `0 4px 16px ${c}40` : 'none',
                          }}
                        >{typeLabels[t]}</motion.button>
                      )
                    })}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.5)' }}>Hora Inicio</label>
                    <input type="time" value={newApptStart} onChange={e => setNewApptStart(e.target.value)}
                      className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium outline-none"
                      style={{ background: meshInputBg, border: '1px solid transparent', color: '#1A1A1E' }}
                      onMouseEnter={e => enterMesh(e.currentTarget)}
                      onMouseLeave={e => leaveMesh(e.currentTarget)}
                      onFocus={e => focusMesh(e.currentTarget)}
                      onBlur={e => blurMesh(e.currentTarget)} />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.5)' }}>Hora Fin</label>
                    <input type="time" value={newApptEnd} onChange={e => setNewApptEnd(e.target.value)}
                      className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium outline-none"
                      style={{ background: meshInputBg, border: '1px solid transparent', color: '#1A1A1E' }}
                      onMouseEnter={e => enterMesh(e.currentTarget)}
                      onMouseLeave={e => leaveMesh(e.currentTarget)}
                      onFocus={e => focusMesh(e.currentTarget)}
                      onBlur={e => blurMesh(e.currentTarget)} />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.5)' }}>Entrenador</label>
                  <input value={newApptTrainer} onChange={e => { setNewApptTrainer(e.target.value); setTrainerListOpen(true) }}
                    onFocus={e => { setTrainerListOpen(true); focusMesh(e.currentTarget) }}
                    onBlur={e => { setTimeout(() => setTrainerListOpen(false), 120); blurMesh(e.currentTarget) }}
                    placeholder="Escribe el nombre del entrenador…"
                    className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium outline-none"
                    style={{ background: meshInputBg, border: '1px solid transparent', color: '#1A1A1E' }}
                    onMouseEnter={e => enterMesh(e.currentTarget)}
                    onMouseLeave={e => leaveMesh(e.currentTarget)} />
                  {trainerListOpen && trainerMatches.length > 0 && (
                    <div className="mt-1.5 rounded-xl overflow-hidden" style={{ background: '#fff', border: '1px solid rgba(18,112,183,0.15)', boxShadow: '0 8px 24px rgba(18,112,183,0.12)' }}>
                      {trainerMatches.slice(0, 6).map((t, i) => (
                        <button
                          key={i} type="button"
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => { setNewApptTrainer(t.name); setTrainerListOpen(false) }}
                          className="w-full text-left px-3 py-2 text-sm font-medium transition-colors flex items-center gap-2.5 border-b last:border-b-0"
                          style={{ color: '#1A1A1E', borderColor: 'rgba(0,0,0,0.04)' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(18,112,183,0.08)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <span className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0" style={{ background: BLUE_GRAD }}>{t.avatar || t.name.slice(0, 2).toUpperCase()}</span>
                          <span className="min-w-0">
                            <span className="block font-semibold truncate">{t.name}</span>
                            <span className="block text-[11px] truncate" style={{ color: 'rgba(0,0,0,0.45)' }}>{t.speciality}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <AnimatePresence initial={false}>
                  {newApptType !== 'event' && (
                    <motion.div
                      key="student-field"
                      initial={{ opacity: 0, filter: 'blur(8px)', height: 0 }}
                      animate={{ opacity: 1, filter: 'blur(0px)', height: 'auto' }}
                      exit={{ opacity: 0, filter: 'blur(8px)', height: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div>
                        <label className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.5)' }}>Estudiante</label>
                        <input value={newApptStudent} onChange={e => { setNewApptStudent(e.target.value); setStudentListOpen(true) }}
                          onFocus={e => { setStudentListOpen(true); focusMesh(e.currentTarget) }}
                          onBlur={e => { setTimeout(() => setStudentListOpen(false), 120); blurMesh(e.currentTarget) }}
                          placeholder="Escribe el nombre del estudiante…"
                          className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium outline-none"
                          style={{ background: meshInputBg, border: '1px solid transparent', color: '#1A1A1E' }}
                          onMouseEnter={e => enterMesh(e.currentTarget)}
                          onMouseLeave={e => leaveMesh(e.currentTarget)} />
                        {studentListOpen && studentMatches.length > 0 && (
                          <div className="mt-1.5 rounded-xl overflow-hidden" style={{ background: '#fff', border: '1px solid rgba(18,112,183,0.15)', boxShadow: '0 8px 24px rgba(18,112,183,0.12)' }}>
                            {studentMatches.slice(0, 6).map((s, i) => (
                              <button
                                key={i} type="button"
                                onMouseDown={e => e.preventDefault()}
                                onClick={() => { setNewApptStudent(s.name); setStudentListOpen(false) }}
                                className="w-full text-left px-3 py-2 text-sm font-medium transition-colors flex items-center gap-2.5 border-b last:border-b-0"
                                style={{ color: '#1A1A1E', borderColor: 'rgba(0,0,0,0.04)' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(18,112,183,0.08)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                              >
                                <span className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0" style={{ background: BLUE_GRAD }}>{s.avatar || s.name.slice(0, 2).toUpperCase()}</span>
                                <span className="min-w-0">
                                  <span className="block font-semibold truncate">{s.name}</span>
                                  <span className="block text-[11px] truncate" style={{ color: 'rgba(0,0,0,0.45)' }}>{[s.carnetId, s.program, s.faculty].filter(Boolean).join(' · ')}</span>
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handleAddAppointment}
                  className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                  style={{ background: MESH_GRAD }}
                >Agendar Cita</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Publish Date Range Modal */}
      <AnimatePresence>
        {showPublishModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)' }}
            onClick={closePublishModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className={`relative rounded-3xl w-full max-w-2xl ${showPublishSuccess ? 'overflow-visible' : 'overflow-hidden'}`}
              style={{ background: '#fff', boxShadow: '0 25px 60px rgba(0,0,0,0.15)' }}
              onClick={e => e.stopPropagation()}
            >
              {showPublishSuccess ? renderPublishSuccess() : (
                <>
                  <div className="sticky top-0 z-10 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.9)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                <div className="flex items-center justify-end px-4 pt-4 pb-0">
                  <motion.button
                    whileHover={{ scale: 1.15, background: 'rgba(244,56,67,0.1)', color: RED }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closePublishModal}
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors"
                    style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.3)' }}
                  >
                    <X size={15} />
                  </motion.button>
                </div>
                <div className="flex items-center justify-center gap-1.5" style={{ marginTop: 12, marginBottom: 16 }}>
                  {[1, 2].map(s => (
                    <motion.div
                      key={s}
                      animate={{
                        width: s === publishStep ? 16 : 6,
                        background: s === publishStep ? BLUE_GRAD : 'rgba(0,0,0,0.12)',
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                      className="rounded-full"
                      style={{ height: 6 }}
                    />
                  ))}
                </div>
                <span className="text-lg font-bold tracking-wide text-center block" style={{ color: '#1A1A1E', marginBottom: 10 }}>
                  Agendar Semana
                </span>
              </div>

              {publishStep === 1 ? (
                <div className="px-6 pb-6 space-y-5">
                  <div>
                    <label className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.5)' }}>Rango de fechas</label>
                    <div className="flex items-center gap-2 mt-1.5">
                      <input type="date" value={publishStart} onChange={e => setPublishStart(e.target.value)}
                        className="flex-1 px-3.5 py-2.5 rounded-xl text-sm font-medium outline-none"
                        style={{ background: meshInputBg, border: '1px solid transparent', color: '#1A1A1E' }}
                        onMouseEnter={e => enterMesh(e.currentTarget)}
                        onMouseLeave={e => leaveMesh(e.currentTarget)}
                        onFocus={e => focusMesh(e.currentTarget)}
                        onBlur={e => blurMesh(e.currentTarget)} />
                      <span className="text-xs" style={{ color: 'rgba(0,0,0,0.2)' }}>—</span>
                      <input type="date" value={publishEnd} onChange={e => setPublishEnd(e.target.value)}
                        className="flex-1 px-3.5 py-2.5 rounded-xl text-sm font-medium outline-none"
                        style={{ background: meshInputBg, border: '1px solid transparent', color: '#1A1A1E' }}
                        onMouseEnter={e => enterMesh(e.currentTarget)}
                        onMouseLeave={e => leaveMesh(e.currentTarget)}
                        onFocus={e => focusMesh(e.currentTarget)}
                        onBlur={e => blurMesh(e.currentTarget)} />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.5)' }}>Días de la semana</label>
                    <p className="text-[11px] mb-2" style={{ color: 'rgba(0,0,0,0.3)' }}>Selecciona los días disponibles.</p>
                    <div className="grid grid-cols-6 gap-2">
                      {WEEK_DAYS_6.map(({ key, label }) => {
                        const active = publishDays.includes(key)
                        return <DayCard key={key} label={label} selected={active} onClick={() => setPublishDays(prev => active ? prev.filter(d => d !== key) : [...prev, key])} />
                      })}
                    </div>
                  </div>

                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => { setPublishSelectedDay(publishDays[0] ?? null); setPublishStep(2) }}
                    disabled={!publishStart || !publishEnd || publishDays.length === 0}
                    className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                    style={{ background: publishStart && publishEnd && publishDays.length > 0 ? MESH_GRAD : 'rgba(0,0,0,0.1)' }}
                  >Continuar</motion.button>
                </div>
              ) : (
                <div className="px-6 pt-3 pb-6 space-y-4 max-h-[60vh] overflow-y-auto">
                  <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${publishDays.length}, minmax(0, 1fr))` }}>
                    {WEEK_DAYS_6.map(({ key, label }) => {
                      if (!publishDays.includes(key)) return null
                      return <DayCard key={key} label={label} selected={selDay === key} done={dayIsComplete(key)} onClick={() => setPublishSelectedDay(key)} />
                    })}
                  </div>
                  {selDay && (() => {
                    const dk = selDay
                    const cfg = getDayConfig(dk)
                    return (
                      <div className="rounded-2xl p-4 space-y-3" style={{ background: 'rgba(0,0,0,0.02)' }}>
                        <div>
                          <label className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.5)' }}>Duración de la sesión</label>
                          <select value={cfg.duration} onChange={e => updateDayDuration(dk, e.target.value)}
                            className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium outline-none"
                            style={{ background: meshInputBg, border: '1px solid transparent', color: '#1A1A1E' }}
                            onMouseEnter={e => enterMesh(e.currentTarget)}
                            onMouseLeave={e => leaveMesh(e.currentTarget)}
                            onFocus={e => focusMesh(e.currentTarget)}
                            onBlur={e => blurMesh(e.currentTarget)}
                          >
                            <option value="30">30 min</option>
                            <option value="45">45 min</option>
                            <option value="60">60 min</option>
                            <option value="90">90 min</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.5)' }}>Horario de atención</label>
                          <div className="space-y-2 mt-1.5">
                            {cfg.ranges.map((r, ri) => (
                              <div key={ri} className="flex items-center gap-2">
                                <input type="time" value={r.open} onChange={e => updateDayRange(dk, ri, 'open', e.target.value)}
                                  className="flex-1 px-3.5 py-2.5 rounded-xl text-sm font-medium outline-none"
                                  style={{ background: meshInputBg, border: '1px solid transparent', color: '#1A1A1E' }}
                                  onMouseEnter={e => enterMesh(e.currentTarget)}
                                  onMouseLeave={e => leaveMesh(e.currentTarget)}
                                  onFocus={e => focusMesh(e.currentTarget)}
                                  onBlur={e => blurMesh(e.currentTarget)} />
                                <span className="text-xs" style={{ color: 'rgba(0,0,0,0.2)' }}>—</span>
                                <input type="time" value={r.close} onChange={e => updateDayRange(dk, ri, 'close', e.target.value)}
                                  className="flex-1 px-3.5 py-2.5 rounded-xl text-sm font-medium outline-none"
                                  style={{ background: meshInputBg, border: '1px solid transparent', color: '#1A1A1E' }}
                                  onMouseEnter={e => enterMesh(e.currentTarget)}
                                  onMouseLeave={e => leaveMesh(e.currentTarget)}
                                  onFocus={e => focusMesh(e.currentTarget)}
                                  onBlur={e => blurMesh(e.currentTarget)} />
                                {cfg.ranges.length > 1 && (
                                  <button onClick={() => removeDayRange(dk, ri)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-black/[0.05] transition-colors flex-shrink-0">
                                    <X size={14} style={{ color: 'rgba(0,0,0,0.35)' }} />
                                  </button>
                                )}
                              </div>
                            ))}
                            {rangeConflict?.day === dk && (
                              <p className="text-[10px] font-bold" style={{ color: RED }}>{rangeConflict.msg}</p>
                            )}
                          </div>
                          <button onClick={() => addDayRange(dk)}
                            className="mt-2 flex items-center gap-1 text-[11px] font-bold transition-all hover:opacity-70"
                            style={{ color: BLUE }}
                          ><Plus size={12} strokeWidth={3} /> Agregar horario</button>
                        </div>
                      </div>
                    )
                  })()}
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => setPublishStep(1)} className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all" style={{ background: 'rgba(0,0,0,0.05)', color: 'rgba(0,0,0,0.5)' }}>Volver</button>
                    <motion.button whileHover={allDaysComplete ? { scale: 1.02 } : {}} whileTap={allDaysComplete ? { scale: 0.98 } : {}}
                      onClick={() => setShowPublishConfirm(true)}
                      disabled={!allDaysComplete}
                      className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                      style={{ background: allDaysComplete ? MESH_GRAD : 'rgba(0,0,0,0.1)' }}
                    >Publicar Cupos</motion.button>
                  </div>
                </div>
              )}

              <AnimatePresence>
                {showPublishConfirm && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 z-20 flex items-center justify-center"
                    style={{ background: 'rgba(0,0,0,0.2)' }}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.92, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.92, y: 8 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="flex flex-col gap-4 p-6 rounded-2xl w-[340px] text-center"
                      style={{
                        background: '#FFFFFF',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                        border: '1px solid rgba(0,0,0,0.04)',
                      }}
                    >
                      <div className="w-10 h-10 mx-auto rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,149,0,0.12)' }}>
                        <AlertTriangle size={18} color="#FF9500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold mb-1" style={{ color: '#1A1A1E' }}>¿Publicar cupos?</p>
                        <p className="text-xs leading-relaxed" style={{ color: 'rgba(0,0,0,0.45)' }}>
                          Antes de continuar, revisa bien los tiempos de cada día y asegúrate de que todo quedó configurado.
                        </p>
                      </div>
                      <div className="flex flex-col items-start gap-1.5 text-left">
                        {[
                          'Verifica las horas de apertura y cierre de cada día.',
                          'Asegúrate de que los horarios no se crucen entre sí.',
                          'Se publicarán los días activos dentro del rango seleccionado.',
                        ].map((w, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-[11px] leading-relaxed" style={{ color: 'rgba(0,0,0,0.55)' }}>
                            <span className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#FF9500' }} />
                            {w}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-2.5 w-full">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setShowPublishConfirm(false)}
                          className="flex-1 py-2.5 rounded-xl text-xs font-medium cursor-pointer"
                          style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.5)' }}
                        >
                          Cancelar
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handlePublish}
                          className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
                          style={{ background: MESH_GRAD }}
                        >
                          Sí, publicar
                        </motion.button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>)}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Fullscreen Expanded Calendar ── */}
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
                {viewMode === 'year' ? (
                  <div className="rounded-2xl premium-card h-full overflow-auto">
                    <div className="flex items-center justify-center gap-3 py-3 px-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                      <button onClick={handlePrevView}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/[0.04] transition-colors"
                      ><ChevronLeft size={16} style={{ color: 'rgba(0,0,0,0.3)' }} /></button>
                      <h2 className="text-sm font-extrabold" style={{ color: '#1A1A1E', letterSpacing: '-0.03em' }}>{viewTitle}</h2>
                      <button onClick={handleNextView}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/[0.04] transition-colors"
                      ><ChevronRight size={16} style={{ color: 'rgba(0,0,0,0.3)' }} /></button>
                      <div className="ml-auto flex items-center gap-1 p-0.5 rounded-lg" style={{ background: 'rgba(0,0,0,0.04)' }}>
                        {(['week', 'month', 'year'] as const).map(mode => (
                          <button key={mode} onClick={() => setViewMode(mode)}
                            className="px-3 py-1 rounded-md text-[10px] font-bold transition-all"
                            style={{ background: viewMode === mode ? BLUE_GRAD : 'transparent', color: viewMode === mode ? '#fff' : 'rgba(0,0,0,0.3)' }}
                          >{mode === 'day' ? 'Día' : mode === 'month' ? 'Mes' : mode === 'week' ? 'Semana' : 'Año'}</button>
                        ))}
                      </div>
                      <button onClick={() => setIsExpanded(false)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/[0.04] transition-colors ml-2"
                        style={{ color: 'rgba(0,0,0,0.3)' }}
                      ><Minimize2 size={15} /></button>
                    </div>
                    <div className="grid grid-cols-4 gap-3 p-4">
                      {Array.from({ length: 12 }, (_, mi) => {
                        const mDays = new Date(year, mi + 1, 0).getDate()
                        const firstDow = new Date(year, mi, 1).getDay()
                        const pad = firstDow === 0 ? 6 : firstDow - 1
                        const hasEvents = appointments.some(a => a.date.startsWith(`${year}-${String(mi + 1).padStart(2, '0')}`))
                        return (
                          <div key={mi} onClick={() => { setViewMode('month'); setCurrentMonth(new Date(year, mi, 1)) }}
                            className="rounded-xl p-3 premium-card cursor-pointer transition-all hover:shadow-md"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[11px] font-extrabold" style={{ color: '#1A1A1E' }}>{monthNames[mi]}</span>
                              {hasEvents && <span className="w-1.5 h-1.5 rounded-full" style={{ background: BLUE }} />}
                            </div>
                            <div className="grid grid-cols-7 gap-0">
                              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((ld, ldi) => (
                                <div key={ldi} className="text-[7px] font-bold text-center py-0.5" style={{ color: 'rgba(0,0,0,0.4)' }}>{ld}</div>
                              ))}
                              {Array.from({ length: pad }, (_, pi) => <div key={`p-${pi}`} />)}
                              {Array.from({ length: mDays }, (_, di) => {
                                const d = di + 1
                                const ds = `${year}-${String(mi + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
                                const isT = ds === todayStr
                                const dayHasEvents = appointments.some(a => a.date === ds)
                                const isPublished = publishedDates.has(ds)
                                return (
                                  <div key={di} onClick={(e) => { e.stopPropagation(); setViewMode('month'); setCurrentMonth(new Date(year, mi, 1)) }}
                                    className="relative text-center text-[9px] font-bold py-0.5 rounded-sm cursor-pointer hover:bg-black/[0.03] transition-colors"
                                    style={{
                                      color: isT ? '#fff' : 'rgba(0,0,0,0.5)',
                                      background: isT ? BLUE_GRAD : 'transparent',
                                    }}
                                  >
                                    {d}
                                    {dayHasEvents && !isT && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-0.5 rounded-full" style={{ background: BLUE }} />}
                                    {isPublished && !isT && <span className="absolute -top-0.5 right-0 w-2.5 h-0.5 rounded-sm" style={{ background: GOLD_GRAD }} />}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : viewMode === 'week' ? (
                  <div className="rounded-2xl premium-card h-full flex flex-col">
                    <div className="flex items-center justify-center gap-3 py-3 px-4 flex-shrink-0" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                      <button onClick={handlePrevView}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/[0.04] transition-colors"
                      ><ChevronLeft size={16} style={{ color: 'rgba(0,0,0,0.3)' }} /></button>
                      <h2 className="text-sm font-extrabold" style={{ color: '#1A1A1E', letterSpacing: '-0.03em' }}>{viewTitle}</h2>
                      <button onClick={handleNextView}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/[0.04] transition-colors"
                      ><ChevronRight size={16} style={{ color: 'rgba(0,0,0,0.3)' }} /></button>
                      <div className="ml-auto flex items-center gap-1 p-0.5 rounded-lg" style={{ background: 'rgba(0,0,0,0.04)' }}>
                        {(['week', 'month', 'year'] as const).map(mode => (
                          <button key={mode} onClick={() => setViewMode(mode)}
                            className="px-3 py-1 rounded-md text-[10px] font-bold transition-all"
                            style={{ background: viewMode === mode ? BLUE_GRAD : 'transparent', color: viewMode === mode ? '#fff' : 'rgba(0,0,0,0.3)' }}
                          >{mode === 'day' ? 'Día' : mode === 'month' ? 'Mes' : mode === 'week' ? 'Semana' : 'Año'}</button>
                        ))}
                      </div>
                      <button onClick={() => setIsExpanded(false)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/[0.04] transition-colors ml-2"
                        style={{ color: 'rgba(0,0,0,0.3)' }}
                      ><Minimize2 size={15} /></button>
                    </div>
                    <div className="flex-1 overflow-auto">
                      <div className="grid grid-cols-8" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                        <div className="w-14" />
                        {weekDates.map((dt, i) => {
                          const ds = fmtDate(dt); const isT = ds === todayStr; const isPublished = publishedDates.has(ds)
                          const hovered = hoveredCol === i
                          return (
                            <div key={i} className="text-center py-2 relative rounded-xl transition-colors duration-200"
                              style={{ background: hovered ? BLUE_GRAD : 'transparent' }}
                              onMouseEnter={() => setHoveredCol(i)}
                              onMouseLeave={() => setHoveredCol(null)}>
                              <div className="text-[10px] font-bold transition-colors duration-200" style={{ color: isT ? (hovered ? '#fff' : BLUE) : hovered ? '#fff' : 'rgba(0,0,0,0.4)' }}>{dayLabels[i]}</div>
                              <div className="text-sm font-extrabold transition-colors duration-200" style={{ color: hovered ? '#fff' : '#1A1A1E' }}>{dt.getDate()}</div>
                              {isPublished && <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: GOLD_GRAD, opacity: hovered ? 0.9 : 1 }} />}
                            </div>
                          )
                        })}
                      </div>
                      <div>
                        {TIME_SLOTS_WEEK.map(t => (
                          <div key={t} className="grid grid-cols-8" style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                            <div className="w-14 text-[11px] font-bold leading-none text-right pr-2 py-1.5" style={{ color: 'rgba(0,0,0,0.55)' }}>{t}</div>
                            {weekDates.map((dt, di) => {
                              const ds = fmtDate(dt)
                              const appts = getApptsForDate(ds).filter(a => a.startTime <= t && a.endTime > t)
                              return (
                                <div key={di} className="px-0.5 cursor-pointer transition-colors duration-200" style={{ minHeight: 30, background: hoveredCol === di ? 'rgba(18,112,183,0.05)' : 'transparent' }}
                                  onMouseEnter={() => setHoveredCol(di)}
                                  onMouseLeave={() => setHoveredCol(null)}
                                  onClick={() => { if (appts.length === 0) handleSlotClick(ds, t) }}>
                                  {appts.map(a => (
                                    <div key={a.id} className="rounded px-1 py-0.5 text-[8px] font-bold truncate leading-tight"
                                      style={{ background: `${typeColors[a.type]}18`, color: typeColors[a.type], borderLeft: `2px solid ${typeColors[a.type]}` }}
                                      title={`${a.startTime} – ${a.endTime} ${a.title}`}
                                    >{a.startTime} – {a.endTime} {a.title}</div>
                                  ))}
                                </div>
                              )
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : viewMode === 'day' ? (
                  <div className="rounded-2xl premium-card h-full flex flex-col">
                    <div className="flex items-center justify-center gap-3 py-3 px-4 flex-shrink-0" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                      <button onClick={handlePrevView}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/[0.04] transition-colors"
                      ><ChevronLeft size={16} style={{ color: 'rgba(0,0,0,0.3)' }} /></button>
                      <h2 className="text-sm font-extrabold" style={{ color: '#1A1A1E', letterSpacing: '-0.03em' }}>{viewTitle}</h2>
                      <button onClick={handleNextView}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/[0.04] transition-colors"
                      ><ChevronRight size={16} style={{ color: 'rgba(0,0,0,0.3)' }} /></button>
                      <div className="ml-auto flex items-center gap-1 p-0.5 rounded-lg" style={{ background: 'rgba(0,0,0,0.04)' }}>
                        {(['week', 'month', 'year'] as const).map(mode => (
                          <button key={mode} onClick={() => setViewMode(mode)}
                            className="px-3 py-1 rounded-md text-[10px] font-bold transition-all"
                            style={{ background: viewMode === mode ? BLUE_GRAD : 'transparent', color: viewMode === mode ? '#fff' : 'rgba(0,0,0,0.3)' }}
                          >{mode === 'day' ? 'Día' : mode === 'month' ? 'Mes' : mode === 'week' ? 'Semana' : 'Año'}</button>
                        ))}
                      </div>
                      <button onClick={() => setIsExpanded(false)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/[0.04] transition-colors ml-2"
                        style={{ color: 'rgba(0,0,0,0.3)' }}
                      ><Minimize2 size={15} /></button>
                    </div>
                    <div className="flex-1 overflow-auto">
                      {TIME_SLOTS_WEEK.map(t => {
                        const dt = currentMonth
                        const ds = fmtDate(dt)
                        const appts = getApptsForDate(ds).filter(a => a.startTime <= t && a.endTime > t)
                        return (
                          <div key={t} className="flex items-center gap-2 px-4 py-2" style={{ borderBottom: '1px solid rgba(0,0,0,0.03)', minHeight: 40 }}>
                            <div className="w-14 text-[10px] font-bold flex-shrink-0" style={{ color: 'rgba(0,0,0,0.2)' }}>{t}</div>
                            <div className="flex-1 cursor-pointer" onClick={() => handleSlotClick(ds, t)}>
                              {appts.map(a => (
                                <div key={a.id} className="rounded-md px-2 py-1 text-[11px] font-bold truncate"
                                  style={{ background: `${typeColors[a.type]}18`, color: typeColors[a.type], borderLeft: `3px solid ${typeColors[a.type]}` }}
                                >
                                  <span>{a.startTime} – {a.endTime}</span> {a.title}
                                  {a.studentName && <span className="ml-1 font-medium" style={{ opacity: 0.7 }}>— {a.studentName}</span>}
                                </div>
                              ))}
                              {appts.length === 0 && (
                                <div className="text-[10px] font-medium" style={{ color: 'rgba(0,0,0,0.1)' }}>—</div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl premium-card h-full flex flex-col">
                    <div className="flex items-center justify-center gap-3 py-3 px-4 flex-shrink-0" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                      <button onClick={handlePrevView}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/[0.04] transition-colors"
                      ><ChevronLeft size={16} style={{ color: 'rgba(0,0,0,0.3)' }} /></button>
                      <h2 className="text-sm font-extrabold" style={{ color: '#1A1A1E', letterSpacing: '-0.03em' }}>{viewTitle}</h2>
                      <button onClick={handleNextView}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/[0.04] transition-colors"
                      ><ChevronRight size={16} style={{ color: 'rgba(0,0,0,0.3)' }} /></button>
                      <div className="ml-auto flex items-center gap-1 p-0.5 rounded-lg" style={{ background: 'rgba(0,0,0,0.04)' }}>
                        {(['week', 'month', 'year'] as const).map(mode => (
                          <button key={mode} onClick={() => setViewMode(mode)}
                            className="px-3 py-1 rounded-md text-[10px] font-bold transition-all"
                            style={{ background: viewMode === mode ? BLUE_GRAD : 'transparent', color: viewMode === mode ? '#fff' : 'rgba(0,0,0,0.3)' }}
                          >{mode === 'day' ? 'Día' : mode === 'month' ? 'Mes' : mode === 'week' ? 'Semana' : 'Año'}</button>
                        ))}
                      </div>
                      <button onClick={() => setIsExpanded(false)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/[0.04] transition-colors ml-2"
                        style={{ color: 'rgba(0,0,0,0.3)' }}
                      ><Minimize2 size={15} /></button>
                    </div>
                    <div className="flex-1 overflow-auto">
                      <div className="grid grid-cols-7" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                        {dayLabels.map((d, i) => (
                          <div key={d} onMouseEnter={() => { setHoveredCol(i); setHoveredRow(0) }} onMouseLeave={() => { setHoveredCol(null); setHoveredRow(null) }}
                            className="text-center py-2.5 text-[11px] font-bold tracking-wide transition-colors rounded-t-md"
                            style={{ color: hoveredCol === i ? '#fff' : 'rgba(0,0,0,0.5)', background: hoveredCol === i ? BLUE_GRAD : 'transparent' }}>{d}</div>
                        ))}
                      </div>
                      {getMonthGrid(year, month).map((week, wi) => (
                        <div key={wi} className="grid grid-cols-7">
                          {week.map((dt, di) => renderDayCell(dt, di, wi === getMonthGrid(year, month).length - 1, false, wi, getMonthGrid(year, month).length))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
