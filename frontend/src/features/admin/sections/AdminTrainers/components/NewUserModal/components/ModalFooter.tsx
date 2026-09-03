import { motion } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { BLUE_GRAD, GREEN_GRAD } from '../data'

export default function ModalFooter({ step, onPrev, onNext }: {
  step: number
  onPrev: () => void
  onNext: () => void
}) {
  const isLast = step === 3
  return (
    <div className="flex-shrink-0 p-6 pt-4" style={{
      borderTop: '1px solid rgba(0,0,0,0.04)',
      background: 'rgba(255,255,255,0.8)',
    }}>
      <div className="flex items-center justify-between">
        <div className="flex-1 flex justify-start">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onPrev}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium cursor-pointer"
            style={{ background: 'rgba(0,0,0,0.04)', color: step > 1 ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.15)' }}
            disabled={step === 1}
          >
            <ChevronLeft size={14} />
            Atrás
          </motion.button>
        </div>

        <div className="flex-1 flex justify-end">
          <motion.button
            type="button"
            variants={{
              rest: { scale: 1, boxShadow: '0 4px 15px rgba(18,112,183,0)' },
              hover: {
                scale: 1.06,
                boxShadow: isLast
                  ? '0 8px 30px rgba(0,251,100,0.35), 0 0 60px rgba(0,155,149,0.15)'
                  : '0 8px 30px rgba(18,112,183,0.35), 0 0 60px rgba(18,112,183,0.1)',
                transition: { type: 'spring', stiffness: 400, damping: 12 },
              },
              tap: {
                scale: 0.92,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: { type: 'spring', stiffness: 500, damping: 10 },
              },
            }}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            onClick={onNext}
            className="relative flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white overflow-hidden cursor-pointer"
            style={{ background: isLast ? GREEN_GRAD : BLUE_GRAD }}
          >
            <motion.span
              variants={{
                rest: { opacity: 0, scale: 0 },
                hover: { opacity: 1, scale: 2.5 },
                tap: { opacity: 0, scale: 0 },
              }}
              initial="rest"
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{ background: 'rgba(255,255,255,0.2)' }}
            />
            <motion.span
              animate={isLast ? {} : { x: [0, 3, 0] }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10"
            >
              {isLast ? 'Finalizar' : 'Siguiente'}
            </motion.span>
            {!isLast && (
              <motion.span
                animate={{ x: [0, 2, 0] }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10"
              >
                <ChevronRight size={14} />
              </motion.span>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  )
}
