import { useCallback } from 'react'
import type { Student, ValuationForm } from '../../StudentProfileData'
import { AI_GENERATION_STEPS, type AiRoutine, type RoutineRow } from '../../aiRoutineTypes'
import { numOnly } from '../../StudentProfileData'
import type { FrontendExercise } from '@/services/ejercicio.service'
import type { FrontendRutina, FrontendRutinaEjercicio } from '@/services/rutina.service'
import { generarRutinaIA } from '@/services/ai.service'
import { mensajeError } from '@/lib/api'
import { getRutinaPorId } from '@/services/rutina.service'

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
  setRoutineValoracionId: (id: string) => void
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
  setShowRoutineViewModal: (v: boolean) => void
  setCurrentRoutine: (r: AiRoutine | null) => void
  aiIntervalRef: React.MutableRefObject<number | null>
  exerciseCatalog: FrontendExercise[]
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
    setRoutineValoracionId,
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
    setShowRoutineViewModal,
    setCurrentRoutine,
    aiIntervalRef,
    exerciseCatalog,
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
      setAiGenStep(Math.min(step, AI_GENERATION_STEPS.length - 1))
    }, 500)
    aiIntervalRef.current = interval

    generarRutinaIA({
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
    })
      .then((routine) => {
        if (aiIntervalRef.current !== null) {
          window.clearInterval(aiIntervalRef.current)
          aiIntervalRef.current = null
        }
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
        setAiGenStep(AI_GENERATION_STEPS.length - 1)
        setTimeout(() => {
          setAiGenerating(false)
          setShowNewRoutineModal(true)
        }, 600)
      })
      .catch((error: unknown) => {
        if (aiIntervalRef.current !== null) {
          window.clearInterval(aiIntervalRef.current)
          aiIntervalRef.current = null
        }
        setAiGenerating(false)
        setRoutineFromAI(false)
        alert(mensajeError(error))
      })
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

  const mapBackendRutinaToAiRoutine = useCallback((backend: FrontendRutina): AiRoutine => {
    const rows: RoutineRow[] = (backend.ejercicios ?? []).map((e: FrontendRutinaEjercicio, index: number) => ({
      id: e.id_ejercicio ? `${e.dia_semana}-${e.id_ejercicio}-${index}` : String(index),
      dia: e.dia_semana.charAt(0).toUpperCase() + e.dia_semana.slice(1), // lunes -> Lunes
      muscle: e.grupos_musculares[0] ?? '',
      name: e.nombre ?? '',
      sets: String(e.series ?? 3),
      reps: e.repeticiones_min !== null && e.repeticiones_max !== null
        ? `${e.repeticiones_min}-${e.repeticiones_max}`
        : String(e.repeticiones_min ?? 10),
      rest: `${e.descanso ?? 60} seg`,
      weight: '',
    }))

    return {
      name: backend.nombre,
      description: backend.observaciones ?? '',
      duration: backend.duracion ?? '8 semanas',
      frequency: rows.length ? `${new Set(rows.map(r => r.dia)).size} días/semana` : '',
      level: (backend.nivel as 'Principiante' | 'Intermedio' | 'Avanzado') ?? 'Intermedio',
      rows,
    }
  }, [])

  const openRoutineFromAssessment = useCallback(async (a: any) => {
    if (a.routine) {
      try {
        const backendRutina = await getRutinaPorId(a.routine.id)
        const aiRoutine = mapBackendRutinaToAiRoutine(backendRutina)
        setCurrentRoutine(aiRoutine)
      } catch (err) {
        console.error('Error fetching routine:', err)
      }
      setShowRoutineViewModal(true)
      return
    }
    loadAssessmentIntoForm(a)
    setRoutineFromAssessment(true)
    setRoutineValoracionId(a.id)
    setRoutineFromAI(false)
    const days = (a.diasDisponibles?.length ? a.diasDisponibles : ['Lunes', 'Miércoles', 'Viernes']) as string[]
    setRoutineDays(days)
    setRoutineStep(1)
    setRoutineViewMode(false)
    setRoutineSuccess(false)
    setShowNewRoutineModal(true)
  }, [
    loadAssessmentIntoForm,
    setRoutineFromAssessment,
    setRoutineValoracionId,
    setRoutineFromAI,
    setRoutineDays,
    setRoutineStep,
    setRoutineViewMode,
    setRoutineSuccess,
    setShowNewRoutineModal,
    setShowRoutineViewModal,
    setCurrentRoutine,
    mapBackendRutinaToAiRoutine,
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
