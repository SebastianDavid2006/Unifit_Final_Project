import { motion } from 'motion/react'
import { Shield } from 'lucide-react'
import type { Trainer } from '@/data/trainers'

export default function PermissionsSection({ trainer, globalAdmin, onToggleGlobalAdmin }: {
  trainer: Trainer
  globalAdmin: boolean
  onToggleGlobalAdmin: () => void
}) {
  return (
    <div className="p-8 pt-12 max-w-[1440px] mx-auto flex items-center justify-center min-h-[calc(100vh-120px)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-xl rounded-[28px] p-8 backdrop-blur-xl"
        style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
        }}
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <Shield size={24} style={{ color: 'rgba(255,255,255,0.8)' }} />
          </div>
          <h2 className="text-xl font-extrabold" style={{ color: '#FFFFFF' }}>Permiso Global</h2>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Configura el nivel de acceso de {trainer.name}</p>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.08, duration: 0.3 }}
          className="flex items-center gap-4 rounded-2xl px-5 py-4"
          style={{
            background: globalAdmin ? 'rgba(48,209,88,0.06)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${globalAdmin ? 'rgba(48,209,88,0.15)' : 'rgba(255,255,255,0.06)'}`,
          }}
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold" style={{ color: '#FFFFFF' }}>Administrador Global</p>
            <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Acceso completo a todas las funcionalidades del sistema:{' '}
              gestión de usuarios, entrenadores y estudiantes, configuración
              de la plataforma, dashboard y reportes, documentación y
              registros de auditoría.
            </p>
          </div>
          <div
            onClick={onToggleGlobalAdmin}
            className="relative w-11 h-6 rounded-full flex-shrink-0 cursor-pointer transition-all duration-300"
            style={{
              background: globalAdmin ? 'rgba(48,209,88,0.6)' : 'rgba(255,255,255,0.12)',
              boxShadow: globalAdmin ? '0 0 12px rgba(48,209,88,0.25)' : 'none',
            }}
          >
            <motion.div
              animate={{ x: globalAdmin ? 20 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-1 w-4 h-4 rounded-full"
              style={{
                background: '#FFFFFF',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              }}
            />
          </div>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-6 rounded-2xl py-3.5 text-sm font-bold transition-all"
          style={{
            background: globalAdmin
              ? 'linear-gradient(135deg, #30D158, #20A040)'
              : 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: globalAdmin ? '#FFFFFF' : 'rgba(255,255,255,0.3)',
            boxShadow: globalAdmin ? '0 8px 24px rgba(48,209,88,0.25)' : 'none',
          }}
        >
          Guardar Cambios
        </motion.button>
      </motion.div>
    </div>
  )
}
