import { motion } from 'motion/react'
import { Camera, Upload } from 'lucide-react'
import { meshInputBg, meshInputHover } from '@/data/constants'

interface ImageUploadProps {
  value: string
  onChange: (imageUrl: string) => void
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  return (
    <div>
      <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.6)' }}>Imagen o GIF <span style={{ color: 'rgba(0,0,0,0.2)' }}>(Opcional)</span></label>
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="w-full min-h-[160px] rounded-xl cursor-pointer overflow-hidden relative group"
        style={{
          background: value ? 'radial-gradient(ellipse at 30% 20%, rgba(48,209,88,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(48,209,88,0.08) 0%, transparent 50%), rgba(255,255,255,0.6)' : meshInputBg,
          border: `1px solid ${value ? 'rgba(48,209,88,0.2)' : 'transparent'}`,
        }}
        onClick={() => {
          if (!value) {
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = 'image/*'
            input.onchange = e => {
              const file = (e.target as HTMLInputElement).files?.[0]
              if (file) {
                const reader = new FileReader()
                reader.onload = ev => onChange(ev.target?.result as string)
                reader.readAsDataURL(file)
              }
            }
            input.click()
          }
        }}
        onMouseEnter={e => { if (!value) { e.currentTarget.style.background = meshInputHover; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)' } }}
        onMouseLeave={e => { if (!value) { e.currentTarget.style.background = meshInputBg; e.currentTarget.style.borderColor = 'transparent' } }}
      >
        {value ? (
          <>
            <img src={value} alt="" className="w-full h-full object-cover" />
            <div
              onClick={e => { e.stopPropagation(); const input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*'; input.onchange = ev => { const file = (ev.target as HTMLInputElement).files?.[0]; if (file) { const reader = new FileReader(); reader.onload = ev2 => onChange(ev2.target?.result as string); reader.readAsDataURL(file) } }; input.click() }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 cursor-pointer"
              style={{ background: 'rgba(0,0,0,0.45)' }}
            >
              <Camera size={24} className="text-white" />
              <span className="text-xs font-semibold text-white">Cambiar imagen</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-1.5 py-10">
            <Upload size={20} style={{ color: 'rgba(0,0,0,0.2)' }} />
            <span className="text-xs font-medium" style={{ color: 'rgba(0,0,0,0.2)' }}>Subir imagen o GIF</span>
          </div>
        )}
      </motion.div>
    </div>
  )
}
