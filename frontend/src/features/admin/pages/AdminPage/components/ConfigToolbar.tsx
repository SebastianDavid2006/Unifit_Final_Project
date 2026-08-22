import { motion } from 'motion/react'
import { GraduationCap, Building2, Briefcase, FileText } from 'lucide-react'
import { PILL_GRAD } from '../data'

export default function ConfigToolbar({ tab, onTabChange }: {
  tab: string
  onTabChange: (t: string) => void
}) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex items-center gap-1 rounded-2xl px-2 py-1.5" style={{
        background: 'rgba(255,255,255,0.12)',
        backdropFilter: 'blur(24px) saturate(1.6)',
        border: '1px solid rgba(255,255,255,0.25)',
      }}>
        {([
          { id: 'carreras', label: 'Carreras', icon: GraduationCap },
          { id: 'areas', label: 'Áreas', icon: Building2 },
          { id: 'cargos', label: 'Cargos', icon: Briefcase },
          { id: 'documentos', label: 'Documentos', icon: FileText },
        ] as const).map(t => (
          <motion.button key={t.id} onClick={() => onTabChange(t.id)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all"
            style={{
              background: tab === t.id ? PILL_GRAD : 'transparent',
              color: tab === t.id ? '#FFFFFF' : 'rgba(0,0,0,0.3)',
            }}
          >
            <t.icon size={14} />
            {t.label}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
