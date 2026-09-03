import { useState, useMemo, useEffect, forwardRef, useImperativeHandle } from 'react'
import { getUsuarios, mapBackendToTrainer, registrarUsuario } from '@/services/usuario.service'
import type { Trainer } from '@/services/usuario.service'
import NewUserModal from './components/NewUserModal'
import TrainersList from './sections/TrainersList'
import TrainerDetail from './sections/TrainerDetail/TrainerDetail'
import PermissionsSection from './sections/PermissionsSection'
import { PAGE_SIZE } from './data'
import { mensajeError } from '@/lib/api'

interface AdminTrainersProps {
  search: string
  onSelectTrainer?: () => void
  trainerTab?: string
}

const AdminTrainers = forwardRef<{ clearSelection: () => void }, AdminTrainersProps>(({ search, onSelectTrainer, trainerTab }, ref) => {
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null)
  const [globalAdmin, setGlobalAdmin] = useState(true)
  const [page, setPage] = useState(1)
  const [showNewUser, setShowNewUser] = useState(false)

  useEffect(() => {
    getUsuarios()
      .then(data => {
        const staff = data
          .filter(u => u.rol === 'admin' || u.rol === 'entrenador')
          .map(mapBackendToTrainer)
        setTrainers(staff)
      })
      .catch(err => setError(mensajeError(err)))
      .finally(() => setLoading(false))
  }, [])

  useImperativeHandle(ref, () => ({
    clearSelection: () => setSelectedTrainer(null)
  }))

  function handleSelectTrainer(t: Trainer) {
    setSelectedTrainer(t)
    onSelectTrainer?.()
  }

  const filtered = useMemo(() => {
    const q = (search ?? '').trim().toLowerCase()
    return trainers.filter(t => {
      const roleLabel = t.role === 'trainer' ? 'entrenador' : 'administrador'
      return !q ||
        t.name.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.speciality.toLowerCase().includes(q) ||
        roleLabel.includes(q)
    })
  }, [trainers, search])

  useEffect(() => { setPage(1) }, [search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function handleNewUserSuccess(user: { name: string; email: string; phone: string; role: string; contactName: string; contactPhone: string; contactRelation: string; document: string; birthDate: string; gender: string; eps: string; bloodType: string; tipo_usuario: string; id_cargo?: string; id_area?: string }) {
    const np = user.name.trim().split(/\s+/)
    const payload: Record<string, unknown> = {
      primer_nombre: np[0] || '',
      segundo_nombre: np.length >= 3 ? np[1] : '',
      primer_apellido: np.length >= 2 ? (np.length === 3 ? np[2] : np[1]) : '',
      segundo_apellido: np.length >= 4 ? np.slice(3).join(' ') : '',
      email_contacto: user.email,
      telefono_contacto: user.phone,
      documento: user.document.replace(/^[A-Z]+\.\s*/, ''),
      tipo_documento: 'CC',
      genero: user.gender === 'Femenino' ? 'femenino' : 'masculino',
      eps: user.eps,
      grupo_sanguineo: user.bloodType as 'O+' | 'A+' | 'B+' | 'AB+' | 'O-' | 'A-' | 'B-' | 'AB-' | undefined,
      tipo_usuario: user.tipo_usuario as 'profesor' | 'administrativo',
      rol: user.role === 'admin' ? 'admin' : 'entrenador',
      id_cargo: user.id_cargo,
      id_area: user.id_area,
      fecha_nacimiento: user.birthDate || undefined,
      nombre_emergencia: user.contactName,
      telefono_emergencia: user.contactPhone,
      parentesco_emergencia: user.contactRelation === 'Esposo' ? 'conyuge' : user.contactRelation === 'Madre' ? 'madre' : user.contactRelation === 'Padre' ? 'padre' : user.contactRelation === 'Hermano' ? 'hermano' : user.contactRelation === 'Hermana' ? 'hermano' : 'otro',
    }

    registrarUsuario(payload)
      .then(() => {
        return getUsuarios()
      })
      .then(data => {
        const staff = data
          .filter(u => u.rol === 'admin' || u.rol === 'entrenador')
          .map(mapBackendToTrainer)
        setTrainers(staff)
        setShowNewUser(false)
      })
      .catch(err => {
        console.error('Error creando staff:', err)
      })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-sm font-medium" style={{ color: 'rgba(0,0,0,0.4)' }}>Cargando personal...</p>
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

  if (selectedTrainer) {
    if (trainerTab && trainerTab === 'permissions') {
      return <PermissionsSection trainer={selectedTrainer} globalAdmin={globalAdmin} onToggleGlobalAdmin={() => setGlobalAdmin(!globalAdmin)} />
    }
    return <TrainerDetail key={selectedTrainer.id} trainer={selectedTrainer} />
  }

  return (
    <>
      <TrainersList
        paged={paged}
        totalPages={totalPages}
        currentPage={currentPage}
        onPage={setPage}
        onSelectTrainer={handleSelectTrainer}
        onOpenNewUser={() => setShowNewUser(true)}
      />
      <NewUserModal open={showNewUser} onClose={() => setShowNewUser(false)} onSuccess={handleNewUserSuccess} />
    </>
  )
})

export default AdminTrainers
