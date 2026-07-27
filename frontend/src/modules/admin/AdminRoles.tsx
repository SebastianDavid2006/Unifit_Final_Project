import { motion } from 'motion/react'
import { Shield, Users, BookOpen, Lock } from 'lucide-react'

const RED = '#E63946'
const BLUE = '#007AFF'
const YELLOW = '#F5A623'

const roles = [
  {
    role: 'Administrador', icon: Shield, users: 3, color: RED,
    permissions: ['Dashboard', 'Entrenadores', 'Roles y Permisos', 'Configuración', 'Documentación'],
  },
  {
    role: 'Entrenador', icon: Users, users: 12, color: BLUE,
    permissions: ['Dashboard', 'Estudiantes', 'Máquinas', 'Agenda', 'Estadísticas', 'Valoraciones'],
  },
  {
    role: 'Estudiante', icon: BookOpen, users: 156, color: '#30D158',
    permissions: ['Perfil', 'Progreso', 'Rutinas', 'Agenda Personal'],
  },
]

export default function AdminRoles() {
  return (
    <div className="p-8 pt-12 space-y-6 max-w-[1440px] mx-auto relative">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${YELLOW}10`, border: `1px solid ${YELLOW}15` }}>
          <Lock size={22} style={{ color: YELLOW }} />
        </div>
        <div>
          <h1 style={{ color: '#1A1A1E', fontSize: '2rem', fontWeight: 800 }}>Roles y Permisos</h1>
          <p className="text-xs" style={{ color: 'rgba(0,0,0,0.35)' }}>Administración de roles y permisos del sistema</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {roles.map((r, i) => (
          <motion.div
            key={r.role}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl p-6"
            style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.04)', borderRadius: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${r.color}10`, border: `1px solid ${r.color}15` }}>
                <r.icon size={20} style={{ color: r.color }} />
              </div>
              <div>
                <h4 className="text-[#1D1D1F] font-bold text-sm">{r.role}</h4>
                <p className="text-[11px]" style={{ color: 'rgba(0,0,0,0.3)' }}>{r.users} usuarios</p>
              </div>
            </div>
            <div className="space-y-2">
              {r.permissions.map(p => (
                <div key={p} className="flex items-center justify-between py-2 px-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.02)' }}>
                  <span className="text-xs font-medium" style={{ color: 'rgba(0,0,0,0.5)' }}>{p}</span>
                  <div className="w-8 h-4 rounded-full relative cursor-pointer" style={{ background: `${r.color}30` }}>
                    <div className="w-3.5 h-3.5 rounded-full absolute top-0.5 right-0.5" style={{ background: r.color, boxShadow: `0 1px 4px ${r.color}40` }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
