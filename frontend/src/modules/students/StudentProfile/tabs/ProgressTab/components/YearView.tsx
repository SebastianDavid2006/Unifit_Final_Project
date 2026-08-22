import { motion } from 'motion/react'
import { historialAsistencia } from '@/modules/students/StudentProfileData'
import type { AttendanceRecord } from '@/modules/students/StudentProfileData'

interface YearViewProps {
  currentDate: Date
  monthNames: string[]
  setVistaCalendario: (v: 'semana' | 'mes' | 'año') => void
  setCurrentDate: (v: Date) => void
}

const MONTH_SHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const DAY_LABELS_MINI = ['L', 'M', 'M', 'J', 'V', 'S', 'U']

export function YearView({ currentDate, monthNames, setVistaCalendario, setCurrentDate }: YearViewProps) {
  return (
    <div className="px-5 pt-4 pb-4">
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 12 }, (_, mi) => {
          const year = currentDate.getFullYear()
          const mDays = new Date(year, mi + 1, 0).getDate()
          const firstDow = new Date(year, mi, 1).getDay()
          const pad = firstDow === 0 ? 6 : firstDow - 1
          const hasAttendance = mi === 4
          const asistencias = mi === 4 ? historialAsistencia.length : 0
          return (
            <motion.div
              key={mi}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: mi * 0.04 }}
              className="rounded-xl p-3 transition-all hover:shadow-md cursor-pointer"
              style={{
                background: mi === 4 ? 'rgba(230,57,70,0.04)' : 'rgba(0,0,0,0.015)',
                border: mi === 4 ? '1px solid rgba(230,57,70,0.15)' : '1px solid rgba(0,0,0,0.04)',
              }}
              onClick={() => { setVistaCalendario('mes'); setCurrentDate(new Date(year, mi, 1)) }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-extrabold" style={{ color: mi === 4 ? '#0D1B2A' : 'rgba(0,0,0,0.4)' }}>{MONTH_SHORT[mi]}</span>
                {hasAttendance && <span className="text-[8px] font-bold" style={{ color: '#E63946' }}>{asistencias}</span>}
              </div>
              <div className="grid grid-cols-7 gap-0">
                {DAY_LABELS_MINI.map((ld, ldi) => (
                  <div key={ldi} className="text-[6px] font-bold text-center" style={{ color: 'rgba(0,0,0,0.25)' }}>{ld}</div>
                ))}
                {Array.from({ length: pad }, (_, pi) => <div key={`p-${pi}`} />)}
                {Array.from({ length: mDays }, (_, di) => {
                  const d = di + 1
                  const isT = d === 13 && mi === 4
                  const attDay: AttendanceRecord | undefined = historialAsistencia.find(r => {
                    const dayNum = parseInt(r.fecha.split(' ')[0])
                    const monthName = r.fecha.split(' ')[1]?.slice(0, 3)
                    const monthIdx = monthNames.findIndex(mn => mn.startsWith(monthName))
                    return dayNum === d && monthIdx === mi
                  })
                  return (
                    <div
                      key={di}
                      className="relative text-center text-[8px] font-bold py-[1px] rounded-sm transition-colors"
                      style={{
                        color: isT ? '#FFFFFF' : attDay ? '#0D1B2A' : 'rgba(0,0,0,0.15)',
                        background: isT ? '#E63946' : attDay ? 'rgba(230,57,70,0.06)' : 'transparent',
                      }}
                    >
                      {d}
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
