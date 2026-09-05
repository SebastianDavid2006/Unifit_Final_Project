import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'motion/react'
import { CalendarClock, Clock, LogIn, LogOut, AlertCircle } from 'lucide-react'
import { getMiHistorial, type AsistenciaRecord } from '@/services/asistencia.service'
import { cardStyle, GREEN, FIRE, BLUE, AMBER } from '@/features/student/components/ui/fitness'

const PAGE_SIZE = 10

function fmtHora(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
}

function fmtFecha(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

function fmtDuracion(min: number | null): string {
  if (min == null) return '—'
  const h = Math.floor(min / 60)
  const m = min % 60
  if (h > 0 && m > 0) return `${h}h ${m}min`
  if (h > 0) return `${h}h`
  return `${m}min`
}

function Row({ a }: { a: AsistenciaRecord }) {
  const sinSalida = !a.hora_salida

  return (
    <div className="rounded-2xl p-4" style={cardStyle}>
      <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <CalendarClock size={15} style={{ color: BLUE }} />
          <p className="text-white font-bold" style={{ fontSize: 13 }}>{fmtFecha(a.fecha)}</p>
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
          <p className="text-white font-black" style={{ fontSize: 13 }}>{fmtHora(a.hora_ingreso)}</p>
        </div>

        <div className="rounded-xl p-2.5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-1.5 mb-1">
            <LogOut size={12} style={{ color: sinSalida ? FIRE : BLUE }} />
            <span className="uppercase tracking-wider" style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.35)' }}>Salida</span>
          </div>
          <p className="text-white font-black" style={{ fontSize: 13 }}>{fmtHora(a.hora_salida)}</p>
        </div>

        <div className="rounded-xl p-2.5 sm:col-span-1" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-1.5 mb-1">
            <Clock size={12} style={{ color: AMBER }} />
            <span className="uppercase tracking-wider" style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.35)' }}>Duración</span>
          </div>
          <p className="text-white font-black" style={{ fontSize: 13 }}>{fmtDuracion(a.duracion_minutos)}</p>
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
  const sentinelRef = useRef<HTMLDivElement>(null)
  const loadingRef = useRef(false)

  const cargar = useCallback(async (p: number) => {
    if (loadingRef.current) return
    loadingRef.current = true
    setLoading(true)
    try {
      const data = await getMiHistorial(p, PAGE_SIZE)
      setItems(prev => (p === 1 ? data.asistencias : [...prev, ...data.asistencias]))
      setTotalPages(data.totalPages)
      setError(false)
    } catch {
      setError(true)
    } finally {
      loadingRef.current = false
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    cargar(1)
  }, [cargar])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loadingRef.current && page < totalPages) {
          setPage(prev => {
            const next = prev + 1
            cargar(next)
            return next
          })
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [page, totalPages, cargar])

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
          onClick={() => cargar(1)}
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
      <div className="space-y-3">
        {items.map((a, i) => (
          <motion.div key={a.id_asistencia} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.04, 0.3) }}>
            <Row a={a} />
          </motion.div>
        ))}
      </div>
      <div ref={sentinelRef} className="h-8" />
      {loading && items.length > 0 && (
        <p className="text-center py-2" style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>Cargando más…</p>
      )}
    </>
  )
}