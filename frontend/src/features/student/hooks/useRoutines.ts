import { useState, useCallback, useMemo } from 'react'
import { AiRoutine, buildAiRoutine } from '@/modules/students/aiRoutine'
import { AssessmentItem } from '@/modules/students/StudentProfileData'
import { buildRoutinesWithAssessments, RoutineWithAssessment } from '@/features/student/utils/routineUtils'

interface UseRoutinesReturn {
  routines: RoutineWithAssessment[]
  selectedRoutine: RoutineWithAssessment | null
  setSelectedRoutine: (routine: RoutineWithAssessment | null) => void
  generateRoutineFromAssessment: (assessment: AssessmentItem) => RoutineWithAssessment
  addRoutine: (routine: AiRoutine) => void
  removeRoutine: (routineName: string) => void
  updateProgress: (routineName: string, progress: Partial<RoutineWithAssessment['progress']>) => void
  getRoutineByName: (name: string) => RoutineWithAssessment | undefined
}

export function useRoutines(initialAssessments: AssessmentItem[] = []): UseRoutinesReturn {
  const [routines, setRoutines] = useState<RoutineWithAssessment[]>([])
  const [selectedRoutine, setSelectedRoutine] = useState<RoutineWithAssessment | null>(null)

  const routinesWithAssessments = useMemo(() => {
    if (routines.length > 0) return routines
    if (initialAssessments.length > 0) {
      return buildRoutinesWithAssessments(
        initialAssessments.map(a => ({
          name: a.routine,
          description: `Rutina generada desde valoración: ${a.type}`,
          duration: '8 semanas',
          frequency: `${a.diasDisponibles?.length || 3} días/semana`,
          level: 'Intermedio',
          rows: [],
        })),
        initialAssessments
      )
    }
    return []
  }, [routines, initialAssessments])

  const generateRoutineFromAssessment = useCallback((assessment: AssessmentItem): RoutineWithAssessment => {
    const routineInput = {
      nivelActividad: assessment.nivelActividad,
      objetivoTarjetas: assessment.objetivoTarjetas,
      objetivoDetalle: assessment.objetivoDetalle,
      peso: assessment.metrics.find(m => m.label === 'Peso')?.value || '',
      estatura: assessment.estatura,
      imc: assessment.metrics.find(m => m.label === 'IMC')?.value || '',
      grasaCorporal: assessment.metrics.find(m => m.label === 'Grasa Corporal')?.value || '',
      masaMuscular: assessment.metrics.find(m => m.label === 'Masa Muscular')?.value || '',
      presionArterial: assessment.presionArterial,
      resistenciaMuscular: assessment.resistenciaMuscular,
      antecedentesSalud: assessment.antecedentesSalud,
      observacionesEntrenador: assessment.observacionesEntrenador,
      diasDisponibles: assessment.diasDisponibles,
      observacionesFinales: assessment.observacionesFinales,
      studentName: assessment.evaluator,
    }
    const routine = buildAiRoutine(routineInput)
    return {
      routine,
      assessment,
      progress: {
        completedSessions: 0,
        totalSessions: routine.rows.length,
        lastSession: null,
        adherence: 0,
      },
    }
  }, [])

  const addRoutine = useCallback((routine: AiRoutine) => {
    const assessment = initialAssessments.find(a => a.routine === routine.name) || initialAssessments[0]
    const newRoutine: RoutineWithAssessment = {
      routine,
      assessment: assessment || initialAssessments[0],
      progress: {
        completedSessions: 0,
        totalSessions: routine.rows.length,
        lastSession: null,
        adherence: 0,
      },
    }
    setRoutines(prev => [...prev, newRoutine])
  }, [initialAssessments])

  const removeRoutine = useCallback((routineName: string) => {
    setRoutines(prev => prev.filter(r => r.routine.name !== routineName))
  }, [])

  const updateProgress = useCallback((routineName: string, progressUpdate: Partial<typeof routines[0]['progress']>) => {
    setRoutines(prev => prev.map(r =>
      r.routine.name === routineName
        ? { ...r, progress: { ...r.progress, ...progressUpdate } }
        : r
    ))
  }, [])

  const getRoutineByName = useCallback((name: string) => {
    return routinesWithAssessments.find(r => r.routine.name === name)
  }, [routinesWithAssessments])

  return {
    routines: routinesWithAssessments,
    selectedRoutine,
    setSelectedRoutine,
    generateRoutineFromAssessment,
    addRoutine,
    removeRoutine,
    updateProgress,
    getRoutineByName,
  }
}