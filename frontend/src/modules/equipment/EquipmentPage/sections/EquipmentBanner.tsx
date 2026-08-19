import { motion } from 'motion/react'
import { Plus } from 'lucide-react'
import { BLUE_GRAD } from '@/data/shared/constants'
import { EQUIPMENT_IMAGES } from '@/modules/equipment/data'

export function EquipmentBanner({ onCreate }: { onCreate: () => void }) {
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

      <div style={{ position: 'absolute', left: 20, bottom: 0, height: 160, width: 230, zIndex: 20, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', width: '90%', height: '50%', background: 'rgba(18,112,183,0.1)', filter: 'blur(30px)', borderRadius: '50%' }} />
        <img src={EQUIPMENT_IMAGES.machineImg} alt="Máquinas" className="w-full h-full object-scale-down drop-shadow-xl relative" style={{ objectPosition: 'bottom center' }} />
      </div>

      <div className="relative z-10 p-8 flex items-center justify-between">
        <div className="flex items-center gap-6 ml-64">
          <div className="w-1 h-12 rounded-full" style={{ background: BLUE_GRAD }} />
          <div>
            <h1 style={{ color: '#1A1A1E', fontSize: '2rem', fontWeight: 800 }}>Máquinas y Ejercicios</h1>
            <p className="text-xs text-black/40">Registra máquinas, asigna ejercicios y controla su estado operativo.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 pr-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onCreate}
            className="relative flex items-center justify-start gap-2 h-11 overflow-hidden cursor-pointer group rounded-full"
            style={{
              width: 44,
              transition: 'width 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
              background: 'radial-gradient(ellipse at 20% 30%, rgba(230,57,70,0.9) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(18,112,183,0.4) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(241,200,39,0.25) 0%, transparent 50%), #CC0033',
              boxShadow: '0 4px 16px rgba(230,57,70,0.25)',
              color: '#FFFFFF',
              border: 'none',
            }}
            onMouseEnter={e => { e.currentTarget.style.width = '110px'; const t = e.currentTarget.querySelector('span'); if (t) t.style.opacity = '1' }}
            onMouseLeave={e => { e.currentTarget.style.width = '44px'; const t = e.currentTarget.querySelector('span'); if (t) t.style.opacity = '0' }}
          >
            <div className="flex items-center justify-center flex-shrink-0 relative z-10" style={{ width: 44, height: 44 }}>
              <Plus size={18} />
            </div>
            <span className="text-sm whitespace-nowrap relative z-10" style={{
              opacity: 0,
              fontWeight: 600,
              transition: 'opacity 0.2s ease 0.08s',
            }}>Crear</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
