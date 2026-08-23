import { motion } from 'motion/react'
import { Plus } from 'lucide-react'
import trainersImg from '@/assets/illustrations/characters/trainers/trainers_group.webp'
import { RED_GRAD } from '../data'

export default function BannerCard({ onOpenNewUser }: { onOpenNewUser: () => void }) {
  return (
    <motion.div className="relative rounded-3xl mb-8" style={{ background: 'linear-gradient(90deg, #FFFFFF 0%, #F8FBFF 40%, rgba(248,251,255,0) 100%)', boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{
        maskImage: 'linear-gradient(to right, black 60%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, black 60%, transparent 100%)'
      }}>
        <div className="absolute inset-0 opacity-30" style={{
          background: 'radial-gradient(ellipse at 80% 10%, rgba(0,122,255,0.03) 0%, transparent 40%), radial-gradient(ellipse at 10% 80%, rgba(245,166,35,0.02) 0%, transparent 40%), radial-gradient(ellipse at 50% 50%, rgba(230,57,70,0.02) 0%, transparent 50%)',
          backgroundSize: '200% 200%',
          animation: 'mesh-shift 15s ease-in-out infinite',
        }} />
      </div>

      <div className="relative z-10 p-5 pt-10 flex items-center justify-between rounded-3xl">
        <div className="flex items-center gap-6 ml-56">
          <div className="w-1 h-12 rounded-full" style={{ background: RED_GRAD }} />
          <div>
            <h1 style={{ color: '#1A1A1E', fontSize: '2rem', fontWeight: 800 }}>Personal</h1>
            <p className="text-xs text-black/40">Gestiona estudiantes, entrenadores y administradores del gimnasio.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 pr-4">
          <motion.button
            initial="initial"
            whileHover="hover"
            whileTap={{ scale: 0.9, boxShadow: '0 0 40px rgba(244,56,67,0.6), 0 0 80px rgba(18,112,183,0.4), 0 0 120px rgba(241,200,39,0.2)', transition: { duration: 0.15 } }}
            onClick={onOpenNewUser}
            className="flex items-center rounded-full overflow-hidden relative text-white"
            style={{
              height: 44,
              padding: '0 12px',
              background: `
                radial-gradient(at 20% 20%, #F43843 0%, transparent 50%),
                radial-gradient(at 80% 15%, #1270B7 0%, transparent 50%),
                radial-gradient(at 50% 80%, #F1C827 0%, transparent 60%),
                radial-gradient(at 30% 60%, #F43843 0%, transparent 40%),
                radial-gradient(at 70% 70%, #1270B7 0%, transparent 40%),
                #F43843
              `,
              backgroundSize: '150% 150%',
              boxShadow: '0 10px 25px -5px rgba(230,57,70,0.3)',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 10px 30px -3px rgba(230,57,70,0.5), 0 0 20px rgba(230,57,70,0.2)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(230,57,70,0.3)' }}
          >
            <motion.div
              variants={{
                hover: { maxWidth: 180, opacity: 1, marginRight: 10, transition: { delay: 0.12, duration: 0.4, ease: 'easeOut' } },
                initial: { maxWidth: 0, opacity: 0, marginRight: 0, transition: { duration: 0.25 } }
              }}
              whileTap={{ opacity: 0.35, transition: { duration: 0.12 } }}
              className="overflow-hidden whitespace-nowrap"
            >
              <span className="text-xs font-bold">Nuevo Usuario</span>
            </motion.div>
            <motion.div
              whileTap={{ scale: 0.85, opacity: 0.35, transition: { duration: 0.12 } }}
              className="flex items-center justify-center flex-shrink-0"
            >
              <Plus size={18} strokeWidth={3} />
            </motion.div>
          </motion.button>
        </div>
      </div>

      <div
        style={{ position: 'absolute', left: 10, bottom: 0, top: -70, width: 220, zIndex: 20, opacity: 0, animation: 'blur-fade 0.6s 0.3s ease forwards' }}
      >
        <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '85%', height: '50%', background: 'rgba(18,112,183,0.12)', filter: 'blur(25px)', borderRadius: '50%' }} />
        <img src={trainersImg} alt="Trainers" className="w-full h-full drop-shadow-xl relative" style={{ objectFit: 'contain', objectPosition: 'center bottom' }} />
      </div>
    </motion.div>
  )
}
