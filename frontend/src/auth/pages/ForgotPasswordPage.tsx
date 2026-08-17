import { useState, useRef, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Mail, KeyRound, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { findUserByEmail, updateUser } from '@/shared/mock/mockAuth'
import { useIsMobile } from '@/shared/components/ui/use-mobile'
import logotipo from '@/assets/logo/logo.webp'
import welcomeDesktop from '@/assets/scenes/videos/welcome_desktop.mp4'
import welcomeMobile from '@/assets/scenes/videos/welcome_mobile.mp4'

const DARK_BG = '#0A0A14'
const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #7ec8e3)'

const MESH_BUTTON = `
  radial-gradient(circle at 82% 12%, rgba(230,0,18,0.95) 0%, transparent 60%),
  radial-gradient(circle at 18% 12%, rgba(91,37,133,0.95) 0%, transparent 60%),
  radial-gradient(circle at 8% 55%, rgba(0,160,233,0.9) 0%, transparent 55%),
  radial-gradient(circle at 15% 92%, rgba(0,168,143,0.9) 0%, transparent 55%),
  radial-gradient(circle at 50% 90%, rgba(255,241,0,0.9) 0%, transparent 60%),
  radial-gradient(circle at 88% 92%, rgba(243,152,0,0.9) 0%, transparent 55%),
  #1A0B2E
`

interface ForgotPasswordPageProps {
  onBack: () => void
  onDone: () => void
}

type Step = 'email' | 'code' | 'newpass' | 'done'

let persistedPreview: 'celular' | 'desktop' | 'auto' = 'auto'

export function ForgotPasswordPage({ onBack, onDone }: ForgotPasswordPageProps) {
  const isMobile = useIsMobile()
  const [previewMode, setPreviewMode] = useState<'celular' | 'desktop' | 'auto'>(persistedPreview)
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState<string[]>(Array(6).fill(''))
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  const isDesktopVideo = previewMode === 'desktop'
  const isPhonePreview = previewMode === 'celular' || (previewMode === 'auto' && isMobile)

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

              <label className="block mb-2 text-xs font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>CONFIRMAR CONTRASEÑA</label>
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

  const backButton = (top: number) => (
    <button
      onClick={onBack}
      className="absolute z-40 w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors"
      style={{ top, left: 16, color: 'rgba(255,255,255,0.5)' }}
    >
      <ArrowLeft size={16} />
    </button>
  )

  const viewToolbar = (
    <div className="flex-shrink-0 flex items-center justify-center gap-1 z-50 pt-3 pb-2">
      <span className="text-[9px] font-bold uppercase tracking-widest mr-1.5" style={{ color: 'rgba(255,255,255,0.3)' }}>Vista</span>
      {(['celular', 'desktop', 'auto'] as const).map(v => (
        <button
          key={v}
          onClick={() => { persistedPreview = v; setPreviewMode(v) }}
          className="px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer"
          style={{
            background: previewMode === v ? 'rgba(255,255,255,0.14)' : 'transparent',
            border: previewMode === v ? '1px solid rgba(255,255,255,0.22)' : '1px solid transparent',
            color: previewMode === v ? '#FFFFFF' : 'rgba(255,255,255,0.35)',
          }}
        >
          {v === 'celular' ? 'Celular' : v === 'desktop' ? 'Desktop' : 'Auto'}
        </button>
      ))}
    </div>
  )

  return (
    <div className="relative size-full flex flex-col" style={{ background: DARK_BG }}>
      {viewToolbar}

      <div className="flex-1 min-h-0 relative">
        {isDesktopVideo ? (
          <div className="absolute inset-0 overflow-hidden" style={{ background: DARK_BG }}>
            <video
              src={welcomeDesktop}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }} />
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(115deg, rgba(8,12,28,0.55) 0%, rgba(8,12,28,0.3) 45%, rgba(8,12,28,0.16) 100%)',
            }} />
            <div className="relative z-10 size-full flex items-center justify-center overflow-hidden" style={{ padding: 20 }}>
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-3xl h-full flex flex-col"
                style={{
                  background: 'rgba(10,14,24,0.78)',
                  backdropFilter: 'blur(28px) saturate(1.6)',
                  WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  boxShadow: '0 24px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.15)',
                  borderRadius: 32,
                }}
              >
                {backButton(16)}
                <div className="flex-1 min-h-0 overflow-y-auto px-6 sm:px-10 py-6 flex flex-col justify-center">
                  {formContent}
                </div>
              </motion.div>
            </div>
          </div>
        ) : isPhonePreview ? (
          <motion.div
            key="phone"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col overflow-hidden mx-auto"
            style={isMobile ? {
              width: '100%',
              height: '100%',
              background: DARK_BG,
            } : {
              width: 390,
              height: 720,
              borderRadius: 48,
              background: DARK_BG,
              border: '10px solid rgba(255,255,255,0.06)',
              boxShadow: '0 60px 140px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            {!isMobile && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 rounded-b-2xl z-50" style={{ background: 'rgba(0,0,0,0.85)' }}>
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-2.5 rounded-full" style={{ background: '#151520' }} />
              </div>
            )}
            <div className="absolute inset-0 overflow-hidden" style={{ background: '#000' }}>
              <video
                src={welcomeMobile}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0" style={{
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
              }} />
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(180deg, rgba(8,12,28,0.9) 0%, rgba(8,12,28,0.84) 50%, rgba(8,12,28,0.88) 100%)',
              }} />
            </div>
            {backButton(isMobile ? 12 : 36)}
            <div className="relative z-10 flex flex-col flex-1 min-h-0">
              <div className="flex-1 min-h-0 overflow-y-auto px-5 py-6 flex flex-col justify-center">
                {formContent}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="desktop"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative size-full flex flex-col overflow-hidden"
            style={{
              background: 'rgba(10,14,24,0.92)',
              backdropFilter: 'blur(28px) saturate(1.6)',
              WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
            }}
          >
            <div className="flex-1 min-h-0 w-full max-w-3xl mx-auto flex flex-col relative">
              {backButton(16)}
              <div className="flex-1 min-h-0 overflow-y-auto px-6 sm:px-10 py-6 flex flex-col justify-center">
                {formContent}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}