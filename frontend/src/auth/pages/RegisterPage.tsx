import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { INITIAL_FORM, BLUE_GRAD } from '@/data/config/registration'
import type { TipoUsuario } from '@/data/config/registration'
import { getNiveles, getPrograms } from '@/data/config/academicPrograms'
import { createAccount, generateTempPassword, sendEmail } from '@/auth/services/authService'
import { AuthShell } from '@/auth/components/AuthShell'
import { RegisterFormSections } from '@/auth/components/RegisterFormSections'
import { RegisterSuccess } from '@/auth/components/RegisterSuccess'
import { RegisterIntroOverlay } from '@/auth/components/RegisterIntroOverlay'
import { useAuthLayout } from '@/auth/hooks/useAuthLayout'
import logotipo from '@/assets/logo/logo.webp'
import welcomeDesktop from '@/assets/scenes/videos/welcome_desktop.mp4'
import welcomeMobile from '@/assets/scenes/videos/welcome_mobile.mp4'

const PHONE_GRADIENT_FORM = 'linear-gradient(180deg, rgba(8,12,28,0.9) 0%, rgba(8,12,28,0.84) 50%, rgba(8,12,28,0.88) 100%)'
const PHONE_GRADIENT_INTRO = 'linear-gradient(180deg, rgba(8,12,28,0.65) 0%, rgba(8,12,28,0.45) 50%, rgba(8,12,28,0.6) 100%)'

interface RegisterPageProps {
  onBack: () => void
}

type Phase = 'intro' | 'form' | 'success'

