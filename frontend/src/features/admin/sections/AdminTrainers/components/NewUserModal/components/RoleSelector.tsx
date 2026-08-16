import { motion } from 'motion/react'
import { Check, GraduationCap, Shield } from 'lucide-react'
import { BLUE, RED } from '../data'
import type { UserRole } from '../data'

const OPTIONS: { id: UserRole; label: string; desc: string; features: string[]; icon: typeof GraduationCap; gradient: string; accent: string; glow: string }[] = [
  {
    id: 'trainer',
    label: 'Entrenador',
    desc: 'Gestión de estudiantes, rutinas, valoraciones y agenda.',
    features: ['Gestión de estudiantes', 'Rutinas y programas', 'Valoraciones físicas', 'Agenda de citas'],
    icon: GraduationCap,
    gradient: 'linear-gradient(135deg, #1270B7, #0E5D9E)',
    accent: BLUE,
    glow: 'rgba(18,112,183,0.45)',
  },
  {
    id: 'admin',
    label: 'Administrativo',
    desc: 'Control total del sistema: usuarios, planes, configuración y reportes.',
    features: ['Control de usuarios y roles', 'Dashboard general', 'Configuración del sistema', 'Reportes y estadísticas'],
    icon: Shield,
    gradient: 'linear-gradient(135deg, #F43843, #CC0033)',
    accent: RED,
    glow: 'rgba(244,56,67,0.45)',
  },
]

export default function RoleSelector({ role, onRoleChange }: {
  role: UserRole | null
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
          <h2 className="text-xl font-extrabold" style={{ color: '#FFFFFF' }}>Selecciona el rol</h2>
          <p className="text-sm mt-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Define qué tipo de acceso tendrá este usuario en el sistema
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-5 w-full max-w-2xl">
          {OPTIONS.map((opt, i) => {
            const selected = role === opt.id
            return (
              <motion.button
                key={opt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.1 }}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onRoleChange(opt.id)}
                className="relative flex flex-col text-left p-5 rounded-2xl overflow-hidden cursor-pointer"
                style={{
                  background: selected
                    ? opt.gradient
                    : 'rgba(255,255,255,0.05)',
                  border: selected
                    ? '1px solid rgba(255,255,255,0.35)'
                    : '1px solid rgba(255,255,255,0.09)',
                  boxShadow: selected
                    ? `0 12px 40px ${opt.glow}, inset 0 1px 0 rgba(255,255,255,0.25)`
                    : '0 4px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.08)',
                  backdropFilter: selected ? 'blur(6px)' : 'blur(10px)',
                  WebkitBackdropFilter: selected ? 'blur(6px)' : 'blur(10px)',
                }}
              >
                <div
                  className="absolute inset-x-0 top-0 h-24 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.14) 0%, transparent 70%)' }}
                />
                {selected && (
                  <motion.div
                    layoutId="roleCheck"
                    className="absolute top-3.5 right-3.5 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.45)' }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  >
                    <Check size={13} color="#FFFFFF" strokeWidth={3} />
                  </motion.div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{
                    background: selected
                      ? 'rgba(255,255,255,0.18)'
                      : `rgba(255,255,255,0.07)`,
                    border: selected
                      ? '1px solid rgba(255,255,255,0.3)'
                      : `1px solid ${opt.accent}30`,
                  }}>
                    <opt.icon size={22} style={{ color: selected ? '#FFFFFF' : opt.accent }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[15px] font-extrabold leading-tight" style={{ color: '#FFFFFF' }}>{opt.label}</p>
                    <p className="text-[11px] font-semibold mt-0.5" style={{ color: selected ? 'rgba(255,255,255,0.75)' : opt.accent }}>
                      {selected ? 'Rol seleccionado' : 'Acceso limitado'}
                    </p>
                  </div>
                </div>

                <p className="text-[10.5px] leading-relaxed mb-4" style={{ color: selected ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)' }}>
                  {opt.desc}
                </p>

                <div className="w-full h-px mb-3" style={{ background: selected ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)' }} />

                <ul className="flex flex-col gap-2 mb-5">
                  {opt.features.map(f => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{
                        background: selected ? 'rgba(255,255,255,0.18)' : `${opt.accent}22`,
                      }}>
                        <Check size={8.5} strokeWidth={3} style={{ color: selected ? '#FFFFFF' : opt.accent }} />
                      </span>
                      <span className="text-[10.5px] font-medium" style={{ color: selected ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)' }}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto w-full py-2 rounded-lg text-center text-[11px] font-bold tracking-wide flex items-center justify-center gap-1.5 transition-colors duration-200" style={{
                  background: selected ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.05)',
                  border: selected ? '1px solid rgba(255,255,255,0.4)' : `1px solid ${opt.accent}35`,
                  color: selected ? '#FFFFFF' : opt.accent,
                }}>
                  {selected ? (
                    <>
                      <Check size={12} strokeWidth={3} /> SELECCIONADO
                    </>
                  ) : 'SELECCIONAR'}
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
