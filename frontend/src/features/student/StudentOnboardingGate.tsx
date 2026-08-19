import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  CalendarCheck, Clock, ChevronRight, ArrowLeft, ArrowRight,
} from 'lucide-react'
import { StudentPage } from './pages/StudentPage'
import SchedulePicker from '@/modules/agenda/SchedulePicker'
import { updateUser, type MockSession, type MockUser } from '@/shared/mock/mockAuth'
import logotipo from '@/assets/logo/logo.webp'
import coachImg from '@/assets/illustrations/characters/coach/coach_missing_fingerprint_and_signature.webp'
import appointmentSuccessImg from '@/assets/illustrations/characters/coach/Appointment_successfully_scheduled.webp'
import welcomeDesktop from '@/assets/scenes/videos/welcome_desktop.mp4'
import welcomeMobile from '@/assets/scenes/videos/welcome_mobile.mp4'
import registrationPendingDesktop from '@/assets/scenes/videos/desktop/registration_pending_dekstop.mp4'
import registrationPendingMobile from '@/assets/scenes/videos/mobile/registration_pending_mobile.mp4'
import { useIsMobile } from '@/shared/components/ui/use-mobile'
import { getPreviewMode, setPreviewMode as persistPreviewMode } from '@/shared/previewMode'

const BLUE = '#007AFF'
const YELLOW = '#F5A623'
const GREEN = '#30D158'
const DARK_BG = '#0A0A14'
const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #7ec8e3)'

interface Props {
  session: MockSession
  onLogout: () => void
}

type Phase = 'steps' | 'agenda' | 'agendada' | 'pending' | 'app'

export default function StudentOnboardingGate({ session, onLogout }: Props) {
  const isMobile = useIsMobile()
  const [previewMode, setPreviewMode] = useState<'celular' | 'desktop' | 'auto'>(getPreviewMode)
  const [user, setUser] = useState<MockUser>(session.user)
  const [phase, setPhase] = useState<Phase>(() => {
    if (!session.user.onboarding.cita) return 'steps'
    if (!session.user.onboarding.firma || !session.user.onboarding.huella) return 'pending'
    return 'app'
  })

  const isDesktopVideo = previewMode === 'desktop'
  const isPhonePreview = previewMode === 'celular' || (previewMode === 'auto' && isMobile)

  const handleAgendaConfirm = (fecha: string, hora: string) => {
    const updated = updateUser(user.email, {
      onboarding: { ...user.onboarding, cita: true },
      cita: { fecha, hora },
    })
    if (updated) {
      setUser(updated)
      setPhase('agendada')
    }
  }

  const pendingSteps = () => {
    const missing: string[] = []
    if (!user.onboarding.cita) missing.push('agendar tu cita')
    if (!user.onboarding.firma) missing.push('firmar el contrato')
    if (!user.onboarding.huella) missing.push('capturar tu huella')
    return missing
  }

  const renderSteps = () => (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center min-h-0">
        <div className="relative flex items-center justify-center">
          <motion.img
            src={coachImg}
            alt="completa tu registro"
            className="w-[260px] h-[260px] sm:w-[360px] sm:h-[360px] object-contain object-bottom relative z-10"
            style={{
              WebkitMaskImage: 'linear-gradient(180deg, black 45%, transparent 100%)',
              maskImage: 'linear-gradient(180deg, black 45%, transparent 100%)',
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 16 }}
          />
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold mt-4" style={{ color: '#fff' }}>Para completar tu registro</h2>
        <p className="text-sm font-bold mt-3" style={{ color: '#7ec8e3' }}>
          Agenda tu cita y firma tu contrato
        </p>
        <p className="text-xs mt-3 leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Elige el día y la hora para firmar el contrato, capturar tu huella y activar tu app. Así quedarás listo para entrenar.
        </p>
      </div>

      <div className="flex-shrink-0 px-5 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLogout}
            className="flex items-center gap-1 px-3.5 py-2.5 rounded-xl text-xs font-medium cursor-pointer justify-self-start"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}
          >
            <ArrowLeft size={14} />
            Salir
          </motion.button>
          <span />
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setPhase('agenda')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer justify-self-end"
            style={{ background: BLUE_GRAD }}
          >
            Siguiente
            <ArrowRight size={14} />
          </motion.button>
        </div>
      </div>
    </div>
  )

  const renderAgenda = () => (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-shrink-0 flex flex-col items-center pt-6 pb-3">
        <img src={logotipo} alt="UNIFIT" style={{ height: 44, objectFit: 'contain' }} />
        <p className="text-[15px] font-extrabold mt-2" style={{ color: '#fff' }}>Agenda tu cita</p>
        <p className="text-[10px] mt-0.5 px-6 text-center" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Elige el día y la hora en la que firmarás el contrato y capturarás tu huella.
        </p>
      </div>

      <div className="flex-1 min-h-0 flex flex-col px-5 pb-2">
        <SchedulePicker onConfirm={handleAgendaConfirm} onBack={() => setPhase('steps')} />
      </div>
    </div>
  )

  const renderAgendada = () => (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center min-h-0">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5" style={{ background: 'rgba(48,209,88,0.12)', border: '1px solid rgba(48,209,88,0.3)' }}>
          <CalendarCheck size={34} style={{ color: GREEN }} />
        </div>
        <h2 className="text-xl font-extrabold" style={{ color: '#fff' }}>¡Cita agendada!</h2>
        <p className="text-xs mt-3 leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
          Tu cita quedó reservada. Asiste a tiempo para firmar el contrato y capturar tu huella. Cuando completes tu registro, la app se habilitará.
        </p>
        <div className="mt-6 rounded-2xl px-4 py-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <Clock size={16} style={{ color: YELLOW }} />
          <div className="text-left">
            <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Tu cita</p>
            <p className="text-xs font-bold text-white">{user.cita ? `${user.cita.fecha} · ${user.cita.hora}` : ''}</p>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 px-5 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLogout}
            className="flex items-center gap-1 px-3.5 py-2.5 rounded-xl text-xs font-medium cursor-pointer justify-self-start"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}
          >
            <ArrowLeft size={14} />
            Volver
          </motion.button>
          <span />
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setPhase('pending')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer justify-self-end"
            style={{ background: BLUE_GRAD }}
          >
            Continuar
            <ChevronRight size={14} />
          </motion.button>
        </div>
      </div>
    </div>
  )

