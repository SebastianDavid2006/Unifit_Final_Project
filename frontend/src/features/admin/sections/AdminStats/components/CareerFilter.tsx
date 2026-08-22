import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Search } from 'lucide-react'
import { FILTER_LABELS, FILTER_OPTIONS, type FilterCategory } from '../data'

export default function CareerFilter({ category, selections, onCategory, onToggle, onSelectAll, onClearAll }: {
  category: FilterCategory
  selections: Record<string, Set<string>>
  onCategory: (c: FilterCategory) => void
  onToggle: (category: FilterCategory, option: string) => void
  onSelectAll: (category: FilterCategory) => void
  onClearAll: () => void
}) {
  const [search, setSearch] = useState('')

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="relative z-40 mb-4"
    >
      <div className="flex items-center justify-between gap-1 p-1 rounded-2xl w-full" style={{
        background: 'rgba(255,255,255,0.35)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.5)',
      }}>
        {Object.entries(FILTER_LABELS).map(([key, label]) => {
          const hasSelection = (selections[key]?.size ?? 0) > 0
          return (
            <button key={key}
              onClick={() => { onCategory(key as FilterCategory); setSearch('') }}
              className="relative px-4 py-1.5 rounded-xl text-[11px] font-bold transition-colors flex-1 text-center hover:bg-white/40"
              style={{
                color: category === key ? '#1A1A1E' : hasSelection ? '#1270B7' : 'rgba(0,0,0,0.35)',
              }}
            >
              {category === key && (
                <motion.div
                  layoutId="statsFilterBg"
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

      <AnimatePresence>
        <motion.div
          key={category}
          initial={{ opacity: 0, y: -6, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.96 }}
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 rounded-2xl p-3"
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
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="w-full pl-8 pr-3 py-2 rounded-xl text-xs font-medium outline-none"
              style={{ background: 'rgba(0,0,0,0.03)', color: '#1A1A1E' }}
            />
          </div>

          <div className="flex flex-col gap-0.5 max-h-48 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
            {(() => {
              const currentSelected = selections[category] ?? new Set()
              return (
                <>
                  <motion.button layout
                    onClick={() => { onSelectAll(category); setSearch('') }}
                    whileHover={{ background: 'rgba(18,112,183,0.06)' }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full text-left px-3 py-2 rounded-xl text-[11px] font-bold flex items-center gap-2 transition-colors duration-300"
                    style={{
                      background: currentSelected.size === 0 ? 'rgba(18,112,183,0.1)' : 'transparent',
                      color: currentSelected.size === 0 ? '#1270B7' : 'rgba(0,0,0,0.45)',
                    }}
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
                        }}
                        className="text-white text-[9px] font-bold"
                      >✓</motion.span>
                    </motion.div>
                    Todos
                  </motion.button>
                  {FILTER_OPTIONS[category]
                    ?.filter(opt => opt.toLowerCase().includes(search.toLowerCase()))
                    .map(opt => (
                      <motion.button key={opt} layout
                        onClick={() => { onToggle(category, opt); setSearch('') }}
                        whileHover={{ background: 'rgba(18,112,183,0.06)' }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full text-left px-3 py-2 rounded-xl text-[11px] font-bold flex items-center gap-2 transition-colors duration-300"
                        style={{
                          background: currentSelected.has(opt) ? 'rgba(18,112,183,0.1)' : 'transparent',
                          color: currentSelected.has(opt) ? '#1270B7' : 'rgba(0,0,0,0.45)',
                        }}
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
                            }}
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
            {Object.values(selections).some(s => s.size > 0) && (
              <motion.button
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                onClick={onClearAll}
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
      </AnimatePresence>
    </motion.div>
  )
}
