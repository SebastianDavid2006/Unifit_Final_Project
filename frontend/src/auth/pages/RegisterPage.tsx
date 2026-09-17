import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { INITIAL_FORM, BLUE_GRAD } from '@/data/config/registration'
import type { TipoUsuario } from '@/data/config/registration'
import {
  MAP_GENERO, MAP_GRUPO, MAP_PARENTESCO, MAP_JORNADA, MAP_MODALIDAD,
} from '@/data/config/catalogosRegistro'
import { useProgramasAgrupados } from '@/hooks/useCatalogo'
import type { Universidad, NivelPrograma } from '@/types/catalogo'
import { api, mensajeError, mapearErroresBackend } from '@/lib/api'
import { AuthShell } from '@/auth/components/AuthShell'
import { RegisterFormSections } from '@/auth/components/RegisterFormSections'
import { RegisterSuccess } from '@/auth/components/RegisterSuccess'
import { RegisterIntroOverlay } from '@/auth/components/RegisterIntroOverlay'
import { useAuthLayout } from '@/auth/hooks/useAuthLayout'
import { isMinor as isMinorUtil } from '@/lib/dateUtils'
import logotipo from '@/assets/logo/logo.webp'
import welcomeDesktop from '@/assets/scenes/videos/welcome_desktop.mp4'
import welcomeMobile from '@/assets/scenes/videos/welcome_mobile.mp4'
import welcomeDesktopPoster from '@/assets/scenes/videos/posters/welcome_desktop_poster.webp'
import welcomeMobilePoster from '@/assets/scenes/videos/posters/welcome_mobile_poster.webp'

const PHONE_GRADIENT_FORM = 'linear-gradient(180deg, rgba(8,12,28,0.9) 0%, rgba(8,12,28,0.84) 50%, rgba(8,12,28,0.88) 100%)'
const PHONE_GRADIENT_INTRO = 'linear-gradient(180deg, rgba(8,12,28,0.65) 0%, rgba(8,12,28,0.45) 50%, rgba(8,12,28,0.6) 100%)'

interface RegisterPageProps {
  onBack: () => void
}

type Phase = 'intro' | 'form' | 'success'

