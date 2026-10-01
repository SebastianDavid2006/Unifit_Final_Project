import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Check, Plus, X } from 'lucide-react'
import { BLUE_GRAD, dayLabelsGetDay, RED } from '../../AgendaData'
import type { Appointment } from '../../AgendaData'
import { fmtDate, MESH_GRAD, typeColors, typeLabels } from '../data'
import type { DayStatus } from '../data'
import type { BloqueDelDia, CupoConReserva } from '@/services/agenda.service'

interface DayModalProps {
  date: string | null
  onClose: () => void
  status: DayStatus | null
  appts: Appointment[]
  onAddAppointment: () => void
  onEdit: (a: Appointment) => void
  isAdmin?: boolean
  blocks: BloqueDelDia[]
  cuposDeFecha: CupoConReserva[]
  onPublishDay: (rangos: { inicio: string; fin: string }[]) => Promise<boolean>
  onQuitarCupo: (idCupo: string) => Promise<boolean>
}

export function DayModal({ date, onClose, status, appts, onAddAppointment, onEdit, isAdmin = false, blocks, cuposDeFecha, onPublishDay, onQuitarCupo }: DayModalProps) {
  const isHoliday = !!status?.holiday
  const [pubSel, setPubSel] = useState<Set<string>>(new Set())
  const [pubFilter, setPubFilter] = useState<'ALL' | 'AM' | 'PM'>('ALL')
  const [pubMsg, setPubMsg] = useState<string | null>(null)
  const [pubErr, setPubErr] = useState<string | null>(null)

  useEffect(() => {
    setPubSel(new Set())
    setPubFilter('ALL')
    setPubMsg(null)
    setPubErr(null)
  }, [date])

  const keyOf = (key: string) => key.slice(0, 5)
  const cupoPorHora = new Map(cuposDeFecha.map(c => [keyOf(c.hora_inicio), { id_cupo: c.id_cupo, reservado: !!c.reserva }]))
  const apptHora = new Set(appts.map(a => a.startTime.slice(0, 5)))
  const visibleBlocks = blocks.filter(b => pubFilter === 'ALL' || b.bloque === pubFilter)

  const hoyStr = fmtDate(new Date())
  const esPasado = !!date && date < hoyStr
  const esHoy = date === hoyStr
  const ahoraMin = new Date().getHours() * 60 + new Date().getMinutes()
  const vencidoDe = (key: string) => {
    const [hh, mm] = key.split(':').map(Number)
    return esHoy && ahoraMin >= hh * 60 + mm
  }

  const rangosSeleccionados = blocks
    .filter(b => pubSel.has(keyOf(b.inicio)))
    .map(b => ({ inicio: keyOf(b.inicio), fin: b.fin.slice(0, 5) }))

  function flashMsg(text: string, error = false) {
    setPubMsg(text)
    setPubErr(error ? text : null)
    if (!error) window.setTimeout(() => setPubMsg(null), 2600)
  }

  async function handlePub() {
    const ok = await onPublishDay(rangosSeleccionados)
    if (ok) {
      setPubSel(new Set())
      setPubFilter('ALL')
      flashMsg(`✓ ${rangosSeleccionados.length} cupo(s) publicados`)
    } else {
      flashMsg('No se pudo publicar los cupos', true)
    }
  }

  async function handleQuitar(idCupo: string) {
    const ok = await onQuitarCupo(idCupo)
    setPubErr(ok ? null : 'No se pudo quitar el cupo')
    setPubMsg(ok ? '✓ Cupo eliminado' : null)
    if (ok) window.setTimeout(() => setPubMsg(null), 2600)
  }

  return (
    <AnimatePresence>
      {date && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="rounded-3xl w-full max-w-2xl overflow-hidden"
            style={{ background: '#fff', boxShadow: '0 25px 60px rgba(0,0,0,0.15)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-9 rounded-full" style={{ background: BLUE_GRAD }} />
                  <div>
                    <p className="text-lg font-extrabold" style={{ color: '#1A1A1E' }}>
                      {dayLabelsGetDay[new Date(date + 'T12:00:00').getDay()]} {new Date(date + 'T12:00:00').getDate()}
                    </p>
                    <p className="text-[11px] font-medium" style={{ color: 'rgba(0,0,0,0.4)' }}>
                      {status?.active ? `${status.open} – ${status.close}` : (status?.holiday || 'Cerrado')}
                    </p>
                  </div>
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-black/5 transition-colors">
                  <X size={16} style={{ color: 'rgba(0,0,0,0.3)' }} />
                </button>
              </div>

              {pubMsg && !pubErr && (
                <div className="flex items-center gap-2 mb-4 px-3.5 py-2.5 rounded-xl text-xs font-bold" style={{ background: 'rgba(48,209,88,0.12)', color: '#1B7A3D' }}>
                  <Check size={14} strokeWidth={3} /> {pubMsg}
                </div>
              )}
              {pubErr && (
                <div className="mb-4 px-3.5 py-2.5 rounded-xl text-xs font-bold" style={{ background: 'rgba(230,57,70,0.1)', color: RED }}>
                  {pubErr}
                </div>
              )}

              <div className="space-y-2 mb-5 max-h-[240px] overflow-y-auto pr-1">
                {appts.length === 0 ? (
                  <p className="text-sm py-4 text-center" style={{ color: 'rgba(0,0,0,0.2)' }}>Sin citas este día</p>
                ) : (
                  appts.sort((a, b) => a.startTime.localeCompare(b.startTime)).map(a => (
                    <div key={a.id}
                      onClick={() => onEdit(a)}
                      className="flex items-center gap-3 px-3.5 py-3 rounded-xl cursor-pointer transition-all hover:opacity-90"
                      style={{ background: `${typeColors[a.type]}12`, borderLeft: `4px solid ${typeColors[a.type]}` }}
                    >
                      <div className="text-xs font-bold min-w-[70px]" style={{ color: 'rgba(0,0,0,0.55)' }}>{a.startTime} – {a.endTime}</div>
                      <div className="flex-1 min-w-0">
                        {a.studentName && <div className="text-sm font-bold truncate" style={{ color: '#1A1A1E' }}>{a.studentName}</div>}
                      </div>
                      <span className="text-[10px] font-bold px-2 py-1 rounded flex-shrink-0" style={{ background: `${typeColors[a.type]}12`, color: typeColors[a.type] }}>{typeLabels[a.type]}</span>
                    </div>
                  ))
                )}
              </div>

              {isAdmin && !isHoliday && !esPasado && (
                <div className="mb-5 pt-4 border-t" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold" style={{ color: 'rgba(0,0,0,0.55)' }}>Abrir cupos del día</p>
                    <div className="flex gap-1.5">
                      {(['ALL', 'AM', 'PM'] as const).map(f => {
                        const sel = pubFilter === f
                        return (
                          <button key={f} onClick={() => setPubFilter(f)}
                            className="px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all"
                            style={{
                              background: sel ? BLUE_GRAD : 'rgba(0,0,0,0.04)',
                              color: sel ? '#fff' : 'rgba(0,0,0,0.45)',
                            }}
                          >{f === 'ALL' ? 'Todos' : f}</button>
                        )
                      })}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-1">
                    {visibleBlocks.map(b => {
                      const key = keyOf(b.inicio)
                      const cupo = cupoPorHora.get(key)
                      const ocupCita = apptHora.has(key)
                      const sel = pubSel.has(key)
                      const rango = `${key} – ${b.fin.slice(0, 5)}`
                      if (cupo || ocupCita) {
                        const reservado = ocupCita || !!cupo?.reservado
                        return (
                          <div key={key}
                            className="flex items-center justify-between gap-2 px-3.5 py-3 rounded-xl"
                            style={{
                              background: reservado ? 'rgba(230,57,70,0.06)' : 'rgba(241,200,39,0.10)',
                              border: '1px solid rgba(0,0,0,0.05)',
                            }}
                          >
                            <div className="min-w-0">
                              <p className="text-sm font-extrabold" style={{ color: 'rgba(0,0,0,0.7)' }}>{rango} <span style={{ color: 'rgba(0,0,0,0.35)', fontWeight: 700 }}>{b.bloque}</span></p>
                              <p className="text-[10px] font-bold mt-0.5" style={{ color: reservado ? RED : '#B8860B' }}>
                                {reservado ? 'Reservado' : 'Cupo público libre'}
                              </p>
                            </div>
                            {cupo && !cupo.reservado && !ocupCita && (
                              <button onClick={() => handleQuitar(cupo.id_cupo)}
                                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all hover:opacity-80"
                                style={{ background: 'rgba(230,57,70,0.12)', color: RED }}
                                title="Quitar cupo"
                              ><X size={13} strokeWidth={3} /></button>
                            )}
                          </div>
                        )
                      }
                      if (vencidoDe(key)) {
                        return (
                          <div key={key}
                            className="flex items-center justify-between gap-2 px-3.5 py-3 rounded-xl"
                            style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)' }}
                          >
                            <div className="min-w-0">
                              <p className="text-sm font-extrabold" style={{ color: 'rgba(0,0,0,0.35)' }}>{rango} <span style={{ color: 'rgba(0,0,0,0.25)', fontWeight: 700 }}>{b.bloque}</span></p>
                              <p className="text-[10px] font-bold mt-0.5" style={{ color: 'rgba(0,0,0,0.3)' }}>Vencido</p>
                            </div>
                          </div>
                        )
                      }
                      return (
                        <button key={key} type="button" onClick={() => setPubSel(prev => {
                          const nxt = new Set(prev)
                          if (nxt.has(key)) nxt.delete(key); else nxt.add(key)
                          return nxt
                        })}
                          className="flex items-center justify-between gap-2 px-3.5 py-3 rounded-xl transition-all"
                          style={{
                            background: sel ? BLUE_GRAD : 'rgba(18,112,183,0.05)',
                            border: sel ? 'none' : '1px solid rgba(18,112,183,0.12)',
                            color: sel ? '#fff' : 'rgba(0,0,0,0.6)',
                          }}
                        >
                          <p className="text-sm font-extrabold">{rango} <span className="text-[11px] font-bold" style={{ opacity: 0.75 }}>{b.bloque}</span></p>
                          {sel && <Check size={15} strokeWidth={3} className="flex-shrink-0" />}
                        </button>
                      )
                    })}
                  </div>
                  <button disabled={rangosSeleccionados.length === 0} onClick={handlePub}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all mt-3.5"
                    style={{ background: MESH_GRAD, opacity: rangosSeleccionados.length === 0 ? 0.4 : 1, cursor: rangosSeleccionados.length === 0 ? 'not-allowed' : 'pointer' }}
                  >Publicar {rangosSeleccionados.length} bloque(s)</button>
                </div>
              )}

              <button onClick={isHoliday || esPasado ? undefined : onAddAppointment} disabled={isHoliday || esPasado}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all"
                style={{ background: MESH_GRAD, opacity: isHoliday || esPasado ? 0.4 : 1, cursor: isHoliday || esPasado ? 'not-allowed' : 'pointer' }}
              ><Plus size={15} /> {isHoliday ? (status?.domingo ? 'No disponible los domingos' : 'No disponible en día festivo') : esPasado ? 'No disponible en días pasados' : 'Agendar Cita'}</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}