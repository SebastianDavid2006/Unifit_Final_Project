import { motion } from 'motion/react'
import type { Machine, Exercise } from '@/data/types'
import { BLUE, muscleIcons, statusConfig } from '@/data/constants'
import { StatusBadge } from '@/shared/components/ui/StatusBadge'
import { EQUIPMENT_IMAGES } from '@/modules/equipment/data'

interface MachineCardGridProps {
  machines: Machine[]
  exercises: Exercise[]
  onPreview: (m: Machine) => void
}

export function MachineCardGrid({ machines, exercises, onPreview }: MachineCardGridProps) {
  function getMachineExercises(m: Machine) {
    return exercises.filter(e => m.exerciseIds.includes(e.id))
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {machines.map((m, i) => {
        const machineExercises = getMachineExercises(m)
        return (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 * i, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.04, boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onPreview(m)}
            className="rounded-2xl premium-card cursor-pointer"
            style={{
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.6)',
              boxShadow: '0 2px 20px rgba(0,0,0,0.04)',
            }}
          >
            <div className="w-full overflow-hidden relative" style={{ height: 96, background: `${statusConfig[m.status].color}08` }}>
              <img
                src={m.imageDataUrl || EQUIPMENT_IMAGES.machineImg}
                alt={m.name}
                className="w-full h-full"
                style={{
                  objectFit: m.imageDataUrl ? 'cover' : 'contain',
                  objectPosition: m.imageDataUrl ? 'center' : 'bottom center',
                  filter: m.imageDataUrl ? 'none' : `grayscale(${0.1 + (m.id * 0.05) % 0.5}) contrast(${0.8 + (m.id * 0.03) % 0.4})`,
                  padding: m.imageDataUrl ? 0 : '8px',
                }}
              />
              <div className="absolute inset-0" style={{
                background: `linear-gradient(180deg, transparent 40%, ${statusConfig[m.status].color}15 100%)`,
                pointerEvents: 'none',
              }} />
            </div>
            <div className="px-5 pt-4 pb-3">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-[#1A1A1E] text-base leading-tight">{m.name}</h3>
                <StatusBadge status={m.status} />
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {m.muscleGroups.map((mg, i) => (
                  muscleIcons[mg] ? (
                    <div key={i} className="relative group">
                      <div className="flex items-center justify-center rounded-full" style={{ width: 38, height: 38, background: 'linear-gradient(180deg, #ffffff 0%, #DBEAFE 100%)', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
                        <img src={muscleIcons[mg]} alt="" className="w-5 h-5" />
                      </div>
                      <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg whitespace-nowrap text-[10px] font-medium pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10" style={{ background: 'rgba(0,0,0,0.7)', color: '#FFFFFF' }}>
                        {mg}
                      </div>
                    </div>
                  ) : null
                ))}
              </div>
            </div>
            <div className="px-5 pb-3 flex justify-center" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
              <span className="text-[11px] font-bold text-center" style={{ color: BLUE }}>
                {machineExercises.length} ejercicio{machineExercises.length !== 1 ? 's' : ''}
              </span>
            </div>
          </motion.div>
        )
      })}
      {machines.length === 0 && (
        <div className="col-span-3 py-16 text-center">
          <p className="text-lg font-bold" style={{ color: 'rgba(0,0,0,0.2)' }}>No se encontraron máquinas</p>
          <p className="text-sm mt-1" style={{ color: 'rgba(0,0,0,0.15)' }}>Prueba con otros filtros o agrega una nueva máquina</p>
        </div>
      )}
    </div>
  )
}
