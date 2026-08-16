import { motion } from 'motion/react'
import type { Trainer } from '@/data/trainers'
import Pagination from '@/features/admin/components/Pagination'
import BannerCard from '../components/BannerCard'
import TrainerRow from '../components/TrainerRow'
import { tableHeaders } from '../data'

export default function TrainersList({ paged, totalPages, currentPage, showFilters, onPage, onSelectTrainer, onOpenNewUser }: {
  paged: Trainer[]
  totalPages: number
  currentPage: number
  showFilters?: boolean
  onPage: (p: number) => void
  onSelectTrainer: (t: Trainer) => void
  onOpenNewUser: () => void
}) {
  return (
    <div className="p-8 pt-12 space-y-6 max-w-[1440px] mx-auto relative">
      <BannerCard onOpenNewUser={onOpenNewUser} />

      <motion.div layout transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} style={{ filter: showFilters ? 'blur(4px)' : 'none', opacity: showFilters ? 0.5 : 1, transition: 'filter 0.3s ease, opacity 0.3s ease', pointerEvents: showFilters ? 'none' : 'auto' }}>
        <div className="grid grid-cols-[1.9fr_1.1fr_1.3fr_1.3fr_auto] gap-4 px-4 mb-3">
          {tableHeaders.map((h, i) => (
            <p key={i} className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: 'rgba(0,0,0,0.25)' }}>{h}</p>
          ))}
          <div className="w-[15px]" />
        </div>

        <div className="space-y-2">
          {paged.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-sm font-semibold" style={{ color: 'rgba(0,0,0,0.4)' }}>No se encontraron usuarios</p>
              <p className="text-xs mt-1" style={{ color: 'rgba(0,0,0,0.25)' }}>Prueba con otra búsqueda o filtro.</p>
            </div>
          ) : paged.map((t, i) => (
            <TrainerRow key={t.id} trainer={t} index={i} onClick={onSelectTrainer} />
          ))}
        </div>

        {totalPages > 1 && <Pagination page={currentPage} totalPages={totalPages} onPage={onPage} />}
      </motion.div>
    </div>
  )
}
