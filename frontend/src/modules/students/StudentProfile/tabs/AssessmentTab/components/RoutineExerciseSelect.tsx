import { useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Search, ChevronDown, Check, Dumbbell, Sparkles, Filter, X } from 'lucide-react'
import type { RoutineRow } from '@/modules/students/aiRoutineTypes'
import { muscleIcons } from '@/data/shared/constants'
import type { FrontendExercise } from '@/services/ejercicio.service'
import { RoutineCategoryPills } from './RoutineCategorySelect'

const ROUTINE_GRAD = 'linear-gradient(135deg, #1270B7, #7ec8e3)'
const meshInputBg = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)'
const meshInputHover = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(0,0,0,0.04)'
const MENU_HEIGHT = 280

interface RoutineExerciseSelectProps {
  row: RoutineRow
  routineViewMode: boolean
  open: boolean
  exerciseCatalog: FrontendExercise[]
  filterCats: string[]
  setFilterCats: (cats: string[]) => void
  search: string
  setSearch: (s: string) => void
  onToggle: () => void
  onSelect: (id: string, name: string, muscle: string, sets: string, reps: string) => void
  onClose: () => void
}

export function RoutineExerciseSelect({ row, routineViewMode, open, exerciseCatalog, filterCats, setFilterCats, search, setSearch, onToggle, onSelect, onClose }: RoutineExerciseSelectProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [filterOpen, setFilterOpen] = useState(false)

  const q = search.trim().toLowerCase()
  const catExercises = exerciseCatalog.filter(e => {
    const inCats = filterCats.length === 0 || e.muscleGroups.some(mg => filterCats.includes(mg))
    const inSearch = !q || e.name.toLowerCase().includes(q)
    return inCats && inSearch
  })
  const hasCustom = row.name && !catExercises.some(e => e.name === row.name)
  const showMenu = open && !routineViewMode

  useEffect(() => {
    if (!showMenu) return
    const onPointerDown = (e: MouseEvent) => {
      const t = e.target as Node
      if (wrapRef.current?.contains(t) || menuRef.current?.contains(t)) return
      onClose()
    }
    const onScroll = (e: Event) => {
      const t = e.target as Node | null
      if (t && (wrapRef.current?.contains(t) || menuRef.current?.contains(t))) return
      onClose()
    }
    const onResize = () => onClose()
    document.addEventListener('mousedown', onPointerDown)
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onResize)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onResize)
    }
  }, [showMenu, onClose])

  useEffect(() => {
    if (!open) setFilterOpen(false)
  }, [open])

  const rect = wrapRef.current?.getBoundingClientRect()
  const openUp = rect ? window.innerHeight - rect.bottom < MENU_HEIGHT : false
  const menuPos = rect
    ? {
        position: 'fixed' as const,
        zIndex: 9999,
        top: openUp ? undefined : rect.bottom + 4,
        bottom: openUp ? window.innerHeight - rect.top + 4 : undefined,
        left: Math.max(8, Math.min(rect.left, window.innerWidth - 210)),
        width: Math.min(rect.width, window.innerWidth - 16),
      }
    : { display: 'none' as const }

  return (
    <>
      <div className="relative" ref={wrapRef}>
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none flex-shrink-0" style={{ color: 'rgba(0,0,0,0.3)' }} />
          <input
            type="text"
            readOnly={routineViewMode}
            value={open ? search : (row.name || '')}
            placeholder={row.name ? '' : 'Buscar ejercicio…'}
            onChange={e => setSearch(e.target.value)}
            onFocus={e => {
              e.currentTarget.style.borderColor = '#1270B7'
              e.currentTarget.style.background = meshInputHover
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(18,112,183,0.08)'
              if (!routineViewMode && !open) onToggle()
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = 'transparent'
              e.currentTarget.style.boxShadow = 'none'
            }}
            onKeyDown={e => {
              if (e.key === 'Escape') onClose()
            }}
            onMouseEnter={e => { if (e.currentTarget !== document.activeElement) { e.currentTarget.style.background = meshInputHover; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)' } }}
            onMouseLeave={e => { if (e.currentTarget !== document.activeElement) { e.currentTarget.style.background = meshInputBg; e.currentTarget.style.borderColor = 'transparent' } }}
            className="w-full pl-7 pr-7 py-2 rounded-lg text-xs font-semibold outline-none transition-all duration-200"
            style={{
              background: row.name || open ? meshInputBg : 'rgba(0,0,0,0.03)',
              border: '1px solid transparent',
              color: row.name ? '#0D1B2A' : 'rgba(0,0,0,0.35)',
            }}
          />
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            style={{ color: 'rgba(0,0,0,0.25)' }}
            className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none flex-shrink-0"
          >
            <ChevronDown size={13} />
          </motion.div>
        </div>
      </div>
      {createPortal(
        <AnimatePresence initial={false}>
          {showMenu && rect && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: openUp ? 4 : -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: openUp ? 4 : -4 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              onWheel={e => e.stopPropagation()}
              className="rounded-xl overflow-y-auto"
              style={{
                ...menuPos,
                maxHeight: MENU_HEIGHT,
                overscrollBehavior: 'contain',
                background: '#FFFFFF',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)',
              }}
            >
              {filterOpen ? (
                <>
                  <div className="sticky top-0 flex items-center justify-between px-3 py-2" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(0,0,0,0.04)', zIndex: 10 }}>
                    <span className="flex items-center gap-1.5 text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.5)' }}>
                      <Filter size={12} /> Filtrar por categoría
                    </span>
                    <button
                      type="button"
                      onClick={() => setFilterOpen(false)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all hover:opacity-70 cursor-pointer"
                      style={{ background: 'rgba(18,112,183,0.08)', color: '#1270B7' }}
                    >
                      <Check size={11} strokeWidth={3} /> Aplicar
                    </button>
                  </div>
                  <div className="px-3 py-2.5">
                    <RoutineCategoryPills selected={filterCats} onChange={setFilterCats} />
                  </div>
                </>
              ) : (
                <>
                  <div className="sticky top-0 flex items-center justify-between gap-2 px-3 py-2" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(0,0,0,0.04)', zIndex: 10 }}>
                    <button
                      type="button"
                      onClick={() => setFilterOpen(true)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                      style={{
                        border: `1px ${filterCats.length ? 'solid' : 'dashed'} ${filterCats.length ? 'rgba(18,112,183,0.4)' : 'rgba(0,0,0,0.15)'}`,
                        color: filterCats.length ? '#1270B7' : 'rgba(0,0,0,0.5)',
                        background: filterCats.length ? 'rgba(18,112,183,0.1)' : 'rgba(0,0,0,0.06)',
                      }}
                    >
                      <Filter size={12} />
                      <span>Filtrar por categoría</span>
                      {filterCats.length > 0 && (
                        <span className="min-w-4 h-4 px-1 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ background: '#1270B7', color: '#FFFFFF' }}>
                          {filterCats.length}
                        </span>
                      )}
                      {filterCats.length > 0 && (
                        <span className="flex items-center">
                          {filterCats.map(cat => muscleIcons[cat] ? (
                            <img key={cat} src={muscleIcons[cat]} alt="" className="w-3.5 h-3.5 flex-shrink-0" />
                          ) : null)}
                        </span>
                      )}
                      {filterCats.length > 0 && (
                        <motion.span
                          whileTap={{ scale: 0.85 }}
                          className="flex items-center cursor-pointer rounded-full"
                          onClick={e => { e.stopPropagation(); setFilterCats([]) }}
                          style={{ background: 'rgba(255,255,255,0.6)' }}
                        >
                          <X size={10} strokeWidth={3} />
                        </motion.span>
                      )}
                    </button>
                  </div>
                  {catExercises.length === 0 && !hasCustom ? (
                    <p className="text-xs py-3 text-center" style={{ color: 'rgba(0,0,0,0.3)' }}>
                      Sin resultados para el filtro actual
                    </p>
                  ) : (
                    catExercises.map(ex => {
                      const activeItem = row.name === ex.name
                      return (
                        <button
                          key={ex.id}
                          type="button"
                          onClick={() => onSelect(ex.id, ex.name, ex.muscleGroups[0] ?? '', '', '')}
                          className="w-full flex flex-col gap-0.5 px-3 py-2.5 text-xs font-medium transition-colors relative"
                          style={{
                            color: activeItem ? '#FFFFFF' : 'rgba(0,0,0,0.6)',
                            background: activeItem ? ROUTINE_GRAD : 'transparent',
                            borderBottom: '1px solid rgba(0,0,0,0.03)',
                          }}
                          onMouseEnter={e => { if (!activeItem) { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = '#1270B7' } }}
                          onMouseLeave={e => { if (!activeItem) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(0,0,0,0.6)' } }}
                        >
                          <span className="flex items-center gap-1.5">
                            <Dumbbell size={13} style={{ color: activeItem ? '#fff' : 'rgba(0,0,0,0.4)' }} className="flex-shrink-0" />
                            <span className="truncate">{ex.name}</span>
                            {activeItem && <Check size={12} className="ml-auto text-white" />}
                          </span>
                          <span className="flex gap-1 pl-[20px]">
                            {ex.muscleGroups.map(mg => muscleIcons[mg] ? (
                              <img key={mg} src={muscleIcons[mg]} alt="" className="w-3.5 h-3.5 flex-shrink-0 opacity-80" style={{ filter: activeItem ? 'brightness(10)' : 'none' }} />
                            ) : null)}
                          </span>
                        </button>
                      )
                    })
                  )}
                  {hasCustom && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium transition-colors"
                      style={{ color: '#1270B7', background: 'rgba(18,112,183,0.06)', borderBottom: '1px solid rgba(0,0,0,0.03)' }}
                    >
                      <Sparkles size={13} className="flex-shrink-0" />
                      <span className="truncate">{row.name} (personalizado)</span>
                    </button>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}