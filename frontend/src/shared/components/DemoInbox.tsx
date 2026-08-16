import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Mail, Copy, Check } from 'lucide-react'
import { getInbox, type MockEmail } from '@/shared/mock/mockAuth'

const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #7ec8e3)'

interface Props {
  open: boolean
  onClose: () => void
}

export default function DemoInbox({ open, onClose }: Props) {
  const [emails, setEmails] = useState<MockEmail[]>(() => (open ? getInbox() : []))
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const refresh = () => {
    setEmails(getInbox())
    setSelectedId(null)
  }

  const copy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text).catch(() => {})
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  const selected = emails.find(e => e.id === selectedId) ?? null

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md rounded-3xl flex flex-col overflow-hidden"
            style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 30px 70px rgba(0,0,0,0.2)', maxHeight: '88vh' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(18,112,183,0.12)' }}>
                  <Mail size={17} style={{ color: '#1270B7' }} />
                </div>
                <div>
                  <p className="text-sm font-extrabold" style={{ color: '#111' }}>Correo demo</p>
                  <p className="text-[10px]" style={{ color: 'rgba(0,0,0,0.4)' }}>Simula la bandeja de entrada (solo demo)</p>
                </div>
              </div>
              <button
                onClick={refresh}
                className="text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                style={{ background: 'rgba(18,112,183,0.1)', color: '#1270B7' }}
              >
                Actualizar
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-black/5 transition-colors cursor-pointer"
                style={{ color: 'rgba(0,0,0,0.4)' }}
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {emails.length === 0 && (
                <p className="text-center text-xs mt-10" style={{ color: 'rgba(0,0,0,0.35)' }}>
                  No hay correos todavía. Crea una cuenta para recibir las credenciales aquí.
                </p>
              )}
              {emails.map(m => (
                <motion.button
                  key={m.id}
                  onClick={() => setSelectedId(m.id)}
                  whileTap={{ scale: 0.99 }}
                  className="w-full text-left rounded-2xl p-3.5 transition-colors cursor-pointer"
                  style={{
                    background: selectedId === m.id ? 'rgba(18,112,183,0.07)' : 'rgba(0,0,0,0.03)',
                    border: selectedId === m.id ? '1px solid rgba(18,112,183,0.25)' : '1px solid rgba(0,0,0,0.05)',
                  }}
                >
                  <p className="text-[11px] font-bold" style={{ color: '#111' }}>{m.subject}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'rgba(0,0,0,0.4)' }}>Para: {m.to}</p>
                </motion.button>
              ))}
            </div>

            {selected && (
              <div className="flex-shrink-0 p-4" style={{ borderTop: '1px solid rgba(0,0,0,0.06)', background: 'rgba(18,112,183,0.03)' }}>
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(0,0,0,0.4)' }}>{selected.subject}</p>
                <p className="text-xs mt-2 leading-relaxed" style={{ color: 'rgba(0,0,0,0.65)' }}>
                  {selected.body}
                </p>
                <div className="mt-3 flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: '#FFFFFF', border: '1px dashed rgba(18,112,183,0.4)' }}>
                  <span className="text-[10px] font-bold" style={{ color: 'rgba(0,0,0,0.4)' }}>Contraseña temporal:</span>
                  <span className="text-xs font-extrabold font-mono flex-1" style={{ color: '#1270B7' }}>{selected.tempPassword}</span>
                  <button
                    onClick={() => copy(selected.id, selected.tempPassword)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer"
                    style={{ background: 'rgba(18,112,183,0.1)', color: '#1270B7' }}
                  >
                    {copiedId === selected.id ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
                <p className="text-[9px] mt-2" style={{ color: 'rgba(0,0,0,0.35)' }}>
                  En producción esta contraseña llegaría a un correo real. Aquí solo es para probar el flujo.
                </p>
              </div>
            )}

            <div className="flex-shrink-0 p-4">
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl text-sm font-bold text-white cursor-pointer"
                style={{ background: BLUE_GRAD }}
              >
                Entendido
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
