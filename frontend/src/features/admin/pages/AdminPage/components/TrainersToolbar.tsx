import { motion } from 'motion/react'
import GlassSearch from '@/features/admin/components/GlassSearch'
import iconRunning from '@/assets/icons/animated/icon_running.gif'

export default function TrainersToolbar({
  trainerDetailOpen, onTrainerBack,
  trainerSearch, onTrainerSearchChange, trainerSearchFocused, onTrainerSearchFocusChange,
}: {
  trainerDetailOpen: boolean
  onTrainerBack: () => void
  trainerSearch: string
  onTrainerSearchChange: (v: string) => void
  trainerSearchFocused: boolean
  onTrainerSearchFocusChange: (v: boolean) => void
}) {
  if (trainerDetailOpen) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onTrainerBack}
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(16px) saturate(1.5)',
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
        }}
      >
        <img src={iconRunning} alt="Volver" className="w-5 h-5 object-contain" style={{ transform: 'scaleX(-1)' }} />
      </motion.button>
    )
  }

  return (
    <div className="flex-1 flex justify-center relative">
      <div className="flex items-center gap-2 max-w-md w-full">
        <GlassSearch
          value={trainerSearch}
          onChange={onTrainerSearchChange}
          focused={trainerSearchFocused}
          onFocusChange={onTrainerSearchFocusChange}
          placeholder="Buscar por nombre, cargo o especialidad..."
        />
      </div>
    </div>
  )
}
