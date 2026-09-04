import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { CAREER_STATS } from '@/data/stats/careerStats'
import CareerFilter from './components/CareerFilter'
import OverviewSection from './sections/OverviewSection'
import CareersSection from './sections/CareersSection'
import StudentsSection from './sections/StudentsSection'
import { evolutionData, institutionOf, normalizeNivel, type FilterCategory, type EvolutionPoint } from './data'
import { useAsistenciaEvolucion } from '@/hooks/useAsistencia'

const MESES_CORTOS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

function toDate(value: string): Date | null {
  if (!value) return null
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

export default function AdminStats({ tab, showCareerFilter, statsRange }: {
  tab: string
  showCareerFilter: boolean
  statsRange: { start: string; end: string }
}) {
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('institucion')
  const [filterSelections, setFilterSelections] = useState<Record<string, Set<string>>>({})

  const startDate = toDate(statsRange.start)
  const endDate = toDate(statsRange.end)
  const { data: evolucionReal } = useAsistenciaEvolucion(startDate, endDate, 'mes')

  const filteredEvolution = useMemo<EvolutionPoint[]>(() => {
    const base = (statsRange.start && statsRange.end)
      ? evolutionData.filter(m => m.date >= statsRange.start && m.date <= statsRange.end)
      : evolutionData

    if (!evolucionReal || evolucionReal.length === 0) return base

    let acumulado = 0
    return evolucionReal.map(p => {
      const mes = Number(p.fecha.split('-')[1]) - 1
      acumulado += p.usuarios
      return {
        mes: MESES_CORTOS[mes] ?? p.fecha,
        date: p.fecha,
        usuarios: acumulado,
        asistencia: p.usuarios,
      }
    })
  }, [evolucionReal, statsRange.start, statsRange.end])

  const careerData = useMemo(() => CAREER_STATS.filter(c => {
    const entries = Object.entries(filterSelections).filter(([, v]) => v.size > 0)
    if (entries.length === 0) return true
    return entries.every(([cat, vals]) => {
      if (cat === 'nivel') return vals.has(normalizeNivel(c.cat))
      if (cat === 'programa') return vals.has(c.faculty)
      if (cat === 'institucion') return vals.has(institutionOf(c.faculty))
      return true
    })
  }), [filterSelections])

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
          onCategory={setFilterCategory}
          onToggle={handleToggle}
          onSelectAll={handleSelectAll}
          onClearAll={handleClearAll}
        />
      )}
      <div style={{ filter: showCareerFilter ? 'blur(4px)' : 'none', opacity: showCareerFilter ? 0.5 : 1, pointerEvents: showCareerFilter ? 'none' : 'auto', transition: 'filter 0.3s ease, opacity 0.3s ease' }}>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {tab === 'overview' && <OverviewSection careerData={careerData} filteredEvolution={filteredEvolution} />}
            {tab === 'careers' && <CareersSection careerData={careerData} />}
            {tab === 'students' && <StudentsSection />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
