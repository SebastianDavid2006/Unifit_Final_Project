import TopbarSearch from './components/TopbarSearch'
import EquipmentSearch from './components/EquipmentSearch'
import StudentTabs from './components/StudentTabs'
import ProfileMenu from './components/ProfileMenu'
import { useIsMobile } from '@/shared/components/ui/use-mobile'
import type { TrainerSection } from '../TrainerSidebar'

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
  // Student detail
  selectedStudent: boolean
  studentTab: string
  onStudentTabChange: (t: string) => void
  onBack: () => void
  // Profile menu
  profileMenuOpen: boolean
  onProfileMenuToggle: () => void
  onLogout?: () => void
  onOpenProfile?: () => void
}

export default function TrainerTopbar(props: Props) {
  const isMobile = useIsMobile()
  const {
    section,
    search, onSearchChange, searchFocused, onSearchFocusChange,
    showStudentsFilters, onToggleStudentsFilters,
    agendaSearch, onAgendaSearchChange, agendaSearchFocused, onAgendaSearchFocusChange,
    equipSearch, onEquipSearchChange, equipSearchFocused, onEquipSearchFocusChange,
    equipSearchHovered, onEquipSearchHoveredChange,
    equipViewMode, onEquipViewModeChange,
    selectedStudent, studentTab, onStudentTabChange, onBack,
    profileMenuOpen, onProfileMenuToggle, onLogout, onOpenProfile,
  } = props

  return (
    <div className="sticky top-0 z-30">
      <div className="relative px-7 pt-5 pb-3 flex items-center gap-3">
        {!selectedStudent && section === 'students' && (
          <>
            {isMobile && (
              <div className="absolute left-1/2 -translate-x-1/2 top-5">
                <button className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xl font-bold" style={{ background: 'linear-gradient(135deg, #1270B7, #7ec8e3)', boxShadow: '0 4px 16px rgba(18,112,183,0.35)' }}>
                  +
                </button>
              </div>
            )}
            <TopbarSearch
              value={search}
              onChange={onSearchChange}
              focused={searchFocused}
              onFocusChange={onSearchFocusChange}
              placeholder="Buscar por nombre o documento..."
              withFilters
              filtersActive={showStudentsFilters}
              onToggleFilters={onToggleStudentsFilters}
            />
          </>
        )}
        {!selectedStudent && section === 'schedule' && (
          <TopbarSearch
            value={agendaSearch}
            onChange={onAgendaSearchChange}
            focused={agendaSearchFocused}
            onFocusChange={onAgendaSearchFocusChange}
            placeholder="Buscar en agenda..."
          />
        )}
        {!selectedStudent && section === 'equipment' && (
          <EquipmentSearch
            search={equipSearch}
            onSearchChange={onEquipSearchChange}
            focused={equipSearchFocused}
            onFocusChange={onEquipSearchFocusChange}
            hovered={equipSearchHovered}
            onHoveredChange={onEquipSearchHoveredChange}
            viewMode={equipViewMode}
            onViewModeChange={onEquipViewModeChange}
          />
        )}
        {selectedStudent && (
          <StudentTabs
            studentTab={studentTab}
            onStudentTabChange={onStudentTabChange}
            onBack={onBack}
          />
        )}
        <div className="flex items-center gap-3 ml-auto">
          <ProfileMenu
            open={profileMenuOpen}
            onToggle={onProfileMenuToggle}
            onLogout={onLogout}
            onOpenProfile={onOpenProfile}
          />
        </div>
      </div>
    </div>
  )
}
