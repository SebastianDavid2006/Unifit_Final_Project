import { useEffect, useMemo, useRef, useState, type MouseEvent, type FocusEvent, type CSSProperties } from 'react'
import { motion } from 'motion/react'
import { GraduationCap, Building2, Briefcase, Plus, X, Search, Inbox, ChevronLeft, ChevronRight, FileText, RotateCcw, AlertTriangle, ShieldCheck, ClipboardCheck, Upload, Eye } from 'lucide-react'
import editActionGif from '../../assets/icons/animated/actions/edit.gif'
import trashActionGif from '../../assets/icons/animated/actions/trash.gif'
import inactiveActionGif from '../../assets/icons/animated/actions/inactive.gif'
import { loadConfigItems, saveConfigItems, loadInactiveCareers, saveInactiveCareers, loadInactiveFlat, saveInactiveFlat, type ConfigKey } from '../../data/systemConfig'
import { INSTITUCIONES, getNiveles, loadPrograms, savePrograms } from '../../data/academicPrograms'
import { FLAT_REGISTERED } from '../../data/flatStats'
import { loadDocs, saveDoc, DOC_ORDER, DOC_TITLES, type DocKey, type StoredDocs } from '../../data/documents'
import { CAREER_REGISTERED } from '../../data/careerStats'

const BLUE = '#1270B7'
const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #7ec8e3)'
const PAGE_SIZE = 6
const MESH_BG = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)'
const MESH_HOVER = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(0,0,0,0.04)'
const INSTITUTION_COLORS = ['#1270B7', '#F43843', '#F5A623', '#30D158', '#BF5AF2', '#FF9500', '#00C7BE', '#5E5CE6']

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

function enterField(e: MouseEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  if (e.currentTarget !== document.activeElement) {
    e.currentTarget.style.background = MESH_HOVER
    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'
  }
}
function leaveField(e: MouseEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  if (e.currentTarget !== document.activeElement) {
    e.currentTarget.style.background = MESH_BG
    e.currentTarget.style.borderColor = 'transparent'
  }
}
function focusField(e: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.currentTarget.style.borderColor = BLUE
  e.currentTarget.style.background = MESH_HOVER
  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(18,112,183,0.08)'
}
function blurField(e: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.currentTarget.style.borderColor = 'transparent'
  e.currentTarget.style.background = MESH_BG
  e.currentTarget.style.boxShadow = 'none'
}

const FIELD_STYLE: CSSProperties = {
  background: MESH_BG,
  color: '#1A1A1E',
  border: '1px solid transparent',
}

/* ── Paginación ─────────────────────────────────────────────────────── */

