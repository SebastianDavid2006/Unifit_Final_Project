import { motion } from 'motion/react'
import { Dumbbell, User, Shield, ArrowRight, Brain, Zap } from 'lucide-react'
import logotipo from '../assets/images/Logotipo.png'

interface LoginPageProps {
  onSelect: (platform: 'trainer' | 'student' | 'admin') => void
}

const roles = [
  {
    id: 'trainer' as const,
    label: 'Entrenador',
    icon: Dumbbell,
    description: 'Gestiona tus estudiantes, rutinas y evaluaciones con inteligencia artificial.',
    gradient: 'linear-gradient(135deg, #E63946, #CC0033)',
    shadow: 'rgba(230,57,70,0.2)',
    features: ['Dashboard en vivo', 'Análisis IA', 'Planes personalizados'],
  },
  {
    id: 'student' as const,
    label: 'Estudiante',
    icon: User,
    description: 'Tu progreso, rutinas y logros en un solo lugar. Entrena con propósito.',
    gradient: 'linear-gradient(135deg, #F5A623, #E89600)',
    shadow: 'rgba(245,166,35,0.2)',
    features: ['App móvil', 'Progreso visual', 'Metas diarias'],
  },
  {
    id: 'admin' as const,
    label: 'Administración',
    icon: Shield,
    description: 'Panel institucional con métricas, ocupación y predicciones del negocio.',
    gradient: 'linear-gradient(135deg, #007AFF, #0055CC)',
    shadow: 'rgba(0,122,255,0.2)',
    features: ['Métricas globales', 'Ocupación', 'Reportes IA'],
  },
]

export function LoginPage({ onSelect }: LoginPageProps) {
  return (
    <div className="size-full flex flex-col items-center justify-center relative overflow-hidden">
      <div className="floating-sphere" style={{
        width: 500, height: 500,
        background: 'radial-gradient(circle at 30% 30%, rgba(230,57,70,0.04), transparent)',
        top: '-200px', right: '-150px', animationDelay: '0s',
      }} />
      <div className="floating-sphere" style={{
        width: 350, height: 350,
        background: 'radial-gradient(circle at 70% 30%, rgba(255,107,138,0.03), transparent)',
        bottom: '-100px', left: '-100px', animationDelay: '-5s',
      }} />
      <div className="floating-sphere" style={{
        width: 200, height: 200,
        background: 'radial-gradient(circle at 50% 50%, rgba(204,0,51,0.02), transparent)',
        top: '20%', left: '10%', animationDelay: '-3s',
      }} />

      <motion.div
        className="flex flex-col items-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden" style={{
            background: 'linear-gradient(135deg, rgba(0,122,255,0.12), rgba(230,57,70,0.06), rgba(245,166,35,0.04))',
            border: '1px solid rgba(0,122,255,0.08)',
            boxShadow: '0 8px 32px rgba(0,122,255,0.12)',
          }}>
            <img src={logotipo} alt="UNIFIT" style={{ width: 32, height: 32, objectFit: 'contain' }} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-[#1A1A1E]">
            UNIFIT
          </h1>
        </div>
        <p className="text-sm font-medium tracking-[0.15em]" style={{ color: 'rgba(0,0,0,0.3)' }}>
          ECOSISTEMA INTELIGENTE DE FITNESS
        </p>

        <div className="flex items-center gap-2 mt-4 px-4 py-2 rounded-full" style={{
          background: 'linear-gradient(135deg, rgba(245,166,35,0.08), rgba(245,166,35,0.03))',
          border: '1px solid rgba(245,166,35,0.1)',
        }}>
          <Brain size={12} style={{ color: '#F5A623' }} />
          <span className="text-[11px] font-semibold" style={{ color: '#F5A623' }}>Plataforma potenciada por IA</span>
          <Zap size={12} style={{ color: '#F5A623' }} />
        </div>
      </motion.div>

      <div className="flex items-stretch gap-6 z-10 px-8">
        {roles.map((role, i) => (
          <motion.button
            key={role.id}
            onClick={() => onSelect(role.id)}
            className="premium-card flex flex-col items-start text-left p-8 w-[280px] cursor-pointer"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.2 + i * 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{
              background: role.gradient,
              boxShadow: `0 4px 16px ${role.shadow}`,
            }}>
              <role.icon size={20} className="text-white" />
            </div>

            <h3 className="text-lg font-bold text-[#1A1A1E] mb-2">{role.label}</h3>
            <p className="text-sm leading-relaxed mb-auto" style={{ color: 'rgba(0,0,0,0.45)' }}>
              {role.description}
            </p>

            <div className="flex flex-wrap gap-1.5 mt-5 mb-5">
              {role.features.map(f => (
                <span key={f} className="text-[10px] font-medium px-2.5 py-1 rounded-full" style={{
                  background: role.id === 'trainer' ? 'rgba(230,57,70,0.06)' : role.id === 'student' ? 'rgba(245,166,35,0.08)' : 'rgba(0,122,255,0.06)',
                  color: role.id === 'trainer' ? '#E63946' : role.id === 'student' ? '#F5A623' : '#007AFF',
                }}>
                  {f}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 text-sm font-semibold" style={{
              color: role.id === 'trainer' ? '#E63946' : role.id === 'student' ? '#F5A623' : '#007AFF',
            }}>
              Ingresar
              <ArrowRight size={14} />
            </div>
          </motion.button>
        ))}
      </div>

      <motion.p
        className="text-xs mt-10 z-10" style={{ color: 'rgba(0,0,0,0.2)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        Selecciona tu rol para acceder al ecosistema
      </motion.p>
    </div>
  )
}
