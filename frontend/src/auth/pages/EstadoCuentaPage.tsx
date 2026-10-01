import { motion } from 'motion/react'
import { Hourglass, ShieldOff } from 'lucide-react'
import { AuthShell } from '@/auth/components/AuthShell'
import logotipo from '@/assets/logo/logo.webp'

export type VarianteEstadoCuenta = 'inactiva' | 'pendiente'

// Pantallas estáticas: sin llamadas a la API ni datos personales. La seguridad real
// la aplica el backend; esto solo informa por qué la persona no puede entrar.
const CONTENIDO = {
  inactiva: {
    Icono: ShieldOff,
    color: '#FF8FA3',
    titulo: 'Cuenta inactiva',
    mensaje: 'Tu cuenta está inactiva. Comunícate con el administrador.',
  },
  pendiente: {
    Icono: Hourglass,
    color: '#7ec8e3',
    titulo: 'Cuenta pendiente de activación',
    mensaje: 'Tu registro aún no está completo. Comunícate con el administrador para que lo complete.',
  },
} as const

interface EstadoCuentaPageProps {
  variante: VarianteEstadoCuenta
  onVolver: () => void
}

export function EstadoCuentaPage({ variante, onVolver }: EstadoCuentaPageProps) {
  const { Icono, color, titulo, mensaje } = CONTENIDO[variante]

  return (
    <AuthShell onBack={onVolver} autoDesktopVideo>
      {(ctx) => (
        <div className={`flex-1 min-h-0 overflow-y-auto flex flex-col ${ctx.isPhonePreview ? 'px-5' : 'px-6 sm:px-10'}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col flex-1 items-center justify-center max-w-xl mx-auto w-full text-center"
          >
            <img src={logotipo} alt="UNIFIT" style={{ height: 48, objectFit: 'contain' }} className="mb-8" />
            <Icono size={64} className="mb-6" style={{ color }} />
            <h1 className="text-xl font-bold text-white mb-3">{titulo}</h1>
            <p className="text-base mb-8" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{mensaje}</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onVolver}
              className="px-6 py-2.5 rounded-xl text-sm font-medium cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)' }}
            >
              Ir al login
            </motion.button>
          </motion.div>
        </div>
      )}
    </AuthShell>
  )
}
