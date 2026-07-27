import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { LayoutDashboard, UserPlus, Settings, FileText, Bell, PanelLeftClose, PanelLeftOpen, Search, Menu } from 'lucide-react'
import AdminDashboardView from '../modules/admin/AdminDashboard'
import AdminTrainers from '../modules/admin/AdminTrainers'
import AdminConfig from '../modules/admin/AdminConfig'
import AdminDocs from '../modules/admin/AdminDocs'

const RED = '#F43843'
const BLUE = '#1270B7'
const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #1A8CDB, #0D5F9E)'
const RED_GRAD = 'linear-gradient(135deg, #F43843, #FF6B8A, #CC0033)'

type AdminSection = 'dashboard' | 'trainers' | 'config' | 'docs'

const sidebarItems: { id: AdminSection; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'trainers', label: 'Entrenadores', icon: UserPlus },
  { id: 'config', label: 'Configuración', icon: Settings },
  { id: 'docs', label: 'Documentación', icon: FileText },
]

export function AdminDashboard() {
  const [section, setSection] = useState<AdminSection>('dashboard')
  const [expanded, setExpanded] = useState(false)
  const [trainerSearch, setTrainerSearch] = useState('')
  const [showTrainerFilters, setShowTrainerFilters] = useState(false)

  return (
    <div className="flex size-full overflow-hidden mesh-bg relative">
      <div className="floating-sphere" style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(18,112,183,0.25), transparent 60%)', top: '-180px', right: '-120px' }} />
      <div className="floating-sphere" style={{ width: 450, height: 450, background: 'radial-gradient(circle, rgba(244,56,67,0.2), transparent 60%)', bottom: '5%', left: '-120px' }} />
      <div className="floating-sphere" style={{ width: 350, height: 350, background: 'radial-gradient(circle, rgba(241,200,39,0.18), transparent 60%)', top: '25%', right: '15%' }} />

      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -8" result="goo" />
          </filter>
        </defs>
      </svg>

      <aside
        className={`${expanded ? 'w-52' : 'w-[68px]'} flex flex-col items-center pt-8 pb-4 gap-1 flex-shrink-0 z-50 relative`}
        style={{
          background: 'linear-gradient(180deg, #0A1A3A 0%, #2A0A10 40%, #101014 65%, #2A1E08 100%)',
          borderRight: '1px solid rgba(255,255,255,0.04)',
          overflow: 'hidden',
          transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className="flex-shrink-0" style={{ width: '100%', height: 44, marginBottom: 24, marginTop: 8 }}>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-11 h-11 rounded-xl flex items-center justify-center
              border border-transparent
              hover:bg-white/[0.06] hover:backdrop-blur-md hover:border-white/10 hover:shadow-lg"
            style={{
              position: 'absolute',
              top: 8,
              left: expanded ? 'calc(100% - 56px)' : 'calc(50% - 22px)',
              color: 'rgba(255,255,255,0.5)',
              zIndex: 60,
              transition: 'left 0.4s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
            }}
            title={expanded ? 'Colapsar' : 'Expandir'}
          >
            {expanded ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
          </button>
        </div>

        <div className="flex flex-col w-full relative flex-1">
          <div className="absolute inset-0 flex flex-col pointer-events-none" style={{ filter: 'url(#goo)' }}>
            {sidebarItems.map(item => (
              <div key={item.id} className="overflow-hidden flex-shrink-0" style={{
                height: 44,
                width: expanded ? '100%' : 68,
                borderRadius: expanded ? 10 : 0,
                transition: 'width 0.45s cubic-bezier(0.4, 0, 0.2, 1), border-radius 0.35s ease',
              }}>
                {section === item.id && false && (
                  <motion.div
                    layoutId="goo-indicator"
                    className="size-full"
                    style={{
                      background: 'linear-gradient(135deg, #e42332, #2b2c8a, #efbb29)',
                      boxShadow: 'inset 0 0 60px rgba(228,35,50,0.35), inset 0 0 120px rgba(43,44,138,0.3), 0 0 30px rgba(228,35,50,0.12), 0 0 60px rgba(43,44,138,0.06)',
                    }}
                    transition={{ type: 'spring', stiffness: 260, damping: 22, mass: 0.6 }}
                  />
                )}
              </div>
            ))}
          </div>

          {sidebarItems.map((item, idx) => (
            <>
              {idx > 0 && (
                <div key={`div-${idx}`} className="h-px rounded-full my-0.5 flex-shrink-0" style={{
                  width: expanded ? 160 : 20,
                  marginLeft: expanded ? 24 : 24,
                  background: 'linear-gradient(90deg, rgba(18,112,183,0.12), rgba(244,56,67,0.08), rgba(241,200,39,0.06), transparent)',
                  transition: 'width 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
                }} />
              )}
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                title={item.label}
                className="relative flex items-center flex-shrink-0 overflow-hidden"
                style={{
                  height: 44,
                  width: expanded ? '100%' : 68,
                  paddingLeft: 0,
                  borderRadius: expanded ? 10 : 0,
                  background: 'transparent',
                  color: section === item.id ? '#fff' : 'rgba(255,255,255,0.2)',
                  transition: 'width 0.45s cubic-bezier(0.4, 0, 0.2, 1), border-radius 0.35s ease, color 0.3s ease',
                }}
              >
                {section === item.id && (
                  <div className="absolute top-0 bottom-0 pointer-events-none" style={{
                    left: -16,
                    width: expanded ? 'calc(100% + 200px)' : 'calc(100% + 140px)',
                    background: 'linear-gradient(90deg, rgba(228,35,50,0.35) 0%, rgba(43,44,138,0.18) 22%, rgba(239,187,41,0.06) 42%, transparent 58%)',
                    filter: 'blur(8px)',
                  }} />
                )}
                <div className="flex items-center justify-center flex-shrink-0" style={{ width: 68, height: 44 }}>
                  <item.icon size={19} />
                </div>
                <span style={{
                  opacity: expanded ? 1 : 0,
                  transition: 'opacity 0.3s ease 0.05s',
                  fontSize: 12,
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                }}>
                  {item.label}
                </span>
              </button>
            </>
          ))}
        </div>
      </aside>

      <div className="flex-1 overflow-y-auto relative z-10" style={{ scrollbarGutter: 'stable' }}>
        <div className="sticky top-0 z-30">
          <div className="relative px-7 pt-5 pb-3 flex items-center gap-3">
            {section === 'trainers' && (
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-2 max-w-md w-full">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="flex items-center gap-3 px-4 py-2 rounded-2xl flex-1 min-w-0"
                    style={{
                      background: 'rgba(255,255,255,0.12)',
                      backdropFilter: 'blur(24px) saturate(1.6)',
                      border: '1px solid rgba(255,255,255,0.25)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                    }}
                  >
                    <Search size={16} style={{ color: 'rgba(0,0,0,0.3)' }} />
                    <input
                      value={trainerSearch}
                      onChange={e => setTrainerSearch(e.target.value)}
                      placeholder="Buscar entrenador..."
                      className="bg-transparent border-none outline-none text-sm w-full placeholder:text-black/20 text-[#1A1A1E] font-medium"
                    />
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowTrainerFilters(!showTrainerFilters)}
                    className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                    style={{
                      background: showTrainerFilters ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.15)',
                      backdropFilter: 'blur(24px) saturate(1.6)',
                      border: showTrainerFilters ? '1px solid rgba(255,255,255,0.6)' : '1px solid rgba(255,255,255,0.25)',
                      color: showTrainerFilters ? '#1A1A1E' : 'rgba(0,0,0,0.3)',
                    }}
                  >
                    <Menu size={18} />
                  </motion.button>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 ml-auto">
              <motion.button
                whileHover={{ background: 'rgba(255,255,255,0.28)' }}
                whileTap={{ scale: 0.95 }}
                className="relative w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(24px) saturate(1.6)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                }}
              >
                <Bell size={16} style={{ color: 'rgba(0,0,0,0.35)' }} />
                <div className="dot-alert absolute -top-1 -right-1" style={{ width: 8, height: 8 }} />
              </motion.button>

              <motion.div
                initial="initial"
                whileHover="hover"
                className="flex items-center rounded-xl cursor-pointer overflow-hidden"
                style={{
                  height: 38,
                  background: 'rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(24px) saturate(1.6)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                }}
              >
                <motion.div
                  variants={{
                    initial: { width: 0, opacity: 0, paddingRight: 0, paddingLeft: 0 },
                    hover: { width: 175, opacity: 1, paddingRight: 10, paddingLeft: 12 },
                  }}
                  transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                  className="overflow-hidden whitespace-nowrap flex items-center"
                >
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="text-[#1A1A1E] text-xs font-bold leading-none">Admin UNIFIT</p>
                      <p style={{ color: 'rgba(0,0,0,0.3)', fontSize: 9 }} className="mt-0.5">Plataforma de Administración</p>
                    </div>
                  </div>
                </motion.div>
                <div
                  className="w-[38px] h-[38px] rounded-xl flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                  style={{ background: RED_GRAD }}
                >
                  AD
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={section}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="size-full"
          >
            {section === 'dashboard' && <AdminDashboardView />}
            {section === 'trainers' && <AdminTrainers search={trainerSearch} />}
            {section === 'config' && <AdminConfig />}
            {section === 'docs' && <AdminDocs />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
