import type { RefObject } from 'react'
import { motion } from 'motion/react'
import { User } from 'lucide-react'
import type SignatureCanvas from 'react-signature-canvas'
import { SignatureArea } from '../components/SignatureArea'

interface StepSignatureProps {
  isMinor: boolean
  sigPos: number
  form: any
  sigRef: RefObject<SignatureCanvas | null>
  guardianRef: RefObject<SignatureCanvas | null>
}

export function StepSignature({ isMinor, sigPos, form, sigRef, guardianRef }: StepSignatureProps) {
  if (!isMinor) {
    return <SignatureArea title="Firma del estudiante" sigRef={sigRef} />
  }

  return (
    <div className="space-y-6">
      {sigPos === 0 ? (
        <motion.div
          key="guardian"
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <div className="flex items-start gap-3 rounded-2xl px-4 py-3.5" style={{ background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.25)' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(245,166,35,0.15)' }}>
              <User size={15} style={{ color: '#D98E00' }} />
            </div>
            <div>
              <p className="text-xs font-bold" style={{ color: '#B37000' }}>Eres menor de edad</p>
              <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: 'rgba(0,0,0,0.5)' }}>
                Primero firma tu acudiente o responsable legal, y después firmarás tú.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl px-4 py-3" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.04)' }}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: 'rgba(0,0,0,0.4)' }}>Acudiente</p>
              <p className="text-xs font-bold mt-0.5" style={{ color: '#1A1A1E' }}>{form.nombreAcudiente || '—'}</p>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: 'rgba(245,166,35,0.12)', color: '#B37000' }}>
              {form.parentescoAcudiente === 'Otro' ? form.otroParentescoAcudiente : form.parentescoAcudiente || '—'}
            </span>
          </div>

          <SignatureArea title="Firma del acudiente (responsable legal)" sigRef={guardianRef} />
        </motion.div>
      ) : (
        <motion.div
          key="student"
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <SignatureArea title="Firma del estudiante" sigRef={sigRef} />
        </motion.div>
      )}
    </div>
  )
}
