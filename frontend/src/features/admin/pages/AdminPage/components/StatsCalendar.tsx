import { motion } from 'motion/react'
import { BLUE_GRAD } from '../data'

export default function StatsCalendar({ position, start, end, onStartChange, onEndChange, onClose, onClear }: {
  position: { top: number; right: number }
  start: string
  end: string
  onStartChange: (v: string) => void
  onEndChange: (v: string) => void
  onClose: () => void
  onClear: () => void
}) {
  return (
    <>
      <div className="fixed inset-0 z-[45]" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        transition={{ duration: 0.15 }}
        className="fixed z-[50] w-72 rounded-2xl p-5"
        style={{ top: position.top, right: position.right, background: '#FFFFFF', boxShadow: '0 24px 80px rgba(0,0,0,0.18)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-extrabold" style={{ color: '#1A1A1E' }}>Rango de fechas</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.05)' }}
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="rgba(0,0,0,0.3)" strokeWidth="2" strokeLinecap="round" /></svg>
          </motion.button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] font-bold tracking-wide mb-1" style={{ color: 'rgba(0,0,0,0.4)' }}>INICIO</label>
            <input
              type="date"
              value={start}
              onChange={e => onStartChange(e.target.value)}
              className="w-full rounded-xl px-3 py-2 text-xs font-semibold outline-none"
              style={{ background: 'rgba(0,0,0,0.04)', color: '#1A1A1E', border: '1px solid rgba(0,0,0,0.06)' }}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold tracking-wide mb-1" style={{ color: 'rgba(0,0,0,0.4)' }}>FIN</label>
            <input
              type="date"
              value={end}
              onChange={e => onEndChange(e.target.value)}
              className="w-full rounded-xl px-3 py-2 text-xs font-semibold outline-none"
              style={{ background: 'rgba(0,0,0,0.04)', color: '#1A1A1E', border: '1px solid rgba(0,0,0,0.06)' }}
            />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClear}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold"
            style={{ background: 'rgba(0,0,0,0.05)', color: 'rgba(0,0,0,0.4)' }}
          >
            Limpiar
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold"
            style={{ background: BLUE_GRAD, color: '#fff', boxShadow: '0 4px 16px rgba(18,112,183,0.3)' }}
          >
            Aplicar
          </motion.button>
        </div>
      </motion.div>
    </>
  )
}
