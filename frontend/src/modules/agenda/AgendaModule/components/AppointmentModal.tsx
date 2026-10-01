import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronLeft, ChevronRight, Lock, Sparkles, Trash2, X } from 'lucide-react'
import { meshInputBg } from '@/data/shared/constants'
import { BLUE_GRAD, dayLabelsGetDay, monthNames, RED } from '../../AgendaData'
import { blurMesh, enterMesh, focusMesh, leaveMesh, fmtDate, MESH_GRAD, typeColors, typeLabels } from '../data'
import { DeleteAppointmentModal } from './DeleteAppointmentModal'
import type { BloqueDelDia } from '@/services/agenda.service'

export type AppointmentType = 'class' | 'initial_assessment' | 'physical_assessment' | 'registration' | 'event'

interface StudentMatch {
  name: string
  carnetId?: string
  program?: string
  faculty?: string
  avatar?: string
}

interface AppointmentModalProps {
  show: boolean
  title?: string
  editing?: boolean
  dirty?: boolean
  onClose: () => void
  onBack?: () => void
  onSave: () => void
  onDelete?: () => void
  apptType: AppointmentType
  onTypeChange: (t: AppointmentType) => void
  fecha: string
  onStepFecha?: (delta: -1 | 1) => void
  blocks: BloqueDelDia[]
  ocupados: Set<string>
  cuposLibres: Set<string>
  startTime: string
  onStartChange: (v: string) => void
  student: string
  onStudentChange: (v: string) => void
  studentMatches: StudentMatch[]
  studentListOpen: boolean
  setStudentListOpen: (v: boolean) => void
  error?: string | null
}

