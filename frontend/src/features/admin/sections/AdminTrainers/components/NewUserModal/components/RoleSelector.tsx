import { motion } from 'motion/react'
import { Check, GraduationCap, Shield, UserCheck, Building2 } from 'lucide-react'
import type { UserRole, TipoUsuarioStaff } from '../data'
import type { Cargo, Area } from '@/types/catalogo'

const ROLE_OPTIONS: { id: UserRole; label: string; desc: string; features: string[]; icon: typeof GraduationCap; gradient: string; accent: string; glow: string }[] = [
  {
    id: 'trainer',
    label: 'Entrenador',
    desc: 'Encargado de la gestión deportiva y el acompañamiento de los estudiantes.',
    features: ['Gestión de estudiantes', 'Rutinas y programas', 'Valoraciones físicas', 'Agenda de citas'],
    icon: GraduationCap,
    gradient: 'linear-gradient(135deg, #1270B7, #0E5D9E)',
    accent: '#1270B7',
    glow: 'rgba(18,112,183,0.45)',
  },
  {
    id: 'admin',
    label: 'Administrador',
    desc: 'Encargado de la administración integral del sistema y sus configuraciones.',
    features: ['Control de usuarios y roles', 'Dashboard general', 'Configuración del sistema', 'Reportes y estadísticas'],
    icon: Shield,
    gradient: 'linear-gradient(135deg, #F43843, #CC0033)',
    accent: '#F43843',
    glow: 'rgba(244,56,67,0.45)',
  },
]

const TIPO_OPTIONS: { id: TipoUsuarioStaff; label: string; desc: string; icon: typeof UserCheck }[] = [
  { id: 'profesor', label: 'Profesor', desc: 'Puede gestionar entrenamiento, rutinas y valoraciones.', icon: GraduationCap },
  { id: 'administrativo', label: 'Administrativo', desc: 'Puede gestionar configuración, usuarios y reportes.', icon: Building2 },
]

