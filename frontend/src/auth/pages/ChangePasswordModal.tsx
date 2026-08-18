import { useState, type FormEvent, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Lock, Eye, EyeOff, ArrowLeft, ArrowRight } from 'lucide-react'
import { useIsMobile } from '@/shared/components/ui/use-mobile'
import welcomeDesktop from '@/assets/scenes/videos/welcome_desktop.mp4'
import welcomeMobile from '@/assets/scenes/videos/welcome_mobile.mp4'
import logotipo from '@/assets/logo/logo.webp'

const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #7ec8e3)'
const DARK_BG = '#0A0A14'

interface ChangePasswordModalProps {
  onSuccess: () => void
  onBack: () => void
}

type PreviewMode = 'celular' | 'desktop' | 'auto'
let persistedPreview = 'auto'

export function ChangePasswordModal({ onSuccess, onBack }: ChangePasswordModalProps) {
  const isMobile = useIsMobile()
  const [previewMode, setPreviewMode] = useState<PreviewMode>(persistedPreview)
  const changePreviewMode = (v: PreviewMode) => {
    persistedPreview = v
    setPreviewMode(v)
  }

  const isDesktopVideo = previewMode === 'desktop' || (previewMode === 'auto' && !isMobile)
  const isPhonePreview = previewMode === 'celular' || (previewMode === 'auto' && isMobile)

  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 400)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
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
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
            style={{ background: 'rgba(126,200,227,0.12)', border: '1px solid rgba(126,200,227,0.25)' }}
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
            className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-white/30"
            style={{ color: '#7ec8e3', fontFamily: 'monospace' }}
          />
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

  const viewToolbar = (
    <div className="flex-shrink-0 flex items-center justify-center gap-1 z-50 pt-3 pb-2">
      <span className="text-[9px] font-bold uppercase tracking-widest mr-1.5" style={{ color: 'rgba(255,255,255,0.3)' }}>Vista</span>
      {(['celular', 'desktop', 'auto'] as const).map(v => (
        <button
          key={v}
          onClick={() => changePreviewMode(v)}
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

  const backButton = (top: number) => (
    <button
      onClick={onBack}
      className="absolute z-50 w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors"
      style={{ top, left: 16, color: 'rgba(255,255,255,0.5)' }}
    >
      <ArrowLeft size={16} />
    </button>
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
            {backButton(16)}
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
            {backButton(16)}
            <div className="flex-1 min-h-0 overflow-y-auto px-5 py-6 flex flex-col justify-center">
              {formContent}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}