import { motion } from 'motion/react'
import { ScalesOfJusticeView } from '@/assets/models/ui/objects/scales_of_justice/ScalesOfJusticeModel'
import { StethoscopeView } from '@/assets/models/ui/objects/stethoscope/StethoscopeModel'
import { KitView } from '@/assets/models/ui/objects/kit/KitModel'
import { DocumentCard } from './DocumentCard'

interface DocumentItem {
  name: string
  date: string
  signed: boolean
  originalName?: string
}

interface SectionData {
  title: string
  desc: string
  docs: DocumentItem[]
}

interface DocumentSectionProps {
  section: SectionData
  si: number
  openMenuDoc: string | null
  setOpenMenuDoc: (v: string | null) => void
  setFileModalData: (v: { name: string; date: string } | null) => void
  setFileModalOpen: (v: boolean) => void
}

export function DocumentSection({
  section,
  si,
  openMenuDoc,
  setOpenMenuDoc,
  setFileModalData,
  setFileModalOpen,
}: DocumentSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: si * 0.1 }}
      className="rounded-2xl p-5 flex flex-col"
      style={{
        background: 'rgba(255,255,255,0.6)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.7)',
        borderRadius: 20,
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
      }}
    >
      <div className="flex items-start gap-3 mb-5">
        <div className="w-14 h-14 flex-shrink-0">
          {si === 0 ? <ScalesOfJusticeView /> : si === 1 ? <StethoscopeView /> : <KitView />}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[#0D1B2A] text-lg font-bold">{section.title}</h3>
          <p className="text-sm mt-0.5" style={{ color: '#0D1B2A' }}>{section.desc}</p>
        </div>
      </div>
      <div className="flex-1 space-y-4">
        {section.docs.map((doc, di) => (
          <DocumentCard
            key={di}
            doc={doc}
            si={si}
            di={di}
            openMenuDoc={openMenuDoc}
            setOpenMenuDoc={setOpenMenuDoc}
            setFileModalData={setFileModalData}
            setFileModalOpen={setFileModalOpen}
          />
        ))}
      </div>
    </motion.div>
  )
}
