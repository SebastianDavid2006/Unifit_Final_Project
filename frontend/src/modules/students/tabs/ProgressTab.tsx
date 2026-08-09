import { motion } from 'framer-motion'
import { Calendar, Clock } from 'lucide-react'
import { ClockView } from '../../../assets/models/ui/objects/clock/ClockModel'
import { ListView } from '../../../assets/models/ui/objects/list/ListModel'
import { CalendarView } from '../../../assets/models/ui/objects/calendar/CalendarModel'
import fireGif from '../../../assets/icons/animated/fire.gif'
import { cardStyle, historialAsistencia } from '../StudentProfileData'
import type { AttendanceRecord } from '../StudentProfileData'

const RED_GRAD = 'linear-gradient(135deg, #FF6B6B, #E63946)'

interface Props {
  vistaCalendario: 'semana' | 'mes' | 'año'
  setVistaCalendario: (v: 'semana' | 'mes' | 'año') => void
  hoveredCol: number | null
  setHoveredCol: (v: number | null) => void
  hoveredCell: { w: number; d: number } | null
  setHoveredCell: (v: { w: number; d: number } | null) => void
  currentDate: Date
  setCurrentDate: (v: Date) => void
  prevPeriod: () => void
  nextPeriod: () => void
  formatWeekRange: (d: Date) => string
  monthNames: string[]
  getWeekStart: (d: Date) => Date
}

