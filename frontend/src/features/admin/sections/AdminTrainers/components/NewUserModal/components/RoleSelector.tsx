import { motion } from 'motion/react'
import { Check, GraduationCap, Shield, UserCheck, Building2 } from 'lucide-react'
import { BLUE, RED } from '../data'
import type { UserRole, TipoUsuarioStaff } from '../data'

const ROLE_OPTIONS: { id: UserRole; label: string; desc: string; features: string[]; icon: typeof GraduationCap; gradient: string; accent: string; glow: string }[] = [
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

const TIPO_OPTIONS: { id: TipoUsuarioStaff; label: string; desc: string; icon: typeof UserCheck }[] = [
  { id: 'profesor', label: 'Profesor', desc: 'Puede gestionar entrenamiento, rutinas y valoraciones.', icon: GraduationCap },
  { id: 'administrativo', label: 'Administrativo', desc: 'Puede gestionar configuración, usuarios y reportes.', icon: Building2 },
]

export default function RoleSelector({ role, onRoleChange, tipoUsuario, onTipoUsuarioChange }: {
  role: UserRole | null
  onRoleChange: (r: UserRole) => void
  tipoUsuario: TipoUsuarioStaff | null
  onTipoUsuarioChange: (t: TipoUsuarioStaff) => void
}) {
  return (
    <div className="relative h-full min-h-[400px] flex flex-col overflow-hidden rounded-2xl">
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-8 py-8 gap-6">
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

        <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
          {ROLE_OPTIONS.map((opt, i) => {
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
                className="relative flex flex-col text-left p-4 rounded-2xl overflow-hidden cursor-pointer"
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
                    className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.45)' }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  >
                    <Check size={11} color="#FFFFFF" strokeWidth={3} />
                  </motion.div>
                )}

                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{
                    background: selected ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)',
                    border: selected ? '1px solid rgba(255,255,255,0.3)' : `1px solid ${opt.accent}30`,
                  }}>
                    <opt.icon size={20} style={{ color: selected ? '#FFFFFF' : opt.accent }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold leading-tight" style={{ color: '#FFFFFF' }}>{opt.label}</p>
                    <p className="text-[11px] font-semibold mt-0.5" style={{ color: selected ? 'rgba(255,255,255,0.75)' : opt.accent }}>
                      {selected ? 'Rol seleccionado' : 'Acceso limitado'}
                    </p>
                  </div>
                </div>

                <p className="text-[10.5px] leading-relaxed mb-3" style={{ color: selected ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)' }}>
                  {opt.desc}
                </p>

                <div className="w-full h-px mb-2" style={{ background: selected ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)' }} />

                <ul className="flex flex-col gap-1.5 mb-3">
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

        {role && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl"
          >
            <p className="text-xs font-bold mb-2 text-center" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Tipo de usuario del personal
            </p>
            <div className="grid grid-cols-2 gap-3">
              {TIPO_OPTIONS.map((opt, i) => {
                const selected = tipoUsuario === opt.id
                const Icon = opt.icon
                return (
                  <motion.button
                    key={opt.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onTipoUsuarioChange(opt.id)}
                    className="relative flex items-start gap-3 p-4 rounded-xl cursor-pointer text-left"
                    style={{
                      background: selected ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
                      border: selected ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.06)',
                      boxShadow: selected ? '0 6px 24px rgba(0,0,0,0.18)' : 'none',
                    }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{
                      background: selected ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.06)',
                    }}>
                      <Icon size={16} style={{ color: selected ? '#FFFFFF' : 'rgba(255,255,255,0.5)' }} />
                    </div>
                    <div>
                      <p className="text-xs font-bold" style={{ color: '#FFFFFF' }}>{opt.label}</p>
                      <p className="text-[10.5px] mt-0.5 leading-snug" style={{ color: 'rgba(255,255,255,0.55)' }}>{opt.desc}</p>
                    </div>
                    {selected && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.25)' }}>
                        <Check size={10} strokeWidth={3} color="#FFFFFF" />
                      </div>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
