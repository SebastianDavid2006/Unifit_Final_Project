import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import CareerFilter from './components/CareerFilter'
import OverviewSection from './sections/OverviewSection'
import CareersSection from './sections/CareersSection'
import StudentsSection from './sections/StudentsSection'
import {
  filterOptions, mapCarrera, type CareerRow, type FilterCategory,
} from './data'
import { useDashboardStats } from '@/features/shared/dashboard/useDashboardStats'
import { isValidDate } from '@/lib/dateUtils'

function toDate(value: string): Date | undefined {
  if (!isValidDate(value)) return undefined
  return new Date(value!)
}

export default function AdminStats({ tab, showCareerFilter, statsRange }: {
  tab: string
  showCareerFilter: boolean
  statsRange: { start: string; end: string }
}) {
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('institucion')
  const [filterSelections, setFilterSelections] = useState<Record<string, Set<string>>>({})

  const { stats, loading } = useDashboardStats(toDate(statsRange.start), toDate(statsRange.end))

  const carreras = useMemo<CareerRow[]>(() => (stats?.carreras ?? []).map(mapCarrera), [stats])
  const filterOpts = useMemo(() => filterOptions(carreras), [carreras])

  const filteredCarreras = useMemo(() => carreras.filter(c => {
    const entries = Object.entries(filterSelections).filter(([, v]) => v.size > 0)
    if (entries.length === 0) return true
    return entries.every(([category, vals]) => {
      if (category === 'nivel') return vals.has(c.cat)
      if (category === 'programa') return vals.has(c.programa)
      if (category === 'institucion') return vals.has(c.universidadLabel)
      return true
    })
  }), [carreras, filterSelections])

  const handleToggle = (category: FilterCategory, option: string) => {
    setFilterSelections(prev => {
      const catSet = new Set(prev[category] ?? [])
      if (catSet.has(option)) catSet.delete(option)
      else catSet.add(option)
      if (catSet.size === 0) {
        const next = { ...prev }
        delete next[category]
        return next
      }
      return { ...prev, [category]: catSet }
    })
  }

  const handleSelectAll = (category: FilterCategory) => {
    setFilterSelections(prev => {
      const next = { ...prev }
      delete next[category]
      return next
    })
  }

  const handleClearAll = () => setFilterSelections({})

  return (
    <div className="p-8 space-y-6 w-full relative">
      {showCareerFilter && (
        <CareerFilter
          category={filterCategory}
          selections={filterSelections}
          options={filterOpts}
          onCategory={setFilterCategory}
          onToggle={handleToggle}
          onSelectAll={handleSelectAll}
          onClearAll={handleClearAll}
        />
      )}
      <div style={{ filter: showCareerFilter ? 'blur(4px)' : 'none', opacity: showCareerFilter ? 0.5 : 1, pointerEvents: showCareerFilter ? 'none' : 'auto', transition: 'filter 0.3s ease, opacity 0.3s ease' }}>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {tab === 'overview' && <OverviewSection stats={stats} loading={loading} />}
            {tab === 'careers' && <CareersSection carreras={filteredCarreras} loading={loading} />}
            {tab === 'students' && <StudentsSection stats={stats} loading={loading} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}