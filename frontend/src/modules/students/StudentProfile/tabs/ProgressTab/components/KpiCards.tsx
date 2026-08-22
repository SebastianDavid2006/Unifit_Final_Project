import { motion } from 'motion/react'
import { CheckCircle, Clock, XCircle } from 'lucide-react'
import { ClockView } from '@/assets/models/ui/objects/clock/ClockModel'
import { ListView } from '@/assets/models/ui/objects/list/ListModel'
import { CalendarView } from '@/assets/models/ui/objects/calendar/CalendarModel'
import fireGif from '@/assets/icons/animated/fire.gif'
import { cardStyle, historialAsistencia } from '@/modules/students/StudentProfileData'
import { useIsMobile } from '@/shared/components/ui/use-mobile'

const RED_GRAD = 'linear-gradient(135deg, #FF6B6B, #E63946)'

function computeStreak(): number {
  const ordenDias: Record<string, number> = { Lunes: 1, Martes: 2, Miércoles: 3, Jueves: 4, Viernes: 5, Sábado: 6, Domingo: 7 }
  let racha = 0
  const copia = [...historialAsistencia].reverse()
  for (let i = 0; i < copia.length; i++) {
    racha++
    if (i < copia.length - 1) {
      const diaActual = ordenDias[copia[i].dia] || 0
      const diaAnterior = ordenDias[copia[i + 1].dia] || 0
      if (diaActual === 1 && diaAnterior === 5) continue
      if (diaActual - diaAnterior !== 1) break
    }
  }
  return racha
}

function computeTotalTime(): string {
  const totalMinutos = historialAsistencia.reduce((acc, r) => {
    const [h, m] = r.duracion.replace('h', '').replace('min', '').split(/\s+/).map(s => parseInt(s) || 0)
    return acc + h * 60 + m
  }, 0)
  const horas = Math.floor(totalMinutos / 60)
  const mins = totalMinutos % 60
  return `${horas}h ${mins.toString().padStart(2, '0')}min`
}

const items = [
  { label: 'Racha actual', value: `${computeStreak()} días`, model: 'fire' },
  { label: 'Tiempo total entrenado', value: computeTotalTime(), model: 'clock' },
  { label: 'Asistencias totales', value: `${42}`, model: 'list' },
  { label: 'Asistencias este mes', value: `${historialAsistencia.length}/20`, model: 'calendar' },
]

function getIcon(model: string) {
  const common = { width: 52, height: 52, objectFit: 'contain' as const }
  if (model === 'fire') return <img src={fireGif} alt="fire" style={common} />
  if (model === 'clock') return <div style={common}><ClockView /></div>
  if (model === 'list') return <div style={common}><ListView /></div>
  return <div style={common}><CalendarView /></div>
}

export function KpiCards() {
  const isMobile = useIsMobile()
  return (
    <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
      {items.map((m, idx) => {
        const esFuego = m.model === 'fire'
        return (
          <motion.div
            key={m.label}
            whileHover={{ scale: 1.03 }}
            transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
            className="relative rounded-2xl flex flex-col items-center text-center group cursor-pointer"
            style={{ ...cardStyle, padding: isMobile ? '1rem' : '1.5rem' }}
          >
            <div
              className="transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.5] mb-5 flex items-center justify-center"
              style={{ transformOrigin: 'bottom center' }}
            >
              {getIcon(m.model)}
            </div>
            <p className={esFuego ? '' : 'text-gradient-warm'} style={{
              fontSize: isMobile ? '1.4rem' : '1.8rem', fontWeight: 700, lineHeight: 1,
              ...(esFuego
                ? {
                    background: 'linear-gradient(135deg, #FF6B00, #FF2D00, #FF9500)',
                    backgroundSize: '200% auto',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: 'shimmer 5s linear infinite',
                  }
                : {}),
            }}>{m.value}</p>
            <p className={isMobile ? 'text-xs' : 'text-sm'} style={{
              color: esFuego ? '#FF6B00' : 'rgba(0,0,0,0.5)',
              marginTop: isMobile ? '0.5rem' : '0.75rem',
            }}>{m.label}</p>
          </motion.div>
        )
      })}
    </div>
  )
}
