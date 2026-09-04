import type { Exercise } from '@/data/shared/types'
import { BLUE, RED, muscleIcons } from '@/data/shared/constants'
import { StatusBadge } from '@/shared/components/ui/StatusBadge'
import { motion, AnimatePresence } from 'motion/react'
import { X, Pencil, Trash2, Dumbbell } from 'lucide-react'
import { LEVEL_BADGE } from '@/modules/equipment/data'

interface ExercisePreviewModalProps {
  exercise: Exercise | null
  onEdit: (exercise: Exercise) => void
  onDelete: (exercise: Exercise) => void
  onClose: () => void
  userRole?: 'admin' | 'entrenador'
}

export function ExercisePreviewModal(props: ExercisePreviewModalProps) {
  return (
    <AnimatePresence>
      {props.exercise && (
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
            <div className="relative" style={{ height: 160, background: 'radial-gradient(ellipse at 30% 20%, rgba(48,209,88,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(10,132,255,0.05) 0%, transparent 50%)' }}>
              {props.exercise.imageUrl ? (
                <img src={props.exercise.imageUrl} alt={props.exercise.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Dumbbell size={40} style={{ color: 'rgba(48,209,88,0.2)' }} />
                </div>
              )}
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
                <h2 className="text-lg font-bold" style={{ color: '#1A1A1E' }}>{props.exercise.name}</h2>
                <StatusBadge status={props.exercise.status} />
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {props.exercise.muscleGroups.map((mg, i) => (
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

              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] px-2 py-0.5 rounded-md font-medium" style={{
                  background: LEVEL_BADGE[props.exercise.recommendedLevel].bg,
                  color: LEVEL_BADGE[props.exercise.recommendedLevel].color,
                }}>
                  {LEVEL_BADGE[props.exercise.recommendedLevel].label}
                </span>
                <span className="text-xs" style={{ color: 'rgba(0,0,0,0.35)' }}>{props.exercise.zone}</span>
              </div>

              {props.exercise.description && (
                <p className="text-xs mb-4" style={{ color: 'rgba(0,0,0,0.5)' }}>{props.exercise.description}</p>
              )}

              {/* Video */}
              {props.exercise.videoUrl && (
                <div className="mb-4 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
                  <video
                    src={props.exercise.videoUrl}
                    controls
                    className="w-full"
                    style={{ maxHeight: 200 }}
                  />
                </div>
              )}

              <div className="flex items-center gap-3">
                {props.userRole !== 'entrenador' && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => { props.onClose(); props.onEdit(props.exercise) }}
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
                      onClick={() => props.onDelete(props.exercise)}
                      className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
                      style={{ background: RED }}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <Trash2 size={13} /> Eliminar
                      </div>
                    </motion.button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
