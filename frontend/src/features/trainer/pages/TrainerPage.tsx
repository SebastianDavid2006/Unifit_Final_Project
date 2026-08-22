import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { StudentProfile, TABS } from '@/modules/students/StudentProfile'
import StudentsModule from '@/modules/students/StudentsModule'
import AgendaModule from '@/modules/agenda/AgendaModule'
import EquipmentPage from '@/modules/equipment/EquipmentPage'
import TrainerDashboard from '@/features/trainer/sections/TrainerDashboard'
import TrainerSidebar, { type TrainerSection } from '@/features/trainer/components/TrainerSidebar'
import TrainerTopbar from '@/features/trainer/components/TrainerTopbar'
import BackgroundDecor from '@/shared/components/BackgroundDecor'
import { useIsMobile } from '@/shared/components/ui/use-mobile'
import { students } from '@/data/students'

export function TrainerPage({ onLogout }: { onLogout?: () => void }) {
  const isMobile = useIsMobile()
  const [section, setSection] = useState<TrainerSection>('dashboard')
  const [expanded, setExpanded] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<typeof students[0] | null>(null)
  const [studentTab, setStudentTab] = useState('overview')
  const [search, setSearch] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [agendaSearch, setAgendaSearch] = useState('')
  const [agendaSearchFocused, setAgendaSearchFocused] = useState(false)
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [equipSearch, setEquipSearch] = useState('')
  const [equipSearchFocused, setEquipSearchFocused] = useState(false)
  const [equipViewMode, setEquipViewMode] = useState<'machines' | 'exercises'>('machines')
  const [equipSearchHovered, setEquipSearchHovered] = useState(false)
  const [showStudentsFilters, setShowStudentsFilters] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  const renderEquipment = () => (
    <EquipmentPage
      search={equipSearch}
      searchFocused={equipSearchFocused}
      viewMode={equipViewMode}
      onViewModeChange={setEquipViewMode}
      onSearchChange={setEquipSearch}
      onSearchFocus={setEquipSearchFocused}
    />
  )

  return (
    <div className="flex size-full overflow-y-auto mesh-bg relative">
      <BackgroundDecor />

      <TrainerSidebar
        section={section}
        expanded={expanded}
        onToggle={() => setExpanded(!expanded)}
        onSectionChange={setSection}
      />

      <div className="flex-1 overflow-y-auto relative z-10" style={{ scrollbarGutter: 'stable', paddingBottom: isMobile ? '70px' : 0, paddingLeft: expanded ? '208px' : '68px' }}>
        <TrainerTopbar
          section={section}
          search={search}
          onSearchChange={setSearch}
          searchFocused={searchFocused}
          onSearchFocusChange={setSearchFocused}
          showStudentsFilters={showStudentsFilters}
          onToggleStudentsFilters={() => setShowStudentsFilters(!showStudentsFilters)}
          agendaSearch={agendaSearch}
          onAgendaSearchChange={setAgendaSearch}
          agendaSearchFocused={agendaSearchFocused}
          onAgendaSearchFocusChange={setAgendaSearchFocused}
          equipSearch={equipSearch}
          onEquipSearchChange={setEquipSearch}
          equipSearchFocused={equipSearchFocused}
          onEquipSearchFocusChange={setEquipSearchFocused}
          equipSearchHovered={equipSearchHovered}
          onEquipSearchHoveredChange={setEquipSearchHovered}
          equipViewMode={equipViewMode}
          onEquipViewModeChange={setEquipViewMode}
          selectedStudent={!!selectedStudent}
          studentTab={studentTab}
          onStudentTabChange={setStudentTab}
          onBack={() => setSelectedStudent(null)}
          profileMenuOpen={profileMenuOpen}
          onProfileMenuToggle={() => setProfileMenuOpen(!profileMenuOpen)}
          onLogout={onLogout}
        />

        {selectedStudent ? (
          <StudentProfile student={selectedStudent} tab={studentTab} onTabChange={setStudentTab} canCreateValuation={false} />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {section === 'dashboard' && <TrainerDashboard />}
              {section === 'students' && (
                <StudentsModule
                  students={students}
                  search={search}
                  riskFilter={riskFilter}
                  onSelectStudent={setSelectedStudent}
                  showFilters={showStudentsFilters}
                  onToggleFilters={() => setShowStudentsFilters(!showStudentsFilters)}
                />
              )}
              {section === 'equipment' && renderEquipment()}
              {section === 'schedule' && <AgendaModule students={students} />}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
