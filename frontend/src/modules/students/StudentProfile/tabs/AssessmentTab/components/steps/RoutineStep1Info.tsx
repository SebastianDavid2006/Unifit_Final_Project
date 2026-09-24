import { AlertTriangle } from 'lucide-react'
import type { AiRoutine } from '@/modules/students/aiRoutineTypes'

interface RoutineStep1InfoProps {
  routineForm: { name: string; description: string; duration: string; frequency: string; level: string }
  setRoutineForm: (f: any) => void
  routineViewMode: boolean
  aiGeneratedRoutine: AiRoutine | null
  routineEdited: boolean
  routineFromAssessment: boolean
  hintMensaje: string
  buttonDisabled: boolean
}

const INPUT_STYLE = {
  background: 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)',
  color: '#1A1A1E',
  border: '1px solid transparent',
} as const

const SELECT_STYLE = {
  ...INPUT_STYLE,
  appearance: 'none' as const,
} as const

export function RoutineStep1Info({
  routineForm,
  setRoutineForm,
  routineViewMode,
  aiGeneratedRoutine,
  routineEdited,
  routineFromAssessment,
  hintMensaje,
  buttonDisabled,
}: RoutineStep1InfoProps) {
  return (
    <div className="space-y-5 px-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
      <p className="text-sm font-semibold" style={{ color: 'rgba(0,0,0,0.55)' }}>
        {routineViewMode
          ? 'Información general de la rutina generada según la valoración.'
          : aiGeneratedRoutine
            ? 'Ajusta los parámetros generales de la rutina (prellenados según la valoración).'
            : 'Configura los parámetros generales de la rutina.'}
      </p>
      {!routineViewMode && buttonDisabled && (
        <div className="flex items-start gap-2 rounded-xl px-3 py-2.5 mb-3" style={{ background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.25)' }}>
          <AlertTriangle size={14} style={{ color: '#B45309', marginTop: 1 }} />
          <div>
            <p className="text-xs font-bold" style={{ color: 'rgba(146,64,14,0.9)' }}>Datos incompletos</p>
            <p className="text-[11px] leading-snug mt-0.5" style={{ color: 'rgba(146,64,14,0.75)' }}>{hintMensaje}</p>
          </div>
        </div>
      )}
      <div>
        <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.5)' }}>Nombre de la rutina <span className="text-red-500">*</span></label>
        <input
          type="text"
          readOnly={routineViewMode}
          value={routineForm.name}
          onChange={e => setRoutineForm(p => ({ ...p, name: e.target.value }))}
          placeholder="Ej. Rutina de fuerza"
          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
          style={INPUT_STYLE}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.5)' }}>Duración <span className="text-red-500">*</span></label>
          <select
            value={routineForm.duration}
            disabled={routineViewMode}
            onChange={e => setRoutineForm(p => ({ ...p, duration: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all appearance-none"
            style={SELECT_STYLE}
          >
            <option value="">Seleccionar</option>
            <option value="cuatro_semanas">4 semanas</option>
            <option value="ocho_semanas">8 semanas</option>
            <option value="doce_semanas">12 semanas</option>
            <option value="dieciseis_semanas">16 semanas</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'rgba(0,0,0,0.5)' }}>Nivel <span className="text-red-500">*</span></label>
          <select
            value={routineForm.level}
            disabled={routineViewMode}
            onChange={e => setRoutineForm(p => ({ ...p, level: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all appearance-none"
            style={SELECT_STYLE}
          >
            <option value="Principiante">Principiante</option>
            <option value="Intermedio">Intermedio</option>
            <option value="Avanzado">Avanzado</option>
          </select>
        </div>
      </div>
    </div>
  )
}