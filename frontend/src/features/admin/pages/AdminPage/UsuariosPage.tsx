import { useState } from 'react'
import StudentsModule from '@/modules/students/StudentsModule'
import { students } from '@/data/students'
import { useNavigate } from 'react-router'

export default function UsuariosPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [showFilters, setShowFilters] = useState(false)

  return (
    <StudentsModule
      students={students}
      search={search}
      riskFilter={riskFilter}
      onSelectStudent={(s) => navigate(`/admin/gestion/usuarios/${s.id}`)}
      showFilters={showFilters}
      onToggleFilters={() => setShowFilters(!showFilters)}
    />
  )
}
