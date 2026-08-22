import { motion, AnimatePresence } from 'motion/react'
import { CalendarCheck, Clock, Lock, CheckCircle2 } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { DayAvailability } from '@/features/student/types/student'
import { AMBER, GREEN } from '@/features/student/components/ui/fitness'

interface BookingConfirmModalProps {
  pending: { info: DayAvailability; time: string } | null
  onClose: () => void
  onConfirm: () => void
}

export function BookingConfirmModal({ pending, onClose, onConfirm }: BookingConfirmModalProps) {
  return (
    <AnimatePresence>
      {pending && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-end md:items-center justify-center md:p-6"
          style={{ background: 'rgba(0,0,0,0.74)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
            className="w-full md:max-w-sm rounded-t-3xl md:rounded-3xl p-6 text-center"
            style={{
              background: 'linear-gradient(165deg, #12121C, #0A0A14)',
              border: '1px solid rgba(48,209,88,0.28)',
              boxShadow: '0 -10px 80px rgba(0,0,0,0.6), 0 30px 90px rgba(48,209,88,0.12)',
            }}
          >
            <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center" style={{ background: GREEN + '14', border: `1px solid ${GREEN}40` }}>
              <CalendarCheck size={30} style={{ color: GREEN }} />
            </div>
            <h3 className="uppercase italic font-black text-white mt-4" style={{ fontSize: 18 }}>¿Reservar esta sesión?</h3>
            <p style={{ color: 'rgba(255,255,255,0.52)', fontSize: 12.5, marginTop: 6 }}>
              ¿Estás seguro que deseas reservar para esta fecha?
            </p>
            <div className="rounded-2xl p-4 mt-4" style={{ background: 'rgba(48,209,88,0.06)', border: '1px solid rgba(48,209,88,0.22)' }}>
              <p className="capitalize text-white font-black" style={{ fontSize: 14.5 }}>
                {format(pending.info.date, "EEEE d 'de' MMMM yyyy", { locale: es })}
              </p>
              <p className="flex items-center justify-center gap-1.5" style={{ color: '#7CE495', fontSize: 12.5, fontWeight: 800, marginTop: 4 }}>
                <Clock size={13} /> {pending.time} h
              </p>
            </div>
            <p className="flex items-center justify-center gap-1.5 mt-3" style={{ color: AMBER, fontSize: 10.5, fontWeight: 600 }}>
              <Lock size={11} />
              Cancelación disponible solo hasta 24 horas antes
            </p>
            <div className="flex gap-2.5 mt-5">
              <button
                onClick={onClose}
                className="flex-1 py-3.5 rounded-2xl font-black uppercase tracking-wider"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.55)', fontSize: 11 }}
              >
                Cancelar
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={onConfirm}
                className="flex-1 py-3.5 rounded-2xl font-black uppercase tracking-wider"
                style={{ background: `linear-gradient(135deg, ${GREEN}, #7CE495)`, color: '#052e12', fontSize: 11, boxShadow: '0 14px 36px rgba(48,209,88,0.3)' }}
              >
                Sí, reservar
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface BookingSuccessModalProps {
  open: boolean
  booked: { date: Date; time: string } | null
  onClose: () => void
}

export function BookingSuccessModal({ open, booked, onClose }: BookingSuccessModalProps) {
  return (
    <AnimatePresence>
      {open && booked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-end md:items-center justify-center md:p-6"
          style={{ background: 'rgba(0,0,0,0.74)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            onClick={e => e.stopPropagation()}
            className="w-full md:max-w-sm rounded-t-3xl md:rounded-3xl p-7 text-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(170deg, #101A12, #0A0A14)',
              border: '1px solid rgba(48,209,88,0.35)',
              boxShadow: '0 -10px 80px rgba(0,0,0,0.6), 0 30px 100px rgba(48,209,88,0.15)',
            }}
          >
            {/* Brillos de fondo */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(70% 50% at 50% 0%, rgba(48,209,88,0.14), transparent 65%)' }} />

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 240, damping: 13, delay: 0.1 }}
              className="w-24 h-24 mx-auto rounded-full flex items-center justify-center relative z-10"
              style={{ background: `radial-gradient(circle at 32% 28%, rgba(48,209,88,0.3), ${GREEN}18)`, border: `2px solid ${GREEN}66`, boxShadow: '0 0 60px rgba(48,209,88,0.35)' }}
            >
              <CheckCircle2 size={46} style={{ color: GREEN, filter: 'drop-shadow(0 6px 14px rgba(48,209,88,0.6))' }} />
              <motion.span
                className="absolute inset-0 rounded-full"
                style={{ border: `2px solid ${GREEN}` }}
                animate={{ scale: [1, 1.45], opacity: [0.55, 0] }}
                transition={{ duration: 1.7, repeat: Infinity, ease: 'easeOut' }}
              />
            </motion.div>

            <h3
              className="uppercase italic font-black mt-5 relative z-10"
              style={{
                fontSize: 26,
                background: `linear-gradient(135deg, #B8FFCE, ${GREEN})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ¡Listo! Agendada
            </h3>
            <p className="relative z-10" style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12.5, marginTop: 6 }}>
              Tu sesión quedó reservada con el entrenador
            </p>

            <div className="rounded-2xl p-4 mt-4 relative z-10" style={{ background: 'rgba(48,209,88,0.07)', border: '1px solid rgba(48,209,88,0.25)' }}>
              <p className="capitalize text-white font-black" style={{ fontSize: 14.5 }}>
                {format(booked.date, "EEEE d 'de' MMMM yyyy", { locale: es })}
              </p>
              <p className="flex items-center justify-center gap-1.5" style={{ color: '#7CE495', fontSize: 12.5, fontWeight: 800, marginTop: 4 }}>
                <Clock size={13} /> {booked.time} h
              </p>
            </div>

            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              className="w-full py-4 rounded-2xl font-black uppercase tracking-widest mt-5 relative z-10"
              style={{ background: `linear-gradient(135deg, ${GREEN}, #7CE495)`, color: '#052e12', fontSize: 12, boxShadow: '0 14px 40px rgba(48,209,88,0.32)' }}
            >
              ¡Genial!
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