const renderPending = () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-full py-8 px-4">
        <h2 className="text-xl font-extrabold text-center mb-3" style={{ color: '#fff' }}>
          Tu registro está en curso
        </h2>
        <p className="text-xs mt-2 text-center max-w-xs mx-auto" style={{ color: 'rgba(255,255,255,0.55)' }}>
          {pendingSteps().length > 0
            ? `Aún te falta: ${pendingSteps().join(', ')}. Asiste a tu cita para completarlos y habilitar tu app.`
            : 'Completa los pasos pendientes para habilitar tu app.'}
        </p>
        {user.cita && (
          <div className="mt-4 rounded-2xl px-4 py-3 flex items-center gap-3 relative" style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <Clock size={16} style={{ color: YELLOW }} />
            <div className="text-left">
              <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Tu cita</p>
              <p className="text-xs font-bold text-white">{user.cita.fecha} · {user.cita.hora}</p>
            </div>
          </div>
        )}
        <div className="mt-6 flex w-full justify-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onLogout}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
            style={{ background: BLUE_GRAD }}
          >
            Volver al inicio
          </motion.button>
        </div>
      </div>
    )
  }

  const phaseContent = (
    <AnimatePresence mode="wait">
      {phase === 'steps' && (
        <motion.div
          key="steps"
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -14 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col flex-1 min-h-0"
        >
          {renderSteps()}
        </motion.div>
      )}
      {phase === 'agenda' && (
        <motion.div
          key="agenda"
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -14 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col flex-1 min-h-0"
        >
          {renderAgenda()}
        </motion.div>
      )}
      {phase === 'agendada' && (
        <motion.div
          key="agendada"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col flex-1 min-h-0"
        >
          {renderAgendada()}
        </motion.div>
      )}
      {phase === 'pending' && (
        <motion.div
          key="pending"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col flex-1 min-h-0"
        >
          {renderPending()}
        </motion.div>
      )}
      {phase === 'app' && (
        <motion.div key="app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
          <StudentPage />
        </motion.div>
      )}
    </AnimatePresence>
  )

  const backButton = (top: number) => phase !== 'app' && phase !== 'pending' && (
    <button
      onClick={onLogout}
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
          onClick={() => { persistPreviewMode(v); setPreviewMode(v) }}
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
          phase === 'pending' ? (
            <div className="absolute inset-0 overflow-hidden" style={{ background: DARK_BG }}>
              <video
                src={registrationPendingDesktop}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(180deg, rgba(8,12,28,0.5) 0%, rgba(8,12,28,0.7) 50%, rgba(8,12,28,0.85) 100%)',
              }} />
              <div className="relative z-10 size-full flex items-center justify-center overflow-hidden" style={{ padding: 20 }}>
                {phaseContent}
              </div>
            </div>
          ) : (
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
                  {phaseContent}
                </motion.div>
              </div>
            </div>
          )
        ) : isPhonePreview ? (
          <motion.div
            key="phone"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col mx-auto"
            style={isMobile ? {
              width: '100%',
              height: '100%',
              background: DARK_BG,
              overflow: 'hidden',
            } : {
              width: 390,
              height: 720,
              borderRadius: 48,
              background: DARK_BG,
              border: '10px solid rgba(255,255,255,0.06)',
              boxShadow: '0 60px 140px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.05)',
              overflow: 'hidden',
            }}
          >
            {!isMobile && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 rounded-b-2xl z-50" style={{ background: 'rgba(0,0,0,0.85)' }}>
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-2.5 rounded-full" style={{ background: '#151520' }} />
              </div>
            )}
            <div className="absolute inset-0 overflow-hidden" style={{ background: '#000' }}>
              <video
                src={phase === 'pending' ? registrationPendingMobile : welcomeMobile}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
              {phase === 'pending' ? (
                <div className="absolute inset-0" style={{
                  background: 'linear-gradient(180deg, rgba(8,12,28,0.75) 0%, rgba(8,12,28,0.9) 100%)',
                }} />
              ) : (
                <>
                  <div className="absolute inset-0" style={{
                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)',
                  }} />
                  <div className="absolute inset-0" style={{
                    background: 'linear-gradient(180deg, rgba(8,12,28,0.9) 0%, rgba(8,12,28,0.84) 50%, rgba(8,12,28,0.88) 100%)',
                  }} />
                </>
              )}
            </div>
            {backButton(isMobile ? 12 : 36)}
            <div className="relative z-10 flex flex-col flex-1 min-h-0">
              {phaseContent}
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
            <div className="flex-1 min-h-0 w-full max-w-3xl mx-auto flex flex-col">
              {phaseContent}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}