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
  if (step === 2) {
    return (
      <div className="space-y-5">
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
          <img src={dataProcessingBanner} alt="Autorización para el tratamiento de datos personales" className="w-full h-auto object-cover" />
        </div>
        <label className="flex items-start gap-3 cursor-pointer group">
          <div
            onClick={() => setAceptaDatos(!aceptaDatos)}
            className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 cursor-pointer"
            style={{
              background: aceptaDatos ? BLUE_GRAD : 'transparent',
              border: `1.5px solid ${aceptaDatos ? BLUE : 'rgba(0,0,0,0.06)'}`,
            }}
          >
            {aceptaDatos && (
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
              color: aceptaDatos ? 'transparent' : 'rgba(0,0,0,0.55)',
              background: aceptaDatos ? BLUE_GRAD : 'none',
              backgroundClip: aceptaDatos ? 'text' : 'none',
              WebkitBackgroundClip: aceptaDatos ? 'text' : 'none',
            }}
          >
            Autorizo el tratamiento de mis datos personales de acuerdo con la política de privacidad de UniFit.
          </span>
        </label>
      </div>
    )
  }

  if (step === 3) {
    return (
      <div className="space-y-5">
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
          <img src={contractIUDCBanner} alt="Contrato de prestación de servicios estudiantiles" className="w-full h-auto object-cover" />
        </div>
        <label className="flex items-start gap-3 cursor-pointer group">
          <div
            onClick={() => setAceptaContrato(!aceptaContrato)}
            className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 cursor-pointer"
            style={{
              background: aceptaContrato ? BLUE_GRAD : 'transparent',
              border: `1.5px solid ${aceptaContrato ? BLUE : 'rgba(0,0,0,0.06)'}`,
            }}
          >
            {aceptaContrato && (
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
              color: aceptaContrato ? 'transparent' : 'rgba(0,0,0,0.55)',
              background: aceptaContrato ? BLUE_GRAD : 'none',
              backgroundClip: aceptaContrato ? 'text' : 'none',
              WebkitBackgroundClip: aceptaContrato ? 'text' : 'none',
            }}
          >
            Acepto los términos y condiciones del contrato de prestación de servicios estudiantiles de UniFit.
          </span>
        </label>
      </div>
    )
  }

  // Step 4: PAR-Q
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
      <label className="flex items-start gap-3 cursor-pointer group">
        <div
          onClick={() => setAceptaParq(!aceptaParq)}
          className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 cursor-pointer"
          style={{
            background: aceptaParq ? BLUE_GRAD : 'transparent',
            border: `1.5px solid ${aceptaParq ? BLUE : 'rgba(0,0,0,0.06)'}`,
          }}
        >
          {aceptaParq && (
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
            color: aceptaParq ? 'transparent' : 'rgba(0,0,0,0.55)',
            background: aceptaParq ? BLUE_GRAD : 'none',
            backgroundClip: aceptaParq ? 'text' : 'none',
            WebkitBackgroundClip: aceptaParq ? 'text' : 'none',
          }}
        >
          He completado el cuestionario PAR-Q y acepto continuar con mi registro.
        </span>
      </label>
    </div>
  )
}
