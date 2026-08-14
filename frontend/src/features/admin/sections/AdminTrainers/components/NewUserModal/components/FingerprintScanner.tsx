import { motion } from 'motion/react'
import { RefreshCw } from 'lucide-react'
import lectorHuellaImg from '@/assets/illustrations/actions/fingerprint.webp'
import checkSuccessImg from '@/assets/illustrations/actions/feedback/success_check.webp'
import { GREEN } from '../data'
import type { FingerprintStatus } from '../data'

export default function FingerprintScanner({ status }: { status: FingerprintStatus }) {
  return (
    <div className="flex flex-col items-center pt-8 gap-3 min-h-[400px]">
      <div className="relative flex items-center justify-center">
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 320,
            height: 320,
            background: status === 'scanning'
              ? 'radial-gradient(circle, rgba(34,197,94,0.5) 0%, rgba(34,197,94,0.15) 40%, transparent 70%)'
              : 'radial-gradient(circle, rgba(18,112,183,0.5) 0%, rgba(18,112,183,0.12) 40%, transparent 70%)',
          }}
          animate={status !== 'captured' ? {
            scale: [1, 1.15, 1],
            opacity: status === 'scanning' ? [0.3, 1, 0.3] : [0.5, 0.9, 0.5],
          } : { opacity: 0, scale: 1.5 }}
          transition={{ duration: 3, repeat: status === 'captured' ? 0 : Infinity, ease: 'easeInOut' }}
        />

        {status === 'scanning' && (
          <>
            {[...Array(2)].map((_, i) => (
              <motion.div
                key={`ring-${i}`}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: 64,
                  height: 64,
                  border: '1.5px solid rgba(34,197,94,0.4)',
                }}
                animate={{ scale: [1, 5], opacity: [0.6, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 1.5, ease: 'easeOut' }}
              />
            ))}
          </>
        )}

        {[...Array(16)].map((_, i) => {
          const angle = (i / 16) * 360
          const rad = (angle * Math.PI) / 180
          const dist = 80 + (i % 5) * 20
          return (
            <motion.span
              key={i}
              className="absolute pointer-events-none text-sm select-none"
              style={{ color: '#FFFFFF' }}
              animate={status !== 'captured' ? {
                x: [0, Math.cos(rad) * dist],
                y: [0, Math.sin(rad) * dist],
                opacity: [0, 1, 0],
                scale: [0, 1.2, 0],
              } : { opacity: 0, scale: 0 }}
              transition={{
                duration: 3 + (i % 4) * 0.5,
                repeat: status === 'captured' ? 0 : Infinity,
                delay: i * 0.12,
                ease: 'easeOut',
              }}
            >
              ✦
            </motion.span>
          )
        })}

        {status === 'captured' ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="relative flex items-center justify-center"
          >
            <div className="absolute w-64 h-64 rounded-full" style={{
              background: 'radial-gradient(circle, rgba(34,197,94,0.25) 0%, transparent 70%)',
            }} />
            {[...Array(12)].map((_, i) => {
              const angle = (i / 12) * 360
              const rad = (angle * Math.PI) / 180
              const dist = 80 + (i % 3) * 20
              return (
                <motion.span
                  key={i}
                  className="absolute pointer-events-none text-lg select-none"
                  style={{ color: '#22C55E' }}
                  animate={{
                    x: [0, Math.cos(rad) * dist],
                    y: [0, Math.sin(rad) * dist],
                    opacity: [0, 1, 0],
                    scale: [0, 1.2, 0],
                  }}
                  transition={{
                    duration: 2 + (i % 4) * 0.3,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: 'easeOut',
                  }}
                >
                  ✦
                </motion.span>
              )
            })}
            <div className="relative w-64 h-64 flex items-center justify-center">
              <motion.img
                src={checkSuccessImg}
                alt="check"
                className="w-32 h-auto object-contain relative z-10"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        ) : (
          <div className="relative flex items-center justify-center">
            <div className="relative w-64 h-64">
              <motion.img
                src={lectorHuellaImg}
                alt="lector huella"
                className="w-full h-full object-contain"
                animate={{
                  scale: [1, 1.02, 1],
                  opacity: status === 'scanning' ? 0.3 : 0.4,
                }}
                transition={{
                  scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                  opacity: { duration: 0.3 },
                }}
              />

              {status === 'scanning' && (
                <>
                  <motion.div
                    className="absolute inset-0 pointer-events-none z-10 overflow-hidden"
                    style={{
                      filter: 'brightness(1.3) drop-shadow(0 0 15px rgba(34,197,94,0.5))',
                    }}
                    animate={{
                      clipPath: [
                        'inset(90% 0 10% 0)',
                        'inset(10% 0 80% 0)',
                        'inset(90% 0 10% 0)',
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <img src={lectorHuellaImg} alt="" className="w-full h-full object-contain" />
                  </motion.div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {status === 'idle' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs font-medium text-center"
          style={{ color: 'rgba(0,0,0,0.4)' }}
        >
          Coloca tu dedo sobre el sensor para capturar tu huella digital.
        </motion.p>
      )}

      {status === 'scanning' && (
        <motion.div
          className="flex items-center gap-2"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
            <RefreshCw size={16} color={GREEN} />
          </motion.div>
          <span className="text-xs font-medium" style={{ color: GREEN }}>Escaneando huella...</span>
        </motion.div>
      )}

      {status === 'captured' && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-medium text-center"
          style={{ color: GREEN }}
        >
          Huella capturada exitosamente
        </motion.p>
      )}
    </div>
  )
}
