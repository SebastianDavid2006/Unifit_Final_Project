import { useParams, useNavigate, useLocation } from 'react-router'
import { StudentProfile } from '@/modules/students/StudentProfile'
import { students } from '@/data/students'

export default function UsuarioDetalle() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  const basePath = location.pathname.startsWith('/admin')
    ? '/admin/gestion/usuarios'
    : '/entrenador/usuarios'

  const student = students.find(s => s.id === Number(id))

  if (!student) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-lg font-bold" style={{ color: '#1A1A1E' }}>Estudiante no encontrado</p>
          <button
            onClick={() => navigate(basePath)}
            className="mt-4 px-4 py-2 rounded-xl text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #F43843, #FF6B8A, #CC0033)' }}
          >
            Volver a Usuarios
          </button>
        </div>
      </div>
    )
  }

  return (
    <StudentProfile
      student={student}
      tab="overview"
      onTabChange={() => {}}
    />
  )
}
