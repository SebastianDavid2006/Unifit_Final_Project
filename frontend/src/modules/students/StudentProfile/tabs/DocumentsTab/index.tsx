import { motion } from 'motion/react'
import { DocumentSection } from './components/DocumentSection'

interface Props {
  openMenuDoc: string | null
  setOpenMenuDoc: (v: string | null) => void
  setFileModalData: (v: { name: string; date: string } | null) => void
  setFileModalOpen: (v: boolean) => void
}

const SECTIONS = [
  {
    title: 'Documentos Legales',
    desc: 'Contratos y consentimientos firmados',
    docs: [
      { name: 'Contrato Firmado', date: '15 Ene 2026', signed: true, originalName: 'contrato_firmado_v2.pdf' },
      { name: 'Aceptación de Tratamiento de Datos', date: '15 Ene 2026', signed: true, originalName: 'aceptacion_datos_2026.pdf' },
    ],
  },
  {
    title: 'Informes Médicos',
    desc: 'Certificados y expedientes médicos',
    docs: [
      { name: 'Certificado EPS', date: '20 Ene 2026', signed: true, originalName: 'certificado_eps_2026.pdf' },
      { name: 'Historia Clínica', date: '22 Ene 2026', signed: true, originalName: 'historia_clinica.pdf' },
    ],
  },
  {
    title: 'Lesiones y Seguimiento',
    desc: 'Reportes de lesiones y recuperación',
    docs: [
      { name: 'Reporte de Lesión - Tobillo', date: '12 Feb 2026', signed: true, originalName: 'reporte_tobillo.pdf' },
      { name: 'Seguimiento de Recuperación', date: '28 Feb 2026', signed: true, originalName: 'seguimiento_recuperacion.pdf' },
    ],
  },
]

export function DocumentsTab({
  openMenuDoc,
  setOpenMenuDoc,
  setFileModalData,
  setFileModalOpen,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-[1200px] mx-auto grid grid-cols-3 gap-6 items-start"
    >
      {SECTIONS.map((section, si) => (
        <DocumentSection
          key={section.title}
          section={section}
          si={si}
          openMenuDoc={openMenuDoc}
          setOpenMenuDoc={setOpenMenuDoc}
          setFileModalData={setFileModalData}
          setFileModalOpen={setFileModalOpen}
        />
      ))}
    </motion.div>
  )
}
