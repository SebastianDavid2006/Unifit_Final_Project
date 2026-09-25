import { motion } from 'motion/react'
import { Activity, Zap, Target, Ruler, Stethoscope, ShieldAlert, User, Flag, CalendarClock } from 'lucide-react'
import { FIRE, AMBER, GREEN, BLUE, cardStyle } from './fitness'

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

const MUTED = 'rgba(255,255,255,0.4)'
const PLACEHOLDER = 'No registrado'

const SectionLabel = ({ icon: Icon, text }: { icon: any; text: string }) => (
  <div className="flex items-center gap-2 mb-2">
    <Icon size={14} style={{ color: 'rgba(255,255,255,0.35)' }} />
    <p className="uppercase tracking-wider" style={{ fontSize: 12.5, fontWeight: 800, color: MUTED }}>{text}</p>
  </div>
)

const Badge = ({ children, color, textColor }: { children: React.ReactNode; color: string; textColor?: string }) => (
  <span className="px-3.5 py-1.5 rounded-full font-bold inline-block" style={{ background: color + '1c', border: `1px solid ${color}40`, color: textColor ?? color, fontSize: 11.5 }}>
    {children}
  </span>
)

const MetricCard = ({ label, value, delay = 0 }: { label: string; value?: string; delay?: number }) => {
  const hasValue = !!value
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-xl p-2.5"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <p className="uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: 600 }}>{label}</p>
      <p className="font-black" style={{ color: hasValue ? '#FFFFFF' : MUTED, fontSize: 19, marginTop: 3 }}>{hasValue ? value : PLACEHOLDER}</p>
    </motion.div>
  )
}

const EmptyText = ({ children, size = 13 }: { children: React.ReactNode; size?: number }) => (
  <p style={{ color: MUTED, fontSize: size }}>{children}</p>
)

export function AssessmentDetail({ item }: { item: AssessmentItem }) {
  const medidas = [
    { label: 'Peso', value: item.metrics[0]?.value },
    { label: 'Estatura', value: item.estatura },
    { label: 'IMC', value: item.metrics[1]?.value },
    { label: 'Grasa corporal', value: item.metrics[2]?.value },
    { label: 'Masa muscular', value: item.metrics[3]?.value },
    { label: 'Masa magra', value: item.masaMagra },
    { label: 'Grasa visceral', value: item.grasaVisceral },
  ]

  const clinica = [
    { label: 'Presión arterial', value: item.presionArterial },
    { label: 'Edad metabólica', value: item.edadMetabolica },
    { label: 'Agua corporal', value: item.aguaCorporal },
    { label: 'Resistencia muscular', value: item.resistenciaMuscular },
  ]

  return (
    <div className="space-y-6">
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

      {/* Días de entrenamiento */}
      <div>
        <SectionLabel icon={CalendarClock} text="Días de entrenamiento" />
        {item.diasDisponibles && item.diasDisponibles.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {item.diasDisponibles.map(d => (
              <Badge key={d} color={BLUE} textColor="#7CC7FF">{d}</Badge>
            ))}
          </div>
        ) : (
          <EmptyText size={12}>{PLACEHOLDER}</EmptyText>
        )}
      </div>

      {/* Nivel de actividad física */}
      <div className="rounded-2xl p-4" style={{ background: GREEN + '07', border: `1px solid ${GREEN}20` }}>
        <SectionLabel icon={Zap} text="Nivel de actividad física" />
        {item.nivelActividad ? (
          <Badge color={GREEN}>{item.nivelActividad}</Badge>
        ) : (
          <EmptyText size={12}>{PLACEHOLDER}</EmptyText>
        )}
      </div>

      {/* Objetivo del usuario + Detalle del objetivo (un mismo card ámbar estilo textarea del formulario) */}
      <div className="rounded-2xl p-4" style={{ background: AMBER + '06', border: `1px solid ${AMBER}1e` }}>
        <SectionLabel icon={Target} text="Objetivo del usuario" />
        {item.objetivoTarjetas.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {item.objetivoTarjetas.map(o => (
              <Badge key={o} color={AMBER}>{o}</Badge>
            ))}
          </div>
        ) : (
          <EmptyText size={12}>{PLACEHOLDER}</EmptyText>
        )}
        {item.objetivoDetalle && (
          <>
            <p className="uppercase tracking-wider" style={{ color: MUTED, fontSize: 11, fontWeight: 800, marginTop: 14, marginBottom: 6 }}>Detalle del objetivo</p>
            <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 13, lineHeight: 1.65 }}>
              {item.objetivoDetalle}
            </p>
          </>
        )}
      </div>

      {/* Medidas corporales (todas las tarjetas, valor o placeholder) */}
      <div>
        <SectionLabel icon={Ruler} text="Medidas corporales" />
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5">
          {medidas.map((m, i) => (
            <MetricCard key={m.label} label={m.label} value={m.value} delay={i * 0.03} />
          ))}
        </div>
      </div>

      {/* Evaluación clínica (todas las tarjetas, valor o placeholder) */}
      <div>
        <SectionLabel icon={Stethoscope} text="Evaluación clínica" />
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5">
          {clinica.map((m, i) => (
            <MetricCard key={m.label} label={m.label} value={m.value} delay={i * 0.03} />
          ))}
        </div>
      </div>

      {/* Antecedentes de salud (solo opciones seleccionadas) */}
      <div className="rounded-2xl p-4" style={{ background: FIRE + '05', border: `1px solid ${FIRE}1c` }}>
        <SectionLabel icon={ShieldAlert} text="Antecedentes de salud" />
        {item.antecedentesSalud.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {item.antecedentesSalud.map((a, i) => (
              <Badge key={i} color={FIRE}>{a}</Badge>
            ))}
          </div>
        ) : (
          <EmptyText size={12}>{PLACEHOLDER}</EmptyText>
        )}
      </div>

      {/* Observaciones del entrenador (opcional: se oculta si viene sin contenido) */}
      {item.observacionesEntrenador && (
        <div className="rounded-2xl p-4" style={cardStyle}>
          <SectionLabel icon={User} text="Observaciones del entrenador" />
          <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 13, lineHeight: 1.65 }}>
            {item.observacionesEntrenador}
          </p>
        </div>
      )}

      {/* Observaciones finales (opcional: se oculta si viene sin contenido) */}
      {item.observacionesFinales && (
        <div className="rounded-2xl p-4" style={{ background: GREEN + '06', border: `1px solid ${GREEN}20` }}>
          <SectionLabel icon={Flag} text="Observaciones finales" />
          <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 13, lineHeight: 1.65 }}>
            {item.observacionesFinales}
          </p>
        </div>
      )}
    </div>
  )
}