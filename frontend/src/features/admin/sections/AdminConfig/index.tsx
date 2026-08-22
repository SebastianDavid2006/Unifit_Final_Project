import { motion } from 'motion/react'
import CareersSection from './sections/CareersSection'
import FlatSection from './sections/FlatSection'
import DocsSection from './sections/DocsSection'
import { APARTADOS } from './components/apartados'

export default function AdminConfig({ tab }: { tab: string }) {
  return (
    <div className="p-8 pt-12 space-y-6 max-w-[1440px] mx-auto relative">
      {tab === 'carreras' && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: [0.16, 1, 0.3, 1] }}>
          <CareersSection />
        </motion.div>
      )}

      {tab === 'areas' && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: [0.16, 1, 0.3, 1] }}>
          <FlatSection apartado={APARTADOS.find(a => a.key === 'areas')!} />
        </motion.div>
      )}

      {tab === 'cargos' && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: [0.16, 1, 0.3, 1] }}>
          <FlatSection apartado={APARTADOS.find(a => a.key === 'cargos')!} />
        </motion.div>
      )}

      {tab === 'documentos' && <DocsSection />}
    </div>
  )
}
