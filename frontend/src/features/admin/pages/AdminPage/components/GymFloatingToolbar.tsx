import { motion } from 'motion/react'
import { Users, Dumbbell, Calendar } from 'lucide-react'
import { PILL_GRAD, GYM_FLOAT_SHADOW } from '../data'

export default function GymFloatingToolbar({ tab, onTabChange }: {
  tab: string
  onTabChange: (t: 'students' | 'equipment' | 'schedule') => void
}) {
  const items = [
    { id: 'students', label: 'Usuarios', desc: 'Gestiona los usuarios y su información.', icon: Users },
    { id: 'equipment', label: 'Equipamiento', desc: 'Administra máquinas, ejercicios y su mantenimiento.', icon: Dumbbell },
    { id: 'schedule', label: 'Agenda', desc: 'Planifica sesiones y citas del gimnasio.', icon: Calendar },
  ] as const

  return (
    <div className="fixed z-40 flex flex-col gap-1.5 p-1.5 rounded-2xl" style={{
      top: '50%',
      right: 20,
      transform: 'translateY(-50%)',
      background: 'rgba(255,255,255,0.12)',
      backdropFilter: 'blur(24px) saturate(1.6)',
      WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
      border: '1px solid rgba(255,255,255,0.25)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
    }}>
      {items.map(item => (
        <div key={item.id} className="group relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onTabChange(item.id)}
            title={item.label}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: tab === item.id ? PILL_GRAD : 'transparent',
              color: tab === item.id ? '#FFFFFF' : 'rgba(0,0,0,0.35)',
              boxShadow: tab === item.id ? GYM_FLOAT_SHADOW : 'none',
            }}
          >
            <item.icon size={17} />
          </motion.button>
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50"
            style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
            <p className="text-xs font-extrabold" style={{ color: '#1A1A1E' }}>{item.label}</p>
            <p className="text-[10px] font-medium mt-0.5" style={{ color: 'rgba(0,0,0,0.45)' }}>{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
