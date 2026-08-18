import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Fingerprint, LockKeyhole, PenLine, X } from 'lucide-react'
import type SignatureCanvas from 'react-signature-canvas'
import type { Student } from '../StudentProfileData'
import { SignaturePad } from './SignaturePad'
import { FingerprintCapture } from './FingerprintCapture'

interface Props {
  student: Student
  onUpdate: (patch: Partial<Student>) => void
}

const BLUE = '#1270B7'
const GREEN = '#22C55E'
const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #7ec8e3)'
const GREEN_BLUE_GRAD = 'linear-gradient(135deg, #22C55E, #1270B7)'

type FingerprintStatus = 'idle' | 'scanning' | 'captured'

export function IdentityAccessCard({ student, onUpdate }: Props) {
  const [sigOpen, setSigOpen] = useState(false)
  const [fpOpen, setFpOpen] = useState(false)
  const [fpStatus, setFpStatus] = useState<FingerprintStatus>('idle')
  const sigRef = useRef<SignatureCanvas | null>(null)
  const fpTimer = useRef<number | null>(null)

  useEffect(() => () => {
    if (fpTimer.current) window.clearTimeout(fpTimer.current)
  }, [])

  const saveSignature = () => {
    const data = sigRef.current?.toDataURL()
    if (data) onUpdate({ firma: data })
    setSigOpen(false)
  }

  const startScan = () => {
    setFpStatus('scanning')
    if (fpTimer.current) window.clearTimeout(fpTimer.current)
    fpTimer.current = window.setTimeout(() => setFpStatus('captured'), 3000)
  }

  const finishFingerprint = () => {
    if (fpStatus === 'captured') onUpdate({ huella: 'capturada' })
    setFpOpen(false)
    setFpStatus('idle')
  }

  const closeFp = () => {
    setFpOpen(false)
    setFpStatus('idle')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="rounded-2xl p-5"
      style={{
        gridColumn: '1 / -1',
        background: 'linear-gradient(145deg, rgba(18,112,183,0.09) 0%, rgba(18,112,183,0.03) 55%, rgba(255,255,255,0.6) 100%)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.7) inset, 0 4px 16px rgba(18,112,183,0.06)',
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center" style={{ background: 'rgba(18,112,183,0.10)', color: BLUE }}>
          <LockKeyhole size={20} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 rounded-full flex-shrink-0" style={{ background: 'rgba(18,112,183,0.35)' }} />
            <p className="text-sm font-extrabold capitalize" style={{ color: '#0D1B2A' }}>Identidad y acceso</p>
          </div>
          <p className="text-[11px] mt-0.5" style={{ color: 'rgba(0,0,0,0.4)' }}>Edita la firma y la huella digital</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl p-3.5 flex flex-col" style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.05)' }}>
          <p className="text-[10px] font-bold uppercase tracking-wide mb-2" style={{ color: 'rgba(0,0,0,0.4)' }}>Firma</p>
          <div className="flex-1 flex items-center justify-center mb-2.5 min-h-[48px]">
            {student.firma ? (
              <img src={student.firma} alt="firma" className="max-h-12" style={{ maxWidth: '100%', objectFit: 'contain' }} />
            ) : (
              <svg viewBox="0 0 400 120" className="w-full h-auto" style={{ maxHeight: 56, opacity: 0.5 }}>
                <path d="M30,90 C40,50 60,30 80,40 C100,50 95,75 110,65 C125,55 130,35 150,30 C170,25 180,50 195,55 C210,60 220,40 240,35 C260,30 270,55 280,60 C290,65 300,45 320,50 C340,55 345,70 355,65 C365,60 370,50 380,55" fill="none" stroke="#0D1B2A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <button onClick={() => setSigOpen(true)} className="self-center inline-flex items-center gap-1.5 px-5 py-2 rounded-3xl text-xs font-bold text-white cursor-pointer" style={{ background: BLUE_GRAD, boxShadow: '0 4px 16px rgba(18,112,183,0.35)' }}>
            <PenLine size={13} /> {student.firma ? 'Editar firma' : 'Firmar ahora'}
          </button>
        </div>

        <div className="rounded-xl p-3.5 flex flex-col" style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.05)' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: 'rgba(0,0,0,0.4)' }}>Huella digital</p>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-md" style={{ background: student.huella ? 'rgba(34,197,94,0.12)' : 'rgba(0,0,0,0.05)', color: student.huella ? GREEN : 'rgba(0,0,0,0.35)' }}>
              {student.huella ? 'Capturada ✓' : 'Sin capturar'}
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center py-2 mb-2.5">
            <Fingerprint size={40} strokeWidth={1.5} style={{ color: student.huella ? GREEN : 'rgba(0,0,0,0.15)' }} />
          </div>
          <button onClick={() => { setFpStatus('idle'); setFpOpen(true) }} className="self-center inline-flex items-center gap-1.5 px-5 py-2 rounded-3xl text-xs font-bold text-white cursor-pointer" style={{ background: GREEN_BLUE_GRAD, boxShadow: '0 4px 16px rgba(18,112,183,0.35)' }}>
            <Fingerprint size={13} /> {student.huella ? 'Actualizar huella' : 'Capturar huella'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {sigOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[130] flex items-center justify-center p-6"
            style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)' }}
            onClick={() => setSigOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg rounded-3xl p-6"
              style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 24px 80px rgba(0,0,0,0.12)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold" style={{ color: '#0D1B2A' }}>{student.firma ? 'Editar firma' : 'Firma del estudiante'}</h3>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.4)' }}>Dibuja tu firma en el recuadro</p>
                </div>
                <button onClick={() => setSigOpen(false)} className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer" style={{ background: 'rgba(0,0,0,0.04)' }}>
                  <X size={16} style={{ color: 'rgba(0,0,0,0.4)' }} />
                </button>
              </div>
              <SignaturePad title="Firma" ref={sigRef} onClear={() => sigRef.current?.clear()} />
              <div className="flex justify-end gap-2.5 mt-5">
                <button onClick={() => setSigOpen(false)} className="px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer" style={{ background: 'rgba(0,0,0,0.04)', color: '#0D1B2A', border: '1px solid rgba(0,0,0,0.06)' }}>
                  Cancelar
                </button>
                <button onClick={saveSignature} className="px-5 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer" style={{ background: BLUE }}>
                  Guardar firma
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {fpOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[130] flex items-center justify-center p-6"
            style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)' }}
            onClick={() => { if (fpStatus !== 'scanning') closeFp() }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl p-6 overflow-hidden"
              style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 24px 80px rgba(0,0,0,0.12)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-base font-bold" style={{ color: '#0D1B2A' }}>Huella digital</h3>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.4)' }}>Captura la huella del estudiante</p>
                </div>
                <button onClick={closeFp} className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer" style={{ background: 'rgba(0,0,0,0.04)' }}>
                  <X size={16} style={{ color: 'rgba(0,0,0,0.4)' }} />
                </button>
              </div>
              <FingerprintCapture status={fpStatus} onStartScan={startScan} onCaptureComplete={finishFingerprint} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
