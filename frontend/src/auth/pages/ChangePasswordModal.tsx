import { useState, type FormEvent, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react'
import { useIsMobile } from '@/shared/components/ui/use-mobile'
import { findUserByEmail } from '@/shared/mock/mockAuth'

const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #7ec8e3)'
const DARK_BG = '#0A0A14'

interface ChangePasswordModalProps {
  onSuccess: () => void
}

export function ChangePasswordModal({ onSuccess }: ChangePasswordModalProps) {
  const isMobile = useIsMobile()
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)
  const [tempPass, setTempPass] = useState('test')

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 400)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (newPass.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres')
      triggerShake()
      return
    }
    if (newPass !== confirmPass) {
      setError('Las contraseñas no coinciden')
      triggerShake()
      return
    }
    setError('')
    onSuccess()
  }

  const formContent = (
    <motion.div
      className="w-full"
      animate={shake ? { x: [0, -6, 6, -6, 6, 0] } : {}}
      transition={{ duration: 0.4 }}
    >
      <motion.form
        onSubmit={handleSubmit}
        className="w-full flex flex-col justify-start"
      >
        <div className="flex flex-col items-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 16 }}
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ background: 'rgba(126,200,227,0.12)', border: '1px solid rgba(126,200,227,0.25)' }}
          >
            <ShieldCheck size={28} style={{ color: '#7ec8e3' }} />
          </motion.div>
          <h2 className="text-xl font-extrabold text-center" style={{ color: '#fff' }}>Cambia tu contraseña</h2>
          <p className="text-[11px] mt-1.5 font-medium text-center max-w-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Por seguridad, debes cambiar tu contraseña temporal antes de continuar.
          </p>
          <div className="flex items-center gap-2 mt-3 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <span>Contraseña temporal:</span>
            <span style={{ color: '#7ec8e3', fontWeight: 'bold' }}>{tempPass}</span>
          </div>
        </div>

        <label className="block mb-2 text-xs font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>NUEVA CONTRASEÑA</label>
        <div className="flex items-center gap-3 px-5 rounded-2xl mb-4 h-14" style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.12)',
        }}>
          <Lock size={18} style={{ color: 'rgba(255,255,255,0.45)' }} />
          <input
            type={showPass ? 'text' : 'password'}
            value={newPass}
            onChange={e => setNewPass(e.target.value)}
            placeholder="••••••••"
            className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-white/30"
          />
          <button type="button" onClick={() => setShowPass(!showPass)} className="flex items-center justify-center cursor-pointer">
            {showPass
              ? <EyeOff size={18} style={{ color: 'rgba(255,255,255,0.45)' }} />
              : <Eye size={18} style={{ color: 'rgba(255,255,255,0.45)' }} />}
          </button>
        </div>

        <label className="block mb-2 text-xs font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>CONFIRMAR NUEVA CONTRASEÑA</label>
        <div className="flex items-center gap-3 px-5 rounded-2xl mb-6 h-14" style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.12)',
        }}>
          <Lock size={18} style={{ color: 'rgba(255,255,255,0.45)' }} />
          <input
            type={showPass ? 'text' : 'password'}
            value={confirmPass}
            onChange={e => setConfirmPass(e.target.value)}
            placeholder="••••••••"
            className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-white/30"
          />
        </div>

        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-bold text-center -mt-3 mb-5" style={{ color: '#F43843' }}>
            {error}
          </motion.p>
        )}

        <motion.button
          type="submit"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full h-14 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2 cursor-pointer"
          style={{ background: BLUE_GRAD }}
        >
          Cambiar contraseña
          <ArrowRight size={16} />
        </motion.button>
      </motion.form>
    </motion.div>
  )

  return (
    <div className="size-full flex flex-col" style={{ background: DARK_BG }}>
      <div className="flex-1 min-h-0 flex items-center justify-center px-5 py-6">
        {isMobile ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md rounded-[32px] px-6 py-8"
            style={{
              background: 'rgba(10,14,24,0.78)',
              backdropFilter: 'blur(28px) saturate(1.6)',
              WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.15)',
            }}
          >
            {formContent}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md h-full max-h-[600px] flex flex-col rounded-[32px] px-8 py-8"
            style={{
              background: 'rgba(10,14,24,0.78)',
              backdropFilter: 'blur(28px) saturate(1.6)',
              WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.15)',
            }}
          >
            {formContent}
          </motion.div>
        )}
      </div>
    </div>
  )
}
