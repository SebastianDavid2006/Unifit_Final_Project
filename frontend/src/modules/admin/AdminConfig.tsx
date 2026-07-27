import { motion } from 'motion/react'
import { Settings, Moon, Globe, Bell, Lock } from 'lucide-react'

const YELLOW = '#F5A623'

const configItems = [
  { icon: Globe, label: 'Idioma', desc: 'Cambiar idioma del sistema', value: 'Español' },
  { icon: Moon, label: 'Tema', desc: 'Claro / Oscuro', value: 'Claro' },
  { icon: Bell, label: 'Notificaciones', desc: 'Gestionar preferencias de notificación', value: 'Activadas' },
  { icon: Lock, label: 'Seguridad', desc: 'Configuración de seguridad y sesión', value: '2FA Activa' },
]

export default function AdminConfig() {
  return (
    <div className="p-8 pt-12 space-y-6 max-w-[1440px] mx-auto relative">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${YELLOW}10`, border: `1px solid ${YELLOW}15` }}>
          <Settings size={22} style={{ color: YELLOW }} />
        </div>
        <div>
          <h1 style={{ color: '#1A1A1E', fontSize: '2rem', fontWeight: 800 }}>Configuración</h1>
          <p className="text-xs" style={{ color: 'rgba(0,0,0,0.35)' }}>Ajustes generales del sistema</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {configItems.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl p-5 flex items-center justify-between cursor-pointer"
            style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${YELLOW}08`, border: `1px solid ${YELLOW}10` }}>
                <item.icon size={18} style={{ color: YELLOW }} />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: '#1D1D1F' }}>{item.label}</p>
                <p className="text-[11px] mt-0.5" style={{ color: 'rgba(0,0,0,0.3)' }}>{item.desc}</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ background: 'rgba(0,0,0,0.03)', color: 'rgba(0,0,0,0.4)' }}>{item.value}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
