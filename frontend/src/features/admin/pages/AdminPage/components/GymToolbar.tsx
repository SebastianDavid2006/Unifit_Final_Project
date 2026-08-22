import { motion } from 'motion/react'
import { Menu } from 'lucide-react'
import { TABS } from '@/modules/students/StudentProfile'
import GlassSearch from '@/features/admin/components/GlassSearch'
import iconRunning from '@/assets/icons/animated/icon_running.gif'
import { PILL_GRAD, EQUIP_GRAD, EQUIP_SHADOW } from '../data'
import type { Student } from '@/data/students'

export default function GymToolbar({
  gymSelectedStudent, gymStudentTab, onGymStudentTabChange, onGymBack,
  gymTab, gymStudentSearch, onGymStudentSearchChange, gymStudentSearchFocused,
  onGymStudentSearchFocusChange, showGymStudentFilters, onToggleGymStudentFilters,
  equipSearch, onEquipSearchChange, equipSearchFocused, onEquipSearchFocusChange,
  equipSearchHovered, onEquipSearchHoveredChange, equipViewMode, onEquipViewModeChange,
}: {
  gymSelectedStudent: Student | null
  gymStudentTab: string
  onGymStudentTabChange: (t: string) => void
  onGymBack: () => void
  gymTab: string
  gymStudentSearch: string
  onGymStudentSearchChange: (v: string) => void
  gymStudentSearchFocused: boolean
  onGymStudentSearchFocusChange: (v: boolean) => void
  showGymStudentFilters: boolean
  onToggleGymStudentFilters: () => void
  equipSearch: string
  onEquipSearchChange: (v: string) => void
  equipSearchFocused: boolean
  onEquipSearchFocusChange: (v: boolean) => void
  equipSearchHovered: boolean
  onEquipSearchHoveredChange: (v: boolean) => void
  equipViewMode: 'machines' | 'exercises'
  onEquipViewModeChange: (v: 'machines' | 'exercises') => void
}) {
  return (
    <div className="flex-1 flex items-center justify-center gap-3 relative">
      {gymSelectedStudent ? (
        <>
          <div className="absolute left-0 top-1/2 -translate-y-1/2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onGymBack}
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
              <motion.button key={t.id} onClick={() => onGymStudentTabChange(t.id)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                style={{
                  background: gymStudentTab === t.id ? PILL_GRAD : 'transparent',
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
                onChange={onGymStudentSearchChange}
                focused={gymStudentSearchFocused}
                onFocusChange={onGymStudentSearchFocusChange}
                placeholder="Buscar por nombre o documento..."
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onToggleGymStudentFilters}
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
                  onClick={() => onEquipViewModeChange('machines')}
                  className="px-4 py-1.5 text-[11px] font-bold cursor-pointer rounded-lg transition-all duration-200"
                  style={{
                    background: equipViewMode === 'machines' ? EQUIP_GRAD : 'transparent',
                    color: equipViewMode === 'machines' ? '#FFFFFF' : 'rgba(0,0,0,0.35)',
                    boxShadow: equipViewMode === 'machines' ? EQUIP_SHADOW : 'none',
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
                    background: equipViewMode === 'exercises' ? EQUIP_GRAD : 'transparent',
                    color: equipViewMode === 'exercises' ? '#FFFFFF' : 'rgba(0,0,0,0.35)',
                    boxShadow: equipViewMode === 'exercises' ? EQUIP_SHADOW : 'none',
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
  )
}
