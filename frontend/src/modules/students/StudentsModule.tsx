import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Search, Plus, ChevronRight, ChevronLeft } from 'lucide-react'
import studentsImg from '@/assets/illustrations/characters/students/students_group.webp'
import NewStudentModal from './NewStudentModal'
import RegistrationCompletionModal from './RegistrationCompletionModal'
import type { Student } from '@/data/students'
import { useIsMobile } from '@/shared/components/ui/use-mobile'

const RED = '#F43843'
const BLUE = '#1270B7'
const RED_GRAD = 'linear-gradient(135deg, #F43843, #FF6B8A, #CC0033)'
const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #7ec8e3)'

interface Props {
  students: Student[]
  search: string
  onSearchChange?: (v: string) => void
  riskFilter: 'all' | 'high' | 'medium' | 'low'
  onSelectStudent: (s: Student) => void
  showFilters: boolean
  onToggleFilters: () => void
}

export default function StudentsModule({ students, search, onSearchChange, riskFilter, onSelectStudent, showFilters, onToggleFilters }: Props) {
  const isMobile = useIsMobile()
  const [filterCategory, setFilterCategory] = useState<'status' | 'institution' | 'program' | 'gender' | 'modality' | 'jornada' | 'semester'>('institution')
  const [filterSelections, setFilterSelections] = useState<Record<string, Set<string>>>({})
  const [filterSearch, setFilterSearch] = useState('')
  const [showNewStudent, setShowNewStudent] = useState(false)
  const [showRegModal, setShowRegModal] = useState(false)
  const [selectedProcessStudent, setSelectedProcessStudent] = useState<Student | null>(null)
  const [page, setPage] = useState(1)
  const pageSize = 7

  const handleStudentClick = (s: Student) => {
    if (s.status === 'process') {
      setSelectedProcessStudent(s)
      setShowRegModal(true)
    } else {
      onSelectStudent(s)
    }
  }

  const filterLabels: Record<string, string> = {
    status: 'Estado', gender: 'Género', institution: 'Institución',
    program: 'Programa', modality: 'Modalidad', jornada: 'Jornada', semester: 'Semestre'
  }
  const filterOptions: Record<string, string[]> = useMemo(() => ({
    status: ['Activo', 'Inactivo', 'En proceso'],
    gender: [...new Set(students.map(s => s.gender))],
    institution: [...new Set(students.map(s => s.institution))],
    program: [...new Set(students.map(s => s.program))],
    modality: [...new Set(students.map(s => s.modality))],
    jornada: [...new Set(students.map(s => s.jornada))],
    semester: [...new Set(students.map(s => s.semester))],
  }), [students])

  const filtered = useMemo(() => {
    const filteredStudents = students.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.faculty.toLowerCase().includes(search.toLowerCase())
      const matchRisk = riskFilter === 'all' || s.risk === riskFilter
      const entries = Object.entries(filterSelections).filter(([, v]) => v.size > 0)
      const statusLabel: Record<string, string> = { active: 'Activo', inactive: 'Inactivo', process: 'En proceso' }
      const matchCategory = entries.length === 0 || entries.every(([cat, vals]) => vals.has(cat === 'status' ? statusLabel[s.status] : (s as any)[cat]))
      return matchSearch && matchRisk && matchCategory
    })

    // Sort: "process" status first, then by name
    return filteredStudents.sort((a, b) => {
      if (a.status === 'process' && b.status !== 'process') return -1
      if (a.status !== 'process' && b.status === 'process') return 1
      return a.name.localeCompare(b.name)
    })
  }, [students, search, riskFilter, filterSelections])

  const tableHeaders = ['Nombre', 'PROGRAMA / CARGO', 'PERFIL', 'Último Ingreso', 'Próxima Valoración', 'Valoraciones', 'Estado']

  const statusMap: Record<Student['status'], { label: string; color: string; bg: string }> = {
    active: { label: 'Activo', color: '#1E8E3E', bg: 'rgba(34,197,94,0.13)' },
    inactive: { label: 'Inactivo', color: '#E31B23', bg: 'rgba(244,67,54,0.12)' },
    process: { label: 'En proceso', color: '#0E6FBF', bg: 'rgba(18,112,183,0.12)' },
  }

  useEffect(() => { setPage(1) }, [search, riskFilter, filterSelections])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const pageNumbers: (number | '…')[] = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const set = new Set<number>([1, totalPages, currentPage - 1, currentPage, currentPage + 1])
    const sorted = [...set].filter(p => p >= 1 && p <= totalPages).sort((a, b) => a - b)
    const out: (number | '…')[] = []
    let prev = 0
    sorted.forEach(p => {
      if (p - prev > 1) out.push('…')
      out.push(p)
      prev = p
    })
    return out
  }, [totalPages, currentPage])

  return (
    <>
      <style>{`@keyframes shimmer { 0% { background-position: 200% center } 100% { background-position: -200% center } }`}</style>
      <div className="p-8 pt-12 space-y-6 max-w-[1440px] mx-auto relative">

      {/* Banner card - matches Admin Usuarios banner with image */}
      <motion.div className="relative rounded-3xl mb-8" style={{ background: 'linear-gradient(90deg, #FFFFFF 0%, #F8FBFF 40%, rgba(248,251,255,0) 100%)', boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{
          maskImage: 'linear-gradient(to right, black 60%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, black 60%, transparent 100%)'
        }}>
          <div className="absolute inset-0 opacity-30" style={{
            background: 'radial-gradient(ellipse at 80% 10%, rgba(0,122,255,0.03) 0%, transparent 40%), radial-gradient(ellipse at 10% 80%, rgba(245,166,35,0.02) 0%, transparent 40%), radial-gradient(ellipse at 50% 50%, rgba(230,57,70,0.02) 0%, transparent 50%)',
            backgroundSize: '200% 200%',
            animation: 'mesh-shift 15s ease-in-out infinite',
          }} />
        </div>

        <div className="relative z-10 p-5 pt-10 flex items-center justify-between rounded-3xl">
          <div className="flex items-center gap-6 ml-72">
            <div className="w-1 h-12 rounded-full" style={{ background: RED_GRAD }} />
            <div>
              <h1 style={{ color: '#1A1A1E', fontSize: '2rem', fontWeight: 800 }}>Usuarios</h1>
              <p className="text-xs text-black/40">Usuarios registrados en el sistema</p>
            </div>
          </div>

          <div className="flex items-center gap-3 pr-4">
            <motion.button
              initial="initial"
              whileHover="hover"
              whileTap={{ scale: 0.9, boxShadow: '0 0 40px rgba(244,56,67,0.6), 0 0 80px rgba(18,112,183,0.4), 0 0 120px rgba(241,200,39,0.2)', transition: { duration: 0.15 } }}
              onClick={() => setShowNewStudent(true)}
              className="flex items-center rounded-full overflow-hidden relative text-white"
              style={{ 
                height: 44, 
                padding: '0 12px',
                background: `
                  radial-gradient(at 20% 20%, #F43843 0%, transparent 50%),
                  radial-gradient(at 80% 15%, #1270B7 0%, transparent 50%),
                  radial-gradient(at 50% 80%, #F1C827 0%, transparent 60%),
                  radial-gradient(at 30% 60%, #F43843 0%, transparent 40%),
                  radial-gradient(at 70% 70%, #1270B7 0%, transparent 40%),
                  #F43843
                `,
                backgroundSize: '150% 150%',
                boxShadow: '0 10px 25px -5px rgba(230,57,70,0.3)',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 10px 30px -3px rgba(230,57,70,0.5), 0 0 20px rgba(230,57,70,0.2)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(230,57,70,0.3)' }}
            >
              <motion.div
                variants={{
                  hover: { maxWidth: 180, opacity: 1, marginRight: 10, transition: { delay: 0.12, duration: 0.4, ease: 'easeOut' } },
                  initial: { maxWidth: 0, opacity: 0, marginRight: 0, transition: { duration: 0.25 } }
                }}
                whileTap={{ opacity: 0.35, transition: { duration: 0.12 } }}
                className="overflow-hidden whitespace-nowrap"
              >
                <span className="text-xs font-bold">Nuevo Estudiante</span>
              </motion.div>
              <motion.div
                whileTap={{ scale: 0.85, opacity: 0.35, transition: { duration: 0.12 } }}
                className="flex items-center justify-center flex-shrink-0"
              >
                <Plus size={18} strokeWidth={3} />
              </motion.div>
            </motion.button>
          </div>
        </div>

        <div
          style={{ position: 'absolute', left: 10, bottom: 0, top: -70, width: 220, zIndex: 20, opacity: 0, animation: 'blur-fade 0.6s 0.3s ease forwards' }}
        >
          <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '85%', height: '50%', background: 'rgba(18,112,183,0.12)', filter: 'blur(25px)', borderRadius: '50%' }} />
          <img src={studentsImg} alt="Students" className="w-full h-full drop-shadow-xl relative" style={{ objectFit: 'contain', objectPosition: 'center bottom' }} />
        </div>
      </motion.div>

      {/* Mobile Search Bar */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mb-4 px-4"
        >
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(0,0,0,0.2)' }} />
            <input
              value={search}
              onChange={e => onSearchChange?.(e.target.value)}
              placeholder="Buscar por nombre o documento..."
              className="w-full pl-10 pr-3 py-3 rounded-xl text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: '#1A1A1E' }}
            />
          </div>
        </motion.div>
      )}

      {/* Filter category pills + Dropdown container */}
      <motion.div
        layout
        style={{ overflow: 'visible', position: 'relative' }}
        animate={{ opacity: showFilters ? 1 : 0, height: showFilters ? 'auto' : 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {showFilters && (
          <>
            <motion.div
              initial={{ y: -8 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="mb-4"
            >
              <div className={`flex items-center gap-1 p-1 rounded-2xl w-full ${isMobile ? 'overflow-x-auto pb-2' : 'flex items-center justify-between'}`} style={{
                background: 'rgba(255,255,255,0.35)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.5)',
              }}>
                {Object.entries(filterLabels).map(([key, label]) => {
                  const hasSelection = (filterSelections[key]?.size ?? 0) > 0
                  return (
                    <button key={key}
                      onClick={() => { setFilterCategory(key as any); setFilterSearch('') }}
                      className={`relative px-4 py-1.5 rounded-xl text-[11px] font-bold transition-colors ${isMobile ? 'whitespace-nowrap flex-shrink-0' : 'flex-1'} text-center hover:bg-white/40`}
                      style={{
                        color: filterCategory === key ? '#1A1A1E' : hasSelection ? '#1270B7' : 'rgba(0,0,0,0.35)',
                      }}
                    >
                    {filterCategory === key && (
                      <motion.div
                        layoutId="activeFilterBg"
                        className="absolute inset-0 rounded-xl"
                        style={{ background: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center justify-center gap-1.5">
                      {hasSelection && <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#1270B7' }} />}
                      {label}
                    </span>
                  </button>
                )
              })}
            </div>
          </motion.div>

          {/* Dropdown — overlays student list */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                key={filterCategory}
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.96 }}
                className="absolute left-4 right-4 top-[calc(100%+8px)] z-50 rounded-2xl p-3"
                style={{
                  background: 'rgba(255,255,255,0.92)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.6)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
                }}
              >
              <div className="relative mb-2">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(0,0,0,0.2)' }} />
                <input
                  value={filterSearch}
                  onChange={e => setFilterSearch(e.target.value)}
                  placeholder="Buscar..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl text-xs font-medium outline-none"
                  style={{ background: 'rgba(0,0,0,0.03)', color: '#1A1A1E' }}
                />
              </div>

              <div className="flex flex-col gap-0.5 max-h-48 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                {(() => {
                  const currentSelected = filterSelections[filterCategory] ?? new Set()
                  return (
                    <>
                      <motion.button layout
                        onClick={() => {
                          setFilterSelections(prev => {
                            const next = { ...prev }
                            delete next[filterCategory]
                            return next
                          })
                          setFilterSearch('')
                        }}
                        whileHover={{ background: 'rgba(18,112,183,0.06)' }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full text-left px-3 py-2 rounded-xl text-[11px] font-bold flex items-center gap-2 transition-colors duration-300"
                        style={{
                          background: currentSelected.size === 0 ? 'rgba(18,112,183,0.1)' : 'transparent',
                          color: currentSelected.size === 0 ? '#1270B7' : 'rgba(0,0,0,0.45)',
                        }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <motion.div className="w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0"
                          animate={{
                            borderColor: currentSelected.size === 0 ? '#1270B7' : 'rgba(0,0,0,0.15)',
                            background: currentSelected.size === 0 ? '#1270B7' : 'transparent',
                          }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <motion.span
                            animate={{
                              scale: currentSelected.size === 0 ? 1 : 0,
                              opacity: currentSelected.size === 0 ? 1 : 0,
                              filter: currentSelected.size === 0 ? 'blur(0px)' : 'blur(6px)',
                            }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="text-white text-[9px] font-bold"
                          >✓</motion.span>
                        </motion.div>
                        Todos
                      </motion.button>
                      {filterOptions[filterCategory]
                        ?.filter(opt => opt.toLowerCase().includes(filterSearch.toLowerCase()))
                        .map(opt => (
                          <motion.button key={opt} layout
                            onClick={() => {
                              setFilterSelections(prev => {
                                const catSet = new Set(prev[filterCategory] ?? [])
                                if (catSet.has(opt)) catSet.delete(opt)
                                else catSet.add(opt)
                                if (catSet.size === 0) {
                                  const next = { ...prev }
                                  delete next[filterCategory]
                                  return next
                                }
                                return { ...prev, [filterCategory]: catSet }
                              })
                              setFilterSearch('')
                            }}
                            whileHover={{ background: 'rgba(18,112,183,0.06)' }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full text-left px-3 py-2 rounded-xl text-[11px] font-bold flex items-center gap-2 transition-colors duration-300"
                            style={{
                              background: currentSelected.has(opt) ? 'rgba(18,112,183,0.1)' : 'transparent',
                              color: currentSelected.has(opt) ? '#1270B7' : 'rgba(0,0,0,0.45)',
                            }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          >
                            <motion.div className="w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0"
                              animate={{
                                borderColor: currentSelected.has(opt) ? '#1270B7' : 'rgba(0,0,0,0.15)',
                                background: currentSelected.has(opt) ? '#1270B7' : 'transparent',
                              }}
                              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            >
                              <motion.span
                                animate={{
                                  scale: currentSelected.has(opt) ? 1 : 0,
                                  opacity: currentSelected.has(opt) ? 1 : 0,
                                  filter: currentSelected.has(opt) ? 'blur(0px)' : 'blur(6px)',
                                }}
                                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                className="text-white text-[9px] font-bold"
                              >✓</motion.span>
                            </motion.div>
                            {opt}
                          </motion.button>
                        ))}
                    </>
                  )
                })()}
              </div>
              <AnimatePresence>
                {Object.values(filterSelections).some(s => s.size > 0) && (
                  <motion.button
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    onClick={() => setFilterSelections({})}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full mt-2 py-2 rounded-xl text-[11px] font-bold text-center"
                    style={{ background: 'rgba(244,56,67,0.08)', color: '#F43843' }}
                  >
                    Limpiar filtros
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
        </>
      )}

      </motion.div>

        {/* Student list — blurred when filters are open */}
        <motion.div layout transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} style={{ filter: showFilters ? 'blur(4px)' : 'none', opacity: showFilters ? 0.5 : 1, transition: 'filter 0.3s ease, opacity 0.3s ease', pointerEvents: showFilters ? 'none' : 'auto' }}>
          {!isMobile && (
            <div className="grid grid-cols-[1.5fr_1fr_0.7fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 mb-3">
              {tableHeaders.map((h, i) => (
                <p key={i} className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: 'rgba(0,0,0,0.25)' }}>{h}</p>
              ))}
              <div className="w-5" />
            </div>
          )}

          <div className="space-y-2">
            {paged.map((s, i) => {
              const isProcess = s.status === 'process'
              return (
                <motion.div key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} onClick={() => handleStudentClick(s)} whileHover={{ y: -3, scale: 1.002 }} className={`rounded-2xl premium-card cursor-pointer relative overflow-hidden ${isMobile ? 'p-4 text-center' : 'grid grid-cols-[1.5fr_1fr_0.7fr_1fr_1fr_1fr_1fr_auto] items-center gap-4 p-4'}`} style={{
                  background: isProcess ? BLUE_GRAD : undefined,
                  color: isProcess ? '#FFFFFF' : undefined,
                  border: 'none',
                  boxShadow: isProcess ? '0 4px 16px rgba(18,112,183,0.3), 0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.03)' : undefined,
                }}>
                  {isProcess && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.12) 37%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.12) 63%, transparent 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 3s ease-in-out infinite',
                      }}
                    />
                  )}
                  {isMobile ? (
                    <div className="relative z-10">
                      <p className="text-lg font-bold truncate" style={{ color: isProcess ? '#FFFFFF' : '#1A1A1E' }}>{s.name}</p>
                      <p className="text-xs font-mono font-medium mt-0.5 truncate" style={{ color: isProcess ? 'rgba(255,255,255,0.8)' : '#1A1A1E' }}>CC 1098{s.id}76{s.id}</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-4 min-w-0 relative z-10">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0" style={{ background: s.risk === 'high' ? 'linear-gradient(135deg, #FF3B30, #D32F2F)' : s.risk === 'medium' ? 'linear-gradient(135deg, #FF9500, #E68600)' : 'linear-gradient(135deg, #30D158, #20A040)', fontSize: 13 }}>{s.avatar}</div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold truncate" style={{ color: isProcess ? '#FFFFFF' : '#1A1A1E' }}>{s.name}</p>
                          <p className="text-[10px] font-mono font-medium mt-0.5 truncate" style={{ color: isProcess ? 'rgba(255,255,255,0.8)' : '#1A1A1E' }}>CC 1098{s.id}76{s.id}</p>
                        </div>
                      </div>
                      <p className="text-xs font-semibold truncate" style={{ color: isProcess ? 'rgba(255,255,255,0.9)' : '#1A1A1E' }}>{s.tipo_usuario === 'estudiante' ? s.program : `${s.cargo ?? '—'} — ${s.area ?? '—'}`}</p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold w-fit" style={{ background: isProcess ? 'rgba(255,255,255,0.2)' : 'rgba(18,112,183,0.1)', color: isProcess ? '#FFFFFF' : '#0E6FBF' }}>{s.tipo_usuario === 'estudiante' ? 'Estudiante' : s.tipo_usuario === 'profesor' ? 'Profesor' : 'Administrativo'}</span>
                      <p className="text-xs font-medium" style={{ color: isProcess ? 'rgba(255,255,255,0.6)' : '#1A1A1E' }}>{isProcess ? 'N/A' : s.lastVisit}</p>
                      <p className="text-xs font-bold" style={{ color: isProcess ? '#FFD6E0' : (s.nextAssessment === 'Por agendar' ? '#E8A00B' : '#0D1B2A') }}>{s.nextAssessment}</p>
                      <p className="text-xs font-bold" style={{ color: isProcess ? 'rgba(255,255,255,0.6)' : '#1A1A1E' }}>{isProcess ? 'N/A' : Math.floor(s.sessions / 3)} <span className="font-normal">registros</span></p>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold w-fit" style={{ background: isProcess ? 'rgba(255,255,255,0.2)' : statusMap[s.status].bg, color: isProcess ? '#FFFFFF' : statusMap[s.status].color }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: isProcess ? '#FFFFFF' : statusMap[s.status].color }} />
                        {statusMap[s.status].label}
                      </span>
                      <ChevronRight size={15} style={{ color: isProcess ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.12)' }} />
                    </>
                  )}
                </motion.div>
              )
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 pt-4">
              <motion.button
                whileHover={currentPage > 1 ? { scale: 1.1 } : {}}
                whileTap={currentPage > 1 ? { scale: 0.92 } : {}}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                style={{
                  background: currentPage === 1 ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.06)',
                  color: currentPage === 1 ? 'rgba(0,0,0,0.2)' : '#111111',
                  cursor: currentPage === 1 ? 'default' : 'pointer',
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
                    whileHover={p !== currentPage ? { scale: 1.1 } : {}}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setPage(p)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold transition-all"
                    style={{
                      background: p === currentPage ? '#111111' : 'rgba(0,0,0,0.05)',
                      color: p === currentPage ? '#FFFFFF' : '#111111',
                      boxShadow: p === currentPage ? '0 4px 12px rgba(0,0,0,0.25)' : 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {p}
                  </motion.button>
                )
              )}

              <motion.button
                whileHover={currentPage < totalPages ? { scale: 1.1 } : {}}
                whileTap={currentPage < totalPages ? { scale: 0.92 } : {}}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                style={{
                  background: currentPage === totalPages ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.06)',
                  color: currentPage === totalPages ? 'rgba(0,0,0,0.2)' : '#111111',
                  cursor: currentPage === totalPages ? 'default' : 'pointer',
                }}
              >
                <ChevronRight size={15} />
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
      <NewStudentModal open={showNewStudent} onClose={() => setShowNewStudent(false)} />
      <RegistrationCompletionModal
        open={showRegModal}
        onClose={() => { setShowRegModal(false); setSelectedProcessStudent(null) }}
        onComplete={() => { onSelectStudent(selectedProcessStudent!); }}
        studentName={selectedProcessStudent?.name || ''}
        userId={selectedProcessStudent?.id || ''}
      />
    </>
  )
}

