import { useState, useMemo, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Trainer, initialTrainers } from '@/data/trainers'
import NewUserModal from './components/NewUserModal'
import TrainersList from './sections/TrainersList'
import TrainerDetail from './sections/TrainerDetail'
import PermissionsSection from './sections/PermissionsSection'
import { PAGE_SIZE, type RoleFilter } from './data'

interface AdminTrainersProps {
  search: string
  onSelectTrainer?: () => void
  trainerTab?: string
  roleFilter?: RoleFilter
  showFilters?: boolean
}

const AdminTrainers = forwardRef<{ clearSelection: () => void }, AdminTrainersProps>(({ search, onSelectTrainer, trainerTab, roleFilter, showFilters }, ref) => {
  const [trainers, setTrainers] = useState(initialTrainers)
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null)
  const [globalAdmin, setGlobalAdmin] = useState(true)
  const [page, setPage] = useState(1)
  const [showNewUser, setShowNewUser] = useState(false)

  useImperativeHandle(ref, () => ({
    clearSelection: () => setSelectedTrainer(null)
  }))

  function handleSelectTrainer(t: Trainer) {
    setSelectedTrainer(t)
    onSelectTrainer?.()
  }

  const filtered = useMemo(() => {
    const q = (search ?? '').trim().toLowerCase()
    const role = roleFilter ?? 'all'
    return trainers.filter(t => {
      const matchRole = role === 'all' || t.role === role
      const roleLabel = t.role === 'trainer' ? 'entrenador' : 'administrador'
      const matchSearch = !q ||
        t.name.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.speciality.toLowerCase().includes(q) ||
        roleLabel.includes(q)
      return matchRole && matchSearch
    })
  }, [trainers, search, roleFilter])

  useEffect(() => { setPage(1) }, [search, roleFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function handleNewUserSuccess(user: { name: string; email: string; phone: string; role: string }) {
    const initials = user.name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase()
    const newTrainer: Trainer = {
      id: Math.max(0, ...trainers.map(t => t.id)) + 1,
      name: user.name,
      email: user.email,
      phone: user.phone,
      document: `CC ${1000000000 + Math.max(0, ...trainers.map(t => t.id)) + 1}`,
      speciality: user.role === 'admin' ? 'Administración del Sistema' : 'Entrenamiento General',
      role: user.role === 'admin' ? 'admin' : 'trainer',
      students: 0,
      status: 'active',
      avatar: initials || 'NU',
      rating: 80,
      joinedAt: new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }),
      schedule: 'Lun-Vie 8AM-4PM',
      certifications: user.role === 'admin' ? ['Gestión de Plataforma'] : ['Entrenamiento Funcional'],
    }
    setTrainers(prev => [newTrainer, ...prev])
  }

  if (selectedTrainer) {
    if (trainerTab && trainerTab === 'permissions') {
      return <PermissionsSection trainer={selectedTrainer} globalAdmin={globalAdmin} onToggleGlobalAdmin={() => setGlobalAdmin(!globalAdmin)} />
    }
    if (trainerTab && trainerTab === 'documents') {
      return <div className="p-8 pt-12 max-w-[1440px] mx-auto" />
    }
    return <TrainerDetail trainer={selectedTrainer} />
  }

  return (
    <>
      <TrainersList
        paged={paged}
        totalPages={totalPages}
        currentPage={currentPage}
        showFilters={showFilters}
        onPage={setPage}
        onSelectTrainer={handleSelectTrainer}
        onOpenNewUser={() => setShowNewUser(true)}
      />
      <NewUserModal open={showNewUser} onClose={() => setShowNewUser(false)} onSuccess={handleNewUserSuccess} />
    </>
  )
})

export default AdminTrainers
