import { motion } from 'motion/react'
import { KpiCards } from './components/KpiCards'
import { AttendanceHeader } from './components/AttendanceHeader'
import { WeekView } from './components/WeekView'
import { MonthView } from './components/MonthView'
import { YearView } from './components/YearView'

interface Props {
  vistaCalendario: 'semana' | 'mes' | 'año'
  setVistaCalendario: (v: 'semana' | 'mes' | 'año') => void
  hoveredCol: number | null
  setHoveredCol: (v: number | null) => void
  hoveredCell: { w: number; d: number } | null
  setHoveredCell: (v: { w: number; d: number } | null) => void
  currentDate: Date
  setCurrentDate: (v: Date) => void
  prevPeriod: (vista: 'semana' | 'mes' | 'año', date: Date) => void
  nextPeriod: (vista: 'semana' | 'mes' | 'año', date: Date) => void
  formatWeekRange: (d: Date) => string
  monthNames: string[]
  getWeekStart: (d: Date) => Date
}

export function ProgressTab(props: Props) {
  const {
    vistaCalendario,
    setVistaCalendario,
    hoveredCol,
    setHoveredCol,
    hoveredCell,
    setHoveredCell,
    currentDate,
    setCurrentDate,
    prevPeriod,
    nextPeriod,
    formatWeekRange,
    monthNames,
    getWeekStart,
  } = props
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-[1200px] mx-auto space-y-6"
    >
      <KpiCards />

      <AttendanceHeader
        vistaCalendario={vistaCalendario}
        setVistaCalendario={setVistaCalendario}
        currentDate={currentDate}
        prevPeriod={prevPeriod}
        nextPeriod={nextPeriod}
        formatWeekRange={formatWeekRange}
        monthNames={monthNames}
      />

      {vistaCalendario === 'semana' && (
        <WeekView currentDate={currentDate} monthNames={monthNames} getWeekStart={getWeekStart} />
      )}

      {vistaCalendario === 'mes' && (
        <MonthView
          currentDate={currentDate}
          monthNames={monthNames}
          hoveredCol={hoveredCol}
          setHoveredCol={setHoveredCol}
          hoveredCell={hoveredCell}
          setHoveredCell={setHoveredCell}
        />
      )}

      {vistaCalendario === 'año' && (
        <YearView
          currentDate={currentDate}
          monthNames={monthNames}
          setVistaCalendario={setVistaCalendario}
          setCurrentDate={setCurrentDate}
        />
      )}
    </motion.div>
  )
}
