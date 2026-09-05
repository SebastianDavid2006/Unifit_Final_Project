import { useState, useEffect } from 'react'
import StudentsModule from '@/modules/students/StudentsModule'
import type { Student } from '@/data/students'
import { getUsuarios, mapBackendToStudent } from '@/services/usuario.service'
import { mensajeError } from '@/lib/api'
import { useNavigate } from 'react-router'

export default function UsuariosPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getUsuarios()
      .then(data => setStudents(data.map(mapBackendToStudent)))
      .catch(err => setError(mensajeError(err)))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-sm font-medium" style={{ color: 'rgba(0,0,0,0.4)' }}>Cargando usuarios...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-sm font-medium" style={{ color: '#D32F2F' }}>{error}</p>
      </div>
    )
  }

  return (
    <StudentsModule
      students={students}
      search={search}
      onSelectStudent={(s) => navigate(`/admin/gestion/usuarios/${s.id}`)}
      showFilters={showFilters}
      onToggleFilters={() => setShowFilters(!showFilters)}
    />
  )
}
