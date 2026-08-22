import { motion } from 'motion/react'
import { Activity, FileText } from 'lucide-react'
import GlassSearch from '@/features/admin/components/GlassSearch'
import iconRunning from '@/assets/icons/animated/icon_running.gif'
import { PILL_GRAD } from '../data'

export default function TrainersToolbar({
  isPermissions, trainerDetailOpen, trainerTab, onTrainerTabChange, onTrainerBack,
  trainerSearch, onTrainerSearchChange, trainerSearchFocused, onTrainerSearchFocusChange,
}: {
  isPermissions: boolean
  trainerDetailOpen: boolean
  trainerTab: string
  onTrainerTabChange: (t: string) => void
  onTrainerBack: () => void
  trainerSearch: string
  onTrainerSearchChange: (v: string) => void
  trainerSearchFocused: boolean
  onTrainerSearchFocusChange: (v: boolean) => void
}) {
  if (trainerDetailOpen) {
    return (
      <>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onTrainerBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: isPermissions ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(16px) saturate(1.5)',
            border: `1px solid ${isPermissions ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.3)'}`,
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
          }}
        >
          <img src={iconRunning} alt="Volver" className="w-5 h-5 object-contain" style={{ transform: 'scaleX(-1)', filter: isPermissions ? 'brightness(0) invert(1)' : 'none' }} />
        </motion.button>
        <div className="flex-1 flex items-center justify-center gap-4">
          <div className="flex items-center gap-1 rounded-2xl px-2 py-1.5" style={{
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(24px) saturate(1.6)',
            border: '1px solid rgba(255,255,255,0.25)',
          }}>
            <motion.button onClick={() => onTrainerTabChange('overview')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all"
              style={{
                background: trainerTab === 'overview' ? PILL_GRAD : 'transparent',
                color: trainerTab === 'overview' ? '#FFFFFF' : isPermissions ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)',
              }}
            >
              <Activity size={14} />
              General
            </motion.button>
            <motion.button onClick={() => onTrainerTabChange('permissions')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all"
              style={{
                background: trainerTab === 'permissions' ? PILL_GRAD : 'transparent',
                color: trainerTab === 'permissions' ? '#FFFFFF' : isPermissions ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)',
              }}
            >
              <FileText size={14} />
              Permisos
            </motion.button>
          </div>
        </div>
      </>
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
