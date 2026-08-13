import { useMemo } from 'react'
import { motion } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, totalPages, onPage }: { page: number; totalPages: number; onPage: (p: number) => void }) {
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
