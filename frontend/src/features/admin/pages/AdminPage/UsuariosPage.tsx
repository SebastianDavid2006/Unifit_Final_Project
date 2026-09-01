import { useState, useEffect } from 'react'
import StudentsModule from '@/modules/students/StudentsModule'
import type { Student } from '@/data/students'
import { api, mensajeError } from '@/lib/api'
import { useNavigate } from 'react-router'

function mapBackendToStudent(u: Record<string, unknown>): Student {
  const estudiante = u.estudiante as Record<string, unknown> | null
  const profesor = u.profesor as Record<string, unknown> | null
  const administrativo = u.administrativo as Record<string, unknown> | null
  const programa = estudiante?.programa as Record<string, unknown> | undefined
  const cargo = (profesor?.cargo ?? administrativo?.cargo) as Record<string, unknown> | undefined
  const area = (profesor?.area ?? administrativo?.area) as Record<string, unknown> | undefined

  const estado = u.estado as string
  const statusMap: Record<string, Student['status']> = {
    activo: 'active',
    inactivo: 'inactive',
    pendiente: 'process',
  }

  return {
    id: u.id_usuario as string,
    name: `${u.primer_nombre} ${u.primer_apellido}`,
    firstName: u.primer_nombre as string,
    secondName: (u.segundo_nombre as string) ?? '',
    lastName: u.primer_apellido as string,
    secondLastName: (u.segundo_apellido as string) ?? '',
    documentType: u.tipo_documento as string,
    documentNumber: u.documento as string,
    birthDate: '',
    gender: '',
    eps: '',
    bloodType: '',
    email: u.email_contacto as string,
    phone: (u.telefono_contacto as string) ?? '',
    contactName: '',
    contactPhone: '',
    contactRelation: '',
    carnetId: '',
    program: programa?.nombre_programa as string ?? '',
    institution: 'Universitaria de Colombia',
    faculty: '',
    semestre: (estudiante?.semestre as number) ?? 0,
    semester: String((estudiante?.semestre as number) ?? ''),
    modality: (estudiante?.modalidad as string) ?? '',
    jornada: (estudiante?.jornada as string) ?? '',
    graduationStatus: (estudiante?.es_egresado as boolean) ? 'Egresado' : 'No egresado',
    adherence: 0,
    risk: 'low' as const,
    status: statusMap[estado] ?? 'process',
    lastVisit: '',
    nextAssessment: 'Por agendar',
    avatar: `${(u.primer_nombre as string)[0]}${(u.primer_apellido as string)[0]}`,
    goal: '',
    sessions: 0,
    weight: 0,
    height: 0,
    tipo_usuario: u.tipo_usuario as 'estudiante' | 'profesor' | 'administrativo',
    cargo: cargo?.nombre_cargo as string ?? undefined,
    area: area?.nombre_area as string ?? undefined,
  }
}

export default function UsuariosPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/usuarios')
      .then(res => setStudents(res.data.map(mapBackendToStudent)))
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
      riskFilter={riskFilter}
      onSelectStudent={(s) => navigate(`/admin/gestion/usuarios/${s.id}`)}
      showFilters={showFilters}
      onToggleFilters={() => setShowFilters(!showFilters)}
    />
  )
}
