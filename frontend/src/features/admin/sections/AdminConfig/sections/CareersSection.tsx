import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { GraduationCap, Inbox } from 'lucide-react'
import { INSTITUCIONES, getNiveles, loadPrograms, savePrograms } from '@/data/config/academicPrograms'
import { loadInactiveCareers, saveInactiveCareers } from '@/data/config/systemConfig'
import { CAREER_REGISTERED } from '@/data/stats/careerStats'
import Pagination from '@/features/admin/components/Pagination'
import Tag from '@/features/admin/components/Tag'
import ModalShell, { ModalCloseButton } from '../components/ModalShell'
import RowActions from '../components/RowActions'
import ListSearch from '../components/ListSearch'
import AddButton from '../components/AddButton'
import ConfirmModal from '../components/ConfirmModal'
import { BLUE, BLUE_GRAD, INSTITUTION_COLORS, PAGE_SIZE, FIELD_STYLE, enterField, leaveField, focusField, blurField } from '../components/fields'

type Programs = Record<string, Record<string, string[]>>

function clonePrograms(programs: Programs): Programs {
  const next: Programs = {}
  INSTITUCIONES.forEach(inst => {
    next[inst] = {}
    getNiveles(inst).forEach(level => {
      next[inst][level] = [...(programs[inst]?.[level] ?? [])]
    })
  })
  return next
}

type CareerRow = { institution: string; level: string; name: string; index: number }

