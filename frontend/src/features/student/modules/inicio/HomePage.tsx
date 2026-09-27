import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Flame, Clock, Dumbbell, Check, Signal, Moon } from 'lucide-react'
import { useStudentApp } from '@/features/student/hooks/useStudentApp'
import {
  hoyKey,
  capitalizar,
  esMismoDia,
  inicioDeSemana,
  fechaISO,
  fechaISOdeString,
  doneDaysDesdeSesiones,
  letraDeDia,
  proximaSesionLabel,
} from '@/features/student/utils/fechas'
import { getSesionesDeRutina, type FrontendSesionRutina } from '@/services/rutina.service'
import { mensajeError } from '@/lib/api'
import { SectionTitle, GradientBorder, cardStyle, FIRE, AMBER, GREEN } from '@/features/student/components/ui/fitness'
import { LEVEL_COLOR } from '@/features/student/modules/rutinas/routineAssets'
import studentBoy from '@/assets/illustrations/characters/students/student_boy.webp'
import studentGirl from '@/assets/illustrations/characters/students/student_girl.webp'

const QUOTE = 'EL ÚNICO ENTRENAMIENTO MALO ES EL QUE NO HICISTE'

export function HomePage() {
  const { student, studentRoutines, loadingRoutines } = useStudentApp()
  const rutinaActiva = studentRoutines.find(r => r.estado === 'activa') ?? null
  const [sesiones, setSesiones] = useState<FrontendSesionRutina[]>([])
  const [sesionesError, setSesionesError] = useState<string | null>(null)

  /* Sesiones reales de la rutina activa (fuente de verdad: backend). */
  useEffect(() => {
    if (!rutinaActiva) {
      setSesiones([])
      return
    }
    let active = true
    setSesionesError(null)
    getSesionesDeRutina(rutinaActiva.id)
      .then(lista => {
        if (active) setSesiones(lista)
      })
      .catch(e => {
        if (active) setSesionesError(mensajeError(e))
      })
    return () => { active = false }
  }, [rutinaActiva?.id])

  const hoy = hoyKey()
  const rowsHoy = rutinaActiva
    ? rutinaActiva.rows.filter(r => r.dia && r.dia.toLowerCase() === hoy)
    : []
  const esDiaEntreno = rowsHoy.length > 0
  const sesionHoy = sesiones.find(s => esMismoDia(s.fecha, new Date()))
  const marcas = sesionHoy?.ejerciciosMarcados ?? []
  const doneCount = rowsHoy.filter(r => r.idRutinaEjercicio && marcas.includes(r.idRutinaEjercicio)).length
  const total = rowsHoy.length
  const pct = total ? Math.round((doneCount / total) * 100) : 0

  const estadoHoy = sesionHoy?.estado
  const estadoMsg = estadoHoy === 'finalizada'
    ? 'Sesión completada de hoy'
    : estadoHoy === 'en_progreso'
      ? 'Sesión en curso'
      : estadoHoy === 'cancelada'
        ? 'Sesión cancelada'
        : total > 0
          ? 'Aún no has comenzado la sesión de hoy'
          : null

  const inicioSem = inicioDeSemana()
  const finSem = new Date(inicioSem)
  finSem.setDate(finSem.getDate() + 7)
  const startISO = fechaISO(inicioSem)
  const endISO = fechaISO(finSem)
  const sesionesDeSemana = sesiones.filter(s => {
    const iso = fechaISOdeString(s.fecha)
    return iso >= startISO && iso < endISO
  })
  const doneWeek = rutinaActiva ? doneDaysDesdeSesiones(rutinaActiva, sesionesDeSemana) : []
  const diasPlan = rutinaActiva?.days ?? []
  const DONE = diasPlan.filter(d => doneWeek.includes(d)).length
  const D = diasPlan.length
  const semanaCompleta = D > 0 && DONE >= D
  const proxLabel = rutinaActiva ? proximaSesionLabel(rutinaActiva) : null
  const photo = student?.gender === 'M' ? studentBoy : studentGirl

  if (loadingRoutines) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-10 h-10 rounded-full"
          style={{ border: '2px solid rgba(255,255,255,0.1)', borderTopColor: FIRE }}
        />
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12.5 }}>Cargando…</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <GradientBorder radius={24}>
        <div className="relative overflow-hidden rounded-[23px]">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(90% 120% at 100% 0%, rgba(230,57,70,0.22), transparent 55%), radial-gradient(70% 100% at 0% 100%, rgba(245,166,35,0.12), transparent 60%)' }} />
          <div className="relative flex flex-col md:flex-row items-center gap-4 p-6 md:p-8">
            <div className="flex-1 min-w-0 order-2 md:order-1">
              <div className="flex items-center gap-2 mb-3">
                <Flame size={15} style={{ color: AMBER }} />
                <p className="uppercase tracking-[0.25em]" style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.45)' }}>
                  {capitalizar(hoy)} · {new Date().getDate()} de {new Date().toLocaleDateString('es-CO', { month: 'long' })}
                </p>
              </div>
              <h1 className="uppercase italic font-black text-white leading-[0.95]" style={{ fontSize: 'clamp(28px, 5vw, 44px)', letterSpacing: '-0.01em' }}>
                Hola, <span style={{ background: `linear-gradient(135deg, ${FIRE}, ${AMBER})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{student?.firstName}</span>
              </h1>
              <p className="uppercase italic font-black mt-2" style={{ fontSize: 'clamp(11px, 1.6vw, 14px)', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.38)' }}>
                "{QUOTE}"
              </p>
            </div>
            <motion.img
              src={photo}
              alt={student?.firstName}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="order-1 md:order-2 w-40 h-40 md:w-52 md:h-52 object-cover object-top rounded-3xl flex-shrink-0"
              style={{
                boxShadow: '0 24px 60px rgba(230,57,70,0.25)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            />
          </div>
        </div>
      </GradientBorder>

      {/* Entrenamiento de hoy (datos reales) */}
      <section>
        <SectionTitle>Entrenamiento de hoy</SectionTitle>
        <GradientBorder radius={22}>
          <div className="p-5 md:p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="min-w-0">
                <h3 className="uppercase italic font-black text-white" style={{ fontSize: 20, letterSpacing: '0.02em' }}>
                  {rutinaActiva?.name ?? 'Sin rutina activa'}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 3 }}>Rutina actual</p>
              </div>
            </div>

            {!rutinaActiva ? (
              <div className="mt-5 rounded-2xl p-5 text-center" style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-white font-black" style={{ fontSize: 15 }}>Aún no tienes una rutina activa</p>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, marginTop: 6, lineHeight: 1.6 }}>
                  Tu entrenador te asignará una rutina después de tu valoración física.
                </p>
              </div>
            ) : !esDiaEntreno ? (
              <div className="mt-5 rounded-2xl p-5 text-center" style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: FIRE + '14', border: `1px solid ${FIRE}30` }}>
                  <Moon size={22} style={{ color: AMBER }} />
                </div>
                <p className="text-white font-black" style={{ fontSize: 15 }}>Hoy es tu día de descanso, recupera energías.</p>
                {proxLabel && (
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, marginTop: 6, lineHeight: 1.6 }}>
                    Tu próxima sesión es el {proxLabel}.
                  </p>
                )}
              </div>
            ) : (
              <>
                {estadoMsg && (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5" style={{ background: estadoHoy === 'finalizada' ? `${GREEN}18` : 'rgba(255,255,255,0.05)', border: `1px solid ${estadoHoy === 'finalizada' ? GREEN + '40' : 'rgba(255,255,255,0.08)'}` }}>
                    {estadoHoy === 'finalizada' ? <Check size={13} style={{ color: GREEN }} strokeWidth={3.5} /> : null}
                    <span style={{ fontSize: 10.5, fontWeight: 800, color: estadoHoy === 'finalizada' ? GREEN : 'rgba(255,255,255,0.55)' }}>{estadoMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2 mt-4 mb-5">
                  {[
                    { icon: Clock, value: rutinaActiva?.duration ?? '—', label: 'Duración', color: AMBER },
                    { icon: Dumbbell, value: `${total}`, label: 'Ejercicios', color: '#fff' },
                    { icon: Signal, value: rutinaActiva?.level ?? '—', label: 'Nivel', color: LEVEL_COLOR[rutinaActiva?.level ?? ''] },
                  ].map((s, i) => (
                    <div key={i} className="rounded-2xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <s.icon size={16} style={{ color: s.color, margin: '0 auto 6px' }} />
                      <p className="text-white font-black" style={{ fontSize: 15 }}>{s.value}</p>
                      <p className="uppercase" style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.35)' }}>{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Progreso */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)' }}>Progreso de sesión</span>
                    <span style={{ fontSize: 11, fontWeight: 800, color: GREEN }}>{doneCount}/{total} · {pct}%</span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${GREEN}, #7CE495)` }}
                    />
                  </div>
                </div>
              </>
            )}

            {sesionesError && rutinaActiva && (
              <p style={{ color: 'rgba(255,107,129,0.7)', fontSize: 10.5, marginTop: 12 }}>
                No se pudo cargar el estado de tus sesiones. Intenta de nuevo más tarde.
              </p>
            )}
          </div>
        </GradientBorder>
      </section>

      {/* Esta semana (solo días planificados, fija y centrada) */}
      {rutinaActiva && (
        <section className="mx-auto w-full max-w-md">
          <div className="relative overflow-hidden rounded-3xl p-5" style={cardStyle}>
            <div className="flex justify-between items-baseline mb-3">
              <p className="uppercase tracking-widest" style={{ fontSize: 9.5, fontWeight: 700, color: 'rgba(255,255,255,0.35)' }}>Esta semana</p>
              <p style={{ fontSize: 12, fontWeight: 800, color: GREEN }}>{DONE}/{D} sesiones</p>
            </div>
            <div className="flex justify-between">
              {diasPlan.map((dia, i) => {
                const done = doneWeek.includes(dia)
                return (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <div
                      className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center font-black"
                      style={{
                        background: done ? `linear-gradient(135deg, ${GREEN}, #7CE495)` : 'rgba(255,255,255,0.05)',
                        color: done ? '#04110a' : 'rgba(255,255,255,0.3)',
                        border: done ? 'none' : '1px solid rgba(255,255,255,0.07)',
                        fontSize: 12,
                        boxShadow: done ? '0 6px 18px rgba(48,209,88,0.3)' : 'none',
                      }}
                    >
                      {done ? <Check size={16} strokeWidth={3.5} /> : letraDeDia(dia)}
                    </div>
                  </div>
                )
              })}
            </div>

            {semanaCompleta && (
              <div
                className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl"
                style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
              >
                <p className="text-white font-black italic text-center px-8" style={{ fontSize: 14, lineHeight: 1.5, wordSpacing: '0.1em'}}>
                  ¡Ya has completado la rutina de esta semana!
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}