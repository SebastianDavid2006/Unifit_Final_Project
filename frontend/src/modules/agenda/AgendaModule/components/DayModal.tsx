import { motion, AnimatePresence } from 'motion/react'
import { Plus, X } from 'lucide-react'
import { BLUE_GRAD, dayLabelsGetDay, RED } from '../../AgendaData'
import type { Appointment } from '../../AgendaData'
import { MESH_GRAD, typeColors, typeLabels } from '../data'

interface DayModalProps {
  date: string | null
  onClose: () => void
  status: { active: boolean; open: string; close: string } | null
  appts: Appointment[]
  onAddAppointment: () => void
  onEdit: (a: Appointment) => void
}

export function DayModal({ date, onClose, status, appts, onAddAppointment, onEdit }: DayModalProps) {
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
            className="rounded-3xl w-full max-w-sm overflow-hidden"
            style={{ background: '#fff', boxShadow: '0 25px 60px rgba(0,0,0,0.15)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-8 rounded-full" style={{ background: BLUE_GRAD }} />
                  <p className="text-base font-extrabold" style={{ color: '#1A1A1E' }}>
                    {dayLabelsGetDay[new Date(date + 'T12:00:00').getDay()]} {new Date(date + 'T12:00:00').getDate()}
                  </p>
                </div>
                <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/5 transition-colors">
                  <X size={14} style={{ color: 'rgba(0,0,0,0.3)' }} />
                </button>
              </div>
              {status && (status.active ? (
                <p className="text-[11px] font-medium mb-4" style={{ color: 'rgba(0,0,0,0.35)' }}>
                  {status.open} – {status.close}
                </p>
              ) : (
                <p className="text-[11px] font-medium mb-4" style={{ color: RED }}>Cerrado</p>
              ))}
              <div className="space-y-1.5 mb-4 max-h-[260px] overflow-y-auto">
                {appts.length === 0 ? (
                  <p className="text-xs py-4 text-center" style={{ color: 'rgba(0,0,0,0.2)' }}>Sin citas este día</p>
                ) : (
                  appts.sort((a, b) => a.startTime.localeCompare(b.startTime)).map(a => (
                    <div key={a.id}
                      onClick={() => onEdit(a)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all hover:opacity-90"
                      style={{ background: `${typeColors[a.type]}12`, borderLeft: `3.5px solid ${typeColors[a.type]}` }}
                    >
                      <div className="text-[11px] font-bold min-w-[65px]" style={{ color: 'rgba(0,0,0,0.55)' }}>{a.startTime} – {a.endTime}</div>
                      <div className="flex-1 min-w-0">
                        {a.studentName && <div className="text-[13px] font-bold truncate" style={{ color: '#1A1A1E' }}>{a.studentName}</div>}
                        {a.trainer && <div className="text-[10px] font-medium" style={{ color: 'rgba(0,0,0,0.35)' }}>Con {a.trainer}</div>}
                      </div>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: `${typeColors[a.type]}12`, color: typeColors[a.type] }}>{typeLabels[a.type]}</span>
                    </div>
                  ))
                )}
              </div>
              <button onClick={onAddAppointment}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-white transition-all"
                style={{ background: MESH_GRAD }}
              ><Plus size={13} /> Agregar Cita</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
