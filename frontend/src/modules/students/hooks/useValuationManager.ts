import { useCallback } from 'react'
import type { Student, ValuationForm, RoutineRow } from '../StudentProfileData'
import { buildAiRoutine, AI_GENERATION_STEPS, AiRoutine } from '../aiRoutine'
import { routineExercises } from '../StudentProfileData'
import { numOnly } from '../StudentProfileData'

interface UseValuationManagerDeps {
  student: Student
  valuationForm: ValuationForm
  setValuationForm: (f: ValuationForm) => void
  confirmCancel: 'valuation' | 'routine' | 'ai' | null
  setShowNewValuationModal: (v: boolean) => void
  setValuationSuccess: (v: boolean) => void
  setValuationStep: (s: number) => void
  setValuationViewMode: (v: boolean) => void
  setRoutineViewMode: (v: boolean) => void
  setRoutineFromAssessment: (v: boolean) => void
  setRoutineSnapshot: (s: string) => void
  setRoutineFromAI: (v: boolean) => void
  setAiGenerating: (v: boolean) => void
  setAiGenStep: (s: number) => void
  setAiGeneratedRoutine: (r: AiRoutine | null) => void
  setRoutineForm: (f: any) => void
  setRoutineRows: (rows: RoutineRow[]) => void
  setSelectedRoutineDay: (day: string | null) => void
  setRoutineDayPage: (p: number) => void
  setRoutineDays: (days: string[] | ((prev: string[]) => string[])) => void
  setRoutineStep: (s: number) => void
  setRoutineSuccess: (s: boolean) => void
  setShowNewRoutineModal: (v: boolean) => void
  setConfirmCancel: (c: 'valuation' | 'routine' | 'ai' | null) => void
  aiIntervalRef: React.MutableRefObject<number | null>
}

