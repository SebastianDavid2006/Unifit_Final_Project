import { useState, useCallback, useMemo, useEffect } from 'react'
import type { RoutineRow } from '../../aiRoutineTypes'
import { getEjercicios, type FrontendExercise } from '@/services/ejercicio.service'
import { ROUTINE_CATEGORIES, ROUTINE_MUSCLE_TO_CAT } from '../../StudentProfileData'

const WEEK_DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const ROUTINE_DAY_PAGE_SIZE = 6

export interface UseRoutineManagerDeps {
  routineForm: { name: string; description: string; duration: string; frequency: string; level: string }
  setRoutineForm: (f: { name: string; description: string; duration: string; frequency: string; level: string }) => void
  routineRows: RoutineRow[]
  setRoutineRows: React.Dispatch<React.SetStateAction<RoutineRow[]>>
  routineDays: string[]
  setRoutineDays: React.Dispatch<React.SetStateAction<string[] | ((prev: string[]) => string[])>>
  selectedRoutineDay: string | null
  setSelectedRoutineDay: (day: string | null) => void
  viewRoutineDay: string | null
  setViewRoutineDay: (day: string | null) => void
  routineDropdown: { id: string; field: 'muscle' | 'exercise' } | null
  setRoutineDropdown: (d: { id: string; field: 'muscle' | 'exercise' } | null) => void
  routineDayPage: number
  setRoutineDayPage: (p: number) => void
  showRoutineViewModal: boolean
  setShowRoutineViewModal: (v: boolean) => void
  showNewRoutineModal: boolean
  setShowNewRoutineModal: (v: boolean) => void
  routineSuccess: boolean
  setRoutineSuccess: (s: boolean) => void
  routineStep: number
  setRoutineStep: (s: number) => void
  routineViewMode: boolean
  setRoutineViewMode: (v: boolean) => void
  routineFromAssessment: boolean
  routineSnapshot: string
  setRoutineSnapshot: (s: string) => void
  routineFromAI: boolean
  showAddDayMenu: boolean
  setShowAddDayMenu: (v: boolean) => void
  valuationDiasDisponibles: string[]
}

export function useRoutineManager(deps: UseRoutineManagerDeps) {
  const {
    routineForm,
    setRoutineForm,
    routineRows,
    setRoutineRows,
    routineDays,
    setRoutineDays,
    selectedRoutineDay,
    setSelectedRoutineDay,
    viewRoutineDay,
    setViewRoutineDay,
    routineDropdown,
    setRoutineDropdown,
    routineDayPage,
    setRoutineDayPage,
    showAddDayMenu,
    setShowAddDayMenu,
    valuationDiasDisponibles,
  } = deps

  const [exerciseCatalog, setExerciseCatalog] = useState<FrontendExercise[]>([])

  useEffect(() => {
    getEjercicios().then(setExerciseCatalog).catch(console.error)
  }, [])

  const sourceDays = valuationDiasDisponibles.length > 0 ? valuationDiasDisponibles : routineRows.map(r => r.dia)

  const routineDayList = useMemo(() => {
    if (routineDays.length) return routineDays
    const days = [...new Set(WEEK_DAYS.filter(d => sourceDays.includes(d) || routineRows.some(r => r.dia === d)))]
    return days.length ? days : WEEK_DAYS
  }, [routineDays, sourceDays, routineRows])

  const routineDayTotalPages = Math.max(1, Math.ceil(routineDayList.length / ROUTINE_DAY_PAGE_SIZE))
  const routineDayCurrentPage = Math.min(routineDayPage, routineDayTotalPages)
  const pagedRoutineDays = routineDayList.slice((routineDayCurrentPage - 1) * ROUTINE_DAY_PAGE_SIZE, routineDayCurrentPage * ROUTINE_DAY_PAGE_SIZE)
  const routineDayPageNumbers = Array.from({ length: routineDayTotalPages }, (_, i) => i + 1)

  const defaultRoutineDay = useCallback(
    () => routineDayList.find(d => routineRows.some(r => r.dia === d)) ?? routineDayList[0],
    [routineDayList, routineRows]
  )

  const updateRoutineRow = useCallback(
    (id: string, patch: Partial<RoutineRow>) =>
      setRoutineRows(prev => prev.map(r => (r.id === id ? { ...r, ...patch } : r))),
    [setRoutineRows]
  )

  const removeRoutineRow = useCallback(
    (id: string) => setRoutineRows(prev => prev.filter(r => r.id !== id)),
    [setRoutineRows]
  )

  const addRoutineRow = useCallback(
    (day?: string) => {
      const d = day || defaultRoutineDay() || 'Lunes'
      setRoutineRows(prev => [...prev, {
        id: `r-${Date.now()}`,
        dia: d,
        muscle: '',
        name: '',
        sets: '3',
        reps: '10-12',
        rest: '60 s',
        weight: '',
      }])
    },
    [defaultRoutineDay, setRoutineRows]
  )

  const addRoutineDay = useCallback(
    (day: string) => {
      setRoutineDays(d => [...d, day])
      if (!routineRows.some(r => r.dia === day)) {
        const stamp = Date.now()
        const defaults = exerciseCatalog.slice(0, 2).map((ex, ei) => ({
          id: `ad-${stamp}-${ei}`,
          dia: day,
          muscle: ex.muscleGroups[0] ?? '',
          name: ex.name,
          sets: '3',
          reps: '10-12',
          rest: '60 s',
          weight: '',
        }))
        setRoutineRows(p => [...p, ...defaults])
      }
      setSelectedRoutineDay(day)
      setShowAddDayMenu(false)
    },
    [exerciseCatalog, routineRows, setRoutineDays, setRoutineRows, setSelectedRoutineDay, setShowAddDayMenu]
  )

  const removeRoutineDay = useCallback(
    (day: string) => {
      if (routineDayList.length <= 1) return
      setRoutineDays(d => d.filter(x => x !== day))
      setRoutineRows(p => p.filter(r => r.dia !== day))
      setShowAddDayMenu(false)
    },
    [routineDayList.length, setRoutineDays, setRoutineRows, setShowAddDayMenu]
  )

  return {
    WEEK_DAYS,
    ROUTINE_CATEGORIES,
    ROUTINE_MUSCLE_TO_CAT,
    exerciseCatalog,
    sourceDays,
    routineDayList,
    routineDayTotalPages,
    routineDayCurrentPage,
    pagedRoutineDays,
    routineDayPageNumbers,
    defaultRoutineDay,
    updateRoutineRow,
    removeRoutineRow,
    addRoutineRow,
    addRoutineDay,
    removeRoutineDay,
  }
}
