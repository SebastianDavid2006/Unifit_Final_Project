import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import { StudentProfile } from '@/modules/students/StudentProfile'
import type { Student } from '@/data/students'
import { api, mensajeError } from '@/lib/api'
import { getUsuario } from '@/lib/auth'

function mapBackendToStudent(u: Record<string, unknown>): Student {
  const estudiante = u.estudiante as Record<string, unknown> | null
  const profesor = u.profesor as Record<string, unknown> | null
  const administrativo = u.administrativo as Record<string, unknown> | null
  const programa = estudiante?.programa as Record<string, unknown> | undefined
  const cargo = (profesor?.cargo ?? administrativo?.cargo) as Record<string, unknown> | undefined
  const area = (profesor?.area ?? administrativo?.area) as Record<string, unknown> | undefined
  const huella = u.huella as { id_huella: string; indice_sensor: number; activo: boolean } | null

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
    huella: huella ? 'capturada' : undefined,
  }
}

const VALID_TABS = ['general', 'actividad', 'valoracion']

export default function UsuarioDetalle() {
  const { id, tab: tabParam } = useParams<{ id: string; tab: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deactivating, setDeactivating] = useState(false)
  const [confirmDeactivate, setConfirmDeactivate] = useState(false)
  const [activating, setActivating] = useState(false)
  const [confirmActivate, setConfirmActivate] = useState(false)

  const basePath = location.pathname.startsWith('/admin')
    ? '/admin/gestion/usuarios'
    : '/entrenador/usuarios'

  const activeTab = VALID_TABS.includes(tabParam ?? '') ? tabParam! : 'general'

  const isAdmin = getUsuario()?.rol === 'admin'

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api.get(`/usuarios/${id}`)
      .then(res => setStudent(mapBackendToStudent(res.data)))
      .catch(err => setError(mensajeError(err)))
      .finally(() => setLoading(false))
  }, [id])

  const handleTabChange = (newTab: string) => {
    navigate(`${basePath}/${id}/${newTab}`)
  }

  const handleDeactivate = async () => {
    if (!id) return
    setDeactivating(true)
    try {
      await api.put(`/usuarios/${id}/desactivar`)
      setStudent(prev => prev ? { ...prev, status: 'inactive' } : prev)
      setConfirmDeactivate(false)
    } catch (err) {
      setError(mensajeError(err))
    } finally {
      setDeactivating(false)
    }
  }

  const handleActivate = async () => {
    if (!id) return
    setActivating(true)
    try {
      await api.put(`/usuarios/${id}/activar`)
      setStudent(prev => prev ? { ...prev, status: 'active' } : prev)
      setConfirmActivate(false)
    } catch (err) {
      setError(mensajeError(err))
    } finally {
      setActivating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-sm font-medium" style={{ color: 'rgba(0,0,0,0.4)' }}>Cargando usuario...</p>
      </div>
    )
  }

  if (error || !student) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-lg font-bold" style={{ color: '#1A1A1E' }}>{error || 'Estudiante no encontrado'}</p>
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
    <div>
      {isAdmin && (
        <div className="mb-4 flex justify-end">
          {student.status === 'inactive' ? (
            <button
              onClick={() => setConfirmActivate(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #30D158, #20A040)' }}
            >
              Activar usuario
            </button>
          ) : (
            <button
              onClick={() => setConfirmDeactivate(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #F43843, #FF6B8A)' }}
            >
              Desactivar usuario
            </button>
          )}
        </div>
      )}

      <StudentProfile
        student={student}
        tab={activeTab}
        onTabChange={handleTabChange}
      />

      {confirmDeactivate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(6px)' }}>
          <div className="bg-white rounded-2xl p-6 max-w-sm text-center" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <p className="text-sm font-bold mb-2" style={{ color: '#1A1A1E' }}>¿Desactivar usuario?</p>
            <p className="text-xs mb-5" style={{ color: 'rgba(0,0,0,0.45)' }}>
              El usuario {student.name} no podrá acceder al sistema.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setConfirmDeactivate(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium cursor-pointer"
                style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.5)' }}
              >
                Cancelar
              </button>
              <button
                onClick={handleDeactivate}
                disabled={deactivating}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white cursor-pointer"
                style={{ background: deactivating ? 'rgba(0,0,0,0.15)' : '#F43843' }}
              >
                {deactivating ? 'Desactivando...' : 'Desactivar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmActivate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(6px)' }}>
          <div className="bg-white rounded-2xl p-6 max-w-sm text-center" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <p className="text-sm font-bold mb-2" style={{ color: '#1A1A1E' }}>¿Activar usuario?</p>
            <p className="text-xs mb-5" style={{ color: 'rgba(0,0,0,0.45)' }}>
              El usuario {student.name} podrá acceder al sistema nuevamente.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setConfirmActivate(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium cursor-pointer"
                style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.5)' }}
              >
                Cancelar
              </button>
              <button
                onClick={handleActivate}
                disabled={activating}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white cursor-pointer"
                style={{ background: activating ? 'rgba(0,0,0,0.15)' : '#30D158' }}
              >
                {activating ? 'Activando...' : 'Activar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
