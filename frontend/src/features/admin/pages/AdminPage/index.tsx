import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate, Outlet } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { api, mensajeError } from '@/lib/api'
import { cerrarSesion } from '@/lib/auth'
import AdminDashboardView from '@/features/admin/sections/AdminDashboard'
import AdminTrainers from '@/features/admin/sections/AdminTrainers'
import AdminGym from '@/features/admin/sections/AdminGym'
import AdminConfig from '@/features/admin/sections/AdminConfig'
import AdminStats from '@/features/admin/sections/AdminStats'
import BackgroundDecor from '@/shared/components/BackgroundDecor'
import StaffProfile from '@/shared/components/StaffProfile'
import Sidebar from './components/Sidebar'
import PermissionsOverlay from './components/PermissionsOverlay'
import Topbar from './components/Topbar'
import StatsCalendar from './components/StatsCalendar'
import GymFloatingToolbar from './components/GymFloatingToolbar'
import { useIsMobile } from '@/shared/components/ui/use-mobile'
import { mapBackendToStudent, getUsuarios } from '@/services/usuario.service'
import type { Student } from '@/data/students'
import type { AdminSection } from './data'

const PATH_TO_SECTION: Record<string, AdminSection> = {
  '/admin/dashboard': 'dashboard',
  '/admin/personal': 'trainers',
  '/admin/estadisticas': 'stats',
  '/admin/gestion': 'gym',
  '/admin/configuracion': 'config',
}

const SECTION_PATHS: Record<AdminSection, string> = {
  dashboard: '/admin/dashboard',
  trainers: '/admin/personal',
  stats: '/admin/estadisticas',
  gym: '/admin/gestion',
  config: '/admin/configuracion',
}

function isGestionPath(pathname: string): boolean {
  return pathname.startsWith('/admin/gestion')
}

export function AdminPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const isGestion = isGestionPath(location.pathname)
  const section = isGestion ? 'gym' : (PATH_TO_SECTION[location.pathname] || 'dashboard')
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
  const [gymSelectedStudent, setGymSelectedStudent] = useState<Student | null>(null)
  const [gymStudentTab, setGymStudentTab] = useState('general')
  const [equipSearch, setEquipSearch] = useState('')
  const [equipSearchFocused, setEquipSearchFocused] = useState(false)
  const equipViewMode = location.pathname.includes('/ejercicios') ? 'exercises' : 'machines'
  const gymTabFromUrl = location.pathname.includes('/equipamiento') ? 'equipment'
    : location.pathname.includes('/agenda') ? 'schedule'
    : 'students'
  const [equipSearchHovered, setEquipSearchHovered] = useState(false)
  const [statsTab, setStatsTab] = useState('overview')
  const [configTab, setConfigTab] = useState('carreras')
  const [showCareerFilter, setShowCareerFilter] = useState(false)
  const [showStatsCalendar, setShowStatsCalendar] = useState(false)
  const [statsRange, setStatsRange] = useState({ start: '', end: '' })
  const [calendarPos, setCalendarPos] = useState({ top: 0, right: 0 })
  const calendarBtnRef = useRef<HTMLButtonElement>(null)
  const trainerRef = useRef<{ clearSelection: () => void }>(null)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [showStaffProfile, setShowStaffProfile] = useState(false)
  const [students, setStudents] = useState<Student[]>([])
  const [studentsLoading, setStudentsLoading] = useState(true)

  const handleSectionChange = (s: AdminSection) => {
    navigate(SECTION_PATHS[s])
  }

  const handleLogout = () => {
    cerrarSesion()
    navigate('/login')
  }

  useEffect(() => {
    if (showStatsCalendar && calendarBtnRef.current) {
      const r = calendarBtnRef.current.getBoundingClientRect()
      setCalendarPos({ top: r.bottom + 8, right: Math.round(window.innerWidth - r.right) })
    }
  }, [showStatsCalendar])

  useEffect(() => {
    setShowStatsCalendar(false)
    if (!isGestion) {
      setGymSelectedStudent(null)
      setShowGymStudentFilters(false)
    }
  }, [section, isGestion])

  useEffect(() => {
    setStudentsLoading(true)
    getUsuarios()
      .then(res => setStudents(res.map(mapBackendToStudent)))
      .catch(() => {})
      .finally(() => setStudentsLoading(false))
  }, [])
  const isPermissions = section === 'trainers' && trainerDetailOpen && trainerTab === 'permissions'

  return (
    <div className="flex size-full overflow-y-auto mesh-bg relative">
      <BackgroundDecor />

      <Sidebar
        expanded={expanded}
        section={section}
        onToggle={() => setExpanded(!expanded)}
        onSectionChange={handleSectionChange}
      />

      <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden relative" style={{ paddingBottom: isMobile ? '70px' : 0, paddingLeft: expanded ? '208px' : '68px', paddingRight: isMobile ? '16px' : '24px', maxWidth: '100%' }}>
        <PermissionsOverlay visible={isPermissions} />

        <Topbar
          section={isGestion ? 'gym' : section}
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
          gymTab={isGestion ? gymTabFromUrl : gymTab}
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
          onEquipViewModeChange={(v) => navigate(v === 'machines' ? '/admin/gestion/equipamiento/maquinas' : '/admin/gestion/equipamiento/ejercicios')}
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
          onLogout={handleLogout}
          onOpenProfile={() => { setProfileMenuOpen(false); setShowStaffProfile(true) }}
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
            {section === 'gym' && isGestion && <Outlet />}
            {section === 'gym' && !isGestion && (
              <AdminGym
                tab={gymTab}
                students={students}
                search={gymStudentSearch}
                riskFilter={gymStudentRiskFilter}
                showFilters={showGymStudentFilters}
                onToggleFilters={() => setShowGymStudentFilters(!showGymStudentFilters)}
                onSelectStudent={(s) => navigate(`/admin/gestion/usuarios/${s.id}/overview`)}
                selectedStudent={gymSelectedStudent}
                studentTab={gymStudentTab}
                onStudentTabChange={setGymStudentTab}
                equipSearch={equipSearch}
                equipSearchFocused={equipSearchFocused}
                equipViewMode={equipViewMode}
                onEquipViewModeChange={(v) => navigate(v === 'machines' ? '/admin/gestion/equipamiento/maquinas' : '/admin/gestion/equipamiento/ejercicios')}
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

      {section === 'gym' && !isGestion && (
        <GymFloatingToolbar
          tab={gymTab}
          onTabChange={id => { setGymSelectedStudent(null); setGymTab(id) }}
        />
      )}

      <StaffProfile open={showStaffProfile} onClose={() => setShowStaffProfile(false)} />
    </div>
  )
}
