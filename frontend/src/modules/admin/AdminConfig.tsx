import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { Settings, GraduationCap, Building2, Briefcase, Plus, Trash2, Pencil, X, Search, Inbox, Sparkles, ChevronDown } from 'lucide-react'
import { loadConfigItems, saveConfigItems, type ConfigKey } from '../../data/systemConfig'
import { INSTITUCIONES, getNiveles, loadPrograms, savePrograms } from '../../data/academicPrograms'
import { DocsGrid } from './AdminDocs'

const YELLOW = '#F5A623'
const BLUE = '#1270B7'

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

function countPrograms(programs: Programs): number {
  return INSTITUCIONES.reduce(
    (acc, inst) => acc + getNiveles(inst).reduce((a, level) => a + (programs[inst]?.[level]?.length ?? 0), 0),
    0,
  )
}

/* ── Carreras (por institución y nivel) ─────────────────────────────── */

function CareerCard({ programs, onOpenAdd, onOpenEdit, onDelete }: {
  programs: Programs
  onOpenAdd: (institution: string, level: string) => void
  onOpenEdit: (institution: string, level: string, index: number) => void
  onDelete: (institution: string, level: string, index: number) => void
}) {
  const [institution, setInstitution] = useState(INSTITUCIONES[0])
  const [query, setQuery] = useState('')
  const levels = getNiveles(institution)
  const q = query.trim().toLowerCase()
  const total = countPrograms(programs)

  const anyVisible = levels.some(level =>
    (programs[institution]?.[level] ?? []).filter(i => !q || i.toLowerCase().includes(q)).length > 0,
  )

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="premium-card rounded-2xl overflow-hidden">
      <div className="relative px-6 pt-5 pb-4 flex items-center gap-4" style={{ background: 'linear-gradient(135deg, rgba(18,112,183,0.14) 0%, rgba(18,112,183,0.02) 55%, transparent 100%)' }}>
        <div className="absolute -right-8 -top-10 w-40 h-40 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${BLUE}1F, transparent 65%)` }} />
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.04)', boxShadow: `0 8px 20px ${BLUE}2E` }}>
          <GraduationCap size={22} style={{ color: BLUE }} />
        </div>
        <div className="min-w-0 flex-1 relative">
          <div className="flex items-center gap-2">
            <h3 className="text-[15px] font-extrabold tracking-tight" style={{ color: '#1A1A1E' }}>Carreras</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${BLUE}14`, color: BLUE }}>{total}</span>
          </div>
          <p className="text-[11px] mt-0.5 truncate" style={{ color: 'rgba(0,0,0,0.4)' }}>Programas académicos organizados por institución y nivel</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onOpenAdd(institution, levels[0])}
          className="relative flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${BLUE}, ${BLUE}E6)`, color: '#fff', boxShadow: `0 8px 20px ${BLUE}42` }}
        >
          <Plus size={15} strokeWidth={2.6} />
          Agregar
        </motion.button>
      </div>

      <div className="px-6 py-4">
        <div className="flex items-center gap-3 flex-wrap mb-5">
          <div className="flex items-center gap-1 rounded-xl p-1" style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.05)' }}>
            {INSTITUCIONES.map(inst => {
              const active = institution === inst
              return (
                <button
                  key={inst}
                  onClick={() => setInstitution(inst)}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all"
                  style={{
                    background: active ? '#FFFFFF' : 'transparent',
                    color: active ? BLUE : 'rgba(0,0,0,0.4)',
                    boxShadow: active ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                  }}
                >
                  {inst.replace('Universitaria de ', '')}
                </button>
              )
            })}
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)' }}>
            <Search size={14} style={{ color: 'rgba(0,0,0,0.3)' }} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar carrera..."
              className="flex-1 bg-transparent text-[11px] font-semibold outline-none"
              style={{ color: '#1A1A1E' }}
            />
            {query && (
              <button onClick={() => setQuery('')} className="flex-shrink-0" style={{ color: 'rgba(0,0,0,0.4)' }}>
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {!anyVisible ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl py-10" style={{ background: 'rgba(0,0,0,0.02)', border: '1px dashed rgba(0,0,0,0.08)' }}>
            <Inbox size={22} style={{ color: 'rgba(0,0,0,0.2)' }} />
            <p className="text-xs font-semibold" style={{ color: 'rgba(0,0,0,0.35)' }}>
              {q ? 'Sin resultados para la búsqueda.' : 'Aún no hay carreras en esta institución.'}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {levels.map(level => {
              const list = programs[institution]?.[level] ?? []
              const filtered = q ? list.filter(i => i.toLowerCase().includes(q)) : list
              if (q && filtered.length === 0) return null
              return (
                <div key={level}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'rgba(0,0,0,0.45)' }}>{level}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: `${BLUE}0F`, color: BLUE }}>{filtered.length}</span>
                    <div className="flex-1 h-px" style={{ background: 'rgba(0,0,0,0.06)' }} />
                    <button
                      onClick={() => onOpenAdd(institution, level)}
                      title={`Agregar carrera a ${level}`}
                      className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors hover:bg-white"
                      style={{ color: BLUE }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {filtered.map((item, i) => {
                      const originalIndex = list.indexOf(item)
                      return (
                        <div key={`${item}-${i}`} className="group flex items-center gap-1.5 rounded-xl pl-3 pr-1.5 py-1.5 transition-all hover:shadow-sm" style={{ background: `${BLUE}08`, border: `1px solid ${BLUE}16` }}>
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: BLUE }} />
                          <span className="text-xs font-semibold" style={{ color: '#1D1D1F' }}>{item}</span>
                          <button onClick={() => onOpenEdit(institution, level, originalIndex)} title="Editar" className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors" style={{ color: 'rgba(0,0,0,0.25)' }}>
                            <Pencil size={12} />
                          </button>
                          <button onClick={() => onDelete(institution, level, originalIndex)} title="Eliminar" className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors hover:bg-[#F43843]/10" style={{ color: 'rgba(0,0,0,0.25)' }}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
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

  const selectStyle = {
    background: 'rgba(0,0,0,0.03)',
    color: '#1A1A1E',
    border: '1px solid rgba(0,0,0,0.07)',
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="relative w-full max-w-lg rounded-3xl overflow-hidden"
        style={{ background: '#FFFFFF', boxShadow: '0 24px 80px rgba(0,0,0,0.18)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="relative px-7 pt-6 pb-5 flex items-center gap-4" style={{ background: 'linear-gradient(135deg, rgba(18,112,183,0.14) 0%, rgba(18,112,183,0.02) 55%, transparent 100%)' }}>
          <div className="absolute -right-8 -top-10 w-36 h-36 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${BLUE}1F, transparent 65%)` }} />
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.04)', boxShadow: `0 8px 20px ${BLUE}2E` }}>
            <GraduationCap size={22} style={{ color: BLUE }} />
          </div>
          <div className="min-w-0 flex-1 relative">
            <h2 className="text-base font-extrabold tracking-tight" style={{ color: '#1A1A1E' }}>
              {mode === 'edit' ? 'Editar carrera' : 'Nueva carrera'}
            </h2>
            <p className="text-[11px] mt-0.5 truncate" style={{ color: 'rgba(0,0,0,0.4)' }}>Asigna la institución y el nivel académico</p>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 relative" style={{ background: 'rgba(0,0,0,0.05)' }}>
            <X size={14} style={{ color: 'rgba(0,0,0,0.4)' }} />
          </motion.button>
        </div>

        <div className="px-7 py-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-widest" style={{ color: 'rgba(0,0,0,0.4)' }}>NOMBRE</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submit()}
                autoFocus
                placeholder="Nombre de la carrera..."
                className="w-full rounded-2xl px-4 py-3 text-sm font-semibold outline-none transition-all"
                style={{ ...selectStyle, border: nameNorm && isDuplicate ? '1px solid #F43843' : '1px solid rgba(0,0,0,0.07)' }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-widest" style={{ color: 'rgba(0,0,0,0.4)' }}>INSTITUCIÓN</label>
              <div className="relative">
                <select
                  value={inst}
                  onChange={e => setInst(e.target.value)}
                  className="w-full rounded-2xl px-4 py-3 text-sm font-semibold outline-none appearance-none cursor-pointer pr-10"
                  style={selectStyle}
                >
                  {INSTITUCIONES.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(0,0,0,0.3)' }}>
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-widest" style={{ color: 'rgba(0,0,0,0.4)' }}>NIVEL ACADÉMICO</label>
              <div className="relative">
                <select
                  value={lvl}
                  onChange={e => setLvl(e.target.value)}
                  className="w-full rounded-2xl px-4 py-3 text-sm font-semibold outline-none appearance-none cursor-pointer pr-10"
                  style={selectStyle}
                >
                  {levels.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(0,0,0,0.3)' }}>
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>
          </div>

          {isDuplicate && nameNorm && (
            <p className="mt-3 text-[10px] font-semibold" style={{ color: '#F43843' }}>
              Esta carrera ya existe en {inst} · {lvl}.
            </p>
          )}

          <div className="flex gap-3 mt-6">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onClose} className="flex-1 py-3 rounded-xl text-xs font-bold" style={{ background: 'rgba(0,0,0,0.05)', color: 'rgba(0,0,0,0.45)' }}>
              Cancelar
            </motion.button>
            <motion.button
              whileHover={{ scale: valid ? 1.02 : 1 }}
              whileTap={{ scale: valid ? 0.98 : 1 }}
              onClick={submit}
              className="flex flex-1 items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-bold"
              style={{
                background: `linear-gradient(135deg, ${BLUE}, ${BLUE}E6)`,
                color: '#fff',
                boxShadow: `0 8px 20px ${BLUE}3D`,
                opacity: valid ? 1 : 0.45,
                cursor: valid ? 'pointer' : 'not-allowed',
              }}
            >
              <Sparkles size={14} />
              {mode === 'edit' ? 'Guardar cambios' : 'Guardar carrera'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ── Áreas y Cargos (listas planas) ─────────────────────────────────── */

type ApartadoConfig = {
  key: ConfigKey
  icon: typeof GraduationCap
  title: string
  singular: string
  subtitle: string
  color: string
  grad: string
}

const APARTADOS: ApartadoConfig[] = [
  {
    key: 'areas',
    icon: Building2,
    title: 'Áreas',
    singular: 'área',
    subtitle: 'Áreas de conocimiento o facultades',
    color: '#BF5AF2',
    grad: 'linear-gradient(135deg, rgba(191,90,242,0.13) 0%, rgba(191,90,242,0.02) 55%, transparent 100%)',
  },
  {
    key: 'cargos',
    icon: Briefcase,
    title: 'Cargos',
    singular: 'cargo',
    subtitle: 'Roles laborales dentro de la institución',
    color: '#30D158',
    grad: 'linear-gradient(135deg, rgba(48,209,88,0.13) 0%, rgba(48,209,88,0.02) 55%, transparent 100%)',
  },
]

type ApartadoCardProps = {
  apartado: ApartadoConfig
  items: string[]
  onOpenAdd: () => void
  onOpenEdit: (index: number) => void
  onDelete: (index: number) => void
}

function ApartadoCard({ apartado, items, onOpenAdd, onOpenEdit, onDelete }: ApartadoCardProps) {
  const [query, setQuery] = useState('')
  const { icon: Icon, title, subtitle, color } = apartado

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? items.filter(i => i.toLowerCase().includes(q)) : items
  }, [query, items])

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="premium-card rounded-2xl overflow-hidden">
      <div className="relative px-6 pt-5 pb-4 flex items-center gap-4" style={{ background: apartado.grad }}>
        <div className="absolute -right-8 -top-10 w-40 h-40 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${color}1F, transparent 65%)` }} />
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.04)', boxShadow: `0 8px 20px ${color}2E` }}>
          <Icon size={22} style={{ color }} />
        </div>
        <div className="min-w-0 flex-1 relative">
          <div className="flex items-center gap-2">
            <h3 className="text-[15px] font-extrabold tracking-tight" style={{ color: '#1A1A1E' }}>{title}</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${color}14`, color }}>{items.length}</span>
          </div>
          <p className="text-[11px] mt-0.5 truncate" style={{ color: 'rgba(0,0,0,0.4)' }}>{subtitle}</p>
        </div>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={onOpenAdd} className="relative flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold flex-shrink-0" style={{ background: `linear-gradient(135deg, ${color}, ${color}E6)`, color: '#fff', boxShadow: `0 8px 20px ${color}42` }}>
          <Plus size={15} strokeWidth={2.6} />
          Agregar
        </motion.button>
      </div>

      <div className="px-6 py-4">
        <div className="flex items-center gap-2 rounded-xl px-3 py-2 mb-4 max-w-xs" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)' }}>
          <Search size={14} style={{ color: 'rgba(0,0,0,0.3)' }} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar..." className="flex-1 bg-transparent text-[11px] font-semibold outline-none" style={{ color: '#1A1A1E' }} />
          {query && (
            <button onClick={() => setQuery('')} className="flex-shrink-0" style={{ color: 'rgba(0,0,0,0.4)' }}>
              <X size={12} />
            </button>
          )}
        </div>

        {visible.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl py-10" style={{ background: 'rgba(0,0,0,0.02)', border: '1px dashed rgba(0,0,0,0.08)' }}>
            <Inbox size={22} style={{ color: 'rgba(0,0,0,0.2)' }} />
            <p className="text-xs font-semibold" style={{ color: 'rgba(0,0,0,0.35)' }}>
              {query ? 'Sin resultados para la búsqueda.' : 'Aún no hay elementos. Agrega el primero.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {visible.map((item, i) => {
              const originalIndex = items.indexOf(item)
              return (
                <div key={`${item}-${i}`} className="group flex items-center gap-1.5 rounded-xl pl-3 pr-1.5 py-1.5 transition-all hover:shadow-sm" style={{ background: `${color}08`, border: `1px solid ${color}16` }}>
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
                  <span className="text-xs font-semibold" style={{ color: '#1D1D1F' }}>{item}</span>
                  <button onClick={() => onOpenEdit(originalIndex)} title="Editar" className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors" style={{ color: 'rgba(0,0,0,0.25)' }}>
                    <Pencil size={12} />
                  </button>
                  <button onClick={() => onDelete(originalIndex)} title="Eliminar" className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors hover:bg-[#F43843]/10" style={{ color: 'rgba(0,0,0,0.25)' }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </motion.div>
  )
}

type ItemsModalProps = {
  apartado: ApartadoConfig
  mode: 'add' | 'edit'
  editIndex: number | null
  existing: string[]
  onSave: (names: string[]) => void
  onClose: () => void
}

function ItemsModal({ apartado, mode, editIndex, existing, onSave, onClose }: ItemsModalProps) {
  const [text, setText] = useState(mode === 'edit' && editIndex !== null ? existing[editIndex] : '')
  const { icon: Icon, title, singular, color } = apartado

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const parsed = useMemo(() => {
    const seen = new Set<string>()
    const result: string[] = []
    text.split('\n').forEach(line => {
      const v = line.trim()
      if (!v || seen.has(v.toLowerCase())) return
      seen.add(v.toLowerCase())
      result.push(v)
    })
    return result
  }, [text])

  const addable = useMemo(() => {
    if (mode === 'edit') {
      return parsed.filter(v => {
        const isSelf = editIndex !== null && existing[editIndex]?.toLowerCase() === v.toLowerCase()
        return isSelf || !existing.some((e, idx) => idx !== editIndex && e.toLowerCase() === v.toLowerCase())
      })
    }
    return parsed.filter(v => !existing.some(e => e.toLowerCase() === v.toLowerCase()))
  }, [parsed, existing, mode, editIndex])

  const duplicatesSkipped = parsed.length - addable.length
  const valid = addable.length > 0

  const submit = () => {
    if (!valid) return
    onSave(mode === 'edit' ? addable.slice(0, 1) : addable)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="relative w-full max-w-lg rounded-3xl overflow-hidden"
        style={{ background: '#FFFFFF', boxShadow: '0 24px 80px rgba(0,0,0,0.18)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="relative px-7 pt-6 pb-5 flex items-center gap-4" style={{ background: apartado.grad }}>
          <div className="absolute -right-8 -top-10 w-36 h-36 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${color}1F, transparent 65%)` }} />
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.04)', boxShadow: `0 8px 20px ${color}2E` }}>
            <Icon size={22} style={{ color }} />
          </div>
          <div className="min-w-0 flex-1 relative">
            <h2 className="text-base font-extrabold tracking-tight" style={{ color: '#1A1A1E' }}>
              {mode === 'edit' ? `Editar ${singular}` : `Nueva ${singular}`}
            </h2>
            <p className="text-[11px] mt-0.5 truncate" style={{ color: 'rgba(0,0,0,0.4)' }}>{subtitle}</p>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 relative" style={{ background: 'rgba(0,0,0,0.05)' }}>
            <X size={14} style={{ color: 'rgba(0,0,0,0.4)' }} />
          </motion.button>
        </div>

        <div className="px-7 py-6">
          <label className="block text-[10px] font-bold tracking-widest mb-2" style={{ color: 'rgba(0,0,0,0.4)' }}>
            {mode === 'edit' ? 'NOMBRE' : `NOMBRE${mode === 'add' ? ' O LISTA' : ''}`}
          </label>
          {mode === 'edit' ? (
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              autoFocus
              placeholder={`Nombre de la ${singular}...`}
              className="w-full rounded-2xl px-4 py-3.5 text-sm font-semibold outline-none"
              style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.07)', color: '#1A1A1E' }}
            />
          ) : (
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              autoFocus
              rows={5}
              placeholder={`Escribe o pega una lista de ${title.toLowerCase()}. Una por línea.`}
              className="w-full rounded-2xl px-4 py-3.5 text-sm font-semibold outline-none resize-none"
              style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.07)', color: '#1A1A1E' }}
            />
          )}

          {mode === 'add' && addable.length > 0 && (
            <div className="mt-4">
              <p className="text-[10px] font-bold tracking-widest mb-2" style={{ color: 'rgba(0,0,0,0.4)' }}>
                SE AGREGARÁN {addable.length} {title.toUpperCase()}
              </p>
              <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto">
                {addable.map((item, i) => (
                  <span key={`${item}-${i}`} className="flex items-center gap-1.5 rounded-xl pl-2.5 pr-1.5 py-1 text-[11px] font-semibold" style={{ background: `${color}0D`, border: `1px solid ${color}1F`, color: '#1D1D1F' }}>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {duplicatesSkipped > 0 && (
            <p className="mt-3 text-[10px] font-semibold" style={{ color: '#F5A623' }}>
              {duplicatesSkipped} elemento{duplicatesSkipped === 1 ? '' : 's'} ya exist{duplicatesSkipped === 1 ? 'e' : 'en'} en la lista y se omitirá{duplicatesSkipped === 1 ? '' : 'n'}.
            </p>
          )}

          {mode === 'add' && addable.length === 0 && text.trim() && (
            <p className="mt-3 text-[10px] font-semibold" style={{ color: '#F43843' }}>
              Todo lo escrito ya existe en la lista.
            </p>
          )}

          <div className="flex gap-3 mt-6">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onClose} className="flex-1 py-3 rounded-xl text-xs font-bold" style={{ background: 'rgba(0,0,0,0.05)', color: 'rgba(0,0,0,0.45)' }}>
              Cancelar
            </motion.button>
            <motion.button
              whileHover={{ scale: valid ? 1.02 : 1 }}
              whileTap={{ scale: valid ? 0.98 : 1 }}
              onClick={submit}
              className="flex flex-1 items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-bold"
              style={{
                background: `linear-gradient(135deg, ${color}, ${color}E6)`,
                color: '#fff',
                boxShadow: `0 8px 20px ${color}3D`,
                opacity: valid ? 1 : 0.45,
                cursor: valid ? 'pointer' : 'not-allowed',
              }}
            >
              <Sparkles size={14} />
              {mode === 'edit' ? 'Guardar cambios' : `Guardar ${addable.length || ''}`.trim()}
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

export default function AdminConfig({ tab, onTabChange }: { tab: string; onTabChange: (t: string) => void }) {
  const [programs, setPrograms] = useState<Programs>(() => loadPrograms())
  const [areas, setAreas] = useState<string[]>(() => loadConfigItems('areas'))
  const [cargos, setCargos] = useState<string[]>(() => loadConfigItems('cargos'))
  const [modal, setModal] = useState<ModalState | null>(null)

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

  return (
    <div className="p-8 pt-12 space-y-6 max-w-[1440px] mx-auto relative">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${YELLOW}10`, border: `1px solid ${YELLOW}15` }}>
          <Settings size={22} style={{ color: YELLOW }} />
        </div>
        <div>
          <h1 style={{ color: '#1A1A1E', fontSize: '2rem', fontWeight: 800 }}>Configuración</h1>
          <p className="text-xs" style={{ color: 'rgba(0,0,0,0.35)' }}>{tab === 'config' ? 'Administra carreras, áreas y cargos del sistema' : 'Recursos y guías del sistema'}</p>
        </div>
      </div>

      {tab === 'config' && (
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: [0.16, 1, 0.3, 1] }}>
            <CareerCard
              programs={programs}
              onOpenAdd={(institution, level) => setModal({ kind: 'carreras', mode: 'add', institution, level, editIndex: null })}
              onOpenEdit={(institution, level, index) => setModal({ kind: 'carreras', mode: 'edit', institution, level, editIndex: index })}
              onDelete={handleDeleteCareer}
            />
          </motion.div>

          <div className="grid grid-cols-2 gap-6">
            {APARTADOS.map((apartado, i) => (
              <motion.div key={apartado.key} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}>
                <ApartadoCard
                  apartado={apartado}
                  items={getFlatItems(apartado.key)}
                  onOpenAdd={() => setModal({ kind: apartado.key, mode: 'add', editIndex: null })}
                  onOpenEdit={index => setModal({ kind: apartado.key, mode: 'edit', editIndex: index })}
                  onDelete={index => handleDeleteFlat(apartado.key, index)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {tab === 'docs' && <DocsGrid />}

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
    </div>
  )
}
