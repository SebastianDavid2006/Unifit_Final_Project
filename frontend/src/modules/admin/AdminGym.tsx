import { StudentProfile } from '../students/StudentProfile'
import StudentsModule from '../students/StudentsModule'
import AgendaModule from '../agenda/AgendaModule'
import EquipmentPage from '../../pages/EquipmentPage'
import type { Status } from '../../data/types'
import type { Student } from '../../data/students'

interface Props {
  tab: string
  students: Student[]
  search: string
  riskFilter: 'all' | 'high' | 'medium' | 'low'
  showFilters: boolean
  onToggleFilters: () => void
  onSelectStudent: (s: Student) => void
  selectedStudent: Student | null
  studentTab: string
  onStudentTabChange: (t: string) => void
  equipSearch: string
  equipSearchFocused: boolean
  equipStatusFilter: Status | 'all'
  showEquipFilters: boolean
  equipViewMode: 'machines' | 'exercises'
  onEquipViewModeChange: (v: 'machines' | 'exercises') => void
  onEquipSearchChange: (v: string) => void
  onEquipSearchFocus: (v: boolean) => void
  onEquipStatusFilterChange: (v: Status | 'all') => void
}

export default function AdminGym(props: Props) {
  if (props.selectedStudent) {
    return (
      <StudentProfile
        student={props.selectedStudent}
        tab={props.studentTab}
        onTabChange={props.onStudentTabChange}
      />
    )
  }

  if (props.tab === 'students') {
    return (
      <StudentsModule
        students={props.students}
        search={props.search}
        riskFilter={props.riskFilter}
        onSelectStudent={props.onSelectStudent}
        showFilters={props.showFilters}
        onToggleFilters={props.onToggleFilters}
      />
    )
  }

  if (props.tab === 'equipment') {
    return (
      <EquipmentPage
        search={props.equipSearch}
        searchFocused={props.equipSearchFocused}
        statusFilter={props.equipStatusFilter}
        showBlur={props.showEquipFilters}
        viewMode={props.equipViewMode}
        onViewModeChange={props.onEquipViewModeChange}
        onSearchChange={props.onEquipSearchChange}
        onSearchFocus={props.onEquipSearchFocus}
        onStatusFilterChange={props.onEquipStatusFilterChange}
      />
    )
  }

  if (props.tab === 'schedule') {
    return <AgendaModule students={props.students} />
  }

  return null
}
