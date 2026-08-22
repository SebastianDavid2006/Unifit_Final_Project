import { motion } from 'motion/react'
import { ArrowLeft } from 'lucide-react'
import accountCreatedImg from '@/assets/illustrations/characters/coach/account_created.webp'
import { BLUE_GRAD } from '@/data/config/registration'

interface RegisterSuccessProps {
  onBack: () => void
}

export function RegisterSuccess({ onBack }: RegisterSuccessProps) {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex flex-col items-center justify-center flex-1 px-6 text-center min-h-0">
        <div className="mb-6 relative flex items-center justify-center">
          <motion.img
            src={accountCreatedImg}
            alt="Cuenta creada"
            className="w-[260px] h-[260px] sm:w-[360px] sm:h-[360px] object-contain object-bottom relative z-10"
            style={{
              WebkitMaskImage: 'linear-gradient(180deg, black 45%, transparent 100%)',
              maskImage: 'linear-gradient(180deg, black 45%, transparent 100%)',
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 16 }}
          />
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold" style={{ color: '#fff' }}>¡Bienvenido a UniFit!</h2>
        <p className="text-sm font-bold mt-3 leading-relaxed" style={{ color: '#7ec8e3' }}>
          Tu cuenta fue creada exitosamente.
        </p>
        <p className="text-xs mt-2 leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Tu contraseña temporal es tu número de documento. Al iniciar sesión por primera vez deberás cambiarla.
        </p>
      </div>

      <div className="flex-shrink-0 px-5 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onBack}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
            style={{ background: BLUE_GRAD }}
          >
            <ArrowLeft size={14} />
            Volver al inicio
          </motion.button>
        </div>
      </div>
    </div>
  )
}