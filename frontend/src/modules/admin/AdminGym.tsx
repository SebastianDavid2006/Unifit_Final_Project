import { useState } from 'react'
import StudentsModule from '../students/StudentsModule'
import AgendaModule from '../agenda/AgendaModule'
import EquipmentModule from '../equipment/EquipmentModule'
import type { Status } from '../../data/types'

const MOCK_STUDENTS = [
  { id: 1, name: 'Carlos Andrés Pérez', faculty: 'Ingeniería', adherence: 85, risk: 'low' as const, status: 'active' as const, lastVisit: '2026-07-24', avatar: 'CP', goal: 'Hipertrofia', sessions: 36, weight: 72, height: 175, institution: 'UNAL', gender: 'M', program: 'Presencial', modality: 'Presencial', jornada: 'Mañana', semester: '5°', eps: 'Sura' },
  { id: 2, name: 'María José García', faculty: 'Medicina', adherence: 92, risk: 'low' as const, status: 'active' as const, lastVisit: '2026-07-25', avatar: 'MG', goal: 'Cardio', sessions: 48, weight: 58, height: 163, institution: 'UNAL', gender: 'F', program: 'Presencial', modality: 'Virtual', jornada: 'Tarde', semester: '7°', eps: 'Compensar' },
  { id: 3, name: 'Andrés Felipe Rojas', faculty: 'Derecho', adherence: 45, risk: 'high' as const, status: 'inactive' as const, lastVisit: '2026-06-30', avatar: 'AR', goal: 'Pérdida de peso', sessions: 12, weight: 88, height: 180, institution: 'U. Nacional', gender: 'M', program: 'Libre', modality: 'Presencial', jornada: 'Noche', semester: '3°', eps: 'Sanitas' },
]

export default function AdminGym({ tab }: { tab: string }) {
  const [equipSearch, setEquipSearch] = useState('')
  const [equipSearchFocused, setEquipSearchFocused] = useState(false)
  const [equipStatusFilter, setEquipStatusFilter] = useState<Status | 'all'>('all')
  const [showEquipFilters, setShowEquipFilters] = useState(false)
  const [equipViewMode, setEquipViewMode] = useState<'machines' | 'exercises'>('machines')

  if (tab === 'students') {
    return (
      <StudentsModule
        students={MOCK_STUDENTS}
        search=""
        riskFilter="all"
        onSelectStudent={() => {}}
        showFilters={false}
        onToggleFilters={() => {}}
      />
    )
  }

  if (tab === 'equipment') {
    return (
      <EquipmentModule
        search={equipSearch}
        searchFocused={equipSearchFocused}
        statusFilter={equipStatusFilter}
        showBlur={showEquipFilters}
        viewMode={equipViewMode}
        onViewModeChange={setEquipViewMode}
        onSearchChange={setEquipSearch}
        onSearchFocus={setEquipSearchFocused}
        onStatusFilterChange={setEquipStatusFilter}
      />
    )
  }

  if (tab === 'schedule') {
    return <AgendaModule />
  }

  return null
}
