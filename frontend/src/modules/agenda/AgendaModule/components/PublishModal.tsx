import { motion, AnimatePresence } from 'motion/react'
import { Plus, X } from 'lucide-react'
import { meshInputBg } from '@/data/constants'
import { BLUE, BLUE_GRAD, RED, WEEK_DAYS_6 } from '../../AgendaData'
import { DayCard } from '../../AgendaDayCard'
import { blurMesh, enterMesh, focusMesh, leaveMesh, MESH_GRAD } from '../data'
import { PublishConfirm } from './PublishConfirm'
import { PublishSuccess } from './PublishSuccess'

interface Range {
  open: string
  close: string
}

interface DayConfig {
  duration: string
  ranges: Range[]
}

interface PublishModalProps {
  show: boolean
  publishStep: 1 | 2
  onClose: () => void
  publishStart: string
  publishEnd: string
  onStartChange: (v: string) => void
  onEndChange: (v: string) => void
  publishDays: string[]
  onToggleDay: (key: string) => void
  selDay: string | null
  onSelectDay: (key: string) => void
  allDaysComplete: boolean
  dayIsComplete: (day: string) => boolean
  showPublishSuccess: boolean
  showPublishConfirm: boolean
  onContinue: () => void
  onBack: () => void
  onOpenConfirm: () => void
  onCancelConfirm: () => void
  onPublish: () => void
  getDayConfig: (day: string) => DayConfig
  updateDayDuration: (day: string, duration: string) => void
  updateDayRange: (day: string, index: number, field: 'open' | 'close', value: string) => void
  addDayRange: (day: string) => void
  removeDayRange: (day: string, index: number) => void
  rangeConflict: { day: string; msg: string } | null
}

export function PublishModal({ show, publishStep, onClose, publishStart, publishEnd, onStartChange, onEndChange, publishDays, onToggleDay, selDay, onSelectDay, allDaysComplete, dayIsComplete, showPublishSuccess, showPublishConfirm, onContinue, onBack, onOpenConfirm, onCancelConfirm, onPublish, getDayConfig, updateDayDuration, updateDayRange, addDayRange, removeDayRange, rangeConflict }: PublishModalProps) {
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
            className={`relative rounded-3xl w-full max-w-2xl ${showPublishSuccess ? 'overflow-visible' : 'overflow-hidden'}`}
            style={{ background: '#fff', boxShadow: '0 25px 60px rgba(0,0,0,0.15)' }}
            onClick={e => e.stopPropagation()}
          >
            {showPublishSuccess ? <PublishSuccess publishDays={publishDays} publishStart={publishStart} publishEnd={publishEnd} onClose={onClose} /> : (
              <>
                <div className="sticky top-0 z-10 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.9)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                  <div className="flex items-center justify-end px-4 pt-4 pb-0">
                    <motion.button
                      whileHover={{ scale: 1.15, background: 'rgba(244,56,67,0.1)', color: RED }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
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
                        <input type="date" value={publishStart} onChange={e => onStartChange(e.target.value)}
                          className="flex-1 px-3.5 py-2.5 rounded-xl text-sm font-medium outline-none"
                          style={{ background: meshInputBg, border: '1px solid transparent', color: '#1A1A1E' }}
                          onMouseEnter={e => enterMesh(e.currentTarget)}
                          onMouseLeave={e => leaveMesh(e.currentTarget)}
                          onFocus={e => focusMesh(e.currentTarget)}
                          onBlur={e => blurMesh(e.currentTarget)} />
                        <span className="text-xs" style={{ color: 'rgba(0,0,0,0.2)' }}>—</span>
                        <input type="date" value={publishEnd} onChange={e => onEndChange(e.target.value)}
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
                          return <DayCard key={key} label={label} selected={active} onClick={() => onToggleDay(key)} />
                        })}
                      </div>
                    </div>

                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={onContinue}
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
                        return <DayCard key={key} label={label} selected={selDay === key} done={dayIsComplete(key)} onClick={() => onSelectDay(key)} />
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
                      <button onClick={onBack} className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all" style={{ background: 'rgba(0,0,0,0.05)', color: 'rgba(0,0,0,0.5)' }}>Volver</button>
                      <motion.button whileHover={allDaysComplete ? { scale: 1.02 } : {}} whileTap={allDaysComplete ? { scale: 0.98 } : {}}
                        onClick={onOpenConfirm}
                        disabled={!allDaysComplete}
                        className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                        style={{ background: allDaysComplete ? MESH_GRAD : 'rgba(0,0,0,0.1)' }}
                      >Publicar Cupos</motion.button>
                    </div>
                  </div>
                )}

                <PublishConfirm show={showPublishConfirm} onCancel={onCancelConfirm} onConfirm={onPublish} />
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

