import { motion, AnimatePresence } from 'motion/react'
import { Search, Menu, Bell, LogOut, Filter } from 'lucide-react'
import { TABS } from '../../modules/students/StudentProfile'
import iconRunning from '../../assets/icons/animated/icon_running.gif'
import type { TrainerSection } from './TrainerSidebar'

const RED_GRAD = 'linear-gradient(135deg, #F43843, #FF6B8A, #CC0033)'

interface Props {
  section: TrainerSection
  // Students search
  search: string
  onSearchChange: (v: string) => void
  searchFocused: boolean
  onSearchFocusChange: (v: boolean) => void
  showStudentsFilters: boolean
  onToggleStudentsFilters: () => void
  // Agenda search
  agendaSearch: string
  onAgendaSearchChange: (v: string) => void
  agendaSearchFocused: boolean
  onAgendaSearchFocusChange: (v: boolean) => void
  // Equipment search
  equipSearch: string
  onEquipSearchChange: (v: string) => void
  equipSearchFocused: boolean
  onEquipSearchFocusChange: (v: boolean) => void
  equipSearchHovered: boolean
  onEquipSearchHoveredChange: (v: boolean) => void
  equipViewMode: 'machines' | 'exercises'
  onEquipViewModeChange: (v: 'machines' | 'exercises') => void
  showEquipFilters: boolean
  onToggleEquipFilters: () => void
  equipStatusFilter: 'active' | 'maintenance' | 'inactive' | 'all'
  onEquipStatusFilterChange: (v: 'active' | 'maintenance' | 'inactive' | 'all') => void
  // Student detail
  selectedStudent: boolean
  studentTab: string
  onStudentTabChange: (t: string) => void
  onBack: () => void
  // Profile menu
  profileMenuOpen: boolean
  onProfileMenuToggle: () => void
  onLogout?: () => void
}

