import { motion } from 'motion/react'
import { Flame } from 'lucide-react'
import { assessmentItems } from '@/modules/students/StudentProfileData'
import { SectionTitle, cardStyle, AMBER } from '@/features/student/components/ui/fitness'

export function MetricsRow() {
  const latest = assessmentItems[0]

  return (
    <section>
      <SectionTitle>Métricas actuales</SectionTitle>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {[
          { v: latest.metrics[0].value, l: 'Peso' },
          { v: latest.estatura, l: 'Estatura' },
          { v: latest.metrics[1].value, l: 'IMC' },
          { v: latest.metrics[2].value, l: 'Grasa corporal' },
          { v: latest.metrics[3].value, l: 'Masa muscular' },
          { v: latest.presionArterial, l: 'Presión arterial' },
        ].map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-2xl p-4 text-center" style={cardStyle}>
            <p className="text-white font-black" style={{ fontSize: 17 }}>{m.v}</p>
            <p className="uppercase" style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.38)', marginTop: 4 }}>{m.l}</p>
          </motion.div>
        ))}
      </div>
      <div className="rounded-2xl p-4 mt-3 flex items-start gap-3" style={{ background: 'rgba(245,166,35,0.05)', border: '1px solid rgba(245,166,35,0.14)' }}>
        <Flame size={16} style={{ color: AMBER, marginTop: 2, flexShrink: 0 }} />
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12.5, lineHeight: 1.6 }}>
          Última valoración: <strong style={{ color: '#fff' }}>{latest.date}</strong> por {latest.evaluator} — Score {latest.score}/100
        </p>
      </div>
    </section>
  )
}
