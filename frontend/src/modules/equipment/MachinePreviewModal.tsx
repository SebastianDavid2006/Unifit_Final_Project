import type { Machine, Exercise } from '@/data/types'
import { BLUE, RED, ORANGE, GREEN, YELLOW, BLUE_GRAD, muscleIcons, statusConfig } from '@/data/constants'
import { StatusBadge } from '@/shared/components/ui/StatusBadge'
import { motion, AnimatePresence } from 'motion/react'
import { X, Pencil, Trash2, List } from 'lucide-react'
import machineImg from '@/assets/illustrations/modules/equipment_module.webp'

interface MachinePreviewModalProps {
  machine: Machine | null
  exercises: Exercise[]
  previewMuscleFilter: string
  onMuscleFilterChange: (filter: string) => void
  onEdit: (machine: Machine) => void
  onDelete: (machine: Machine) => void
  onClose: () => void
}

export function MachinePreviewModal(props: MachinePreviewModalProps) {
  function getMachineExercises(m: Machine) {
    return props.exercises.filter(e => m.exerciseIds.includes(e.id))
  }

  return (
    <AnimatePresence>
      {props.machine && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)' }}
          onClick={() => props.onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
            className="rounded-3xl w-full max-w-lg flex flex-col mx-4 overflow-hidden"
            style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 25px 60px rgba(0,0,0,0.12)' }}
          >
            {/* Image */}
            <div className="relative" style={{ height: 160, background: `${statusConfig[props.machine.status].color}08` }}>
              <img
                src={props.machine.imageDataUrl || machineImg}
                alt={props.machine.name}
                className="w-full h-full"
                style={{
                  objectFit: props.machine.imageDataUrl ? 'cover' : 'contain',
                  padding: props.machine.imageDataUrl ? 0 : '12px',
                }}
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => props.onClose()}
                className="absolute top-3 right-3 w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.9)', color: 'rgba(0,0,0,0.4)' }}
              >
                <X size={16} />
              </motion.button>
            </div>

            {/* Content */}
            <div className="px-6 pt-5 pb-6">
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-lg font-bold" style={{ color: '#1A1A1E' }}>{props.machine.name}</h2>
                <StatusBadge status={props.machine.status} />
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <div
                  onClick={() => props.onMuscleFilterChange('all')}
                  className="flex items-center justify-center rounded-full transition-transform duration-200 hover:scale-110 cursor-pointer"
                  style={{
                    width: 38, height: 38,
                    background: props.previewMuscleFilter === 'all' ? BLUE_GRAD : 'linear-gradient(180deg, #ffffff 0%, #DBEAFE 100%)',
                    boxShadow: props.previewMuscleFilter === 'all' ? '0 2px 8px rgba(18,112,183,0.3)' : '0 2px 8px rgba(0,0,0,0.07)',
                  }}
                  title="Todos los ejercicios"
                >
                  <List size={16} color={props.previewMuscleFilter === 'all' ? '#FFFFFF' : '#1270B7'} />
                </div>
                {props.machine.muscleGroups.map((mg, i) => (
                  muscleIcons[mg] ? (
                    <div key={i} className="relative group">
                      <div
                        onClick={() => props.onMuscleFilterChange(mg)}
                        className="flex items-center justify-center rounded-full transition-transform duration-200 hover:scale-110 cursor-pointer"
                        style={{
                          width: 38, height: 38,
                          background: props.previewMuscleFilter === mg ? BLUE_GRAD : 'linear-gradient(180deg, #ffffff 0%, #DBEAFE 100%)',
                          boxShadow: props.previewMuscleFilter === mg ? '0 2px 8px rgba(18,112,183,0.3)' : '0 2px 8px rgba(0,0,0,0.07)',
                        }}
                      >
                        <img src={muscleIcons[mg]} alt="" className="w-5 h-5" style={{ filter: props.previewMuscleFilter === mg ? 'brightness(0) invert(1)' : 'none' }} />
                      </div>
                      <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg whitespace-nowrap text-[10px] font-medium pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10" style={{ background: 'rgba(0,0,0,0.7)', color: '#FFFFFF' }}>
                        {mg}
                      </div>
                    </div>
                  ) : null
                ))}
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { props.onClose(); props.onEdit(props.machine) }}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                  style={{ background: `${BLUE}10`, color: BLUE, border: `1px solid ${BLUE}25` }}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <Pencil size={13} /> Editar
                  </div>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => props.onDelete(props.machine)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
                  style={{ background: RED }}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <Trash2 size={13} /> Eliminar
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
