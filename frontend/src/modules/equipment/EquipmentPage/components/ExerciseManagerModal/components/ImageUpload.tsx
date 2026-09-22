import { motion } from 'motion/react'
import { useRef } from 'react'
import { Camera, Upload } from 'lucide-react'
import { meshInputBg, meshInputHover } from '@/data/shared/constants'

interface ImageUploadProps {
  value: string | File | null
  onChange: (file: File | null, previewUrl: string | null) => void
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewUrl = value instanceof File ? URL.createObjectURL(value) : (typeof value === 'string' ? value : null)
  const hasImage = !!previewUrl

  const handleFileSelect = (file: File | null) => {
    const preview = file ? URL.createObjectURL(file) : null
    onChange(file, preview)
  }

  const openFileDialog = () => fileInputRef.current?.click()

  return (
    <div>
      <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.6)' }}>Imagen o GIF</label>
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="w-full min-h-[160px] rounded-xl cursor-pointer overflow-hidden relative group"
        style={{
          background: hasImage ? 'radial-gradient(ellipse at 30% 20%, rgba(48,209,88,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(48,209,88,0.08) 0%, transparent 50%), rgba(255,255,255,0.6)' : meshInputBg,
          border: `1px solid ${hasImage ? 'rgba(48,209,88,0.2)' : 'transparent'}`,
        }}
        onClick={openFileDialog}
        onMouseEnter={e => { if (!hasImage) { e.currentTarget.style.background = meshInputHover; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)' } }}
        onMouseLeave={e => { if (!hasImage) { e.currentTarget.style.background = meshInputBg; e.currentTarget.style.borderColor = 'transparent' } }}
      >
        {hasImage ? (
          <>
            <img src={previewUrl} alt="" className="w-full h-full object-cover" />
            <div
              onClick={e => { e.stopPropagation(); openFileDialog() }}
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
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => handleFileSelect(e.target.files?.[0] || null)}
      />
    </div>
  )
}