export default function TrainerTopbar(props: Props) {
  const {
    section,
    search, onSearchChange, searchFocused, onSearchFocusChange,
    showStudentsFilters, onToggleStudentsFilters,
    agendaSearch, onAgendaSearchChange, agendaSearchFocused, onAgendaSearchFocusChange,
    equipSearch, onEquipSearchChange, equipSearchFocused, onEquipSearchFocusChange,
    equipSearchHovered, onEquipSearchHoveredChange,
    equipViewMode, onEquipViewModeChange,
    showEquipFilters, onToggleEquipFilters, equipStatusFilter, onEquipStatusFilterChange,
    selectedStudent, studentTab, onStudentTabChange, onBack,
    profileMenuOpen, onProfileMenuToggle, onLogout,
  } = props

  return (
    <div className="sticky top-0 z-30">
      <div className="relative px-7 pt-5 pb-3 flex items-center gap-3">
      {!selectedStudent && section === 'students' && (
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2 max-w-md w-full">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0, scaleX: searchFocused ? 1.04 : 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="flex items-center gap-3 px-4 py-2 rounded-2xl flex-1 min-w-0"
              style={{
                background: searchFocused ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(24px) saturate(1.6)',
                border: searchFocused ? '1px solid rgba(255,255,255,0.5)' : '1px solid rgba(255,255,255,0.25)',
                boxShadow: searchFocused ? '0 4px 24px rgba(0,0,0,0.06)' : '0 4px 16px rgba(0,0,0,0.03)',
                transformOrigin: 'center',
              }}
            >
              <Search size={16} style={{ color: searchFocused ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.3)' }} />
              <input
                value={search}
                onChange={e => onSearchChange(e.target.value)}
                onFocus={() => onSearchFocusChange(true)}
                onBlur={() => onSearchFocusChange(false)}
                placeholder="Buscar por nombre o documento..."
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-black/20 text-[#1A1A1E] font-medium"
              />
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onToggleStudentsFilters}
              className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
              style={{
                marginLeft: searchFocused ? 6 : 0,
                background: showStudentsFilters ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(24px) saturate(1.6)',
                border: showStudentsFilters ? '1px solid rgba(255,255,255,0.6)' : '1px solid rgba(255,255,255,0.25)',
                boxShadow: showStudentsFilters ? '0 4px 24px rgba(0,0,0,0.08)' : '0 4px 16px rgba(0,0,0,0.03)',
                color: showStudentsFilters ? '#1A1A1E' : 'rgba(0,0,0,0.3)',
              }}
            >
              <Menu size={18} />
            </motion.button>
          </div>
        </div>
      )}
      {!selectedStudent && section === 'schedule' && (
        <div className="flex-1 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0, scaleX: agendaSearchFocused ? 1.04 : 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="flex items-center gap-3 px-4 py-2 rounded-2xl max-w-md w-full"
            style={{
              background: agendaSearchFocused ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(24px) saturate(1.6)',
              border: agendaSearchFocused ? '1px solid rgba(255,255,255,0.5)' : '1px solid rgba(255,255,255,0.25)',
              boxShadow: agendaSearchFocused ? '0 4px 24px rgba(0,0,0,0.06)' : '0 4px 16px rgba(0,0,0,0.03)',
              transformOrigin: 'center',
            }}
          >
            <Search size={16} style={{ color: agendaSearchFocused ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.3)' }} />
            <input
              value={agendaSearch}
              onChange={e => onAgendaSearchChange(e.target.value)}
              onFocus={() => onAgendaSearchFocusChange(true)}
              onBlur={() => onAgendaSearchFocusChange(false)}
              placeholder="Buscar en agenda..."
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-black/20 text-[#1A1A1E] font-medium"
            />
          </motion.div>
        </div>
      )}
      {!selectedStudent && section === 'equipment' && (
        <div className="flex-1 flex items-center justify-center gap-3 relative">
          {/* ── Collapsible Search (icon fixed, input fades left) ── */}
          <div className="relative flex-shrink-0" style={{ width: 36, height: 36 }}>
            {/* Background pill — right-anchored, grows left */}
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
              onMouseEnter={() => onEquipSearchHoveredChange(true)}
              onMouseLeave={() => onEquipSearchHoveredChange(false)}
            >
              <div className="flex items-center h-full">
                <input
                  value={equipSearch}
                  onChange={e => onEquipSearchChange(e.target.value)}
                  onFocus={() => onEquipSearchFocusChange(true)}
                  onBlur={() => onEquipSearchFocusChange(false)}
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
            {/* Icon — always fixed, no background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 2 }}>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: equipSearchFocused || equipSearch ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.3)', display: 'block' }}>
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </motion.div>
            </div>
          </div>

          {/* ── Máquinas / Ejercicios Toggle Pill ── */}
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
              onClick={() => onEquipViewModeChange('machines')}
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
              onClick={() => onEquipViewModeChange('exercises')}
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

          <div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleEquipFilters}
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: showEquipFilters ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(24px) saturate(1.6)',
                border: showEquipFilters ? '1px solid rgba(255,255,255,0.5)' : '1px solid rgba(255,255,255,0.25)',
                color: showEquipFilters ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.35)',
              }}
            >
              <Filter size={16} />
            </motion.button>
          </div>
          <AnimatePresence>
            {showEquipFilters && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.93, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -6, scale: 0.93, filter: 'blur(6px)' }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 flex gap-1.5 p-2 rounded-xl"
                style={{
                  background: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(24px) saturate(1.6)',
                  border: '1px solid rgba(255,255,255,0.5)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                }}
              >
                {(['all', 'active', 'maintenance', 'inactive'] as const).map(s => {
                  const label = s === 'all' ? 'Todas' : s === 'active' ? 'Activo' : s === 'maintenance' ? 'Mantenimiento' : 'Inactiva'
                  const color = s === 'all' ? '#1270B7' : s === 'active' ? '#30D158' : s === 'maintenance' ? '#F1C827' : '#F43843'
                  return (
                      <motion.button
                        key={s}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => onEquipStatusFilterChange(s)}
                        className="px-3 py-1.5 rounded-xl text-[11px] font-bold tracking-wide whitespace-nowrap transition-all"
                        style={{
                          background: equipStatusFilter === s ? `${color}15` : 'transparent',
                          color: equipStatusFilter === s ? color : 'rgba(0,0,0,0.3)',
                          border: `1px solid ${equipStatusFilter === s ? `${color}30` : 'transparent'}`,
                        }}
                      >
                        {label}
                      </motion.button>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>
        </div>
      )}

      {selectedStudent && (
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onBack}
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
      )}

      {selectedStudent && (
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-2xl px-2 py-1.5" style={{
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(24px) saturate(1.6)',
          border: '1px solid rgba(255,255,255,0.25)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
        }}>
          {TABS.map(t => (
            <motion.button key={t.id} onClick={() => onStudentTabChange(t.id)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all"
              style={{
                background: studentTab === t.id
                  ? 'radial-gradient(ellipse at 20% 30%, rgba(230,57,70,0.35) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(18,112,183,0.3) 0%, transparent 50%), radial-gradient(ellipse at 50% 90%, rgba(241,200,39,0.3) 0%, transparent 50%), rgba(230,57,70,0.85)'
                  : 'transparent',
                color: studentTab === t.id ? '#FFFFFF' : 'rgba(0,0,0,0.3)',
                boxShadow: studentTab === t.id ? '0 2px 8px rgba(230,57,70,0.2), 0 0 20px rgba(230,57,70,0.1)' : 'none',
              }}
            >
              <t.icon size={14} />
              {t.label}
            </motion.button>
          ))}
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

        <div className="relative flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={onProfileMenuToggle}
            title="Menú de usuario"
            className="flex items-center rounded-xl cursor-pointer overflow-hidden"
            style={{
              height: 38,
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(24px) saturate(1.6)',
              border: '1px solid rgba(255,255,255,0.25)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
            }}
          >
            <div
              className="w-[38px] h-[38px] rounded-xl flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
              style={{ background: RED_GRAD }}
            >
              SM
            </div>
          </motion.button>

          <AnimatePresence>
            {profileMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={onProfileMenuToggle} />
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: 6, scale: 0.96, filter: 'blur(4px)' }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-0 top-full mt-2 z-50 w-56 rounded-2xl overflow-hidden"
                  style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 16px 48px rgba(0,0,0,0.12)' }}
                >
                  <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <p className="text-xs font-bold" style={{ color: '#1A1A1E' }}>Sebastián Morales</p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'rgba(0,0,0,0.35)' }}>Plataforma de Entrenadores</p>
                  </div>
                  <motion.button
                    whileHover={{ background: 'rgba(244,56,67,0.06)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { onProfileMenuToggle(); onLogout?.() }}
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
  )
}