export default function RoleSelector({ role, onRoleChange, tipoUsuario, onTipoUsuarioChange, cargos, areas, idCargo, idArea, onCargoChange, onAreaChange }: {
  role: UserRole | null
  onRoleChange: (r: UserRole) => void
  tipoUsuario: TipoUsuarioStaff | null
  onTipoUsuarioChange: (t: TipoUsuarioStaff) => void
  cargos: Cargo[]
  areas: Area[]
  idCargo: string
  idArea: string
  onCargoChange: (v: string) => void
  onAreaChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-6 py-2">
      {/* ── Sección: Rol ────────────────────────────────── */}
      <div className="flex flex-col items-center text-center">
        <h2 className="text-xl font-extrabold" style={{ color: '#1A1A1E' }}>Selecciona el rol</h2>
        <p className="text-sm mt-1.5" style={{ color: 'rgba(0,0,0,0.5)' }}>
          Define qué tipo de acceso tendrá este usuario en el sistema
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        {ROLE_OPTIONS.map((opt, i) => {
          const selected = role === opt.id
          return (
            <motion.button
              key={opt.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onRoleChange(opt.id)}
              className="relative flex flex-col text-left p-4 rounded-2xl overflow-hidden cursor-pointer"
              style={{
                background: selected ? opt.gradient : 'rgba(0,0,0,0.03)',
                border: selected
                  ? '1px solid rgba(255,255,255,0.35)'
                  : `1px solid ${opt.accent}30`,
                boxShadow: selected
                  ? `0 12px 40px ${opt.glow}, inset 0 1px 0 rgba(255,255,255,0.25)`
                  : '0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)',
              }}
            >
              {selected && (
                <div
                  className="absolute inset-x-0 top-0 h-24 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.14) 0%, transparent 70%)' }}
                />
              )}

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
                  background: selected ? 'rgba(255,255,255,0.18)' : `${opt.accent}12`,
                  border: selected ? '1px solid rgba(255,255,255,0.3)' : `1px solid ${opt.accent}25`,
                }}>
                  <opt.icon size={20} style={{ color: selected ? '#FFFFFF' : opt.accent }} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-extrabold leading-tight" style={{ color: selected ? '#FFFFFF' : '#1A1A1E' }}>
                    {opt.label}
                  </p>
                  <p className="text-[11px] font-semibold mt-0.5" style={{ color: selected ? 'rgba(255,255,255,0.75)' : opt.accent }}>
                    {selected ? 'Rol seleccionado' : 'Haz clic para seleccionar'}
                  </p>
                </div>
              </div>

              <p className="text-[10.5px] leading-relaxed mb-3" style={{ color: selected ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.55)' }}>
                {opt.desc}
              </p>

              <div className="w-full h-px mb-3" style={{ background: selected ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.06)' }} />

              <ul className="flex flex-col gap-1.5 mb-4">
                {opt.features.map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{
                      background: selected ? 'rgba(255,255,255,0.18)' : `${opt.accent}15`,
                    }}>
                      <Check size={8.5} strokeWidth={3} style={{ color: selected ? '#FFFFFF' : opt.accent }} />
                    </span>
                    <span className="text-[10.5px] font-medium" style={{ color: selected ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.65)' }}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto w-full py-2 rounded-lg text-center text-[11px] font-bold tracking-wide flex items-center justify-center gap-1.5 transition-colors duration-200" style={{
                background: selected ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.03)',
                border: selected ? '1px solid rgba(255,255,255,0.4)' : `1px solid ${opt.accent}30`,
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

      {/* ── Sección: Tipo de usuario ────────────────────── */}
      <div className="flex flex-col text-center">
        <p className="text-xs font-bold mb-3" style={{ color: 'rgba(0,0,0,0.45)' }}>
          Vínculo Institucional
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
                transition={{ delay: 0.2 + i * 0.06 }}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onTipoUsuarioChange(opt.id)}
                className="relative flex items-start gap-3 p-4 rounded-xl cursor-pointer text-left"
                style={{
                  background: selected ? `${opt.id === 'profesor' ? '#1270B7' : '#F43843'}08` : 'rgba(0,0,0,0.02)',
                  border: selected
                    ? `1px solid ${opt.id === 'profesor' ? '#1270B7' : '#F43843'}35`
                    : '1px solid rgba(0,0,0,0.06)',
                  boxShadow: selected ? '0 4px 16px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{
                  background: selected ? `${opt.id === 'profesor' ? '#1270B7' : '#F43843'}12` : 'rgba(0,0,0,0.04)',
                }}>
                  <Icon size={16} style={{ color: selected ? (opt.id === 'profesor' ? '#1270B7' : '#F43843') : 'rgba(0,0,0,0.35)' }} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold" style={{ color: '#1A1A1E' }}>{opt.label}</p>
                  <p className="text-[10.5px] mt-0.5 leading-snug" style={{ color: 'rgba(0,0,0,0.45)' }}>{opt.desc}</p>
                </div>
                {selected && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center" style={{
                    background: opt.id === 'profesor' ? '#1270B7' : '#F43843',
                  }}>
                    <Check size={10} strokeWidth={3} color="#FFFFFF" />
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* ── Sección: Cargo y Área ──────────────────────── */}
      <div className="flex flex-col text-center">
        <p className="text-xs font-bold mb-3" style={{ color: 'rgba(0,0,0,0.45)' }}>
          Cargo y área del personal
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-left" style={{ color: 'rgba(0,0,0,0.45)' }}>
              Cargo <span style={{ color: '#F43843' }}>*</span>
            </label>
            <select
              value={idCargo}
              onChange={e => onCargoChange(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs font-medium outline-none w-full appearance-none cursor-pointer"
              style={{
                background: 'rgba(0,0,0,0.03)',
                color: '#1A1A1E',
                border: '1px solid rgba(0,0,0,0.08)',
                paddingRight: 32,
              }}
            >
              <option value="">Seleccionar cargo</option>
              {cargos.map(c => (
                <option key={c.id_cargo ?? c.id} value={c.id_cargo ?? c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-left" style={{ color: 'rgba(0,0,0,0.45)' }}>
              Área <span style={{ color: '#F43843' }}>*</span>
            </label>
            <select
              value={idArea}
              onChange={e => onAreaChange(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs font-medium outline-none w-full appearance-none cursor-pointer"
              style={{
                background: 'rgba(0,0,0,0.03)',
                color: '#1A1A1E',
                border: '1px solid rgba(0,0,0,0.08)',
                paddingRight: 32,
              }}
            >
              <option value="">Seleccionar área</option>
              {areas.map(a => (
                <option key={a.id_area ?? a.id} value={a.id_area ?? a.id}>{a.nombre}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
