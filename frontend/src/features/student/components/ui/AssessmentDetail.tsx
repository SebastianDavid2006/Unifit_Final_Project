import { motion } from 'motion/react'
import { Activity, Target, Zap, Dumbbell, ShieldAlert, User, Flag, CalendarClock } from 'lucide-react'
import { FIRE, AMBER, BLUE, GREEN, cardStyle } from './fitness'

const OBJETIVOS = ['Perdida de peso', 'Ganancia muscular', 'Acondicionamiento fisico', 'Salud', 'Rendimiento deportivo', 'Otro']

interface AssessmentItem {
  num: number
  date: string
  next?: string | null
  color: string
  type: string
  evaluator?: string
  evaluador?: string
  score: number
  metrics: { label: string; value: string }[]
  nivelActividad: string
  objetivoTarjetas: string[]
  objetivoDetalle: string
  estatura: string
  masaMagra: string
  grasaVisceral: string
  presionArterial: string
  edadMetabolica: string
  aguaCorporal: string
  resistenciaMuscular: string
  antecedentesSalud: string[]
  observacionesEntrenador: string
  diasDisponibles?: string[]
  observacionesFinales: string
}

const SectionLabel = ({ icon: Icon, text, color }: { icon: any; text: string; color: string }) => (
  <div className="flex items-center gap-2 mb-2.5">
    <Icon size={13} style={{ color }} />
    <p className="uppercase tracking-[0.18em]" style={{ fontSize: 9.5, fontWeight: 800, color }}>{text}</p>
  </div>
)

export function AssessmentDetail({ item }: { item: AssessmentItem }) {
  const medidas = [
    { label: 'Peso (kg)', value: item.metrics[0]?.value },
    { label: 'Estatura (cm)', value: item.estatura },
    { label: 'IMC', value: item.metrics[1]?.value },
    { label: 'Grasa corporal (%)', value: item.metrics[2]?.value },
    { label: 'Masa muscular (kg)', value: item.metrics[3]?.value },
    { label: 'Masa magra (kg)', value: item.masaMagra },
    { label: 'Grasa visceral (nivel)', value: item.grasaVisceral },
    { label: 'Presión arterial', value: item.presionArterial },
    { label: 'Edad metabólica', value: item.edadMetabolica },
    { label: 'Agua corporal (%)', value: item.aguaCorporal },
  ].filter(m => m.value)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: item.color + '18', border: `1px solid ${item.color}33` }}>
          <Activity size={22} style={{ color: item.color }} />
        </div>
        <div className="min-w-0">
          <p className="uppercase italic font-black text-white truncate" style={{ fontSize: 15 }}>Valoración {item.type.toLowerCase()}</p>
          <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 11.5 }}>
            {item.date}{item.next ? ` · Próxima: ${item.next}` : ''}
          </p>
        </div>
      </div>

      {/* Nivel de actividad física */}
      <div className="rounded-2xl p-4 flex items-center justify-between gap-3 flex-wrap" style={{ background: GREEN + '07', border: `1px solid ${GREEN}20` }}>
        <SectionLabel icon={Zap} text="Nivel de actividad física" color={GREEN} />
        <span className="px-3 py-1 rounded-full font-black uppercase tracking-wider" style={{ background: GREEN + '16', color: GREEN, fontSize: 11 }}>
          {item.nivelActividad}
        </span>
      </div>

      {/* Objetivo del usuario */}
      <div className="rounded-2xl p-4" style={{ background: AMBER + '06', border: `1px solid ${AMBER}1e` }}>
        <SectionLabel icon={Target} text="Objetivo del usuario" color={AMBER} />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mb-3">
          {OBJETIVOS.map(o => {
            const sel = item.objetivoTarjetas.includes(o)
            return (
              <div key={o} className="rounded-xl px-2.5 py-2 text-center font-bold transition-all" style={{ fontSize: 10.5, background: sel ? AMBER + '18' : 'rgba(255,255,255,0.03)', color: sel ? AMBER : 'rgba(255,255,255,0.28)', border: `1px solid ${sel ? AMBER + '45' : 'rgba(255,255,255,0.06)'}` }}>
                {o}
              </div>
            )
          })}
        </div>
        <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 13, lineHeight: 1.65 }}>{item.objetivoDetalle}</p>
      </div>

      {/* Medidas */}
      <div>
        <SectionLabel icon={Dumbbell} text="Medidas" color={BLUE} />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {medidas.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-white font-black truncate" style={{ fontSize: 13.5 }}>{m.value}</p>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 8.5, marginTop: 2 }}>{m.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Resistencia muscular */}
      <div className="rounded-2xl p-4 flex items-center justify-between gap-3 flex-wrap" style={{ background: BLUE + '07', border: `1px solid ${BLUE}22` }}>
        <SectionLabel icon={Activity} text="Resistencia muscular" color={BLUE} />
        <span className="px-3 py-1 rounded-full font-black uppercase tracking-wider" style={{ background: BLUE + '16', color: '#7CC7FF', fontSize: 11 }}>
          {item.resistenciaMuscular}
        </span>
      </div>

      {/* Antecedentes de salud */}
      <div className="rounded-2xl p-4" style={{ background: FIRE + '05', border: `1px solid ${FIRE}1c` }}>
        <SectionLabel icon={ShieldAlert} text="Antecedentes de salud" color={FIRE} />
        {item.antecedentesSalud.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {item.antecedentesSalud.map((a, i) => (
              <span key={i} className="px-2.5 py-1 rounded-full font-bold" style={{ background: FIRE + '14', color: FIRE, fontSize: 10.5 }}>{a}</span>
            ))}
          </div>
        ) : (
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Sin antecedentes registrados</p>
        )}
      </div>

      {/* Observaciones del entrenador */}
      <div className="rounded-2xl p-4" style={cardStyle}>
        <SectionLabel icon={User} text="Observaciones del entrenador" color={AMBER} />
        <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 13, lineHeight: 1.65 }}>{item.observacionesEntrenador}</p>
      </div>

      {/* Observaciones finales */}
      <div className="rounded-2xl p-4" style={{ background: GREEN + '06', border: `1px solid ${GREEN}20` }}>
        <SectionLabel icon={Flag} text="Observaciones finales" color={GREEN} />
        <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 13, lineHeight: 1.65 }}>{item.observacionesFinales}</p>
      </div>

      {/* Footer: días de entrenamiento */}
      {item.diasDisponibles && item.diasDisponibles.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap pt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <CalendarClock size={13} style={{ color: BLUE }} />
          <span style={{ color: 'rgba(255,255,255,0.42)', fontSize: 11.5 }}>
            Entrena: {item.diasDisponibles.join(', ')}
          </span>
        </div>
      )}
    </div>
  )
}
