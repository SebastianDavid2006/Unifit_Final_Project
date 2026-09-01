import { motion } from 'motion/react'
import { Check } from 'lucide-react'
import { BLUE, BLUE_GRAD } from '@/modules/students/NewStudentData'
import parqBanner from '@/assets/illustrations/banners/parq_banner.webp'
import dataProcessingBanner from '@/assets/illustrations/banners/data_proccesing_banner.webp'
import contractIUDCBanner from '@/assets/illustrations/banners/contractIUDC_banner.webp'
import type { StoredDocs } from '@/data/documents'

interface StepDocAgreementProps {
  step: number
  docs: StoredDocs
  aceptaDatos: boolean
  setAceptaDatos: (val: boolean) => void
  aceptaContrato: boolean
  setAceptaContrato: (val: boolean) => void
  aceptaParq: boolean
  setAceptaParq: (val: boolean) => void
}

function Checkbox({ checked, onToggle, label }: { checked: boolean; onToggle: () => void; label: string }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div
        onClick={onToggle}
        className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 cursor-pointer"
        style={{
          background: checked ? BLUE_GRAD : 'transparent',
          border: `1.5px solid ${checked ? BLUE : 'rgba(0,0,0,0.06)'}`,
        }}
      >
        {checked && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
            <Check size={12} color="white" strokeWidth={3} />
          </motion.span>
        )}
      </div>
      <span
        style={{
          fontSize: 12,
          fontWeight: 500,
          lineHeight: 1.6,
          color: checked ? 'transparent' : 'rgba(0,0,0,0.55)',
          background: checked ? BLUE_GRAD : 'none',
          backgroundClip: checked ? 'text' : 'none',
          WebkitBackgroundClip: checked ? 'text' : 'none',
        }}
      >
        {label}
      </span>
    </label>
  )
}

export function StepDocAgreement({
  step,
  docs,
  aceptaDatos,
  setAceptaDatos,
  aceptaContrato,
  setAceptaContrato,
  aceptaParq,
  setAceptaParq,
}: StepDocAgreementProps) {
  // Combined treatment + contrato step (step 2 passed from parent)
  if (step === 2) {
    return (
      <div className="space-y-5">
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
          <img src={dataProcessingBanner} alt="Autorización para el tratamiento de datos personales" className="w-full h-auto object-cover" />
        </div>
        <Checkbox
          checked={aceptaDatos}
          onToggle={() => setAceptaDatos(!aceptaDatos)}
          label="Doy fé de que el usuario ha leído y aceptado el Tratamiento de Datos Personales de UniFit."
        />
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
          <img src={contractIUDCBanner} alt="Contrato de prestación de servicios" className="w-full h-auto object-cover" />
        </div>
        <Checkbox
          checked={aceptaContrato}
          onToggle={() => setAceptaContrato(!aceptaContrato)}
          label="Doy fé de que el usuario ha leído y aceptado el Contrato de Prestación de Servicios de UniFit."
        />
      </div>
    )
  }

  // PAR-Q step (step 4 passed from parent)
  return (
    <div className="flex flex-col flex-1 min-h-0 gap-5">
      <div className="flex-1 min-h-0 overflow-y-auto">
        {docs.parq.dataUrl ? (
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
            <iframe src={docs.parq.dataUrl} title="PAR-Q" className="w-full h-[280px] bg-white" />
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
            <img src={parqBanner} alt="Cuestionario PAR-Q" className="w-full h-auto object-cover" />
          </div>
        )}
      </div>
      <Checkbox
        checked={aceptaParq}
        onToggle={() => setAceptaParq(!aceptaParq)}
        label="Doy fé de que el usuario ha completado el cuestionario PAR-Q satisfactoriamente."
      />
    </div>
  )
}
