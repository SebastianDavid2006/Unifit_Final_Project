import { motion } from 'motion/react'
import { Check, GraduationCap, Shield } from 'lucide-react'
import { BLUE, RED } from '../data'
import type { UserRole } from '../data'

const OPTIONS: { id: UserRole; label: string; desc: string; icon: typeof GraduationCap; gradient: string; accent: string }[] = [
  {
    id: 'trainer',
    label: 'Entrenador',
    desc: 'Gestión de estudiantes, rutinas, valoraciones y agenda.',
    icon: GraduationCap,
    gradient: 'linear-gradient(135deg, #1270B7, #0E5D9E)',
    accent: BLUE,
  },
  {
    id: 'admin',
    label: 'Administrativo',
    desc: 'Control total del sistema: usuarios, planes, configuración y reportes.',
    icon: Shield,
    gradient: 'linear-gradient(135deg, #F43843, #CC0033)',
    accent: RED,
  },
]

export default function RoleSelector({ role, onRoleChange }: {
  role: UserRole
  onRoleChange: (r: UserRole) => void
}) {
  return (
    <div className="relative h-full min-h-[400px] flex flex-col overflow-hidden rounded-2xl">
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-8 py-10 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="flex flex-col items-center text-center"
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <Shield size={28} style={{ color: '#FFFFFF' }} />
          </div>
          <h2 className="text-xl font-extrabold" style={{ color: '#FFFFFF' }}>Selecciona el rol</h2>
          <p className="text-sm mt-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Define qué tipo de acceso tendrá este usuario en el sistema
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
          {OPTIONS.map((opt, i) => (
            <motion.button
              key={opt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.1 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onRoleChange(opt.id)}
              className="relative flex flex-col items-center text-center p-6 rounded-2xl overflow-hidden cursor-pointer"
              style={{
                background: role === opt.id
                  ? opt.gradient
                  : 'rgba(255,255,255,0.06)',
                border: role === opt.id
                  ? '1px solid rgba(255,255,255,0.2)'
                  : '1px solid rgba(255,255,255,0.1)',
                boxShadow: role === opt.id
                  ? `0 8px 32px ${opt.accent}40`
                  : '0 4px 16px rgba(0,0,0,0.1)',
              }}
            >
              {role === opt.id && (
                <motion.div
                  layoutId="roleCheck"
                  className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.25)' }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <Check size={13} color="#FFFFFF" strokeWidth={3} />
                </motion.div>
              )}
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{
                background: role === opt.id
                  ? 'rgba(255,255,255,0.15)'
                  : 'rgba(255,255,255,0.08)',
              }}>
                <opt.icon size={22} style={{ color: role === opt.id ? '#FFFFFF' : 'rgba(255,255,255,0.6)' }} />
              </div>
              <p className="text-sm font-bold" style={{ color: '#FFFFFF' }}>{opt.label}</p>
              <p className="text-[10px] mt-1.5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {opt.desc}
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
