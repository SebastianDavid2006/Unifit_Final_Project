import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { CalendarClock, Clock, LogIn, LogOut, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { getMiHistorial, type AsistenciaRecord } from '@/services/asistencia.service'
import { cardStyle, GREEN, FIRE, BLUE, AMBER } from '@/features/student/components/ui/fitness'
import { formatDateES, formatHoraES, formatDuracionMin } from '@/lib/dateUtils'

const PAGE_SIZE = 10

function Row({ a }: { a: AsistenciaRecord }) {
  const sinSalida = !a.hora_salida

  return (
    <div className="rounded-2xl p-4" style={cardStyle}>
      <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <CalendarClock size={15} style={{ color: BLUE }} />
          <p className="text-white font-bold" style={{ fontSize: 13 }}>{formatDateES(a.fecha, { day: 'numeric', month: 'long' })}</p>
        </div>
        {sinSalida ? (
          <span className="px-2.5 py-1 rounded-full font-bold" style={{ background: FIRE + '14', border: `1px solid ${FIRE}33`, color: FIRE, fontSize: 10 }}>
            Sin salida
          </span>
        ) : (
          <span className="px-2.5 py-1 rounded-full font-bold" style={{ background: GREEN + '14', border: `1px solid ${GREEN}33`, color: GREEN, fontSize: 10 }}>
            Completa
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <div className="rounded-xl p-2.5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-1.5 mb-1">
            <LogIn size={12} style={{ color: GREEN }} />
            <span className="uppercase tracking-wider" style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.35)' }}>Entrada</span>
          </div>
          <p className="text-white font-black" style={{ fontSize: 13 }}>{formatHoraES(a.hora_ingreso)}</p>
        </div>

        <div className="rounded-xl p-2.5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-1.5 mb-1">
            <LogOut size={12} style={{ color: sinSalida ? FIRE : BLUE }} />
            <span className="uppercase tracking-wider" style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.35)' }}>Salida</span>
          </div>
          <p className="text-white font-black" style={{ fontSize: 13 }}>{formatHoraES(a.hora_salida)}</p>
        </div>

        <div className="rounded-xl p-2.5 sm:col-span-1" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-1.5 mb-1">
            <Clock size={12} style={{ color: AMBER }} />
            <span className="uppercase tracking-wider" style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.35)' }}>Duración</span>
          </div>
          <p className="text-white font-black" style={{ fontSize: 13 }}>{formatDuracionMin(a.duracion_minutos)}</p>
        </div>
      </div>

      {sinSalida && (
        <p className="flex items-center gap-1.5 mt-2.5" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>
          <AlertCircle size={13} style={{ color: FIRE, flexShrink: 0 }} />
          No se registró salida, se cerró automáticamente
        </p>
      )}
    </div>
  )
}

export function HistorialAsistenciasPanel() {
  const [items, setItems] = useState<AsistenciaRecord[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [reintento, setReintento] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getMiHistorial(page, PAGE_SIZE)
      .then(data => {
        if (cancelled) return
        // Página fuera de rango (se borraron registros): volver a la última válida
        if (data.asistencias.length === 0 && data.totalPages > 0 && page > data.totalPages) {
          setPage(data.totalPages)
          return
        }
        setItems(data.asistencias)
        setTotalPages(data.totalPages)
        setError(false)
      })
      .catch(() => { if (!cancelled) setError(true) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [page, reintento])

  if (loading && items.length === 0) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map(i => (
          <div key={i} className="rounded-2xl h-24 animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
        ))}
      </div>
    )
  }

  if (error && items.length === 0) {
    return (
      <div className="rounded-2xl p-6 text-center" style={cardStyle}>
        <p className="text-white font-bold" style={{ fontSize: 14 }}>No se pudo cargar el historial</p>
        <button
          onClick={() => setReintento(n => n + 1)}
          className="mt-3 px-4 py-2 rounded-xl font-black uppercase tracking-wider"
          style={{ background: BLUE, color: '#fff', fontSize: 11 }}
        >
          Reintentar
        </button>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl p-6 text-center" style={cardStyle}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Aún no tienes asistencias registradas.</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3" style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s' }}>
        {items.map((a, i) => (
          <motion.div key={a.id_asistencia} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.04, 0.3) }}>
            <Row a={a} />
          </motion.div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1 || loading}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl font-black uppercase tracking-wider"
            style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)', fontSize: 10, opacity: page <= 1 || loading ? 0.4 : 1 }}
          >
            <ChevronLeft size={13} /> Anterior
          </button>
          <span className="text-center font-bold" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, minWidth: 90 }}>
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || loading}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl font-black uppercase tracking-wider"
            style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)', fontSize: 10, opacity: page >= totalPages || loading ? 0.4 : 1 }}
          >
            Siguiente <ChevronRight size={13} />
          </button>
        </div>
      )}
    </>
  )
}