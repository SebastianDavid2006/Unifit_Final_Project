import type { RefObject } from 'react'
import TrainersToolbar from './TrainersToolbar'
import GymToolbar from './GymToolbar'
import ConfigToolbar from './ConfigToolbar'
import StatsToolbar from './StatsToolbar'
import ProfileMenu from './ProfileMenu'
import type { AdminSection } from '../data'

export default function Topbar({
  section, isPermissions,
  trainerDetailOpen, trainerTab, onTrainerTabChange, onTrainerBack,
  trainerSearch, onTrainerSearchChange, trainerSearchFocused, onTrainerSearchFocusChange,
  showTrainerFilters, onToggleTrainerFilters, trainerRoleFilter, onTrainerRoleFilterChange,
  gymSelectedStudent, gymStudentTab, onGymStudentTabChange, onGymBack, gymTab,
  gymStudentSearch, onGymStudentSearchChange, gymStudentSearchFocused, onGymStudentSearchFocusChange,
  showGymStudentFilters, onToggleGymStudentFilters,
  equipSearch, onEquipSearchChange, equipSearchFocused, onEquipSearchFocusChange,
  equipSearchHovered, onEquipSearchHoveredChange, equipViewMode, onEquipViewModeChange,
  configTab, onConfigTabChange,
  showCareerFilter, onToggleCareerFilter, statsTab, onStatsTabChange,
  showStatsCalendar, onToggleStatsCalendar, calendarBtnRef,
  profileMenuOpen, onProfileMenuToggle, onLogout,
}: {
  section: AdminSection
  isPermissions: boolean
  trainerDetailOpen: boolean
  trainerTab: string
  onTrainerTabChange: (t: string) => void
  onTrainerBack: () => void
  trainerSearch: string
  onTrainerSearchChange: (v: string) => void
  trainerSearchFocused: boolean
  onTrainerSearchFocusChange: (v: boolean) => void
  showTrainerFilters: boolean
  onToggleTrainerFilters: () => void
  trainerRoleFilter: 'all' | 'trainer' | 'admin'
  onTrainerRoleFilterChange: (v: 'all' | 'trainer' | 'admin') => void
  gymSelectedStudent: import('@/data/students').Student | null
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
  configTab: string
  onConfigTabChange: (t: string) => void
  showCareerFilter: boolean
  onToggleCareerFilter: () => void
  statsTab: string
  onStatsTabChange: (t: string) => void
  showStatsCalendar: boolean
  onToggleStatsCalendar: () => void
  calendarBtnRef: RefObject<HTMLButtonElement | null>
  profileMenuOpen: boolean
  onProfileMenuToggle: () => void
  onLogout?: () => void
}) {
  return (
    <div className="sticky top-0 z-30">
      <div className="relative px-7 pt-5 pb-3 flex items-center gap-3">
        {section === 'trainers' && (
          <TrainersToolbar
            isPermissions={isPermissions}
            trainerDetailOpen={trainerDetailOpen}
            trainerTab={trainerTab}
            onTrainerTabChange={onTrainerTabChange}
            onTrainerBack={onTrainerBack}
            trainerSearch={trainerSearch}
            onTrainerSearchChange={onTrainerSearchChange}
            trainerSearchFocused={trainerSearchFocused}
            onTrainerSearchFocusChange={onTrainerSearchFocusChange}
            showTrainerFilters={showTrainerFilters}
            onToggleTrainerFilters={onToggleTrainerFilters}
            trainerRoleFilter={trainerRoleFilter}
            onTrainerRoleFilterChange={onTrainerRoleFilterChange}
          />
        )}
        {section === 'gym' && (
          <GymToolbar
            gymSelectedStudent={gymSelectedStudent}
            gymStudentTab={gymStudentTab}
            onGymStudentTabChange={onGymStudentTabChange}
            onGymBack={onGymBack}
            gymTab={gymTab}
            gymStudentSearch={gymStudentSearch}
            onGymStudentSearchChange={onGymStudentSearchChange}
            gymStudentSearchFocused={gymStudentSearchFocused}
            onGymStudentSearchFocusChange={onGymStudentSearchFocusChange}
            showGymStudentFilters={showGymStudentFilters}
            onToggleGymStudentFilters={onToggleGymStudentFilters}
            equipSearch={equipSearch}
            onEquipSearchChange={onEquipSearchChange}
            equipSearchFocused={equipSearchFocused}
            onEquipSearchFocusChange={onEquipSearchFocusChange}
            equipSearchHovered={equipSearchHovered}
            onEquipSearchHoveredChange={onEquipSearchHoveredChange}
            equipViewMode={equipViewMode}
            onEquipViewModeChange={onEquipViewModeChange}
          />
        )}
        {section === 'config' && (
          <ConfigToolbar tab={configTab} onTabChange={onConfigTabChange} />
        )}
        {section === 'stats' && (
          <StatsToolbar
            showCareerFilter={showCareerFilter}
            onToggleCareerFilter={onToggleCareerFilter}
            statsTab={statsTab}
            onStatsTabChange={onStatsTabChange}
            showStatsCalendar={showStatsCalendar}
            onToggleStatsCalendar={onToggleStatsCalendar}
            calendarBtnRef={calendarBtnRef}
          />
        )}
        <div className="flex items-center gap-3 ml-auto">
          <ProfileMenu isPermissions={isPermissions} open={profileMenuOpen} onToggle={onProfileMenuToggle} onLogout={onLogout} />
        </div>
      </div>
    </div>
  )
}
