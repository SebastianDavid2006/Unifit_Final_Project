import { motion } from 'motion/react'
import { Plus } from 'lucide-react'
import calendarImg from '@/assets/illustrations/modules/calendar_module.webp'
import { BLUE_GRAD } from '../../AgendaData'
import { MESH_GRAD } from '../data'

export function Banner({ onOpenPublish }: { onOpenPublish?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-3xl mb-8"
      style={{
        background: 'linear-gradient(90deg, #FFFFFF 0%, #F8FBFF 40%, rgba(248,251,255,0) 100%)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
      }}
    >
      <div className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden" style={{
        maskImage: 'linear-gradient(to right, black 60%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, black 60%, transparent 100%)'
      }}>
        <div className="absolute inset-0 opacity-30" style={{
          background: 'radial-gradient(ellipse at 80% 10%, rgba(0,122,255,0.03) 0%, transparent 40%), radial-gradient(ellipse at 10% 80%, rgba(245,166,35,0.02) 0%, transparent 40%), radial-gradient(ellipse at 50% 50%, rgba(230,57,70,0.02) 0%, transparent 50%)',
          backgroundSize: '200% 200%',
          animation: 'mesh-shift 15s ease-in-out infinite',
        }} />
      </div>

      <div style={{ position: 'absolute', left: 40, bottom: 0, height: 170, width: 220, zIndex: 20, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', width: '90%', height: '50%', background: 'rgba(18,112,183,0.1)', filter: 'blur(30px)', borderRadius: '50%' }} />
        <img src={calendarImg} alt="Calendario" className="w-full h-full object-cover drop-shadow-xl relative" style={{ objectPosition: 'center top' }} />
      </div>

      <div className="relative z-10 p-8 flex items-center justify-between">
        <div className="flex items-center gap-6 ml-64">
          <div className="w-1 h-12 rounded-full" style={{ background: BLUE_GRAD }} />
          <div>
            <h1 style={{ color: '#1A1A1E', fontSize: '2rem', fontWeight: 800 }}>Agenda</h1>
            <p className="text-xs text-black/40">Organiza tus clases, valoraciones y eventos.</p>
          </div>
        </div>
        {onOpenPublish && (
          <div className="flex items-center gap-3 pr-4">
            <motion.button
              initial="initial"
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
              onClick={onOpenPublish}
              className="flex items-center rounded-full overflow-hidden text-white"
              style={{ height: 44, padding: '0 12px', background: MESH_GRAD }}
            >
              <motion.div
                variants={{
                  hover: { maxWidth: 80, opacity: 1, marginRight: 6, transition: { delay: 0.12, duration: 0.35, ease: 'easeOut' } },
                  initial: { maxWidth: 0, opacity: 0, marginRight: 0, transition: { duration: 0.2 } }
                }}
                className="overflow-hidden whitespace-nowrap"
              >
                <span className="text-xs font-bold">Nueva Agenda</span>
              </motion.div>
              <div className="flex items-center justify-center flex-shrink-0">
                <Plus size={18} strokeWidth={3} />
              </div>
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
