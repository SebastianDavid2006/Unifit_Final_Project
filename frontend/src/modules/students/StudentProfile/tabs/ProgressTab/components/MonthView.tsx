import { motion } from 'motion/react'
import { historialAsistencia } from '@/modules/students/StudentProfileData'
import type { AttendanceRecord } from '@/modules/students/StudentProfileData'
import { useIsMobile } from '@/shared/components/ui/use-mobile'

interface MonthViewProps {
  currentDate: Date
  monthNames: string[]
  hoveredCol: number | null
  setHoveredCol: (v: number | null) => void
  hoveredCell: { w: number; d: number } | null
  setHoveredCell: (v: { w: number; d: number } | null) => void
}

const RED_GRAD = 'linear-gradient(135deg, #FF6B6B, #E63946)'

export function MonthView({
  currentDate,
  monthNames,
  hoveredCol,
  setHoveredCol,
  hoveredCell,
  setHoveredCell,
}: MonthViewProps) {
  const isMobile = useIsMobile()
  return (
    <div className="rounded-2xl" style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 8px 32px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
      <div className="px-5 pt-4 pb-3 border-b" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
        <h3 className="text-sm font-bold" style={{ color: '#0D1B2A' }}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
      </div>
      <div className="p-4">
        {(() => {
          const daysInMonth = 31
          const firstDay = 5
          const dayLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
          const attendanceByDay: Record<number, AttendanceRecord> = {}
          historialAsistencia.forEach(r => {
            const d = parseInt(r.fecha.split(' ')[0])
            attendanceByDay[d] = r
          })
          const weeks: (number | null)[][] = []
          let currentWeek: (number | null)[] = []
          for (let i = 0; i < firstDay; i++) currentWeek.push(null)
          for (let d = 1; d <= daysInMonth; d++) {
            currentWeek.push(d)
            if (currentWeek.length === 7) {
              weeks.push(currentWeek)
              currentWeek = []
            }
          }
          if (currentWeek.length > 0) {
            while (currentWeek.length < 7) currentWeek.push(null)
            weeks.push(currentWeek)
          }
          return (
            <div>
              <div className="grid grid-cols-7 mb-2" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                {dayLabels.map((dn, di) => (
                  <div
                    key={dn}
                    onMouseEnter={() => setHoveredCol(di)}
                    onMouseLeave={() => setHoveredCol(null)}
                    className="text-center py-2 text-xs font-bold tracking-wide transition-all rounded"
                    style={{
                      color: hoveredCol === di ? '#FFFFFF' : 'rgba(0,0,0,0.35)',
                      background: hoveredCol === di ? RED_GRAD : 'transparent',
                    }}
                  >{dn}</div>
                ))}
              </div>
              <div className="space-y-1">
                {weeks.map((week, wi) => (
                  <div key={wi} className="grid grid-cols-7 gap-1">
                    {week.map((day, di) => {
                      if (day === null) return (
                        <div 
                          key={`e-${wi}-${di}`} 
                          className="min-h-[60px]"
                          style={{ 
                            background: 'rgba(0,0,0,0.01)',
                            borderRadius: 8,
                          }} 
                        />
                      )
                      const record = attendanceByDay[day]
                      const isToday = day === 13
                      const isHovered = hoveredCol === di
                      const isCellHovered = hoveredCell?.w === wi && hoveredCell?.d === di
                      return (
                        <motion.div
                          key={day}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: (wi * 7 + di) * 0.005 }}
                          className="relative min-h-[60px] p-1.5 cursor-pointer transition-all rounded-lg"
                          style={{
                            background: isCellHovered ? 'rgba(230,57,70,0.12)' : (record ? 'rgba(230,57,70,0.06)' : 'transparent'),
                            borderRadius: 8,
                            transform: isCellHovered ? 'scale(1.03)' : 'scale(1)',
                            transition: 'transform 0.18s ease, background 0.18s ease',
                            zIndex: isCellHovered ? 5 : 1,
                          }}
                          onMouseEnter={() => { setHoveredCol(di); setHoveredCell({w: wi, d: di}) }}
                          onMouseLeave={() => { setHoveredCell(null); setHoveredCol(null) }}
                        >
                          <span
                            className={`inline-flex items-center justify-center text-sm font-bold rounded transition-all ${isToday || isCellHovered ? 'bg-[#E63946] text-white' : record ? 'text-[#0D1B2A] bg-[#FFEBEE]' : 'text-black/10 bg-transparent'}`}
                            style={{ width: 24, height: 24 }}
                          >{day}</span>
                          {record && (
                            <div className="mt-1 space-y-0.5">
                              <div className="text-xs font-bold leading-tight" style={{ color: '#0D1B2A' }}>{record.duracion}</div>
                              <div className="flex items-center gap-0.5">
                                <span className="text-[8px] font-semibold" style={{ color: '#0D1B2A' }}>{record.entrada}</span>
                                <span className="text-[8px] font-medium" style={{ color: 'rgba(0,0,0,0.15)' }}>→</span>
                                <span className="text-[8px] font-semibold" style={{ color: '#C62828' }}>{record.salida}</span>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}
