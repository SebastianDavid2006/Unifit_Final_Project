import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { GraduationCap, Inbox } from 'lucide-react'
import { useProgramas } from '@/hooks/useCatalogo'
import { NIVEL_LABELS, UNIVERSIDAD_LABELS, UNIVERSIDADES, NIVELES, type Universidad, type NivelPrograma } from '@/types/catalogo'
import { CAREER_REGISTERED } from '@/data/stats/careerStats'
import Pagination from '@/features/admin/components/Pagination'
import Tag from '@/features/admin/components/Tag'
import ModalShell, { ModalCloseButton } from '../components/ModalShell'
import RowActions from '../components/RowActions'
import ListSearch from '../components/ListSearch'
import AddButton from '../components/AddButton'
import ConfirmModal from '../components/ConfirmModal'
import { BLUE, BLUE_GRAD, INSTITUTION_COLORS, PAGE_SIZE, FIELD_STYLE, enterField, leaveField, focusField, blurField } from '../components/fields'

function CareerList({ programas, onOpenAdd, onOpenEdit, onRequestDelete, onRequestInactivate, onRequestActivate }: {
  programas: ReturnType<typeof useProgramas>['programas']
  onOpenAdd: () => void
  onOpenEdit: (id: string) => void
  onRequestDelete: (id: string, name: string) => void
  onRequestInactivate: (id: string, name: string, count: number) => void
  onRequestActivate: (id: string, name: string) => void
}) {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const q = query.trim().toLowerCase()

  const rows = useMemo(() => {
    return programas.filter(p => {
      if (!q) return true
      const inst = UNIVERSIDAD_LABELS[p.universidad]
      const nivel = NIVEL_LABELS[p.tipo_programa]
      return p.nombre.toLowerCase().includes(q) || inst.toLowerCase().includes(q) || nivel.toLowerCase().includes(q)
    })
  }, [programas, q])

  const total = rows.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paged = rows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  useEffect(() => { setPage(1) }, [query])

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="premium-card rounded-2xl overflow-hidden">
      <div className="relative px-6 pt-5 pb-4 flex items-center justify-between gap-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <div className="absolute -right-8 -top-10 w-40 h-40 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${BLUE}1F, transparent 65%)` }} />
        <ListSearch value={query} onChange={setQuery} placeholder="Buscar carrera, institución o nivel..." />
        <AddButton background={BLUE_GRAD} glow={`${BLUE}42`} onClick={onOpenAdd} />
      </div>

      <div className="px-6 py-4">
        <div className="grid grid-cols-[2fr_1.6fr_1fr_auto] gap-4 px-4 mb-3">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.12em]" style={{ color: 'rgba(0,0,0,0.4)' }}>Carrera</p>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.12em]" style={{ color: 'rgba(0,0,0,0.4)' }}>Institución</p>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.12em]" style={{ color: 'rgba(0,0,0,0.4)' }}>Nivel</p>
          <p className="w-[68px] text-[10px] font-extrabold uppercase tracking-[0.12em] text-right" style={{ color: 'rgba(0,0,0,0.4)' }}>Acciones</p>
        </div>

        {paged.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl py-10" style={{ background: 'rgba(0,0,0,0.02)', border: '1px dashed rgba(0,0,0,0.08)' }}>
            <Inbox size={22} style={{ color: 'rgba(0,0,0,0.2)' }} />
            <p className="text-xs font-semibold" style={{ color: 'rgba(0,0,0,0.35)' }}>
              {q ? 'Sin resultados para la búsqueda.' : 'Aún no hay carreras. Agrega la primera.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {paged.map((p, i) => {
              const instLabel = UNIVERSIDAD_LABELS[p.universidad]
              const nivelLabel = NIVEL_LABELS[p.tipo_programa]
              const color = INSTITUTION_COLORS[UNIVERSIDADES.indexOf(p.universidad) % INSTITUTION_COLORS.length]
              const studentsCount = CAREER_REGISTERED[p.nombre] ?? 0
              return (
                <motion.div
                  key={p.id_programa}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="grid grid-cols-[2fr_1.6fr_1fr_auto] items-center gap-4 p-4 rounded-2xl premium-card"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}12`, border: `1px solid ${color}20` }}>
                      <GraduationCap size={16} style={{ color }} />
                    </div>
                    <p className="text-[#1A1A1E] text-sm font-extrabold truncate">{p.nombre}</p>
                  </div>
                  <p className="text-xs font-bold truncate" style={{ color: 'rgba(0,0,0,0.6)' }}>{instLabel}</p>
                  <div className="flex flex-col gap-1.5 w-fit">
                    <Tag color={BLUE} bg={`${BLUE}0D`} weight="extrabold">
                      {nivelLabel}
                    </Tag>
                  </div>
                  <RowActions
                    state={studentsCount > 0 ? 'inactivate' : 'delete'}
                    onReactivate={() => {}}
                    onInactivate={() => onRequestInactivate(p.id_programa, p.nombre, studentsCount)}
                    onDelete={() => onRequestDelete(p.id_programa, p.nombre)}
                    onEdit={() => onOpenEdit(p.id_programa)}
                    inactivateTitle={`Inactivar carrera (${studentsCount} estudiantes)`}
                    deleteTitle="Eliminar carrera"
                    editTitle="Editar"
                  />
                </motion.div>
              )
            })}
          </div>
        )}

        {totalPages > 1 && <Pagination page={currentPage} totalPages={totalPages} onPage={setPage} />}
      </div>
    </motion.div>
  )
}