export function useValuationManager(deps: UseValuationManagerDeps) {
  const {
    student,
    valuationForm,
    setValuationForm,
    setShowNewValuationModal,
    setValuationSuccess,
    setValuationStep,
    setValuationViewMode,
    setRoutineViewMode,
    setRoutineFromAssessment,
    setRoutineSnapshot,
    setRoutineFromAI,
    setAiGenerating,
    setAiGenStep,
    setAiGeneratedRoutine,
    setRoutineForm,
    setRoutineRows,
    setSelectedRoutineDay,
    setRoutineDayPage,
    setRoutineDays,
    setRoutineStep,
    setRoutineSuccess,
    setShowNewRoutineModal,
    setConfirmCancel,
    confirmCancel,
    aiIntervalRef,
  } = deps

  const loadAssessmentIntoForm = useCallback((a: any) => {
    const metric = (label: string) => a.metrics?.find((m: any) => m.label === label)?.value ?? ''
    const form: ValuationForm = {
      nivelActividad: a.nivelActividad ?? '',
      objetivoTarjetas: a.objetivoTarjetas ?? [],
      objetivoDetalle: a.objetivoDetalle ?? '',
      peso: numOnly(metric('Peso')),
      estatura: numOnly(a.estatura),
      imc: numOnly(metric('IMC')),
      grasaCorporal: numOnly(metric('Grasa Corporal')),
      masaMuscular: numOnly(metric('Masa Muscular')),
      masaMagra: numOnly(a.masaMagra),
      grasaVisceral: numOnly(a.grasaVisceral),
      presionArterial: a.presionArterial ?? '',
      edadMetabolica: numOnly(a.edadMetabolica),
      aguaCorporal: numOnly(a.aguaCorporal),
      resistenciaMuscular: a.resistenciaMuscular ?? '',
      antecedentesSalud: a.antecedentesSalud ?? [],
      observacionesEntrenador: a.observacionesEntrenador ?? '',
      diasDisponibles: a.diasDisponibles ?? [],
      observacionesFinales: a.observacionesFinales ?? '',
    }
    setValuationForm(form)
    return form
  }, [setValuationForm])

  const cancelAiRoutine = useCallback(() => {
    if (aiIntervalRef.current !== null) {
      window.clearInterval(aiIntervalRef.current)
      aiIntervalRef.current = null
    }
    setConfirmCancel(null)
    setAiGenerating(false)
  }, [aiIntervalRef, setConfirmCancel, setAiGenerating])

  const handleConfirmCancel = useCallback(() => {
    if (deps.confirmCancel === 'ai') {
      cancelAiRoutine()
    } else if (deps.confirmCancel === 'valuation') {
      setShowNewValuationModal(false)
      setValuationSuccess(false)
      setValuationStep(1)
      setValuationViewMode(false)
    } else if (deps.confirmCancel === 'routine') {
      setShowNewRoutineModal(false)
      setRoutineStep(1)
      setRoutineForm({ name: '', description: '', duration: '', frequency: '', level: 'Intermedio' })
      setRoutineRows([])
      setSelectedRoutineDay(null)
      setRoutineDayPage(1)
      setAiGeneratedRoutine(null)
      setRoutineViewMode(false)
    }
    setConfirmCancel(null)
  }, [
    deps.confirmCancel,
    cancelAiRoutine,
    setShowNewValuationModal,
    setValuationSuccess,
    setValuationStep,
    setValuationViewMode,
    setShowNewRoutineModal,
    setRoutineStep,
    setRoutineForm,
    setRoutineRows,
    setSelectedRoutineDay,
    setRoutineDayPage,
    setAiGeneratedRoutine,
    setRoutineViewMode,
    setConfirmCancel,
  ])

  const startAiRoutine = useCallback(() => {
    setShowNewValuationModal(false)
    setValuationSuccess(false)
    setValuationViewMode(false)
    setRoutineViewMode(false)
    setRoutineFromAssessment(false)
    setRoutineSnapshot('')
    setRoutineFromAI(true)
    setAiGenerating(true)
    setAiGenStep(0)

    let step = 0
    const interval = window.setInterval(() => {
      step += 1
      if (step >= AI_GENERATION_STEPS.length) {
        window.clearInterval(interval)
        aiIntervalRef.current = null
        const routine = buildAiRoutine({
          nivelActividad: valuationForm.nivelActividad,
          objetivoTarjetas: valuationForm.objetivoTarjetas,
          objetivoDetalle: valuationForm.objetivoDetalle,
          peso: valuationForm.peso,
          estatura: valuationForm.estatura,
          imc: valuationForm.imc,
          grasaCorporal: valuationForm.grasaCorporal,
          masaMuscular: valuationForm.masaMuscular,
          presionArterial: valuationForm.presionArterial,
          resistenciaMuscular: valuationForm.resistenciaMuscular,
          antecedentesSalud: valuationForm.antecedentesSalud,
          observacionesEntrenador: valuationForm.observacionesEntrenador,
          diasDisponibles: valuationForm.diasDisponibles,
          observacionesFinales: valuationForm.observacionesFinales,
          studentName: student.firstName,
        })
        setAiGeneratedRoutine(routine)
        setRoutineForm({
          name: routine.name,
          description: routine.description,
          duration: routine.duration,
          frequency: routine.frequency,
          level: routine.level,
        })
        setRoutineRows(routine.rows)
        setSelectedRoutineDay(routine.rows.length ? routine.rows[0].dia : null)
        setRoutineDayPage(1)
        setRoutineDays([...new Set(routine.rows.map(r => r.dia))])
        setRoutineStep(1)
        setTimeout(() => {
          setAiGenerating(false)
          setShowNewRoutineModal(true)
        }, 900)
        return
      }
      setAiGenStep(step)
    }, 900)
    aiIntervalRef.current = interval
  }, [
    setShowNewValuationModal,
    setValuationSuccess,
    setValuationViewMode,
    setRoutineViewMode,
    setRoutineFromAssessment,
    setRoutineSnapshot,
    setRoutineFromAI,
    setAiGenerating,
    setAiGenStep,
    setAiGeneratedRoutine,
    setRoutineForm,
    setRoutineRows,
    setSelectedRoutineDay,
    setRoutineDayPage,
    setRoutineDays,
    setRoutineStep,
    setShowNewRoutineModal,
    aiIntervalRef,
    valuationForm,
    student.firstName,
  ])

  const openRoutineFromAssessment = useCallback((a: any) => {
    loadAssessmentIntoForm(a)
    setRoutineFromAssessment(true)
    setRoutineFromAI(false)
    const days = (a.diasDisponibles?.length ? a.diasDisponibles : ['Lunes', 'Miércoles', 'Viernes']) as string[]
    const perDay = Math.max(2, Math.ceil(routineExercises.length / days.length))
    const rows: RoutineRow[] = []
    days.forEach((dia: string, di: number) => {
      const chunk = routineExercises.slice(di * perDay, (di + 1) * perDay)
      chunk.forEach((ex, ei) => {
        rows.push({
          id: `rv-${di}-${ei}`,
          dia,
          muscle: ex.muscle,
          name: ex.name,
          sets: String(ex.sets),
          reps: ex.reps,
          rest: '60 s',
          weight: ex.weight,
        })
      })
    })
    const routineObj: AiRoutine = {
      name: a.routine ?? 'Rutina personalizada',
      description: `Rutina asociada a la valoración del estudiante: ${days.length} días por semana.`,
      duration: '8 semanas',
      frequency: `${days.length} días/semana`,
      level: 'Intermedio',
      rows,
    }
    setAiGeneratedRoutine(routineObj)
    setRoutineForm({
      name: routineObj.name,
      description: routineObj.description,
      duration: routineObj.duration,
      frequency: routineObj.frequency,
      level: routineObj.level,
    })
    setRoutineRows(rows)
    setSelectedRoutineDay(rows.length ? rows[0].dia : null)
    setRoutineDayPage(1)
    setRoutineDays(days)
    setRoutineSnapshot(
      JSON.stringify({
        form: {
          name: routineObj.name,
          description: routineObj.description,
          duration: routineObj.duration,
          frequency: routineObj.frequency,
          level: routineObj.level,
        },
        rows,
      })
    )
    setRoutineStep(2)
    setRoutineSuccess(false)
    setShowNewRoutineModal(true)
  }, [
    loadAssessmentIntoForm,
    setRoutineFromAssessment,
    setRoutineFromAI,
    setAiGeneratedRoutine,
    setRoutineForm,
    setRoutineRows,
    setSelectedRoutineDay,
    setRoutineDayPage,
    setRoutineDays,
    setRoutineSnapshot,
    setRoutineStep,
    setRoutineSuccess,
    setShowNewRoutineModal,
  ])

  return {
    numOnly,
    loadAssessmentIntoForm,
    cancelAiRoutine,
    handleConfirmCancel,
    startAiRoutine,
    openRoutineFromAssessment,
  }
}
