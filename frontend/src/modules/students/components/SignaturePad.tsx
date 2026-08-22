import { motion } from 'motion/react'
import { RefreshCw } from 'lucide-react'
import SignatureCanvas from 'react-signature-canvas'
import { useRef, type RefObject } from 'react'

interface SignaturePadProps {
  title: string
  ref: RefObject<SignatureCanvas | null>
  onClear: () => void
}

export function SignaturePad({ title, ref, onClear }: SignaturePadProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold" style={{ color: '#1A1A1E' }}>{title}</p>
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.93 }}
          onClick={onClear}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer"
          style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.4)' }}
        >
          <RefreshCw size={11} />
          Limpiar
        </motion.button>
      </div>
      <p className="text-[11px] font-medium mb-2" style={{ color: 'rgba(0,0,0,0.4)' }}>
        Dibuja tu firma en el recuadro utilizando el mouse o tu dedo (si usas pantalla táctil).
      </p>
      <div
        className="relative rounded-2xl p-4 overflow-hidden"
        style={{
          background: '#FFFFFF',
          border: '1px solid rgba(0,0,0,0.04)',
        }}
      >
        <motion.div
          className="absolute top-0 left-0 right-0 h-0.5 pointer-events-none z-10"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(18,112,183,0.3), transparent)' }}
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 pointer-events-none z-10"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(18,112,183,0.3), transparent)' }}
          animate={{ x: ['100%', '-100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 rounded-tl pointer-events-none" style={{ borderColor: 'rgba(18,112,183,0.2)' }} />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 rounded-tr pointer-events-none" style={{ borderColor: 'rgba(18,112,183,0.2)' }} />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 rounded-bl pointer-events-none" style={{ borderColor: 'rgba(18,112,183,0.2)' }} />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 rounded-br pointer-events-none" style={{ borderColor: 'rgba(18,112,183,0.2)' }} />
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.04)' }}>
          <SignatureCanvas
            ref={ref}
            penColor="#1A1A1E"
            minWidth={1}
            maxWidth={2.5}
            canvasProps={{
              className: 'w-full',
              style: { height: 200, background: '#FFFFFF', borderRadius: '12px', width: '100%' },
            }}
          />
        </div>
      </div>
    </div>
  )
}