import { useState, useRef, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Mail, KeyRound, ArrowRight, Check } from 'lucide-react'
import { findUserByEmail, updateUser } from '@/auth/services/authService'
import { AuthShell } from '@/auth/components/AuthShell'
import { PasswordField } from '@/auth/components/PasswordField'
import logotipo from '@/assets/logo/logo.webp'

const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #7ec8e3)'

interface ForgotPasswordPageProps {
  onBack: () => void
  onDone: () => void
}

type Step = 'email' | 'code' | 'newpass' | 'done'

export function ForgotPasswordPage({ onBack, onDone }: ForgotPasswordPageProps) {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState<string[]>(Array(6).fill(''))
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 400)
  }

  const sendCode = (e: FormEvent) => {
    e.preventDefault()
    const em = email.trim().toLowerCase()
    if (!em) {
      setError('Ingresa tu correo electrónico')
      triggerShake()
      return
    }
    if (!findUserByEmail(em)) {
      setError('No encontramos una cuenta con ese correo')
      triggerShake()
      return
    }
    setError('')
    setStep('code')
  }

  const verifyCode = (e: FormEvent) => {
    e.preventDefault()
    const filled = code.filter(c => c !== '').length
    if (filled > 0 && filled < 6) {
      setError('Ingresa los 6 dígitos del código')
      triggerShake()
      return
    }
    setError('')
    setStep('newpass')
  }

  const savePassword = (e: FormEvent) => {
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
    updateUser(email.trim().toLowerCase(), { password: newPass })
    setError('')
    setStep('done')
  }

  const handleCodeChange = (i: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(-1)
    const next = [...code]
    next[i] = digit
    setCode(next)
    if (digit && i < 5) inputsRef.current[i + 1]?.focus()
  }

  const handleCodeKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[i] && i > 0) inputsRef.current[i - 1]?.focus()
  }

  const titles: Record<Step, { title: string; subtitle: string }> = {
    email: { title: 'Recupera tu contraseña', subtitle: 'Ingresa tu correo electrónico y te enviaremos un código de verificación' },
    code: { title: 'Verifica tu correo', subtitle: `Te hemos enviado un código de 6 dígitos a ${email.trim().toLowerCase()}` },
    newpass: { title: 'Nueva contraseña', subtitle: 'Crea una nueva contraseña para tu cuenta' },
    done: { title: '¡Contraseña restablecida!', subtitle: 'Ya puedes iniciar sesión con tu nueva contraseña.' },
  }

  const formContent = (
    <motion.div
      className="w-full"
      animate={shake ? { x: [0, -6, 6, -6, 6, 0] } : {}}
      transition={{ duration: 0.4 }}
    >
      <motion.form
        onSubmit={step === 'email' ? sendCode : step === 'code' ? verifyCode : step === 'newpass' ? savePassword : undefined}
        className="w-full flex flex-col justify-start"
      >
        <div className="flex flex-col items-center mb-6">
          <img src={logotipo} alt="UNIFIT" style={{ height: 56, objectFit: 'contain' }} />
          <h2 className="text-xl font-extrabold mt-3 text-center" style={{ color: '#fff' }}>{titles[step].title}</h2>
          <p className="text-[10px] mt-1.5 font-medium text-center max-w-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {titles[step].subtitle}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'email' && (
            <motion.div
              key="email"
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -14 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <label className="block mb-2 text-xs font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>CORREO ELECTRÓNICO</label>
              <div className="flex items-center gap-3 px-5 rounded-2xl mb-6 h-14" style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}>
                <Mail size={18} style={{ color: 'rgba(255,255,255,0.45)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tucorreo@ejemplo.com"
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
                Enviar código
                <ArrowRight size={16} />
              </motion.button>
            </motion.div>
          )}

          {step === 'code' && (
            <motion.div
              key="code"
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -14 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex gap-2 justify-center mb-5 mt-1">
                {code.map((d, i) => (
                  <input
                    key={i}
                    ref={el => { inputsRef.current[i] = el }}
                    value={d}
                    onChange={e => handleCodeChange(i, e.target.value)}
                    onKeyDown={e => handleCodeKeyDown(i, e)}
                    inputMode="numeric"
                    maxLength={1}
                    className="w-12 h-14 sm:w-14 sm:h-16 rounded-2xl text-center text-2xl font-extrabold outline-none transition-all cursor-pointer"
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: `2px solid ${d ? 'rgba(126,200,227,0.6)' : 'rgba(255,255,255,0.12)'}`,
                      color: '#fff',
                    }}
                  />
                ))}
              </div>

              <p className="text-[10px] text-center font-medium mb-5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                ¿No recibiste el código? <span className="font-bold cursor-pointer hover:underline" style={{ color: '#7ec8e3' }}>Reenviar</span>
              </p>

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
                Verificar código
                <ArrowRight size={16} />
              </motion.button>
            </motion.div>
          )}

          {step === 'newpass' && (
            <motion.div
              key="newpass"
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -14 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <label className="block mb-2 text-xs font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>NUEVA CONTRASEÑA</label>
              <PasswordField value={newPass} onChange={setNewPass} autoComplete="new-password" />

              <label className="block mb-2 text-xs font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>CONFIRMAR CONTRASEÑA</label>
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
                Guardar contraseña
                <ArrowRight size={16} />
              </motion.button>
            </motion.div>
          )}

          {step === 'done' && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
              className="flex flex-col items-center py-2"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 16 }}
                className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
                style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}
              >
                <Check size={34} color="#22C55E" strokeWidth={3} />
              </motion.div>
              <motion.button
                onClick={onDone}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full mt-4 h-14 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2 cursor-pointer"
                style={{ background: BLUE_GRAD }}
              >
                Volver al inicio
                <KeyRound size={16} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>
    </motion.div>
  )

  return (
    <AuthShell onBack={onBack}>
      {(ctx) => (
        <div className={`flex-1 min-h-0 overflow-y-auto py-6 flex flex-col justify-center ${ctx.isPhonePreview ? 'px-5' : 'px-6 sm:px-10'}`}>
          {formContent}
        </div>
      )}
    </AuthShell>
  )
}
