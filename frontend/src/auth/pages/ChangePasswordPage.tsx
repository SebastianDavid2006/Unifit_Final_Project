import { useState, type FormEvent } from 'react'
import { motion } from 'motion/react'
import { Lock, ArrowRight } from 'lucide-react'
import { api, mensajeError } from '@/lib/api'
import { AuthShell } from '@/auth/components/AuthShell'
import { PasswordField } from '@/auth/components/PasswordField'
import logotipo from '@/assets/logo/logo.webp'

const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #7ec8e3)'

interface ChangePasswordPageProps {
  email: string
  onSuccess: () => void
  onBack: () => void
}

export function ChangePasswordPage({ email, onSuccess, onBack }: ChangePasswordPageProps) {
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 400)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (newPass.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      triggerShake()
      return
    }
    if (newPass !== confirmPass) {
      setError('Las contraseñas no coinciden')
      triggerShake()
      return
    }
    try {
      await api.put('/auth/cambiar-password', { email, newPassword: newPass })
      onSuccess()
    } catch (err) {
      setError(mensajeError(err))
      triggerShake()
    }
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
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-14 h-14 flex items-center justify-center mb-4"
          >
            <img src={logotipo} alt="UNIFIT" className="w-9 h-9 object-contain" />
          </motion.div>
          <h2 className="text-xl font-extrabold text-center" style={{ color: '#fff' }}>Cambia tu contraseña</h2>
          <p className="text-[11px] mt-1.5 font-medium text-center max-w-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Por seguridad, debes cambiar tu contraseña temporal antes de continuar.
          </p>
        </div>

        <label className="block mb-2 text-xs font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>CONTRASEÑA TEMPORAL</label>
        <div className="flex items-center gap-3 px-5 rounded-2xl mb-4 h-14" style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.12)',
        }}>
          <Lock size={18} style={{ color: 'rgba(255,255,255,0.45)' }} />
          <input
            type="text"
            value=""
            readOnly
            className="bg-transparent border-none outline-none text-sm w-full"
            style={{ color: '#7ec8e3', fontFamily: 'monospace' }}
          />
        </div>

        <label className="block mb-2 text-xs font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>NUEVA CONTRASEÑA</label>
        <PasswordField value={newPass} onChange={setNewPass} autoComplete="new-password" />

        <label className="block mb-2 text-xs font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>CONFIRMAR NUEVA CONTRASEÑA</label>
        <PasswordField value={confirmPass} onChange={setConfirmPass} autoComplete="new-password" className="mb-6" />

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
    <AuthShell onBack={onBack} autoDesktopVideo>
      {(ctx) => (
        <div className={`flex-1 min-h-0 overflow-y-auto py-6 flex flex-col justify-center ${ctx.isPhonePreview ? 'px-5' : 'px-6 sm:px-10'}`}>
          {formContent}
        </div>
      )}
    </AuthShell>
  )
}
