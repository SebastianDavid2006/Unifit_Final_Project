import { useState, useMemo, useEffect, forwardRef, useImperativeHandle } from 'react'
import { getPersonal, mapBackendToTrainer, registrarUsuario } from '@/services/usuario.service'
import type { Trainer } from '@/services/usuario.service'
import NewUserModal from './components/NewUserModal'
import CompleteStaffModal from './components/CompleteStaffModal'
import TrainersList from './sections/TrainersList'
import TrainerDetail from './sections/TrainerDetail/TrainerDetail'
import { PAGE_SIZE } from './data'
import { api, mensajeError } from '@/lib/api'
import { toast } from 'sonner'
import { MAP_GENERO, MAP_GRUPO, MAP_PARENTESCO } from '@/data/config/catalogosRegistro'

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
  primerNombre: string
  segundoNombre: string
  primerApellido: string
  segundoApellido: string
  aceptaDatos: boolean
}

function buildStaffPayload(user: NewUserPayload): Record<string, unknown> {
  const docMatch = user.document.match(/^([A-Za-z]+)\.\s*(.+)$/)
  const tipoDoc = docMatch ? docMatch[1] : 'CC'
  const numeroDoc = docMatch ? docMatch[2] : user.document

  const genero = MAP_GENERO[user.gender] ?? 'otro'
  const grupo = MAP_GRUPO[user.bloodType]
  const parentesco = MAP_PARENTESCO[user.contactRelation]

  return {
    primer_nombre: user.primerNombre.trim(),
    segundo_nombre: user.segundoNombre.trim() || undefined,
    primer_apellido: user.primerApellido.trim(),
    segundo_apellido: user.segundoApellido.trim() || undefined,
    email_contacto: user.email?.trim() || '',
    telefono_contacto: user.phone?.trim() || undefined,
    documento: numeroDoc,
    tipo_documento: tipoDoc,
    fecha_nacimiento: user.birthDate || undefined,
    genero,
    eps: user.eps?.trim() || undefined,
    grupo_sanguineo: grupo,
    nombre_emergencia: user.contactName?.trim() || undefined,
    telefono_emergencia: user.contactPhone?.trim() || undefined,
    parentesco_emergencia: parentesco,
    tipo_usuario: user.tipo_usuario === 'profesor' ? 'profesor' : 'administrativo',
    rol: user.role === 'admin' ? 'admin' : 'entrenador',
    id_cargo: user.id_cargo || undefined,
    id_area: user.id_area || undefined,
  }
}

interface AdminTrainersProps {
  search: string
  onSelectTrainer?: () => void
}

const AdminTrainers = forwardRef<{ clearSelection: () => void }, AdminTrainersProps>(({ search, onSelectTrainer }, ref) => {
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null)
  const [page, setPage] = useState(1)
  const [showNewUser, setShowNewUser] = useState(false)
  const [porCompletar, setPorCompletar] = useState<Trainer | null>(null)

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
    // Un pendiente abre directo el modal para completar su registro (igual que con los usuarios)
    if (t.status === 'process') {
      setPorCompletar(t)
      return
    }
    setSelectedTrainer(t)
    onSelectTrainer?.()
  }

  async function recargarPersonal() {
    const data = await getPersonal()
    setTrainers(data.map(mapBackendToTrainer))
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
    const payload = buildStaffPayload(user)
    const { usuario } = await registrarUsuario(payload)

    // El personal solo necesita el tratamiento de datos para quedar 'activo'.
    // Sin esta aceptación quedaba 'pendiente' y nunca podía ingresar.
    // El usuario ya existe en este punto: si falla, se devuelve un aviso en vez de lanzar el error
    // (reintentar el registro daría 409 por documento/correo duplicado). El modal lo muestra
    // en su pantalla final y la persona se completa desde la lista (clic sobre el pendiente).
    let aviso: string | undefined
    if (user.aceptaDatos) {
      try {
        await api.put(`/usuarios/${usuario.id_usuario}/aceptar-documento`, { tipo_documento_legal: 'tratamiento_datos' })
      } catch (err) {
        aviso = `Se registró a ${user.primerNombre}, pero quedó pendiente del tratamiento de datos (${mensajeError(err)}). Complétalo desde la lista de personal: haz clic sobre su nombre.`
      }
    }

    const data = await getPersonal()
    setTrainers(data.map(mapBackendToTrainer))
    return { aviso }
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
      <CompleteStaffModal
        open={porCompletar !== null}
        trainerId={porCompletar?.id ?? ''}
        trainerName={porCompletar?.name ?? ''}
        onClose={() => setPorCompletar(null)}
        onCompleted={async () => {
          await recargarPersonal()
          toast.success(`${porCompletar?.firstName ?? 'La persona'} quedó activo`)
        }}
      />
    </>
  )
})

export default AdminTrainers
