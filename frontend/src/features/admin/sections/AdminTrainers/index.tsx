import { useState, useMemo, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Trainer, initialTrainers } from '@/data/trainers'
import NewUserModal from './components/NewUserModal'
import TrainersList from './sections/TrainersList'
import TrainerDetail from './sections/TrainerDetail'
import PermissionsSection from './sections/PermissionsSection'
import { DocumentsTab } from '@/modules/students/tabs/DocumentsTab'
import { DocumentViewerModal } from '@/modules/students/StudentProfile/components/DocumentViewerModal'
import { DeleteDocumentModal } from '@/modules/students/StudentProfile/components/DeleteDocumentModal'
import { PAGE_SIZE } from './data'

interface AdminTrainersProps {
  search: string
  onSelectTrainer?: () => void
  trainerTab?: string
}

const AdminTrainers = forwardRef<{ clearSelection: () => void }, AdminTrainersProps>(({ search, onSelectTrainer, trainerTab }, ref) => {
  const [trainers, setTrainers] = useState(initialTrainers)
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null)
  const [globalAdmin, setGlobalAdmin] = useState(true)
  const [page, setPage] = useState(1)
  const [showNewUser, setShowNewUser] = useState(false)
  const [openMenuDoc, setOpenMenuDoc] = useState<string | null>(null)
  const [fileModalOpen, setFileModalOpen] = useState(false)
  const [fileModalData, setFileModalData] = useState<{ name: string; date: string } | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteDocName, setDeleteDocName] = useState('')

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

  function handleNewUserSuccess(user: { name: string; email: string; phone: string; role: string; contactName: string; contactPhone: string; contactRelation: string; document: string; birthDate: string; gender: string; eps: string; bloodType: string }) {
    const initials = user.name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase()
    const np = user.name.trim().split(/\s+/)
    const newTrainer: Trainer = {
      id: Math.max(0, ...trainers.map(t => t.id)) + 1,
      name: user.name,
      firstName: np[0] || '',
      secondName: np.length >= 3 ? np[1] : '',
      lastName: np.length >= 2 ? (np.length === 3 ? np[2] : np[1]) : '',
      secondLastName: np.length >= 4 ? np.slice(3).join(' ') : '',
      email: user.email,
      phone: user.phone,
      document: user.document,
      speciality: user.role === 'admin' ? 'Administración del Sistema' : 'Entrenamiento General',
      role: user.role === 'admin' ? 'admin' : 'trainer',
      students: 0,
      status: 'active',
      avatar: initials || 'NU',
      rating: 80,
      joinedAt: new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }),
      schedule: 'Lun-Vie 8AM-4PM',
      certifications: user.role === 'admin' ? ['Gestión de Plataforma'] : ['Entrenamiento Funcional'],
      accessLevel: user.role === 'admin' ? 'Completo' : 'Parcial',
      lastAccess: 'Nunca',
      recentActivities: [{ action: 'Cuenta creada', date: 'Justo ahora' }],
      contactName: user.contactName,
      contactPhone: user.contactPhone,
      contactRelation: user.contactRelation,
      birthDate: user.birthDate,
      gender: user.gender,
      eps: user.eps,
      bloodType: user.bloodType,
    }
    setTrainers(prev => [newTrainer, ...prev])
  }

  if (selectedTrainer) {
    if (trainerTab && trainerTab === 'permissions') {
      return <PermissionsSection trainer={selectedTrainer} globalAdmin={globalAdmin} onToggleGlobalAdmin={() => setGlobalAdmin(!globalAdmin)} />
    }
    if (trainerTab && trainerTab === 'documents') {
      return (
        <div className="p-8 pt-12 max-w-[1440px] mx-auto">
          <DocumentsTab
            openMenuDoc={openMenuDoc}
            setOpenMenuDoc={setOpenMenuDoc}
            setFileModalData={setFileModalData}
            setFileModalOpen={setFileModalOpen}
          />
          <DocumentViewerModal
            isOpen={fileModalOpen && !!fileModalData}
            fileData={fileModalData}
            onClose={() => setFileModalOpen(false)}
            onDelete={(name) => { setFileModalOpen(false); setDeleteDocName(name); setDeleteModalOpen(true) }}
          />
          <DeleteDocumentModal
            isOpen={deleteModalOpen}
            docName={deleteDocName}
            onConfirm={() => setDeleteModalOpen(false)}
            onCancel={() => setDeleteModalOpen(false)}
          />
        </div>
      )
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
