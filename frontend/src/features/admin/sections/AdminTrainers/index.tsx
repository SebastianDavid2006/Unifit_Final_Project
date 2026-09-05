import { useState, useMemo, useEffect, forwardRef, useImperativeHandle } from 'react'
import { getPersonal, mapBackendToTrainer, registrarUsuario } from '@/services/usuario.service'
import type { Trainer } from '@/services/usuario.service'
import NewUserModal from './components/NewUserModal'
import TrainersList from './sections/TrainersList'
import TrainerDetail from './sections/TrainerDetail/TrainerDetail'
import PermissionsSection from './sections/PermissionsSection'
import { PAGE_SIZE } from './data'
import { mensajeError } from '@/lib/api'

interface NewUserPayload {
  name: string
  email: string
  phone: string
  role: string
  contactName: string
  contactPhone: string
  contactRelation: string
  document: string
  birthDate: string
  gender: string
  eps: string
  bloodType: string
  tipo_usuario: string
  id_cargo?: string
  id_area?: string
}

const MAP_GENERO: Record<string, string> = { Masculino: 'masculino', Femenino: 'femenino', Otro: 'otro' }
const MAP_GRUPO: Record<string, string> = {
  'A+': 'a_positivo', 'A-': 'a_negativo', 'B+': 'b_positivo', 'B-': 'b_negativo',
  'AB+': 'ab_positivo', 'AB-': 'ab_negativo', 'O+': 'o_positivo', 'O-': 'o_negativo',
}
const MAP_PARENTESCO: Record<string, string> = {
  Padre: 'padre', Madre: 'madre', 'Hermano(a)': 'hermano_a', 'Abuelo(a)': 'abuelo_a',
  'Tío(a)': 'tio_a', 'Primo(a)': 'primo_a', Otro: 'otro',
}
const MAP_TIPO_DOC: Record<string, string> = { CC: 'CC', TI: 'TI', CE: 'CE', Pasaporte: 'PA', NIT: 'CC' }

function buildStaffPayload(user: NewUserPayload): Record<string, unknown> {
  const np = user.name.trim().split(/\s+/)
  const docMatch = user.document.match(/^([A-Za-z]+)\.\s*(.+)$/)
  const tipoDoc = docMatch ? docMatch[1] : 'CC'
  const numeroDoc = docMatch ? docMatch[2] : user.document

  const genero = MAP_GENERO[user.gender] ?? 'otro'
  const grupo = MAP_GRUPO[user.bloodType]
  const parentesco = MAP_PARENTESCO[user.contactRelation]

  return {
    primer_nombre: np[0] ?? '',
    segundo_nombre: np.length >= 4 ? np[1] : (np.length === 3 ? np[1] : undefined),
    primer_apellido: np.length >= 2 ? np[np.length >= 3 ? np.length - 1 : 1] : '',
    segundo_apellido: np.length >= 4 ? np.slice(2, np.length - 1).join(' ') : undefined,
    email_contacto: user.email?.trim() || '',
    telefono_contacto: user.phone?.trim() || undefined,
    documento: numeroDoc,
    tipo_documento: MAP_TIPO_DOC[tipoDoc] ?? 'CC',
    fecha_nacimiento: user.birthDate || undefined,
    genero,
    eps: user.eps?.trim() || undefined,
    grupo_sanguineo: grupo,
    nombre_emergencia: user.contactName?.trim() || undefined,
    telefono_emergencia: user.contactPhone?.trim() || undefined,
    parentesco_emergencia: parentesco,
    parentesco_otro: user.contactRelation === 'Otro' ? user.contactName?.trim() || undefined : undefined,
    tipo_usuario: user.tipo_usuario === 'profesor' ? 'profesor' : 'administrativo',
    rol: user.role === 'admin' ? 'admin' : 'entrenador',
    id_cargo: user.id_cargo || undefined,
    id_area: user.id_area || undefined,
  }
}

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
    getPersonal()
      .then(data => {
        const staff = data.map(mapBackendToTrainer)
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

  async function handleNewUserSuccess(user: NewUserPayload) {
    try {
      const payload = buildStaffPayload(user)
      await registrarUsuario(payload)
      const data = await getPersonal()
      setTrainers(data.map(mapBackendToTrainer))
      setShowNewUser(false)
      setError('')
    } catch (err) {
      console.error('Error creando staff:', err)
      setError(mensajeError(err))
    }
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
