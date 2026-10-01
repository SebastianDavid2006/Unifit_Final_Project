import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X } from 'lucide-react'
import DataConsentSection from './NewUserModal/sections/DataConsentSection'
import { api, mensajeError } from '@/lib/api'

// Completa el registro del personal pendiente: para ellos el único requisito es el
// tratamiento de datos (firmado en físico; aquí el admin da fe de que se firmó).
// Quién puede hacerlo lo decide el backend, no esta pantalla.
export default function CompleteStaffModal({ open, trainerName, trainerId, onClose, onCompleted }: {
  open: boolean
  trainerName: string
  trainerId: string
  onClose: () => void
  onCompleted: () => void | Promise<void>
}) {
  const [aceptaDatos, setAceptaDatos] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setAceptaDatos(false)
      setLoading(false)
      setError('')
    }
  }, [open])

  async function confirmar() {
    if (!aceptaDatos) {
      setError('Debes confirmar la autorización de tratamiento de datos para activar la cuenta')
      return
    }
    setLoading(true)
    setError('')
    try {
      await api.put(`/usuarios/${trainerId}/aceptar-documento`, { tipo_documento_legal: 'tratamiento_datos' })
      await onCompleted()
      onClose()
    } catch (err) {
      setError(mensajeError(err))
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.35)' }}
          onClick={() => { if (!loading) onClose() }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl p-6"
            style={{ background: '#FFFFFF', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-base font-bold" style={{ color: '#1A1A1E' }}>Completar registro</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.5)' }}>{trainerName} está pendiente de activación.</p>
              </div>
              <button
                onClick={onClose}
                disabled={loading}
                aria-label="Cerrar"
                className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer"
                style={{ background: 'rgba(0,0,0,0.05)' }}
              >
                <X size={16} color="rgba(0,0,0,0.5)" />
              </button>
            </div>

            <DataConsentSection accepted={aceptaDatos} onChange={v => { setAceptaDatos(v); setError('') }} />

            {error && (
              <p className="text-xs font-medium mt-4" style={{ color: '#D32F2F' }}>{error}</p>
            )}

            <div className="flex items-center gap-2.5 mt-6">
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium cursor-pointer"
                style={{ background: 'rgba(0,0,0,0.05)', color: 'rgba(0,0,0,0.6)' }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmar}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #22C55E, #1270B7)', opacity: loading ? 0.6 : 1 }}
              >
                {loading ? 'Activando...' : 'Activar cuenta'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
