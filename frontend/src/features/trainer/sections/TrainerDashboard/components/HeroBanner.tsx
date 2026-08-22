import { motion } from 'motion/react'
import coachImg from '@/assets/illustrations/characters/coach/coach_default.webp'
import { BLUE_GRAD } from '@/data/shared/constants'

export default function HeroBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-3xl gradient-border mt-12"
      style={{
        background: 'linear-gradient(145deg, #FFFFFF 0%, #F0F7FF 25%, #EBF5FF 50%, #FFF8E8 100%)',
        boxShadow: '0 20px 60px rgba(0,122,255,0.06), 0 8px 20px rgba(0,0,0,0.02)',
      }}
    >
      <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background: `
              radial-gradient(ellipse at 80% 10%, rgba(0,122,255,0.04) 0%, transparent 40%),
              radial-gradient(ellipse at 10% 80%, rgba(245,166,35,0.03) 0%, transparent 40%),
              radial-gradient(ellipse at 50% 50%, rgba(230,57,70,0.02) 0%, transparent 50%)
            `,
            backgroundSize: '200% 200%',
            animation: 'mesh-shift 15s ease-in-out infinite',
          }}
        />
      </div>
      <div className="relative z-10 p-6 md:p-8 flex items-center min-h-[240px] md:min-h-[280px]">
        <div className="flex items-center gap-4 md:gap-5 w-full">
          <div className="w-1 h-20 md:h-24 rounded-full flex-shrink-0" style={{ background: BLUE_GRAD }} />
          <div className="min-w-0">
            <p className="text-[10px] md:text-[11px] font-bold tracking-[0.18em] uppercase mb-1 md:mb-1.5" style={{ color: 'rgba(0,0,0,0.25)' }}>{new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <h1 className="text-2xl md:text-[2.8rem] font-extrabold leading-tight" style={{ color: '#1A1A1E', letterSpacing: '-0.04em' }}>
              Buenos días,
            </h1>
            <h2 className="text-2xl md:text-[2.8rem] font-extrabold leading-tight text-gradient-warm" style={{ letterSpacing: '-0.04em' }}>
              Sebastián.
            </h2>
          </div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="hidden md:block"
        style={{
          position: 'absolute',
          right: 24,
          bottom: 0,
          width: 400,
          height: 'auto',
          zIndex: 20,
        }}
      >
        <img src={coachImg} alt="Coach Dashboard" className="w-full h-auto" />
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10" style={{
          background: 'linear-gradient(to top, rgba(240,247,255,1) 0%, transparent 60%)',
        }} />
      </motion.div>
    </motion.div>
  )
}
