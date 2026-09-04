import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { Inbox } from 'lucide-react'
import { listarAreas, listarCargos, crearArea, crearCargo, actualizarArea, actualizarCargo, eliminarArea, eliminarCargo } from '@/services/catalogo.service'
import { FLAT_REGISTERED } from '@/data/stats/flatStats'
import Pagination from '@/features/admin/components/Pagination'
import Tag from '@/features/admin/components/Tag'
import ModalShell, { ModalCloseButton } from '../components/ModalShell'
import RowActions from '../components/RowActions'
import ListSearch from '../components/ListSearch'
import AddButton from '../components/AddButton'
import ConfirmModal from '../components/ConfirmModal'
import type { ApartadoConfig } from '../components/apartados'
import { BLUE, BLUE_GRAD, PAGE_SIZE, FIELD_STYLE, enterField, leaveField, focusField, blurField } from '../components/fields'
import type { Area, Cargo } from '@/types/catalogo'

type FlatItem = Area | Cargo

function FlatList({ apartado, items, inactive, onOpenAdd, onOpenEdit, onRequestDelete, onRequestInactivate, onRequestActivate }: {
  apartado: ApartadoConfig
  items: FlatItem[]
  inactive: string[]
  onOpenAdd: () => void
  onOpenEdit: (index: number) => void
  onRequestDelete: (index: number, name: string) => void
  onRequestInactivate: (name: string, count: number) => void
  onRequestActivate: (name: string) => void
}) {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const { icon: Icon, title, color } = apartado
  const q = query.trim().toLowerCase()

  const filtered = useMemo(() => (q ? items.filter(i => i.nombre.toLowerCase().includes(q)) : items), [items, q])
  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  useEffect(() => { setPage(1) }, [query])

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="premium-card rounded-2xl overflow-hidden">
      <div className="relative px-6 pt-5 pb-4 flex items-center justify-between gap-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <div className="absolute -right-8 -top-10 w-40 h-40 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${color}1F, transparent 65%)` }} />
        <ListSearch value={query} onChange={setQuery} placeholder={`Buscar ${title.toLowerCase()}...`} />
        <AddButton background={BLUE_GRAD} glow={`${BLUE}42`} onClick={onOpenAdd} />
      </div>

      <div className="px-6 py-4">
        <div className="grid grid-cols-[1fr_auto] gap-4 px-4 mb-3">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.12em]" style={{ color: 'rgba(0,0,0,0.4)' }}>{title}</p>
          <p className="w-[68px] text-[10px] font-extrabold uppercase tracking-[0.12em] text-right" style={{ color: 'rgba(0,0,0,0.4)' }}>Acciones</p>
        </div>

        {paged.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl py-10" style={{ background: 'rgba(0,0,0,0.02)', border: '1px dashed rgba(0,0,0,0.08)' }}>
            <Inbox size={22} style={{ color: 'rgba(0,0,0,0.2)' }} />
            <p className="text-xs font-semibold" style={{ color: 'rgba(0,0,0,0.35)' }}>
              {q ? 'Sin resultados para la búsqueda.' : `Aún no hay ${title.toLowerCase()}. Agrega el primero.`}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {paged.map((item, i) => {
              const originalIndex = items.findIndex(it => it.id === item.id)
              const inactiveItem = inactive.includes(item.nombre)
              const registered = FLAT_REGISTERED[apartado.key]?.[item.nombre] ?? 0
              return (
                <motion.div
                  key={`${item.id}-${i}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="grid grid-cols-[1fr_auto] items-center gap-4 p-4 rounded-2xl premium-card"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}12`, border: `1px solid ${color}20`, opacity: inactiveItem ? 0.5 : 1 }}>
                      <Icon size={16} style={{ color }} />
                    </div>
                    <div className="flex flex-col gap-1 min-w-0">
                      <p className="text-[#1A1A1E] text-sm font-extrabold truncate">{item.nombre}</p>
                      {inactiveItem && (
                        <Tag color="rgba(0,0,0,0.4)" bg="rgba(0,0,0,0.05)" weight="extrabold" size="sm">
                          Inactiva
                        </Tag>
                      )}
                    </div>
                  </div>
                  <RowActions
                    state={inactiveItem ? 'reactivate' : registered > 0 ? 'inactivate' : 'delete'}
                    onReactivate={() => onRequestActivate(item.nombre)}
                    onInactivate={() => onRequestInactivate(item.nombre, registered)}
                    onDelete={() => onRequestDelete(originalIndex, item.nombre)}
                    onEdit={() => onOpenEdit(originalIndex)}
                    reactivateTitle="Reactivar"
                    inactivateTitle={`Inactivar (${registered} usuarios)`}
                    deleteTitle="Eliminar"
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

function ItemsModal({ apartado, mode, editIndex, existing, onSave, onClose }: {
  apartado: ApartadoConfig
  mode: 'add' | 'edit'
  editIndex: number | null
  existing: FlatItem[]
  onSave: (names: string[]) => void
  onClose: () => void
}) {
  const existingNames = existing.map(e => e.nombre)
  const [text, setText] = useState(mode === 'edit' && editIndex !== null ? existingNames[editIndex] : '')
  const { icon: Icon, title, singular, subtitle, color } = apartado

  const value = text.trim()
  const isDuplicate = mode === 'add' && value.length > 0 && existingNames.some(e => e.toLowerCase() === value.toLowerCase())
  const valid = value.length > 0 && !isDuplicate

  const submit = () => {
    if (!valid) return
    onSave([value])
  }

  return (
    <ModalShell onClose={onClose}>
      <div className="relative px-7 pt-6 pb-5" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
        <div className="absolute top-5 right-6">
          <ModalCloseButton onClick={onClose} />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}0F`, border: `1px solid ${color}1A` }}>
            <Icon size={20} style={{ color }} />
          </div>
          <div>
            <h2 className="text-base font-extrabold tracking-tight" style={{ color: '#1A1A1E' }}>
              {mode === 'edit' ? `Editar ${singular}` : `Nueva ${singular}`}
            </h2>
            <p className="text-[11px] mt-0.5" style={{ color: 'rgba(0,0,0,0.4)' }}>{subtitle}</p>
          </div>
        </div>
      </div>

      <div className="px-7 py-6">
        <label className="block text-[11px] font-bold mb-1.5" style={{ color: 'rgba(0,0,0,0.6)' }}>
          Nombre<span className="ml-0.5" style={{ color: '#F43843' }}>*</span>
        </label>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          autoFocus
          placeholder={`Nombre de la ${singular}...`}
          className="px-3 py-2.5 rounded-xl text-xs font-medium outline-none w-full transition-all duration-200"
          style={{ ...FIELD_STYLE, border: isDuplicate ? '1px solid #F43843' : '1px solid transparent' }}
          onMouseEnter={enterField}
          onMouseLeave={leaveField}
          onFocus={focusField}
          onBlur={blurField}
        />

        {isDuplicate && (
          <p className="mt-3 text-[10px] font-semibold" style={{ color: '#F43843' }}>
            Este {singular} ya existe en la lista.
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
              background: `linear-gradient(135deg, ${color}, ${color}E6)`,
              boxShadow: valid ? `0 8px 20px ${color}3D` : 'none',
              opacity: valid ? 1 : 0.4,
              cursor: valid ? 'pointer' : 'not-allowed',
            }}
          >
            {mode === 'edit' ? 'Guardar cambios' : `Agregar ${singular}`}
          </motion.button>
        </div>
      </div>
    </ModalShell>
  )
}