function Pagination({ page, totalPages, onPage }: { page: number; totalPages: number; onPage: (p: number) => void }) {
  const pageNumbers: (number | '…')[] = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const set = new Set<number>([1, totalPages, page - 1, page, page + 1])
    const sorted = [...set].filter(p => p >= 1 && p <= totalPages).sort((a, b) => a - b)
    const out: (number | '…')[] = []
    let prev = 0
    sorted.forEach(p => {
      if (p - prev > 1) out.push('…')
      out.push(p)
      prev = p
    })
    return out
  }, [totalPages, page])

  return (
    <div className="flex items-center justify-center gap-1.5 pt-4">
      <motion.button
        whileHover={page > 1 ? { scale: 1.1 } : {}}
        whileTap={page > 1 ? { scale: 0.92 } : {}}
        onClick={() => onPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
        style={{
          background: page === 1 ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.06)',
          color: page === 1 ? 'rgba(0,0,0,0.2)' : '#111111',
          cursor: page === 1 ? 'default' : 'pointer',
        }}
      >
        <ChevronLeft size={15} />
      </motion.button>

      {pageNumbers.map((p, i) =>
        p === '…' ? (
          <span key={`e${i}`} className="w-8 h-8 flex items-center justify-center text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.3)' }}>…</span>
        ) : (
          <motion.button
            key={p}
            whileHover={p !== page ? { scale: 1.1 } : {}}
            whileTap={{ scale: 0.92 }}
            onClick={() => onPage(p)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold transition-all"
            style={{
              background: p === page ? '#111111' : 'rgba(0,0,0,0.05)',
              color: p === page ? '#FFFFFF' : '#111111',
              boxShadow: p === page ? '0 4px 12px rgba(0,0,0,0.25)' : 'none',
              cursor: 'pointer',
            }}
          >
            {p}
          </motion.button>
        )
      )}

      <motion.button
        whileHover={page < totalPages ? { scale: 1.1 } : {}}
        whileTap={page < totalPages ? { scale: 0.92 } : {}}
        onClick={() => onPage(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
        style={{
          background: page === totalPages ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.06)',
          color: page === totalPages ? 'rgba(0,0,0,0.2)' : '#111111',
          cursor: page === totalPages ? 'default' : 'pointer',
        }}
      >
        <ChevronRight size={15} />
      </motion.button>
    </div>
  )
}

/* ── Botón de agregar (solo +, se expande a la izquierda al hover) ── */

function AddButton({ background, glow, onClick }: { background: string; glow: string; onClick: () => void }) {
  return (
    <motion.button
      initial="rest"
      whileHover="hover"
      animate="rest"
      onClick={onClick}
      title="Agregar"
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      variants={{ rest: { width: 36 }, hover: { width: 92 } }}
      className="absolute right-6 top-1/2 h-9 flex items-center justify-end rounded-xl overflow-hidden flex-shrink-0 text-white cursor-pointer"
      style={{ background, boxShadow: `0 8px 20px ${glow}`, marginTop: -18 }}
    >
      <motion.span
        variants={{
          rest: { width: 0, opacity: 0, marginRight: 0 },
          hover: { width: 54, opacity: 1, marginRight: 2 },
        }}
        className="whitespace-nowrap text-xs font-bold overflow-hidden"
      >
        Agregar
      </motion.span>
      <div className="h-9 flex items-center justify-center px-2.5 flex-shrink-0">
        <Plus size={16} strokeWidth={2.6} />
      </div>
    </motion.button>
  )
}

/* ── Carreras (lista paginada por institución y nivel) ─────────────── */

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
        <div className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 w-72" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)' }}>
          <Search size={14} style={{ color: 'rgba(0,0,0,0.3)' }} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar carrera, institución o nivel..." className="flex-1 bg-transparent text-[11px] font-semibold outline-none" style={{ color: '#1A1A1E' }} />
          {query && (
            <button onClick={() => setQuery('')} className="flex-shrink-0" style={{ color: 'rgba(0,0,0,0.4)' }}>
              <X size={12} />
            </button>
          )}
        </div>
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
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-extrabold w-fit" style={{ background: `${BLUE}0D`, color: BLUE, opacity: inactiveCareer ? 0.45 : 1 }}>
                      {row.level}
                    </span>
                    {inactiveCareer && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-extrabold w-fit" style={{ background: 'rgba(0,0,0,0.05)', color: 'rgba(0,0,0,0.4)' }}>
                        Inactiva
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 justify-end">
                    {inactiveCareer ? (
                      <button onClick={() => onRequestActivate(row.institution, row.level, row.name)} title="Reactivar carrera" className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer hover:bg-[#30D158]/10 hover:scale-110 hover:shadow-[0_4px_14px_rgba(48,209,88,0.28)]" style={{ color: '#30D158', background: 'rgba(48,209,88,0.1)' }}>
                        <RotateCcw size={13} />
                      </button>
                    ) : studentsCount > 0 ? (
                      <button onClick={() => onRequestInactivate(row.institution, row.level, row.name, studentsCount)} title={`Inactivar carrera (${studentsCount} estudiantes)`} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer hover:bg-[#F5A623]/10 hover:scale-110 hover:shadow-[0_4px_14px_rgba(245,166,35,0.28)]" style={{ background: 'rgba(245,166,35,0.1)' }}>
                        <img src={inactiveActionGif} alt="Inactivar" className="w-4 h-4 object-contain" />
                      </button>
                    ) : (
                      <button onClick={() => onRequestDelete(row.institution, row.level, row.index, row.name)} title="Eliminar carrera" className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer hover:bg-[#F43843]/10 hover:scale-110 hover:shadow-[0_4px_14px_rgba(244,56,67,0.28)]" style={{ background: 'rgba(0,0,0,0.03)' }}>
                        <img src={trashActionGif} alt="Eliminar" className="w-4 h-4 object-contain" />
                      </button>
                    )}
                    <button onClick={() => onOpenEdit(row.institution, row.level, row.index)} title="Editar" className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer hover:bg-white hover:scale-110 hover:shadow-[0_4px_14px_rgba(18,112,183,0.28)]" style={{ background: 'rgba(0,0,0,0.03)' }}>
                      <img src={editActionGif} alt="Editar" className="w-4 h-4 object-contain" />
                    </button>
                  </div>
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

/* ── Modal de carrera (estilo de los modales de pasos) ─────────────── */

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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-lg rounded-3xl overflow-hidden"
        style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 25px 60px rgba(0,0,0,0.12)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="relative px-7 pt-6 pb-5" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
          <div className="absolute top-5 right-6">
            <motion.button
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              variants={{
                rest: { scale: 1, background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.3)' },
                hover: { scale: 1.15, background: 'rgba(244,56,67,0.1)', color: '#F43843' },
                tap: { scale: 0.9 },
              }}
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors"
            >
              <X size={15} />
            </motion.button>
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
      </motion.div>
    </motion.div>
  )
}

/* ── Áreas y Cargos (listas paginadas) ─────────────────────────────── */

type ApartadoConfig = {
  key: ConfigKey
  icon: typeof GraduationCap
  title: string
  singular: string
  subtitle: string
  color: string
}

const APARTADOS: ApartadoConfig[] = [
  {
    key: 'areas',
    icon: Building2,
    title: 'Áreas',
    singular: 'área',
    subtitle: 'Áreas de conocimiento o facultades',
    color: BLUE,
  },
  {
    key: 'cargos',
    icon: Briefcase,
    title: 'Cargos',
    singular: 'cargo',
    subtitle: 'Roles laborales dentro de la institución',
    color: BLUE,
  },
]

function FlatList({ apartado, items, inactive, onOpenAdd, onOpenEdit, onRequestDelete, onRequestInactivate, onRequestActivate }: {
  apartado: ApartadoConfig
  items: string[]
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

  const filtered = useMemo(() => (q ? items.filter(i => i.toLowerCase().includes(q)) : items), [items, q])
  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  useEffect(() => { setPage(1) }, [query])

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="premium-card rounded-2xl overflow-hidden">
      <div className="relative px-6 pt-5 pb-4 flex items-center justify-between gap-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <div className="absolute -right-8 -top-10 w-40 h-40 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${color}1F, transparent 65%)` }} />
        <div className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 w-72" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)' }}>
          <Search size={14} style={{ color: 'rgba(0,0,0,0.3)' }} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder={`Buscar ${title.toLowerCase()}...`} className="flex-1 bg-transparent text-[11px] font-semibold outline-none" style={{ color: '#1A1A1E' }} />
          {query && (
            <button onClick={() => setQuery('')} className="flex-shrink-0 cursor-pointer" style={{ color: 'rgba(0,0,0,0.4)' }}>
              <X size={12} />
            </button>
          )}
        </div>
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
              const originalIndex = items.indexOf(item)
              const inactiveItem = inactive.includes(item)
              const registered = FLAT_REGISTERED[apartado.key]?.[item] ?? 0
              return (
                <motion.div
                  key={`${item}-${i}`}
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
                      <p className="text-[#1A1A1E] text-sm font-extrabold truncate">{item}</p>
                      {inactiveItem && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold w-fit" style={{ background: 'rgba(0,0,0,0.05)', color: 'rgba(0,0,0,0.4)' }}>
                          Inactiva
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 justify-end">
                    {inactiveItem ? (
                      <button onClick={() => onRequestActivate(item)} title="Reactivar" className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer hover:bg-[#30D158]/10 hover:scale-110 hover:shadow-[0_4px_14px_rgba(48,209,88,0.28)]" style={{ color: '#30D158', background: 'rgba(48,209,88,0.1)' }}>
                        <RotateCcw size={13} />
                      </button>
                    ) : registered > 0 ? (
                      <button onClick={() => onRequestInactivate(item, registered)} title={`Inactivar (${registered} usuarios)`} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer hover:bg-[#F5A623]/10 hover:scale-110 hover:shadow-[0_4px_14px_rgba(245,166,35,0.28)]" style={{ background: 'rgba(245,166,35,0.1)' }}>
                        <img src={inactiveActionGif} alt="Inactivar" className="w-4 h-4 object-contain" />
                      </button>
                    ) : (
                      <button onClick={() => onRequestDelete(originalIndex, item)} title="Eliminar" className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer hover:bg-[#F43843]/10 hover:scale-110 hover:shadow-[0_4px_14px_rgba(244,56,67,0.28)]" style={{ background: 'rgba(0,0,0,0.03)' }}>
                        <img src={trashActionGif} alt="Eliminar" className="w-4 h-4 object-contain" />
                      </button>
                    )}
                    <button onClick={() => onOpenEdit(originalIndex)} title="Editar" className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer hover:bg-white hover:scale-110 hover:shadow-[0_4px_14px_rgba(18,112,183,0.28)]" style={{ background: 'rgba(0,0,0,0.03)' }}>
                      <img src={editActionGif} alt="Editar" className="w-4 h-4 object-contain" />
                    </button>
                  </div>
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

/* ── Modal de ítems (áreas y cargos, estilo de los modales de pasos) ─ */

function ItemsModal({ apartado, mode, editIndex, existing, onSave, onClose }: {
  apartado: ApartadoConfig
  mode: 'add' | 'edit'
  editIndex: number | null
  existing: string[]
  onSave: (names: string[]) => void
  onClose: () => void
}) {
  const [text, setText] = useState(mode === 'edit' && editIndex !== null ? existing[editIndex] : '')
  const { icon: Icon, title, singular, subtitle, color } = apartado

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const value = text.trim()
  const isDuplicate = mode === 'add' && value.length > 0 && existing.some(e => e.toLowerCase() === value.toLowerCase())
  const valid = value.length > 0 && !isDuplicate

  const submit = () => {
    if (!valid) return
    onSave([value])
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-lg rounded-3xl overflow-hidden"
        style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 25px 60px rgba(0,0,0,0.12)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="relative px-7 pt-6 pb-5" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
          <div className="absolute top-5 right-6">
            <motion.button
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              variants={{
                rest: { scale: 1, background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.3)' },
                hover: { scale: 1.15, background: 'rgba(244,56,67,0.1)', color: '#F43843' },
                tap: { scale: 0.9 },
              }}
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors"
            >
              <X size={15} />
            </motion.button>
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
      </motion.div>
    </motion.div>
  )
}

/* ── Documentos (contrato, tratamiento de datos y PAR-Q) ───────────── */

const DOC_META: Record<DocKey, { icon: typeof FileText; color: string; hint: string }> = {
  contrato: { icon: FileText, color: BLUE, hint: 'Contrato de prestación de servicios estudiantiles' },
  tratamiento: { icon: ShieldCheck, color: '#30D158', hint: 'Autorización para el tratamiento de datos personales' },
  parq: { icon: ClipboardCheck, color: '#F5A623', hint: 'Cuestionario de aptitud física antes de entrenar' },
}

function DocsGrid() {
  const [docs, setDocs] = useState<StoredDocs>(() => loadDocs())
  const [preview, setPreview] = useState<DocKey | null>(null)
  const [pendingKey, setPendingKey] = useState<DocKey | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const pickFile = (key: DocKey) => {
    setPendingKey(key)
    fileRef.current?.click()
  }

  const onFile = (e: MouseEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0]
    e.currentTarget.value = ''
    if (!file || !pendingKey) return
    if (file.type !== 'application/pdf') {
      alert('Solo se permiten archivos PDF.')
      setPendingKey(null)
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      saveDoc(pendingKey, file.name, dataUrl)
      setDocs(loadDocs())
      setPendingKey(null)
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    if (preview) {
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setPreview(null)
      }
      window.addEventListener('keydown', onKey)
      return () => window.removeEventListener('keydown', onKey)
    }
  }, [preview])

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-3 gap-5">
        {DOC_ORDER.map((key, i) => {
          const meta = DOC_META[key]
          const doc = docs[key]
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.08 }}
              className="rounded-2xl p-6 flex flex-col"
              style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${meta.color}10`, border: `1px solid ${meta.color}15` }}>
                <meta.icon size={18} style={{ color: meta.color }} />
              </div>
              <h4 className="text-sm font-bold" style={{ color: '#1D1D1F' }}>{DOC_TITLES[key]}</h4>
              <p className="text-[11px] mt-1.5" style={{ color: 'rgba(0,0,0,0.3)' }}>{meta.hint}</p>

              <div className="mt-4 flex items-center gap-1.5 rounded-xl px-3 py-2 w-fit text-[10px] font-bold" style={{ background: doc.dataUrl ? `${meta.color}0D` : 'rgba(0,0,0,0.03)', color: doc.dataUrl ? meta.color : 'rgba(0,0,0,0.35)' }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: doc.dataUrl ? meta.color : 'rgba(0,0,0,0.2)' }} />
                {doc.dataUrl ? `Actualizado: ${doc.fileName}` : 'Sin documento cargado'}
              </div>

              <div className="flex gap-2 mt-5 pt-4" style={{ borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => pickFile(key)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
                  style={{ background: BLUE_GRAD, boxShadow: `0 6px 16px ${BLUE}2E` }}
                >
                  <Upload size={13} />
                  {doc.dataUrl ? 'Reemplazar' : 'Subir PDF'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: doc.dataUrl ? 1.03 : 1 }}
                  whileTap={{ scale: doc.dataUrl ? 0.97 : 1 }}
                  onClick={() => doc.dataUrl && setPreview(key)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                  style={{ background: 'rgba(0,0,0,0.04)', color: doc.dataUrl ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.2)', cursor: doc.dataUrl ? 'pointer' : 'default' }}
                >
                  <Eye size={13} />
                  Ver
                </motion.button>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      <input ref={fileRef} type="file" accept="application/pdf" className="hidden" onChange={onFile} />

      {preview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(6px)' }}
          onClick={() => setPreview(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-3xl rounded-3xl overflow-hidden"
            style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 25px 60px rgba(0,0,0,0.15)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
              <div className="flex items-center gap-2">
                <FileText size={15} style={{ color: DOC_META[preview].color }} />
                <span className="text-sm font-extrabold" style={{ color: '#1A1A1E' }}>{DOC_TITLES[preview]}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setPreview(null)}
                className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer"
                style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.4)' }}
              >
                <X size={15} />
              </motion.button>
            </div>
            <div className="p-6 bg-[#F5F5F7]">
              {docs[preview].dataUrl ? (
                <iframe src={docs[preview].dataUrl} title={DOC_TITLES[preview]} className="w-full h-[70vh] rounded-2xl bg-white" style={{ border: '1px solid rgba(0,0,0,0.06)' }} />
              ) : (
                <div className="w-full h-[70vh] rounded-2xl flex flex-col items-center justify-center gap-2 bg-white" style={{ border: '1px dashed rgba(0,0,0,0.12)' }}>
                  <FileText size={28} style={{ color: 'rgba(0,0,0,0.2)' }} />
                  <p className="text-xs font-semibold" style={{ color: 'rgba(0,0,0,0.35)' }}>No hay documento cargado para previsualizar.</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}

/* ── Modal de confirmación ──────────────────────────────────────────── */

function ConfirmModal({ title, description, confirmLabel, color, onConfirm, onClose }: {
  title: string
  description: string
  confirmLabel: string
  color: string
  onConfirm: () => void
  onClose: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md rounded-3xl overflow-hidden"
        style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 25px 60px rgba(0,0,0,0.12)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="relative px-7 pt-8 pb-6 text-center" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
          <div className="absolute top-5 right-6">
            <motion.button
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              variants={{
                rest: { scale: 1, background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.3)' },
                hover: { scale: 1.15, background: 'rgba(244,56,67,0.1)', color: '#F43843' },
                tap: { scale: 0.9 },
              }}
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors"
            >
              <X size={15} />
            </motion.button>
          </div>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto" style={{ background: `${color}0F`, border: `1px solid ${color}1A` }}>
            <AlertTriangle size={24} style={{ color }} />
          </div>
          <h2 className="mt-4 text-base font-extrabold tracking-tight" style={{ color: '#1A1A1E' }}>{title}</h2>
        </div>

        <div className="px-7 py-6">
          <p className="text-sm font-medium leading-relaxed text-center" style={{ color: 'rgba(0,0,0,0.55)' }}>{description}</p>
          <div className="flex flex-col gap-2.5 mt-7">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onClose} className="w-full py-3 rounded-xl text-xs font-bold text-white cursor-pointer" style={{ background: BLUE_GRAD, boxShadow: '0 8px 20px rgba(18,112,183,0.3)' }}>
              Seguir aquí
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onConfirm} className="w-full py-3 rounded-xl text-xs font-bold text-white cursor-pointer" style={{ background: `linear-gradient(135deg, ${color}, ${color}E6)`, boxShadow: `0 8px 20px ${color}3D` }}>
              {confirmLabel}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ── Página ─────────────────────────────────────────────────────────── */

type ModalState =
  | { kind: 'carreras'; mode: 'add' | 'edit'; institution: string; level: string; editIndex: number | null }
  | { kind: ConfigKey; mode: 'add' | 'edit'; editIndex: number | null }

type ConfirmState =
  | { kind: 'delete'; institution: string; level: string; index: number; name: string }
  | { kind: 'inactivate'; institution: string; level: string; name: string; count: number }
  | { kind: 'activate'; institution: string; level: string; name: string }
  | { kind: 'deleteFlat'; key: ConfigKey; index: number; name: string }
  | { kind: 'inactivateFlat'; key: ConfigKey; name: string; count: number }
  | { kind: 'activateFlat'; key: ConfigKey; name: string }

export default function AdminConfig({ tab, onTabChange }: { tab: string; onTabChange: (t: string) => void }) {
  const [programs, setPrograms] = useState<Programs>(() => loadPrograms())
  const [areas, setAreas] = useState<string[]>(() => loadConfigItems('areas'))
  const [cargos, setCargos] = useState<string[]>(() => loadConfigItems('cargos'))
  const [inactive, setInactive] = useState<Record<string, string[]>>(() => loadInactiveCareers())
  const [inactiveFlat, setInactiveFlat] = useState<Record<ConfigKey, string[]>>(() => loadInactiveFlat())
  const [modal, setModal] = useState<ModalState | null>(null)
  const [confirm, setConfirm] = useState<ConfirmState | null>(null)

  const getFlatItems = (key: ConfigKey) => key === 'areas' ? areas : cargos
  const setFlatItems = (key: ConfigKey, list: string[]) => {
    if (key === 'areas') setAreas(list)
    else setCargos(list)
    saveConfigItems(key, list)
  }

  const handleSaveCareer = (name: string, inst: string, lvl: string) => {
    if (!modal || modal.kind !== 'carreras') return
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

  const handleSaveFlat = (names: string[]) => {
    if (!modal || modal.kind === 'carreras') return
    const current = getFlatItems(modal.kind)
    const next = modal.mode === 'edit' && modal.editIndex !== null
      ? current.map((item, i) => (i === modal.editIndex ? names[0] : item))
      : [...current, ...names]
    setFlatItems(modal.kind, next)
    setModal(null)
  }

  const handleDeleteFlat = (key: ConfigKey, index: number) => {
    setFlatItems(key, getFlatItems(key).filter((_, i) => i !== index))
  }

  const toggleInactiveFlat = (key: ConfigKey, name: string, shouldInactivate: boolean) => {
    const current = inactiveFlat[key] ?? []
    const nextMap: Record<ConfigKey, string[]> = {
      areas: key === 'areas' ? current : inactiveFlat.areas,
      cargos: key === 'cargos' ? current : inactiveFlat.cargos,
    }
    if (shouldInactivate) {
      nextMap[key] = current.includes(name) ? current : [...current, name]
    } else {
      nextMap[key] = current.filter(n => n !== name)
    }
    setInactiveFlat(nextMap)
    saveInactiveFlat(nextMap)
  }

  const confirmDelete = () => {
    if (!confirm || confirm.kind !== 'delete') return
    handleDeleteCareer(confirm.institution, confirm.level, confirm.index)
    setConfirm(null)
  }

  const confirmInactivate = () => {
    if (!confirm || confirm.kind !== 'inactivate') return
    toggleInactive(confirm.institution, confirm.level, confirm.name, true)
    setConfirm(null)
  }

  const confirmActivate = () => {
    if (!confirm || confirm.kind !== 'activate') return
    toggleInactive(confirm.institution, confirm.level, confirm.name, false)
    setConfirm(null)
  }

  const confirmDeleteFlat = () => {
    if (!confirm || confirm.kind !== 'deleteFlat') return
    handleDeleteFlat(confirm.key, confirm.index)
    setConfirm(null)
  }

  const confirmInactivateFlat = () => {
    if (!confirm || confirm.kind !== 'inactivateFlat') return
    toggleInactiveFlat(confirm.key, confirm.name, true)
    setConfirm(null)
  }

  const confirmActivateFlat = () => {
    if (!confirm || confirm.kind !== 'activateFlat') return
    toggleInactiveFlat(confirm.key, confirm.name, false)
    setConfirm(null)
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

  const areasConfig = APARTADOS.find(a => a.key === 'areas')!
  const cargosConfig = APARTADOS.find(a => a.key === 'cargos')!

  return (
    <div className="p-8 pt-12 space-y-6 max-w-[1440px] mx-auto relative">
      {tab === 'carreras' && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: [0.16, 1, 0.3, 1] }}>
          <CareerList
            programs={programs}
            inactive={inactive}
            onOpenAdd={(institution, level) => setModal({ kind: 'carreras', mode: 'add', institution, level, editIndex: null })}
            onOpenEdit={(institution, level, index) => setModal({ kind: 'carreras', mode: 'edit', institution, level, editIndex: index })}
            onRequestDelete={(institution, level, index, name) => setConfirm({ kind: 'delete', institution, level, index, name })}
            onRequestInactivate={(institution, level, name, count) => setConfirm({ kind: 'inactivate', institution, level, name, count })}
            onRequestActivate={(institution, level, name) => setConfirm({ kind: 'activate', institution, level, name })}
          />
        </motion.div>
      )}

      {tab === 'areas' && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: [0.16, 1, 0.3, 1] }}>
          <FlatList
            apartado={areasConfig}
            items={areas}
            inactive={inactiveFlat.areas}
            onOpenAdd={() => setModal({ kind: 'areas', mode: 'add', editIndex: null })}
            onOpenEdit={index => setModal({ kind: 'areas', mode: 'edit', editIndex: index })}
            onRequestDelete={(index, name) => setConfirm({ kind: 'deleteFlat', key: 'areas', index, name })}
            onRequestInactivate={(name, count) => setConfirm({ kind: 'inactivateFlat', key: 'areas', name, count })}
            onRequestActivate={name => setConfirm({ kind: 'activateFlat', key: 'areas', name })}
          />
        </motion.div>
      )}

      {tab === 'cargos' && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: [0.16, 1, 0.3, 1] }}>
          <FlatList
            apartado={cargosConfig}
            items={cargos}
            inactive={inactiveFlat.cargos}
            onOpenAdd={() => setModal({ kind: 'cargos', mode: 'add', editIndex: null })}
            onOpenEdit={index => setModal({ kind: 'cargos', mode: 'edit', editIndex: index })}
            onRequestDelete={(index, name) => setConfirm({ kind: 'deleteFlat', key: 'cargos', index, name })}
            onRequestInactivate={(name, count) => setConfirm({ kind: 'inactivateFlat', key: 'cargos', name, count })}
            onRequestActivate={name => setConfirm({ kind: 'activateFlat', key: 'cargos', name })}
          />
        </motion.div>
      )}

      {tab === 'documentos' && <DocsGrid />}

      {modal && modal.kind === 'carreras' && (
        <CareerModal
          mode={modal.mode}
          initialName={modal.mode === 'edit' && modal.editIndex !== null ? programs[modal.institution]?.[modal.level]?.[modal.editIndex] ?? '' : ''}
          institution={modal.institution}
          level={modal.level}
          editIndex={modal.editIndex}
          programs={programs}
          onSave={handleSaveCareer}
          onClose={() => setModal(null)}
        />
      )}

      {modal && modal.kind !== 'carreras' && (
        <ItemsModal
          apartado={APARTADOS.find(a => a.key === modal.kind)!}
          mode={modal.mode}
          editIndex={modal.editIndex}
          existing={getFlatItems(modal.kind)}
          onSave={handleSaveFlat}
          onClose={() => setModal(null)}
        />
      )}

      {confirm && confirm.kind === 'delete' && (
        <ConfirmModal
          title="¿Eliminar carrera?"
          description={`La carrera "${confirm.name}" no tiene estudiantes registrados y se eliminará de forma permanente. Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar"
          color="#F43843"
          onConfirm={confirmDelete}
          onClose={() => setConfirm(null)}
        />
      )}

      {confirm && confirm.kind === 'inactivate' && (
        <ConfirmModal
          title="¿Inactivar carrera?"
          description={`La carrera "${confirm.name}" tiene ${confirm.count} estudiantes registrados y no se puede eliminar. Al inactivarla dejará de estar disponible para nuevos registros.`}
          confirmLabel="Inactivar"
          color="#F5A623"
          onConfirm={confirmInactivate}
          onClose={() => setConfirm(null)}
        />
      )}

      {confirm && confirm.kind === 'activate' && (
        <ConfirmModal
          title="¿Reactivar carrera?"
          description={`La carrera "${confirm.name}" volverá a estar activa y disponible para nuevos registros.`}
          confirmLabel="Reactivar"
          color="#30D158"
          onConfirm={confirmActivate}
          onClose={() => setConfirm(null)}
        />
      )}

      {confirm && confirm.kind === 'deleteFlat' && (
        <ConfirmModal
          title={`¿Eliminar ${APARTADOS.find(a => a.key === confirm.key)!.singular}?`}
          description={`El ${APARTADOS.find(a => a.key === confirm.key)!.singular} "${confirm.name}" no tiene usuarios registrados y se eliminará de forma permanente. Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar"
          color="#F43843"
          onConfirm={confirmDeleteFlat}
          onClose={() => setConfirm(null)}
        />
      )}

      {confirm && confirm.kind === 'inactivateFlat' && (
        <ConfirmModal
          title={`¿Inactivar ${APARTADOS.find(a => a.key === confirm.key)!.singular}?`}
          description={`El ${APARTADOS.find(a => a.key === confirm.key)!.singular} "${confirm.name}" tiene ${confirm.count} usuarios registrados y no se puede eliminar. Al inactivarlo dejará de estar disponible para nuevos registros.`}
          confirmLabel="Inactivar"
          color="#F5A623"
          onConfirm={confirmInactivateFlat}
          onClose={() => setConfirm(null)}
        />
      )}

      {confirm && confirm.kind === 'activateFlat' && (
        <ConfirmModal
          title={`¿Reactivar ${APARTADOS.find(a => a.key === confirm.key)!.singular}?`}
          description={`El ${APARTADOS.find(a => a.key === confirm.key)!.singular} "${confirm.name}" volverá a estar activo y disponible para nuevos registros.`}
          confirmLabel="Reactivar"
          color="#30D158"
          onConfirm={confirmActivateFlat}
          onClose={() => setConfirm(null)}
        />
      )}
    </div>
  )
}
