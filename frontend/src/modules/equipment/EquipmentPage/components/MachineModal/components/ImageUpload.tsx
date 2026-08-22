import { motion } from 'motion/react'
import { Camera, Upload } from 'lucide-react'
import { meshInputBg, meshInputHover } from '@/data/shared/constants'

interface ImageUploadProps {
  value: string
  onChange: (dataUrl: string) => void
  inputId?: string
}

export function ImageUpload({ value, onChange, inputId }: ImageUploadProps) {
  return (
    <div>
      <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.6)' }}>Imagen de la máquina</label>
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.2 }}
        className="w-full h-40 rounded-xl cursor-pointer overflow-hidden relative group"
        style={{
          background: value ? 'radial-gradient(ellipse at 30% 20%, rgba(48,209,88,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(48,209,88,0.08) 0%, transparent 50%), rgba(255,255,255,0.6)' : meshInputBg,
          border: `1px solid ${value ? 'rgba(48,209,88,0.2)' : 'transparent'}`,
        }}
        onClick={() => document.getElementById(inputId || 'machine-image-input')?.click()}
        onMouseEnter={e => { if (!value) { e.currentTarget.style.background = meshInputHover; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)' } }}
        onMouseLeave={e => { if (!value) { e.currentTarget.style.background = meshInputBg; e.currentTarget.style.borderColor = 'transparent' } }}
      >
        {value ? (
          <>
            <img src={value} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200" style={{ background: 'rgba(0,0,0,0.45)' }}>
              <Camera size={24} className="text-white" />
              <span className="text-xs font-semibold text-white">Cambiar imagen</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1.5 py-6">
            <Upload size={18} style={{ color: 'rgba(0,0,0,0.2)' }} />
            <span className="text-xs font-medium" style={{ color: 'rgba(0,0,0,0.2)' }}>Subir imagen</span>
          </div>
        )}
      </motion.div>
      <input
        id={inputId || 'machine-image-input'}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) {
            const reader = new FileReader()
            reader.onload = () => {
              onChange(reader.result as string)
            }
            reader.readAsDataURL(file)
          }
        }}
      />
    </div>
  )
}