export function RegisterPage({ onBack }: RegisterPageProps) {
  const { isPhonePreview, isDesktopVideo } = useAuthLayout()
  const [phase, setPhase] = useState<Phase>('intro')
  const [form, setForm] = useState<Record<string, string>>({ ...INITIAL_FORM, parentesco: 'Padre', estado: 'No egresado' })
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario | null>(null)
  const [shake, setShake] = useState(false)
  const introVideoRef = useRef<HTMLVideoElement>(null)
  const introContainerRef = useRef<HTMLDivElement>(null)
  const bgVideoRef = useRef<HTMLVideoElement>(null)

  const introSrc = isPhonePreview ? welcomeMobile : welcomeDesktop

  useEffect(() => {
    if (phase !== 'intro') return
    const v = introVideoRef.current
    if (!v) return
    v.muted = true
    v.play().catch(() => {})
    const t = setTimeout(() => {
      v.muted = false
      const p = v.play()
      if (p) p.catch(() => {
        v.muted = true
        v.play().catch(() => {})
      })
    }, 350)

    const el = introContainerRef.current
    if (el && !isPhonePreview) {
      const doc = document as any
      if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
        const req = el.requestFullscreen?.() ?? el.webkitRequestFullscreen?.()
        if (req?.catch) req.catch(() => {})
      }
    }

    return () => {
      clearTimeout(t)
      const doc = document as any
      if (doc.fullscreenElement || doc.webkitFullscreenElement) {
        const exit = doc.exitFullscreen?.() ?? doc.webkitExitFullscreen?.()
        if (exit?.catch) exit.catch(() => {})
      }
    }
  }, [phase, introSrc, isPhonePreview])

  const skipIntro = () => {
    introVideoRef.current?.pause()
    const bg = bgVideoRef.current
    if (bg) {
      bg.currentTime = 0
      bg.play().catch(() => {})
    }
    setPhase('form')
  }

  const toggleTipoUsuario = (tipo: TipoUsuario) => {
    setTipoUsuario(prev => (prev === tipo ? null : tipo))
    const inst = 'Universitaria de Colombia'
    const level = getNiveles(inst)[0]
    const prog = getPrograms(inst, level)[0] ?? ''
    setForm(prev => ({
      ...prev,
      numCarnet: '', estado: 'No egresado',
      institucion: inst, nivelFormacion: level, programa: prog,
      semestre: '1', modalidad: 'Presencial', jornada: 'Mañana',
      cargo: '', area: '',
    }))
  }

  const isMinor = useMemo(() => {
    if (!form.fechaNac) return false
    const birth = new Date(form.fechaNac)
    if (isNaN(birth.getTime())) return false
    const now = new Date()
    let age = now.getFullYear() - birth.getFullYear()
    const m = now.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--
    return age < 18
  }, [form.fechaNac])

  const canGoNext = () => {
    const base = !!(tipoUsuario && form.primerNombre && form.primerApellido && form.numDoc)
    if (!base) return false
    if (isMinor) {
      return !!form.nombreAcudiente &&
        !!form.parentescoAcudiente &&
        !!form.telefonoAcudiente &&
        (form.parentescoAcudiente !== 'Otro' || !!form.otroParentescoAcudiente)
    }
    return true
  }

  const createMockAccount = () => {
    const email = (form.email || 'estudiante.demo@unifit.com').trim()
    const tempPassword = generateTempPassword()
    createAccount({
      email,
      password: form.numDoc || tempPassword,
      nombre: `${form.primerNombre || 'Estudiante'} ${form.primerApellido || ''}`.trim(),
      estado: 'en_proceso',
      debeCambiarContrasena: false,
      onboarding: { cita: false, firma: false, huella: false },
    })
sendEmail(
        email,
        'Tus credenciales de acceso a UniFit',
        `Hola${form.primerNombre ? ` ${form.primerNombre}` : ''}! Tu cuenta fue creada exitosamente. Tu usuario es tu correo electrónico (${email}) y tu contraseña es tu número de documento. Al ingresar por primera vez deberás cambiarla por una nueva.`,
        form.numDoc || tempPassword,
      )
  }

  const handleNext = () => {
    if (!canGoNext()) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }
    try {
      createMockAccount()
      setPhase('success')
    } catch (err) {
      console.error('Error creating account:', err)
      alert('Error al crear la cuenta: ' + (err instanceof Error ? err.message : String(err)))
    }
  }

  const renderForm = () => (
    <>
      <div className="flex-shrink-0 flex flex-col items-center pt-6 pb-3">
        <img src={logotipo} alt="UNIFIT" style={{ height: 44, objectFit: 'contain' }} />
        <p className="text-[15px] font-extrabold mt-2" style={{ color: '#fff' }}>Crear cuenta</p>
        <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Completa tu información para afiliarte a UNIFIT
        </p>
      </div>

      <div className="flex-shrink-0 px-5 pb-1">
        <div className="flex items-center justify-center gap-1.5 mb-2">
          <motion.div
            className="rounded-full"
            style={{ height: 6, width: 18, background: BLUE_GRAD }}
          />
        </div>
        <span className="text-sm font-bold text-center block mb-2" style={{ color: '#fff' }}>
          Información personal
        </span>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="h-full py-1"
        >
          <RegisterFormSections form={form} setForm={setForm} tipoUsuario={tipoUsuario} toggleTipoUsuario={toggleTipoUsuario} isMinor={isMinor} />
        </motion.div>
      </div>

      <div className="flex-shrink-0 px-5 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
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
            onClick={handleNext}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer justify-self-end"
            style={{ background: BLUE_GRAD }}
          >
            Finalizar
            <ArrowRight size={14} />
          </motion.button>
        </div>
      </div>
    </>
  )

  const phaseContent = (
    <AnimatePresence mode="wait">
      {phase === 'form' && (
        <motion.div
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col flex-1 min-h-0"
        >
          <motion.div
            animate={shake ? { x: [0, -6, 6, -6, 6, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="flex flex-col flex-1 min-h-0"
          >
            {renderForm()}
          </motion.div>
        </motion.div>
      )}
      {phase === 'success' && (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col flex-1 min-h-0 pt-6"
        >
          <RegisterSuccess onBack={onBack} />
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <AuthShell
      onBack={phase === 'form' ? onBack : undefined}
      bgVideoRef={bgVideoRef}
      showBackDesktopVideo={false}
      phoneGradient={phase === 'form' ? PHONE_GRADIENT_FORM : PHONE_GRADIENT_INTRO}
      overlays={(ctx) => (
        <>
          {!ctx.isPhonePreview && phase === 'intro' && (
            <AnimatePresence>
              <RegisterIntroOverlay src={introSrc} videoRef={introVideoRef} containerRef={introContainerRef} onSkip={skipIntro} />
            </AnimatePresence>
          )}
        </>
      )}
    >
      {(ctx) => (
        <>
          {ctx.isPhonePreview && phase === 'intro' && (
            <RegisterIntroOverlay src={introSrc} videoRef={introVideoRef} onSkip={skipIntro} />
          )}
          {phaseContent}
        </>
      )}
    </AuthShell>
  )
}