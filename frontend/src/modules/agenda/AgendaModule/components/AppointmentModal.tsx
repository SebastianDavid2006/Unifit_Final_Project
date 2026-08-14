import { motion, AnimatePresence } from 'motion/react'
import { X } from 'lucide-react'
import { meshInputBg } from '@/data/constants'
import { BLUE_GRAD } from '../../AgendaData'
import { blurMesh, enterMesh, focusMesh, leaveMesh, MESH_GRAD, typeColors, typeLabels } from '../data'

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
  onClose: () => void
  onSave: () => void
  apptType: AppointmentType
  onTypeChange: (t: AppointmentType) => void
  startTime: string
  endTime: string
  onStartChange: (v: string) => void
  onEndChange: (v: string) => void
  student: string
  onStudentChange: (v: string) => void
  studentMatches: StudentMatch[]
  studentListOpen: boolean
  setStudentListOpen: (v: boolean) => void
}

export function AppointmentModal({ show, onClose, onSave, apptType, onTypeChange, startTime, endTime, onStartChange, onEndChange, student, onStudentChange, studentMatches, studentListOpen, setStudentListOpen }: AppointmentModalProps) {
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
            className="rounded-3xl w-full max-w-md overflow-hidden"
            style={{ background: '#fff', boxShadow: '0 25px 60px rgba(0,0,0,0.15)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 pt-6 pb-3">
              <h2 className="text-lg font-extrabold" style={{ color: '#1A1A1E' }}>Nueva Cita</h2>
              <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-black/5 transition-colors"><X size={16} style={{ color: 'rgba(0,0,0,0.3)' }} /></button>
            </div>
            <div className="px-6 pb-6 space-y-4">
              <div>
                <label className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.5)' }}>Tipo</label>
                <div className="grid grid-cols-4 gap-2 mt-1.5">
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
                  <input type="time" value={startTime} onChange={e => onStartChange(e.target.value)}
                    className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium outline-none"
                    style={{ background: meshInputBg, border: '1px solid transparent', color: '#1A1A1E' }}
                    onMouseEnter={e => enterMesh(e.currentTarget)}
                    onMouseLeave={e => leaveMesh(e.currentTarget)}
                    onFocus={e => focusMesh(e.currentTarget)}
                    onBlur={e => blurMesh(e.currentTarget)} />
                </div>
                <div>
                  <label className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.5)' }}>Hora Fin</label>
                  <input type="time" value={endTime} onChange={e => onEndChange(e.target.value)}
                    className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium outline-none"
                    style={{ background: meshInputBg, border: '1px solid transparent', color: '#1A1A1E' }}
                    onMouseEnter={e => enterMesh(e.currentTarget)}
                    onMouseLeave={e => leaveMesh(e.currentTarget)}
                    onFocus={e => focusMesh(e.currentTarget)}
                    onBlur={e => blurMesh(e.currentTarget)} />
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
                      <label className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.5)' }}>Estudiante</label>
                      <input value={student} onChange={e => { onStudentChange(e.target.value); setStudentListOpen(true) }}
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
                              onClick={() => { onStudentChange(s.name); setStudentListOpen(false) }}
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
                onClick={onSave}
                className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                style={{ background: MESH_GRAD }}
              >Agendar Cita</motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
