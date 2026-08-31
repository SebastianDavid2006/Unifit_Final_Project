import { useState } from 'react'
import { useLocation, useNavigate, Outlet } from 'react-router'
import { motion, AnimatePresence } from 'motion/react'
import { cerrarSesion } from '@/lib/auth'
import StudentsModule from '@/modules/students/StudentsModule'
import AgendaModule from '@/modules/agenda/AgendaModule'
import TrainerDashboard from '@/features/trainer/sections/TrainerDashboard'
import TrainerSidebar, { type TrainerSection } from '@/features/trainer/components/TrainerSidebar'
import TrainerTopbar from '@/features/trainer/components/TrainerTopbar'
import BackgroundDecor from '@/shared/components/BackgroundDecor'
import { useIsMobile } from '@/shared/components/ui/use-mobile'
import { students } from '@/data/students'

const PATH_TO_SECTION: Record<string, TrainerSection> = {
  '/entrenador/dashboard': 'dashboard',
  '/entrenador/usuarios': 'students',
  '/entrenador/equipamiento/maquinas': 'equipment',
  '/entrenador/equipamiento/ejercicios': 'equipment',
  '/entrenador/agenda': 'schedule',
}

export function TrainerPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const section = PATH_TO_SECTION[location.pathname] || 'dashboard'
  const isSubRoute = /\/entrenador\/(usuarios\/\d+|equipamiento\/(maquinas|ejercicios))/.test(location.pathname)
  const isStudentDetail = /\/entrenador\/usuarios\/\d+/.test(location.pathname)
  const [expanded, setExpanded] = useState(false)
  const [search, setSearch] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [agendaSearch, setAgendaSearch] = useState('')
  const [agendaSearchFocused, setAgendaSearchFocused] = useState(false)
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [equipSearch, setEquipSearch] = useState('')
  const [equipSearchFocused, setEquipSearchFocused] = useState(false)
  const equipViewMode = location.pathname.includes('/ejercicios') ? 'exercises' : 'machines'
  const [equipSearchHovered, setEquipSearchHovered] = useState(false)
  const [showStudentsFilters, setShowStudentsFilters] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  const handleSectionChange = (s: TrainerSection) => {
    const paths: Record<TrainerSection, string> = {
      dashboard: '/entrenador/dashboard',
      students: '/entrenador/usuarios',
      equipment: '/entrenador/equipamiento/maquinas',
      schedule: '/entrenador/agenda',
    }
    navigate(paths[s])
  }

  const handleLogout = () => {
    cerrarSesion()
    navigate('/login')
  }


  return (
    <div className="flex size-full overflow-y-auto mesh-bg relative">
      <BackgroundDecor />

      <TrainerSidebar
        section={section}
        expanded={expanded}
        onToggle={() => setExpanded(!expanded)}
        onSectionChange={handleSectionChange}
      />

      <div className="flex-1 overflow-y-auto overflow-x-hidden relative z-10" style={{ scrollbarGutter: 'stable', paddingBottom: isMobile ? '70px' : 0, paddingLeft: expanded ? '208px' : '68px', paddingRight: isMobile ? '16px' : '24px', maxWidth: '100%' }}>
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
          onEquipViewModeChange={(v) => navigate(v === 'machines' ? '/entrenador/equipamiento/maquinas' : '/entrenador/equipamiento/ejercicios')}
          selectedStudent={isStudentDetail}
          studentTab="overview"
          onStudentTabChange={() => {}}
          onBack={() => navigate('/entrenador/usuarios')}
          profileMenuOpen={profileMenuOpen}
          onProfileMenuToggle={() => setProfileMenuOpen(!profileMenuOpen)}
          onLogout={handleLogout}
        />

        {isSubRoute ? (
          <Outlet />
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
                  onSelectStudent={(s) => navigate(`/entrenador/usuarios/${s.id}`)}
                  showFilters={showStudentsFilters}
                  onToggleFilters={() => setShowStudentsFilters(!showStudentsFilters)}
                />
              )}
              {section === 'schedule' && <AgendaModule students={students} />}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