export function RegisterPage({ onBack }: RegisterPageProps) {
  const { isPhonePreview, isDesktopVideo } = useAuthLayout()
  const [phase, setPhase] = useState<Phase>('intro')
  const [form, setForm] = useState<Record<string, string>>({ ...INITIAL_FORM, parentesco: 'Padre' })
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario | null>(null)
  const [shake, setShake] = useState(false)
  const [error, setError] = useState('')
  const [erroresCampo, setErroresCampo] = useState<Record<string, string[]>>({})
  const introVideoRef = useRef<HTMLVideoElement>(null)
  const introContainerRef = useRef<HTMLDivElement>(null)
  const bgVideoRef = useRef<HTMLVideoElement>(null)

  const introSrc = isPhonePreview ? welcomeMobile : welcomeDesktop
  const introPoster = isPhonePreview ? welcomeMobilePoster : welcomeDesktopPoster

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

    return () => clearTimeout(t)
  }, [phase, introSrc])

  const skipIntro = () => {
    introVideoRef.current?.pause()
    const bg = bgVideoRef.current
    if (bg) bg.currentTime = 0
    setPhase('form')
  }

  const catalogo = useProgramasAgrupados()

  const toggleTipoUsuario = (tipo: TipoUsuario) => {
    setTipoUsuario(prev => (prev === tipo ? null : tipo))
    const inst: Universidad = 'uni_colombia'
    const level: NivelPrograma = 'tecnico'
    const prog = catalogo.nombres(inst, level)[0] ?? ''
    setForm(prev => ({
      ...prev,
      numCarnet: '',
      institucion: inst, nivelFormacion: level, programa: prog,
      semestre: '1', modalidad: 'Presencial', jornada: 'Mañana',
      cargo: '', area: '',
      acudientePrimerNombre: '', acudientePrimerApellido: '', acudienteDocumento: '',
      acudienteTipoDocumento: 'CC', acudienteTelefonoContacto: '',
      parentescoAcudiente: '', otroParentescoAcudiente: '',
    }))
  }

  const isMinor = useMemo(() => isMinorUtil(form.fechaNac), [form.fechaNac])

  const canGoNext = () => {
    const base = !!(tipoUsuario && form.primerNombre && form.primerApellido && form.numDoc && form.fechaNac)
    if (!base) return false
    if (tipoUsuario === 'estudiante' && !form.numCarnet) return false
    if (isMinor) {
      return !!form.acudientePrimerNombre &&
        !!form.acudientePrimerApellido &&
        !!form.acudienteDocumento &&
        !!form.acudienteTipoDocumento &&
        !!form.parentescoAcudiente &&
        (form.parentescoAcudiente !== 'Otro' || !!form.otroParentescoAcudiente)
    }
    return true
  }

  const buildPayload = () => {
    const payload: Record<string, unknown> = {
      primer_nombre: form.primerNombre?.trim(),
      segundo_nombre: form.segundoNombre?.trim() || undefined,
      primer_apellido: form.primerApellido?.trim(),
      segundo_apellido: form.segundoApellido?.trim() || undefined,
      email_contacto: form.email?.trim(),
      telefono_contacto: form.telefono?.trim() || undefined,
      documento: form.numDoc?.trim(),
      tipo_documento: form.tipoDoc || 'CC',
      fecha_nacimiento: form.fechaNac || undefined,
      genero: MAP_GENERO[form.genero] ?? 'otro',
      eps: form.eps?.trim() || undefined,
      grupo_sanguineo: MAP_GRUPO[form.grupoSanguineo] ?? undefined,
      nombre_emergencia: form.nombreContacto?.trim() || undefined,
      telefono_emergencia: form.telefonoContacto?.trim() || undefined,
      parentesco_emergencia: form.parentesco ? MAP_PARENTESCO[form.parentesco] : undefined,
      tipo_usuario: tipoUsuario!,
    }

    if (isMinor) {
      payload.acudiente_primer_nombre = form.acudientePrimerNombre?.trim()
      payload.acudiente_primer_apellido = form.acudientePrimerApellido?.trim()
      payload.acudiente_documento = form.acudienteDocumento?.trim()
      payload.acudiente_tipo_documento = form.acudienteTipoDocumento || 'CC'
      payload.acudiente_parentesco = form.parentescoAcudiente ? MAP_PARENTESCO[form.parentescoAcudiente] ?? form.parentescoAcudiente.toLowerCase().replace(/\s+/g, '_') : undefined
      payload.acudiente_telefono_contacto = form.acudienteTelefonoContacto?.trim()
    }

    if (tipoUsuario === 'estudiante') {
      payload.id_programa = catalogo.resolverId(
        (form.institucion as Universidad) || 'uni_colombia',
        (form.nivelFormacion as NivelPrograma) || 'tecnico',
        form.programa,
      )
      payload.numero_carnet = form.numCarnet?.trim() || undefined
      payload.semestre = form.semestre ? Number(form.semestre) : undefined
      payload.modalidad = MAP_MODALIDAD[form.modalidad]
      payload.jornada = MAP_JORNADA[form.jornada]
      payload.es_egresado = form.estado === 'Egresado'
    } else {
      payload.id_cargo = form.cargo || undefined
      payload.id_area = form.area || undefined
    }

    return payload
  }

  const handleNext = async () => {
    if (!canGoNext()) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }
    setError('')
    setErroresCampo({})
    try {
      await api.post('/auth/registro', buildPayload())
      setPhase('success')
    } catch (err) {
      setError(mensajeError(err))
      setErroresCampo(mapearErroresBackend(err))
      setShake(true)
      setTimeout(() => setShake(false), 500)
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
          <RegisterFormSections form={form} setForm={setForm} tipoUsuario={tipoUsuario} toggleTipoUsuario={toggleTipoUsuario} isMinor={isMinor} erroresCampo={erroresCampo} />
          {error && (
            <div className="mx-5 mb-3 px-4 py-2.5 rounded-xl text-[11px] font-semibold" style={{ background: 'rgba(244,56,67,0.12)', border: '1px solid rgba(244,56,67,0.35)', color: '#FF8A90' }}>
              {error}
            </div>
          )}
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
      videosPaused={phase !== 'intro'}
      phoneGradient={phase === 'form' ? PHONE_GRADIENT_FORM : PHONE_GRADIENT_INTRO}
      overlays={(ctx) => (
        <>
          {!ctx.isPhonePreview && phase === 'intro' && (
            <AnimatePresence>
              <RegisterIntroOverlay src={introSrc} poster={introPoster} videoRef={introVideoRef} containerRef={introContainerRef} onSkip={skipIntro} />
            </AnimatePresence>
          )}
        </>
      )}
    >
      {(ctx) => (
        <>
          {ctx.isPhonePreview && phase === 'intro' && (
            <RegisterIntroOverlay src={introSrc} poster={introPoster} videoRef={introVideoRef} onSkip={skipIntro} />
          )}
          {phaseContent}
        </>
      )}
    </AuthShell>
  )
}