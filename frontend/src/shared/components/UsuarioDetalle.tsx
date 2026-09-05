import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import { StudentProfile } from '@/modules/students/StudentProfile'
import type { Student } from '@/data/students'
import { api, mensajeError } from '@/lib/api'
import { getUsuario } from '@/lib/auth'
import { mapBackendToStudent } from '@/services/usuario.service'

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
