import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Plus, Target, History } from 'lucide-react'
import { RoutineCreator } from './components/RoutineCreator'
import type { SavedRoutine } from './components/RoutineCreator'
import { RoutineList } from './components/RoutineList'
import { RoutineHistory } from './components/RoutineHistory'
import { useRoutine } from './useRoutine'
import type { Student } from '@/modules/students/StudentProfileData'

interface ObjectiveTabProps {
  student: Student
  editable?: boolean
}

type View = 'list' | 'creator' | 'history'

export function ObjectiveTab({ student, editable = true }: ObjectiveTabProps) {
  const { routines, addRoutine, removeRoutine } = useRoutine()
  const [view, setView] = useState<View>('list')
  const [currentRoutine, setCurrentRoutine] = useState<SavedRoutine | null>(null)

  const handleCreate = () => {
    setCurrentRoutine(null)
    setView('creator')
  }

  const handleEdit = (routine: SavedRoutine) => {
    setCurrentRoutine(routine)
    setView('creator')
  }

  const handleSave = (routine: SavedRoutine) => {
    addRoutine(routine)
    setView(view === 'history' ? 'history' : 'list')
  }

  const handleCancel = () => {
    setView('list')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <AnimatePresence mode="wait">
        {view === 'list' && (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: 'rgba(230,57,70,0.3)' }} />
                <Target size={18} style={{ color: '#0D1B2A' }} />
                <p className="text-base font-extrabold" style={{ color: '#0D1B2A' }}>Mi objetivo de entrenamiento</p>
              </div>
              {editable && (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleCreate}
                  className="px-4 py-2 rounded-xl font-bold text-xs text-white flex items-center gap-1 cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #22C55E, #1270B7)', boxShadow: '0 2px 10px rgba(18,112,183,0.3)' }}
                >
                  <Plus size={12} /> Crear
                </motion.button>
              )}
            </div>

            <RoutineList routines={routines} onEdit={handleEdit} onDelete={removeRoutine} />

            {routines.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.1 }}
                className="rounded-xl p-3 text-center text-xs font-medium"
                style={{ background: 'rgba(0,0,0,0.03)', color: 'rgba(0,0,0,0.4)' }}
              >
                {!editable
                  ? 'Activa el modo edición para crear rutinas de entrenamiento.'
                  : 'Aún no tienes rutinas creadas. ¡Empieza creando una!'
                }
              </motion.div>
            )}
          </motion.div>
        )}

        {view === 'history' && (
          <motion.div key="history" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: 'rgba(230,57,70,0.3)' }} />
                <History size={18} style={{ color: '#0D1B2A' }} />
                <p className="text-base font-extrabold" style={{ color: '#0D1B2A' }}>Historial</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setView('list')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
                style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.5)' }}
              >
                Volver
              </motion.button>
            </div>
            <RoutineHistory />
          </motion.div>
        )}

        {view === 'creator' && (
          <motion.div key="creator" className="space-y-4">
            <RoutineCreator student={student} routine={currentRoutine ?? undefined} onSave={handleSave} onCancel={handleCancel} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