type ConfirmState =
  | { kind: 'delete'; index: number; name: string }
  | { kind: 'inactivate'; name: string; count: number }
  | { kind: 'activate'; name: string }

type ModalState = { kind: 'add' | 'edit'; editIndex: number | null }

export default function FlatSection({ apartado }: { apartado: ApartadoConfig }) {
  const [items, setItems] = useState<FlatItem[]>([])
  const [loading, setLoading] = useState(true)
  const [inactive, setInactive] = useState<string[]>([])
  const [modal, setModal] = useState<ModalState | null>(null)
  const [confirm, setConfirm] = useState<ConfirmState | null>(null)

  const key = apartado.key
  const isArea = key === 'areas'

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const data = isArea ? await listarAreas() : await listarCargos()
      setItems(data.filter(item => item.activo))
    } catch {
      // fallback to empty
    } finally {
      setLoading(false)
    }
  }, [isArea])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const inactiveList = inactive // We'll keep inactive in localStorage for now since backend doesn't have this concept

  const handleSaveFlat = async (names: string[]) => {
    if (!modal) return
    const name = names[0]
    try {
      if (modal.kind === 'edit' && modal.editIndex !== null) {
        const item = items[modal.editIndex]
        const updated = isArea ? await actualizarArea(item.id, names[0]) : await actualizarCargo(item.id, names[0])
        setItems(items.map((item, i) => i === modal.editIndex ? updated : item))
      } else {
        const created = isArea ? await crearArea(name) : await crearCargo(name)
        setItems(prev => [...prev, created])
      }
      setModal(null)
    } catch (err) {
      console.error('Error saving flat:', err)
    }
  }

  const handleDeleteFlat = async (index: number) => {
    const item = items[index]
    try {
      if (isArea) await eliminarArea(item.id)
      else await eliminarCargo(item.id)
      setItems(prev => prev.filter((_, i) => i !== index))
    } catch (err) {
      console.error('Error deleting flat:', err)
    }
  }

  const toggleInactive = (name: string, shouldInactivate: boolean) => {
    const current = inactive
    const next = shouldInactivate
      ? current.includes(name) ? current : [...current, name]
      : current.filter(n => n !== name)
    setInactive(next)
    // Keep inactive in localStorage for now
    localStorage.setItem('unifit_flat_inactivos_v1', JSON.stringify({ areas: inactive, cargos: inactive }))
  }

  return (
    <div className="space-y-6">
      <FlatList
        apartado={apartado}
        items={items}
        inactive={inactiveList}
        onOpenAdd={() => setModal({ kind: 'add', editIndex: null })}
        onOpenEdit={index => setModal({ kind: 'edit', editIndex: index })}
        onRequestDelete={(index, name) => setConfirm({ kind: 'delete', index, name })}
        onRequestInactivate={(name, count) => setConfirm({ kind: 'inactivate', name, count })}
        onRequestActivate={name => setConfirm({ kind: 'activate', name })}
      />

      {modal && (
        <ItemsModal
          apartado={apartado}
          mode={modal.kind}
          editIndex={modal.editIndex}
          existing={items}
          onSave={handleSaveFlat}
          onClose={() => setModal(null)}
        />
      )}

      {confirm && confirm.kind === 'delete' && (
        <ConfirmModal
          title={`¿Eliminar ${apartado.singular}?`}
          description={`El ${apartado.singular} "${confirm.name}" no tiene usuarios registrados y se eliminará de forma permanente. Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar"
          color="#F43843"
          onConfirm={() => { handleDeleteFlat(confirm.index); setConfirm(null) }}
          onClose={() => setConfirm(null)}
        />
      )}

      {confirm && confirm.kind === 'inactivate' && (
        <ConfirmModal
          title={`¿Inactivar ${apartado.singular}?`}
          description={`El ${apartado.singular} "${confirm.name}" tiene ${confirm.count} usuarios registrados y no se puede eliminar. Al inactivarlo dejará de estar disponible para nuevos registros.`}
          confirmLabel="Inactivar"
          color="#F5A623"
          onConfirm={() => { toggleInactive(confirm.name, true); setConfirm(null) }}
          onClose={() => setConfirm(null)}
        />
      )}

      {confirm && confirm.kind === 'activate' && (
        <ConfirmModal
          title={`¿Reactivar ${apartado.singular}?`}
          description={`El ${apartado.singular} "${confirm.name}" volverá a estar activo y disponible para nuevos registros.`}
          confirmLabel="Reactivar"
          color="#30D158"
          onConfirm={() => { toggleInactive(confirm.name, false); setConfirm(null) }}
          onClose={() => setConfirm(null)}
        />
      )}
    </div>
  )
}