export function ProgressTab(props: Props) {
  const { vistaCalendario, setVistaCalendario, hoveredCol, setHoveredCol, hoveredCell, setHoveredCell, currentDate, setCurrentDate, prevPeriod, nextPeriod, formatWeekRange, monthNames, getWeekStart } = props
  return (                <div className="max-w-[1200px] mx-auto space-y-6">
                  {/* KPI Cards */}
                  <div className="grid grid-cols-4 gap-4">
                    {(() => {
                      const asistenciasEsteMes = historialAsistencia.length
                      const asistenciasTotales = 42
                      const totalMinutos = historialAsistencia.reduce((acc, r) => {
                        const [h, m] = r.duracion.replace('h', '').replace('min', '').split(/\s+/).map(s => parseInt(s) || 0)
                        return acc + h * 60 + m
                      }, 0)
                      const horas = Math.floor(totalMinutos / 60)
                      const mins = totalMinutos % 60
                      const tiempoTotal = `${horas}h ${mins.toString().padStart(2, '0')}min`
                      const ordenDias: Record<string, number> = { Lunes: 1, Martes: 2, Miércoles: 3, Jueves: 4, Viernes: 5, Sábado: 6, Domingo: 7 }
                      let racha = 0
                      const copia = [...historialAsistencia].reverse()
                      for (let i = 0; i < copia.length; i++) {
                        racha++
                        if (i < copia.length - 1) {
                          const diaActual = ordenDias[copia[i].dia] || 0
                          const diaAnterior = ordenDias[copia[i + 1].dia] || 0
                          if (diaActual === 1 && diaAnterior === 5) continue
                          if (diaActual - diaAnterior !== 1) break
                        }
                      }

                      const items = [
                        { label: 'Racha actual', value: `${racha} días`, model: 'fire' },
                        { label: 'Tiempo total entrenado', value: tiempoTotal, model: 'clock' },
                        { label: 'Asistencias totales', value: `${asistenciasTotales}`, model: 'list' },
                        { label: 'Asistencias este mes', value: `${asistenciasEsteMes}/20`, model: 'calendar' },
                      ]
                      return items.map((m, idx) => {
                        const iconEl = m.model === 'fire' ? (
                          <img src={fireGif} alt="fire" style={{ width: 52, height: 52, objectFit: 'contain' }} />
                        ) : m.model === 'clock' ? (
                          <div style={{ width: 52, height: 52 }}><ClockView /></div>
                        ) : m.model === 'list' ? (
                          <div style={{ width: 52, height: 52 }}><ListView /></div>
                        ) : (
                          <div style={{ width: 52, height: 52 }}><CalendarView /></div>
                        )
                        const esFuego = m.model === 'fire'
                        return (
                          <motion.div
                            key={m.label}
                            whileHover={{ scale: 1.03 }}
                            transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
                            className="relative rounded-2xl p-4 flex flex-col items-center text-center group cursor-pointer"
                            style={cardStyle}
                          >
                            <div
                              className="transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.5] mb-5 flex items-center justify-center"
                              style={{ transformOrigin: 'bottom center' }}
                            >
                              {iconEl}
                            </div>
                            <p className={esFuego ? '' : 'text-gradient-warm'} style={{
                              fontSize: '1.8rem', fontWeight: 700, lineHeight: 1,
                              ...(esFuego ? {
                                background: 'linear-gradient(135deg, #FF6B00, #FF2D00, #FF9500)',
                                backgroundSize: '200% auto',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                animation: 'shimmer 5s linear infinite',
                              } : {}),
                            }}>{m.value}</p>
                            <p className="text-sm font-semibold mt-2" style={{
                              color: esFuego ? '#FF6B00' : 'rgba(0,0,0,0.5)',
                            }}>{m.label}</p>
                          </motion.div>
                        )
                      })
                    })()}
                  </div>

                  {/* Historial de Entradas y Salidas */}
                  <div className="rounded-2xl" style={{
                    background: '#FFFFFF',
                    border: '1px solid rgba(0,0,0,0.04)',
                    borderRadius: 20,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
                    overflow: 'hidden',
                  }}>
                    <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                      <div className="flex items-center gap-2 flex-1">
                        <Calendar size={16} style={{ color: '#E63946' }} />
                        <h3 className="text-[#0D1B2A] text-sm font-bold whitespace-nowrap">Historial de Entradas y Salidas</h3>
                      </div>
                      <div className="flex items-center gap-0.5 rounded-lg p-0.5 flex-shrink-0" style={{ background: 'rgba(0,0,0,0.04)' }}>
                        {(['semana', 'mes', 'año'] as const).map(v => (
                          <button
                            key={v}
                            onClick={() => setVistaCalendario(v)}
                            className="px-3 py-1.5 rounded-md text-xs font-bold transition-all"
                            style={{
                              background: vistaCalendario === v ? RED_GRAD : 'transparent',
                              color: vistaCalendario === v ? '#FFFFFF' : 'rgba(0,0,0,0.35)',
                              boxShadow: vistaCalendario === v ? '0 2px 8px rgba(230,57,70,0.25)' : 'none',
                            }}
                          >
                            {v === 'semana' ? 'Semana' : v === 'mes' ? 'Mes' : 'Año'}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 flex-1 justify-end">
                        <button onClick={prevPeriod} onMouseEnter={(e) => { e.currentTarget.style.background = RED_GRAD; e.currentTarget.style.color = '#FFFFFF' }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = 'rgba(0,0,0,0.3)' }} className="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold transition-all flex-shrink-0" style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.3)' }}>‹</button>
                        <span className="text-sm font-bold px-1 text-center min-w-[160px]" style={{ color: '#0D1B2A' }}>
                          {vistaCalendario === 'semana' ? formatWeekRange(currentDate) : vistaCalendario === 'mes' ? `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}` : `${currentDate.getFullYear()}`}
                        </span>
                        <button onClick={nextPeriod} onMouseEnter={(e) => { e.currentTarget.style.background = RED_GRAD; e.currentTarget.style.color = '#FFFFFF' }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = 'rgba(0,0,0,0.3)' }} className="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold transition-all flex-shrink-0" style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.3)' }}>›</button>
                      </div>
                    </div>

                    {(vistaCalendario === 'semana') && (
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
                              const monthShort = monthNames[weekStart.getMonth()].slice(0,3)
                              return Array.from({ length: 5 }, (_, i) => {
                                const dayDate = new Date(weekStart)
                                dayDate.setDate(weekStart.getDate() + i)
                                const dayNum = dayDate.getDate()
                                const record = historialAsistencia.find(r => {
                                  const rd = parseInt(r.fecha.split(' ')[0])
                                  const rm = monthNames.findIndex(mn => mn.startsWith(r.fecha.split(' ')[1]?.slice(0,3)))
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
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)' }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(0px)'; e.currentTarget.style.boxShadow = 'none' }}
                                  >
                                    <div className="flex flex-col">
                                      <span className="text-sm font-semibold" style={{ color: '#0D1B2A' }}>{dayNames[i]}</span>
                                      <span className="text-xs" style={{ color: 'rgba(0,0,0,0.35)' }}>{dayNum} {monthShort}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      {hasData ? <CheckCircle size={14} style={{ color: '#30D158' }} /> : <XCircle size={14} style={{ color: '#E63946' }} />}
                                      <span className="text-xs font-bold" style={{ color: hasData ? '#30D158' : '#E63946' }}>
                                        {hasData ? 'Asistió' : 'No asistió'}
                                      </span>
                                    </div>
                                    {hasData ? (
                                      <>
                                        <div className="flex items-center gap-2">
                                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#30D158' }} />
                                          <span className="text-sm font-semibold" style={{ color: '#0D1B2A' }}>{record.entrada}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#C62828' }} />
                                          <span className="text-sm font-semibold" style={{ color: '#C62828' }}>{record.salida}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                          <Clock size={14} style={{ color: '#0D1B2A' }} />
                                          <span className="text-sm font-bold" style={{ color: '#0D1B2A' }}>{record.duracion}</span>
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
                    )}

                    {(vistaCalendario === 'mes') && (
                      <div className="px-5 pt-4 pb-4">
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
                              <div className="grid grid-cols-7" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                                {dayLabels.map((dn, di) => {
                                  const RED_GRAD = 'linear-gradient(135deg, #FF6B6B, #E63946)'
                                  return (
                                    <div key={dn}
                                      onMouseEnter={() => setHoveredCol(di)}
                                      onMouseLeave={() => setHoveredCol(null)}
                                      className="text-center py-2.5 text-xs font-bold tracking-wide transition-all rounded-t-md"
                                      style={{
                                        color: hoveredCol === di ? '#FFFFFF' : 'rgba(0,0,0,0.35)',
                                        background: hoveredCol === di ? RED_GRAD : 'transparent',
                                      }}
                                    >{dn}</div>
                                  )
                                })}
                              </div>
                              {weeks.map((week, wi) => (
                                <div key={wi} className="grid grid-cols-7">
                                  {week.map((day, di) => {
                                    if (day === null) return <div key={`e-${wi}-${di}`} className="min-h-[72px]" style={{ borderRight: di < 6 ? '1px solid rgba(0,0,0,0.03)' : 'none', borderBottom: wi < weeks.length - 1 ? '1px solid rgba(0,0,0,0.03)' : 'none' }} />
                                    const record = attendanceByDay[day]
                                    const isToday = day === 13
                                    const isHovered = hoveredCol === di
                                    return (
                                      <motion.div
                                        key={day}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: (wi * 7 + di) * 0.005 }}
                                        className="relative min-h-[80px] p-2 cursor-pointer transition-all"
                                        style={{
                                          background: (hoveredCell?.w === wi && hoveredCell?.d === di) ? 'rgba(230,57,70,0.12)' : (record ? 'rgba(230,57,70,0.06)' : '#FFFFFF'),
                                          borderRight: di < 6 ? '1px solid rgba(0,0,0,0.03)' : 'none',
                                          borderBottom: wi < weeks.length - 1 ? '1px solid rgba(0,0,0,0.03)' : 'none',
                                          transform: (hoveredCell?.w === wi && hoveredCell?.d === di) ? 'scale(1.03)' : 'scale(1)',
                                          transition: 'transform 0.18s ease, background 0.18s ease',
                                          zIndex: (hoveredCell?.w === wi && hoveredCell?.d === di) ? 5 : 1,
                                        }}
                                        onMouseEnter={() => { setHoveredCol(di); setHoveredCell({w: wi, d: di}) }}
                                        onMouseLeave={() => { setHoveredCell(null); setHoveredCol(null) }}
                                      >
                                        <span className={`inline-flex items-center justify-center text-sm font-bold rounded-md transition-all ${isToday || (hoveredCell?.w === wi && hoveredCell?.d === di) ? 'bg-[#E63946] text-white' : record ? 'text-[#0D1B2A]' : 'text-black/10'}`}
                                          style={{ width: 24, height: 24 }}
                                        >{day}</span>
                                        {record && (
                                          <div className="mt-1.5 space-y-0.5">
                                            <div className="text-xs font-bold leading-tight" style={{ color: '#0D1B2A' }}>{record.duracion}</div>
                                            <div className="flex items-center gap-1">
                                              <span className="text-[9px] font-semibold" style={{ color: '#0D1B2A' }}>{record.entrada}</span>
                                              <span className="text-[9px] font-medium" style={{ color: 'rgba(0,0,0,0.15)' }}>→</span>
                                              <span className="text-[9px] font-semibold" style={{ color: '#C62828' }}>{record.salida}</span>
                                            </div>
                                          </div>
                                        )}
                                      </motion.div>
                                    )
                                  })}
                                </div>
                              ))}
                            </div>
                          )
                        })()}
                      </div>
                    )}

                    {(vistaCalendario === 'año') && (
                      <div className="px-5 pt-4 pb-4">
                        <div className="grid grid-cols-3 gap-3">
                          {Array.from({ length: 12 }, (_, mi) => {
                            const mDays = new Date(currentDate.getFullYear(), mi + 1, 0).getDate()
                            const firstDow = new Date(currentDate.getFullYear(), mi, 1).getDay()
                            const pad = firstDow === 0 ? 6 : firstDow - 1
                            const dayLabelsMini = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
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
                                onClick={() => { setVistaCalendario('mes'); setCurrentDate(new Date(currentDate.getFullYear(), mi, 1)) }}
                              >
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-[10px] font-extrabold" style={{ color: mi === 4 ? '#0D1B2A' : 'rgba(0,0,0,0.4)' }}>{['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][mi]}</span>
                                  {hasAttendance && <span className="text-[8px] font-bold" style={{ color: '#E63946' }}>{asistencias}</span>}
                                </div>
                                <div className="grid grid-cols-7 gap-0">
                                  {dayLabelsMini.map((ld, ldi) => (
                                    <div key={ldi} className="text-[6px] font-bold text-center" style={{ color: 'rgba(0,0,0,0.25)' }}>{ld}</div>
                                  ))}
                                  {Array.from({ length: pad }, (_, pi) => <div key={`p-${pi}`} />)}
                                  {Array.from({ length: mDays }, (_, di) => {
                                    const d = di + 1
                                    const isT = d === 13 && mi === 4
                                    const attDay = historialAsistencia.find(r => {
                                      const dayNum = parseInt(r.fecha.split(' ')[0])
                                      const monthName = r.fecha.split(' ')[1]?.slice(0,3)
                                      const monthIdx = monthNames.findIndex(mn => mn.startsWith(monthName))
                                      return dayNum === d && monthIdx === mi
                                    })
                                    return (
                                      <div key={di}
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
                    )}
                  </div>
                </div>

  )
}
