import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { LayoutDashboard, UserPlus, Settings, FileText, Bell, PanelLeftClose, PanelLeftOpen, Activity, Edit, Trash2, Building2, Users, Dumbbell, Calendar, Menu, BarChart3, GraduationCap, Briefcase, Shield, LogOut } from 'lucide-react'
import AdminDashboardView from '@/features/admin/sections/AdminDashboard'
import AdminTrainers from '@/features/admin/sections/AdminTrainers'
import AdminGym from '@/features/admin/sections/AdminGym'
import AdminConfig from '@/features/admin/sections/AdminConfig'
import AdminStats from '@/features/admin/sections/AdminStats'
import GlassSearch from '@/features/admin/components/GlassSearch'
import FilterDropdown from '@/features/admin/components/FilterDropdown'
import { TABS } from '@/modules/students/StudentProfile'
import { students } from '@/data/students'
import iconRunning from '@/assets/icons/animated/icon_running.gif'
import permissionsScene from '@/assets/scenes/permmisions_scene.png'

const RED = '#F43843'
const BLUE = '#1270B7'
const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #1A8CDB, #0D5F9E)'
const RED_GRAD = 'linear-gradient(135deg, #F43843, #FF6B8A, #CC0033)'

type AdminSection = 'dashboard' | 'trainers' | 'stats' | 'gym' | 'config'

const sidebarItems: { id: AdminSection; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'trainers', label: 'Personal', icon: UserPlus },
  { id: 'stats', label: 'Estadísticas', icon: BarChart3 },
  { id: 'gym', label: 'Gestión', icon: Building2 },
  { id: 'config', label: 'Configuración', icon: Settings },
]