function CareerModal({ mode, initialName, initialUniversidad, initialNivel, programs, onSave, onClose }: {
  mode: 'add' | 'edit'
  initialName: string
  initialUniversidad: Universidad
  initialNivel: NivelPrograma
  programs: ReturnType<typeof useProgramas>['programas']
  onSave: (name: string, universidad: Universidad, nivel: NivelPrograma) => void
  onClose: () => void
}) {
  const [name, setName] = useState(initialName)
  const [universidad, setUniversidad] = useState<Universidad>(initialUniversidad)
  const [nivel, setNivel] = useState<NivelPrograma>(initialNivel)

  const nameNorm = name.trim()
  const isDuplicate = programs.some(p => {
    if (mode === 'edit' && p.nombre.toLowerCase() === initialName.toLowerCase() && p.universidad === initialUniversidad && p.tipo_programa === initialNivel) return false
    return p.nombre.toLowerCase() === nameNorm.toLowerCase() && p.universidad === universidad && p.tipo_programa === nivel
  })
  const valid = nameNorm !== '' && !isDuplicate

  const submit = () => {
    if (!valid) return
    onSave(nameNorm, universidad, nivel)
  }

  return (
    <ModalShell onClose={onClose}>
      <div className="relative px-7 pt-6 pb-5" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
        <div className="absolute top-5 right-6">
          <ModalCloseButton onClick={onClose} />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${BLUE}0F`, border: `1px solid ${BLUE}1A` }}>
            <GraduationCap size={20} style={{ color: BLUE }} />
          </div>
          <div>
            <h2 className="text-base font-extrabold tracking-tight" style={{ color: '#1A1A1E' }}>
              {mode === 'edit' ? 'Editar carrera' : 'Nueva carrera'}
            </h2>
            <p className="text-[11px] mt-0.5" style={{ color: 'rgba(0,0,0,0.4)' }}>Asigna la institución y el nivel académico</p>
          </div>
        </div>
      </div>

      <div className="px-7 py-6">
        <div className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.6)' }}>
              Nombre de la carrera<span className="ml-0.5" style={{ color: '#F43843' }}>*</span>
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              autoFocus
              placeholder="Ingresa el nombre de la carrera..."
              className="px-3 py-2.5 rounded-xl text-xs font-medium outline-none w-full transition-all duration-200"
              style={{ ...FIELD_STYLE, border: nameNorm && isDuplicate ? '1px solid #F43843' : '1px solid transparent' }}
              onMouseEnter={enterField}
              onMouseLeave={leaveField}
              onFocus={focusField}
              onBlur={blurField}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.6)' }}>
                Institución<span className="ml-0.5" style={{ color: '#F43843' }}>*</span>
              </label>
              <div className="relative">
                <select
                  value={universidad}
                  onChange={e => setUniversidad(e.target.value as Universidad)}
                  className="px-3 py-2.5 rounded-xl text-xs font-medium outline-none w-full appearance-none transition-all duration-200 cursor-pointer"
                  style={{ ...FIELD_STYLE, paddingRight: 32 }}
                  onMouseEnter={enterField}
                  onMouseLeave={leaveField}
                  onFocus={focusField}
                  onBlur={blurField}
                >
                  {UNIVERSIDADES.map(u => <option key={u} value={u}>{UNIVERSIDAD_LABELS[u]}</option>)}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(0,0,0,0.2)' }}>
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.6)' }}>
                Nivel académico<span className="ml-0.5" style={{ color: '#F43843' }}>*</span>
              </label>
              <div className="relative">
                <select
                  value={nivel}
                  onChange={e => setNivel(e.target.value as NivelPrograma)}
                  className="px-3 py-2.5 rounded-xl text-xs font-medium outline-none w-full appearance-none transition-all duration-200 cursor-pointer"
                  style={{ ...FIELD_STYLE, paddingRight: 32 }}
                  onMouseEnter={enterField}
                  onMouseLeave={leaveField}
                  onFocus={focusField}
                  onBlur={blurField}
                >
                  {NIVELES.map(n => <option key={n} value={n}>{NIVEL_LABELS[n]}</option>)}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(0,0,0,0.2)' }}>
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isDuplicate && nameNorm && (
          <p className="mt-3 text-[10px] font-semibold" style={{ color: '#F43843' }}>
            Esta carrera ya existe en {UNIVERSIDAD_LABELS[universidad]} · {NIVEL_LABELS[nivel]}.
          </p>
        )}

        <div className="flex gap-3 mt-7">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onClose} className="flex-1 py-3 rounded-xl text-xs font-bold" style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.45)' }}>
            Cancelar
          </motion.button>
          <motion.button
            whileHover={{ scale: valid ? 1.02 : 1 }}
            whileTap={{ scale: valid ? 0.98 : 1 }}
            onClick={submit}
            className="flex-1 py-3 rounded-xl text-xs font-bold text-white"
            style={{
              background: BLUE_GRAD,
              boxShadow: valid ? '0 8px 20px rgba(18,112,183,0.35)' : 'none',
              opacity: valid ? 1 : 0.4,
              cursor: valid ? 'pointer' : 'not-allowed',
            }}
          >
            {mode === 'edit' ? 'Guardar cambios' : 'Guardar carrera'}
          </motion.button>
        </div>
      </div>
    </ModalShell>
  )
}

type ModalState =
  | { kind: 'add' }
  | { kind: 'edit'; id: string }

type ConfirmState =
  | { kind: 'delete'; id: string; name: string }
  | { kind: 'inactivate'; id: string; name: string; count: number }

export default function CareersSection() {
  const { programas, crear, actualizar, eliminar } = useProgramas()
  const [modal, setModal] = useState<ModalState | null>(null)
  const [confirm, setConfirm] = useState<ConfirmState | null>(null)

  const editProgram = modal?.kind === 'edit' ? programas.find(p => p.id_programa === modal.id) : undefined

  const handleSaveCareer = async (name: string, universidad: Universidad, nivel: NivelPrograma) => {
    if (!modal) return
    try {
      if (modal.kind === 'edit') {
        await actualizar(modal.id, { nombre: name, universidad, tipo_programa: nivel })
      } else {
        await crear(name, universidad, nivel)
      }
      setModal(null)
    } catch (err) {
      console.error('Error saving career:', err)
    }
  }

  const handleDeleteCareer = async () => {
    if (!confirm) return
    try {
      await eliminar(confirm.id)
      setConfirm(null)
    } catch (err) {
      console.error('Error deleting career:', err)
    }
  }

  const handleInactivateCareer = async () => {
    if (!confirm) return
    try {
      await actualizar(confirm.id, {})
      setConfirm(null)
    } catch (err) {
      console.error('Error inactivating career:', err)
    }
  }

  return (
    <div className="space-y-6">
      <CareerList
        programas={programas}
        onOpenAdd={() => setModal({ kind: 'add' })}
        onOpenEdit={id => setModal({ kind: 'edit', id })}
        onRequestDelete={(id, name) => setConfirm({ kind: 'delete', id, name })}
        onRequestInactivate={(id, name, count) => setConfirm({ kind: 'inactivate', id, name, count })}
        onRequestActivate={() => {}}
      />

      {modal && (
        <CareerModal
          mode={modal.kind}
          initialName={editProgram?.nombre ?? ''}
          initialUniversidad={editProgram?.universidad ?? 'uni_colombia'}
          initialNivel={editProgram?.tipo_programa ?? 'profesional'}
          programs={programas}
          onSave={handleSaveCareer}
          onClose={() => setModal(null)}
        />
      )}

      {confirm && confirm.kind === 'delete' && (
        <ConfirmModal
          title="¿Eliminar carrera?"
          description={`La carrera "${confirm.name}" no tiene estudiantes registrados y se eliminará de forma permanente. Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar"
          color="#F43843"
          onConfirm={handleDeleteCareer}
          onClose={() => setConfirm(null)}
        />
      )}

      {confirm && confirm.kind === 'inactivate' && (
        <ConfirmModal
          title="¿Inactivar carrera?"
          description={`La carrera "${confirm.name}" tiene ${confirm.count} estudiantes registrados y no se puede eliminar. Al inactivarla dejará de estar disponible para nuevos registros.`}
          confirmLabel="Inactivar"
          color="#F5A623"
          onConfirm={handleInactivateCareer}
          onClose={() => setConfirm(null)}
        />
      )}
    </div>
  )
}