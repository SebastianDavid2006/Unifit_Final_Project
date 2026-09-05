import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { INITIAL_FORM, BLUE_GRAD } from '@/data/config/registration'
import type { TipoUsuario } from '@/data/config/registration'
import { useProgramasAgrupados } from '@/hooks/useCatalogo'
import type { Universidad, NivelPrograma } from '@/types/catalogo'
import { api, mensajeError } from '@/lib/api'
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
  const [error, setError] = useState('')
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
      if (!document.fullscreenElement) {
        const req = el.requestFullscreen?.()
        if (req?.catch) req.catch(() => {})
      }
    }

    return () => {
      clearTimeout(t)
      if (document.fullscreenElement) {
        const exit = document.exitFullscreen?.()
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

  const catalogo = useProgramasAgrupados()

  const toggleTipoUsuario = (tipo: TipoUsuario) => {
    setTipoUsuario(prev => (prev === tipo ? null : tipo))
    const inst: Universidad = 'uni_colombia'
    const level: NivelPrograma = 'tecnico'
    const prog = catalogo.nombres(inst, level)[0] ?? ''
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

  const buildPayload = () => {
    const MAP_TIPO_DOC: Record<string, string> = { CC: 'CC', TI: 'TI', CE: 'CE', Pasaporte: 'PA', RC: 'RC' }
    const MAP_GENERO: Record<string, string> = { Masculino: 'masculino', Femenino: 'femenino', Otro: 'otro' }
    const MAP_GRUPO: Record<string, string> = {
      'A+': 'a_positivo', 'A-': 'a_negativo', 'B+': 'b_positivo', 'B-': 'b_negativo',
      'AB+': 'ab_positivo', 'AB-': 'ab_negativo', 'O+': 'o_positivo', 'O-': 'o_negativo',
    }
    const MAP_PARENTESCO: Record<string, string> = {
      Padre: 'padre', Madre: 'madre', 'Hermano(a)': 'hermano_a', 'Abuelo(a)': 'abuelo_a',
      'Tío(a)': 'tio_a', 'Primo(a)': 'primo_a', Otro: 'otro',
    }
    const MAP_MODALIDAD: Record<string, string> = { Presencial: 'presencial', Virtual: 'virtual' }
    const MAP_JORNADA: Record<string, string> = { 'Mañana': 'diurna', Noche: 'nocturna', 'Fin de semana': 'finde' }
    const MAP_ROL: Record<string, string> = { estudiante: 'estudiante', profesor: 'profesor', administrador: 'administrativo' }

    const payload: Record<string, unknown> = {
      primer_nombre: form.primerNombre?.trim(),
      segundo_nombre: form.segundoNombre?.trim() || undefined,
      primer_apellido: form.primerApellido?.trim(),
      segundo_apellido: form.segundoApellido?.trim() || undefined,
      email_contacto: form.email?.trim(),
      telefono_contacto: form.telefono?.trim() || undefined,
      documento: form.numDoc?.trim(),
      tipo_documento: MAP_TIPO_DOC[form.tipoDoc] ?? 'CC',
      fecha_nacimiento: form.fechaNac || undefined,
      genero: MAP_GENERO[form.genero] ?? 'otro',
      genero_otro: form.genero === 'Otro' ? form.generoOtro?.trim() : undefined,
      eps: form.eps?.trim() || undefined,
      grupo_sanguineo: MAP_GRUPO[form.grupoSanguineo] ?? undefined,
      nombre_emergencia: form.nombreContacto?.trim() || undefined,
      telefono_emergencia: form.telefonoContacto?.trim() || undefined,
      parentesco_emergencia: form.parentesco ? MAP_PARENTESCO[form.parentesco] : undefined,
      parentesco_otro: form.parentesco === 'Otro' ? form.otroParentesco?.trim() : undefined,
      tipo_usuario: MAP_ROL[tipoUsuario!] ?? 'estudiante',
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
    try {
      await api.post('/auth/registro', buildPayload())
      setPhase('success')
    } catch (err) {
      setError(mensajeError(err))
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
          <RegisterFormSections form={form} setForm={setForm} tipoUsuario={tipoUsuario} toggleTipoUsuario={toggleTipoUsuario} isMinor={isMinor} />
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