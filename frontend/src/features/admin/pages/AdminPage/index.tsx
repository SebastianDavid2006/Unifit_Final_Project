import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import AdminDashboardView from '@/features/admin/sections/AdminDashboard'
import AdminTrainers from '@/features/admin/sections/AdminTrainers'
import AdminGym from '@/features/admin/sections/AdminGym'
import AdminConfig from '@/features/admin/sections/AdminConfig'
import AdminStats from '@/features/admin/sections/AdminStats'
import BackgroundDecor from '@/shared/components/BackgroundDecor'
import Sidebar from './components/Sidebar'
import PermissionsOverlay from './components/PermissionsOverlay'
import Topbar from './components/Topbar'
import StatsCalendar from './components/StatsCalendar'
import GymFloatingToolbar from './components/GymFloatingToolbar'
import { useIsMobile } from '@/shared/components/ui/use-mobile'
import { students } from '@/data/students'
import type { AdminSection } from './data'

export function AdminPage({ onLogout }: { onLogout?: () => void }) {
  const isMobile = useIsMobile()
  const [section, setSection] = useState<AdminSection>('dashboard')
  const [expanded, setExpanded] = useState(false)
  const [trainerSearch, setTrainerSearch] = useState('')
  const [trainerSearchFocused, setTrainerSearchFocused] = useState(false)
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
    setGymSelectedStudent(null)
    setShowGymStudentFilters(false)
  }, [section])
  const trainerRef = useRef<{ clearSelection: () => void }>(null)
  const isPermissions = section === 'trainers' && trainerDetailOpen && trainerTab === 'permissions'

  return (
    <div className="flex size-full overflow-y-auto mesh-bg relative">
      <BackgroundDecor />

      <Sidebar
        expanded={expanded}
        section={section}
        onToggle={() => setExpanded(!expanded)}
        onSectionChange={setSection}
      />

      <div className="flex-1 flex flex-col overflow-y-auto relative" style={{ paddingBottom: isMobile ? '70px' : 0, paddingLeft: expanded ? '208px' : '68px', paddingRight: isMobile ? '16px' : '24px' }}>
        <PermissionsOverlay visible={isPermissions} />

        <Topbar
          section={section}
          isPermissions={isPermissions}
          trainerDetailOpen={trainerDetailOpen}
          trainerTab={trainerTab}
          onTrainerTabChange={setTrainerTab}
          onTrainerBack={() => { setTrainerDetailOpen(false); trainerRef.current?.clearSelection() }}
          trainerSearch={trainerSearch}
          onTrainerSearchChange={setTrainerSearch}
          trainerSearchFocused={trainerSearchFocused}
          onTrainerSearchFocusChange={setTrainerSearchFocused}
          gymSelectedStudent={gymSelectedStudent}
          gymStudentTab={gymStudentTab}
          onGymStudentTabChange={setGymStudentTab}
          onGymBack={() => setGymSelectedStudent(null)}
          gymTab={gymTab}
          gymStudentSearch={gymStudentSearch}
          onGymStudentSearchChange={setGymStudentSearch}
          gymStudentSearchFocused={gymStudentSearchFocused}
          onGymStudentSearchFocusChange={setGymStudentSearchFocused}
          showGymStudentFilters={showGymStudentFilters}
          onToggleGymStudentFilters={() => setShowGymStudentFilters(!showGymStudentFilters)}
          equipSearch={equipSearch}
          onEquipSearchChange={setEquipSearch}
          equipSearchFocused={equipSearchFocused}
          onEquipSearchFocusChange={setEquipSearchFocused}
          equipSearchHovered={equipSearchHovered}
          onEquipSearchHoveredChange={setEquipSearchHovered}
          equipViewMode={equipViewMode}
          onEquipViewModeChange={setEquipViewMode}
          configTab={configTab}
          onConfigTabChange={setConfigTab}
          showCareerFilter={showCareerFilter}
          onToggleCareerFilter={() => setShowCareerFilter(!showCareerFilter)}
          statsTab={statsTab}
          onStatsTabChange={setStatsTab}
          showStatsCalendar={showStatsCalendar}
          onToggleStatsCalendar={() => setShowStatsCalendar(!showStatsCalendar)}
          calendarBtnRef={calendarBtnRef}
          profileMenuOpen={profileMenuOpen}
          onProfileMenuToggle={() => setProfileMenuOpen(!profileMenuOpen)}
          onLogout={onLogout}
        />

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
            {section === 'trainers' && <AdminTrainers ref={trainerRef} search={trainerSearch} onSelectTrainer={() => setTrainerDetailOpen(true)} trainerTab={trainerTab} />}
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
        <StatsCalendar
          position={calendarPos}
          start={statsRange.start}
          end={statsRange.end}
          onStartChange={v => setStatsRange(prev => ({ ...prev, start: v }))}
          onEndChange={v => setStatsRange(prev => ({ ...prev, end: v }))}
          onClose={() => setShowStatsCalendar(false)}
          onClear={() => setStatsRange({ start: '', end: '' })}
        />
      )}

      {section === 'gym' && (
        <GymFloatingToolbar
          tab={gymTab}
          onTabChange={id => { setGymSelectedStudent(null); setGymTab(id) }}
        />
      )}
    </div>
  )
}
