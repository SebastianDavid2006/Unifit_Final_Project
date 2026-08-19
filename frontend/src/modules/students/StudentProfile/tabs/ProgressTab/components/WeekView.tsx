import { motion } from 'motion/react'
import { CheckCircle, XCircle, Clock } from 'lucide-react'
import { historialAsistencia } from '@/modules/students/StudentProfileData'
import type { AttendanceRecord } from '@/modules/students/StudentProfileData'

interface WeekViewProps {
  currentDate: Date
  monthNames: string[]
  getWeekStart: (d: Date) => Date
}

export function WeekView({ currentDate, monthNames, getWeekStart }: WeekViewProps) {
  return (
    <div className="px-5 pt-4 pb-4">
      <div className="w-full">
        <div className="grid gap-4 px-2 mb-3" style={{ gridTemplateColumns: '1.3fr 0.8fr 1fr 1fr 0.8fr' }}>
          {['Día', 'Asistencia', 'Entrada', 'Salida', 'Duración'].map(h => (
            <div key={h} className="text-sm font-bold" style={{ color: 'rgba(0,0,0,0.4)' }}>{h}</div>
          ))}
        </div>
        <div className="space-y-1">
          {(() => {
            const weekStart = getWeekStart(currentDate)
            const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
            const monthShort = monthNames[weekStart.getMonth()].slice(0, 3)
            return Array.from({ length: 5 }, (_, i) => {
              const dayDate = new Date(weekStart)
              dayDate.setDate(weekStart.getDate() + i)
              const dayNum = dayDate.getDate()
              const record: AttendanceRecord | undefined = historialAsistencia.find(r => {
                const rd = parseInt(r.fecha.split(' ')[0])
                const rm = monthNames.findIndex(mn => mn.startsWith(r.fecha.split(' ')[1]?.slice(0, 3)))
                return rd === dayNum && rm === dayDate.getMonth()
              })
              const hasData = !!record
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="grid gap-4 items-center px-4 py-3 rounded-xl transition-all cursor-pointer"
                  style={{
                    gridTemplateColumns: '1.3fr 0.8fr 1fr 1fr 0.8fr',
                    background: hasData ? 'rgba(48,209,88,0.06)' : 'rgba(230,57,70,0.04)',
                    borderLeft: hasData ? '3px solid #30D158' : '3px solid #E63946',
                    opacity: 1,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0px)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold" style={{ color: '#0D1B2A' }}>{dayNames[i]}</span>
                    <span className="text-xs" style={{ color: 'rgba(0,0,0,0.35)' }}>{dayNum} {monthShort}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {hasData
                      ? <CheckCircle size={14} style={{ color: '#30D158' }} />
                      : <XCircle size={14} style={{ color: '#E63946' }} />}
                    <span className="text-xs font-bold" style={{ color: hasData ? '#30D158' : '#E63946' }}>
                      {hasData ? 'Asistió' : 'No asistió'}
                    </span>
                  </div>
                  {hasData ? (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#30D158' }} />
                        <span className="text-sm font-semibold" style={{ color: '#0D1B2A' }}>{record!.entrada}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#C62828' }} />
                        <span className="text-sm font-semibold" style={{ color: '#C62828' }}>{record!.salida}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} style={{ color: '#0D1B2A' }} />
                        <span className="text-sm font-bold" style={{ color: '#0D1B2A' }}>{record!.duracion}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-xs" style={{ color: 'rgba(0,0,0,0.15)' }}>—</span>
                      <span className="text-xs" style={{ color: 'rgba(0,0,0,0.15)' }}>—</span>
                      <span className="text-xs" style={{ color: 'rgba(0,0,0,0.15)' }}>—</span>
                    </>
                  )}
                </motion.div>
              )
            })
          })()}
        </div>
      </div>
    </div>
  )
}
