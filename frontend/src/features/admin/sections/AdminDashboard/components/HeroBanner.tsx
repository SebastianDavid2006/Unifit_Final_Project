import { motion } from 'motion/react'
import adminImg from '@/assets/illustrations/characters/admin/admin_default.webp'
import { BLUE_GRAD } from '@/data/shared/constants'

export default function HeroBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-3xl gradient-border"
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
      <div className="relative z-10 p-8">
        <div className="flex items-center min-h-[220px]">
          <div className="flex items-center gap-5">
            <div className="w-1 h-24 rounded-full" style={{ background: BLUE_GRAD }} />
            <div>
              <p className="text-[11px] font-bold tracking-[0.18em] uppercase" style={{ color: 'rgba(0,0,0,0.25)' }}>{new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <h1 className="mt-1.5" style={{ color: '#1A1A1E', fontSize: '2.8rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
                Buenos días,
              </h1>
              <h2 className="text-gradient-warm" style={{ fontSize: '2.8rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
                Administrador.
              </h2>
            </div>
          </div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        style={{
          position: 'absolute',
          right: 24,
          bottom: 0,
          width: 480,
          height: 'auto',
          zIndex: 20,
          pointerEvents: 'none',
        }}
      >
        <img
          src={adminImg}
          alt="Admin Dashboard"
          className="w-full h-auto"
          style={{
            maskImage: 'linear-gradient(to top, transparent 0%, black 35%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 35%, black 100%)',
          }}
        />
      </motion.div>
    </motion.div>
  )
}