function CareerList({ programs, inactive, onOpenAdd, onOpenEdit, onRequestDelete, onRequestInactivate, onRequestActivate }: {
  programs: Programs
  inactive: Record<string, string[]>
  onOpenAdd: (institution: string, level: string) => void
  onOpenEdit: (institution: string, level: string, index: number) => void
  onRequestDelete: (institution: string, level: string, index: number, name: string) => void
  onRequestInactivate: (institution: string, level: string, name: string, count: number) => void
  onRequestActivate: (institution: string, level: string, name: string) => void
}) {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const q = query.trim().toLowerCase()
  const isInactive = (inst: string, lvl: string, name: string) => (inactive[`${inst}|${lvl}`] ?? []).includes(name)

  const rows = useMemo(() => {
    const out: CareerRow[] = []
    INSTITUCIONES.forEach(inst => {
      getNiveles(inst).forEach(level => {
        (programs[inst]?.[level] ?? []).forEach((name, index) => {
          if (!q || name.toLowerCase().includes(q) || inst.toLowerCase().includes(q) || level.toLowerCase().includes(q)) {
            out.push({ institution: inst, level, name, index })
          }
        })
      })
    })
    return out
  }, [programs, q])

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
        <AddButton background={BLUE_GRAD} glow={`${BLUE}42`} onClick={() => onOpenAdd(INSTITUCIONES[0], getNiveles(INSTITUCIONES[0])[0])} />
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
            {paged.map((row, i) => {
              const color = INSTITUTION_COLORS[INSTITUCIONES.indexOf(row.institution) % INSTITUTION_COLORS.length]
              const inactiveCareer = isInactive(row.institution, row.level, row.name)
              const studentsCount = CAREER_REGISTERED[row.name] ?? 0
              return (
                <motion.div
                  key={`${row.institution}|${row.level}|${row.name}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="grid grid-cols-[2fr_1.6fr_1fr_auto] items-center gap-4 p-4 rounded-2xl premium-card"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}12`, border: `1px solid ${color}20`, opacity: inactiveCareer ? 0.5 : 1 }}>
                      <GraduationCap size={16} style={{ color }} />
                    </div>
                    <p className="text-[#1A1A1E] text-sm font-extrabold truncate">{row.name}</p>
                  </div>
                  <p className="text-xs font-bold truncate" style={{ color: 'rgba(0,0,0,0.6)' }}>{row.institution}</p>
                  <div className="flex flex-col gap-1.5 w-fit">
                    <Tag color={BLUE} bg={`${BLUE}0D`} weight="extrabold" style={{ opacity: inactiveCareer ? 0.45 : 1 }}>
                      {row.level}
                    </Tag>
                    {inactiveCareer && (
                      <Tag color="rgba(0,0,0,0.4)" bg="rgba(0,0,0,0.05)" weight="extrabold">
                        Inactiva
                      </Tag>
                    )}
                  </div>
                  <RowActions
                    state={inactiveCareer ? 'reactivate' : studentsCount > 0 ? 'inactivate' : 'delete'}
                    onReactivate={() => onRequestActivate(row.institution, row.level, row.name)}
                    onInactivate={() => onRequestInactivate(row.institution, row.level, row.name, studentsCount)}
                    onDelete={() => onRequestDelete(row.institution, row.level, row.index, row.name)}
                    onEdit={() => onOpenEdit(row.institution, row.level, row.index)}
                    reactivateTitle="Reactivar carrera"
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

function CareerModal({ mode, initialName, institution, level, editIndex, programs, onSave, onClose }: {
  mode: 'add' | 'edit'
  initialName: string
  institution: string
  level: string
  editIndex: number | null
  programs: Programs
  onSave: (name: string, institution: string, level: string) => void
  onClose: () => void
}) {
  const [name, setName] = useState(initialName)
  const [inst, setInst] = useState(institution)
  const [lvl, setLvl] = useState(level)

  const levels = getNiveles(inst)

  useEffect(() => {
    if (!levels.includes(lvl)) setLvl(levels[0])
  }, [inst]) // eslint-disable-line react-hooks/exhaustive-deps

  const nameNorm = name.trim()
  const target = programs[inst]?.[lvl] ?? []
  const isDuplicate = target.some((item, idx) => {
    if (mode === 'edit' && inst === institution && lvl === level && idx === editIndex) return false
    return item.toLowerCase() === nameNorm.toLowerCase()
  })
  const valid = nameNorm !== '' && !isDuplicate

  const submit = () => {
    if (!valid) return
    onSave(nameNorm, inst, lvl)
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
                  value={inst}
                  onChange={e => setInst(e.target.value)}
                  className="px-3 py-2.5 rounded-xl text-xs font-medium outline-none w-full appearance-none transition-all duration-200 cursor-pointer"
                  style={{ ...FIELD_STYLE, paddingRight: 32 }}
                  onMouseEnter={enterField}
                  onMouseLeave={leaveField}
                  onFocus={focusField}
                  onBlur={blurField}
                >
                  {INSTITUCIONES.map(o => <option key={o} value={o}>{o}</option>)}
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
                  value={lvl}
                  onChange={e => setLvl(e.target.value)}
                  className="px-3 py-2.5 rounded-xl text-xs font-medium outline-none w-full appearance-none transition-all duration-200 cursor-pointer"
                  style={{ ...FIELD_STYLE, paddingRight: 32 }}
                  onMouseEnter={enterField}
                  onMouseLeave={leaveField}
                  onFocus={focusField}
                  onBlur={blurField}
                >
                  {levels.map(o => <option key={o} value={o}>{o}</option>)}
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
            Esta carrera ya existe en {inst} · {lvl}.
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
  | { kind: 'add' | 'edit'; institution: string; level: string; editIndex: number | null }

type ConfirmState =
  | { kind: 'delete'; institution: string; level: string; index: number; name: string }
  | { kind: 'inactivate'; institution: string; level: string; name: string; count: number }
  | { kind: 'activate'; institution: string; level: string; name: string }

export default function CareersSection() {
  const [programs, setPrograms] = useState<Programs>(() => loadPrograms())
  const [inactive, setInactive] = useState<Record<string, string[]>>(() => loadInactiveCareers())
  const [modal, setModal] = useState<ModalState | null>(null)
  const [confirm, setConfirm] = useState<ConfirmState | null>(null)

  const handleSaveCareer = (name: string, inst: string, lvl: string) => {
    if (!modal) return
    const next = clonePrograms(programs)
    if (modal.mode === 'edit' && modal.editIndex !== null) {
      next[modal.institution][modal.level] = next[modal.institution][modal.level].filter((_, i) => i !== modal.editIndex)
    }
    next[inst][lvl] = [...(next[inst][lvl] ?? []), name]
    setPrograms(next)
    savePrograms(next)
    setModal(null)
  }

  const handleDeleteCareer = (inst: string, lvl: string, index: number) => {
    const next = clonePrograms(programs)
    next[inst][lvl] = next[inst][lvl].filter((_, i) => i !== index)
    setPrograms(next)
    savePrograms(next)
  }

  const toggleInactive = (inst: string, lvl: string, name: string, shouldInactivate: boolean) => {
    const key = `${inst}|${lvl}`
    const current = inactive[key] ?? []
    const nextMap = { ...inactive }
    if (shouldInactivate) {
      nextMap[key] = current.includes(name) ? current : [...current, name]
    } else {
      nextMap[key] = current.filter(n => n !== name)
      if (nextMap[key].length === 0) delete nextMap[key]
    }
    setInactive(nextMap)
    saveInactiveCareers(nextMap)
  }

  return (
    <div className="space-y-6">
      <CareerList
        programs={programs}
        inactive={inactive}
        onOpenAdd={(institution, level) => setModal({ kind: 'add', institution, level, editIndex: null })}
        onOpenEdit={(institution, level, index) => setModal({ kind: 'edit', institution, level, editIndex: index })}
        onRequestDelete={(institution, level, index, name) => setConfirm({ kind: 'delete', institution, level, index, name })}
        onRequestInactivate={(institution, level, name, count) => setConfirm({ kind: 'inactivate', institution, level, name, count })}
        onRequestActivate={(institution, level, name) => setConfirm({ kind: 'activate', institution, level, name })}
      />

      {modal && (
        <CareerModal
          mode={modal.kind}
          initialName={modal.kind === 'edit' && modal.editIndex !== null ? programs[modal.institution]?.[modal.level]?.[modal.editIndex] ?? '' : ''}
          institution={modal.institution}
          level={modal.level}
          editIndex={modal.editIndex}
          programs={programs}
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
          onConfirm={() => { handleDeleteCareer(confirm.institution, confirm.level, confirm.index); setConfirm(null) }}
          onClose={() => setConfirm(null)}
        />
      )}

      {confirm && confirm.kind === 'inactivate' && (
        <ConfirmModal
          title="¿Inactivar carrera?"
          description={`La carrera "${confirm.name}" tiene ${confirm.count} estudiantes registrados y no se puede eliminar. Al inactivarla dejará de estar disponible para nuevos registros.`}
          confirmLabel="Inactivar"
          color="#F5A623"
          onConfirm={() => { toggleInactive(confirm.institution, confirm.level, confirm.name, true); setConfirm(null) }}
          onClose={() => setConfirm(null)}
        />
      )}

      {confirm && confirm.kind === 'activate' && (
        <ConfirmModal
          title="¿Reactivar carrera?"
          description={`La carrera "${confirm.name}" volverá a estar activa y disponible para nuevos registros.`}
          confirmLabel="Reactivar"
          color="#30D158"
          onConfirm={() => { toggleInactive(confirm.institution, confirm.level, confirm.name, false); setConfirm(null) }}
          onClose={() => setConfirm(null)}
        />
      )}
    </div>
  )
}
