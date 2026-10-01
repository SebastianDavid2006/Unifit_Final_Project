import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { getHistorialUsuario, type PaginatedAsistencia } from '@/services/asistencia.service'
import { mensajeError } from '@/lib/api'
import { formatDateES, formatHoraES, formatDuracionMin } from '@/lib/dateUtils'
import { cardStyle } from '@/modules/students/StudentProfileData'

const PAGE_SIZE = 10
const GRID = '1.4fr 1fr 1fr 1fr'

interface Props {
  studentId: string
}

export function ProgressTab({ studentId }: Props) {
  const [page, setPage] = useState(1)
  const [data, setData] = useState<PaginatedAsistencia | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { setPage(1); setData(null) }, [studentId])

  useEffect(() => {
    if (!studentId) return
    let cancelled = false
    setLoading(true)
    setError('')
    getHistorialUsuario(studentId, page, PAGE_SIZE)
      .then(res => {
        if (cancelled) return
        // Si la página quedó fuera de rango (se borraron registros), volver a la última válida
        if (res.asistencias.length === 0 && res.totalPages > 0 && page > res.totalPages) {
          setPage(res.totalPages)
          return
        }
        setData(res)
      })
      .catch(err => { if (!cancelled) setError(mensajeError(err)) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [studentId, page])

  const asistencias = data?.asistencias ?? []
  const totalPages = data?.totalPages ?? 1

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-[1200px] mx-auto"
    >
      <div className="rounded-2xl overflow-hidden" style={cardStyle}>
        <div className="flex items-center gap-2 px-5 py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <Calendar size={16} style={{ color: '#E63946' }} />
          <h3 className="text-[#0D1B2A] text-sm font-bold whitespace-nowrap">Historial de Entradas y Salidas</h3>
        </div>

        {error ? (
          <p className="px-5 py-10 text-center text-sm font-medium" style={{ color: '#E63946' }}>{error}</p>
        ) : !data && loading ? (
          <p className="px-5 py-10 text-center text-sm font-medium" style={{ color: 'rgba(0,0,0,0.4)' }}>Cargando asistencias...</p>
        ) : asistencias.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm font-medium" style={{ color: 'rgba(0,0,0,0.4)' }}>Este usuario aún no tiene asistencias registradas.</p>
        ) : (
          <div className="px-5 py-4" style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s' }}>
            <div className="grid gap-4 px-4 mb-2" style={{ gridTemplateColumns: GRID }}>
              {['Fecha', 'Ingreso', 'Salida', 'Duración'].map(h => (
                <div key={h} className="text-xs font-bold" style={{ color: 'rgba(0,0,0,0.4)' }}>{h}</div>
              ))}
            </div>
            <div className="space-y-1">
              {asistencias.map(a => {
                const sinSalida = !a.hora_salida
                return (
                  <div
                    key={a.id_asistencia}
                    className="grid gap-4 items-center px-4 py-3 rounded-xl"
                    style={{
                      gridTemplateColumns: GRID,
                      background: sinSalida ? 'rgba(255,149,0,0.06)' : 'rgba(48,209,88,0.06)',
                      borderLeft: `3px solid ${sinSalida ? '#FF9500' : '#30D158'}`,
                    }}
                  >
                    <span className="text-sm font-semibold" style={{ color: '#0D1B2A' }}>
                      {formatDateES(a.hora_ingreso, { day: 'numeric', month: 'long' })}
                    </span>
                    <span className="text-sm font-semibold" style={{ color: '#0D1B2A' }}>{formatHoraES(a.hora_ingreso)}</span>
                    <span className="text-sm font-semibold" style={{ color: sinSalida ? '#FF9500' : '#C62828' }}>
                      {sinSalida ? 'Sin salida' : formatHoraES(a.hora_salida)}
                    </span>
                    <span className="text-sm font-bold" style={{ color: '#0D1B2A' }}>{formatDuracionMin(a.duracion_minutos)}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 px-5 py-3" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.5)', opacity: page <= 1 || loading ? 0.4 : 1, cursor: page <= 1 || loading ? 'default' : 'pointer' }}
            >
              <ChevronLeft size={14} /> Anterior
            </button>
            <span className="text-xs font-bold min-w-[90px] text-center" style={{ color: '#0D1B2A' }}>
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.5)', opacity: page >= totalPages || loading ? 0.4 : 1, cursor: page >= totalPages || loading ? 'default' : 'pointer' }}
            >
              Siguiente <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
