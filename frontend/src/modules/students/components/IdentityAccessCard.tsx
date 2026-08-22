import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Fingerprint, RefreshCw, ScanLine, X } from 'lucide-react'
import type { Student } from '../StudentProfileData'
import lectorHuellaImg from '@/assets/illustrations/actions/fingerprint.webp'
import checkSuccessImg from '@/assets/illustrations/actions/feedback/success_check.webp'

interface Props {
  student: Student
  onUpdate: (patch: Partial<Student>) => void
  className?: string
}

const GREEN = '#22C55E'
const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #7ec8e3)'
const GREEN_BLUE_GRAD = 'linear-gradient(135deg, #22C55E, #1270B7)'

type FingerprintStatus = 'idle' | 'scanning' | 'captured'

export function IdentityAccessCard({ student, onUpdate, className = '' }: Props) {
  const [fpOpen, setFpOpen] = useState(false)
  const [fpStatus, setFpStatus] = useState<FingerprintStatus>('idle')
  const [fpSuccess, setFpSuccess] = useState(false)
  const fpTimer = useRef<number | null>(null)

  useEffect(() => () => {
    if (fpTimer.current) window.clearTimeout(fpTimer.current)
  }, [])

  const closeFingerprint = () => {
    setFpOpen(false)
    setFpStatus('idle')
    setFpSuccess(false)
  }

  const startScan = () => {
    setFpStatus('scanning')
    if (fpTimer.current) window.clearTimeout(fpTimer.current)
    fpTimer.current = window.setTimeout(() => setFpStatus('captured'), 5000)
  }

  const confirmFingerprint = () => {
    onUpdate({ huella: 'capturada' })
    setFpSuccess(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className={`rounded-[28px] p-5 ${className}`}
      style={{
        background: 'rgba(255,255,255,0.5)',
        height: '100%',
      }}
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: 'rgba(18,112,183,0.35)' }} />
        <p className="text-lg font-extrabold capitalize" style={{ color: '#0D1B2A' }}>Identidad y acceso</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
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
          <button onClick={() => { setFpStatus('idle'); setFpSuccess(false); setFpOpen(true) }} className="self-center inline-flex items-center gap-1.5 px-5 py-2 rounded-3xl text-xs font-bold text-white cursor-pointer" style={{ background: GREEN_BLUE_GRAD, boxShadow: '0 4px 16px rgba(18,112,183,0.35)' }}>
            <Fingerprint size={13} /> {student.huella ? 'Actualizar huella' : 'Capturar huella'}
          </button>
        </div>
      </div>

      {/* ── Modal Huella Digital ─────────── */}
      <AnimatePresence>
        {fpOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[115] flex items-center justify-center p-6"
            style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(6px)' }}
            onClick={() => { if (fpStatus !== 'scanning') closeFingerprint() }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              className="rounded-3xl w-full max-w-lg flex flex-col overflow-hidden min-h-[520px]"
              style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 25px 60px rgba(0,0,0,0.12)' }}
            >
              <div className="flex items-center justify-between px-6 pt-6 pb-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                <div>
                  <p className="text-lg font-bold" style={{ color: '#1A1A1E' }}>Huella digital</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.4)' }}>{student.name}</p>
                </div>
                <motion.button whileHover={{ scale: 1.1, background: 'rgba(244,56,67,0.1)', color: '#F43843' }} whileTap={{ scale: 0.9 }} onClick={() => closeFingerprint()} className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer" style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.45)' }}>
                  <X size={16} />
                </motion.button>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
                {fpSuccess ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col items-center gap-3">
                    <motion.img src={checkSuccessImg} alt="éxito" className="w-28 h-auto object-contain" animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />
                    <p className="text-lg font-bold" style={{ color: '#1A1A1E' }}>Huella registrada</p>
                    <p className="text-xs font-medium text-center max-w-[260px]" style={{ color: 'rgba(0,0,0,0.45)' }}>La huella digital de {student.name} ha sido capturada exitosamente.</p>
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => closeFingerprint()} className="mt-4 px-8 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer" style={{ background: GREEN_BLUE_GRAD }}>
                      Finalizar
                    </motion.button>
                  </motion.div>
                ) : (
                  <>
                    <div className="relative flex items-center justify-center">
                      <motion.div
                        className="absolute rounded-full pointer-events-none"
                        style={{ width: 280, height: 280, background: fpStatus === 'scanning' ? 'radial-gradient(circle, rgba(34,197,94,0.5) 0%, rgba(34,197,94,0.15) 40%, transparent 70%)' : 'radial-gradient(circle, rgba(18,112,183,0.5) 0%, rgba(18,112,183,0.12) 40%, transparent 70%)' }}
                        animate={fpStatus !== 'captured' ? { scale: [1, 1.15, 1], opacity: fpStatus === 'scanning' ? [0.3, 1, 0.3] : [0.5, 0.9, 0.5] } : { opacity: 0, scale: 1.5 }}
                        transition={{ duration: 3, repeat: fpStatus === 'captured' ? 0 : Infinity, ease: 'easeInOut' }}
                      />
                      {fpStatus === 'scanning' && (
                        <>
                          {[0, 1].map(i => (
                            <motion.div key={`ring-${i}`} className="absolute rounded-full pointer-events-none" style={{ width: 64, height: 64, border: '1.5px solid rgba(34,197,94,0.4)' }} animate={{ scale: [1, 5], opacity: [0.6, 0] }} transition={{ duration: 3, repeat: Infinity, delay: i * 1.5, ease: 'easeOut' }} />
                          ))}
                        </>
                      )}
                      <AnimatePresence mode="wait">
                        {fpStatus === 'captured' ? (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }} className="relative flex items-center justify-center">
                            <div className="absolute w-56 h-56 rounded-full" style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.25) 0%, transparent 70%)' }} />
                            {[...Array(12)].map((_, i) => {
                              const angle = (i / 12) * 360, rad = (angle * Math.PI) / 180, dist = 80 + (i % 3) * 20
                              return <motion.span key={i} className="absolute pointer-events-none text-lg select-none" style={{ color: '#22C55E' }} animate={{ x: [0, Math.cos(rad) * dist], y: [0, Math.sin(rad) * dist], opacity: [0, 1, 0], scale: [0, 1.2, 0] }} transition={{ duration: 2 + (i % 4) * 0.3, repeat: Infinity, delay: i * 0.1, ease: 'easeOut' }}>✦</motion.span>
                            })}
                            <div className="relative w-56 h-56 flex items-center justify-center"><motion.img src={checkSuccessImg} alt="check" className="w-28 h-auto object-contain relative z-10" animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} /></div>
                          </motion.div>
                        ) : (
                          <div className="relative flex items-center justify-center">
                            <div className="relative w-56 h-56">
                              <motion.img src={lectorHuellaImg} alt="lector huella" className="w-full h-full object-contain" animate={{ scale: [1, 1.02, 1], opacity: fpStatus === 'scanning' ? 0.3 : 0.4 }} transition={{ scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' }, opacity: { duration: 0.3 } }} />
                              {fpStatus === 'scanning' && (
                                <motion.div className="absolute inset-0 pointer-events-none z-10 overflow-hidden" style={{ filter: 'brightness(1.3) drop-shadow(0 0 15px rgba(34,197,94,0.5))' }} animate={{ clipPath: ['inset(90% 0 10% 0)', 'inset(10% 0 80% 0)', 'inset(90% 0 10% 0)'] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}><img src={lectorHuellaImg} alt="" className="w-full h-full object-contain" /></motion.div>
                              )}
                            </div>
                          </div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="mt-6 text-center">
                      {fpStatus === 'idle' && <p className="text-xs font-medium" style={{ color: 'rgba(0,0,0,0.4)' }}>Coloca tu dedo sobre el sensor para capturar tu huella digital.</p>}
                      {fpStatus === 'scanning' && <motion.div className="flex items-center gap-2 justify-center" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><RefreshCw size={16} color={GREEN} /></motion.div><span className="text-xs font-medium" style={{ color: GREEN }}>Escaneando huella...</span></motion.div>}
                      {fpStatus === 'captured' && <p className="text-xs font-medium" style={{ color: GREEN }}>Huella capturada exitosamente</p>}
                    </div>
                  </>
                )}
              </div>

              {!fpSuccess && (
                <div className="flex-shrink-0 p-6 pt-4 flex items-center justify-between" style={{ borderTop: '1px solid rgba(0,0,0,0.04)', background: 'rgba(255,255,255,0.8)' }}>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => closeFingerprint()} className="px-5 py-2.5 rounded-xl text-xs font-medium cursor-pointer" style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.5)' }}>
                    Cerrar
                  </motion.button>
                  <div className="flex gap-3">
                    {fpStatus === 'idle' && (
                      <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={startScan} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer" style={{ background: BLUE_GRAD }}>
                        <ScanLine size={16} /> Capturar huella
                      </motion.button>
                    )}
                    {fpStatus === 'scanning' && (
                      <motion.button disabled className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white cursor-not-allowed" style={{ background: 'rgba(0,0,0,0.15)' }}>
                        <RefreshCw size={16} className="animate-spin" /> Escaneando...
                      </motion.button>
                    )}
                    {fpStatus === 'captured' && (
                      <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={confirmFingerprint} className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer" style={{ background: BLUE_GRAD }}>
                        Siguiente →
                      </motion.button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