export function AdminPage({ onLogout }: { onLogout?: () => void }) {
  const [section, setSection] = useState<AdminSection>('dashboard')
  const [expanded, setExpanded] = useState(false)
  const [trainerSearch, setTrainerSearch] = useState('')
  const [trainerSearchFocused, setTrainerSearchFocused] = useState(false)
  const [showTrainerFilters, setShowTrainerFilters] = useState(false)
  const [trainerRoleFilter, setTrainerRoleFilter] = useState<'all' | 'trainer' | 'admin'>('all')
  const [trainerDetailOpen, setTrainerDetailOpen] = useState(false)
  const [trainerTab, setTrainerTab] = useState('overview')
  const [gymTab, setGymTab] = useState('students')
  const [gymStudentSearch, setGymStudentSearch] = useState('')
  const [gymStudentSearchFocused, setGymStudentSearchFocused] = useState(false)
  const [showGymStudentFilters, setShowGymStudentFilters] = useState(false)
  const [gymStudentRiskFilter, setGymStudentRiskFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [gymSelectedStudent, setGymSelectedStudent] = useState<(typeof students)[0] | null>(null)
  const [gymStudentTab, setGymStudentTab] = useState('overview')
  const [equipSearch, setEquipSearch] = useState('')
  const [equipSearchFocused, setEquipSearchFocused] = useState(false)
  const [equipViewMode, setEquipViewMode] = useState<'machines' | 'exercises'>('machines')
  const [equipSearchHovered, setEquipSearchHovered] = useState(false)
  const [statsTab, setStatsTab] = useState('overview')
  const [configTab, setConfigTab] = useState('carreras')
  const [showCareerFilter, setShowCareerFilter] = useState(false)
  const [showStatsCalendar, setShowStatsCalendar] = useState(false)
  const [statsRange, setStatsRange] = useState({ start: '', end: '' })
  const [calendarPos, setCalendarPos] = useState({ top: 0, right: 0 })
  const calendarBtnRef = useRef<HTMLButtonElement>(null)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  useEffect(() => {
    if (showStatsCalendar && calendarBtnRef.current) {
      const r = calendarBtnRef.current.getBoundingClientRect()
      setCalendarPos({ top: r.bottom + 8, right: Math.round(window.innerWidth - r.right) })
    }
  }, [showStatsCalendar])

  useEffect(() => {
    setShowStatsCalendar(false)
    setShowTrainerFilters(false)
    setGymSelectedStudent(null)
    setShowGymStudentFilters(false)
  }, [section])
  const trainerRef = useRef<{ clearSelection: () => void }>(null)
  const isPermissions = section === 'trainers' && trainerDetailOpen && trainerTab === 'permissions'

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
              {idx > 0 && !(item.id === 'config') && (
                <div key={`div-${idx}`} className="h-px rounded-full my-0.5 flex-shrink-0" style={{
                  width: expanded ? 160 : 20,
                  marginLeft: expanded ? 24 : 24,
                  background: 'linear-gradient(90deg, rgba(18,112,183,0.12), rgba(244,56,67,0.08), rgba(241,200,39,0.06), transparent)',
                  transition: 'width 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
                }} />
              )}
              {idx > 0 && item.id === 'config' && <div className="flex-1 min-h-[12px]" />}
              {item.id === 'config' && (
                <div className="h-px rounded-full my-2 flex-shrink-0" style={{
                  width: expanded ? 160 : 20,
                  marginLeft: expanded ? 24 : 24,
                  background: 'linear-gradient(90deg, rgba(18,112,183,0.2), rgba(244,56,67,0.15), rgba(241,200,39,0.1), transparent)',
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
        <AnimatePresence>
          {isPermissions && (
            <motion.div
              initial={{ filter: 'blur(24px)', opacity: 0 }}
              animate={{ filter: 'blur(0px)', opacity: 1 }}
              exit={{ filter: 'blur(24px)', opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="fixed inset-0 pointer-events-none"
            >
              <div className="absolute inset-0" style={{
                backgroundImage: `url(${permissionsScene})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }} />
              <div className="absolute inset-0" style={{
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                maskImage: 'radial-gradient(ellipse at center, transparent 50%, black 75%)',
                WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 50%, black 75%)',
              }} />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="sticky top-0 z-30">
          <div className="relative px-7 pt-5 pb-3 flex items-center gap-3">
            {section === 'trainers' && trainerDetailOpen && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setTrainerDetailOpen(false); trainerRef.current?.clearSelection() }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: isPermissions ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(16px) saturate(1.5)',
                    border: `1px solid ${isPermissions ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.3)'}`,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                  }}
                >
                  <img src={iconRunning} alt="Volver" className="w-5 h-5 object-contain" style={{ transform: 'scaleX(-1)', filter: isPermissions ? 'brightness(0) invert(1)' : 'none' }} />
                </motion.button>
                <div className="flex-1 flex items-center justify-center gap-4">
                  <div className="flex items-center gap-1 rounded-2xl px-2 py-1.5" style={{
                    background: 'rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(24px) saturate(1.6)',
                    border: '1px solid rgba(255,255,255,0.25)',
                  }}>
                    <motion.button onClick={() => setTrainerTab('overview')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                      style={{
                        background: trainerTab === 'overview'
                          ? 'radial-gradient(ellipse at 20% 30%, rgba(244,56,67,0.35) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(18,112,183,0.3) 0%, transparent 50%), radial-gradient(ellipse at 50% 90%, rgba(241,200,39,0.3) 0%, transparent 50%), rgba(244,56,67,0.85)'
                          : 'transparent',
                        color: trainerTab === 'overview' ? '#FFFFFF' : isPermissions ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)',
                      }}
                    >
                      <Activity size={14} />
                      General
                    </motion.button>
                    <motion.button onClick={() => setTrainerTab('permissions')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                      style={{
                        background: trainerTab === 'permissions'
                          ? 'radial-gradient(ellipse at 20% 30%, rgba(244,56,67,0.35) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(18,112,183,0.3) 0%, transparent 50%), radial-gradient(ellipse at 50% 90%, rgba(241,200,39,0.3) 0%, transparent 50%), rgba(244,56,67,0.85)'
                          : 'transparent',
                        color: trainerTab === 'permissions' ? '#FFFFFF' : isPermissions ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)',
                      }}
                    >
                      <FileText size={14} />
                      Permisos
                    </motion.button>
                    <motion.button onClick={() => setTrainerTab('documents')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                      style={{
                        background: trainerTab === 'documents'
                          ? 'radial-gradient(ellipse at 20% 30%, rgba(244,56,67,0.35) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(18,112,183,0.3) 0%, transparent 50%), radial-gradient(ellipse at 50% 90%, rgba(241,200,39,0.3) 0%, transparent 50%), rgba(244,56,67,0.85)'
                          : 'transparent',
                        color: trainerTab === 'documents' ? '#FFFFFF' : isPermissions ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)',
                      }}
                    >
                      <FileText size={14} />
                      Documentos
                    </motion.button>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: isPermissions ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.12)', backdropFilter: 'blur(24px) saturate(1.6)', border: `1px solid ${isPermissions ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.25)'}` }}>
                      <Edit size={15} style={{ color: isPermissions ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.4)' }} />
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: isPermissions ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.12)', backdropFilter: 'blur(24px) saturate(1.6)', border: `1px solid ${isPermissions ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.25)'}` }}>
                      <Trash2 size={15} style={{ color: isPermissions ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.4)' }} />
                    </motion.button>
                  </div>
                </div>
              </>
            )}
            {section === 'trainers' && !trainerDetailOpen && (
              <div className="flex-1 flex justify-center relative">
                <div className="flex items-center gap-2 max-w-md w-full">
                  <GlassSearch
                    value={trainerSearch}
                    onChange={setTrainerSearch}
                    focused={trainerSearchFocused}
                    onFocusChange={setTrainerSearchFocused}
                    placeholder="Buscar por nombre, cargo o especialidad..."
                  />
                  <FilterDropdown
                    open={showTrainerFilters}
                    onToggle={() => setShowTrainerFilters(!showTrainerFilters)}
                    value={trainerRoleFilter}
                    onSelect={(id) => { setTrainerRoleFilter(id as 'all' | 'trainer' | 'admin'); setShowTrainerFilters(false) }}
                    buttonStyle={{ marginLeft: trainerSearchFocused ? 6 : 0 }}
                    options={[
                      { id: 'all', label: 'Todos', color: BLUE },
                      { id: 'trainer', label: 'Entrenadores', color: BLUE, icon: <GraduationCap size={13} /> },
                      { id: 'admin', label: 'Administradores', color: RED, icon: <Shield size={13} /> },
                    ]}
                  />
                </div>
              </div>
            )}
            {section === 'gym' && (
              <div className="flex-1 flex items-center justify-center gap-3 relative">
                {gymSelectedStudent ? (
                  <>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setGymSelectedStudent(null)}
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: 'rgba(255,255,255,0.2)',
                          backdropFilter: 'blur(16px) saturate(1.5)',
                          border: '1px solid rgba(255,255,255,0.3)',
                          boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                        }}
                      >
                        <img src={iconRunning} alt="Volver" className="w-5 h-5 object-contain" style={{ transform: 'scaleX(-1)' }} />
                      </motion.button>
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-2xl px-2 py-1.5" style={{
                      background: 'rgba(255,255,255,0.12)',
                      backdropFilter: 'blur(24px) saturate(1.6)',
                      border: '1px solid rgba(255,255,255,0.25)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                    }}>
                      {TABS.map(t => (
                        <motion.button key={t.id} onClick={() => setGymStudentTab(t.id)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                          style={{
                            background: gymStudentTab === t.id
                              ? 'radial-gradient(ellipse at 20% 30%, rgba(230,57,70,0.35) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(18,112,183,0.3) 0%, transparent 50%), radial-gradient(ellipse at 50% 90%, rgba(241,200,39,0.3) 0%, transparent 50%), rgba(230,57,70,0.85)'
                              : 'transparent',
                            color: gymStudentTab === t.id ? '#FFFFFF' : 'rgba(0,0,0,0.3)',
                            boxShadow: gymStudentTab === t.id ? '0 2px 8px rgba(230,57,70,0.2), 0 0 20px rgba(230,57,70,0.1)' : 'none',
                          }}
                        >
                          <t.icon size={14} />
                          {t.label}
                        </motion.button>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    {gymTab === 'students' && (
                      <div className="flex items-center gap-2 w-96 flex-shrink-0">
                        <GlassSearch
                          value={gymStudentSearch}
                          onChange={setGymStudentSearch}
                          focused={gymStudentSearchFocused}
                          onFocusChange={setGymStudentSearchFocused}
                          placeholder="Buscar por nombre o documento..."
                        />
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setShowGymStudentFilters(!showGymStudentFilters)}
                          className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                          style={{
                            marginLeft: gymStudentSearchFocused ? 6 : 0,
                            background: showGymStudentFilters ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(24px) saturate(1.6)',
                            border: showGymStudentFilters ? '1px solid rgba(255,255,255,0.6)' : '1px solid rgba(255,255,255,0.25)',
                            boxShadow: showGymStudentFilters ? '0 4px 24px rgba(0,0,0,0.08)' : '0 4px 16px rgba(0,0,0,0.03)',
                            color: showGymStudentFilters ? '#1A1A1E' : 'rgba(0,0,0,0.3)',
                          }}
                        >
                          <Menu size={18} />
                        </motion.button>
                      </div>
                    )}
                    {gymTab === 'equipment' && (
                      <div className="flex items-center justify-center gap-3 relative">
                        <div className="relative flex-shrink-0" style={{ width: 36, height: 36 }}>
                          <div
                            className="absolute top-0 h-full overflow-hidden"
                            style={{
                              right: 0,
                              width: equipSearchFocused || equipSearch || equipSearchHovered ? 356 : 36,
                              borderRadius: '9999px',
                              background: equipSearchFocused || equipSearch ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.12)',
                              backdropFilter: 'blur(24px) saturate(1.6)',
                              border: equipSearchFocused || equipSearch ? '1px solid rgba(255,255,255,0.5)' : '1px solid rgba(255,255,255,0.25)',
                              boxShadow: equipSearchFocused || equipSearch ? '0 4px 24px rgba(0,0,0,0.06)' : '0 4px 16px rgba(0,0,0,0.03)',
                              transition: 'width 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                            onMouseEnter={() => setEquipSearchHovered(true)}
                            onMouseLeave={() => setEquipSearchHovered(false)}
                          >
                            <div className="flex items-center h-full">
                              <input
                                value={equipSearch}
                                onChange={e => setEquipSearch(e.target.value)}
                                onFocus={() => setEquipSearchFocused(true)}
                                onBlur={() => setEquipSearchFocused(false)}
                                placeholder="Buscar máquina o ejercicio..."
                                className="bg-transparent border-none outline-none text-sm placeholder:text-black/20 text-[#1A1A1E] font-medium"
                                style={{
                                  flex: equipSearchFocused || equipSearch || equipSearchHovered ? '1' : '0',
                                  opacity: equipSearchFocused || equipSearch || equipSearchHovered ? 1 : 0,
                                  minWidth: 0,
                                  paddingRight: equipSearchFocused || equipSearch || equipSearchHovered ? '8px' : '0',
                                  paddingLeft: equipSearchFocused || equipSearch || equipSearchHovered ? '12px' : '0',
                                  transition: 'opacity 0.25s ease 0.1s, flex 0s 0.35s, padding 0s 0.35s',
                                }}
                              />
                              <div className="flex-shrink-0" style={{ width: 36, height: 36 }} />
                            </div>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 2 }}>
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: equipSearchFocused || equipSearch ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.3)', display: 'block' }}>
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                              </svg>
                            </motion.div>
                          </div>
                        </div>

                        <div
                          className="flex items-center rounded-xl gap-0.5 px-1"
                          style={{
                            height: 36,
                            background: 'rgba(255,255,255,0.12)',
                            backdropFilter: 'blur(24px) saturate(1.6)',
                            border: '1px solid rgba(255,255,255,0.25)',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                          }}
                        >
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setEquipViewMode('machines')}
                            className="px-4 py-1.5 text-[11px] font-bold cursor-pointer rounded-lg transition-all duration-200"
                            style={{
                              background: equipViewMode === 'machines'
                                ? 'radial-gradient(ellipse at 30% 25%, #3A9BDC 0%, transparent 60%), radial-gradient(ellipse at 75% 70%, #1270B7 0%, transparent 55%), radial-gradient(ellipse at 90% 25%, rgba(244,56,67,0.5) 0%, transparent 45%), radial-gradient(ellipse at 10% 85%, rgba(241,200,39,0.45) 0%, transparent 45%), #1270B7'
                                : 'transparent',
                              color: equipViewMode === 'machines' ? '#FFFFFF' : 'rgba(0,0,0,0.35)',
                              boxShadow: equipViewMode === 'machines' ? '0 2px 8px rgba(18,112,183,0.25)' : 'none',
                            }}
                          >
                            Máquinas
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setEquipViewMode('exercises')}
                            className="px-4 py-1.5 text-[11px] font-bold cursor-pointer rounded-lg transition-all duration-200"
                            style={{
                              background: equipViewMode === 'exercises'
                                ? 'radial-gradient(ellipse at 30% 25%, #3A9BDC 0%, transparent 60%), radial-gradient(ellipse at 75% 70%, #1270B7 0%, transparent 55%), radial-gradient(ellipse at 90% 25%, rgba(244,56,67,0.5) 0%, transparent 45%), radial-gradient(ellipse at 10% 85%, rgba(241,200,39,0.45) 0%, transparent 45%), #1270B7'
                                : 'transparent',
                              color: equipViewMode === 'exercises' ? '#FFFFFF' : 'rgba(0,0,0,0.35)',
                              boxShadow: equipViewMode === 'exercises' ? '0 2px 8px rgba(18,112,183,0.25)' : 'none',
                            }}
                          >
                            Ejercicios
                          </motion.button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
            {section === 'config' && (
              <div className="flex-1 flex items-center justify-center">
                <div className="flex items-center gap-1 rounded-2xl px-2 py-1.5" style={{
                  background: 'rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(24px) saturate(1.6)',
                  border: '1px solid rgba(255,255,255,0.25)',
                }}>
                  {([
                    { id: 'carreras', label: 'Carreras', icon: GraduationCap },
                    { id: 'areas', label: 'Áreas', icon: Building2 },
                    { id: 'cargos', label: 'Cargos', icon: Briefcase },
                    { id: 'documentos', label: 'Documentos', icon: FileText },
                  ] as const).map(t => (
                    <motion.button key={t.id} onClick={() => setConfigTab(t.id)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                      style={{
                        background: configTab === t.id
                          ? 'radial-gradient(ellipse at 20% 30%, rgba(244,56,67,0.35) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(18,112,183,0.3) 0%, transparent 50%), radial-gradient(ellipse at 50% 90%, rgba(241,200,39,0.3) 0%, transparent 50%), rgba(244,56,67,0.85)'
                          : 'transparent',
                        color: configTab === t.id ? '#FFFFFF' : 'rgba(0,0,0,0.3)',
                      }}
                    >
                      <t.icon size={14} />
                      {t.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
            {section === 'stats' && (
              <div className="flex-1 flex items-center justify-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCareerFilter(!showCareerFilter)}
                  title="Filtro de carreras"
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: showCareerFilter
                      ? 'radial-gradient(ellipse at 20% 30%, rgba(244,56,67,0.3) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(18,112,183,0.35) 0%, transparent 50%), radial-gradient(ellipse at 50% 90%, rgba(241,200,39,0.3) 0%, transparent 50%), rgba(18,112,183,0.85)'
                      : 'rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(16px) saturate(1.5)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    boxShadow: showCareerFilter ? '0 4px 20px rgba(18,112,183,0.35)' : '0 4px 16px rgba(0,0,0,0.04)',
                  }}
                >
                  <Menu size={18} style={{ color: showCareerFilter ? '#FFFFFF' : '#1270B7' }} />
                </motion.button>

                <div className="flex items-center gap-1 rounded-2xl px-2 py-1.5" style={{
                  background: 'rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(24px) saturate(1.6)',
                  border: '1px solid rgba(255,255,255,0.25)',
                }}>
                  {([
                    { id: 'overview', label: 'Resumen', icon: BarChart3 },
                    { id: 'students', label: 'Estudiantes', icon: Users },
                    { id: 'careers', label: 'Carreras', icon: GraduationCap },
                  ] as const).map(t => (
                    <motion.button key={t.id} onClick={() => setStatsTab(t.id)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                      style={{
                        background: statsTab === t.id
                          ? 'radial-gradient(ellipse at 20% 30%, rgba(244,56,67,0.35) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(18,112,183,0.3) 0%, transparent 50%), radial-gradient(ellipse at 50% 90%, rgba(241,200,39,0.3) 0%, transparent 50%), rgba(244,56,67,0.85)'
                          : 'transparent',
                        color: statsTab === t.id ? '#FFFFFF' : 'rgba(0,0,0,0.3)',
                      }}
                    >
                      <t.icon size={14} />
                      {t.label}
                    </motion.button>
                  ))}
                </div>

                <motion.button
                  ref={calendarBtnRef}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowStatsCalendar(!showStatsCalendar)}
                  title="Rango de fechas"
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: showStatsCalendar
                      ? 'radial-gradient(ellipse at 20% 30%, rgba(244,56,67,0.3) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(18,112,183,0.35) 0%, transparent 50%), radial-gradient(ellipse at 50% 90%, rgba(241,200,39,0.3) 0%, transparent 50%), rgba(18,112,183,0.85)'
                      : 'rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(16px) saturate(1.5)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    boxShadow: showStatsCalendar ? '0 4px 20px rgba(18,112,183,0.35)' : '0 4px 16px rgba(0,0,0,0.04)',
                  }}
                >
                  <Calendar size={18} style={{ color: showStatsCalendar ? '#FFFFFF' : '#1270B7' }} />
                </motion.button>
              </div>
            )}
            <div className="flex items-center gap-3 ml-auto">
              <motion.button
                whileHover={{ background: 'rgba(255,255,255,0.28)' }}
                whileTap={{ scale: 0.95 }}
                className="relative w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: isPermissions ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(24px) saturate(1.6)',
                  border: `1px solid ${isPermissions ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.25)'}`,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                }}
              >
                <Bell size={16} style={{ color: isPermissions ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.35)' }} />
                <div className="dot-alert absolute -top-1 -right-1" style={{ width: 8, height: 8 }} />
              </motion.button>

              <div className="relative flex-shrink-0">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  title="Menú de usuario"
                  className="flex items-center rounded-xl cursor-pointer overflow-hidden"
                  style={{
                    height: 38,
                    background: isPermissions ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(24px) saturate(1.6)',
                    border: `1px solid ${isPermissions ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.25)'}`,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                  }}
                >
                  <div
                    className="w-[38px] h-[38px] rounded-xl flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                    style={{ background: RED_GRAD }}
                  >
                    AD
                  </div>
                </motion.button>

                <AnimatePresence>
                  {profileMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.96, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: 6, scale: 0.96, filter: 'blur(4px)' }}
                        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute right-0 top-full mt-2 z-50 w-56 rounded-2xl overflow-hidden"
                        style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 16px 48px rgba(0,0,0,0.12)' }}
                      >
                        <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                          <p className="text-xs font-bold" style={{ color: '#1A1A1E' }}>Admin UNIFIT</p>
                          <p className="text-[10px] mt-0.5" style={{ color: 'rgba(0,0,0,0.35)' }}>Plataforma de Administración</p>
                        </div>
                        <motion.button
                          whileHover={{ background: 'rgba(244,56,67,0.06)' }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => { setProfileMenuOpen(false); onLogout?.() }}
                          className="w-full flex items-center gap-2 px-4 py-3 text-xs font-bold text-left"
                          style={{ color: '#F43843' }}
                        >
                          <LogOut size={14} />
                          Cerrar sesión
                        </motion.button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
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
            style={{ filter: showStatsCalendar ? 'blur(10px)' : 'none', transition: 'filter 0.25s ease' }}
            className="size-full"
          >
            {section === 'dashboard' && <AdminDashboardView />}
            {section === 'stats' && <AdminStats tab={statsTab} showCareerFilter={showCareerFilter} statsRange={statsRange} />}
            {section === 'trainers' && <AdminTrainers ref={trainerRef} search={trainerSearch} roleFilter={trainerRoleFilter} showFilters={showTrainerFilters} onToggleFilters={() => setShowTrainerFilters(!showTrainerFilters)} onSelectTrainer={() => setTrainerDetailOpen(true)} trainerTab={trainerTab} />}
            {section === 'gym' && (
              <AdminGym
                tab={gymTab}
                students={students}
                search={gymStudentSearch}
                riskFilter={gymStudentRiskFilter}
                showFilters={showGymStudentFilters}
                onToggleFilters={() => setShowGymStudentFilters(!showGymStudentFilters)}
                onSelectStudent={setGymSelectedStudent}
                selectedStudent={gymSelectedStudent}
                studentTab={gymStudentTab}
                onStudentTabChange={setGymStudentTab}
                equipSearch={equipSearch}
                equipSearchFocused={equipSearchFocused}
                equipViewMode={equipViewMode}
                onEquipViewModeChange={setEquipViewMode}
                onEquipSearchChange={setEquipSearch}
                onEquipSearchFocus={setEquipSearchFocused}
              />
            )}
            {section === 'config' && <AdminConfig tab={configTab} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {section === 'stats' && showStatsCalendar && (
        <>
          <div className="fixed inset-0 z-[45]" onClick={() => setShowStatsCalendar(false)} />
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="fixed z-[50] w-72 rounded-2xl p-5"
            style={{ top: calendarPos.top, right: calendarPos.right, background: '#FFFFFF', boxShadow: '0 24px 80px rgba(0,0,0,0.18)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-extrabold" style={{ color: '#1A1A1E' }}>Rango de fechas</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowStatsCalendar(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.05)' }}
              >
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="rgba(0,0,0,0.3)" strokeWidth="2" strokeLinecap="round" /></svg>
              </motion.button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold tracking-wide mb-1" style={{ color: 'rgba(0,0,0,0.4)' }}>INICIO</label>
                <input
                  type="date"
                  value={statsRange.start}
                  onChange={e => setStatsRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                  style={{ background: 'rgba(0,0,0,0.04)', color: '#1A1A1E', border: '1px solid rgba(0,0,0,0.06)' }}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-wide mb-1" style={{ color: 'rgba(0,0,0,0.4)' }}>FIN</label>
                <input
                  type="date"
                  value={statsRange.end}
                  onChange={e => setStatsRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                  style={{ background: 'rgba(0,0,0,0.04)', color: '#1A1A1E', border: '1px solid rgba(0,0,0,0.06)' }}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStatsRange({ start: '', end: '' })}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold"
                style={{ background: 'rgba(0,0,0,0.05)', color: 'rgba(0,0,0,0.4)' }}
              >
                Limpiar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowStatsCalendar(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold"
                style={{ background: BLUE_GRAD, color: '#fff', boxShadow: '0 4px 16px rgba(18,112,183,0.3)' }}
              >
                Aplicar
              </motion.button>
            </div>
          </motion.div>
        </>
      )}

      {section === 'gym' && (
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
          <div className="group relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setGymSelectedStudent(null); setGymTab('students') }}
              title="Usuarios"
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: gymTab === 'students'
                  ? 'radial-gradient(ellipse at 20% 30%, rgba(244,56,67,0.35) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(18,112,183,0.3) 0%, transparent 50%), radial-gradient(ellipse at 50% 90%, rgba(241,200,39,0.3) 0%, transparent 50%), rgba(244,56,67,0.85)'
                  : 'transparent',
                color: gymTab === 'students' ? '#FFFFFF' : 'rgba(0,0,0,0.35)',
                boxShadow: gymTab === 'students' ? '0 2px 8px rgba(244,56,67,0.25)' : 'none',
              }}
            >
              <Users size={17} />
            </motion.button>
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50"
              style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
              <p className="text-xs font-extrabold" style={{ color: '#1A1A1E' }}>Usuarios</p>
              <p className="text-[10px] font-medium mt-0.5" style={{ color: 'rgba(0,0,0,0.45)' }}>Gestiona los usuarios y su información.</p>
            </div>
          </div>
          <div className="group relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setGymSelectedStudent(null); setGymTab('equipment') }}
              title="Equipamiento"
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: gymTab === 'equipment'
                  ? 'radial-gradient(ellipse at 20% 30%, rgba(244,56,67,0.35) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(18,112,183,0.3) 0%, transparent 50%), radial-gradient(ellipse at 50% 90%, rgba(241,200,39,0.3) 0%, transparent 50%), rgba(244,56,67,0.85)'
                  : 'transparent',
                color: gymTab === 'equipment' ? '#FFFFFF' : 'rgba(0,0,0,0.35)',
                boxShadow: gymTab === 'equipment' ? '0 2px 8px rgba(244,56,67,0.25)' : 'none',
              }}
            >
              <Dumbbell size={17} />
            </motion.button>
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50"
              style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
              <p className="text-xs font-extrabold" style={{ color: '#1A1A1E' }}>Equipamiento</p>
              <p className="text-[10px] font-medium mt-0.5" style={{ color: 'rgba(0,0,0,0.45)' }}>Administra máquinas, ejercicios y su mantenimiento.</p>
            </div>
          </div>
          <div className="group relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setGymSelectedStudent(null); setGymTab('schedule') }}
              title="Agenda"
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: gymTab === 'schedule'
                  ? 'radial-gradient(ellipse at 20% 30%, rgba(244,56,67,0.35) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(18,112,183,0.3) 0%, transparent 50%), radial-gradient(ellipse at 50% 90%, rgba(241,200,39,0.3) 0%, transparent 50%), rgba(244,56,67,0.85)'
                  : 'transparent',
                color: gymTab === 'schedule' ? '#FFFFFF' : 'rgba(0,0,0,0.35)',
                boxShadow: gymTab === 'schedule' ? '0 2px 8px rgba(244,56,67,0.25)' : 'none',
              }}
            >
              <Calendar size={17} />
            </motion.button>
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50"
              style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
              <p className="text-xs font-extrabold" style={{ color: '#1A1A1E' }}>Agenda</p>
              <p className="text-[10px] font-medium mt-0.5" style={{ color: 'rgba(0,0,0,0.45)' }}>Planifica sesiones y citas del gimnasio.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
