import { useState, useRef, type FormEvent } from 'react'
import { motion } from 'motion/react'
import { User, Lock, Eye, EyeOff, UserPlus, ArrowRight } from 'lucide-react'
import gymBg from '../../assets/scenes/login_screen.mp4'
import logotipo from '../../assets/logo/logo.webp'
import universidadLogo from '../../assets/logo/universitaria_de_colombia.webp'
import secundarioLogo from '../../assets/logo/universitaria_de_bogota.webp'

interface LoginViewProps {
  onSelect: (platform: 'trainer' | 'student' | 'admin') => void
  onRegister: () => void
}

const MESH_BUTTON = `
  radial-gradient(circle at 82% 12%, rgba(230,0,18,0.95) 0%, transparent 60%),
  radial-gradient(circle at 18% 12%, rgba(91,37,133,0.95) 0%, transparent 60%),
  radial-gradient(circle at 8% 55%, rgba(0,160,233,0.9) 0%, transparent 55%),
  radial-gradient(circle at 15% 92%, rgba(0,168,143,0.9) 0%, transparent 55%),
  radial-gradient(circle at 50% 90%, rgba(255,241,0,0.9) 0%, transparent 60%),
  radial-gradient(circle at 88% 92%, rgba(243,152,0,0.9) 0%, transparent 55%),
  #1A0B2E
`

export function LoginView({ onSelect, onRegister }: LoginViewProps) {
  const [usuario, setUsuario] = useState('')
  const [contraseña, setContraseña] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [opacityA, setOpacityA] = useState(1)
  const [opacityB, setOpacityB] = useState(0)
  const videoARef = useRef<HTMLVideoElement>(null)
  const videoBRef = useRef<HTMLVideoElement>(null)
  const crossfading = useRef(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSelect('trainer')
  }

  const triggerCrossfade = (from: HTMLVideoElement, to: HTMLVideoElement, fadeTo: () => void) => {
    if (crossfading.current) return
    crossfading.current = true
    to.currentTime = 0
    to.play()
    fadeTo()
    setTimeout(() => {
      from.pause()
      from.currentTime = 0
      if (from === videoARef.current) setOpacityA(0)
      else setOpacityB(0)
      crossfading.current = false
    }, 2200)
  }

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const v = e.currentTarget
    if (v.currentTime >= (v.duration || 0) - 2.2) {
      if (v === videoARef.current) {
        if (videoBRef.current) triggerCrossfade(v, videoBRef.current, () => setOpacityB(1))
      } else if (videoARef.current) {
        triggerCrossfade(v, videoARef.current, () => setOpacityA(1))
      }
    }
  }

  return (
    <div className="size-full relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          ref={videoARef}
          src={gymBg}
          autoPlay
          muted
          playsInline
          onTimeUpdate={handleTimeUpdate}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
          style={{ opacity: opacityA }}
        />
        <video
          ref={videoBRef}
          src={gymBg}
          muted
          playsInline
          onTimeUpdate={handleTimeUpdate}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
          style={{ opacity: opacityB }}
        />
        <div className="absolute inset-0" style={{
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }} />
      </div>
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(115deg, rgba(8,12,28,0.55) 0%, rgba(8,12,28,0.3) 45%, rgba(8,12,28,0.16) 100%)',
      }} />

      <div className="relative z-10 size-full flex items-center justify-center px-5 py-4">
        <div className="w-full max-w-[540px] max-h-dvh flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 -mb-12 flex-shrink-0"
        >
          <img src={logotipo} alt="UNIFIT" className="drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]" style={{ width: 96, height: 96, objectFit: 'contain' }} />
        </motion.div>
        <motion.form
          onSubmit={handleSubmit}
          className="w-full max-h-[calc(100dvh-5rem)] overflow-y-auto rounded-[32px] px-6 sm:px-8 lg:px-10 pt-14 sm:pt-16 pb-8 lg:pb-10 flex flex-col justify-start relative"
          style={{
            background: 'rgba(10,14,24,0.72)',
            backdropFilter: 'blur(28px) saturate(1.6)',
            WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.15)',
          }}
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex flex-col items-center mb-7">
              <h2 className="text-2xl font-extrabold text-white">Bienvenido a UNIFIT</h2>
              <p className="text-sm mt-1.5 font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>Inicia sesión para continuar</p>
            </div>

            <label className="block mb-2 text-xs font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>USUARIO</label>
            <div className="flex items-center gap-3 px-5 rounded-2xl mb-6 h-14" style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}>
              <User size={18} style={{ color: 'rgba(255,255,255,0.45)' }} />
              <input
                value={usuario}
                onChange={e => setUsuario(e.target.value)}
                placeholder="Ingresa tu usuario"
                className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-white/30"
              />
            </div>

            <label className="block mb-2 text-xs font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>CONTRASEÑA</label>
            <div className="flex items-center gap-3 px-5 rounded-2xl mb-8 h-14" style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}>
              <Lock size={18} style={{ color: 'rgba(255,255,255,0.45)' }} />
              <input
                type={showPass ? 'text' : 'password'}
                value={contraseña}
                onChange={e => setContraseña(e.target.value)}
                placeholder="••••••••"
                className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-white/30"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="flex items-center justify-center cursor-pointer"
              >
                {showPass
                  ? <EyeOff size={18} style={{ color: 'rgba(255,255,255,0.45)' }} />
                  : <Eye size={18} style={{ color: 'rgba(255,255,255,0.45)' }} />}
              </button>
            </div>

            <div className="flex justify-end -mt-4 mb-6">
              <button
                type="button"
                onClick={() => {}}
                className="text-xs font-semibold cursor-pointer transition-colors hover:underline"
                style={{ color: 'rgba(255,255,255,0.55)' }}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-14 rounded-2xl text-base font-bold text-white flex items-center justify-center gap-2 cursor-pointer relative overflow-hidden"
              style={{
                background: MESH_BUTTON,
                backgroundSize: '220% 220%',
                boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
              }}
              animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
              transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            >
              Iniciar sesión
              <ArrowRight size={18} />
            </motion.button>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.15)' }} />
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>o</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.15)' }} />
            </div>

            <motion.button
              type="button"
              onClick={onRegister}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-14 rounded-2xl text-base font-bold flex items-center justify-center gap-2 cursor-pointer"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '2px solid rgba(255,255,255,0.25)',
                color: '#fff',
              }}
            >
              <UserPlus size={18} />
              Crear cuenta
            </motion.button>

            <div className="flex items-center justify-center gap-5 mt-8">
              <img src={universidadLogo} alt="Universidad" style={{ height: 28, objectFit: 'contain' }} />
              <div className="h-10 w-px" style={{ background: 'rgba(255,255,255,0.25)' }} />
              <img src={secundarioLogo} alt="Logo secundario" style={{ height: 32, objectFit: 'contain' }} />
            </div>

            <p className="text-[11px] text-center font-medium mt-6 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.45)' }}>
              Desarrollado por <span className="font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>Sebastian Pérez Rico</span> y{' '}
              <span className="font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>Jhon Barrantes Segura</span>
            </p>
          </motion.form>
        </div>
      </div>
    </div>
  )
}
