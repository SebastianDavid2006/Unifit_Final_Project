import { motion } from 'motion/react'
import { FileText, BookOpen, HelpCircle, ExternalLink } from 'lucide-react'

const YELLOW = '#F5A623'

const docs = [
  { icon: BookOpen, title: 'Guía de inicio rápido', desc: 'Aprende los fundamentos del sistema en 5 minutos', color: '#007AFF' },
  { icon: FileText, title: 'Manual de usuario', desc: 'Documentación completa para administradores', color: '#30D158' },
  { icon: HelpCircle, title: 'Preguntas frecuentes', desc: 'Respuestas a las dudas más comunes', color: '#FF9500' },
]

export default function AdminDocs() {
  return (
    <div className="p-8 pt-12 space-y-6 max-w-[1440px] mx-auto relative">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${YELLOW}10`, border: `1px solid ${YELLOW}15` }}>
          <FileText size={22} style={{ color: YELLOW }} />
        </div>
        <div>
          <h1 style={{ color: '#1A1A1E', fontSize: '2rem', fontWeight: 800 }}>Documentación</h1>
          <p className="text-xs" style={{ color: 'rgba(0,0,0,0.35)' }}>Recursos y guías del sistema</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {docs.map((doc, i) => (
          <motion.div
            key={doc.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl p-6 cursor-pointer"
            style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${doc.color}10`, border: `1px solid ${doc.color}15` }}>
              <doc.icon size={18} style={{ color: doc.color }} />
            </div>
            <h4 className="text-sm font-bold" style={{ color: '#1D1D1F' }}>{doc.title}</h4>
            <p className="text-[11px] mt-1.5 mb-4" style={{ color: 'rgba(0,0,0,0.3)' }}>{doc.desc}</p>
            <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: doc.color }}>
              <span>Abrir</span>
              <ExternalLink size={12} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