export function AppointmentModal({ show, title = 'Nueva Cita', editing = false, dirty = false, onClose, onBack, onSave, onDelete, apptType, onTypeChange, fecha, onStepFecha, blocks, ocupados, cuposLibres, startTime, onStartChange, student, onStudentChange, studentMatches, studentListOpen, setStudentListOpen, error }: AppointmentModalProps) {
  const [confirmDel, setConfirmDel] = useState(false)
  const [filter, setFilter] = useState<'ALL' | 'AM' | 'PM'>('ALL')

  useEffect(() => {
    if (show) { setConfirmDel(false); setFilter('ALL') }
  }, [show])

  const keyOf = (key: string) => key.slice(0, 5)
  const visibleBlocks = blocks.filter(b => filter === 'ALL' || b.bloque === filter)
  const selectedBlock = blocks.find(b => keyOf(b.inicio) === keyOf(startTime)) || null

  const esHoy = fecha === fmtDate(new Date())
  const ahoraMin = new Date().getHours() * 60 + new Date().getMinutes()
  const vencidoDe = (key: string) => {
    const [hh, mm] = key.split(':').map(Number)
    return esHoy && ahoraMin >= hh * 60 + mm
  }

  const fechaLarga = () => {
    const d = new Date(fecha + 'T12:00:00')
    return `${dayLabelsGetDay[d.getDay()]} ${d.getDate()} ${monthNames[d.getMonth()].slice(0, 3)}`
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="rounded-3xl w-full max-w-4xl overflow-hidden"
            style={{ background: '#fff', boxShadow: '0 25px 60px rgba(0,0,0,0.15)' }}
            onClick={e => e.stopPropagation()}
          >
<div className="flex items-center justify-between px-7 pt-7 pb-4">
              <div className="flex items-center gap-2.5">
                {onBack && (
                  <button onClick={onBack} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-black/5 transition-colors -ml-2" title="Volver al día" style={{ color: 'rgba(0,0,0,0.45)' }}>
                    <ChevronLeft size={19} />
                  </button>
                )}
                <h2 className="text-xl font-extrabold" style={{ color: '#1A1A1E' }}>{title}</h2>
              </div>
              <button onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-black/5 transition-colors" style={{ color: 'rgba(0,0,0,0.3)' }}><X size={17} /></button>
            </div>
            <div className="px-7 pb-7">
              <div className="grid grid-cols-[1.2fr_1fr] gap-8">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-bold" style={{ color: 'rgba(0,0,0,0.55)' }}>Bloque</label>
                    {onStepFecha ? (
                      <div className="flex items-center gap-1">
                        <button onClick={() => onStepFecha(-1)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/5 transition-colors" style={{ color: 'rgba(0,0,0,0.45)' }}><ChevronLeft size={16} /></button>
                        <span className="text-xs font-bold" style={{ color: 'rgba(0,0,0,0.6)' }}>{fechaLarga()}</span>
                        <button onClick={() => onStepFecha(1)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/5 transition-colors" style={{ color: 'rgba(0,0,0,0.45)' }}><ChevronRight size={16} /></button>
                      </div>
                    ) : (
                      <span className="text-xs font-bold" style={{ color: 'rgba(0,0,0,0.6)' }}>{fechaLarga()}</span>
                    )}
                  </div>
                  <div className="flex gap-1.5 mb-3">
                    {(['ALL', 'AM', 'PM'] as const).map(f => {
                      const sel = filter === f
                      return (
                        <button key={f} onClick={() => setFilter(f)}
                          className="px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all"
                          style={{
                            background: sel ? BLUE_GRAD : 'rgba(0,0,0,0.04)',
                            color: sel ? '#fff' : 'rgba(0,0,0,0.45)',
                          }}
                        >{f === 'ALL' ? 'Todos' : f}</button>
                      )
                    })}
                  </div>
                  <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1.5">
                    {visibleBlocks.map(b => {
                      const key = keyOf(b.inicio)
                      const sel = key === keyOf(startTime)
                      const vencido = vencidoDe(key)
                      const locked = (ocupados.has(key) || vencido) && !(editing && sel)
                      const freeCupo = cuposLibres.has(key)
                      const rango = `${key} – ${b.fin.slice(0, 5)}`
                      return (
                        <button key={key} type="button"
                          onClick={() => !locked && onStartChange(key)}
                          className="flex items-center justify-between gap-2 px-3.5 py-3 rounded-xl transition-all text-left outline-none"
                          style={{
                            background: sel ? BLUE_GRAD : locked ? 'rgba(0,0,0,0.04)' : 'rgba(18,112,183,0.05)',
                            border: freeCupo && !sel ? '1px solid rgba(241,200,39,0.7)' : '1px solid rgba(0,0,0,0.04)',
                            cursor: locked ? 'not-allowed' : 'pointer',
                            color: sel ? '#fff' : locked ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.65)',
                          }}
                          title={`${rango}${locked ? (vencido ? ' · Vencido' : ' · Ocupado') : freeCupo ? ' · Cupo público libre' : ''}`}
                        >
                          <span className="min-w-0">
                            <span className="block text-sm font-extrabold truncate">{rango}</span>
                            <span className="block text-[11px] font-bold mt-0.5" style={{ opacity: 0.72 }}>
                              {locked ? (vencido ? 'Vencido' : 'Ocupado') : freeCupo ? 'Cupo público libre' : b.bloque}
                            </span>
                          </span>
                          {locked ? <Lock size={14} className="flex-shrink-0" style={{ opacity: 0.5 }} /> : sel ? <CheckIcon /> : freeCupo && <Sparkles size={14} className="flex-shrink-0" style={{ color: '#B8860B' }} />}
                        </button>
                      )
                    })}
                  </div>
                  {(visibleBlocks.length === 0 || visibleBlocks.every(b => {
                    const k = keyOf(b.inicio)
                    return vencidoDe(k) || ocupados.has(k)
                  })) && (
                    <p className="text-sm font-bold text-center mt-3" style={{ color: 'rgba(0,0,0,0.45)' }}>
                      No hay cupos disponibles
                    </p>
                  )}
                  {selectedBlock && (
                    <p className="text-[11px] font-semibold mt-3" style={{ color: 'rgba(0,0,0,0.4)' }}>
                      {keyOf(selectedBlock.inicio)} – {selectedBlock.fin.slice(0, 5)} {selectedBlock.bloque}
                      {cuposLibres.has(keyOf(selectedBlock.inicio)) ? ' · tomará el cupo público libre' : ''}
                    </p>
                  )}
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-bold" style={{ color: 'rgba(0,0,0,0.55)' }}>Tipo</label>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {(['initial_assessment', 'registration', 'physical_assessment', 'event'] as const).map(t => {
                        const sel = apptType === t
                        const c = typeColors[t]
                        const grad = `linear-gradient(135deg, ${c}, ${c}cc)`
                        return (
                          <motion.button
                            key={t}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onTypeChange(t)}
                            onMouseEnter={e => { if (!sel) { e.currentTarget.style.background = `${c}18`; e.currentTarget.style.color = c } }}
                            onMouseLeave={e => { if (!sel) { e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; e.currentTarget.style.color = 'rgba(0,0,0,0.35)' } }}
                            className="flex items-center justify-center px-1 py-3 rounded-xl text-[11px] font-bold text-center transition-all duration-200"
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
                  <AnimatePresence initial={false}>
                    {apptType !== 'event' && (
                      <motion.div
                        key="student-field"
                        initial={{ opacity: 0, filter: 'blur(8px)', height: 0 }}
                        animate={{ opacity: 1, filter: 'blur(0px)', height: 'auto' }}
                        exit={{ opacity: 0, filter: 'blur(8px)', height: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div>
                          <label className="text-xs font-bold" style={{ color: 'rgba(0,0,0,0.55)' }}>Usuario</label>
                          <input value={student} readOnly={editing} disabled={editing}
                            onChange={e => { onStudentChange(e.target.value); setStudentListOpen(true) }}
                            onFocus={e => { setStudentListOpen(true); focusMesh(e.currentTarget) }}
                            onBlur={e => { setTimeout(() => setStudentListOpen(false), 120); blurMesh(e.currentTarget) }}
                            placeholder="Escribe el nombre del usuario…"
                            className="w-full mt-2 px-4 py-3 rounded-xl text-sm font-medium outline-none"
                            style={{ background: meshInputBg, border: '1px solid transparent', color: '#1A1A1E', opacity: editing ? 0.6 : 1, cursor: editing ? 'not-allowed' : undefined }}
                            onMouseEnter={e => enterMesh(e.currentTarget)}
                            onMouseLeave={e => leaveMesh(e.currentTarget)} />
                          {!editing && studentListOpen && studentMatches.length > 0 && (
                            <div className="mt-2 rounded-xl overflow-hidden" style={{ background: '#fff', border: '1px solid rgba(18,112,183,0.15)', boxShadow: '0 8px 24px rgba(18,112,183,0.12)' }}>
                              {studentMatches.slice(0, 6).map((s, i) => (
                                <button
                                  key={i} type="button"
                                  onMouseDown={e => e.preventDefault()}
                                  onClick={() => { onStudentChange(s.name); setStudentListOpen(false) }}
                                  className="w-full text-left px-3.5 py-2.5 text-sm font-medium transition-colors flex items-center gap-2.5 border-b last:border-b-0"
                                  style={{ color: '#1A1A1E', borderColor: 'rgba(0,0,0,0.04)' }}
                                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(18,112,183,0.08)'}
                                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                  <span className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0" style={{ background: BLUE_GRAD }}>{s.avatar || s.name.slice(0, 2).toUpperCase()}</span>
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
                </div>
              </div>
              {error && (
                <div className="mt-5 rounded-xl px-4 py-3 text-xs font-semibold" style={{ background: `${RED}14`, border: `1px solid ${RED}40`, color: RED }}>
                  {error}
                </div>
              )}
              <div className="mt-6">
                {editing ? (
                  <div className="flex gap-3">
                    <motion.button whileHover={dirty ? { scale: 1.02 } : {}} whileTap={dirty ? { scale: 0.98 } : {}}
                      onClick={onSave}
                      disabled={!dirty}
                      className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all"
                      style={{ background: MESH_GRAD, opacity: dirty ? 1 : 0.4, cursor: dirty ? 'pointer' : 'not-allowed' }}
                    >Reagendar</motion.button>
                    <button onClick={() => setConfirmDel(true)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90"
                      style={{ background: `${RED}14`, color: RED }}
                    ><Trash2 size={15} /> Cancelar</button>
                  </div>
                ) : (
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={onSave}
                    className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all"
                    style={{ background: MESH_GRAD }}
                  >Agendar Cita</motion.button>
                )}
              </div>
              <DeleteAppointmentModal
                show={confirmDel}
                onClose={() => setConfirmDel(false)}
                onConfirm={() => { setConfirmDel(false); onDelete?.() }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function CheckIcon() {
  return <span className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.25)' }}>✓</span>
}